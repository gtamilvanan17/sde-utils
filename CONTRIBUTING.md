# Contributing to SDE Utils

Thanks for considering a contribution! This is a static, no-build-step
site (plain HTML/CSS/JS), so the barrier to entry is intentionally low.

## Ground rules

- Every tool must run **entirely client-side** — no network calls, no
  analytics, no telemetry. Users may paste real tokens/credentials into a
  tool; nothing may leave the browser.
- No build step, no bundler, no framework. Plain HTML/CSS/JS + Bootstrap.
- Reuse existing CSS classes/tokens (`assets/css/theme.css`,
  `components.css`, `tools.css`) instead of inventing new ones or
  hardcoding colors.

## Local development

```bash
python3 -m http.server 8080
# or, to test the exact production container:
docker build -t sde-utils . && docker run -p 8080:8080 -e PORT=8080 sde-utils
```

Then open `http://localhost:8080`.

## Adding a new tool

1. Add an entry to `data/tools.json` (id, name, category, icon, desc,
   badges, `"status": "soon"` until it's done).
2. Create `tools/<id>.html` following the pattern in any existing tool
   file — a `.tool-header` + one or more `.tool-card-panel` blocks, ending
   in a `<script>` that registers
   `window.SDEUtilsTools['<id>'] = function (root, tool, SDEUtils) { ... }`.
3. Use the shared helpers in `assets/js/utils.js`
   (`SDEUtils.$`, `.copy`, `.download`, `.toast`, `.debounce`, ...) instead
   of re-implementing them.
4. Flip `"status"` to `"ready"` once it works end-to-end.
5. Open a PR — CI validates `data/tools.json`, checks JS syntax, builds the
   Docker image, and a Render preview URL will be posted automatically.

## Pull requests

- PR titles follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat: add cron parser`, `fix: unicode tool crash on empty input`,
  `docs: update readme`) — a CI check enforces this.
- Fill out the PR template checklist.
- Keep PRs focused: one tool or one fix per PR is easier to review than a
  bundle of unrelated changes.
- A bot will auto-label your PR based on which paths it touches and assign
  you as the assignee for tracking.

## Reporting bugs / requesting tools

Use the issue templates (Bug report / Feature request) — they ask for the
minimum info needed to triage quickly.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).
