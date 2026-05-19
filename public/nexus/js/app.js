/* ════════════════════════════════════════════════════════════════
   NEXUS STUDY — APPLICATION MODULES
   Architecture: Module-based Vanilla JS (single-file)
   
   Modules:
     Data        — Constants, mock data, subject definitions
     State       — Application state & localStorage persistence
     Utils       — Pure helper functions
     Components  — Pure functions returning HTML strings
     Render      — Page-level render orchestration
     Schedule    — Cronograma-specific logic
     Flashcards  — Flashcard deck logic
     Errors      — Error noteb
/* ════════════════════════════════════════════════════════════════
   NEXUS STUDY — APPLICATION MODULES
   Architecture: Module-based Vanilla JS (single-file)
   
   Modules:
     Data        — Constants, mock data, subject definitions
     State       — Application state & localStorage persistence
     Utils       — Pure helper functions
     Components  — Pure functions returning HTML strings
     Render      — Page-level render orchestration
     Schedule    — Cronograma-specific logic
     Flashcards  — Flashcard deck logic
     Errors      — Error notebook logic
     Router      — View navigation
     Sidebar     — Sidebar expand/collapse
     Config      — Exam configuration
     App         — Bootstrap & initialization
════════════════════════════════════════════════════════════════ */

'use strict';

/* Retorna data local no formato YYYY-MM-DD sem conversão UTC */
function _heroGreet() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

function _localDateStr(d) {
  const dt = d || new Date();
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ════════════════════════════════════════════════
   DATA MODULE — Constants & Definitions
════════════════════════════════════════════════ */
const Data = (() => {

  const SUBJECTS = [
    // ── CONHECIMENTOS BÁSICOS ──
    { id: 'port',  icon: '📝', name: 'Língua Portuguesa',             color: '#2ECC71', heat: 4, weight: 8,  grupo: 'basicos',     estudou: true  },
    { id: 'legis', icon: '⚖️', name: 'Legislação Específica',        color: '#E8B84B', heat: 5, weight: 10, grupo: 'basicos',     estudou: false },
    { id: 'df',    icon: '🏙️', name: 'DF e Política p/ Mulheres',    color: '#4D9FFF', heat: 2, weight: 4,  grupo: 'basicos',     estudou: false },
    { id: 'dh',    icon: '🤝', name: 'Direitos Humanos',             color: '#A78BFA', heat: 3, weight: 6,  grupo: 'basicos',     estudou: true  },
    { id: 'crim',  icon: '🔍', name: 'Noções de Criminologia',       color: '#00CEC9', heat: 3, weight: 5,  grupo: 'basicos',     estudou: false },
    { id: 'log',   icon: '🧮', name: 'Raciocínio Lógico',            color: '#6C5CE7', heat: 4, weight: 8,  grupo: 'basicos',     estudou: true  },
    { id: 'ing',   icon: '🌐', name: 'Língua Inglesa',               color: '#74B9FF', heat: 3, weight: 5,  grupo: 'basicos',     estudou: true  },
    // ── CONHECIMENTOS ESPECÍFICOS ──
    { id: 'adm',   icon: '📊', name: 'Administração',                color: '#FD79A8', heat: 3, weight: 6,  grupo: 'especificos', estudou: false },
    { id: 'const', icon: '🏛️', name: 'Direito Constitucional',       color: '#4D9FFF', heat: 4, weight: 8,  grupo: 'especificos', estudou: true  },
    { id: 'admin', icon: '🏢', name: 'Direito Administrativo',       color: '#E8B84B', heat: 4, weight: 8,  grupo: 'especificos', estudou: true  },
    { id: 'penal', icon: '⚔️', name: 'Direito Penal',                color: '#FF4D4D', heat: 5, weight: 10, grupo: 'especificos', estudou: true  },
    { id: 'proc',  icon: '📋', name: 'Direito Processual Penal',     color: '#FF8C42', heat: 4, weight: 8,  grupo: 'especificos', estudou: true  },
    { id: 'extra', icon: '📜', name: 'Leg. Penal Extravagante',      color: '#F5CC6A', heat: 4, weight: 8,  grupo: 'especificos', estudou: true  },
    { id: 'dpm',   icon: '🎖️', name: 'Direito Penal Militar',       color: '#FF4D85', heat: 5, weight: 10, grupo: 'especificos', estudou: false },
    { id: 'dppem', icon: '⚡', name: 'D. Processual Penal Militar',  color: '#FF2D6F', heat: 5, weight: 10, grupo: 'especificos', estudou: false },
  ];

  const CURRICULUM = {
    port: [
      { t: 'Compreensão e interpretação de textos (gêneros variados)', h: 5 },
      { t: 'Reconhecimento de tipos e gêneros textuais', h: 3 },
      { t: 'Domínio da ortografia oficial', h: 3 },
      { t: 'Coesão textual — referenciação, conectores, sequenciação', h: 5 },
      { t: 'Emprego de tempos e modos verbais', h: 4 },
      { t: 'Emprego das classes de palavras (morfologia)', h: 4 },
      { t: 'Relações de coordenação e subordinação entre orações', h: 4 },
      { t: 'Emprego dos sinais de pontuação', h: 4 },
      { t: 'Concordância verbal e nominal', h: 5 },
      { t: 'Regência verbal e nominal', h: 5 },
      { t: 'Emprego do sinal indicativo de crase', h: 5 },
      { t: 'Colocação dos pronomes átonos (próclise, mesóclise, ênclise)', h: 4 },
      { t: 'Reescrita e reorganização de frases/parágrafos', h: 5 },
      { t: 'Significação das palavras — sinonímia, antonímia, polissemia', h: 4 },
    ],
    legis: [
      { t: 'Tópico específico do edital — legislação institucional', h: 5 },
      { t: 'Tópico específico do edital — organização da carreira', h: 5 },
      { t: '⚡ Decreto nº 88.777/1983 — R-200: regulamento para as PM', h: 5 },
      { t: 'Tópico específico do edital — organização administrativa', h: 5 },
      { t: 'Lei Orgânica do DF — Arts. 1º ao 30 (princípios e organização)', h: 4 },
      { t: '⚡ Lei Orgânica do DF — Arts. 87 ao 99 (segurança pública DF)', h: 5 },
      { t: 'Lei Orgânica do DF — Arts. 117-A ao 124-A', h: 4 },
      { t: 'Lei Orgânica do DF — Arts. 200 ao 203', h: 3 },
      { t: 'Lei Orgânica do DF — Arts. 263 ao 311 (disposições gerais)', h: 3 },
      { t: '⚡ Lei nº 14.751/2023 — Lei Orgânica Nacional das PM e CBM', h: 5 },
    ],
    df: [
      { t: 'Realidade étnica, social, histórica e cultural do DF', h: 3 },
      { t: 'Realidade geográfica, política e econômica do DF', h: 3 },
      { t: 'RIDE — Região Integrada de Desenvolvimento do DF e Entorno', h: 2 },
      { t: 'LC Federal nº 94/1998 (criação RIDE) + Decreto 7.469/2011', h: 2 },
      { t: 'Plano Distrital de Política para Mulheres — pontos essenciais', h: 2 },
    ],
    dh: [
      { t: 'Teoria geral dos DH — conceitos, terminologia, fundamentação', h: 4 },
      { t: 'Afirmação histórica dos Direitos Humanos (gerações)', h: 3 },
      { t: 'Direitos humanos e responsabilidade do Estado', h: 4 },
      { t: 'Direitos humanos na Constituição Federal (art. 5º e ss.)', h: 5 },
      { t: 'Política Nacional de DH; grupos vulneráveis (LGBTQIAPN+)', h: 4 },
      { t: '⚡ EC nº 45/2004 + posição do STF (supralegal vs EC) — RE 466.343', h: 5 },
      { t: '⚡ Declaração Universal dos Direitos Humanos (DUDH/1948)', h: 4 },
    ],
    crim: [
      { t: '⚡ Conceito, métodos (empirismo) e objetos da Criminologia', h: 5 },
      { t: 'Funções da criminologia — Criminologia e política criminal', h: 3 },
      { t: 'Modelos teóricos — Teorias sociológicas do crime', h: 3 },
      { t: '⚡ Prevenção primária, secundária e terciária', h: 4 },
      { t: 'Modelos de reação ao crime; controle social formal e informal', h: 3 },
      { t: 'Criminologia ambiental', h: 2 },
    ],
    log: [
      { t: 'Conjuntos numéricos, razões, proporções e porcentagens', h: 4 },
      { t: 'Equações e inequações de 1º e 2º graus; sistemas lineares', h: 4 },
      { t: '⚡ Lógica proposicional — conectivos e tabela-verdade', h: 5 },
      { t: '⚡ Equivalências lógicas e leis de De Morgan', h: 5 },
      { t: '⚡ Lógica de argumentação — inferências, deduções, conclusões', h: 5 },
      { t: '⚡ Diagramas lógicos (conjuntos e silogismos)', h: 5 },
      { t: 'Lógica de primeira ordem — quantificadores (∀, ∃)', h: 4 },
      { t: 'Princípios de contagem e probabilidade', h: 4 },
      { t: 'Progressões aritméticas e geométricas', h: 3 },
    ],
    ing: [
      { t: 'Compreensão de textos variados — ideias principais e implícitas', h: 4 },
      { t: 'Domínio do vocabulário e estrutura da língua inglesa', h: 4 },
      { t: 'Itens gramaticais relevantes para compreensão semântica', h: 3 },
      { t: 'Formas contemporâneas da linguagem inglesa', h: 3 },
    ],
    adm: [
      { t: '⚡ Abordagens clássica, burocrática e sistêmica da Administração', h: 4 },
      { t: '⚡ Evolução da Adm. Pública no Brasil pós-1930 e nova gestão pública', h: 4 },
      { t: 'Funções da Adm. — Planejamento, Organização, Direção, Controle', h: 4 },
      { t: 'Estrutura organizacional e cultura organizacional', h: 3 },
      { t: '⚡ Gestão de pessoas — motivação, liderança, desempenho', h: 4 },
      { t: '⚡ Ciclo PDCA + ferramentas de gestão da qualidade', h: 5 },
      { t: 'Modelo de Excelência Gerencial (MEG) e GesPública', h: 3 },
      { t: 'Noções de gestão de processos — mapeamento e melhoria', h: 3 },
      { t: 'Administração de recursos materiais', h: 2 },
    ],
    const: [
      { t: 'Princípios fundamentais — arts. 1º ao 4º CF', h: 4 },
      { t: '⚡ Direitos e deveres individuais e coletivos (art. 5º)', h: 5 },
      { t: '⚡ Remédios constitucionais: HC, MS, MI, HD, AP', h: 5 },
      { t: 'Direitos sociais, nacionalidade e direitos políticos', h: 4 },
      { t: 'Organização do Estado — União, Estados, DF, Municípios', h: 4 },
      { t: 'Intervenção federal e estadual; estado de defesa e de sítio', h: 4 },
      { t: '⚡ Administração pública — Militares dos estados e DF (art. 42)', h: 5 },
      { t: 'Poder Legislativo — processo legislativo e prerrogativas', h: 3 },
      { t: '⚡ Poder Judiciário — Justiça Militar da União e dos estados', h: 5 },
      { t: 'Segurança pública — Art. 144 CF', h: 5 },
      { t: '⚡ Defesa do Estado — forças armadas e forças auxiliares', h: 4 },
      { t: 'Jurisprudência dos tribunais superiores aplicada', h: 4 },
    ],
    admin: [
      { t: 'Estado, governo e administração pública — conceitos e elementos', h: 3 },
      { t: '⚡ Ato administrativo — requisitos, atributos, espécies', h: 5 },
      { t: '⚡ Extinção — cassação, anulação, revogação e convalidação', h: 5 },
      { t: '⚡ Decadência administrativa (5 anos — Lei 9.784/99)', h: 4 },
      { t: '⚡ Poderes da Adm. — hierárquico, disciplinar, regulamentar, polícia', h: 4 },
      { t: 'Uso e abuso do poder — excesso e desvio de finalidade', h: 4 },
      { t: '⚡ Princípios expressos e implícitos (LIMPE + razoabilidade)', h: 5 },
      { t: '⚡ Responsabilidade civil do Estado — objetiva, omissiva, regresso', h: 5 },
      { t: '⚡ Controle da Adm. — improbidade (Lei 8.429/92)', h: 5 },
      { t: 'Processo administrativo — Lei 9.784/1999', h: 4 },
      { t: '⚡ Licitações — Lei 14.133/2021 (Nova Lei de Licitações)', h: 4 },
    ],
    penal: [
      { t: 'Princípios aplicáveis ao Direito Penal (legalidade, anterioridade)', h: 4 },
      { t: 'Lei penal no tempo e no espaço; irretroatividade', h: 4 },
      { t: '⚡ Ilicitude — excludentes (legítima defesa, estado necessidade)', h: 5 },
      { t: '⚡ Culpabilidade — imputabilidade, potencial consciência', h: 5 },
      { t: '⚡ Concurso de pessoas — autoria e participação', h: 4 },
      { t: '⚡ Penas — espécies, cominação, substituição, aplicação', h: 5 },
      { t: 'Punibilidade, prescrição e extinção da punibilidade', h: 4 },
      { t: 'Crimes contra a fé pública', h: 4 },
      { t: '⚡ Crimes contra a Adm. Pública (peculato, corrupção, prevaricação)', h: 5 },
      { t: '⚡ Crimes contra a pessoa (homicídio doloso x culposo, lesões)', h: 5 },
      { t: 'Crimes contra o patrimônio (furto x roubo x extorsão)', h: 4 },
      { t: 'Crimes contra a dignidade sexual', h: 4 },
      { t: '⚡ Lei 13.869/2019 — Abuso de autoridade (toda a lei)', h: 5 },
      { t: 'Crimes e sanções penais na licitação (Lei 14.133/2021)', h: 3 },
      { t: 'Disposições constitucionais aplicáveis ao Direito Penal', h: 3 },
    ],
    proc: [
      { t: '⚡ Processo penal constitucional — sistemas e princípios', h: 4 },
      { t: '⚡ Inquérito policial — instauração, fases, arquivamento', h: 5 },
      { t: 'Ação penal — espécies, condições e titularidade', h: 4 },
      { t: '⚡ Prisão em flagrante — espécies, relaxamento, conversão', h: 5 },
      { t: '⚡ Prisão preventiva — fumus + periculum, hipóteses', h: 5 },
      { t: 'Medidas cautelares diversas e liberdade provisória', h: 4 },
      { t: '⚡ Prova — teoria geral, ilicitude (prova ilícita x ilegítima)', h: 5 },
      { t: 'Sujeitos do processo penal', h: 3 },
      { t: 'Prazos — características e contagem', h: 3 },
      { t: '⚡ Nulidades processuais penais', h: 4 },
      { t: 'Jurisprudência dos tribunais superiores (STF/STJ)', h: 4 },
    ],
    extra: [
      { t: 'Lei 2.889/1956 — Crime de genocídio', h: 3 },
      { t: '⚡ Lei 7.716/1989 — Crimes de preconceito de raça ou cor', h: 4 },
      { t: '⚡ Lei 8.072/1990 — Crimes hediondos (rol taxativo)', h: 5 },
      { t: '⚡ Lei 12.850/2013 — Crime organizado + colaboração premiada', h: 5 },
      { t: '⚡ Lei 9.455/1997 — Crimes de tortura', h: 5 },
      { t: 'Lei 9.605/1998 — Crimes contra o meio ambiente', h: 3 },
      { t: '⚡ Lei 10.826/2003 — Estatuto do Desarmamento', h: 5 },
      { t: '⚡ Lei 11.343/2006 — Lei de Drogas (tráfico x uso)', h: 5 },
      { t: '⚡ Lei 11.340/2006 — Lei Maria da Penha (medidas protetivas)', h: 5 },
      { t: '⚡ Lei 9.503/1997 — CTB Caps. I, II, VIII, XVII e XIX', h: 4 },
      { t: '⚡ Lei 8.069/1990 — ECA (Títulos e capítulos do edital)', h: 4 },
      { t: '⚡ Lei 8.429/1992 — Improbidade administrativa', h: 5 },
      { t: '⚡ Lei 13.869/2019 — Abuso de autoridade', h: 5 },
      { t: 'Lei 7.960/1989 — Prisão temporária e alterações', h: 4 },
      { t: 'Lei 9.099/1995 — Juizados especiais criminais', h: 4 },
      { t: 'Lei 10.259/2001 — Juizados especiais federais', h: 3 },
    ],
    dpm: [
      { t: '⚡ Aplicação da lei penal militar — tempo, espaço, pessoas', h: 5 },
      { t: '⚡ Crime militar — conceito e classificação no CPM', h: 5 },
      { t: '⚡ Crimes propriamente militares vs impropriamente militares', h: 5 },
      { t: '⚡ Imputabilidade penal militar — causas de exclusão', h: 4 },
      { t: '⚡ Concurso de agentes no CPM', h: 4 },
      { t: '⚡ Penas militares — espécies (morte, reclusão, detenção, prisão)', h: 5 },
      { t: 'Aplicação da pena; suspensão condicional; livramento condicional', h: 3 },
      { t: '⚡ Penas acessórias e efeitos da condenação', h: 4 },
      { t: 'Medidas de segurança no CPM', h: 3 },
      { t: '⚡ Extinção da punibilidade (prescrição militar)', h: 4 },
      { t: '⚡ Crimes militares em tempo de paz (catálogo do CPM)', h: 5 },
      { t: '⚡ Deserção (art. 187 CPM) e abandono de posto — prazo de 8 dias', h: 5 },
      { t: '⚡ Princípios constitucionais com reflexos na lei penal militar', h: 4 },
    ],
    dppem: [
      { t: '⚡ Processo penal militar — aplicação do CPPM', h: 5 },
      { t: '⚡ Polícia judiciária militar — competência e autoridade', h: 5 },
      { t: '⚡ Inquérito policial militar (IPM) vs IP comum — diferenças', h: 5 },
      { t: '⚡ Ação penal militar — titularidade e exercício', h: 4 },
      { t: '⚡ Justiça Militar da União — Lei 8.457/1992 (organização)', h: 5 },
      { t: '⚡ Competência da JMU — civis nos crimes militares (EC 45/2004)', h: 5 },
      { t: '⚡ Prisão em flagrante militar + prisão preventiva militar', h: 5 },
      { t: 'Liberdade provisória no processo penal militar', h: 3 },
      { t: 'Questões prejudiciais, exceções e incidentes', h: 3 },
      { t: '⚡ Atos probatórios — interrogatório, confissão, testemunhas', h: 4 },
      { t: 'Perícias, reconhecimento, acareação e documentos', h: 3 },
      { t: '⚡ Processos especiais — Deserção e Insubmissão', h: 4 },
      { t: 'Processo ordinário no CPPM', h: 3 },
      { t: '⚡ Nulidades no processo penal militar', h: 4 },
      { t: '⚡ Recursos — RSE, correição parcial, apelação, embargos', h: 4 },
      { t: 'Execução — suspensão condicional, livramento, indulto', h: 3 },
      { t: '⚡ Princípios constitucionais processuais na lei penal militar', h: 5 },
    ],
  };

  // ─── CRONOGRAMA 13 DIAS — CFO PMDF 2026 ─────────────────────────────────
  const SCHEDULE_TEMPLATE = [
    {
      phaseId: 1, label: 'FASE 1 — ATAQUE AO INÉDITO', dayStart: 1, dayEnd: 8,
      info: '🎯 Foco TOTAL nas matérias nunca estudadas. DPM + DPPEM + Leg. PMDF = as matérias únicas do CFO. Quem dominar essas 3 sai na frente de 90% dos candidatos.',
      color: '#FF4D4D',
      days: [
        { label: 'Dom 06/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_dpm', detail: '⚡ DPM — Aplicação da lei penal militar + conceito e classificação do crime militar', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_dpm', detail: '⚡ DPM — Crimes propriamente vs impropriamente militares + imputabilidade', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_dpm', detail: '⚡ DPM — Penas militares: espécies (morte, reclusão, detenção, prisão, reforma)', tag: 'new' },
          { time: '17h00–19h00', subj: 'disc_dpm', detail: '🎯 20 questões CESPE — DPM (aplicação da lei + conceito de crime militar)', tag: 'ex' },
        ]},
        { label: 'Seg 07/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_dpm', detail: '⚡ DPM — Extinção da punibilidade + crimes militares em tempo de paz (catálogo)', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_dpm', detail: '⚡ DPM — Deserção (art.187 CPM, 8 dias) + abandono de posto + insubmissão', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_dpm', detail: '🔁 DPM — Revisão geral + mapa mental: crimes militares em tempo de paz', tag: 'rev' },
          { time: '17h00–19h00', subj: 'disc_dpm', detail: '🎯 25 questões CESPE — DPM (penas + crimes em tempo de paz + prescrição)', tag: 'ex' },
        ]},
        { label: 'Ter 08/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_dppem', detail: '⚡ DPPEM — Polícia judiciária militar + IPM: instauração por portaria, prazo 20/40 dias', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_dppem', detail: '⚡ DPPEM — Ação penal militar + Justiça Militar da União (Lei 8.457/1992)', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_dppem', detail: '⚡ DPPEM — Prisões militares: flagrante + preventiva + liberdade provisória', tag: 'new' },
          { time: '17h00–19h00', subj: 'disc_dppem', detail: '🎯 20 questões CESPE — DPPEM (IPM + competência JMU + ação penal militar)', tag: 'ex' },
        ]},
        { label: 'Qua 09/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_dppem', detail: '⚡ DPPEM — Atos probatórios: interrogatório, confissão, testemunhas, perícias', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_dppem', detail: '⚡ DPPEM — Processos especiais: deserção + insubmissão; nulidades', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_dppem', detail: '⚡ DPPEM — Recursos (RSE, apelação, embargos) + execução + princípios constitucionais', tag: 'new' },
          { time: '17h00–19h00', subj: 'disc_dppem', detail: '🎯 25 questões CESPE — DPPEM (prisões militares + provas + nulidades)', tag: 'ex' },
        ]},
        { label: 'Qui 10/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_legis', detail: '⚡ LEGISLAÇÃO — Estatuto PMDF Lei 7.289/1984: hierarquia, disciplina, deveres e direitos', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_legis', detail: '⚡ LEGISLAÇÃO — Lei 12.086/2009 Título I: militares PMDF/CBMDF (situação funcional)', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_legis', detail: '⚡ LEGISLAÇÃO — Decreto 88.777/83 R-200: regulamento PM (missões, hierarquia, relação Exército)', tag: 'new' },
          { time: '17h00–19h00', subj: 'disc_legis', detail: '🎯 20 questões CESPE — Legislação PMDF (Estatuto + Lei 12.086)', tag: 'ex' },
        ]},
        { label: 'Sex 11/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_legis', detail: '⚡ LEGISLAÇÃO — Decreto 10.443/2020: Lei de Organização Básica da PMDF', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_legis', detail: '⚡ LEGISLAÇÃO — LODF arts. 87-99 (segurança pública) + arts. 117-A a 124-A', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_legis', detail: '⚡ LEGISLAÇÃO — Lei 14.751/2023 (Lei Orgânica Nacional PM/CBM) + LODF demais arts.', tag: 'new' },
          { time: '17h00–19h00', subj: 'disc_legis', detail: '🎯 25 questões CESPE — Legislação PMDF (LODF + Lei 14.751/2023)', tag: 'ex' },
        ]},
        { label: 'Sáb 12/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_extra', detail: '⚡ EXTRAVAGANTE — Lei 12.850/2013: crime organizado + colaboração premiada (pontos CESPE)', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_extra', detail: '⚡ EXTRAVAGANTE — Lei 7.716/89 (raça/cor) + Lei 2.889/56 (genocídio) + Lei 9.455/97 (tortura revendo)', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_extra', detail: '⚡ EXTRAVAGANTE — ECA Lei 8.069/90: Títulos e capítulos exigidos pelo edital', tag: 'new' },
          { time: '17h00–19h00', subj: 'disc_extra', detail: '🎯 20 questões CESPE — Crime organizado + ECA + raça/cor', tag: 'ex' },
        ]},
        { label: 'Dom 13/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_extra', detail: '⚡ EXTRAVAGANTE — CTB Lei 9.503/97: Caps. I, II, VIII (crimes de trânsito), XVII e XIX', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_extra', detail: '⚡ EXTRAVAGANTE — Juizados Especiais: Lei 9.099/95 + Lei 10.259/01 (pontos CESPE)', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_extra', detail: '🔁 EXTRAVAGANTE — Revisão consolidada: todas as leis faltantes (leis + prazos + sanções)', tag: 'rev' },
          { time: '17h00–19h00', subj: 'disc_extra', detail: '🎯 25 questões CESPE — CTB + Juizados + revisão geral extravagante', tag: 'ex' },
        ]},
      ]
    },
    {
      phaseId: 2, label: 'FASE 2 — CONSOLIDAÇÃO', dayStart: 9, dayEnd: 11,
      info: '📊 Fechar os buracos restantes do edital. Administração, Criminologia e DF são matérias menores mas cobradas. Revisão integrada de DPM + DPPEM.',
      color: '#E8B84B',
      days: [
        { label: 'Seg 14/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_adm', detail: '⚡ ADMINISTRAÇÃO — Abordagens (clássica/burocrática/sistêmica) + evolução Adm. Pública pós-1930', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_adm', detail: '⚡ ADMINISTRAÇÃO — PDCA + gestão da qualidade + liderança transacional vs transformacional', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_crim', detail: '⚡ CRIMINOLOGIA — Conceito, 4 objetos (delito/delinquente/vítima/controle social) + prevenção 1ª/2ª/3ª', tag: 'new' },
          { time: '17h00–19h00', subj: 'disc_adm', detail: '🎯 15 questões Adm + 10 questões Criminologia (foco CESPE: objetos + PDCA + liderança)', tag: 'ex' },
        ]},
        { label: 'Ter 15/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_df', detail: '⚡ DF e POL. MULHERES — Realidade histórica, geográfica, política e econômica do DF', tag: 'new' },
          { time: '10h00–12h30', subj: 'disc_df', detail: '⚡ DF e POL. MULHERES — RIDE (LC 94/98 + Dec. 7.469/11) + Plano Distrital p/ Mulheres', tag: 'new' },
          { time: '14h00–16h30', subj: 'disc_dh', detail: '🔁 DH — Revisão: EC 45/2004 + DUDH + políticas para grupos vulneráveis + RE 466.343', tag: 'rev' },
          { time: '17h00–19h00', subj: 'disc_df', detail: '🎯 15 questões DF + 15 questões DH (foco: RIDE + EC 45 + DUDH)', tag: 'ex' },
        ]},
        { label: 'Qua 16/04', blocks: [
          { time: '07h00–09h45', subj: 'disc_dpm', detail: '🔁 REVISÃO DPM — Crimes próprios vs impróprios + deserção (8 dias) + penas militares', tag: 'rev' },
          { time: '10h00–12h30', subj: 'disc_dppem', detail: '🔁 REVISÃO DPPEM — IPM vs IP: diferenças cirúrgicas + competência JMU (civis) + prisões militares', tag: 'rev' },
          { time: '14h00–16h30', subj: 'disc_dpm', detail: '🎯 30 questões CESPE — DPM + DPPEM simulado temático militar (15 cada)', tag: 'ex' },
          { time: '17h00–19h00', subj: 'disc_legis', detail: '🔁 REVISÃO LEGISLAÇÃO PMDF — Estatuto + LODF arts. 87-99 + Lei 14.751/2023', tag: 'rev' },
        ]},
      ]
    },
    {
      phaseId: 3, label: 'FASE 3 — RETA FINAL', dayStart: 12, dayEnd: 13,
      info: '🏆 Zero conteúdo novo. Simulados, caderno de erros e descanso estratégico. A prova é dia 19/04 — prepare a mente, não só o conteúdo.',
      color: '#2ECC71',
      days: [
        { label: 'Qui 17/04', blocks: [
          { time: '07h00–09h30', subj: 'disc_legis', detail: '🎯 SIMULADO BÁSICOS — 40 questões: Port. + Legislação + DH + Criminologia + RLM + Inglês', tag: 'sim' },
          { time: '10h00–12h30', subj: 'disc_penal', detail: '🎯 SIMULADO ESPECÍFICOS — 40 questões: Adm + Const + Admin + Penal + DPP + DPM + DPPEM', tag: 'sim' },
          { time: '14h00–16h30', subj: 'disc_dpm', detail: '🔁 CORREÇÃO DETALHADA — Caderno de erros do simulado (análise por disciplina)', tag: 'rev' },
          { time: '17h00–19h00', subj: 'disc_legis', detail: '🔁 Flash Review — DPM + DPPEM + Legislação PMDF (pontos mais errados)', tag: 'rev' },
        ]},
        { label: 'Sex 18/04', blocks: [
          { time: '07h00–09h00', subj: 'disc_dpm', detail: '🔁 Flash Review — DPM: crimes militares em tempo de paz + deserção + excludentes', tag: 'rev' },
          { time: '09h30–11h30', subj: 'disc_legis', detail: '🔁 Flash Review — Legislação PMDF: Estatuto + LODF arts. 87-99 + Lei 14.751/23', tag: 'rev' },
          { time: '12h00–13h30', subj: 'disc_penal', detail: '🔁 Flash Review — Pontos quentes: Penal + Extravagante + DPP (erros do simulado)', tag: 'rev' },
          { time: '14h00–15h00', subj: 'disc_penal', detail: '🏆 DESCANSO ESTRATÉGICO — Pare de estudar. Cérebro consolidando. Durma cedo. Amanhã é a prova.', tag: 'sim' },
        ]},
      ]
    },
  ];

  const FLASHCARDS_DEFAULT = [];


const ANALYSIS_PATTERNS = [];

const ANALYSIS_BY_SUBJ = [];

const ERRORS_SEED = [];

  return { SUBJECTS, CURRICULUM, SCHEDULE_TEMPLATE, FLASHCARDS_DEFAULT, ANALYSIS_PATTERNS, ANALYSIS_BY_SUBJ, ERRORS_SEED };
})();

/* ════════════════════════════════════════════════
   STATE MODULE — Persistence & State Management
════════════════════════════════════════════════ */
const State = (() => {
  const KEY = 'nexus_study_v1';

  const defaults = () => ({
    config: {
      examName:  '',
      examBoard: '',
      examDate:  '',
      totalDays: 90,
      startDate: _localDateStr(),
    },
    checkedBlocks: {},   // { "phase_day_blockIdx": true }
    topicsDone:    {},   // { "subj_topicIdx": true }
    flashcards:    Data.FLASHCARDS_DEFAULT,
    fcFilter:      'all',
    fcIndex:       0,
    errors:        Data.ERRORS_SEED,
    errFilter:     'all',
    errSort:       'date',
  });

  let _state = {};

  function load() {
    try {
      const saved = localStorage.getItem(KEY);
      _state = saved ? { ...defaults(), ...JSON.parse(saved) } : defaults();
      // ── PERSISTÊNCIA BLINDADA: nunca apagar cards criados pelo usuário ──
      const FC_BACKUP_KEY = 'nexus_flashcards_backup_v1';
      if (!Array.isArray(_state.flashcards)) _state.flashcards = [];

      // 1) Restaura backup dedicado se houver cards lá que não estão no estado
      try {
        const bak = JSON.parse(localStorage.getItem(FC_BACKUP_KEY) || '[]');
        if (Array.isArray(bak) && bak.length) {
          const ids = new Set(_state.flashcards.map(c => c.id));
          const missing = bak.filter(c => c && c.id && !ids.has(c.id));
          if (missing.length) _state.flashcards = [..._state.flashcards, ...missing];
        }
      } catch {}

      // 2) Garante que todos os cards existentes sejam tratados como do usuário
      //    (legado: cards antigos sem flag _user não podem mais ser sobrescritos)
      _state.flashcards = _state.flashcards.map(c => ({ _user: true, ...c, _user: true }));

      // 3) Sementes default só são injetadas uma única vez, sem nunca remover nada
      const FC_VER = 'nexus_fc_v80b_2026';
      const seedDone = localStorage.getItem('nexus_fc_seed') === FC_VER;
      if (!seedDone) {
        const existingIds = new Set(_state.flashcards.map(c => c.id));
        const newDefaults = (Data.FLASHCARDS_DEFAULT || []).filter(c => !existingIds.has(c.id));
        _state.flashcards = [..._state.flashcards, ...newDefaults];
        localStorage.setItem('nexus_fc_seed', FC_VER);
      }
      save();
    } catch { _state = defaults(); }

    // Migrate errors to dedicated storage key for reliability
    const ERR_KEY = 'nexus_caderno_v1';
    try {
      const dedicatedErrs = localStorage.getItem(ERR_KEY);
      if (dedicatedErrs) {
        _state.errors = JSON.parse(dedicatedErrs);
      } else if (_state.errors && _state.errors.length) {
        localStorage.setItem(ERR_KEY, JSON.stringify(_state.errors));
      }
    } catch {}
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(_state)); } catch {}
    // Backup dedicado dos flashcards — sobrevive a qualquer corrupção do estado principal
    try {
      if (Array.isArray(_state.flashcards)) {
        localStorage.setItem('nexus_flashcards_backup_v1', JSON.stringify(_state.flashcards));
      }
    } catch {}
  }

  function get(key) { return key ? _state[key] : _state; }

  function set(key, val) { _state[key] = val; save(); }

  function merge(key, val) {
    _state[key] = { ..._state[key], ...val }; save();
  }

  return { load, save, get, set, merge };
})();

/* ════════════════════════════════════════════════
   UTILS MODULE — Pure Helper Functions
════════════════════════════════════════════════ */
const Utils = (() => {

  function countdown(targetDate) {
    const now  = Date.now();
    const diff = new Date(targetDate) - now;
    if (diff <= 0) return { d:0, h:0, m:0, s:0 };
    const s = Math.floor(diff / 1000);
    return {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
    };
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function uid() { return 'id_' + Math.random().toString(36).slice(2, 9); }

  function subjectById(id) { return Data.SUBJECTS.find(s => s.id === id); }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('pt-BR');
  }

  function addDays(dateStr, n) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + n);
    return d;
  }

  function dayOfWeek(dateStr) {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[new Date(dateStr).getDay()];
  }

  function getTodayDayIndex(startDate, totalDays) {
    if (!startDate) return -1;
    const diff = Math.floor((Date.now() - new Date(startDate)) / 86400000);
    return diff >= 0 && diff < totalDays ? diff : -1;
  }

  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  return { countdown, pad, uid, subjectById, formatDate, addDays, dayOfWeek, getTodayDayIndex, clamp };
})();

/* ════════════════════════════════════════════════
   COMPONENTS MODULE — Pure HTML String Builders
════════════════════════════════════════════════ */
const Components = (() => {

  const TAG_LABELS = { new: 'NOVO', rev: 'REVISÃO', sim: 'SIMULADO', pri: 'PRIORIDADE', ex: 'EXERCÍCIOS' };

  function createTag(type) {
    return `<span class="tag tag-${type}">${TAG_LABELS[type] || type}</span>`;
  }

  function createHeatBadge(level) {
    const labels = { 5: '🔥🔥🔥', 4: '🔥🔥', 3: '🔥', 2: '✅', 1: '📘' };
    return `<span class="heat heat-${level}">${labels[level] || '—'}</span>`;
  }

  function createProgressBar(pct, color) {
    return `
      <div class="progress-track">
        <div class="progress-fill" style="width:${pct}%;--fill:${color || 'var(--gold)'}"></div>
      </div>`;
  }

  function createStatCard({ label, value, detail, icon, color }) {
    return `
      <div class="stat-card" style="--stat-color:${color || 'var(--gold)'}">
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value}</div>
        <div class="stat-detail">${detail || ''}</div>
        ${icon ? `<div class="stat-icon">${icon}</div>` : ''}
      </div>`;
  }

  function createStudyBlock({ phaseId, dayIndex, blockIndex, block, isDone }) {
    const subj = Utils.subjectById(block.subj);
    const checkId = `${phaseId}_${dayIndex}_${blockIndex}`;
    return `
      <div class="study-block ${isDone ? 'done' : ''}"
           onclick="Schedule.toggleBlock('${checkId}', this)">
        <div class="block-check"></div>
        <div class="block-info">
          <div class="block-time">${block.time}</div>
          <div class="block-title" style="color:${subj?.color || 'var(--text-primary)'}">
            ${subj?.icon || ''} ${subj?.name || block.subj}
          </div>
          <div class="block-detail">${block.detail}</div>
          <div class="block-tags">${createTag(block.tag)}</div>
        </div>
        <button class="block-edit"
                title="Editar sessão"
                onclick="Schedule.openEdit(event, '${phaseId}', '${dayIndex}', '${blockIndex}')">✎</button>
      </div>`;
  }

  function createDayCard({ phase, dayIndex, dayData, startDate, todayDayIndex }) {
    const globalDayIndex = phase.dayStart - 1 + dayIndex;
    const isToday     = globalDayIndex === todayDayIndex;
    const state       = State.get();
    const checkedBlocks = state.checkedBlocks || {};

    let doneCount = 0;
    const blocks = dayData.blocks.map((block, bi) => {
      const key = `${phase.phaseId}_${dayIndex}_${bi}`;
      const isDone = !!checkedBlocks[key];
      if (isDone) doneCount++;
      return createStudyBlock({ phaseId: phase.phaseId, dayIndex, blockIndex: bi, block, isDone });
    }).join('');

    const total = dayData.blocks.length;
    const pct   = total ? Math.round((doneCount / total) * 100) : 0;

    // Calculate date
    let dateStr = '';
    if (startDate) {
      const d = Utils.addDays(startDate, globalDayIndex);
      dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }

    const isCompleted = pct === 100;

    return `
      <div class="day-card ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''}"
           id="day-card-${phase.phaseId}-${dayIndex}">
        <div class="day-header">
          <div class="day-header-left">
            <div>
              <div class="day-number">DIA ${globalDayIndex + 1}</div>
              <div class="day-name">${dayData.label || ''}</div>
            </div>
            ${isToday ? '<span class="tag tag-pri" style="margin-left:6px">HOJE</span>' : ''}
            ${isCompleted ? '<span class="tag tag-done" style="margin-left:6px">✓ FEITO</span>' : ''}
          </div>
          <div class="day-date">${dateStr}</div>
        </div>
        <div class="day-progress">
          <div class="day-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="day-body">${blocks}</div>
      </div>`;
  }

  function createSubjectProgressCard(subj, doneTopics, totalTopics) {
    const pct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0;
    return `
      <div class="subj-prog-item" style="border-left:3px solid ${subj.color}">
        <div class="subj-prog-header">
          <div class="subj-prog-name">${subj.icon} ${subj.name}</div>
          <div class="subj-prog-pct">${doneTopics}/${totalTopics} · ${pct}%</div>
        </div>
        ${createProgressBar(pct, subj.color)}
      </div>`;
  }

  function createErrorCard(err) {
    const subj = Utils.subjectById(err.subj);
    const statusColors = { pending:'var(--red)', reviewed:'var(--yellow)', mastered:'var(--green)' };
    const statusLabels = { pending:'Pendente', reviewed:'Revisado', mastered:'Dominado' };
    const statusBg     = { pending:'rgba(255,77,77,.12)', reviewed:'rgba(240,192,48,.12)', mastered:'rgba(46,204,113,.12)' };
    const statusBorder = { pending:'rgba(255,77,77,.3)', reviewed:'rgba(240,192,48,.3)', mastered:'rgba(46,204,113,.3)' };
    const whyLabels = {
      confusao:'😵 Confundi conceitos', esqueci:'🧠 Esqueci o conteúdo',
      nunca:'📚 Nunca estudei',         armadilha:'🪤 Caí na armadilha',
      desatencao:'👀 Desatenção',       prazo:'📅 Confundi prazo/número', lei:'⚖️ Lei diferente',
    };
    const status   = err.status || 'pending';
    const color    = statusColors[status];
    const cardId   = 'errcard-' + err.id;
    const edData   = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const disc     = edData?.disciplinas?.find(d => d.id === err.subj || d.nome === err.subj);
    const discColor = disc?.cor || '#E8B84B';
    const discNome  = disc?.nome || subj?.name || err.subj || 'Geral';
    const studySubj = discNome.replace(/'/g,"&#39;");
    const studyTopic = (err.topic||'').slice(0,60).replace(/'/g,"&#39;");

    const actionsHtml = `
      <div class="errc-actions">
        ${status !== 'mastered' ? `
          <button class="errc-act-btn reviewed" onclick="Errors.updateStatus('${err.id}','reviewed')">🟡 Marcar Revisado</button>
          <button class="errc-act-btn mastered" onclick="Errors.updateStatus('${err.id}','mastered')">✅ Dominei!</button>` : `
          <button class="errc-act-btn reopen" onclick="Errors.updateStatus('${err.id}','pending')">↩ Reabrir</button>`}
        <button class="errc-act-btn study" onclick="StudyTimer.startStudy('${studySubj}','${studyTopic}')">▶ Estudar agora</button>
        <button class="errc-act-btn delete" onclick="Errors.delete('${err.id}')">🗑 Remover</button>
      </div>`;

    // ── Questões vindas do banco de questões → card completo do sistema de questões ──
    if (err._source === 'questoes' && err._qxId && typeof Questoes !== 'undefined' && Questoes.renderCardHtml) {
      const cardHtml = Questoes.renderCardHtml(err._qxId);
      if (cardHtml) {
        return `
          <div class="errc-qx-wrapper" id="${cardId}">
            <div class="errc-qx-bar">
              <div class="errc-qx-bar-meta">
                <span class="errc-qx-bar-disc" style="color:${discColor}">● ${discNome}</span>
                ${err.topic ? `<span class="errc-qx-bar-topic">${err.topic}</span>` : ''}
                <span class="errc-qx-bar-date">📅 ${err.date || '—'}</span>
              </div>
              <div class="errc-qx-bar-right">
                <div class="errc-qx-status-pill"
                  style="background:${statusBg[status]};border-color:${statusBorder[status]};color:${color}"
                  onclick="Errors.cycleStatus('${err.id}','${status}')"
                  title="Clique para avançar status">
                  <span class="errc-status-dot" style="background:${color}"></span>
                  ${statusLabels[status]}
                </div>
                <button class="errc-qx-remove" onclick="Errors.delete('${err.id}')" title="Remover do caderno">🗑</button>
              </div>
            </div>
            <div class="errc-qx-card-wrap">${cardHtml}</div>
          </div>`;
      }
    }

    // ── Erros manuais → layout clássico ──
    return `
      <div class="err-card" id="${cardId}" style="--err-c:${discColor}">
        <div class="err-card-head" onclick="Errors.toggleCard('${err.id}')">
          <div class="err-card-icon">${({confusao:'😵',esqueci:'🧠',nunca:'📚',armadilha:'🪤',desatencao:'👀',prazo:'📅',lei:'⚖️'})[err.why] || '📝'}</div>
          <div class="err-card-meta">
            <div class="err-card-subj">${discNome}${err.topic?`<span class="err-why-badge">${err.topic}</span>`:''}</div>
            <div class="err-card-topic">${err.q || 'Sem descrição'}</div>
            <div class="err-card-date">📅 ${err.date || '—'} · ${whyLabels[err.why] || err.why || ''}</div>
          </div>
          <div class="err-card-status-pill"
               style="background:${statusBg[status]};border-color:${statusBorder[status]};color:${color}"
               onclick="event.stopPropagation();Errors.cycleStatus('${err.id}','${status}')"
               title="Clique para avançar status">
            ${statusLabels[status]}
          </div>
          <div class="err-card-chevron">▾</div>
        </div>
        <div class="err-card-body">
          ${err.q ? `<div class="err-card-q">${err.q}</div>` : ''}
          ${err.rule ? `<div class="err-card-rule"><div class="err-card-rule-label">📌 Regra / Resposta Correta</div><div class="err-card-rule-text">${err.rule}</div></div>` : ''}
          ${actionsHtml}
        </div>
      </div>`;
  }

  function createAnalysisCard(pattern) {
    return `
      <div class="analysis-card" style="--acc:${pattern.color}">
        <div class="ac-title">${pattern.title}</div>
        <div class="ac-body">${pattern.body}</div>
      </div>`;
  }

  function createSubjectAnalysisCard(s) {
    return `
      <div class="card card-body">
        <div style="font-weight:800;font-size:13px;color:var(--gold-bright);margin-bottom:10px">${s.name}</div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:6px">
          ${s.tips.map(t => `
            <li style="font-size:12px;color:var(--text-muted);padding-left:12px;position:relative;line-height:1.55">
              <span style="position:absolute;left:0;color:var(--gold)">›</span>${t}
            </li>`).join('')}
        </ul>
      </div>`;
  }

  return {
    createTag, createHeatBadge, createProgressBar, createStatCard,
    createStudyBlock, createDayCard, createSubjectProgressCard,
    createErrorCard, createAnalysisCard, createSubjectAnalysisCard,
  };
})();

/* ════════════════════════════════════════════════
   RENDER MODULE — Page-level Orchestration
════════════════════════════════════════════════ */
const Render = (() => {

  /* ══ Safe HTML builder helpers (Safari-compat, no nested templates) ══ */
  function _statBox(color, value, label, sub) {
    return '<div style="background:var(--surface-3);border-radius:var(--r-sm);padding:10px;text-align:center">'
      + '<div style="font-family:var(--font-display);font-size:22px;color:'+color+'">'+value+'</div>'
      + '<div style="font-size:9px;color:var(--text-muted);margin-top:2px">'+label+'</div>'
      + '<div style="font-size:9px;color:var(--text-dim)">'+sub+'</div>'
      + '</div>';
  }
  function _cmdBtn(action, bg, border, color, label) {
    return '<button onclick="'+action+'" style="flex:1;min-width:80px;background:'+bg+';border:1px solid '+border+';color:'+color+';border-radius:var(--r-sm);padding:6px 8px;font-size:10px;font-weight:700;cursor:pointer">'+label+'</button>';
  }

  /* ══ Helper: pull real sessions stats ══ */
  function _getLiveStats() {
    try {
      const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
      const today    = _localDateStr();
      const todaySess= sessions.filter(s => s.data === today);
      const totalSecs= sessions.reduce((a,s) => a + (s.tempoSecs||0), 0);
      const todaySecs= todaySess.reduce((a,s) => a + (s.tempoSecs||0), 0);
      const totalQ   = sessions.reduce((a,s) => a + (s.acertos||0) + (s.erros||0), 0);
      const totalAc  = sessions.reduce((a,s) => a + (s.acertos||0), 0);
      const todayQ   = todaySess.reduce((a,s) => a + (s.acertos||0) + (s.erros||0), 0);
      const taxa     = totalQ ? Math.round(totalAc/totalQ*100) : null;
      const teoriaFin= sessions.filter(s => s.teoriaFin).length;
      return { totalSecs, todaySecs, totalQ, todayQ, taxa, teoriaFin, totalSessions: sessions.length };
    } catch { return { totalSecs:0, todaySecs:0, totalQ:0, todayQ:0, taxa:null, teoriaFin:0, totalSessions:0 }; }
  }

  /* ══ Helper: get live schedule stats ══ */
  function _getLiveScheduleStats() {
    try {
      // Prefer ScheduleEngine in-memory data when available
      var schedRaw = (typeof ScheduleEngine !== 'undefined' && ScheduleEngine.getData)
        ? ScheduleEngine.getData()
        : null;
      var sched = schedRaw || JSON.parse(localStorage.getItem('nexus_schedule_v1') || 'null');
      const checked = State.get('checkedBlocks') || {};
      if (!sched?.data?.fases) return { total:0, done:0, pct:0, todayTotal:0, todayDone:0 };
      let total=0, done=0, todayTotal=0, todayDone=0;
      const d = new Date();
      const todayMM = String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0');
      sched.data.fases.forEach((f,fi) => (f.dias||[]).forEach((dia,di) => {
        const isToday = dia.data && dia.data.startsWith(todayMM);
        (dia.blocos||[]).forEach((_,bi) => {
          const isDone = !!checked[fi+'_'+di+'_'+bi];
          total++; if (isDone) done++;
          if (isToday) { todayTotal++; if (isDone) todayDone++; }
        });
      }));
      return { total, done, pct: total ? Math.round(done/total*100):0, todayTotal, todayDone };
    } catch { return { total:0, done:0, pct:0, todayTotal:0, todayDone:0 }; }
  }

  /* ══ Helper: Readiness Index (0-100) ══ */
  function _getReadinessIndex(topicPct, schedPct, taxa, totalHoras) {
    // Weighted: edital 40% + schedule 25% + taxa 20% + horas 15%
    const tW  = topicPct * 0.40;
    const sW  = schedPct * 0.25;
    const qW  = (taxa !== null ? taxa : 0) * 0.20;
    const hW  = Math.min(100, (totalHoras / (7*13)) * 100) * 0.15;
    return Math.round(tW + sW + qW + hW);
  }

  function dashboard() {
    const $dyn = document.getElementById('dash-dynamic');
    if (!$dyn) return;

    const state      = State.get();
    const config     = state.config || {};
    const topicsDone = state.topicsDone || {};
    const edData     = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const sessions   = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    const liveStats  = _getLiveStats();
    const schedStats = _getLiveScheduleStats();

    // ── Core metrics ──
    const liveDiscs = edData?.disciplinas?.length ? edData.disciplinas : [];
    let totalDone=0, totalAll=0;
    liveDiscs.forEach(d => {
      const tops = d.topicos||[];
      totalAll += tops.length;
      totalDone += tops.filter((_,i) => topicsDone[d.id+'_'+i]).length;
    });
    const topicPct   = totalAll ? Math.round(totalDone/totalAll*100) : 0;
    const totalHoras = liveStats.totalSecs/3600;
    const readiness  = _getReadinessIndex(topicPct, schedStats.pct, liveStats.taxa, totalHoras);
    const rdClr      = readiness>=70?'var(--green)':readiness>=40?'var(--gold)':'var(--red)';
    const errTotal   = (state.errors||[]).length;
    const errPend    = (state.errors||[]).filter(e=>(e.status||'pending')==='pending').length;

    // ── Countdown ──
    const examDate = config.examDate || edData?.concurso?.dataProva || null;
    const examName = config.examName || edData?.concurso?.nome || 'Seu Concurso';
    const banca    = config.examBoard|| edData?.concurso?.banca || '';
    const daysLeft = examDate ? Math.max(0,Math.ceil((new Date(examDate).setHours(0,0,0,0)-new Date().setHours(0,0,0,0))/86400000)) : null;
    const maxDays  = config.totalDays || 90;
    const cdClr    = daysLeft===null?'var(--text-dim)':daysLeft<7?'var(--red)':daysLeft<21?'var(--orange)':daysLeft<60?'var(--gold)':'var(--green)';

    // Update countdown timer elements if they exist (for compatibility)
    ['cd-d','cd-h','cd-m','cd-s','dash-exam-name','dash-exam-date'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id==='dash-exam-name') el.textContent = examName;
        else if (id==='dash-exam-date') el.textContent = examDate ? examDate : '—';
      }
    });

    // ── Projeção de cobertura ──
    const diasEstudados = [...new Set(sessions.map(s=>s.data))].length;
    const diasPassados  = examDate ? Math.max(1, maxDays - (daysLeft||maxDays)) : diasEstudados||1;
    const ritmoTopicos  = diasEstudados ? totalDone/diasEstudados : 0;
    const projecaoCob   = daysLeft!==null && totalAll
      ? Math.min(100, Math.round((totalDone + ritmoTopicos*(daysLeft)) / totalAll * 100)) : topicPct;
    const projColor     = projecaoCob>=80?'var(--green)':projecaoCob>=60?'var(--gold)':'var(--orange)';
    const ritmoHoras    = diasEstudados ? totalHoras/diasEstudados : 0;
    const projecaoHoras = daysLeft!==null ? (totalHoras + ritmoHoras*daysLeft).toFixed(0) : '—';
    const metaHorasTotal= (edData?.disponibilidade?.horasPorDia||4) * (daysLeft||60);
    const hProjClr      = parseFloat(projecaoHoras)>=metaHorasTotal*0.8?'var(--green)':'var(--orange)';

    function _getDiscIcon(nome) {
      const n=(nome||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(n.includes('penal milit'))return'⚔️';if(n.includes('processual penal milit'))return'🎖️';
      if(n.includes('processual penal'))return'🔍';if(n.includes('penal'))return'⚖️';
      if(n.includes('constitucional'))return'🏛️';if(n.includes('administrativo'))return'🏢';
      if(n.includes('civil'))return'📜';if(n.includes('portugues')||n.includes('lingua port'))return'✍️';
      if(n.includes('matematica')||n.includes('raciocinio')||n.includes('logico'))return'🧮';
      if(n.includes('informatica'))return'💻';if(n.includes('direitos humanos'))return'🤝';
      if(n.includes('criminolog'))return'🔎';if(n.includes('legislacao'))return'📖';
      if(n.includes('administracao'))return'📈';if(n.includes('seguranca'))return'🛡️';
      return'📚';
    }

    // ── KPI bar HTML ──
    const kpiItems = [
      { icon:'📚', val:(()=>{const h=Math.floor(totalHoras);const m=Math.round((totalHoras-h)*60);return m>0?`${h}h${String(m).padStart(2,'0')}`:`${h}h`;})(), label:'Horas Totais', sub:`${totalDone} tópicos feitos`, color:'var(--blue)', pct:Math.min(100,Math.round(totalHoras/(metaHorasTotal||1)*100)) },
      { icon:'🎯', val:topicPct+'%', label:'Cobertura do Edital', sub:`${totalDone}/${totalAll} tópicos`, color:'var(--gold)', pct:topicPct },
      { icon:'📊', val:liveStats.taxa!==null?liveStats.taxa+'%':'—', label:'Taxa de Acertos', sub:`${liveStats.totalQ} questões`, color:liveStats.taxa!==null?liveStats.taxa>=70?'var(--green)':liveStats.taxa>=50?'var(--gold)':'var(--red)':'var(--text-dim)', pct:liveStats.taxa??0 },
      { icon:'🏆', val:readiness+'%', label:'Índice de Prontidão', sub:readiness>=70?'No caminho certo':readiness>=40?'Acelere o ritmo':'Atenção urgente', color:rdClr, pct:readiness },
    ];
    const kpiHTML = `<div class="dprem-kpi-bar">
      ${kpiItems.map(k=>`<div class="dprem-kpi">
        <div class="dprem-kpi-accent" style="background:${k.color}"></div>
        <div class="dprem-kpi-icon">${k.icon}</div>
        <div class="dprem-kpi-val" style="color:${k.color}">${k.val}</div>
        <div class="dprem-kpi-label">${k.label}</div>
        <div class="dprem-kpi-sub">${k.sub}</div>
        <div class="dprem-kpi-bar-wrap"><div class="dprem-kpi-bar-fill" style="width:${k.pct}%;background:${k.color}"></div></div>
      </div>`).join('')}
    </div>`;

    // ── Projeção card ──
    const projHTML = `<div class="dprem-projection">
      <div class="dprem-proj-inner">
        <div class="dprem-proj-col">
          <div class="dprem-proj-label">🎯 Projeção de Cobertura</div>
          <div class="dprem-proj-val" style="color:${projColor}">${projecaoCob}%</div>
          <div class="dprem-proj-sub">do edital coberto até a prova no ritmo atual<br><span style="color:var(--text-dim);font-size:10px">${ritmoTopicos.toFixed(1)} tópicos/dia</span></div>
          <div class="dprem-proj-bar"><div class="dprem-proj-bar-fill" style="width:${projecaoCob}%;background:${projColor}"></div></div>
          <div class="dprem-proj-tag" style="color:${projColor};border-color:${projColor}30;background:${projColor}08">
            ${projecaoCob>=80?'✅ Aprovação no horizonte':projecaoCob>=60?'⚡ Ritmo mínimo atingido':'⚠️ Intensifique os estudos'}
          </div>
        </div>
        <div class="dprem-proj-sep"></div>
        <div class="dprem-proj-col">
          <div class="dprem-proj-label" style="color:var(--blue)">⏱ Horas Projetadas</div>
          <div class="dprem-proj-val" style="color:${hProjClr}">${projecaoHoras}h</div>
          <div class="dprem-proj-sub">estimada até a prova<br><span style="color:var(--text-dim);font-size:10px">${ritmoHoras.toFixed(1)}h/dia · meta ${(metaHorasTotal).toFixed(0)}h</span></div>
          <div class="dprem-proj-bar"><div class="dprem-proj-bar-fill" style="width:${Math.min(100,Math.round(parseFloat(projecaoHoras)/Math.max(1,metaHorasTotal)*100))}%;background:${hProjClr}"></div></div>
          <div class="dprem-proj-tag" style="color:${hProjClr};border-color:${hProjClr}30;background:${hProjClr}08">
            ${parseFloat(projecaoHoras)>=metaHorasTotal*0.8?'✅ Meta de horas atingível':'⚡ Aumente para '+((metaHorasTotal-totalHoras)/Math.max(1,daysLeft||60)).toFixed(1)+'h/dia'}
          </div>
        </div>
        <div class="dprem-proj-sep"></div>
        <div class="dprem-proj-col">
          <div class="dprem-proj-label" style="color:${cdClr}">⏳ Countdown</div>
          <div class="dprem-proj-val" style="color:${cdClr}">${daysLeft!==null?daysLeft:'—'}</div>
          <div class="dprem-proj-sub">${daysLeft!==null?'dias para a prova':'Configure a data da prova'}<br><span style="color:var(--text-dim);font-size:10px">${examName}${banca?' · '+banca:''}</span></div>
          <div class="dprem-proj-bar"><div class="dprem-proj-bar-fill" style="width:${daysLeft!==null?Math.round((1-daysLeft/maxDays)*100):0}%;background:${cdClr}"></div></div>
          <div class="dprem-proj-tag" style="color:${cdClr};border-color:${cdClr}30;background:${cdClr}08">
            ${daysLeft===null?'📅 Adicione a data':daysLeft<7?'🔴 Semana final':daysLeft<30?'🟡 Reta final':daysLeft<60?'⚡ Intensidade':' 🟢 Fase preparatória'}
          </div>
        </div>
      </div>
    </div>`;

    // ── Disciplinas por risco (progresso completo) ──
    const discRisk = liveDiscs.map(d=>{
      const tops = d.topicos||[];
      const dn   = tops.filter((_,i)=>topicsDone[d.id+'_'+i]).length;
      const pct  = tops.length?Math.round(dn/tops.length*100):100;
      const errs = (state.errors||[]).filter(e=>e.subj===d.id||e.subj===d.nome).length;
      const pw   = d.peso==='alta'?3:d.peso==='media'?2:1;
      const risk = Math.round(((100-pct)/100)*50 + Math.min(errs*8,30) + pw*6.67);
      return { ...d, pct, dn, total:tops.length, errs, risk };
    }).sort((a,b)=>b.risk-a.risk);
    const maxRisk = discRisk[0]?.risk||1;

        // ── Session aggregation by discipline + topic ──
    const _byDisc = {};
    const _byTopic = {};
    sessions.forEach(s => {
      const discKey = s.disciplina || s.subj || '';
      if (!discKey) return;
      if (!_byDisc[discKey]) _byDisc[discKey] = { secs:0, ac:0, er:0, sess:0, topics:{} };
      _byDisc[discKey].secs += s.tempoSecs || 0;
      _byDisc[discKey].ac   += s.acertos   || 0;
      _byDisc[discKey].er   += s.erros     || 0;
      _byDisc[discKey].sess++;
      // topic breakdown
      const rawTopic = s.topico || '';
      let topicKey = rawTopic;
      try { const p = JSON.parse(rawTopic); topicKey = p.texto || rawTopic; } catch(_) {}
      topicKey = topicKey.replace(/<[^>]*>/g,'').slice(0,80).trim() || 'Geral';
      if (!_byDisc[discKey].topics[topicKey]) _byDisc[discKey].topics[topicKey] = { secs:0, ac:0, er:0, sess:0 };
      _byDisc[discKey].topics[topicKey].secs += s.tempoSecs || 0;
      _byDisc[discKey].topics[topicKey].ac   += s.acertos   || 0;
      _byDisc[discKey].topics[topicKey].er   += s.erros     || 0;
      _byDisc[discKey].topics[topicKey].sess++;
    });
    const _fmtTime = secs => {
      const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60);
      return h>0 ? h+'h'+String(m).padStart(2,'0')+'min' : m+'min';
    };
    const _taxaColor = pct => pct===null?'var(--text-dim)':pct>=80?'var(--green)':pct>=65?'#5adb8a':pct>=50?'var(--gold)':pct>=35?'var(--orange)':'var(--red)';
    const _taxaBg    = pct => pct===null?'transparent':pct>=80?'rgba(46,204,113,.18)':pct>=65?'rgba(90,219,138,.13)':pct>=50?'rgba(232,184,75,.15)':pct>=35?'rgba(255,140,66,.13)':'rgba(255,77,77,.14)';

const discProgressHTML = `<div class="dprem-card dprem-card-disc" id="dprem-disc-card">
      <div class="dprem-card-hd">
        <div class="dprem-card-title">📚 Progresso por Disciplina
          <span style="color:var(--text-primary);font-weight:700;font-size:10px;margin-left:6px">${totalDone}/${totalAll}</span>
        </div>
        <span style="font-size:10px;font-family:var(--font-mono);color:${topicPct>=70?'var(--green)':topicPct>=40?'var(--gold)':'var(--red)'};font-weight:700">${topicPct}%</span>
      </div>
      <!-- Grid container: header + linhas + rodapé no mesmo grid -->
      <div class="dpdisc-grid-wrap">
      <div class="dpdisc-table-hdr">
        <div class="dpdisc-icon-cell"></div>
        <div class="dpdisc-col-disc dpdisc-sort-hdr ${window._dpSortCol==='disc'?'sort-active':''}" onclick="Render._sortDisc('disc')" title="Ordenar por nome">Disciplina${window._dpSortCol==='disc'?(window._dpSortDir===1?' ↑':' ↓'):''}</div>
        <div class="dpdisc-col-time dpdisc-sort-hdr ${window._dpSortCol==='time'?'sort-active':''}" onclick="Render._sortDisc('time')" title="Ordenar por tempo">⏱ Tempo${window._dpSortCol==='time'?(window._dpSortDir===1?' ↑':' ↓'):''}</div>
        <div class="dpdisc-col-num dpdisc-sort-hdr ${window._dpSortCol==='ac'?'sort-active':''}" style="color:var(--green)" onclick="Render._sortDisc('ac')" title="Ordenar por acertos">✓${window._dpSortCol==='ac'?(window._dpSortDir===1?' ↑':' ↓'):''}</div>
        <div class="dpdisc-col-num dpdisc-sort-hdr ${window._dpSortCol==='er'?'sort-active':''}" style="color:var(--red)" onclick="Render._sortDisc('er')" title="Ordenar por erros">✗${window._dpSortCol==='er'?(window._dpSortDir===1?' ↑':' ↓'):''}</div>
        <div class="dpdisc-col-num dpdisc-sort-hdr ${window._dpSortCol==='tot'?'sort-active':''}" onclick="Render._sortDisc('tot')" title="Ordenar por total">Total${window._dpSortCol==='tot'?(window._dpSortDir===1?' ↑':' ↓'):''}</div>
        <div class="dpdisc-col-pct dpdisc-sort-hdr ${window._dpSortCol==='pct'?'sort-active':''}" onclick="Render._sortDisc('pct')" title="Ordenar por aproveitamento">%${window._dpSortCol==='pct'?(window._dpSortDir===1?' ↑':' ↓'):''}</div>
        <div class="dpdisc-col-prog dpdisc-sort-hdr ${window._dpSortCol==='prog'?'sort-active':''}" onclick="Render._sortDisc('prog')" title="Ordenar por progresso">Progresso${window._dpSortCol==='prog'?(window._dpSortDir===1?' ↑':' ↓'):''}</div>
      </div>
      <div class="dprem-disc-scroll-body" id="dprem-disc-rows">
        ${!discRisk.length
          ? '<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:12px">Configure seu edital para ver o progresso.</div>'
          : (()=>{
            const _sorted = [...discRisk];
            const col = window._dpSortCol||'', dir = window._dpSortDir||1;
            const _sess = _byDisc;
            if (col === 'disc')  _sorted.sort((a,b) => dir * a.nome.localeCompare(b.nome));
            else if (col === 'time') _sorted.sort((a,b) => dir * ((_sess[b.nome]?.secs||0) - (_sess[a.nome]?.secs||0)));
            else if (col === 'ac')   _sorted.sort((a,b) => dir * ((_sess[b.nome]?.ac||0)   - (_sess[a.nome]?.ac||0)));
            else if (col === 'er')   _sorted.sort((a,b) => dir * ((_sess[b.nome]?.er||0)   - (_sess[a.nome]?.er||0)));
            else if (col === 'tot')  _sorted.sort((a,b) => dir * (((_sess[b.nome]?.ac||0)+(_sess[b.nome]?.er||0)) - ((_sess[a.nome]?.ac||0)+(_sess[a.nome]?.er||0))));
            else if (col === 'pct')  _sorted.sort((a,b) => {
              const pA=(_sess[a.nome]?.ac||0)+(_sess[a.nome]?.er||0), pB=(_sess[b.nome]?.ac||0)+(_sess[b.nome]?.er||0);
              const tA=pA?Math.round((_sess[a.nome]?.ac||0)/pA*100):-1, tB=pB?Math.round((_sess[b.nome]?.ac||0)/pB*100):-1;
              return dir*(tB-tA);
            });
            else if (col === 'prog') _sorted.sort((a,b) => dir * (b.pct - a.pct));
            return _sorted;
          })().map(d => {
            const sess    = _byDisc[d.nome] || {};
            const sessAc  = sess.ac  || 0;
            const sessEr  = sess.er  || 0;
            const sessTot = sessAc + sessEr;
            const sessPct = sessTot ? Math.round((sessAc/sessTot)*100) : null;
            const sessH   = sess.secs ? _fmtTime(sess.secs) : '—';
            const tClr    = _taxaColor(sessPct);
            const tBg     = _taxaBg(sessPct);
            const rClr    = d.pct>=70?'var(--green)':d.pct>=40?'var(--gold)':'var(--red)';
            const barClr  = (typeof EditalEngine!=='undefined'?EditalEngine._discColor(d.nome,d.cor):d.cor)||'var(--gold)';
            const riskDot = d.pct<30&&d.peso==='alta'?'🔴':d.pct<50?'🟡':'';
            const hasTopics = sess.topics && Object.keys(sess.topics).length > 0;
            const discId  = 'dpdisc-' + d.nome.replace(/\s+/g,'_').slice(0,20);
            return `<div class="dpdisc-row-wrap">
              <div class="dpdisc-row ${hasTopics?'expandable':''}" onclick="${hasTopics?'Render._toggleDiscDetail(\''+discId+'\')':''}" title="${hasTopics?'Clique para ver detalhes por tópico':''}">
                <div class="dpdisc-icon-cell">
                  <div class="dpdisc-icon" style="border:2px solid ${barClr}55;box-shadow:0 0 8px ${barClr}40;background:${barClr}14">${_getDiscIcon(d.nome)}</div>
                </div>
                <div class="dpdisc-col-disc">
                  <div class="dpdisc-name-wrap">
                    <div class="dpdisc-name">${d.nome}</div>
                    <div class="dpdisc-sub">${d.dn}/${d.total} tópicos${d.errs?(' · '+d.errs+' erros'):''}${hasTopics?(' · <span style="color:var(--gold);font-size:9px">ver detalhes ▸</span>'):''}</div>
                  </div>
                </div>
                <div class="dpdisc-col-time">${sessH}</div>
                <div class="dpdisc-col-num" style="color:var(--green);font-weight:700">${sessAc||'—'}</div>
                <div class="dpdisc-col-num" style="color:var(--red);font-weight:700">${sessEr||'—'}</div>
                <div class="dpdisc-col-num">${sessTot||'—'}</div>
                <div class="dpdisc-col-pct">
                  ${sessPct!==null
                    ? '<span class="dpdisc-pct-badge" style="color:'+tClr+';background:'+tBg+'">'+sessPct+'%</span>'
                    : '<span style="color:var(--text-dim);font-size:10px">—</span>'}
                </div>
                <div class="dpdisc-col-prog">
                  <div class="dpdisc-bar-track">
                    <div class="dpdisc-bar-fill" style="width:${d.pct}%;background:${barClr}"></div>
                  </div>
                  <span class="dpdisc-pct-small" style="color:${rClr}">${d.pct}%</span>
                </div>
              </div>
              ${hasTopics ? `<div class="dpdisc-topics-panel" id="${discId}" style="display:none">
                <div class="dpdisc-topics-hdr">
                  <div></div>
                  <div class="dpdisc-col-disc">Tópico</div>
                  <div class="dpdisc-col-time">⏱</div>
                  <div class="dpdisc-col-num" style="color:var(--green)">✓</div>
                  <div class="dpdisc-col-num" style="color:var(--red)">✗</div>
                  <div class="dpdisc-col-num">Tot</div>
                  <div class="dpdisc-col-pct">%</div>
                  <div class="dpdisc-col-prog"></div>
                </div>
                ${Object.entries(sess.topics).sort((a,b)=>b[1].secs-a[1].secs).map(([tName, t]) => {
                  const tTot = t.ac + t.er;
                  const tPct = tTot ? Math.round((t.ac/tTot)*100) : null;
                  const ttC  = _taxaColor(tPct); const ttB = _taxaBg(tPct);
                  return '<div class="dpdisc-topic-row">'
                    + '<div></div>'
                    + '<div class="dpdisc-col-disc"><div class="dpdisc-name" style="font-size:11px;font-weight:500">'
                    + tName.slice(0,55) + (tName.length>55?'…':'')
                    + '</div><div class="dpdisc-sub">'+t.sess+' sess.</div></div>'
                    + '<div class="dpdisc-col-time">'+(t.secs?_fmtTime(t.secs):'—')+'</div>'
                    + '<div class="dpdisc-col-num" style="color:var(--green);font-weight:700">'+(t.ac||'—')+'</div>'
                    + '<div class="dpdisc-col-num" style="color:var(--red);font-weight:700">'+(t.er||'—')+'</div>'
                    + '<div class="dpdisc-col-num">'+(tTot||'—')+'</div>'
                    + '<div class="dpdisc-col-pct">'+(tPct!==null?'<span class="dpdisc-pct-badge" style="color:'+ttC+';background:'+ttB+'">'+tPct+'%</span>':'<span style="color:var(--text-dim)">—</span>')+'</div>'
                    + '<div class="dpdisc-col-prog"></div>'
                    + '</div>';
                }).join('')}
              </div>` : ''}
            </div>`;
          }).join('')}
      </div>
      ${discRisk.length ? (() => {
        const totSecs = Object.values(_byDisc).reduce((a,s)=>a+(s.secs||0),0);
        const totAc   = Object.values(_byDisc).reduce((a,s)=>a+(s.ac||0),0);
        const totEr   = Object.values(_byDisc).reduce((a,s)=>a+(s.er||0),0);
        const totQ    = totAc + totEr;
        const totPct  = totQ ? Math.round(totAc/totQ*100) : null;
        const avgProg = discRisk.length ? Math.round(discRisk.reduce((a,d)=>a+d.pct,0)/discRisk.length) : 0;
        const tClr    = _taxaColor(totPct); const tBg = _taxaBg(totPct);
        const pClr    = avgProg>=70?'var(--green)':avgProg>=40?'var(--gold)':'var(--red)';
        return `<div class="dpdisc-totals-row">
          <div class="dpdisc-icon-cell"></div>
          <div class="dpdisc-col-disc">
            <span class="dpdisc-totals-label">TOTAL GERAL</span>
          </div>
          <div class="dpdisc-col-time">${totSecs?_fmtTime(totSecs):'—'}</div>
          <div class="dpdisc-col-num" style="color:var(--green)">${totAc||'—'}</div>
          <div class="dpdisc-col-num" style="color:var(--red)">${totEr||'—'}</div>
          <div class="dpdisc-col-num">${totQ||'—'}</div>
          <div class="dpdisc-col-pct">
            ${totPct!==null?`<span class="dpdisc-pct-badge" style="color:${tClr};background:${tBg}">${totPct}%</span>`:'<span style="color:var(--text-dim)">—</span>'}
          </div>
          <div class="dpdisc-col-prog">
            <div class="dpdisc-bar-track">
              <div class="dpdisc-bar-fill" style="width:${avgProg}%;background:${pClr}"></div>
            </div>
            <span class="dpdisc-pct-small" style="color:${pClr}">${avgProg}%</span>
          </div>
        </div>`;
      })() : ''}
      </div><!-- /dpdisc-grid-wrap -->
    </div>`;


    // ── Heatmap de Consistência ──
    const today  = new Date();
    const cells  = [];
    const WEEKS  = 15;
    const startD = new Date(today);
    startD.setDate(today.getDate() - WEEKS*7 + 1);
    const sessMap = {};
    sessions.forEach(s=>{ if(s.data) sessMap[s.data]=(sessMap[s.data]||0)+(s.tempoSecs||0); });
    const maxSecs = Math.max(...Object.values(sessMap),1);
    for(let i=0;i<WEEKS*7;i++){
      const d=new Date(startD); d.setDate(startD.getDate()+i);
      const dk=_localDateStr(d);
      const secs=sessMap[dk]||0;
      const lvl=secs===0?0:secs<1800?1:secs<3600?2:secs<7200?3:4;
      const isToday=dk===_localDateStr(today);
      cells.push({dk,lvl,secs,isToday});
    }
    const heatColors=['rgba(255,255,255,0.04)','rgba(77,159,255,0.2)','rgba(77,159,255,0.45)','rgba(46,204,113,0.45)','rgba(46,204,113,0.8)'];
    const todayBorder='1px solid rgba(232,184,75,0.7)';
    const monthLabels=[];
    let lastMonth=-1;
    cells.filter((_,i)=>i%7===0).forEach((c,wi)=>{
      const m=new Date(c.dk).getMonth();
      const monN=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      if(m!==lastMonth){monthLabels.push({wi,label:monN[m]});lastMonth=m;}
      else monthLabels.push({wi,label:''});
    });
    const daysStudied=[...new Set(sessions.map(s=>s.data))].length;
    const streak=(()=>{let s=0;const now=new Date();for(let i=0;;i++){const d=new Date(now);d.setDate(now.getDate()-i);const dk=_localDateStr(d);if(sessMap[dk])s++;else if(i>0)break;}return s;})();

    const heatmapHTML = (()=>{
      const streakColor = streak>=14?'var(--green)':streak>=7?'var(--gold)':streak>=3?'var(--orange)':'var(--text-dim)';
      const streakLabel = streak>=14?'🏆 Em chamas!':streak>=7?'🔥 Sequência forte!':streak>=3?'⚡ Bom ritmo':streak>0?'✅ Ativo':'—';
      return `<div class="dprem-card dprem-heatmap-card">
        <div class="dprem-card-hd" style="padding-bottom:10px">
          <div style="display:flex;flex-direction:column;gap:3px">
            <div class="dprem-card-title">🗓 Consistência de Estudo</div>
            <div style="font-size:10px;color:var(--text-dim)">${daysStudied} dias ativos no período</div>
          </div>
          <div style="display:flex;align-items:center;gap:16px;margin-left:auto">
            <div style="text-align:center">
              <div style="font-family:var(--font-display);font-size:28px;line-height:1;color:${streakColor}">${streak}</div>
              <div style="font-size:8px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim)">dias seguidos</div>
              <div style="font-size:9px;color:${streakColor};margin-top:2px">${streakLabel}</div>
            </div>
            <div style="width:1px;height:40px;background:var(--border-subtle)"></div>
            <div style="text-align:center">
              <div style="font-family:var(--font-display);font-size:28px;line-height:1;color:var(--blue)">${daysStudied}</div>
              <div style="font-size:8px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim)">dias ativos</div>
            </div>
          </div>
        </div>
        <div style="padding:0 16px 14px">
          <div style="display:flex;gap:2px;margin-bottom:4px">
            ${monthLabels.map(m=>`<div style="flex:7;font-size:8px;color:var(--text-dim);letter-spacing:.05em">${m.label}</div>`).join('')}
          </div>
          <div style="display:grid;grid-template-columns:repeat(${WEEKS},1fr);gap:3px">
            ${Array.from({length:WEEKS},(_,wi)=>
              `<div style="display:flex;flex-direction:column;gap:3px">
                ${cells.slice(wi*7,(wi+1)*7).map(cell=>`
                  <div title="${cell.dk}${cell.secs?' · '+Math.round(cell.secs/60)+'min':''}"
                       style="width:100%;aspect-ratio:1;border-radius:3px;background:${heatColors[cell.lvl]};
                              ${cell.isToday?'box-shadow:0 0 0 1.5px var(--gold);':''}
                              cursor:default;transition:transform .08s,opacity .08s"
                       onmouseover="this.style.transform='scale(1.35)';this.style.opacity='.9'"
                       onmouseout="this.style.transform='scale(1)';this.style.opacity='1'">
                  </div>`).join('')}
              </div>`).join('')}
          </div>
          <div style="display:flex;align-items:center;gap:5px;margin-top:10px">
            <span style="font-size:9px;color:var(--text-dim)">Menos</span>
            ${heatColors.map(clr=>`<div style="width:10px;height:10px;border-radius:2px;background:${clr}"></div>`).join('')}
            <span style="font-size:9px;color:var(--text-dim)">Mais</span>
            <span style="font-size:9px;color:var(--text-dim);margin-left:auto;font-family:var(--font-mono)">1 célula = 1 dia de estudo</span>
          </div>
        </div>
      </div>`;
    })();


    // ── Conquistas ──
    const trophies = [
      { icon:'🔥', name:'Ignição', cond:'Primeiro dia de estudo', done: daysStudied>=1 },
      { icon:'📚', name:'Explorador', cond:'10 tópicos feitos', done: totalDone>=10 },
      { icon:'⚡', name:'Consistente', cond:'7 dias seguidos', done: streak>=7 },
      { icon:'🎯', name:'Certeiro', cond:'70%+ de acertos', done: (liveStats.taxa||0)>=70 },
      { icon:'🏛️', name:'Mestre', cond:'50% do edital coberto', done: topicPct>=50 },
      { icon:'💪', name:'Maratonista', cond:'100h estudadas', done: totalHoras>=100 },
      { icon:'🧠', name:'Dominador', cond:'80% do edital coberto', done: topicPct>=80 },
      { icon:'🏆', name:'Elite', cond:'Prontidão 70%+', done: readiness>=70 },
    ];
        // Conquistas removido — não agrega valor operacional
    const conquHTML = '';

    // ── Coach message ──
    const coachMsgs=[];
    if(readiness<30) coachMsgs.push(`🔴 Situação crítica — ${daysLeft||'poucos'} dias restantes. Priorize os tópicos de maior peso agora.`);
    else if(readiness<60) coachMsgs.push(`🟡 Ritmo razoável — foque nos tópicos críticos e aumente as questões diárias.`);
    else coachMsgs.push(`🟢 Ótimo progresso — mantenha a consistência. Reta final: simulados e caderno de erros.`);
    if(projecaoCob<70) coachMsgs.push(`⚡ Projeção em ${projecaoCob}% — aumente para ${(ritmoTopicos*1.5).toFixed(1)} tópicos/dia para cobrir mais.`);
    if(liveStats.taxa!==null&&liveStats.taxa<50) coachMsgs.push(`📊 Taxa de acertos em ${liveStats.taxa}% — revise os tópicos com mais erros.`);

    const _coachDismissed = sessionStorage.getItem('nexus_coach_dismissed');
    const coachHTML = _coachDismissed ? '' : `<div id="dash-coach-banner" style="background:linear-gradient(135deg,rgba(232,184,75,0.06),rgba(77,159,255,0.04));border:1px solid rgba(232,184,75,0.15);border-radius:var(--r-lg);padding:14px 18px;margin-bottom:14px;display:flex;gap:12px;align-items:flex-start;position:relative">
      <div style="font-size:22px;flex-shrink:0">🧠</div>
      <div style="flex:1">
        <div style="font-size:9px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-dim);margin-bottom:6px">ANÁLISE DO SISTEMA</div>
        ${coachMsgs.map(m=>`<div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;line-height:1.5">${m}</div>`).join('')}
      </div>
      <button onclick="sessionStorage.setItem('nexus_coach_dismissed','1');document.getElementById('dash-coach-banner').style.display='none'"
              style="position:absolute;top:10px;right:12px;background:none;border:none;cursor:pointer;font-size:14px;color:var(--text-dim);line-height:1;padding:2px 4px;border-radius:4px;transition:color .15s"
              onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-dim)'"
              title="Fechar">✕</button>
    </div>`;

    // ── Consistency Strip — between proj and main rows ──
    const _buildConsistencyStrip = () => {
      // Show the last 30 days (or from startDate if < 30 days ago)
      const startDateCfg = config.startDate || edData?.concurso?.dataProva
        ? null : null; // use rolling 30 days
      const STRIP_DAYS = 30;
      const todayD = new Date();
      const todayStr = _localDateStr(todayD);
      const days = [];
      for (let i = STRIP_DAYS - 1; i >= 0; i--) {
        const d = new Date(todayD);
        d.setDate(todayD.getDate() - i);
        const dk = _localDateStr(d);
        const dayN = d.getDate();
        const mon  = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][d.getMonth()];
        const dow  = ['D','S','T','Q','Q','S','S'][d.getDay()];
        const isFuture = dk > todayStr;
        const hasStudy = !!sessMap[dk];
        const secs   = sessMap[dk] || 0;
        const mins   = Math.round(secs / 60);
        const isToday = dk === todayStr;
        days.push({ dk, dayN, mon, dow, isFuture, hasStudy, mins, isToday });
      }

      const totalStudied = days.filter(d => d.hasStudy && !d.isFuture).length;
      const totalPast    = days.filter(d => !d.isFuture).length;
      const studyPct     = totalPast ? Math.round((totalStudied / totalPast) * 100) : 0;
      const streakColor  = streak >= 14 ? 'var(--green)' : streak >= 7 ? 'var(--gold)' : streak >= 3 ? 'var(--orange)' : 'var(--red)';

      // Left side: streak pill
      const streakPill = `<div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
        <div style="text-align:center;min-width:50px">
          <div style="font-family:var(--font-display);font-size:28px;line-height:1;color:${streakColor}">${streak}</div>
          <div style="font-size:8px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim);margin-top:1px">dias</div>
        </div>
        <div style="width:1px;height:36px;background:var(--border-default)"></div>
      </div>`;

      // Right: consistency %
      const pctPill = `<div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
        <div style="width:1px;height:36px;background:var(--border-default)"></div>
        <div style="text-align:center;min-width:60px">
          <div style="font-family:var(--font-display);font-size:22px;line-height:1;color:${studyPct>=70?'var(--green)':studyPct>=40?'var(--gold)':'var(--red)'}">${studyPct}%</div>
          <div style="font-size:8px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim);margin-top:1px">consistência</div>
        </div>
      </div>`;

      // Day cells
      const cellsHTML = days.map(day => {
        let icon, bgColor, borderColor, textColor, glowCSS = '';
        if (day.isFuture) {
          icon = '·';
          bgColor = 'rgba(255,255,255,.04)';
          borderColor = 'rgba(255,255,255,.06)';
          textColor = 'var(--text-dim)';
        } else if (day.hasStudy) {
          icon = '✓';
          bgColor = day.isToday
            ? 'rgba(46,204,113,.25)'
            : 'rgba(46,204,113,.14)';
          borderColor = day.isToday
            ? 'rgba(46,204,113,.7)'
            : 'rgba(46,204,113,.35)';
          textColor = 'var(--green)';
          glowCSS = day.isToday
            ? 'box-shadow:0 0 0 2px rgba(46,204,113,.35),0 0 12px rgba(46,204,113,.2);'
            : '';
        } else {
          // Not studied — past day
          icon = '✕';
          bgColor = day.isToday
            ? 'rgba(232,184,75,.12)'
            : 'rgba(255,77,77,.08)';
          borderColor = day.isToday
            ? 'rgba(232,184,75,.5)'
            : 'rgba(255,77,77,.25)';
          textColor = day.isToday ? 'var(--gold)' : 'rgba(255,100,100,.65)';
          glowCSS = day.isToday
            ? 'box-shadow:0 0 0 2px rgba(232,184,75,.3),0 0 10px rgba(232,184,75,.15);'
            : '';
        }

        const tooltip = day.hasStudy
          ? day.dk + ' · ' + day.mins + 'min estudados'
          : day.isFuture ? day.dk : day.dk + ' · sem estudo';

        return `<div class="cons-day-cell" title="${tooltip}"
          style="background:${bgColor};border:1px solid ${borderColor};${glowCSS}">
          <div class="cons-day-icon" style="color:${textColor}">${icon}</div>
          <div class="cons-day-label">${day.dayN}</div>
          <div class="cons-day-dow">${day.dow}</div>
        </div>`;
      }).join('');

      return `<div class="cons-strip-card">
        <div class="cons-strip-header">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px">🔥</span>
            <div>
              <div style="font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim)">CONSTÂNCIA NOS ESTUDOS</div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:1px">Últimos 30 dias · ${totalStudied} dias com estudo</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div class="cons-legend-item">
              <div class="cons-legend-dot" style="background:rgba(46,204,113,.5);border:1px solid rgba(46,204,113,.5)"></div>
              <span>Estudou</span>
            </div>
            <div class="cons-legend-item">
              <div class="cons-legend-dot" style="background:rgba(255,77,77,.15);border:1px solid rgba(255,77,77,.3)"></div>
              <span>Sem registro</span>
            </div>
          </div>
        </div>
        <div class="cons-strip-body">
          ${streakPill}
          <div class="cons-cells-wrap">${cellsHTML}</div>
          ${pctPill}
        </div>
      </div>`;
    };
    const consistencyStripHTML = _buildConsistencyStrip();

    // ── Dashboard Hero ──
    const _heroNow = new Date();
    const _heroDay = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][_heroNow.getDay()];
    const _heroMon = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][_heroNow.getMonth()];
    const _heroDateStr = `${_heroDay}, ${_heroNow.getDate()} de ${_heroMon}`;
    const _heroProva  = daysLeft !== null
      ? (daysLeft === 0 ? `🎯 Prova hoje!` : `🗓 ${daysLeft} dias para a prova`)
      : null;
    const _heroGreet  = _heroNow.getHours() < 12 ? 'Bom dia' : _heroNow.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
    const _heroSub    = readiness >= 70
      ? 'Você está no caminho certo. Mantenha a consistência e chegue forte na reta final.'
      : readiness >= 40
      ? 'Ritmo em construção. Cada sessão de estudo é um passo a mais na sua aprovação.'
      : 'Toda jornada começa com o primeiro passo. Hoje é o melhor dia para estudar.';

    const dashHeroHTML = `<div class="dash-hero">
      <div class="dash-hero-left">
        <div class="cad-hero-eyebrow">CENTRAL DE ESTUDOS · DASHBOARD</div>
        <h1 class="dash-hero-title">${_heroGreet}, Candidato.</h1>
        <div class="cad-hero-sub">${_heroSub}</div>
      </div>
      <div class="dash-hero-right">
        <div class="dash-hero-date">${_heroDateStr}</div>
        ${_heroProva ? `<div class="dash-hero-prova">${_heroProva}</div>` : ''}
      </div>
    </div>`;

    // ── Assemble — Dashboard v2 ──
    $dyn.innerHTML =
      dashHeroHTML +
      coachHTML +
      kpiHTML +
      projHTML +
      consistencyStripHTML +
      `<div class="dprem-main-grid">
        <div class="dprem-main-left">${discProgressHTML}</div>
        <div class="dprem-main-right">
          <div class="dprem-card" id="dash-metas-card"></div>
          <div class="dprem-right-bottom">
            <div class="dprem-card" id="dash-weekly-card"></div>
            <div class="dprem-card" id="dash-pizza-card"></div>
          </div>
        </div>
      </div>`;


    // ── Static sections: consistency + history ──
    const $static2 = document.getElementById('dash-static-sections');
    if ($static2) {
      if (!$static2.dataset.built) {
        $static2.dataset.built = '1';
        $static2.innerHTML = `<div id="dash-bottom-row" class="dash-bottom-row">
          <div id="dash-heatmap-card" class="dprem-card dash-consistency-card"></div>
          <div id="dash-history-card" class="dprem-card dash-history-card"></div>
        </div>`;
      }
      _renderConsistencyCard();
      _renderHistoryCard();
    }
    // Render metas + weekly chart cards
    _renderMetasCard();
    _renderWeeklyChartCard();
    _renderPizzaCard();
    // Match history card height to discipline card
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        const $disc = document.getElementById('dprem-disc-card');
        const $hist = document.getElementById('dash-history-card');
        if ($disc && $hist) {
          $hist.style.height = $disc.offsetHeight + 'px';
        }
      });
    });
    // CTA edital
    if (typeof EditalEngine !== 'undefined') EditalEngine.renderDashboardCTA();

  }


  function schedule() {
    // Delegate entirely to ScheduleEngine
    ScheduleEngine.init();
  }

  function renderCronograma(data) {
    ScheduleEngine.renderCronograma(data);
  }

  function curriculum() {
    EditalEngine.render();
  }

  function flashcards() {
    const state  = State.get();
    // Merge cronograma cards (nexus_flash_cronograma_v1) into main deck
    let cronCards = [];
    try { cronCards = JSON.parse(localStorage.getItem('nexus_flash_cronograma_v1') || '[]'); } catch(_e) {}
    // Normalize cronograma cards to use subj field
    const cronNorm = cronCards.map(c => ({ ...c, subj: c.subj || c.materia || 'Geral', _fromCron: true }));
    const baseCards = state.flashcards || [];
    // Deduplicate by id
    const baseIds = new Set(baseCards.map(c => c.id));
    const merged = [...baseCards, ...cronNorm.filter(c => !baseIds.has(c.id))];
    const cards  = merged;
    const filter = state.fcFilter || 'all';
    const topic  = state.fcTopic  || 'all';

    // Build discipline filter chips
    const $filters = document.getElementById('fc-filters');
    if ($filters) {
      const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      const discs  = edData?.disciplinas?.length ? edData.disciplinas : null;

      const _fcColorMap = (typeof CicloEstudos !== 'undefined' && CicloEstudos.getColorMap) ? CicloEstudos.getColorMap() : {};
      const _fcDiscColor = (nome, corFallback) => {
        if (_fcColorMap[nome]) return _fcColorMap[nome];
        return corFallback || '#E8B84B';
      };

      const subjects = discs
        ? [{ id: 'all', label: 'Todos', count: cards.length, color: null },
           ...discs.map(d => ({ id: d.id, label: d.nome, count: cards.filter(c => c.subj === d.id || c.subj === d.nome).length, color: _fcDiscColor(d.nome, d.cor) }))]
        : [{ id: 'all', label: 'Todos', count: cards.length, color: null },
           ...Data.SUBJECTS.map(s => ({ id: s.id, label: s.name, count: cards.filter(c => c.subj === s.id).length, color: null }))];

      $filters.innerHTML = subjects.map(f => {
        const active = filter === f.id;
        const col = f.color;
        const dotHtml = col ? `<span style="width:7px;height:7px;border-radius:50%;background:${col};display:inline-block;flex-shrink:0"></span>` : '';
        const activeStyle = active && col
          ? `border-color:${col};color:${col};background:${col}18`
          : active ? '' : '';
        return `<button class="filter-chip ${active ? 'active' : ''}"
                style="${activeStyle}"
                onclick="Flashcards.filter('${f.id}')">
          ${dotHtml}
          <span style="${active && col ? `color:${col}` : ''}">${f.label}</span>
          <span style="opacity:.45;font-size:10px;font-family:'IBM Plex Mono'">${f.count}</span>
        </button>`;
      }).join('');
    }

    // Sidebar tópicos — show when discipline selected
    const $sidebar   = document.getElementById('fc-topics-sidebar');
    const $sideTopics= document.getElementById('fc-sidebar-topics');
    const $sideHd    = document.getElementById('fc-sidebar-hd');

    if ($sidebar && $sideTopics) {
      if (filter === 'all') {
        $sidebar.classList.remove('visible');
      } else {
        const edData2 = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
        const disc    = edData2?.disciplinas?.find(d => d.id === filter || d.nome === filter);
        const topics  = disc?.topicos || [];

        if (topics.length > 0) {
          $sidebar.classList.add('visible');
          if ($sideHd) $sideHd.textContent = disc.nome;

          const allCount = cards.filter(c => c.subj === filter).length;
          $sideTopics.innerHTML =
            `<button class="fc-topic-btn ${topic === 'all' ? 'active' : ''}"
                     onclick="Flashcards.filterTopic('all')">
               <div class="fc-topic-dot"></div>
               <span class="fc-topic-name">Todos os cards</span>
               <span class="fc-topic-count">${allCount}</span>
             </button>` +
            topics.map((t, i) => {
              const tname = t.texto.replace(/^⚡\s*/, '');
              const tcount = cards.filter(c => c.subj === filter && (c.topic || '').toLowerCase().includes(tname.slice(0,15).toLowerCase())).length;
              return `<button class="fc-topic-btn ${topic === String(i) ? 'active' : ''}"
                               onclick="Flashcards.filterTopic('${i}','${tname.replace(/'/g,"&#39;").slice(0,50)}')">
                         <div class="fc-topic-dot"></div>
                         <span class="fc-topic-name">${tname.slice(0,55)}${tname.length>55?'…':''}</span>
                         <span class="fc-topic-count">${tcount}</span>
                       </button>`;
            }).join('');
        } else {
          $sidebar.classList.remove('visible');
        }
      }
    }

    // Visible cards (apply topic filter too)
    let visible = filter === 'all' ? cards : cards.filter(c => c.subj === filter);
    if (topic !== 'all') {
      const topicText = state.fcTopicText || '';
      visible = visible.filter(c => (c.topic || '').toLowerCase().includes(topicText.toLowerCase()));
    }
    if (Flashcards._fcMode === 'due') {
      const today = _localDateStr();
      visible = visible.filter(c => !c.nextReview || c.nextReview <= today);
    }

    // Apply diff (rating) filter
    const diff = state.fcDiffFilter || 'all';
    // Compute per-rating counts (from pool before diff filter) and update button labels
    const ratingCounts = { again: 0, hard: 0, medium: 0, easy: 0 };
    visible.forEach(c => { if (c.lastRating && ratingCounts[c.lastRating] !== undefined) ratingCounts[c.lastRating]++; });
    document.querySelectorAll('#fc-diff-filter .fc-dff-btn[data-diff]').forEach(b => {
      const d = b.dataset.diff;
      b.classList.toggle('active', d === diff);
      if (d !== 'all') {
        const n = ratingCounts[d] || 0;
        b.dataset.fcCount = n;
        let badge = b.querySelector('.fc-dff-count');
        if (!badge) { badge = document.createElement('span'); badge.className = 'fc-dff-count'; b.appendChild(badge); }
        badge.textContent = n;
        badge.style.display = n > 0 ? '' : 'none';
      }
    });
    if (diff !== 'all') visible = visible.filter(c => c.lastRating === diff);

    // Update badge
    const $badge = document.getElementById('fc-count-badge');
    if ($badge) $badge.textContent = `${cards.length} CARDS`;

    // Populate subject select for new cards
    const $sel = document.getElementById('fc-new-subj');
    if ($sel) {
      const edData3 = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      if (!$sel.options.length) {
        if (edData3?.disciplinas?.length) {
          $sel.innerHTML = edData3.disciplinas.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');
        } else {
          $sel.innerHTML = Data.SUBJECTS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
        }
      }
    }

    if (typeof Flashcards.renderStats === 'function') Flashcards.renderStats(cards);
    Flashcards.renderCurrent(visible);
  }

  function errors() {
    const state  = State.get();
    const errs   = (typeof Errors !== 'undefined' && Errors._getErrors) ? Errors._getErrors() : (state.errors || []);
    const filter = state.errFilter || 'all';
    const sort   = state.errSort   || 'date';

    // Stats
    const pending  = errs.filter(e => (e.status||'pending')==='pending').length;
    const reviewed = errs.filter(e => e.status==='reviewed').length;
    const mastered = errs.filter(e => e.status==='mastered').length;
    const total    = errs.length;
    const taxa     = total ? Math.round(mastered / total * 100) : 0;
    const $stats = document.getElementById('err-stats');
    if ($stats) $stats.innerHTML = [
      { v: total,    l: 'Total',          sub: 'erros mapeados',     c: 'var(--gold)',   pct: 100,                                                  ico: '📚' },
      { v: pending,  l: 'Pendentes',      sub: 'aguardando revisão', c: 'var(--red)',    pct: total ? Math.round(pending /total*100) : 0,           ico: '🔴' },
      { v: reviewed, l: 'Em Revisão',     sub: 'em consolidação',    c: 'var(--yellow)', pct: total ? Math.round(reviewed/total*100) : 0,           ico: '🟡' },
      { v: mastered, l: 'Dominados',      sub: `${taxa}% de domínio`,c: 'var(--green)',  pct: taxa,                                                  ico: '✅' },
    ].map(s => `
      <div class="cad-stat" style="--stat-c:${s.c}">
        <div class="cad-stat-top">
          <span class="cad-stat-ico">${s.ico}</span>
          <span class="cad-stat-lbl">${s.l}</span>
        </div>
        <div class="cad-stat-val">${s.v}</div>
        <div class="cad-stat-sub">${s.sub}</div>
        <div class="cad-stat-bar"><div class="cad-stat-fill" style="width:${s.pct}%"></div></div>
      </div>`).join('');

    // Repechage banner
    const $rep = document.getElementById('err-repechage');
    const $repTitle = document.getElementById('err-repechage-title');
    if ($rep) {
      $rep.style.display = pending >= 5 ? 'flex' : 'none';
      if ($repTitle) $repTitle.textContent = `${pending} erros pendentes acumulados!`;
    }

    // Filters
    const $filters = document.getElementById('err-filters');
    if ($filters) {
      $filters.innerHTML = [
        { v:'all',      l:'Todos',     n: total,    cls:'' },
        { v:'pending',  l:'Pendentes', n: pending,  cls:'status-pending' },
        { v:'reviewed', l:'Revisados', n: reviewed, cls:'status-reviewed' },
        { v:'mastered', l:'Dominados', n: mastered, cls:'status-mastered' },
      ].map(f => `
        <button class="cad-status-pill ${f.cls} ${filter === f.v ? 'active' : ''}"
                onclick="Errors.filterBy('${f.v}')">
          <span class="cad-sp-dot"></span>
          <span class="cad-sp-lbl">${f.l}</span>
          <span class="cad-sp-n">${f.n}</span>
        </button>`
      ).join('');
    }

    // Populate error subject select
    const $sel = document.getElementById('err-subj-sel');
    if ($sel && !$sel.options.length) {
      $sel.innerHTML = Data.SUBJECTS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
    }

    // ── Sidebar de matérias ──
    const $sl = document.getElementById('cad-subj-list');
    if ($sl) {
      // Build subject map: prefer Edital data when available, fallback to SUBJECTS.
      const ed = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      const subjMap = {};
      const subjOrder = [];
      if (ed?.disciplinas?.length) {
        ed.disciplinas.forEach(d => {
          subjMap[d.id || d.nome] = { id: d.id || d.nome, name: d.nome, icon: '📘', color: (typeof EditalEngine!=='undefined'?EditalEngine._discColor(d.nome,d.cor):d.cor)||'#E8B84B' };
          subjOrder.push(d.id || d.nome);
        });
      } else {
        Data.SUBJECTS.forEach(s => {
          subjMap[s.id] = { id: s.id, name: s.name, icon: s.icon, color: s.color };
          subjOrder.push(s.id);
        });
      }
      // Count errors per subject (also catch unknown ids)
      const counts = {};
      errs.forEach(e => { const k = e.subj || '_unk'; counts[k] = (counts[k]||0)+1; if (!subjMap[k]) { subjMap[k] = { id:k, name:k, icon:'❔', color:'#888' }; subjOrder.push(k); } });

      const search = (Errors._sideSearchTerm || '').toLowerCase();
      const visible = subjOrder.filter(id => {
        const s = subjMap[id];
        if (!s) return false;
        if (!search) return true;
        return s.name.toLowerCase().includes(search);
      });

      const allActive = filter === 'all' || ['pending','reviewed','mastered'].includes(filter);
      let html = `
        <button class="cad-subj-row all ${allActive?'active':''}" onclick="Errors.filterBy('all')">
          <div class="cad-subj-ico">📋</div>
          <div class="cad-subj-info">
            <div class="cad-subj-name">Todas as matérias</div>
            <div class="cad-subj-meta">${total} ${total===1?'erro':'erros'} no total</div>
          </div>
          <div class="cad-subj-n">${total}</div>
        </button>`;

      visible.forEach(id => {
        const s = subjMap[id];
        const n = counts[id] || 0;
        if (n === 0 && !search) return;          // só matérias com erros (a menos que esteja buscando)
        const active = filter === id;
        html += `
          <button class="cad-subj-row ${active?'active':''}"
                  style="--subj-c:${s.color}"
                  onclick="Errors.filterBy('${id.replace(/'/g,"\\'")}')">
            <div class="cad-subj-ico">${s.icon}</div>
            <div class="cad-subj-info">
              <div class="cad-subj-name" title="${s.name}">${s.name}</div>
              <div class="cad-subj-meta">${n} ${n===1?'erro registrado':'erros registrados'}</div>
            </div>
            <div class="cad-subj-n">${n}</div>
          </button>`;
      });

      const renderedNonAll = visible.filter(id => (counts[id]||0) > 0 || search).length;
      if (renderedNonAll === 0) {
        html += `<div class="cad-subj-empty">${search ? 'Nenhuma matéria encontrada.' : 'Registre seu primeiro erro para popular esta lista.'}</div>`;
      }

      $sl.innerHTML = html;
      const $cnt = document.getElementById('cad-side-count');
      if ($cnt) $cnt.textContent = visible.filter(id => (counts[id]||0) > 0).length;

      // Active-filter breadcrumb
      const $bc = document.getElementById('cad-active-filter');
      if ($bc) {
        if (filter !== 'all' && !['pending','reviewed','mastered'].includes(filter)) {
          const s = subjMap[filter];
          $bc.innerHTML = `
            <span class="cad-bc-lbl">Filtrando por matéria:</span>
            <span class="cad-bc-tag" style="--subj-c:${s?.color||'var(--gold)'}">
              <span>${s?.icon||'📚'}</span> ${s?.name||filter}
            </span>
            <button class="cad-bc-clear" onclick="Errors.filterBy('all')">✕ limpar</button>`;
          $bc.style.display = 'flex';
        } else {
          $bc.style.display = 'none';
          $bc.innerHTML = '';
        }
      }
    }

    // Render list
    Errors.renderList();
  }

  function analysis() {
    // Use AI-generated content if available, otherwise keep the analysis empty until configured
    const aiContent = (typeof NexusContentAI !== 'undefined') ? NexusContentAI.getContent() : null;
    const patterns  = aiContent?.patterns?.length ? aiContent.patterns : Data.ANALYSIS_PATTERNS;
    const bySubj    = aiContent?.bySubj?.length   ? aiContent.bySubj   : Data.ANALYSIS_BY_SUBJ;

    const $pats = document.getElementById('analysis-patterns');
    if ($pats) $pats.innerHTML = patterns.map(p => Components.createAnalysisCard(p)).join('');
    const $bysubj = document.getElementById('analysis-bysubj');
    if ($bysubj) $bysubj.innerHTML = bySubj.map(s => Components.createSubjectAnalysisCard(s)).join('');

    // Show AI generation banner
    if (typeof NexusContentAI !== 'undefined') NexusContentAI.renderAnalysisBanner();
  }

  /* ══ Consistency Card — heatmap + filters ══ */
  function _renderConsistencyCard() {
    const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    const $card = document.getElementById('dash-heatmap-card');
    if (!$card) return;

    // Filter state
    const filterMode = $card.dataset.filter || '3m';
    const WEEKS_MAP  = { '1m':5, '3m':13, '6m':26, '1a':53 };
    const WEEKS = WEEKS_MAP[filterMode] || 13;

    const today = new Date();
    const cells = [];
    const startD = new Date(today);
    startD.setDate(today.getDate() - WEEKS * 7 + 1);

    const sessMap = {};
    sessions.forEach(s => { if(s.data) sessMap[s.data] = (sessMap[s.data]||0) + (s.tempoSecs||0); });
    const maxSecs = Math.max(...Object.values(sessMap), 1);

    for (let i = 0; i < WEEKS * 7; i++) {
      const d = new Date(startD); d.setDate(startD.getDate() + i);
      const dk = _localDateStr(d);
      const secs = sessMap[dk] || 0;
      const lvl  = secs === 0 ? 0 : secs < 1800 ? 1 : secs < 3600 ? 2 : secs < 7200 ? 3 : 4;
      cells.push({ dk, lvl, secs, isToday: dk === _localDateStr(today) });
    }

    // Streak
    let streak = 0;
    const d = new Date(today);
    while (sessMap[_localDateStr(d)]) { streak++; d.setDate(d.getDate()-1); }
    const daysStudied = Object.keys(sessMap).length;

    const heatColors = ['rgba(255,255,255,.04)','rgba(77,159,255,.22)','rgba(77,159,255,.5)','rgba(46,204,113,.5)','rgba(46,204,113,.85)'];
    const sColor = streak>=14?'var(--green)':streak>=7?'var(--gold)':streak>=3?'var(--orange)':'var(--text-dim)';
    const sLabel = streak>=14?'🏆 Em chamas!':streak>=7?'🔥 Forte':streak>=3?'⚡ Ativo':streak>0?'✅':'—';

    // Month labels
    const monN = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const weekStarts = [];
    for (let wi = 0; wi < WEEKS; wi++) {
      const d2 = new Date(startD); d2.setDate(startD.getDate() + wi * 7);
      weekStarts.push(d2.getMonth());
    }
    const monthBar = weekStarts.map((m, wi) => {
      const show = wi === 0 || weekStarts[wi-1] !== m;
      return `<div style="flex:7;font-size:8px;color:var(--text-dim);letter-spacing:.05em">${show ? monN[m] : ''}</div>`;
    }).join('');

    $card.innerHTML = `
      <div class="dprem-card-hd" style="flex-wrap:wrap;gap:8px">
        <div>
          <div class="dprem-card-title">🗓 Consistência de Estudo</div>
          <div style="font-size:10px;color:var(--text-dim);margin-top:2px">${daysStudied} dias ativos</div>
        </div>
        <div style="display:flex;align-items:center;gap:14px;margin-left:auto">
          <div style="text-align:center">
            <div style="font-family:var(--font-display);font-size:26px;line-height:1;color:${sColor}">${streak}</div>
            <div style="font-size:8px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim)">seguidos</div>
            <div style="font-size:9px;color:${sColor};margin-top:1px">${sLabel}</div>
          </div>
          <div class="dash-filter-chips">
            ${['1m','3m','6m','1a'].map(f=>
              `<button class="dash-chip ${filterMode===f?'active':''}"
                       onclick="Render._setConsistencyFilter('${f}')">${f}</button>`
            ).join('')}
          </div>
        </div>
      </div>
      <div style="padding:10px 14px 12px;flex:1;display:flex;flex-direction:column;min-height:0">
        <div style="display:flex;gap:2px;margin-bottom:4px">${monthBar}</div>
        <div style="flex:1;min-height:80px;display:grid;grid-template-columns:repeat(${WEEKS},1fr);grid-template-rows:repeat(7,1fr);gap:3px">
          ${Array.from({length:WEEKS},(_,wi)=>
            cells.slice(wi*7,(wi+1)*7).map((cell,di)=>{
                const daySess = sessions.filter(s=>s.data===cell.dk);
                const tooltip = cell.dk + (daySess.length ? ' · ' + Math.round(cell.secs/60) + 'min · ' + daySess.length + ' sess.' : '');
                return `<div title="${tooltip}"
                             data-date="${cell.dk}"
                             style="grid-column:${wi+1};grid-row:${di+1};border-radius:3px;
                                    background:${heatColors[cell.lvl]};
                                    ${cell.isToday?'box-shadow:0 0 0 1.5px var(--gold);':''}
                                    cursor:${daySess.length?'pointer':'default'};transition:transform .08s"
                             onmouseover="this.style.transform='scale(1.2)'"
                             onmouseout="this.style.transform='scale(1)'"
                             ${daySess.length?'onclick="Render._filterHistoryByDate(this.dataset.date)"':''}
                             ></div>`;
              }).join('')
          ).join('')}
        </div>
        <div style="display:flex;align-items:center;gap:5px;margin-top:8px">
          <span style="font-size:9px;color:var(--text-dim)">Menos</span>
          ${heatColors.map(clr=>`<div style="width:9px;height:9px;border-radius:2px;background:${clr}"></div>`).join('')}
          <span style="font-size:9px;color:var(--text-dim)">Mais</span>
          <span style="font-size:9px;color:var(--text-dim);margin-left:auto">clique num dia para filtrar histórico</span>
        </div>
      </div>`;
  }

  function _setConsistencyFilter(f) {
    const $card = document.getElementById('dash-heatmap-card');
    if ($card) { $card.dataset.filter = f; _renderConsistencyCard(); }
  }

  function _filterHistoryByDate(date) {
    const $hcard = document.getElementById('dash-history-card');
    if (!$hcard) return;
    // Clicou no mesmo dia já filtrado → limpa o filtro
    if ($hcard.dataset.filterDate === date) {
      $hcard.dataset.filterDate = '';
    } else {
      $hcard.dataset.filterDate = date;
      $hcard.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }
    _renderHistoryCard();
  }

  /* ══ History Card — all study sessions ══ */
  function _renderHistoryCard() {
    const $card = document.getElementById('dash-history-card');
    if (!$card) return;

    const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]')
      .sort((a,b) => (b.data||'').localeCompare(a.data||'') || (b.createdAt||'').localeCompare(a.createdAt||''));

    const filterDate = $card.dataset.filterDate || '';
    const filterDisc = $card.dataset.filterDisc || '';
    const searchTerm = $card.dataset.search    || '';

    const allDiscs = [...new Set(sessions.map(s=>s.disciplina||s.subj||'').filter(Boolean))].sort();

    const _parseTopic = raw => {
      if (!raw) return '';
      try { const p = JSON.parse(raw); return p.texto || raw; } catch(_) { return (raw+'').replace(/<[^>]*>/g,''); }
    };

    let filtered = sessions;
    if (filterDate) filtered = filtered.filter(s => s.data === filterDate);
    if (filterDisc) filtered = filtered.filter(s => (s.disciplina||s.subj||'') === filterDisc);
    if (searchTerm) {
      const sq = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        (s.disciplina||'').toLowerCase().includes(sq) ||
        _parseTopic(s.topico||'').toLowerCase().includes(sq) ||
        (s.material||'').toLowerCase().includes(sq) ||
        (s.comentarios||'').toLowerCase().includes(sq)
      );
    }

    const fmtSecs = secs => {
      const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60);
      return h>0 ? h+'h'+String(m).padStart(2,'0')+'min' : m+'min';
    };

    // Disc → accent color map (deterministic from name)
    const DISC_COLORS = ['#4D9FFF','#E8B84B','#2ECC71','#FF4D4D','#FF8C42','#A78BFA','#00CEC9','#FD79A8','#F5CC6A','#6C5CE7'];
    const _discColor = name => DISC_COLORS[Math.abs([...name].reduce((h,c)=>((h<<5)-h+c.charCodeAt(0))|0,0)) % DISC_COLORS.length];

    const activeFilters = [filterDate, filterDisc, searchTerm].filter(Boolean).length;

    // ── Group sessions by date ──
    const byDate = {};
    filtered.forEach(s => {
      const dk = s.data || '—';
      if (!byDate[dk]) byDate[dk] = [];
      byDate[dk].push(s);
    });

    const dateGroups = Object.entries(byDate).sort((a,b) => b[0].localeCompare(a[0]));

    const monN  = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const dowN  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const fmtDayHeader = iso => {
      if (!iso || iso==='—') return { day:'?', mon:'', dow:'', dayFull:'' };
      const [y,m,d] = iso.split('-').map(Number);
      const dt = new Date(y, m-1, d);
      return { day: String(d).padStart(2,'0'), mon: monN[m-1]+'/'+(String(y).slice(2)), dow: dowN[dt.getDay()] };
    };

    // Timeline groups HTML
    const groupsHTML = !dateGroups.length
      ? `<div class="hist-empty"><div style="font-size:22px;margin-bottom:8px">${sessions.length?'🔍':'📭'}</div><div>${sessions.length?'Nenhum resultado.':'Nenhuma sessão registrada ainda.'}</div></div>`
      : dateGroups.map(([dk, daySessions]) => {
          const dFmt = fmtDayHeader(dk);
          const dayTotalSecs = daySessions.reduce((a,s) => a+(s.tempoSecs||0), 0);

          const sessionsHTML = daySessions.map(s => {
            const color    = _discColor(s.disciplina||s.subj||'X');
            const topic    = _parseTopic(s.topico||'');
            const tot      = (s.acertos||0)+(s.erros||0);
            const taxa     = tot>0 ? Math.round((s.acertos||0)/tot*100) : null;
            const taxaClr  = taxa!==null?(taxa>=70?'var(--green)':taxa>=50?'var(--gold)':'var(--red)'):'';
            const taxaBg   = taxa!==null?(taxa>=70?'rgba(46,204,113,.12)':taxa>=50?'rgba(232,184,75,.12)':'rgba(255,77,77,.1)'):'';
            const expandId = 'hist-exp-'+s.id;
            const catClr   = s.categoria==='Teoria'?'var(--blue)':s.categoria==='Revisão'?'var(--gold)':s.categoria==='Questões'?'var(--green)':'var(--text-dim)';
            const hasExtra = !!(topic||s.material||s.comentarios||s.paginasIni||s.paginasFim||s.categoria||(s.videoaulas&&s.videoaulas.length));

            // Build videoaulas HTML
            let vidHTML = '';
            if (s.videoaulas && s.videoaulas.length) {
              let rows = '';
              s.videoaulas.forEach(function(v) {
                const dot = v.done ? '<span style="color:var(--green)">✓</span>' : '<span style="color:var(--text-dim)">○</span>';
                const lnk = v.link
                  ? '<a href="' + v.link + '" target="_blank" class="hist-vid-link">' + (v.title || v.link.slice(0,40)) + '</a>'
                  : '<span>' + (v.title || 'Sem título') + '</span>';
                const tim = (v.inicio && v.inicio !== '00:00:00')
                  ? '<span class="hist-vid-time">' + v.inicio + '→' + v.fim + '</span>' : '';
                rows += '<div class="hist-vid-item">' + dot + ' ' + lnk + ' ' + tim + '</div>';
              });
              vidHTML = '<div class="hist-dg-vids"><span class="hist-dg-lbl">🎥 VIDEOAULAS</span><div class="hist-vids-list">' + rows + '</div></div>';
            }

            // Build notes HTML
            const notesHTML = s.comentarios
              ? '<div class="hist-dg-notes"><span class="hist-dg-lbl">💬 ANOTAÇÕES</span><div class="hist-notes-text">' + s.comentarios + '</div></div>'
              : '';

            // Action buttons (always use data-id to avoid quoting issues)
            const sid     = String(s.id);
            const editBtn = '<button class="hist-act-btn edit" data-id="' + sid + '" onclick="event.stopPropagation();Render._editSession(this.dataset.id)" title="Editar">✎</button>';
            const delBtn  = '<button class="hist-act-btn del" data-id="' + sid + '" onclick="event.stopPropagation();Render._deleteSession(this.dataset.id)" title="Excluir">✕</button>';

            // Detail panel
            const detailHTML = hasExtra ? (
              '<div class="hist-session-detail" id="' + expandId + '" style="display:none">' +
                '<div class="hist-detail-grid">' +
                  (topic       ? '<div class="hist-dg-row"><span class="hist-dg-lbl">📌 TÓPICO</span><span class="hist-dg-val">' + topic + '</span></div>' : '') +
                  (s.material  ? '<div class="hist-dg-row"><span class="hist-dg-lbl">📖 MATERIAL</span><span class="hist-dg-val">' + s.material + '</span></div>' : '') +
                  (s.categoria ? '<div class="hist-dg-row"><span class="hist-dg-lbl">🏷️ CATEGORIA</span><span class="hist-dg-val" style="color:' + catClr + ';font-weight:700">' + s.categoria + '</span></div>' : '') +
                  ((s.paginasIni||s.paginasFim) ? '<div class="hist-dg-row"><span class="hist-dg-lbl">📄 PÁGINAS</span><span class="hist-dg-val">' + (s.paginasIni||0) + ' → ' + (s.paginasFim||0) + '</span></div>' : '') +
                  (tot>0 ? '<div class="hist-dg-row"><span class="hist-dg-lbl">📊 QUESTÕES</span><span class="hist-dg-val">' +
                    '<b style="color:var(--green)">' + (s.acertos||0) + ' ✓</b> · ' +
                    '<b style="color:var(--red)">' + (s.erros||0) + ' ✗</b>' +
                    (taxa!==null ? ' · <b style="color:' + taxaClr + '">' + taxa + '% aproveitamento</b>' : '') +
                  '</span></div>' : '') +
                  (s.programarRev ? '<div class="hist-dg-row"><span class="hist-dg-lbl">🔁 REVISÃO</span><span class="hist-dg-val" style="color:var(--blue)">Programada</span></div>' : '') +
                '</div>' +
                vidHTML +
                notesHTML +
                '<div class="hist-detail-footer">' +
                  '<span class="hist-detail-ts">🕐 ' + (s.createdAt ? new Date(s.createdAt).toLocaleString('pt-BR') : dk) + '</span>' +
                  '<div class="hist-detail-actions">' + editBtn + delBtn + '</div>' +
                '</div>' +
              '</div>'
            ) : (
              '<div class="hist-act-inline">' + editBtn + delBtn + '</div>'
            );

            // Full row HTML
            return (
              '<div class="hist-session">' +
                '<div class="hist-session-accent" style="background:' + color + '"></div>' +
                '<div class="hist-session-body">' +
                  '<div class="hist-session-top"' + (hasExtra ? ' data-expand="' + expandId + '" onclick="Render._toggleHistItem(this.dataset.expand)"' : '') + '>' +
                    '<div class="hist-session-info">' +
                      '<div class="hist-session-disc">' + (s.disciplina||s.subj||'—') + '</div>' +
                      (topic ? '<div class="hist-session-topic">' + topic.slice(0,80) + (topic.length>80?'…':'') + '</div>' : '') +
                    '</div>' +
                    '<div class="hist-session-meta">' +
                      (s.tempoSecs ? '<span class="hist-meta-time">⏱ ' + fmtSecs(s.tempoSecs) + '</span>' : '') +
                      (taxa!==null ? '<span class="hist-meta-taxa" style="color:' + taxaClr + ';background:' + taxaBg + '">' + taxa + '%</span>' : '') +
                      (s.categoria ? '<span class="hist-meta-cat" style="color:' + catClr + ';border-color:' + catClr + '40">✦ ' + s.categoria + '</span>' : '') +
                      (s.teoriaFin ? '<span class="hist-meta-tag">✓ Teoria</span>' : '') +
                      (s.programarRev ? '<span class="hist-meta-tag rev">🔁</span>' : '') +
                      (hasExtra ? '<span class="hist-session-chevron" id="' + expandId + '-chev">▾</span>' : '') +
                    '</div>' +
                  '</div>' +
                  detailHTML +
                '</div>' +
              '</div>'
            );
          }).join('');

          return `<div class="hist-day-group">
            <div class="hist-day-header">
              <div class="hist-day-badge">
                <div class="hist-day-num">${dFmt.day}</div>
                <div class="hist-day-mon">${dFmt.mon}</div>
                <div class="hist-day-dow">${dFmt.dow}</div>
              </div>
              <div class="hist-day-line"></div>
              <div class="hist-day-total">⏱ ${fmtSecs(dayTotalSecs)}</div>
            </div>
            <div class="hist-day-sessions">${sessionsHTML}</div>
          </div>`;
        }).join('');

    $card.innerHTML = `
      <div class="dprem-card-hd" style="flex-direction:column;align-items:stretch;gap:10px;padding:12px 14px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div>
            <div class="dprem-card-title">📋 Histórico de Estudos</div>
            <div style="font-size:10px;color:var(--text-dim);margin-top:2px">
              ${filtered.length} de ${sessions.length} registro${sessions.length!==1?'s':''}
              ${activeFilters?` · <span style="color:var(--gold)">${activeFilters} filtro${activeFilters!==1?'s':''} ativo${activeFilters!==1?'s':''}</span>`:''}
            </div>
          </div>
          ${activeFilters ? `<button onclick="Render._clearHistoryFilters()" style="padding:4px 10px;border-radius:7px;border:1px solid var(--border-strong);background:transparent;color:var(--text-dim);font-size:10px;font-weight:700;cursor:pointer">✕ Limpar</button>` : ''}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <input type="text" placeholder="🔍 Buscar..." value="${searchTerm}"
                 oninput="Render._historySearch(this.value)"
                 style="flex:1;min-width:100px;padding:6px 10px;background:var(--surface-3);border:1px solid var(--border-default);border-radius:8px;color:var(--text-primary);font-size:11px;outline:none">
          <input type="date" value="${filterDate}"
                 onchange="Render._filterHistoryByDate(this.value)"
                 style="padding:5px 9px;background:var(--surface-3);border:1px solid var(--border-default);border-radius:8px;color:var(--text-primary);font-size:11px;outline:none">
          <select onchange="Render._filterHistoryByDisc(this.value)"
                  style="padding:5px 9px;background:var(--surface-3);border:1px solid var(--border-default);border-radius:8px;color:var(--text-primary);font-size:11px;outline:none">
            <option value="">Todas as disciplinas</option>
            ${allDiscs.map(d=>`<option value="${d}" ${filterDisc===d?'selected':''}>${d}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="dash-history-scroll">${groupsHTML}</div>`;
  }


  function _toggleHistItem(id) {
    const $body = document.getElementById(id);
    const $chev = document.getElementById(id+'-chev');
    if (!$body) return;
    const open = $body.style.display === 'block';
    $body.style.display = open ? 'none' : 'block';
    if ($chev) { $chev.style.transform = open ? '' : 'rotate(180deg)'; $chev.style.color = open ? 'var(--text-dim)' : 'var(--gold)'; }
  }

  function _historySearch(val) {
    const $c = document.getElementById('dash-history-card');
    if ($c) { $c.dataset.search = val; _renderHistoryCard(); }
  }

  function _filterHistoryByDisc(val) {
    const $c = document.getElementById('dash-history-card');
    if ($c) { $c.dataset.filterDisc = val; _renderHistoryCard(); }
  }

  function _clearHistoryFilters() {
    const $c = document.getElementById('dash-history-card');
    if ($c) { $c.dataset.filterDate=''; $c.dataset.filterDisc=''; $c.dataset.search=''; _renderHistoryCard(); }
  }




  function _toggleDiscDetail(id) {
    const $panel = document.getElementById(id);
    if (!$panel) return;
    const isOpen = $panel.style.display === 'block';
    // Close all other panels
    document.querySelectorAll('.dpdisc-topics-panel').forEach(p => {
      if (p !== $panel) { p.style.display = 'none'; p.closest('.dpdisc-row-wrap')?.querySelector('.dpdisc-row')?.classList.remove('expanded'); }
    });
    $panel.style.display = isOpen ? 'none' : 'block';
    $panel.closest('.dpdisc-row-wrap')?.querySelector('.dpdisc-row')?.classList.toggle('expanded', !isOpen);
  }


  function _sortDisc(col) {
    if (window._dpSortCol === col) {
      window._dpSortDir = (window._dpSortDir||1) === 1 ? -1 : 1;
    } else {
      window._dpSortCol = col;
      window._dpSortDir = col === 'disc' ? 1 : -1;
    }
    Render.dashboard();
  }


  /* ══ Metas Card ══════════════════════════════════════════ */
  function _renderMetasCard() {
    const $card = document.getElementById('dash-metas-card');
    if (!$card) return;

    const sessions  = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    const goalsRaw  = JSON.parse(localStorage.getItem('nexus_goals_v1') || '{}');
    const horasMeta = goalsRaw.horasMeta    || 20;
    const quesMeta  = goalsRaw.questoesMeta || 300;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey   = _localDateStr(weekStart);
    const weekSess  = sessions.filter(s => s.data >= weekKey);
    const weekSecs  = weekSess.reduce((a,s) => a+(s.tempoSecs||0), 0);
    const weekHoras = weekSecs / 3600;
    const weekQ     = weekSess.reduce((a,s) => a+(s.acertos||0)+(s.erros||0), 0);
    const weekAc    = weekSess.reduce((a,s) => a+(s.acertos||0), 0);
    const hPct      = Math.min(100, Math.round(weekHoras / horasMeta * 100));
    const qPct      = Math.min(100, Math.round(weekQ / quesMeta * 100));
    const taxa      = weekQ > 0 ? Math.round(weekAc / weekQ * 100) : null;

    const fmtH = secs => {
      const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60);
      return h+'h'+String(m).padStart(2,'0')+'min';
    };

    // Color helpers
    const clr = p => p>=80?'#2ECC71':p>=50?'#E8B84B':'#FF4D4D';
    const grd = (p, id) => {
      const c0=clr(p), c1=p>=80?'rgba(46,204,113,.18)':p>=50?'rgba(232,184,75,.12)':'rgba(255,77,77,.1)';
      return `url(#mg${id})`;
    };

    // SVG ring (mini donut) for each goal
    const ring = (pct, color, id) => {
      const R=18, CX=22, CY=22, STROKE=4;
      const circ = 2*Math.PI*R;
      const dash  = (pct/100)*circ;
      return `<svg width="44" height="44" viewBox="0 0 44 44" style="flex-shrink:0">
        <defs>
          <linearGradient id="rg${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity=".3"/>
            <stop offset="100%" stop-color="${color}"/>
          </linearGradient>
        </defs>
        <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="${STROKE}"/>
        <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="url(#rg${id})" stroke-width="${STROKE}"
                stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}"
                stroke-linecap="round"
                transform="rotate(-90 ${CX} ${CY})"/>
        <text x="${CX}" y="${CY+4}" text-anchor="middle" font-size="9" font-weight="800" fill="${color}">${pct}%</text>
      </svg>`;
    };

    const goalRow = (icon, label, cur, meta, pct, color) => `
      <div class="mg-row">
        ${ring(pct, color, label.slice(0,2))}
        <div class="mg-row-body">
          <div class="mg-row-top">
            <span class="mg-row-icon">${icon}</span>
            <span class="mg-row-label">${label}</span>
            <span class="mg-row-val" style="color:${color}">${cur} <span style="color:var(--text-dim);font-weight:400">/ ${meta}</span></span>
          </div>
          <div class="mg-bar-track">
            <div class="mg-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${color}88,${color});box-shadow:0 0 8px ${color}55"></div>
          </div>
        </div>
      </div>`;

    $card.innerHTML = `
      <div class="mg-card-inner">
        <div class="mg-hdr">
          <div>
            <div class="mg-title">🎯 METAS DA SEMANA</div>
            ${taxa!==null?`<div class="mg-taxa" style="color:${clr(taxa)}">Taxa de acertos esta semana: <strong>${taxa}%</strong></div>`:''}
          </div>
          <button onclick="Render._openMetasEditor()" class="mg-edit-btn">✎</button>
        </div>
        <div class="mg-goals">
          ${goalRow('⏱','Horas de Estudo', fmtH(weekSecs), horasMeta+'h', hPct, clr(hPct))}
          ${goalRow('📝','Questões', weekQ, quesMeta, qPct, clr(qPct))}
        </div>
        ${taxa!==null?`<div class="mg-footer">
          <div class="mg-footer-stat"><span class="mg-footer-label">Acertos</span><span style="color:var(--green);font-weight:700">${weekAc}</span></div>
          <div class="mg-footer-sep"></div>
          <div class="mg-footer-stat"><span class="mg-footer-label">Erros</span><span style="color:var(--red);font-weight:700">${weekQ-weekAc}</span></div>
          <div class="mg-footer-sep"></div>
          <div class="mg-footer-stat"><span class="mg-footer-label">Sessões</span><span style="color:var(--text-muted);font-weight:700">${weekSess.length}</span></div>
        </div>`:''}
      </div>
      `;
  }


  function _openMetasEditor() {
    document.getElementById('modal-metas-editor')?.remove();
    const raw = localStorage.getItem('nexus_goals_v1');
    const g = raw ? JSON.parse(raw) : {};
    const horasMeta = g.horasMeta ?? 20;
    const quesMeta  = g.questoesMeta ?? 300;
    const el = document.createElement('div');
    el.id = 'modal-metas-editor';
    el.style.cssText = 'position:fixed;inset:0;z-index:9800;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:cmFadeIn .18s ease';
    el.onclick = e => { if (e.target === el) _closeMetasEditor(); };
    el.innerHTML = `
      <div style="background:var(--surface-1);border:1px solid var(--border);border-radius:14px;width:100%;max-width:380px;box-shadow:0 32px 80px rgba(0,0,0,0.7);animation:cmSlideIn .2s cubic-bezier(0.4,0,0.2,1);overflow:hidden">
        <div style="padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:15px;font-weight:700;color:var(--text)">🎯 Editar Metas Semanais</span>
          <button onclick="Render._closeMetasEditor()" style="width:30px;height:30px;border-radius:7px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text-dim);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center">✕</button>
        </div>
        <div style="padding:20px 22px;display:flex;flex-direction:column;gap:16px">
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px;display:flex;align-items:center;gap:5px"><span>⏱</span> Horas / semana</div>
            <input id="meta-horas-input" type="number" value="${horasMeta}" min="1" max="168"
              style="width:100%;padding:10px 12px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;outline:none;box-sizing:border-box;transition:border-color .15s;font-family:inherit"
              onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'">
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px;display:flex;align-items:center;gap:5px"><span>📝</span> Questões / semana</div>
            <input id="meta-ques-input" type="number" value="${quesMeta}" min="1" max="5000"
              style="width:100%;padding:10px 12px;background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;font-weight:700;outline:none;box-sizing:border-box;transition:border-color .15s;font-family:inherit"
              onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'">
          </div>
        </div>
        <div style="padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:8px">
          <button onclick="Render._saveMetas()" style="flex:1;padding:10px 0;border-radius:8px;background:var(--gold);border:none;color:#0a0e1a;font-weight:800;font-size:12px;cursor:pointer;letter-spacing:.5px;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>💾</span> Salvar
          </button>
          <button onclick="Render._closeMetasEditor()" style="padding:10px 16px;border-radius:8px;border:1px solid var(--border);background:transparent;color:var(--text-dim);font-size:12px;font-weight:700;cursor:pointer">
            Cancelar
          </button>
        </div>
      </div>`;
    document.body.appendChild(el);
    setTimeout(() => el.querySelector('#meta-horas-input')?.focus(), 50);
  }

  function _closeMetasEditor() {
    document.getElementById('modal-metas-editor')?.remove();
  }

  function _saveMetas() {
    const h = parseFloat(document.getElementById('meta-horas-input')?.value) || 20;
    const q = parseInt(document.getElementById('meta-ques-input')?.value)    || 300;
    localStorage.setItem('nexus_goals_v1', JSON.stringify({ horasMeta: h, questoesMeta: q }));
    _closeMetasEditor();
    _renderMetasCard();
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(46,204,113,.15);border:1px solid rgba(46,204,113,.3);color:var(--green);padding:9px 18px;border-radius:9px;font-size:11px;font-weight:700;z-index:9999;pointer-events:none';
    t.textContent = '✅ Metas salvas!';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  /* ══ Weekly Chart Card ════════════════════════════════════ */
  let _wcMode    = 'tempo'; // 'tempo' | 'questoes'
  let _wcOffset  = 0;       // week offset (0 = current)

  function _renderWeeklyChartCard() {
    const $card = document.getElementById('dash-weekly-card');
    if (!$card) return;

    const sessions  = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    const today     = new Date();
    const dayLabels = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const monN      = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

    const refDate   = new Date(today);
    refDate.setDate(today.getDate() + _wcOffset * 7);
    const weekStart = new Date(refDate);
    weekStart.setDate(refDate.getDate() - refDate.getDay());
    const weekEnd   = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
    const fmtShort  = d => String(d.getDate()).padStart(2,'0')+'/'+monN[d.getMonth()];

    const week = Array.from({length:7}, (_, i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
      const dk = _localDateStr(d);
      const daySess = sessions.filter(s => s.data === dk);
      const secs    = daySess.reduce((a,s) => a+(s.tempoSecs||0), 0);
      const questoes= daySess.reduce((a,s) => a+(s.acertos||0)+(s.erros||0), 0);
      const acertos = daySess.reduce((a,s) => a+(s.acertos||0), 0);
      const isToday = dk === _localDateStr(today);
      return { dk, label: dayLabels[d.getDay()], secs, horas: secs/3600, questoes, acertos, isToday };
    });

    const isQ       = _wcMode === 'questoes';
    const vals      = week.map(d => isQ ? d.questoes : d.horas);
    const maxVal    = Math.max(...vals, 0.01);
    const totalSecs = week.reduce((a,d) => a+d.secs, 0);
    const totalQ    = week.reduce((a,d) => a+d.questoes, 0);
    const totalAc   = week.reduce((a,d) => a+d.acertos, 0);
    const desemp    = totalQ > 0 ? Math.round(totalAc/totalQ*100) : null;
    const dClr      = desemp===null?'var(--text-dim)':'var(--gold)';

    const fmtSecs = secs => {
      const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60);
      return h>0?h+'h'+String(m).padStart(2,'0')+'min':m+'min';
    };

    // SVG chart — clean minimal bars
    const BAR_W=14, BAR_GAP=9,  PAD_L=20, PAD_R=4,  PAD_T=16, PAD_B=24, CHART_H=80;
    const chartW = (BAR_W+BAR_GAP)*7 + PAD_L + PAD_R;
    const svgH   = PAD_T + CHART_H + PAD_B;

    // Gradient defs
    const defs = `<defs>
      <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2ECC71" stop-opacity=".9"/>
        <stop offset="100%" stop-color="#1a8a4a" stop-opacity=".5"/>
      </linearGradient>
      <linearGradient id="barGradToday" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#5fffc0" stop-opacity="1"/>
        <stop offset="100%" stop-color="#2ECC71" stop-opacity=".85"/>
      </linearGradient>
      <linearGradient id="barGradQ" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#4D9FFF" stop-opacity=".9"/>
        <stop offset="100%" stop-color="#1a5aaa" stop-opacity=".5"/>
      </linearGradient>
    </defs>`;

    // Grid lines — theme-aware
    const _th = (typeof ThemeEngine !== 'undefined') ? ThemeEngine : null;
    const _gridClr = _th ? _th.svgGrid() : 'rgba(255,255,255,.04)';
    const _baseClr = _th ? _th.svgBaseline() : 'rgba(255,255,255,.12)';
    const _lblClr  = _th ? (_th.current()==='light'?'rgba(100,80,50,.45)':'rgba(255,255,255,.25)') : 'rgba(255,255,255,.25)';
    const gridLines = [0,25,50,75,100].map(pct => {
      const y  = PAD_T + CHART_H - Math.round(pct/100*CHART_H);
      const v  = isQ ? Math.round(maxVal*pct/100) : (maxVal*pct/100).toFixed(1);
      const st = pct===0 ? 'stroke="'+_baseClr+'" stroke-dasharray="0"' : 'stroke="'+_gridClr+'" stroke-dasharray="4 6"';
      const lbl = pct>0 ? '<text x="'+(PAD_L-5)+'" y="'+(y+3)+'" text-anchor="end" font-size="8" fill="'+_lblClr+'">'+v+'</text>' : '';
      return '<line x1="'+PAD_L+'" y1="'+y+'" x2="'+(chartW-PAD_R)+'" y2="'+y+'" '+st+' stroke-width="1"/>'+lbl;
    }).join('');

    // Baseline
    const baseline = `<line x1="${PAD_L}" y1="${PAD_T+CHART_H}" x2="${chartW-PAD_R}" y2="${PAD_T+CHART_H}"
                            stroke="rgba(255,255,255,.12)" stroke-width="1"/>`;

    const isLight = _th && _th.current()==='light';
    const bars = week.map((d, i) => {
      const bH      = maxVal>0 ? Math.max(3, Math.round((vals[i]/maxVal)*CHART_H)) : 0;
      const x       = PAD_L + i*(BAR_W+BAR_GAP);
      const y       = PAD_T + CHART_H - bH;
      const grad    = d.isToday ? 'url(#barGradToday)' : isQ ? 'url(#barGradQ)' : 'url(#barGrad)';
      const lblY    = PAD_T + CHART_H + 15;
      const hasData = vals[i] > 0;
      const ttLabel = isQ
        ? `Questões: ${d.questoes}`
        : `Tempo: ${fmtSecs(d.secs)}`;
      return `
        <g class="wc-bar-hit"
           data-label="${d.label}" data-tt="${ttLabel}"
           onmouseenter="(function(el){var tt=document.getElementById('wc-tooltip');if(!tt)return;tt.querySelector('.wc-tt-day').textContent=el.dataset.label;tt.querySelector('.wc-tt-val').textContent=el.dataset.tt;tt.style.display='flex'})(this)"
           onmousemove="(function(el,ev){var tt=document.getElementById('wc-tooltip');if(!tt)return;var card=el.closest('.dprem-card');var r=card.getBoundingClientRect();var lx=ev.clientX-r.left+12;var ly=ev.clientY-r.top-36;if(lx+120>r.width)lx=ev.clientX-r.left-120;tt.style.left=lx+'px';tt.style.top=ly+'px'})(this,event)"
           onmouseleave="var tt=document.getElementById('wc-tooltip');if(tt)tt.style.display='none'">
          ${hasData
            ? `<rect x="${x}" y="${y}" width="${BAR_W}" height="${bH}" rx="4" fill="${grad}" opacity="${d.isToday?1:.75}"/>`
            : `<rect x="${x+2}" y="${PAD_T+CHART_H-2}" width="${BAR_W-4}" height="2" rx="1" fill="rgba(255,255,255,.05)"/>`}
          <rect x="${x-4}" y="${PAD_T}" width="${BAR_W+8}" height="${CHART_H}" fill="transparent"/>
        </g>
        <text x="${x+BAR_W/2}" y="${lblY}" text-anchor="middle"
              font-size="9" font-weight="${d.isToday?700:400}"
              fill="${d.isToday?(isLight?'#A67B00':'#E8B84B'):(isLight?'rgba(80,60,30,.4)':'rgba(255,255,255,.3)')}">${d.label}</text>
        ${d.isToday?`<circle cx="${x+BAR_W/2}" cy="${PAD_T+CHART_H+20}" r="2" fill="#E8B84B" opacity=".7"/>`:``}`;
    }).join('');

    const svgHTML = `<svg viewBox="0 0 ${chartW} ${svgH}" preserveAspectRatio="none"
                          style="width:100%;height:120px;display:block;overflow:visible">
      ${defs}${gridLines}${baseline}${bars}
    </svg>`;

    const totLabel = isQ
      ? `<span>Total: <strong style="color:var(--blue)">${totalQ} questões</strong></span>`
      : `<span>Total: <strong style="color:var(--green)">${fmtSecs(totalSecs)}</strong></span>`;
    const desempBadge = desemp!==null
      ? `<span class="wc-desemp-badge" style="color:${dClr};background:${dClr}12;border-color:${dClr}35">${desemp}% aproveit.</span>`
      : '';

    $card.style.cssText = 'display:flex;flex-direction:column;overflow:hidden;position:relative;height:auto';
    $card.innerHTML = `
      <div class="dprem-card-hd wc-hdr">
        <div class="dprem-card-title">📊 Estudo Semanal</div>
        <div class="wc-nav-wrap">
          <button onclick="Render._wcNav(-1)" class="wc-nav-btn">‹</button>
          <span class="wc-date-range">${fmtShort(weekStart)} ~ ${fmtShort(weekEnd)}</span>
          <button onclick="Render._wcNav(1)" class="wc-nav-btn" ${_wcOffset===0?'disabled':''} style="${_wcOffset===0?'opacity:.28':''}">›</button>
        </div>
      </div>
      <div class="wc-mode-row">
        <button onclick="Render._wcMode('tempo')" class="wc-mode-btn ${_wcMode==='tempo'?'active':''}">Tempo</button>
        <button onclick="Render._wcMode('questoes')" class="wc-mode-btn ${_wcMode==='questoes'?'active':''}" style="${_wcMode==='questoes'?'background:rgba(77,159,255,.15);border-color:rgba(77,159,255,.45);color:var(--blue)':''}">Questões</button>
      </div>
      <div class="wc-chart-area" onmouseleave="var tt=document.getElementById('wc-tooltip');if(tt)tt.style.display='none'">${svgHTML}</div>
      <div id="wc-tooltip" style="display:none;position:absolute;z-index:99;background:var(--surface-2);border:1px solid var(--border-strong);border-radius:8px;padding:8px 12px;flex-direction:column;gap:4px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.4);white-space:nowrap">
        <span class="wc-tt-day" style="font-size:11px;font-weight:700;color:var(--text-primary)"></span>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:8px;height:8px;border-radius:50%;background:${isQ?'var(--blue)':'var(--green)'}"></div>
          <span class="wc-tt-val" style="font-size:11px;font-weight:600;color:var(--text-primary)"></span>
        </div>
      </div>
      <div class="wc-legend">
        <div class="wc-legend-item">
          <div class="wc-legend-dot" style="background:${isQ?'var(--blue)':'var(--green)'}"></div>
          ${totLabel}
        </div>
        ${desempBadge}
      </div>`;
  }


  function _wcNav(dir) {
    _wcOffset = Math.min(0, _wcOffset + dir);
    _renderWeeklyChartCard();
  }

  function _wcModeSet(mode) {
    _wcMode = mode;
    _renderWeeklyChartCard();
  }


  /* ══ Pizza Card — Tempo por Matéria ══════════════════════ */
  function _renderPizzaCard() {
    const $card = document.getElementById('dash-pizza-card');
    if (!$card) return;

    const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    const byDisc   = {};
    sessions.forEach(s => {
      const k = s.disciplina || s.subj || '';
      if (!k) return;
      if (!byDisc[k]) byDisc[k] = 0;
      byDisc[k] += s.tempoSecs || 0;
    });

    const entries = Object.entries(byDisc)
      .map(([name, secs]) => ({ name, secs, horas: secs/3600 }))
      .sort((a,b) => b.secs - a.secs);

    const total = entries.reduce((a,e) => a + e.secs, 0);

    const fmtH = secs => {
      const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60);
      return h>0 ? h+'h'+(m>0?String(m).padStart(2,'0')+'m':'') : m+'min';
    };

    $card.style.cssText = 'display:flex;flex-direction:column;overflow:hidden;height:100%';

    if (!entries.length) {
      $card.innerHTML = `
        <div class="dprem-card-hd"><div class="dprem-card-title">🍕 Tempo por Matéria</div></div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--text-dim)">
          <div style="font-size:22px">📚</div>
          <div style="font-size:11px">Registre sessões para ver</div>
        </div>`;
      return;
    }

    // Disc colors from system (Ciclo/Edital) with fallback palette
    const FALLBACK_COLORS = [
      '#E8B84B','#4D9FFF','#2ECC71','#FF4D4D','#A78BFA',
      '#FF8C42','#00CEC9','#FD79A8','#6C5CE7','#F5CC6A',
      '#55EFC4','#B2BEC3','#74B9FF','#FDCB6E','#E17055',
    ];
    const _cicloMap = (typeof CicloEstudos !== 'undefined' && CicloEstudos.getColorMap) ? CicloEstudos.getColorMap() : {};
    const _editalData = JSON.parse(localStorage.getItem('nexus_edital_v2') || 'null');
    function _pizzaDiscColor(name, idx) {
      // 1. exact match in ciclo color map
      if (_cicloMap[name]) return _cicloMap[name];
      const norm = name.toLowerCase();
      // 2. partial match in ciclo map
      for (const [k, v] of Object.entries(_cicloMap)) {
        if (norm === k.toLowerCase()) return v;
      }
      // 3. edital disc.cor
      if (_editalData && Array.isArray(_editalData.disciplinas)) {
        const found = _editalData.disciplinas.find(d => d.nome && d.nome.toLowerCase() === norm);
        if (found && found.cor) return found.cor;
      }
      return FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
    }

    // Build SVG pie
    const CX=70, CY=70, R=58, RI=30; // donut hole
    let startAngle = -Math.PI/2; // start from top
    const HOVER_EXPAND = 6;

    const slices = entries.map((e, i) => {
      const angle  = (e.secs / total) * 2 * Math.PI;
      const end    = startAngle + angle;
      const large  = angle > Math.PI ? 1 : 0;
      const color  = _pizzaDiscColor(e.name, i);
      const pct    = Math.round((e.secs/total)*100);

      // Outer arc (donut)
      const x1 = CX + R*Math.cos(startAngle), y1 = CY + R*Math.sin(startAngle);
      const x2 = CX + R*Math.cos(end),        y2 = CY + R*Math.sin(end);
      const xi1= CX + RI*Math.cos(startAngle),yi1= CY + RI*Math.sin(startAngle);
      const xi2= CX + RI*Math.cos(end),        yi2= CY + RI*Math.sin(end);

      // Midangle for label positioning
      const mid = startAngle + angle/2;
      const lx  = CX + (R+HOVER_EXPAND+4)*Math.cos(mid);
      const ly  = CY + (R+HOVER_EXPAND+4)*Math.sin(mid);

      const path = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${xi2.toFixed(2)} ${yi2.toFixed(2)} A ${RI} ${RI} 0 ${large} 0 ${xi1.toFixed(2)} ${yi1.toFixed(2)} Z`;

      const result = { path, color, pct, name: e.name, secs: e.secs, mid, i };
      startAngle = end;
      return result;
    });

    const totalH = fmtH(total);

    // Abbreviador de nome de disciplina (ex: "Noções de Direito Administrativo" -> "Dir.Adm")
    const _abbrevMap = {
      'direito':'Dir','administrativo':'Adm','constitucional':'Const','penal':'Pen',
      'civil':'Civ','processual':'Proc','tributário':'Trib','tributario':'Trib',
      'empresarial':'Emp','trabalho':'Trab','previdenciário':'Prev','previdenciario':'Prev',
      'português':'Port','portuguesa':'Port','portugues':'Port','língua':'Ling','lingua':'Ling',
      'matemática':'Mat','matematica':'Mat','financeira':'Fin','informática':'Info','informatica':'Info',
      'raciocínio':'Rac','raciocinio':'Rac','lógico':'Lóg','logico':'Lóg',
      'atualidades':'Atual','história':'Hist','historia':'Hist','geografia':'Geo',
      'administração':'Adm','administracao':'Adm','pública':'Púb','publica':'Púb',
      'contabilidade':'Cont','economia':'Econ','estatística':'Est','estatistica':'Est',
      'redação':'Red','redacao':'Red','ética':'Ét','etica':'Ét','arquivologia':'Arq',
      'auditoria':'Aud','controle':'Ctrl','externo':'Ext','interno':'Int',
    };
    const _stop = new Set(['de','da','do','e','das','dos','a','o','em','para']);
    function abbrevDisc(name){
      let s = String(name||'').replace(/^Noções\s+de\s+/i,'').trim();
      const parts = s.split(/\s+/).filter(w => !_stop.has(w.toLowerCase()));
      const out = parts.map(w => {
        const key = w.toLowerCase().replace(/[.,;:]/g,'');
        if (_abbrevMap[key]) return _abbrevMap[key];
        return w.length <= 4 ? w : w.slice(0,4);
      });
      return out.slice(0,2).join('.') || s.slice(0,6);
    }

    const sliceSVG = slices.map(s => {
      const abbr = abbrevDisc(s.name).replace(/'/g,'');
      return `
      <path d="${s.path}" fill="${s.color}" opacity=".88"
            data-name="${abbr}" data-pct="${s.pct}" data-h="${fmtH(s.secs)}"
            style="cursor:pointer;transition:opacity .18s"
            onmouseenter="this.style.opacity='1';this.style.filter='drop-shadow(0 0 6px ${s.color}88)';document.getElementById('pizza-center-lbl').textContent='${s.pct}%';document.getElementById('pizza-center-sub').textContent='${abbr}';"
            onmouseleave="this.style.opacity='.88';this.style.filter='';document.getElementById('pizza-center-lbl').textContent='${totalH}';document.getElementById('pizza-center-sub').textContent='total';"
      ><title>${abbr} — ${fmtH(s.secs)} (${s.pct}%)</title></path>`;
    }).join('');

    const svgHTML = `<svg viewBox="-4 -4 148 148" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;overflow:visible">
      <defs>
        <filter id="pizzaGlow"><feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      ${sliceSVG}
      <!-- Center hole label -->
      <circle cx="${CX}" cy="${CY}" r="${RI-1}" fill="var(--surface-1)" />
      <text id="pizza-center-lbl" x="${CX}" y="${CY-2}" text-anchor="middle"
            font-size="14" font-weight="800" fill="var(--gold)" font-family="IBM Plex Mono,monospace">${totalH}</text>
      <text id="pizza-center-sub" x="${CX}" y="${CY+12}" text-anchor="middle"
            font-size="8" fill="rgba(255,255,255,.4)" font-weight="600" letter-spacing="1">total</text>
    </svg>`;

    const legendSorted = slices.slice().sort((a,b) => b.secs - a.secs);
    const legendHTML = legendSorted.map(s => {
      const abbr = abbrevDisc(s.name).replace(/'/g,'');
      return `
      <li class="pizza-legend-row" title="${abbr} — ${fmtH(s.secs)} (${s.pct}%)"
           onmouseenter="document.getElementById('pizza-center-lbl').textContent='${s.pct}%';document.getElementById('pizza-center-sub').textContent='${abbr}';"
           onmouseleave="document.getElementById('pizza-center-lbl').textContent='${totalH}';document.getElementById('pizza-center-sub').textContent='total';">
        <span class="pizza-legend-dot" style="background:${s.color}"></span>
        <span class="pizza-legend-abbr">${abbr}</span>
        <span class="pizza-legend-pct" style="color:${s.color}">${s.pct}%</span>
      </li>`;
    }).join('');

    $card.innerHTML = `
      <div class="dprem-card-hd" style="padding:10px 12px 8px">
        <div class="dprem-card-title">🍕 Tempo por Matéria</div>
        <span style="font-size:10px;color:var(--text-dim)">${entries.length} disc.</span>
      </div>
      <div class="pizza-body">
        <div class="pizza-chart-area">${svgHTML}</div>
        <ul class="pizza-legend-side">${legendHTML}</ul>
      </div>`;
  }


  function _editSession(id) {
    const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    const sess = sessions.find(function(s){ return s.id === id; });
    if (!sess || typeof StudyTimer === 'undefined') return;
    StudyTimer.openRegistroEdit(sess);
  }

  function _deleteSession(id) {
    if (!confirm('Deseja excluir esse registro?\n\nEssa ação não pode ser desfeita.')) return;
    const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    localStorage.setItem('nexus_sessions_v1', JSON.stringify(sessions.filter(function(s){ return s.id !== id; })));
    _renderHistoryCard();
    if (typeof Briefing !== 'undefined') Briefing.updateBadges();
  }

  return { dashboard, schedule, renderCronograma, curriculum, flashcards, errors, analysis, _renderPizzaCard, _renderConsistencyCard, _renderHistoryCard, _setConsistencyFilter, _filterHistoryByDate, _filterHistoryByDisc, _historySearch, _clearHistoryFilters, _toggleHistItem, _toggleDiscDetail, _sortDisc, _renderMetasCard, _renderWeeklyChartCard, _openMetasEditor, _closeMetasEditor, _saveMetas, _wcNav, _wcMode: _wcMode, _editSession, _deleteSession }
})();

/* ════════════════════════════════════════════════
   SCHEDULE MODULE — Cronograma Interactions
════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════
   SCHEDULE ENGINE — Motor Completo de Cronograma
   Modos: IA | Manual | Híbrido (IA + inline edit)
════════════════════════════════════════════════════════ */


const ScheduleEngine = (() => {

  const SCHED_KEY    = 'nexus_schedule_v1';
  const PHASE_COLORS = ['#E8B84B','#4D9FFF','#2ECC71','#A78BFA','#FF8C42'];
  const PHASE_ICONS  = ['📚','⚡','🎯','🔥','🏁'];

  let _data        = null;   // { fases: [...] }
  let _filterMateria = null; // active subject filter
  let _mode        = null;   // 'ia' | 'manual'
  let _activePhase = 0;      // 0-indexed
  let _isLoading   = false;
  let _loadingTimer = null;


  /* ── Legacy built-in schedule cleanup ── */
  function _loadBuiltIn() {
    // Only if no schedule exists yet
    const raw = localStorage.getItem(SCHED_KEY);
    if (raw) {
      try { const p = JSON.parse(raw); if (p?.data?.fases?.length) return false; } catch {}
    }
    return true; // needs built-in
  }
  /* ────────── Storage ────────── */
  function _load() {
    try {
      const raw = localStorage.getItem(SCHED_KEY);
      if (raw) { const p = JSON.parse(raw); _data = p.data; _mode = p.mode; }
    } catch { _data = null; }
  }

  function _save() {
    try {
      localStorage.setItem(SCHED_KEY, JSON.stringify({
        mode: _mode, savedAt: new Date().toISOString(), data: _data,
      }));
    } catch {}
  }

  function hasSchedule() { return !!(_data?.fases?.length); }

  /* ────────── Init (called by Router) ────────── */
  /* ── Legacy CFO-PMDF 50-Day Built-in Schedule (purged on init; kept only to identify old stored data) ── */
  const _CFO_PMDF_SCHEDULE = {"mode":"ia","savedAt":"2026-05-02T23:59:00.000Z","data":{"fases":[{"nome":"FASE 1 — ATAQUE","descricao":"02/05 a 15/05 · CPM e CPPM em foco intenso + todas as disciplinas","cor":"#E8B84B","dias":[{"dia":1,"data":"02/05 Sáb","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"novo","descricao":"› Parte Geral CPM: princípios e aplicação da lei penal militar\n› Crime militar próprio x impróprio (art. 9º CPM)\n› Crimes contra a pessoa (arts. 205–218)","questoes_meta":25,"roteiro":["0–30min: Leia arts. 1–15 CPM — conceito e aplicação da lei penal militar","30–80min: Art. 9º CPM — crime próprio x impróprio: resolva 25 questões CESPE","80–90min: Caderno: 'salvo disposição especial' = armadilha recorrente no CPM"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal Militar","tipo":"novo","descricao":"› Inquérito Policial Militar: instauração, autoridade e prazos (20/40 dias)\n› Competência da Justiça Militar — JMU x JME e PMDF","questoes_meta":20,"roteiro":["0–30min: Leia arts. 7–28 CPPM. Prazo: 20 dias (preso) / 40 dias (solto)","30–70min: IPM x IPO: resolva 20 questões — CESPE mistura prazos propositalmente","70–90min: PMDF = JMU (federal), não JME (estadual). Grave esta distinção"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Noções de Criminologia","tipo":"novo","descricao":"› Escola Clássica e Positivista\n› Teorias da criminalidade: anomia (Merton), etiquetamento (labeling) e controle social","questoes_meta":15,"roteiro":["0–30min: Escola Clássica (Beccaria) vs Positivista (Lombroso, Ferri)","30–60min: Merton: anomia. Chicago: desorganização social. Labeling: etiquetamento","60–90min: Resolva 15 questões CESPE sobre escolas criminológicas"]}]},{"dia":2,"data":"03/05 Dom","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Administração","tipo":"novo","descricao":"› Teorias clássicas: Taylor (administração científica), Fayol (14 princípios, PODC) e Weber…\n› Abordagem das Relações Humanas: Mayo/Hawthorne","questoes_meta":25,"roteiro":["0–40min: Taylor (eficiência) → Fayol (14 princípios + PODC) → Weber (burocracia ideal)","40–80min: Resolva 25 questões — CESPE cobra autores x conceitos cruzados","80–90min: MACETE: Hawthorne = produtividade sobe quando trabalhadores são observados"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Organização do Estado: federalismo, repartição de competências\n› Poder Executivo: estrutura e atribuições\n› Art. 42 CF — militares dos estados e DF","questoes_meta":20,"roteiro":["0–30min: Releia arts. 1–4, 37–42, 144 CF. Foco: militares DF + segurança pública","30–70min: Resolva 20 questões organização do Estado e poderes","70–90min: Pegadinha: art. 42 CF → militares estaduais NÃO têm estabilidade do art. 41"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Interpretação textual CESPE: pressupostos, inferências e linguagem implícita\n› Tipologia textual: narrativo, descritivo e dissertativo","questoes_meta":15,"roteiro":["0–20min: Estratégia CESPE: leia o enunciado ANTES do texto","20–60min: 15 questões de interpretação textual — foco nas inferências","60–90min: 'De acordo com o texto' = resposta literal. 'Depreende-se' = inferência"]}]},{"dia":3,"data":"04/05 Seg","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"novo","descricao":"› Crimes contra o patrimônio militar (arts. 240–250 CPM)\n› Crimes contra a Administração Militar: peculato militar, corrupção passiva e prevaricação militar","questoes_meta":25,"roteiro":["0–40min: Leia arts. 240–250 CPM (patrimônio) + arts. 303–340 CPM (administração militar)","40–80min: 25 questões — compare crimes militares com correspondentes do CP","80–90min: Peculato militar ≠ peculato CP: elemento diferenciador é o sujeito ativo"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Iter criminis: consumação, tentativa e desistência voluntária\n› Concurso de pessoas: autoria (direta/mediata/coautoria) e participação…","questoes_meta":20,"roteiro":["0–30min: Iter criminis: cogitação → preparação → execução → consumação → exaurimento","30–70min: 20 questões concurso de pessoas CESPE","70–90min: Autoria mediata: uso de inimputável como instrumento. CESPE adora"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Raciocínio Lógico","tipo":"novo","descricao":"› Lógica proposicional: conectivos, tabela-verdade, equivalências e Leis de De Morgan\n› Modus ponens e modus tollens","questoes_meta":20,"roteiro":["0–30min: Conectivos: negação, conjunção, disjunção, condicional, bicondicional","30–70min: 20 questões lógica proposicional — tabela-verdade e equivalências","70–90min: De Morgan: ¬(p∧q) = ¬p∨¬q. CESPE cobra exaustivamente"]}]},{"dia":4,"data":"05/05 Ter","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal Militar","tipo":"novo","descricao":"› Flagrante militar: espécies e procedimentos\n› Prisão preventiva e temporária militar\n› Liberdade provisória no processo penal militar","questoes_meta":25,"roteiro":["0–40min: Leia arts. 222–265 CPPM — flagrante militar x CPP: compare os prazos","40–80min: 25 questões prisões militares — CESPE mistura CPPM com CPP","80–90min: Flagrante militar: lavratura pelo Oficial Pm imediatamente superior"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal","tipo":"revisao","descricao":"› Ação penal: princípios e condições\n› Inquérito policial: natureza, dispensabilidade e arquivamento\n› Competência penal: ratione materiae, personae e loci","questoes_meta":20,"roteiro":["0–30min: IPO dispensável (art. 39 CPP) + ação penal pública x privada","30–70min: 20 questões ação penal e competência CESPE","70–90min: Teoria resultado: competência = onde o crime se consumou (art. 70 CPP)"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Legislação PMDF / DF","tipo":"novo","descricao":"› Estatuto dos Policiais Militares (Lei 7.289/84): hierarquia, postos/graduações, direitos e deveres\n› Peculiaridades do regime militar (sem greve, sindicato, estabilidade civil)","questoes_meta":20,"roteiro":["0–40min: Leia arts. 1–40 Lei 7.289/84. Grave: postos (oficiais) x graduações (praças)","40–80min: 25 questões estatuto — CESPE compara PM com servidor civil","80–90min: Fundamental: militar NÃO tem greve, sindicato, FGTS nem CLT"]}]},{"dia":5,"data":"06/05 Qua","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Noções de Criminologia","tipo":"novo","descricao":"› Vitimologia: conceitos e classificação das vítimas (Mendelsohn)\n› Prevenção criminal: modelos e políticas públicas — CPTED, Broken Windows e policiamento comunitário","questoes_meta":20,"roteiro":["0–30min: Vitimologia: vítima ideal vs precipitadora. Classificação de Mendelsohn","30–70min: Prevenção: primária (social), secundária (situacional), terciária (reabilitação)","70–90min: Broken Windows = tolerância zero + CPTED = desenho ambiental preventivo"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Administrativo","tipo":"novo","descricao":"› Ato administrativo: elementos (COMFIMOB), atributos (presunção de legitimidade,…","questoes_meta":25,"roteiro":["0–30min: 5 elementos: Competência, Finalidade, Forma, Motivo, Objeto","30–70min: 25 questões ato adm. — foco em vícios de competência e forma","70–90min: Revogação só pela Administração. Anulação: Adm ou Judiciário. CESPE cobra"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Inglesa","tipo":"revisao","descricao":"› Reading comprehension: main idea, supporting details, implicit meaning\n› Grammar in context: tenses, modal verbs and false cognates in legal/police texts","questoes_meta":15,"roteiro":["0–20min: Estratégia de leitura: skimming (ideia geral) + scanning (detalhe específico)","20–60min: 15 questões leitura em inglês — foco em vocabulário jurídico e policial","60–90min: False cognates: 'actually' = na verdade, 'eventually' = eventualmente"]}]},{"dia":6,"data":"07/05 Qui","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"novo","descricao":"› Crimes contra a incolumidade pública militar\n› Crimes contra a paz pública e a fé pública militar\n› Crimes contra a fé pública e a administração da Justiça Militar","questoes_meta":25,"roteiro":["0–40min: Leia arts. 260–302 CPM — crimes contra a incolumidade e paz pública","40–80min: 25 questões parte especial CPM","80–90min: Crimes militares x crimes comuns: critério do art. 9º ainda se aplica"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Direitos fundamentais: espécies, eficácia e aplicabilidade imediata (§ 1º art. 5º)\n› Controle de constitucionalidade: difuso (concreto) e concentrado (abstrato — ADI, ADC, ADPF)","questoes_meta":20,"roteiro":["0–30min: Releia art. 5º CF — remédios constitucionais: HC, MS, MI, HD, AP","30–70min: 20 questões controle de constitucionalidade e direitos fundamentais","70–90min: HC não protege PJ. MS é subsidiário: só quando não cabe HC/HD"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Direitos Humanos","tipo":"revisao","descricao":"› Sistemas internacionais de proteção: ONU (DUDH/1948) e OEA (CADH/Pacto São José)\n› EC 45/2004: status normativo dos tratados de DH — supralegal ou constitucional","questoes_meta":15,"roteiro":["0–30min: DUDH (ONU/1948) + CADH (OEA) + Corte IDH + Comissão IDH","30–70min: 20 questões sistemas ONU e OEA, mecanismos de proteção","70–90min: EC 45: tratados aprovados por 3/5 = emenda constitucional. Outros = supralegal"]}]},{"dia":7,"data":"08/05 Sex","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal Militar","tipo":"novo","descricao":"› Instrução criminal no CPPM: provas — interrogatório, testemunhas, peritos, reconhecimento\n› Recursos no processo penal militar: apelação e revisão criminal militar","questoes_meta":25,"roteiro":["0–40min: Leia arts. 301–380 CPPM — provas e instrução criminal militar","40–80min: 25 questões instrução e provas no CPPM vs CPP","80–90min: Confissão no CPPM: divide com prova, não vincula o juiz"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Administração","tipo":"novo","descricao":"› Liderança: teorias situacional, transformacional e transacional\n› Gestão por competências\n› Motivação: Maslow, Herzberg (higiênicos x motivacionais) e McGregor (X e Y)","questoes_meta":25,"roteiro":["0–40min: Maslow (5 necessidades) → Herzberg (higiênicos ≠ motivacionais) → McGregor (X=coercitivo)","40–80min: 25 questões motivação e liderança CESPE","80–90min: CESPE adora misturar autores: Herzberg motivacionais ≠ salário (higiênico)"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Dir. Penal","tipo":"revisao","descricao":"› Punibilidade: causas extintivas — prescrição (tabela), decadência, renúncia, perdão, anistia e…\n› Crimes contra a administração pública: peculato, corrupção, prevaricação","questoes_meta":20,"roteiro":["0–30min: Tabela de prescrição (art. 109 CP): penas máximas x prazos prescricionais","30–70min: 20 questões prescrição e crimes funcionais","70–90min: Peculato doloso x culposo: penas diferentes. Concussão x extorsão: exigir x constranger"]}]},{"dia":8,"data":"09/05 Sáb","blocos":[{"hora_inicio":"07:00","hora_fim":"11:00","materia":"Dir. Penal Militar","tipo":"simulado","descricao":"› MINI-SIMULADO CPM: 25 questões CESPE sobre Dir\n› Penal Militar — art. 9º, crimes contra hierarquia, penas e extinção da punibilidade\n› Condições sem consulta","questoes_meta":25,"roteiro":["0–37min: 25 questões cronometradas (1,5 min/q). Sem consulta","37–70min: Gabarito comentado — analise CADA erro","70–90min: Caderno de erros: qual artigo gerou cada erro?"]},{"hora_inicio":"11:30","hora_fim":"12:30","materia":"Dir. Proc. Penal Militar","tipo":"simulado","descricao":"› MINI-SIMULADO CPPM: 25 questões CESPE — IPM prazos, prisões militares, competência JMU x JME,…","questoes_meta":25,"roteiro":["0–37min: 25 questões cronometradas","37–70min: Gabarito + análise estatística por tópico","70–90min: Mapa mental: CPPM x CPP — institutos comparados"]},{"hora_inicio":"13:00","hora_fim":"14:30","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Resolução de questões CESPE: interpretação textual e armadilhas gramaticais\n› Análise de erros e padrões de pegadinhas em língua portuguesa","questoes_meta":15,"roteiro":["0–30min: 15 questões CESPE português — interpretação e gramática","30–60min: Revisão dos erros: qual regra foi violada?","60–90min: CESPE: sempre questione se a inferência é explícita ou implícita"]}]},{"dia":9,"data":"10/05 Dom","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Crimes hediondos (Lei 8.072/90): lista completa, inafiançabilidade e cumprimento de pena\n› Tráfico de drogas (Lei 11.343/06): arts. 28/33/35/40 — usuário x tráfico","questoes_meta":25,"roteiro":["0–30min: Memorize lista hediondos + art. 28 vs art. 33 Lei 11.343","30–70min: 25 questões crimes hediondos e tráfico CESPE","70–90min: Art. 28 ≠ crime inafiançável. Art. 33 = equiparado hediondo"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal","tipo":"revisao","descricao":"› Provas: licitude, ônus e meios de prova — interceptação telefônica (Lei 9.296/96)\n› Prisões cautelares: flagrante, preventiva, temporária e medidas alternativas (art. 319 CPP)","questoes_meta":20,"roteiro":["0–30min: Prova ilícita por derivação (frutos da árvore envenenada) — exceções STF","30–70min: 20 questões prisões e provas CESPE","70–90min: Preventiva: juiz NÃO decreta de ofício na investigação (art. 311 CPP)"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Segurança pública (art. 144 CF/88): órgãos, atribuições e subordinação\n› Forças Armadas: missão e competência\n› PMDF e sua base federal (Lei 6.450/77)","questoes_meta":20,"roteiro":["0–30min: Art. 144 CF: PM estaduais + PMDF. Art. 142: FA. Diferenças essenciais","30–70min: 20 questões segurança pública e forças militares","70–90min: PMDF = organizada pela União (art. 21, XIV CF), mas é do DF"]}]},{"dia":10,"data":"11/05 Seg","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"novo","descricao":"› Crimes militares próprios e impróprios: distinção e exemplos práticos\n› Deserção (art. 187 CPM — 8 dias) e abandono de posto (art. 195)\n› Insubordinação (art. 163)","questoes_meta":30,"roteiro":["0–40min: Art. 9º CPM: crime próprio (só militar) x impróprio (militar e civil)","40–80min: Deserção = ausência > 8 dias. CESPE testa exatamente o prazo","80–90min: Tabela: deserção (>8 dias) x ausência (até 8 dias). Penas diferentes"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Administrativo","tipo":"revisao","descricao":"› Licitação (Lei 14.133/21): modalidades — pregão, concorrência, concurso, leilão e diálogo…\n› Dispensa e inexigibilidade\n› Contratos administrativos: cláusulas exorbitantes","questoes_meta":25,"roteiro":["0–30min: 5 modalidades Lei 14.133 + contratação direta (dispensa x inexigibilidade)","30–70min: 25 questões licitações — CESPE cobra Lei 14.133 vs Lei 8.666 (revogada)","70–90min: Dispensa = possível licitar mas dispensou. Inexigibilidade = impossível licitar"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Raciocínio Lógico","tipo":"novo","descricao":"› Raciocínio quantitativo: sequências numéricas, progressões aritméticas e geométricas\n› Probabilidade: espaço amostral, eventos e cálculo básico","questoes_meta":20,"roteiro":["0–30min: PA: an = a1 + (n-1)d. PG: an = a1 × q^(n-1). Resolva exemplos","30–70min: 20 questões sequências e probabilidade CESPE","70–90min: Probabilidade = casos favoráveis / casos possíveis"]}]},{"dia":11,"data":"12/05 Ter","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Tribunal do Júri Militar: competência e procedimento\n› Execução penal militar: regimes, progressão e benefícios\n› Revisão criminal militar","questoes_meta":25,"roteiro":["0–40min: Leia arts. 438–500 CPPM — processo ordinário e especial","40–80min: 25 questões execução e tribunal militar","80–90min: JMU x JME: competência pelo quadro do agente, não pelo local do crime"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Noções de Criminologia","tipo":"revisao","descricao":"› Criminologia crítica e Direitos Humanos\n› Controle social formal (polícia, prisão, Judiciário) e informal (família, escola, religião)\n› Política criminal: abolicionism e garantismo","questoes_meta":20,"roteiro":["0–30min: Controle social formal x informal: funções e limites","30–70min: 20 questões criminologia crítica e política criminal","70–90min: Garantismo (Ferrajoli): 10 axiomas — CESPE já cobrou diretamente"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Legislação PMDF / DF","tipo":"novo","descricao":"› Lei de Organização da PMDF (Lei 6.450/77)\n› Regulamento Disciplinar PMDF: infrações e penalidades\n› LODF arts. 114–121: segurança pública no DF e órgãos","questoes_meta":20,"roteiro":["0–40min: LODF arts. 114–121: art. 117 = órgãos segurança pública. Art. 118 = PMDF. Art. 119 = PCDF","40–80min: 20 questões LODF segurança pública — CESPE adora arts. 117–119","80–90min: PMDF regulada pela Lei 6.450/77 (federal) + Lei 7.289/84 + Lei 14.751/2023"]}]},{"dia":12,"data":"13/05 Qua","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Administração","tipo":"revisao","descricao":"› Planejamento estratégico: missão, visão, valores e análise SWOT\n› Balanced Scorecard e indicadores de desempenho\n› PDCA: ciclo de melhoria contínua","questoes_meta":25,"roteiro":["0–40min: BSC: 4 perspectivas (financeira, clientes, processos, aprendizado)","40–80min: 25 questões planejamento e controle CESPE","80–90min: PDCA: Planejar→Fazer→Checar→Agir. Melhoria contínua (Deming)"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Processo legislativo: tipos de leis e procedimentos\n› Controle de constitucionalidade: ADI, ADC, ADPF — legitimidade ativa, efeitos e ação rescisória","questoes_meta":20,"roteiro":["0–30min: Processo legislativo: ordinário x sumário. Leis complementares x ordinárias","30–70min: 20 questões processo legislativo e controle abstrato","70–90min: ADI: plenário STF, 8 ministros, efeito erga omnes e ex tunc"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Inglesa","tipo":"revisao","descricao":"› Vocabulary in context: false cognates and police/legal terms\n› Comprehension: inferring meaning from complex texts — public security and law enforcement","questoes_meta":15,"roteiro":["0–20min: Vocabulário jurídico/policial: enforcement, jurisdiction, felony, misdemeanor","20–60min: 15 questões leitura em inglês com vocabulário especializado","60–90min: Grammar: passive voice para descrever procedimentos policiais"]}]},{"dia":13,"data":"14/05 Qui","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão sistematizada CPM: crimes mais cobrados pelo CESPE — art. 9º, penas militares (pena de…","questoes_meta":30,"roteiro":["0–40min: Releia arts. 9º, 55–67, 136–207 CPM (hierarquia e disciplina)","40–80min: 30 questões CPM parte especial — os mais cobrados em concursos PM","80–90min: Pena de morte: único caso no Brasil — em tempo de guerra (CPM art. 55, I)"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Crimes contra a vida: homicídio doloso, culposo e qualificadores\n› Lesão corporal: qualificadoras e causas de aumento\n› Crimes sexuais pós-Lei 12.015/09","questoes_meta":20,"roteiro":["0–30min: Homicídio qualificado (art. 121 §2º CP): motivo torpe, meio cruel, surpresa","30–70min: 20 questões crimes contra a pessoa e crimes sexuais","70–90min: Estupro de vulnerável: crime hediondo. Importunação sexual: NÃO hediondo"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Direitos Humanos","tipo":"revisao","descricao":"› DUDH de 1948: artigos mais cobrados\n› Pacto Internacional de Direitos Civis e Políticos e Pacto de Direitos Econômicos, Sociais e…","questoes_meta":15,"roteiro":["0–20min: DUDH: arts. 1–30. Foco: art. 3 (vida, liberdade, segurança), art. 10 (tribunal justo)","20–60min: 15 questões DUDH e Pactos da ONU","60–90min: Direitos civis/políticos = aplicação imediata. DESCs = progressividade"]}]},{"dia":14,"data":"15/05 Sex","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão sistematizada CPPM: procedimentos, prazos e recursos mais cobrados\n› Comparativo IPM x IPO: prazo, autoridade e conclusão\n› Extradição e cooperação militar","questoes_meta":30,"roteiro":["0–40min: Tabela comparativa: IPM x IPO — prazo, autoridade, arquivamento","40–80min: 30 questões CPPM — prazos, nulidades e recursos processuais militares","80–90min: IPM: 20 dias (preso) / 40 dias (solto). IPO: 10 dias (preso) / 30 dias (solto)"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal","tipo":"revisao","descricao":"› Prisão em flagrante: espécies (próprio, impróprio, presumido), lavratura e relaxamento\n› Medidas cautelares diversas da prisão (art. 319 CPP): rol e requisitos","questoes_meta":20,"roteiro":["0–30min: Flagrante próprio (em flagrante) x impróprio (logo após) x presumido (objeto)","30–70min: 20 questões prisões e cautelares alternativas CESPE","70–90min: Art. 319 CPP: 9 medidas cautelares alternativas — decorar o rol"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Coesão e coerência textual: mecanismos de referenciação (anáfora, catáfora, sinonímia)\n› Morfossintaxe: concordância verbal em casos especiais (sujeito coletivo, pronomes)","questoes_meta":20,"roteiro":["0–30min: Referenciação: anáfora (retoma) x catáfora (antecipa) x sinonímia","30–70min: 20 questões coesão + concordância verbal CESPE","70–90min: Sujeito coletivo: verbo no singular (regra geral) ou plural (ênfase nos membros)"]}]}]},{"nome":"FASE 2 — CONSOLIDAÇÃO","descricao":"16/05 a 29/05 · Varredura completa + 2 simulados","cor":"#4D9FFF","dias":[{"dia":15,"data":"16/05 Sáb","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Princípios da Administração Pública (art. 37 CF): LIMPE + implícitos\n› Direitos sociais: art. 6º–11 CF — conteúdo e eficácia\n› Emendas relevantes: EC 45, EC 103","questoes_meta":25,"roteiro":["0–30min: Releia art. 37 CF + princípios implícitos: proporcionalidade, moralidade, eficiência","30–70min: 25 questões administração pública e direitos sociais","70–90min: EC 103/2019 (Previdência): principais mudanças que afetam militares"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Administrativo","tipo":"revisao","descricao":"› Servidores públicos: regime estatutário, cargo/emprego/função\n› Direitos e deveres\n› Responsabilidade civil do Estado: teoria do risco administrativo vs. subjetiva","questoes_meta":25,"roteiro":["0–40min: Art. 37 §6º CF: responsabilidade objetiva (ação) x subjetiva (omissão)","40–80min: 25 questões responsabilidade civil do Estado — excludentes","80–90min: Caso fortuito e ato de terceiro EXCLUEM responsabilidade objetiva"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Regência verbal e nominal: casos mais cobrados pelo CESPE (obedecer A, aspirar A, visar A)\n› Crase: uso obrigatório, facultativo e proibido\n› Pontuação estratégica","questoes_meta":20,"roteiro":["0–30min: Regência verbal crítica: obedecer (exige prep.) x pagar/perdoar (não exige)","30–70min: 20 questões regência e crase CESPE","70–90min: Crase proibida: antes de verbo, antes de pronome, antes de masc. sem prep."]}]},{"dia":16,"data":"17/05 Dom","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Concurso de crimes: material (vários crimes/várias penas), formal (vários crimes/uma pena) e…\n› Dosimetria da pena: três fases e circunstâncias judiciais","questoes_meta":25,"roteiro":["0–30min: Concurso material: soma das penas. Formal: a mais grave + até metade","30–70min: 25 questões concurso de crimes e dosimetria","70–90min: Crime continuado ≠ concurso formal: mesmo modo de execução e condições"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Noções de Criminologia","tipo":"revisao","descricao":"› Teoria do etiquetamento (labeling approach) e suas implicações para o controle social\n› Criminologia ambiental: CPTED e teoria das atividades rotineiras","questoes_meta":20,"roteiro":["0–30min: Labeling: o crime é construção social. Estigma e carreiras criminosas","30–70min: 20 questões criminologia moderna CESPE","70–90min: CPTED: crime prevention through environmental design. 3 princípios"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Raciocínio Lógico","tipo":"revisao","descricao":"› Lógica de argumentação: validade e verdade\n› Diagramas lógicos: conjuntos e relações\n› Questões do tipo CESPE: raciocínio analítico com situações-problema","questoes_meta":20,"roteiro":["0–30min: Argumento válido: premissas verdadeiras → conclusão necessariamente verdadeira","30–70min: 20 questões lógica e diagramas CESPE","70–90min: Diagramas de Venn: 3 conjuntos — monte tabela de possibilidades"]}]},{"dia":17,"data":"18/05 Seg","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal","tipo":"revisao","descricao":"› Competência penal: fixação, perpetuação (perpetuatio jurisdictionis) e conflito de competência\n› Suspeição e impedimento do juiz\n› Conexão e continência","questoes_meta":25,"roteiro":["0–30min: Competência: lugar da consumação (art. 70 CPP) + conexão + continência","30–70min: 25 questões competência e processo penal CESPE","70–90min: Prevenção fixa competência quando critérios gerais são insuficientes"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão intensiva CPM: parte especial arts. 148–207 (crimes contra hierarquia e disciplina)\n› Aplicação subsidiária do CP ao CPM\n› Lei 9.099/95: inaplicabilidade","questoes_meta":25,"roteiro":["0–40min: Releia arts. 148–207 CPM: crimes de hierarquia e disciplina militar","40–80min: 25 questões parte especial CPM — os mais cobrados em concursos PM","80–90min: Lei 9.099/95: INAPLICÁVEL ao processo penal militar — CESPE cobra muito"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Inglesa","tipo":"revisao","descricao":"› Grammar for reading: passive voice, conditionals and relative clauses\n› Police reports and legal texts: technical reading strategies for law enforcement","questoes_meta":15,"roteiro":["0–20min: Voz passiva em inglês: be + past participle. Ex: 'The suspect was arrested'","20–60min: 15 questões gramática inglesa em contexto jurídico","60–90min: Relative clauses: who/that (pessoas) vs which/that (coisas)"]}]},{"dia":18,"data":"19/05 Ter","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão sistematizada CPPM: ação penal militar — ação pública incondicionada (regra)\n› Ministério Público Militar: atribuições e independência funcional","questoes_meta":25,"roteiro":["0–40min: Ação penal militar: pública incondicionada — MP Militar é o titular","40–80min: 25 questões ação penal e MP Militar CESPE","80–90min: MPM x MP estadual: competências distintas. MPM atua na JMU"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Legislação PMDF / DF","tipo":"revisao","descricao":"› Lei 9.455/97 (Tortura): configuração típica e penas\n› Lei 7.960/89 (Prisão Temporária): prazo, hipóteses e prorrogação\n› Improbidade (Lei 8.429/92 + Lei 14.230/21: só dolo)","questoes_meta":25,"roteiro":["0–30min: Tortura: sujeito ativo especial (agente público) ou qualquer um com vítima vulnerável","30–70min: 25 questões tortura + prisão temporária + improbidade","70–90min: REFORM 2021: improbidade = SÓ DOLO (Lei 14.230/21). Culpa não configura mais"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Direitos Humanos","tipo":"revisao","descricao":"› Sistema Interamericano: Comissão IDH (investigação) e Corte IDH (julgamento)\n› Casos brasileiros na CorteIDH: Guerrilha do Araguaia, Favela Nova Brasília e outros","questoes_meta":15,"roteiro":["0–20min: Comissão: recebe petições, recomendações. Corte: julgamento vinculante","20–60min: 15 questões sistema interamericano e responsabilidade do Brasil","60–90min: Brasil reconheceu competência contenciosa da CorteIDH em 1998"]}]},{"dia":19,"data":"20/05 Qua","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Administração","tipo":"revisao","descricao":"› Administração pública: princípios constitucionais e modelo gerencial (NPM)\n› Controle da Administração: interno (autotutela), externo (TCU/TCDF) e social (ouvidoria)","questoes_meta":25,"roteiro":["0–30min: Autotutela: poder de anular e revogar seus próprios atos (Súmulas 346 e 473 STF)","30–70min: 25 questões controle e administração pública CESPE","70–90min: TCU x TCDF: federal e distrital. Ambos fiscalizam PMDF"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Processo constitucional: ADI, ADC, ADPF — legitimidade ativa e efeitos\n› Jurisprudência STF recente: teses com repercussão geral aplicáveis à carreira policial","questoes_meta":20,"roteiro":["0–30min: ADI: 11 legitimados (art. 103 CF). ADC: só federal. ADPF: subsidiariedade","30–70min: 20 questões controle concentrado e jurisprudência STF","70–90min: Efeito vinculante: obriga todos os órgãos judiciais e executivos"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Dir. Penal","tipo":"revisao","descricao":"› Crimes sexuais (pós-Lei 12.015/09): vulnerabilidade, estupro e importunação\n› Violência doméstica (Lei 11.340/06): formas, medidas protetivas e PMDF como agente","questoes_meta":20,"roteiro":["0–30min: Maria da Penha: art. 41 — não aplica Lei 9.099. Ação pública incondicionada (STJ Súm. 542)","30–70min: 20 questões crimes sexuais e violência doméstica","70–90min: Violência doméstica: pode ser qualquer pessoa da família, não só cônjuge"]}]},{"dia":20,"data":"21/05 Qui","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Pontuação: vírgula (regras e proibições), ponto e vírgula, dois-pontos\n› Sintaxe de período composto: subordinação substantiva, adjetiva e adverbial","questoes_meta":20,"roteiro":["0–30min: Vírgula: PROIBIDA entre sujeito e verbo e entre verbo e complemento (sem adj.)","30–70min: 20 questões pontuação e subordinação CESPE","70–90min: CESPE: 'a qual' introduz oração adjetiva restritiva ou explicativa?"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Administrativo","tipo":"revisao","descricao":"› Desapropriação: tipos (utilidade pública, interesse social, confisco), procedimento e indenização\n› Bens públicos: classificação, uso e alienação","questoes_meta":20,"roteiro":["0–30min: Desapropriação: competência declaratória (qualquer ente) x executória (pode ser delegada)","30–70min: 20 questões bens públicos e desapropriação CESPE","70–90min: Bens de uso especial (repartições) x bens dominicais (alienáveis)"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Raciocínio Lógico","tipo":"revisao","descricao":"› Raciocínio analítico: diagramas lógicos, conjuntos e contagem — permutações, arranjos e combinações\n› Questões-tipo CESPE: resolução comentada e padrões de erro","questoes_meta":20,"roteiro":["0–30min: Permutação = n! Arranjo = n!/(n-p)! Combinação = n!/p!(n-p)!","30–70min: 20 questões análise combinatória e diagramas CESPE","70–90min: Monte sempre a tabela de possibilidades para questões matriciais"]}]},{"dia":21,"data":"22/05 Sex","blocos":[{"hora_inicio":"07:00","hora_fim":"11:00","materia":"Dir. Constitucional","tipo":"simulado","descricao":"› 1º SIMULADO COMPLETO — 80 questões CESPE em condições reais\n› Inicie no horário da prova\n› Sem pausas longas","questoes_meta":80,"roteiro":["0–240min: 80 questões cronometradas. Simule condição exata: silêncio, sem consulta","240–300min: Análise estatística: % de acerto por disciplina","300–360min: Identifique as 3 disciplinas com maior índice de erro para priorizar"]},{"hora_inicio":"11:30","hora_fim":"12:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão pós-simulado: erros em questões de Dir\n› Análise do caderno de erros — CPM é disciplina crítica","questoes_meta":0,"roteiro":["0–30min: Reclassifique cada erro de CPM: foi conceito, artigo ou pegadinha?","30–60min: Releia os artigos que geraram erro","60–90min: Flashcards: transforme cada erro em uma pergunta ativa"]},{"hora_inicio":"13:00","hora_fim":"14:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão pós-simulado: erros em questões de Dir\n› Comparação de prazos e procedimentos CPPM x CPP","questoes_meta":0,"roteiro":["0–30min: Reclassifique erros CPPM: prazo, procedimento ou competência?","30–60min: Tabela comparativa: IPM x IPO atualizada com seus erros","60–90min: Planejamento: tópicos prioritários para as próximas 2 semanas"]}]},{"dia":22,"data":"23/05 Sáb","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão sistematizada pós-simulado: mapa mental CPM completo\n› Flash cards dos crimes militares mais cobrados — elementos do tipo, sujeito ativo e pena","questoes_meta":25,"roteiro":["0–40min: Mapa mental: Parte Geral CPM → Parte Especial (crimes mais cobrados)","40–80min: Flash cards: 25 crimes militares — frente (crime) / verso (artigo + pena)","80–90min: Simulação oral: conceito do crime militar em 30 segundos"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão sistematizada CPPM: fluxograma do IPM completo\n› Prazos processuais militares em tabela comparativa\n› Nulidades absolutas e relativas no CPPM","questoes_meta":20,"roteiro":["0–40min: Fluxograma IPM: instauração → instrução → relatório → conclusão","40–80min: Tabela de prazos: prisão, flagrante, instrução, recurso","80–90min: Nulidades: princípio do prejuízo — sem prejuízo não há nulidade"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Administração","tipo":"revisao","descricao":"› Revisão: gestão de pessoas — teorias de motivação em quadro comparativo\n› Escola das Relações Humanas: Mayo, Maslow, Herzberg, McGregor e Vroom","questoes_meta":20,"roteiro":["0–30min: Quadro: autor x teoria x aplicação prática em gestão PM","30–70min: 20 questões teorias motivacionais CESPE","70–90min: Vroom: motivação = valência x instrumentalidade x expectativa (V×I×E)"]}]},{"dia":23,"data":"24/05 Dom","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Extinção da punibilidade: decadência, prescrição retroativa e intercorrente\n› Crimes contra a fé pública: falsidade documental e ideológica — distinções CESPE","questoes_meta":25,"roteiro":["0–30min: Prescrição retroativa: conta da denúncia para trás. Intercorrente: entre marcos","30–70min: 25 questões extinção da punibilidade e crimes contra a fé pública","70–90min: Falsidade ideológica (art. 299): conteúdo falso. Documental (art. 297): doc. material"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Noções de Criminologia","tipo":"revisao","descricao":"› Criminologia e política criminal: minimalismo (Baratta), garantismo (Ferrajoli) e abolicionismo…\n› Função da pena: retributiva, preventiva e ressocializadora","questoes_meta":20,"roteiro":["0–30min: Garantismo: 10 axiomas de Ferrajoli — nullum crimen sine lege...","30–70min: 20 questões política criminal e funções da pena","70–90min: Funções da pena: retributiva (castigo), preventiva (geral/especial), ressocializadora"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Semântica: polissemia, homonímia, paronímia, sinonímia e antonímia\n› Figuras de linguagem mais cobradas pelo CESPE: metáfora, metonímia, eufemismo e ironia","questoes_meta":20,"roteiro":["0–20min: Parônimos: emergir/imergir, descriminar/discriminar, flagrante/fragrante","20–60min: 20 questões semântica e figuras de linguagem CESPE","60–90min: CESPE usa figuras de linguagem para contextualizar questões de interpretação"]}]},{"dia":24,"data":"25/05 Seg","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal","tipo":"revisao","descricao":"› Recursos no CPP: apelação (art. 593), RESE (art. 581), embargos de declaração e carta testemunhável\n› Revisão criminal e habeas corpus: distinções práticas","questoes_meta":25,"roteiro":["0–30min: RESE: rol taxativo (art. 581 CPP) — hipóteses que CESPE mais cobra","30–70min: 25 questões recursos e HC no processo penal","70–90min: HC: liberdade de locomoção. MS: outro direito líquido e certo"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Língua Inglesa","tipo":"revisao","descricao":"› English for law enforcement: key terminology — arrest, custody, warrant, evidence, prosecution\n› Reading: news articles on police and public safety","questoes_meta":15,"roteiro":["0–20min: Glossário PM: officer = agente, sheriff = delegado, warrant = mandado judicial","20–60min: Leia 2 textos em inglês sobre segurança pública (20 min cada)","60–90min: 15 questões inglês com vocabulário especializado"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Legislação PMDF / DF","tipo":"revisao","descricao":"› Lei 11.343/06: tráfico, uso e causas de diminuição (art. 33 §4º)\n› Lei 10.826/03 (Estatuto do Desarmamento): porte e posse — distinções e punições","questoes_meta":20,"roteiro":["0–30min: Art. 33 §4º: causa de diminuição (1/6 a 2/3) para traficante primário","30–70min: 20 questões drogas + desarmamento CESPE","70–90min: Porte ilegal x posse ilegal: porte = fora do domicílio. Posse = dentro"]}]},{"dia":25,"data":"26/05 Ter","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Direitos e garantias fundamentais: remédios constitucionais (HC, MS, MI, HD, AP)\n› Habeas corpus: hipóteses de cabimento, legitimidade e procedimento","questoes_meta":25,"roteiro":["0–30min: HC: coação ilegal ou ameaça à liberdade de locomoção. Art. 5º LXVIII CF","30–70min: 25 questões remédios constitucionais CESPE","70–90min: HC preventivo: salvo-conduto. HC suspensivo/repressivo: relaxamento"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Administração","tipo":"revisao","descricao":"› Gestão por resultados: indicadores de desempenho e metas\n› Orçamento público: LOA, LDO e PPA — estrutura e vinculações\n› GESPÚBLICA e seus instrumentos","questoes_meta":20,"roteiro":["0–30min: PPA (4 anos) → LDO (anual, metas/diretrizes) → LOA (execução)","30–70min: 20 questões orçamento público e gestão por resultados","70–90min: GESPÚBLICA: modelo de excelência em gestão pública (MEGP)"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Raciocínio Lógico","tipo":"revisao","descricao":"› Revisão raciocínio lógico: todos os tipos de questão CESPE\n› Resolução de 30 questões cronometradas com análise de desempenho e padrões de erro","questoes_meta":30,"roteiro":["0–45min: 30 questões RL cronometradas (1,5 min/q)","45–75min: Correção comentada — classifique erros por tipo","75–90min: Identifique seu pior subtópico em RL para revisão final"]}]},{"dia":26,"data":"27/05 Qua","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão intensiva CPM: crimes praticados por civis perante a Justiça Militar\n› Jurisprudência STM: entendimentos recentes sobre crime militar e Justiça Militar","questoes_meta":25,"roteiro":["0–40min: Civis e JMU: hipóteses do art. 9º, III CPM — crime contra FA ou instituição militar","40–80min: 25 questões jurisprudência STM e crimes por civis","80–90min: STM Súm. 9: crime de deserção consuma-se com o decurso do prazo de 8 dias"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Direitos Humanos","tipo":"revisao","descricao":"› Grupos vulneráveis: mulheres (CEDAW), crianças (CDC-ONU), indígenas (Convenção 169 OIT) e…\n› Política de Igualdade Racial","questoes_meta":20,"roteiro":["0–30min: CEDAW (mulheres) + CDC (crianças) + Convenção 169 OIT (indígenas)","30–70min: 20 questões grupos vulneráveis e políticas de DH","70–90min: CDPD tem status constitucional no Brasil (aprovada com 3/5 em 2 turnos)"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Dir. Administrativo","tipo":"revisao","descricao":"› Serviços públicos: conceito, classificação (exclusivos x não exclusivos), concessão, permissão e…\n› Agências reguladoras: autonomia e poder normativo","questoes_meta":20,"roteiro":["0–30min: Concessão: somente para pessoas jurídicas, licitação obrigatória","30–70min: 20 questões serviços públicos e agências reguladoras CESPE","70–90min: Princípios do serviço público: continuidade, universalidade, modicidade"]}]},{"dia":27,"data":"28/05 Qui","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão final CPPM: ação penal militar, MP Militar e instâncias recursais\n› Execução penal militar: progressão de regime e incidentes","questoes_meta":25,"roteiro":["0–40min: Recursos CPPM: apelação, embargos, revisão criminal militar","40–80min: 25 questões recursos e execução penal militar","80–90min: Execução penal militar: regulada pela LEP, mas com especificidades militares"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Crimes funcionais: peculato (art. 312), concussão (art. 316), corrupção passiva (art. 317) e…\n› Lei 13.869/19 (Abuso de Autoridade): dolo específico","questoes_meta":25,"roteiro":["0–30min: Peculato: doloso (reclusão 2–12 a) x culposo (detenção 3m–1a)","30–70min: 25 questões crimes funcionais e abuso de autoridade CESPE","70–90min: Abuso de autoridade: exige DOLO ESPECÍFICO (prejudicar). Sem dolo = não crime"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Revisão final regência e crase: resolução de 30 questões CESPE\n› Mecanismos de coesão referencial e sequenciação textual para a prova discursiva","questoes_meta":25,"roteiro":["0–30min: 30 questões regência verbal/nominal + crase CESPE cronometradas","30–60min: Correção comentada — classifique erros por subtópico","60–90min: Técnica de redação: tese clara, argumentos desenvolvidos, conclusão coerente"]}]},{"dia":28,"data":"29/05 Sex","blocos":[{"hora_inicio":"07:00","hora_fim":"11:00","materia":"Dir. Constitucional","tipo":"simulado","descricao":"› 2º SIMULADO COMPLETO — 80 questões CESPE em condições reais de prova\n› Compare com o 1º simulado: quais disciplinas evoluíram? Quais mantêm mais erros?","questoes_meta":80,"roteiro":["0–240min: 80 questões cronometradas no horário da prova. Sem pausas","240–300min: Análise: % de acerto por disciplina vs resultado do Simulado 1","300–360min: Revisão cirúrgica: top 3 tópicos com mais erro"]},{"hora_inicio":"11:30","hora_fim":"12:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Revisão pós-simulado Dir\n› Penal: jurisprudência STF/STJ mais cobrada\n› Teses aplicadas ao concurso CFO PMDF — prescrição, crimes em espécie e dosimetria","questoes_meta":0,"roteiro":["0–30min: Reclassifique erros DP: lei, jurisprudência ou aplicação?","30–60min: Leia as teses relevantes: STF tema x, STJ Súmulas aplicáveis","60–90min: Caderno de erros: transforme cada erro em questão-flashcard"]},{"hora_inicio":"13:00","hora_fim":"14:30","materia":"Dir. Administrativo","tipo":"revisao","descricao":"› Revisão pós-simulado Dir\n› Mapa mental: ato administrativo, licitação, responsabilidade civil e improbidade em uma só página","questoes_meta":0,"roteiro":["0–30min: Mapa mental A4: ato adm. (5 elem.) + licitação (5 mod.) + responsabilidade + improbidade","30–60min: 20 questões nos tópicos com mais erro do simulado","60–90min: Planejamento fase 3: prioridades das próximas 2 semanas"]}]}]},{"nome":"FASE 3 — REVISÃO INTENSIVA","descricao":"30/05 a 08/06 · Revisão profunda + simulado com redação","cor":"#2ECC71","dias":[{"dia":29,"data":"30/05 Sáb","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Noções de Criminologia","tipo":"revisao","descricao":"› Revisão geral Criminologia: quadro-síntese de todas as escolas — Clássica, Positivista,…\n› Resolução de questões CESPE","questoes_meta":30,"roteiro":["0–30min: Quadro-síntese: escola → principal teórico → conceito central → ano","30–80min: 30 questões criminologia CESPE — foco nas escolas mais cobradas","80–90min: Labeling: o sistema cria o criminoso. CESPE cobra a consequência política"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Administração","tipo":"revisao","descricao":"› Revisão: teorias X e Y de McGregor, ERG de Alderfer, VIE de Vroom\n› Gestão da qualidade: TQM, ISO 9001 e GESPÚBLICA\n› Indicadores de desempenho","questoes_meta":25,"roteiro":["0–30min: ERG: Existence, Relatedness, Growth (3 grupos x 5 de Maslow)","30–70min: 25 questões teorias motivação e gestão da qualidade","70–90min: ISO 9001: foco no cliente, melhoria contínua, processo. 7 princípios"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Raciocínio Lógico","tipo":"revisao","descricao":"› Revisão total raciocínio lógico: lógica proposicional, diagramas, quantitativa e probabilidade\n› Resolução de 30 questões CESPE comentadas — padrões de armadilha","questoes_meta":30,"roteiro":["0–45min: 30 questões RL mistas cronometradas","45–75min: Correção e análise: qual subtópico ainda gera mais erro?","75–90min: Estratégia: em RL, monte sempre a tabela de possibilidades antes de responder"]}]},{"dia":30,"data":"31/05 Dom","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão total CPM: flash cards de todos os crimes da Parte Especial\n› Simulação oral: 30 conceitos em 30 segundos cada\n› Jurisprudência STM recente","questoes_meta":30,"roteiro":["0–40min: Flash cards Parte Especial CPM: crime → artigo → pena → peculiaridade","40–80min: 30 questões CPM alta dificuldade — jurisprudência STM","80–90min: Crimes militares x crimes comuns: quando o CPM prevalece sobre o CP"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão total CPPM: fluxograma processual completo do início ao fim\n› Questões CESPE resolvidas: IPM, julgamento militar e execução","questoes_meta":30,"roteiro":["0–40min: Fluxograma completo: IPM → denúncia → instrução → sentença → recursos → execução","40–80min: 30 questões CPPM processo completo","80–90min: Compare: tempo de IPM (20/40d) x tempo de instrução x prescrição militar"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Direitos Humanos","tipo":"revisao","descricao":"› Revisão: Sistema Global ONU e Sistema Regional OEA — órgãos, mecanismos e tratados\n› Relatores especiais e monitoramento periódico universal (UPR)","questoes_meta":20,"roteiro":["0–30min: ONU: Conselho DH + Comitê DH + Relatores Especiais (temáticos/países)","30–70min: 20 questões sistemas DH CESPE","70–90min: UPR: revisão periódica universal — Brasil é revisado a cada 4,5 anos"]}]},{"dia":31,"data":"01/06 Seg","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Revisão final Dir\n› Constitucional: princípios constitucionais, organização do Estado e art. 42 CF\n› Emendas constitucionais relevantes: EC 45, EC 80, EC 103","questoes_meta":30,"roteiro":["0–40min: Art. 5º CF: 78 incisos — releia os mais cobrados e os menos óbvios","40–80min: 30 questões Dir. Constitucional alta dificuldade","80–90min: Art. 42: militares estaduais têm seus próprios estatutos. Sem estabilidade art. 41"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Administrativo","tipo":"revisao","descricao":"› Revisão final Dir\n› Administrativo: responsabilidade civil e agentes públicos\n› Controle externo: TCU/TCDF e Ministério Público","questoes_meta":25,"roteiro":["0–30min: Lei 14.230/21: improbidade = SÓ DOLO. Afastou culpa. CESPE JÁ COBROU","30–70min: 25 questões responsabilidade, controle e improbidade CESPE","70–90min: TCU: controle externo federal. TCDF: controle externo do DF. Ambos fiscalizam PMDF"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Inglesa","tipo":"revisao","descricao":"› Final review: grammar patterns most tested in CESPE — conditional sentences, passive voice and…\n› Reading practice: police procedures texts","questoes_meta":15,"roteiro":["0–20min: Condicionais: Type 1 (real), Type 2 (hipotético), Type 3 (impossível)","20–60min: Leia 2 textos jurídicos em inglês (20 min cada) — skimming primeiro","60–90min: 15 questões inglês — foco em estrutura gramatical e vocabulário"]}]},{"dia":32,"data":"02/06 Ter","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Revisão final Dir\n› Penal: teoria do crime (fato típico, ilicitude, culpabilidade) e crimes em espécie mais cobrados\n› Legislação penal extravagante: ECA, CDC e drogas","questoes_meta":30,"roteiro":["0–40min: Teoria do crime: fato típico (conduta+resultado+nexo+tipicidade) → ilicitude → culpabilidade","40–80min: 30 questões Dir. Penal alta dificuldade","80–90min: ECA art. 103: ato infracional = conduta análoga a crime ou contravenção"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal","tipo":"revisao","descricao":"› Revisão final Dir\n› Penal: procedimentos comuns (ordinário, sumário, sumaríssimo), recursos e execução penal\n› Questões CESPE de alto nível","questoes_meta":25,"roteiro":["0–30min: Procedimento ordinário: pena > 4 anos. Sumário: pena 2–4 anos. Sumaríssimo: < 2 anos","30–70min: 25 questões procedimentos e recursos DPP","70–90min: Execução penal: LEP — progressão, livramento condicional e saídas temporárias"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Legislação PMDF / DF","tipo":"revisao","descricao":"› Revisão final: legislação institucional PMDF — Lei 7.289/84, Lei 6.450/77, Lei 12.086/09 e LODF\n› Código de ética e deontologia policial militar","questoes_meta":20,"roteiro":["0–30min: Lei 14.751/2023 (Lei Orgânica Nacional das PMs): principais artigos","30–70min: 20 questões legislação PMDF — foco nos artigos cobrados em concursos PM anteriores","70–90min: Hierarquia PMDF: Soldado → Cabo → Sgt → Subten → Asp → 2ºTen → ... → Cel"]}]},{"dia":33,"data":"03/06 Qua","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão final CPM: CPM x CP comum — diferenças e critérios de aplicação\n› Casos práticos CESPE: quando aplicar o CPM e quando o CP prevalece","questoes_meta":30,"roteiro":["0–40min: Art. 9º CPM: critério do sujeito ativo + da qualidade + do lugar + do tempo de guerra","40–80min: 30 questões CPM x CP — casos práticos que CESPE usa","80–90min: Princípio da especialidade: CPM prevalece sobre CP quando há norma específica"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão final CPPM: aplicação subsidiária do CPP\n› Casos práticos: quando o CPPM resolve e quando aplica o CPP supletivamente","questoes_meta":25,"roteiro":["0–40min: CPPM art. 3º: aplicação subsidiária do CPP naquilo que não contrariar","40–80min: 25 questões CPPM x CPP — aplicação subsidiária","80–90min: Nulidade no CPPM: princípio do prejuízo + convalidação x declaração"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Revisão final Língua Portuguesa: ortografia, morfossintaxe e técnica de interpretação CESPE\n› Estrutura da redação dissertativa para a prova discursiva","questoes_meta":20,"roteiro":["0–20min: Ortografia: palavras que mudam com o Acordo Ortográfico 2016","20–60min: 20 questões interpretação + gramática CESPE","60–90min: Redação dissertativa: tese (1 parágrafo) + argumentos (2–3) + conclusão"]}]},{"dia":34,"data":"04/06 Qui","blocos":[{"hora_inicio":"07:00","hora_fim":"11:00","materia":"Dir. Constitucional","tipo":"simulado","descricao":"› 3º SIMULADO COMPLETO — 80 questões CESPE + REDAÇÃO DISSERTATIVA (30 linhas)\n› Condições 100% reais: 5 horas totais, mesmas condições do dia 14/06","questoes_meta":80,"roteiro":["0–240min: 80 questões objetivas cronometradas — sem pausas longas","240–300min: Redação dissertativa: texto de 15–30 linhas sobre conhecimentos específicos","300–360min: Análise: acertos por disciplina e gestão do tempo. Onde perdeu mais tempo?"]},{"hora_inicio":"11:30","hora_fim":"12:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Análise pós-simulado: desempenho em conhecimentos específicos militares\n› Identificar lacunas para revisão nos dias finais antes da prova","questoes_meta":0,"roteiro":["0–30min: Estatística: % acerto CPM + CPPM vs meta de 60%","30–60min: Releia os 5 artigos do CPM que mais geraram erro","60–90min: Flash cards de emergência: pontos críticos para os últimos 10 dias"]},{"hora_inicio":"13:00","hora_fim":"14:30","materia":"Administração","tipo":"revisao","descricao":"› Análise pós-simulado: desempenho em Administração e conhecimentos básicos\n› Revisão prioritária dos tópicos ainda não dominados","questoes_meta":0,"roteiro":["0–30min: Estatística: % acerto ADM + RL + LP vs meta de 60%","30–60min: Priorize: quais tópicos valem mais questões e têm menor % de acerto?","60–90min: Montar plano dos últimos 10 dias baseado nos gaps identificados"]}]},{"dia":35,"data":"05/06 Sex","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Revisão total Língua Portuguesa: todos os tópicos em flash review\n› Prática de redação dissertativa: escreva 1 texto completo em 60 minutos","questoes_meta":20,"roteiro":["0–30min: Flash review: interpretação → coesão → concordância → regência → crase → pontuação","30–90min: Escreva 1 redação dissertativa completa (30 linhas) sobre segurança pública","90–90min: Autocorrect: use a grade de correção CESPE para avaliar seu texto"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Noções de Criminologia","tipo":"revisao","descricao":"› Pontos críticos Criminologia: o que mais cai no CESPE — escolas, teorias, prevenção e controle…\n› Conceitos-chave: crime, criminoso, vítima","questoes_meta":25,"roteiro":["0–30min: Os 5 tópicos de criminologia mais cobrados: escolas + labeling + vitimologia + prevenção + controle social","30–70min: 25 questões criminologia alta dificuldade","70–90min: Criminologia x Direito Penal: a criminologia descreve, o DP prescreve"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Direitos Humanos","tipo":"revisao","descricao":"› Pontos críticos Direitos Humanos: dimensões (gerações) dos direitos, tratados e eficácia\n› CEDAW, CDC, CDPD e casos brasileiros na CorteIDH","questoes_meta":20,"roteiro":["0–20min: 1ª geração (civis/políticos) → 2ª (sociais) → 3ª (solidariedade) → 4ª (democracia)","20–60min: 20 questões DH gerações + tratados + casos CorteIDH","60–90min: Brasil: 4 casos condenados na CorteIDH — memorize os principais"]}]},{"dia":36,"data":"06/06 Sáb","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Flash review Dir\n› Constitucional: 50 pontos críticos em 2 horas\n› Questões CESPE de alto nível de dificuldade — jurisprudência e casos concretos","questoes_meta":30,"roteiro":["0–40min: Flash review: 50 artigos críticos CF/88 em 40 min (48 seg/artigo)","40–80min: 30 questões Dir. Constitucional nível avançado","80–90min: STF: teses com repercussão geral aplicáveis à carreira policial e militar"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Administração","tipo":"revisao","descricao":"› Flash review Administração: teorias clássicas, relações humanas, sistêmica e contingencial\n› Gestão de pessoas e qualidade. 20 questões CESPE","questoes_meta":20,"roteiro":["0–30min: Quadro das 8 teorias: clássica → RH → estruturalista → sistêmica → contingencial","30–70min: 20 questões administração alta dificuldade","70–90min: Teoria contingencial: não há uma forma ideal — depende do contexto"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Raciocínio Lógico","tipo":"revisao","descricao":"› Revisão final RL: resolução de 30 questões cronometradas\n› Análise de desempenho: identificar e eliminar pontos fracos restantes","questoes_meta":30,"roteiro":["0–45min: 30 questões RL cronometradas — todos os subtipos","45–75min: Correção: classifique erros por subtópico","75–90min: Estratégia de prova: em caso de dúvida em RL, elimine alternativas extremas"]}]},{"dia":37,"data":"07/06 Dom","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Flash review Dir\n› Penal: Parte Geral completa — iter criminis, concurso, penas, extinção\n› Revisão: crimes mais cobrados e jurisprudência STF/STJ","questoes_meta":30,"roteiro":["0–40min: Flash review Parte Geral CP: teoria do crime → penas → extinção punibilidade","40–80min: 30 questões Dir. Penal alta dificuldade — jurisprudência STF/STJ","80–90min: Súmulas STJ aplicadas ao DP: decorar as mais cobradas (Súm. 172, 243, 444)"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão final CPM: quadro comparativo de crimes militares com correspondentes no CP\n› Últimas questões CESPE e casos de provas PM anteriores","questoes_meta":25,"roteiro":["0–40min: Tabela: crime CP → correspondente CPM → diferença essencial","40–80min: 25 questões CPM — provas PM reais dos últimos 5 anos","80–90min: Pena de morte CPM: único caso no sistema penal brasileiro — art. 55, I"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão final CPPM: procedimentos, prazos e institutos mais cobrados\n› Resolução de 20 questões CESPE — casos práticos e comparações CPP x CPPM","questoes_meta":20,"roteiro":["0–40min: Flashcards finais CPPM: prazo IPM, flagrante, prisão preventiva, recursos","40–80min: 20 questões CPPM casos práticos","80–90min: JMU competência PMDF: fato cometido por PM do DF vai para JMU (federal)"]}]},{"dia":38,"data":"08/06 Seg","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Proc. Penal","tipo":"revisao","descricao":"› Flash review DPP: procedimentos, prisões e recursos\n› Resolução de 20 questões CESPE de alto nível — jurisprudência STJ/STF aplicada","questoes_meta":20,"roteiro":["0–30min: Flash review DPP: IPO → ação penal → instrução → sentença → recursos","30–70min: 20 questões DPP jurisprudência STJ/STF","70–90min: STJ Súm. 543: preventiva não pode ser base exclusiva para prisão domiciliar"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Administrativo","tipo":"revisao","descricao":"› Flash review Dir\n› Administrativo: princípios, atos e licitação em diagrama mental\n› Resolução de 20 questões CESPE — pontos críticos da carreira policial militar","questoes_meta":20,"roteiro":["0–30min: Diagrama mental DA: LIMPE → ato adm. → poderes → responsabilidade → licitação","30–70min: 20 questões DA alta dificuldade — pontos críticos para PMDF","70–90min: Lei 14.133/21 vs Lei 8.666: CESPE pode cobrar ambas durante a transição"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Inglesa","tipo":"revisao","descricao":"› Last review Língua Inglesa: os padrões gramaticais mais testados e vocabulário jurídico/policial\n› Practice reading: 3 textos jurídicos (20 min cada)","questoes_meta":15,"roteiro":["0–20min: Review: tenses, modals, conditionals, relative clauses","20–60min: Leia 3 textos: legislação, relatório policial e notícia de segurança pública","60–90min: 15 questões inglês — foco nos pontos mais cobrados em concursos PM"]}]}]},{"nome":"FASE 4 — BLINDAGEM","descricao":"09/06 a 13/06 · Simulado real + flash review + descanso","cor":"#FF8C42","dias":[{"dia":39,"data":"09/06 Ter","blocos":[{"hora_inicio":"07:00","hora_fim":"11:00","materia":"Dir. Constitucional","tipo":"simulado","descricao":"› 4º SIMULADO COMPLETO em condições 100% reais: 80 questões CESPE\n› Chegue no horário, sem interrupções, sem consulta, controle o tempo como na prova real","questoes_meta":80,"roteiro":["0–240min: 80 questões cronometradas. Inicie EXATAMENTE no horário da prova real (turno da tarde)","240–300min: Análise imediata: score total + % por disciplina","300–360min: Meta: mínimo 55/80 para ter folga na prova real"]},{"hora_inicio":"11:30","hora_fim":"12:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Análise pós-simulado: acertos por disciplina\n› Montar check-list de pontos críticos para os 5 dias restantes","questoes_meta":0,"roteiro":["0–30min: Estatística completa: acertos/erros por disciplina e subtópico","30–60min: Montar lista dos 10 tópicos com mais erro para revisão final","60–90min: Check-list dos 5 dias: quais tópicos são ESSENCIAIS e POSSÍVEIS de melhorar?"]},{"hora_inicio":"13:00","hora_fim":"14:30","materia":"Administração","tipo":"revisao","descricao":"› Planejamento estratégico dos 5 dias finais: prioridade máxima para tópicos de alto peso e baixo…\n› Técnica de revisão em espiral","questoes_meta":0,"roteiro":["0–30min: Matriz: eixo X = peso na prova, eixo Y = % de acerto. Foco no quadrante alto/baixo","30–60min: Defina 2–3 tópicos por dia para revisão cirúrgica","60–90min: REGRA: não estude nada novo a partir de agora. Só consolide o que já sabe"]}]},{"dia":40,"data":"10/06 Qua","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Revisão crítica final CPM: lista dos 10 tipos penais mais cobrados pelo CESPE\n› Flash cards rápidos — 30 minutos de revisão ativa de alto impacto","questoes_meta":25,"roteiro":["0–30min: Flash cards dos 10 crimes CPM mais cobrados: art. 9º, deserção, crimes contra honra","30–70min: 25 questões CPM — só os tópicos do check-list de pontos críticos","70–90min: Revisão oral: explique o crime militar em 30 segundos sem consultar nada"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Proc. Penal Militar","tipo":"revisao","descricao":"› Revisão crítica final CPPM: prazos e procedimentos em tabela definitiva\n› Flash cards rápidos — 30 minutos de revisão ativa","questoes_meta":20,"roteiro":["0–30min: Tabela definitiva: todos os prazos CPPM x CPP lado a lado","30–70min: 20 questões CPPM — só os tópicos críticos identificados","70–90min: Revisão oral: explique o fluxo do IPM em 2 minutos"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Noções de Criminologia","tipo":"revisao","descricao":"› Síntese final Criminologia: 1 página A4 com todas as escolas, teorias e conceitos-chave\n› Revisão em voz alta para fixação","questoes_meta":20,"roteiro":["0–20min: Escreva a síntese de 1 página: escola → teórico → conceito → aplicação PM","20–60min: 20 questões criminologia — só os pontos do check-list","60–90min: Leia a síntese em voz alta 3 vezes — memória auditiva complementa a visual"]}]},{"dia":41,"data":"11/06 Qui","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Síntese final Dir\n› Constitucional: art. 5º (remédios e garantias), art. 37 (administração pública), art. 42…","questoes_meta":25,"roteiro":["0–30min: Releia art. 5º CF — 10 incisos mais cobrados. Art. 144: órgãos e atribuições","30–70min: 25 questões Dir. Constitucional — só os artigos mais críticos","70–90min: Revisão oral: explique a diferença entre PM estadual e PMDF em 1 minuto"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Penal","tipo":"revisao","descricao":"› Síntese final Dir\n› Penal: iter criminis, concurso de crimes e extinção da punibilidade\n› Revisão: 10 crimes funcionais e legislação extravagante essencial","questoes_meta":20,"roteiro":["0–30min: Flash review: fato típico → ilicitude → culpabilidade → punibilidade (iter)","30–70min: 20 questões Dir. Penal — pontos críticos do check-list","70–90min: Tabela de prescrição: máximo da pena × prazo prescricional. Decore"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Administração","tipo":"revisao","descricao":"› Síntese final Administração: quadro das teorias (clássica, RH, sistêmica) e funções PODC\n› Revisão rápida: liderança, motivação e qualidade em 30 minutos","questoes_meta":20,"roteiro":["0–20min: Quadro-síntese 1 página: teoria → autor → conceito central → aplicação","20–60min: 20 questões ADM — só os pontos com mais erro histórico","60–90min: Revisão oral: Taylor, Fayol, Weber, Mayo, Maslow, Herzberg — em 30 seg cada"]}]},{"dia":42,"data":"12/06 Sex","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Legislação PMDF / DF","tipo":"revisao","descricao":"› Revisão leve — Legislação PMDF e DF: artigos-chave Lei 7.289/84, LODF arts. 114–121, Lei 14.751/2023\n› Pontos-surpresa: leis extravagantes do edital","questoes_meta":20,"roteiro":["0–20min: Lei 7.289/84: hierarquia, postos, graduações, deveres e proibições (arts. 1–50)","20–50min: LODF arts. 114–121: segurança pública DF — arts. 117 e 118 são os mais cobrados","50–90min: 20 questões legislação PMDF — revisão leve e confortável"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Direitos Humanos","tipo":"revisao","descricao":"› Revisão leve — Direitos Humanos: sistemas de proteção ONU e OEA\n› Convenção CEDAW e políticas para mulheres no DF\n› Grupos vulneráveis","questoes_meta":15,"roteiro":["0–20min: Releia os órgãos ONU (Conselho DH, Comitê DH) e OEA (Comissão + Corte IDH)","20–50min: CEDAW: principais artigos + LODF sobre mulheres","50–90min: 15 questões DH — revisão leve"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Revisão leve Língua Portuguesa: ortografia (15 min) e crase (15 min)\n› Releitura da estrutura da redação dissertativa","questoes_meta":15,"roteiro":["0–15min: Ortografia: as 20 palavras que mais geram dúvida no CESPE","15–30min: Crase: as 5 regras principais e os 3 casos de proibição","30–60min: Releia sua melhor redação — estrutura tese+argumentos+conclusão"]}]},{"dia":43,"data":"13/06 Sáb","blocos":[{"hora_inicio":"07:00","hora_fim":"08:30","materia":"Língua Portuguesa","tipo":"revisao","descricao":"› Flash review total Língua Portuguesa: 45 minutos relendo apenas anotações e resumos — sem novos…\n› Confiança: o CESPE é uma prova de interpretação","questoes_meta":0,"roteiro":["0–20min: Leia as suas anotações de pontos críticos de Português","20–45min: Flash cards: as 10 pegadinhas CESPE mais recorrentes em LP","45–60min: PARE. Não estude mais Português. Confie no que você construiu"]},{"hora_inicio":"09:00","hora_fim":"10:30","materia":"Dir. Constitucional","tipo":"revisao","descricao":"› Flash review 30 minutos: art. 144 CF (segurança pública), art. 42 (militares) e art. 37…\n› Descanse a partir das 14h","questoes_meta":0,"roteiro":["0–15min: Art. 5º CF: HC, MS, MI, HD, AP — leitura silenciosa dos incisos","15–30min: Art. 144: órgãos de segurança pública — atribuições e subordinação","30–30min: PARE. Você estudou 43 dias. O esforço está dentro de você"]},{"hora_inicio":"11:00","hora_fim":"12:00","materia":"Dir. Penal Militar","tipo":"revisao","descricao":"› Flash review 15 minutos: os 5 crimes militares mais cobrados\n› Durma cedo, alimente-se bem e hidrate-se\n› A prova é amanhã, 14/06/2026","questoes_meta":0,"roteiro":["0–10min: Art. 9º + deserção + pena de morte + crimes contra honra + peculato militar","10–15min: Feche o material. Organize seus documentos para amanhã","15–15min: Durma às 22h. Acorde com calma. Você está PRONTO. Seja OFICIAL!"]}]}]}]}};

  function _purgeLegacyBuiltIn() {
    try {
      const raw = localStorage.getItem(SCHED_KEY);
      const stored = raw ? JSON.parse(raw) : null;
      const builtInVer = _CFO_PMDF_SCHEDULE.savedAt;
      const isLegacyBuiltIn =
        localStorage.getItem('nexus_sched_version') === builtInVer ||
        stored?.savedAt === builtInVer ||
        /CFO PMDF 2026|PMDF = JMU|02\/05 a 15\/05 · CPM e CPPM/i.test(JSON.stringify(stored?.data || ''));
      if (isLegacyBuiltIn) {
        localStorage.removeItem(SCHED_KEY);
        localStorage.removeItem('nexus_sched_version');
        _data = null;
        _mode = null;
      }
    } catch {}
  }

  function init() {
    _load();
    _purgeLegacyBuiltIn();
    _renderView();
  }

  function _renderView() {
    const $empty   = document.getElementById('sch-empty-state');
    const $loading = document.getElementById('sch-loading-state');
    const $view    = document.getElementById('sch-view');
    const $badge   = document.getElementById('sch-mode-badge');
    if (!$empty) return;

    if (_isLoading) {
      $empty.style.display   = 'none';
      $loading.style.display = 'flex';
      $view.style.display    = 'none';
    } else if (hasSchedule()) {
      $empty.style.display   = 'none';
      $loading.style.display = 'none';
      $view.style.display    = 'block';
      if ($badge) {
        $badge.style.display = 'inline-flex';
        $badge.textContent = _mode === 'ia' ? '🎯 CRONOGRAMA IA' : '✏️ MANUAL';
      }
      renderFase(_activePhase);
      _buildFilterStrip();
    } else {
      $empty.style.display   = 'flex';
      $loading.style.display = 'none';
      $view.style.display    = 'none';
      if ($badge) $badge.style.display = 'none';
    }
  }

  /* ────────── API Key helpers ────────── */
  const API_KEY_STORE = 'nexus_api_key';

  function _getApiKey() {
    return localStorage.getItem(API_KEY_STORE) || '';
  }

  function saveApiKey(val) {
    if (val && val.trim()) localStorage.setItem(API_KEY_STORE, val.trim());
    else localStorage.removeItem(API_KEY_STORE);
  }

  function toggleKeyVisibility() {
    const $k = document.getElementById('sch-api-key');
    if ($k) $k.type = $k.type === 'password' ? 'text' : 'password';
  }

  /* ────────── Chip helpers ────────── */
  function selectChip(el, groupId) {
    document.querySelectorAll('#' + groupId + ' .sch-chip-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
  }
  function toggleChip(el) { el.classList.toggle('active'); }
  function _chipVal(groupId) {
    const el = document.querySelector('#' + groupId + ' .sch-chip-btn.active');
    return el ? el.dataset.val : '';
  }
  function _chipsVals(groupId) {
    return [...document.querySelectorAll('#' + groupId + ' .sch-chip-btn.active')].map(b => b.dataset.val);
  }

  /* ────────── AI Modal ────────── */
    /* ────────── openAIModal — SMART VERSION ────────── */
    /* ── Toggle collapsible section ── */
  function toggleSection(id) {
    document.getElementById(id)?.classList.toggle('collapsed');
  }

  /* ── Step navigation ── */
  function goToStep(n) {
    [1,2].forEach(i => {
      const pg = document.getElementById('sch-page-' + i);
      if (pg) pg.style.display = i === n ? 'flex' : 'none';
    });
    [1,2,3].forEach(i => {
      const dot = document.getElementById('sch-dot-' + i);
      if (dot) {
        dot.classList.toggle('active', i === n);
        dot.classList.toggle('done', i < n);
      }
    });
    const labels = ['', 'Configure seu plano', 'Pré-visualização — confirme antes de gerar', 'Gerando...'];
    const $lbl = document.getElementById('sch-ai-step-label');
    if ($lbl) $lbl.textContent = labels[n] || '';
  }

  /* ────────── openAIModal — SMART ────────── */
  function openAIModal() {
    const profile  = Onboarding.getUserProfile();
    const edData   = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const cfg      = State.get('config') || {};

    // ── Auto-fill fields from existing data ──
    const sf = (id, v) => { const el = document.getElementById(id); if (el && v) el.value = v; };

    // Concurso
    const nome   = cfg.examName  || edData?.concurso?.nome  || profile?.concurso?.nome  || '';
    const banca  = cfg.examBoard || edData?.concurso?.banca || profile?.concurso?.banca || '';
    const cargo  = edData?.concurso?.cargo || profile?.concurso?.cargo || '';
    const dias   = cfg.totalDays || edData?.concurso?.diasRestantes || profile?.concurso?.diasRestantes || 30;
    const horas  = edData?.disponibilidade?.horasPorDia || profile?.disponibilidade?.horasPorDia || '';
    const diasSem= edData?.disponibilidade?.diasPorSemana || profile?.disponibilidade?.diasPorSemana || 5;
    const fracos = (profile?.pontosFracos || []).join(', ');
    const nivel  = profile?.perfil?.nivel || 'intermediario';
    const turno  = edData?.disponibilidade?.turno || profile?.disponibilidade?.turno || 'integral';
    const trab   = profile?.disponibilidade?.trabalhando ? 'sim' : 'nao';
    const obj    = profile?.objetivo || 'aprovacao';

    sf('sch-ai-exam',       nome);
    sf('sch-ai-dias',       Math.min(dias, 365));
    sf('sch-ai-horas',      horas);
    sf('sch-ai-cargo',      cargo);
    sf('sch-ai-fracos',     fracos);

    // Banca select
    if (banca) {
      const $b = document.getElementById('sch-ai-banca');
      if ($b) [...$b.options].forEach(o => { if (o.text.toLowerCase().includes(banca.toLowerCase().slice(0,6)) || o.value === banca) $b.value = o.value; });
    }

    // dias-semana
    const $ds = document.getElementById('sch-ai-dias-semana');
    if ($ds && diasSem) $ds.value = diasSem;

    // Activate chips
    const activateChip = (groupId, val) => {
      document.querySelectorAll('#' + groupId + ' .sch-chip-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.val === val);
      });
    };
    activateChip('sch-turno-chips',   turno);
    activateChip('sch-nivel-chips',   nivel);
    activateChip('sch-obj-chips',     obj);
    activateChip('sch-trabalho-chips', trab);

    // Pre-fill API key
    const $apiKey = document.getElementById('sch-api-key');
    if ($apiKey) $apiKey.value = _getApiKey();

    // ── Build auto-detected banner ──
    const detected = [];
    if (nome)   detected.push({ icon:'🎯', label:'Concurso', val: nome + (banca ? ' · ' + banca : '') });
    if (horas)  detected.push({ icon:'⏰', label:'Disponibilidade', val: horas + 'h/dia · ' + diasSem + ' dias/semana' });
    if (edData?.disciplinas?.length) detected.push({ icon:'📚', label:'Disciplinas', val: edData.disciplinas.length + ' disciplinas do edital' });
    if (fracos) detected.push({ icon:'⚠️', label:'Pontos fracos', val: fracos.split(',').slice(0,3).join(', ') });

    const $banner = document.getElementById('sch-ai-detected-banner');
    if ($banner) {
      if (detected.length) {
        $banner.innerHTML =
          '<div class="sch-ai-detected-hdr">✅ Dados detectados automaticamente</div>' +
          detected.map(d =>
            '<div class="sch-ai-detected-row">' +
            '<span class="sch-det-icon">' + d.icon + '</span>' +
            '<span class="sch-det-label">' + d.label + '</span>' +
            '<span class="sch-det-val">' + d.val + '</span>' +
            '</div>'
          ).join('');
        $banner.style.background = 'rgba(46,204,113,.04)';
        $banner.style.border = '1px solid rgba(46,204,113,.15)';
        $banner.style.borderRadius = '11px';
        $banner.style.marginBottom = '8px';
      } else {
        $banner.innerHTML = '';
      }
    }

    // ── Smart collapse: sections already filled from system data ──
    const _setSection = (id, hasData, forceOpen) => {
      const el = document.getElementById(id);
      if (!el) return;
      const statusId = id.replace('sch-section-', 'sch-') + '-status';
      const $st = document.getElementById(statusId);
      if (hasData && !forceOpen) {
        el.classList.add('collapsed', 'has-data');
        if ($st) $st.textContent = '✅';
      } else {
        el.classList.remove('collapsed', 'has-data');
        if ($st) $st.textContent = '';
      }
    };

    _setSection('sch-section-key',     !!_getApiKey());
    _setSection('sch-section-concurso', !!(nome && banca), !nome);
    _setSection('sch-section-dispon',  !!(horas && dias),  !horas);
    _setSection('sch-section-perfil',  !!(nivel && turno));
    _setSection('sch-section-disc',    !!(edData?.disciplinas?.length || fracos));
    // Always open prompt section
    document.getElementById('sch-section-prompt')?.classList.remove('collapsed');

    goToStep(1);
    openModal('modal-sch-ai');
  }

  /* ────────── goToPreview — Step 2 ────────── */
  function goToPreview() {
    // Collect form data
    const dias     = parseInt(document.getElementById('sch-ai-dias')?.value) || 30;
    const horas    = parseFloat(document.getElementById('sch-ai-horas')?.value) || 4;
    const diasSem  = parseInt(document.getElementById('sch-ai-dias-semana')?.value) || 5;
    const nome     = document.getElementById('sch-ai-exam')?.value.trim() || 'Concurso';
    const banca    = document.getElementById('sch-ai-banca')?.value || '';
    const fracos   = document.getElementById('sch-ai-fracos')?.value.trim() || '';
    const fortes   = document.getElementById('sch-ai-fortes')?.value.trim() || '';
    const fasesOpt = document.getElementById('sch-ai-fases')?.value || 'auto';
    const nivel    = _chipVal('sch-nivel-chips') || 'intermediario';
    const obj      = _chipVal('sch-obj-chips') || 'aprovacao';

    const numFases = fasesOpt === 'auto'
      ? (dias <= 14 ? 2 : dias <= 25 ? 3 : dias <= 45 ? 4 : 5)
      : (parseInt(fasesOpt) || 3);

    // Calc phase distribution
    const PHASE_COLORS = ['#E8B84B','#4D9FFF','#FF4D4D','#2ECC71','#A78BFA'];
    const FASE_NAMES = [
      ['Fundamentos','Reta Final'],
      ['Fundamentos','Aprofundamento','Reta Final'],
      ['Fundamentos','Consolidação','Revisão','Reta Final'],
      ['Fundamentos','Aprofundamento','Consolidação','Simulados','Reta Final'],
    ][Math.min(numFases - 2, 3)] || ['Fundamentos','Reta Final'];

    const baseD = Math.floor(dias / numFases);
    const phases = FASE_NAMES.map((n, i) => ({
      nome: n, cor: PHASE_COLORS[i], dias: i === numFases - 1 ? dias - baseD * (numFases - 1) : baseD,
    }));

    // Discipline distribution
    const edData   = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const profile  = Onboarding.getUserProfile();
    const discs    = edData?.disciplinas?.length
      ? edData.disciplinas
      : (profile?.disciplinas || []).map((d,i) => ({ id:'d'+i, nome: d.name, peso: d.peso, cor: PHASE_COLORS[i % 5] }));

    const totalH   = horas * dias;
    const objLabels = { aprovacao:'Aprovação na lista', top10:'Top 10 classificados', primeiro:'1º lugar' };
    const nivelLabels = { iniciante:'Iniciante', intermediario:'Intermediário', avancado:'Avançado' };

    // Build preview HTML
    const $prev = document.getElementById('sch-preview-content');
    if (!$prev) return;

    $prev.innerHTML = `
      <div class="sch-preview-hero">
        <div class="sch-preview-title">PRÉ-VISUALIZAÇÃO DO CRONOGRAMA</div>
        <div class="sch-preview-sub">
          <strong>${nome}</strong>${banca ? ' · ' + banca : ''}<br>
          Nível: ${nivelLabels[nivel]} · Objetivo: ${objLabels[obj] || obj}
        </div>
        <div class="sch-preview-stats">
          <div class="sch-preview-stat">
            <div class="sch-preview-stat-val">${dias}</div>
            <div class="sch-preview-stat-lbl">Dias</div>
          </div>
          <div class="sch-preview-stat">
            <div class="sch-preview-stat-val">${horas}h</div>
            <div class="sch-preview-stat-lbl">Por Dia</div>
          </div>
          <div class="sch-preview-stat">
            <div class="sch-preview-stat-val">${diasSem}</div>
            <div class="sch-preview-stat-lbl">Dias/Semana</div>
          </div>
          <div class="sch-preview-stat">
            <div class="sch-preview-stat-val">${Math.round(totalH)}h</div>
            <div class="sch-preview-stat-lbl">Total</div>
          </div>
        </div>
      </div>

      <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim);margin-bottom:8px;">📊 Distribuição por Fases</div>
      <div class="sch-preview-phases">
        ${phases.map((f, i) => `
          <div class="sch-preview-phase">
            <div class="sch-preview-phase-dot" style="background:${f.cor}"></div>
            <div class="sch-preview-phase-info">
              <div class="sch-preview-phase-name">Fase ${i+1} — ${f.nome}</div>
              <div class="sch-preview-phase-meta">${f.dias} dias · ${Math.round(f.dias * horas)}h de estudo</div>
            </div>
            <div class="sch-preview-phase-bar-wrap">
              <div class="sch-preview-phase-bar">
                <div class="sch-preview-phase-fill" style="width:${Math.round((f.dias/dias)*100)}%;background:${f.cor}"></div>
              </div>
              <div style="font-size:9px;color:var(--text-dim);text-align:right;margin-top:3px">${Math.round((f.dias/dias)*100)}%</div>
            </div>
          </div>`).join('')}
      </div>

      ${discs.length ? `
        <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-dim);margin-bottom:8px;margin-top:8px;">📚 Disciplinas Detectadas</div>
        <div class="sch-preview-disc-grid">
          ${discs.slice(0, 10).map(d => `
            <div class="sch-preview-disc-item">
              <div class="sch-preview-disc-dot" style="background:${(typeof EditalEngine!=='undefined'?EditalEngine._discColor(d.nome,d.cor):d.cor)||'#E8B84B'}"></div>
              <div class="sch-preview-disc-name">${d.nome}</div>
              <div class="sch-preview-disc-pct">${d.peso === 'alta' ? '🔥' : d.peso === 'baixa' ? '📘' : '⚡'}</div>
            </div>`).join('')}
        </div>` : ''}

      ${fracos ? `
        <div style="margin-top:12px;padding:10px 13px;border-radius:9px;background:rgba(255,77,77,.05);border:1px solid rgba(255,77,77,.15);font-size:11px;color:var(--text-muted);">
          <strong style="color:var(--red);">⚠️ Pontos fracos detectados</strong> — A IA vai priorizar: ${fracos}
        </div>` : ''}

      <div style="margin-top:12px;padding:10px 13px;border-radius:9px;background:rgba(77,159,255,.05);border:1px solid rgba(77,159,255,.12);font-size:11px;color:var(--text-dim);">
        💡 A IA vai gerar ${numFases} fase${numFases!==1?'s':''} com blocos de estudo detalhados, revisões espaçadas e ${banca||'CESPE'}-specific estratégias. Você pode editar cada bloco individualmente após a geração.
      </div>
    `;

    goToStep(2);
  }

  /* ────────── confirmarGeracao — fires the actual API calls ────────── */
  function confirmarGeracao() {
    closeModal('modal-sch-ai');
    gerarCronogramaIA();
  }


  /* ── Toggle section ── */
  function toggleSection(sectionId) {
    const hd = document.querySelector(`#${sectionId} .sch-form-section-hd`);
    if (hd) hd.classList.toggle('open');
  }

  /* ── showPreview — builds preview before generating ── */
  function showPreview() {
    const profile    = Onboarding.getUserProfile() || {};
    const edData     = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const dias       = parseInt(document.getElementById('sch-ai-dias')?.value) || 30;
    const horas      = parseFloat(document.getElementById('sch-ai-horas')?.value) || profile.disponibilidade?.horasPorDia || 4;
    const diasSemana = parseInt(document.getElementById('sch-ai-dias-semana')?.value) || 5;
    const examName   = document.getElementById('sch-ai-exam')?.value.trim() || profile.concurso?.nome || 'Concurso';
    const banca      = document.getElementById('sch-ai-banca')?.value || profile.concurso?.banca || '';
    const fracos     = document.getElementById('sch-ai-fracos')?.value.trim() || '';
    const fortes     = document.getElementById('sch-ai-fortes')?.value.trim() || '';
    const nivel      = _chipVal('sch-nivel-chips') || 'intermediario';
    const turno      = _chipVal('sch-turno-chips') || 'integral';
    const obj        = _chipVal('sch-obj-chips') || 'aprovacao';
    const fasesOpt   = document.getElementById('sch-ai-fases')?.value || 'auto';
    const numFases   = fasesOpt === 'auto' ? (dias<=14?2:dias<=25?3:dias<=45?4:5) : (parseInt(fasesOpt)||3);
    const totalHoras = Math.round(horas * dias * (diasSemana/7));
    const blocosPorDia = Math.min(Math.max(2, Math.floor(horas/1.5)), 4);

    // Discipline distribution
    let discs = [];
    if (edData?.disciplinas?.length) {
      discs = edData.disciplinas;
    } else if (profile.disciplinas?.length) {
      discs = profile.disciplinas.map(d => ({ nome: d.name||d.nome, peso: d.peso||'media', cor: '#E8B84B' }));
    } else {
      discs = [
        {nome:'Direito Constitucional',peso:'alta',cor:'#4D9FFF'},
        {nome:'Direito Administrativo',peso:'alta',cor:'#E8B84B'},
        {nome:'Língua Portuguesa',peso:'media',cor:'#2ECC71'},
        {nome:'Raciocínio Lógico',peso:'media',cor:'#A78BFA'},
      ];
    }

    // Weight-based distribution
    const pesoW = { alta:3, media:2, baixa:1 };
    const totalW = discs.reduce((s,d)=>s+(pesoW[d.peso]||2),0) || 1;
    const discRows = discs.slice(0,8).map(d => {
      const pct = Math.round((pesoW[d.peso]||2)/totalW*100);
      const hrsDisc = Math.round(totalHoras * pct/100);
      const color = (typeof EditalEngine!=='undefined'?EditalEngine._discColor(d.nome,d.cor):d.cor)||'#E8B84B';
      return `<div class="sch-preview-disc-row">
        <div class="sch-preview-disc-name">${d.nome||d.name}</div>
        <div class="sch-preview-disc-track"><div class="sch-preview-disc-fill" style="width:${pct}%;background:${color}"></div></div>
        <div class="sch-preview-disc-pct" style="color:${color}">${hrsDisc}h</div>
      </div>`;
    }).join('');

    // Phase distribution
    const diasPorFase = Math.ceil(dias / numFases);
    const COLORS = ['#E8B84B','#4D9FFF','#FF4D4D','#2ECC71','#A78BFA'];
    const FASES_NAMES = [
      ['Fundamentos','Reta Final'],
      ['Fundamentos','Aprofundamento','Reta Final'],
      ['Fundamentos','Consolidação','Revisão','Reta Final'],
      ['Fundamentos','Aprofundamento','Consolidação','Simulados','Reta Final'],
    ][Math.min(numFases-2,3)] || ['Fundamentos','Reta Final'];
    const phaseRows = Array.from({length:numFases},(_,i)=>{
      const d0 = i*diasPorFase+1;
      const d1 = Math.min((i+1)*diasPorFase, dias);
      const nD = d1-d0+1;
      const cor = COLORS[i%COLORS.length];
      const nome = FASES_NAMES[i] || `Fase ${i+1}`;
      const desc = i===numFases-1?'Revisão e simulados':i===0?'Fundamentos e base teórica':'Aprofundamento e questões';
      return `<div class="sch-preview-phase-row">
        <div class="sch-preview-phase-dot" style="background:${cor}"></div>
        <div class="sch-preview-phase-info">
          <div class="sch-preview-phase-name" style="color:${cor}">${nome}</div>
          <div class="sch-preview-phase-desc">${desc}</div>
        </div>
        <div class="sch-preview-phase-badge">${nD} dias · D${d0}→D${d1}</div>
      </div>`;
    }).join('');

    // Alerts / insights
    const alerts = [];
    if (horas < 3) alerts.push('⚠️ Com menos de 3h/dia e ' + dias + ' dias, a cobertura será parcial. Considere aumentar a carga diária ou os dias.');
    if (fracos) alerts.push('🎯 Pontos fracos detectados (' + fracos + ') receberão carga adicional nas fases iniciais.');
    if (fortes) alerts.push('✅ Pontos fortes (' + fortes + ') terão carga reduzida de manutenção, liberando tempo para prioridades.');
    if (dias <= 14) alerts.push('🔴 Modo reta final ativado — zero conteúdo novo, apenas revisão e simulados.');

    const objLabels = { aprovacao:'Aprovação na lista', top10:'Top 10 da classificação', primeiro:'1º lugar / melhores notas' };
    const nivelLabels = { iniciante:'🌱 Iniciante', intermediario:'📈 Intermediário', avancado:'🔥 Avançado' };

    const $c = document.getElementById('sch-preview-content');
    if (!$c) return;
    $c.innerHTML = `
      <div class="sch-preview-kpis">
        <div class="sch-preview-kpi" style="--kpi-c:var(--gold)">${dias}<div class="sch-preview-kpi-lbl" style="margin-top:4px">Dias</div></div>
        <div class="sch-preview-kpi" style="--kpi-c:var(--blue)">${horas}h<div class="sch-preview-kpi-lbl" style="margin-top:4px">Por Dia</div></div>
        <div class="sch-preview-kpi" style="--kpi-c:var(--green)">${totalHoras}h<div class="sch-preview-kpi-lbl" style="margin-top:4px">Total</div></div>
        <div class="sch-preview-kpi" style="--kpi-c:var(--purple)">${numFases}<div class="sch-preview-kpi-lbl" style="margin-top:4px">Fases</div></div>
      </div>

      <div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim);margin-bottom:8px">
        📋 ${examName}${banca?' · '+banca:''} · ${nivelLabels[nivel]||nivel} · ${objLabels[obj]||obj}
      </div>

      <div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim);margin:14px 0 8px">⚡ Distribuição de Fases</div>
      <div class="sch-preview-phase-grid">${phaseRows}</div>

      <div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim);margin:14px 0 8px">📚 Carga por Disciplina</div>
      <div class="sch-preview-disc-bar">${discRows}</div>
      ${discs.length > 8 ? `<div style="font-size:10px;color:var(--text-dim);margin-top:6px;">+ ${discs.length-8} disciplinas incluídas</div>` : ''}

      ${alerts.map(a=>`<div class="sch-preview-alert" style="margin-top:10px">${a}</div>`).join('')}

      <div style="font-size:11px;color:var(--text-dim);margin-top:16px;padding:10px 12px;background:var(--surface-2);border-radius:8px;line-height:1.6;">
        ✅ Tudo certo? Clique em <strong style="color:var(--text-primary)">Gerar Cronograma</strong> para criar o plano completo com IA.<br>
        ← Clique em <strong style="color:var(--text-primary)">Editar</strong> para ajustar qualquer parâmetro.
      </div>`;

    closeModal('modal-sch-ai');
    openModal('modal-sch-preview');
  }


  /* ────────── AI Generation ────────── */
    async function gerarCronogramaIA() {
    closeModal('modal-sch-ai');
    closeModal('modal-sch-preview');
    const profile   = Onboarding.getUserProfile() || {};
    const edData    = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;

    // ── Collect form fields ──
    const dias       = parseInt(document.getElementById('sch-ai-dias')?.value) || 30;
    const fasesOpt   = document.getElementById('sch-ai-fases')?.value;
    const focus      = document.getElementById('sch-ai-focus')?.value.trim()     || '';
    const examName   = document.getElementById('sch-ai-exam')?.value.trim()      || profile.concurso?.nome || 'Concurso';
    const bancaForm  = document.getElementById('sch-ai-banca')?.value            || profile.concurso?.banca || '';
    const cargo      = document.getElementById('sch-ai-cargo')?.value.trim()     || '';
    const vagas      = document.getElementById('sch-ai-vagas')?.value.trim()     || '';
    const questoesN  = document.getElementById('sch-ai-questoes')?.value.trim()  || '';
    const horasForm  = parseFloat(document.getElementById('sch-ai-horas')?.value) || profile.disponibilidade?.horasPorDia || 4;
    const diasSemana = parseInt(document.getElementById('sch-ai-dias-semana')?.value) || profile.disponibilidade?.diasPorSemana || 5;
    const fracos     = document.getElementById('sch-ai-fracos')?.value.trim()    || (profile.pontosFracos || []).join(', ');
    const fortes     = document.getElementById('sch-ai-fortes')?.value.trim()    || '';
    const customPrompt = document.getElementById('sch-ai-custom-prompt')?.value.trim() || '';

    const turno    = _chipVal('sch-turno-chips')    || profile.disponibilidade?.turno || 'integral';
    const trabalho = _chipVal('sch-trabalho-chips') || 'nao';
    const nivel    = _chipVal('sch-nivel-chips')    || profile.perfil?.nivel || 'intermediario';
    const fezAntes = _chipVal('sch-fez-chips')      || 'nao';
    const objetivo = _chipVal('sch-obj-chips')      || profile.objetivo || 'aprovacao';
    const desafios = _chipsVals('sch-desafio-chips');

    // Disciplines — capped at 600 chars to avoid token overflow in prompts
    const discFull = edData?.disciplinas?.length
      ? edData.disciplinas.map(d => d.nome + ' (' + d.peso + ')').join(', ')
      : profile.disciplinas?.length
      ? profile.disciplinas.map(d => (d.name||d.nome) + ' (' + d.peso + ')').join(', ')
      : 'Direito Constitucional, Direito Administrativo, Lingua Portuguesa, Raciocinio Logico';
    const disc = discFull.slice(0, 600);

    // Ordered disc list for smart fallback
    const discList = (edData?.disciplinas || profile?.disciplinas || [])
      .map(d => d.nome || d.name)
      .filter(Boolean)
      .slice(0, 12);
    if (!discList.length) discList.push('Direito Constitucional','Direito Administrativo','Língua Portuguesa','Raciocínio Lógico');

    _isLoading = true;
    _renderView();
    _animateLoadingSteps();

    try {
      const apiKey = _getApiKey();
      if (!apiKey) {
        _isLoading = false;
        if (_loadingTimer) clearInterval(_loadingTimer);
        _renderView();
        openModal('modal-sch-ai');
        const $key = document.getElementById('sch-api-key');
        if ($key) { $key.style.borderColor='var(--red)'; $key.focus(); setTimeout(()=>$key.style.borderColor='',2500); }
        alert('Informe sua chave da API Anthropic para gerar o cronograma.');
        return;
      }


      // ── Compute numFases ──
      const numFases = fasesOpt === 'auto'
        ? (dias<=14?2:dias<=25?3:dias<=45?4:5)
        : (parseInt(fasesOpt)||3);

      const horas        = horasForm;
      const banca        = bancaForm || profile.concurso?.banca || 'CESPE';
      const blocosPorDia = Math.min(Math.max(2, Math.floor(horas/1.5)), 5);
      const hoje         = new Date();
      const hojeStr      = String(hoje.getDate()).padStart(2,'0') + '/' + String(hoje.getMonth()+1).padStart(2,'0');

      // ── Collect REAL performance data ──
      const sessions     = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
      const errItems     = JSON.parse(localStorage.getItem('nexus_errors_v1')   || '[]');
      const reviewItems  = JSON.parse(localStorage.getItem('nexus_reviews_v1')  || '[]');

      // Per-discipline stats from sessions
      const perfByDisc = {};
      sessions.forEach(s => {
        const k = s.disciplina || s.subj || '';
        if (!k) return;
        if (!perfByDisc[k]) perfByDisc[k] = { secs:0, ac:0, er:0, sess:0 };
        perfByDisc[k].secs += s.tempoSecs || 0;
        perfByDisc[k].ac   += s.acertos   || 0;
        perfByDisc[k].er   += s.erros     || 0;
        perfByDisc[k].sess++;
      });
      const perfSummary = Object.entries(perfByDisc)
        .map(([d,v]) => {
          const tot = v.ac + v.er;
          const taxa = tot > 0 ? Math.round(v.ac/tot*100) : null;
          const h = Math.floor(v.secs/3600);
          return `${d}: ${h}h estudadas${taxa!==null?', '+taxa+'% acertos':''}`;
        }).join(' | ');

      // Error notebook summary
      const errByDisc = {};
      errItems.forEach(e => {
        const d = e.disciplina || e.subj || '';
        if (d) errByDisc[d] = (errByDisc[d]||0) + 1;
      });
      const errSummary = Object.entries(errByDisc)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,6)
        .map(([d,n]) => `${d}(${n} erros)`)
        .join(', ');

      // Overdue reviews
      const todayISO = _localDateStr(hoje);
      const overdueCount = reviewItems.filter(r => r.status==='pending' && r.nextReview <= todayISO).length;

      const PHASE_COLORS = ['#E8B84B','#4D9FFF','#FF4D4D','#2ECC71','#A78BFA'];
      const FASE_NOMES   = [
        ['Fundamentos','Reta Final'],
        ['Fundamentos','Aprofundamento','Reta Final'],
        ['Fundamentos','Consolidacao','Revisao Intensa','Reta Final'],
        ['Fundamentos','Aprofundamento','Consolidacao','Simulados e Revisao','Reta Final'],
      ][Math.min(numFases-2,3)] || ['Fundamentos','Reta Final'];

      // ── Phase type rules (what types each phase should have) ──
      const FASE_TYPE_RULES = [
        '80% novo + 20% revisao',                           // phase 1
        '60% novo + 30% revisao + 10% simulado',            // phase 2
        '30% novo + 50% revisao + 20% simulado',            // phase 3
        '10% novo + 40% revisao + 50% simulado',            // phase 4
        '0% novo + 40% revisao + 60% simulado',             // phase 5 (final)
      ];

      const customSuffix = customPrompt
        ? '\n\nINSTRUCOES ADICIONAIS DO USUARIO (MAXIMA PRIORIDADE — seguir à risca):\n' + customPrompt : '';

      // ── Build rich context ──
      const ctx = [
        '=== CONTEXTO DO CONCURSO ===',
        'Concurso: ' + examName,
        banca     ? 'Banca: '      + banca     : '',
        cargo     ? 'Cargo: '      + cargo     : '',
        vagas     ? 'Vagas: '      + vagas     : '',
        questoesN ? 'Questoes na prova: ' + questoesN : '',
        '',
        '=== PERFIL DO CANDIDATO ===',
        'Nivel: ' + nivel + ' | Objetivo: ' + objetivo + ' | Fez antes: ' + fezAntes,
        'Trabalha: ' + trabalho + ' | Turno: ' + turno,
        'Horas/dia: ' + horas + 'h | Dias/semana: ' + diasSemana,
        '',
        '=== DISCIPLINAS DO EDITAL ===',
        disc,
        '',
        fracos ? ('=== PONTOS FRACOS (PRIORIDADE MAXIMA) ===\n' + fracos) : '',
        fortes ? ('=== PONTOS FORTES (CARGA REDUZIDA) ===\n' + fortes)    : '',
        '',
        perfSummary ? ('=== HISTORICO REAL DE ESTUDO ===\n' + perfSummary) : '',
        errSummary  ? ('=== ERROS MAIS FREQUENTES ===\n' + errSummary)     : '',
        overdueCount > 0 ? ('=== REVISOES ATRASADAS: ' + overdueCount + ' itens pendentes ===') : '',
        desafios.length  ? ('=== MAIORES DESAFIOS ===\n' + desafios.join(', ')) : '',
        focus ? ('=== INSTRUCAO ESPECIAL DO CANDIDATO ===\n' + focus) : '',
      ].filter(Boolean).join('\n');

      // ── STEP 1: Estrutura das fases (system prompt + rich user context) ──
      _updateLoadingMsg('Analisando perfil e planejando fases...');
      const sysPrompt1 = [
        'Voce e um coach especialista em concursos publicos brasileiros, especialmente banca ' + banca + '.',
        'Sua especialidade: estrategia de estudo baseada em dados, metodo 80/20, espacamento de revisoes.',
        'Gere cronogramas pedagogicamente corretos, progressivos e adaptados ao perfil real do candidato.',
        'REGRAS PEDAGOGICAS OBRIGATORIAS:',
        '- Fase inicial: fundamentos + introducao sistematica por disciplina de peso ALTA primeiro',
        '- Fases do meio: aprofundamento + inicio de questoes + revisao espacada',
        '- Fase final (ultimos ' + Math.max(3, Math.floor(dias*0.15)) + ' dias): APENAS simulados, revisao de pontos fracos, caderno de erros',
        '- Disciplinas com mais erros no historico devem ter MAIS blocos e revisoes',
        '- Aplicar regra 80/20: focar no que tem MAIS QUESTOES na prova de ' + banca,
        '- Incluir SIMULADO GERAL a cada 7-10 dias nas fases finais',
        'RETORNE APENAS JSON VALIDO, SEM MARKDOWN, SEM EXPLICACOES.',
      ].join('\n');

      // ── Step 1: lean context (only essential metadata, not full history) ──
      const ctxLean = [
        'Concurso: ' + examName,
        banca     ? 'Banca: '   + banca   : '',
        'Nivel: ' + nivel + ' | Turno: ' + turno + ' | Horas/dia: ' + horas + 'h',
        'Disciplinas: ' + disc.slice(0, 400),  // truncate if huge
        fracos ? 'Pontos fracos: ' + fracos.slice(0, 200) : '',
        fortes ? 'Pontos fortes: ' + fortes.slice(0, 100) : '',
        customSuffix.slice(0, 300),
      ].filter(Boolean).join(' | ');

      const step1UserMsg =
        ctxLean + '\n\n' +
        'TAREFA: distribua ' + dias + ' dias em ' + numFases + ' fases pedagógicas.\n' +
        'Nomes sugeridos: ' + FASE_NOMES.join(', ') + '\n' +
        'Retorne SOMENTE este JSON (sem texto, sem markdown):\n' +
        '{"fases":[{"nome":"Fase 1","cor":"' + PHASE_COLORS[0] + '","descricao":"foco curto","diasCount":' + Math.floor(dias/numFases) + ',"tipoMix":"80% novo + 20% revisao"}]}\n' +
        'Regras OBRIGATORIAS: ' + numFases + ' objetos; soma diasCount = ' + dias + '; ultima fase so revisao/simulados.';

      let r1, d1, t1, str1;
      try {
        r1 = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5',
            max_tokens: 800,
            system: 'Voce retorna APENAS JSON valido sem markdown. Nada mais.',
            messages: [{ role: 'user', content: step1UserMsg }],
          }),
        });
        if (!r1.ok) { const eb=await r1.json().catch(()=>({})); throw new Error(eb?.error?.message || 'API '+r1.status); }
        d1   = await r1.json();
        t1   = (d1.content||[]).map(b=>b.text||'').join('');
        str1 = _extractAndRepairJSON(t1);
      } catch(e1) {
        console.warn('[Schedule Step1]', e1.message);
        str1 = null;
      }

      // ── Fallback: build default phases if AI failed ──
      if (!str1?.fases?.length) {
        console.warn('[Schedule] Step 1 fallback: using default phases');
        const diasPorFase = Math.floor(dias / numFases);
        str1 = {
          fases: FASE_NOMES.map((nome, i) => ({
            nome,
            cor: PHASE_COLORS[i % PHASE_COLORS.length],
            descricao: i === 0 ? 'Fundamentos e introdução' : i === numFases-1 ? 'Revisão e simulados finais' : 'Aprofundamento e prática',
            diasCount: i === numFases-1 ? dias - diasPorFase*(numFases-1) : diasPorFase,
            tipoMix: FASE_TYPE_RULES[Math.min(i, FASE_TYPE_RULES.length-1)],
          })),
        };
      }

      const fasesBase = str1.fases.map((f,i) => ({
        nome:      f.nome      || FASE_NOMES[i]          || 'Fase '+(i+1),
        cor:       f.cor       || PHASE_COLORS[i%5],
        descricao: f.descricao || '',
        diasCount: Math.max(1, parseInt(f.diasCount) || Math.floor(dias/numFases)),
        tipoMix:   f.tipoMix   || FASE_TYPE_RULES[Math.min(i, FASE_TYPE_RULES.length-1)],
        dias: [],
      }));
      const somaAtual = fasesBase.reduce((s,f) => s+f.diasCount, 0);
      if (somaAtual !== dias) fasesBase[fasesBase.length-1].diasCount += (dias - somaAtual);

      // ── STEP 2: Blocos por fase (richer prompt per phase) ──
      let diaGlobal = 1;
      let dataAtual = new Date();

      for (let fi = 0; fi < fasesBase.length; fi++) {
        const fase  = fasesBase[fi];
        const nDias = fase.diasCount;
        const isUlt = fi === fasesBase.length - 1;
        const isPri = fi === 0;
        _updateLoadingMsg('Gerando fase ' + (fi+1) + '/' + fasesBase.length + ': ' + fase.nome + ' (' + nDias + ' dias)...');

        const datas = [];
        for (let d = 0; d < nDias; d++) {
          const dt = new Date(dataAtual); dt.setDate(dt.getDate() + d);
          datas.push(String(dt.getDate()).padStart(2,'0') + '/' + String(dt.getMonth()+1).padStart(2,'0'));
        }

        const turnoHorarios = turno === 'manha'  ? '07:00 a 13:00' :
                              turno === 'tarde'  ? '13:00 a 19:00' :
                              turno === 'noite'  ? '18:00 a 23:00' : '07:00 a 22:00';

        const sysPrompt2 = [
          'Coach de concursos públicos — ' + banca + ' / ' + examName + '.',
          'Gere blocos com roteiro real e questoes. JSON apenas, sem markdown.',
          'Fase atual: ' + fase.nome + ' — mix: ' + (fase.tipoMix || FASE_TYPE_RULES[Math.min(fi, 4)]),
          isUlt ? 'ULTIMA FASE: zero novo. Revisão+Simulado.' : '',
          isPri ? 'PRIMEIRA FASE: disciplinas de MAIOR PESO primeiro.' : '',
          'Roteiro: 3 etapas (teoria→questoes CESPE→erros). Simulado: cronometrado→corrigir→anotar.',
          'Tecnica: Const/Admin=leitura literal; Penal=esquema+casos; Português=texto+interpretação; Lógica=exercícios direto.',
          'questoes_meta minimo 10 por bloco.',
          fracos ? 'PRIORITARIOS: ' + fracos.slice(0,100) : '',
          'RETORNE APENAS JSON.',
        ].filter(Boolean).join('\n');

        // Lean context for Step 2 (avoid token overflow)
        const ctxStep2 = [
          'Concurso: ' + examName + ' | Banca: ' + banca + ' | Nivel: ' + nivel,
          'Horas/dia: ' + horas + 'h | Turno: ' + turnoHorarios,
          'Disciplinas: ' + disc,
          fracos ? 'PRIORIDADE: ' + fracos.slice(0,150) : '',
          errSummary ? 'ERROS: ' + errSummary.slice(0,100) : '',
          customSuffix.slice(0,200),
        ].filter(Boolean).join(' | ');

        const step2Prompt =
          'Fase: ' + fase.nome + ' (' + (fi+1) + '/' + fasesBase.length + ') | Mix: ' + (fase.tipoMix||'60% novo+40% rev') + '\n' +
          'Periodo: dia ' + diaGlobal + ' a ' + (diaGlobal+nDias-1) + ' | Datas: ' + datas.join(', ') + '\n' +
          blocosPorDia + ' blocos/dia | ' + ctxStep2 + '\n' +
          (trabalho==='sim'?'TRABALHA: max 2h/bloco. ':'') +
          (diasSemana<7?'DESCANSO: '+(7-diasSemana)+'d/sem. ':'') +
          (isUlt?'ULTIMA FASE: zero novo, so revisao+simulado. ':'') +
          (isPri?'PRIMEIRA FASE: comecar disciplinas de ALTA prioridade. ':'') + '\n\n' +
          'JSON (retorne APENAS isso):\n' +
          '{"dias":[{"dia":' + diaGlobal + ',"data":"' + datas[0] + '","questoes_dia":20,' +
          '"blocos":[{"hora_inicio":"07:00","hora_fim":"09:30",' +
          '"materia":"Direito Constitucional","tipo":"novo",' +
          '"descricao":"[ALTA] topico especifico",' +
          '"tecnica":"metodo de estudo","questoes_meta":15,' +
          '"roteiro":["0-20min: teoria","20-60min: 15 questoes","60-90min: erros"]}]}]}\n\n' +
          'Gere dias ' + diaGlobal + ' a ' + (diaGlobal+nDias-1) + '. TODOS os campos obrigatorios.';

        let p2 = null;
        try {
          const r2 = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
            body: JSON.stringify({
              model: 'claude-sonnet-4-5',
              max_tokens: 5000,
              system: sysPrompt2,
              messages: [{ role: 'user', content: step2Prompt }],
            }),
          });
          if (!r2.ok) { const eb2=await r2.json().catch(()=>({})); throw new Error(eb2?.error?.message || 'API fase '+(fi+1)+': '+r2.status); }
          const d2 = await r2.json();
          const t2 = (d2.content||[]).map(b=>b.text||'').join('');
          p2 = _extractAndRepairJSON(t2);
        } catch(e2) {
          console.warn('[Schedule Step2 fase '+(fi+1)+']', e2.message);
          p2 = null;
        }

        if (p2?.dias?.length) {
          fase.dias = p2.dias.map(d => ({
            ...d,
            questoes_dia: d.questoes_dia || 0,
            blocos: (d.blocos||[]).map(b => ({
              hora_inicio:   b.hora_inicio   || '07:00',
              hora_fim:      b.hora_fim      || '09:00',
              materia:       (b.materia      || 'Materia').slice(0, 60),
              tipo:          ['novo','revisao','simulado'].includes(b.tipo) ? b.tipo : 'novo',
              descricao:     (b.descricao    || '').slice(0, 200),
              tecnica:       (b.tecnica      || '').slice(0, 120),
              questoes_meta: parseInt(b.questoes_meta) || 0,
              roteiro:       Array.isArray(b.roteiro) ? b.roteiro.slice(0, 5).map(r => String(r).slice(0,120)) : [],
            })),
          }));
        } else {
          // Smart fallback: distribute disciplines round-robin across days
          fase.dias = datas.map((data, di) => {
            const diaNum = diaGlobal + di;
            const blocosFb = [];
            for (let bi = 0; bi < Math.min(blocosPorDia, 2); bi++) {
              const dIdx = (di * Math.min(blocosPorDia,2) + bi) % discList.length;
              const mat  = discList[dIdx] || 'Estudo';
              const tipoFb = isUlt ? (bi === 0 ? 'revisao' : 'simulado')
                           : bi === 1 ? 'revisao' : 'novo';
              const inicioH = bi === 0 ? '07' : '10';
              blocosFb.push({
                hora_inicio: inicioH + ':00',
                hora_fim:    (parseInt(inicioH)+3) + ':00',
                materia: mat, tipo: tipoFb,
                descricao: tipoFb === 'simulado' ? '[ALTA] Simulado — questões do estilo ' + banca
                         : tipoFb === 'revisao'  ? '[ALTA] Revisão: ' + mat
                         : '[ALTA] Estudo: ' + mat,
                tecnica: 'Seguir roteiro padrão', questoes_meta: tipoFb === 'novo' ? 10 : 15, roteiro: [],
              });
            }
            return { dia: diaNum, data, questoes_dia: 15, blocos: blocosFb };
          });
        }
        diaGlobal  += nDias;
        dataAtual.setDate(dataAtual.getDate() + nDias);
      }

      // ── Salva ──
      _data = { fases: fasesBase };
      _mode = 'ia';
      _activePhase = 0;
      _isLoading = false;
      if (_loadingTimer) clearInterval(_loadingTimer);
      _save();
      _renderView();

      // ── STEP 3: Explicação + Sugestões da IA (background, não bloqueia UI) ──
      _generateExplanation({ ctx, dias, horas, numFases, banca: banca||bancaForm, nome: examName, fasesBase, fracos, fortes, nivel: nivel, obj: objetivo, apiKey });

    } catch(err) {
      _isLoading = false;
      if (_loadingTimer) clearInterval(_loadingTimer);
      _renderView();
      _showError(err.message);
    }
  }

  /* ── Load AI explanation + suggestions (non-blocking) ── */
  async function _loadExplanation(ctx, fases, meta) {
    // Render the panel skeleton immediately
    const $view = document.getElementById('sch-view');
    if (!$view) return;
    const existingPanel = document.getElementById('sch-explain-panel');
    if (existingPanel) existingPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'sch-explain-panel';
    panel.className = 'sch-explain-panel open';
    panel.innerHTML = `
      <div class="sch-explain-header" onclick="this.parentElement.classList.toggle('open')">
        <div class="sch-explain-icon">🧠</div>
        <div class="sch-explain-title">ESTRATÉGIA DO CRONOGRAMA</div>
        <div class="sch-explain-body-meta" style="font-size:10px;color:var(--text-dim);margin-right:8px;">Análise da IA</div>
        <div class="sch-explain-chevron">▾</div>
      </div>
      <div class="sch-explain-body">
        <div class="sch-explain-loading">
          <div class="sch-explain-loading-dot"></div>
          <div class="sch-explain-loading-dot"></div>
          <div class="sch-explain-loading-dot"></div>
          <span style="margin-left:4px;">Analisando a estratégia gerada...</span>
        </div>
      </div>`;
    $view.insertBefore(panel, $view.firstChild);

    try {
      const apiKey = _getApiKey();
      if (!apiKey) return;

      const fasesSumario = fases.map((f,i) =>
        `Fase ${i+1} "${f.nome}": ${f.diasCount} dias — ${f.descricao}`
      ).join('; ');

      const prompt =
        'Você é um especialista em metodologia de estudos para concursos públicos brasileiros.\n\n' +
        'CRONOGRAMA GERADO:\n' + ctx + '\n\nFASES: ' + fasesSumario +
        (meta.fracos  ? '\nPontos fracos: '   + meta.fracos : '') +
        (meta.fortes  ? '\nPontos fortes: '   + meta.fortes : '') +
        '\n\nEscreva:\n' +
        '1. LOGICA: Em 2-3 frases, explique a lógica central da distribuição das fases e disciplinas.\n' +
        '2. ESTRATEGIA: Em 2-3 frases, descreva a estratégia aplicada (ex: 80/20, ciclo de revisão, intensidade progressiva).\n' +
        '3. DECISOES: Em 2-3 frases, justifique as principais decisões de priorização (o que foi enfatizado e por quê).\n' +
        '4. SUGESTOES: Liste exatamente 4 sugestões de melhoria personalizadas, cada uma com título em negrito e 1 frase explicativa. Use o padrão JSON abaixo.\n\n' +
        'Retorne APENAS este JSON (sem markdown, sem explicação fora do JSON):\n' +
        '{"logica":"texto","estrategia":"texto","decisoes":"texto","sugestoes":[{"icon":"emoji","titulo":"titulo curto","texto":"1 frase de sugestao"}]}';

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({ model:'claude-haiku-4-5-20251001', max_tokens:1200, messages:[{role:'user',content:prompt}] }),
      });

      if (!resp.ok) { panel.querySelector('.sch-explain-body').innerHTML = '<div style="font-size:11px;color:var(--text-dim);padding:8px 0">Não foi possível carregar a análise. O cronograma foi gerado com sucesso.</div>'; return; }

      const data = await resp.json();
      const raw  = (data.content||[]).map(b=>b.text||'').join('');
      const clean = raw.replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
      const json = JSON.parse(clean.slice(clean.indexOf('{'), clean.lastIndexOf('}')+1));

      const sugsHTML = (json.sugestoes||[]).map(s=>`
        <div class="sch-suggest-item">
          <div class="sch-suggest-icon">${s.icon||'💡'}</div>
          <div><strong>${s.titulo||''}</strong>${s.texto||''}</div>
        </div>`).join('');

      panel.querySelector('.sch-explain-body').innerHTML = `
        <div class="sch-explain-section">
          <div class="sch-explain-section-label">🧭 Lógica da Distribuição</div>
          <div class="sch-explain-text">${json.logica||''}</div>
        </div>
        <div class="sch-explain-section">
          <div class="sch-explain-section-label">⚡ Estratégia Aplicada</div>
          <div class="sch-explain-text">${json.estrategia||''}</div>
        </div>
        <div class="sch-explain-section">
          <div class="sch-explain-section-label">🎯 Decisões de Priorização</div>
          <div class="sch-explain-text">${json.decisoes||''}</div>
        </div>
        <div class="sch-explain-section">
          <div class="sch-explain-section-label">💡 Sugestões de Melhoria</div>
          <div class="sch-suggest-list">${sugsHTML}</div>
          <button class="sch-refine-btn" onclick="ScheduleEngine.refinarCronograma()">
            ↺ Aplicar sugestões e refinar cronograma
          </button>
        </div>`;

    } catch(e) {
      const $b = panel.querySelector('.sch-explain-body');
      if ($b) $b.innerHTML = '<div style="font-size:11px;color:var(--text-dim);padding:8px 0">Análise não disponível. O cronograma foi gerado com sucesso.</div>';
    }
  }

  /* ── Refinar: reopens modal with data intact ── */
  function refinarCronograma() {
    openAIModal();
    // Scroll to custom prompt to encourage refinement
    setTimeout(() => {
      const $sec = document.getElementById('sch-sec-custom');
      const $hd  = $sec?.querySelector('.sch-form-section-hd');
      if ($hd && !$hd.classList.contains('open')) $hd.classList.add('open');
      document.getElementById('sch-ai-custom-prompt')?.scrollIntoView({behavior:'smooth',block:'center'});
    }, 350);
  }


  /* ── Helper: atualiza mensagem de loading ── */
  function _updateLoadingMsg(msg) {
    const $msg = document.getElementById('sch-loading-msg');
    if ($msg) $msg.textContent = msg;
  }

  /* ────────── JSON Extractor + Repairer ────────── */
  function _extractAndRepairJSON(raw) {
    if (!raw) return null;

    // 1. Strip markdown fences
    let s = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/,      '')
      .replace(/\s*```$/,      '')
      .trim();

    // 2. Find outermost { ... } — also handle array [...]
    let start = s.indexOf('{');
    let arrStart = s.indexOf('[');
    // If array comes first and no object, wrap it
    if (arrStart !== -1 && (start === -1 || arrStart < start)) {
      const arrEnd = s.lastIndexOf(']');
      if (arrEnd > arrStart) {
        // Try to determine what array it is — fases or dias?
        const arrStr = s.slice(arrStart, arrEnd + 1);
        try {
          const arr = JSON.parse(arrStr);
          if (Array.isArray(arr) && arr.length > 0) {
            if (arr[0].diasCount !== undefined || arr[0].nome !== undefined) return { fases: arr };
            if (arr[0].dia !== undefined || arr[0].blocos !== undefined) return { dias: arr };
            return { data: arr };
          }
        } catch(_) {}
      }
    }

    const end = s.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;
    s = s.slice(start, end + 1);

    // 3. Try direct parse first
    try { return JSON.parse(s); } catch(_) {}

    // 4. Repair common AI JSON issues
    s = _repairJSON(s);

    // 5. Try again after repair
    try { return JSON.parse(s); } catch(_) {}

    // 6. Last resort: sanitize all string values character by character
    s = _deepSanitizeJSON(s);
    try { return JSON.parse(s); } catch(e) {
      console.warn('[ScheduleEngine] JSON repair failed:', e.message);
      return null;
    }
  }

  function _repairJSON(s) {
    // a) Remove trailing commas before } or ]
    s = s.replace(/,(\s*[}\]])/g, '$1');

    // b) Fix unescaped newlines/tabs inside string values
    //    Replace literal \n \r \t inside "..." with escaped versions
    s = s.replace(/"((?:[^"\\]|\\.)*)"/g, (match, inner) => {
      const fixed = inner
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      return '"' + fixed + '"';
    });

    // c) Fix unescaped double quotes inside string values (heuristic)
    //    Pattern: ": "..text "quoted" text.." → escape inner quotes
    s = s.replace(/:\s*"((?:[^"\\]|\\.)*)"(\s*[,}\]])/g, (match, inner, after) => {
      // Only escape quotes that aren't already escaped
      const fixed = inner.replace(/(?<!\\)"/g, '\\"');
      return ': "' + fixed + '"' + after;
    });

    // d) Remove control characters (except \n \r \t which are handled above)
    s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // e) Fix missing comma between array elements: } { → }, {
    s = s.replace(/\}\s*\{/g, '},{');
    s = s.replace(/\]\s*\[/g, '],[');

    return s;
  }

  function _deepSanitizeJSON(s) {
    // Walk through char by char, sanitize string values
    let out = '';
    let inStr = false;
    let escape = false;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (escape) {
        // Keep valid escape sequences, drop invalid ones
        const valid = ['"','\\','/','b','f','n','r','t','u'];
        if (valid.includes(c)) { out += '\\' + c; }
        else { out += c; } // drop the backslash, keep the char
        escape = false;
        continue;
      }
      if (c === '\\' && inStr) { escape = true; continue; }
      if (c === '"') { inStr = !inStr; out += c; continue; }
      if (inStr) {
        // Inside string: escape dangerous characters
        const code = c.charCodeAt(0);
        if (c === '\n')      { out += '\\n'; continue; }
        if (c === '\r')      { out += '\\r'; continue; }
        if (c === '\t')      { out += '\\t'; continue; }
        if (code < 0x20)     { continue; } // skip other control chars
      }
      out += c;
    }
    return out;
  }

  function _animateLoadingSteps() {
    const steps = document.querySelectorAll('.sch-loading-step');
    const msgs  = [
      'Analisando perfil e disciplinas...',
      'Planejando distribuição estratégica...',
      'Criando blocos de estudo...',
      'Montando revisões e simulados...',
      'Finalizando cronograma personalizado...',
    ];
    let idx = 0;
    _loadingTimer = setInterval(() => {
      if (!_isLoading) { clearInterval(_loadingTimer); return; }
      steps.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
        s.classList.toggle('done',   i < idx);
      });
      const $msg = document.getElementById('sch-loading-msg');
      if ($msg) $msg.textContent = msgs[idx] || msgs[msgs.length-1];
      idx = Math.min(idx + 1, steps.length - 1);
    }, 1100);
  }

  /* ────────── Manual Mode ────────── */
  function openManualEditor() {
    const profile = Onboarding.getUserProfile();
    const $dias = document.getElementById('man-total-dias');
    const $date = document.getElementById('man-start-date');
    if ($dias && profile) $dias.value = Math.min(profile.concurso?.diasRestantes || 30, 90);
    if ($date) {
      const d = new Date();
      $date.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
    openModal('modal-sch-manual');
  }

  function createManualSchedule() {
    const dias    = parseInt(document.getElementById('man-total-dias')?.value) || 30;
    const nFases  = parseInt(document.getElementById('man-num-fases')?.value)  || 3;
    const startRaw = document.getElementById('man-start-date')?.value;
    const start   = startRaw ? new Date(startRaw + 'T12:00:00') : new Date();

    const diasPorFase = Math.ceil(dias / nFases);
    const names = _defaultFaseNames(nFases);

    _data = {
      fases: names.map((f, fi) => {
        const d0 = fi * diasPorFase + 1;
        const d1 = Math.min((fi + 1) * diasPorFase, dias);
        return {
          nome: f.nome, descricao: f.desc,
          cor: PHASE_COLORS[fi % PHASE_COLORS.length],
          dias: Array.from({ length: Math.max(0, d1 - d0 + 1) }, (_, di) => {
            const dn = d0 + di;
            const dt = new Date(start);
            dt.setDate(dt.getDate() + dn - 1);
            return {
              dia: dn,
              data: `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}`,
              blocos: [],
            };
          }),
        };
      }),
    };

    _mode = 'manual';
    _activePhase = 0;
    _save();
    closeModal('modal-sch-manual');
    _renderView();
  }

  function _defaultFaseNames(n) {
    const pool = [
      { nome: 'Fase 1 — Fundamentos',    desc: 'Construção da base teórica em todas as disciplinas' },
      { nome: 'Fase 2 — Aprofundamento', desc: 'Aprofundamento e prática com questões' },
      { nome: 'Fase 3 — Consolidação',   desc: 'Revisão geral e fortalecimento de pontos fracos' },
      { nome: 'Fase 4 — Simulados',      desc: 'Treino intensivo com provas no estilo da banca' },
      { nome: 'Fase 5 — Reta Final',     desc: 'Revisão rápida e estratégia para o dia da prova' },
    ];
    return pool.slice(0, n);
  }

  /* ────────── Render ────────── */
  function renderCronograma(data) {
    if (data) { _data = data; _activePhase = 0; }
    _renderView();
  }

  function renderFase(index) {
    if (!_data?.fases?.length) return;
    _activePhase = Math.max(0, Math.min(index, _data.fases.length - 1));
    const fase   = _data.fases[_activePhase];
    const cor    = fase.cor || PHASE_COLORS[_activePhase % PHASE_COLORS.length];

    // Phase tabs
    const $tabs = document.getElementById('sch-phase-tabs');
    if ($tabs) {
      $tabs.innerHTML = _data.fases.map((f, fi) => `
        <button class="sch-phase-tab ${fi === _activePhase ? 'active' : ''}"
                onclick="ScheduleEngine.renderFase(${fi})">
          ${PHASE_ICONS[fi % PHASE_ICONS.length]} ${f.nome}
        </button>`).join('');
    }

    // Phase strip
    const $strip = document.getElementById('sch-phase-strip');
    if ($strip && fase) {
      const dias = fase.dias?.length || 0;
      const d0   = fase.dias?.[0]?.dia || '?';
      const d1   = fase.dias?.[dias-1]?.dia || '?';
      $strip.innerHTML = `
        <div class="sch-phase-strip-dot" style="background:${cor}"></div>
        <strong style="color:${cor}">${fase.nome}</strong>
        <span>—</span>
        <span>${fase.descricao || ''}</span>
        <span style="margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--text-dim)">
          ${dias} dias · D${d0}→D${d1}
        </span>`;
    }

    // Day grid — with smooth transition
    const checked = State.get('checkedBlocks') || {};
    const $grid   = document.getElementById('sch-day-grid');
    if (!$grid) return;

    $grid.style.opacity   = '0';
    $grid.style.transform = 'translateY(10px)';
    $grid.innerHTML = (fase.dias || []).map((dia, di) =>
      _renderDayCard(dia, _activePhase, di, checked)
    ).join('');

    requestAnimationFrame(() => {
      $grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      $grid.style.opacity    = '1';
      $grid.style.transform  = 'translateY(0)';
      // Build/refresh filter strip and re-apply active filter
      _buildFilterStrip();
      _applyFilter();
    });
  }

  function _renderDayCard(dia, fi, di, checked) {
    const blocos  = dia.blocos || [];
    const total   = blocos.length;
    const done    = blocos.filter((_, bi) => checked[`${fi}_${di}_${bi}`]).length;
    const pct     = total ? Math.round((done / total) * 100) : 0;
    const isToday = _isToday(dia.data);
    const isDone  = total > 0 && pct === 100;

    // Compute total study minutes
    const totalMins = blocos.reduce((acc, b) => {
      const toMins = t => { const [h,m] = (t||'00:00').split(':').map(Number); return h*60+m; };
      return acc + Math.max(0, toMins(b.hora_fim) - toMins(b.hora_inicio));
    }, 0);
    const totalH = totalMins >= 60 ? Math.floor(totalMins/60)+'h'+(totalMins%60>0?String(totalMins%60).padStart(2,'0')+'min':'') : totalMins+'min';

    // Day load intensity
    const loadLevel = totalMins <= 180 ? 'leve' : totalMins <= 360 ? 'moderado' : 'intenso';
    const loadColor = loadLevel === 'leve' ? 'var(--green)' : loadLevel === 'moderado' ? 'var(--gold)' : 'var(--red)';
    const loadLabel = loadLevel === 'leve' ? '⚡ Leve' : loadLevel === 'moderado' ? '🔥 Moderado' : '💪 Intenso';

    // Type distribution badges
    const tipos = { novo: 0, revisao: 0, simulado: 0 };
    blocos.forEach(b => { if (tipos[b.tipo] !== undefined) tipos[b.tipo]++; });
    const typeBadges = [
      tipos.novo    > 0 ? `<span class="sch-day-type-pill new">${tipos.novo} Novo</span>`     : '',
      tipos.revisao > 0 ? `<span class="sch-day-type-pill rev">${tipos.revisao} Rev</span>`   : '',
      tipos.simulado> 0 ? `<span class="sch-day-type-pill sim">${tipos.simulado} Sim</span>` : '',
    ].filter(Boolean).join('');

    // Total questoes do dia
    const totalQuestoes = blocos.reduce((s, b) => s + (b.questoes_meta || 0), 0);
    const questoesDiaHTML = totalQuestoes > 0
      ? `<span class="sch-day-questoes-badge">🎯 ${totalQuestoes}q</span>` : '';

    const blocksHTML = blocos.length
      ? blocos.map((b, bi) => _renderBlock(b, fi, di, bi, checked)).join('')
      : `<div class="sch-day-empty">Nenhum bloco. Clique abaixo para adicionar.</div>`;

    return `
      <div class="sch-day-card ${isToday ? 'today' : ''} ${isDone ? 'completed' : ''}"
           id="sch-day-${fi}-${di}">
        <div class="sch-day-header">
          <div class="sch-day-header-left">
            <div class="sch-day-num">DIA ${dia.dia}</div>
            <div class="sch-day-date">${dia.data || ''}</div>
          </div>
          <div class="sch-day-header-right">
            ${isToday ? '<div class="sch-day-badge-today">HOJE</div>' : ''}
            ${isDone  ? '<span class="sch-day-badge-done">✅</span>' : ''}
            ${total   ? `<span class="sch-day-counter">${done}/${total}</span>` : ''}
          </div>
        </div>
        <!-- Load indicator row -->
        <div class="sch-day-meta-row">
          <span class="sch-day-load-badge" style="color:${loadColor};border-color:${loadColor}40">${loadLabel}</span>
          <span class="sch-day-time-total">⏱ ${totalH}</span>
          ${questoesDiaHTML}
          <div class="sch-day-type-pills">${typeBadges}</div>
        </div>
        <div class="sch-day-progress">
          <div class="sch-day-prog-fill" id="sch-dpf-${fi}-${di}" style="width:${pct}%"></div>
        </div>
        <div class="sch-blocks-list">${blocksHTML}</div>
        <button class="sch-add-block-btn" onclick="ScheduleEngine.adicionarBloco(${fi},${di})">
          + Adicionar bloco de estudo
        </button>
      </div>`;
  }


  function _renderBlock(bloco, fi, di, bi, checked) {
    const key      = `${fi}_${di}_${bi}`;
    const isDone   = !!checked[key];
    const tipo     = bloco.tipo || 'novo';
    const tagMap   = { novo:'tag-new', revisao:'tag-rev', simulado:'tag-sim' };
    const lblMap   = { novo:'NOVO', revisao:'REVISÃO', simulado:'SIMULADO' };
    const isMarked = ReviewSystem.isMarked('block', key);

    // Duration
    const toMins  = t => {
      if (!t || typeof t !== 'string') return 0;
      const parts = t.split(':');
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;
      return h*60 + m;
    };
    const durMins  = Math.max(0, toMins(bloco.hora_fim) - toMins(bloco.hora_inicio));
    const durH     = Math.floor(durMins / 60);
    const durM     = durMins % 60;
    const durLabel = durMins === 0 ? '' : durMins < 60 ? durMins+'min' : durH+'h'+(durM>0?String(durM).padStart(2,'0'):'');

    // Priority
    const priority = (bloco.descricao||'').startsWith('[ALTA]') ? 'alta'
      : (bloco.descricao||'').startsWith('[MEDIA]') ? 'media' : '';

    // Roteiro tooltip content (for 💡 bubble)
    const tecnicaIcon = tipo === 'simulado' ? '📝' : tipo === 'revisao' ? '🔁' : '📖';
    const hasRoteiro  = (bloco.roteiro||[]).length > 0;
    const roteiroTooltipHTML = hasRoteiro
      ? `<div class="sch-roteiro-bubble" id="rb-${key}">
          <div class="srb-header">
            <span class="srb-icon">${tecnicaIcon}</span>
            <span class="srb-title">Roteiro da Sessão</span>
            <button class="srb-close" onclick="event.stopPropagation();ScheduleEngine.closeRoteiroBubble('${key}')">✕</button>
          </div>
          <ol class="srb-list">
            ${(bloco.roteiro||[]).map((step,si) => `<li class="srb-step"><span class="srb-num">${si+1}</span><span class="srb-text">${step}</span></li>`).join('')}
          </ol>
          ${bloco.tecnica ? `<div class="srb-tecnica">💡 ${bloco.tecnica}</div>` : ''}
          ${bloco.questoes_meta > 0 ? `<div class="srb-meta">🎯 Meta: <strong>${bloco.questoes_meta} questões</strong></div>` : ''}
        </div>` : '';

    // Questoes badge (stays in meta row)
    const questoesHTML = bloco.questoes_meta > 0
      ? `<div class="sch-questoes-badge">
          <span class="sch-questoes-icon">🎯</span>
          <span class="sch-questoes-num">${bloco.questoes_meta}</span>
          <span class="sch-questoes-lbl">questões</span>
        </div>` : '';

    // Description: always visible, expandable if long
    const desc     = bloco.descricao || '';
    const descLong = false; /* topics never truncate */
    const descHTML = desc
      ? `<div class="sch-block-desc-wrap">
           <div class="sch-block-desc ${descLong ? 'truncated' : ''}" id="desc-${key}">${desc}</div>
           ${descLong ? `<button class="sch-desc-toggle" onclick="event.stopPropagation();ScheduleEngine.toggleDescExpand('${key}',this)">Ver mais ▾</button>` : ''}
         </div>` : '';

    return `
      <div class="sch-block tipo-${tipo} ${isDone ? 'done' : ''} ${priority?'prio-'+priority:''}"
           id="sch-block-${fi}-${di}-${bi}">
        <div class="sch-tipo-bar"></div>
        <div class="sch-block-check" onclick="ScheduleEngine.toggleBlock('${key}',this)">${isDone ? '✓' : ''}</div>
        <div class="sch-block-body">
          <div class="sch-block-meta">
            <span class="sch-block-time">${bloco.hora_inicio||''}–${bloco.hora_fim||''}</span>
            <span class="sch-block-dur">${durLabel}</span>
            <span class="tag ${tagMap[tipo]||'tag-new'}">${lblMap[tipo]||tipo.toUpperCase()}</span>${questoesHTML}
          </div>
          <div class="sch-block-materia-row">
            <div class="sch-block-materia">${bloco.materia||'—'}</div>
            <div style="display:flex;gap:4px;align-items:center">
              <button class="sch-flash-gen-btn" title="Gerar Flashcards deste bloco"
                onclick="event.stopPropagation();FCGenerator.openFromBlock('${(bloco.materia||'').replace(/'/g,'&#39;').replace(/`/g,'\\`')}','${(bloco.descricao||'').replace(/\n/g,' · ').replace(/›\s*/g,'').replace(/'/g,'&#39;').replace(/`/g,'\\`').slice(0,200)}')">🃏</button>
              ${hasRoteiro ? `<button class="sch-roteiro-btn" title="Ver roteiro da sessão"
                onclick="event.stopPropagation();ScheduleEngine.toggleRoteiroBubble('${key}',this)">💡</button>` : ''}
            </div>
          </div>
          ${descHTML}
          ${roteiroTooltipHTML}
        </div>
        <div class="sch-block-actions">
          <button class="sch-block-act-btn start" title="Iniciar estudo"
                  onclick="event.stopPropagation();ScheduleEngine.startStudyBlock('${(bloco.materia||'').replace(/'/g,'&#39;')}','${key}')">▶</button>
          <button class="sch-block-act-btn rev ${isMarked?'marked':''}"
                  onclick="event.stopPropagation();ReviewSystem.toggleMark('block','${key}','${(bloco.materia||'').replace(/'/g,'&#39;')}','${(bloco.descricao||'').replace(/'/g,'&#39;')}',this)"
                  title="${isMarked?'Na fila de revisão':'Marcar para revisão'}">🔁</button>
          <button class="sch-block-act-btn edit" onclick="event.stopPropagation();ScheduleEngine.editarBloco(${fi},${di},${bi})" title="Editar">✎</button>
          <button class="sch-block-act-btn del"  onclick="event.stopPropagation();ScheduleEngine.removerBloco(${fi},${di},${bi})" title="Remover">✕</button>
        </div>
      </div>`;
  }


  function _isToday(dataStr) {
    if (!dataStr) return false;
    const [dd, mm] = dataStr.split('/').map(Number);
    const n = new Date();
    return n.getDate() === dd && n.getMonth() + 1 === mm;
  }

  /* ────────── Block Interactions ────────── */
  function toggleBlockDetails(btn) {
    const block   = btn.closest('.sch-block');
    const details = block?.querySelector('.sch-block-details');
    if (!details) return;
    const open = details.style.display !== 'none';
    details.style.display = open ? 'none' : 'block';
    btn.classList.toggle('open', !open);
    btn.title = open ? 'Ver roteiro' : 'Ocultar roteiro';
  }

  function toggleBlock(key, el) {
    const checked = State.get('checkedBlocks') || {};
    const nowDone = !checked[key];

    // If marking as DONE → show checklist modal
    if (nowDone) {
      _showChecklistModal(key, el);
      return;
    }
    // Unmarking — just toggle off
    checked[key] = false;
    State.set('checkedBlocks', checked);
    const block = el.closest('.sch-block');
    if (block) block.classList.remove('done');
    el.textContent = '';
    const [fi, di] = key.split('_').map(Number);
    _refreshDayProgress(fi, di);
    Render.dashboard();
  }

  function _showChecklistModal(key, el) {
    // Remove any existing modal
    document.getElementById('sch-checklist-modal')?.remove();

    const items = [
      { id:'cl_teoria',    label:'Estudei a teoria / li o material' },
      { id:'cl_questoes',  label:'Resolvi questões do tema' },
      { id:'cl_erros',     label:'Revisei e anotei os erros' },
      { id:'cl_roteiro',   label:'Segui o roteiro da sessão' },
    ];

    const modal = document.createElement('div');
    modal.id = 'sch-checklist-modal';
    modal.innerHTML = `
      <div class="sch-cl-backdrop" onclick="document.getElementById('sch-checklist-modal').remove()"></div>
      <div class="sch-cl-modal">
        <div class="sch-cl-header">
          <div class="sch-cl-icon">✅</div>
          <div>
            <div class="sch-cl-title">Sessão Concluída!</div>
            <div class="sch-cl-sub">O que você fez nessa sessão?</div>
          </div>
        </div>
        <div class="sch-cl-items">
          ${items.map(it => `
            <label class="sch-cl-item" for="${it.id}_${key.replace(/\W/g,'_')}">
              <input type="checkbox" id="${it.id}_${key.replace(/\W/g,'_')}" class="sch-cl-check" checked>
              <span class="sch-cl-item-label">${it.label}</span>
            </label>`).join('')}
        </div>
        <div class="sch-cl-quality">
          <div class="sch-cl-quality-label">Como foi a sessão?</div>
          <div class="sch-cl-quality-btns">
            <button class="sch-cl-q-btn" data-q="1" onclick="this.parentElement.querySelectorAll('.sch-cl-q-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">😓 Difícil</button>
            <button class="sch-cl-q-btn active" data-q="2" onclick="this.parentElement.querySelectorAll('.sch-cl-q-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">🙂 Normal</button>
            <button class="sch-cl-q-btn" data-q="3" onclick="this.parentElement.querySelectorAll('.sch-cl-q-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')">🔥 Produtivo</button>
          </div>
        </div>
        <div class="sch-cl-footer">
          <button class="sch-cl-btn-skip" onclick="ScheduleEngine._confirmBlock('${key}',null);document.getElementById('sch-checklist-modal').remove()">Pular</button>
          <button class="sch-cl-btn-confirm" onclick="ScheduleEngine._confirmBlockFromModal('${key}')">Confirmar ✓</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    // Animate in
    requestAnimationFrame(() => modal.querySelector('.sch-cl-modal').classList.add('open'));
  }

  function _confirmBlockFromModal(key) {
    const modal  = document.getElementById('sch-checklist-modal');
    const checks = modal?.querySelectorAll('.sch-cl-check');
    const quality= modal?.querySelector('.sch-cl-q-btn.active')?.dataset?.q;
    const done   = checks ? [...checks].filter(c => c.checked).map(c => c.id.split('_')[1]) : [];
    modal?.remove();
    _confirmBlock(key, { checklist: done, quality: parseInt(quality)||2 });
  }

  function _confirmBlock(key, meta) {
    const checked = State.get('checkedBlocks') || {};
    checked[key]  = true;
    State.set('checkedBlocks', checked);

    // Save session quality metadata
    if (meta) {
      const blockMeta = State.get('blockMeta') || {};
      blockMeta[key]  = { ...meta, ts: Date.now() };
      State.set('blockMeta', blockMeta);
    }

    // Update DOM
    const block = document.getElementById(`sch-block-${key.replace(/_/g,'-')}`);
    if (block) {
      block.classList.add('done');
      const chk = block.querySelector('.sch-block-check');
      if (chk) chk.textContent = '✓';
    }
    const [fi, di] = key.split('_').map(Number);
    _refreshDayProgress(fi, di);
    Render.dashboard();
  }


  function _refreshDayProgress(fi, di) {
    const dia = _data?.fases?.[fi]?.dias?.[di];
    if (!dia) return;
    const checked = State.get('checkedBlocks') || {};
    const total   = dia.blocos?.length || 0;
    const done    = (dia.blocos || []).filter((_, bi) => checked[`${fi}_${di}_${bi}`]).length;
    const pct     = total ? Math.round((done / total) * 100) : 0;
    const $fill   = document.getElementById(`sch-dpf-${fi}-${di}`);
    if ($fill) $fill.style.width = pct + '%';
    const $card   = document.getElementById(`sch-day-${fi}-${di}`);
    if ($card) $card.classList.toggle('completed', pct === 100 && total > 0);
  }

  /* ────────── editarBloco (inline) ────────── */
  function editarBloco(fi, di, bi) {
    const bloco = _data?.fases?.[fi]?.dias?.[di]?.blocos?.[bi];
    if (!bloco) return;

    // Remove existing edit modal
    document.getElementById('sch-edit-modal-wrap')?.remove();

    const t = bloco.tipo || 'novo';
    const wrap = document.createElement('div');
    wrap.id = 'sch-edit-modal-wrap';
    wrap.innerHTML = `
      <div class="sch-edit-backdrop" onclick="document.getElementById('sch-edit-modal-wrap').remove()"></div>
      <div class="sch-edit-modal">
        <div class="sch-edit-header">
          <div class="sch-edit-header-icon">✎</div>
          <div>
            <div class="sch-edit-title">Editar Bloco</div>
            <div class="sch-edit-sub">Dia ${_data.fases[fi].dias[di].dia} · ${_data.fases[fi].dias[di].data||''}</div>
          </div>
          <button class="sch-edit-close" onclick="document.getElementById('sch-edit-modal-wrap').remove()">✕</button>
        </div>
        <div class="sch-edit-body">
          <div class="sch-edit-row">
            <div class="sch-edit-field half">
              <label class="sch-edit-label">Início</label>
              <input class="sch-edit-input" id="sch-ei-ini" value="${bloco.hora_inicio||'07:00'}" placeholder="07:00">
            </div>
            <div class="sch-edit-field half">
              <label class="sch-edit-label">Fim</label>
              <input class="sch-edit-input" id="sch-ei-fim" value="${bloco.hora_fim||'09:00'}" placeholder="09:00">
            </div>
            <div class="sch-edit-field half">
              <label class="sch-edit-label">Tipo</label>
              <select class="sch-edit-select" id="sch-ei-tipo">
                <option value="novo"     ${t==='novo'    ?'selected':''}>📖 NOVO</option>
                <option value="revisao"  ${t==='revisao' ?'selected':''}>🔁 REVISÃO</option>
                <option value="simulado" ${t==='simulado'?'selected':''}>📝 SIMULADO</option>
              </select>
            </div>
          </div>
          <div class="sch-edit-field">
            <label class="sch-edit-label">Matéria</label>
            <input class="sch-edit-input" id="sch-ei-mat" value="${(bloco.materia||'').replace(/"/g,'&quot;')}" placeholder="Ex: Direito Constitucional">
          </div>
          <div class="sch-edit-field">
            <label class="sch-edit-label">Tópico / Descrição</label>
            <textarea class="sch-edit-textarea" id="sch-ei-desc" rows="3" placeholder="Ex: [ALTA] Princípios fundamentais, art. 5º...">${(bloco.descricao||'').replace(/</g,'&lt;')}</textarea>
          </div>
        </div>
        <div class="sch-edit-footer">
          <button class="sch-edit-btn cancel" onclick="document.getElementById('sch-edit-modal-wrap').remove()">Cancelar</button>
          <button class="sch-edit-btn save" onclick="ScheduleEngine.salvarEdicaoBloco(${fi},${di},${bi})">✓ Salvar</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.querySelector('.sch-edit-modal').classList.add('open'));
  }


  function salvarEdicaoBloco(fi, di, bi) {
    const g = id => document.getElementById(id)?.value.trim() || '';
    if (!_data?.fases?.[fi]?.dias?.[di]?.blocos) return;
    const existing = _data.fases[fi].dias[di].blocos[bi] || {};
    _data.fases[fi].dias[di].blocos[bi] = {
      ...existing,
      hora_inicio: g('sch-ei-ini') || '07:00',
      hora_fim:    g('sch-ei-fim') || '09:00',
      materia:     g('sch-ei-mat') || 'Matéria',
      tipo:        document.getElementById('sch-ei-tipo')?.value || 'novo',
      descricao:   g('sch-ei-desc'),
    };
    document.getElementById('sch-edit-modal-wrap')?.remove();
    _save();
    renderFase(_activePhase);
  }


  /* ────────── adicionarBloco ────────── */
  function adicionarBloco(fi, di) {
    if (!_data?.fases?.[fi]?.dias?.[di]) return;
    const blocos = _data.fases[fi].dias[di].blocos || [];

    // Smart time defaults
    const lastFim = blocos[blocos.length - 1]?.hora_fim || '07:00';
    const [lh, lm] = lastFim.split(':').map(Number);
    const nh = Math.min(lh + 2, 21);
    const fh = Math.min(lh + 4, 23);
    const pad = n => String(n).padStart(2,'0');

    const profile = Onboarding.getUserProfile();
    const materia = profile?.disciplinas?.[0]?.name || 'Matéria';

    blocos.push({
      hora_inicio: `${pad(nh)}:${pad(lm)}`,
      hora_fim:    `${pad(fh)}:${pad(lm)}`,
      materia, tipo: 'novo', descricao: 'Novo bloco de estudo',
    });
    _data.fases[fi].dias[di].blocos = blocos;
    _save();
    renderFase(fi);

    // Auto-open inline edit for the new block
    const newBi = blocos.length - 1;
    setTimeout(() => editarBloco(fi, di, newBi), 80);
  }

  /* ────────── removerBloco ────────── */
  function removerBloco(fi, di, bi) {
    if (!_data?.fases?.[fi]?.dias?.[di]?.blocos) return;
    _data.fases[fi].dias[di].blocos.splice(bi, 1);

    // Re-key checkedBlocks for this day
    const checked    = State.get('checkedBlocks') || {};
    const newChecked = {};
    Object.entries(checked).forEach(([k, v]) => {
      const p = k.split('_');
      if (p.length === 3) {
        const [kfi, kdi, kbi] = p.map(Number);
        if (kfi === fi && kdi === di) {
          if (kbi < bi) newChecked[k] = v;
          else if (kbi > bi) newChecked[`${kfi}_${kdi}_${kbi - 1}`] = v;
        } else { newChecked[k] = v; }
      } else { newChecked[k] = v; }
    });
    State.set('checkedBlocks', newChecked);
    _save();
    renderFase(fi);
  }

  /* ────────── clearSchedule ────────── */
  function clearSchedule() {
    if (!confirm('Apagar o cronograma atual? Esta ação não pode ser desfeita.')) return;
    _data = null; _mode = null; _activePhase = 0;
    localStorage.removeItem(SCHED_KEY);
    State.set('checkedBlocks', {});
    _renderView();
  }

  /* ────────── Error display ────────── */
  function _showError(msg) {
    const $view  = document.getElementById('sch-view');
    const $empty = document.getElementById('sch-empty-state');
    const $grid  = document.getElementById('sch-day-grid');
    if ($view)  $view.style.display  = 'block';
    if ($empty) $empty.style.display = 'none';
    if ($grid)  $grid.innerHTML = `
      <div class="sch-error-state" style="grid-column:1/-1">
        ⚠️ ${msg}<br>
        <button class="sch-btn-secondary" onclick="ScheduleEngine.openAIModal()" style="margin-top:12px">
          Tentar novamente
        </button>
        <button class="sch-btn-secondary" onclick="ScheduleEngine.openManualEditor()" style="margin-top:12px;margin-left:8px">
          Criar manualmente
        </button>
      </div>`;
  }

  /* ────────── Stats for dashboard ────────── */
  function getStats() {
    if (!hasSchedule()) return null;
    const checked = State.get('checkedBlocks') || {};
    let total = 0, done = 0;
    _data.fases.forEach((fase, fi) => {
      (fase.dias || []).forEach((dia, di) => {
        (dia.blocos || []).forEach((_, bi) => {
          total++;
          if (checked[`${fi}_${di}_${bi}`]) done++;
        });
      });
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0, fases: _data.fases.length };
  }


  /* ── _generateExplanation ── */
  async function _generateExplanation({ ctx, dias, horas, numFases, banca, nome, fasesBase, fracos, fortes, nivel, obj, apiKey }) {
    _injectExplainPanel();
    const prompt = `Especialista em concursos públicos brasileiros. Analise o cronograma:
DADOS: ${ctx} | ${dias} dias | ${horas}h/dia | ${numFases} fases | Banca: ${banca}
${fracos ? 'Fracos: ' + fracos : ''}${fortes ? ' | Fortes: ' + fortes : ''}
Nível: ${nivel} | Objetivo: ${obj}
Fases: ${fasesBase.map((f,i)=>'F'+(i+1)+' '+f.nome+' ('+f.diasCount+'d)').join(' | ')}

Responda em 3 blocos separados por "---":
BLOCO 1 - ESTRATÉGIA (3-4 frases motivadoras sobre a lógica do cronograma e aplicação do 80/20):
BLOCO 2 - DECISÕES-CHAVE (3 itens em lista com • sobre escolhas específicas da IA):
BLOCO 3 - SUGESTÕES (retorne APENAS JSON sem markdown): [{"icone":"emoji","titulo":"titulo","texto":"sugestao em 1 frase"}]`;
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({ model:'claude-haiku-4-5-20251001', max_tokens:700, messages:[{role:'user',content:prompt}] }),
      });
      if (!resp.ok) return _showExplainFallback();
      const data = await resp.json();
      const raw  = (data.content||[]).map(b=>b.text||'').join('');
      _renderExplanation(raw);
    } catch(e) { _showExplainFallback(); }
  }

  function _injectExplainPanel() {
    const $view = document.getElementById('sch-view');
    if (!$view) return;
    document.getElementById('sch-explain-panel')?.remove();
    const panel = document.createElement('div');
    panel.id = 'sch-explain-panel';
    panel.className = 'sch-explain-panel';
    panel.innerHTML =
      '<div class="sch-explain-hdr open" onclick="this.classList.toggle(\'open\');this.nextElementSibling.classList.toggle(\'open\')">' +
        '<span style="font-size:16px">🧠</span>' +
        '<span class="sch-explain-hdr-title">ESTRATÉGIA DO CRONOGRAMA</span>' +
        '<span class="sch-explain-hdr-badge">IA</span>' +
        '<span class="sch-explain-hdr-chevron">▾</span>' +
      '</div>' +
      '<div class="sch-explain-body open" id="sch-explain-body">' +
        '<div class="sch-explain-loading"><div class="sch-explain-loading-dot"></div><span>Analisando cronograma e preparando explicação...</span></div>' +
      '</div>';
    $view.insertBefore(panel, $view.firstChild);
  }

  function _renderExplanation(raw) {
    const $b = document.getElementById('sch-explain-body');
    if (!$b) return;
    const parts = raw.split(/\n?---\n?/);
    const strat = parts[0] || '';
    const decs  = parts[1] || '';
    let   sugs  = [];
    try {
      const m = parts[2] && parts[2].match(/\[.*\]/s);
      if (m) sugs = JSON.parse(m[0]);
    } catch(_) {}
    const fmt = t => t.replace(/^BLOCO.*\n?/gm,'').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').trim();
    $b.innerHTML =
      '<div class="sch-explain-text">' + fmt(strat) + '</div>' +
      (decs ? '<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-subtle)"><div style="font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-dim);margin-bottom:9px;">⚖️ DECISÕES-CHAVE</div><div class="sch-explain-text">' + fmt(decs) + '</div></div>' : '') +
      (sugs.length ? '<div class="sch-suggest-list"><div style="font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--gold);margin-bottom:6px;">💡 SUGESTÕES DE MELHORIA</div>' +
        sugs.map(s=>'<div class="sch-suggest-item"><div class="sch-suggest-icon">'+(s.icone||'💡')+'</div><div class="sch-suggest-text"><strong>'+(s.titulo||'')+'</strong>'+(s.texto||'')+'</div></div>').join('') +
        '<button class="sch-refine-btn" onclick="ScheduleEngine.openAIModal()">↺ Refinar Cronograma com essas sugestões</button></div>' : '');
  }

  function _showExplainFallback() {
    const $b = document.getElementById('sch-explain-body');
    if ($b) $b.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:8px 0">Cronograma gerado! Use ↺ Regenerar para refinar os parâmetros.</div>';
  }


  /* ── Start study block: opens cronômetro with discipline pre-filled ── */
  function startStudyBlock(materia, blockKey) {
    // Mark block in progress
    if (typeof StudyTimer !== 'undefined') {
      // Open the cronômetro fullscreen with the discipline pre-set
      StudyTimer.openFullscreen();
      // Pre-fill discipline after a tick
      setTimeout(() => {
        const $disc = document.getElementById('reg-disciplina');
        if ($disc && materia) {
          // Try to find matching option
          const opts = [...$disc.options];
          const match = opts.find(o => o.value === materia || o.text === materia || (o.text||'').toLowerCase().includes((materia||'').toLowerCase().slice(0,12)));
          if (match) $disc.value = match.value;
          // If no match, set as free text if supported
        }
        // Show toast
        const t = document.createElement('div');
        t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(46,204,113,.12);border:1px solid rgba(46,204,113,.3);color:var(--green);padding:9px 18px;border-radius:10px;font-size:11px;font-weight:700;z-index:99999;pointer-events:none';
        t.textContent = '▶ Iniciando: ' + materia;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2500);
      }, 300);
    }
  }



  /* ── Roteiro bubble toggle ── */
  function toggleRoteiroBubble(key, btn) {
    // Remove any existing popup
    const existingPopup = document.getElementById('roteiro-popup');
    if (existingPopup) {
      if (existingPopup.dataset.key === key) {
        existingPopup.remove(); return; // toggle off
      }
      existingPopup.remove();
    }

    const bubble = document.getElementById('rb-' + key);
    if (!bubble) return;

    // Clone bubble content into a fixed popup attached to body
    const popup = document.createElement('div');
    popup.id = 'roteiro-popup';
    popup.dataset.key = key;
    popup.className = 'roteiro-popup';
    popup.innerHTML = bubble.innerHTML;
    document.body.appendChild(popup);

    // Fix close button in cloned popup
    const closeBtn = popup.querySelector('.srb-close');
    if (closeBtn) closeBtn.onclick = (e) => { e.stopPropagation(); popup.remove(); };

    // Position relative to button (fixed viewport coords)
    const rect = btn.getBoundingClientRect();
    const popW = Math.min(320, window.innerWidth - 24);
    let left = rect.left - popW/2 + rect.width/2;
    let top  = rect.bottom + 16;

    // Clamp horizontally
    left = Math.max(12, Math.min(left, window.innerWidth - popW - 12));

    // Flip up if bottom overflow
    if (top + 320 > window.innerHeight - 12) {
      top = rect.top - 320 - 12;
      popup.classList.add('flip-up');
    } else {
      popup.classList.remove('flip-up');
    }

    popup.style.left  = left + 'px';
    popup.style.top   = top  + 'px';
    popup.style.width = popW + 'px';

    // Animate in
    requestAnimationFrame(() => popup.classList.add('open'));

    // Close on outside click
    setTimeout(() => {
      const handler = (e) => {
        if (!popup.contains(e.target) && e.target !== btn) {
          popup.remove();
          document.removeEventListener('click', handler);
        }
      };
      document.addEventListener('click', handler);
    }, 10);
  }

  function closeRoteiroBubble(key) {
    const b = document.getElementById('rb-' + key);
    if (b) { b.classList.remove('open'); b.style.cssText = ''; }
  }

  /* ── Description expand/collapse ── */
  function toggleDescExpand(key, btn) {
    const desc = document.getElementById('desc-' + key);
    if (!desc) return;
    // Remove ALL inline styles that might be interfering
    desc.removeAttribute('style');
    const expanding = desc.classList.contains('truncated');
    desc.classList.toggle('truncated', !expanding);
    btn.textContent = expanding ? 'Ver menos ▴' : 'Ver mais ▾';
  }


  /* ── Filter functions ── */
  function _buildFilterStrip() {
    if (!_data || !_data.fases) return;
    var $chips = document.getElementById('sch-filter-chips');
    if (!$chips) return;
    var cnt = {}, clr = {};
    _data.fases.forEach(function(f) {
      (f.dias || []).forEach(function(d) {
        (d.blocos || []).forEach(function(b) {
          var m = b.materia || ''; if (!m) return;
          cnt[m] = (cnt[m]||0)+1;
          if (!clr[m]) clr[m] = _matColor(m);
        });
      });
    });
    var mats = Object.keys(cnt).sort(function(a,b){ return cnt[b]-cnt[a]; });
    $chips.innerHTML = mats.map(function(mat) {
      var active = _filterMateria === mat;
      var short  = mat.replace(/^(Dir\. |Leg\. |Proc\. |Noções de )/, '');
      var safeMat = mat.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
      return '<button class="sch-filter-chip'+(active?' active':'')+'"' +
             ' data-mat="'+safeMat+'"' +
             ' onclick="ScheduleEngine.setFilter(this.dataset.mat)"' +
             ' title="'+safeMat+'">' +
             '<div class="sch-filter-chip-dot" style="background:'+clr[mat]+'"></div>' +
             short+' <span class="sch-filter-chip-count">'+cnt[mat]+'</span></button>';
    }).join('');
  }

  function _matColor(name) {
    var C=['#4D9FFF','#E8B84B','#2ECC71','#FF4D4D','#A78BFA','#FF8C42','#00CEC9','#FD79A8','#6C8EBF','#82B366'];
    var h=0; for(var i=0;i<name.length;i++) h=((h<<5)-h+name.charCodeAt(i))|0;
    return C[Math.abs(h)%C.length];
  }

  function setFilter(mat) {
    _filterMateria = (_filterMateria===mat) ? null : mat;
    _applyFilter(); _buildFilterStrip();
  }

  function clearFilter() {
    _filterMateria = null;
    _applyFilter(); _buildFilterStrip();
  }

  function _applyFilter() {
    var $cl = document.getElementById('sch-filter-clear');
    var $ct = document.getElementById('sch-filter-match-count');
    var $dy = document.querySelectorAll('.sch-day-card');
    var n = 0;
    if (!_filterMateria) {
      $dy.forEach(function(d){d.classList.remove('sch-filtered-out','sch-filter-match');});
      document.querySelectorAll('.sch-block').forEach(function(b){b.classList.remove('sch-block-no-match');});
      if($cl) $cl.classList.remove('visible');
      if($ct) $ct.textContent='';
      return;
    }
    if($cl) $cl.classList.add('visible');
    $dy.forEach(function(day) {
      var ok=false;
      day.querySelectorAll('.sch-block').forEach(function(b) {
        var el=b.querySelector('.sch-block-materia');
        var nm=el?el.textContent.trim():'';
        if(nm===_filterMateria){b.classList.remove('sch-block-no-match');ok=true;}
        else b.classList.add('sch-block-no-match');
      });
      if(ok){day.classList.remove('sch-filtered-out');day.classList.add('sch-filter-match');n++;}
      else{day.classList.add('sch-filtered-out');day.classList.remove('sch-filter-match');}
    });
    if($ct) $ct.textContent=n+' dia'+(n!==1?'s':'')+' encontrados';
  }


  /* ── Subject filter functions ── */
  function _buildFilterStrip() {
    if (!_data || !_data.fases) return;
    var $sel = document.getElementById('sch-filter-select');
    if (!$sel) return;

    // Collect unique matérias from all phases/days
    var mats = [];
    var seen = {};
    _data.fases.forEach(function(f) {
      (f.dias || []).forEach(function(d) {
        (d.blocos || []).forEach(function(b) {
          var m = (b.materia || '').trim();
          if (m && !seen[m]) { seen[m] = true; mats.push(m); }
        });
      });
    });
    mats.sort();

    // Rebuild options (preserve current selection)
    var cur = $sel.value;
    var opts = '<option value="">Todas as matérias</option>';
    mats.forEach(function(m) {
      var safe = m.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
      opts += '<option value="'+safe+'"'+(cur===m?' selected':'')+'>'+safe+'</option>';
    });
    $sel.innerHTML = opts;

    // Style select if filter active
    if (_filterMateria) {
      $sel.classList.add('active');
    } else {
      $sel.classList.remove('active');
    }
  }

  function setFilter(mat) {
    _filterMateria = (mat && mat !== '') ? mat : null;
    // Sync select element
    var $sel = document.getElementById('sch-filter-select');
    if ($sel) $sel.value = _filterMateria || '';
    _applyFilter();
    // Update select style
    if ($sel) {
      if (_filterMateria) $sel.classList.add('active');
      else $sel.classList.remove('active');
    }
  }

  function clearFilter() {
    _filterMateria = null;
    var $sel = document.getElementById('sch-filter-select');
    if ($sel) { $sel.value = ''; $sel.classList.remove('active'); }
    _applyFilter();
  }

  function _applyFilter() {
    var $ct = document.getElementById('sch-filter-match-count');
    var $days = document.querySelectorAll('.sch-day-card');
    var n = 0;

    if (!_filterMateria) {
      $days.forEach(function(d) {
        d.classList.remove('sch-filtered-out', 'sch-filter-match');
      });
      document.querySelectorAll('.sch-block').forEach(function(b) {
        b.classList.remove('sch-block-no-match');
      });
      if ($ct) $ct.textContent = '';
      return;
    }

    $days.forEach(function(day) {
      var hasMatch = false;
      day.querySelectorAll('.sch-block').forEach(function(blk) {
        var matEl = blk.querySelector('.sch-block-materia');
        var mat = matEl ? matEl.textContent.trim() : '';
        if (mat === _filterMateria) {
          blk.classList.remove('sch-block-no-match');
          hasMatch = true;
        } else {
          blk.classList.add('sch-block-no-match');
        }
      });
      if (hasMatch) {
        day.classList.remove('sch-filtered-out');
        day.classList.add('sch-filter-match');
        n++;
      } else {
        day.classList.add('sch-filtered-out');
        day.classList.remove('sch-filter-match');
      }
    });

    if ($ct) $ct.textContent = n + ' dia' + (n !== 1 ? 's' : '') + ' com ' + _filterMateria;
  }

    return {
    init, hasSchedule, getStats,
    saveApiKey, toggleKeyVisibility,
    openAIModal, goToStep, goToPreview, confirmarGeracao, toggleSection, gerarCronogramaIA, selectChip, toggleChip,
    openManualEditor, createManualSchedule,
    startStudyBlock, toggleBlockDetails, _confirmBlock, _confirmBlockFromModal,
    renderCronograma, renderFase,
    toggleBlock,
    toggleBlockDesc: function(btn) {
      var block = btn.closest('.sch-block');
      if (!block) return;
      var desc = block.querySelector('.sch-block-desc');
      if (!desc) return;
      var isOpen = desc.classList.toggle('expanded');
      btn.classList.toggle('open', isOpen);
      btn.title = isOpen ? 'Recolher' : 'Ver descrição completa';
    },
    editarBloco, salvarEdicaoBloco,
    adicionarBloco, removerBloco,
    clearSchedule,
    toggleRoteiroBubble, closeRoteiroBubble, toggleDescExpand,
    setFilter, clearFilter,
  };
})();

// Backward-compat alias (for any remaining old references)
const Schedule = ScheduleEngine;

/* ════════════════════════════════════════════════
   CURRICULUM MODULE — Topic Toggling
════════════════════════════════════════════════ */
const Curriculum = (() => {

  function toggleTopic(subjId, topicIndex, el) {
    const key     = `${subjId}_${topicIndex}`;
    const done    = State.get('topicsDone') || {};
    done[key]     = !done[key];
    State.set('topicsDone', done);
    el.classList.toggle('done', !!done[key]);
    Render.dashboard();
  }

  function toggleCard(subjId) {
    const $card = document.getElementById(`subj-card-${subjId}`);
    if ($card) $card.classList.toggle('open');
  }

  return { toggleTopic, toggleCard };
})();

/* ════════════════════════════════════════════════
   FLASHCARDS MODULE
════════════════════════════════════════════════ */
const Flashcards = (() => {

  function _mergedCards() {
    const base = State.get('flashcards') || [];
    let cron = [];
    try { cron = JSON.parse(localStorage.getItem('nexus_flash_cronograma_v1') || '[]'); } catch(_e) {}
    const cronNorm = cron.map(c => ({ ...c, subj: c.subj || c.materia || 'Geral', _fromCron: true }));
    const baseIds = new Set(base.map(c => c.id));
    return [...base, ...cronNorm.filter(c => !baseIds.has(c.id))];
  }

  function _getVisible() {
    const state  = State.get();
    const filter = state.fcFilter || 'all';
    const cards  = _mergedCards();
    return filter === 'all' ? cards : cards.filter(c => c.subj === filter);
  }

  function renderCurrent(visible) {
    const state = State.get();
    const idx   = Utils.clamp(state.fcIndex || 0, 0, Math.max(0, visible.length - 1));
    const card  = visible[idx];

    const $q    = document.getElementById('fc-question');
    const $a    = document.getElementById('fc-answer');
    const $ctr  = document.getElementById('fc-counter');
    const $prog = document.getElementById('fc-prog-fill');
    const $card = document.getElementById('fc-card');

    if ($card) $card.classList.remove('flipped');

    if (!card) {
      if ($q) $q.textContent = 'Nenhum card disponível';
      if ($a) $a.textContent = '—';
      if ($ctr) $ctr.textContent = '0 / 0';
      return;
    }

    if ($q)   $q.innerHTML = _parseMarks(card.q || '');
    if ($a)   $a.innerHTML = _parseMarks(card.a || '');
    if ($ctr) $ctr.textContent = `${idx + 1} / ${visible.length}`;
    if ($prog) {
      const pct = visible.length > 1 ? Math.round((idx / (visible.length - 1)) * 100) : 100;
      $prog.style.width = pct + '%';
    }
  }

  function flip() {
    document.getElementById('fc-card')?.classList.toggle('flipped');
  }

  function next() {
    const visible = _getVisible();
    const idx     = Utils.clamp((State.get('fcIndex')||0) + 1, 0, visible.length - 1);
    State.set('fcIndex', idx);
    renderCurrent(visible);
  }

  function prev() {
    const visible = _getVisible();
    const idx     = Utils.clamp((State.get('fcIndex')||0) - 1, 0, visible.length - 1);
    State.set('fcIndex', idx);
    renderCurrent(visible);
  }

  /* ── SM-2 Algorithm ── */
  const TODAY = () => _localDateStr();

  function _sm2(card, quality) {
    // quality: 0=again, 1=hard, 2=ok/medium, 3=easy (maps to SM-2 grades 1,2,3,4)
    const q      = [1, 2, 3, 5][quality] || 3;
    let ef       = card.ef    ?? 2.5;
    let interval = card.interval  ?? 0;
    let reps     = card.reps  ?? 0;

    if (q < 3) {
      reps = 0; interval = 1;
    } else {
      reps++;
      interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(interval * ef);
    }
    ef = Math.max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    const next = new Date();
    next.setDate(next.getDate() + interval);

    return {
      ...card,
      ef, interval, reps,
      lastReview: TODAY(),
      nextReview: _localDateStr(next),
    };
  }

  function _dueToday(cards) {
    const today = TODAY();
    return cards.filter(c => !c.nextReview || c.nextReview <= today);
  }

  function getDueCount() {
    return _dueToday(_mergedCards()).length;
  }

  let _fcMode = 'all'; // 'all' | 'due'

  function setMode(mode) {
    _fcMode = mode;
    document.getElementById('fc-btn-due')?.classList.toggle('easy', mode === 'due');
    document.getElementById('fc-btn-all')?.classList.toggle('easy', mode === 'all');
    State.set('fcIndex', 0);
    Render.flashcards();
  }

  function _getVisible() {
    const state  = State.get();
    const filter = state.fcFilter || 'all';
    const diff   = state.fcDiffFilter || 'all';
    let cards    = _mergedCards();
    if (filter !== 'all') cards = cards.filter(c => c.subj === filter || c.materia === filter);
    if (_fcMode === 'due') cards = _dueToday(cards);
    if (diff !== 'all') cards = cards.filter(c => c.lastRating === diff);
    return cards;
  }

  function renderCurrent(visible) {
    const state = State.get();
    const idx   = Utils.clamp(state.fcIndex || 0, 0, Math.max(0, visible.length - 1));
    const card  = visible[idx];

    const $q    = document.getElementById('fc-question');
    const $a    = document.getElementById('fc-answer');
    const $ctr  = document.getElementById('fc-counter');
    const $prog = document.getElementById('fc-prog-fill');
    const $card = document.getElementById('fc-card');
    const $nr   = document.getElementById('fc-next-review');

    if ($card) $card.classList.remove('flipped');
    _showRating(false);

    if (!card) {
      if ($q) $q.textContent = _fcMode === 'due' ? '🎉 Todas as revisões do dia concluídas!' : 'Nenhum card disponível';
      if ($a) $a.textContent = _fcMode === 'due' ? 'Volte amanhã para novas revisões.' : '—';
      if ($ctr) $ctr.textContent = '0 / 0';
      if ($nr) $nr.textContent = '';
      return;
    }

    if ($q)   $q.innerHTML = _parseMarks(card.q || '');
    if ($a)   $a.innerHTML = _parseMarks(card.a || '');
    if ($ctr) $ctr.textContent = `${idx + 1} / ${visible.length}`;
    if ($prog) {
      const pct = visible.length > 1 ? Math.round((idx / (visible.length - 1)) * 100) : 100;
      $prog.style.width = pct + '%';
    }
    if ($nr) {
      const nr = card.nextReview;
      const intv = card.interval ?? 0;
      const ef   = (card.ef ?? 2.5).toFixed(1);
      const reps = card.reps ?? 0;
      $nr.textContent = nr
        ? 'Próxima revisão: ' + nr + '  ·  Intervalo: ' + intv + 'd  ·  EF: ' + ef + '  ·  Reps: ' + reps
        : 'Novo card — ainda não avaliado';
    }
    // Card meta (topic on back face)
    const $meta = document.getElementById('fc-card-meta');
    if ($meta) $meta.textContent = card.topic ? '📌 ' + card.topic : '';
    // Show card actions
    const $acts = document.getElementById('fc-card-actions');
    if ($acts) $acts.style.opacity = '1';

    // Update due count
    const dueCount = getDueCount();
    const $dueInfo = document.getElementById('fc-due-count');
    if ($dueInfo) $dueInfo.textContent = dueCount;
  }

  function _showRating(show) {
    const $r = document.getElementById('fc-rating-wrap');
    if ($r) $r.classList.toggle('visible', show);
  }

  function flip() {
    const card = document.getElementById('fc-card');
    if (!card) return;
    card.classList.toggle('flipped');
    _showRating(card.classList.contains('flipped'));
  }

  function next() {
    const visible = _getVisible();
    const idx     = Utils.clamp((State.get('fcIndex')||0) + 1, 0, visible.length - 1);
    State.set('fcIndex', idx);
    document.getElementById('fc-card')?.classList.remove('flipped');
    _showRating(false);
    renderCurrent(visible);
  }

  function prev() {
    const visible = _getVisible();
    const idx     = Utils.clamp((State.get('fcIndex')||0) - 1, 0, visible.length - 1);
    State.set('fcIndex', idx);
    document.getElementById('fc-card')?.classList.remove('flipped');
    _showRating(false);
    renderCurrent(visible);
  }

  function rate(result) {
    const qualityMap = { again: 0, hard: 1, medium: 2, easy: 3, know: 3, review: 1, skip: 0 };
    const quality = qualityMap[result] ?? 2;

    const visible = _getVisible();
    const idx     = State.get('fcIndex') || 0;
    const card    = visible[idx];
    if (!card) return;

    // Store last rating on the card for filtering
    const updated = _sm2(card, quality);
    updated.lastRating = result;
    const cards = State.get('flashcards') || [];
    const ci    = cards.findIndex(c => c.id === card.id);
    if (ci >= 0) cards[ci] = updated;

    // Also update cronograma cards if the card came from there
    const cronKey = 'nexus_flash_cronograma_v1';
    const cronCards = State.getRaw ? State.getRaw(cronKey) : JSON.parse(localStorage.getItem(cronKey) || '[]');
    const cronIdx = cronCards.findIndex(c => c.id === card.id);
    if (cronIdx >= 0) { cronCards[cronIdx] = { ...cronCards[cronIdx], lastRating: result }; localStorage.setItem(cronKey, JSON.stringify(cronCards)); }

    State.set('flashcards', cards);

    // Advance to next card and reset flip
    const newVisible = _getVisible();
    const newIdx = Math.min(idx + 1, Math.max(0, newVisible.length - 1));
    State.set('fcIndex', newIdx);
    document.getElementById('fc-card')?.classList.remove('flipped');
    _showRating(false);
    renderCurrent(newVisible);
    if (typeof Briefing !== 'undefined') Briefing.updateBadges();
  }

  function filterDiff(diff, btn) {
    State.set('fcDiffFilter', diff);
    State.set('fcIndex', 0);
    document.querySelectorAll('#fc-diff-filter .fc-dff-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('fc-card')?.classList.remove('flipped');
    _showRating(false);
    renderCurrent(_getVisible());
  }

  function filter(subjId) {
    State.set('fcFilter', subjId);
    State.set('fcTopic',  'all');
    State.set('fcTopicText', '');
    State.set('fcIndex',  0);
    Render.flashcards();
  }

  function toggleAdd() {
    document.getElementById('fc-add-form')?.classList.toggle('open');
  }

  function add() {
    const q    = document.getElementById('fc-new-q')?.value.trim();
    const a    = document.getElementById('fc-new-a')?.value.trim();
    const subj = document.getElementById('fc-new-subj')?.value;
    const diff = parseInt(document.getElementById('fc-new-diff')?.value || '2');
    if (!q || !a) { alert('Preencha pergunta e resposta!'); return; }

    // Initial SM-2 values based on difficulty
    const efMap = { 1: 2.8, 2: 2.5, 3: 2.1 };
    const cards = State.get('flashcards') || [];
    var topicEl = document.getElementById('fc-new-topic');
    var topic = topicEl ? topicEl.value.trim() : '';
    cards.push({
      id: Utils.uid(), subj, q, a, diff, topic,
      ef: efMap[diff] || 2.5, interval: 0, reps: 0,
      nextReview: TODAY(), lastReview: null,
      _user: true,   // marks as user-created — never overwritten by re-seed
    });
    State.set('flashcards', cards);
    document.getElementById('fc-new-q').value = '';
    document.getElementById('fc-new-a').value = '';
    if (topicEl) topicEl.value = '';
    document.getElementById('fc-add-form')?.classList.remove('open');
    Render.flashcards();
    if (typeof Briefing !== 'undefined') Briefing.updateBadges();
  }


  /* ── _parseMarks: correct alternating-split parser ── */
  function _parseMarks(text) {
    if (!text) return '';
    // When splitting 'foo ==bar== baz' by '==' we get ['foo ', 'bar', ' baz']
    // Even indices = outside marks, Odd indices = inside marks
    function wrap(str, delim, cls) {
      var parts = str.split(delim);
      var out = '';
      for (var i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          out += parts[i];
        } else {
          out += '<span class="fc-mark-' + cls + '">' + parts[i] + '</span>';
        }
      }
      return out;
    }
    var o = text;
    o = wrap(o, '==', 'gold');
    o = wrap(o, '!!', 'red');
    o = wrap(o, '**', 'green');
    o = wrap(o, '~~', 'blue');
    o = wrap(o, '__', 'bold');
    // ── Estruturação visual: parágrafos, listas e blocos ──
    o = o.replace(/\r\n/g, '\n');

    // Se o texto não tem quebras de linha, tenta separar automaticamente por sentenças
    if (o.indexOf('\n') === -1 && o.length > 120) {
      // Quebra em sentenças: após ponto/exclamação/interrogação seguidos de espaço + maiúscula ou conectivo
      o = o.replace(/([.!?])\s+((?:Já |Cuidado:|Atenção:|Porém |Entretanto |No entanto |O formato|Assim |Logo |Portanto |Além disso|Enquanto |O |A |Os |As |Em |Para )[A-ZÀ-Úa-zà-ú])/g, '$1\n\n$2');
      // Quebra também antes de alertas de span vermelho
      o = o.replace(/([.!?])\s+(<span class="fc-mark-red">)/g, '$1\n\n$2');
    }

    var blocks = o.split(/\n{2,}/);
    var html = '';
    for (var b = 0; b < blocks.length; b++) {
      var block = blocks[b].trim();
      if (!block) continue;
      var lines = block.split('\n');
      // Detecta lista (linhas começando com -, •, ›, →, ✓, ✦)
      var isList = lines.length > 1 && lines.every(function(l){ return /^\s*[-•›→✓✦◦·]\s+/.test(l); });
      if (isList) {
        html += '<ul class="fc-list">';
        for (var i = 0; i < lines.length; i++) {
          var item = lines[i].replace(/^\s*[-•›→✓✦◦·]\s+/, '');
          html += '<li>' + item + '</li>';
        }
        html += '</ul>';
      } else {
        // Detecta bloco de alerta (começa com Cuidado/Atenção ou span vermelho)
        var isAlert = /^(<span class="fc-mark-red">|Cuidado:|Atenção:)/i.test(block);
        var cls = isAlert ? 'fc-p fc-p-alert' : 'fc-p';
        html += '<p class="' + cls + '">' + lines.join('<br>') + '</p>';
      }
    }
    return html || o;
  }

  /* ── Apply mark to textarea selection ── */
  function applyMark(taId, mark) {
    var ta = document.getElementById(taId);
    if (!ta) return;
    var s = ta.selectionStart, e = ta.selectionEnd;
    var sel = ta.value.slice(s, e) || 'texto';
    var rep = mark + sel + mark;
    ta.value = ta.value.slice(0, s) + rep + ta.value.slice(e);
    ta.selectionStart = s + mark.length;
    ta.selectionEnd   = s + mark.length + sel.length;
    ta.focus();
  }

  /* ── Topic sidebar filter ── */
  function filterTopic(idx, topicText) {
    State.set('fcTopic', idx);
    State.set('fcTopicText', topicText || '');
    State.set('fcIndex', 0);
    Render.flashcards();
  }

  /* ── Subj change — load topic autocomplete pool ── */
  function onSubjChange() {
    var sel = document.getElementById('fc-new-subj');
    if (!sel) return;
    var val = sel.value;
    var edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    var disc   = edData && edData.disciplinas && edData.disciplinas.find(function(d){ return d.id === val || d.nome === val; });
    Flashcards._topicPool = disc ? (disc.topicos || []).map(function(t){ return t.texto.replace(/^⚡\s*/, ''); }) : [];
    // Also clear topic field
    var ti = document.getElementById('fc-new-topic');
    if (ti) { ti.value = ''; }
    Flashcards.hideAc();
  }

  /* ── Topic autocomplete ── */
  function onTopicInput(input) {
    var val  = (input.value || '').toLowerCase().trim();
    var pool = Flashcards._topicPool || [];
    var $ac  = document.getElementById('fc-topic-ac');
    if (!$ac) return;
    if (!pool.length) { $ac.classList.remove('open'); return; }
    // Show ALL when empty (on focus), filter when typing
    var matches = val
      ? pool.filter(function(t){ return t.toLowerCase().includes(val); }).slice(0, 8)
      : pool.slice(0, 8);
    if (!matches.length) { $ac.classList.remove('open'); return; }
    $ac.innerHTML = matches.map(function(t){
      return '<button class="fc-topic-ac-item" onmousedown="event.preventDefault();Flashcards.selectAc(\'' + t.replace(/'/g,"&#39;") + '\')">' + t + '</button>';
    }).join('');
    $ac.classList.add('open');
  }

  function selectAc(text) {
    var ti = document.getElementById('fc-new-topic');
    if (ti) ti.value = text;
    var $ac = document.getElementById('fc-topic-ac');
    if ($ac) $ac.classList.remove('open');
    if (ti) ti.focus();
  }

  function hideAc() {
    setTimeout(function(){ var $ac = document.getElementById('fc-topic-ac'); if ($ac) $ac.classList.remove('open'); }, 150);
  }

  /* ── Expose _fcMode for Render access ── */
  
  /* ── ID of currently displayed card ── */
  function _currentCardId() {
    var visible = _getVisible();
    var idx = typeof Utils !== 'undefined' && Utils.clamp 
              ? Utils.clamp(State.get('fcIndex') || 0, 0, Math.max(0, visible.length - 1))
              : Math.max(0, Math.min(State.get('fcIndex') || 0, visible.length - 1));
    return visible[idx] ? visible[idx].id : null;
  }

  /* ── Edit current card ── */
  function editCurrent() {
    var id = _currentCardId();
    if (!id) return;
    var cards = State.get('flashcards') || [];
    var card  = cards.find(function(c){ return c.id === id; });
    if (!card) return;

    // Populate edit modal
    var $q = document.getElementById('fc-edit-q');
    var $a = document.getElementById('fc-edit-a');
    var $t = document.getElementById('fc-edit-topic');
    var $s = document.getElementById('fc-edit-subj');
    if ($q) $q.value = card.q || '';
    if ($a) $a.value = card.a || '';
    if ($t) $t.value = card.topic || '';
    if ($s) {
      // populate options if empty
      if (!$s.options.length) {
        var edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
        if (edData && edData.disciplinas && edData.disciplinas.length) {
          $s.innerHTML = edData.disciplinas.map(function(d){ return '<option value="'+d.id+'">'+d.nome+'</option>'; }).join('');
        } else {
          $s.innerHTML = Data.SUBJECTS.map(function(s){ return '<option value="'+s.id+'">'+s.icon+' '+s.name+'</option>'; }).join('');
        }
      }
      $s.value = card.subj || '';
    }
    // Store editing id
    Flashcards._editingId = id;
    var overlay = document.getElementById('fc-edit-overlay');
    if (overlay) overlay.classList.add('open');
  }

  function closeEdit() {
    var overlay = document.getElementById('fc-edit-overlay');
    if (overlay) overlay.classList.remove('open');
    Flashcards._editingId = null;
  }

  function saveEdit() {
    var id = Flashcards._editingId;
    if (!id) return;
    var q = (document.getElementById('fc-edit-q')?.value || '').trim();
    var a = (document.getElementById('fc-edit-a')?.value || '').trim();
    if (!q || !a) { alert('Preencha pergunta e resposta!'); return; }

    var cards = State.get('flashcards') || [];
    var idx   = cards.findIndex(function(c){ return c.id === id; });
    if (idx < 0) return;
    cards[idx].q     = q;
    cards[idx].a     = a;
    cards[idx].topic = (document.getElementById('fc-edit-topic')?.value || '').trim();
    cards[idx].subj  = document.getElementById('fc-edit-subj')?.value || cards[idx].subj;
    State.set('flashcards', cards);
    closeEdit();
    Render.flashcards();

    // Toast
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(46,204,113,.15);border:1px solid rgba(46,204,113,.3);color:var(--green);padding:10px 22px;border-radius:10px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none';
    t.textContent = '✅ Card atualizado!';
    document.body.appendChild(t);
    setTimeout(function(){ t.remove(); }, 2200);
  }

  /* ── Delete current card — with animation ── */
  function deleteCurrent() {
    var id = _currentCardId();
    if (!id) return;
    if (!confirm('Remover este flashcard do baralho?')) return;

    // Animate card out
    var $cardEl = document.getElementById('fc-card');
    if ($cardEl) {
      $cardEl.style.transition = 'opacity .3s ease, transform .3s ease';
      $cardEl.style.opacity    = '0';
      $cardEl.style.transform  = 'scale(0.88) translateY(-16px)';
    }

    setTimeout(function() {
      // Reset animation styles
      if ($cardEl) {
        $cardEl.style.transition = '';
        $cardEl.style.opacity    = '';
        $cardEl.style.transform  = '';
      }
      // Remove from state
      var cards = (State.get('flashcards') || []).filter(function(c){ return c.id !== id; });
      State.set('flashcards', cards);
      var curIdx = State.get('fcIndex') || 0;
      State.set('fcIndex', Math.max(0, curIdx > 0 ? curIdx - 1 : 0));
      Render.flashcards();
      if (typeof Briefing !== 'undefined') Briefing.updateBadges();

      // Toast
      var t = document.createElement('div');
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(255,77,77,.12);border:1px solid rgba(255,77,77,.3);color:var(--red);padding:10px 22px;border-radius:10px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none;animation:fadeUp .2s ease';
      t.textContent = '🗑 Card removido';
      document.body.appendChild(t);
      setTimeout(function(){ t.remove(); }, 2200);
    }, 320);
  }

  /* ── Render stats bar ── */
  function _renderStats(cards) {
    var $bar = document.getElementById('fc-stats-bar');
    if (!$bar) return;
    var today   = _localDateStr();
    var total   = cards.length;
    var due     = cards.filter(function(c){ return !c.nextReview || c.nextReview <= today; }).length;
    var mastered= cards.filter(function(c){ return c.reps && c.reps >= 5 && c.ef && c.ef >= 2.4; }).length;
    var newCards= cards.filter(function(c){ return !c.lastReview; }).length;
    $bar.innerHTML =
      '<div class="fc-stat-pill"><span>📚</span><strong>'+total+'</strong> cards</div>' +
      '<div class="fc-stat-pill due"><span>📅</span><strong>'+due+'</strong> p/ revisar</div>' +
      '<div class="fc-stat-pill mastered"><span>✅</span><strong>'+mastered+'</strong> dominados</div>' +
      '<div class="fc-stat-pill"><span>🆕</span><strong>'+newCards+'</strong> novos</div>';
  }

    return { renderCurrent, flip, next, prev, rate, filter, filterDiff, filterTopic, toggleAdd, add, getDueCount, setMode, applyMark, onSubjChange, onTopicInput, selectAc, hideAc, editCurrent, closeEdit, saveEdit, deleteCurrent, renderStats: _renderStats, _fcMode, _topicPool: [], _editingId: null };
})();

/* ════════════════════════════════════════════════
   ERRORS MODULE
════════════════════════════════════════════════ */
const Errors = (() => {

  const TOPICS_KEY = 'nexus_err_topics_v1';
  const ERRORS_KEY = 'nexus_caderno_v1';
  let _searchTerm = '';
  let _topicPool  = [];   // topics for current subject

  /* ── Dedicated error persistence ── */
  function _loadErrors() {
    try {
      const raw = localStorage.getItem(ERRORS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }
  function _saveErrors(arr) {
    try { localStorage.setItem(ERRORS_KEY, JSON.stringify(arr)); } catch {}
  }
  function _syncErrors(arr) {
    _saveErrors(arr);
    try { State.set('errors', arr); } catch {}
  }
  function _getErrors() {
    return _loadErrors() || State.get('errors') || [];
  }

  /* ── Custom topics per subject ── */
  function _getTopics(subjId) {
    try {
      const all = JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}');
      return all[subjId] || [];
    } catch { return []; }
  }
  function _saveTopics(subjId, arr) {
    try {
      const all = JSON.parse(localStorage.getItem(TOPICS_KEY) || '{}');
      all[subjId] = arr;
      localStorage.setItem(TOPICS_KEY, JSON.stringify(all));
    } catch {}
  }
  function _addTopic(subjId, text) {
    const arr = _getTopics(subjId);
    if (!arr.includes(text)) { arr.unshift(text); _saveTopics(subjId, arr); }
  }

  /* ── Build topic pool: edital + custom ── */
  function _buildPool(subjId) {
    const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const disc   = edData?.disciplinas?.find(d => d.id === subjId || d.nome === subjId);
    const fromEdital = (disc?.topicos || []).map(t => t.texto.replace(/^⚡\s*/, ''));
    const custom = _getTopics(subjId);
    // merge, deduplicate
    const seen = new Set();
    const pool = [];
    [...custom, ...fromEdital].forEach(t => { if (!seen.has(t)) { seen.add(t); pool.push(t); } });
    return pool;
  }

  /* ── onSubjChange ── */
  function onSubjChange(sel) {
    const id = sel?.value || document.getElementById('err-subj-sel')?.value || '';
    _topicPool = _buildPool(id);
    // Clear topic field
    const ti = document.getElementById('err-topic-txt');
    if (ti) ti.value = '';
    hideTopicAc();
  }

  /* ── Topic autocomplete ── */
  function onTopicInput(input) {
    const val = (input.value || '').toLowerCase().trim();
    const $ac = document.getElementById('err-topic-ac');
    if (!$ac) return;
    const matches = val
      ? _topicPool.filter(t => t.toLowerCase().includes(val)).slice(0, 8)
      : _topicPool.slice(0, 8);

    if (!matches.length && !val) { $ac.classList.remove('open'); return; }

    const items = matches.map(t =>
      `<div class="err-topic-ac-item" onmousedown="event.preventDefault();Errors.selectTopic('${t.replace(/'/g,"&#39;")}')">${t}</div>`
    );
    // Option to add new
    if (val && !_topicPool.some(t => t.toLowerCase() === val)) {
      items.push(`<div class="err-topic-ac-item new" onmousedown="event.preventDefault();Errors.addNewTopic('${val.replace(/'/g,"&#39;")}')">＋ Adicionar "${val}"</div>`);
    }
    $ac.innerHTML = items.join('');
    $ac.classList.add('open');
  }

  function selectTopic(text) {
    const ti = document.getElementById('err-topic-txt');
    if (ti) ti.value = text;
    hideTopicAc();
  }

  function addNewTopic(text) {
    const subjId = document.getElementById('err-subj-sel')?.value || '';
    if (subjId && text) { _addTopic(subjId, text); _topicPool = _buildPool(subjId); }
    selectTopic(text);
  }

  function hideTopicAc() {
    setTimeout(() => { document.getElementById('err-topic-ac')?.classList.remove('open'); }, 150);
  }

  /* ══════════════════════════════════════════
     RICH TEXT EDITOR
  ══════════════════════════════════════════ */
  function rteCmd(editorId, cmd) {
    const el = document.getElementById(editorId);
    if (!el) return;
    el.focus();
    switch(cmd) {
      case 'bold':          document.execCommand('bold');          break;
      case 'italic':        document.execCommand('italic');        break;
      case 'underline':     document.execCommand('underline');     break;
      case 'hilite':        document.execCommand('hiliteColor', false, '#E8B84B44'); break;
      case 'ul':            document.execCommand('insertUnorderedList'); break;
      case 'ol':            document.execCommand('insertOrderedList');   break;
      case 'removeFormat':  document.execCommand('removeFormat');  break;
      case 'quote': {
        const sel = window.getSelection();
        const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
        if (range) {
          const bq = document.createElement('blockquote');
          bq.innerHTML = range.toString() || '&nbsp;';
          range.deleteContents();
          range.insertNode(bq);
        }
        break;
      }
      case 'code': {
        const sel2 = window.getSelection();
        const text2 = sel2?.toString() || '';
        const code = document.createElement('code');
        code.textContent = text2 || 'código';
        if (sel2?.rangeCount) {
          const r2 = sel2.getRangeAt(0);
          r2.deleteContents();
          r2.insertNode(code);
        }
        break;
      }
    }
  }

  function rteFontSize(editorId, size) {
    if (!size) return;
    document.getElementById(editorId)?.focus();
    document.execCommand('fontSize', false, size);
  }

  /* ── Image handling ── */
  function triggerImgUpload(editorId) {
    document.getElementById(`${editorId}-img-input`)?.click();
  }

  function insertImgFromFile(input, editorId) {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => _insertImg(editorId, e.target.result);
    reader.readAsDataURL(file);
    input.value = '';
  }

  function _insertImg(editorId, src) {
    const el = document.getElementById(editorId);
    if (!el) return;
    el.focus();
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'max-width:100%;border-radius:6px;margin:4px 0;';
    const sel = window.getSelection();
    if (sel?.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      range.setStartAfter(img);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      el.appendChild(img);
    }
  }

  /* Paste: intercept image pastes */
  function onPaste(e, editorId) {
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = ev => _insertImg(editorId, ev.target.result);
        reader.readAsDataURL(blob);
        return;
      }
    }
    // Allow plain text/html paste normally
  }

  /* Drop: handle image drops */
  function onDrop(e, editorId) {
    e.preventDefault();
    const files = e.dataTransfer?.files || [];
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = ev => _insertImg(editorId, ev.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  /* ── Get rich editor content ── */
  function _rteGet(editorId) {
    return document.getElementById(editorId)?.innerHTML || '';
  }
  function _rteClear(editorId) {
    const el = document.getElementById(editorId);
    if (el) el.innerHTML = '';
  }
  function _rteSet(editorId, html) {
    const el = document.getElementById(editorId);
    if (el) el.innerHTML = html || '';
  }

  /* ══════════════════════════════════════════
     RENDER LIST
  ══════════════════════════════════════════ */
  function renderList() {
    const state  = State.get();
    let errs     = [..._getErrors()];
    const filter = state.errFilter || 'all';
    const sort   = state.errSort   || 'date';

    if (filter !== 'all') {
      if (['pending','reviewed','mastered'].includes(filter)) {
        errs = errs.filter(e => (e.status||'pending') === filter);
      } else {
        errs = errs.filter(e => e.subj === filter);
      }
    }
    if (sort === 'date')   errs.sort((a,b) => new Date(b.date||0) - new Date(a.date||0));
    if (sort === 'subj')   errs.sort((a,b) => (a.subj||'').localeCompare(b.subj||''));
    if (sort === 'status') errs.sort((a,b) => (a.status||'pending').localeCompare(b.status||'pending'));

    const sq = _searchTerm || '';
    if (sq) {
      errs = errs.filter(e =>
        (e.q||'').toLowerCase().includes(sq) ||
        (e.topic||'').toLowerCase().includes(sq) ||
        (e.subj||'').toLowerCase().includes(sq) ||
        (e.rule||'').toLowerCase().includes(sq)
      );
    }

    const $list = document.getElementById('errors-list');
    if (!$list) return;
    $list.innerHTML = errs.length
      ? `<div class="err-list">${errs.map(e => Components.createErrorCard(e)).join('')}</div>`
      : `<div class="err-empty"><div class="err-empty-icon">📝</div><div class="err-empty-title">${sq?'Nenhum resultado':'Caderno limpo!'}</div><div class="err-empty-sub">${sq?'Tente outros termos.':'Registre seus erros em questões e simulados para identificar suas lacunas.'}</div></div>`;
  }

  function filterBy(val) { State.set('errFilter', val); Render.errors(); }

  function sort(by) {
    State.set('errSort', by);
    ['sort-date','sort-subj','sort-status'].forEach(id => {
      document.getElementById(id)?.classList.toggle('active', id === `sort-${by}`);
    });
    renderList();
  }

  /* ── Open modal ── */
  function openModal() {
    // Populate matéria select
    const $sel = document.getElementById('err-subj-sel');
    if ($sel) {
      const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      if (edData?.disciplinas?.length) {
        $sel.innerHTML = edData.disciplinas.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');
      } else if (!$sel.options.length) {
        $sel.innerHTML = Data.SUBJECTS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
      }
      // Build initial topic pool
      _topicPool = _buildPool($sel.value);
    }

    // Clear fields
    _rteClear('rte-q');
    _rteClear('rte-rule');
    const ti = document.getElementById('err-topic-txt'); if (ti) ti.value = '';
    const cb = document.getElementById('err-auto-rev');  if (cb) cb.checked = false;
    document.getElementById('modal-error')?.classList.add('open');
  }

  /* ── Save ── */
  function save() {
    const q = _rteGet('rte-q');
    const plainQ = document.getElementById('rte-q')?.textContent?.trim() || '';
    if (!plainQ) {
      const el = document.getElementById('rte-q');
      if (el) { el.style.outline='2px solid var(--red)'; setTimeout(()=>el.style.outline='',2000); el.focus(); }
      return;
    }

    const autoRev = document.getElementById('err-auto-rev')?.checked;
    const errs = _getErrors();
    const subjId = document.getElementById('err-subj-sel')?.value || '';
    const topic  = document.getElementById('err-topic-txt')?.value.trim() || '';

    // Save custom topic if new
    if (topic && subjId) _addTopic(subjId, topic);

    const newErr = {
      id:     Utils.uid(),
      subj:   subjId,
      why:    document.getElementById('err-why-sel')?.value,
      q,                                      // HTML with images
      rule:   _rteGet('rte-rule'),            // HTML with images
      topic,
      date:   new Date().toLocaleDateString('pt-BR'),
      status: 'pending',
    };
    errs.push(newErr);
    _syncErrors(errs);

    // Auto SM-2 revision
    if (autoRev && typeof ReviewSystem !== 'undefined') {
      const topTxt = topic || plainQ.slice(0, 60);
      const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      const disc   = edData?.disciplinas?.find(d => d.id === subjId);
      const subjName = disc?.nome || Data.SUBJECTS.find(s=>s.id===subjId)?.name || subjId;
      // Erros não vão mais para a aba "Revisões" — só ficam no Caderno de Erros.
    }

    closeModal('modal-error');
    Render.errors();
    Render.dashboard();
    if (typeof Briefing !== 'undefined') Briefing.updateBadges();

    // Toast
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(46,204,113,.15);border:1px solid rgba(46,204,113,.3);color:var(--green);padding:10px 20px;border-radius:10px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none;';
    t.textContent = '✅ Erro registrado' + (autoRev ? ' · Revisão programada' : '');
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  function updateStatus(id, status) {
    const errs = _getErrors();
    const err  = errs.find(e => e.id === id);
    if (err) { err.status = status; _syncErrors(errs); Render.errors(); Render.dashboard(); }
  }

  function deleteErr(id) {
    if (!confirm('Remover este erro do caderno?')) return;
    _syncErrors(_getErrors().filter(e => e.id !== id));
    Render.errors();
    Render.dashboard();
  }

  function toggleCard(id) {
    const card = document.getElementById('errcard-' + id);
    if (!card) return;
    document.querySelectorAll('.err-card.open').forEach(c => { if (c !== card) c.classList.remove('open'); });
    card.classList.toggle('open');
  }

  function cycleStatus(id, current) {
    const next = { pending: 'reviewed', reviewed: 'mastered', mastered: 'pending' };
    updateStatus(id, next[current] || 'reviewed');
  }

  function search(val) { _searchTerm = (val||'').toLowerCase().trim(); renderList(); }

  let _sideSearchTerm = '';
  function sideSearch(val) {
    _sideSearchTerm = (val||'').toLowerCase().trim();
    Render.errors();
  }

  return {
    renderList, filterBy, sort, openModal, save,
    updateStatus, delete: deleteErr, toggleCard, cycleStatus, search,
    _getErrors, _syncErrors, sideSearch,
    get _sideSearchTerm(){ return _sideSearchTerm; },
    // topic ac
    onSubjChange, onTopicInput, selectTopic, addNewTopic, hideTopicAc,
    // rte
    rteCmd, rteFontSize, triggerImgUpload, insertImgFromFile,
    onPaste, onDrop,
  };
})();

/* ════════════════════════════════════════════════
   CONFIG MODULE
════════════════════════════════════════════════ */
const Config = (() => {

  function open() {
    const cfg = State.get('config') || {};
    const $name  = document.getElementById('cfg-name');
    const $board = document.getElementById('cfg-board');
    const $date  = document.getElementById('cfg-date');
    const $days  = document.getElementById('cfg-days');
    const $start = document.getElementById('cfg-start');
    if ($name)  $name.value  = cfg.examName  || '';
    if ($board) $board.value = cfg.examBoard || '';
    if ($date && cfg.examDate)  $date.value  = cfg.examDate;
    if ($days && cfg.totalDays) $days.value  = cfg.totalDays;
    if ($start && cfg.startDate) $start.value = cfg.startDate;
    var mc = document.getElementById('modal-config'); if(mc) mc.classList.add('open');
  }

  function save() {
    const cfg = {
      examName:  document.getElementById('cfg-name')?.value.trim()  || 'Concurso Público',
      examBoard: document.getElementById('cfg-board')?.value.trim() || '',
      examDate:  document.getElementById('cfg-date')?.value || null,
      totalDays: parseInt(document.getElementById('cfg-days')?.value || '25'),
      startDate: document.getElementById('cfg-start')?.value || null,
    };
    State.set('config', cfg);
    closeModal('modal-config');
    App.refreshAll();
  }

  function clearCache() {
    // Remove only version flags and temp keys — preserves all user data
    const CACHE_KEYS = [
      'nexus_sched_version',
      'nexus_visited',
    ];
    CACHE_KEYS.forEach(k => localStorage.removeItem(k));

    // Toast then reload
    const t = document.createElement('div');
    t.style.cssText = [
      'position:fixed','bottom:32px','left:50%','transform:translateX(-50%)',
      'background:rgba(46,204,113,.15)','border:1px solid rgba(46,204,113,.35)',
      'color:var(--green)','padding:12px 24px','border-radius:12px',
      'font-size:13px','font-weight:700','z-index:99999','pointer-events:none',
      'box-shadow:0 8px 32px rgba(0,0,0,.4)','letter-spacing:.5px',
    ].join(';');
    t.textContent = '✅ Cache limpo — recarregando...';
    document.body.appendChild(t);
    setTimeout(() => location.reload(), 1200);
  }

  return { open, save, clearCache };
})();

/* ════════════════════════════════════════════════
   ROUTER MODULE — View Navigation
════════════════════════════════════════════════ */
const Router = (() => {

  const VIEWS = {
    dashboard:  { title: 'DASHBOARD',     sub: 'Visão geral da preparação',     render: () => Render.dashboard() },
    schedule:   { title: 'CRONOGRAMA',    sub: 'Plano de estudos estruturado',  render: () => ScheduleEngine.init() },
    ciclo:      { title: 'CICLO DE ESTUDOS', sub: 'Rotação inteligente de disciplinas por horas e blocos', render: () => CicloEstudos.render() },
    curriculum: { title: 'EDITAL',        sub: 'Configure e gerencie seu edital', render: () => EditalEngine.render() },
    flashcards: { title: 'FLASHCARDS',    sub: 'Revisão ativa com spaced repetition', render: () => Render.flashcards() },
    errors:     { title: 'CADERNO DE ERROS', sub: 'Análise de lacunas e erros', render: () => Render.errors() },
    revisoes:   { title: 'REVISÕES',       sub: 'Fila de revisão espaçada (SM-2)',  render: () => { ReviewSystem.collectUncompleted(); ReviewSystem.render(); } },
    analysis:   { title: 'DNA DA BANCA',  sub: 'Padrões históricos de cobrança', render: () => Render.analysis() },
    questoes:   { title: 'QUESTÕES',      sub: 'Banco de questões via PDF — IA categoriza pelo seu edital', render: () => Questoes.render() },
  };

  let _current = 'dashboard';

  function go(viewId) {
    if (!VIEWS[viewId]) return;
    try { localStorage.setItem('nexus_current_view', viewId); } catch(e) {}

    // ── FIX: reset FCCronView when leaving flashcards tab ──
    if (viewId !== 'flashcards' && typeof FCCronView !== 'undefined') {
      // Restore normal FC elements so they don't stay hidden
      document.querySelectorAll('#view-flashcards > *:not(.section-header)').forEach(function(el) {
        el.style.display = '';
      });
      var $cronV = document.getElementById('fc-cron-view');
      if ($cronV) $cronV.classList.remove('active');
      // Reset internal state so next time flashcards opens it's fresh
      FCCronView._resetActive();
    }

    _current = viewId;

    // Hide all views, show target
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const $view = document.getElementById(`view-${viewId}`);
    if ($view) $view.classList.add('active');

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const $nav = document.getElementById(`nav-${viewId}`);
    if ($nav) $nav.classList.add('active');

    // Update topbar
    const meta = VIEWS[viewId];
    const $title = document.getElementById('topbar-title');
    const $sub   = document.getElementById('topbar-sub');
    if ($title) $title.textContent = meta.title;
    if ($sub)   $sub.textContent   = meta.sub;

    // Render the view
    try { meta.render(); } catch(e) { console.error('[Router] render error in', viewId, e); }

    // Close sidebar on mobile
    if (window.innerWidth < 768) Sidebar.close();
  }

  function current() { return _current; }

  return { go, current };
})();

/* ════════════════════════════════════════════════
   SIDEBAR MODULE
════════════════════════════════════════════════ */
const Sidebar = (() => {
  function open()  {
    document.getElementById('sidebar')?.classList.add('open');
    document.getElementById('main')?.classList.add('shifted');
  }
  function close() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('main')?.classList.remove('shifted');
  }
  return { open, close };
})();

/* ════════════════════════════════════════════════
   GLOBAL HELPERS — Modal & Config buttons
════════════════════════════════════════════════ */
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function openConfig()   { ConfigPanel.open(); }

/* ════════════════════════════════════════════════
   APP MODULE — Bootstrap & Timers
════════════════════════════════════════════════ */
const App = (() => {

  let _cdInterval = null;

  function startCountdown() {
    if (_cdInterval) clearInterval(_cdInterval);
    _cdInterval = setInterval(() => {
      const config = State.get('config') || {};
      const target = config.examDate ? new Date(config.examDate) : null;
      const $sbDays = document.getElementById('sb-days');

      if (!target || isNaN(target)) {
        ['cd-d','cd-h','cd-m','cd-s'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = '—';
        });
        if ($sbDays) $sbDays.textContent = '—';
        return;
      }

      const t = Utils.countdown(target);
      const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = Utils.pad(val);
      };
      setEl('cd-d', t.d); setEl('cd-h', t.h);
      setEl('cd-m', t.m); setEl('cd-s', t.s);
      if ($sbDays) $sbDays.textContent = Utils.pad(t.d);
    }, 1000);
  }

  function _updateBrand() {
    try {
      const profile = (typeof Onboarding !== 'undefined') ? Onboarding.getUserProfile() : null;
      const cfg     = (typeof State !== 'undefined') ? (State.get('config') || {}) : {};
      const edData  = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      const nome    = (cfg.examName || edData?.concurso?.nome || profile?.concurso?.nome || '').trim();
      const banca   = (cfg.examBoard|| edData?.concurso?.banca|| profile?.concurso?.banca|| '').trim();
      const date    = cfg.examDate  || edData?.concurso?.dataProva || profile?.concurso?.dataProva || '';

      const $mark    = document.getElementById('sb-mark-text');
      const $name    = document.getElementById('sb-brand-name');
      const $tagline = document.getElementById('sb-brand-tagline');

      if (nome && $mark) {
        const words    = nome.split(/\s+/).filter(Boolean);
        const initials = words.length >= 2 ? words[0][0] + words[1][0] : nome.slice(0, 2);
        $mark.textContent = initials.toUpperCase();
        $mark.title       = nome;
      }
      if ($name)    $name.textContent    = nome ? nome.slice(0, 22) : 'NEXUS STUDY';
      if ($tagline) $tagline.textContent = banca
        ? banca + (date ? ' · ' + (typeof Utils !== 'undefined' ? Utils.formatDate(date) : date) : '')
        : 'Operação Aprovação';

      // Update topbar title with exam name (only if not on a specific view title)
      const $topTitle = document.getElementById('topbar-title');
      if ($topTitle && ($topTitle.textContent === 'NEXUS STUDY' || !Router.current())) {
        $topTitle.textContent = nome || 'NEXUS STUDY';
      }

      // Sync API key from central store to all module fields (read-only sync)
      const apiKey = localStorage.getItem('nexus_api_key') || '';
      if (apiKey) {
        ['ef-api-key','sch-api-key','fc-gen-api-key'].forEach(id => {
          const el = document.getElementById(id); if (el && !el.value) el.value = apiKey;
        });
      }

      // Sync goals from central config
      const goals = JSON.parse(localStorage.getItem('nexus_goals_v1') || '{}');
      if (goals.horasMeta) {
        const $gH = document.getElementById('goal-horas-meta');
        const $gQ = document.getElementById('goal-questoes-meta');
        if ($gH) $gH.value = goals.horasMeta;
        if ($gQ) $gQ.value = goals.questoesMeta;
      }
    } catch(e) {}
  }

  function refreshAll() {
    _updateBrand();
    const view = Router.current();
    Render.dashboard();
    if (view === 'schedule')   ScheduleEngine.init();
    if (view === 'curriculum') Render.curriculum();
    if (view === 'flashcards') Render.flashcards();
    if (view === 'errors')     Render.errors();
    if (view === 'analysis')   Render.analysis();
    Render.dashboard();
  }

  function init() {
    // Clear any saved view that no longer exists
    try {
      const VALID_VIEWS = ['dashboard','schedule','ciclo','curriculum','flashcards','errors','revisoes','analysis','questoes'];
      const sv = localStorage.getItem('nexus_current_view');
      if (sv && !VALID_VIEWS.includes(sv)) localStorage.setItem('nexus_current_view', 'dashboard');
    } catch(e) {}

    State.load();
    startCountdown();

    // Apply saved profile to State config if exists
    const profile = Onboarding.getUserProfile();
    if (profile && profile.concurso) {
      State.merge('config', {
        examName:  profile.concurso.nome  || State.get('config').examName,
        examBoard: profile.concurso.banca || State.get('config').examBoard,
        examDate:  profile.concurso.dataProva || State.get('config').examDate,
        totalDays: profile.concurso.diasRestantes || State.get('config').totalDays,
      });
    }

    // Update sidebar brand with configured contest name
    _updateBrand();

    let savedView = 'dashboard';
    try {
      const sv = localStorage.getItem('nexus_current_view') || 'dashboard';
      // Fallback to dashboard for removed or unknown views
      const VALID_VIEWS = ['dashboard','schedule','ciclo','curriculum','flashcards','errors','revisoes','analysis','questoes'];
      savedView = VALID_VIEWS.includes(sv) ? sv : 'dashboard';
    } catch(e) {}
    Router.go(savedView);

    // Close modals on overlay click
    document.querySelectorAll('.overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open'));
        document.getElementById('timer-fullscreen')?.classList.remove('open');
        document.getElementById('reg-overlay')?.classList.remove('open');
      }
    });

    // Init StudyTimer
    StudyTimer.init();

    // Init Schedule (ensures dates and schedule version are synced)
    if (typeof ScheduleEngine !== 'undefined') ScheduleEngine.init();

    // Init ReviewSystem (collect uncompleted + badges) — deferred so all modules are declared
    if (typeof ReviewSystem !== 'undefined') ReviewSystem.init();

    // Auto-refresh dashboard every 30s to keep stats live
    setInterval(() => {
      const active = document.querySelector('.view.active');
      if (active && active.id === 'view-dashboard') Render.dashboard();
    }, 30000);

    // Show onboarding only if no profile exists and flag is set
    // (flag is only set by Block 2 when localStorage has no profile)
    if (window._nexusNewContestMode && !Onboarding.isCompleted()) {
      window._nexusNewContestMode = false;
      setTimeout(() => {
        if (typeof Onboarding !== 'undefined' && typeof Onboarding.open === 'function') {
          Onboarding.open();
        }
      }, 400);
    } else {
      window._nexusNewContestMode = false;
      // Profile exists — apply it to State and go to briefing
      const _savedProfile = Onboarding.getUserProfile();
      if (_savedProfile && _savedProfile.concurso) {
        State.merge('config', {
          examName:  _savedProfile.concurso.nome  || State.get('config').examName,
          examBoard: _savedProfile.concurso.banca || State.get('config').examBoard,
          examDate:  _savedProfile.concurso.dataProva || State.get('config').examDate,
          totalDays: _savedProfile.concurso.diasRestantes || State.get('config').totalDays,
        });
      }
    }
  }

  return { init, refreshAll };
})();

/* ════════════════════════════════════════════════════════
   ONBOARDING MODULE v7 — Diagnóstico Estratégico
   Mantém o nome "Onboarding" para compatibilidade total
════════════════════════════════════════════════════════ */
const Onboarding = (() => {
  'use strict';

  const KEY   = 'nexus_onboarding_profile';
  const STEPS = 6;
  let _step   = 0;
  let _matrix = {};

  const SUBJECTS = [
    { id:'const',  name:'Direito Constitucional' },
    { id:'adm',    name:'Direito Administrativo' },
    { id:'penal',  name:'Direito Penal' },
    { id:'proc',   name:'Direito Processual Penal' },
    { id:'legis',  name:'Legislação Específica / Estatutos' },
    { id:'port',   name:'Língua Portuguesa' },
    { id:'logic',  name:'Raciocínio Lógico / Matemática' },
    { id:'dh',     name:'Direitos Humanos / Criminologia' },
    { id:'gestao', name:'Administração / Gestão' },
    { id:'ing',    name:'Língua Inglesa' },
  ];

  const PHASES = {
    1:'⚔️  CAMPO DE BATALHA',
    2:'📍  PONTO DE SITUAÇÃO',
    3:'⏱️  CAPACIDADE OPERACIONAL',
    4:'🔬  DIAGNÓSTICO DE CAMPO',
    5:'⚡  CALIBRAÇÃO FINAL',
    6:'🎯  RELATÓRIO DE MISSÃO',
  };

  /* ── Helpers ── */
  const _el  = id  => document.getElementById(id);
  const _q   = sel => document.querySelector(sel);
  const _qs  = sel => document.querySelectorAll(sel);

  function _days() {
    const d = _el('ob-date'); const n = _el('ob-days');
    if (d && d.value) return Math.max(0, Math.ceil((new Date(d.value) - new Date().setHours(0,0,0,0)) / 86400000));
    const v = parseInt(n && n.value); return v > 0 ? v : 0;
  }
  function _hours() { const s = _el('ob-hslider'); return s ? parseFloat(s.value) || 4 : 4; }

  /* ── Public API ── */
  function getUserProfile() {
    try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; }
  }
  function isCompleted() { return !!localStorage.getItem(KEY); }
  function calculateDaysRemaining(dateStr) {
    if (!dateStr) return null;
    return Math.max(0, Math.ceil((new Date(dateStr).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000));
  }

  /* ── Navigation ── */
  function goTo(step) {
    if (step > _step && _step >= 1 && !_validate(_step)) return;
    const prev = _step;
    _step = step;

    const chrome = ['ob-hdr','ob-prog-wrap','ob-phase','ob-nav'];
    chrome.forEach(function(id) {
      const el = _el(id);
      if (!el) return;
      el.style.display = step > 0 ? (id === 'ob-nav' ? 'flex' : 'block') : 'none';
    });

    const w = _q('.ob-welcome');
    if (w) w.style.display = step === 0 ? 'flex' : 'none';

    if (prev > 0) {
      const prevEl = _q('.ob-step[data-step="' + prev + '"]');
      if (prevEl) { prevEl.classList.add('ob-exit'); prevEl.classList.remove('ob-active'); setTimeout(function(){ prevEl.classList.remove('ob-exit'); }, 280); }
    }
    if (step > 0) {
      const nextEl = _q('.ob-step[data-step="' + step + '"]');
      if (nextEl) setTimeout(function(){ nextEl.classList.add('ob-active'); _updateChrome(); _onEnter(step); }, 80);
    } else {
      _updateChrome(); _onEnter(step);
    }
  }

  function next() { goTo(_step + 1); }
  function prev() { if (_step > 1) goTo(_step - 1); }

  /* ── Chrome ── */
  function _updateChrome() {
    if (_step === 0) return;
    const fill = _el('ob-prog-fill'); const ctr = _el('ob-hdr-counter'); const ph = _el('ob-phase');
    if (fill) fill.style.width = ((_step / STEPS) * 100) + '%';
    if (ctr)  ctr.textContent  = 'ETAPA ' + _step + ' DE ' + STEPS;
    if (ph)   ph.textContent   = PHASES[_step] || '';
    _qs('.ob-dot').forEach(function(d, i) {
      d.className = 'ob-dot' + (i+1 < _step ? ' done' : i+1 === _step ? ' active' : '');
    });
    const back = _el('ob-btn-back'); const nxt = _el('ob-btn-next'); const fin = _el('ob-btn-finish');
    if (back) back.style.display = _step > 1 ? 'flex' : 'none';
    if (nxt)  nxt.style.display  = _step < STEPS ? 'flex' : 'none';
    if (fin)  fin.style.display  = _step === STEPS ? 'flex' : 'none';
  }

  /* ── Step hooks ── */
  function _onEnter(step) {
    if (step === 4) _renderMatrix();
    if (step === 5) _checkIntensity();
    if (step === 6) _renderReport();
  }

  /* ── Validation ── */
  function _validate(step) {
    if (step === 1) {
      const cargo = _el('ob-cargo');
      if (!cargo || !cargo.value.trim()) { _shake(cargo); _flash('Informe o cargo ou carreira que está disputando.'); return false; }
      if (!_days()) { _shake(_el('ob-days')); _flash('Informe a data da prova ou quantos dias restam.'); return false; }
    }
    if (step === 2) {
      if (!_q('.ob-fase-card.ob-sel')) { _flash('Selecione sua fase atual (pré ou pós-edital).'); return false; }
    }
    return true;
  }

  function _shake(el) {
    if (!el) return;
    el.classList.add('ob-err');
    ['-7px','7px','-4px','0px'].forEach(function(v, i){ setTimeout(function(){ el.style.transform = 'translateX('+v+')'; }, i*80); });
    setTimeout(function(){ el.style.transform = ''; el.classList.remove('ob-err'); }, 360);
    el.focus();
  }
  function _flash(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:18px;left:50%;transform:translateX(-50%);background:rgba(255,77,77,0.14);border:1px solid rgba(255,77,77,0.35);color:#FF6B6B;padding:10px 20px;border-radius:10px;font-size:12px;font-weight:700;z-index:99999;pointer-events:none;';
    t.textContent = msg; document.body.appendChild(t);
    setTimeout(function(){ t.remove(); }, 2800);
  }

  /* ── Interactions ── */
  function selBanca(el) {
    _qs('.ob-banca-card').forEach(function(c){ c.classList.remove('ob-sel'); });
    el.classList.add('ob-sel');
    const wrap = _el('ob-banca-outro'); if (wrap) wrap.classList.toggle('ob-show', el.dataset.banca === '_outra');
  }
  function selFase(el) {
    _qs('.ob-fase-card').forEach(function(c){ c.classList.remove('ob-sel'); });
    el.classList.add('ob-sel');
    const cond = _el('ob-cond-q'); if (cond) cond.classList.toggle('ob-show', el.dataset.fase === 'pos');
  }
  function selOpt(el, group) {
    el.closest('.ob-option-grid').querySelectorAll('.ob-option-card').forEach(function(c){ c.classList.remove('ob-sel'); });
    el.classList.add('ob-sel');
  }
  function selChip(el, groupId) {
    const g = _el(groupId); if (!g) return;
    g.querySelectorAll('.ob-chip').forEach(function(c){ c.classList.remove('ob-sel'); });
    el.classList.add('ob-sel');
  }
  function selTaxa(el) { _qs('.ob-taxa-card').forEach(function(c){ c.classList.remove('ob-sel'); }); el.classList.add('ob-sel'); }
  function selIntensity(el) { _qs('.ob-intensity-card').forEach(function(c){ c.classList.remove('ob-sel'); }); el.classList.add('ob-sel'); _checkIntensity(); }

  function onDate() {
    const dEl = _el('ob-date'); const nEl = _el('ob-days');
    if (dEl && dEl.value && nEl) nEl.value = '';
    _updateDateHint();
    _updateHoursPreview();
  }
  function onDays() {
    const dEl = _el('ob-date'); const nEl = _el('ob-days');
    if (nEl && nEl.value && dEl) dEl.value = '';
    _updateDateHint();
    _updateHoursPreview();
  }
  function _updateDateHint() {
    const hint = _el('ob-date-hint'); if (!hint) return;
    const d = _days();
    if (!d) { hint.className = 'ob-date-hint'; return; }
    let cls, msg;
    if      (d < 15)  { cls='urgent'; msg='🔴 '+d+' dias — Reta final. Zero conteúdo novo.'; }
    else if (d < 30)  { cls='warn';   msg='⚠️ '+d+' dias — Urgência alta. Priorização cirúrgica.'; }
    else if (d < 90)  { cls='ok';     msg='🟡 '+d+' dias — Modo acelerado. Fundação viável.'; }
    else               { cls='plenty'; msg='✅ '+d+' dias — Margem para fundação sólida.'; }
    hint.className = 'ob-date-hint show ' + cls;
    hint.textContent = msg;
  }
  function onQ() {
    const sel = _q('#ob-chips-q .ob-chip.ob-sel');
    const cond = _el('ob-cond-taxa');
    if (cond) cond.classList.toggle('ob-show', sel && sel.dataset.q !== 'zero');
  }
  function onHours(slider) {
    const val = parseFloat(slider.value);
    slider.style.setProperty('--pct', ((val-1)/9*100) + '%');
    const big = _el('ob-h-big'); const main = _el('ob-h-main');
    if (big)  big.textContent  = val + 'h';
    if (main) main.textContent = (val*7).toFixed(0) + 'h por semana';
    _updateHoursPreview();
  }
  function _updateHoursPreview() {
    const sub = _el('ob-h-sub'); if (!sub) return;
    const d = _days(); const h = _hours();
    if (d) {
      const total = Math.round(h*d);
      sub.textContent = 'Total até a prova: ~'+total+'h' + (total>=300?' — base garantida':total>=150?' — suficiente com foco':' — priorização extrema');
    } else { sub.textContent = 'Configure a data da prova para ver a projeção.'; }
  }
  function _checkIntensity() {
    const hint = _el('ob-int-hint'); if (!hint) return;
    const int_ = (_q('.ob-intensity-card.ob-sel') || {}).dataset || {};
    const h    = _hours();
    if (int_.int === 'guerra' && h < 3) { hint.className='ob-badge warn'; hint.style.display='inline-flex'; hint.textContent='⚠️ Modo Guerra com menos de 3h/dia é inviável. Avalie bem.'; }
    else if (int_.int === 'sustentavel' && h >= 6) { hint.className='ob-badge good'; hint.style.display='inline-flex'; hint.textContent='✅ Com '+h+'h/dia você pode usar Acelerado sem pressão.'; }
    else { hint.style.display = 'none'; }
  }

  /* ── Matrix ── */
  function _renderMatrix() {
    const wrap = _el('ob-matrix'); if (!wrap) return;
    const labels = {zero:'❌ Zero', fraco:'⚠️ Fraco', ok:'✅ Ok', forte:'🔥 Forte'};
    wrap.innerHTML = SUBJECTS.map(function(s) {
      const cur = _matrix[s.id] || '';
      return '<div class="ob-matrix-row"><span class="ob-matrix-label">'+s.name+'</span><div class="ob-matrix-btns">'
        + ['zero','fraco','ok','forte'].map(function(lv){
            return '<button class="ob-matrix-btn'+(cur===lv?' ob-msel':'')+'" data-lv="'+lv+'" onclick="Onboarding.setMatrix(\''+s.id+'\',\''+lv+'\',this)">'+labels[lv]+'</button>';
          }).join('')
        + '</div></div>';
    }).join('');
  }
  function setMatrix(id, lv, btn) {
    _matrix[id] = lv;
    btn.closest('.ob-matrix-row').querySelectorAll('.ob-matrix-btn').forEach(function(b){ b.classList.remove('ob-msel'); });
    btn.classList.add('ob-msel');
  }

  /* ── Report ── */
  function _renderReport() {
    const el = _el('ob-report'); if (!el) return;
    const cargo    = (_el('ob-cargo')||{}).value || 'Meu Concurso';
    const bancaEl  = _q('.ob-banca-card.ob-sel');
    const banca    = bancaEl ? (bancaEl.dataset.banca === '_outra' ? ((_el('ob-banca-outro-input')||{}).value||'Outra') : bancaEl.dataset.banca) : 'CESPE/CEBRASPE';
    const d        = _days() || 60;
    const h        = _hours();
    const faseEl   = _q('.ob-fase-card.ob-sel');
    const fase     = faseEl ? faseEl.dataset.fase : 'pos';
    const expEl    = _q('.ob-option-card[data-exp].ob-sel');
    const intEl    = _q('.ob-intensity-card.ob-sel');
    const int_     = intEl ? intEl.dataset.int : 'acelerado';
    const metEl    = _q('.ob-option-card[data-met].ob-sel');
    const obstEl   = _q('.ob-option-card[data-obst].ob-sel');
    const obst     = obstEl ? obstEl.dataset.obst : 'conteudo';

    let modeLabel, modeClass, modeDesc;
    if      (d<15)                        { modeLabel='⛔ RETA FINAL';   modeClass='guerra';     modeDesc='Zero conteúdo novo. Só revisão e questões.'; }
    else if (d<30 || int_==='guerra')     { modeLabel='🔴 MODO GUERRA';  modeClass='guerra';     modeDesc='Máxima intensidade. Zero margem de erro.'; }
    else if (int_==='acelerado' || d<90)  { modeLabel='🟡 ACELERADO';    modeClass='acelerado';  modeDesc='Cobertura máxima com foco cirúrgico.'; }
    else                                   { modeLabel='🟢 SUSTENTÁVEL'; modeClass='sustentavel'; modeDesc='Fundação sólida. Consistência acima de tudo.'; }

    const vulns   = SUBJECTS.filter(function(s){ return _matrix[s.id]==='zero'||_matrix[s.id]==='fraco'; });
    const anchors = SUBJECTS.filter(function(s){ return _matrix[s.id]==='forte'||_matrix[s.id]==='ok'; });
    const hasM    = Object.keys(_matrix).length > 0;
    const vPct    = hasM && vulns.length ? Math.min(55, vulns.length*12) : 40;
    const qPct    = 30; const rPct = d<30 ? 25 : 15;
    const oPct    = Math.max(5, 100-vPct-qPct-rPct);

    const obstTips = {
      conteudo:'📚 Cronograma prioriza teoria + flashcards SM-2 desde o Dia 1.',
      disciplina:'🔄 Briefing diário com metas menores e streak de consistência.',
      metodo:'🧠 SM-2 ativado como método principal. Revisão espaçada é sua âncora.',
      direcao:'🎯 Análise de padrões da banca e heatmap de vulnerabilidades ativados.',
    };
    const expLbl = {iniciante:'🌱 Iniciante', intermediario:'📈 Intermediário', veterano:'🔥 Veterano', reincidente:'🎖️ Já fez prova'};
    const metLbl = {questoes:'🎯 Questões', flashcards:'🃏 SM-2', leitura:'📖 Leitura ativa', misto:'🔄 Misto'};

    const dr = function(lbl, pct, color){ return '<div class="ob-report-dist-row"><span class="ob-report-dist-lbl">'+lbl+'</span><div class="ob-report-dist-track"><div class="ob-report-dist-fill" style="width:'+pct+'%;background:'+color+'"></div></div><span class="ob-report-dist-pct">'+pct+'%</span></div>'; };

    el.innerHTML =
      '<div class="ob-report-hdr"><span class="ob-report-icon">🎯</span><div><div class="ob-report-title">'+cargo.toUpperCase()+'</div><div class="ob-report-sub">'+banca+' · '+d+' dias · '+h+'h/dia · ~'+Math.round(h*d)+'h totais</div></div><div class="ob-report-mode '+modeClass+'">'+modeLabel+'</div></div>'
      +'<div class="ob-report-grid">'
      +'<div class="ob-report-card"><div class="ob-report-card-lbl">Fase</div><div class="ob-report-card-val">'+(fase==='pos'?'📋 Pós-edital':'🎯 Pré-edital')+'</div></div>'
      +'<div class="ob-report-card"><div class="ob-report-card-lbl">Experiência</div><div class="ob-report-card-val">'+(expLbl[expEl?expEl.dataset.exp:'']||'—')+'</div></div>'
      +'<div class="ob-report-card"><div class="ob-report-card-lbl">Método</div><div class="ob-report-card-val">'+(metLbl[metEl?metEl.dataset.met:'']||'—')+'</div></div>'
      +'<div class="ob-report-card"><div class="ob-report-card-lbl">Modo Ativado</div><div class="ob-report-card-val"><span>'+modeDesc+'</span></div></div>'
      +'</div>'
      +(hasM&&vulns.length ? '<div class="ob-report-section"><div class="ob-report-section-title">Vulnerabilidades Críticas</div>'+vulns.slice(0,4).map(function(s){ return '<div class="ob-report-alert vuln">⚠️ '+s.name+' — '+(_matrix[s.id]==='zero'?'NÍVEL ZERO — prioridade máxima':'NÍVEL FRACO — peso dobrado')+'</div>'; }).join('')+'</div>' : '')
      +(hasM&&anchors.length ? '<div class="ob-report-section"><div class="ob-report-section-title">Âncoras Identificadas</div>'+anchors.slice(0,3).map(function(s){ return '<div class="ob-report-alert anchor">✅ '+s.name+' — '+(_matrix[s.id]==='forte'?'FORTE — manutenção mínima':'OK — manutenção periódica')+'</div>'; }).join('')+'</div>' : '')
      +'<div class="ob-report-section"><div class="ob-report-section-title">Distribuição de Tempo Recomendada</div><div class="ob-report-dist">'
      +(hasM&&vulns.length ? dr('⚠️ Áreas vulneráveis', vPct, 'var(--red)') : '')
      +dr('🎯 Questões e análise de erros', qPct, 'var(--gold)')
      +dr('🔁 Revisão e flashcards SM-2', rPct, 'var(--blue)')
      +dr('📚 Demais disciplinas', oPct, 'var(--green)')
      +'</div></div>'
      +'<div class="ob-report-alert tip">💡 '+(obstTips[obst]||'Sistema configurado para maximizar sua taxa de aprovação.')+'</div>';
  }

  /* ── Build profile ── */
  function _buildProfile() {
    const cargo    = (_el('ob-cargo')||{}).value || 'Meu Concurso';
    const bancaEl  = _q('.ob-banca-card.ob-sel');
    const banca    = bancaEl ? (bancaEl.dataset.banca==='_outra'?((_el('ob-banca-outro-input')||{}).value||'Outra'):bancaEl.dataset.banca) : 'CESPE/CEBRASPE';
    const dateVal  = (_el('ob-date')||{}).value || null;
    const d        = _days() || 60;
    const h        = _hours();
    const faseEl   = _q('.ob-fase-card.ob-sel');
    const fase     = faseEl ? faseEl.dataset.fase : 'pos';
    const expEl    = _q('.ob-option-card[data-exp].ob-sel');
    const jobEl    = _q('.ob-option-card[data-job].ob-sel');
    const intEl    = _q('.ob-intensity-card.ob-sel');
    const metEl    = _q('.ob-option-card[data-met].ob-sel');
    const obstEl   = _q('.ob-option-card[data-obst].ob-sel');
    const turnoEl  = _q('#ob-chips-turno .ob-chip.ob-sel');
    const fdsEl    = _q('#ob-chips-fds .ob-chip.ob-sel');
    const taxaEl   = _q('.ob-taxa-card.ob-sel');
    const qEl      = _q('#ob-chips-q .ob-chip.ob-sel');

    const pontosFracos = SUBJECTS
      .filter(function(s){ return _matrix[s.id]==='zero'||_matrix[s.id]==='fraco'; })
      .map(function(s){ return s.name; });

    return {
      meta:{ createdAt:new Date().toISOString(), version:'2.0', appVersion:'nexus_v7' },
      concurso:{ nome:cargo, banca:banca, situacao:fase==='pos'?'pos-edital':'pre-edital', dataProva:dateVal, diasRestantes:d },
      disponibilidade:{ horasPorDia:h, diasPorSemana:(fdsEl&&(fdsEl.dataset.f==='nunca'||fdsEl.dataset.f==='raramente'))?5:7, turno:turnoEl?turnoEl.dataset.t:'noite', trabalhando:!!(jobEl&&jobEl.dataset.job!=='integral'), situacaoTrabalho:jobEl?jobEl.dataset.job:'integral', fimDeSemana:fdsEl?fdsEl.dataset.f:'pouco' },
      perfil:{ nivel:expEl?expEl.dataset.exp:'intermediario', fase:fase, questoesFeitas:qEl?qEl.dataset.q:'zero', taxaAcertos:taxaEl?taxaEl.dataset.taxa:null, obstaculo:obstEl?obstEl.dataset.obst:'conteudo', metodoEstudo:metEl?metEl.dataset.met:'misto', intensidade:intEl?intEl.dataset.int:'acelerado' },
      diagnostico:{ matrizDominio:_matrix, vulns:pontosFracos },
      disciplinas:[], pontosFracos:pontosFracos, objetivo:'aprovacao',
    };
  }

  /* ── Finish ── */
  function finish() {
    const profile = _buildProfile();
    try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch(e) {}

    if (typeof State !== 'undefined') {
      State.merge('config', {
        examName:  profile.concurso.nome,
        examBoard: profile.concurso.banca,
        examDate:  profile.concurso.dataProva,
        totalDays: profile.concurso.diasRestantes,
        startDate: _localDateStr(),
      });
    }

    const overlay = _el('ob-overlay');
    if (overlay) {
      overlay.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(1.03)';
      setTimeout(function() {
        overlay.style.display = 'none';
        setTimeout(function() {
          if (typeof Router !== 'undefined') Router.go('dashboard');
          if (typeof App    !== 'undefined') App.refreshAll();
        }, 0);
        _showToast(profile.concurso.nome, profile.concurso.diasRestantes);
        _showNudge(profile);
      }, 460);
    }
  }

  /* ── Open / Skip / Reset / Show ── */
  function open() {
    _step = 0; _matrix = {};
    const overlay = _el('ob-overlay');
    if (!overlay) return;
    overlay.style.cssText = 'display:flex;opacity:1;transform:none;transition:none;';
    _qs('.ob-step').forEach(function(s){ s.classList.remove('ob-active','ob-exit'); });
    const w = _q('.ob-welcome'); if (w) w.style.display = 'flex';
    ['ob-hdr','ob-prog-wrap','ob-phase','ob-nav'].forEach(function(id){ const el=_el(id); if(el) el.style.display='none'; });
    const s = _el('ob-hslider'); if (s) { s.value = 4; s.style.setProperty('--pct','33.3%'); onHours(s); }
  }
  function show() { open(); }

  function skip() {
    const profile = { meta:{createdAt:new Date().toISOString(),version:'2.0',skipped:true}, concurso:{nome:'Meu Concurso',banca:'CESPE/CEBRASPE',situacao:'pos-edital',dataProva:null,diasRestantes:60}, disponibilidade:{horasPorDia:4,diasPorSemana:5,turno:'noite',trabalhando:false}, perfil:{nivel:'intermediario',intensidade:'acelerado'}, disciplinas:[], pontosFracos:[], objetivo:'aprovacao' };
    try { localStorage.setItem(KEY, JSON.stringify(profile)); } catch(e) {}
    const overlay = _el('ob-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(function(){
        overlay.style.display = 'none';
        setTimeout(function(){
          if (typeof Router !== 'undefined') Router.go('dashboard');
          if (typeof App    !== 'undefined') App.refreshAll();
        }, 0);
      }, 380);
    }
  }

  function reset() {
    if (!confirm('Reconfigurar seu perfil? Os dados de estudo serão mantidos.')) return;
    localStorage.removeItem(KEY); _matrix = {}; open();
  }

  /* ── Toast + Nudge ── */
  function _showToast(name, days) {
    const t = document.createElement('div');
    t.className = 'ob-toast';
    t.innerHTML = '<span class="ob-toast-icon">🚀</span><div><strong>Operação Aprovação iniciada!</strong><span>' + name + ' · ' + days + ' dias de preparação</span></div>';
    document.body.appendChild(t);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ t.classList.add('ob-toast-show'); }); });
    setTimeout(function(){ t.classList.remove('ob-toast-show'); setTimeout(function(){ t.remove(); }, 500); }, 4200);
  }

  function _showNudge(profile) {
    const hasKey = !!localStorage.getItem('nexus_api_key');
    const nudge  = document.createElement('div');
    nudge.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(10px);z-index:9998;background:var(--surface-2);border:1px solid '+(hasKey?'rgba(232,184,75,0.3)':'rgba(77,159,255,0.3)')+';border-radius:13px;padding:12px 18px;display:flex;align-items:center;gap:11px;box-shadow:0 8px 30px rgba(0,0,0,0.45);opacity:0;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);max-width:min(400px,90vw);cursor:pointer;';
    nudge.innerHTML = hasKey
      ? '<span style="font-size:16px">🤖</span><div><strong style="font-size:12px;color:var(--gold);">Gerar DNA da Banca com IA</strong><span style="display:block;font-size:10px;color:var(--text-muted);margin-top:2px;">Acesse DNA da Banca para gerar flashcards personalizados</span></div><span style="color:var(--gold);font-size:13px;margin-left:auto;">→</span>'
      : '<span style="font-size:16px">🔑</span><div><strong style="font-size:12px;color:var(--blue);">Configure sua chave de IA</strong><span style="display:block;font-size:10px;color:var(--text-muted);margin-top:2px;">Em Configurações → IA para conteúdo gerado automaticamente</span></div><span style="color:var(--blue);font-size:13px;margin-left:auto;">→</span>';
    nudge.onclick = function(){
      nudge.remove();
      if (hasKey && typeof Router !== 'undefined') Router.go('analysis');
      else if (typeof ConfigPanel !== 'undefined') ConfigPanel.open();
    };
    document.body.appendChild(nudge);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ nudge.style.opacity='1'; nudge.style.transform='translateX(-50%) translateY(0)'; }); });
    setTimeout(function(){ nudge.style.opacity='0'; nudge.style.transform='translateX(-50%) translateY(10px)'; setTimeout(function(){ nudge.remove(); },400); }, 7000);
  }

  /* ── Init slider ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ const s=_el('ob-hslider'); if(s){ s.style.setProperty('--pct','33.3%'); } });
  }

  /* ── Legacy aliases for backward compatibility ── */
  return {
    getUserProfile, isCompleted, calculateDaysRemaining,
    goTo, next, prev, finish, skip, show, open, reset,
    selBanca, selFase, selOpt, selChip, selTaxa, selIntensity,
    onDate, onDays, onQ, onHours, setMatrix,
    // Legacy names used by other modules & HTML buttons
    selectSingle:    function(el, cls){ selChip(el, cls); },
    selectObjCard:   function(el){ selOpt(el, 'obj'); },
    addDiscipline:   function(){},
    removeDiscipline:function(){},
    toggleDateField: function(){ onDate(); },
  };
})();



const StudyTimer = (() => {

  const SESSIONS_KEY = 'nexus_sessions_v1';
  const GOALS_KEY    = 'nexus_goals_v1';

  /* ── Timer state ── */
  let _mode        = 'crono';   // 'crono' | 'timer' | 'pomo'
  let _running     = false;
  let _elapsed     = 0;         // seconds elapsed (crono) or remaining (timer/pomo)
  let _startTs     = 0;         // timestamp when current play segment started
  let _elapsedAtPause = 0;      // accumulated elapsed at last pauseining (timer/pomo)
  let _total       = 0;         // total seconds for timer/pomo
  let _interval    = null;
  let _pomoSession = 0;         // 0-3 focus sessions
  let _pomoPhase   = 'focus';   // 'focus' | 'break'
  let _streakOffset = 0;        // week offset for heatmap nav
  let _chartMode   = 'tempo';

  /* ── Session store ── */
  function _getSessions() {
    try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]'); } catch { return []; }
  }
  function _saveSessions(arr) {
    try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(arr)); } catch {}
  }

  /* ── Goals ── */
  function _getGoals() {
    try {
      const g = JSON.parse(localStorage.getItem(GOALS_KEY) || '{}');
      return { horasMeta: g.horasMeta || 20, questoesMeta: g.questoesMeta || 300 };
    } catch { return { horasMeta: 20, questoesMeta: 300 }; }
  }
  function _saveGoals(g) { try { localStorage.setItem(GOALS_KEY, JSON.stringify(g)); } catch {} }

  /* ── Disciplines from onboarding ── */
  function _getDisciplines() {
    const profile = Onboarding.getUserProfile();
    if (profile?.disciplinas?.length) return profile.disciplinas.map(d => d.name);
    return Data.SUBJECTS.map(s => s.name);
  }

  /* ── Open full-screen ── */
  function openFullscreen(initialMode) {
    if (initialMode) _mode = initialMode;
    document.getElementById('timer-fullscreen')?.classList.add('open');
    document.getElementById('timer-mini')?.classList.remove('show');
    // Show FAB while fullscreen is open (user can minimize)
    const $fab = document.getElementById('timer-fab-main');
    if ($fab) $fab.style.display = 'none'; // hide FAB while fullscreen open
    _updateTimerUI();
    _updateMiniPlayer();
  }

  /* legacy aliases */
  function openTimer(initialMode) { openFullscreen(initialMode); }
  function openPomodoro()         { openFullscreen('pomo'); }

  function closeFullscreen() {
    document.getElementById('timer-fullscreen')?.classList.remove('open');
    // Show FAB again when fullscreen closes (and mini-player is not showing)
    const $mini = document.getElementById('timer-mini');
    const miniVisible = $mini?.classList.contains('show');
    const $fab = document.getElementById('timer-fab-main');
    if ($fab) $fab.style.display = miniVisible ? 'none' : 'flex';
  }

  function closeAndReset() {
    // Stop timer completely + reset to zero
    _running  = false;
    _startTs  = null;
    _elapsed  = 0;
    clearInterval(_interval);
    _interval = null;
    // Hide mini player
    const $mini = document.getElementById('timer-mini');
    if ($mini) $mini.classList.remove('show');
    // Hide fullscreen
    document.getElementById('timer-fullscreen')?.classList.remove('open');
    // Show FAB
    const $fab = document.getElementById('timer-fab-main');
    if ($fab) $fab.style.display = 'flex';
    // Reset display
    const $disp = document.getElementById('timer-display');
    if ($disp) $disp.textContent = '00:00:00';
    const $mdisp = document.getElementById('timer-mini-time');
    if ($mdisp) $mdisp.textContent = '00:00';
  }
  function closeTimer() { closeFullscreen(); }

  /* ── Minimize → mini-player ── */
  function minimize() {
    document.getElementById('timer-fullscreen')?.classList.remove('open');
    document.getElementById('timer-mini')?.classList.add('show');
    // Hide FAB — mini-player takes its place
    const $fab = document.getElementById('timer-fab-main');
    if ($fab) $fab.style.display = 'none';
    _updateMiniPlayer();
  }

  /* ── Update mini-player display ── */
  function _updateMiniPlayer() {
    const $mini      = document.getElementById('timer-mini');
    const $miniTime  = document.getElementById('timer-mini-time');
    const $miniLabel = document.getElementById('timer-mini-label');
    const $miniMode  = document.getElementById('timer-mini-mode');
    const $miniPlay  = document.getElementById('timer-mini-play');

    if (!$mini) return;

    const secs  = _mode === 'crono' ? _elapsed : _elapsed;
    const icons = { crono: '⏱', timer: '⏲', pomo: '🍅' };
    const lbls  = { crono: 'Cronômetro', timer: 'Timer', pomo: 'Pomodoro' };

    if ($miniTime)  { $miniTime.textContent = _fmtTime(secs); $miniTime.className = 'timer-mini-time' + (_running ? ' running' : ''); }
    if ($miniLabel) $miniLabel.textContent  = lbls[_mode] || 'Timer';
    if ($miniMode)  { $miniMode.textContent = icons[_mode] || '⏱'; $miniMode.className = 'timer-mini-mode' + (_running ? ' running' : ''); }
    if ($miniPlay)  $miniPlay.textContent   = _running ? '⏸' : '▶';
  }

  /* ── Restore FAB (called when mini-player dismissed) ── */
  function _showFab() {
    const $fab = document.getElementById('timer-fab-main');
    if ($fab) $fab.style.display = 'flex';
  }

  /* ── Fab badge ── */
  function _updateFabBadge() {
    const $fab   = document.getElementById('timer-fab-main');
    const $badge = document.getElementById('timer-fab-badge');
    const $label = document.getElementById('timer-fab-label');
    const modeLabels = { crono: 'Cronômetro', timer: 'Timer', pomo: 'Pomodoro' };
    if (_running) {
      $fab?.classList.add('running');
      if ($badge) { $badge.textContent = _fmtTime(_elapsed); $badge.classList.add('show'); }
      if ($label) $label.textContent = _fmtTime(_elapsed);
    } else {
      $fab?.classList.remove('running');
      $badge?.classList.remove('show');
      if ($label) $label.textContent = modeLabels[_mode] || 'Cronômetro';
    }
    _updateMiniPlayer();
  }

  /* ── Mode switch ── */
  function setMode(m) {
    if (_running) return;
    _mode = m;
    _elapsed = 0;
    if (m === 'pomo') { _pomoSession = 0; _pomoPhase = 'focus'; }
    ['crono','timer','pomo'].forEach(id => {
      const tab = document.getElementById(`tmtab-${id}`);
      if (tab) tab.classList.toggle('active', id === m);
    });
    // Reset play button text
    const $btn = document.getElementById('timer-play-btn');
    if ($btn) { $btn.textContent = '▶ Iniciar'; $btn.classList.remove('running'); }
    _updateTimerUI();
  }

  /* ── Duration (timer + pomo) ── */
  function setDuration(mins, btn) {
    if (_running) return;
    const m = parseInt(mins) || 25;
    _total   = m * 60;
    _elapsed = _total;
    // Update chip selection
    if (btn) {
      document.querySelectorAll('.timer-dur-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
    }
    _renderDigits();
  }

  /* ── Play / Pause ── */
  function togglePlay() {
    if (!_running) _start(); else _pause();
  }

  function _start() {
    _running = true;
    // ── Timestamp-based timing — accurate across tab switches ──
    _startTs = Date.now();
    _elapsedAtPause = _elapsed;

    // Initialize countdown if needed
    if (_mode !== 'crono' && (_elapsed === 0 || _elapsed === _total)) {
      _elapsed = _total || 25 * 60;
      _elapsedAtPause = _elapsed;
    }

    const $btn = document.getElementById('timer-play-btn');
    if ($btn) { $btn.textContent = '⏸ Pausar'; $btn.classList.add('running'); }
    document.getElementById('timer-digits')?.classList.add('running');
    document.getElementById('timer-fab-main')?.classList.add('running');

    clearInterval(_interval);
    _interval = setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - _startTs) / 1000);
      if (_mode === 'crono') {
        _elapsed = _elapsedAtPause + secondsElapsed;
      } else {
        _elapsed = Math.max(0, _elapsedAtPause - secondsElapsed);
        if (_elapsed <= 0) { _elapsed = 0; clearInterval(_interval); _onTimerDone(); return; }
      }
      _renderDigits();
      _updateProgress();
      _updateFabBadge();
    }, 250); // 250ms for smoother display while staying accurate
  }

  function _pause() {
    _running = false;
    clearInterval(_interval);
    // ── Save accurate elapsed before pausing ──
    if (_startTs > 0) {
      const secondsElapsed = Math.floor((Date.now() - _startTs) / 1000);
      if (_mode === 'crono') {
        _elapsed = _elapsedAtPause + secondsElapsed;
      } else {
        _elapsed = Math.max(0, _elapsedAtPause - secondsElapsed);
      }
      _startTs = 0;
    }
    _elapsedAtPause = _elapsed;
    const $btn = document.getElementById('timer-play-btn');
    if ($btn) { $btn.textContent = '▶ Continuar'; $btn.classList.remove('running'); }
    document.getElementById('timer-digits')?.classList.remove('running');
    document.getElementById('timer-fab-main')?.classList.remove('running');
    _renderDigits();
  }

  function stopTimer() {
    _pause();
    const elapsed = _mode === 'crono' ? _elapsed : (_total - _elapsed);
    // Hide mini-player, restore FAB
    document.getElementById('timer-mini')?.classList.remove('show');
    _showFab();
    if (elapsed > 10) {
      // Smooth transition: fade out timer then open registro
      const fs = document.getElementById('timer-fullscreen');
      const card = fs?.querySelector('.timer-fullscreen-card');
      if (card) {
        card.style.transition = 'opacity .25s ease, transform .25s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(.96) translateY(12px)';
        setTimeout(() => {
          closeTimer();
          card.style.transition = '';
          card.style.opacity = '';
          card.style.transform = '';
          _openRegistroWithTime(elapsed);
        }, 240);
      } else {
        closeTimer();
        _openRegistroWithTime(elapsed);
      }
    } else {
      closeTimer();
      _elapsed = 0;
      _updateTimerUI();
    }
  }

  function _onTimerDone() {
    _pause();
    const elapsed = _total;
    _elapsed = 0;
    // Hide mini-player, restore FAB
    document.getElementById('timer-mini')?.classList.remove('show');
    _showFab();

    // Play sound
    _beep();

    // Show alert overlay
    const $alert = document.getElementById('timer-alert');
    const $title = document.getElementById('alert-title');
    const $sub   = document.getElementById('alert-sub');
    if ($alert) $alert.classList.add('open');

    if (_mode === 'pomo') {
      if (_pomoPhase === 'focus') {
        $title && ($title.textContent = '🍅 POMODORO CONCLUÍDO!');
        $sub   && ($sub.textContent   = `Sessão ${_pomoSession + 1} finalizada. Hora da pausa!`);
        _pomoSession++;
        _pomoPhase = _pomoSession >= 4 ? 'long' : 'break';
      } else {
        $title && ($title.textContent = '⏰ PAUSA FINALIZADA!');
        $sub   && ($sub.textContent   = 'Hora de voltar aos estudos!');
        _pomoPhase = 'focus';
        if (_pomoSession >= 4) _pomoSession = 0;
      }
    } else {
      $title && ($title.textContent = '⏰ TEMPO FINALIZADO!');
      $sub   && ($sub.textContent   = 'Ótimo trabalho! Registre seus estudos.');
    }

    // Store elapsed for registro
    StudyTimer._pendingElapsed = elapsed;
    closeTimer();
  }

  function alertToRegistro() {
    document.getElementById('timer-alert')?.classList.remove('open');
    _openRegistroWithTime(StudyTimer._pendingElapsed || 0);
  }
  function dismissAlert() {
    document.getElementById('timer-alert')?.classList.remove('open');
  }

  /* ── Render digits ── */
  function _renderDigits() {
    const $d = document.getElementById('timer-digits');
    if (!$d) return;
    $d.textContent = _fmtTime(_elapsed);

    // SVG ring — circumference of r=96 circle = 2π×96 ≈ 603
    const CIRC = 603;
    const ring = document.getElementById('timer-ring-fill');
    if (ring) {
      ring.classList.remove('running-crono','warning','danger');
      if (_mode === 'crono') {
        // Pulse fill when running; empty when stopped
        if (_running) {
          ring.classList.add('running-crono');
          ring.style.strokeDashoffset = '0';
        } else {
          ring.style.strokeDashoffset = CIRC;
        }
        ring.style.stroke = '';
        $d.classList.remove('warning','danger');
        $d.classList.toggle('running', _running);
      } else if (_total > 0) {
        // Timer/Pomo: fill depletes as time runs out
        const remaining = Math.max(0, _elapsed);
        const pct = remaining / _total;
        ring.style.strokeDashoffset = CIRC * (1 - pct);
        const warn = pct > 0 && pct <= 0.33 && pct > 0.1;
        const danger = pct <= 0.1 && remaining > 0;
        if (danger)      { ring.classList.add('danger');  $d.classList.remove('warning'); $d.classList.add('danger'); }
        else if (warn)   { ring.classList.add('warning'); $d.classList.remove('danger');  $d.classList.add('warning'); }
        else             { $d.classList.remove('warning','danger'); }
        $d.classList.toggle('running', _running);
      }
    }

    // Update mode badge
    const badge = document.getElementById('timer-mode-badge');
    if (badge) {
      const labels = { crono:'⏱ Cronômetro', timer:'⏳ Timer', pomo:'🍅 Pomodoro' };
      badge.textContent = labels[_mode] || '⏱ Cronômetro';
    }
  }

  function _fmtTime(s) {
    const h   = Math.floor(s / 3600);
    const m   = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const p2  = n => String(n).padStart(2,'0');
    return h > 0 ? `${p2(h)}:${p2(m)}:${p2(sec)}` : `${p2(m)}:${p2(sec)}`;
  }

  function _updateProgress() {
    const $fill  = document.getElementById('timer-prog-fill');
    const $track = document.getElementById('timer-prog-track');
    if (!$fill || !$track) return;
    if (_mode === 'crono' || !_total) { $track.style.display = 'none'; return; }
    $track.style.display = 'block';
    $fill.style.width = Math.round((_elapsed / _total) * 100) + '%';
  }

  /* ── Update full timer UI ── */
  function _updateTimerUI() {
    const $durRow  = document.getElementById('timer-dur-row');
    const $progTr  = document.getElementById('timer-prog-track');
    const $pomoInf = document.getElementById('pomo-info');

    const isCrono = _mode === 'crono';
    const isPomo  = _mode === 'pomo';
    if ($durRow)  $durRow.style.display  = isCrono ? 'none' : 'flex';
    if ($progTr)  $progTr.style.display  = isCrono ? 'none' : 'block';
    if ($pomoInf) $pomoInf.style.display = isPomo   ? 'block' : 'none';

    // Initialize total
    if (_mode === 'timer' && !_total) { _total = 25 * 60; _elapsed = _total; }
    if (_mode === 'pomo'  && !_total) { _total = 25 * 60; _elapsed = _total; }
    if (_mode === 'crono')            { _total = 0; }

    // Reset play button
    if (!_running) {
      const $btn = document.getElementById('timer-play-btn');
      if ($btn) { $btn.textContent = '▶ Iniciar'; $btn.classList.remove('running'); }
    }

    _renderDigits();
    _updateProgress();

    // Reset ring when not running
    const ring = document.getElementById('timer-ring-fill');
    if (ring && !_running) {
      ring.classList.remove('running-crono','warning','danger');
      ring.style.strokeDashoffset = '603';
    }

    // Pomodoro dots
    if (isPomo) {
      const $dots = document.getElementById('pomo-dots');
      const $lbl  = document.getElementById('pomo-label');
      if ($dots) {
        $dots.innerHTML = Array.from({length:4}, (_,i) => `
          <div class="timer-sdot ${i < _pomoSession ? 'done' : i === _pomoSession && _pomoPhase === 'focus' ? 'active' : ''}"></div>`
        ).join('');
      }
      if ($lbl) $lbl.textContent = _pomoPhase === 'focus'
        ? `Sessão ${_pomoSession + 1} de 4 · Foco`
        : `Pausa ${_pomoSession >= 4 ? 'Longa (15 min)' : 'Curta (5 min)'}`;
    }

    // Running info
    const $info = document.getElementById('timer-running-info');
    if ($info) {
      const map = { crono: 'Cronômetro livre — conta para cima', timer: 'Timer com contagem regressiva', pomo: 'Técnica Pomodoro — 25 min foco · 5 min pausa' };
      $info.textContent = map[_mode] || '';
    }
  }

  /* ── Beep on finish ── */
  function _beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.3, 0.6].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.25);
      });
    } catch {}
  }

  /* ══════════════════════════════════════════
     REGISTRO DE ESTUDO
  ══════════════════════════════════════════ */
  let _regDate    = 'hoje';
  let _regSeconds = 0;

  function _openRegistroWithTime(secs) {
    _regSeconds = secs || 0;
    _regDate    = 'hoje';

    // Populate disciplines from edital (not just onboarding)
    const $disc = document.getElementById('reg-disciplina');
    if ($disc) {
      const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      let discs;
      if (edData?.disciplinas?.length) {
        discs = edData.disciplinas.map(d => d.nome);
      } else {
        discs = _getDisciplines();
      }
      $disc.innerHTML = '<option value="">Selecione...</option>' +
        discs.map(d => '<option value="' + d + '">' + d + '</option>').join('');
      $disc.onchange = function(){ StudyTimer.onDiscChange(this); };
      // Pre-fill from startStudy
      if (_activeDisc) {
        const match = discs.find(d => d === _activeDisc || d.includes(_activeDisc.slice(0,10)) || _activeDisc.includes(d.slice(0,10)));
        if (match) {
          $disc.value = match;
          StudyTimer.onDiscChange($disc);
        }
      }
    }

    // Pre-fill time display
    const $td = document.getElementById('reg-time-display');
    if ($td) $td.textContent = _fmtTime(_regSeconds);

    // Reset form fields
    ['reg-topico','reg-material','reg-comentarios'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    ['reg-acertos','reg-erros','reg-pag-ini','reg-pag-fim'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '0';
    });
    ['reg-teoria','reg-revisao','reg-save-new'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
    // Reset new toggle UI
    ['toggle-teoria','toggle-revisao'].forEach((id,i) => {
      document.getElementById(id)?.classList.remove(i===0?'checked-teoria':'checked-revisao');
    });
    // Reset taxa bar
    const tf = document.getElementById('reg-taxa-fill');
    const tl = document.getElementById('reg-taxa-label');
    if (tf) tf.style.width = '0%';
    if (tl) tl.textContent = 'Nenhuma questão registrada';
    // Update subtitle with active disc
    const $sub = document.getElementById('reg-subtitle');
    if ($sub) $sub.textContent = _activeDisc ? '📚 ' + _activeDisc : 'Nova sessão de estudo';

    // Reset date tabs
    setRegDate('hoje', document.querySelector('.reg-date-tab[data-val="hoje"]'));

    // Reset categoria
    const $rcat = document.getElementById('reg-categoria');
    if ($rcat) $rcat.value = '';
    document.getElementById('reg-categoria-custom-wrap')?.classList.remove('show');
    _loadCats(); _populateCatSelect(); _renderCatTags();
    // Reset videoaulas
    _vids = []; _renderVids();

    // Reset chips de Programar Revisão
    _resetRevDays();
    document.getElementById('reg-rev-days-wrap')?.classList.remove('show');
    document.getElementById('reg-rev-days-custom-wrap')?.classList.remove('show');
    renderRevDayChips();

    document.getElementById('reg-overlay')?.classList.add('open');
  }

  /* ── Start study session from Briefing/Agenda ── */
  let _activeDisc  = '';
  let _activeTopic = '';
  let _editingSessionId = null;   // when editing an existing session

  function startStudy(disciplina, topico) {
    _activeDisc  = disciplina || '';
    _activeTopic = topico || '';
    // Show active disc in timer
    const $ad = document.getElementById('timer-active-disc');
    if ($ad) {
      $ad.textContent = '📚 ' + disciplina + (topico ? ' — ' + topico.replace(/^⚡\s*/,'').slice(0,50) : '');
      $ad.classList.add('show');
    }
    // Start timer automatically
    openFullscreen('crono');
    if (!_running) {
      _elapsed = 0;
      _running = true;
      _startTs = Date.now();
      _elapsedAtPause = 0;
      _interval = setInterval(() => {
        _elapsed = Math.floor((Date.now() - _startTs) / 1000);
        _renderDigits(); _updateMiniPlayer();
      }, 250);
      const $btn = document.getElementById('timer-play-btn');
      if ($btn) { $btn.textContent = '⏸ Pausar'; $btn.classList.add('running'); }
    }
    // Show cancel button
    const $cb = document.getElementById('timer-cancel-btn');
    if ($cb) $cb.classList.add('visible');
    // Navigate to dashboard when starting timer
    Router.go('dashboard');
    setTimeout(() => openFullscreen('crono'), 50);
  }

  /* ── Cancel timer — stop + close WITHOUT saving anything ── */
  function cancelTimer() {
    if (_interval) { clearInterval(_interval); _interval = null; }
    _running  = false;
    _elapsed  = 0;
    _activeDisc  = '';
    _activeTopic = '';
    const $ad = document.getElementById('timer-active-disc');
    if ($ad) { $ad.textContent = ''; $ad.classList.remove('show'); }
    const $cb = document.getElementById('timer-cancel-btn');
    if ($cb) $cb.classList.remove('visible');
    closeFullscreen();
    _renderDigits();
    // Show brief feedback
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(255,77,77,0.15);border:1px solid rgba(255,77,77,0.3);color:var(--red);padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none';
    t.textContent = '✕ Sessão cancelada — nada foi registrado';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  /* ── Populate topic select when discipline changes ── */
  function onDiscChange(selectEl) {
    const discName = selectEl?.value || document.getElementById('reg-disciplina')?.value || '';
    const $tsel = document.getElementById('reg-topico-sel');
    const $thid = document.getElementById('reg-topico');
    if (!$tsel) return;
    $tsel.innerHTML = '<option value="">Selecione o tópico...</option>';
    if (!discName) return;
    // Find discipline in edital
    const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const disc   = edData?.disciplinas?.find(d => d.nome === discName); // exact match — prevents Penal/Penal Militar confusion
    const topics = disc?.topicos || [];
    topics.forEach((t, idx) => {
      const opt = document.createElement('option');
      opt.value  = JSON.stringify({ discId: disc.id, idx, texto: t.texto });
      opt.textContent = t.texto.replace(/^⚡\s*/,'');
      $tsel.appendChild(opt);
    });
    // Pre-fill from startStudy if topic was passed
    if (_activeTopic) {
      const match = topics.findIndex(t => t.texto === _activeTopic || t.texto.replace(/^⚡\s*/,'') === _activeTopic);
      if (match >= 0) {
        $tsel.selectedIndex = match + 1;
        if ($thid) $thid.value = JSON.stringify({ discId: disc?.id, idx: match, texto: topics[match].texto });
      }
    }
  }

  function onTopicoChange(sel) {
    const $h = document.getElementById('reg-topico');
    if ($h) $h.value = sel?.value || '';
  }

  function openRegistroEdit(sess) {
    _openRegistroWithTime(sess.tempoSecs || 0);
    // Pre-fill all fields from session
    setTimeout(function(){
      try {
        const g = id => document.getElementById(id);
        if (g('reg-disciplina')) { g('reg-disciplina').value = sess.disciplina||''; onDiscChange(g('reg-disciplina')); }
        if (g('reg-material'))    g('reg-material').value   = sess.material||'';
        if (g('reg-comentarios')) g('reg-comentarios').value= sess.comentarios||'';
        if (g('reg-pag-ini'))     g('reg-pag-ini').value    = sess.paginasIni||0;
        if (g('reg-pag-fim'))     g('reg-pag-fim').value    = sess.paginasFim||0;
        if (g('reg-acertos'))     { g('reg-acertos').value  = sess.acertos||0; updateTaxa(); }
        if (g('reg-erros'))       { g('reg-erros').value    = sess.erros||0;   updateTaxa(); }
        if (g('reg-categoria'))   g('reg-categoria').value  = sess.categoria||'';
        if (g('reg-teoria'))      g('reg-teoria').checked   = !!sess.teoriaFin;
        if (g('reg-revisao'))     g('reg-revisao').checked  = !!sess.programarRev;
        // Sync visual state of toggles + revisão chips
        const tt = document.getElementById('toggle-teoria');
        if (tt) tt.classList.toggle('checked-teoria', !!sess.teoriaFin);
        const tr = document.getElementById('toggle-revisao');
        if (tr) tr.classList.toggle('checked-revisao', !!sess.programarRev);
        const rdw = document.getElementById('reg-rev-days-wrap');
        if (rdw) rdw.classList.toggle('show', !!sess.programarRev);
        if (sess.programarRev) renderRevDayChips();
        // Set topico after disc loads
        setTimeout(function(){
          if (g('reg-topico')) g('reg-topico').value = sess.topico||'';
          // Try to select in dropdown
          var $tsel = g('reg-topico-sel');
          if ($tsel && sess.topico) {
            try {
              var parsed = JSON.parse(sess.topico);
              var opts   = [...$tsel.options];
              var match  = opts.findIndex(function(o){ try{ return JSON.parse(o.value).texto===parsed.texto; }catch(_){return false;} });
              if (match>=0) $tsel.selectedIndex=match;
            } catch(_){}
          }
          // Restore videoaulas
          if (sess.videoaulas && sess.videoaulas.length && typeof _vids !== 'undefined') {
            _vids = sess.videoaulas.map(function(v){return Object.assign({id:Date.now()+Math.random()*1000|0},v);});
            if (typeof _renderVids === 'function') _renderVids();
          }
        }, 80);
        // Subtitle hint
        var $sub = document.getElementById('reg-subtitle');
        if ($sub) $sub.textContent = 'Editando registro — ' + (sess.disciplina||'');
        // Override save to update existing
        _editingSessionId = sess.id;
      } catch(err){ console.warn('openRegistroEdit:', err); }
    }, 120);
  }

  function openRegistroManual() { _openRegistroWithTime(0); }

  function closeRegistro() {
    _editingSessionId = null;
    document.getElementById('reg-overlay')?.classList.remove('open');
  }

  function setRegDate(val, btn) {
    _regDate = val;
    document.querySelectorAll('.reg-date-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const $custom = document.getElementById('reg-date-custom');
    if ($custom) $custom.style.display = val === 'outro' ? 'block' : 'none';
    if (val === 'outro') _initDatePicker();
  }

  /* ── Date picker PT-BR ── */
  let _dpYear = 0, _dpMonth = 0, _dpSelectedDate = '';

  function _initDatePicker() {
    const now = new Date();
    _dpYear = now.getFullYear(); _dpMonth = now.getMonth();
    if (_dpSelectedDate) {
      const p = _dpSelectedDate.split('-');
      _dpYear = +p[0]; _dpMonth = +p[1] - 1;
    }
    _renderDateCal();
  }

  function toggleDatePicker() {
    const $cal = document.getElementById('reg-date-cal');
    if (!$cal) return;
    const visible = $cal.style.display !== 'none';
    $cal.style.display = visible ? 'none' : 'block';
    if (!visible) _renderDateCal();
  }

  function _dpNav(delta) { _dpMonth += delta; if (_dpMonth > 11) { _dpMonth=0; _dpYear++; } else if (_dpMonth < 0) { _dpMonth=11; _dpYear--; } _renderDateCal(); }

  function _dpSelect(y, m, d) {
    const pad = n => String(n).padStart(2,'0');
    _dpSelectedDate = `${y}-${pad(m+1)}-${pad(d)}`;
    document.getElementById('reg-date-hidden').value = _dpSelectedDate;
    document.getElementById('reg-date-display').textContent = `${pad(d)}/${pad(m+1)}/${y}`;
    document.getElementById('reg-date-cal').style.display = 'none';
  }

  function _renderDateCal() {
    const $cal = document.getElementById('reg-date-cal');
    if (!$cal) return;
    const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const DIAS  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const firstDay = new Date(_dpYear, _dpMonth, 1).getDay();
    const daysInMonth = new Date(_dpYear, _dpMonth+1, 0).getDate();
    const today = new Date(); const ty = today.getFullYear(), tm = today.getMonth(), td = today.getDate();
    const selParts = _dpSelectedDate ? _dpSelectedDate.split('-') : null;
    let cells = '';
    for (let i=0; i<firstDay; i++) cells += '<div class="dp-cell dp-empty"></div>';
    for (let d=1; d<=daysInMonth; d++) {
      const isToday = _dpYear===ty && _dpMonth===tm && d===td;
      const isSel   = selParts && +selParts[0]===_dpYear && +selParts[1]-1===_dpMonth && +selParts[2]===d;
      cells += `<div class="dp-cell${isToday?' dp-today':''}${isSel?' dp-sel':''}" onclick="StudyTimer._dpSelect(${_dpYear},${_dpMonth},${d})">${d}</div>`;
    }
    $cal.innerHTML = `
      <div class="dp-header">
        <button class="dp-nav" onclick="StudyTimer._dpNav(-1)">‹</button>
        <span class="dp-month-label">${MESES[_dpMonth]} ${_dpYear}</span>
        <button class="dp-nav" onclick="StudyTimer._dpNav(1)">›</button>
      </div>
      <div class="dp-weekdays">${DIAS.map(d=>`<div class="dp-wd">${d}</div>`).join('')}</div>
      <div class="dp-grid">${cells}</div>
      <div class="dp-footer">
        <button class="dp-clear" onclick="StudyTimer._dpClear()">Limpar</button>
        <button class="dp-today-btn" onclick="StudyTimer._dpGoToday()">Hoje</button>
      </div>`;
  }

  function _dpClear() {
    _dpSelectedDate = '';
    document.getElementById('reg-date-hidden').value = '';
    document.getElementById('reg-date-display').textContent = 'dd/mm/aaaa';
    document.getElementById('reg-date-cal').style.display = 'none';
  }

  function _dpGoToday() {
    const t = new Date(); _dpYear = t.getFullYear(); _dpMonth = t.getMonth();
    _dpSelect(_dpYear, _dpMonth, t.getDate());
  }

  function _resolveDate() {
    const today = new Date();
    if (_regDate === 'hoje')  return _localDateStr(today);
    if (_regDate === 'ontem') {
      const y = new Date(today); y.setDate(y.getDate() - 1);
      return _localDateStr(y);
    }
    return document.getElementById('reg-date-hidden')?.value || _localDateStr(today);
  }

  function saveRegistro() {
    const g   = id => document.getElementById(id)?.value.trim() || '';
    const num = id => parseInt(document.getElementById(id)?.value) || 0;
    const chk = id => !!(document.getElementById(id)?.checked);

    const disciplina = g('reg-disciplina');
    if (!disciplina) {
      const $d = document.getElementById('reg-disciplina');
      if ($d) { $d.style.borderColor = 'var(--red)'; setTimeout(() => $d.style.borderColor = '', 2500); }
      return;
    }

    const tempoSecs = (() => {
      const disp = document.getElementById('reg-time-display')?.textContent || '';
      const parts = disp.split(':').map(Number);
      if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
      if (parts.length === 2) return parts[0]*60 + parts[1];
      return _regSeconds;
    })();

    const acertos = num('reg-acertos');
    const erros   = num('reg-erros');
    const teoria  = chk('reg-teoria');
    const revisao = chk('reg-revisao');

    const session = {
      id:          Utils.uid(),
      data:        _resolveDate(),
      disciplina,
      topico:      g('reg-topico'),
      material:    g('reg-material'),
      tempoSecs,
      acertos,
      erros,
      paginasIni:  num('reg-pag-ini'),
      paginasFim:  num('reg-pag-fim'),
      teoriaFin:   teoria,
      programarRev: revisao,
      comentarios: g('reg-comentarios'),
      categoria:   g('reg-categoria') || '',
      videoaulas:  (typeof _vids !== 'undefined' && Array.isArray(_vids))
                     ? _vids.filter(function(v){ return v.title||v.link; })
                            .map(function(v){ return {title:v.title,link:v.link,inicio:v.inicio,fim:v.fim,done:v.done}; })
                     : [],
      createdAt:   new Date().toISOString(),
    };

    // Save session (or update if editing)
    const sessions = _getSessions();
    if (_editingSessionId) {
      const idx = sessions.findIndex(s => s.id === _editingSessionId);
      if (idx >= 0) { sessions[idx] = { ...sessions[idx], ...session, id: _editingSessionId }; }
      else sessions.push(session);
      _editingSessionId = null;
    } else {
      sessions.push(session);
    }
    _saveSessions(sessions);

    // Teoria finalizada → mark topic as done in Edital
    const topicoRaw = g('reg-topico');
    let topicMeta = null;
    try { topicMeta = topicoRaw ? JSON.parse(topicoRaw) : null; } catch {}

    if (teoria && topicMeta?.discId != null && topicMeta?.idx != null) {
      const topKey  = topicMeta.discId + '_' + topicMeta.idx;
      const tdState = State.get('topicsDone') || {};
      tdState[topKey] = true;
      State.set('topicsDone', tdState);
      // Refresh edital view if open
      if (typeof EditalEngine !== 'undefined') {
        const ed = EditalEngine.getData();
        if (ed) EditalEngine.render();
      }
      // Update briefing topic visually
      const atopEl = document.getElementById('atopic-' + topKey);
      if (atopEl) {
        atopEl.classList.add('done');
        const chk = atopEl.querySelector('.agenda-topic-check');
        if (chk) chk.textContent = '✓';
      }
    }

    // Programar revisão → ReviewSystem proper queue
    if (revisao && disciplina) {
      const topTxt = topicMeta?.texto || session.topico || disciplina;
      if (typeof ReviewSystem !== 'undefined') {
        // Cria UMA única revisão começando no menor intervalo selecionado.
        // A progressão (1d → 7d → 15d → 30d) acontece conforme o usuário
        // clica nos botões de qualidade no kanban (SM-2 controla a escada).
        const days = (Array.isArray(_revDays) && _revDays.length) ? [..._revDays] : [1, 7, 15, 30];
        const first = days.sort((a, b) => a - b)[0] || 1;
        ReviewSystem.scheduleManual(
          'sess_' + session.id,
          topTxt,
          `${disciplina} · Revisão`,
          first
        );
      }
    }

    // Sync all modules after save
    if (typeof Briefing    !== 'undefined') Briefing.updateBadges();
    if (typeof Render      !== 'undefined') Render.dashboard();
    _activeDisc  = '';
    _activeTopic = '';
    const $ad = document.getElementById('timer-active-disc');
    if ($ad) { $ad.textContent=''; $ad.classList.remove('show'); }
    const $cb = document.getElementById('timer-cancel-btn');
    if ($cb) $cb.classList.remove('visible');

    // Sync all views after save
    if (typeof Render      !== 'undefined') Render.dashboard();
    if (typeof Briefing    !== 'undefined') Briefing.updateBadges();
    if (typeof ReviewSystem !== 'undefined') ReviewSystem._updateBadge ? ReviewSystem._updateBadge() : null;

    // Toast feedback
    _showSessionToast(disciplina, tempoSecs, acertos + erros);

    const saveNew = chk('reg-save-new');
    if (saveNew) {
      _openRegistroWithTime(0);
    } else {
      closeRegistro();
    }
  }

  function _showSessionToast(disc, secs, questoes) {
    const toast = document.createElement('div');
    toast.className = 'ob-toast';
    toast.innerHTML = `
      <span class="ob-toast-icon">✅</span>
      <div>
        <strong>${disc} · ${_fmtTime(secs)}</strong>
        <span>${questoes ? questoes + ' questões resolvidas' : 'Sessão registrada com sucesso!'}</span>
      </div>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 4000);
  }

  /* ══════════════════════════════════════════
     DASHBOARD ANALYTICS
  ══════════════════════════════════════════ */

  function renderDashboardSections() {
    _renderTopStats();
    _renderPainelTable();
    _renderStreak();
    _renderGoals();
    _renderWeeklyChart();
  }

  /* Top stat bar */
  function _renderTopStats() {
    const sessions = _getSessions();
    const totalSecs = sessions.reduce((a,s) => a + (s.tempoSecs||0), 0);
    const totalAc   = sessions.reduce((a,s) => a + (s.acertos||0), 0);
    const totalErr  = sessions.reduce((a,s) => a + (s.erros||0), 0);
    const totalQ    = totalAc + totalErr;
    const taxaAc    = totalQ ? Math.round((totalAc / totalQ) * 100) : 0;

    const profile   = Onboarding.getUserProfile();
    const dias      = profile?.concurso?.diasRestantes || 0;

    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);

    // Update existing stat cards
    const stats = [
      { label: 'TEMPO DE ESTUDO',     value: `${h}h${String(m).padStart(2,'0')}`, sub: 'total registrado', color: 'var(--blue)' },
      { label: 'DESEMPENHO',          value: taxaAc + '%',  sub: `${totalAc} acertos · ${totalErr} erros`, color: taxaAc >= 70 ? 'var(--green)' : taxaAc >= 50 ? 'var(--gold)' : 'var(--red)' },
      { label: 'QUESTÕES RESOLVIDAS', value: totalQ,        sub: 'total de questões', color: 'var(--gold)' },
      { label: 'DIAS PARA A PROVA',   value: dias || '—',   sub: profile?.concurso?.nome || 'Configure o concurso', color: 'var(--text-primary)' },
    ];
    const $cards = document.getElementById('dash-stats');
    if ($cards) {
      $cards.innerHTML = stats.map(s => `
        <div class="stat-card" style="--stat-color:${s.color}">
          <div style="font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">${s.label}</div>
          <div style="font-family:var(--font-display);font-size:30px;letter-spacing:1px;color:${s.color};line-height:1">${s.value}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-top:6px">${s.sub}</div>
        </div>`).join('');
    }
  }

  /* Discipline painel table */
  function _renderPainelTable() {
    const sessions = _getSessions();
    const $wrap    = document.getElementById('painel-table-wrap');
    if (!$wrap) return;

    if (!sessions.length) {
      $wrap.innerHTML = '<div class="painel-empty">Nenhum estudo registrado ainda. Use o cronômetro para registrar suas sessões!</div>';
      document.getElementById('painel-total-time').textContent = '';
      return;
    }

    // Aggregate by discipline
    const byDisc = {};
    sessions.forEach(s => {
      const d = s.disciplina || 'Outros';
      if (!byDisc[d]) byDisc[d] = { secs:0, acertos:0, erros:0, sessoes:0 };
      byDisc[d].secs    += s.tempoSecs || 0;
      byDisc[d].acertos += s.acertos   || 0;
      byDisc[d].erros   += s.erros     || 0;
      byDisc[d].sessoes++;
    });

    const totalSecs = sessions.reduce((a,s) => a + (s.tempoSecs||0), 0);
    const h = Math.floor(totalSecs/3600);
    const m = Math.floor((totalSecs%3600)/60);
    const $total = document.getElementById('painel-total-time');
    if ($total) $total.textContent = `Total: ${h}h${String(m).padStart(2,'0')}min`;

    const rows = Object.entries(byDisc)
      .sort((a,b) => b[1].secs - a[1].secs)
      .map(([disc, d]) => {
        const dh = Math.floor(d.secs/3600);
        const dm = Math.floor((d.secs%3600)/60);
        const total = d.acertos + d.erros;
        const pct   = total ? Math.round((d.acertos/total)*100) : null;
        const pctColor = pct === null ? 'var(--text-dim)' : pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--gold)' : 'var(--red)';
        const pctBg    = pct === null ? 'var(--surface-3)' : pct >= 70 ? 'rgba(46,204,113,0.15)' : pct >= 50 ? 'rgba(232,184,75,0.15)' : 'rgba(255,77,77,0.15)';
        return `
          <tr>
            <td class="td-disc">${disc}</td>
            <td class="td-time">${dh}h${String(dm).padStart(2,'0')}min</td>
            <td class="td-num" style="color:var(--green)">${d.acertos}</td>
            <td class="td-num" style="color:var(--red)">${d.erros}</td>
            <td class="td-num">${total || '—'}</td>
            <td class="td-pct">
              ${pct !== null
                ? `<span class="painel-pct-badge" style="color:${pctColor};background:${pctBg}">${pct}%</span>`
                : '<span style="color:var(--text-dim);font-size:11px">—</span>'}
            </td>
          </tr>`;
      }).join('');

    $wrap.innerHTML = `
      <table class="painel-table">
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Tempo</th>
            <th class="right">✓</th>
            <th class="right">✗</th>
            <th class="right">Total</th>
            <th class="right">%</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  /* Streak heatmap */
  let _streakData = null;

  function _buildStreakData() {
    const sessions = _getSessions();
    const byDate   = {};
    sessions.forEach(s => {
      if (!s.data) return;
      if (!byDate[s.data]) byDate[s.data] = 0;
      byDate[s.data] += s.tempoSecs || 0;
    });
    _streakData = byDate;
    return byDate;
  }

  function _renderStreak() {
    const byDate = _buildStreakData();
    const today  = new Date();
    const anchor = new Date(today);
    anchor.setDate(anchor.getDate() + _streakOffset * 7);

    // Show 12 weeks ending at anchor
    const weeks = 14;
    const endOfWeek = new Date(anchor);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

    const cells = [];
    for (let w = weeks - 1; w >= 0; w--) {
      const weekCells = [];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(endOfWeek);
        dt.setDate(dt.getDate() - w * 7 - (6 - d));
        const key = _localDateStr(dt);
        const secs = byDate[key] || 0;
        const level = secs >= 14400 ? 4 : secs >= 7200 ? 3 : secs >= 3600 ? 2 : secs > 0 ? 1 : 0;
        const isToday = key === _localDateStr(today);
        weekCells.push({ key, level, isToday, secs });
      }
      cells.push(weekCells);
    }

    const $grid = document.getElementById('streak-grid');
    if ($grid) {
      $grid.innerHTML = cells.map(col => `
        <div class="streak-col">
          ${col.map(c => `
            <div class="streak-cell level-${c.level} ${c.isToday ? 'today' : ''}"
                 title="${c.key}: ${c.secs ? Math.round(c.secs/60) + ' min' : 'sem estudo'}">
            </div>`).join('')}
        </div>`).join('');
    }

    // Streak count
    let streak = 0, record = 0, cur = 0;
    const d = new Date(today);
    while (true) {
      const k = _localDateStr(d);
      if (byDate[k]) { streak++; d.setDate(d.getDate()-1); } else break;
    }
    const allDates = Object.keys(byDate).sort();
    allDates.forEach(k => {
      const prev = new Date(k); prev.setDate(prev.getDate()-1);
      if (byDate[_localDateStr(prev)]) cur++; else cur = 1;
      record = Math.max(record, cur);
    });

    const $sc = document.getElementById('streak-count');
    const $sr = document.getElementById('streak-record');
    if ($sc) $sc.textContent = streak;
    if ($sr) $sr.textContent = `Recorde: ${record} dias`;

    // Range label
    const $range = document.getElementById('streak-range');
    if ($range) {
      const startW = new Date(endOfWeek); startW.setDate(startW.getDate() - (weeks-1)*7);
      const fmt = d => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
      $range.textContent = `${fmt(startW)} → ${fmt(endOfWeek)}`;
    }
  }

  function streakNav(dir) { _streakOffset += dir; _renderStreak(); }

  /* Goals panel */
  function _renderGoals() {
    const goals   = _getGoals();
    const sessions = _getSessions();
    const $grid   = document.getElementById('goals-grid');
    if (!$grid) return;

    // This week
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey   = _localDateStr(weekStart);

    const weekSessions = sessions.filter(s => s.data >= weekKey);
    const weekSecs  = weekSessions.reduce((a,s) => a + (s.tempoSecs||0), 0);
    const weekHoras = weekSecs / 3600;
    const weekQ     = weekSessions.reduce((a,s) => a + (s.acertos||0) + (s.erros||0), 0);

    const horasPct = Math.min(100, Math.round((weekHoras / goals.horasMeta) * 100));
    const quesPct  = Math.min(100, Math.round((weekQ    / goals.questoesMeta) * 100));

    $grid.innerHTML = `
      <div class="goal-item">
        <div class="goal-row">
          <span class="goal-label">⏱ Horas de Estudo</span>
          <span class="goal-value">${weekHoras.toFixed(1)}h / ${goals.horasMeta}h</span>
        </div>
        <div class="goal-track">
          <div class="goal-fill horas" style="width:${horasPct}%"></div>
        </div>
      </div>
      <div class="goal-item">
        <div class="goal-row">
          <span class="goal-label">📝 Questões Resolvidas</span>
          <span class="goal-value">${weekQ} / ${goals.questoesMeta}</span>
        </div>
        <div class="goal-track">
          <div class="goal-fill questoes" style="width:${quesPct}%"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px">
        <div class="goal-item">
          <div class="goal-row"><span class="goal-label" style="font-size:11px">Meta horas/semana</span></div>
          <input class="goal-target-input" type="number" value="${goals.horasMeta}" min="1" max="168"
                 onchange="StudyTimer.updateGoal('horasMeta',this.value)">
        </div>
        <div class="goal-item">
          <div class="goal-row"><span class="goal-label" style="font-size:11px">Meta questões/semana</span></div>
          <input class="goal-target-input" type="number" value="${goals.questoesMeta}" min="1" max="5000"
                 onchange="StudyTimer.updateGoal('questoesMeta',this.value)">
        </div>
      </div>`;
  }

  function updateGoal(key, val) {
    const goals = _getGoals();
    goals[key]  = parseFloat(val) || goals[key];
    _saveGoals(goals);
    _renderGoals();
  }
  function openGoalEditor() { /* inline editing via inputs in panel */ }

  /* Weekly bar chart */
  function setChartMode(m, btn) {
    _chartMode = m;
    document.querySelectorAll('.weekly-chart-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    _renderWeeklyChart();
  }

  function _renderWeeklyChart() {
    const sessions = _getSessions();
    const today    = new Date();
    const days     = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const $bars    = document.getElementById('weekly-bars');
    if (!$bars) return;

    // Last 7 days
    const week = Array.from({length:7}, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - (6 - i));
      return { key: _localDateStr(d), label: days[d.getDay()], isToday: i === 6 };
    });

    const data = week.map(w => {
      const daySess = sessions.filter(s => s.data === w.key);
      const secs    = daySess.reduce((a,s) => a + (s.tempoSecs||0), 0);
      const questoes = daySess.reduce((a,s) => a + (s.acertos||0) + (s.erros||0), 0);
      return { ...w, secs, horas: secs/3600, questoes };
    });

    const maxH = Math.max(...data.map(d => d.horas),   0.1);
    const maxQ = Math.max(...data.map(d => d.questoes), 1);

    $bars.innerHTML = data.map(d => {
      const isQ   = _chartMode === 'questoes';
      const val   = isQ ? d.questoes : d.horas;
      const max   = isQ ? maxQ : maxH;
      const pct   = Math.max(3, Math.round((val / max) * 100));
      const label = isQ ? (d.questoes || '—') : (d.horas > 0 ? d.horas.toFixed(1)+'h' : '—');
      return `
        <div class="weekly-bar-col">
          <div class="weekly-bar-val">${val > 0 ? label : ''}</div>
          <div class="weekly-bar-wrap">
            <div class="weekly-bar ${isQ ? 'questoes' : 'tempo'} ${d.isToday ? 'today' : ''}"
                 style="height:${pct}%"></div>
          </div>
          <div class="weekly-bar-label" style="${d.isToday ? 'color:var(--gold);font-weight:700' : ''}">${d.label}</div>
        </div>`;
    }).join('');
  }

  /* ── Init (called by App.init) ── */
  function init() {
    // Populate disciplines in registro if needed
    const $disc = document.getElementById('reg-disciplina');
    if ($disc && !$disc.options.length) {
      const discs = _getDisciplines();
      $disc.innerHTML = `<option value="">Selecione...</option>` +
        discs.map(d => `<option value="${d}">${d}</option>`).join('');
    }
    // Set today on date input
    const $dateInput = document.getElementById('reg-date-custom');
    if ($dateInput) {
      const d = new Date();
      $dateInput.value = _localDateStr(d);
    }
  }

  /* ── Editable time display ── */
  function onTimeInput(el) {
    // user types freely; normalized on blur
  }
  function onTimeBlur(el) {
    const raw = (el.textContent||'').replace(/[^0-9:]/g,'').trim();
    const parts = raw.split(':').map(Number);
    let h=0, m=0, s=0;
    if (parts.length === 3) { h=parts[0]||0; m=parts[1]||0; s=parts[2]||0; }
    else if (parts.length === 2) { m=parts[0]||0; s=parts[1]||0; }
    else { m=parts[0]||0; }
    m += Math.floor(s/60); s = s%60;
    h += Math.floor(m/60); m = m%60;
    const fmt = n => String(n).padStart(2,'0');
    el.textContent = fmt(h)+':'+fmt(m)+':'+fmt(s);
    _regSeconds = h*3600 + m*60 + s;
  }

  /* ── Toggle switch ── */
  function toggleCheck(inputId, labelId, cls) {
    const cb  = document.getElementById(inputId);
    const lbl = document.getElementById(labelId);
    if (!cb || !lbl) return;
    cb.checked = !cb.checked;
    if (cb.checked) lbl.classList.add(cls);
    else            lbl.classList.remove(cls);
    // Programar Revisão → mostrar/esconder chips de dias
    if (inputId === 'reg-revisao') {
      const wrap = document.getElementById('reg-rev-days-wrap');
      if (wrap) {
        wrap.classList.toggle('show', cb.checked);
        if (cb.checked) renderRevDayChips();
      }
    }
  }

  /* ── Programar Revisão · dias selecionados ── */
  let _revDays = [1, 7, 15, 30];
  function _resetRevDays() { _revDays = [1, 7, 15, 30]; }
  function renderRevDayChips() {
    const host = document.getElementById('reg-rev-days-chips');
    if (!host) return;
    const sorted = [..._revDays].sort((a, b) => a - b);
    host.innerHTML = sorted.map(d =>
      `<span class="reg-rev-day-chip" onclick="StudyTimer.toggleRevDay(${d})" title="Remover ${d}d">${d}d <span class="x">✕</span></span>`
    ).join('') +
    `<button type="button" class="reg-rev-day-add" onclick="StudyTimer.toggleRevDayCustom(true)" title="Adicionar dia personalizado">+</button>`;
  }
  function toggleRevDay(days) {
    days = parseInt(days) || 0;
    if (!days) return;
    const i = _revDays.indexOf(days);
    if (i >= 0) _revDays.splice(i, 1);
    else _revDays.push(days);
    renderRevDayChips();
  }
  function toggleRevDayCustom(show) {
    const wrap = document.getElementById('reg-rev-days-custom-wrap');
    if (!wrap) return;
    wrap.classList.toggle('show', !!show);
    if (show) {
      const inp = document.getElementById('reg-rev-days-custom');
      if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 50); }
    }
  }
  function addRevDayCustom() {
    const inp = document.getElementById('reg-rev-days-custom');
    const v = parseInt(inp?.value);
    if (!v || v < 1 || v > 365) {
      if (inp) { inp.style.borderColor = 'var(--red)'; setTimeout(() => inp.style.borderColor = '', 1500); }
      return;
    }
    if (!_revDays.includes(v)) _revDays.push(v);
    renderRevDayChips();
    toggleRevDayCustom(false);
  }

  /* ── Stepper +/- ── */
  function stepNum(id, delta) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = Math.max(0, (parseInt(el.value)||0) + delta);
    updateTaxa();
  }

  /* ── Live accuracy bar ── */
  function updateTaxa() {
    const ac  = parseInt(document.getElementById('reg-acertos')?.value)||0;
    const er  = parseInt(document.getElementById('reg-erros')?.value)||0;
    const tot = ac + er;
    const pct = tot ? Math.round(ac/tot*100) : 0;
    const bar = document.getElementById('reg-taxa-fill');
    const lbl = document.getElementById('reg-taxa-label');
    if (bar) bar.style.width = pct + '%';
    if (lbl) lbl.textContent = tot
      ? `${ac} acertos / ${tot} questões — taxa ${pct}%`
      : 'Nenhuma questão registrada';
  }

    /* ── Time Picker ── */
  let _tp = { h: 0, m: 0, s: 0 };

  function _tpRender() {
    const p2 = n => String(Math.max(0, n)).padStart(2,'0');
    const $h = document.getElementById('tp-h');
    const $m = document.getElementById('tp-m');
    const $s = document.getElementById('tp-s');
    if ($h) $h.textContent = p2(_tp.h);
    if ($m) $m.textContent = p2(_tp.m);
    if ($s) $s.textContent = p2(_tp.s);
  }

  function openTimePicker() {
    const disp = document.getElementById('reg-time-display')?.textContent || '00:00:00';
    const parts = disp.split(':').map(Number);
    _tp.h = parts[0] || 0;
    _tp.m = parts[1] || 0;
    _tp.s = parts[2] || 0;
    _tpRender();
    document.getElementById('reg-tp-overlay')?.classList.add('open');
  }

  function closeTimePicker() {
    document.getElementById('reg-tp-overlay')?.classList.remove('open');
  }

  function tpStep(unit, delta) {
    if (unit === 'h') {
      _tp.h = Math.max(0, Math.min(23, _tp.h + delta));
    } else if (unit === 'm') {
      _tp.m = (_tp.m + delta + 60) % 60;
    } else if (unit === 's') {
      _tp.s = (_tp.s + delta + 60) % 60;
    }
    _tpRender();
  }

  function tpSetTime(h, m) {
    _tp.h = h; _tp.m = m; _tp.s = 0;
    _tpRender();
  }

  function confirmTimePicker() {
    const p2 = n => String(n).padStart(2,'0');
    const timeStr = p2(_tp.h) + ':' + p2(_tp.m) + ':' + p2(_tp.s);
    const $disp = document.getElementById('reg-time-display');
    if ($disp) $disp.textContent = timeStr;
    _regSeconds = _tp.h * 3600 + _tp.m * 60 + _tp.s;
    closeTimePicker();
  }

  /* ─────────────────────────────────────────
     CATEGORIA — new field
  ───────────────────────────────────────── */
  let _customCats = [];
  function _loadCats() {
    try { _customCats = JSON.parse(localStorage.getItem('nexus_cats_v1') || '[]'); }
    catch(_) { _customCats = []; }
  }
  function _saveCats() {
    try { localStorage.setItem('nexus_cats_v1', JSON.stringify(_customCats)); } catch(_) {}
  }
  function _renderCatTags() {
    const $t = document.getElementById('reg-cat-tags');
    if (!$t) return;
    $t.innerHTML = _customCats.map(cat =>
      `<span class="reg-cat-tag" onclick="document.getElementById('reg-categoria').value='${cat.replace(/'/g,"\'")}'">` + cat + '</span>'
    ).join('');
  }
  function _populateCatSelect() {
    const $s = document.getElementById('reg-categoria');
    if (!$s) return;
    const existing = [...$s.options].map(o => o.value);
    _customCats.forEach(cat => {
      if (!existing.includes(cat)) {
        const o = document.createElement('option');
        o.value = cat; o.textContent = cat;
        $s.insertBefore(o, $s.querySelector('option[value="__nova__"]'));
      }
    });
  }
  function onCategoriaChange(sel) {
    const w = document.getElementById('reg-categoria-custom-wrap');
    if (!w) return;
    if (sel.value === '__nova__') {
      w.classList.add('show');
      document.getElementById('reg-categoria-custom').focus();
    } else {
      w.classList.remove('show');
    }
  }
  function saveCategoriaCustom() {
    const inp = document.getElementById('reg-categoria-custom');
    const val = inp ? inp.value.trim() : '';
    if (!val) return;
    _loadCats();
    if (!_customCats.includes(val)) { _customCats.push(val); _saveCats(); }
    _populateCatSelect();
    const $s = document.getElementById('reg-categoria');
    if ($s) $s.value = val;
    document.getElementById('reg-categoria-custom-wrap').classList.remove('show');
    if (inp) inp.value = '';
    _renderCatTags();
  }

  /* ─────────────────────────────────────────
     VIDEOAULAS — new field
  ───────────────────────────────────────── */
  let _vids = [];
  function addVideoItem() {
    const id = Date.now();
    _vids.push({ id, title:'', link:'', inicio:'00:00:00', fim:'00:00:00', done:false });
    _renderVids();
    setTimeout(function(){ var el=document.getElementById('vt-'+id); if(el) el.focus(); }, 50);
  }
  function toggleVideoItem(id) {
    const v = _vids.find(function(x){ return x.id===id; });
    if (v) { v.done = !v.done; _renderVids(); }
  }
  function removeVideoItem(id) {
    _vids = _vids.filter(function(x){ return x.id!==id; });
    _renderVids();
  }
  function updateVideoField(id, field, val) {
    const v = _vids.find(function(x){ return x.id===id; });
    if (v) v[field] = val;
  }
  function _renderVids() {
    const $l = document.getElementById('reg-video-list');
    if (!$l) return;
    $l.innerHTML = _vids.map(function(v) {
      return '<div class="reg-video-item" id="vi-'+v.id+'">' +
        '<div class="reg-video-fields">' +
          '<input class="reg-video-input" id="vt-'+v.id+'" placeholder="Título da aula..."' +
            ' value="' + (v.title||'').replace(/"/g,'&quot;') + '"' +
            ' oninput="StudyTimer.updateVideoField('+v.id+',\'title\',this.value)">' +
          '<div class="reg-video-row">' +
            '<input class="reg-video-input" placeholder="🔗 Link YouTube / Drive..."' +
              ' value="' + (v.link||'').replace(/"/g,'&quot;') + '"' +
              ' oninput="StudyTimer.updateVideoField('+v.id+',\'link\',this.value)">' +
            '<input class="reg-video-time" placeholder="Início" title="Início" value="' + (v.inicio||'') + '"' +
              ' oninput="StudyTimer.updateVideoField('+v.id+',\'inicio\',this.value)">' +
            '<input class="reg-video-time" placeholder="Fim" title="Fim" value="' + (v.fim||'') + '"' +
              ' oninput="StudyTimer.updateVideoField('+v.id+',\'fim\',this.value)">' +
          '</div>' +
        '</div>' +
        '<button class="reg-video-check' + (v.done?' done':'') + '"' +
          ' onclick="StudyTimer.toggleVideoItem('+v.id+')"' +
          ' title="' + (v.done?'Concluída':'Marcar concluída') + '">' + (v.done?'✓':'') + '</button>' +
        '<button class="reg-video-remove" onclick="StudyTimer.removeVideoItem('+v.id+')" title="Remover">✕</button>' +
      '</div>';
    }).join('');
  }


  /* ── syncTimer: called when tab becomes visible again ── */
  function syncTimer() {
    if (!_running || _startTs === 0) return;
    // Recalculate elapsed from real clock
    const nowSec = Math.floor((Date.now() - _startTs) / 1000);
    if (_mode === 'crono') {
      _elapsed = _elapsedAtPause + nowSec;
    } else {
      _elapsed = Math.max(0, _elapsedAtPause - nowSec);
      if (_elapsed <= 0) { _elapsed = 0; _onTimerDone(); return; }
    }
    _renderDigits();
    _updateProgress();
    _updateFabBadge();
  }


    return {
    init,
    // Timer
    openTimer, openPomodoro, openFullscreen, closeTimer, closeFullscreen, closeAndReset, minimize,
    startStudy, cancelTimer, onDiscChange, onTopicoChange,
    setMode, setDuration, togglePlay, stopTimer,
    alertToRegistro, dismissAlert,
    // Registro


    openTimePicker, closeTimePicker, tpStep, tpSetTime, confirmTimePicker,
    syncTimer,
    openRegistroEdit, openRegistroManual, closeRegistro,
    setRegDate, toggleDatePicker, _dpNav, _dpSelect, _dpClear, _dpGoToday,
    saveRegistro, onTimeInput, onTimeBlur, toggleCheck,
    toggleRevDay, addRevDayCustom, toggleRevDayCustom, renderRevDayChips,
    onCategoriaChange, saveCategoriaCustom, addVideoItem, toggleVideoItem, removeVideoItem, updateVideoField, stepNum, updateTaxa,
    // Dashboard
    renderDashboardSections,
    streakNav, setChartMode, updateGoal, openGoalEditor,
    // Internal flag
    _pendingElapsed: 0,
  };
})();

/* ════════════════════════════════════════════════════════
   EDITAL ENGINE — Configuração completa do edital
   Manual + Upload PDF + IA + Read view
════════════════════════════════════════════════════════ */
const EditalEngine = (() => {

  const KEY     = 'nexus_edital_v2';
  const API_KEY = 'nexus_api_key';

  const COLORS = [
    '#4D9FFF','#E8B84B','#2ECC71','#FF4D4D','#FF8C42',
    '#A78BFA','#F5CC6A','#00CEC9','#FD79A8','#6C5CE7',
  ];

  let _discs   = [];   // [{ id, nome, peso, cor, topicos: [{id,texto,heat}] }]
  let _turno   = 'integral';
  let _pdfData = null; // base64 PDF
  let _editing = false;

  /* ── Storage ── */
  function _get()    { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } }
  function _save(d)  { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
  function hasEdital(){ return !!_get(); }

  function saveApiKey(v) {
    if (v?.trim()) localStorage.setItem(API_KEY, v.trim());
    else localStorage.removeItem(API_KEY);
  }
  function _apiKey() {
    // Try localStorage first (set by ConfigPanel), then fallback to DOM field
    const stored = localStorage.getItem(API_KEY) || localStorage.getItem('nexus_api_key') || '';
    if (stored) return stored;
    // Try reading directly from the form field (if user typed but didn't save)
    const domKey = document.getElementById('ef-api-key')?.value?.trim() || '';
    if (domKey) { localStorage.setItem(API_KEY, domKey); return domKey; } // auto-save
    return '';
  }

  /* ── Legacy CFO-PMDF Built-in Edital (purged on render; kept only to identify old stored data) ── */
  const _CFO_PMDF_EDITAL = {
  "savedAt": "2026-04-25T00:00:00.000Z",
  "concurso": {
    "nome": "CFO PMDF 2026",
    "banca": "CEBRASPE",
    "situacao": "inscricoes",
    "dataProva": "2026-06-14",
    "diasRestantes": 50
  },
  "disponibilidade": {
    "horasPorDia": 5,
    "diasPorSemana": 7,
    "nivel": "avancado",
    "turno": "integral"
  },
  "objetivo": "Aprovação no CFO PMDF 2026 — QOPM Polícia Militar do Distrito Federal",
  "disciplinas": [
    {
      "id": "disc-01",
      "nome": "Língua Portuguesa",
      "peso": "alta",
      "cor": "#4D9FFF",
      "topicos": [
        {
          "id": "tp-01-01",
          "texto": "Compreensão e interpretação de textos de gêneros variados",
          "heat": 5
        },
        {
          "id": "tp-01-02",
          "texto": "Reconhecimento de tipos e gêneros textuais",
          "heat": 3
        },
        {
          "id": "tp-01-03",
          "texto": "Domínio da ortografia oficial",
          "heat": 3
        },
        {
          "id": "tp-01-04",
          "texto": "Domínio dos mecanismos de coesão textual",
          "heat": 4
        },
        {
          "id": "tp-01-05",
          "texto": "Emprego de elementos de referenciação, substituição, repetição e conectores",
          "heat": 4
        },
        {
          "id": "tp-01-06",
          "texto": "Emprego de tempos e modos verbais",
          "heat": 4
        },
        {
          "id": "tp-01-07",
          "texto": "Domínio da estrutura morfossintática do período",
          "heat": 5
        },
        {
          "id": "tp-01-08",
          "texto": "Emprego das classes de palavras",
          "heat": 4
        },
        {
          "id": "tp-01-09",
          "texto": "Relações de coordenação e subordinação entre orações",
          "heat": 4
        },
        {
          "id": "tp-01-10",
          "texto": "Emprego dos sinais de pontuação",
          "heat": 5
        },
        {
          "id": "tp-01-11",
          "texto": "Concordância verbal e nominal",
          "heat": 5
        },
        {
          "id": "tp-01-12",
          "texto": "Regência verbal e nominal",
          "heat": 5
        },
        {
          "id": "tp-01-13",
          "texto": "Emprego do sinal indicativo de crase",
          "heat": 5
        },
        {
          "id": "tp-01-14",
          "texto": "Colocação dos pronomes átonos (próclise, ênclise, mesóclise)",
          "heat": 5
        },
        {
          "id": "tp-01-15",
          "texto": "Reescrita de frases e parágrafos do texto",
          "heat": 4
        },
        {
          "id": "tp-01-16",
          "texto": "Significação das palavras",
          "heat": 3
        },
        {
          "id": "tp-01-17",
          "texto": "Substituição de palavras ou trechos de texto",
          "heat": 4
        },
        {
          "id": "tp-01-18",
          "texto": "Reorganização da estrutura de orações e períodos",
          "heat": 3
        },
        {
          "id": "tp-01-19",
          "texto": "Reescrita de textos de diferentes gêneros e formalidade",
          "heat": 3
        }
      ]
    },
    {
      "id": "disc-02",
      "nome": "Legislação PMDF",
      "peso": "alta",
      "cor": "#E8B84B",
      "topicos": [
        {
          "id": "tp-02-01",
          "texto": "Lei nº 7.289/1984 — Estatuto dos Policiais Militares do DF",
          "heat": 5
        },
        {
          "id": "tp-02-02",
          "texto": "Lei nº 12.086/2009 — Militares da PMDF e CBMDF (Título I)",
          "heat": 5
        },
        {
          "id": "tp-02-03",
          "texto": "Decreto nº 88.777/1983 — R-200 (regulamento para PMs e CBMs)",
          "heat": 4
        },
        {
          "id": "tp-02-04",
          "texto": "Decreto nº 10.443/2020 — Lei de Organização Básica da PMDF",
          "heat": 4
        },
        {
          "id": "tp-02-05",
          "texto": "LODF — art. 1º ao 30; art. 87 ao 99; art. 117-A ao 124-A",
          "heat": 5
        },
        {
          "id": "tp-02-06",
          "texto": "LODF — art. 200 ao 203; art. 263 ao 311",
          "heat": 4
        },
        {
          "id": "tp-02-07",
          "texto": "Lei nº 14.751/2023 — Lei Orgânica Nacional das PMs e CBMs",
          "heat": 4
        }
      ]
    },
    {
      "id": "disc-03",
      "nome": "DF e Política para Mulheres",
      "peso": "media",
      "cor": "#FD79A8",
      "topicos": [
        {
          "id": "tp-03-01",
          "texto": "Realidade étnica, social, histórica, geográfica, cultural, política e econômica do DF",
          "heat": 4
        },
        {
          "id": "tp-03-02",
          "texto": "RIDE — Região Integrada de Desenvolvimento (Lei Compl. 94/1998 + Dec. 7.469/2011)",
          "heat": 4
        },
        {
          "id": "tp-03-03",
          "texto": "Plano Distrital de Política para Mulheres (eixos e objetivos)",
          "heat": 3
        }
      ]
    },
    {
      "id": "disc-04",
      "nome": "Direitos Humanos",
      "peso": "alta",
      "cor": "#00CEC9",
      "topicos": [
        {
          "id": "tp-04-01",
          "texto": "Teoria geral dos direitos humanos — conceitos, terminologia, estrutura normativa, fundamentação",
          "heat": 5
        },
        {
          "id": "tp-04-02",
          "texto": "Afirmação histórica dos direitos humanos (gerações/dimensões de direitos)",
          "heat": 4
        },
        {
          "id": "tp-04-03",
          "texto": "Direitos humanos e responsabilidade do Estado",
          "heat": 4
        },
        {
          "id": "tp-04-04",
          "texto": "Direitos humanos na Constituição Federal",
          "heat": 5
        },
        {
          "id": "tp-04-05",
          "texto": "Política Nacional de DH — segurança pública e grupos vulneráveis (LGBTQIAPN+)",
          "heat": 4
        },
        {
          "id": "tp-04-06",
          "texto": "Constituição brasileira e tratados internacionais de DH (EC nº 45/2024)",
          "heat": 5
        },
        {
          "id": "tp-04-07",
          "texto": "Declaração Universal dos Direitos Humanos — artigos fundamentais",
          "heat": 5
        }
      ]
    },
    {
      "id": "disc-05",
      "nome": "Noções de Criminologia",
      "peso": "media",
      "cor": "#A78BFA",
      "topicos": [
        {
          "id": "tp-05-01",
          "texto": "Criminologia — conceito, métodos (empirismo e interdisciplinaridade)",
          "heat": 5
        },
        {
          "id": "tp-05-02",
          "texto": "Objetos da criminologia: delito, delinquente, vítima, controle social",
          "heat": 5
        },
        {
          "id": "tp-05-03",
          "texto": "Funções da criminologia — relação com política criminal e direito penal",
          "heat": 4
        },
        {
          "id": "tp-05-04",
          "texto": "Modelos teóricos — Escola Clássica, Positivista, Labeling, Anomia, Associação Diferencial",
          "heat": 5
        },
        {
          "id": "tp-05-05",
          "texto": "Teorias sociológicas da criminologia",
          "heat": 4
        },
        {
          "id": "tp-05-06",
          "texto": "Prevenção primária, secundária e terciária",
          "heat": 4
        },
        {
          "id": "tp-05-07",
          "texto": "Modelos de reação ao crime — controle social formal e informal",
          "heat": 3
        },
        {
          "id": "tp-05-08",
          "texto": "Criminologia ambiental",
          "heat": 3
        }
      ]
    },
    {
      "id": "disc-06",
      "nome": "Raciocínio Lógico",
      "peso": "media",
      "cor": "#FF8C42",
      "topicos": [
        {
          "id": "tp-06-01",
          "texto": "Lógica sentencial (proposicional) — proposições simples e compostas",
          "heat": 5
        },
        {
          "id": "tp-06-02",
          "texto": "Tabelas-verdade e equivalências",
          "heat": 5
        },
        {
          "id": "tp-06-03",
          "texto": "Leis de De Morgan",
          "heat": 5
        },
        {
          "id": "tp-06-04",
          "texto": "Diagramas lógicos",
          "heat": 5
        },
        {
          "id": "tp-06-05",
          "texto": "Lógica de argumentação — analogias, inferências, deduções e conclusões",
          "heat": 4
        },
        {
          "id": "tp-06-06",
          "texto": "Razões e proporções — regras de três simples e compostas, porcentagens",
          "heat": 4
        },
        {
          "id": "tp-06-07",
          "texto": "Funções e gráficos",
          "heat": 3
        },
        {
          "id": "tp-06-08",
          "texto": "Progressões aritméticas e geométricas",
          "heat": 3
        },
        {
          "id": "tp-06-09",
          "texto": "Sistemas lineares",
          "heat": 3
        },
        {
          "id": "tp-06-10",
          "texto": "Princípios de contagem e probabilidade",
          "heat": 3
        },
        {
          "id": "tp-06-11",
          "texto": "Raciocínio lógico — problemas aritméticos, geométricos e matriciais",
          "heat": 4
        },
        {
          "id": "tp-06-12",
          "texto": "Lógica de primeira ordem",
          "heat": 2
        },
        {
          "id": "tp-06-13",
          "texto": "Operações com conjuntos",
          "heat": 2
        }
      ]
    },
    {
      "id": "disc-07",
      "nome": "Língua Inglesa",
      "peso": "baixa",
      "cor": "#6C5CE7",
      "topicos": [
        {
          "id": "tp-07-01",
          "texto": "Compreensão de textos variados — ideias principais e secundárias, explícitas e implícitas",
          "heat": 5
        },
        {
          "id": "tp-07-02",
          "texto": "Domínio do vocabulário e estrutura da língua inglesa",
          "heat": 4
        },
        {
          "id": "tp-07-03",
          "texto": "Itens gramaticais relevantes para compreensão semântica",
          "heat": 3
        },
        {
          "id": "tp-07-04",
          "texto": "Relações intratextuais e intertextuais",
          "heat": 3
        },
        {
          "id": "tp-07-05",
          "texto": "Formas contemporâneas da linguagem inglesa",
          "heat": 2
        }
      ]
    },
    {
      "id": "disc-08",
      "nome": "Administração",
      "peso": "alta",
      "cor": "#2ECC71",
      "topicos": [
        {
          "id": "tp-08-01",
          "texto": "Abordagem clássica — Taylor (adm. científica), Fayol (funções e princípios)",
          "heat": 5
        },
        {
          "id": "tp-08-02",
          "texto": "Abordagem burocrática — Weber (tipos de dominação, burocracia)",
          "heat": 5
        },
        {
          "id": "tp-08-03",
          "texto": "Abordagem sistêmica da administração",
          "heat": 4
        },
        {
          "id": "tp-08-04",
          "texto": "Evolução da administração pública no Brasil pós-1930; reformas administrativas; nova gestão pública",
          "heat": 4
        },
        {
          "id": "tp-08-05",
          "texto": "Funções da administração — PODC (Planejamento, Organização, Direção, Controle)",
          "heat": 5
        },
        {
          "id": "tp-08-06",
          "texto": "Estrutura organizacional (tipos, níveis, modelos)",
          "heat": 4
        },
        {
          "id": "tp-08-07",
          "texto": "Cultura organizacional — conceitos de Schein",
          "heat": 4
        },
        {
          "id": "tp-08-08",
          "texto": "Gestão de pessoas — equilíbrio organizacional, objetivos, desafios",
          "heat": 4
        },
        {
          "id": "tp-08-09",
          "texto": "Comportamento organizacional — motivação (Maslow, Herzberg, McGregor, Vroom)",
          "heat": 5
        },
        {
          "id": "tp-08-10",
          "texto": "Liderança — estilos e teorias; desempenho individual e organizacional",
          "heat": 4
        },
        {
          "id": "tp-08-11",
          "texto": "Gestão da qualidade — principais teóricos (Deming, Juran, Crosby, Ishikawa)",
          "heat": 5
        },
        {
          "id": "tp-08-12",
          "texto": "Ciclo PDCA",
          "heat": 5
        },
        {
          "id": "tp-08-13",
          "texto": "Ferramentas de gestão da qualidade (Ishikawa, 5S, fluxograma, etc.)",
          "heat": 4
        },
        {
          "id": "tp-08-14",
          "texto": "Modelo do Gespública",
          "heat": 4
        },
        {
          "id": "tp-08-15",
          "texto": "Noções de gestão de processos — mapeamento, análise e melhoria",
          "heat": 3
        },
        {
          "id": "tp-08-16",
          "texto": "Noções de administração de recursos materiais",
          "heat": 3
        }
      ]
    },
    {
      "id": "disc-09",
      "nome": "Direito Constitucional",
      "peso": "alta",
      "cor": "#FF4D4D",
      "topicos": [
        {
          "id": "tp-09-01",
          "texto": "Princípios fundamentais da CF/88 (art. 1º ao 4º)",
          "heat": 5
        },
        {
          "id": "tp-09-02",
          "texto": "Direitos e deveres individuais e coletivos — art. 5º (todos os incisos)",
          "heat": 5
        },
        {
          "id": "tp-09-03",
          "texto": "Remédios constitucionais — HC, MS, MI, Habeas Data (pressupostos, cabimento)",
          "heat": 5
        },
        {
          "id": "tp-09-04",
          "texto": "Direitos sociais (art. 6º ao 11)",
          "heat": 4
        },
        {
          "id": "tp-09-05",
          "texto": "Nacionalidade, direitos políticos e partidos políticos",
          "heat": 3
        },
        {
          "id": "tp-09-06",
          "texto": "Organização político-administrativa — União, estados, DF, municípios",
          "heat": 4
        },
        {
          "id": "tp-09-07",
          "texto": "Intervenção federal e estado de sítio",
          "heat": 3
        },
        {
          "id": "tp-09-08",
          "texto": "Administração pública — art. 37 ao 41 (concurso, estabilidade, teto remuneratório)",
          "heat": 5
        },
        {
          "id": "tp-09-09",
          "texto": "Militares dos estados, DF e territórios (art. 42) — jurisprudência STF",
          "heat": 5
        },
        {
          "id": "tp-09-10",
          "texto": "Organização dos poderes — freios e contrapesos",
          "heat": 4
        },
        {
          "id": "tp-09-11",
          "texto": "Poder Legislativo — prerrogativas parlamentares",
          "heat": 3
        },
        {
          "id": "tp-09-12",
          "texto": "Conselho da República e Conselho de Defesa Nacional",
          "heat": 2
        },
        {
          "id": "tp-09-13",
          "texto": "Poder Judiciário — Justiça Militar da União e dos estados",
          "heat": 4
        },
        {
          "id": "tp-09-14",
          "texto": "Defesa do Estado e das instituições democráticas — segurança pública (art. 144)",
          "heat": 5
        },
        {
          "id": "tp-09-15",
          "texto": "Forças Armadas — missões, ativação, intervenção",
          "heat": 4
        },
        {
          "id": "tp-09-16",
          "texto": "Jurisprudência dos tribunais superiores aplicada ao concurso",
          "heat": 5
        },
        {
          "id": "tp-09-17",
          "texto": "Supremacia da CF, aplicabilidade e interpretação das normas constitucionais",
          "heat": 3
        }
      ]
    },
    {
      "id": "disc-10",
      "nome": "Direito Administrativo",
      "peso": "alta",
      "cor": "#F5CC6A",
      "topicos": [
        {
          "id": "tp-10-01",
          "texto": "Ato administrativo — conceito, requisitos (5), atributos (3), classificação e espécies",
          "heat": 5
        },
        {
          "id": "tp-10-02",
          "texto": "Extinção do ato administrativo — cassação, anulação, revogação e convalidação",
          "heat": 5
        },
        {
          "id": "tp-10-03",
          "texto": "Decadência administrativa",
          "heat": 3
        },
        {
          "id": "tp-10-04",
          "texto": "Poderes da administração — hierárquico, disciplinar, regulamentar e de polícia",
          "heat": 4
        },
        {
          "id": "tp-10-05",
          "texto": "Uso e abuso do poder",
          "heat": 4
        },
        {
          "id": "tp-10-06",
          "texto": "Regime jurídico-administrativo — princípios expressos e implícitos (LIMPE + proporcionalidade, etc.)",
          "heat": 5
        },
        {
          "id": "tp-10-07",
          "texto": "Responsabilidade civil do Estado — evolução, teorias objetiva/subjetiva, excludentes, regresso",
          "heat": 5
        },
        {
          "id": "tp-10-08",
          "texto": "Controle da administração — interno, judicial, legislativo",
          "heat": 4
        },
        {
          "id": "tp-10-09",
          "texto": "Improbidade administrativa — Lei nº 8.429/1992 (atos, sanções, alterações recentes)",
          "heat": 5
        },
        {
          "id": "tp-10-10",
          "texto": "Processo administrativo — Lei nº 9.784/1999 (princípios, fases, prazos)",
          "heat": 4
        },
        {
          "id": "tp-10-11",
          "texto": "Licitações — Lei nº 14.133/2021 (modalidades, fases, dispensa, inexigibilidade)",
          "heat": 4
        },
        {
          "id": "tp-10-12",
          "texto": "Contratos administrativos — Dec. 11.531/2023 e Portaria Conjunta MGI/MF/CGU nº 33/2023",
          "heat": 3
        },
        {
          "id": "tp-10-13",
          "texto": "Estado, governo e administração pública — conceitos e elementos",
          "heat": 3
        }
      ]
    },
    {
      "id": "disc-11",
      "nome": "Direito Penal",
      "peso": "alta",
      "cor": "#FF4D4D",
      "topicos": [
        {
          "id": "tp-11-01",
          "texto": "Princípios aplicáveis ao Direito Penal",
          "heat": 4
        },
        {
          "id": "tp-11-02",
          "texto": "Aplicação da lei penal no tempo e no espaço",
          "heat": 5
        },
        {
          "id": "tp-11-03",
          "texto": "Tempo e lugar do crime; interpretação e analogia",
          "heat": 4
        },
        {
          "id": "tp-11-04",
          "texto": "Irretroatividade da lei penal; conflito aparente de normas",
          "heat": 5
        },
        {
          "id": "tp-11-05",
          "texto": "Ilicitude — causas excludentes (legítima defesa, estado de necessidade, etc.)",
          "heat": 5
        },
        {
          "id": "tp-11-06",
          "texto": "Culpabilidade — elementos (imputabilidade, potencial consciência, exigibilidade)",
          "heat": 5
        },
        {
          "id": "tp-11-07",
          "texto": "Concurso de pessoas",
          "heat": 5
        },
        {
          "id": "tp-11-08",
          "texto": "Penas — espécies, cominação, substituição, regime",
          "heat": 5
        },
        {
          "id": "tp-11-09",
          "texto": "Ação penal (pública/privada, condicionada/incondicionada)",
          "heat": 4
        },
        {
          "id": "tp-11-10",
          "texto": "Punibilidade e causas de extinção",
          "heat": 4
        },
        {
          "id": "tp-11-11",
          "texto": "Prescrição — tabela, causas interruptivas e suspensivas",
          "heat": 5
        },
        {
          "id": "tp-11-12",
          "texto": "Crimes contra a fé pública",
          "heat": 3
        },
        {
          "id": "tp-11-13",
          "texto": "Crimes contra a administração pública (peculato, concussão, corrupção, prevaricação, etc.)",
          "heat": 5
        },
        {
          "id": "tp-11-14",
          "texto": "Crimes contra a pessoa (homicídio, lesão corporal — qualificadoras)",
          "heat": 4
        },
        {
          "id": "tp-11-15",
          "texto": "Crimes contra o patrimônio (furto, roubo, extorsão — formas qualificadas)",
          "heat": 4
        },
        {
          "id": "tp-11-16",
          "texto": "Crimes contra a dignidade sexual",
          "heat": 3
        },
        {
          "id": "tp-11-17",
          "texto": "Crimes contra a incolumidade pública",
          "heat": 3
        },
        {
          "id": "tp-11-18",
          "texto": "Lei nº 13.869/2019 — Abuso de Autoridade (tipos, penas)",
          "heat": 5
        },
        {
          "id": "tp-11-19",
          "texto": "Disposições constitucionais aplicáveis ao Direito Penal",
          "heat": 4
        },
        {
          "id": "tp-11-20",
          "texto": "Crimes e sanções penais na licitação (Lei 14.133/2021)",
          "heat": 3
        }
      ]
    },
    {
      "id": "disc-12",
      "nome": "Direito Processual Penal",
      "peso": "alta",
      "cor": "#4D9FFF",
      "topicos": [
        {
          "id": "tp-12-01",
          "texto": "Processo penal brasileiro e constitucional — sistemas e princípios fundamentais",
          "heat": 4
        },
        {
          "id": "tp-12-02",
          "texto": "Aplicação da lei processual penal no tempo, espaço e pessoas",
          "heat": 3
        },
        {
          "id": "tp-12-03",
          "texto": "Inquérito policial — características, dispensabilidade, arquivamento",
          "heat": 5
        },
        {
          "id": "tp-12-04",
          "texto": "Ação penal — tipos, condições, legitimidade",
          "heat": 5
        },
        {
          "id": "tp-12-05",
          "texto": "Prova — conceito, objeto, meios, ônus probatório, provas ilícitas",
          "heat": 5
        },
        {
          "id": "tp-12-06",
          "texto": "Sujeitos do processo (juiz, MP, acusado, defensor, assistente)",
          "heat": 4
        },
        {
          "id": "tp-12-07",
          "texto": "Prisão em flagrante — espécies, lavratura, comunicações",
          "heat": 5
        },
        {
          "id": "tp-12-08",
          "texto": "Prisão preventiva — pressupostos, fundamentos, momento",
          "heat": 5
        },
        {
          "id": "tp-12-09",
          "texto": "Prisão temporária (Lei 7.960/89) e liberdade provisória",
          "heat": 5
        },
        {
          "id": "tp-12-10",
          "texto": "Medidas cautelares diversas da prisão",
          "heat": 4
        },
        {
          "id": "tp-12-11",
          "texto": "Prazos — características, princípios e contagem",
          "heat": 3
        },
        {
          "id": "tp-12-12",
          "texto": "Nulidades — absolutas vs relativas, princípios",
          "heat": 5
        },
        {
          "id": "tp-12-13",
          "texto": "Jurisprudência dos tribunais superiores (STF/STJ) aplicada ao DPP",
          "heat": 5
        }
      ]
    },
    {
      "id": "disc-13",
      "nome": "Leg. Penal e Proc. Penal Extravagante",
      "peso": "alta",
      "cor": "#FF8C42",
      "topicos": [
        {
          "id": "tp-13-01",
          "texto": "Lei nº 2.889/1956 — Crime de genocídio",
          "heat": 2
        },
        {
          "id": "tp-13-02",
          "texto": "Lei nº 7.716/1989 — Crimes de preconceito de raça ou cor (racismo)",
          "heat": 3
        },
        {
          "id": "tp-13-03",
          "texto": "Lei nº 8.072/1990 — Crimes hediondos (lista, inafiançabilidade, cumprimento de pena)",
          "heat": 5
        },
        {
          "id": "tp-13-04",
          "texto": "Lei nº 12.850/2013 — Crime organizado (conceito, meios especiais de investigação)",
          "heat": 5
        },
        {
          "id": "tp-13-05",
          "texto": "Lei nº 9.455/1997 — Crimes de tortura",
          "heat": 4
        },
        {
          "id": "tp-13-06",
          "texto": "Lei nº 9.605/1998 — Crimes contra o meio ambiente",
          "heat": 2
        },
        {
          "id": "tp-13-07",
          "texto": "Lei nº 10.826/2003 — Estatuto do Desarmamento",
          "heat": 3
        },
        {
          "id": "tp-13-08",
          "texto": "Lei nº 11.343/2006 — Lei de Drogas (traficante vs usuário, causas de diminuição)",
          "heat": 5
        },
        {
          "id": "tp-13-09",
          "texto": "Lei nº 11.340/2006 — Lei Maria da Penha (formas de violência, medidas protetivas)",
          "heat": 5
        },
        {
          "id": "tp-13-10",
          "texto": "Lei nº 9.503/1997 — CTB (Capítulos I, II, VIII, XVII e XIX)",
          "heat": 3
        },
        {
          "id": "tp-13-11",
          "texto": "Lei nº 8.069/1990 — ECA (Parte Geral Títulos I e II; Parte Especial Títulos III, VI e VII)",
          "heat": 4
        },
        {
          "id": "tp-13-12",
          "texto": "Lei nº 8.429/1992 — Improbidade Administrativa (atos, sanções, alterações)",
          "heat": 5
        },
        {
          "id": "tp-13-13",
          "texto": "Lei nº 13.869/2019 — Abuso de Autoridade",
          "heat": 5
        },
        {
          "id": "tp-13-14",
          "texto": "Lei nº 7.960/1989 — Prisão Temporária",
          "heat": 4
        },
        {
          "id": "tp-13-15",
          "texto": "Lei nº 9.099/1995 — Juizados Especiais Criminais",
          "heat": 4
        },
        {
          "id": "tp-13-16",
          "texto": "Lei nº 10.259/2001 — Juizados Especiais na Justiça Federal",
          "heat": 3
        }
      ]
    },
    {
      "id": "disc-14",
      "nome": "Direito Penal Militar",
      "peso": "alta",
      "cor": "#E8B84B",
      "topicos": [
        {
          "id": "tp-14-01",
          "texto": "Aplicação da lei penal militar (extraterritorialidade, lugar e tempo do crime)",
          "heat": 5
        },
        {
          "id": "tp-14-02",
          "texto": "Crime militar — conceito; crimes própria e impropriamente militares (critérios)",
          "heat": 5
        },
        {
          "id": "tp-14-03",
          "texto": "Imputabilidade penal militar (diferenças com o CP)",
          "heat": 4
        },
        {
          "id": "tp-14-04",
          "texto": "Concurso de agentes no âmbito militar",
          "heat": 4
        },
        {
          "id": "tp-14-05",
          "texto": "Penas militares — espécies (morte, reclusão, detenção, prisão, suspensão, reforma)",
          "heat": 5
        },
        {
          "id": "tp-14-06",
          "texto": "Aplicação da pena — critérios, atenuantes e agravantes militares",
          "heat": 4
        },
        {
          "id": "tp-14-07",
          "texto": "Suspensão condicional da pena e livramento condicional",
          "heat": 3
        },
        {
          "id": "tp-14-08",
          "texto": "Penas acessórias e efeitos da condenação",
          "heat": 3
        },
        {
          "id": "tp-14-09",
          "texto": "Medidas de segurança no DPM",
          "heat": 2
        },
        {
          "id": "tp-14-10",
          "texto": "Ação penal militar",
          "heat": 4
        },
        {
          "id": "tp-14-11",
          "texto": "Extinção da punibilidade militar",
          "heat": 4
        },
        {
          "id": "tp-14-12",
          "texto": "Crimes militares em tempo de paz (Parte Especial do CPM — crimes mais cobrados)",
          "heat": 5
        },
        {
          "id": "tp-14-13",
          "texto": "Princípios constitucionais penais com reflexos na lei penal militar",
          "heat": 4
        }
      ]
    },
    {
      "id": "disc-15",
      "nome": "Direito Processual Penal Militar",
      "peso": "alta",
      "cor": "#2ECC71",
      "topicos": [
        {
          "id": "tp-15-01",
          "texto": "Processo penal militar — aplicação, abrangência e fontes",
          "heat": 4
        },
        {
          "id": "tp-15-02",
          "texto": "Polícia Judiciária Militar — quem exerce, atribuições",
          "heat": 5
        },
        {
          "id": "tp-15-03",
          "texto": "Inquérito Policial Militar (IPM) — procedimento, diferenças do IP, características",
          "heat": 5
        },
        {
          "id": "tp-15-04",
          "texto": "Ação penal militar e seu exercício",
          "heat": 4
        },
        {
          "id": "tp-15-05",
          "texto": "Processo — fases (denúncia, instrução, sentença)",
          "heat": 4
        },
        {
          "id": "tp-15-06",
          "texto": "Justiça Militar da União — Lei 8.457/1992 (organização, competência)",
          "heat": 5
        },
        {
          "id": "tp-15-07",
          "texto": "Defensoria Pública da União junto à JMU",
          "heat": 2
        },
        {
          "id": "tp-15-08",
          "texto": "Prisão em flagrante militar — espécies e procedimento",
          "heat": 5
        },
        {
          "id": "tp-15-09",
          "texto": "Prisão preventiva militar e liberdade provisória",
          "heat": 5
        },
        {
          "id": "tp-15-10",
          "texto": "Atos probatórios — interrogatório, confissão, perícias, testemunhas, acareação, reconhecimento, documentos, indícios",
          "heat": 4
        },
        {
          "id": "tp-15-11",
          "texto": "Processos em espécie — processo ordinário, deserção de oficial e praça, insubmissão",
          "heat": 4
        },
        {
          "id": "tp-15-12",
          "texto": "Nulidades no DPPM",
          "heat": 4
        },
        {
          "id": "tp-15-13",
          "texto": "Recursos — recurso em sentido estrito, apelação, embargos, revisão, rec. extraordinário",
          "heat": 4
        },
        {
          "id": "tp-15-14",
          "texto": "Execução — incidentes, suspensão condicional, livramento condicional, indulto",
          "heat": 3
        },
        {
          "id": "tp-15-15",
          "texto": "Princípios constitucionais processuais com reflexos na lei processual penal militar",
          "heat": 4
        },
        {
          "id": "tp-15-16",
          "texto": "Questões prejudiciais, exceções e incidentes (sanidade mental, falsidade de documento)",
          "heat": 2
        },
        {
          "id": "tp-15-17",
          "texto": "Medidas preventivas e assecuratórias — providências sobre coisas e pessoas",
          "heat": 3
        }
      ]
    }
  ]
};

  /* ── Remove old built-in edital if it still exists ── */
  function _purgeLegacyBuiltIn() {
    try {
      const data = _get();
      const isLegacyBuiltIn =
        data?.savedAt === _CFO_PMDF_EDITAL.savedAt ||
        (String(data?.concurso?.nome || '') === 'CFO PMDF 2026' && String(data?.concurso?.banca || '') === 'CEBRASPE');
      if (isLegacyBuiltIn) {
        localStorage.removeItem(KEY);
        if (localStorage.getItem('nexus_onboarding_profile')) {
          const ob = JSON.parse(localStorage.getItem('nexus_onboarding_profile') || '{}');
          if (/CFO\s*PMDF/i.test(String(ob?.concurso?.nome || '') + ' ' + String(ob?.objetivo || ''))) {
            localStorage.removeItem('nexus_onboarding_profile');
          }
        }
        if (typeof State !== 'undefined') {
          State.merge('config', { examName: '', examBoard: '', examDate: null, totalDays: 0, startDate: '' });
        }
        _discs = [];
      }
    } catch {}
  }

  /* ── Public: render (called by Render.curriculum) ── */
  function render() {
    _purgeLegacyBuiltIn();
    const data = _get();
    const $empty  = document.getElementById('edital-empty');
    const $form   = document.getElementById('edital-form-view');
    const $conf   = document.getElementById('edital-configured-view');

    if (_editing) {
      $empty?.style && ($empty.style.display = 'none');
      $form?.classList.add('active');
      $conf?.style && ($conf.style.display = 'none');
      return;
    }

    if (!data) {
      $empty?.style && ($empty.style.display = 'flex');
      $form?.classList.remove('active');
      $conf?.style && ($conf.style.display = 'none');
      _updateViewMeta(false);
    } else {
      $empty?.style && ($empty.style.display = 'none');
      $form?.classList.remove('active');
      $conf?.style && ($conf.style.display = 'block');
      _renderConfiguredView(data);
      _updateViewMeta(true, data);
    }
  }

  function _updateViewMeta(configured, data) {
    const $badge = document.getElementById('edital-view-badge');
    const $title = document.getElementById('edital-view-title');
    if (configured && data) {
      $badge && ($badge.style.display = 'inline-flex') && ($badge.textContent = 'CONFIGURADO');
      $title && ($title.textContent   = data.concurso?.nome || 'Edital');
    } else {
      $badge && ($badge.style.display = 'none');
      $title && ($title.textContent   = 'Edital & Configuração');
    }
  }

  /* ── Open form ── */
  function openForm() {
    _editing  = true;
    const data = _get();

    // Pre-fill from existing data or onboarding
    const profile = Onboarding.getUserProfile();

    // Concurso fields
    const nome = data?.concurso?.nome || profile?.concurso?.nome || '';
    const _sf  = (id, v) => { const e = document.getElementById(id); if (e && v) e.value = v; };
    _sf('ef-exam-nome',   nome);
    _sf('ef-banca',       data?.concurso?.banca   || profile?.concurso?.banca   || '');
    _sf('ef-situacao',    data?.concurso?.situacao || profile?.concurso?.situacao|| 'pos-edital');
    _sf('ef-data-prova',  data?.concurso?.dataProva|| profile?.concurso?.dataProva|| '');
    _sf('ef-objetivo',    data?.objetivo           || profile?.objetivo           || 'aprovacao');
    _sf('ef-horas',       data?.disponibilidade?.horasPorDia   || profile?.disponibilidade?.horasPorDia   || 4);
    _sf('ef-dias-semana', data?.disponibilidade?.diasPorSemana || profile?.disponibilidade?.diasPorSemana || 5);
    _sf('ef-nivel',       data?.disponibilidade?.nivel         || profile?.perfil?.nivel                  || 'intermediario');

    // Turno
    _turno = data?.disponibilidade?.turno || profile?.disponibilidade?.turno || 'integral';
    document.querySelectorAll('.ef-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.val === _turno);
    });

    // API key
    const $key = document.getElementById('ef-api-key');
    if ($key) $key.value = _apiKey();

    // Disciplines
    if (data?.disciplinas?.length) {
      _discs = JSON.parse(JSON.stringify(data.disciplinas));
    } else if (profile?.disciplinas?.length) {
      _discs = profile.disciplinas.map((d, i) => ({
        id: 'disc_' + i, nome: d.name, peso: d.peso || 'media',
        cor: COLORS[i % COLORS.length], topicos: [],
      }));
    } else {
      _discs = [];
    }

    calcDays();
    _renderDiscCards();
    render();
  }

  function cancelForm() {
    _editing = false;
    _pdfData = null;
    render();
  }

  /* ── Days calc ── */
  function calcDays() {
    const $d = document.getElementById('ef-data-prova');
    const $p = document.getElementById('ef-days-preview');
    if (!$d || !$p) return;
    const val = $d.value;
    if (!val) { $p.textContent = ''; return; }
    const diff = Math.ceil((new Date(val + 'T12:00:00') - new Date().setHours(0,0,0,0)) / 86400000);
    $p.textContent = diff >= 0 ? `📅 ${diff} dias restantes` : '⚠️ Data no passado';
  }

  /* ── Turno chip ── */
  function selectTurno(el) {
    document.querySelectorAll('.ef-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    _turno = el.dataset.val;
  }

  /* ── PDF select ── */
  function onPdfSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const $btn  = document.getElementById('ef-ai-btn');
    const $name = document.getElementById('ef-pdf-filename');
    if ($name) { $name.textContent = `📄 ${file.name}`; $name.style.display = 'block'; }
    const reader = new FileReader();
    reader.onload = ev => {
      _pdfData = ev.target.result.split(',')[1];
      if ($btn) $btn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  /* ── AI PDF extraction ── */
  async function extractFromPDF() {
    const key = _apiKey();
    if (!key) { alert('Informe sua chave da API Anthropic.'); return; }
    if (!_pdfData) { alert('Selecione um PDF do edital primeiro.'); return; }

    const $btn    = document.getElementById('ef-ai-btn');
    const $status = document.getElementById('ef-ai-status');
    if ($btn) $btn.disabled = true;

    // Pega contexto do concurso/banca já preenchidos no formulário
    const bancaCtx = document.getElementById('ef-banca')?.value || '';
    const nomeCtx  = document.getElementById('ef-exam-nome')?.value.trim() || '';

    // ── PASSO 1: Extrair disciplinas + tópicos do PDF ──
    _setStatus('🤖 Passo 1/2 — Lendo o edital e extraindo disciplinas...', 'loading');

    try {
      const resp1 = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: [
              { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: _pdfData } },
              { type: 'text', text:
                `Analise este edital de concurso público e extraia as disciplinas com seus tópicos exatos conforme constam no edital.
${nomeCtx ? 'Concurso: ' + nomeCtx : ''}${bancaCtx ? ' | Banca: ' + bancaCtx : ''}

Retorne SOMENTE JSON valido (sem markdown, sem explicacoes):
{"banca":"nome da banca detectada","concurso":"nome do concurso","disciplinas":[{"nome":"string","peso":"alta|media|baixa","questoes":N,"topicos":["topico exato conforme edital"]}]}

Regras:
- peso alta: maior numero de questoes ou coeficiente maior no edital
- peso media: disciplinas intermediarias
- peso baixa: poucas questoes ou peso menor
- questoes: numero de questoes se informado no edital, caso contrario 0
- topicos: copie os topicos EXATOS do edital, maximo 20 por disciplina
- Se nao encontrar estrutura clara, use as disciplinas mais comuns para este tipo de concurso` }
            ],
          }],
        }),
      });

      if (!resp1.ok) {
        let _e1msg = 'Erro API ' + resp1.status;
        try { const _e1b = await resp1.json(); _e1msg = _e1b?.error?.message || _e1msg;
          if (resp1.status === 401) _e1msg = 'Chave inválida — verifique em Configurações → IA';
          if (resp1.status === 400) _e1msg = 'Erro 400 — verifique: ' + (_e1b?.error?.message || 'modelo inválido ou requisição malformada');
        } catch(_) {}
        throw new Error(_e1msg);
      }
      const d1   = await resp1.json();
      const t1   = (d1.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
      const p1   = _parseRobust(t1);

      if (!Array.isArray(p1?.disciplinas) || !p1.disciplinas.length) {
        throw new Error('Não foi possível extrair disciplinas do PDF');
      }

      // Auto-preenche banca/concurso se detectados
      if (p1.banca && !bancaCtx) { const $b = document.getElementById('ef-banca'); if ($b) { [...$b.options].forEach(o => { if (o.text.toLowerCase().includes(p1.banca.toLowerCase().slice(0,6))) $b.value = o.value; }); } }
      if (p1.concurso && !nomeCtx) { const $n = document.getElementById('ef-exam-nome'); if ($n) $n.value = p1.concurso; }

      const bancaFinal = p1.banca || bancaCtx || 'banca desconhecida';
      const nDiscs     = p1.disciplinas.length;
      const discNames  = p1.disciplinas.map(d => d.nome).join(', ');

      // ── PASSO 2: Análise de prioridade por tópico (heat levels) ──
      _setStatus(`🧠 Passo 2/2 — Analisando prioridade de ${nDiscs} disciplinas com base nos padrões da ${bancaFinal}...`, 'loading');

      const topicsList = p1.disciplinas.map(d =>
        d.nome + ': ' + (d.topicos || []).slice(0,20).join(' | ')
      ).join('\n');

      const resp2 = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 5000,
          messages: [{
            role: 'user',
            content: `Voce e especialista em concursos publicos brasileiros e conhece profundamente os padroes historicos de cobranca da banca ${bancaFinal}.

Concurso: ${nomeCtx || p1.concurso || 'nao informado'}
Banca: ${bancaFinal}

Para cada topico abaixo, atribua um nivel de prioridade de 1 a 5 baseado em:
- Frequencia historica de cobranca pela ${bancaFinal}
- Peso no edital deste concurso
- Relevancia para o cargo/perfil

Niveis:
5 = CRITICO (cai em quase toda prova, literalidade, prazos, conceitos exatos)
4 = ALTO (cobrado frequentemente, alto risco de aparecer)
3 = MEDIO (cobrado moderadamente, revisar com atencao)
2 = NORMAL (aparece mas nao e prioridade maxima)
1 = BAIXO (raramente cobrado ou de menor impacto na nota)

Disciplinas e topicos:
${topicsList}

Retorne SOMENTE JSON valido (sem markdown):
{"disciplinas":[{"nome":"nome exato da disciplina","topicos":[{"texto":"topico exato","heat":N,"motivo":"motivo em ate 40 chars"}]}]}

IMPORTANTE: mantenha o texto dos topicos IDENTICO ao da entrada. Atribua heat de forma rigorosa e diferenciada — nao coloque todos como 3.`
          }],
        }),
      });

      if (!resp2.ok) {
        let _e2msg = 'Erro API análise ' + resp2.status;
        try { const _e2b = await resp2.json(); _e2msg = _e2b?.error?.message || _e2msg; } catch(_) {}
        throw new Error(_e2msg);
      }
      const d2 = await resp2.json();
      const t2 = (d2.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
      const p2 = _parseRobust(t2);

      // ── Merge: combina dados do PDF (passo 1) com heat levels (passo 2) ──
      const heatMap = {};
      if (p2?.disciplinas) {
        p2.disciplinas.forEach(d => {
          heatMap[d.nome] = {};
          (d.topicos || []).forEach(t => { heatMap[d.nome][t.texto] = { heat: t.heat || 3, motivo: t.motivo || '' }; });
        });
      }

      const newDiscs = p1.disciplinas.map((d, i) => {
        const discHeatData = heatMap[d.nome] || {};
        const topicos = (d.topicos || []).map((texto, ti) => {
          const hData = discHeatData[texto] || {};
          // Fallback: assign heat by proximity if exact match fails
          const heat = hData.heat || _fallbackHeat(texto, d.peso) ;
          return { id: 'top_' + Date.now() + '_' + i + '_' + ti, texto, heat, motivo: hData.motivo || '' };
        });
        // Sort by heat desc within each discipline
        topicos.sort((a, b) => b.heat - a.heat);
        return {
          id:      'disc_ai_' + Date.now() + '_' + i,
          nome:    d.nome,
          peso:    d.peso || 'media',
          cor:     COLORS[(i + _discs.length) % COLORS.length],
          questoes: d.questoes || 0,
          topicos,
        };
      });

      _discs = [..._discs, ...newDiscs];
      _renderDiscCards();

      // ── Painel de resultado ──
      const totalTopics  = newDiscs.reduce((s, d) => s + d.topicos.length, 0);
      const criticos     = newDiscs.reduce((s, d) => s + d.topicos.filter(t => t.heat === 5).length, 0);
      const altos        = newDiscs.reduce((s, d) => s + d.topicos.filter(t => t.heat === 4).length, 0);
      const medios       = newDiscs.reduce((s, d) => s + d.topicos.filter(t => t.heat === 3).length, 0);
      const normais      = newDiscs.reduce((s, d) => s + d.topicos.filter(t => t.heat <= 2).length, 0);

      _setStatus(
        `✅ <strong>${newDiscs.length} disciplinas</strong> · <strong>${totalTopics} tópicos</strong> extraídos e priorizados pela IA` +
        `<div class="ef-heat-result-bar">` +
        `<span class="ef-hrb-item" style="color:var(--red)"     title="Tópicos que caem em quase toda prova">🔥🔥🔥 Crítico<strong>${criticos} tópicos</strong></span>` +
        `<span class="ef-hrb-item" style="color:var(--orange)"  title="Cobrados com alta frequência">🔥🔥 Alto<strong>${altos} tópicos</strong></span>` +
        `<span class="ef-hrb-item" style="color:var(--gold)"    title="Cobrados moderadamente">🔶 Médio<strong>${medios} tópicos</strong></span>` +
        `<span class="ef-hrb-item" style="color:var(--blue)"    title="Menor frequência de cobrança">📘 Normal/Baixo<strong>${normais} tópicos</strong></span>` +
        `</div>` +
        `<div class="ef-heat-result-progress">` +
        (criticos ? `<div class="ef-hrp-seg" style="width:${Math.round(criticos/totalTopics*100)}%;background:var(--red)"    title="Crítico: ${criticos}"></div>` : '') +
        (altos    ? `<div class="ef-hrp-seg" style="width:${Math.round(altos/totalTopics*100)}%;background:var(--orange)"  title="Alto: ${altos}"></div>`    : '') +
        (medios   ? `<div class="ef-hrp-seg" style="width:${Math.round(medios/totalTopics*100)}%;background:var(--gold)"    title="Médio: ${medios}"></div>`   : '') +
        (normais  ? `<div class="ef-hrp-seg" style="width:${Math.round(normais/totalTopics*100)}%;background:var(--blue)"   title="Normal/Baixo: ${normais}"></div>` : '') +
        `</div>` +
        `<div class="ef-hrb-tip">💡 Tópicos ordenados do mais crítico ao menos cobrado. Passe o mouse em qualquer tópico para ver o motivo da classificação. Ajuste manualmente clicando nos botões 1–5.</div>`,
        'success'
      );

      if ($btn) $btn.disabled = false;

    } catch (err) {
      console.error('[EditalEngine.extractFromPDF]', err);
      _setStatus('❌ Erro: ' + err.message + '. Verifique sua chave de API e tente novamente.', 'error');
      if ($btn) $btn.disabled = false;
    }
  }

  /* ── Fallback heat por peso da disciplina e palavras-chave ── */
  function _fallbackHeat(texto, peso) {
    const t = texto.toLowerCase();
    if (t.includes('prazo') || t.includes('art.') || t.includes('lei ') || t.includes('constitui')) return 5;
    if (t.includes('princip') || t.includes('conceito') || t.includes('classifica')) return 4;
    if (peso === 'alta') return 4;
    if (peso === 'media') return 3;
    return 2;
  }

  /* ── Robust JSON parser ── */
  function _parseRobust(raw) {
    if (!raw) return null;
    let s = raw.replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
    const st = s.indexOf('{'), en = s.lastIndexOf('}');
    if (st !== -1 && en > st) s = s.slice(st, en + 1);
    s = s.replace(/,(\s*[}\]])/g,'$1').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'');
    try { return JSON.parse(s); } catch(_) { return null; }
  }

  /* ── Status helper ── */
  function _setStatus(html, type) {
    const $s = document.getElementById('ef-ai-status');
    if (!$s) return;
    $s.innerHTML = html;
    $s.className = 'ef-ai-status show';
    if (type === 'error')   $s.style.cssText = 'background:rgba(255,77,77,0.1);border-color:rgba(255,77,77,0.3);color:var(--red)';
    else if (type==='success') $s.style.cssText = 'background:rgba(46,204,113,0.08);border-color:rgba(46,204,113,0.25);color:var(--text-primary)';
    else $s.style.cssText = '';
  }

  /* ── Add discipline manually ── */
  function addDisc() {
    const $n = document.getElementById('ef-disc-nome');
    const $p = document.getElementById('ef-disc-peso');
    const nome = $n?.value.trim();
    if (!nome) { $n?.focus(); return; }

    _discs.push({
      id:     'disc_' + Date.now(),
      nome,
      peso:   $p?.value || 'media',
      cor:    COLORS[_discs.length % COLORS.length],
      topicos: [],
    });
    if ($n) $n.value = '';
    $n?.focus();
    _renderDiscCards();
  }

  function removeDisc(id) {
    _discs = _discs.filter(d => d.id !== id);
    _renderDiscCards();
  }

  function changeDiscColor(id, cor) {
    const d = _discs.find(d => d.id === id);
    if (d) d.cor = cor;
    _renderDiscCards();
  }

  function addTopic(discId) {
    const $i = document.getElementById(`ef-topic-input-${discId}`);
    const txt = $i?.value.trim();
    if (!txt) { $i?.focus(); return; }
    const d = _discs.find(d => d.id === discId);
    if (d) {
      d.topicos.push({ id: 'top_' + Date.now(), texto: txt, heat: 3 });
      if ($i) $i.value = '';
      _renderDiscTopics(discId);
    }
  }

  function removeTopic(discId, topicId) {
    const d = _discs.find(d => d.id === discId);
    if (d) { d.topicos = d.topicos.filter(t => t.id !== topicId); _renderDiscTopics(discId); }
  }

  function setTopicHeat(discId, topicId, heat) {
    const d = _discs.find(d => d.id === discId);
    const t = d?.topicos.find(t => t.id === topicId);
    if (t) { t.heat = heat; _renderDiscTopics(discId); }
  }

  function toggleDiscTopics(id) {
    const $t = document.getElementById(`ef-disc-topics-${id}`);
    if ($t) $t.classList.toggle('open');
  }

  /* ── Render discipline cards (form) ── */
  function _renderDiscCards() {
    const $c = document.getElementById('ef-disc-cards');
    if (!$c) return;
    if (!_discs.length) {
      $c.innerHTML = `<div style="font-size:12px;color:var(--text-dim);text-align:center;padding:20px;font-style:italic">Nenhuma disciplina adicionada ainda.</div>`;
      return;
    }
    const pesoLabels = { alta:'🔥 Alta', media:'⚡ Média', baixa:'📘 Baixa' };
    $c.innerHTML = _discs.map(d => `
      <div class="ef-disc-card" id="ef-disc-card-${d.id}">
        <div class="ef-disc-card-header">
          <div class="ef-disc-color-dot" style="background:${d.cor}"></div>
          <div class="ef-disc-card-name">${d.nome}</div>
          <div class="ef-disc-card-meta">${d.topicos.length} tópico${d.topicos.length !== 1 ? 's' : ''}</div>
          <span class="ef-disc-peso-badge ef-peso-${d.peso}">${pesoLabels[d.peso]}</span>
          <div class="ef-disc-actions">
            <button class="ef-disc-act-btn toggle" onclick="EditalEngine.toggleDiscTopics('${d.id}')" title="Tópicos">▾</button>
            <button class="ef-disc-act-btn del"    onclick="EditalEngine.removeDisc('${d.id}')"        title="Remover">✕</button>
          </div>
        </div>
        <!-- Color picker row -->
        <div style="padding:0 14px 8px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border-subtle)">
          <span style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px">Cor:</span>
          <div class="ef-color-row">
            ${COLORS.map(c => `
              <div class="ef-color-dot-btn ${c===d.cor?'selected':''}"
                   style="background:${c}" onclick="EditalEngine.changeDiscColor('${d.id}','${c}')"></div>`).join('')}
          </div>
        </div>
        <!-- Topics -->
        <div class="ef-disc-topics" id="ef-disc-topics-${d.id}">
          <div class="ef-topics-header">
            <span class="ef-topics-label">Tópicos (${d.topicos.length})</span>
          </div>
          <div class="ef-topics-list" id="ef-topics-list-${d.id}">
            ${_buildTopicsHTML(d)}
          </div>
          <div class="ef-add-topic-row">
            <input class="ef-add-topic-input" id="ef-topic-input-${d.id}"
                   placeholder="Adicionar tópico..." autocomplete="off"
                   onkeydown="if(event.key==='Enter'){EditalEngine.addTopic('${d.id}');event.preventDefault()}">
            <button class="ef-add-topic-btn" onclick="EditalEngine.addTopic('${d.id}')">+ Add</button>
          </div>
        </div>
      </div>`).join('');
  }

  function _renderDiscTopics(discId) {
    const $l = document.getElementById(`ef-topics-list-${discId}`);
    const d  = _discs.find(d => d.id === discId);
    if ($l && d) $l.innerHTML = _buildTopicsHTML(d);
  }

  function _buildTopicsHTML(d) {
    if (!d.topicos.length) return `<div class="ef-disc-empty-topics">Nenhum tópico. Adicione abaixo.</div>`;

    const heatColors  = {1:'var(--blue)',2:'var(--green)',3:'var(--gold)',4:'var(--orange)',5:'var(--red)'};
    const heatEmoji   = {1:'📘',2:'☑️',3:'🔶',4:'🔥🔥',5:'🔥🔥🔥'};
    const heatLabel   = {1:'Baixo',2:'Normal',3:'Médio',4:'Alto',5:'Crítico'};

    return d.topicos.map(t => {
      const hc    = heatColors[t.heat] || 'var(--gold)';
      const emoji = heatEmoji[t.heat]  || '🔶';
      const lbl   = heatLabel[t.heat]  || 'Médio';
      const bg    = t.heat === 5 ? 'rgba(255,77,77,0.06)' : t.heat === 4 ? 'rgba(255,140,66,0.05)' : 'transparent';
      return `
      <div class="ef-topic-item" style="background:${bg};border-radius:6px;" title="${t.motivo ? '📌 ' + t.motivo : ''}">
        <div class="ef-topic-heat-badge" style="color:${hc};font-size:10px;font-weight:800;width:68px;flex-shrink:0;white-space:nowrap;">${emoji} ${lbl}</div>
        <span class="ef-topic-text" style="flex:1">${t.texto}</span>
        <div class="ef-topic-heat">
          ${[1,2,3,4,5].map(h => `
            <button class="ef-topic-heat-btn ${t.heat===h?'active':''}"
                    style="${t.heat===h?`background:${heatColors[h]}22;color:${heatColors[h]};border:1px solid ${heatColors[h]}55`:''}"
                    onclick="EditalEngine.setTopicHeat('${d.id}','${t.id}',${h})"
                    title="${heatLabel[h]}">${h}</button>`).join('')}
        </div>
        <button class="ef-topic-del" onclick="EditalEngine.removeTopic('${d.id}','${t.id}')">✕</button>
      </div>`;
    }).join('');
  }

  /* ── Save edital ── */
  function saveEdital() {
    const g = id => document.getElementById(id)?.value.trim() || '';
    const nome = g('ef-exam-nome');
    if (!nome) {
      const $el = document.getElementById('ef-exam-nome');
      if ($el) { $el.style.borderColor = 'var(--red)'; $el.focus(); setTimeout(() => $el.style.borderColor = '', 2500); }
      return;
    }

    const dataProva = g('ef-data-prova');
    const diasRest  = dataProva
      ? Math.max(0, Math.ceil((new Date(dataProva + 'T12:00:00') - new Date().setHours(0,0,0,0)) / 86400000))
      : 60;

    const edital = {
      savedAt: new Date().toISOString(),
      concurso: {
        nome,
        banca:    g('ef-banca'),
        situacao: g('ef-situacao'),
        dataProva: dataProva || null,
        diasRestantes: diasRest,
      },
      disponibilidade: {
        horasPorDia:   parseFloat(g('ef-horas'))    || 4,
        diasPorSemana: parseInt(g('ef-dias-semana'))|| 5,
        nivel:         g('ef-nivel'),
        turno:         _turno,
      },
      objetivo: g('ef-objetivo'),
      disciplinas: _discs,
    };

    _save(edital);

    // Sync with State.config so countdown and dashboard work
    State.merge('config', {
      examName:  nome,
      examBoard: edital.concurso.banca,
      examDate:  dataProva || null,
      totalDays: diasRest,
      startDate: _localDateStr(),
    });

    // Also sync onboarding profile for backward compat
    const obProfile = {
      meta: { createdAt: new Date().toISOString(), version: '1.1' },
      concurso: edital.concurso,
      disponibilidade: edital.disponibilidade,
      perfil: { nivel: edital.disponibilidade.nivel },
      disciplinas: _discs.map(d => ({ name: d.nome, peso: d.peso })),
      pontosFracos: [],
      objetivo: edital.objetivo,
    };
    try { localStorage.setItem('nexus_onboarding_profile', JSON.stringify(obProfile)); } catch {}

    _editing = false;
    render();
    Render.dashboard();

    // Toast
    const toast = document.createElement('div');
    toast.className = 'ob-toast';
    toast.innerHTML = `<span class="ob-toast-icon">✅</span><div><strong>Edital salvo!</strong><span>${_discs.length} disciplinas configuradas · ${diasRest} dias para a prova</span></div>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 4000);
  }

  /* ── Clear edital ── */
  function clearEdital() {
    if (!confirm('Apagar a configuração do edital?')) return;
    localStorage.removeItem(KEY);
    _discs   = [];
    _editing = false;
    render();
    Render.dashboard();
  }

  /* ── Configured read view ── */
  /* ════ Subject icon mapping ════ */
  function _getDiscIcon(nome) {
    const n = (nome || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if (n.includes('penal militar') || n.includes('direito penal milit')) return '⚔️';
    if (n.includes('processual penal milit') || n.includes('processo penal milit')) return '🎖️';
    if (n.includes('processual penal') || n.includes('processo penal'))     return '🔍';
    if (n.includes('penal'))                    return '⚖️';
    if (n.includes('constitucional'))           return '🏛️';
    if (n.includes('administrativo'))           return '🏢';
    if (n.includes('processual civil') || n.includes('processo civil')) return '📋';
    if (n.includes('civil'))                    return '📜';
    if (n.includes('trabalhista') || n.includes('trabalho')) return '👷';
    if (n.includes('tributari') || n.includes('tributario')) return '💰';
    if (n.includes('financeiro') || n.includes('economia')) return '📊';
    if (n.includes('portugues') || n.includes('lingua port') || n.includes('redacao')) return '✍️';
    if (n.includes('ingles') || n.includes('lingua ingl'))  return '🌐';
    if (n.includes('espanhol'))                 return '🇪🇸';
    if (n.includes('matematica') || n.includes('calculo'))  return '🔢';
    if (n.includes('raciocinio') || n.includes('logica') || n.includes('logico')) return '🧮';
    if (n.includes('informatica') || n.includes('tecnologia') || n.includes('computacao')) return '💻';
    if (n.includes('direitos humanos') || n.includes('direito humano')) return '🤝';
    if (n.includes('criminolog'))               return '🔎';
    if (n.includes('legislacao') || n.includes('legislacao pertinente')) return '📖';
    if (n.includes('contabilidade') || n.includes('contabil')) return '🧾';
    if (n.includes('administracao') || n.includes('gestao'))   return '📈';
    if (n.includes('historia'))                 return '🏺';
    if (n.includes('geografia'))                return '🌍';
    if (n.includes('fisica'))                   return '⚡';
    if (n.includes('quimica'))                  return '🧪';
    if (n.includes('biologia'))                 return '🧬';
    if (n.includes('medicina') || n.includes('saude')) return '🏥';
    if (n.includes('seguranca publica') || n.includes('seguranca'))     return '🛡️';
    if (n.includes('ambiental') || n.includes('meio ambiente'))         return '🌿';
    if (n.includes('estatistica'))              return '📉';
    if (n.includes('engenharia') || n.includes('arquitetura'))          return '🏗️';
    if (n.includes('militar'))                  return '🎖️';
    if (n.includes('policial') || n.includes('policia'))                return '👮';
    if (n.includes('direito'))                  return '⚖️';
    return '📚';
  }

  /* ════ Filter state ════ */
  const _filters = { heat: 'all', status: 'all', peso: 'all', sort: 'heat', disc: 'all' };
  let _sideSearch = '';
  const HEAT_C     = { 5:'var(--red)', 4:'var(--orange)', 3:'var(--gold)', 2:'var(--green)', 1:'var(--blue)' };
  const HEAT_BG    = { 5:'rgba(255,77,77,0.12)', 4:'rgba(255,140,66,0.12)', 3:'rgba(232,184,75,0.12)', 2:'rgba(46,204,113,0.1)', 1:'rgba(77,159,255,0.1)' };
  const HEAT_EMOJI = { 5:'🔥', 4:'🔶', 3:'◆', 2:'▪', 1:'·' };
  const HEAT_LABEL = { 5:'Crítico', 4:'Alto', 3:'Médio', 2:'Normal', 1:'Baixo' };

  function setFilter(type, val, btn) {
    _filters[type] = val;
    // Update active chip in group
    if (btn) {
      const group = document.querySelectorAll(`[data-filter="${type}"]`);
      group.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    applyFilters();
  }

  function applyFilters() {
    const tab = document.querySelector('.edcv-tab.active')?.dataset?.tab || 'blocos';
    if (tab === 'topicos') _renderTopicos(_get());
    else _renderBlocosView(_get());
  }

  function setSideSearch(v) {
    _sideSearch = (v || '').toLowerCase();
    _renderSidebar(_get());
  }

  function setDiscFilter(discId) {
    _filters.disc = discId || 'all';
    applyFilters();
  }

  function _renderSidebar(data) {
    const $list = document.getElementById('ed-side-list');
    const $count = document.getElementById('ed-side-count');
    if (!$list || !data?.disciplinas) return;
    const topicsDone = State.get('topicsDone') || {};
    const discs = data.disciplinas || [];
    if ($count) $count.textContent = discs.length;

    const totalTopics = discs.reduce((s,d)=>s+(d.topicos||[]).length,0);
    const totalDone = discs.reduce((s,d)=>s+(d.topicos||[]).filter((_,ti)=>topicsDone[d.id+'_'+ti]).length,0);

    let rows = `<button class="cad-subj-row all ${_filters.disc==='all'?'active':''}" onclick="EditalEngine.setDiscFilter('all')">
      <div class="cad-subj-ico">📚</div>
      <div class="cad-subj-info"><div class="cad-subj-name">Todas as disciplinas</div>
        <div class="cad-subj-meta">${totalDone}/${totalTopics} tópicos concluídos</div></div>
      <span class="cad-subj-n">${totalTopics}</span>
    </button>`;

    const filtered = discs.filter(d => !_sideSearch || d.nome.toLowerCase().includes(_sideSearch));
    if (!filtered.length) {
      rows += `<div class="cad-subj-empty">Nenhuma disciplina encontrada.</div>`;
    } else {
      rows += filtered.map(d => {
        const tot = (d.topicos||[]).length;
        const done = (d.topicos||[]).filter((_,ti)=>topicsDone[d.id+'_'+ti]).length;
        const color = _discColor(d.nome, d.cor);
        const ico = _getDiscIcon(d.nome);
        const active = _filters.disc === d.id;
        return `<button class="cad-subj-row ${active?'active':''}" style="--subj-c:${color}" onclick="EditalEngine.setDiscFilter('${d.id}')">
          <div class="cad-subj-ico" style="background:${color}15;border-color:${color}30">${ico}</div>
          <div class="cad-subj-info">
            <div class="cad-subj-name">${d.nome}</div>
            <div class="cad-subj-meta">${done}/${tot} • ${d.peso==='alta'?'🔥 Alta':d.peso==='baixa'?'📘 Baixa':'⚡ Média'}</div>
          </div>
          <span class="cad-subj-n">${tot}</span>
        </button>`;
      }).join('');
    }
    $list.innerHTML = rows;
  }

  function _renderActiveFilter(data) {
    const $bar = document.getElementById('ed-active-filter');
    const $tag = document.getElementById('ed-bc-tag');
    if (!$bar || !$tag) return;
    if (_filters.disc === 'all') { $bar.style.display = 'none'; return; }
    const d = (data?.disciplinas||[]).find(x => x.id === _filters.disc);
    if (!d) { $bar.style.display = 'none'; return; }
    const color = _discColor(d.nome, d.cor);
    $bar.style.display = 'flex';
    $bar.style.setProperty('--subj-c', color);
    $tag.style.setProperty('--subj-c', color);
    $tag.innerHTML = `${_getDiscIcon(d.nome)} ${d.nome}`;
  }

  /* ════ Main render (configured view) ════ */
  function _renderConfiguredView(data) {
    if (!data) return;

    const nome  = data.concurso?.nome  || 'Edital';
    const banca = data.concurso?.banca || '';
    const $title = document.getElementById('edital-conf-title');
    if ($title) $title.textContent = (nome || 'EDITAL COMPLETO').toUpperCase();
    const $eyebrow = document.getElementById('edital-hero-eyebrow');
    if ($eyebrow) $eyebrow.textContent = `FERRAMENTA · ${banca ? banca.toUpperCase() + ' · ' : ''}MAPA DE ESTUDO`;
    const $band = document.getElementById('edital-info-band');
    if ($band) {
      const parts = [
        data.concurso?.diasRestantes != null && `📅 ${data.concurso.diasRestantes} dias para a prova`,
        data.disponibilidade?.horasPorDia && `⏰ ${data.disponibilidade.horasPorDia}h por dia`,
        data.disciplinas?.length && `📚 ${data.disciplinas.length} disciplinas`,
        data.objetivo && `🎯 ${({aprovacao:'Aprovação','alta-colocacao':'Alta colocação',top10:'Top 10'})[data.objetivo]||data.objetivo}`,
      ].filter(Boolean);
      $band.textContent = parts.length ? parts.join(' · ') : 'Disciplinas, tópicos e prioridades do seu edital. Estude com inteligência.';
    }

    // ── Stats bar ──
    _renderStatsBar(data);

    // ── Tab guard (don't recreate if exists) ──
    if (!document.getElementById('ed-view-toggle-wrap')) {
      // tabs already in HTML
    }

    // ── Default: render BLOCOS ──
    _renderBlocosView(data);
  }

  function _renderStatsBar(data) {
    const $bar = document.getElementById('edcv-stats-bar');
    if (!$bar || !data?.disciplinas?.length) return;
    const topicsDone = State.get('topicsDone') || {};
    const all = data.disciplinas.flatMap(d => d.topicos || []);
    const doneCount = data.disciplinas.reduce((s,d) => s + (d.topicos||[]).filter((_,ti) => topicsDone[d.id+'_'+ti]).length, 0);
    const totalTopics = all.length;
    const pct = totalTopics ? Math.round(doneCount/totalTopics*100) : 0;
    const criticos = all.filter(t => t.heat === 5).length;
    const doneCrit = data.disciplinas.reduce((s,d) => s + (d.topicos||[]).filter((t,ti) => t.heat===5 && topicsDone[d.id+'_'+ti]).length, 0);

    const progressColor = pct>=70 ? 'var(--green)' : pct>=40 ? 'var(--gold)' : 'var(--red)';
    const stats = [
      { ico:'📚', val: data.disciplinas.length, lbl: 'DISCIPLINAS', sub: `${totalTopics} tópicos no total`, color: 'var(--gold)', pct: 100 },
      { ico:'✅', val: `${doneCount}/${totalTopics}`, lbl: 'CONCLUÍDOS', sub: `${pct}% do edital coberto`, color: progressColor, pct },
      { ico:'🔥', val: criticos, lbl: 'CRÍTICOS', sub: `${doneCrit} já dominados`, color: 'var(--red)', pct: totalTopics?Math.round(criticos/totalTopics*100):0 },
      { ico:'🎯', val: `${doneCrit}/${criticos||0}`, lbl: 'CRÍTICOS FEITOS', sub: criticos?'Foco máximo aqui':'Sem críticos definidos', color: 'var(--orange)', pct: criticos?Math.round(doneCrit/Math.max(1,criticos)*100):0 },
    ];
    $bar.innerHTML = stats.map(s =>
      `<div class="cad-stat" style="--stat-c:${s.color}">
        <div class="cad-stat-top">
          <span class="cad-stat-ico">${s.ico}</span>
          <span class="cad-stat-lbl">${s.lbl}</span>
        </div>
        <div class="cad-stat-val">${s.val}</div>
        <div class="cad-stat-sub">${s.sub}</div>
        <div class="cad-stat-bar"><div class="cad-stat-fill" style="width:${s.pct}%"></div></div>
      </div>`
    ).join('');
  }

  /* ════ POR TÓPICOS — premium ════ */
  function _renderTopicos(data) {
    const $list = document.getElementById('curriculum-list');
    if (!$list || !data) return;
    const topicsDone = State.get('topicsDone') || {};
    const search = (document.getElementById('edcv-search')?.value || '').toLowerCase();
    const { heat, status, peso, sort } = _filters;

    // Filter + sort disciplines
    let discs = (data.disciplinas || []).filter(d => (peso === 'all' || d.peso === peso) && (_filters.disc === 'all' || d.id === _filters.disc));

    // Apply sort at discipline level
    if (sort === 'heat') discs = [...discs].sort((a,b) => {
      const avgH = d => (d.topicos||[]).reduce((s,t)=>s+(t.heat||3),0) / Math.max(1,(d.topicos||[]).length);
      return avgH(b) - avgH(a);
    });
    else if (sort === 'alpha') discs = [...discs].sort((a,b) => a.nome.localeCompare(b.nome));
    else if (sort === 'progress') discs = [...discs].sort((a,b) => {
      const pct = d => { const t=(d.topicos||[]); return t.length ? (d.topicos||[]).filter((_,ti)=>topicsDone[d.id+'_'+ti]).length/t.length : 0; };
      return pct(a) - pct(b);
    });

    let html = '';
    let totalVisible = 0;

    discs.forEach(d => {
      const topics = (d.topicos || []).filter(t => {
        if (heat !== 'all' && t.heat !== parseInt(heat)) return false;
        if (status === 'pending') { const k=d.id+'_'+(d.topicos||[]).indexOf(t); if (topicsDone[k]) return false; }
        if (status === 'done')    { const k=d.id+'_'+(d.topicos||[]).indexOf(t); if (!topicsDone[k]) return false; }
        if (search && !t.texto.toLowerCase().includes(search) && !d.nome.toLowerCase().includes(search)) return false;
        return true;
      });

      if (!topics.length) return;
      totalVisible += topics.length;

      const done  = (d.topicos||[]).filter((_,ti) => topicsDone[`${d.id}_${ti}`]).length;
      const total = (d.topicos||[]).length;
      const pct   = total ? Math.round(done/total*100) : 0;
      const color = _discColor(d.nome, d.cor);

      const discIcon = _getDiscIcon(d.nome);

      const topicsHTML = topics.map((t, _) => {
        const realIdx = (d.topicos||[]).indexOf(t);
        const tk = `${d.id}_${realIdx}`;
        const isDone  = !!topicsDone[tk];
        const hc      = HEAT_C[t.heat]    || 'var(--border-strong)';
        const hlbl    = HEAT_LABEL[t.heat] || '';
        const isMarked = typeof ReviewSystem !== 'undefined' && ReviewSystem.isMarked('topic', tk);
        const badgeStyle = t.heat === 5 ? 'color:rgba(255,100,100,0.75);border-color:rgba(255,77,77,0.15);background:rgba(255,77,77,0.06)'
          : t.heat === 4 ? 'color:rgba(255,150,80,0.75);border-color:rgba(255,140,66,0.15);background:rgba(255,140,66,0.05)'
          : t.heat === 3 ? 'color:rgba(210,170,60,0.75);border-color:rgba(232,184,75,0.15);background:rgba(232,184,75,0.05)'
          : t.heat === 2 ? 'color:rgba(60,180,100,0.7);border-color:rgba(46,204,113,0.12);background:rgba(46,204,113,0.04)'
          : 'color:rgba(80,140,220,0.7);border-color:rgba(77,159,255,0.12);background:rgba(77,159,255,0.04)';
        return `
          <div class="edcv-topic-item ${isDone?'done':''}" style="--heat-c:${hc}"
               onclick="EditalEngine.toggleTopicEd('${d.id}',${realIdx},this)">
            <div class="edcv-topic-check">${isDone?'✓':''}</div>
            <div class="edcv-topic-text" title="${t.motivo||''}">${t.texto}</div>
            <div class="edcv-topic-actions">
              <button class="edcv-topic-btn study" onclick="event.stopPropagation();StudyTimer.startStudy('${d.nome.replace(/'/g,'&#39;')}','${t.texto.slice(0,50).replace(/'/g,'&#39;')}')" title="Estudar agora">▶</button>
              <button class="edcv-topic-btn rev" onclick="event.stopPropagation();ReviewSystem.toggleMark('topic','${tk}','${t.texto.replace(/'/g,'&#39;')}','${d.nome.replace(/'/g,'&#39;')}',this)" title="${isMarked?'Remover':'Revisão'}">🔁</button>
            </div>
            ${hlbl ? '<div class="edcv-topic-heat-badge" style="' + badgeStyle + '">' + hlbl + '</div>' : ''}
          </div>`;
      }).join('');

      html += `
        <div class="edcv-disc-card" id="edcvcard-${d.id}">
          <div class="edcv-disc-header" onclick="document.getElementById('edcvcard-${d.id}').classList.toggle('open')">
            <div class="edcv-disc-color-stripe" style="background:${color}"></div>
            <div class="edcv-disc-icon" style="background:${color}12;border-color:${color}25;margin-left:6px">
              ${discIcon}
            </div>
            <div class="edcv-disc-info">
              <div class="edcv-disc-name">${d.nome}</div>
              <div class="edcv-disc-sub">
                <span class="edcv-disc-sub-item">${topics.length} tópico${topics.length!==1?'s':''}</span>
                <span class="edcv-disc-sub-item">·</span>
                <span class="edcv-disc-sub-item">${done}/${total} concluídos</span>
              </div>
            </div>
            <div class="edcv-disc-right">
              <div class="edcv-disc-pct">${pct}%</div>
              <span class="edcv-disc-peso ${d.peso||'media'}">${d.peso==='alta'?'Alta':d.peso==='baixa'?'Baixa':'Média'}</span>
              <span class="edcv-disc-chevron">▾</span>
            </div>
          </div>
          <div class="edcv-disc-progress-track">
            <div class="edcv-disc-progress-fill" style="width:${pct}%;background:${color}"></div>
          </div>
          <div class="edcv-topics-wrap">${topicsHTML}</div>
        </div>`;
    });

    if (!html) {
      $list.innerHTML = `<div class="edcv-empty-filter">Nenhum tópico encontrado com os filtros aplicados.<br><br><button onclick="EditalEngine.resetFilters()" style="padding:8px 18px;background:var(--gold-a15);border:1px solid var(--gold);border-radius:8px;color:var(--gold);cursor:pointer;font-size:12px;">Limpar filtros</button></div>`;
    } else {
      $list.innerHTML = html;
    }
  }

  function toggleTopicEd(discId, topicIndex, elTarget) {
    const key  = discId + '_' + topicIndex;
    const done = State.get('topicsDone') || {};
    done[key]  = !done[key];
    State.set('topicsDone', done);
    const card = elTarget.closest
      ? (elTarget.closest('.edcv-topic-item') || elTarget.closest('.edcv-bloco-topic'))
      : elTarget;
    if (card) {
      const isDone = !!done[key];
      card.classList.toggle('done', isDone);
      if (isDone) {
        card.classList.remove('flash-done');
        // force reflow to restart animation
        void card.offsetWidth;
        card.classList.add('flash-done');
      }
      const chk = card.querySelector('.edcv-topic-check, .edcv-bt-check');
      if (chk) chk.textContent = isDone ? '✓' : '';
    }
    _renderStatsBar(_get());
    if (typeof Render !== 'undefined') Render.dashboard();
  }

  function resetFilters() {
    Object.keys(_filters).forEach(k => _filters[k] = k === 'sort' ? 'heat' : 'all');
    document.querySelectorAll('.edcv-filter-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.val === 'all' || (c.dataset.filter === 'sort' && c.dataset.val === 'heat'));
    });
    const $s = document.getElementById('edcv-search'); if ($s) $s.value = '';
    applyFilters();
  }

  /* ════ POR BLOCOS — premium ════ */
  function _renderBlocosView(data) {
    const $list = document.getElementById('curriculum-list');
    if (!$list || !data?.disciplinas?.length) {
      if ($list) $list.innerHTML = '<div class="edcv-empty-filter">Nenhuma disciplina configurada.</div>';
      return;
    }

    const topicsDone = State.get('topicsDone') || {};
    const search = (document.getElementById('edcv-search')?.value || '').toLowerCase();
    const { heat, status, peso, sort } = _filters;

    function hexToRgba(hex, a) {
      if (!hex || hex.startsWith('var(')) return `rgba(232,184,75,${a})`;
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }

    let discs = [...(data.disciplinas||[])].filter(d => (peso === 'all' || d.peso === peso) && (_filters.disc === 'all' || d.id === _filters.disc));
    if (sort === 'heat') discs.sort((a,b) => {
      const avg = d => (d.topicos||[]).reduce((s,t)=>s+(t.heat||3),0)/Math.max(1,(d.topicos||[]).length);
      return avg(b) - avg(a);
    });
    else if (sort === 'alpha') discs.sort((a,b) => a.nome.localeCompare(b.nome));
    else if (sort === 'progress') discs.sort((a,b) => {
      const pct = d => { const t=(d.topicos||[]); return t.length?(d.topicos||[]).filter((_,ti)=>topicsDone[d.id+'_'+ti]).length/t.length:0; };
      return pct(a) - pct(b);
    });

    const cards = discs.map(d => {
      const color = _discColor(d.nome, d.cor);

      const filteredTopics = (d.topicos||[]).filter((t,ti) => {
        if (heat !== 'all' && t.heat !== parseInt(heat)) return false;
        if (status === 'pending' && topicsDone[d.id+'_'+ti]) return false;
        if (status === 'done'    && !topicsDone[d.id+'_'+ti]) return false;
        if (search && !t.texto.toLowerCase().includes(search) && !d.nome.toLowerCase().includes(search)) return false;
        return true;
      });

      if (!filteredTopics.length) return '';

      const done  = (d.topicos||[]).filter((_,ti) => topicsDone[d.id+'_'+ti]).length;
      const total = (d.topicos||[]).length;
      const pct   = total ? Math.round(done/total*100) : 0;

      // Count by heat
      const heatCounts = {5:0,4:0,3:0,2:0,1:0};
      filteredTopics.forEach(t => heatCounts[t.heat||3]++);
      const topCrit = heatCounts[5] + heatCounts[4];

      const topicsHTML = filteredTopics.map(t => {
        const realIdx = (d.topicos||[]).indexOf(t);
        const tk   = d.id+'_'+realIdx;
        const isDone = !!topicsDone[tk];
        const hc   = HEAT_C[t.heat]    || color;
        const hemi = t.heat === 5 ? '🔴' : t.heat === 4 ? '🟠' : t.heat === 3 ? '🟡' : t.heat === 2 ? '🟢' : '🔵';
        const isMarked = typeof ReviewSystem !== 'undefined' && ReviewSystem.isMarked('topic', tk);
        return `<div class="edcv-bloco-topic ${isDone?'done':''}" style="--bheat-c:${hc}"
                     onclick="EditalEngine.toggleTopicEd('${d.id}',${realIdx},this)">
          <div class="edcv-bt-check">${isDone?'✓':''}</div>
          <div class="edcv-bt-heat" title="${HEAT_LABEL[t.heat]||''}">${hemi}</div>
          <div class="edcv-bt-text" title="${t.texto}">${t.texto.replace(/^⚡\s*/,'')}</div>
          <div class="edcv-bt-actions">
            <button class="edcv-bt-btn edcv-bt-expand" onclick="event.stopPropagation();EditalEngine.expandBlocoTopic(this)" title="Expandir / recolher">⤢</button>
            <button class="edcv-bt-btn" onclick="event.stopPropagation();StudyTimer.startStudy('${d.nome.replace(/'/g,'&#39;')}','${t.texto.slice(0,40).replace(/'/g,'&#39;')}')" title="Estudar">▶</button>
            <button class="edcv-bt-btn" onclick="event.stopPropagation();ReviewSystem.toggleMark('topic','${tk}','${t.texto.replace(/'/g,'&#39;')}','${d.nome.replace(/'/g,'&#39;')}',this)" title="${isMarked?'Remover revisão':'Marcar revisão'}">🔁</button>
          </div>
        </div>`;
      }).join('');

      const bIcon = _getDiscIcon(d.nome);
      const pesoStyle = d.peso==='alta'
        ? 'color:rgba(255,100,100,0.75);border-color:rgba(255,77,77,0.15);background:rgba(255,77,77,0.05)'
        : d.peso==='baixa'
        ? 'color:rgba(100,160,240,0.75);border-color:rgba(77,159,255,0.12);background:rgba(77,159,255,0.04)'
        : 'color:rgba(210,170,60,0.7);border-color:rgba(232,184,75,0.12);background:rgba(232,184,75,0.04)';
      const pesoLbl = d.peso==='alta'?'Alta':d.peso==='baixa'?'Baixa':'Média';

      return `<div class="edcv-bloco-card" style="border-color:${color}33">
        <div class="edcv-bloco-header" style="background:linear-gradient(135deg, var(--surface-2) 60%, ${color}18)">
          <div class="edcv-bloco-accent" style="background:${color};opacity:1;box-shadow:0 0 16px 0 ${color}80"></div>
          <div class="edcv-bloco-top-row">
            <div class="edcv-bloco-disc-icon" style="border-color:${color}55;background:${color}28">${bIcon}</div>
            <div class="edcv-bloco-name" style="color:${color}">${d.nome}</div>
            <div class="edcv-bloco-badges">
              <span class="edcv-bloco-peso" style="${pesoStyle}">${pesoLbl}</span>
            </div>
          </div>
          <div class="edcv-bloco-progress-row">
            <div class="edcv-bloco-progress-track">
              <div class="edcv-bloco-progress-fill" style="width:${pct}%;background:${color};opacity:1"></div>
            </div>
            <div class="edcv-bloco-pct-label">${pct}%</div>
          </div>
          <div class="edcv-bloco-meta">
            <span>${filteredTopics.length} tópico${filteredTopics.length!==1?'s':''}</span>
            <span>·</span>
            <span>${done}/${total} concluídos</span>
          </div>
        </div>
        <div class="edcv-bloco-actions">
          <button class="edcv-bloco-act-btn study" onclick="StudyTimer.startStudy('${d.nome.replace(/'/g,'&#39;')}','')">▶ Estudar</button>
          <button class="edcv-bloco-act-btn rev"   onclick="EditalEngine._markAllForReview('${d.id}')">🔁 Revisar</button>
          <button class="edcv-bloco-act-btn done-btn" onclick="EditalEngine._toggleAllDone('${d.id}')">✓ Marcar todos</button>
        </div>
        <div class="edcv-bloco-topics">${topicsHTML}</div>
      </div>`;
    }).filter(Boolean).join('');

    if (!cards) {
      $list.innerHTML = `<div class="edcv-empty-filter">Nenhuma disciplina com os filtros aplicados.<br><br><button onclick="EditalEngine.resetFilters()" style="padding:8px 18px;background:var(--gold-a15);border:1px solid var(--gold);border-radius:8px;color:var(--gold);cursor:pointer;font-size:12px;">Limpar filtros</button></div>`;
      return;
    }

    // Agrupar: Alta > Média/Baixa
    const high = discs.filter(d => d.peso==='alta' && cards.includes(d.id) || true); // just render all in order
    $list.innerHTML = `<div class="edcv-blocos-grid">${cards}</div>`;
  }

  /* ── helpers for bulk actions ── */
  function _markAllForReview(discId) {
    const data = _get();
    const d = data?.disciplinas?.find(d => d.id === discId);
    if (!d || typeof ReviewSystem === 'undefined') return;
    (d.topicos||[]).forEach((t,ti) => {
      const tk = discId+'_'+ti;
      if (!ReviewSystem.isMarked('topic', tk)) ReviewSystem.toggleMark('topic', tk, t.texto, d.nome, null);
    });
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.3);color:var(--purple);padding:10px 20px;border-radius:10px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none';
    t.textContent = '🔁 Todos os tópicos de ' + d.nome + ' adicionados à revisão';
    document.body.appendChild(t); setTimeout(() => t.remove(), 3000);
  }

  function _toggleAllDone(discId) {
    const data = _get();
    const d = data?.disciplinas?.find(d => d.id === discId);
    if (!d) return;
    const topicsDone = State.get('topicsDone') || {};
    const total = (d.topicos||[]).length;
    const doneCount = (d.topicos||[]).filter((_,ti) => topicsDone[discId+'_'+ti]).length;
    const markAll = doneCount < total;
    (d.topicos||[]).forEach((_,ti) => { topicsDone[discId+'_'+ti] = markAll; });
    State.set('topicsDone', topicsDone);
    applyFilters();
    _renderStatsBar(data);
    if (typeof Render !== 'undefined') Render.dashboard();
  }

  /* ── Keep toggleTopic for backward compat ── */
  function toggleTopic(discId, topicIndex, el) {
    toggleTopicEd(discId, topicIndex, el);
  }

  function renderHeatMap() { _renderTopicos(_get()); } // legacy alias
  function renderBlocos()   { _renderBlocosView(_get()); } // legacy alias

  /* ── Dashboard CTA banner ── */
  function renderDashboardCTA() {
    const $cta = document.getElementById('edital-dashboard-cta');
    if (!$cta) return;
    if (hasEdital()) { $cta.style.display = 'none'; return; }
    $cta.style.display = 'flex';
  }

  // Retorna a cor canônica de uma disciplina: ciclo > edital > fallback
  function _discColor(nome, fallbackCor) {
    const cicloMap = (typeof CicloEstudos !== 'undefined') ? CicloEstudos.getColorMap() : {};
    return cicloMap[nome] || fallbackCor || '#E8B84B';
  }

  return {
    render, openForm, cancelForm, saveEdital, clearEdital,
    calcDays, selectTurno, saveApiKey,
    onPdfSelect, extractFromPDF,
    addDisc, removeDisc, changeDiscColor,
    toggleDiscTopics, addTopic, removeTopic, setTopicHeat,
    toggleTopic, toggleTopicEd,
    hasEdital, renderDashboardCTA,
    renderHeatMap, renderBlocos, toggleBlocoDisc: () => {},
    setFilter, applyFilters, resetFilters, setSideSearch, setDiscFilter,
    _markAllForReview, _toggleAllDone, _discColor,
    expandBlocoTopic(btn) {
      const row = btn.closest('.edcv-bloco-topic');
      if (row) row.classList.toggle('expanded');
    },
    getData: _get,
    _switchToList: () => { _renderTopicos(_get()); },
    switchEditalTab(tab, el) {
      document.querySelectorAll('.edcv-tab').forEach(t => t.classList.toggle('active', t === el));
      if (tab === 'blocos') _renderBlocosView(_get());
      else _renderTopicos(_get());
    },
  };
})();

/* ════════════════════════════════════════════════════════
   BRIEFING MODULE — Visão diária + Notificações + Badges
════════════════════════════════════════════════════════ */
const Briefing = (() => {

  /* ── Utils ── */
  const TODAY = () => _localDateStr();

  function _greet() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  function _fmtDate() {
    const d   = new Date();
    const days= ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const mos = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return `${days[d.getDay()]}, ${d.getDate()} ${mos[d.getMonth()]}`;
  }

  /* ── Streak ── */
  function _getStreak() {
    try {
      const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
      const byDate   = {};
      sessions.forEach(s => { if (s.data) byDate[s.data] = true; });
      let streak = 0;
      const d = new Date();
      while (byDate[_localDateStr(d)]) {
        streak++;
        d.setDate(d.getDate() - 1);
      }
      return streak;
    } catch { return 0; }
  }

  /* ── Today sessions ── */
  function _getTodaySessions() {
    try {
      const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
      return sessions.filter(s => s.data === TODAY());
    } catch { return []; }
  }

  /* ── Due cards ── */
  function _getDueCards() {
    const cards = State.get('flashcards') || [];
    return cards.filter(c => !c.nextReview || c.nextReview <= TODAY());
  }

  /* ── Pending errors ── */
  function _getPendingErrors() {
    return (State.get('errors') || []).filter(e => (e.status || 'pending') === 'pending');
  }

  /* ── Goals progress ── */
  function _getGoalsProgress() {
    try {
      const goals   = JSON.parse(localStorage.getItem('nexus_goals_v1') || '{}');
      const horMeta = goals.horasMeta    || 20;
      const quesMeta= goals.questoesMeta || 300;

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = _localDateStr(weekStart);

      const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
      const weekS    = sessions.filter(s => s.data >= weekKey);
      const weekSecs = weekS.reduce((a, s) => a + (s.tempoSecs || 0), 0);
      const weekQ    = weekS.reduce((a, s) => a + (s.acertos || 0) + (s.erros || 0), 0);

      return {
        horasMeta, quesMeta,
        weekHoras: weekSecs / 3600,
        weekQ,
        horPct:  Math.min(100, Math.round((weekSecs / 3600 / horMeta) * 100)),
        quesPct: Math.min(100, Math.round((weekQ / quesMeta) * 100)),
      };
    } catch { return { horasMeta:20, quesMeta:300, weekHoras:0, weekQ:0, horPct:0, quesPct:0 }; }
  }

  /* ── Frequent error disciplines ── */
  function _getErrorsByDisc() {
    const errs = State.get('errors') || [];
    // Build a name resolver: id/nome → display name
    const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const nameMap = {};
    if (edData?.disciplinas) {
      edData.disciplinas.forEach(d => {
        nameMap[d.id]   = d.nome;
        nameMap[d.nome] = d.nome;
      });
    }
    // Also try sessions for discipline names
    const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    sessions.forEach(s => { if (s.disciplina) nameMap[s.disciplina] = s.disciplina; });

    const byDisc = {};
    errs.forEach(e => {
      const k = e.subj || e.disciplina || 'outros';
      byDisc[k] = (byDisc[k] || 0) + 1;
    });
    return Object.entries(byDisc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([subj, count]) => {
        const displayName = nameMap[subj] || subj;
        return { name: displayName, subj, count };
      });
  }

  /* ── Today schedule blocks ── */
  function _getTodayBlocks() {
    try {
      const sched = JSON.parse(localStorage.getItem('nexus_schedule_v1') || 'null');
      if (!sched?.data?.fases) return [];
      const today  = TODAY();
      const blocks = [];
      const checked = State.get('checkedBlocks') || {};
      sched.data.fases.forEach((fase, fi) => {
        (fase.dias || []).forEach((dia, di) => {
          if (!dia.data) return;
          // Match today by dia.data (DD/MM) or dia.dia
          const d = new Date();
          const diaMM = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
          if (!dia.data || !dia.data.startsWith(diaMM)) return; // supports '03/05' and '03/05 Dom'
          (dia.blocos || []).forEach((b, bi) => {
            blocks.push({
              key: `${fi}_${di}_${bi}`,
              materia: b.materia, tipo: b.tipo,
              hora: `${b.hora_inicio}–${b.hora_fim}`,
              descricao: b.descricao || b.topico || '',
              done: !!checked[`${fi}_${di}_${bi}`],
            });
          });
        });
      });
      return blocks;
    } catch { return []; }
  }

  /* ── Main render ── */
  function render() {
    const $c = document.getElementById('briefing-content');
    if (!$c) return;

    const streak     = _getStreak();
    const todaySess  = _getTodaySessions();
    const dueCards   = _getDueCards();
    const pendErrs   = _getPendingErrors();
    const goals      = _getGoalsProgress();
    const errByDisc  = _getErrorsByDisc();
    const todayBlks  = _getTodayBlocks();
    const profile    = Onboarding.getUserProfile();
    const edData     = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const topicsDone = State.get('topicsDone') || {};
    const config     = State.get('config') || {};

    const todaySecs  = todaySess.reduce((a,s) => a+(s.tempoSecs||0), 0);
    const todayH     = Math.floor(todaySecs/3600);
    const todayM     = Math.floor((todaySecs%3600)/60);
    const todayQ     = todaySess.reduce((a,s) => a+(s.acertos||0)+(s.erros||0), 0);
    const todayAc    = todaySess.reduce((a,s) => a+(s.acertos||0), 0);
    const todayTaxa  = todayQ ? Math.round(todayAc/todayQ*100) : null;
    const metaHorasDia = (profile?.disponibilidade?.horasPorDia || goals.horasMeta/7);
    const metaSecs   = metaHorasDia * 3600;
    const hojeHPct   = Math.min(100, Math.round(todaySecs/metaSecs*100));
    const doneBlks   = todayBlks.filter(b=>b.done).length;
    const totalBlks  = todayBlks.length;
    const blkPct     = totalBlks ? Math.round(doneBlks/totalBlks*100) : 0;
    const missionPct = Math.round((blkPct*0.5) + (hojeHPct*0.3) + ((todayTaxa??0)*0.2));

    // Exam countdown
    const examDate   = config.examDate || profile?.concurso?.dataProva || null;
    const examName   = config.examName || profile?.concurso?.nome || 'Seu Concurso';
    const daysLeft   = examDate ? Math.max(0, Math.ceil((new Date(examDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0))/86400000)) : null;
    const maxDays    = config.totalDays || 90;
    const cdPct      = daysLeft !== null ? Math.max(0, Math.round((daysLeft/maxDays)*100)) : 0;
    const cdColor    = daysLeft===null?'var(--text-dim)':daysLeft<7?'var(--red)':daysLeft<21?'var(--orange)':daysLeft<60?'var(--gold)':'var(--green)';
    const urgency    = daysLeft===null?'SEM DATA':daysLeft<7?'CRÍTICO':daysLeft<21?'ATENÇÃO':daysLeft<60?'FOCO TOTAL':'PREPARAÇÃO';
    const urgencyBg  = daysLeft===null?'rgba(100,100,100,0.1)':daysLeft<7?'rgba(255,77,77,0.12)':daysLeft<21?'rgba(255,140,66,0.1)':daysLeft<60?'rgba(232,184,75,0.1)':'rgba(46,204,113,0.08)';
    const urgencyBdr = daysLeft===null?'rgba(100,100,100,0.2)':daysLeft<7?'rgba(255,77,77,0.3)':daysLeft<21?'rgba(255,140,66,0.25)':daysLeft<60?'rgba(232,184,75,0.25)':'rgba(46,204,113,0.2)';

    // Time greeting
    const h = new Date().getHours();
    const greet = h<5?'Boa Madrugada':h<12?'Bom Dia':h<18?'Boa Tarde':'Boa Noite';
    const dayNames = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    const monNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const now = new Date();
    const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()} ${monNames[now.getMonth()]}`;
    const timeStr = `${String(now.getHours()).padStart(2,'0')}h${String(now.getMinutes()).padStart(2,'0')}`;

    // Next block
    const pendBlks = todayBlks.filter(b=>!b.done);
    let nextBlock = null;
    if (pendBlks.length) {
      nextBlock = pendBlks[0];
    }

    // Readiness index (recompute here)
    const allTopics  = (edData?.disciplinas||[]).flatMap(d=>d.topicos||[]);
    const doneTopics = (edData?.disciplinas||[]).reduce((s,d)=>s+(d.topicos||[]).filter((_,ti)=>topicsDone[d.id+'_'+ti]).length,0);
    const topicPct   = allTopics.length ? Math.round(doneTopics/allTopics.length*100) : 0;
    const schedPct   = blkPct;
    const totalHoras = (JSON.parse(localStorage.getItem('nexus_sessions_v1')||'[]')).reduce((a,s)=>a+(s.tempoSecs||0),0)/3600;
    const readiness  = Math.round(topicPct*0.40 + schedPct*0.25 + (todayTaxa??0)*0.20 + Math.min(100,(totalHoras/(7*maxDays))*100)*0.15);
    const rdColor    = readiness>=70?'var(--green)':readiness>=40?'var(--gold)':'var(--red)';

    // Focus topics: heat=5 not done
    const focusTopics = [];
    if (edData?.disciplinas) {
      edData.disciplinas.forEach(d => {
        (d.topicos||[]).forEach((t,ti) => {
          if (t.heat>=4 && !topicsDone[d.id+'_'+ti]) {
            focusTopics.push({ disc: d, topic: t, idx: ti });
          }
        });
      });
      focusTopics.sort((a,b)=>(b.topic.heat||0)-(a.topic.heat||0));
    }

    // Weekly sessions for mini-chart
    const allSessions = JSON.parse(localStorage.getItem('nexus_sessions_v1')||'[]');
    const weekDays = Array.from({length:7},(_,i)=>{
      const d=new Date(); d.setDate(d.getDate()-6+i);
      return _localDateStr(d);
    });
    const weekSecs = weekDays.map(dk => allSessions.filter(s=>s.data===dk).reduce((a,s)=>a+(s.tempoSecs||0),0));
    const maxWS = Math.max(...weekSecs,1);

    // Vulnerability radar: low progress + high errors + high weight
    const vulnDiscs = (edData?.disciplinas||[]).map(d=>{
      const topics = d.topicos||[];
      const done = topics.filter((_,ti)=>topicsDone[d.id+'_'+ti]).length;
      const pct = topics.length ? Math.round(done/topics.length*100) : 100;
      const errCount = (State.get('errors')||[]).filter(e=>e.subj===d.id||e.subj===d.nome).length;
      const pesoW = d.peso==='alta'?3:d.peso==='media'?2:1;
      const riskScore = Math.round(((100-pct)/100)*40 + Math.min(errCount*10,40) + pesoW*6.67);
      return { ...d, pct, errCount, riskScore };
    }).filter(d=>d.riskScore>20).sort((a,b)=>b.riskScore-a.riskScore).slice(0,3);

    // SVG ring helper
    function ring(pct, color, size=100, sw=8) {
      const r = (size-sw*2)/2; const circ = 2*Math.PI*r;
      const offset = circ - (pct/100)*circ;
      return `<svg class="brf-countdown-ring-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="brf-countdown-track" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${sw}"/>
        <circle class="brf-countdown-fill" cx="${size/2}" cy="${size/2}" r="${r}" stroke="${color}"
          stroke-width="${sw}" stroke-dasharray="${circ}" stroke-dashoffset="${offset.toFixed(1)}"/>
      </svg>`;
    }
    function goalRing(pct, color, size=70, sw=7) {
      const r=(size-sw*2)/2; const circ=2*Math.PI*r; const offset=circ-(pct/100)*circ;
      return `<svg class="brf-goal-ring-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="brf-goal-ring-track" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${sw}"/>
        <circle class="brf-goal-ring-fill" cx="${size/2}" cy="${size/2}" r="${r}" stroke="${color}"
          stroke-width="${sw}" stroke-dasharray="${circ}" stroke-dashoffset="${offset.toFixed(1)}"/>
      </svg>`;
    }

    function _getDiscIcon(nome) {
      const n=(nome||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(n.includes('penal milit')||n.includes('penal militar'))return'⚔️';
      if(n.includes('processual penal milit'))return'🎖️';
      if(n.includes('processual penal')||n.includes('processo penal'))return'🔍';
      if(n.includes('penal'))return'⚖️';
      if(n.includes('constitucional'))return'🏛️';
      if(n.includes('administrativo'))return'🏢';
      if(n.includes('civil'))return'📜';
      if(n.includes('portugues')||n.includes('lingua port'))return'✍️';
      if(n.includes('ingles'))return'🌐';
      if(n.includes('matematica')||n.includes('raciocinio')||n.includes('logico'))return'🧮';
      if(n.includes('informatica'))return'💻';
      if(n.includes('direitos humanos'))return'🤝';
      if(n.includes('criminolog'))return'🔎';
      if(n.includes('legislacao'))return'📖';
      if(n.includes('administracao'))return'📈';
      if(n.includes('seguranca'))return'🛡️';
      return'📚';
    }

    // ── HERO HEADER ─────────────────────────────────────────
    const banca = edData?.concurso?.banca || profile?.concurso?.banca || '';
    const heroHTML = `
      <div class="brf-hero">
        <div class="brf-hero-grid"></div>
        <div class="brf-hero-orb o1"></div>
        <div class="brf-hero-orb o2"></div>
        <div class="brf-hero-inner">

          <!-- LEFT -->
          <div class="brf-hero-left">
            <div class="brf-hero-greeting">${greet} · ${dateStr} · ${timeStr}</div>
            <div class="brf-hero-name">${examName.length>28?examName.slice(0,28)+'…':examName}</div>
            <div class="brf-hero-exam">
              <span class="brf-hero-exam-dot" style="background:${cdColor}"></span>
              ${banca?`<span>${banca}</span><span style="opacity:0.3">·</span>`:''}
              <span>${daysLeft!==null?daysLeft+' dias para a prova':'Configure a data da prova'}</span>
            </div>
            <div class="brf-hero-pills">
              ${streak>0?`<span class="brf-hero-pill" style="color:var(--gold);border-color:rgba(232,184,75,0.25);background:rgba(232,184,75,0.06)">🔥 ${streak} dias seguidos</span>`:''}
              <span class="brf-hero-pill" style="color:${readiness>=70?'var(--green)':readiness>=40?'var(--gold)':'var(--red)'};border-color:${readiness>=70?'rgba(46,204,113,0.25)':readiness>=40?'rgba(232,184,75,0.25)':'rgba(255,77,77,0.25)'};background:${readiness>=70?'rgba(46,204,113,0.06)':readiness>=40?'rgba(232,184,75,0.06)':'rgba(255,77,77,0.06)'}">
                ${readiness>=70?'🟢':readiness>=40?'🟡':'🔴'} Prontidão ${readiness}%
              </span>
              <span class="brf-hero-pill" style="color:${rdColor};border-color:${urgencyBdr};background:${urgencyBg}">${urgency}</span>
            </div>
          </div>

          <!-- CENTER: Countdown Ring -->
          <div class="brf-hero-center">
            <div class="brf-countdown-ring-wrap">
              ${ring(cdPct, cdColor, 100, 7)}
              <div class="brf-countdown-inner">
                <div class="brf-countdown-num" style="color:${cdColor}">${daysLeft!==null?daysLeft:'—'}</div>
                <div class="brf-countdown-unit">dias</div>
              </div>
            </div>
            <div class="brf-countdown-label">para a prova</div>
            <div class="brf-urgency-tag" style="color:${cdColor};border-color:${urgencyBdr};background:${urgencyBg}">${urgency}</div>
          </div>

          <!-- RIGHT: Mission + Actions -->
          <div class="brf-hero-right">
            <div class="brf-mission-wrap">
              <div class="brf-mission-label">MISSÃO DO DIA</div>
              <div class="brf-mission-bar-wrap">
                <div class="brf-mission-bar-fill" style="width:${missionPct}%"></div>
              </div>
              <div class="brf-mission-stats">
                <span class="brf-mission-stat"><strong>${missionPct}%</strong> do dia</span>
                <span class="brf-mission-stat"><strong>${doneBlks}/${totalBlks}</strong> blocos</span>
                <span class="brf-mission-stat"><strong>${todayH}h${String(todayM).padStart(2,'0')}</strong></span>
              </div>
            </div>
            <div class="brf-quick-actions">
              <button class="brf-quick-btn primary" onclick="StudyTimer.openFullscreen()">⏱ Cronômetro</button>
              <button class="brf-quick-btn" onclick="StudyTimer.openRegistroManual()">+ Registrar</button>
              <button class="brf-quick-btn" onclick="Router.go('flashcards');Flashcards.setMode('due')">🃏 ${dueCards.length} cards</button>
            </div>
          </div>
        </div>

        <!-- FOOTER STRIP -->
        <div class="brf-hero-footer">
          <div class="brf-next-label">PRÓXIMO</div>
          ${nextBlock
            ? `<div class="brf-next-dot" style="background:var(--gold)"></div>
               <div class="brf-next-text">${nextBlock.materia}</div>
               <div class="brf-next-time">${nextBlock.hora?.split('–')[0]||''}</div>`
            : `<div class="brf-next-text" style="color:var(--text-dim);font-style:italic">Agenda de hoje concluída ou sem cronograma</div>`
          }
          ${streak>0?`<div class="brf-streak-pill">🔥 ${streak}</div>`:''}
        </div>
      </div>`;

    // ── CARDS ROW 1: Desempenho + Prontidão + (empty → bloco) ──
    const miniChartHTML = weekSecs.map((s,i)=>{
      const pctH = Math.round((s/maxWS)*100);
      const isToday = i===6;
      const clr = isToday?'var(--gold)':'rgba(255,255,255,0.12)';
      return `<div class="brf-mini-bar" style="height:${Math.max(4,pctH)}%;background:${clr};flex:1"></div>`;
    }).join('');

    const perfCard = `
      <div class="brf-card">
        <div class="brf-card-accent" style="background:linear-gradient(90deg,var(--blue),var(--gold))"></div>
        <div class="brf-card-header">
          <div class="brf-card-title">📈 Desempenho Hoje</div>
          <span class="brf-card-badge" style="color:var(--text-dim);border-color:var(--border-default);background:var(--surface-2)">${dateStr.split(',')[0]}</span>
        </div>
        <div class="brf-perf-metrics">
          <div class="brf-perf-metric">
            <div class="brf-perf-val" style="color:var(--blue)">${todayH}h${String(todayM).padStart(2,'00')}</div>
            <div class="brf-perf-lbl">Estudado</div>
          </div>
          <div class="brf-perf-metric">
            <div class="brf-perf-val" style="color:var(--gold)">${todayQ}</div>
            <div class="brf-perf-lbl">Questões</div>
          </div>
          <div class="brf-perf-metric">
            <div class="brf-perf-val" style="color:${todayTaxa===null?'var(--text-dim)':todayTaxa>=70?'var(--green)':todayTaxa>=50?'var(--gold)':'var(--red)'}">${todayTaxa!==null?todayTaxa+'%':'—'}</div>
            <div class="brf-perf-lbl">Acertos</div>
          </div>
        </div>
        <div style="display:flex;align-items:flex-end;gap:3px;height:32px">
          ${miniChartHTML}
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:3px">
          <span style="font-size:9px;color:var(--text-dim)">Seg</span>
          <span style="font-size:9px;color:var(--gold)">Hoje</span>
        </div>
        ${todaySecs===0?`
        <div style="display:flex;align-items:center;gap:7px;margin-top:10px;padding:7px 10px;border-radius:8px;background:rgba(77,159,255,0.06);border:1px solid rgba(77,159,255,0.15)">
          <span style="font-size:12px">🌅</span>
          <span style="flex:1;font-size:10px;color:var(--text-muted)">Nenhuma sessão hoje</span>
          <button style="padding:3px 9px;border-radius:6px;border:1px solid rgba(77,159,255,0.25);background:rgba(77,159,255,0.08);color:var(--blue);font-size:10px;font-weight:700;cursor:pointer" onclick="StudyTimer.openRegistroManual()">+ Iniciar</button>
        </div>`:''}
      </div>`;

    const readyCard = `
      <div class="brf-card">
        <div class="brf-card-accent" style="background:${rdColor}"></div>
        <div class="brf-card-header">
          <div class="brf-card-title">🏆 Índice de Prontidão</div>
          <span class="brf-card-badge" style="color:${rdColor};border-color:${rdColor}40;background:${rdColor}10">${readiness>=70?'No caminho':readiness>=40?'Acelere':'Urgente'}</span>
        </div>
        <div class="brf-ready-score">
          <div class="brf-ready-num" style="color:${rdColor}">${readiness}</div>
          <div class="brf-ready-bars">
            <div class="brf-ready-bar-row">
              <div class="brf-ready-bar-lbl">Tópicos</div>
              <div class="brf-ready-bar-track"><div class="brf-ready-bar-fill" style="width:${topicPct}%;background:var(--gold)"></div></div>
              <div class="brf-ready-bar-val">${topicPct}%</div>
            </div>
            <div class="brf-ready-bar-row">
              <div class="brf-ready-bar-lbl">Agenda</div>
              <div class="brf-ready-bar-track"><div class="brf-ready-bar-fill" style="width:${blkPct}%;background:var(--blue)"></div></div>
              <div class="brf-ready-bar-val">${blkPct}%</div>
            </div>
            <div class="brf-ready-bar-row">
              <div class="brf-ready-bar-lbl">Acertos</div>
              <div class="brf-ready-bar-track"><div class="brf-ready-bar-fill" style="width:${todayTaxa??0}%;background:var(--green)"></div></div>
              <div class="brf-ready-bar-val">${todayTaxa??0}%</div>
            </div>
          </div>
        </div>
        <div style="font-size:10px;color:var(--text-dim);line-height:1.5">
          ${readiness>=70?'🟢 Você está no ritmo certo. Mantenha a consistência.':readiness>=40?'🟡 Ritmo razoável. Priorize os tópicos críticos hoje.':'🔴 Ritmo abaixo do esperado. Intensifique os estudos.'}
        </div>
      </div>`;

    // Metas card with rings
    const hrPct = goals.horPct;
    const qPct  = goals.quesPct;
    const diasRestSemana = 7 - new Date().getDay();
    const horasFaltam    = Math.max(0, goals.horasMeta - goals.weekHoras);
    const velocNecessaria= diasRestSemana>0?(horasFaltam/diasRestSemana).toFixed(1):horasFaltam.toFixed(1);
    const noRitmo        = parseFloat(velocNecessaria) <= (goals.horasMeta/7);
    const goalsCard = `
      <div class="brf-card">
        <div class="brf-card-accent" style="background:linear-gradient(90deg,var(--blue),var(--green))"></div>
        <div class="brf-card-header">
          <div class="brf-card-title">🎯 Metas da Semana</div>
          <span class="brf-card-badge" style="color:${noRitmo?'var(--green)':'var(--orange)'};border-color:${noRitmo?'rgba(46,204,113,0.3)':'rgba(255,140,66,0.3)'};background:${noRitmo?'rgba(46,204,113,0.08)':'rgba(255,140,66,0.08)'}">
            ${noRitmo?'✓ No ritmo':'↑ Acelere'}
          </span>
        </div>
        <div class="brf-goal-rings">
          <div class="brf-goal-ring-wrap">
            <div style="position:relative;width:70px;height:70px">
              ${goalRing(hrPct,'var(--blue)',70,7)}
              <div class="brf-goal-ring-inner">
                <div class="brf-goal-ring-val" style="color:var(--blue)">${hrPct}%</div>
                <div class="brf-goal-ring-lbl">Horas</div>
              </div>
            </div>
            <div class="brf-goal-title">${goals.weekHoras.toFixed(1)}h/${goals.horasMeta}h</div>
          </div>
          <div class="brf-goal-ring-wrap">
            <div style="position:relative;width:70px;height:70px">
              ${goalRing(qPct,'var(--gold)',70,7)}
              <div class="brf-goal-ring-inner">
                <div class="brf-goal-ring-val" style="color:var(--gold)">${qPct}%</div>
                <div class="brf-goal-ring-lbl">Questões</div>
              </div>
            </div>
            <div class="brf-goal-title">${goals.weekQ}/${goals.quesMeta}</div>
          </div>
        </div>
        <div class="brf-goal-velocity">
          <div class="brf-goal-velocity-icon">${noRitmo?'✅':'⚡'}</div>
          <div>${noRitmo?`No ritmo! Faltam <strong style="color:var(--green)">${horasFaltam.toFixed(1)}h</strong> em ${diasRestSemana} dias.`:`Precisa de <strong style="color:var(--orange)">${velocNecessaria}h/dia</strong> nos ${diasRestSemana} dias restantes.`}</div>
        </div>
      </div>`;

    // ── CARDS ROW 2: Foco Crítico (wide) + Revisões SM-2 ──
    // ── AGENDA CARD (no lugar do Foco Crítico) ──
    const tipoClrs = {novo:'var(--gold)',revisao:'var(--blue)',simulado:'var(--red)'};
    const tipoLabel = {novo:'Novo',revisao:'Revisão',simulado:'Simulado'};

    function _buildAgendaCard(b, idx) {
      const dotClr  = tipoClrs[b.tipo] || 'var(--text-muted)';
      const tipoLbl = tipoLabel[b.tipo] || '';
      const safeMat = b.materia.replace(/'/g,"&#39;");
      const safDesc = (b.descricao||'').replace(/'/g,"&#39;").replace(/"/g,'&quot;');
      const topicsInner = b.descricao
        ? '<div class="agenda-topic-item" style="align-items:flex-start;padding:10px 8px">'
          + '<div class="agenda-topic-text" style="line-height:1.6;font-size:12px">' + b.descricao + '</div>'
          + '<button class="agenda-topic-study-btn" onclick="StudyTimer.startStudy(\'' + safeMat + '\',\'' + safDesc + '\')">▶</button>'
          + '</div>'
        : '<div class="agenda-no-topics">Sem descrição para este bloco.</div>';
      return '<div class="agenda-disc-card' + (b.done?' done':'') + '" id="adcard-' + idx + '">'
        + '<div class="agenda-disc-header" onclick="document.getElementById(\'adcard-' + idx + '\').classList.toggle(\'open\')">'
        + '<div class="agenda-disc-dot" style="background:' + dotClr + '"></div>'
        + '<div class="agenda-disc-info">'
        + '<div class="agenda-disc-name">' + b.materia + '</div>'
        + '<div class="agenda-disc-time">' + b.hora + (b.descricao ? ' · ver conteúdo' : '') + (tipoLbl ? ' · <span style="color:' + dotClr + ';font-weight:700">' + tipoLbl + '</span>' : '') + '</div>'
        + '</div>'
        + '<button class="agenda-study-btn" onclick="event.stopPropagation();StudyTimer.startStudy(\'' + safeMat + '\')">▶ Estudar</button>'
        + '<div class="agenda-disc-chevron">▾</div>'
        + '</div>'
        + '<div class="agenda-disc-topics">' + topicsInner + '</div>'
        + '</div>';
    }

    const agendaBadgeColor = pendBlks.length === 0 ? 'var(--green)' : 'var(--gold)';
    const agendaCard = `
      <div class="brf-card" style="padding:0;overflow:hidden;">
        <div class="brf-card-accent" style="background:linear-gradient(90deg,var(--gold),var(--blue))"></div>
        <div class="brf-card-header" style="padding:14px 16px 12px;border-bottom:1px solid var(--border-subtle);">
          <div class="brf-card-title">📅 Agenda de Hoje</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="brf-card-badge" style="color:${agendaBadgeColor};border-color:${agendaBadgeColor}40;background:${agendaBadgeColor}10">
              ${doneBlks}/${totalBlks} blocos
            </span>
            <button style="padding:3px 9px;border-radius:6px;border:1px solid var(--border-strong);background:transparent;color:var(--text-dim);font-size:10px;font-weight:700;cursor:pointer;" onclick="Router.go('schedule')">Ver tudo</button>
          </div>
        </div>
        <div style="padding:8px 8px 6px;">
          ${!todayBlks.length
            ? `<div class="briefing-empty-mini" style="padding:24px">Nenhum bloco hoje. <a href="#" onclick="Router.go('schedule');return false" style="color:var(--gold)">Configurar cronograma →</a></div>`
            : todayBlks.map((b,idx) => _buildAgendaCard(b, idx)).join('')
          }
        </div>
      </div>`;

    const revColor = dueCards.length===0?'var(--green)':dueCards.length<5?'var(--gold)':dueCards.length<20?'var(--orange)':'var(--red)';
    const revCard = `
      <div class="brf-card">
        <div class="brf-card-accent" style="background:${revColor}"></div>
        <div class="brf-card-header">
          <div class="brf-card-title">🃏 Revisões SM-2</div>
          <span class="brf-card-badge" style="color:${revColor};border-color:${revColor}40;background:${revColor}10">
            ${dueCards.length===0?'EM DIA':'PENDENTE'}
          </span>
        </div>
        <div class="brf-rev-big">
          <div class="brf-rev-count" style="color:${revColor}">${dueCards.length}</div>
          <div class="brf-rev-side">
            <div class="brf-rev-label">cards para hoje</div>
            <div class="brf-rev-sub">${dueCards.length===0?'Revisão em dia! Volte amanhã.':dueCards.length<5?'Rápido! ~10 minutos.':dueCards.length<15?'Bloco de revisão: ~25 min.':'Sessão intensa de revisão.'}</div>
          </div>
        </div>
        ${dueCards.length>0?`<div class="brf-rev-preview">
          ${dueCards.slice(0,2).map(c=>`<div class="brf-rev-preview-item">📌 ${(c.q||'').replace(/==/g,'').replace(/!!/g,'').slice(0,55)}…</div>`).join('')}
        </div>`:''}
        <button class="brf-rev-btn ${dueCards.length===0?'green':''}" onclick="Router.go('flashcards');Flashcards.setMode('due')">
          ${dueCards.length===0?'✓ Tudo em dia':'▶ REVISAR AGORA'}
        </button>
      </div>`;

    // ── CARDS ROW 3: Radar de Vulnerabilidade + Erros por Disciplina (premium) ──
    const maxRisk = vulnDiscs[0]?.riskScore || 1;

    // Risk level helpers
    const riskLevelLabel = score => score >= 75 ? 'CRÍTICO' : score >= 45 ? 'ALTO' : 'MÉDIO';
    const riskLevelColor = score => score >= 75 ? 'var(--red)' : score >= 45 ? 'var(--orange)' : 'var(--gold)';
    const riskLevelBg    = score => score >= 75 ? 'rgba(255,77,77,.12)' : score >= 45 ? 'rgba(255,140,66,.10)' : 'rgba(232,184,75,.10)';
    const riskLevelBdr   = score => score >= 75 ? 'rgba(255,77,77,.3)' : score >= 45 ? 'rgba(255,140,66,.25)' : 'rgba(232,184,75,.25)';

    // Bar chart SVG for radar
    function riskBar(pct, color) {
      return `<div class="vuln-bar-track"><div class="vuln-bar-fill" style="width:${pct}%;background:${color}"></div></div>`;
    }

    const vulnCard = `
      <div class="brf-card brf-card-radar">
        <div class="brf-card-accent" style="background:linear-gradient(90deg,#A78BFA,#4D9FFF)"></div>
        <div class="brf-card-header">
          <div class="brf-card-title">🛡️ Radar de Vulnerabilidade</div>
          <button class="brf-badge-btn" onclick="Router.go('errors')">Ver erros →</button>
        </div>
        <div class="vuln-subtitle">Disciplinas com maior risco de falha · pesos CEBRASPE</div>
        ${!vulnDiscs.length
          ? `<div class="vuln-empty"><div style="font-size:28px">🏆</div><div>Nenhuma vulnerabilidade crítica detectada!</div><div style="font-size:10px;color:var(--text-dim)">Continue com o ritmo atual.</div></div>`
          : `<div class="vuln-list">
              ${vulnDiscs.map((d, i) => {
                const rPct  = Math.round(d.riskScore / maxRisk * 100);
                const rClr  = riskLevelColor(rPct);
                const rBg   = riskLevelBg(rPct);
                const rBdr  = riskLevelBdr(rPct);
                const rLbl  = riskLevelLabel(rPct);
                const icon  = _getDiscIcon(d.nome);
                const pesoLabel = d.peso === 'alta' ? 'Alta' : d.peso === 'media' ? 'Média' : 'Baixa';
                const pesoClr   = d.peso === 'alta' ? 'var(--red)' : d.peso === 'media' ? 'var(--gold)' : 'var(--text-dim)';
                return `<div class="vuln-item">
                  <div class="vuln-rank" style="color:${rClr}">#${i+1}</div>
                  <div class="vuln-info">
                    <div class="vuln-name-row">
                      <span class="vuln-icon">${icon}</span>
                      <span class="vuln-name">${d.nome}</span>
                      <span class="vuln-level-badge" style="color:${rClr};background:${rBg};border-color:${rBdr}">${rLbl}</span>
                    </div>
                    ${riskBar(rPct, rClr)}
                    <div class="vuln-meta">
                      <span class="vuln-meta-pill">${d.pct}% concluído</span>
                      ${d.errCount ? `<span class="vuln-meta-pill err">${d.errCount} erro${d.errCount>1?'s':''}</span>` : ''}
                      <span class="vuln-meta-pill peso" style="color:${pesoClr}">Peso ${pesoLabel}</span>
                      <span class="vuln-meta-score">Score ${rPct}</span>
                    </div>
                  </div>
                  <button class="vuln-study-btn" onclick="StudyTimer.startStudy('${d.nome.replace(/'/g,"&#39;")}','')" title="Estudar agora">▶</button>
                </div>`;
              }).join('')}
            </div>`
        }
        <div class="vuln-footer">
          <span class="vuln-footer-hint">💡 Score = % incompleto + erros acumulados + peso da banca</span>
        </div>
      </div>`;

    // Erros por Disciplina — premium bar chart
    const maxErr = errByDisc[0]?.count || 1;

    // Alertas smart
    const inlineAlerts = [];
    if (todaySecs === 0) inlineAlerts.push({
      color: 'var(--blue)', icon: '🌅',
      text: 'Sessão não iniciada hoje',
      action: 'onclick="StudyTimer.openRegistroManual()"', btn: '+ Registrar'
    });
    if (goals.horPct < 30 && new Date().getDay() >= 4) inlineAlerts.push({
      color: 'var(--orange)', icon: '⏰',
      text: `Meta de horas em ${goals.horPct}% — metade da semana`,
      action: 'onclick="StudyTimer.openFullscreen()"', btn: 'Iniciar'
    });

    const PALETTE = ['var(--red)','var(--orange)','var(--gold)','var(--blue)','var(--green)','#A78BFA'];

    const errosCard = `
      <div class="brf-card brf-card-erros">
        <div class="brf-card-accent" style="background:linear-gradient(90deg,rgba(255,77,77,.7),rgba(255,140,66,.7))"></div>
        <div class="brf-card-header">
          <div class="brf-card-title">📊 Erros por Disciplina</div>
          <button class="brf-badge-btn" onclick="Router.go('errors')">Caderno →</button>
        </div>
        ${!errByDisc.length
          ? `<div class="erros-empty"><div style="font-size:28px">✅</div><div>Nenhum erro registrado.</div><div style="font-size:10px;color:var(--text-dim)">Continue acertando!</div></div>`
          : `<div class="erros-list">
              ${errByDisc.map((d, i) => {
                const w   = Math.round(d.count / maxErr * 100);
                const clr = PALETTE[i] || 'var(--text-dim)';
                const pct = Math.round(d.count / (errByDisc.reduce((a,x)=>a+x.count,0)) * 100);
                return `<div class="erros-item">
                  <div class="erros-item-header">
                    <span class="erros-disc-name" title="${d.name}">${d.name.length>24?d.name.slice(0,23)+'…':d.name}</span>
                    <div class="erros-item-counts">
                      <span class="erros-count" style="color:${clr}">${d.count}</span>
                      <span class="erros-pct">${pct}%</span>
                    </div>
                  </div>
                  <div class="erros-bar-track">
                    <div class="erros-bar-fill" style="width:${w}%;background:${clr}"></div>
                  </div>
                </div>`;
              }).join('')}
            </div>
            <div class="erros-total-row">
              <span style="font-size:9px;color:var(--text-dim)">Total de erros registrados</span>
              <span style="font-family:var(--font-mono);font-size:11px;font-weight:800;color:var(--red)">${errByDisc.reduce((a,d)=>a+d.count,0)}</span>
            </div>`
        }
        ${inlineAlerts.map(a=>`
          <div class="erros-alert" style="border-color:${a.color}25;background:${a.color}08">
            <span style="font-size:13px">${a.icon}</span>
            <span class="erros-alert-text">${a.text}</span>
            <button class="erros-alert-btn" style="color:${a.color};border-color:${a.color}35;background:${a.color}10" ${a.action}>${a.btn}</button>
          </div>`).join('')}
      </div>`;

    // ── Notification permission ──
    const notifHTML = (typeof Notification !== 'undefined' && Notification.permission==='default')
      ?`<div class="briefing-notif-banner" onclick="Briefing.requestNotifications()">
          <div style="font-size:20px">🔔</div>
          <div class="briefing-notif-banner-text"><strong>Ativar lembretes inteligentes</strong>Receba notificações sobre revisões pendentes, metas e blocos do dia</div>
          <button class="briefing-notif-btn">Ativar</button></div>`:'' ;

    // ── Badge ──
    const totalPending = dueCards.length+pendErrs.length;
    const $badge = document.getElementById('briefing-badge');
    if ($badge) $badge.textContent = totalPending?`${totalPending} PENDENTES`:'EM DIA ✓';

    // ── Assemble — sem divider, sem seção Pontos de Atenção ──
    $c.innerHTML =
      notifHTML +
      heroHTML +
      `<div class="brf-cards-grid">${perfCard}${readyCard}${goalsCard}</div>` +
      `<div class="brf-cards-row2">${agendaCard}${revCard}</div>` +
      `<div class="brf-cards-row3">${vulnCard}${errosCard}</div>`;
  }

  /* ── Notification API ── */
  function requestNotifications() {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        render();
        _scheduleNotifications();
      }
    });
  }

  function _scheduleNotifications() {
    if (Notification.permission !== 'granted') return;
    const dueCards = _getDueCards().length;
    const goals    = _getGoalsProgress();
    const msgs     = [];
    if (dueCards > 0) msgs.push(`🃏 ${dueCards} flashcard${dueCards > 1 ? 's' : ''} para revisar hoje`);
    if (goals.horPct < 50) msgs.push(`⏱ Meta de horas em ${goals.horPct}% — ${(goals.horasMeta - goals.weekHoras).toFixed(1)}h restantes`);
    if (msgs.length) {
      new Notification('NEXUS STUDY — Resumo do dia', {
        body: msgs.join('\n'),
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>',
      });
    }
  }

  /* ── Update sidebar badges ── */
  function updateBadges() {
    // Flashcards due
    const dueCards = _getDueCards().length;
    const $fcBadge = document.getElementById('badge-flashcards');
    if ($fcBadge) {
      $fcBadge.textContent = dueCards || '';
      $fcBadge.classList.toggle('show', dueCards > 0);
    }

    // Pending errors
    const pendErrs = _getPendingErrors().length;
    const $errBadge = document.getElementById('badge-errors');
    if ($errBadge) {
      $errBadge.textContent = pendErrs || '';
      $errBadge.classList.toggle('show', pendErrs > 0);
    }

    // Briefing total
    const total = dueCards + pendErrs;
    const $brBadge = document.getElementById('badge-briefing');
    if ($brBadge) {
      $brBadge.textContent = total || '';
      $brBadge.classList.toggle('show', total > 0);
      $brBadge.classList.toggle('gold', total === 0);
    }
  }

  /* ── Toggle topic done from Briefing ── */
  function toggleTopic(discId, topicIdx, el) {
    const key   = discId + '_' + topicIdx;
    const done  = State.get('topicsDone') || {};
    done[key]   = !done[key];
    State.set('topicsDone', done);
    const card  = el.closest('.agenda-topic-item');
    if (card) card.classList.toggle('done', !!done[key]);
    el.textContent = done[key] ? '✓' : '';
    // Refresh dashboard live
    if (typeof Render !== 'undefined') Render.dashboard();
    // Refresh badges
    updateBadges();
  }

  function init() {
    updateBadges();
    // Request notification on return visit (not first)
    const visited = localStorage.getItem('nexus_visited');
    if (visited && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      setTimeout(() => render(), 500); // show banner in briefing
    }
    localStorage.setItem('nexus_visited', '1');
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      setTimeout(_scheduleNotifications, 2000);
    }
  }

  return { render, updateBadges, requestNotifications, init, toggleTopic };
})();

/* ════════════════════════════════════════════════════════
   REVIEW SYSTEM v2 — Revisões Inteligentes
   Fixes: collectUncompleted, revisao sync, ladder 1d-7d-15d-30d
════════════════════════════════════════════════════════ */
const ReviewSystem = (() => {

  /* ─────────────────────────────────────────────
     CONSTANTS & STORAGE
  ───────────────────────────────────────────── */
  const KEY      = 'nexus_reviews_v1';
  const VER_KEY  = 'nexus_rev_sched_ver';
  const TODAY    = () => _localDateStr();
  // Escada de revisão alinhada ao sistema do usuário: 1d → 7d → 15d → 30d
  const LADDER   = [1, 7, 15, 30];

  function _load()    { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  function _save(arr) { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch {} }

  /* ─────────────────────────────────────────────
     DATE HELPERS
  ───────────────────────────────────────────── */
  function _parseDDMM(ddmm) {
    if (!ddmm || !ddmm.includes('/')) return null;
    const clean = ddmm.trim().replace(/\s.*$/, '');
    const [dd, mm] = clean.split('/').map(Number);
    if (!dd || !mm || mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
    const now  = new Date();
    const year = now.getFullYear();
    const cand = new Date(year, mm - 1, dd);
    const ago90 = new Date(now); ago90.setDate(ago90.getDate() - 90);
    if (cand < ago90) return _localDateStr(new Date(year + 1, mm - 1, dd));
    return _localDateStr(cand);
  }

  function _addDays(iso, n) {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return _localDateStr(d);
  }

  function _fmtDate(iso) {
    if (!iso) return '';
    const [,, dd] = iso.split('-');
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const d = new Date(iso + 'T12:00:00');
    return `${dd}/${months[d.getMonth()]}`;
  }

  /* ─────────────────────────────────────────────
     SM-2 ALGORITHM
  ───────────────────────────────────────────── */
  function _sm2(item, quality) {
    // quality: 0 = Errei (1d) · 1 = Bom (próximo step) · 2 = Ótimo (+2 steps) · 3 = Dominei (último step)
    let ef       = item.ef       ?? 2.5;
    let reps     = item.reps     ?? 0;
    let ladder   = item.ladder   ?? 0;
    if (quality === 0) {
      reps = 0; ladder = 0;
      ef = Math.max(1.3, ef - 0.20);
    } else if (quality === 1) {
      reps++;
      ladder = Math.min(LADDER.length - 1, ladder + 1);
    } else if (quality === 2) {
      reps++;
      ladder = Math.min(LADDER.length - 1, ladder + 2);
      ef = Math.min(2.8, ef + 0.05);
    } else {
      reps++;
      ladder = LADDER.length - 1;
      ef = Math.min(2.8, ef + 0.10);
    }
    const interval = LADDER[ladder];
    return { ef, interval, reps, ladder, nextReview: _addDays(TODAY(), Math.max(1, interval)) };
  }

  function _ladderStep(item) {
    if (item.ladder !== undefined) return Math.min(item.ladder, LADDER.length - 1);
    const n = item.interval || 0;
    return n <= 1 ? 0 : n <= 7 ? 1 : n <= 15 ? 2 : 3;
  }

  /* ─────────────────────────────────────────────
     MAKE ITEM
  ───────────────────────────────────────────── */
  function _makeItem({ type, sourceId, title, subtitle, roteiro = [], notes = '', autoAdded = false, nextReview = null }) {
    return {
      id: 'rev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type, sourceId, title: title || sourceId, subtitle: subtitle || '',
      roteiro, notes, autoAdded,
      addedAt: TODAY(),
      nextReview: nextReview || _addDays(TODAY(), LADDER[0]),
      interval: LADDER[0], ef: 2.5, reps: 0, ladder: 0,
      status: 'pending', doneAt: null,
    };
  }

  /* ─────────────────────────────────────────────
     COLLECT FROM ALL SOURCES
  ───────────────────────────────────────────── */
  function collectUncompleted() {
    // Apenas itens criados manualmente via "Adicionar Estudo" (type === 'manual')
    // permanecem na aba Revisões. Qualquer outra origem (cronograma, erros,
    // tópicos do edital, blocos) é removida automaticamente.
    try {
      const items = _load();
      const cleaned = items.filter(r => r.type === 'manual');
      if (cleaned.length !== items.length) {
        _save(cleaned);
        _updateBadge();
      }
    } catch (e) {
      console.warn('[ReviewSystem] collectUncompleted error:', e);
    }
  }

  /* ─────────────────────────────────────────────
     CRUD OPERATIONS
  ───────────────────────────────────────────── */
  function rateItem(id, quality) {
    let items = _load();
    const idx = items.findIndex(r => r.id === id);
    if (idx < 0) return;
    if (quality === 3) {
      items[idx] = { ...items[idx], status: 'done', doneAt: TODAY() };
    } else {
      items[idx] = { ...items[idx], ..._sm2(items[idx], quality), status: 'pending' };
    }
    _save(items);
    _updateBadge();
    render();
  }

  function deleteItem(id) {
    _save(_load().filter(r => r.id !== id));
    _updateBadge();
    render();
  }

  function restoreItem(id) {
    let items = _load();
    const idx = items.findIndex(r => r.id === id);
    if (idx >= 0) { items[idx] = { ...items[idx], status: 'pending', doneAt: null, nextReview: TODAY() }; _save(items); }
    _updateBadge();
    render();
  }

  function revertItem(id) {
    let items = _load();
    const idx = items.findIndex(r => r.id === id);
    if (idx < 0) return;
    const item = items[idx];
    const curLadder = item.ladder ?? _ladderStep(item);
    const prevLadder = Math.max(0, curLadder - 1);
    const prevInterval = LADDER[prevLadder];
    items[idx] = {
      ...item,
      ladder: prevLadder,
      interval: prevInterval,
      nextReview: _addDays(TODAY(), prevInterval),
      status: 'pending',
      doneAt: null,
    };
    _save(items);
    _updateBadge();
    render();
  }

  function dismiss(id)   { rateItem(id, 3); }
  function clearDone()   { _save(_load().filter(r => r.status !== 'done')); _updateBadge(); render(); }

  function isMarked(type, sourceId) {
    return _load().some(r => r.type === type && r.sourceId === sourceId && r.status !== 'done');
  }

  function toggleMark(type, sourceId, title, subtitle, el) {
    // Desativado: revisões só são criadas via "Adicionar Estudo" → "Programar Revisão".
    _toast('Revisões agora são criadas em "Adicionar Estudo"', 'ℹ️');
  }

  function addManualItem(_type, _sourceId, _title, _subtitle) {
    // Desativado: somente scheduleManual (Adicionar Estudo) cria revisões.
  }

  function scheduleManual(sourceId, title, subtitle, daysFromToday) {
    const days = Math.max(0, parseInt(daysFromToday) || 0);
    let items = _load();
    if (items.some(r => r.sourceId === sourceId && r.status !== 'done')) return;
    const nextReview = _addDays(TODAY(), days || 1);
    const item = _makeItem({ type: 'manual', sourceId, title, subtitle, nextReview });
    item.interval = days || 1;
    items.push(item);
    _save(items); _updateBadge();
  }

  function _decode(str) {
    const el = document.createElement('div'); el.innerHTML = str;
    return el.textContent || str;
  }

  /* ─────────────────────────────────────────────
     BADGE & COUNTS
  ───────────────────────────────────────────── */
  function _updateBadge() {
    const today   = TODAY();
    const pending = _load().filter(r => r.status === 'pending' && r.nextReview <= today).length;
    const $b = document.getElementById('badge-revisoes');
    if ($b) { $b.textContent = pending || ''; $b.classList.toggle('show', pending > 0); }
    if (typeof Briefing !== 'undefined' && Briefing.updateBadges) Briefing.updateBadges();
  }

  function getDueCount() {
    return _load().filter(r => r.status === 'pending' && r.nextReview <= TODAY()).length;
  }

  function getRetentionScore() {
    const items = _load();
    const byDisc = {};
    items.forEach(r => {
      const disc = r.disc || r.title?.split(' ')[0] || 'Geral';
      if (!byDisc[disc]) byDisc[disc] = { total: 0, retained: 0 };
      byDisc[disc].total++;
      if (r.status === 'done' || r.reps >= 2) byDisc[disc].retained++;
    });
    return Object.entries(byDisc).map(([disc, d]) => ({
      disc, total: d.total, retained: d.retained,
      pct: d.total ? Math.round(d.retained / d.total * 100) : 0,
    })).sort((a, b) => a.pct - b.pct);
  }

  function getPriorityQueue() {
    const today = TODAY();
    return _load()
      .filter(r => r.status === 'pending' && r.nextReview <= today)
      .map(r => ({ ...r, _priority: Math.max(0, (new Date(today) - new Date(r.nextReview)) / 86400000) * 2 + (5 - (r.ef || 2.5)) }))
      .sort((a, b) => b._priority - a._priority);
  }

  /* ─────────────────────────────────────────────
     FILTER STATE
  ───────────────────────────────────────────── */
  let _filter       = 'all';
  let _sort         = 'date';
  let _search       = '';
  let _ladder_view  = 'all';
  let _view_section = 'all';

  function setFilter(f)       { _filter = f;       render(); }
  function setSort(s)         { _sort   = s;       render(); }
  function setSearch(v)       { _search = v.toLowerCase(); render(); }
  function setLadderView(v)   { _ladder_view = v;  render(); }
  function setViewSection(v)  { _view_section = v; render(); }
  function toggleSection(id)  { _view_section = (_view_section === id) ? 'all' : id; render(); }

  function _applyFiltersArr(arr) {
    let r = arr;
    if (_filter !== 'all') r = r.filter(i => i.type === _filter);
    if (_search) r = r.filter(i =>
      (i.title || '').toLowerCase().includes(_search) ||
      (i.subtitle || '').toLowerCase().includes(_search) ||
      (i.notes || '').toLowerCase().includes(_search)
    );
    if (_sort === 'alpha') r = [...r].sort((a, b) => (a.title||'').localeCompare(b.title||''));
    if (_sort === 'reps')  r = [...r].sort((a, b) => (b.reps||0) - (a.reps||0));
    if (_sort === 'ef')    r = [...r].sort((a, b) => (a.ef||2.5) - (b.ef||2.5));
    return r;
  }

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  function render() {
    const $c = document.getElementById('rev-content');
    if (!$c) return;

    const today    = TODAY();
    const items    = _load();
    const pending  = items.filter(r => r.status === 'pending');
    const overdue  = pending.filter(r => r.nextReview <  today).sort((a,b) => a.nextReview.localeCompare(b.nextReview));
    const todayQ   = pending.filter(r => r.nextReview === today);
    const upcoming = pending.filter(r => r.nextReview >  today).sort((a,b) => a.nextReview.localeCompare(b.nextReview));
    const done     = items.filter(r => r.status === 'done').sort((a,b) => (b.doneAt||'').localeCompare(a.doneAt||'')).slice(0, 40);
    const totalItems = items.length;

    // ── Premium Dashboard ──────────────────────────────────────────────
    const totalDue = overdue.length + todayQ.length;
    const totalDoneToday = items.filter(r => r.status === 'done' && r.doneAt === today).length;
    const healthPct = totalDue + totalDoneToday > 0 ? Math.round((totalDoneToday / (totalDue + totalDoneToday)) * 100) : 100;
    const overdueDaysTotal = overdue.reduce((acc, r) => acc + Math.max(1, Math.ceil((new Date(today) - new Date(r.nextReview)) / 86400000)), 0);

    // ── Timeline forecast cards ───────────────────────────────────────────
    function isoPlus(n) {
      const d = new Date(today + 'T12:00:00'); d.setDate(d.getDate() + n);
      return _localDateStr(d);
    }
    function countUpTo(days) {
      const to = isoPlus(days);
      return upcoming.filter(r => r.nextReview <= to).length;
    }

    const SLOTS = [
      { id:'slot_1',  label:'+1D',  days:1,  color:'var(--orange)' },
      { id:'slot_3',  label:'+3D',  days:3,  color:'var(--gold)' },
      { id:'slot_7',  label:'+7D',  days:7,  color:'var(--blue)' },
      { id:'slot_15', label:'+15D', days:15, color:'var(--purple)' },
      { id:'slot_30', label:'+30D', days:30, color:'var(--green)' },
    ];

    const upcoming7 = countUpTo(7);

    // ── HERO premium ─────────────────────────────────────────────────────
    const hasDue = (overdue.length + todayQ.length) > 0;
    const heroHTML = `
    <div class="cad-hero rev-hero">
      <div>
        <div class="cad-hero-eyebrow">REVISÃO ESPAÇADA · SM-2</div>
        <h1 class="cad-hero-title">REVISÕES</h1>
        <p class="cad-hero-sub">${hasDue
          ? `Você tem <strong style="color:var(--gold)">${overdue.length + todayQ.length}</strong> revisões pendentes para hoje. Mantenha o ritmo — a curva do esquecimento não perdoa atrasos.`
          : 'Tudo em dia. Continue assim para fixar o conteúdo na memória de longo prazo.'}</p>
      </div>
      ${hasDue ? `<button class="cad-cta" data-sec="${overdue.length ? 'overdue' : 'today'}">
        <span>▶</span><span>REVISAR AGORA</span>
      </button>` : ''}
    </div>`;

    // ── STATS premium (4 cards) ──────────────────────────────────────────
    const statsHTML = `
    <div class="cad-stats rev-stats">
      <div class="cad-stat" style="--stat-c:var(--red)">
        <div class="cad-stat-top"><span class="cad-stat-ico">🔴</span><span class="cad-stat-lbl">Em Atraso</span></div>
        <div class="cad-stat-val">${overdue.length}</div>
        <div class="cad-stat-sub">${overdue.length ? `${overdueDaysTotal}d acumulados` : 'Nenhuma atrasada'}</div>
        <div class="cad-stat-bar"><div class="cad-stat-fill" style="width:${overdue.length ? Math.min(100, overdue.length*10) : 0}%"></div></div>
      </div>
      <div class="cad-stat" style="--stat-c:var(--gold)">
        <div class="cad-stat-top"><span class="cad-stat-ico">🎯</span><span class="cad-stat-lbl">Foco de Hoje</span></div>
        <div class="cad-stat-val">${todayQ.length}</div>
        <div class="cad-stat-sub">programadas para hoje</div>
        <div class="cad-stat-bar"><div class="cad-stat-fill" style="width:${todayQ.length ? 100 : 0}%"></div></div>
      </div>
      <div class="cad-stat" style="--stat-c:var(--green)">
        <div class="cad-stat-top"><span class="cad-stat-ico">✅</span><span class="cad-stat-lbl">Saúde Diária</span></div>
        <div class="cad-stat-val">${healthPct}%</div>
        <div class="cad-stat-sub">${totalDoneToday} concluídas hoje</div>
        <div class="cad-stat-bar"><div class="cad-stat-fill" style="width:${healthPct}%"></div></div>
      </div>
      <div class="cad-stat" style="--stat-c:var(--blue)">
        <div class="cad-stat-top"><span class="cad-stat-ico">📅</span><span class="cad-stat-lbl">Próximos 7 dias</span></div>
        <div class="cad-stat-val">${upcoming7}</div>
        <div class="cad-stat-sub">revisões planejadas</div>
        <div class="cad-stat-bar"><div class="cad-stat-fill" style="width:${upcoming7 ? Math.min(100, upcoming7*5) : 0}%"></div></div>
      </div>
    </div>`;

    // ── Segmentos unificados (timeline + section tabs em uma linha) ──────
    const segs = [
      { id:'all',      label:'Tudo',      count: pending.length, color:'var(--text-primary)' },
      { id:'overdue',  label:'Atrasadas', count: overdue.length, color:'var(--red)' },
      { id:'today',    label:'Hoje',      count: todayQ.length,  color:'var(--gold)' },
      ...SLOTS.map(s => ({ id:s.id, label:s.label, count: countUpTo(s.days), color:s.color })),
      { id:'done',     label:'Feitas',    count: done.length,    color:'var(--green)' },
    ];
    const segsHTML = `
    <div class="rev-segs">
      ${segs.map(s => {
        const active = _view_section===s.id ? 'active' : '';
        const dim = !s.count && s.id!=='all' ? 'dim' : '';
        return `<button class="rev-seg ${active} ${dim}" data-sec="${s.id}" style="--seg-c:${s.color}">
          <span class="rev-seg-label">${s.label}</span>
          <span class="rev-seg-count">${s.count}</span>
        </button>`;
      }).join('')}
    </div>`;

    // ── Toolbar limpo: chips de tipo + busca ─────────────────────────────
    const types = [['all',''],['revisao','🔁'],['error','✏️'],['topic','📖'],['manual','🔖']];
    const typeNames = { all:'Todos', revisao:'Crono', error:'Erros', topic:'Tópicos', manual:'Manual' };
    const toolbarHTML = `
    <div class="rev-toolbar">
      <div class="rev-type-chips">
        ${types.map(([f,ic]) => `<button class="rev-type-chip ${_filter===f?'active':''}" data-filter="${f}" title="${typeNames[f]}">
          ${ic?`<span>${ic}</span>`:''}<span class="rev-tc-name">${typeNames[f]}</span>
        </button>`).join('')}
      </div>
      <div class="rev-search-wrap">
        <span class="rev-search-ic">🔍</span>
        <input class="rev-search-input" placeholder="Buscar tópico ou matéria…" value="${_search}"
               oninput="ReviewSystem.setSearch(this.value)">
      </div>
    </div>`;

    // ── Empty state ───────────────────────────────────────────────────────
    if (!totalItems) {
      $c.innerHTML = heroHTML + statsHTML + segsHTML + `
        <div class="rev-empty">
          <div class="rev-empty-icon">🔁</div>
          <div class="rev-empty-title">FILA VAZIA</div>
          <p class="rev-empty-sub">Blocos de revisão do cronograma aparecem aqui automaticamente. Acesse o Cronograma e marque blocos com 🔁.</p>
        </div>`;
      _attachListener($c); return;
    }

    // ── Determine items to display ────────────────────────────────────────
    function getSlotItems(days) {
      const to = isoPlus(days);
      return upcoming.filter(r => r.nextReview <= to);
    }

    let displayGroups = [];
    if (_view_section === 'all') {
      // Kanban board view (4 colunas equal-size com scroll interno)
      const tomorrowISO = isoPlus(1);
      const week7ISO    = isoPlus(7);
      const amanhaArr   = upcoming.filter(r => r.nextReview === tomorrowISO);
      const semanaArr   = upcoming.filter(r => r.nextReview > tomorrowISO && r.nextReview <= week7ISO);
      const kanCols = [
        { id:'overdue', title:'ATRASADAS',   color:'var(--red)',   arr: _applyFiltersArr(overdue),  cls:'overdue' },
        { id:'today',   title:'HOJE',        color:'var(--gold)',  arr: _applyFiltersArr(todayQ),   cls:'today' },
        { id:'amanha',  title:'AMANHÃ',      color:'var(--purple)',arr: _applyFiltersArr(amanhaArr),cls:'upcoming' },
        { id:'semana',  title:'ESTA SEMANA', color:'var(--cyan)',  arr: _applyFiltersArr(semanaArr),cls:'upcoming' },
      ];
      const kanbanHTML = `
      <div class="rev-kanban">
        ${kanCols.map(c => `
          <div class="rev-kan-col" style="--kan-c:${c.color}" data-col="${c.id}">
            <div class="rev-kan-head">
              <span class="rev-kan-title">${c.title}</span>
              <span class="rev-kan-count">${c.arr.length}</span>
            </div>
            <div class="rev-kan-body">
              ${c.arr.length
                ? c.arr.map(r => _renderItem(r, c.cls)).join('')
                : '<div class="rev-kan-empty">vazio por aqui</div>'}
            </div>
          </div>
        `).join('')}
      </div>`;
      $c.innerHTML = heroHTML + statsHTML + segsHTML + toolbarHTML + kanbanHTML;
      _attachListener($c);
      return;
    } else if (_view_section === 'overdue')  displayGroups = [{ title:'Atrasadas',     color:'var(--red)',   icon:'🔴', arr:overdue,  cls:'overdue' }];
    else if (_view_section === 'today')     displayGroups = [{ title:'Para Hoje',     color:'var(--gold)',  icon:'🟡', arr:todayQ,   cls:'today' }];
    else if (_view_section === 'upcoming')  displayGroups = [{ title:'Próximas',       color:'var(--blue)',  icon:'🔵', arr:upcoming, cls:'upcoming' }];
    else if (_view_section === 'done')      displayGroups = [{ title:'Concluídas',    color:'var(--green)', icon:'✅', arr:done,     cls:'done' }];
    else if (_view_section.startsWith('slot_')) {
      const days = parseInt(_view_section.slice(5), 10);
      const sl   = getSlotItems(days);
      displayGroups = [{ title:`Próximas +${days} dias (até ${_fmtDate(isoPlus(days))})`, color:'var(--blue)', icon:'🔵', arr:sl, cls:'upcoming' }];
    }

    let groupsHTML = '';
    for (const g of displayGroups) {
      const filtered = _applyFiltersArr(g.arr);
      if (!filtered.length) continue;
      groupsHTML += `<div class="rev-group">
        <div class="rev-group-header">
          <span class="rev-group-title" style="color:${g.color}">${g.icon} ${g.title}</span>
          <span class="rev-group-count">${filtered.length}</span>
        </div>
        ${filtered.map(r => _renderItem(r, g.cls)).join('')}
      </div>`;
    }

    if (!groupsHTML) {
      groupsHTML = '<div class="rev-empty" style="padding:28px 0"><div class="rev-empty-icon">✨</div><p class="rev-empty-sub">Nenhum item nesta seção.</p></div>';
    }

    $c.innerHTML = heroHTML + statsHTML + segsHTML + toolbarHTML + groupsHTML;
    _attachListener($c);
  }

  /* ─────────────────────────────────────────────
     RENDER SINGLE ITEM CARD
  ───────────────────────────────────────────── */
  function _renderItem(r, cls) {
    const isDone   = r.status === 'done';
    const today    = TODAY();
    const daysOver = r.nextReview < today ? Math.ceil((new Date(today) - new Date(r.nextReview)) / 86400000) : 0;
    const nextLabel = r.nextReview ? _fmtDate(r.nextReview) : '';
    const icon  = { block:'📅', topic:'📖', error:'✏️', manual:'🔖', revisao:'🔁' }[r.type] || '📌';
    const label = { block:'Bloco', topic:'Tópico', error:'Erro', manual:'Manual', revisao:'Revisão' }[r.type] || r.type;

    const stepColors = ['var(--red)','var(--blue)','var(--gold)','var(--green)'];
    const stepLabels = ['1d','7d','15d','30d'];
    const step = Math.min(_ladderStep(r), 3);
    const stepColor = stepColors[step];
    const stepLabel = stepLabels[step];

    // ── Expandable roteiro ────────────────────────────────────────────────
    const roteiro    = Array.isArray(r.roteiro) ? r.roteiro : [];

    const expandContent = roteiro.length > 0 ? `
      <div class="ri-expand-panel" id="rot-${r.id}" style="display:none">
        <div class="ri-rot-title">📋 O que revisar:</div>
        <ol class="ri-rot-list">${roteiro.map(s => `<li>${s}</li>`).join('')}</ol>
      </div>` : '';

    // ── Rating buttons — original sm2-btn style ───────────────────────────
    const ratingHTML = isDone
      ? `<div class="rev-item-actions">
           <div class="rev-item-next-date" style="color:var(--green)">✅ Dominado ${r.doneAt||''}</div>
           <button class="ri-action-btn restore" data-restore="${r.id}">↩ Reverter</button>
           <button class="ri-action-btn delete"  data-delete="${r.id}">🗑</button>
         </div>`
      : (() => {
          // Próximo intervalo dinâmico baseado no step atual (sistema 1/7/15/30)
          const curL = _ladderStep(r);
          const nx = (q) => {
            if (q === 0) return LADDER[0];
            if (q === 1) return LADDER[Math.min(LADDER.length-1, curL+1)];
            if (q === 2) return LADDER[Math.min(LADDER.length-1, curL+2)];
            return LADDER[LADDER.length-1];
          };
          return `<div class="rev-item-actions">
           <div class="rev-sm2-row">
             <button class="rev-sm2-btn again"  data-rev-id="${r.id}" data-rev-q="0" title="Não lembrei — voltar ao início"><span class="rsb-label">Errei</span><span class="rsb-days">${nx(0)}d</span></button>
             <button class="rev-sm2-btn medium" data-rev-id="${r.id}" data-rev-q="1" title="Lembrei — avançar 1 passo"><span class="rsb-label">Bom</span><span class="rsb-days">${nx(1)}d</span></button>
             <button class="rev-sm2-btn easy"   data-rev-id="${r.id}" data-rev-q="2" title="Tranquilo — avançar 2 passos"><span class="rsb-label">Ótimo</span><span class="rsb-days">${nx(2)}d</span></button>
             <button class="rev-sm2-btn master" data-rev-id="${r.id}" data-rev-q="3" title="Dominei — máximo 30d"><span class="rsb-label">Dominei</span><span class="rsb-days">${nx(3)}d</span></button>
           </div>
           <div class="rev-item-next-date">→ ${nextLabel} · atual ${stepLabel}${r.reps>0?' · '+r.reps+'×':''}</div>
         </div>`;
        })();

    // ── split subtitle → disciplina + fonte ──────────────────────────────
    const subParts  = (r.subtitle || '').split('·').map(s => s.trim());
    const disciplina = subParts[0] || '';
    const fonte      = subParts.slice(1).join(' · ');
    const discShort  = disciplina.replace(/^noções de\s+/i, '').replace(/^noção de\s+/i, '');

    // ── accent color: usa cor da disciplina no Ciclo/Edital ───────────────
    const _h2rgb = hex => {
      if (!hex || hex.startsWith('var(')) return null;
      const h = hex.replace('#','');
      return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
    };
    const cicloMap   = (typeof CicloEstudos !== 'undefined' && CicloEstudos.getColorMap) ? CicloEstudos.getColorMap() : {};
    const discHex    = disciplina ? (cicloMap[disciplina] || null) : null;
    const discRGB    = discHex ? _h2rgb(discHex) : null;
    const accentMap  = { revisao:'167,139,250', error:'255,77,77', topic:'77,159,255', manual:'232,184,75', block:'232,184,75' };
    const accentRGB  = discRGB || accentMap[r.type] || '255,255,255';
    const discColor  = discHex || `rgb(${accentMap[r.type] || '255,255,255'})`;

    // ── progress bar width (step 0-3 → 0/33/66/100%) ─────────────────────
    const progressPct = [0, 33, 66, 100][step] || 0;

    if (isDone) {
      return `
      <div class="ri-card ri-card--done" id="ri-${r.id}" style="--acc:${accentRGB}">
        <div class="ri-accent-bar"></div>
        <div class="ri-card-inner">
          <div class="ri-top-row">
            <div class="ri-disc-line">
              <span class="ri-disc-name" style="color:${discColor}">${discShort || label}</span>
              ${fonte ? `<span class="ri-fonte-tag">${icon} ${fonte}</span>` : `<span class="ri-fonte-tag">${icon} ${label}</span>`}
            </div>
            <div class="ri-top-actions">
              <button class="ri-ghost-btn" data-restore="${r.id}">↩ Reverter</button>
              <button class="ri-ghost-btn ri-ghost-btn--danger" data-delete="${r.id}">🗑</button>
            </div>
          </div>
          <div class="ri-topic-text">${r.title||'—'}</div>
          <div class="ri-done-stamp">✅ Concluída em ${r.doneAt||'—'}</div>
        </div>
      </div>`;
    }

    const curL = _ladderStep(r);
    const nx = (q) => {
      if (q === 0) return LADDER[0];
      if (q === 1) return LADDER[Math.min(LADDER.length-1, curL+1)];
      if (q === 2) return LADDER[Math.min(LADDER.length-1, curL+2)];
      return LADDER[LADDER.length-1];
    };

    return `
    <div class="ri-card ri-card--active ${daysOver>0?'ri-card--overdue':''}" id="ri-${r.id}" style="--acc:${accentRGB}">
      <div class="ri-accent-bar"></div>
      <div class="ri-card-inner">

        <!-- disciplina + ações -->
        <div class="ri-top-row">
          <div class="ri-disc-line">
            <span class="ri-disc-name" style="color:${discColor}">${discShort || label}</span>
            ${fonte ? `<span class="ri-fonte-tag">${icon} ${fonte}</span>` : `<span class="ri-fonte-tag">${icon} ${label}</span>`}
            ${daysOver>0 ? `<span class="ri-overdue-pill">⚠ ${daysOver}d atraso</span>` : ''}
          </div>
          <div class="ri-top-actions">
            ${roteiro.length > 0 ? `<button class="ri-ghost-btn" data-expand="${r.id}" title="Roteiro">📋</button>` : ''}
            ${step > 0 ? `<button class="ri-ghost-btn ri-ghost-btn--revert" data-revert="${r.id}" title="Reverter para ${LADDER[Math.max(0,step-1)]}d">↩ ${LADDER[Math.max(0,step-1)]}d</button>` : ''}
            <button class="ri-ghost-btn ri-ghost-btn--danger" data-delete="${r.id}" title="Remover">🗑</button>
          </div>
        </div>

        <!-- tópico -->
        <div class="ri-topic-text">${r.title||'—'}</div>

        ${expandContent}

        <!-- progresso SM-2 -->
        <div class="ri-progress-track">
          <div class="ri-progress-fill" style="width:${progressPct}%"></div>
        </div>

        <!-- footer: chips + próxima data -->
        <div class="ri-footer">
          <div class="ri-rating-chips">
            <button class="ri-chip ri-chip--again"  data-rev-id="${r.id}" data-rev-q="0" title="Errei">${nx(0)}d</button>
            <button class="ri-chip ri-chip--medium" data-rev-id="${r.id}" data-rev-q="1" title="Bom">${nx(1)}d</button>
            <button class="ri-chip ri-chip--easy"   data-rev-id="${r.id}" data-rev-q="2" title="Ótimo">${nx(2)}d</button>
            <button class="ri-chip ri-chip--master" data-rev-id="${r.id}" data-rev-q="3" title="Dominei">${nx(3)}d</button>
            <button class="ri-chip ri-chip--finish" data-dismiss="${r.id}" title="Finalizar matéria">✅</button>
          </div>
          <div class="ri-next-info">
            <span class="ri-next-date">→ ${nextLabel}</span>
            ${r.reps>0 ? `<span class="ri-reps-badge">${r.reps}×</span>` : ''}
          </div>
        </div>

      </div>
    </div>`;
  }


  /* ─────────────────────────────────────────────
     EVENT DELEGATION
  ───────────────────────────────────────────── */
  function _attachListener($c) {
    if ($c._revAttached) return;
    $c._revAttached = true;
    $c.addEventListener('click', function _handler(e) {
      // Rating buttons
      const rateBtn = e.target.closest('[data-rev-id]');
      if (rateBtn) {
        e.stopPropagation();
        const id = rateBtn.getAttribute('data-rev-id');
        const q  = parseInt(rateBtn.getAttribute('data-rev-q'), 10);
        if (id && !isNaN(q)) {
          rateBtn.disabled = true;
          rateBtn.closest('.ri-card')?.classList.add('rating-fade');
          rateItem(id, q);
        }
        return;
      }

      // Expand/collapse (body click or expand btn)
      const expandEl = e.target.closest('[data-expand]');
      if (expandEl && !e.target.closest('[data-rev-id]') && !e.target.closest('[data-delete]') && !e.target.closest('[data-note]')) {
        const id  = expandEl.getAttribute('data-expand');
        const rot = document.getElementById('rot-' + id);
        const btn = document.querySelector(`#ri-${id} .ri-expand-btn`);
        if (rot) {
          const open = rot.style.display === 'none';
          rot.style.display = open ? 'block' : 'none';
          if (btn) btn.textContent = open ? '▴' : '▾';
        }
        return;
      }

      // Delete
      const delBtn = e.target.closest('[data-delete]');
      if (delBtn) {
        const id = delBtn.getAttribute('data-delete');
        if (confirm('Remover este item da fila de revisão?')) deleteItem(id);
        return;
      }

      // Restore
      const restBtn = e.target.closest('[data-restore]');
      if (restBtn) { restoreItem(restBtn.getAttribute('data-restore')); return; }

      // Revert (voltar um step)
      const revertBtn = e.target.closest('[data-revert]');
      if (revertBtn) {
        revertBtn.closest('.ri-card')?.classList.add('rating-fade');
        revertItem(revertBtn.getAttribute('data-revert'));
        return;
      }

      // Dismiss (Finalizar matéria)
      const dismissBtn = e.target.closest('[data-dismiss]');
      if (dismissBtn) {
        const id = dismissBtn.getAttribute('data-dismiss');
        dismissBtn.closest('.ri-card')?.classList.add('rating-fade');
        dismiss(id);
        return;
      }

      // Section tabs and timeline cards
      const secEl = e.target.closest('[data-sec]');
      if (secEl) {
        const id = secEl.getAttribute('data-sec');
        toggleSection(id);
        return;
      }

      // Type filter chips
      const filterChip = e.target.closest('[data-filter]');
      if (filterChip) { setFilter(filterChip.getAttribute('data-filter')); return; }
    });
  }

  /* ─────────────────────────────────────────────
     SESSION (kept for compatibility)
  ───────────────────────────────────────────── */
  let _session = { items: [], idx: 0, results: { easy:0, medium:0, hard:0, again:0 } };

  function startSession(group) {
    const today = TODAY();
    let items = _load().filter(r => r.status === 'pending' && r.nextReview <= today);
    if (group === 'overdue') items = items.filter(r => r.nextReview < today);
    if (group === 'today')   items = items.filter(r => r.nextReview === today);
    if (!items.length) { _toast('Nenhum item para revisar', '✅'); return; }
    setViewSection(group === 'overdue' ? 'overdue' : 'today');
    render();
  }

  function startSessionGroup(cls) { startSession(cls); }

  function sessionRate(quality) {
    const { items, idx } = _session;
    if (idx >= items.length) return;
    rateItem(items[idx].id, quality);
    _session.idx++;
  }

  function closeSession() { render(); _updateBadge(); }

  /* ─────────────────────────────────────────────
     TOAST
  ───────────────────────────────────────────── */
  function _toast(msg, icon) {
    const t = document.createElement('div');
    t.className = 'ob-toast';
    t.innerHTML = `<span class="ob-toast-icon">${icon}</span><div><strong>${msg}</strong></div>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('ob-toast-show')));
    setTimeout(() => { t.classList.remove('ob-toast-show'); setTimeout(() => t.remove(), 500); }, 3000);
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  function init() { collectUncompleted(); _updateBadge(); }

return {
    isMarked, toggleMark, rateItem, dismiss, clearDone, deleteItem, restoreItem, revertItem,
    collectUncompleted, getDueCount, render, init,
    addManualItem, scheduleManual, setFilter, setSort, setSearch, setLadderView, setViewSection, toggleSection,
    startSession, startSessionGroup, sessionRate, closeSession,
    getRetentionScore, getPriorityQueue,
  };
})();


/* ════════════════════════════════════════════════
   CONFIG PANEL — Drawer lateral premium
════════════════════════════════════════════════ */
const ConfigPanel = (() => {

  const API_KEY_STORE = 'nexus_api_key';
  let _intensity = 'normal';
  let _turno     = 'integral';

  function open() {
    _fill();
    document.getElementById('cfg-backdrop')?.classList.add('open');
    document.getElementById('cfg-drawer')?.classList.add('open');
    switchTab('concurso', document.querySelector('[data-tab="concurso"]'));
  }

  function close() {
    document.getElementById('cfg-backdrop')?.classList.remove('open');
    document.getElementById('cfg-drawer')?.classList.remove('open');
  }

  function switchTab(tab, el) {
    document.querySelectorAll('.cfg-drawer-tab').forEach(t => t.classList.toggle('active', t === el));
    document.querySelectorAll('.cfg-tab-panel').forEach(p => p.classList.toggle('active', p.id === 'cfg-tab-' + tab));
    if (tab === 'metas')  _updateMetaPreview();
    if (tab === 'dados')  _updateStorageInfo();
  }

  function _fill() {
    // Config
    const cfg  = State.get('config') || {};
    const goals = JSON.parse(localStorage.getItem('nexus_goals_v1') || '{}');
    const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;

    const _sf = (id, v) => { const e = document.getElementById(id); if (e && v != null) e.value = v; };
    _sf('cfg2-name',  cfg.examName  || edData?.concurso?.nome  || '');
    _sf('cfg2-board', cfg.examBoard || edData?.concurso?.banca || '');
    _sf('cfg2-date',  cfg.examDate  || edData?.concurso?.dataProva || '');
    _sf('cfg2-start', cfg.startDate || '');
    _sf('cfg2-days',  cfg.totalDays || '');

    // Goals
    _sf('cfg2-horas-meta',    goals.horasMeta    || 20);
    _sf('cfg2-questoes-meta', goals.questoesMeta || 300);
    _sf('cfg2-dias-semana',   goals.diasSemana   || 5);
    _sf('cfg2-horas-dia',     goals.horasDia     || 4);

    // Intensity
    _intensity = cfg.intensity || _autoIntensity(cfg.examDate);
    document.querySelectorAll('[data-intensity]').forEach(c => {
      c.classList.toggle('active', c.dataset.intensity === _intensity);
    });
    _updateIntensityHint();

    // Turno
    const profile = (typeof Onboarding !== 'undefined') ? Onboarding.getUserProfile() : null;
    _turno = edData?.disponibilidade?.turno || profile?.disponibilidade?.turno || 'integral';
    document.querySelectorAll('[data-turno]').forEach(c => {
      c.classList.toggle('active', c.dataset.turno === _turno);
    });

    // API key
    const apiKey = localStorage.getItem(API_KEY_STORE) || '';
    const $k = document.getElementById('cfg2-api-key');
    if ($k) $k.value = apiKey;
    _updateApiStatus(apiKey);

    // Date preview
    onDateChange();
  }

  function _autoIntensity(examDate) {
    if (!examDate) return 'normal';
    const days = Math.ceil((new Date(examDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000);
    return days < 20 ? 'intensivo' : days > 60 ? 'tranquilo' : 'normal';
  }

  function onDateChange() {
    const val = document.getElementById('cfg2-date')?.value;
    const $p  = document.getElementById('cfg2-days-preview');
    if (!$p) return;
    if (!val) { $p.textContent = ''; return; }
    const days = Math.ceil((new Date(val).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000);
    const clr  = days < 7 ? 'var(--red)' : days < 30 ? 'var(--orange)' : days < 60 ? 'var(--gold)' : 'var(--green)';
    $p.innerHTML = `<span style="color:${clr};font-weight:700">${days} dias restantes</span>${days < 20 ? ' — modo intensivo recomendado' : days > 60 ? ' — fase preparatória' : ' — foco total'}`;
    // Auto-set days field if empty
    const $d = document.getElementById('cfg2-days'); if ($d && !$d.value) $d.value = Math.max(1, days);
    // Auto-set intensity
    const newInt = _autoIntensity(val);
    setIntensity(newInt, document.querySelector(`[data-intensity="${newInt}"]`));
  }

  function setIntensity(val, el) {
    _intensity = val;
    document.querySelectorAll('[data-intensity]').forEach(c => c.classList.toggle('active', c.dataset.intensity === val));
    _updateIntensityHint();
  }

  function _updateIntensityHint() {
    const $h = document.getElementById('cfg2-intensity-hint');
    if (!$h) return;
    const hints = {
      tranquilo: '🌱 Ritmo sustentável — revisões diárias leves, sem pressão excessiva. Bom para quem estuda em paralelo ao trabalho.',
      normal:    '⚡ Foco total — sessões de 4-6h/dia, cronograma estruturado. Recomendado para a maioria dos concurseiros.',
      intensivo: '🔥 Máximo esforço — imersão total, 6-10h/dia. Use quando a prova está próxima e há lacunas críticas a fechar.',
    };
    $h.textContent = hints[_intensity] || '';
  }

  function setTurno(val, el) {
    _turno = val;
    document.querySelectorAll('[data-turno]').forEach(c => c.classList.toggle('active', c.dataset.turno === val));
  }

  function _updateMetaPreview() {
    const $p = document.getElementById('cfg2-meta-preview');
    if (!$p) return;
    const hm = parseFloat(document.getElementById('cfg2-horas-meta')?.value) || 20;
    const qm = parseInt(document.getElementById('cfg2-questoes-meta')?.value) || 300;
    const dm = parseInt(document.getElementById('cfg2-dias-semana')?.value) || 5;
    const hd = parseFloat(document.getElementById('cfg2-horas-dia')?.value) || 4;
    $p.innerHTML = `
      📊 <strong style="color:var(--text-primary)">${hm}h/semana</strong> = ${(hm/dm).toFixed(1)}h por dia de estudo<br>
      📝 <strong style="color:var(--text-primary)">${qm} questões/semana</strong> = ${Math.round(qm/dm)} questões por dia<br>
      📅 Estudando <strong style="color:var(--text-primary)">${dm} dias/semana</strong> · ${hd}h/dia configuradas`;
  }

  function onApiKeyInput(val) {
    localStorage.setItem(API_KEY_STORE, val.trim());
    // Sync all other API key fields
    ['ef-api-key','sch-api-key','fc-gen-api-key'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = val.trim();
    });
    _updateApiStatus(val.trim());
    const $r = document.getElementById('cfg2-api-test-result'); if ($r) $r.style.display='none';
  }

  function _updateApiStatus(val) {
    const $s = document.getElementById('cfg2-api-status');
    if (!$s) return;
    if (!val) { $s.textContent = ''; return; }
    if (val.startsWith('sk-ant-')) {
      $s.textContent = '✓ Formato válido'; $s.style.color = 'var(--green)';
    } else {
      $s.textContent = '⚠ Verifique'; $s.style.color = 'var(--orange)';
    }
  }

  async function testApiKey() {
    const key = localStorage.getItem(API_KEY_STORE) || '';
    const $r  = document.getElementById('cfg2-api-test-result');
    if (!$r) return;
    if (!key) { $r.style.display='block'; $r.style.background='rgba(255,77,77,0.08)'; $r.style.borderLeft='3px solid var(--red)'; $r.style.color='var(--text-muted)'; $r.textContent='❌ Nenhuma chave configurada.'; return; }
    $r.style.display='block'; $r.style.background='var(--surface-2)'; $r.style.borderLeft='3px solid var(--gold)'; $r.style.color='var(--text-muted)'; $r.textContent='🔄 Testando conexão...';
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body: JSON.stringify({ model:'claude-haiku-4-5-20251001', max_tokens:10, messages:[{role:'user',content:'ok'}] }),
      });
      if (resp.ok || resp.status === 400) {
        $r.style.background='rgba(46,204,113,0.08)'; $r.style.borderLeft='3px solid var(--green)';
        $r.innerHTML='✅ <strong style="color:var(--green)">Conexão estabelecida!</strong> A chave está funcionando corretamente.';
      } else if (resp.status === 401) {
        $r.style.background='rgba(255,77,77,0.08)'; $r.style.borderLeft='3px solid var(--red)';
        $r.innerHTML='❌ <strong style="color:var(--red)">Chave inválida</strong> — verifique em console.anthropic.com';
      } else {
        $r.textContent = '⚠ Status ' + resp.status + ' — tente novamente.';
      }
    } catch(e) {
      $r.style.background='rgba(255,140,66,0.08)'; $r.style.borderLeft='3px solid var(--orange)';
      $r.textContent = '⚠ Erro de rede: ' + e.message;
    }
  }

  function _updateStorageInfo() {
    const $i = document.getElementById('cfg2-storage-info');
    if (!$i) return;
    let total = 0;
    for (let k in localStorage) { if (k.startsWith('nexus')) total += (localStorage[k]?.length||0); }
    const kb = (total / 1024).toFixed(1);
    $i.textContent = `💾 ${kb} KB usados no localStorage do navegador`;
  }

  function exportData() {
    const keys = ['nexus_study_v1','nexus_sessions_v1','nexus_schedule_v1','nexus_edital_v2',
                  'nexus_onboarding_profile','nexus_reviews_v1','nexus_goals_v1','nexus_ai_content_v1','nexus_api_key',
                  'nexus_caderno_v1','nexus_err_topics_v1'];
    const data = {};
    keys.forEach(k => { const v = localStorage.getItem(k); if (v) data[k] = v; });
    data._exportedAt = new Date().toISOString();
    data._version    = 'nexus-v6';
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nexus-backup-${_localDateStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    _showToast('✅ Backup exportado com sucesso!', 'var(--green)');
  }

  function importData(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const $r = document.getElementById('cfg2-import-result');
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data._version?.startsWith('nexus')) throw new Error('Arquivo inválido');
        let restored = 0;
        Object.entries(data).forEach(([k, v]) => {
          if (k.startsWith('nexus') && typeof v === 'string') { localStorage.setItem(k, v); restored++; }
        });
        if ($r) { $r.style.display='block'; $r.style.background='rgba(46,204,113,0.08)'; $r.style.border='1px solid rgba(46,204,113,0.2)'; $r.style.borderRadius='8px'; $r.style.color='var(--text-muted)'; $r.innerHTML=`✅ <strong style="color:var(--green)">${restored} registros restaurados.</strong> Recarregando...`; }
        setTimeout(() => location.reload(), 1500);
      } catch(e) {
        if ($r) { $r.style.display='block'; $r.style.background='rgba(255,77,77,0.08)'; $r.style.border='1px solid rgba(255,77,77,0.2)'; $r.style.borderRadius='8px'; $r.style.color='var(--red)'; $r.textContent='❌ Erro: ' + e.message; }
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function clearCache() {
    ['nexus_sched_version','nexus_visited'].forEach(k => localStorage.removeItem(k));
    _showToast('✅ Cache limpo — recarregando...', 'var(--green)');
    setTimeout(() => location.reload(), 1200);
  }

  function save() {
    const cfg = {
      examName:  document.getElementById('cfg2-name')?.value.trim()  || '',
      examBoard: document.getElementById('cfg2-board')?.value.trim() || '',
      examDate:  document.getElementById('cfg2-date')?.value  || null,
      startDate: document.getElementById('cfg2-start')?.value || null,
      totalDays: parseInt(document.getElementById('cfg2-days')?.value || '90'),
      intensity: _intensity,
      turno:     _turno,
    };
    State.set('config', cfg);

    // Save goals
    const goals = {
      horasMeta:    parseFloat(document.getElementById('cfg2-horas-meta')?.value) || 20,
      questoesMeta: parseInt(document.getElementById('cfg2-questoes-meta')?.value) || 300,
      diasSemana:   parseInt(document.getElementById('cfg2-dias-semana')?.value)  || 5,
      horasDia:     parseFloat(document.getElementById('cfg2-horas-dia')?.value)  || 4,
    };
    localStorage.setItem('nexus_goals_v1', JSON.stringify(goals));

    close();
    if (typeof App !== 'undefined') App.refreshAll();
    _showToast('✅ Configurações salvas!', 'var(--green)');
  }

  function _showToast(msg, color) {
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:${color}18;border:1px solid ${color}40;color:${color};padding:11px 22px;border-radius:12px;font-size:12px;font-weight:700;z-index:99999;pointer-events:none;box-shadow:0 8px 32px rgba(0,0,0,0.4)`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  return { open, close, switchTab, onDateChange, setIntensity, setTurno,
           onApiKeyInput, testApiKey, exportData, importData, clearCache, save };
})();

/* ── Topbar timer updater ── */
(function _initTopbarTimer() {
  let _topbarInterval = null;

  function _updateTopbarTimer() {
    const $btn = document.getElementById('topbar-timer-btn');
    const $lbl = document.getElementById('topbar-timer-label');
    const $dot = document.getElementById('topbar-timer-dot');
    if (!$btn) return;

    // Read timer state from StudyTimer if available
    const isRunning = typeof StudyTimer !== 'undefined' && StudyTimer._pendingElapsed > 0;
    // Read elapsed from the mini player badge which is always up to date
    const $badge = document.getElementById('timer-badge-label');
    const elapsed = $badge?.textContent || '';

    // Check if there's a session today
    const today = _localDateStr();
    const sessions = JSON.parse(localStorage.getItem('nexus_sessions_v1') || '[]');
    const todaySecs = sessions.filter(s=>s.data===today).reduce((a,s)=>a+(s.tempoSecs||0),0);
    const todayH = Math.floor(todaySecs/3600);
    const todayM = Math.floor((todaySecs%3600)/60);

    if (elapsed && elapsed !== '00:00') {
      // Timer is actively running
      $btn.classList.remove('idle');
      if ($lbl) $lbl.textContent = elapsed;
      if ($dot) { $dot.style.background='var(--green)'; $dot.style.boxShadow='0 0 6px var(--green)'; }
    } else if (todaySecs > 0) {
      // Has sessions today but timer not running
      $btn.classList.add('idle');
      if ($lbl) $lbl.textContent = `${todayH}h${String(todayM).padStart(2,'0')}m hoje`;
      if ($dot) { $dot.style.background='var(--blue)'; $dot.style.boxShadow='0 0 5px var(--blue)'; }
    } else {
      // No session yet
      $btn.classList.add('idle');
      if ($lbl) $lbl.textContent = 'Iniciar Estudo';
      if ($dot) { $dot.style.background='var(--text-dim)'; $dot.style.boxShadow='none'; }
    }
  }

  // Update every 5 seconds
  document.addEventListener('DOMContentLoaded', () => {
    _updateTopbarTimer();
    _topbarInterval = setInterval(_updateTopbarTimer, 5000);
  });

  // Also update when timer state changes (listen to storage)
  window.addEventListener('storage', e => { if (e.key?.startsWith('nexus')) _updateTopbarTimer(); });
  // Expose for manual call
  window._updateTopbarTimer = _updateTopbarTimer;
})();

// Boot
(function() {
  var hasProfile = false;
  try {
    var saved = localStorage.getItem('nexus_onboarding_profile');
    hasProfile = !!(saved && JSON.parse(saved));
  } catch(e) {}
  window._nexusNewContestMode = !hasProfile;
})();

/* ═══════════════════════════════════════════════════════════
   NEXUS RESET — "Novo Concurso"
   Wipes ALL local app data + remote cloud snapshot,
   then reloads the app to restart onboarding from scratch.
═══════════════════════════════════════════════════════════ */
const NexusReset = (() => {
  const STORAGE_PREFIX = 'nexus';
  let _modalEl = null;

  function _wipeLocal() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        // preserve Supabase auth tokens (sb-*, supabase.*) — only clear app data
        if (k && (k.startsWith(STORAGE_PREFIX) || k === 'dashboard')) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
      // also wipe sessionStorage app keys
      const skeys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) skeys.push(k);
      }
      skeys.forEach(k => sessionStorage.removeItem(k));
    } catch (e) { console.error('[NexusReset] wipe local fail', e); }
  }

  function _notifyParent() {
    try {
      window.parent?.postMessage({ type: 'nexus:reset' }, '*');
    } catch (e) {}
  }

  function _closeModal() {
    if (_modalEl) { _modalEl.remove(); _modalEl = null; }
  }

  function show() {
    if (_modalEl) return;
    const el = document.createElement('div');
    el.className = 'nx-reset-overlay';
    el.innerHTML = `
      <div class="nx-reset-modal" role="dialog" aria-modal="true">
        <div class="nx-reset-icon">⚠️</div>
        <h2 class="nx-reset-title">Resetar para Novo Concurso?</h2>
        <p class="nx-reset-desc">
          Esta ação <strong>apagará permanentemente TODOS os seus dados</strong>:
          edital, cronograma, sessões de estudo, revisões, flashcards, caderno de erros,
          questões, metas e configurações.
          <br><br>
          Você voltará ao fluxo inicial de onboarding e poderá configurar tudo do zero,
          sem reaproveitar nada.
          <br><br>
          <span class="nx-reset-warn">Esta ação <u>não pode ser desfeita</u>.</span>
        </p>
        <div class="nx-reset-confirm">
          <label class="nx-reset-label">Para confirmar, digite <b>RESETAR</b>:</label>
          <input type="text" class="nx-reset-input" id="nx-reset-input" autocomplete="off" placeholder="RESETAR" />
        </div>
        <div class="nx-reset-actions">
          <button class="nx-reset-btn cancel" id="nx-reset-cancel">Cancelar</button>
          <button class="nx-reset-btn danger" id="nx-reset-go" disabled>🔄 Resetar Tudo</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    _modalEl = el;
    const $input = el.querySelector('#nx-reset-input');
    const $go = el.querySelector('#nx-reset-go');
    const $cancel = el.querySelector('#nx-reset-cancel');
    $input.addEventListener('input', () => {
      $go.disabled = $input.value.trim().toUpperCase() !== 'RESETAR';
    });
    $cancel.addEventListener('click', _closeModal);
    el.addEventListener('click', (e) => { if (e.target === el) _closeModal(); });
    $go.addEventListener('click', () => {
      $go.disabled = true;
      $go.textContent = 'Resetando...';
      _wipeLocal();
      // Wait for parent to confirm remote wipe before reloading,
      // otherwise hydrate may restore the old snapshot from cloud.
      let done = false;
      const onAck = (ev) => {
        if (ev?.data?.type === 'nexus:reset:done') {
          done = true;
          window.removeEventListener('message', onAck);
          window.location.reload();
        }
      };
      window.addEventListener('message', onAck);
      _notifyParent();
      // Fallback: reload anyway after 4s if parent never acks
      setTimeout(() => { if (!done) { window.removeEventListener('message', onAck); window.location.reload(); } }, 4000);
    });
    setTimeout(() => $input?.focus(), 50);
  }

  return { show, showModal: show };
})();
window.NexusReset = NexusReset;
/* ════════════════════════════════════════════════
   CICLO DE ESTUDOS — Rotação por horas + cronograma semanal
   IA via /api/ciclo-estudos (Lovable AI Gateway · Gemini 2.5 Pro)
════════════════════════════════════════════════ */
const CicloEstudos = (() => {
  const KEY = 'nexus_ciclo_v1';
  const DIAS = [
    { id:'segunda', label:'Missão 1' },{ id:'terca', label:'Missão 2' },
    { id:'quarta', label:'Missão 3' },{ id:'quinta', label:'Missão 4' },
    { id:'sexta', label:'Missão 5' },{ id:'sabado', label:'Missão 6' },
    { id:'domingo', label:'Missão 7' },
  ];
  const PALETTE = ['#4D9FFF','#E8B84B','#2ECC71','#FF8C42','#A78BFA','#FF4D4D','#00CEC9','#FD79A8','#F9CA24','#6C5CE7','#00B894','#E17055','#74B9FF','#FDCB6E','#55EFC4','#E84393'];
  let _view = 'horas'; // horas | semanal
  const _expanded = {}; // { 'segunda::Disc': true }
  const EXP_KEY = 'nexus_ciclo_expanded_v1';

  function _normKey(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }
  function _topicosFor(discNome) {
    try {
      const ed = (typeof EditalEngine!=='undefined') ? EditalEngine.getData() : null;
      const list = ed?.disciplinas || [];
      const k = _normKey(discNome);
      const d = list.find(x => _normKey(x.nome) === k)
             || list.find(x => _normKey(x.nome).includes(k) || k.includes(_normKey(x.nome)));
      return (d?.topicos || []).map(t => ({ id: t.id || _normKey(t.texto).slice(0,40), texto: t.texto }));
    } catch { return []; }
  }
  function _ensureProg(d){ if(!d.topicProgress) d.topicProgress = {}; return d.topicProgress; }

  function _load() { try { return JSON.parse(localStorage.getItem(KEY)||'null'); } catch { return null; } }
  function _save(d){ try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
  function _loadExp() { try { return JSON.parse(localStorage.getItem(EXP_KEY)||'{}'); } catch { return {}; } }
  function _saveExp() { try { localStorage.setItem(EXP_KEY, JSON.stringify(_expanded)); } catch {} }
  (function _initExp(){ Object.assign(_expanded, _loadExp()); })();
  function _color(i){ return PALETTE[i % PALETTE.length]; }
  function _esc(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function render() {
    const $r = document.getElementById('ciclo-root');
    if (!$r) return;
    const data = _load();
    if (!data || !data.blocos || !data.blocos.length) {
      $r.innerHTML = _emptyHTML();
      return;
    }
    const prevTrack = document.getElementById('ciclo-week-track');
    const prevScroll = prevTrack ? prevTrack.scrollLeft : 0;
    const prevInlineTrack = document.getElementById('ciclo-week-inline-track');
    const prevInlineScroll = prevInlineTrack ? prevInlineTrack.scrollLeft : 0;
    $r.innerHTML = _cicloHTML(data);
    const nextTrack = document.getElementById('ciclo-week-track');
    if (nextTrack && prevScroll) nextTrack.scrollLeft = prevScroll;
    const nextInlineTrack = document.getElementById('ciclo-week-inline-track');
    if (nextInlineTrack && prevInlineScroll) nextInlineTrack.scrollLeft = prevInlineScroll;
  }

  function _emptyHTML() {
    const ed = (typeof EditalEngine!=='undefined') ? EditalEngine.getData() : null;
    const hasEdital = ed && ed.disciplinas && ed.disciplinas.length;
    return `
      <div class="ciclo-empty">
        <div class="ciclo-hero">
          <div class="ciclo-hero-eyebrow">FERRAMENTA · ROTAÇÃO INTELIGENTE</div>
          <h1 class="ciclo-hero-title">CICLO DE ESTUDOS</h1>
          <p class="ciclo-hero-sub">Método consagrado para concursos: rotacione disciplinas por horas, dê mais peso ao que importa e nunca mais fique parado em uma matéria. <strong>Gere com IA</strong> a partir do seu edital ou <strong>configure manualmente</strong>.</p>
          <div class="ciclo-hero-feats">
            <span class="ciclo-feat">⏱️ Por horas</span>
            <span class="ciclo-feat">📅 Cronograma semanal</span>
            <span class="ciclo-feat">⚖️ Pesos do edital</span>
            <span class="ciclo-feat">✓ Marcar concluído</span>
          </div>
          <div class="ciclo-hero-actions">
            <button class="ciclo-btn-primary" onclick="CicloEstudos.openAIModal()" ${!hasEdital?'disabled title="Configure seu edital primeiro"':''}>
              ✨ Gerar com IA
            </button>
            <button class="ciclo-btn-secondary" onclick="CicloEstudos.openManual()">✏️ Configurar Manual</button>
          </div>
          ${!hasEdital ? `<div class="ciclo-warn">⚠️ Configure seu edital em <a href="#" onclick="Router.go('curriculum');return false">Edital Completo</a> para liberar a geração com IA.</div>`:''}
        </div>
      </div>`;
  }

  function _cicloHTML(d) {
    const totalH = d.blocos.reduce((s,b)=>s+(+b.horas||0),0);
    const completedH = d.blocos.filter(b=>b.done).reduce((s,b)=>s+(+b.horas||0),0);
    const pct = totalH ? Math.round(completedH/totalH*100) : 0;
    const totalBlocos = d.blocos.length;
    const doneBlocos = d.blocos.filter(b=>b.done).length;
    const metaParts = [
      `⏱️ ${totalH}h totais`,
      `📦 ${totalBlocos} blocos`,
      completedH > 0 ? `✅ ${completedH}h concluídas (${pct}%)` : null,
    ].filter(Boolean).join(' · ');
    return `
      <div class="ciclo-wrap">
        <div class="cad-hero">
          <div>
            <div class="cad-hero-eyebrow">FERRAMENTA · ROTAÇÃO INTELIGENTE</div>
            <h1 class="cad-hero-title">${_esc((d.nome||'CICLO DE ESTUDOS').toUpperCase())}</h1>
            <p class="cad-hero-sub">${metaParts}</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
            <button class="edcv-btn edcv-btn-ghost" onclick="CicloEstudos.openAIModal()" title="Regenerar com IA">✨ Regenerar</button>
            <button class="edcv-btn edcv-btn-ghost" onclick="CicloEstudos.openManual()" title="Editar manualmente">✎ Editar</button>
            <button class="edcv-btn edcv-btn-danger" onclick="CicloEstudos.clear()">✕ Limpar</button>
          </div>
        </div>
        <div class="ciclo-progress"><div class="ciclo-progress-fill" style="width:${pct}%"></div></div>
        ${d.estrategia ? `<div class="ciclo-strategy">
          <div class="ciclo-strategy-text">💡 <strong>Estratégia:</strong> ${_esc(d.estrategia)}</div>
        </div>`:''}
        ${(() => {
          const stats = {};
          (d.blocos||[]).forEach(b => {
            if (!stats[b.disciplina]) stats[b.disciplina] = { blocos: 0, horas: 0, cor: b.cor || '#888' };
            stats[b.disciplina].blocos++;
            stats[b.disciplina].horas += b.horas || 0;
          });
          const cards = Object.entries(stats)
            .sort((a,b) => b[1].horas - a[1].horas)
            .map(([nome, s]) => {
              const pct = Math.round(s.horas / (d.totalHoras||1) * 100);
              const short = nome.replace(/^Noções de /i,'').replace(/^Legislação /i,'Leg. ');
              return `<div class="ciclo-disc-chip" style="--cc:${s.cor}">
                <div class="ciclo-disc-chip-bar" style="width:${pct}%"></div>
                <div class="ciclo-disc-chip-dot"></div>
                <div class="ciclo-disc-chip-name" title="${_esc(nome)}">${_esc(short)}</div>
                <div class="ciclo-disc-chip-stats">
                  <span class="ciclo-disc-chip-h">${s.horas}h</span>
                  <span class="ciclo-disc-chip-b">${s.blocos}×</span>
                </div>
              </div>`;
            }).join('');
          return `<div class="ciclo-disc-chips">${cards}</div>`;
        })()}
        ${_renderBlocos(d)}
      </div>`;
  }

  function _renderBlocos(d) {
    const cores = {};
    let i=0;
    d.blocos.forEach(b => { if(!cores[b.disciplina]) cores[b.disciplina] = b.cor || _color(i++); });
    const blocos = d.blocos.map((b,idx) => `
      <div class="ciclo-block ${b.done?'done':''}" style="--bc:${cores[b.disciplina]}">
        <div class="ciclo-block-num">${idx+1}</div>
        <div class="ciclo-block-body">
          <div class="ciclo-block-disc">${_esc(b.disciplina)}</div>
          ${b.topicoSugerido ? `<div class="ciclo-block-topic">${_esc(b.topicoSugerido)}</div>`:''}
        </div>
        <div class="ciclo-block-horas">${b.horas}h</div>
        <button class="ciclo-block-check" onclick="CicloEstudos.toggleDone(${idx})" title="${b.done?'Desmarcar':'Marcar como concluído'}">${b.done?'✓':'○'}</button>
      </div>`).join('');
    return `${_renderSemanalInline(d, cores)}<div class="ciclo-blocks">${blocos}</div>`;
  }

  function _renderSemanalInline(d, cores) {
    cores = cores || {};
    const sem = d.semanal || {};
    const prog = d.topicProgress || {};
    const cards = DIAS.map((dia, di) => {
      const blocos = sem[dia.id] || [];
      const totH = blocos.reduce((s,b)=>s+(+b.horas||0),0);
      const dayProg = prog[dia.id] || {};
      const body = blocos.length ? blocos.map((b, bi) => {
        const discKey = _normKey(b.disciplina);
        const expKey = `${dia.id}::${discKey}`;
        const isOpen = !!_expanded[expKey];
        const cor = cores[b.disciplina] || '#888';
        let tops = Array.isArray(b.topicos) && b.topicos.length
          ? b.topicos.map((t, ti) => {
              const txt = typeof t === 'string' ? t : (t.texto || t.text || '');
              const id  = (typeof t === 'object' && t.id) ? t.id : (_normKey(txt).slice(0,40) || ('t'+ti));
              return { id, texto: txt };
            })
          : _topicosFor(b.disciplina);
        const checks = dayProg[discKey] || {};
        const doneCount = tops.filter(t => checks[t.id]).length;
        const total = tops.length;
        const pct = total ? Math.round((doneCount/total)*100) : 0;
        return `
          <div class="ciclo-day-block ${isOpen?'open':''}" style="border-left:3px solid ${cor};">
            <button class="cdb-head" onmousedown="event.preventDefault()" onclick="CicloEstudos.toggleDisc('${dia.id}','${discKey}')">
              <span class="cdb-disc" title="${_esc(b.disciplina)}">${_esc(b.disciplina)}</span>
              <span class="cdb-meta">
                ${total ? `<span class="cdb-prog"><span class="cdb-prog-fill" style="width:${pct}%;background:${cor};"></span></span>
                          <span class="cdb-count">${doneCount}/${total}</span>` : ''}
                <span class="cdb-h" style="color:${cor};">${b.horas}h</span>
                <span class="cdb-caret">${isOpen?'▴':'▾'}</span>
              </span>
            </button>
            ${isOpen ? `
              <div class="cdb-topics">
                ${total ? tops.map(t => {
                  const on = !!checks[t.id];
                  return `<label class="cdb-topic ${on?'done':''}">
                    <input type="checkbox" ${on?'checked':''} onchange="CicloEstudos.toggleTopic('${dia.id}','${discKey}','${_esc(t.id)}')"/>
                    <span class="cdb-topic-box">${on?'✓':''}</span>
                    <span class="cdb-topic-txt">${_esc(t.texto)}</span>
                  </label>`;
                }).join('') : `<div class="cdb-empty">Nenhum tópico cadastrado para esta disciplina no edital.</div>`}
              </div>` : ''}
          </div>`;
      }).join('') : '<div class="ciclo-day-empty">Descanso</div>';
      return `
        <div class="ciclo-day" data-day-idx="${di}">
          <div class="ciclo-day-hd"><span>${dia.label}</span><span class="ciclo-day-tot">${totH}h</span></div>
          <div class="ciclo-day-body">${body}</div>
        </div>`;
    }).join('');
    return `
      <div class="ciclo-week-wrap ciclo-week-inline">
        <button class="ciclo-week-nav prev" onclick="CicloEstudos.scrollWeekInline(-1)" aria-label="Anterior">‹</button>
        <div class="ciclo-week" id="ciclo-week-inline-track">${cards}</div>
        <button class="ciclo-week-nav next" onclick="CicloEstudos.scrollWeekInline(1)" aria-label="Próximo">›</button>
      </div>`;
  }

  function _renderSemanal(d) {
    const sem = d.semanal || {};
    const prog = d.topicProgress || {};
    const cards = DIAS.map((dia, di) => {
      const blocos = sem[dia.id] || [];
      const totH = blocos.reduce((s,b)=>s+(+b.horas||0),0);
      const dayProg = prog[dia.id] || {};
      const body = blocos.length ? blocos.map((b, bi) => {
        const discKey = _normKey(b.disciplina);
        const expKey = `${dia.id}::${discKey}`;
        const isOpen = !!_expanded[expKey];
        // Prefer topics generated by AI for this slot; fallback to edital lookup
        let tops = Array.isArray(b.topicos) && b.topicos.length
          ? b.topicos.map((t, ti) => {
              const txt = typeof t === 'string' ? t : (t.texto || t.text || '');
              const id  = (typeof t === 'object' && t.id) ? t.id : (_normKey(txt).slice(0,40) || ('t'+ti));
              return { id, texto: txt };
            })
          : _topicosFor(b.disciplina);
        const checks = dayProg[discKey] || {};
        const doneCount = tops.filter(t => checks[t.id]).length;
        const total = tops.length;
        const pct = total ? Math.round((doneCount/total)*100) : 0;
        return `
          <div class="ciclo-day-block ${isOpen?'open':''}">
            <button class="cdb-head" onmousedown="event.preventDefault()" onclick="CicloEstudos.toggleDisc('${dia.id}','${discKey}')">
              <span class="cdb-disc" title="${_esc(b.disciplina)}">${_esc(b.disciplina)}</span>
              <span class="cdb-meta">
                ${total ? `<span class="cdb-prog"><span class="cdb-prog-fill" style="width:${pct}%"></span></span>
                          <span class="cdb-count">${doneCount}/${total}</span>` : ''}
                <span class="cdb-h">${b.horas}h</span>
                <span class="cdb-caret">${isOpen?'▴':'▾'}</span>
              </span>
            </button>
            ${isOpen ? `
              <div class="cdb-topics">
                ${total ? tops.map(t => {
                  const on = !!checks[t.id];
                  return `<label class="cdb-topic ${on?'done':''}">
                    <input type="checkbox" ${on?'checked':''} onchange="CicloEstudos.toggleTopic('${dia.id}','${discKey}','${_esc(t.id)}')"/>
                    <span class="cdb-topic-box">${on?'✓':''}</span>
                    <span class="cdb-topic-txt">${_esc(t.texto)}</span>
                  </label>`;
                }).join('') : `<div class="cdb-empty">Nenhum tópico cadastrado para esta disciplina no edital.</div>`}
              </div>` : ''}
          </div>`;
      }).join('') : '<div class="ciclo-day-empty">Descanso</div>';
      return `
        <div class="ciclo-day" data-day-idx="${di}">
          <div class="ciclo-day-hd"><span>${dia.label}</span><span class="ciclo-day-tot">${totH}h</span></div>
          <div class="ciclo-day-body">${body}</div>
        </div>`;
    }).join('');
    return `
      <div class="ciclo-week-wrap">
        <button class="ciclo-week-nav prev" onclick="CicloEstudos.scrollWeek(-1)" aria-label="Anterior">‹</button>
        <div class="ciclo-week" id="ciclo-week-track">${cards}</div>
        <button class="ciclo-week-nav next" onclick="CicloEstudos.scrollWeek(1)" aria-label="Próximo">›</button>
      </div>`;
  }

  function _renderDicas(dicas) {
    return `
      <div class="ciclo-tips">
        <div class="ciclo-tips-hd">🎯 Dicas estratégicas</div>
        <div class="ciclo-tips-grid">
          ${dicas.map(d=>`
            <div class="ciclo-tip"><strong>${_esc(d.disciplina)}</strong><span>${_esc(d.dica)}</span></div>
          `).join('')}
        </div>
      </div>`;
  }

  function setView(v) { _view = v; render(); }

  function toggleDone(idx) {
    const d = _load(); if (!d) return;
    d.blocos[idx].done = !d.blocos[idx].done;
    _save(d); render();
  }

  function toggleDisc(dayId, discKey) {
    const k = `${dayId}::${discKey}`;
    _expanded[k] = !_expanded[k];
    _saveExp();
    render();
  }

  function toggleTopic(dayId, discKey, topicId) {
    const d = _load(); if (!d) return;
    const prog = _ensureProg(d);
    if (!prog[dayId]) prog[dayId] = {};
    if (!prog[dayId][discKey]) prog[dayId][discKey] = {};
    prog[dayId][discKey][topicId] = !prog[dayId][discKey][topicId];
    _save(d); render();
  }

  function scrollWeek(dir) {
    const track = document.getElementById('ciclo-week-track');
    if (!track) return;
    const card = track.querySelector('.ciclo-day');
    const step = card ? (card.getBoundingClientRect().width + 14) : 320;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  function scrollWeekInline(dir) {
    const track = document.getElementById('ciclo-week-inline-track');
    if (!track) return;
    const card = track.querySelector('.ciclo-day');
    const step = card ? (card.getBoundingClientRect().width + 14) : 320;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  function clear() {
    if (!confirm('Limpar o ciclo de estudos atual?')) return;
    localStorage.removeItem(KEY); render();
  }

  /* ── AI MODAL ── */
  function openAIModal() {
    // Remove any stale instance before opening
    document.getElementById('modal-ciclo-ai')?.remove();
    const ed = (typeof EditalEngine!=='undefined') ? EditalEngine.getData() : null;
    if (!ed || !ed.disciplinas || !ed.disciplinas.length) {
      alert('Configure seu edital antes de gerar com IA.');
      Router.go('curriculum');
      return;
    }
    const html = `
      <div id="modal-ciclo-ai" onclick="event.target===this&&CicloEstudos.closeAIModal()">
        <div class="ciclo-ai-modal-content">
          <div class="modal-header">
            <h2>✨ Gerar Ciclo com IA</h2>
            <button class="modal-close" onclick="CicloEstudos.closeAIModal()">✕</button>
          </div>
          <div class="modal-body" style="padding:20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto">
            <div class="ciclo-form-row">
              <label>Horas disponíveis por dia</label>
              <input type="number" id="ciclo-horas" min="1" max="14" value="${ed.disponibilidade?.horasPorDia||4}" />
            </div>
            <div class="ciclo-form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div>
                <label>Disciplinas por dia</label>
                <input type="number" id="ciclo-disc-dia" min="1" max="6" value="3" />
              </div>
              <div>
                <label>Tópicos por disciplina</label>
                <input type="number" id="ciclo-top-disc" min="1" max="6" value="2" />
              </div>
            </div>
            <div class="ciclo-form-row">
              <label>Dias da semana que estudo</label>
              <div class="ciclo-days-pick">
                ${['Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.','Dom.'].map((lbl,i)=>`
                  <label class="ciclo-day-chip"><input type="checkbox" value="${['seg','ter','qua','qui','sex','sab','dom'][i]}" ${i<6?'checked':''}/><span>${lbl}</span></label>
                `).join('')}
              </div>
            </div>
            <div class="ciclo-form-row">
              <label>Data da prova (opcional)</label>
              <input type="date" id="ciclo-data" value="${ed.concurso?.dataProva||''}"/>
            </div>
            <div class="ciclo-form-row">
              <label>Observações / pontos fracos (opcional)</label>
              <textarea id="ciclo-obs" rows="3" placeholder="Ex: tenho dificuldade em RLM, quero focar em questões CEBRASPE..."></textarea>
            </div>
            <div class="ciclo-form-info">
              📚 Será usado o edital configurado: <strong>${ed.disciplinas.length} disciplinas</strong> com seus pesos e tópicos.
            </div>
          </div>
          <div class="modal-footer" style="padding:14px 20px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid var(--border)">
            <button class="ciclo-btn-secondary" onclick="CicloEstudos.closeAIModal()">Cancelar</button>
            <button class="ciclo-btn-primary" id="ciclo-gen-btn" onclick="CicloEstudos.generateAI()">✨ Gerar Ciclo</button>
          </div>
        </div>
      </div>`;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstElementChild);
  }
  function closeAIModal() { document.getElementById('modal-ciclo-ai')?.remove(); }

  async function generateAI() {
    const ed = EditalEngine.getData();
    const horas = +document.getElementById('ciclo-horas').value || 4;
    const dias = Array.from(document.querySelectorAll('#modal-ciclo-ai .ciclo-day-chip input:checked')).map(c=>c.value);
    const dataProva = document.getElementById('ciclo-data').value || null;
    const obs = document.getElementById('ciclo-obs').value.trim();

    // Validações
    if (horas < 1 || horas > 14) {
      alert('❌ Informe entre 1 e 14 horas disponíveis por dia.'); return;
    }
    if (dias.length === 0) {
      alert('❌ Selecione pelo menos 1 dia da semana para estudar.'); return;
    }

    const $btn = document.getElementById('ciclo-gen-btn');
    const $footer = $btn.closest('.modal-footer') || $btn.parentElement;

    // Loading state
    $btn.disabled = true;
    $btn.innerHTML = '<span class="ciclo-spinner"></span> Gerando ciclo...';
    const $progress = document.createElement('div');
    $progress.id = 'ciclo-gen-progress';
    $progress.style.cssText = 'font-size:12px;color:var(--text-muted,#aaa);text-align:center;width:100%;padding-top:4px;';
    $progress.textContent = '⏳ A IA está montando seu ciclo personalizado...';
    $footer.appendChild($progress);

    const msgs = [
      '📚 Analisando pesos do edital...',
      '⚖️ Distribuindo disciplinas por peso...',
      '📅 Montando cronograma semanal...',
      '💡 Selecionando tópicos do edital...',
      '✍️ Finalizando dicas estratégicas...',
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % msgs.length;
      if ($progress && $progress.isConnected) $progress.textContent = msgs[msgIdx];
    }, 4000);

    try {
      const r = await fetch('/api/ciclo-estudos', {
        method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({
          horasPorDia: horas, diasSemana: dias, dataProva, observacoes: obs,
          disciplinasPorDia: +document.getElementById('ciclo-disc-dia').value || 3,
          topicosPorDisciplina: +document.getElementById('ciclo-top-disc').value || 2,
          disciplinas: ed.disciplinas, modo: 'ambos',
        }),
      });
      const raw = await r.text();
      let json = null;
      try { json = raw ? JSON.parse(raw) : null; } catch { /* non-JSON */ }
      if (!r.ok) {
        const msg = (json && json.error) ? json.error : (raw && raw.slice(0,200)) || `Erro ${r.status}`;
        if (r.status === 429) throw new Error('Limite de requisições atingido. Aguarde alguns segundos e tente novamente.');
        if (r.status === 402) throw new Error('Créditos de IA esgotados. Adicione créditos no workspace para continuar.');
        throw new Error(msg);
      }
      if (!json) throw new Error('Resposta inválida do servidor. Tente novamente.');
      if (json.error) throw new Error(json.error);
      const ciclo = json.ciclo;
      if (!ciclo) throw new Error('Ciclo não retornado pela IA. Tente novamente.');
      // attach colors per discipline
      const cmap = {}; let i=0;
      (ciclo.blocos||[]).forEach(b=>{ if(!cmap[b.disciplina]) cmap[b.disciplina]=_color(i++); b.cor = cmap[b.disciplina]; b.done=false; });
      _save(ciclo);
      closeAIModal();
      render();
    } catch (e) {
      alert('❌ ' + e.message);
      $btn.disabled = false;
      $btn.innerHTML = '✨ Gerar Ciclo';
      $progress.remove();
    } finally {
      clearInterval(interval);
    }
  }

  /* ── MANUAL EDITOR ── */
  function _getOpts(ed) {
    return ed && ed.disciplinas ? ed.disciplinas.map(d=>`<option value="${_esc(d.nome)}">${_esc(d.nome)}</option>`).join('') : '';
  }

  function _cmUpdateSummary() {
    const rows = Array.from(document.querySelectorAll('#cm-blocos .cm-row'));
    let totalH = 0;
    const discMap = {};
    rows.forEach(r => {
      const disc = r.querySelector('.cm-disc')?.value?.trim() || '';
      const h = +r.querySelector('.cm-hval')?.value || 1;
      totalH += h;
      if (disc) discMap[disc] = (discMap[disc] || 0) + h;
    });
    const $tot = document.getElementById('cm-total-horas');
    if ($tot) $tot.textContent = `${totalH}h totais`;
    const $sum = document.getElementById('cm-disc-summary');
    if ($sum) {
      const entries = Object.entries(discMap).sort((a,b)=>b[1]-a[1]);
      $sum.innerHTML = entries.map(([d,h])=>`<span class="cm-sum-chip">${_esc(d)} <strong>${h}h</strong></span>`).join('');
    }
    // renumber
    rows.forEach((r, idx) => {
      const n = r.querySelector('.cm-num');
      if (n) n.textContent = idx + 1;
    });
  }

  function openManual() {
    const ed = (typeof EditalEngine!=='undefined') ? EditalEngine.getData() : null;
    const existing = _load() || { nome:'Meu Ciclo', blocos:[], semanal:{}, dicas:[], estrategia:'' };
    const opts = _getOpts(ed);
    const totalH = (existing.blocos||[]).reduce((s,b)=>s+(+b.horas||0),0);
    const html = `
      <div id="modal-ciclo-manual" onclick="event.target===this&&CicloEstudos.closeManual()">
        <div class="cm-modal-content">
          <div class="modal-header">
            <h2>✏️ Configurar Ciclo Manualmente</h2>
            <button class="modal-close" onclick="CicloEstudos.closeManual()">✕</button>
          </div>
          <div class="modal-body cm-modal-body">
            <div class="cm-top-bar">
              <div class="ciclo-form-row cm-nome-row">
                <label>Nome do ciclo</label>
                <input type="text" id="cm-nome" value="${_esc(existing.nome)}" placeholder="Ex: Ciclo PMDF 2026"/>
              </div>
              <div class="cm-stats">
                <div class="cm-stat-badge" id="cm-total-horas">${totalH}h totais</div>
              </div>
            </div>
            <div class="cm-disc-summary-wrap">
              <div class="cm-disc-summary-label">Distribuição por disciplina</div>
              <div class="cm-disc-summary" id="cm-disc-summary"></div>
            </div>
            <div class="ciclo-manual-section">
              <div class="ciclo-manual-hd">
                <span>Blocos do ciclo <span class="cm-hd-hint">— arraste ⠿ para reordenar</span></span>
                <button class="ciclo-btn-secondary small" onclick="CicloEstudos._addManualBloco()">+ Adicionar bloco</button>
              </div>
              <div class="cm-cols-hd">
                <span></span><span>#</span><span>Disciplina</span><span>Tópico</span><span>Horas</span><span></span>
              </div>
              <div id="cm-blocos">${(existing.blocos||[]).map((b,i)=>_manualBlocoRow(b,i,opts)).join('')}</div>
            </div>
          </div>
          <div class="modal-footer cm-modal-footer">
            <button class="ciclo-btn-secondary" onclick="CicloEstudos.closeManual()">Cancelar</button>
            <button class="ciclo-btn-primary" onclick="CicloEstudos.saveManual()">💾 Salvar Ciclo</button>
          </div>
        </div>
      </div>`;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstElementChild);
    if (!existing.blocos.length) _addManualBloco();
    _cmInitDrag();
    _cmUpdateSummary();
  }

  function closeManual(){ document.getElementById('modal-ciclo-manual')?.remove(); }

  function _manualBlocoRow(b, i, opts) {
    const horas = b.horas || 1;
    return `
      <div class="cm-row" data-i="${i}" draggable="true">
        <div class="cm-drag" title="Arrastar para reordenar">⠿</div>
        <div class="cm-num">${i+1}</div>
        ${opts
          ? `<select class="cm-disc" onchange="CicloEstudos._cmChanged()">${opts.replace(`value="${_esc(b.disciplina||'')}"`,`value="${_esc(b.disciplina||'')}" selected`)}</select>`
          : `<input type="text" class="cm-disc" placeholder="Disciplina" value="${_esc(b.disciplina||'')}" oninput="CicloEstudos._cmChanged()"/>`}
        <div class="cm-topic-wrap">
          <input type="text" class="cm-topic" placeholder="Tópico (opcional)" value="${_esc(b.topicoSugerido||'')}" title="${_esc(b.topicoSugerido||'')}"/>
        </div>
        <div class="cm-horas-ctrl">
          <button class="cm-h-btn" onclick="CicloEstudos._cmAdjH(this,-0.5)" tabindex="-1">−</button>
          <input type="number" class="cm-hval" min="0.5" max="12" step="0.5" value="${horas}" onchange="CicloEstudos._cmChanged()"/>
          <button class="cm-h-btn" onclick="CicloEstudos._cmAdjH(this,0.5)" tabindex="-1">+</button>
        </div>
        <div class="cm-row-actions">
          <button class="cm-dup" onclick="CicloEstudos._dupManualBloco(${i})" title="Duplicar bloco">⧉</button>
          <button class="cm-del" onclick="CicloEstudos._delManualBloco(${i})" title="Remover">✕</button>
        </div>
      </div>`;
  }

  function _cmChanged() { _cmUpdateSummary(); }

  function _cmAdjH(btn, delta) {
    const row = btn.closest('.cm-row');
    const inp = row.querySelector('.cm-hval');
    const cur = +inp.value || 1;
    inp.value = Math.max(0.5, Math.min(12, Math.round((cur + delta) * 2) / 2));
    _cmUpdateSummary();
  }

  function _addManualBloco() {
    const ed = (typeof EditalEngine!=='undefined') ? EditalEngine.getData() : null;
    const opts = _getOpts(ed);
    const $list = document.getElementById('cm-blocos');
    const i = $list.children.length;
    const div = document.createElement('div');
    div.innerHTML = _manualBlocoRow({}, i, opts);
    $list.appendChild(div.firstElementChild);
    _cmInitDrag();
    _cmUpdateSummary();
    $list.lastElementChild.querySelector('.cm-disc')?.focus();
  }

  function _dupManualBloco(i) {
    const $list = document.getElementById('cm-blocos');
    const row = $list.children[i];
    if (!row) return;
    const disc = row.querySelector('.cm-disc').value;
    const topic = row.querySelector('.cm-topic').value;
    const horas = +row.querySelector('.cm-hval').value || 1;
    const ed = (typeof EditalEngine!=='undefined') ? EditalEngine.getData() : null;
    const opts = _getOpts(ed);
    const newIdx = $list.children.length;
    const div = document.createElement('div');
    div.innerHTML = _manualBlocoRow({ disciplina: disc, topicoSugerido: topic, horas }, newIdx, opts);
    $list.appendChild(div.firstElementChild);
    _cmInitDrag();
    _cmUpdateSummary();
  }

  function _delManualBloco(i) {
    const $list = document.getElementById('cm-blocos');
    if ($list.children[i]) $list.children[i].remove();
    _cmRenumber();
    _cmUpdateSummary();
  }

  function _cmRenumber() {
    const $list = document.getElementById('cm-blocos');
    Array.from($list.children).forEach((row, idx) => {
      row.dataset.i = idx;
      const n = row.querySelector('.cm-num'); if (n) n.textContent = idx + 1;
      const dup = row.querySelector('.cm-dup'); if (dup) dup.setAttribute('onclick', `CicloEstudos._dupManualBloco(${idx})`);
      const del = row.querySelector('.cm-del'); if (del) del.setAttribute('onclick', `CicloEstudos._delManualBloco(${idx})`);
    });
  }

  function _cmInitDrag() {
    const $list = document.getElementById('cm-blocos');
    if (!$list) return;
    let dragging = null;
    Array.from($list.querySelectorAll('.cm-row')).forEach(row => {
      row.addEventListener('dragstart', e => {
        dragging = row;
        setTimeout(() => row.classList.add('cm-dragging'), 0);
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', () => {
        row.classList.remove('cm-dragging');
        $list.querySelectorAll('.cm-row').forEach(r => r.classList.remove('cm-drag-over'));
        dragging = null;
        _cmRenumber();
        _cmUpdateSummary();
      });
      row.addEventListener('dragover', e => {
        e.preventDefault();
        if (!dragging || dragging === row) return;
        $list.querySelectorAll('.cm-row').forEach(r => r.classList.remove('cm-drag-over'));
        row.classList.add('cm-drag-over');
        const rect = row.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (e.clientY < mid) $list.insertBefore(dragging, row);
        else $list.insertBefore(dragging, row.nextSibling);
      });
      row.addEventListener('dragleave', () => row.classList.remove('cm-drag-over'));
    });
  }

  function saveManual() {
    const nome = document.getElementById('cm-nome').value.trim() || 'Meu Ciclo';
    const rows = Array.from(document.querySelectorAll('#cm-blocos .cm-row'));
    const blocos = rows.map((r, idx) => ({
      id: 'b' + (idx + 1),
      disciplina: r.querySelector('.cm-disc').value.trim(),
      topicoSugerido: r.querySelector('.cm-topic').value.trim(),
      horas: +r.querySelector('.cm-hval').value || 1,
      done: false,
    })).filter(b => b.disciplina);
    if (!blocos.length) { alert('Adicione pelo menos 1 bloco com disciplina.'); return; }
    const cmap = {}; let i = 0;
    blocos.forEach(b => { if (!cmap[b.disciplina]) cmap[b.disciplina] = _color(i++); b.cor = cmap[b.disciplina]; });
    const totalH = blocos.reduce((s, b) => s + b.horas, 0);
    const existing = _load() || {};
    _save({ ...existing, nome, blocos, totalHoras: totalH, semanal: existing.semanal || {}, dicas: existing.dicas || [], estrategia: existing.estrategia || '' });
    closeManual();
    render();
  }

  function getColorMap() {
    const data = _load();
    const map = {};
    if (data && data.blocos) {
      let i = 0;
      data.blocos.forEach(b => { if (!map[b.disciplina]) map[b.disciplina] = b.cor || _color(i++); });
    }
    return map;
  }

  return { render, openAIModal, closeAIModal, generateAI, openManual, closeManual, saveManual, setView, toggleDone, toggleDisc, toggleTopic, scrollWeek, scrollWeekInline, clear, getColorMap, _addManualBloco, _dupManualBloco, _delManualBloco, _cmChanged, _cmAdjH };
})();
window.CicloEstudos = CicloEstudos;
