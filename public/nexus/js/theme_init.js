
/* ══════════════════════════════════════════════════════
   THEME ENGINE — dark/light switcher
════════════════════════════════════════════════════════ */
const ThemeEngine = (() => {
  const STORAGE_KEY = 'nexus_theme_v1';
  let _current = 'dark';

  function _apply(theme) {
    _current = theme;
    const attr = theme === 'light' ? 'light' : '';
    document.documentElement.setAttribute('data-theme', attr);
    document.body.setAttribute('data-theme', attr);
    document.body.className = document.body.className
      .replace(/theme-dark|theme-light/g, '').trim() + ' theme-' + (theme === 'light' ? 'light' : 'dark');
    localStorage.setItem(STORAGE_KEY, theme);

    // Update tooltip
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.title = theme === 'light' ? 'Mudar para Tema Dark' : 'Mudar para Tema Light';

    // Re-render dashboard components that use inline colors
    _patchInlineColors(theme);
  }

  function _patchInlineColors(theme) {
    // Heatmap cells use rgba inline — they adapt via CSS variable overrides
    // SVG-based charts need color recalculation — trigger re-render if on dashboard
    if (typeof Render !== 'undefined') {
      const $metas  = document.getElementById('dash-metas-card');
      const $weekly = document.getElementById('dash-weekly-card');
      const $pizza  = document.getElementById('dash-pizza-card');
      const $heat   = document.getElementById('dash-heatmap-card');
      const $hist   = document.getElementById('dash-history-card');
      if ($metas)  Render._renderMetasCard();
      if ($weekly) Render._renderWeeklyChartCard();
      if ($pizza)  Render._renderPizzaCard();
      if ($heat)   Render._renderConsistencyCard();
      if ($hist)   Render._renderHistoryCard();
    }
  }

  function toggle() {
    const next = _current === 'dark' ? 'light' : 'dark';
    _apply(next);

    // Toast notification
    const msg = next === 'light' ? '☀️ Tema Light ativado' : '🌙 Tema Dark ativado';
    const t = document.createElement('div');
    t.style.cssText = [
      'position:fixed','bottom:24px','left:50%','transform:translateX(-50%)',
      'padding:9px 18px','border-radius:10px','font-size:12px','font-weight:700',
      'z-index:99999','pointer-events:none','transition:opacity .3s',
      next === 'light'
        ? 'background:rgba(201,155,26,.15);border:1px solid rgba(201,155,26,.4);color:#C99B1A'
        : 'background:rgba(77,159,255,.12);border:1px solid rgba(77,159,255,.3);color:#4D9FFF'
    ].join(';');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 1800);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
    _apply(saved);
  }

  // Color helpers for JS-rendered components
  function clr(dark, light) {
    return _current === 'light' ? light : dark;
  }
  function svgText() {
    return _current === 'light' ? '#1A1612' : 'rgba(255,255,255,.75)';
  }
  function svgTextDim() {
    return _current === 'light' ? '#8A7E6E' : 'rgba(255,255,255,.35)';
  }
  function svgGrid() {
    return _current === 'light' ? 'rgba(100,80,50,0.10)' : 'rgba(255,255,255,.04)';
  }
  function svgBaseline() {
    return _current === 'light' ? 'rgba(100,80,50,0.18)' : 'rgba(255,255,255,.12)';
  }
  function svgShimmer() {
    return _current === 'light' ? 'rgba(255,255,255,.50)' : 'rgba(255,255,255,.18)';
  }
  function surfaceFill() {
    return _current === 'light' ? '#FFFFFF' : 'var(--surface-1)';
  }
  function pizzaCenter() {
    return _current === 'light' ? '#1A1612' : 'rgba(255,255,255,.4)';
  }

  return { init, toggle, current: () => _current, clr, svgText, svgTextDim, svgGrid, svgBaseline, svgShimmer, surfaceFill, pizzaCenter };
})();


ThemeEngine.init();
  App.init();
