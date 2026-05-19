import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

type Disciplina = { nome: string; peso?: string; topicos?: { texto: string }[] };
type Body = {
  horasPorDia?: number;
  diasSemana?: string[];
  dataProva?: string | null;
  observacoes?: string;
  disciplinas?: Disciplina[];
  modo?: "horas" | "blocos" | "ambos";
  disciplinasPorDia?: number;
  topicosPorDisciplina?: number;
};

const SYSTEM = `Você é um especialista em planejamento de estudos para concursos públicos brasileiros, no estilo "Ciclo de Estudos" (método consagrado de rotação por horas).

Sua missão: gerar um CICLO DE ESTUDOS otimizado, distribuindo as disciplinas conforme PESO (alta=3x, média=2x, baixa=1x), nível de dificuldade e disponibilidade do aluno.

REGRAS:
- O ciclo é uma SEQUÊNCIA de blocos de estudo (em horas) que o aluno completa em ordem e reinicia ao terminar.
- Distribua disciplinas com peso ALTA com mais frequência (mais blocos) que MÉDIA e BAIXA.
- Cada bloco deve ter entre 1h e 3h. Total do ciclo entre 20h e 50h.
- Inclua também uma sugestão de cronograma SEMANAL (segunda a domingo) com blocos diários, respeitando horas/dia disponíveis.
- Para CADA item do cronograma semanal, escolha N TÓPICOS ESPECÍFICOS daquela disciplina (extraídos LITERALMENTE da lista de tópicos do edital fornecida). Não invente tópicos; use o texto exato do edital. Não crie sub-tópicos.
- Respeite RIGOROSAMENTE: "disciplinas por dia" e "tópicos por disciplina" informados pelo usuário.
- Varie os tópicos ao longo da semana para cobrir o edital, evitando repetir o mesmo tópico em dias seguidos para a mesma disciplina.
- Sugira 1 dica estratégica curta por disciplina principal.

RETORNE APENAS JSON VÁLIDO no formato:
{
  "nome": "Ciclo XYZ",
  "totalHoras": number,
  "blocos": [{ "id": "b1", "disciplina": "Português", "horas": 2, "topicoSugerido": "..." , "cor": "#hex" }],
  "semanal": {
    "segunda": [{"disciplina":"X","horas":2,"topicos":[{"texto":"tópico EXATO do edital"}]}],
    "terca":[...], "quarta":[...], "quinta":[...], "sexta":[...], "sabado":[...], "domingo":[...]
  },
  "dicas": [{ "disciplina": "X", "dica": "..." }],
  "estrategia": "Resumo de 2-3 linhas explicando a lógica do ciclo."
}

Não inclua nenhum texto fora do JSON.`;

export const Route = createFileRoute("/api/ciclo-estudos")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const key = process.env.ANTHROPIC_API_KEY;
        if (!key) return new Response("Missing ANTHROPIC_API_KEY", { status: 500 });

        let body: Body = {};
        try { body = (await request.json()) as Body; } catch {}

        const disciplinas = (body.disciplinas || []).map((d) => ({
          nome: d.nome,
          peso: d.peso || "media",
          topicos: (d.topicos || []).slice(0, 30).map((t) => t.texto).filter(Boolean),
        }));

        if (disciplinas.length === 0) {
          return new Response(JSON.stringify({ error: "Configure seu edital antes de gerar o ciclo." }), {
            status: 400, headers: { "Content-Type": "application/json" },
          });
        }

        const userPrompt = `Gere um ciclo de estudos com base em:

Disponibilidade: ${body.horasPorDia ?? 4}h/dia, dias: ${(body.diasSemana || ["seg","ter","qua","qui","sex","sab"]).join(", ")}
Data da prova: ${body.dataProva || "não informada"}
Observações: ${body.observacoes || "nenhuma"}
Modo preferido: ${body.modo || "ambos"}
Disciplinas por dia (semanal): ${body.disciplinasPorDia ?? 3}
Tópicos por disciplina por dia: ${body.topicosPorDisciplina ?? 2}

Disciplinas do edital (com peso e tópicos EXATOS — use estes textos literalmente para preencher "topicos" no semanal):
${disciplinas.map((d, i) => `${i + 1}. ${d.nome} [peso: ${d.peso}]\n   Tópicos: ${d.topicos.join("; ") || "(sem tópicos)"}`).join("\n")}

Gere o JSON do ciclo agora.`;

        try {
          const ctrl = new AbortController();
          const timeoutId = setTimeout(() => ctrl.abort(), 175_000);
          let r: Response;
          try {
            r = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": key,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-6",
              max_tokens: 8192,
              system: SYSTEM,
              messages: [
                { role: "user", content: userPrompt },
              ],
            }),
            signal: ctrl.signal,
          });
          } finally { clearTimeout(timeoutId); }

          if (r.status === 429) {
            return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }), {
              status: 429, headers: { "Content-Type": "application/json" },
            });
          }
          if (r.status === 402) {
            return new Response(JSON.stringify({ error: "Créditos de IA esgotados no workspace." }), {
              status: 402, headers: { "Content-Type": "application/json" },
            });
          }
          if (!r.ok) {
            const t = await r.text();
            return new Response(JSON.stringify({ error: `Falha IA (${r.status}): ${t.slice(0, 500)}` }), {
              status: 502, headers: { "Content-Type": "application/json" },
            });
          }

          const data = await r.json() as { content?: { type: string; text: string }[] };
          const content = data.content?.[0]?.text || "";
          let parsed: unknown;
          try { parsed = JSON.parse(content); }
          catch {
            const m = content.match(/\{[\s\S]*\}/);
            parsed = m ? JSON.parse(m[0]) : null;
          }
          if (!parsed) {
            return new Response(JSON.stringify({ error: "Resposta da IA inválida." }), {
              status: 500, headers: { "Content-Type": "application/json" },
            });
          }
          return Response.json({ ciclo: parsed });
        } catch (e) {
          const err = e as Error;
          const isAbort = err.name === "AbortError";
          const msg = isAbort
            ? "Tempo limite excedido (a IA demorou demais). Tente reduzir disciplinas/tópicos por dia ou tente novamente."
            : `Erro ao chamar IA: ${err.message || String(e)}`;
          return new Response(JSON.stringify({ error: msg }), {
            status: isAbort ? 504 : 500, headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
