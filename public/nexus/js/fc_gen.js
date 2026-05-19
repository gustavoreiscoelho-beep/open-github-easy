const FCGenerator = (() => {

  const API_KEY = 'nexus_api_key';
  let _qty    = 10;
  let _diff   = 'mix';
  let _estilo = 'cespe';

  function _apiKey() {
    // Try localStorage first (set by ConfigPanel), then fallback to DOM field
    const stored = localStorage.getItem(API_KEY) || localStorage.getItem('nexus_api_key') || '';
    if (stored) return stored;
    // Try reading directly from the form field (if user typed but didn't save)
    const domKey = document.getElementById('ef-api-key')?.value?.trim() || '';
    if (domKey) { localStorage.setItem(API_KEY, domKey); return domKey; } // auto-save
    return '';
  }

  /* ── Open modal ── */
  function openModal() {
    const overlay = document.getElementById('fc-gen-overlay');
    if (!overlay) return;

    // Populate disciplines from EditalEngine
    const $disc = document.getElementById('fc-gen-disc');
    if ($disc) {
      const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      const discs  = edData?.disciplinas || [];

      // Pré-seleção inteligente: disciplina ativa nos flashcards
      const activeFilter = (typeof State !== 'undefined') ? (State.get('fcFilter') || 'all') : 'all';
      $disc.innerHTML = '<option value="">Selecione a matéria...</option>' +
        discs.map(d => `<option value="${d.id}" data-nome="${d.nome}" ${d.id === activeFilter ? 'selected' : ''}>${d.nome}</option>`).join('');

      // Se achou pré-seleção, popula os tópicos automaticamente
      if (activeFilter !== 'all') {
        const matched = discs.find(d => d.id === activeFilter);
        if (matched) _populateTopics(matched);
      }
    }

    // Pre-fill banca from profile
    const profile = (typeof Onboarding !== 'undefined') ? Onboarding.getUserProfile() : null;
    _banca = profile?.concurso?.banca || '';

    // Reset UI
    _resetResult();
    overlay.style.opacity = '0';
    overlay.classList.add('open');
    requestAnimationFrame(() => { overlay.style.transition = 'opacity 0.2s'; overlay.style.opacity = '1'; });
  }

  function _populateTopics(disc) {
    const $topic = document.getElementById('fc-gen-topic');
    if (!$topic) return;
    const topics = disc?.topicos || [];
    $topic.innerHTML = '<option value="">Todos os tópicos da disciplina</option>' +
      topics.sort((a,b) => (b.heat||3) - (a.heat||3)).map(t => {
        const hp = t.heat===5?'🔴 ':t.heat===4?'🟠 ':t.heat===3?'🟡 ':'';
        return `<option value="${t.texto.replace(/"/g,'&quot;')}">${hp}${t.texto.replace(/^⚡\s*/,'').slice(0,80)}</option>`;
      }).join('');
  }

  let _banca = '';

  /* ── Close ── */
  function close() {
    const overlay = document.getElementById('fc-gen-overlay');
    if (!overlay) return;
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.classList.remove('open'); overlay.style.opacity = '1'; }, 200);
    _removePip();
  }

  /* ── Minimize / PIP ── */
  let _minimized = false;

  function minimize() {
    const overlay = document.getElementById('fc-gen-overlay');
    if (!overlay) return;
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.classList.remove('open'); overlay.style.opacity = '1'; }, 200);
    _minimized = true;
    _renderPip();
  }

  function _removePip() {
    document.getElementById('fc-gen-pip')?.remove();
    _minimized = false;
  }

  function _renderPip() {
    let pip = document.getElementById('fc-gen-pip');
    if (!pip) {
      pip = document.createElement('div');
      pip.id = 'fc-gen-pip';
      pip.innerHTML = `
        <div class="fc-gen-pip-inner">
          <span class="fc-gen-pip-icon">✦</span>
          <div class="fc-gen-pip-info">
            <span class="fc-gen-pip-title">Gerando Flashcards</span>
            <span class="fc-gen-pip-sub" id="fc-gen-pip-sub">Em andamento...</span>
          </div>
          <button class="fc-gen-pip-restore" onclick="FCGenerator.restore()" title="Restaurar">⊞</button>
          <button class="fc-gen-pip-close" onclick="FCGenerator.close()" title="Cancelar">✕</button>
        </div>`;
      document.body.appendChild(pip);
    }
  }

  /* ── On discipline change — populate topics ── */
  function onDiscChange(sel) {
    const discId = sel.value;
    if (!discId) {
      const $topic = document.getElementById('fc-gen-topic');
      if ($topic) $topic.innerHTML = '<option value="">Todos os tópicos da disciplina</option>';
      return;
    }
    const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const disc   = edData?.disciplinas?.find(d => d.id === discId);
    _populateTopics(disc);
  }

  /* ── Qty selector ── */
  function setQty(n, btn) {
    _qty = n;
    document.querySelectorAll('.fc-gen-qty-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  /* ── Difficulty selector ── */
  function setDiff(d, btn) {
    _diff = d;
    document.querySelectorAll('.fc-gen-diff-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  /* ── Estilo selector ── */
  function setEstilo(e, btn) {
    _estilo = e;
    document.querySelectorAll('[data-estilo]').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  /* ── Reset result strip ── */
  function _resetResult() {
    document.getElementById('fc-gen-loading')?.classList.remove('show');
    document.getElementById('fc-gen-result-strip')?.classList.remove('show');
    document.getElementById('fc-gen-body').style.pointerEvents = '';
    const $btn = document.getElementById('fc-gen-btn');
    if ($btn) { $btn.disabled = false; $btn.textContent = '✦ GERAR FLASHCARDS'; }
  }

  function _setLoading(msg) {
    document.getElementById('fc-gen-loading')?.classList.add('show');
    const $msg = document.getElementById('fc-gen-loading-msg');
    if ($msg) $msg.textContent = msg;
    document.getElementById('fc-gen-body').style.pointerEvents = 'none';
    const $btn = document.getElementById('fc-gen-btn');
    if ($btn) { $btn.disabled = true; $btn.textContent = 'Gerando...'; }
  }

  /* ── Main generate function ── */
  async function generate() {
    const key = _apiKey();
    if (!key) {
      alert('Chave de API não encontrada. Configure-a em Configurações → Integrações.');
      return;
    }

    const discSel  = document.getElementById('fc-gen-disc');
    const discId   = discSel?.value;
    const discNome = discSel?.options[discSel.selectedIndex]?.dataset?.nome || discSel?.options[discSel.selectedIndex]?.text || '';
    const topicVal = document.getElementById('fc-gen-topic')?.value || '';
    const focus    = document.getElementById('fc-gen-focus')?.value.trim() || '';

    if (!discId) {
      const $d = document.getElementById('fc-gen-disc');
      if ($d) { $d.style.borderColor = 'var(--red)'; setTimeout(() => $d.style.borderColor = '', 2500); }
      return;
    }

    const edData  = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const disc    = edData?.disciplinas?.find(d => d.id === discId);
    const topicsCtx = disc?.topicos?.map(t => t.texto).slice(0,20).join(' | ') || '';
    const banca   = _banca || edData?.concurso?.banca || 'CESPE/CEBRASPE';
    const concurso= edData?.concurso?.nome || 'Concurso Público';

    // Difficulty instruction
    const diffInstr = _diff === '1' ? 'nível fácil (conceitos básicos, definições)'
      : _diff === '2' ? 'nível médio (aplicação, interpretação, distinções)'
      : _diff === '3' ? 'nível difícil (pegadinhas, literalidade, casos extremos, prazos)'
      : 'mix de fácil, médio e difícil equilibrado';

    // Estilo instruction
    const estiloInstr = _estilo === 'cespe' ? 'perguntas assertivas (afirmações verdadeiras ou falsas, estilo CESPE/CEBRASPE)'
      : _estilo === 'multipla' ? 'perguntas de múltipla escolha com 4 opções (A, B, C, D) na pergunta e gabarito na resposta'
      : _estilo === 'pratico' ? 'situações práticas e casos concretos para aplicação da lei/norma'
      : 'perguntas conceituais diretas (O que é? Como funciona? Qual a diferença entre X e Y?)';

    _setLoading(`Gerando ${_qty} flashcards de ${discNome}...`);

    const prompt = `Voce e especialista em concursos publicos brasileiros. Gere exatamente ${_qty} flashcards de alta qualidade para:

CONCURSO: ${concurso}
BANCA: ${banca}
DISCIPLINA: ${discNome}
${topicVal ? 'TOPICO ESPECIFICO: ' + topicVal : 'TOPICO: todos os topicos da disciplina'}
${topicsCtx ? 'TOPICOS DO EDITAL: ' + topicsCtx : ''}

CONFIGURACOES:
- Dificuldade: ${diffInstr}
- Estilo: ${estiloInstr}
${focus ? '- Instrucao adicional: ' + focus : ''}

FORMATO OBRIGATORIO DE CADA CARD:
- q: a pergunta (frente do card)
- a: a resposta completa e detalhada (verso do card)

MARCACOES DE DESTAQUE OBRIGATORIAS na resposta (a):
Use ==texto== para destacar em DOURADO os termos tecnicos, nomes de leis, conceitos-chave
Use !!texto!! para destacar em VERMELHO alertas, excecoes, pegadinhas, prazos criticos
Use **texto** para destacar em VERDE exemplos corretos, gabaritos, respostas certas
Use ~~texto~~ para destacar em AZUL referencias legais, artigos, numeros de leis

Na pergunta (q), use tambem ==texto== para destacar o tema central da questao.

REGRAS DE QUALIDADE:
- Cada card deve ter pergunta direta e resposta completa com explicacao
- Mencione artigos de lei, prazos e numeros especificos quando relevante
- Inclua pegadinhas tipicas da ${banca} com !!alerta!!
- Resposta minima de 2-3 linhas com contexto suficiente para memorizar

Retorne SOMENTE JSON valido (sem markdown, sem explicacoes extras):
{"cards":[{"q":"pergunta com ==destaque== no tema","a":"resposta com ==termos== e !!alertas!! e **corretos** e ~~art. X lei Y~~","diff":${_diff === 'mix' ? 'numero entre 1 e 3' : _diff},"topic":"${topicVal || discNome}"}]}`;

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 6000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!resp.ok) throw new Error(`API ${resp.status}: ${resp.statusText}`);
      const data = await resp.json();
      const raw  = (data.content||[]).map(b => b.text||'').join('');

      // Parse robust
      let s = raw.replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
      const st = s.indexOf('{'), en = s.lastIndexOf('}');
      if (st !== -1 && en > st) s = s.slice(st, en+1);
      s = s.replace(/,(\s*[}\]])/g,'$1').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'');

      const parsed = JSON.parse(s);
      if (!Array.isArray(parsed.cards) || !parsed.cards.length) throw new Error('Nenhum card retornado');

      // Add cards to State
      const today  = new Date().toISOString().split('T')[0];
      const newCards = parsed.cards.map((c, i) => ({
        id:         'fc_ai_' + Date.now() + '_' + i,
        subj:       discId,
        topic:      topicVal || c.topic || discNome,
        diff:       parseInt(c.diff) || 2,
        q:          c.q || '',
        a:          c.a || '',
        ef:         2.5, interval: 0, reps: 0,
        nextReview: today, lastReview: null,
        aiGenerated: true,
        _user: true,  // FIX: marca como card do usuário para sobreviver ao reload (State.load filtra por _user)
      }));

      const existing = State.get('flashcards') || [];
      State.set('flashcards', [...newCards, ...existing]);
      // Reset FC seed so new cards show
      localStorage.setItem('nexus_fc_seed', 'fc_ai_gen_' + Date.now());

      // Show result
      document.getElementById('fc-gen-loading')?.classList.remove('show');
      document.getElementById('fc-gen-body').style.pointerEvents = '';
      const $strip = document.getElementById('fc-gen-result-strip');
      const $count = document.getElementById('fc-gen-result-count');
      const $info  = document.getElementById('fc-gen-result-info');
      if ($strip) $strip.classList.add('show');
      if ($count) $count.textContent = newCards.length;
      if ($info)  $info.textContent  = `cards de "${discNome}" adicionados ao baralho. Pronto para revisar!`;
      const $btn = document.getElementById('fc-gen-btn');
      if ($btn) { $btn.disabled = false; $btn.textContent = '✦ Gerar Mais'; }

      // Refresh flashcards view
      if (typeof Render !== 'undefined') Render.flashcards();
      if (typeof Briefing !== 'undefined') Briefing.updateBadges();

      // Toast
      const t = document.createElement('div');
      t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:rgba(232,184,75,0.12);border:1px solid rgba(232,184,75,0.35);color:var(--gold);padding:12px 22px;border-radius:12px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none;box-shadow:0 8px 32px rgba(0,0,0,0.4)';
      t.textContent = `✦ ${newCards.length} flashcards gerados para ${discNome}!`;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 4000);

    } catch (err) {
      console.error('[FCGenerator]', err);
      document.getElementById('fc-gen-loading')?.classList.remove('show');
      document.getElementById('fc-gen-body').style.pointerEvents = '';
      const $btn = document.getElementById('fc-gen-btn');
      if ($btn) { $btn.disabled = false; $btn.textContent = '✦ GERAR FLASHCARDS'; }
      const t = document.createElement('div');
      t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:rgba(255,77,77,0.12);border:1px solid rgba(255,77,77,0.3);color:var(--red);padding:12px 22px;border-radius:12px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none';
      t.textContent = '❌ Erro: ' + err.message;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 5000);
    }
  }

  // Close on overlay click
  document.addEventListener('click', e => {
    const overlay = document.getElementById('fc-gen-overlay');
    if (e.target === overlay) close();
  });

  /* ── openFromBlock: abre modal pré-preenchido com dados do bloco ── */
  let _fromCronograma = false;

  function openFromBlock(materia, descricao) {
    _fromCronograma = true;

    const overlay = document.getElementById('fc-gen-overlay');
    if (!overlay) return;

    // Populate disc dropdown — buscar disciplina correspondente no edital
    const $disc  = document.getElementById('fc-gen-disc');
    const $topic = document.getElementById('fc-gen-topic');
    if ($disc) {
      const edData = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
      const discs  = edData?.disciplinas || [];

      // Match materia do bloco com disciplina do edital
      const normalizeStr = s => { if(!s) return ''; let r = s.toLowerCase().normalize('NFD'); let out = ''; for(let i=0;i<r.length;i++){const c=r.charCodeAt(i); if(c<0x0300||c>0x036f) out+=r[i];} return out.replace(/[^a-z0-9 ]/g,''); };
      const blockNorm = normalizeStr(materia);
      let matched = discs.find(d => normalizeStr(d.nome) === blockNorm)
        || discs.find(d => blockNorm.includes(normalizeStr(d.nome).slice(0,8)) || normalizeStr(d.nome).includes(blockNorm.slice(0,8)));

      $disc.innerHTML = '<option value="">Selecione a matéria...</option>' +
        discs.map(d => `<option value="${d.id}" data-nome="${d.nome}" ${matched && d.id===matched.id?'selected':''}>${d.nome}</option>`).join('');

      if (matched) {
        _populateTopics(matched);
      } else {
        $topic.innerHTML = `<option value="">Todos os tópicos da disciplina</option><option value="${materia}" selected>${materia}</option>`;
      }
    }

    // Pré-preencher campo de foco com a descrição do bloco (primeiros 200 chars limpos)
    const $focus = document.getElementById('fc-gen-focus');
    if ($focus) {
      const cleanDesc = descricao.replace(/^(TEORIA|QUESTÕES|REVISÃO ATIVA|REVISÃO PROFUNDA|REVISÃO TOTAL|REVISÃO CIRÚRGICA|REVISÃO|FLASHCARDS|SIMULADO|ANÁLISE)[^:]*:\s*/i,'').slice(0,200);
      $focus.value = cleanDesc ? `Foco: ${cleanDesc}` : '';
    }

    // Indicador visual de origem
    const header = document.querySelector('.fc-gen-subtitle');
    if (header) header.textContent = `🗓️ Gerando cards para: ${materia}`;

    // Pre-fill banca
    const profile = (typeof Onboarding !== 'undefined') ? Onboarding.getUserProfile() : null;
    _banca = profile?.concurso?.banca || 'CEBRASPE';

    _resetResult();
    overlay.style.opacity = '0';
    overlay.classList.add('open');
    requestAnimationFrame(() => { overlay.style.transition = 'opacity 0.2s'; overlay.style.opacity = '1'; });
  }

  /* ── Override generate to save to cronograma storage when from block ── */
  const _originalGenerate = generate;
  async function generateWithRouting() {
    if (!_fromCronograma) {
      return _originalGenerate();
    }

    // Same logic as generate() but saves to nexus_flash_cronograma_v1
    const key = _apiKey();
    if (!key) {
      alert('Chave de API não encontrada. Configure-a em Configurações → Integrações.');
      return;
    }

    const discSel  = document.getElementById('fc-gen-disc');
    const discId   = discSel?.value;
    const discNome = discSel?.options[discSel.selectedIndex]?.dataset?.nome || discSel?.options[discSel.selectedIndex]?.text || '';
    const topicVal = document.getElementById('fc-gen-topic')?.value || '';
    const focus    = document.getElementById('fc-gen-focus')?.value.trim() || '';

    if (!discId && !topicVal) {
      const $d = document.getElementById('fc-gen-disc');
      if ($d) { $d.style.borderColor = 'var(--red)'; setTimeout(() => $d.style.borderColor = '', 2500); }
      return;
    }

    const edData   = (typeof EditalEngine !== 'undefined') ? EditalEngine.getData() : null;
    const disc     = edData?.disciplinas?.find(d => d.id === discId);
    const topicsCtx= disc?.topicos?.map(t => t.texto).slice(0,20).join(' | ') || '';
    const banca    = _banca || edData?.concurso?.banca || 'CESPE/CEBRASPE';
    const concurso = edData?.concurso?.nome || 'Concurso';

    const diffInstr = _diff === '1' ? 'nível fácil (conceitos básicos, definições)'
      : _diff === '2' ? 'nível médio (aplicação, interpretação, distinções)'
      : _diff === '3' ? 'nível difícil (pegadinhas, literalidade, casos extremos, prazos)'
      : 'mix de fácil, médio e difícil equilibrado';

    const estiloInstr = _estilo === 'cespe' ? 'perguntas assertivas (afirmações verdadeiras ou falsas, estilo CESPE/CEBRASPE)'
      : _estilo === 'multipla' ? 'perguntas de múltipla escolha com 4 opções (A, B, C, D)'
      : _estilo === 'pratico' ? 'situações práticas e casos concretos'
      : 'perguntas conceituais diretas';

    _setLoading(`Gerando ${_qty} flashcards de ${discNome || topicVal}...`);

    const prompt = `Voce e especialista em concursos publicos brasileiros. Gere exatamente ${_qty} flashcards para:

CONCURSO: ${concurso}
BANCA: ${banca}
DISCIPLINA: ${discNome || topicVal}
${topicVal ? 'TOPICO ESPECIFICO: ' + topicVal : ''}
${focus ? 'CONTEXTO DO BLOCO DE ESTUDO: ' + focus : ''}
${topicsCtx ? 'TOPICOS DO EDITAL: ' + topicsCtx : ''}

CONFIGURACOES: Dificuldade: ${diffInstr} · Estilo: ${estiloInstr}

MARCACOES OBRIGATORIAS na resposta (a): ==dourado== !!vermelho!! **verde** ~~azul~~

Retorne SOMENTE JSON: {"cards":[{"q":"pergunta","a":"resposta","diff":2,"topic":"topico"}]}`;

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 6000, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const data = await resp.json();
      let raw = (data.content||[]).map(b=>b.text||'').join('');
      let s = raw.replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
      const st = s.indexOf('{'), en = s.lastIndexOf('}');
      if (st !== -1 && en > st) s = s.slice(st, en+1);
      s = s.replace(/,(\s*[}\]])/g,'$1'); s = s.split('').filter(function(c){var n=c.charCodeAt(0);return n>=32||n===9||n===10||n===13;}).join('');
      const parsed = JSON.parse(s);
      if (!Array.isArray(parsed.cards) || !parsed.cards.length) throw new Error('Nenhum card retornado');

      const today = new Date().toISOString().split('T')[0];
      const newCards = parsed.cards.map((c,i) => ({
        id: 'fc_cron_' + Date.now() + '_' + i,
        materia: discNome || topicVal,
        topic: topicVal || c.topic || discNome,
        diff: parseInt(c.diff) || 2,
        q: c.q || '', a: c.a || '',
        createdAt: today, fromCronograma: true, _user: true,
      }));

      // Save to cronograma storage
      FCCronView.addCards(newCards);

      // Show result
      document.getElementById('fc-gen-loading')?.classList.remove('show');
      document.getElementById('fc-gen-body').style.pointerEvents = '';
      const $strip = document.getElementById('fc-gen-result-strip');
      const $count = document.getElementById('fc-gen-result-count');
      const $info  = document.getElementById('fc-gen-result-info');
      if ($strip) $strip.classList.add('show');
      if ($count) $count.textContent = newCards.length;
      if ($info)  $info.textContent  = `cards de "${discNome}" salvos na visão Cronograma!`;
      const $btn = document.getElementById('fc-gen-btn');
      if ($btn) { $btn.disabled = false; $btn.textContent = '✦ Gerar Mais'; }

      // Update cronograma badge
      FCCronView.updateBadge();

      // Toast
      const t = document.createElement('div');
      t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:rgba(232,184,75,0.12);border:1px solid rgba(232,184,75,0.35);color:var(--gold);padding:12px 22px;border-radius:12px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none;box-shadow:0 8px 32px rgba(0,0,0,0.4)';
      t.textContent = `🃏 ${newCards.length} cards salvos no Cronograma → aba Flashcards`;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 4000);

    } catch(err) {
      console.error('[FCGenerator fromBlock]', err);
      document.getElementById('fc-gen-loading')?.classList.remove('show');
      document.getElementById('fc-gen-body').style.pointerEvents = '';
      const $btn = document.getElementById('fc-gen-btn');
      if ($btn) { $btn.disabled = false; $btn.textContent = '✦ GERAR FLASHCARDS'; }
      const t = document.createElement('div');
      t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:rgba(255,77,77,0.12);border:1px solid rgba(255,77,77,0.3);color:var(--red);padding:12px 22px;border-radius:12px;font-size:12px;font-weight:700;z-index:9999;pointer-events:none';
      t.textContent = '❌ Erro: ' + err.message;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 5000);
    }
  }

  function restore() {
    _removePip();
    const overlay = document.getElementById('fc-gen-overlay');
    if (overlay) { overlay.classList.add('open'); }
  }

  /* Reset _fromCronograma flag on normal open */
  const _origOpenModal = openModal;
  function openModalNormal() { _fromCronograma = false; const h = document.querySelector('.fc-gen-subtitle'); if(h) h.textContent = 'IA gera cards no padrão do sistema com destaques coloridos'; _origOpenModal(); }

  return { openModal: openModalNormal, openFromBlock, close, minimize, restore, onDiscChange, setQty, setDiff, setEstilo, generate: generateWithRouting };
})();
