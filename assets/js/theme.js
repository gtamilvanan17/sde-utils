/* =========================================================================
   SDE Utils — theme.js
   Appearance controller: light/dark theme + accent color.

   Responsibilities:
     1. Toggle light ↔ dark and persist the choice (SDEUtils.store)
     2. Live-sync with the OS prefers-color-scheme (only when the user
        has NOT set an explicit preference)
     3. Keep <html data-theme> in sync (accent is fixed: blue & white theme)
     4. Fire a small 'sde-utils:themechange' event other scripts can listen to

   Depends on: utils.js (SDEUtils.$, SDEUtils.store, SDEUtils.el, SDEUtils.on)
   Note: an inline script in index.html already sets the initial theme
   before paint to avoid a flash — this file takes over interactivity.
   ========================================================================= */
(function (window, document) {
  'use strict';

  const T = window.SDEUtils;
  if (!T) { console.error('[theme] SDEUtils utils not loaded'); return; }

  const { $, el, on, store } = T;

  /* ----------------------------------------------------------------------
     Config
     ---------------------------------------------------------------------- */
  const THEME_KEY  = 'theme';       // "light" | "dark"
  const THEME_EXPLICIT_KEY = 'theme-explicit'; // true once user toggles

  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* ----------------------------------------------------------------------
     Theme
     ---------------------------------------------------------------------- */
  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, { persist = true } = {}) {
    const next = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    // Keep the browser UI (form controls, scrollbars) aligned
    root.style.colorScheme = next;
    if (persist) {
      store.set(THEME_KEY, next);
      store.set(THEME_EXPLICIT_KEY, true);
    }
    updateThemeToggleA11y(next);
    emitChange();
  }

  function toggleTheme() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  }

  function updateThemeToggleA11y(theme) {
    const btn = $('#themeToggle');
    if (!btn) return;
    const isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute(
      'title',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  /* ----------------------------------------------------------------------
     Meta theme-color (kept in sync with the fixed blue accent)
     ---------------------------------------------------------------------- */
  function syncMetaThemeColor() {
    const meta = $('meta[name="theme-color"]');
    if (!meta) return;
    // Read the resolved --accent from CSS
    const val = getComputedStyle(root).getPropertyValue('--accent').trim();
    if (val) meta.setAttribute('content', val);
  }

  /* ----------------------------------------------------------------------
     Events
     ---------------------------------------------------------------------- */
  function emitChange() {
    window.dispatchEvent(
      new CustomEvent('sde-utils:themechange', {
        detail: { theme: currentTheme() }
      })
    );
  }

  /* ----------------------------------------------------------------------
     Wiring
     ---------------------------------------------------------------------- */
  function init() {
    // Theme toggle button
    const themeBtn = $('#themeToggle');
    if (themeBtn) on(themeBtn, 'click', toggleTheme);
    updateThemeToggleA11y(currentTheme());

    // Keyboard shortcut: Shift + D toggles dark mode
    on(document, 'keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(
        (e.target && e.target.tagName) || ''
      );
      if (!typing && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Live-follow the OS theme ONLY if the user never chose explicitly
    const onSystemChange = (e) => {
      if (store.get(THEME_EXPLICIT_KEY, false)) return;
      applyTheme(e.matches ? 'dark' : 'light', { persist: false });
    };
    if (systemDark.addEventListener) {
      systemDark.addEventListener('change', onSystemChange);
    } else if (systemDark.addListener) {
      systemDark.addListener(onSystemChange); // older Safari
    }

    // Make sure meta theme-color matches the fixed accent
    syncMetaThemeColor();
  }

  /* ----------------------------------------------------------------------
     Public API (handy for other scripts / a future settings panel)
     ---------------------------------------------------------------------- */
  T.theme = {
    get: currentTheme,
    set: applyTheme,
    toggle: toggleTheme
  };

  // Run after DOM is ready (script is deferred, but guard anyway)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
