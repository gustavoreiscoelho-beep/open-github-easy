/* ════════════════════════════════════════════════════════════
   QUESTÕES — Banco de Questões via PDF (premium redesign)
   ════════════════════════════════════════════════════════════ */
const Questoes = (() => {

  const LS_BANK       = 'nexus_questoes_bank_v1';
  const LS_ATTEMPTS   = 'nexus_questoes_attempts_v1';
  const LS_API        = 'nexus_api_key';
  const LS_MARCADORES = 'nexus_questoes_marcadores_v1';
  const LS_ANOTACOES  = 'nexus_questoes_anotacoes_v1';
  const LS_COMENTARIOS= 'nexus_questoes_comentarios_v1';
  const MODEL_PDF     = 'claude-opus-4-5';

  /* ── State ──────────────────────────── */
  let _tab          = 'banco';
  let _filterDisc   = 'all';
  let _filterTopic  = 'all';
  let _filterStatus = 'all';
  let _filterBanca  = 'all';
  let _filterAno    = 'all';
  let _search       = '';
  let _expandedDiscs  = new Set();
  let _expandedTopics = new Set();
  let _expandedCards  = new Set();
  let _openSections   = new Set(['Status', 'Disciplina']);
  let _topicDropOpen  = false;
  let _revealedAnswer = new Set(); // qids com resposta revelada
  let _bancaDropOpen  = false;
  let _anoDropOpen    = false;
  let _activePanel    = {}; // qid → 'comentarios'|'marcadores'|'anotacoes'|'estatisticas'|null
  let _import    = null;
  let _generate  = null;
  let _session   = null;
  let _timerInt  = null;
  let _pendingAnswers = {}; // qid → selected letter (before confirming)
  let _eliminated = {};    // qid → Set of eliminated letters

  /* ── Storage ──────────────────────── */
  function _bank()         { try { return JSON.parse(localStorage.getItem(LS_BANK)     || '[]'); } catch(e){ return []; } }
  function _saveBank(arr)  { try { localStorage.setItem(LS_BANK,     JSON.stringify(arr)); } catch(e){} }
  function _attempts()     { try { return JSON.parse(localStorage.getItem(LS_ATTEMPTS) || '[]'); } catch(e){ return []; } }
  function _saveAttempts(a){ try { localStorage.setItem(LS_ATTEMPTS, JSON.stringify(a)); } catch(e){} }
  function _apiKey()       { try { return localStorage.getItem(LS_API) || ''; } catch(e){ return ''; } }

  function _marcadores()        { try { return JSON.parse(localStorage.getItem(LS_MARCADORES) || '{}'); } catch(e){ return {}; } }
  function _saveMarcadores(o)   { try { localStorage.setItem(LS_MARCADORES, JSON.stringify(o)); } catch(e){} }
  function _anotacoes()         { try { return JSON.parse(localStorage.getItem(LS_ANOTACOES)  || '{}'); } catch(e){ return {}; } }
  function _saveAnotacoes(o)    { try { localStorage.setItem(LS_ANOTACOES,  JSON.stringify(o)); } catch(e){} }
  function _comentarios()       { try { return JSON.parse(localStorage.getItem(LS_COMENTARIOS)|| '{}'); } catch(e){ return {}; } }
  function _saveComentarios(o)  { try { localStorage.setItem(LS_COMENTARIOS,JSON.stringify(o)); } catch(e){} }

  function _setPdfBusy(v) {
    try { v ? sessionStorage.setItem('nexus_pdf_extraction_busy','1') : sessionStorage.removeItem('nexus_pdf_extraction_busy'); } catch(e){}
    try { window.parent?.postMessage({ type:'nexus:busy', value:!!v }, '*'); } catch(e){}
  }

  /* ── Helpers ──────────────────────── */
  function _toast(msg, kind='gold') {
    const t = document.createElement('div');
    t.className = `qb-toast ${kind}`; t.textContent = msg;
    document.body.appendChild(t); setTimeout(()=>t.remove(), 2400);
  }
  function _esc(s) { return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function _uid()  { return 'q'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }

  function _fmtHighlight(text) {
    const e = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    let o = e(String(text||''));
    o = o.replace(/==(.*?)==/g, '<span class="qx-hl-gold">$1</span>');
    o = o.replace(/!!(.*?)!!/g, '<span class="qx-hl-red">$1</span>');
    o = o.replace(/\*\*(.*?)\*\*/g, '<span class="qx-hl-green">$1</span>');
    o = o.replace(/~~(.*?)~~/g, '<span class="qx-hl-blue">$1</span>');
    return o;
  }

  function _fmtComentario(raw, gabarito, alternativas) {
    const text = String(raw||'').trim();
    if (!text) return '';

    const gab = String(gabarito||'').toUpperCase();

    // Regex que captura blocos iniciados por referência a alternativas
    const altPattern = /(?:A\s+)?(?:alternativa|letra)\s+([A-E])\b[^]*?(?=(?:A\s+)?(?:alternativa|letra)\s+[A-E]\b|$)/gi;
    const blocks = [];
    let match;
    let lastIndex = 0;

    // Encontrar todos os blocos de alternativas
    const re = /(?:A\s+)?(?:alternativa|letra)\s+([A-E])\b/gi;
    const positions = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      positions.push({ index: m.index, letra: m[1].toUpperCase() });
    }

    if (positions.length === 0) {
      // Sem estrutura de alternativas — parágrafo único limpo
      return `<div class="qx-explain-body"><p class="qx-explain-intro">${_fmtHighlight(text)}</p></div>`;
    }

    // Texto de introdução (antes da primeira menção)
    const intro = text.slice(0, positions[0].index).trim();

    // Fatiar o texto em blocos por alternativa
    const altBlocks = positions.map((pos, i) => {
      const end = i + 1 < positions.length ? positions[i+1].index : text.length;
      return { letra: pos.letra, content: text.slice(pos.index, end).trim() };
    });

    const introHtml = intro
      ? `<div class="qx-explain-intro"><span class="qx-explain-intro-icon">📋</span><p>${_fmtHighlight(intro)}</p></div>`
      : '';

    const altsHtml = altBlocks.map(({ letra, content }) => {
      const isCorrect = letra === gab;
      const icon = isCorrect
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      const label = isCorrect ? 'CORRETA' : 'INCORRETA';
      return `
        <div class="qx-explain-alt-row ${isCorrect ? 'correct' : 'wrong'}">
          <span class="qx-explain-alt-badge ${isCorrect ? 'correct' : 'wrong'}">${letra}</span>
          <p class="qx-explain-alt-text">${_esc(content)} <span class="qx-explain-alt-label ${isCorrect ? 'correct' : 'wrong'}">${icon} ${label}</span></p>
        </div>`;
    }).join('');

    return `<div class="qx-explain-body">${introHtml}<div class="qx-explain-alts">${altsHtml}</div></div>`;
  }

  function _fmtStmt(raw) {
    const text = String(raw||'').trim();

    // ── Detecção de padrões de lista ──────────────────────────
    // Romano:      I. II. III. IV. V. VI. VII. VIII. IX. X. XI. XII.
    const reRoman    = /(?<!\w)(X{0,2}(?:IX|IV|V?I{0,3}))\.\s+\S/;
    // Decimal ponto: 1. 2. 3. (letra maiúsc ou minúsc após)
    const reNumPt    = /\b\d+\.\s+[A-ZÁÉÍÓÚÀÂÃÊÔa-záéíóúàâãêô]/;
    // Decimal parêntese: 1) 2) 3)
    const reNumPar   = /\b\d+\)\s+\S/;
    // Letra minúscula parêntese: a) b) c)
    const reAlphaLow = /\b[a-z]\)\s+\S/;
    // Letra maiúscula ponto: A. B. C. (não confundir com siglas)
    const reAlphaUp  = /\b[A-Z]\.\s+[A-ZÁÉÍÓÚÀÂÃÊÔ][a-záéíóúàâãêô]/;
    // Associação: ( ) texto
    const reAssoc    = /\(\s*\)\s+\S/;

    const hasRoman    = reRoman.test(text);
    const hasNumPt    = reNumPt.test(text);
    const hasNumPar   = reNumPar.test(text);
    const hasAlphaLow = reAlphaLow.test(text);
    const hasAlphaUp  = reAlphaUp.test(text);
    const hasAssoc    = reAssoc.test(text);
    const hasList     = hasRoman || hasNumPt || hasNumPar || hasAlphaLow || hasAlphaUp;

    if (!hasList && !hasAssoc) {
      return `<p class="qx-stmt-para">${_esc(text)}</p>`;
    }

    // ── Escolhe o regex de split conforme o padrão detectado ──
    let splitRe;
    if      (hasRoman)    splitRe = /(?=(?<!\w)(?:X{0,2}(?:IX|IV|V?I{0,3}))\.\s+\S)/;
    else if (hasNumPt)    splitRe = /(?=\b\d+\.\s+[A-ZÁÉÍÓÚÀÂÃÊÔa-záéíóúàâãêô])/;
    else if (hasNumPar)   splitRe = /(?=\b\d+\)\s+\S)/;
    else if (hasAlphaLow) splitRe = /(?=\b[a-z]\)\s+\S)/;
    else if (hasAlphaUp)  splitRe = /(?=\b[A-Z]\.\s+[A-ZÁÉÍÓÚÀÂÃÊÔ][a-záéíóúàâãêô])/;

    if (hasList && splitRe) {
      const parts    = text.split(splitRe);
      const intro    = parts[0].trim();
      const rawItems = parts.slice(1);

      // Verifica se itens ( ) estão embutidos no final do último item
      let itemsSection = rawItems;
      let assocSection = [];
      const lastItem = rawItems[rawItems.length - 1] || '';
      if (reAssoc.test(lastItem)) {
        const lastParts  = lastItem.split(/(?=\(\s*\)\s+\S)/);
        itemsSection     = [...rawItems.slice(0, -1), lastParts[0].trim()].filter(Boolean);
        const assocRaw   = lastParts.slice(1).join('');
        assocSection     = assocRaw.split(/(?=\(\s*\)\s+\S)/).map(s=>s.trim()).filter(Boolean);
      }

      const introHtml = intro ? `<p class="qx-stmt-para">${_esc(intro)}</p>` : '';
      const itemsHtml = itemsSection.length
        ? `<div class="qx-stmt-list">${itemsSection.map(i=>`<p class="qx-stmt-item">${_esc(i.trim())}</p>`).join('')}</div>`
        : '';
      const assocHtml = assocSection.length
        ? `<div class="qx-stmt-assoc">${assocSection.map(a=>`<p class="qx-stmt-assoc-item">${_esc(a)}</p>`).join('')}</div>`
        : '';

      return introHtml + itemsHtml + assocHtml;
    }

    // ── Caso puro de associação ( ) ───────────────────────────
    if (hasAssoc) {
      const parts        = text.split(/(?=\(\s*\)\s+\S)/).map(s=>s.trim()).filter(Boolean);
      const firstIsAssoc = /^\(\s*\)/.test(parts[0]);
      const intro        = !firstIsAssoc ? parts[0] : '';
      const assocRaw     = !firstIsAssoc ? parts.slice(1) : parts;

      const introHtml = intro ? `<p class="qx-stmt-para">${_esc(intro)}</p>` : '';
      const assocHtml = assocRaw.length
        ? `<div class="qx-stmt-assoc">${assocRaw.map(a=>`<p class="qx-stmt-assoc-item">${_esc(a)}</p>`).join('')}</div>`
        : '';

      return introHtml + assocHtml;
    }

    return `<p class="qx-stmt-para">${_esc(text)}</p>`;
  }

  function _parseJSONRobust(txt) {
    if (!txt) return null;
    let s = String(txt).trim().replace(/^```(?:json)?\s*/i,'').replace(/```\s*$/,'').trim();
    try { return JSON.parse(s); } catch(e){}
    const m = s.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (m) { try { return JSON.parse(m[0]); } catch(e){} }
    return null;
  }

  function _edital() {
    if (typeof EditalEngine === 'undefined') return null;
    try { return EditalEngine.getData(); } catch(e){ return null; }
  }

  function _statusOf(qid) {
    const at = _attempts().filter(a => a.qid === qid);
    if (!at.length) return 'pending';
    return at[at.length-1].correct ? 'done' : 'wrong';
  }

  function _discColor(name) {
    if (!name) return '#E8B84B';
    if (typeof CicloEstudos !== 'undefined' && CicloEstudos.getColorMap) {
      const m = CicloEstudos.getColorMap();
      if (m[name]) return m[name];
    }
    const ed = _edital();
    const d = (ed?.disciplinas||[]).find(d => d.nome === name);
    return d?.cor || '#E8B84B';
  }

  function _short(name) {
    return (name||'').replace(/^noções de\s+/i,'').replace(/^noção de\s+/i,'');
  }

  function _hasFilters() {
    return _filterDisc!=='all'||_filterTopic!=='all'||_filterStatus!=='all'||_filterBanca!=='all'||_filterAno!=='all'||!!_search;
  }

  /* ════════════════════════════════════════
     RENDER ENTRY
     ════════════════════════════════════════ */
  function render() {
    const $root = document.getElementById('qx-root');
    if (!$root) return;
    const bank = _bank(), att = _attempts();
    const total   = bank.length;
    const correct = att.filter(a=>a.correct).length;
    const wrong   = att.length - correct;
    const pct     = att.length ? Math.round(correct/att.length*100) : 0;

    const _pctClr = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--gold)' : pct > 0 ? 'var(--red)' : 'var(--text-dim)';
    $root.innerHTML = `
      <div class="qx-shell">
        <div class="cad-hero qx-hero" style="margin-bottom:16px">
          <div class="cad-hero-left">
            <div class="cad-hero-eyebrow">FERRAMENTA · PRÁTICA INTELIGENTE</div>
            <h1 class="cad-hero-title">BANCO DE QUESTÕES</h1>
            <div style="display:flex;align-items:center;gap:18px;margin-top:4px;flex-wrap:wrap">
              <div class="qx-hero-kpi"><span class="qx-hero-kpi-num">${total}</span><span class="qx-hero-kpi-lbl">questões</span></div>
              <div class="qx-hero-kpi-sep"></div>
              <div class="qx-hero-kpi"><span class="qx-hero-kpi-num" style="color:#86efac">${correct}</span><span class="qx-hero-kpi-lbl">acertos</span></div>
              <div class="qx-hero-kpi-sep"></div>
              <div class="qx-hero-kpi"><span class="qx-hero-kpi-num" style="color:#FF8A8A">${wrong}</span><span class="qx-hero-kpi-lbl">erros</span></div>
              <div class="qx-hero-kpi-sep"></div>
              <div class="qx-hero-kpi"><span class="qx-hero-kpi-num" style="color:${_pctClr}">${pct}%</span><span class="qx-hero-kpi-lbl">aproveitamento</span></div>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-shrink:0;align-self:flex-end;margin-bottom:6px">
            <button class="ciclo-btn-secondary" onclick="Questoes.openImport()">＋ Importar PDF</button>
            <button class="ciclo-btn-primary" onclick="Questoes.openGenerate()">🤖 Gerar com IA</button>
          </div>
        </div>
        <div id="qb-content" class="qx-content"></div>
      </div>
    `;
    _renderContent();
    if (!document._qxDocClickBound) {
      document._qxDocClickBound = true;
      document.addEventListener('click', _onDocClick, { capture: true });
    }
  }

  function _onDocClick(e) {
    if ((_topicDropOpen || _bancaDropOpen || _anoDropOpen) && !e.target.closest('.qx-topic-dd-wrap')) {
      _topicDropOpen = false; _bancaDropOpen = false; _anoDropOpen = false;
      _renderContent();
    }
  }

  function setTab(t) { _tab = t; render(); }

  function _renderContent() {
    const $c = document.getElementById('qb-content');
    if (!$c) return;
    if (_tab === 'stats') { $c.innerHTML = _renderStats(); return; }
    $c.innerHTML = _renderBanco();
  }

  /* ════════════════════════════════════════
     BANCO VIEW
     ════════════════════════════════════════ */
  function _renderBanco() {
    const bank     = _bank();
    const filtered = _applyFilters(bank);
    return `
      <div class="qx-banco-layout">
        <div class="qx-main-area">
          ${_renderStatusBar(bank)}
          ${_renderDiscChips(bank)}
          ${_renderInlineFilters(bank)}
          <div class="qx-search-bar">
            <div class="qx-search-wrap">
              <span class="qx-search-ic">🔍</span>
              <input class="qx-search-input" type="text"
                placeholder="Buscar por enunciado, banca, disciplina..."
                value="${_esc(_search)}" oninput="Questoes.setSearch(this.value)" />
              ${_search ? `<button class="qx-search-clear" onclick="Questoes.setSearch('')">✕</button>` : ''}
            </div>
            <button class="qx-btn-solve${!filtered.length?' disabled':''}" ${!filtered.length?'disabled':''}
              onclick="Questoes.startSession()">▶ Resolver (${filtered.length})</button>
          </div>
          <div class="qx-list-hdr">
            <span class="qx-list-count">${filtered.length} ${filtered.length===1?'questão':'questões'}</span>
            ${filtered.length!==bank.length&&bank.length?`<span class="qx-list-total">de ${bank.length} no banco</span>`:''}
          </div>
          ${_renderList(filtered, bank)}
        </div>
      </div>
    `;
  }

  function _renderStatusBar(bank) {
    const total   = bank.length;
    const pending = bank.filter(q => _statusOf(q.id) === 'pending').length;
    const done    = bank.filter(q => _statusOf(q.id) === 'done').length;
    const wrong   = bank.filter(q => _statusOf(q.id) === 'wrong').length;
    const opts = [
      { val:'all',     lbl:'Todas',      cnt: total,   icon:'',   color:'' },
      { val:'pending', lbl:'Pendentes',  cnt: pending, icon:'⏳', color:'' },
      { val:'done',    lbl:'Acertei',    cnt: done,    icon:'✓',  color:'#4ADE80' },
      { val:'wrong',   lbl:'Errei',      cnt: wrong,   icon:'✗',  color:'#FF5050' },
    ];
    return `<div class="qx-status-bar">
      ${opts.map(o => {
        const active = _filterStatus === o.val;
        return `<button class="qx-status-btn${active?' active':''}"
          style="${active&&o.color?`border-color:${o.color};color:${o.color};background:${o.color}14`:active?'border-color:var(--gold);color:var(--gold);background:rgba(232,184,75,0.10)':''}"
          onclick="Questoes.setStatus('${o.val}')">
          ${o.icon?`<span class="qx-status-icon" style="${o.color?`color:${o.color}`:''}">${o.icon}</span>`:''}
          <span>${o.lbl}</span>
          <span class="qx-status-cnt" style="${active&&o.color?`background:${o.color}22;color:${o.color}`:active?'background:rgba(232,184,75,0.18);color:var(--gold)':''}">${o.cnt}</span>
        </button>`;
      }).join('')}
      <div style="margin-left:auto;display:flex;gap:6px">
        <button class="qx-status-btn${_tab==='stats'?' active':''}" onclick="Questoes.setTab('stats')">📊 Desempenho</button>
        <button class="qx-status-btn${_tab==='banco'?' active':''}" onclick="Questoes.setTab('banco')">📋 Banco</button>
      </div>
    </div>`;
  }

  function _renderDiscChips(bank) {
    const ed    = _edital();
    const discs = ed?.disciplinas || [];
    const allDiscs = discs.map(d => ({ name: d.nome, color: _discColor(d.nome) }));
    bank.forEach(q => {
      if (q.disciplina && !allDiscs.find(d => d.name === q.disciplina))
        allDiscs.push({ name: q.disciplina, color: _discColor(q.disciplina) });
    });
    const totalCount = bank.length;
    return `
      <div class="qx-disc-chips-wrap">
      <div class="qx-disc-chips">
        <span class="qx-disc-chips-label">Matérias</span>
        <button class="qx-disc-chip ${_filterDisc==='all'?'active':''}"
                onclick="Questoes.filterDisc('all')">
          <span class="qx-disc-chip-dot" style="background:#E8B84B"></span>
          <span>Todas</span>
          <span class="qx-disc-chip-cnt">${totalCount}</span>
        </button>
        ${allDiscs.map(d => {
          const cnt = bank.filter(q => q.disciplina === d.name).length;
          const active = _filterDisc === d.name;
          return `<button class="qx-disc-chip ${active?'active':''}"
                          style="${active?`--chip-color:${d.color};border-color:${d.color};background:${d.color}18`:''}"
                          onclick="Questoes.filterDisc('${_esc(d.name)}')">
            <span class="qx-disc-chip-dot" style="background:${d.color}${active?'':'99'}"></span>
            <span style="${active?`color:${d.color}`:''}">${_esc(_short(d.name))}</span>
            <span class="qx-disc-chip-cnt">${cnt}</span>
          </button>`;
        }).join('')}
      </div>
      </div>`;
  }

  function _renderTopicChips(bank) {
    const ed   = _edital();
    const disc = (ed?.disciplinas||[]).find(d => d.nome === _filterDisc);
    const color = _discColor(_filterDisc);
    // topics from edital definition
    const edTopics = (disc?.topicos||[]).map(t => (t.texto||t.nome||'').replace(/^⚡\s*/,'').trim()).filter(Boolean);
    // topics present in bank for this disc
    const bankTopics = [...new Set(bank.filter(q=>q.disciplina===_filterDisc&&q.topico).map(q=>q.topico))];
    const topics = edTopics.length ? edTopics : bankTopics;
    if (!topics.length) return '';
    const allCount = bank.filter(q => q.disciplina === _filterDisc).length;
    return `
      <div class="qx-topic-chips">
        <button class="qx-topic-chip ${_filterTopic==='all'?'active':''}"
                style="${_filterTopic==='all'?`border-color:${color};background:${color}18`:''}"
                onclick="Questoes.filterTopic('${_esc(_filterDisc)}','all')">
          <span style="${_filterTopic==='all'?`color:${color}`:''}">Todos os tópicos</span>
          <span class="qx-topic-chip-cnt">${allCount}</span>
        </button>
        ${topics.map(t => {
          const cnt = bank.filter(q => q.disciplina===_filterDisc && q.topico===t).length;
          const active = _filterTopic === t;
          return `<button class="qx-topic-chip ${active?'active':''}"
                          style="${active?`border-color:${color};background:${color}18`:''}"
                          onclick="Questoes.filterTopic('${_esc(_filterDisc)}','${_esc(t)}')">
            <span style="${active?`color:${color}`:''}">${_esc(t)}</span>
            ${cnt ? `<span class="qx-topic-chip-cnt">${cnt}</span>` : ''}
          </button>`;
        }).join('')}
      </div>`;
  }

  function _renderInlineFilters(bank) {
    const bancas = [...new Set(bank.map(q=>q.banca).filter(Boolean))].sort();
    const anos   = [...new Set(bank.map(q=>q.ano).filter(Boolean))].sort((a,b)=>b-a);

    const _dd = (lbl, isOpen, hasVal, activeLabel, toggleFn, items) => `
      <div class="qx-inline-filter-group">
        <span class="qx-inline-filter-lbl">${lbl}</span>
        <div class="qx-topic-dd-wrap${isOpen?' open':''}">
          <button class="qx-topic-dd-trigger${hasVal?' has-value':''}"
            onclick="event.stopPropagation();Questoes.${toggleFn}()">
            <span>${_esc(activeLabel)}</span>
            <span class="qx-topic-dd-arrow">${isOpen?'▲':'▼'}</span>
          </button>
          ${isOpen ? `<div class="qx-topic-dd-list">${items}</div>` : ''}
        </div>
      </div>`;

    const _ddItem = (label, active, onclick, cnt) =>
      `<div class="qx-topic-dd-item${active?' active':''}" onclick="${onclick}" title="${_esc(label)}">
        <span>${_esc(label)}</span>
        ${cnt!==undefined?`<span class="qx-topic-dd-cnt">${cnt}</span>`:''}
      </div>`;

    // Banca dropdown
    let bancaDropdown = '';
    if (bancas.length) {
      const allCnt = bank.length;
      const items = [
        _ddItem('Todas', _filterBanca==='all', "event.stopPropagation();Questoes.setBanca('all');Questoes.closeBancaDrop()", allCnt),
        ...bancas.map(b => _ddItem(b, _filterBanca===b,
          `event.stopPropagation();Questoes.setBanca('${_esc(b)}');Questoes.closeBancaDrop()`,
          bank.filter(q=>q.banca===b).length))
      ].join('');
      bancaDropdown = _dd('Banca', _bancaDropOpen, _filterBanca!=='all',
        _filterBanca==='all' ? 'Todas' : _filterBanca, 'toggleBancaDrop', items);
    }

    // Ano dropdown
    let anoDropdown = '';
    if (anos.length) {
      const allCnt = bank.length;
      const items = [
        _ddItem('Todos', _filterAno==='all', "event.stopPropagation();Questoes.setAno('all');Questoes.closeAnoDrop()", allCnt),
        ...anos.map(a => _ddItem(String(a), _filterAno===a,
          `event.stopPropagation();Questoes.setAno('${_esc(a)}');Questoes.closeAnoDrop()`,
          bank.filter(q=>q.ano===a).length))
      ].join('');
      anoDropdown = _dd('Ano', _anoDropOpen, _filterAno!=='all',
        _filterAno==='all' ? 'Todos' : String(_filterAno), 'toggleAnoDrop', items);
    }

    // Tópico dropdown — só quando disciplina selecionada
    let topicDropdown = '';
    if (_filterDisc !== 'all') {
      const color  = _discColor(_filterDisc);
      const ed     = _edital();
      const disc   = (ed?.disciplinas||[]).find(d => d.nome === _filterDisc);
      const edTopics   = (disc?.topicos||[]).map(t => (t.texto||t.nome||'').replace(/^⚡\s*/,'').trim()).filter(Boolean);
      const bankTopics = [...new Set(bank.filter(q=>q.disciplina===_filterDisc&&q.topico).map(q=>q.topico))];
      const topics = edTopics.length ? edTopics : bankTopics;

      if (topics.length) {
        const allCnt = bank.filter(q=>q.disciplina===_filterDisc).length;
        const items = [
          `<div class="qx-topic-dd-item${_filterTopic==='all'?' active':''}"
             onclick="event.stopPropagation();Questoes.filterTopic('${_esc(_filterDisc)}','all');Questoes.closeTopicDrop()">
            <span>Todos os tópicos</span><span class="qx-topic-dd-cnt">${allCnt}</span>
          </div>`,
          ...topics.map(t => {
            const cnt = bank.filter(q=>q.disciplina===_filterDisc&&q.topico===t).length;
            return `<div class="qx-topic-dd-item${_filterTopic===t?' active':''}"
               onclick="event.stopPropagation();Questoes.filterTopic('${_esc(_filterDisc)}','${_esc(t)}');Questoes.closeTopicDrop()"
               title="${_esc(t)}">
              <span>${_esc(t)}</span>
              ${cnt?`<span class="qx-topic-dd-cnt">${cnt}</span>`:''}
            </div>`;
          })
        ].join('');

        const activeLabel = _filterTopic === 'all' ? 'Todos os tópicos' : _filterTopic;
        topicDropdown = `
          <div class="qx-inline-filter-group">
            <span class="qx-inline-filter-lbl">Tópico</span>
            <div class="qx-topic-dd-wrap${_topicDropOpen?' open':''}">
              <button class="qx-topic-dd-trigger${_filterTopic!=='all'?' has-value':''}"
                style="${_filterTopic!=='all'?`border-color:${color};color:${color}`:''}"
                onclick="event.stopPropagation();Questoes.toggleTopicDrop()">
                <span>${_esc(activeLabel)}</span>
                <span class="qx-topic-dd-arrow">${_topicDropOpen?'▲':'▼'}</span>
              </button>
              ${_topicDropOpen ? `<div class="qx-topic-dd-list">${items}</div>` : ''}
            </div>
          </div>`;
      }
    }

    if (!bancaDropdown && !anoDropdown && !topicDropdown) return '';
    return `<div class="qx-inline-filters">${bancaDropdown}${anoDropdown}${topicDropdown}</div>`;
  }

  /* ── Filter panel ─────────────────────── */
  function _renderFilterPanel(bank) {
    const bancas = [...new Set(bank.map(q=>q.banca).filter(Boolean))].sort();
    const anos   = [...new Set(bank.map(q=>q.ano).filter(Boolean))].sort((a,b)=>b-a);

    const sec = (name, open, body) => `
      <div class="qx-fs ${open?'open':''}">
        <div class="qx-fs-hdr" onclick="Questoes.toggleSection('${name}')">
          <span class="qx-fs-name">${name}</span>
          <span class="qx-fs-arrow">▶</span>
        </div>
        ${open ? `<div class="qx-fs-body">${body}</div>` : ''}
      </div>`;

    const fo = (val, label, active, onclick, color, count) => `
      <div class="qx-fo${active?' active':''}" onclick="${onclick}">
        <div class="qx-fo-dot"${color?` style="background:${color};box-shadow:0 0 5px ${color}"`:''} ></div>
        <span class="qx-fo-lbl"${color&&!active?` style="color:${color};opacity:.85"`:''} >${_esc(label)}</span>
        ${count!==undefined?`<span class="qx-fo-cnt">${count}</span>`:''}
      </div>`;

    // Topics section — shown when a discipline is selected
    let topicBody = '';
    if (_filterDisc !== 'all') {
      const color = _discColor(_filterDisc);
      const ed    = _edital();
      const disc  = (ed?.disciplinas||[]).find(d => d.nome === _filterDisc);
      const edTopics  = (disc?.topicos||[]).map(t => (t.texto||t.nome||'').replace(/^⚡\s*/,'').trim()).filter(Boolean);
      const bankTopics= [...new Set(bank.filter(q=>q.disciplina===_filterDisc&&q.topico).map(q=>q.topico))];
      const topics = edTopics.length ? edTopics : bankTopics;
      if (topics.length) {
        const allCnt = bank.filter(q=>q.disciplina===_filterDisc).length;
        topicBody = `
          <div class="qx-fo${_filterTopic==='all'?' active':''}" onclick="Questoes.filterTopic('${_esc(_filterDisc)}','all')"
               style="${_filterTopic==='all'?`border-left:2px solid ${color};`:''}">
            <div class="qx-fo-dot" style="background:${color}88"></div>
            <span class="qx-fo-lbl">Todos os tópicos</span>
            <span class="qx-fo-cnt">${allCnt}</span>
          </div>
          ${topics.map(t => {
            const cnt = bank.filter(q=>q.disciplina===_filterDisc&&q.topico===t).length;
            const active = _filterTopic === t;
            return `<div class="qx-fo${active?' active':''}" onclick="Questoes.filterTopic('${_esc(_filterDisc)}','${_esc(t)}')"
                         style="${active?`border-left:2px solid ${color};`:''}">
              <div class="qx-fo-dot" style="${active?`background:${color};box-shadow:0 0 5px ${color}`:`background:${color}55`}"></div>
              <span class="qx-fo-lbl" title="${_esc(t)}" style="${active?`color:${color}`:''}">
                ${_esc(t.length > 32 ? t.slice(0,30)+'…' : t)}
              </span>
              ${cnt?`<span class="qx-fo-cnt">${cnt}</span>`:''}
            </div>`;
          }).join('')}`;
      }
    }

    if (!topicBody) return '';
    return `
      <div class="qx-fp-hdr">
        <span class="qx-fp-title">Tópicos</span>
        ${_filterTopic!=='all'?`<button class="qx-fp-clear" onclick="Questoes.filterTopic('${_esc(_filterDisc)}','all')">Limpar</button>`:''}
      </div>
      <div class="qx-fs-body">${topicBody}</div>
    `;
  }

  function _renderActiveChips() {
    const chips = [];
    if (_filterStatus!=='all') chips.push({label:({pending:'Pendentes',done:'Acertei',wrong:'Errei'})[_filterStatus], fn:"Questoes.setStatus('all')"});
    if (_filterDisc!=='all')   chips.push({label:_short(_filterDisc), fn:"Questoes.filterDisc('all')"});
    if (_filterTopic!=='all')  chips.push({label:_filterTopic, fn:"Questoes.filterTopic('all','all')"});
    if (_filterBanca!=='all')  chips.push({label:_filterBanca, fn:"Questoes.setBanca('all')"});
    if (_filterAno!=='all')    chips.push({label:_filterAno,   fn:"Questoes.setAno('all')"});
    if (!chips.length) return '';
    return `<div class="qx-active-chips">
      ${chips.map(c=>`<button class="qx-chip" onclick="${c.fn}"><span>${_esc(c.label)}</span><span class="qx-chip-x">✕</span></button>`).join('')}
    </div>`;
  }

  /* ── Question list ───────────────────── */
  function _renderList(filtered, bank) {
    if (!filtered.length) {
      if (!bank.length) return `
        <div class="qx-empty">
          <div class="qx-empty-ic">📄</div>
          <h3 class="qx-empty-title">Nenhuma questão importada</h3>
          <p class="qx-empty-sub">Faça upload de um PDF de prova ou caderno de questões. A IA lê, extrai as questões com gabarito e vincula automaticamente às disciplinas do seu edital.</p>
          <button class="qb-btn-primary" onclick="Questoes.openImport()">＋ Importar primeiro PDF</button>
        </div>`;
      return `
        <div class="qx-empty">
          <div class="qx-empty-ic">🔎</div>
          <h3 class="qx-empty-title">Nenhuma questão com esses filtros</h3>
          <p class="qx-empty-sub">Ajuste os filtros ou a busca para encontrar outras questões.</p>
          <button class="qb-btn-ghost" onclick="Questoes.clearFilters()">Limpar filtros</button>
        </div>`;
    }
    filtered.forEach(q => _expandedCards.add(q.id));
    return `<div class="qx-list">${filtered.map((q,i)=>_renderCard(q,i+1)).join('')}</div>`;
  }

  function _renderCard(q, num) {
    const status   = _statusOf(q.id);
    const color    = _discColor(q.disciplina);
    const expanded = _expandedCards.has(q.id);

    // last attempt for this question
    const atts    = _attempts().filter(a => a.qid === q.id);
    const lastAtt = atts.length ? atts[atts.length - 1] : null;
    const answered = !!lastAtt;

    // Card border tint based on result
    const borderStyle = answered
      ? (lastAtt.correct ? 'border-color:rgba(74,222,128,0.40)' : 'border-color:rgba(255,77,77,0.35)')
      : '';

    // Inline alternatives
    const pending = _pendingAnswers[q.id]; // letter selected but not yet confirmed
    let altsHtml = '';
    if (expanded) {
      const eliminated = _eliminated[q.id] || new Set();
      const alts = (q.alternativas || []).map(a => {
        const isCorrect   = a.letra === q.gabarito;
        const isSelected  = answered && lastAtt.selected === a.letra;
        const isPending   = !answered && pending === a.letra;
        const isElim      = !answered && eliminated.has(a.letra);
        let cls = 'qx-card-alt';
        if (answered) {
          cls += ' locked';
          if (isCorrect)       cls += ' correct';
          else if (isSelected) cls += ' wrong';
          else                 cls += ' dim';
        } else if (isElim) {
          cls += ' eliminated';
        } else if (isPending) {
          cls += ' selected';
        }

        // Ícone de resultado à esquerda (após responder)
        let resultIcon = '';
        if (answered) {
          if (isCorrect)       resultIcon = `<span class="qx-card-alt-result correct"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>`;
          else if (isSelected) resultIcon = `<span class="qx-card-alt-result wrong"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>`;
          else                 resultIcon = `<span class="qx-card-alt-result dim">–</span>`;
        }

        // Badge "OPÇÃO CORRETA" só quando errou (para indicar qual era a certa)
        const correctBadge = (answered && isCorrect && !lastAtt.correct)
          ? `<div class="qx-card-alt-correct-badge">OPÇÃO CORRETA</div>` : '';

        return `<div class="qx-card-alt-wrap">
          ${!answered ? `<button class="qx-alt-scissors-btn${isElim?' active':''}"
            onclick="event.stopPropagation();Questoes.eliminateAlt('${q.id}','${a.letra}')"
            title="${isElim?'Desfazer eliminação':'Eliminar alternativa'}">${isElim?'↺':'✂'}</button>
            <span class="qx-alt-scissors-sep"></span>` : resultIcon}
          <button class="${cls}"
            ${answered ? '' : `onclick="event.stopPropagation();Questoes.selectPending('${q.id}','${a.letra}')"`}>
            <span class="qx-card-alt-letter">${_esc(a.letra)}</span>
            <span class="qx-card-alt-text">${_esc(a.texto)}</span>
            ${correctBadge}
          </button>
        </div>`;
      }).join('');

      const confirmBtn = !answered ? `
        <div class="qx-card-confirm-row" onclick="event.stopPropagation()">
          <button class="qx-card-confirm-btn${pending?'':' disabled'}"
            ${pending?`onclick="event.stopPropagation();Questoes.inlineAnswer('${q.id}','${pending}')"` : 'disabled'}>
            Responder
          </button>
        </div>` : '';

      // Verificar se já está no caderno de erros (antes do feedbackHtml)
      let noCADERNO = false;
      try { noCADERNO = JSON.parse(localStorage.getItem('nexus_caderno_v1')||'[]').some(e=>e._qxId===q.id); } catch(e) {}

      let feedbackHtml = '';
      if (answered) {
        const revealed = _revealedAnswer.has(q.id);
        const hasExplain = !!q.comentario;
        feedbackHtml = `
          <div class="qx-card-confirm-row qx-card-reveal-row-wrap" onclick="event.stopPropagation()">
            <button class="qx-card-confirm-btn revelar${revealed?' revealed':''}"
              onclick="event.stopPropagation();Questoes.toggleReveal('${q.id}')">
              ${revealed ? '▴ Ocultar resposta' : '▾ Revelar resposta'}
            </button>
            ${!lastAtt.correct ? `
            <button class="qx-func-caderno${noCADERNO?' no-caderno':''}"
              onclick="event.stopPropagation();Questoes.addToCadernoErros('${q.id}')"
              title="${noCADERNO?'Já está no Caderno de Erros':'Adicionar ao Caderno de Erros'}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="${noCADERNO?'currentColor':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              ${noCADERNO ? '✓ No Caderno' : '+ Caderno de Erros'}
            </button>` : ''}
          </div>
          ${revealed ? `<div class="qx-card-reveal-panel" onclick="event.stopPropagation()">
            <div class="qx-card-reveal-gab">
              ${!lastAtt.correct ? `
              <div class="qx-card-reveal-row">
                <span class="qx-card-reveal-lbl">Você marcou</span>
                <span class="qx-card-reveal-letra wrong">${_esc(lastAtt.selected)}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF5050" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              <span class="qx-card-reveal-divider">—</span>` : ''}
              <div class="qx-card-reveal-row">
                <span class="qx-card-reveal-lbl">Gabarito</span>
                <span class="qx-card-reveal-letra correct">${_esc(q.gabarito)}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            ${hasExplain ? _fmtComentario(q.comentario, q.gabarito, q.alternativas) : '<p class="qx-card-reveal-empty">Nenhuma explicação disponível para esta questão.</p>'}
          </div>` : ''}`;
      }

      // ── Barra de funcionalidades ──────────────────────────────
      const panel     = _activePanel[q.id] || null;
      const marcObj   = _marcadores();
      const anotObj   = _anotacoes();
      const comentObj = _comentarios();
      const isMarcado = !!marcObj[q.id];
      const temAnot   = !!(anotObj[q.id]);
      const temComent = !!(comentObj[q.id]?.length);
      const atts      = _attempts().filter(a => a.qid === q.id);
      const acertos   = atts.filter(a => a.correct).length;
      const erros     = atts.length - acertos;

      const funcBar = `
        <div class="qx-func-bar" onclick="event.stopPropagation()">
          <button class="qx-func-btn${panel==='comentarios'?' active':''}${temComent?' has-dot':''}" onclick="Questoes.togglePanel('${q.id}','comentarios')" title="Comentários">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Comentários</span>
          </button>
          <button class="qx-func-btn${panel==='marcadores'?' active':''}${isMarcado?' marcado':''}" onclick="Questoes.toggleMarcador('${q.id}')" title="Marcar questão">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${isMarcado?'currentColor':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span>${isMarcado ? 'Marcada' : 'Marcar'}</span>
          </button>
          <button class="qx-func-btn${panel==='anotacoes'?' active':''}${temAnot?' has-dot':''}" onclick="Questoes.togglePanel('${q.id}','anotacoes')" title="Anotações">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span>Anotações</span>
          </button>
          <button class="qx-func-btn${panel==='estatisticas'?' active':''}" onclick="Questoes.togglePanel('${q.id}','estatisticas')" title="Estatísticas">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span>Estatísticas</span>
          </button>
          <button class="qx-func-btn danger" onclick="Questoes.reportarErro('${q.id}')" title="Reportar erro">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Reportar Erro</span>
          </button>
          ${answered ? `
            <div class="qx-func-result-group">
              <span class="qx-func-result ${lastAtt.correct?'ok':'bad'}">
                ${lastAtt.correct
                  ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Você acertou!`
                  : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Você errou!`}
              </span>
              <button class="qx-func-retry-btn" onclick="event.stopPropagation();Questoes.retryCard('${q.id}')">↻ Resolver novamente</button>
            </div>` : ''}
        </div>`;

      // ── Painéis inline ────────────────────────────────────────
      let panelHtml = '';
      if (panel === 'comentarios') {
        const lista = comentObj[q.id] || [];
        const itens = lista.map((c,i) => `
          <div class="qx-panel-comment-item">
            <div class="qx-panel-comment-text">${_esc(c.texto)}</div>
            <div class="qx-panel-comment-meta">
              <span>${c.data}</span>
              <button class="qx-panel-comment-del" onclick="event.stopPropagation();Questoes.delComentario('${q.id}',${i})">✕</button>
            </div>
          </div>`).join('');
        panelHtml = `
          <div class="qx-func-panel" onclick="event.stopPropagation()">
            <div class="qx-panel-title">💬 Comentários</div>
            ${lista.length ? `<div class="qx-panel-comments-list">${itens}</div>` : `<p class="qx-panel-empty">Nenhum comentário ainda.</p>`}
            <div class="qx-panel-input-row">
              <textarea class="qx-panel-textarea" id="coment-${q.id}" placeholder="Escreva um comentário sobre esta questão..." rows="2"></textarea>
              <button class="qx-panel-save-btn" onclick="event.stopPropagation();Questoes.addComentario('${q.id}')">Salvar</button>
            </div>
          </div>`;
      } else if (panel === 'anotacoes') {
        const html = anotObj[q.id] || '';
        panelHtml = `
          <div class="qx-func-panel qx-editor-panel" onclick="event.stopPropagation()">
            <div class="qx-editor-toolbar">
              <div class="qx-editor-group">
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('bold')" title="Negrito"><b>B</b></button>
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('italic')" title="Itálico"><i>I</i></button>
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('underline')" title="Sublinhado"><u>U</u></button>
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('strikeThrough')" title="Tachado"><s>S</s></button>
              </div>
              <div class="qx-editor-sep"></div>
              <div class="qx-editor-group">
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('insertOrderedList')" title="Lista numerada">1.</button>
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('insertUnorderedList')" title="Lista com marcadores">•</button>
              </div>
              <div class="qx-editor-sep"></div>
              <div class="qx-editor-group">
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('justifyLeft')" title="Esquerda">⬅</button>
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('justifyCenter')" title="Centro">⬛</button>
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('justifyRight')" title="Direita">➡</button>
              </div>
              <div class="qx-editor-sep"></div>
              <div class="qx-editor-group">
                <select class="qx-ed-select" title="Tamanho" onchange="event.stopPropagation();document.execCommand('fontSize',false,this.value);this.value=''">
                  <option value="">Tam.</option>
                  <option value="1">Pequeno</option>
                  <option value="3">Normal</option>
                  <option value="5">Grande</option>
                  <option value="7">Maior</option>
                </select>
                <select class="qx-ed-select" title="Estilo" onchange="event.stopPropagation();document.execCommand('formatBlock',false,this.value);this.value=''">
                  <option value="">Estilo</option>
                  <option value="h2">Título</option>
                  <option value="h3">Subtítulo</option>
                  <option value="p">Parágrafo</option>
                  <option value="blockquote">Citação</option>
                  <option value="pre">Código</option>
                </select>
              </div>
              <div class="qx-editor-sep"></div>
              <div class="qx-editor-group">
                <label class="qx-ed-btn qx-ed-color" title="Cor do texto">
                  <span style="text-decoration:underline;text-decoration-color:var(--ed-clr,#fff)">A</span>
                  <input type="color" value="#ffffff" onchange="event.stopPropagation();document.execCommand('foreColor',false,this.value);this.style.setProperty('--ed-clr',this.value)" style="opacity:0;position:absolute;width:0;height:0">
                </label>
                <label class="qx-ed-btn qx-ed-color" title="Cor de fundo">
                  <span>🖊</span>
                  <input type="color" value="#E8B84B" onchange="event.stopPropagation();document.execCommand('hiliteColor',false,this.value)" style="opacity:0;position:absolute;width:0;height:0">
                </label>
              </div>
              <div class="qx-editor-sep"></div>
              <div class="qx-editor-group">
                <button class="qx-ed-btn" onclick="event.stopPropagation();Questoes._edInsertLink('${q.id}')" title="Inserir link">🔗</button>
                <label class="qx-ed-btn" title="Inserir imagem" style="cursor:pointer">
                  🖼
                  <input type="file" accept="image/*" style="display:none" onchange="event.stopPropagation();Questoes._edInsertImage(event,'${q.id}')">
                </label>
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('insertHorizontalRule')" title="Linha divisória">—</button>
              </div>
              <div class="qx-editor-sep"></div>
              <div class="qx-editor-group">
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('undo')" title="Desfazer">↩</button>
                <button class="qx-ed-btn" onclick="event.stopPropagation();document.execCommand('redo')" title="Refazer">↪</button>
              </div>
            </div>
            <div class="qx-editor-body" id="anot-${q.id}" contenteditable="true"
              onkeydown="event.stopPropagation()"
              onclick="event.stopPropagation()"
              data-placeholder="Escreva suas anotações aqui...">${html}</div>
            <div class="qx-editor-footer">
              <button class="qx-panel-save-btn" onclick="event.stopPropagation();Questoes.saveAnotacao('${q.id}')">
                💾 Salvar anotação
              </button>
              ${html ? `<button class="qx-panel-del-btn" onclick="event.stopPropagation();Questoes.delAnotacao('${q.id}')">🗑 Apagar</button>` : ''}
              <span class="qx-editor-hint">Ctrl+B negrito · Ctrl+I itálico · Ctrl+U sublinhado</span>
            </div>
          </div>`;
      } else if (panel === 'estatisticas') {
        const total  = atts.length;
        const pct    = total ? Math.round(acertos/total*100) : 0;
        const ultima = atts.length ? new Date(atts[atts.length-1].ts).toLocaleDateString('pt-BR') : '—';
        panelHtml = `
          <div class="qx-func-panel" onclick="event.stopPropagation()">
            <div class="qx-panel-title">📊 Estatísticas desta questão</div>
            <div class="qx-stat-grid">
              <div class="qx-stat-item"><span class="qx-stat-num">${total}</span><span class="qx-stat-lbl">Tentativas</span></div>
              <div class="qx-stat-item"><span class="qx-stat-num" style="color:#4ADE80">${acertos}</span><span class="qx-stat-lbl">Acertos</span></div>
              <div class="qx-stat-item"><span class="qx-stat-num" style="color:#FF8A8A">${erros}</span><span class="qx-stat-lbl">Erros</span></div>
              <div class="qx-stat-item"><span class="qx-stat-num" style="color:var(--gold)">${pct}%</span><span class="qx-stat-lbl">Aproveitamento</span></div>
            </div>
            <div class="qx-stat-bar-wrap">
              <div class="qx-stat-bar-fill" style="width:${pct}%;background:${pct>=70?'#4ADE80':pct>=40?'var(--gold)':'#FF8A8A'}"></div>
            </div>
            <div class="qx-stat-ultima">Última tentativa: ${ultima}</div>
          </div>`;
      }

      altsHtml = `<div class="qx-card-alts" onclick="event.stopPropagation()">${alts}</div>${confirmBtn}${feedbackHtml}${funcBar}${panelHtml}`;
    }

    const statusIcon = {done:'✓', wrong:'✗', pending:''}[status];

    return `
      <div class="qx-card ${expanded?'expanded':''} status-${status}" id="qxc-${q.id}" style="${borderStyle}">
        <div class="qx-card-accent" style="background:${color}"></div>
        <div class="qx-card-body">

          <div class="qx-card-top" onclick="Questoes.toggleCard('${q.id}')">
            <span class="qx-card-num">${String(num).padStart(2,'0')}</span>
            <div class="qx-card-meta-row">
              ${q.disciplina?`<span class="qx-meta-val" style="color:${color}">${_esc(q.disciplina)}</span>`:''}
              ${q.topico   ?`<span class="qx-meta-sep">·</span><span class="qx-meta-item"><span class="qx-meta-lbl">Tópico:</span><span class="qx-meta-val qx-meta-val--full">${_esc(q.topico)}</span></span>`:''}
              ${q.banca    ?`<span class="qx-meta-sep">·</span><span class="qx-meta-item"><span class="qx-meta-lbl">Banca:</span><span class="qx-meta-val">${_esc(q.banca)}</span></span>`:''}
              ${q.ano      ?`<span class="qx-meta-sep">·</span><span class="qx-meta-item"><span class="qx-meta-lbl">Ano:</span><span class="qx-meta-val">${_esc(q.ano)}</span></span>`:''}
            </div>
            <div class="qx-card-status ${status}"
              style="${status==='pending'?`background:${color}22;border:2px solid ${color};`:''}"
              title="${{pending:'Pendente',done:'Acertou',wrong:'Errou'}[status]}">${statusIcon}</div>
            <span class="qx-card-chevron">${expanded?'▴':'▾'}</span>
          </div>

          <div class="qx-card-stmt ${expanded?'expanded':''}" onclick="Questoes.toggleCard('${q.id}')">${_fmtStmt(q.enunciado)}</div>

          ${altsHtml}

          <div class="qx-card-foot">
            <span class="qx-card-meta"></span>
            ${!expanded ? `<div class="qx-card-actions" onclick="event.stopPropagation()">
              <button class="qx-icoBtn danger" title="Excluir questão" onclick="Questoes.removeQuestion('${q.id}')">🗑</button>
            </div>` : ''}
          </div>
        </div>
      </div>`;
  }

  /* ── Inline card actions ────────────── */
  function toggleCard(id) {
    _expandedCards.has(id) ? _expandedCards.delete(id) : _expandedCards.add(id);
    _rerenderCard(id);
  }

  function eliminateAlt(qid, letter) {
    if (!_eliminated[qid]) _eliminated[qid] = new Set();
    if (_eliminated[qid].has(letter)) _eliminated[qid].delete(letter);
    else _eliminated[qid].add(letter);
    _rerenderCard(qid);
  }

  function selectPending(qid, letter) {
    _pendingAnswers[qid] = letter;
    _rerenderCard(qid);
  }

  function inlineAnswer(qid, letter) {
    const q = _bank().find(x => x.id === qid);
    if (!q) return;
    const correct = letter === q.gabarito;
    const arr = _attempts();
    arr.push({ id: _uid(), qid, selected: letter, correct, ts: Date.now(), timeMs: 0 });
    _saveAttempts(arr);
    delete _pendingAnswers[qid];
    delete _eliminated[qid];
    _updateTopbarKpis();
    if (_filterStatus !== 'all') _renderContent();
    else _rerenderCard(qid);
  }

  function togglePanel(qid, name) {
    _activePanel[qid] = _activePanel[qid] === name ? null : name;
    _rerenderCard(qid);
  }

  function toggleMarcador(qid) {
    const m = _marcadores();
    if (m[qid]) delete m[qid]; else m[qid] = { ts: Date.now() };
    _saveMarcadores(m);
    _rerenderCard(qid);
  }

  function addComentario(qid) {
    const el = document.getElementById('coment-' + qid);
    if (!el || !el.value.trim()) return;
    const c = _comentarios();
    if (!c[qid]) c[qid] = [];
    c[qid].push({ texto: el.value.trim(), data: new Date().toLocaleDateString('pt-BR') });
    _saveComentarios(c);
    el.value = '';
    _rerenderCard(qid);
  }

  function delComentario(qid, idx) {
    const c = _comentarios();
    if (!c[qid]) return;
    c[qid].splice(idx, 1);
    _saveComentarios(c);
    _rerenderCard(qid);
  }

  function saveAnotacao(qid) {
    const el = document.getElementById('anot-' + qid);
    if (!el) return;
    const a = _anotacoes();
    const html = el.innerHTML.trim();
    const empty = !el.textContent.trim() && !el.querySelector('img');
    if (!empty) a[qid] = html; else delete a[qid];
    _saveAnotacoes(a);
    _toast('Anotação salva', 'green');
    _rerenderCard(qid);
  }

  function delAnotacao(qid) {
    const a = _anotacoes(); delete a[qid]; _saveAnotacoes(a);
    _rerenderCard(qid);
  }

  function _edInsertLink(qid) {
    const url = prompt('URL do link:');
    if (!url) return;
    const txt = prompt('Texto do link:', url) || url;
    document.execCommand('insertHTML', false, `<a href="${_esc(url)}" target="_blank" style="color:var(--gold)">${_esc(txt)}</a>`);
  }

  function _edInsertImage(e, qid) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('anot-' + qid)?.focus();
      document.execCommand('insertHTML', false, `<img src="${ev.target.result}" style="max-width:100%;border-radius:8px;margin:6px 0" />`);
    };
    reader.readAsDataURL(file);
  }

  function reportarErro(qid) {
    const q = _bank().find(x => x.id === qid); if (!q) return;
    const motivo = prompt('Descreva o erro encontrado nesta questão:');
    if (!motivo) return;
    _toast('Erro reportado. Obrigado!', 'gold');
  }

  function addToCadernoErros(qid) {
    const q = _bank().find(x => x.id === qid); if (!q) return;

    const LS_CADERNO = 'nexus_caderno_v1';
    let errs = [];
    try { errs = JSON.parse(localStorage.getItem(LS_CADERNO) || '[]'); } catch(e) {}

    // Verifica se já está no caderno
    const jaExiste = errs.some(e => e._qxId === qid);
    if (jaExiste) {
      _toast('Questão já está no Caderno de Erros', 'gold');
      return;
    }

    // Mapear nome da disciplina → ID do edital
    let subjId = 'geral';
    try {
      const ed = _edital();
      const disc = (ed?.disciplinas || []).find(d => d.nome === q.disciplina);
      if (disc) subjId = disc.id;
      else {
        // fallback: normalizar nome para id simples
        subjId = (q.disciplina || 'geral').toLowerCase()
          .normalize('NFD').replace(/[̀-ͯ]/g,'')
          .replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,20) || 'geral';
      }
    } catch(e) {}

    // Montar o HTML da questão (enunciado + alternativas)
    const altsHtml = (q.alternativas||[]).map(a =>
      `<p style="margin:2px 0"><strong>${a.letra})</strong> ${a.texto}</p>`
    ).join('');
    const qHtml = `<p>${q.enunciado||''}</p>${altsHtml}${q.gabarito?`<p><strong>Gabarito: ${q.gabarito}</strong></p>`:''}`;
    const ruleHtml = q.comentario
      ? `<p>${q.comentario}</p>`
      : `<p>Gabarito: <strong>${q.gabarito||'—'}</strong></p>`;

    const uid = 'qx_' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    const newErr = {
      id:     uid,
      _qxId:  qid,          // referência à questão original
      subj:   subjId,
      why:    'armadilha',  // motivo padrão (usuário pode editar no caderno)
      q:      qHtml,
      rule:   ruleHtml,
      topic:  q.topico || '',
      date:   new Date().toLocaleDateString('pt-BR'),
      status: 'pending',
      _source: 'questoes',  // origem
      _banca: q.banca || '',
      _ano:   q.ano   || '',
    };

    errs.push(newErr);
    try {
      localStorage.setItem(LS_CADERNO, JSON.stringify(errs));
      // Sincronizar com State se disponível
      try { if (typeof State !== 'undefined') State.set('errors', errs); } catch(e) {}
    } catch(e) {
      _toast('Erro ao salvar no caderno', 'red'); return;
    }

    _rerenderCard(qid);
    _toast('✓ Adicionado ao Caderno de Erros!', 'green');
  }

  function toggleReveal(qid) {
    _revealedAnswer.has(qid) ? _revealedAnswer.delete(qid) : _revealedAnswer.add(qid);
    _rerenderCard(qid);
  }

  function retryCard(id) {
    _saveAttempts(_attempts().filter(a => a.qid !== id));
    delete _pendingAnswers[id];
    delete _eliminated[id];
    _revealedAnswer.delete(id);
    _updateTopbarKpis();
    _rerenderCard(id);
  }

  function _rerenderCard(qid) {
    const filtered = _applyFilters(_bank());
    const idx = filtered.findIndex(q => q.id === qid);
    if (idx < 0) { _renderContent(); return; }
    const $old = document.getElementById('qxc-' + qid);
    if (!$old) { _renderContent(); return; }
    const tmp = document.createElement('div');
    tmp.innerHTML = _renderCard(filtered[idx], idx + 1);
    $old.parentNode.replaceChild(tmp.firstElementChild, $old);
  }

  function _updateTopbarKpis() {
    const att = _attempts();
    const correct = att.filter(a => a.correct).length;
    const wrong   = att.length - correct;
    const pct     = att.length ? Math.round(correct / att.length * 100) : 0;
    const $nums   = document.querySelectorAll('.qx-kpi-num');
    if ($nums.length >= 4) {
      $nums[1].textContent = correct;
      $nums[2].textContent = wrong;
      $nums[3].textContent = pct + '%';
    }
  }

  /* ── Filter actions ──────────────────── */
  function _applyFilters(bank) {
    let arr = bank.slice();
    if (_filterDisc   !=='all') arr = arr.filter(q=>q.disciplina===_filterDisc);
    if (_filterTopic  !=='all') arr = arr.filter(q=>q.topico===_filterTopic);
    if (_filterStatus !=='all') arr = arr.filter(q=>_statusOf(q.id)===_filterStatus);
    if (_filterBanca  !=='all') arr = arr.filter(q=>q.banca===_filterBanca);
    if (_filterAno    !=='all') arr = arr.filter(q=>q.ano===_filterAno);
    if (_search) {
      const s = _search.toLowerCase();
      arr = arr.filter(q=>
        (q.enunciado||'').toLowerCase().includes(s)||
        (q.banca||'').toLowerCase().includes(s)||
        (q.ano||'').toString().includes(s)||
        (q.disciplina||'').toLowerCase().includes(s)||
        (q.topico||'').toLowerCase().includes(s)
      );
    }
    return arr;
  }

  function setSearch(v)       { _search=v; _renderContent(); }
  function setStatus(s)       { _filterStatus=s; _renderContent(); }
  function setBanca(v)        { _filterBanca=v; _bancaDropOpen=false; _renderContent(); }
  function setAno(v)          { _filterAno=v; _anoDropOpen=false; _renderContent(); }
  function filterDisc(name)   { _filterDisc=name; _filterTopic='all'; _topicDropOpen=false; _bancaDropOpen=false; _anoDropOpen=false; if(name!=='all') _expandedDiscs.add(name); _renderContent(); }
  function filterTopic(d,t)   { _filterDisc=d; _filterTopic=t; _renderContent(); }
  function toggleTopicDrop()  { _topicDropOpen=!_topicDropOpen; _bancaDropOpen=false; _anoDropOpen=false; _renderContent(); }
  function closeTopicDrop()   { _topicDropOpen=false; _renderContent(); }
  function toggleBancaDrop()  { _bancaDropOpen=!_bancaDropOpen; _topicDropOpen=false; _anoDropOpen=false; _renderContent(); }
  function closeBancaDrop()   { _bancaDropOpen=false; _renderContent(); }
  function toggleAnoDrop()    { _anoDropOpen=!_anoDropOpen; _topicDropOpen=false; _bancaDropOpen=false; _renderContent(); }
  function closeAnoDrop()     { _anoDropOpen=false; _renderContent(); }
  function clearFilters()     { _filterDisc=_filterTopic=_filterStatus=_filterBanca=_filterAno='all'; _search=''; _renderContent(); }
  function toggleDisc(name)   { _expandedDiscs.has(name)?_expandedDiscs.delete(name):_expandedDiscs.add(name); _renderContent(); }
  function toggleDiscAll(name){ const k=name+'__all'; _expandedTopics.has(k)?_expandedTopics.delete(k):_expandedTopics.add(k); _renderContent(); }
  function toggleSection(n)   { _openSections.has(n)?_openSections.delete(n):_openSections.add(n); _renderContent(); }
  function removeQuestion(id) {
    if (!confirm('Excluir esta questão do banco?')) return;
    _saveBank(_bank().filter(q=>q.id!==id));
    _saveAttempts(_attempts().filter(a=>a.qid!==id));
    render();
  }

  /* ════════════════════════════════════════
     SESSION — fullscreen exam mode
     ════════════════════════════════════════ */
  function startSession(singleId) {
    const bank = _bank();
    const pool = singleId ? bank.filter(q=>q.id===singleId) : _applyFilters(bank);
    if (!pool.length) { _toast('Nenhuma questão disponível', 'red'); return; }
    _session = { ids: pool.map(q=>q.id), idx:0, answers:{}, startedAt:Date.now(), lastAnsweredAt:Date.now() };
    _startTimer();
    _renderSession();
    document.addEventListener('keydown', _onKey);
  }

  function exitSession() {
    if (Object.keys(_session?.answers||{}).length && !confirm('Sair e descartar progresso?')) return;
    _stopTimer(); document.removeEventListener('keydown', _onKey);
    document.getElementById('qx-session')?.remove();
    _session = null; render();
  }

  function _startTimer() {
    _stopTimer();
    _timerInt = setInterval(()=>{
      const $t = document.getElementById('qx-sess-timer');
      if (!$t||!_session) { _stopTimer(); return; }
      const e = Math.round((Date.now()-_session.startedAt)/1000);
      $t.textContent = `⏱ ${Math.floor(e/60)}:${String(e%60).padStart(2,'0')}`;
    }, 1000);
  }
  function _stopTimer() { if(_timerInt){ clearInterval(_timerInt); _timerInt=null; } }

  function _onKey(e) {
    if (!_session) return;
    const qid = _session.ids[_session.idx];
    const q   = _bank().find(x=>x.id===qid);
    if (!q) return;
    const ans = _session.answers[qid];
    const key = e.key.toUpperCase();
    if (!ans && q.alternativas.some(a=>a.letra===key)) { e.preventDefault(); _selectSess(key); }
    else if (!ans && _session._pending && e.key==='Enter') { e.preventDefault(); _answer(_session._pending); }
    else if (ans && (e.key==='Enter'||e.key==='ArrowRight')) { e.preventDefault(); _next(); }
    else if (e.key==='ArrowLeft') { e.preventDefault(); _prev(); }
  }

  function _renderSession() {
    let $s = document.getElementById('qx-session');
    if (!$s) {
      $s = document.createElement('div');
      $s.id='qx-session'; $s.className='qx-session';
      document.body.appendChild($s);
    }
    const ses = _session; if (!ses) return;
    const total = ses.ids.length;

    /* ── Summary ── */
    if (ses.idx >= total) {
      _stopTimer(); document.removeEventListener('keydown', _onKey);
      const correct = Object.values(ses.answers).filter(a=>a.correct).length;
      const pct  = total ? Math.round(correct/total*100) : 0;
      const e    = Math.round((Date.now()-ses.startedAt)/1000);
      const mm   = Math.floor(e/60), ss = e%60;
      const icon = pct>=70?'🏆':pct>=50?'📈':'📚';
      $s.innerHTML = `
        <div class="qx-sess-hdr">
          <button class="qx-sess-exit" onclick="Questoes.exitSession()">✕</button>
          <span style="font:700 12px 'IBM Plex Sans';color:var(--text-dim);letter-spacing:.06em">SESSÃO CONCLUÍDA</span>
        </div>
        <div class="qx-sess-body">
          <div class="qx-summary">
            <div class="qx-summary-ic">${icon}</div>
            <div class="qx-summary-title" style="background:linear-gradient(135deg,#fff,var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">RESULTADO FINAL</div>
            <div class="qx-summary-sub">Você respondeu ${total} questão${total!==1?'ões':''} em ${mm}m${String(ss).padStart(2,'0')}s</div>
            <div class="qx-summary-grid">
              <div class="qx-sstat"><div class="qx-sstat-num" style="color:#4ADE80">${correct}</div><div class="qx-sstat-lbl">Acertos</div></div>
              <div class="qx-sstat"><div class="qx-sstat-num" style="color:#FF8A8A">${total-correct}</div><div class="qx-sstat-lbl">Erros</div></div>
              <div class="qx-sstat"><div class="qx-sstat-num">${pct}%</div><div class="qx-sstat-lbl">Aproveitamento</div></div>
              <div class="qx-sstat"><div class="qx-sstat-num">${mm}:${String(ss).padStart(2,'0')}</div><div class="qx-sstat-lbl">Tempo</div></div>
            </div>
            <div class="qx-summary-actions">
              <button class="qx-nav-btn ghost" onclick="Questoes.exitSession()">← Voltar ao banco</button>
              ${total-correct>0?`<button class="qx-nav-btn primary" onclick="Questoes._retryWrong()">↻ Refazer os errados</button>`:''}
            </div>
            <div class="qx-dot-nav">
              ${ses.ids.map((id,i)=>{
                const a=ses.answers[id];
                return `<button class="qx-dot ${a?.correct?'correct':a?'wrong':'pending'}" title="Q${i+1}" onclick="Questoes._goToQ(${i})"></button>`;
              }).join('')}
            </div>
          </div>
        </div>`;
      return;
    }

    /* ── Question screen ── */
    const qid = ses.ids[ses.idx];
    const q   = _bank().find(x=>x.id===qid);
    if (!q) { ses.idx++; _renderSession(); return; }
    const ans   = ses.answers[qid];
    const pct   = Math.round(ses.idx/total*100);
    const el    = Math.round((Date.now()-ses.startedAt)/1000);
    const color = _discColor(q.disciplina);

    $s.innerHTML = `
      <div class="qx-sess-hdr">
        <button class="qx-sess-exit" onclick="Questoes.exitSession()">✕</button>
        <div class="qx-sess-prog-wrap">
          <div class="qx-sess-prog-bar"><div class="qx-sess-prog-fill" style="width:${pct}%"></div></div>
          <div class="qx-sess-prog-meta">
            <span>QUESTÃO ${ses.idx+1} DE ${total}</span>
            <span>${Object.values(ses.answers).filter(a=>a.correct).length} acertos · ${Object.values(ses.answers).filter(a=>!a.correct).length} erros</span>
          </div>
        </div>
        <div id="qx-sess-timer" class="qx-sess-timer">⏱ ${Math.floor(el/60)}:${String(el%60).padStart(2,'0')}</div>
      </div>

      <div class="qx-sess-body">
        <div class="qx-q-panel" style="border-left:3px solid ${color};box-shadow:0 24px 60px rgba(0,0,0,0.5),-4px 0 24px ${color}22">
          <div class="qx-q-header">
            <span class="qx-q-num">Q ${ses.idx+1}</span>
            ${q.disciplina?`<span class="qx-tag disc" style="color:${color};border-color:${color}44;background:${color}14">${_esc(_short(q.disciplina))}</span>`:''}
            ${q.topico?`<span class="qx-tag topic">${_esc(q.topico)}</span>`:''}
            ${q.banca?`<span class="qx-tag">${_esc(q.banca)}</span>`:''}
            ${q.ano?`<span class="qx-tag">${_esc(q.ano)}</span>`:''}
          </div>

          <div class="qx-q-stmt">${_fmtStmt(q.enunciado)}</div>

          ${!ans?`<div class="qx-keyboard-hint">Selecione uma alternativa e clique em Responder · Atalhos: ${q.alternativas.map(a=>a.letra).join(', ')}</div>`:''}

          <div class="qx-alts">
            ${q.alternativas.map(a=>{
              const isCorrect   = a.letra===q.gabarito;
              const isSelected  = ans&&ans.sel===a.letra;
              const isPending   = !ans && ses._pending===a.letra;
              const isElim      = !ans && ses._elim?.has(a.letra);
              let cls = 'qx-alt';
              if (ans) { cls+=' locked'; cls+=isCorrect?' correct':isSelected?' wrong':' dim'; }
              else if (isElim)    cls+=' eliminated';
              else if (isPending) cls+=' selected';
              return `<div class="qx-card-alt-wrap">
                ${!ans ? `<button class="qx-alt-scissors-btn${isElim?' active':''}"
                  onclick="event.stopPropagation();Questoes._eliminateSess('${a.letra}')"
                  title="${isElim?'Desfazer eliminação':'Eliminar alternativa'}">${isElim?'↺':'✂'}</button>
                  <span class="qx-alt-scissors-sep"></span>` : ''}
                <button class="${cls}"
                  ${ans?'':`onclick="Questoes._selectSess('${a.letra}')"`}>
                  <span class="qx-alt-letter">${_esc(a.letra)}</span>
                  <span class="qx-alt-text">${_esc(a.texto)}</span>
                </button>
              </div>`;
            }).join('')}
          </div>

          ${!ans ? `
            <div class="qx-sess-confirm-row">
              <button class="qx-sess-confirm-btn${ses._pending?'':' disabled'}"
                ${ses._pending ? `onclick="Questoes._answer('${ses._pending}')"` : 'disabled'}>
                Responder
              </button>
            </div>` : ''}

          ${ans?`
            <div class="qx-feedback ${ans.correct?'ok':'bad'}">
              <span class="qx-feedback-badge">${ans.correct?'✓ Acertou!':'✗ Errou!'}</span>
              <div class="qx-feedback-gab">Gabarito: <strong style="color:var(--gold)">${_esc(q.gabarito)}</strong></div>
              ${q.comentario?`<div class="qx-feedback-body">${_esc(q.comentario)}</div>`:''}
            </div>`:''}

          <div class="qx-sess-nav">
            <button class="qx-nav-btn ghost" onclick="Questoes._prev()" ${ses.idx===0?'disabled':''}>← Anterior</button>
            <button class="qx-nav-btn primary" onclick="Questoes._next()" ${!ans?'disabled':''}>${ses.idx+1>=total?'Finalizar ✓':'Próxima →'}</button>
          </div>

          <div class="qx-dot-nav">
            ${ses.ids.map((id,i)=>{
              const a=ses.answers[id]; const cur=i===ses.idx;
              return `<button class="qx-dot ${cur?'current':a?.correct?'correct':a?'wrong':'pending'}" title="Q${i+1}" onclick="Questoes._goToQ(${i})"></button>`;
            }).join('')}
          </div>
        </div>
      </div>`;
  }

  function _selectSess(letter) {
    if (!_session) return;
    _session._pending = letter;
    _renderSession();
  }

  function _eliminateSess(letter) {
    if (!_session) return;
    if (!_session._elim) _session._elim = new Set();
    if (_session._elim.has(letter)) _session._elim.delete(letter);
    else _session._elim.add(letter);
    _renderSession();
  }

  function _answer(letter) {
    const ses=_session; if(!ses) return;
    const qid=ses.ids[ses.idx];
    const q=_bank().find(x=>x.id===qid); if(!q) return;
    const correct=letter===q.gabarito;
    ses.answers[qid]={sel:letter,correct};
    ses._pending = null;
    ses.lastAnsweredAt=Date.now();
    const arr=_attempts();
    arr.push({id:_uid(),qid,selected:letter,correct,ts:Date.now(),timeMs:Date.now()-ses.lastAnsweredAt});
    _saveAttempts(arr);
    _renderSession();
  }
  function _next()   { if(!_session) return; _session.idx++; _session._elim=new Set(); _session._pending=null; _renderSession(); }
  function _prev()   { if(!_session||_session.idx===0) return; _session.idx--; _session._elim=new Set(); _session._pending=null; _renderSession(); }
  function _goToQ(i) { if(!_session) return; _session.idx=i; _session._elim=new Set(); _session._pending=null; _renderSession(); }
  function _retryWrong()  {
    if(!_session) return;
    const wrong=Object.entries(_session.answers).filter(([,v])=>!v.correct).map(([k])=>k);
    if(!wrong.length) return;
    _session={ids:wrong,idx:0,answers:{},startedAt:Date.now(),lastAnsweredAt:Date.now()};
    _startTimer(); document.addEventListener('keydown',_onKey); _renderSession();
  }

  /* ════════════════════════════════════════
     STATS VIEW
     ════════════════════════════════════════ */
  function _renderStats() {
    const bank=_bank(), att=_attempts();
    if (!att.length) return `
      <div class="qx-stats-wrap">
        <div class="qx-empty" style="margin-top:40px">
          <div class="qx-empty-ic">📊</div>
          <h3 class="qx-empty-title">Sem dados ainda</h3>
          <p class="qx-empty-sub">Resolva questões do banco para ver seu desempenho por disciplina e tópico.</p>
          <button class="qb-btn-primary" onclick="Questoes.setTab('banco')">Ir para o banco</button>
        </div>
      </div>`;

    const correct=att.filter(a=>a.correct).length;
    const pct=Math.round(correct/att.length*100);
    const avgMs=Math.round(att.reduce((s,a)=>s+(a.timeMs||0),0)/att.length/1000);

    const lastByQ={};
    att.forEach(a=>{ lastByQ[a.qid]=a; });
    const ds={};
    bank.forEach(q=>{ const l=lastByQ[q.id]; if(!l) return; const k=q.disciplina||'Sem disciplina'; ds[k]=ds[k]||{total:0,correct:0}; ds[k].total++; if(l.correct) ds[k].correct++; });

    const rows=Object.entries(ds).sort((a,b)=>b[1].total-a[1].total).map(([name,s])=>{
      const p=Math.round(s.correct/s.total*100);
      const col=p>=70?'#4ADE80':p>=50?'#FCD34D':'#FF6B6B';
      return `<div class="qx-stat-bar-row">
        <div class="qx-stat-bar-hdr">
          <span class="qx-stat-bar-name">${_esc(_short(name))}</span>
          <span class="qx-stat-bar-val">${s.correct}/${s.total} · <strong style="color:${col}">${p}%</strong></span>
        </div>
        <div class="qx-stat-bar"><div class="qx-stat-bar-fill" style="width:${p}%;background:${col}"></div></div>
      </div>`;
    }).join('');

    return `
      <div class="qx-stats-wrap">
        <div class="qx-stats-grid">
          <div class="qx-stat-kpi"><div class="qx-stat-kpi-num">${att.length}</div><div class="qx-stat-kpi-lbl">Respondidas</div></div>
          <div class="qx-stat-kpi"><div class="qx-stat-kpi-num" style="color:#4ADE80">${pct}%</div><div class="qx-stat-kpi-lbl">Aproveitamento</div><div class="qx-stat-kpi-sub">${correct} acertos · ${att.length-correct} erros</div></div>
          <div class="qx-stat-kpi"><div class="qx-stat-kpi-num">${avgMs}s</div><div class="qx-stat-kpi-lbl">Tempo médio</div><div class="qx-stat-kpi-sub">por questão</div></div>
          <div class="qx-stat-kpi"><div class="qx-stat-kpi-num">${bank.length}</div><div class="qx-stat-kpi-lbl">No banco</div></div>
        </div>
        <div class="qx-stat-section">
          <div class="qx-stat-section-hdr">Desempenho por disciplina</div>
          ${rows||'<div style="padding:24px;text-align:center;color:var(--text-dim);font-size:12px">Resolva mais questões para ver o detalhamento</div>'}
        </div>
      </div>`;
  }

  /* ════════════════════════════════════════
     IMPORT MODAL
     ════════════════════════════════════════ */
  function openImport() {
    _import={pdfData:null,fileName:'',banca:'',ano:'',disciplina:'',topico:'',status:'idle',progress:0,msg:'',extracted:null};
    _renderImportModal();
  }
  function closeImport() {
    if (_import?.status==='extracting') return;
    document.getElementById('qb-modal-import')?.remove();
    _import=null; _setPdfBusy(false);
  }

  function _renderImportModal() {
    let $bg=document.getElementById('qb-modal-import');
    if (!$bg) {
      $bg=document.createElement('div');
      $bg.id='qb-modal-import'; $bg.className='qb-modal-bg';
      $bg.onclick=e=>{ if(e.target===$bg&&_import?.status!=='extracting') closeImport(); };
      document.body.appendChild($bg);
    }
    const im=_import; if (!im) return;
    const ed=_edital(), bancaDefault=im.banca||ed?.banca||'';
    const discs=(ed?.disciplinas||[]);
    const selDisc=discs.find(d=>d.nome===im.disciplina);
    const topicos=selDisc?(selDisc.topicos||[]).map(t=>(t.texto||t.nome||'').replace(/^⚡\s*/,'')).filter(Boolean):[];
    let body;
    if (im.status==='preview'&&im.extracted) {
      const ext=im.extracted;
      body=`
        <div class="qb-modal-hdr">
          <div><h2 class="qb-modal-title">PRÉ-VISUALIZAÇÃO</h2><div class="qb-modal-sub">${ext.length} questão(ões) extraída(s) e categorizada(s).</div></div>
          <button class="qb-modal-close" onclick="Questoes.closeImport()">✕</button>
        </div>
        <div class="qb-preview-list">
          ${ext.map((q,i)=>`
            <div class="qb-preview-item">
              <span class="qb-preview-num">${String(i+1).padStart(2,'0')}</span>
              <span class="qb-preview-txt">${_esc((q.enunciado||'').slice(0,140))}</span>
              <span class="qb-preview-disc">${_esc(q.disciplina||'?')}</span>
            </div>`).join('')}
        </div>
        <div class="qb-modal-actions">
          <button class="qb-btn-ghost" onclick="Questoes.closeImport()">Cancelar</button>
          <button class="qb-btn-primary" onclick="Questoes.confirmImport()">✓ Salvar no banco</button>
        </div>`;
    } else {
      body=`
        <div class="qb-modal-hdr">
          <div><h2 class="qb-modal-title">IMPORTAR PDF</h2><div class="qb-modal-sub">A IA vai extrair as questões e vincular ao seu edital automaticamente.</div></div>
          <button class="qb-modal-close" onclick="Questoes.closeImport()" ${im.status==='extracting'?'disabled':''}>✕</button>
        </div>
        <div class="qb-drop" id="qb-drop" onclick="document.getElementById('qb-pdf-input').click()">
          <div class="qb-drop-ic">📄</div>
          <div class="qb-drop-title">Clique para selecionar ou arraste o PDF</div>
          <div class="qb-drop-sub">Provas, cadernos de questões ou exercícios com gabarito</div>
          ${im.fileName?`<div class="qb-drop-file">📎 ${_esc(im.fileName)}</div>`:''}
        </div>
        <input type="file" id="qb-pdf-input" accept="application/pdf" style="display:none" onchange="Questoes._onPdfChosen(event)" />
        <div class="qb-modal-row-2" style="margin-top:16px">
          <div class="qb-modal-row">
            <label class="qb-modal-label">Banca (opcional)</label>
            <input class="qb-modal-input" type="text" placeholder="Ex: CEBRASPE" value="${_esc(bancaDefault)}" oninput="Questoes._setMeta('banca',this.value)" />
          </div>
          <div class="qb-modal-row">
            <label class="qb-modal-label">Ano (opcional)</label>
            <input class="qb-modal-input" type="text" placeholder="Ex: 2024" value="${_esc(im.ano)}" oninput="Questoes._setMeta('ano',this.value)" />
          </div>
        </div>
        <div class="qb-modal-row-2" style="margin-top:12px">
          <div class="qb-modal-row">
            <label class="qb-modal-label">Disciplina alvo ${discs.length?'':'<span style="opacity:.6">(configure o edital)</span>'}</label>
            <select class="qb-modal-input" onchange="Questoes._setDisc(this.value)" ${discs.length?'':'disabled'}>
              <option value="">— Auto (IA decide pelo edital) —</option>
              ${discs.map(d=>`<option value="${_esc(d.nome)}" ${im.disciplina===d.nome?'selected':''}>${_esc(d.nome)}</option>`).join('')}
            </select>
          </div>
          <div class="qb-modal-row">
            <label class="qb-modal-label">Tópico alvo ${im.disciplina?'':'<span style="opacity:.6">(escolha a disciplina)</span>'}</label>
            <select class="qb-modal-input" onchange="Questoes._setMeta('topico',this.value)" ${im.disciplina?'':'disabled'}>
              <option value="">— Auto —</option>
              ${topicos.map(t=>`<option value="${_esc(t)}" ${im.topico===t?'selected':''}>${_esc(t)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--text-dim);line-height:1.5">
          💡 Selecionar disciplina e tópico aumenta a precisão da categorização. Deixe em "Auto" para PDFs com múltiplas disciplinas.
        </div>
        ${im.status==='extracting'?`
          <div class="qb-progress">
            <div class="qb-progress-msg"><div class="qb-spinner"></div><span>${_esc(im.msg)}</span></div>
            <div class="qb-progress-bar"><div class="qb-progress-fill" style="width:${im.progress}%"></div></div>
          </div>`:''}
        <div class="qb-modal-actions">
          <button class="qb-btn-ghost" onclick="Questoes.closeImport()" ${im.status==='extracting'?'disabled':''}>Cancelar</button>
          <button class="qb-btn-primary" onclick="event.preventDefault();event.stopPropagation();Questoes.runExtraction()" ${(!im.pdfData||im.status==='extracting')?'disabled':''}>
            ${im.status==='extracting'?'⏳ Processando...':'🤖 Extrair com IA'}
          </button>
        </div>`;
    }
    $bg.innerHTML=`<div class="qb-modal" onclick="event.stopPropagation()">${body}</div>`;
  }

  function _onPdfChosen(e) {
    const file=e.target.files?.[0]; if(!file) return;
    if(file.type!=='application/pdf'){_toast('O arquivo precisa ser PDF','red');return;}
    if(file.size>25*1024*1024){_toast('PDF muito grande (máx. 25MB)','red');return;}
    const r=new FileReader();
    r.onload=ev=>{_import.pdfData=ev.target.result.split(',')[1];_import.fileName=file.name;_renderImportModal();};
    r.readAsDataURL(file);
  }

  function _setMeta(k,v){if(_import)_import[k]=v;}
  function _setDisc(v){if(!_import)return;_import.disciplina=v;_import.topico='';_renderImportModal();}

  /* ── AI extraction ───────────────────── */
  async function runExtraction() {
    const key=_apiKey();
    if(!key){_toast('Configure sua chave de IA em Configurações','red');return;}
    if(!_import?.pdfData){_toast('Selecione um PDF primeiro','red');return;}
    const ed=_edital();
    const discsCtx=(ed?.disciplinas||[]).map(d=>({nome:d.nome,topicos:(d.topicos||[]).map(t=>(t.texto||t.nome||'').replace(/^⚡\s*/,'')).filter(Boolean)}));
    const discsList=discsCtx.length?discsCtx.map(d=>`- ${d.nome}: ${d.topicos.slice(0,30).join(' | ')}`).join('\n'):'(edital não configurado — categorize livremente)';
    const targetBlock=(_import.disciplina||_import.topico)?`\nALVO DO USUÁRIO (use OBRIGATORIAMENTE):\n- Disciplina: ${_import.disciplina||'(qualquer)'}\n- Tópico: ${_import.topico||'(qualquer)'}\n`:'';
    _import.status='extracting';_import.progress=15;_import.msg='🤖 Lendo o PDF e identificando questões...';
    _setPdfBusy(true);_renderImportModal();
    try {
      const prompt=`Você é especialista em questões de concurso público. Analise o PDF e extraia TODAS as questões com gabaritos.\n${_import.banca?'Banca: '+_import.banca:''}\n${_import.ano?'Ano: '+_import.ano:''}\n${targetBlock}\nDISCIPLINAS E TÓPICOS DO EDITAL:\n${discsList}\n\nREGRAS:\n1. Extraia cada questão completa (enunciado integral, alternativas, gabarito).\n2. Use exatamente os nomes de disciplina/tópico do edital acima.\n3. CESPE Certo/Errado: alternativas [{"letra":"C","texto":"Certo"},{"letra":"E","texto":"Errado"}], gabarito "C" ou "E".\n4. Múltipla escolha: letras A-E com texto completo de cada alternativa.\n5. Inclua "comentario" se houver justificativa no PDF.\n6. NÃO invente questões.\n\nRetorne SOMENTE JSON válido:\n{"questoes":[{"enunciado":"...","alternativas":[{"letra":"A","texto":"..."}],"gabarito":"A","disciplina":"nome exato","topico":"nome exato","banca":"...","ano":"2024","comentario":""}]}`;
      const resp=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body:JSON.stringify({model:MODEL_PDF,max_tokens:16000,messages:[{role:'user',content:[{type:'document',source:{type:'base64',media_type:'application/pdf',data:_import.pdfData}},{type:'text',text:prompt}]}]})
      });
      _import.progress=65;_import.msg='🧠 Categorizando questões por disciplina e tópico...';_renderImportModal();
      if(!resp.ok){let m='Erro API '+resp.status;try{const b=await resp.json();m=b?.error?.message||m;if(resp.status===401)m='Chave de API inválida — verifique em Configurações → IA';}catch(_){}throw new Error(m);}
      const d=await resp.json();
      const txt=(d.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('');
      const parsed=_parseJSONRobust(txt);
      const items=Array.isArray(parsed?.questoes)?parsed.questoes:(Array.isArray(parsed)?parsed:null);
      if(!items||!items.length) throw new Error('Não foi possível identificar questões neste PDF.');
      const now=Date.now();
      const extracted=items.map(q=>({
        id:_uid(),enunciado:String(q.enunciado||'').trim(),
        alternativas:(Array.isArray(q.alternativas)?q.alternativas:[]).map(a=>({letra:String(a.letra||'').trim().toUpperCase().slice(0,2),texto:String(a.texto||'').trim()})).filter(a=>a.letra&&a.texto),
        gabarito:String(q.gabarito||'').trim().toUpperCase(),
        disciplina:String(q.disciplina||'').trim(),topico:String(q.topico||'').trim(),
        banca:String(q.banca||_import.banca||'').trim(),ano:String(q.ano||_import.ano||'').trim(),
        comentario:String(q.comentario||'').trim(),source:_import.fileName,createdAt:now,
      })).filter(q=>q.enunciado&&q.alternativas.length&&q.gabarito);
      if(!extracted.length) throw new Error('Questões extraídas estão incompletas (sem alternativas ou gabarito).');
      _import.extracted=extracted;_import.status='preview';_import.progress=100;_setPdfBusy(false);_renderImportModal();
    } catch(err) {
      console.error('[Questoes.runExtraction]',err);_setPdfBusy(false);
      _import.status='idle';_import.progress=0;_import.msg='';_renderImportModal();
      _toast(err.message||'Falha ao extrair questões','red');
    }
  }

  function confirmImport() {
    if(!_import?.extracted?.length) return;
    const merged=_bank().concat(_import.extracted);
    _saveBank(merged);
    const n=_import.extracted.length;
    closeImport();
    _toast(`✓ ${n} questão(ões) adicionada(s) ao banco`,'green');
    render();
  }

  /* ════════════════════════════════════════
     GENERATE WITH AI
     ════════════════════════════════════════ */
  function openGenerate() {
    _generate = { disciplina:'', topico:'', tipo:'multipla', quantidade:10, dificuldade:'variada', banca:'', contexto:'', comentado:true, status:'idle', progress:0, msg:'', extracted:null, minimized:false };
    _renderGenerateModal();
  }
  function closeGenerate() {
    if (_generate?.status==='generating') return;
    document.getElementById('qx-modal-generate')?.remove();
    document.getElementById('qx-gen-pip')?.remove();
    _generate = null;
  }
  function minimizeGenerate() {
    if (!_generate) return;
    _generate.minimized = true;
    document.getElementById('qx-modal-generate')?.remove();
    _renderGenPip();
  }
  function restoreGenerate() {
    if (!_generate) return;
    _generate.minimized = false;
    document.getElementById('qx-gen-pip')?.remove();
    _renderGenerateModal();
  }
  function _renderGenPip() {
    let $pip = document.getElementById('qx-gen-pip');
    if (!$pip) {
      $pip = document.createElement('div');
      $pip.id = 'qx-gen-pip';
      document.body.appendChild($pip);
    }
    const g = _generate; if (!g) return;
    const isGen = g.status === 'generating';
    $pip.innerHTML = `
      <div class="qx-gen-pip-inner" onclick="Questoes.restoreGenerate()">
        <div class="qx-gen-pip-icon${isGen?' spin':''}">🤖</div>
        <div class="qx-gen-pip-info">
          <span class="qx-gen-pip-title">${isGen ? 'Gerando questões...' : g.status==='preview' ? `${g.extracted?.length||0} questões prontas!` : 'Gerar com IA'}</span>
          <span class="qx-gen-pip-sub">${isGen ? `${g.progress}% concluído` : 'Clique para abrir'}</span>
        </div>
        ${isGen ? `<div class="qx-gen-pip-bar"><div class="qx-gen-pip-fill" style="width:${g.progress}%"></div></div>` : ''}
        ${!isGen ? `<button class="qx-gen-pip-close" onclick="event.stopPropagation();Questoes.closeGenerate()">✕</button>` : ''}
      </div>`;
  }
  function _setGen(k,v) {
    if (!_generate) return;
    _generate[k] = (k==='quantidade' ? Number(v) : v);
    // Update only the affected button group without full re-render
    const grpMap = { tipo:'qx-setgen-tipo', quantidade:'qx-setgen-quantidade', dificuldade:'qx-setgen-dificuldade' };
    if (grpMap[k]) {
      document.querySelectorAll(`[data-setgen="${grpMap[k]}"]`).forEach(btn => {
        const bv = k==='quantidade' ? Number(btn.dataset.val) : btn.dataset.val;
        btn.classList.toggle('active', bv === _generate[k]);
      });
    }
    // For disciplina change, re-render only the tópico select
    if (k === 'disciplina') {
      _generate.topico = '';
      const ed = _edital();
      const selDisc = (ed?.disciplinas||[]).find(d=>d.nome===_generate.disciplina);
      const topicos = selDisc ? (selDisc.topicos||[]).map(t=>(t.texto||t.nome||'').replace(/^⚡\s*/,'')).filter(Boolean) : [];
      const $sel = document.getElementById('qx-gen-topico-sel');
      if ($sel) {
        $sel.disabled = !topicos.length;
        $sel.innerHTML = `<option value="">— Todos os tópicos —</option>${topicos.map(t=>`<option value="${_esc(t)}">${_esc(t)}</option>`).join('')}`;
      }
    }
  }

  function _renderGenerateModal() {
    const g = _generate; if (!g) return;
    // Se minimizado, só atualiza o pip
    if (g.minimized) { _renderGenPip(); return; }
    let $bg = document.getElementById('qx-modal-generate');
    if (!$bg) {
      $bg = document.createElement('div');
      $bg.id='qx-modal-generate'; $bg.className='fc-gen-overlay';
      $bg.style.display='flex';
      $bg.onclick=e=>{ if(e.target===$bg&&_generate?.status!=='generating') closeGenerate(); };
      document.body.appendChild($bg);
    }
    const ed  = _edital();
    const discs = (ed?.disciplinas||[]);
    const selDisc = discs.find(d=>d.nome===g.disciplina);
    const topicos = selDisc ? (selDisc.topicos||[]).map(t=>(t.texto||t.nome||'').replace(/^⚡\s*/,'')).filter(Boolean) : [];

    const grp = (opts, field, val) => `<div class="qx-btn-grp">
      ${opts.map(o=>`<button class="qx-btn-grp-btn${val===o.v?' active':''}" onclick="Questoes._setGen('${field}','${o.v}')">${o.l}</button>`).join('')}
    </div>`;

    let body;
    if (g.status==='preview' && g.extracted) {
      body = `
        <div class="qb-modal-hdr">
          <div><h2 class="qb-modal-title">PRÉ-VISUALIZAÇÃO</h2><div class="qb-modal-sub">${g.extracted.length} questão(ões) gerada(s) pela IA com sucesso.</div></div>
          <button class="qb-modal-close" onclick="Questoes.closeGenerate()">✕</button>
        </div>
        <div class="qb-preview-list">
          ${g.extracted.map((q,i)=>`
            <div class="qb-preview-item">
              <span class="qb-preview-num">${String(i+1).padStart(2,'0')}</span>
              <span class="qb-preview-txt">${_esc((q.enunciado||'').slice(0,150))}</span>
              <span class="qb-preview-disc" style="background:rgba(167,139,250,0.08);border-color:rgba(167,139,250,0.3);color:#B8A3F0">${_esc(q.gabarito||'?')}</span>
            </div>`).join('')}
        </div>
        <div class="qb-modal-actions">
          <button class="qb-btn-ghost" onclick="Questoes.closeGenerate()">Cancelar</button>
          <button class="qx-btn-generate-action" onclick="Questoes.confirmGenerate()">✓ Salvar no banco</button>
        </div>`;
    } else {
      body = `
        <div class="fc-gen-header">
          <div class="fc-gen-header-icon">🤖</div>
          <div class="fc-gen-header-text">
            <div class="fc-gen-title">GERAR QUESTÕES COM IA</div>
            <div class="fc-gen-subtitle">Configure os parâmetros e a IA cria questões inéditas baseadas no seu edital</div>
          </div>
          <button class="fc-gen-minimize" onclick="Questoes.minimizeGenerate()" title="Minimizar">—</button>
          <button class="fc-gen-close" onclick="Questoes.closeGenerate()" ${g.status==='generating'?'disabled':''}>✕</button>
        </div>

        <div class="fc-gen-body">

          <div class="fc-gen-section-lbl">📚 Matéria e Assunto</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
            <div class="field">
              <label>Disciplina</label>
              <select class="qb-modal-input" onchange="Questoes._setGen('disciplina',this.value);Questoes._setGen('topico','')" ${discs.length?'':'disabled'}>
                <option value="">— Todas as disciplinas —</option>
                ${discs.map(d=>`<option value="${_esc(d.nome)}" ${g.disciplina===d.nome?'selected':''}>${_esc(d.nome)}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label>Tópico específico</label>
              <select id="qx-gen-topico-sel" class="qb-modal-input" onchange="if(_generate)_generate.topico=this.value" ${topicos.length?'':'disabled'}>
                <option value="">— Todos os tópicos —</option>
                ${topicos.map(t=>`<option value="${_esc(t)}" ${g.topico===t?'selected':''}>${_esc(t)}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="fc-gen-section-lbl">📝 Tipo de Questão</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
            ${[{v:'multipla',l:'Múltipla Escolha (A-E)'},{v:'certo_errado',l:'Certo / Errado'},{v:'misto',l:'Misto'}]
              .map(o=>`<button class="qx-gen-type-btn${g.tipo===o.v?' active':''}" data-setgen="qx-setgen-tipo" data-val="${o.v}" onclick="Questoes._setGen('tipo','${o.v}')">${o.l}</button>`).join('')}
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
            <div>
              <div class="fc-gen-section-lbl">🔢 Quantidade</div>
              <div class="fc-gen-qty-row">
                ${[5,10,15,20].map(n=>`<button class="fc-gen-qty-btn${g.quantidade===n?' active':''}" data-setgen="qx-setgen-quantidade" data-val="${n}" onclick="Questoes._setGen('quantidade',${n})">${n}</button>`).join('')}
              </div>
            </div>
            <div>
              <div class="fc-gen-section-lbl">⚡ Dificuldade</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${[{v:'facil',l:'Fácil'},{v:'medio',l:'Médio'},{v:'dificil',l:'Difícil'},{v:'variada',l:'Variada'}]
                  .map(o=>`<button class="qx-gen-type-btn${g.dificuldade===o.v?' active':''}" data-setgen="qx-setgen-dificuldade" data-val="${o.v}" onclick="Questoes._setGen('dificuldade','${o.v}')">${o.l}</button>`).join('')}
              </div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div>
              <div class="fc-gen-section-lbl">🏛 Banca simulada <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:10px;color:var(--text-dim)">(opcional)</span></div>
              <input class="qb-modal-input" type="text" placeholder="Ex: CEBRASPE, FCC, VUNESP..."
                value="${_esc(g.banca)}" oninput="if(_generate)_generate.banca=this.value" />
            </div>
            <div>
              <div class="fc-gen-section-lbl">💬 Gabarito comentado</div>
              <label class="qx-gen-check-row" style="margin-top:8px">
                <input class="qx-gen-check" type="checkbox" ${g.comentado?'checked':''}
                  onchange="if(_generate)_generate.comentado=this.checked" />
                <span class="qx-gen-check-lbl">Incluir explicação do gabarito em cada questão</span>
              </label>
            </div>
          </div>

          <div class="fc-gen-section-lbl">✍️ Contexto / instrução adicional <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:10px;color:var(--text-dim)">(opcional)</span></div>
          <textarea class="fc-gen-focus-ta" style="margin-bottom:16px"
            placeholder="Ex: Foque em jurisprudência do STF, inclua questões de lei seca, simule provas da SEFAZ..."
            oninput="if(_generate)_generate.contexto=this.value">${_esc(g.contexto)}</textarea>

          ${g.status==='generating'?`
            <div class="qx-gen-progress">
              <div class="qx-gen-progress-msg"><div class="qx-gen-spinner"></div><span>${_esc(g.msg)}</span></div>
              <div class="qx-gen-bar"><div class="qx-gen-bar-fill" style="width:${g.progress}%"></div></div>
            </div>`:
            `<div style="display:flex;align-items:flex-start;gap:8px;padding:10px 14px;background:rgba(232,184,75,.06);border:1px solid rgba(232,184,75,.15);border-radius:10px;margin-bottom:4px">
              <span style="font-size:14px;flex-shrink:0">💡</span>
              <span style="font-size:11px;color:var(--text-muted);line-height:1.5">A IA criará questões <strong style="color:var(--gold)">inéditas</strong> baseadas no conteúdo real do seu edital. As questões são salvas no banco e podem ser resolvidas normalmente.</span>
            </div>`
          }

        </div>

        <div class="fc-gen-footer">
          <button class="fc-gen-btn-cancel" onclick="Questoes.closeGenerate()" ${g.status==='generating'?'disabled':''}>Cancelar</button>
          <button class="fc-gen-btn-go" onclick="Questoes.runGenerate()" ${g.status==='generating'?'disabled':''}>
            ${g.status==='generating'?'<span class="qx-gen-spinner" style="width:12px;height:12px;border-width:2px;margin-right:6px;display:inline-block"></span> Gerando...':'🤖 GERAR QUESTÕES'}
          </button>
        </div>`;
    }
    $bg.innerHTML = `<div class="fc-gen-modal" onclick="event.stopPropagation()" style="max-width:680px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column">${body}</div>`;
  }

  async function runGenerate() {
    const key = _apiKey();
    if (!key) { _toast('Configure sua chave de IA em Configurações', 'red'); return; }
    const g = _generate; if (!g) return;

    const difMap = { facil:'fácil (conceitos básicos)', medio:'médio (aplicação prática)', dificil:'difícil (casos complexos, exceções, pegadinhas)', variada:'variada (mistura de fácil, médio e difícil)' };
    const tipoMap = { multipla:'múltipla escolha com alternativas A, B, C, D, E (apenas uma correta)', certo_errado:'afirmações para julgar Certo ou Errado', misto:`mista: metade múltipla escolha (A-E) e metade Certo/Errado` };
    const discCtx = g.disciplina ? `Disciplina: ${g.disciplina}${g.topico?'\nTópico específico: '+g.topico:''}` : 'Disciplina: variada (use o edital abaixo)';
    const ed = _edital();
    const editalCtx = ed?.disciplinas?.length
      ? ed.disciplinas.slice(0,8).map(d=>`- ${d.nome}`).join('\n')
      : '(edital não configurado)';

    g.status='generating'; g.progress=10; g.msg=`🤖 Criando ${g.quantidade} questões de ${g.disciplina||'concurso'}...`;
    _renderGenerateModal();

    const prompt = `Você é um professor especialista em concursos públicos brasileiros. Crie ${g.quantidade} questões INÉDITAS e ORIGINAIS com as seguintes especificações:

${discCtx}
Tipo: ${tipoMap[g.tipo]||tipoMap.multipla}
Dificuldade: ${difMap[g.dificuldade]||difMap.variada}
${g.banca?'Estilo da banca: '+g.banca:''}
${g.contexto?'Instrução adicional: '+g.contexto:''}

EDITAL DE REFERÊNCIA:
${editalCtx}

REGRAS OBRIGATÓRIAS:
1. Crie questões ORIGINAIS baseadas no conteúdo real da disciplina/tópico indicado.
2. Para MÚLTIPLA ESCOLHA: exatamente 5 alternativas (A, B, C, D, E), apenas uma correta, alternativas plausíveis.
3. Para CERTO/ERRADO: alternativas [{"letra":"C","texto":"Certo"},{"letra":"E","texto":"Errado"}].
4. ${g.comentado?'Inclua comentário explicativo detalhado em "comentario". Comece com 1-2 frases de contexto geral sobre o tema, depois explique cada alternativa iniciando sempre com "A alternativa X está correta/incorreta porque...". Use marcações de destaque APENAS no contexto geral inicial: ==texto== para termos técnicos e conceitos-chave (dourado), !!texto!! para exceções e pegadinhas (vermelho), **texto** para respostas corretas (verde), ~~texto~~ para artigos e referências legais (azul). Não use marcações nas frases de cada alternativa.':'Campo "comentario" pode ficar vazio.'}
5. Use linguagem formal de concurso público.
6. Varie o formato das questões: enunciados com situações-problema, textos normativos, doutrina, jurisprudência quando aplicável.
7. Gabarito deve ser CORRETO e defensável.

Retorne SOMENTE JSON válido (sem markdown, sem texto extra):
{"questoes":[{"enunciado":"texto completo da questão","alternativas":[{"letra":"A","texto":"..."},{"letra":"B","texto":"..."},{"letra":"C","texto":"..."},{"letra":"D","texto":"..."},{"letra":"E","texto":"..."}],"gabarito":"B","disciplina":"${_esc(g.disciplina||'Concursos')}","topico":"${_esc(g.topico||'')}","banca":"${_esc(g.banca||'Simulado')}","ano":"${new Date().getFullYear()}","comentario":"explicação"}]}`;

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({ model:'claude-opus-4-5', max_tokens:8000, messages:[{role:'user',content:[{type:'text',text:prompt}]}] })
      });

      g.progress=70; g.msg='🧠 Validando e organizando as questões...'; _renderGenerateModal();

      if (!resp.ok) {
        let m='Erro API '+resp.status;
        try { const b=await resp.json(); m=b?.error?.message||m; if(resp.status===401)m='Chave de API inválida'; } catch(_){}
        throw new Error(m);
      }
      const d = await resp.json();
      const txt = (d.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('');
      const parsed = _parseJSONRobust(txt);
      const items = Array.isArray(parsed?.questoes)?parsed.questoes:(Array.isArray(parsed)?parsed:null);
      if (!items||!items.length) throw new Error('A IA não retornou questões válidas. Tente novamente.');

      const now = Date.now();
      const extracted = items.map(q=>({
        id: _uid(),
        enunciado:  String(q.enunciado||'').trim(),
        alternativas: (Array.isArray(q.alternativas)?q.alternativas:[]).map(a=>({letra:String(a.letra||'').trim().toUpperCase().slice(0,2),texto:String(a.texto||'').trim()})).filter(a=>a.letra&&a.texto),
        gabarito:   String(q.gabarito||'').trim().toUpperCase(),
        disciplina: String(q.disciplina||g.disciplina||'').trim(),
        topico:     String(q.topico||g.topico||'').trim(),
        banca:      String(q.banca||g.banca||'Simulado IA').trim(),
        ano:        String(q.ano||new Date().getFullYear()).trim(),
        comentario: String(q.comentario||'').trim(),
        source:     '🤖 Gerado por IA',
        createdAt:  now,
      })).filter(q=>q.enunciado&&q.alternativas.length&&q.gabarito);

      if (!extracted.length) throw new Error('Questões geradas estão incompletas. Tente novamente.');
      g.extracted = extracted; g.status='preview'; g.progress=100; _renderGenerateModal();
    } catch(err) {
      console.error('[Questoes.runGenerate]', err);
      g.status='idle'; g.progress=0; g.msg=''; _renderGenerateModal();
      _toast(err.message||'Falha ao gerar questões', 'red');
    }
  }

  function confirmGenerate() {
    if (!_generate?.extracted?.length) return;
    const merged = _bank().concat(_generate.extracted);
    _saveBank(merged);
    const n = _generate.extracted.length;
    closeGenerate();
    _toast(`✓ ${n} questão(ões) gerada(s) e salva(s) no banco`, 'green');
    render();
  }

  function renderCardHtml(qid) {
    const bank = _bank();
    const idx  = bank.findIndex(q => q.id === qid);
    if (idx < 0) return null;
    _expandedCards.add(qid);
    return _renderCard(bank[idx], idx + 1);
  }

  /* ── Public API ──────────────────────── */
  return {
    render, setTab, renderCardHtml,
    setSearch, setStatus, setBanca, setAno,
    filterDisc, filterTopic, clearFilters,
    toggleTopicDrop, closeTopicDrop,
    toggleBancaDrop, closeBancaDrop,
    toggleAnoDrop, closeAnoDrop,
    toggleDisc, toggleDiscAll, toggleSection,
    toggleCard, selectPending, inlineAnswer, retryCard, toggleReveal,
    togglePanel, toggleMarcador, addComentario, delComentario,
    saveAnotacao, delAnotacao, _edInsertLink, _edInsertImage, reportarErro, addToCadernoErros,
    removeQuestion,
    openImport, closeImport, runExtraction, confirmImport,
    _onPdfChosen, _setMeta, _setDisc, _renderImportModal,
    openGenerate, closeGenerate, minimizeGenerate, restoreGenerate, runGenerate, confirmGenerate, _setGen,
    startSession, exitSession,
    eliminateAlt, _selectSess, _eliminateSess, _answer, _next, _prev, _goToQ, _retryWrong,
  };
})();
