/* ════════════════════════════════════════════════════════
   NEXUS CONTENT AI
   Gera flashcards, análise da banca e dicas de matérias
   para QUALQUER concurso usando a API Anthropic.
   Armazena em: nexus_ai_content_v1
════════════════════════════════════════════════════════ */
const NexusContentAI = (() => {

  const KEY     = 'nexus_ai_content_v1';
  const API_KEY = 'nexus_api_key';

  function _getApiKey() { return localStorage.getItem(API_KEY) || ''; }
  function _load()  { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } }
  function _save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }

  function getContent() { return _load(); }
  function hasContent()  { return !!_load(); }

  /* ── Call Anthropic API ── */
  async function _callAPI(systemPrompt, userPrompt) {
    const apiKey = _getApiKey();
    if (!apiKey) throw new Error('Chave de API não configurada. Vá em Configurações → IA para adicionar sua chave Anthropic.');

    let resp;
    try {
      resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 6000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });
    } catch (networkErr) {
      throw new Error('Erro de conexão com a API. Verifique sua internet. (' + networkErr.message + ')');
    }

    if (!resp.ok) {
      let errMsg = 'HTTP ' + resp.status;
      try {
        const errBody = await resp.json();
        errMsg = errBody?.error?.message || errMsg;
        if (resp.status === 401) errMsg = 'Chave de API inválida ou expirada. Verifique em Configurações → IA.';
        if (resp.status === 400) errMsg = 'Requisição inválida (400). Verifique o formato da chave de API.';
        if (resp.status === 429) errMsg = 'Limite de requisições atingido. Aguarde alguns segundos.';
        if (resp.status === 500) errMsg = 'Erro interno da API. Tente novamente em instantes.';
      } catch(_) {}
      throw new Error(errMsg);
    }

    const data = await resp.json();
    const raw = data.content?.map(b => b.text || '').join('') || '';
    return raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/,      '')
      .replace(/\s*```$/,      '')
      .trim();
  }

  /* ── Shared JSON repair (same logic as ScheduleEngine) ── */
  function _repairAndParse(text) {
    if (!text) throw new Error('Resposta vazia da API');
    let s = text.replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
    const st = s.indexOf('{'), en = s.lastIndexOf('}');
    if (st === -1 || en === -1) throw new Error('JSON não encontrado na resposta');
    s = s.slice(st, en + 1);
    try { return JSON.parse(s); } catch(_) {}
    s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    s = s.replace(/,(\s*[}\]])/g, '$1');
    s = s.replace(/}\s*{/g, '},{');
    try { return JSON.parse(s); } catch(e) {
      throw new Error('JSON inválido: ' + e.message);
    }
  }

    /* ── Show loading overlay ── */
  function _showLoading(msg) {
    let el = document.getElementById('nexus-ai-loading');
    if (!el) {
      el = document.createElement('div');
      el.id = 'nexus-ai-loading';
      el.style.cssText = 'position:fixed;inset:0;background:rgba(5,7,14,0.88);backdrop-filter:blur(14px);z-index:9998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;';
      el.innerHTML = `
        <div style="width:60px;height:60px;border-radius:18px;background:linear-gradient(135deg,#E8B84B22,#E8B84B44);border:1px solid #E8B84B44;display:flex;align-items:center;justify-content:center;font-size:26px;animation:spin 2s linear infinite">🤖</div>
        <div style="text-align:center">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:3px;color:#E8B84B;margin-bottom:6px">GERANDO CONTEÚDO</div>
          <div id="nexus-ai-loading-msg" style="font-size:12px;color:#4A5A70;font-family:'IBM Plex Mono',monospace;max-width:340px;text-align:center;line-height:1.6">${msg}</div>
        </div>
        <div style="display:flex;gap:6px">
          <div style="width:6px;height:6px;border-radius:50%;background:#E8B84B;animation:blink 1.2s .0s infinite"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:#E8B84B;animation:blink 1.2s .4s infinite"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:#E8B84B;animation:blink 1.2s .8s infinite"></div>
        </div>`;
      document.body.appendChild(el);
    }
    el.style.display = 'flex';
    document.getElementById('nexus-ai-loading-msg').textContent = msg;
  }

  function _updateLoading(msg) {
    const el = document.getElementById('nexus-ai-loading-msg');
    if (el) el.textContent = msg;
  }

  function _hideLoading() {
    const el = document.getElementById('nexus-ai-loading');
    if (el) el.style.display = 'none';
  }

  /* ── Generate all content ── */
  async function generateAll(profile) {
    if (!_getApiKey()) {
      // Show banner to prompt user to add API key
      _showApiKeyPrompt(profile);
      return;
    }

    const nome  = profile?.concurso?.nome  || 'Concurso Público';
    const banca = profile?.concurso?.banca || 'Banca';
    const discs = profile?.disciplinas     || [];
    const fracos = profile?.pontosFracos   || [];
    const nivel = profile?.perfil?.nivel   || 'intermediario';

    _showLoading(`Analisando o perfil de ${nome}...`);

    try {
      // ─── STEP 1: Analysis patterns ───────────────
      _updateLoading(`Mapeando o DNA da ${banca}...`);
      const discNames = discs.map(d => d.name || d.nome).filter(Boolean).join(', ');

      const analysisJSON = await _callAPI(
        'Você é um especialista em concursos públicos brasileiros. Responda SOMENTE com JSON válido, sem markdown.',
        `Gere padrões de cobrança da banca "${banca}" para o concurso "${nome}".
Disciplinas: ${discNames || 'conforme o edital'}.

Responda com este JSON exato:
{
  "patterns": [
    { "title": "título do padrão", "body": "descrição detalhada com exemplos", "color": "#hexcor" }
  ],
  "bySubj": [
    { "name": "nome da disciplina", "tips": ["dica 1", "dica 2", "dica 3", "dica 4"] }
  ]
}

Regras:
- patterns: exatamente 6 padrões históricos da banca para ESTE concurso (como a banca cobra, armadilhas, literalidade, etc.)
- bySubj: uma entrada para cada disciplina de alta prioridade (máx 6), com 4 dicas específicas de como a banca cobra essa matéria neste concurso
- colors: use variações de #FF4D4D, #FF8C42, #E8B84B, #4D9FFF, #2ECC71, #A78BFA
- Seja específico para esta banca e concurso — não genérico`
      );

      const analysisData = _repairAndParse(analysisJSON);

      // ─── STEP 2: Flashcards ─────────────────────
      _updateLoading(`Criando flashcards para ${nome}...`);

      // Pick top 5 disciplines (highest weight/heat or just first 5)
      const topDiscs = discs
        .filter(d => d.peso === 'alta' || d.peso === 'media')
        .slice(0, 5);
      const topDiscNames = topDiscs.map(d => d.name || d.nome).filter(Boolean).join(', ') || discNames;

      const fcJSON = await _callAPI(
        'Você é um especialista em concursos públicos. Responda SOMENTE com JSON válido.',
        `Crie 25 flashcards de alta qualidade para o concurso "${nome}" — banca "${banca}".
Disciplinas prioritárias: ${topDiscNames}.
Nível do candidato: ${nivel}.

Responda com este JSON exato:
{
  "flashcards": [
    {
      "id": "fc_gen_01",
      "subj": "id_da_disciplina",
      "topic": "nome do tópico",
      "diff": 2,
      "q": "pergunta usando ==destaques== para termos-chave",
      "a": "resposta clara e concisa com ==pontos críticos== destacados e !!armadilhas da banca!! marcadas"
    }
  ]
}

Regras:
- subj: use o id da disciplina: ${topDiscs.map(d => '"' + (d.id||'disc_'+d.name?.slice(0,5).toLowerCase()) + '"→"' + (d.name||d.nome) + '"').join(', ')}
- diff: 1=fácil, 2=médio, 3=difícil
- ==texto== = destaque dourado | !!texto!! = alerta vermelho
- Foque nos tópicos mais cobrados por esta banca neste concurso
- Misture questões conceituais e literais (letra da lei)`
      );

      const fcData = _repairAndParse(fcJSON);

      // ─── STEP 3: Save everything ─────────────────
      _updateLoading('Salvando conteúdo gerado...');

      const content = {
        contestName: nome,
        banca,
        generatedAt: new Date().toISOString(),
        patterns:    analysisData.patterns   || [],
        bySubj:      analysisData.bySubj     || [],
        flashcards:  fcData.flashcards       || [],
      };
      _save(content);

      // Inject flashcards into State
      if (content.flashcards.length > 0) {
        const existing = (State.get('flashcards') || []).filter(c => !c.id.startsWith('fc_gen_'));
        const merged   = [...content.flashcards.map(card => ({
          ...card,
          ef: 2.5, interval: 0, reps: 0,
          nextReview: new Date().toISOString().split('T')[0],
          lastReview: null,
          _user: true,   // mark as user card — survives re-seed
        })), ...existing];
        State.set('flashcards', merged);
        // Keep current seed flag — user cards are preserved by _user:true
        // Do NOT reset nexus_fc_seed; seed logic already handles _user cards
      }

      _hideLoading();

      // Success toast
      _showToast(`✅ ${content.patterns.length} padrões + ${content.flashcards.length} flashcards gerados para ${nome}`);

      // Refresh views if open
      if (typeof App !== 'undefined') App.refreshAll();
      if (typeof Render !== 'undefined') {
        Render.analysis();
        Render.flashcards();
      }

    } catch(err) {
      _hideLoading();
      console.error('[NexusContentAI]', err);
      _showError(err.message || 'Erro ao gerar conteúdo', profile);
    }
  }

  /* ── Show API key prompt banner ── */
  function _showApiKeyPrompt(profile) {
    const banner = document.getElementById('analysis-ai-banner');
    if (!banner) return;
    banner.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(232,184,75,0.1),rgba(232,184,75,0.05));border:1px solid rgba(232,184,75,0.3);border-radius:16px;padding:20px 24px;margin-bottom:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div style="font-size:28px">🤖</div>
        <div style="flex:1;min-width:220px">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1.5px;color:#E8B84B;margin-bottom:4px">GERAR CONTEÚDO COM IA</div>
          <div style="font-size:12px;color:#4A5A70;line-height:1.5">Configure sua chave de API para gerar flashcards e análise da banca personalizados para <strong style="color:#C8D0E0">${profile?.concurso?.nome || 'seu concurso'}</strong></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <input id="ai-banner-key" type="password" placeholder="sk-ant-api03-..."
            style="padding:8px 12px;background:#0E1120;border:1px solid #263050;border-radius:8px;color:#C8D0E0;font-family:'IBM Plex Mono',monospace;font-size:11px;width:220px;outline:none;"
            onfocus="this.style.borderColor='#E8B84B'" onblur="this.style.borderColor='#263050'">
          <button onclick="NexusContentAI.saveKeyAndGenerate(document.getElementById('ai-banner-key').value)"
            style="padding:8px 16px;background:linear-gradient(135deg,#7A5E1F,#E8B84B);border:none;border-radius:8px;color:#05070E;font-family:'IBM Plex Sans',sans-serif;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;">
            🚀 Gerar Agora
          </button>
        </div>
      </div>`;
  }

  /* ── Save key and generate ── */
  async function saveKeyAndGenerate(keyVal) {
    if (!keyVal?.trim()) { alert('Digite sua chave de API'); return; }
    localStorage.setItem(API_KEY, keyVal.trim());
    const profile = Onboarding.getUserProfile();
    await generateAll(profile);
  }

  /* ── Render analysis banner (shown in analysis view) ── */
  function renderAnalysisBanner() {
    const $banner = document.getElementById('analysis-ai-banner');
    const $title  = document.getElementById('analysis-title');
    const $badge  = document.getElementById('analysis-badge');
    if (!$banner) return;

    const content = _load();
    const profile = (typeof Onboarding !== 'undefined') ? Onboarding.getUserProfile() : null;
    const apiKey  = _getApiKey();

    // Update section title if we have AI content
    if (content) {
      if ($title) $title.textContent = `DNA da Banca — ${content.banca || content.contestName || ''}`;
      if ($badge) $badge.textContent = `🤖 GERADO COM IA`;
    }

    // If no API key and no content → prompt to configure
    if (!apiKey && !content) {
      _showApiKeyPrompt(profile);
      return;
    }

    // If API key but no content → show generate button
    if (apiKey && !content) {
      $banner.innerHTML = `
        <div style="background:rgba(232,184,75,0.08);border:1px solid rgba(232,184,75,0.2);border-radius:14px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
          <div style="font-size:24px">🤖</div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:700;color:#C8D0E0;margin-bottom:3px">Conteúdo padrão — clique para gerar para o seu concurso</div>
            <div style="font-size:11px;color:#4A5A70">API key configurada. Gere flashcards e análise personalizados para <strong style="color:#E8B84B">${profile?.concurso?.nome || 'seu concurso'}</strong></div>
          </div>
          <button onclick="NexusContentAI.generateAll(Onboarding.getUserProfile())"
            style="padding:9px 18px;background:linear-gradient(135deg,#7A5E1F,#E8B84B);border:none;border-radius:9px;color:#05070E;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap;">
            🚀 Gerar com IA
          </button>
        </div>`;
      return;
    }

    // Has content → show regenerate option (compact)
    if (content) {
      const genDate = content.generatedAt ? new Date(content.generatedAt).toLocaleDateString('pt-BR') : '—';
      $banner.innerHTML = `
        <div style="background:rgba(46,204,113,0.06);border:1px solid rgba(46,204,113,0.15);border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span style="font-size:11px;color:#2ECC71;font-weight:700">✅ CONTEÚDO IA ATIVO</span>
          <span style="font-size:11px;color:#4A5A70">${content.patterns?.length || 0} padrões · ${content.flashcards?.length || 0} flashcards · Gerado em ${genDate}</span>
          <button onclick="NexusContentAI.generateAll(Onboarding.getUserProfile())"
            style="margin-left:auto;padding:5px 12px;background:transparent;border:1px solid rgba(46,204,113,0.3);border-radius:7px;color:#2ECC71;font-size:10px;font-weight:700;cursor:pointer;">
            🔄 Regenerar
          </button>
        </div>`;
    }
  }

  /* ── Error message ── */
  function _showError(msg, profile) {
    const $banner = document.getElementById('analysis-ai-banner');
    if ($banner) {
      $banner.innerHTML = `
        <div style="background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.2);border-radius:12px;padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span style="font-size:20px">⚠️</span>
          <div style="flex:1">
            <div style="font-size:12px;font-weight:700;color:#FF6B6B">Erro ao gerar conteúdo</div>
            <div style="font-size:11px;color:#4A5A70;margin-top:2px">${msg}</div>
          </div>
          <button onclick="NexusContentAI.generateAll(Onboarding.getUserProfile())"
            style="padding:6px 14px;background:rgba(255,77,77,0.15);border:1px solid rgba(255,77,77,0.3);border-radius:7px;color:#FF6B6B;font-size:11px;font-weight:700;cursor:pointer;">
            Tentar novamente
          </button>
        </div>`;
    }
    // Also show toast
    _showToast('❌ ' + msg, true);
  }

  /* ── Toast ── */
  function _showToast(msg, isError) {
    const t = document.createElement('div');
    const bg = isError ? 'rgba(255,77,77,0.15)' : 'rgba(46,204,113,0.12)';
    const bc = isError ? 'rgba(255,77,77,0.3)'  : 'rgba(46,204,113,0.25)';
    const fc = isError ? '#FF6B6B'              : '#2ECC71';
    t.style.cssText = `position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:${bg};border:1px solid ${bc};color:${fc};padding:12px 22px;border-radius:12px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none;max-width:80vw;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.4)`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 5000);
  }

  return { getContent, hasContent, generateAll, renderAnalysisBanner, saveKeyAndGenerate };
})();
