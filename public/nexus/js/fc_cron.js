/* ════════════════════════════════════════════════════════
   FC CRON VIEW — Gerencia flashcards gerados pelo Cronograma
   Storage: nexus_flash_cronograma_v1
   Visão separada na aba Flashcards com toggle 🗓️
════════════════════════════════════════════════════════ */
const FCCronView = (() => {
  const KEY = 'nexus_flash_cronograma_v1';
  var _active    = false;
  var _filter    = { disc: 'all', topic: 'all', search: '', sort: 'recent' };
  var _deckIdx   = {};   // disc → current card index in that group
  var _activeDisc= null; // currently viewing discipline key

  /* ────── Storage ────── */
  function _load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(_e) { return []; } }
  function _save(arr){ try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch(_e) {} }

  /* ────── Highlight parser — identical to Flashcards._parseMarks ────── */
  function _pm(text) {
    if (!text) return '';
    function wrap(str, d, cls) {
      var p = str.split(d), o = '';
      for (var i=0;i<p.length;i++) o += (i%2===0)?p[i]:'<span class="fc-mark-'+cls+'">'+p[i]+'</span>';
      return o;
    }
    var o = String(text);
    o = wrap(o,'==','gold'); o = wrap(o,'!!','red');
    o = wrap(o,'**','green'); o = wrap(o,'~~','blue');
    o = wrap(o,'__','bold');
    return o.replace(/\n/g,'<br>');
  }

  /* ────── Derived helpers ────── */
  function _all()  { return _load(); }
  function _disciplines(cards) {
    var seen = {}, list = [];
    cards.forEach(function(c){ var k = c.materia||'Geral'; if (!seen[k]){ seen[k]=true; list.push(k); } });
    return list;
  }
  function _topics(cards, disc) {
    var filtered = disc==='all' ? cards : cards.filter(function(c){ return (c.materia||'Geral')===disc; });
    var seen = {}, list = [];
    filtered.forEach(function(c){ var k = c.topic||''; if (k && !seen[k]){ seen[k]=true; list.push(k); } });
    return list;
  }
  function _applyFilters(cards) {
    var r = cards.slice();
    if (_filter.disc   !== 'all') r = r.filter(function(c){ return (c.materia||'Geral') === _filter.disc; });
    if (_filter.topic  !== 'all') r = r.filter(function(c){ return (c.topic||'')        === _filter.topic; });
    if (_filter.search) {
      var q = _filter.search.toLowerCase();
      r = r.filter(function(c){ return (c.q||'').toLowerCase().includes(q)||(c.a||'').toLowerCase().includes(q)||(c.materia||'').toLowerCase().includes(q); });
    }
    // Sort
    if (_filter.sort === 'diff')   r.sort(function(a,b){ return (b.diff||2)-(a.diff||2); });
    if (_filter.sort === 'alpha')  r.sort(function(a,b){ return (a.q||'').localeCompare(b.q||''); });
    // default 'recent': original insert order (newest first = already reversed in addCards)
    return r;
  }
  function _diffColor(d){ return {1:'var(--green)',2:'var(--gold)',3:'var(--red)'}[d]||'var(--gold)'; }
  function _diffLabel(d){ return {1:'Fácil',2:'Médio',3:'Difícil'}[d]||'Médio'; }
  function _discColor(name) {
    var COLORS=['#4D9FFF','#E8B84B','#2ECC71','#FF4D4D','#A78BFA','#FF8C42','#00CEC9','#FD79A8'];
    var h=0; for(var i=0;i<name.length;i++) h=((h<<5)-h+name.charCodeAt(i))|0;
    return COLORS[Math.abs(h)%COLORS.length];
  }

  /* ────── Public API ────── */
  function addCards(cards) {
    var existing = _load();
    // Deduplicate by id
    var existIds = new Set(existing.map(function(c){ return c.id; }));
    var newOnes  = cards.filter(function(c){ return !existIds.has(c.id); });
    _save([...newOnes, ...existing]);
    updateBadge();
    if (_active) render();
  }

  function deleteCard(id) {
    _save(_load().filter(function(c){ return c.id !== id; }));
    if (_active) render();
    updateBadge();
  }

  function clearAll() {
    if (!confirm('Apagar todos os cards do Cronograma?')) return;
    _save([]); render(); updateBadge();
  }

  function updateBadge() {
    var count = _load().length;
    var $btn  = document.getElementById('fc-cron-toggle');
    if (!$btn) return;
    var span = $btn.querySelector('span:last-child');
    if (span) span.textContent = count>0 ? 'Cronograma ('+count+')' : 'Cronograma';
  }

  function toggle(btn) {
    _active = !_active;
    btn.classList.toggle('active', _active);
    _switchView();
  }

  function _switchView() {
    var $cron   = document.getElementById('fc-cron-view');
    var $normal = document.querySelectorAll('#view-flashcards > *:not(#fc-cron-view):not(.section-header)');
    if (_active) {
      $normal.forEach(function(el){ if (el.id !== 'fc-cron-view') el.style.display='none'; });
      $cron && $cron.classList.add('active');
      render();
    } else {
      $normal.forEach(function(el){ el.style.display=''; });
      $cron && $cron.classList.remove('active');
    }
  }

  function search(val) { _filter.search = val||''; render(); }
  function setSort(s)  {
    _filter.sort = s;
    document.querySelectorAll('.fcron-sort-btn').forEach(function(b){ b.classList.remove('active'); });
    var $b = document.getElementById('fcron-sort-'+s);
    if ($b) $b.classList.add('active');
    render();
  }
  function filterDisc(disc) {
    _filter.disc  = disc;
    _filter.topic = 'all';
    _activeDisc   = disc === 'all' ? null : disc;
    render();
  }
  function filterTopic(topic) {
    _filter.topic = topic;
    render();
  }

  /* ────── Main render ────── */
  function render() {
    var all      = _all();
    var filtered = _applyFilters(all);

    _renderStats(all);
    _renderDiscChips(all);
    _renderTopicChips(all);
    _renderResultsInfo(filtered, all);

    var $canvas = document.getElementById('fcron-canvas');
    if (!$canvas) return;

    if (!all.length) {
      $canvas.innerHTML =
        '<div class="fcron-empty" style="grid-column:1/-1">' +
          '<div class="fcron-empty-icon">🃏</div>' +
          '<div class="fcron-empty-title">Nenhum flashcard ainda</div>' +
          '<div class="fcron-empty-sub">Clique no ícone <strong>🃏</strong> em qualquer bloco de estudo no Cronograma para gerar cards contextuais com IA.</div>' +
        '</div>';
      return;
    }

    if (!filtered.length) {
      $canvas.innerHTML =
        '<div class="fcron-no-results" style="grid-column:1/-1">' +
          '<div style="font-size:32px;opacity:.4">🔍</div>' +
          '<div style="font-size:13px;color:var(--text-muted);font-weight:700">Nenhum card encontrado</div>' +
          '<div style="font-size:11px">Tente outros filtros ou limpe a busca</div>' +
        '</div>';
      return;
    }

    // Group filtered cards by disc
    var groups = {};
    filtered.forEach(function(c){ var k=c.materia||'Geral'; if(!groups[k]) groups[k]=[]; groups[k].push(c); });

    var discKeys = Object.keys(groups);

    // Pick active group
    if (!_activeDisc || !groups[_activeDisc]) _activeDisc = discKeys[0];
    var activeCards = groups[_activeDisc] || [];
    var activeIdx   = _deckIdx[_activeDisc] || 0;
    if (activeIdx >= activeCards.length) activeIdx = 0;
    _deckIdx[_activeDisc] = activeIdx;

    // ── Sidebar HTML — expandable disciplines + topics ──
    if (!window._fcronSideExpanded) window._fcronSideExpanded = {};

    var sideHtml = '<div class="fcron-sidebar">' +
      '<div class="fcron-sidebar-hd">MAT\u00c9RIAS (' + discKeys.length + ')</div>';

    discKeys.forEach(function(disc) {
      var cards = groups[disc];
      var n     = cards.length;
      var clr   = _discColor(disc);
      var isActive   = disc === _activeDisc;
      var isExpanded = !!window._fcronSideExpanded[disc];

      var topicMap = {};
      cards.forEach(function(card) {
        var t = card.topic || '';
        if (!topicMap[t]) topicMap[t] = 0;
        topicMap[t]++;
      });
      var topics = Object.keys(topicMap).filter(function(t){ return t; });

      var safeDisc = disc.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      var curIdx   = (_deckIdx[disc] !== undefined ? _deckIdx[disc] : 0);
      var posLabel = (curIdx+1) + ' / ' + n;
      var activeTopic = window._fcronActiveTopic || 'all';

      sideHtml +=
        '<div class="fcsb-disc-wrap' + (isActive ? ' active' : '') + '">' +
          '<div class="fcsb-disc-row" onclick="FCCronView._selectDisc(\'' + safeDisc + '\')">' +
            '<div class="fcsb-disc-dot" style="background:' + clr + '"></div>' +
            '<div class="fcsb-disc-info">' +
              '<div class="fcsb-disc-name" title="' + disc + '">' + disc + '</div>' +
              '<div class="fcsb-disc-pos">' + posLabel + '</div>' +
            '</div>' +
            '<div class="fcsb-disc-right">' +
              '<span class="fcsb-count">' + n + '</span>' +
              (topics.length > 0
                ? '<button class="fcsb-expand-btn" title="' + (isExpanded ? 'Fechar' : 'Ver t\u00f3picos') + '"' +
                    ' onclick="event.stopPropagation();FCCronView._toggleSideDisc(\'' + safeDisc + '\')">' +
                    (isExpanded ? '\u2212' : '+') +
                  '</button>'
                : '') +
            '</div>' +
          '</div>';

      if (isExpanded && topics.length) {
        sideHtml += '<div class="fcsb-topics">';
        var allActive = isActive && activeTopic === 'all';
        sideHtml +=
          '<button class="fcsb-topic-btn' + (allActive ? ' active' : '') + '"' +
            ' onclick="FCCronView._selectTopic(\'' + safeDisc + '\',\'all\')">' +
            '<div class="fcsb-topic-dot" style="background:' + clr + '66"></div>' +
            '<span class="fcsb-topic-name">Todos os cards</span>' +
            '<span class="fcsb-topic-n">' + n + '</span>' +
          '</button>';
        topics.forEach(function(topic) {
          var cnt = topicMap[topic];
          var safeTopic = topic.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
          var tActive = isActive && activeTopic === topic;
          sideHtml +=
            '<button class="fcsb-topic-btn' + (tActive ? ' active' : '') + '"' +
              ' onclick="FCCronView._selectTopic(\'' + safeDisc + '\',\'' + safeTopic + '\')">' +
              '<div class="fcsb-topic-dot" style="background:' + clr + '66"></div>' +
              '<span class="fcsb-topic-name">' + topic.slice(0,40) + (topic.length > 40 ? '\u2026' : '') + '</span>' +
              '<span class="fcsb-topic-n">' + cnt + '</span>' +
            '</button>';
        });
        sideHtml += '</div>';
      }

      sideHtml += '</div>';
    });

    sideHtml += '</div>';

    // ── Card area HTML ──
    var card = activeCards[activeIdx];
    var diff  = card ? (card.diff||2) : 2;
    var pct   = activeCards.length > 1 ? Math.round(activeIdx/(activeCards.length-1)*100) : (activeIdx===0&&activeCards.length===1?100:0);
    var discClr = _discColor(_activeDisc||'');

    var cardHtml =
      '<div class="fcron-card-area">' +
        '<button class="fcron-del-btn" onclick="FCCronView._delCurrent()" title="Apagar card">✕</button>' +
        '<div class="fcron-card-topbar">' +
          '<div class="fcron-card-discipline">' +
            '<div class="cd-dot" style="background:'+discClr+'"></div>' +
            '<span>'+(_activeDisc||'Geral')+'</span>' +
          '</div>' +
          '<div class="fcron-diff-badge d'+diff+'" id="fcron-diff-badge" onclick="FCCronView._cycleDiff()">' +
            _diffLabel(diff) +
          '</div>' +
        '</div>' +
        '<div class="fcron-prog-track"><div class="fcron-prog-fill" id="fcron-prog-fill" style="width:'+pct+'%"></div></div>' +
        '<div class="fc-scene">' +
          '<div class="fc-card" id="fcron-card" onclick="FCCronView.flip()">' +
            '<div class="fc-face fc-front">' +
              '<div class="fc-face-label">PERGUNTA</div>' +
              '<div class="fc-face-text" id="fcron-q">'+(card?_pm(card.q||''):'—')+'</div>' +
              '<div class="fc-hint">Clique para revelar a resposta</div>' +
            '</div>' +
            '<div class="fc-face fc-back">' +
              '<div class="fc-face-label">RESPOSTA</div>' +
              '<div class="fc-face-text" id="fcron-a">'+(card?_pm(card.a||''):'—')+'</div>' +
              '<div class="fc-card-meta" id="fcron-meta">'+(card?(card.topic||'')+(card.createdAt?' · '+card.createdAt:''):'')+'</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="fcron-nav">' +
          '<button class="fcron-nav-btn" onclick="FCCronView.prev()" '+(activeIdx===0?'disabled':'') +'>← Anterior</button>' +
          '<div class="fcron-counter" id="fcron-ctr">' +
            '<span class="cc-cur">'+(activeCards.length?activeIdx+1:0)+'</span>' +
            ' / '+activeCards.length +
          '</div>' +
          '<button class="fcron-nav-btn" onclick="FCCronView.next()" '+(activeIdx>=activeCards.length-1?'disabled':'')+'>Próximo →</button>' +
        '</div>' +
        '<div class="fcron-rate-row" id="fcron-rate-row" style="display:none">' +
          '<button class="fcron-rate-btn err"  onclick="FCCronView.rate(0)">✗ Errei</button>' +
          '<button class="fcron-rate-btn hard" onclick="FCCronView.rate(1)">😓 Difícil</button>' +
          '<button class="fcron-rate-btn ok"   onclick="FCCronView.rate(2)">😊 Ok</button>' +
          '<button class="fcron-rate-btn easy" onclick="FCCronView.rate(3)">✓ Fácil</button>' +
        '</div>' +
      '</div>';

    $canvas.innerHTML = sideHtml + cardHtml;
  }

  /* ────── Sub-renders ────── */
  function _renderStats(cards) {
    var $s = document.getElementById('fcron-stats');
    if (!$s) return;
    var total = cards.length;
    var easy  = cards.filter(function(c){ return c.diff===1; }).length;
    var med   = cards.filter(function(c){ return !c.diff||c.diff===2; }).length;
    var hard  = cards.filter(function(c){ return c.diff===3; }).length;
    $s.innerHTML =
      '<div class="fcron-stat-pill total"><span class="sp-num">'+total+'</span> cards</div>' +
      '<div class="fcron-stat-pill easy"><span class="sp-num">'+easy+'</span> fáceis</div>' +
      '<div class="fcron-stat-pill medium"><span class="sp-num">'+med+'</span> médios</div>' +
      '<div class="fcron-stat-pill hard"><span class="sp-num">'+hard+'</span> difíceis</div>';
  }

  function _renderDiscChips(cards) {
    var $d = document.getElementById('fcron-disc-chips');
    if (!$d) return;
    var discs  = _disciplines(cards);
    var counts = {};
    cards.forEach(function(c){ var k=c.materia||'Geral'; counts[k]=(counts[k]||0)+1; });
    var html = '<button class="fcron-chip disc '+ (_filter.disc==='all'?'active':'') +'" onclick="FCCronView.filterDisc(\'all\')">Todas <span class="fcron-chip-count">'+cards.length+'</span></button>';
    discs.forEach(function(d) {
      html += '<button class="fcron-chip disc '+(_filter.disc===d?'active':'')+'" onclick="FCCronView.filterDisc(\''+d.replace(/'/g,"\\'")+'\')" style="'+(_filter.disc===d?'border-left:3px solid '+_discColor(d):'')+'">' +
        d.split(' ').slice(-2).join(' ') +
        ' <span class="fcron-chip-count">'+counts[d]+'</span></button>';
    });
    $d.innerHTML = html;
  }

  function _renderTopicChips(cards) {
    var $row = document.getElementById('fcron-topic-row');
    var $t   = document.getElementById('fcron-topic-chips');
    if (!$row || !$t) return;
    if (_filter.disc === 'all') { $row.style.display='none'; return; }
    var topics = _topics(cards, _filter.disc);
    if (!topics.length) { $row.style.display='none'; return; }
    $row.style.display = 'flex';
    var html = '<button class="fcron-chip '+(_filter.topic==='all'?'active':'') +'" onclick="FCCronView.filterTopic(\'all\')">Todos</button>';
    topics.forEach(function(t) {
      html += '<button class="fcron-chip '+(_filter.topic===t?'active':'')+'" onclick="FCCronView.filterTopic(\''+t.replace(/'/g,"\\'")+'\')">' + t.slice(0,40)+(t.length>40?'…':'') + '</button>';
    });
    $t.innerHTML = html;
  }

  function _renderResultsInfo(filtered, all) {
    var $i = document.getElementById('fcron-results-info');
    if (!$i) return;
    var info = '<strong>'+filtered.length+'</strong> de '+all.length+' cards';
    if (_filter.disc !== 'all') info += ' · <span style="color:var(--gold)">'+_filter.disc+'</span>';
    if (_filter.topic !== 'all') info += ' › ' + _filter.topic.slice(0,30);
    if (_filter.search) info += ' · busca: <em>"'+_filter.search+'"</em>';
    $i.innerHTML = info;
  }

  /* ────── Card interactions ────── */
  function flip() {
    var $c = document.getElementById('fcron-card');
    if (!$c) return;
    var flipped = $c.classList.toggle('flipped');
    var $rate = document.getElementById('fcron-rate-row');
    if ($rate) $rate.style.display = flipped ? 'flex' : 'none';
  }

  function prev() {
    if (!_activeDisc) return;
    var filtered = _applyFilters(_all());
    var groups   = _buildGroups(filtered);
    var cards    = groups[_activeDisc] || [];
    var idx      = _deckIdx[_activeDisc] || 0;
    _deckIdx[_activeDisc] = idx > 0 ? idx-1 : cards.length-1;
    render();
  }

  function next() {
    if (!_activeDisc) return;
    var filtered = _applyFilters(_all());
    var groups   = _buildGroups(filtered);
    var cards    = groups[_activeDisc] || [];
    var idx      = _deckIdx[_activeDisc] || 0;
    _deckIdx[_activeDisc] = (idx+1) % cards.length;
    render();
  }

  function _buildGroups(cards) {
    var g = {};
    cards.forEach(function(c){ var k=c.materia||'Geral'; if(!g[k]) g[k]=[]; g[k].push(c); });
    return g;
  }

  function _currentCard() {
    var filtered = _applyFilters(_all());
    var groups   = _buildGroups(filtered);
    var cards    = groups[_activeDisc] || [];
    var idx      = _deckIdx[_activeDisc] || 0;
    return cards[idx] || null;
  }

  function rate(score) {
    var card = _currentCard();
    if (!card) return;
    var diffMap = {0:3, 1:3, 2:2, 3:1};
    var all = _all();
    var c = all.find(function(x){ return x.id===card.id; });
    if (c) { c.diff=diffMap[score]!==undefined?diffMap[score]:2; _save(all); }
    next();
  }

  function _cycleDiff() {
    var card = _currentCard();
    if (!card) return;
    var all = _all();
    var c   = all.find(function(x){ return x.id===card.id; });
    if (c) { c.diff = c.diff===3 ? 1 : (c.diff||2)+1; _save(all); render(); }
  }

  function _delCurrent() {
    var card = _currentCard();
    if (!card || !confirm('Apagar este card?')) return;
    deleteCard(card.id);
  }

  function _selectDisc(disc) {
    _activeDisc = disc;
    if (_deckIdx[disc] === undefined) _deckIdx[disc] = 0;
    window._fcronActiveTopic = 'all';
    _filter.topic = 'all';
    render();
  }
  function _toggleSideDisc(disc) {
    if (!window._fcronSideExpanded) window._fcronSideExpanded = {};
    window._fcronSideExpanded[disc] = !window._fcronSideExpanded[disc];
    render();
  }
  function _selectTopic(disc, topic) {
    _activeDisc = disc;
    if (_deckIdx[disc] === undefined) _deckIdx[disc] = 0;
    window._fcronActiveTopic = topic;
    _filter.topic = topic === 'all' ? 'all' : topic;
    render();
  }

  document.addEventListener('DOMContentLoaded', function(){ setTimeout(updateBadge, 500); });
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState==='visible' && typeof StudyTimer!=='undefined') StudyTimer.syncTimer();
  });

  function _resetActive() {
    _active = false;
    var $btn = document.getElementById('fc-cron-toggle');
    if ($btn) $btn.classList.remove('active');
  }

  return { addCards, deleteCard, clearAll, toggle, render, updateBadge,
           search, setSort, filterDisc, filterTopic,
           flip, prev, next, rate, _cycleDiff, _delCurrent,
           _selectDisc, _toggleSideDisc, _selectTopic, _resetActive };
})();
