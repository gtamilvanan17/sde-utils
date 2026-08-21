/* =========================================================================
   SDE Utils — router.js
   Hash-based single-page router. Ties the shell together.

   Responsibilities:
     1. Parse location.hash → route ('', 'about', or a tool id)
     2. Render built-in views: dashboard, about, 404, "coming soon"
     3. Lazy-load tool markup from tools/<id>.html (cached) + init hook
     4. Update recents + active sidebar item on navigation
     5. Command palette (Ctrl/⌘ + K) to jump to any tool
     6. Wait for the registry before routing (no race conditions)

   Tool contract:
     Each tools/<id>.html should contain the tool's markup. Optionally it
     may define a global init function named `initTool_<idCamel>` OR a
     <script data-tool-init> block; after injection we look for
     window.SDEUtilsTools[id] and call it with the mounted container.

   Depends on: utils.js, sidebar.js (SDEUtils.registry, SDEUtils.sidebar)
   ========================================================================= */
(function (window, document) {
  'use strict';

  const T = window.SDEUtils;
  if (!T) { console.error('[router] SDEUtils utils not loaded'); return; }

  const { $, el, on, escapeHtml } = T;

  /* ----------------------------------------------------------------------
     State
     ---------------------------------------------------------------------- */
  const TOOL_PATH = (id) => 'tools/' + id + '.html';
  const htmlCache = {};                 // id → fetched HTML string
  const content = () => $('#content');
  let registryReady = false;
  let pendingRoute = null;              // route requested before registry ready

  // Registry of tool init callbacks. Each tool file does:
  //   window.SDEUtilsTools = window.SDEUtilsTools || {};
  //   window.SDEUtilsTools['json-escape-unescape'] = function (root) { ... };
  window.SDEUtilsTools = window.SDEUtilsTools || {};

  /* ----------------------------------------------------------------------
     Route parsing
     ---------------------------------------------------------------------- */
  function parseHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '').trim();
    if (!raw) return { name: 'dashboard' };
    if (raw === 'about') return { name: 'about' };
    return { name: 'tool', id: raw };
  }

  /* ----------------------------------------------------------------------
     View renderers
     ---------------------------------------------------------------------- */
  function mount(node) {
    const c = content();
    if (!c) return;
    c.innerHTML = '';
    c.appendChild(node);
    c.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function view(id) {
    return el('section', { class: 'view', id });
  }

  /** Dashboard: rebuild the hero + featured grid (sidebar.js fills the grid). */
  function renderDashboard() {
    const meta = (T.registry && T.registry.meta) || {};
    const toolCount = meta.toolCount || (T.registry ? T.registry.tools.length : '150+');
    const catCount = meta.categoryCount ||
      (T.registry && T.registry.categories ? T.registry.categories.length : '17');

    const v = view('view-dashboard');
    v.appendChild(el('div', { class: 'dashboard-hero' }, [
      el('div', { class: 'hero-copy' }, [
        el('h1', { class: 'hero-title', html:
          'Your complete <span class="hero-accent">developer toolkit.</span>' }),
        el('p', { class: 'hero-subtitle', text:
          'Fast, private, offline-friendly developer tools. No trackers, no clutter — just utilities that respect your flow.' }),
        el('p', { class: 'hero-tagline', text:
          'Built for every stage of the SDLC — plan, code, build, test, release, deploy, and monitor — so you can stay in flow instead of hunting for the right utility.' }),
        el('div', { class: 'hero-actions' }, [
          el('a', { class: 'btn-sde-utils btn-sde-utils-primary', href: '#/json-escape-unescape' }, [
            el('i', { class: 'bi bi-lightning-charge-fill' }),
            document.createTextNode(' Start with JSON Escape')
          ]),
          el('button', { class: 'btn-sde-utils btn-sde-utils-ghost', id: 'openPalette', type: 'button' }, [
            el('kbd', { text: navigator.platform.match(/Mac/) ? '⌘' : 'Ctrl' }),
            document.createTextNode(' + '),
            el('kbd', { text: 'K' }),
            document.createTextNode(' Command Palette')
          ])
        ])
      ]),
      el('div', { class: 'hero-visual', 'aria-hidden': 'true' }, [
        el('div', { class: 'hero-visual-window' }, [
          el('div', { class: 'hero-visual-titlebar' }, [
            el('span', { class: 'hero-visual-dot' }),
            el('span', { class: 'hero-visual-dot' }),
            el('span', { class: 'hero-visual-dot' }),
            el('span', { class: 'hero-visual-titlebar-label', text: 'json-formatter.html' })
          ]),
          el('div', { class: 'hero-visual-body' }, [
            el('pre', { html:
              '<span class="dim">// paste messy JSON, get this back instantly</span>\n' +
              '{\n' +
              '  <span class="dim">"service"</span>: <span class="dim">"sde-utils"</span>,\n' +
              '  <span class="dim">"status"</span>: <span class="dim">"ready"</span>,\n' +
              '  <span class="dim">"offline"</span>: <span class="dim">true</span>\n' +
              '}' })
          ]),
          el('div', { class: 'hero-visual-stats' }, [
            el('div', { class: 'hero-visual-stat' }, [
              el('strong', { text: String(toolCount) }), el('span', { text: 'Tools' })
            ]),
            el('div', { class: 'hero-visual-stat' }, [
              el('strong', { text: String(catCount) }), el('span', { text: 'Categories' })
            ]),
            el('div', { class: 'hero-visual-stat' }, [
              el('strong', { text: '100%' }), el('span', { text: 'Offline' })
            ]),
            el('div', { class: 'hero-visual-stat' }, [
              el('strong', { text: '$0' }), el('span', { text: 'Forever' })
            ])
          ])
        ])
      ])
    ]));
    v.appendChild(el('div', { class: 'tool-grid', id: 'toolGrid' }));
    mount(v);
    // Let sidebar.js repopulate the grid from the registry
    if (T.sidebar && T.sidebar.refresh) {
      window.dispatchEvent(new CustomEvent('sde-utils:renderdashboard'));
    }
    T.sidebar && T.sidebar.setActive && T.sidebar.setActive('');
  }

  /** About view. */
  function renderAbout() {
    const meta = (T.registry && T.registry.meta) || {};
    const count = meta.toolCount || (T.registry ? T.registry.tools.length : '');
    const catCount = meta.categoryCount ||
      (T.registry && T.registry.categories ? T.registry.categories.length : '');
    const categories = (T.registry && T.registry.categories) || [];

    const v = view('view-about');

    v.appendChild(el('div', { class: 'about-hero' }, [
      el('div', { class: 'about-hero-icon' }, [ el('i', { class: 'bi bi-tools' }) ]),
      el('h1', { text: 'About SDE Utils' }),
      el('p', { text: meta.tagline ||
        'A curated toolbox of fast, private, offline-friendly utilities — built by a developer, for developers.' }),
      el('div', { class: 'about-stat-row' }, [
        el('div', { class: 'about-stat' }, [
          el('strong', { text: String(count) }), el('span', { text: 'Tools' })
        ]),
        el('div', { class: 'about-stat' }, [
          el('strong', { text: String(catCount) }), el('span', { text: 'Categories' })
        ]),
        el('div', { class: 'about-stat' }, [
          el('strong', { text: '100%' }), el('span', { text: 'Offline' })
        ]),
        el('div', { class: 'about-stat' }, [
          el('strong', { text: '$0' }), el('span', { text: 'Forever free' })
        ])
      ])
    ]));

    v.appendChild(el('div', { class: 'about-feature-grid' }, [
      el('div', { class: 'about-feature-card' }, [
        el('div', { class: 'about-feature-icon' }, [ el('i', { class: 'bi bi-shield-lock-fill' }) ]),
        el('h3', { text: 'Privacy-first' }),
        el('p', { text: 'Every tool runs entirely in your browser. Your input never leaves your machine — no servers, no analytics, no tracking.' })
      ]),
      el('div', { class: 'about-feature-card' }, [
        el('div', { class: 'about-feature-icon' }, [ el('i', { class: 'bi bi-lightning-charge-fill' }) ]),
        el('h3', { text: 'Fast & lightweight' }),
        el('p', { text: 'No build step, no frameworks to download — plain HTML, CSS & JavaScript that loads instantly and works offline.' })
      ]),
      el('div', { class: 'about-feature-card' }, [
        el('div', { class: 'about-feature-icon' }, [ el('i', { class: 'bi bi-unlock-fill' }) ]),
        el('h3', { text: 'No sign-up, ever' }),
        el('p', { text: 'Open every tool and start using it immediately. No accounts, no paywalls, no rate limits.' })
      ]),
      el('div', { class: 'about-feature-card' }, [
        el('div', { class: 'about-feature-icon' }, [ el('i', { class: 'bi bi-code-slash' }) ]),
        el('h3', { text: 'Open source' }),
        el('p', { text: 'The full source is free to read, fork, and extend. Contributions and new tool ideas are always welcome.' })
      ])
    ]));

    v.appendChild(el('div', { class: 'tool-card-panel' }, [
      el('h2', { style: 'font-size:var(--fs-lg);margin-bottom:var(--sp-3)', text: 'What is SDE Utils?' }),
      el('p', { html:
        'SDE Utils is a curated collection of <strong>' + escapeHtml(String(count)) +
        '+ developer tools</strong> — formatters, converters, generators, and niche utilities every engineer reaches for during the day. Every one of them runs <strong>entirely in your browser</strong>.' }),
      el('p', { class: 'info-box', html:
        '<strong>Privacy-first:</strong> every tool processes your input locally. Your data never touches a network request, so it\'s safe to paste in real tokens, keys, or production data while debugging.' }),
      el('p', { html: 'Built with plain HTML, CSS &amp; JavaScript + Bootstrap. Open source and free forever.' }),
      categories.length ? el('div', { style: 'margin-top:var(--sp-4)' }, [
        el('p', { style: 'font-weight:var(--fw-medium);margin-bottom:var(--sp-2)', text: 'Browse by category:' }),
        el('div', { class: 'about-category-pills' },
          categories.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((c) =>
            el('span', { class: 'about-category-pill' }, [
              el('i', { class: 'bi ' + (c.icon || 'bi-tag') }),
              document.createTextNode(c.name)
            ])
          )
        )
      ]) : null
    ]));

    v.appendChild(el('p', { class: 'about-credit' }, [
      document.createTextNode('Crafted with '),
      el('i', { class: 'bi bi-heart-fill', style: 'color:var(--info)' }),
      document.createTextNode(' by an DevOps/SRE Engineer.')
    ]));
    mount(v);
    T.sidebar && T.sidebar.setActive && T.sidebar.setActive('');
  }

  /** Generic empty/error state. */
  function renderEmpty({ icon, title, message, actionLabel, actionHref }) {
    const v = view('view-empty');
    const children = [
      el('i', { class: 'bi ' + icon }),
      el('h2', { text: title }),
      el('p', { text: message })
    ];
    if (actionLabel) {
      children.push(el('a', { class: 'btn-sde-utils btn-sde-utils-primary', href: actionHref || '#/' },
        [actionLabel]));
    }
    v.appendChild(el('div', { class: 'empty-state' }, children));
    mount(v);
  }

  function render404(id) {
    renderEmpty({
      icon: 'bi-compass',
      title: 'Tool not found',
      message: '“' + id + '” doesn’t match any tool. It may have been renamed or removed.',
      actionLabel: 'Back to dashboard',
      actionHref: '#/'
    });
  }

  function renderComingSoon(tool) {
    const v = view('view-soon');
    v.appendChild(el('div', { class: 'tool-header' }, [
      el('div', { class: 'tool-header-icon' }, [ el('i', { class: 'bi ' + (tool.icon || 'bi-tools') }) ]),
      el('div', { class: 'tool-header-text' }, [
        el('h1', { text: tool.name }),
        el('p', { text: tool.desc || '' })
      ])
    ]));
    v.appendChild(el('div', { class: 'empty-state' }, [
      el('i', { class: 'bi bi-cone-striped' }),
      el('h2', { text: 'Coming soon' }),
      el('p', { text: 'This tool is on the roadmap and being crafted with care. Check back shortly!' }),
      el('a', { class: 'btn-sde-utils btn-sde-utils-ghost', href: '#/' }, ['Browse other tools'])
    ]));
    mount(v);
    T.sidebar && T.sidebar.setActive && T.sidebar.setActive(tool.id);
  }

  function renderLoading(tool) {
    const v = view('view-loading');
    v.appendChild(el('div', { class: 'empty-state' }, [
      el('i', { class: 'bi bi-arrow-repeat', style: 'animation:spin 1s linear infinite' }),
      el('p', { text: 'Loading ' + tool.name + '…' })
    ]));
    mount(v);
  }

  /* ----------------------------------------------------------------------
     Tool loading
     ---------------------------------------------------------------------- */
  async function loadTool(tool) {
    renderLoading(tool);
    try {
      let html = htmlCache[tool.id];
      if (html === undefined) {
        const res = await fetch(TOOL_PATH(tool.id), { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        html = await res.text();
        htmlCache[tool.id] = html;
      }
      injectTool(tool, html);
    } catch (e) {
      console.warn('[router] tool markup missing for', tool.id, e);
      // Graceful fallback: treat as coming soon if the file isn't there yet
      renderComingSoon(tool);
    }
  }

  /**
   * Inject a tool's HTML into a fresh view, re-execute any inline <script>
   * (innerHTML-injected scripts don't run), then call its init hook.
   */
  function injectTool(tool, html) {
    const v = view('view-tool');
    const wrap = el('div', { class: 'tool-view', dataset: { toolId: tool.id } });
    wrap.innerHTML = html;

    // Re-create scripts so they actually execute
    T.$$('script', wrap).forEach((old) => {
      const s = document.createElement('script');
      Array.prototype.forEach.call(old.attributes, (a) =>
        s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    });

    v.appendChild(wrap);
    mount(v);

    // Call the tool's registered init (if any)
    const initFn = window.SDEUtilsTools[tool.id];
    if (typeof initFn === 'function') {
      try { initFn(wrap, tool, T); }
      catch (err) {
        console.error('[router] init failed for', tool.id, err);
        T.toast('This tool failed to load properly. Try refreshing the page.', 'error');
      }
    }

    // Book-keeping
    T.sidebar && T.sidebar.setActive && T.sidebar.setActive(tool.id);
    T.sidebar && T.sidebar.pushRecent && T.sidebar.pushRecent(tool.id);
    document.title = tool.name + ' — SDE Utils';
  }

  /* ----------------------------------------------------------------------
     Route dispatch
     ---------------------------------------------------------------------- */
  function route() {
    if (!registryReady) { pendingRoute = true; return; }
    const r = parseHash();

    if (r.name === 'dashboard') { document.title = 'SDE Utils — Developer Tools'; return renderDashboard(); }
    if (r.name === 'about')     { document.title = 'About — SDE Utils'; return renderAbout(); }

    const tool = T.registry && T.registry.byId(r.id);
    if (!tool) return render404(r.id);
    if (tool.status === 'soon') return renderComingSoon(tool);
    return loadTool(tool);
  }

  /* ----------------------------------------------------------------------
     Command palette (Ctrl / ⌘ + K)
     ---------------------------------------------------------------------- */
  const palette = {
    node: null,
    input: null,
    listEl: null,
    items: [],
    active: 0,

    build() {
      if (this.node) return;
      const overlay = el('div', { class: 'palette-overlay', id: 'paletteOverlay' }, [
        el('div', { class: 'palette', role: 'dialog', 'aria-label': 'Command palette' }, [
          el('div', { class: 'palette-search' }, [
            el('i', { class: 'bi bi-search' }),
            el('input', { type: 'text', id: 'paletteInput',
              placeholder: 'Jump to a tool…', autocomplete: 'off' })
          ]),
          el('ul', { class: 'palette-list', id: 'paletteList' })
        ])
      ]);
      document.body.appendChild(overlay);
      this.node = overlay;
      this.input = $('#paletteInput', overlay);
      this.listEl = $('#paletteList', overlay);

      on(overlay, 'click', (e) => { if (e.target === overlay) this.close(); });
      on(this.input, 'input', () => this.filter(this.input.value));
      on(this.input, 'keydown', (e) => this.onKey(e));
    },

    open() {
      this.build();
      this.node.classList.add('is-open');
      this.input.value = '';
      this.filter('');
      setTimeout(() => this.input.focus(), 20);
    },

    close() {
      if (this.node) this.node.classList.remove('is-open');
    },

    filter(q) {
      const query = q.trim().toLowerCase();
      const tools = (T.registry && T.registry.tools) || [];
      this.items = tools.filter((t) =>
        !query || t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      ).slice(0, 12);
      this.active = 0;
      this.renderList();
    },

    renderList() {
      this.listEl.innerHTML = '';
      if (!this.items.length) {
        this.listEl.appendChild(el('li', { class: 'palette-empty', text: 'No matches' }));
        return;
      }
      this.items.forEach((tool, i) => {
        const li = el('li', {
          class: 'palette-item' + (i === this.active ? ' is-active' : ''),
          dataset: { toolId: tool.id },
          onclick: () => this.choose(i)
        }, [
          el('i', { class: 'bi ' + (tool.icon || 'bi-tools') }),
          el('span', { class: 'palette-item-name', text: tool.name }),
          el('span', { class: 'palette-item-cat', text: tool.category })
        ]);
        this.listEl.appendChild(li);
      });
    },

    onKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); this.move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); this.choose(this.active); }
      else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    },

    move(delta) {
      if (!this.items.length) return;
      this.active = (this.active + delta + this.items.length) % this.items.length;
      this.renderList();
      const activeEl = $('.palette-item.is-active', this.listEl);
      activeEl && activeEl.scrollIntoView({ block: 'nearest' });
    },

    choose(i) {
      const tool = this.items[i];
      if (!tool) return;
      this.close();
      location.hash = '#/' + tool.id;
    }
  };

  /* ----------------------------------------------------------------------
     Init
     ---------------------------------------------------------------------- */
  function init() {
    // Route on hash change
    window.addEventListener('hashchange', route);

    // Dashboard grid needs the sidebar renderer; re-run it when asked
    window.addEventListener('sde-utils:renderdashboard', () => {
      T.sidebar && T.sidebar.refresh && T.sidebar.refresh();
    });

    // Command palette triggers
    on(document, 'keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        palette.open();
      }
    });
    on(document, 'click', '#openPalette', () => palette.open());

    // When the registry is ready, do the first route (or the pending one)
    if (T.registry) { registryReady = true; route(); }
    window.addEventListener('sde-utils:registryready', () => {
      registryReady = true;
      route();
    });
  }

  /* ----------------------------------------------------------------------
     Public API
     ---------------------------------------------------------------------- */
  T.router = {
    go: (id) => { location.hash = '#/' + id; },
    reload: route,
    openPalette: () => palette.open()
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
