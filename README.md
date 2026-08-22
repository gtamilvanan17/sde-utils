# SDE Utils

SDE Utils is a fast, private, browser-based developer toolbox. It brings common developer utilities into one clean web application so developers do not have to jump between many random websites for formatting, encoding, decoding, generating, validating, and inspecting data.

The long-term goal of SDE Utils is to provide more than 150 useful tools for developers, testers, DevOps engineers, students, technical writers, and API teams. The current registry contains 127 planned tools across 17 categories, with 66 tools already marked as ready and 61 tools marked as coming soon.

Tagline: Your complete developer toolkit.

## Live Link

[Link](gtamilvanan17.github.io/dev-tools/)

## What Is SDE Utils?

SDE Utils is a static web application built with HTML, CSS, and JavaScript. It runs directly in the browser and is designed around privacy-first utility work:

- Format, validate, convert, inspect, and generate developer data.
- Keep sensitive data local whenever possible.
- Provide quick access through search, sidebar navigation, favorites, recent tools, and a command palette.
- Work without a backend server or user account.
- Organize many small tools into a single developer-friendly interface.

SDE Utils is useful when you need a quick tool for JSON, text, encoding, JWTs, SQL, config files, colors, networking, DevOps references, diagrams, AI prompt utilities, and more.

## Problem Statements

Developers often lose time switching between many disconnected utility websites for small tasks such as formatting JSON, decoding JWTs, generating UUIDs, comparing text, or validating YAML.

Many online tools require users to paste sensitive content into third-party websites, creating privacy and security concerns for API tokens, credentials, logs, payloads, customer data, and internal configuration files.

Common developer utilities are often cluttered with ads, tracking scripts, slow pages, confusing layouts, or unnecessary signup flows.

Teams need a single, reliable, easy-to-extend toolkit where utilities are grouped logically and can be opened quickly.

Students and beginners need simple tools that explain common developer formats and workflows without forcing them to install heavy software.

SDE Utils solves these problems by providing a unified, lightweight, local-first developer toolbox with a growing catalog of 150+ planned tools.

## Key Features

- Browser-based static app with no backend required.
- Tool registry stored in `data/tools.json`.
- Individual tools live in `tools/<tool-id>.html`.
- Dynamic sidebar grouped by category.
- Category-wise grid of tool cards on the homepage, responsive across mobile, tablet, laptop, and desktop.
- Global search and sidebar filtering.
- Favorites and recently used tools.
- Hash-based routing for direct links to tools; opening any tool shows the left navigation sidebar with the tool's content on the right.
- Command palette with `Ctrl + K`.
- A calm, focused blue & white visual theme (light and dark mode), with no accent-color switcher.
- A revamped About page describing the project, its stats, and its guiding principles.
- Shared utility helpers for clipboard, download, storage, drag and drop, debounce, and toast messages.
- Toast notifications (success, error, warning, info) plus a global safety net that surfaces unexpected script errors as a toast instead of failing silently.
- Privacy-first design: tool input is processed in the browser.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Bootstrap Icons
- Google Fonts: Inter and JetBrains Mono

No framework, bundler, database, or backend server is required.

## Project Structure

```text
sde-utils/
  .github/
    workflows/          # CI, Docker build, Render PR previews, bots
    ISSUE_TEMPLATE/
    CODEOWNERS
    PULL_REQUEST_TEMPLATE.md
    labels.yml
    labeler.yml
    dependabot.yml
  assets/
    css/
      components.css
      palette.css
      style.css
      theme.css
      tools.css
    js/
      router.js
      sidebar.js
      theme.js
      utils.js
  data/
    tools.json
  deploy/
    nginx.conf.template
  tools/
    base64.html
    case-converter.html
    json-formatter.html
    ...
  Dockerfile
  render.yaml
  doc.html
  index.html
  json-escape.html
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  SECURITY.md
  README.md
```

## How To Run

Because the app fetches `data/tools.json`, run it through a local static server.

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

You can also use any static server, such as VS Code Live Server, `npx serve`, or a normal web hosting platform.

## Deployment

### Docker

A `Dockerfile` serves the site with nginx, listening on the `$PORT` env var
(defaults to `8080`) so the same image works on Render, Fly.io, Railway, or
plain Docker/Kubernetes.

```bash
docker build -t sde-utils .
docker run -p 8080:8080 -e PORT=8080 sde-utils
```

Open `http://localhost:8080`.

### Render (free tier)

This repo includes a [`render.yaml`](render.yaml) Blueprint:

1. On [Render](https://render.com), click **New → Blueprint** and connect
   this repository.
2. Render reads `render.yaml` and provisions a free Docker web service
   automatically (no manual config needed).
3. Free-tier services spin down after 15 minutes idle and cold-start
   (~30-60s) on the next request — that's expected on the free plan.

Every pull request also gets its own temporary Render preview
deployment — see [Continuous Integration & Bots](#continuous-integration--bots)
below.

## How To Use The Application

1. Open `index.html` through a local server.
2. Use the left sidebar to browse tool categories.
3. Use the global search box to find a tool quickly.
4. Press `Ctrl + K` to open the command palette.
5. Open a tool, paste or type input, and use the tool controls.
6. Mark frequently used tools as favorites.
7. Use `doc.html` for tool documentation and the full catalog.

## Current Status

- Current version: `0.1.0`
- Current registered tools: `127`
- Ready tools: `66`
- Coming soon tools: `61`
- Current categories: `17`
- Product goal: `150+` tools

## Tool Catalog

Status labels:

- `Ready`: implemented or available in the current project.
- `Coming soon`: planned in the registry and part of the roadmap.

### Text & String

| Tool | Status | What It Does |
| --- | --- | --- |
| Text Diff | Ready | Compares two text blocks and highlights differences. |
| Case Converter | Ready | Converts text to uppercase, lowercase, title case, camelCase, snake_case, and other case styles. |
| Remove Duplicate Lines | Ready | Removes repeated lines and keeps unique lines. |
| Remove Empty Lines | Ready | Deletes blank lines from a block of text. |
| Reverse Text | Ready | Reverses characters, words, or line order. |
| Sort Lines | Ready | Sorts lines alphabetically, numerically, or in reverse order. |
| Word Counter | Ready | Counts words, sentences, and reading time. |
| Character Counter | Ready | Counts characters, bytes, whitespace, and related text metrics. |
| Slug Generator | Ready | Converts text into clean URL slugs. |
| Random Text Generator | Ready | Generates random words, sentences, or placeholder text. |

### JSON

| Tool | Status | What It Does |
| --- | --- | --- |
| JSON Formatter | Ready | Pretty-prints and indents messy JSON. |
| JSON Validator | Ready | Validates JSON and identifies syntax errors. |
| JSON Escape / Unescape | Ready | Escapes and unescapes JSON strings for APIs, Postman, and config files. |
| JSON Pretty Print | Ready | Displays JSON in a readable indented format. |
| JSON Minify | Ready | Removes whitespace to reduce JSON payload size. |
| JSON Compare | Ready | Compares two JSON objects structurally. |
| JSON to CSV | Ready | Converts JSON arrays into CSV tables. |
| JSON to YAML | Ready | Converts JSON documents into YAML. |
| JSON Path | Ready | Queries JSON data using JSONPath expressions. |

### Data & Config

| Tool | Status | What It Does |
| --- | --- | --- |
| XML Formatter | Ready | Beautifies and validates XML documents. |
| YAML Validator | Ready | Validates YAML and reports indentation or syntax issues. |
| TOML Formatter | Ready | Formats and tidies TOML configuration files. |
| CSV Viewer | Ready | Displays CSV data in a clean sortable grid. |
| SQL Formatter | Ready | Beautifies SQL queries with readable indentation. |
| SQL Query Formatter | Ready | Formats SQL queries for multiple SQL dialects. |
| SQL to JSON | Ready | Converts SQL result-style data into JSON. |
| SQL Explain Visualizer | Ready | Visualizes SQL EXPLAIN query plans. |

### Encoding

| Tool | Status | What It Does |
| --- | --- | --- |
| Base64 | Ready | Encodes and decodes text and images as Base64. |
| URL Encode | Ready | Encodes and decodes URL components. |
| HTML Encode | Ready | Escapes and unescapes HTML entities. |
| Unicode | Ready | Inspects, escapes, and unescapes Unicode code points. |
| JWT Decoder | Ready | Decodes the header, payload, and signature of a JWT. |
| JWT Generator | Ready | Builds and signs JWTs with custom claims. |
| JWT Inspector | Ready | Inspects JWT claims, algorithms, and token structure. |
| JWT Expiry Calculator | Ready | Calculates JWT expiration time and remaining validity. |
| JWT Payload Editor | Ready | Edits a JWT payload and re-encodes it instantly. |

### Crypto & Keys

| Tool | Status | What It Does |
| --- | --- | --- |
| PEM Key Viewer | Ready | Inspects PEM certificates and key details. |
| SSH Key Generator | Ready | Generates SSH key pairs in the browser. |

### Hashing

| Tool | Status | What It Does |
| --- | --- | --- |
| MD5 | Coming soon | Computes MD5 digests for text or files. |
| SHA1 | Coming soon | Computes SHA-1 hashes. |
| SHA256 | Coming soon | Computes SHA-256 hashes. |
| SHA512 | Coming soon | Computes SHA-512 hashes. |
| CRC32 | Coming soon | Computes CRC32 checksums. |
| HMAC Generator | Coming soon | Generates keyed HMAC signatures. |

### Generators

| Tool | Status | What It Does |
| --- | --- | --- |
| UUID | Ready | Generates v4 UUIDs in bulk. |
| UUID Inspector | Ready | Decodes UUID version and variant information. |
| Nano ID | Ready | Generates compact URL-safe Nano IDs. |
| Password | Ready | Generates strong customizable passwords. |
| API Key | Ready | Generates secure random API keys. |
| Random Number | Ready | Generates random numbers within a selected range. |
| Fake User | Ready | Generates realistic fake user profiles for testing. |
| Lorem Ipsum | Ready | Generates classic placeholder text. |
| Color Palette | Ready | Generates harmonious color palettes. |
| .env Generator | Ready | Builds `.env` files from key/value pairs. |

### Web / CSS

| Tool | Status | What It Does |
| --- | --- | --- |
| HTML Formatter | Coming soon | Beautifies and indents HTML markup. |
| CSS Beautifier | Coming soon | Formats and tidies CSS code. |
| JS Beautifier | Coming soon | Beautifies minified or messy JavaScript. |
| CSS Minifier | Coming soon | Minifies CSS to reduce file size. |
| JS Minifier | Coming soon | Minifies JavaScript for production. |
| HTML Minifier | Coming soon | Compresses HTML markup. |
| CSS Grid Generator | Coming soon | Visually builds CSS grid layouts. |
| Flexbox Generator | Coming soon | Generates flexbox layouts visually. |
| GraphQL Query Beautifier | Coming soon | Formats and indents GraphQL queries. |
| CSS Variable Extractor | Coming soon | Extracts CSS custom properties from code. |
| CSS Clamp Generator | Coming soon | Builds fluid responsive `clamp()` values. |
| Tailwind Playground | Coming soon | Provides a live playground for Tailwind utility classes. |

### Colors

| Tool | Status | What It Does |
| --- | --- | --- |
| HEX to RGB | Ready | Converts between HEX, RGB, and HSL color formats. |
| Gradient Generator | Ready | Creates CSS linear and radial gradients. |
| Shadow Generator | Ready | Designs box-shadow values with a live preview. |
| Glassmorphism Generator | Ready | Generates frosted-glass CSS effects. |
| Neumorphism Generator | Ready | Generates soft neumorphic shadow styles. |
| Tailwind Color Picker | Ready | Helps pick and copy Tailwind palette colors. |
| Color Blindness Preview | Ready | Simulates color-blindness effects on palettes. |
| Accessibility Contrast Checker | Ready | Checks WCAG contrast ratios. |

### Markdown

| Tool | Status | What It Does |
| --- | --- | --- |
| Markdown Preview | Ready | Renders Markdown live as you type. |
| Markdown to HTML | Ready | Converts Markdown into clean HTML. |
| HTML to Markdown | Ready | Converts HTML back into Markdown. |

### Images

| Tool | Status | What It Does |
| --- | --- | --- |
| SVG Optimizer | Coming soon | Shrinks and cleans SVG source code. |
| SVG Preview | Coming soon | Previews raw SVG markup live. |
| Base64 Image | Coming soon | Encodes images into Base64 data URIs. |
| Image Resize | Coming soon | Resizes and compresses images client-side. |
| QR Generator | Coming soon | Generates QR codes from text or URLs. |
| QR Scanner | Coming soon | Scans QR codes using camera or upload. |
| Favicon Generator | Coming soon | Creates favicons in common required sizes. |
| SVG Sprite Generator | Coming soon | Combines SVGs into a single sprite sheet. |

### Date & Time

| Tool | Status | What It Does |
| --- | --- | --- |
| Unix Timestamp | Ready | Converts Unix time to human dates and human dates to Unix time. |
| Cron Generator | Ready | Builds cron expressions visually. |
| Cron Parser | Ready | Explains cron schedules in plain English and shows upcoming run times. |
| Time Zone Converter | Ready | Converts times across different time zones. |

### Regex

| Tool | Status | What It Does |
| --- | --- | --- |
| Regex Tester | Coming soon | Tests regular expressions with live match highlighting. |
| Regex Generator | Coming soon | Creates regex patterns from a described intent. |
| Regex Cheat Sheet | Coming soon | Provides a quick reference for regex syntax. |

### Networking

| Tool | Status | What It Does |
| --- | --- | --- |
| URL Parser | Coming soon | Breaks a URL into protocol, host, path, query, and hash parts. |
| HTTP Header Viewer | Coming soon | Inspects and explains HTTP headers. |
| MIME Finder | Coming soon | Looks up MIME types by file extension. |
| HTTP Status Lookup | Coming soon | Explains HTTP status codes. |
| Curl to Fetch Converter | Coming soon | Converts curl commands into JavaScript `fetch()` code. |
| Curl to Axios Converter | Coming soon | Converts curl commands into Axios request code. |
| API Response Viewer | Coming soon | Pretty-prints and explores API responses. |
| HTTP Request Builder | Coming soon | Composes and previews HTTP requests. |
| Cookie Parser | Coming soon | Parses and inspects cookie strings. |
| User Agent Analyzer | Coming soon | Breaks down User-Agent strings. |
| IP CIDR Calculator | Coming soon | Calculates subnets and IP ranges from CIDR notation. |
| IPv6 Helper | Coming soon | Expands, compresses, and validates IPv6 addresses. |

### DevOps

| Tool | Status | What It Does |
| --- | --- | --- |
| Docker Cheat Sheet | Coming soon | Provides essential Docker command references. |
| Git Cheat Sheet | Coming soon | Lists common Git commands and workflows. |
| Kubernetes Cheat Sheet | Coming soon | Provides common `kubectl` command references. |
| HTTP Status Codes | Coming soon | Provides a full HTTP status code reference. |
| Postman Environment Generator | Coming soon | Generates Postman environment JSON. |
| OpenAPI Viewer | Coming soon | Renders and browses OpenAPI or Swagger specs. |
| Kubernetes YAML Validator | Coming soon | Validates Kubernetes manifests. |
| Docker Compose Formatter | Coming soon | Formats and lints Docker Compose files. |
| Terraform Formatter | Coming soon | Formats HCL Terraform configuration. |
| Nginx Config Formatter | Coming soon | Beautifies Nginx configuration files. |
| Apache Config Formatter | Coming soon | Formats Apache HTTP server configuration. |
| Log Beautifier | Coming soon | Structures and colorizes raw log output. |
| Stack Trace Cleaner | Coming soon | Removes noise from stack traces. |
| Gitignore Generator | Coming soon | Builds `.gitignore` files from templates. |
| License Generator | Coming soon | Generates open-source license files. |
| Semantic Version Comparator | Coming soon | Compares and sorts semantic version numbers. |
| Changelog Generator | Coming soon | Generates changelogs from commits. |
| Commit Message Generator | Coming soon | Creates clean commit messages. |
| Conventional Commit Helper | Coming soon | Builds Conventional Commit messages interactively. |

### Diagrams

| Tool | Status | What It Does |
| --- | --- | --- |
| Mermaid Live Preview | Coming soon | Renders Mermaid diagrams live. |
| PlantUML Preview | Coming soon | Renders PlantUML diagrams live. |

### AI

| Tool | Status | What It Does |
| --- | --- | --- |
| AI Prompt Formatter | Coming soon | Structures and cleans up LLM prompts. |
| Prompt Token Estimator | Coming soon | Estimates token counts for prompts. |

## Applications And Use Cases

SDE Utils can be used for:

- API development: JSON formatting, JWT inspection, URL encoding, curl conversion, HTTP requests, and API response viewing.
- Backend development: SQL formatting, config validation, UUID generation, hashing, and environment file generation.
- Frontend development: CSS formatting, color conversion, gradients, shadows, accessibility contrast checks, and responsive value generation.
- DevOps work: Docker, Kubernetes, Terraform, Nginx, Apache, logs, stack traces, OpenAPI, and `.gitignore` helpers.
- Security-aware workflows: local JWT decoding, PEM inspection, SSH key generation, HMAC generation, and password generation.
- Documentation: Markdown preview, Markdown/HTML conversion, diagram previews, changelog generation, and commit message helpers.
- Testing and mock data: fake users, random numbers, API keys, Lorem Ipsum, random text, and QR codes.
- Learning: quick references for regex, Git, Docker, Kubernetes, HTTP status codes, MIME types, and common web formats.

## Adding A New Tool

1. Add the tool metadata to `data/tools.json`.
2. Create a new file in `tools/<tool-id>.html`.
3. Follow the existing tool page pattern.
4. Register the tool initializer with `window.SDEUtilsTools['tool-id']`.
5. Use shared helpers from `assets/js/utils.js` for clipboard, downloads, toasts, local storage, and drag-and-drop behavior.
6. Mark the tool as `ready` when it is implemented.

Example registry entry:

```json
{
  "id": "example-tool",
  "name": "Example Tool",
  "category": "text",
  "icon": "bi-tools",
  "desc": "Explains what the tool does.",
  "badges": [],
  "status": "soon"
}
```

## Continuous Integration & Bots

Everything under `.github/` is wired up so the project runs itself day to
day:

| Workflow | What it does |
| --- | --- |
| `ci.yml` | Syntax-checks every JS file, validates `data/tools.json`, and builds + smoke-tests the Docker image on every push/PR. |
| `pr-preview.yml` / `pr-preview-cleanup.yml` | Spins up a dedicated, temporary Render service per PR and comments the preview URL; destroys it when the PR closes. |
| `labeler.yml` + `.github/labeler.yml` | Auto-labels PRs by which paths they touch (`tool-content`, `ui`, `ci`, `docker`, `documentation`, ...). |
| `label-sync.yml` + `.github/labels.yml` | Keeps the repo's label set in sync with a single source-of-truth file. |
| `pr-title-lint.yml` | Enforces [Conventional Commit](https://www.conventionalcommits.org/) PR titles. |
| `stale.yml` | Marks inactive issues/PRs stale after 45 days, closes them 7 days later (exempt: `priority: high`, `status: blocked`). |
| `greetings.yml` | Welcomes first-time issue/PR authors. |
| `auto-assign.yml` | Assigns the PR author automatically for tracking. |
| `dependabot.yml` | Weekly PRs to bump GitHub Actions versions and the Docker base image. |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide (local dev, how
to add a new tool, PR conventions). Please also read the
[Code of Conduct](CODE_OF_CONDUCT.md). Security issues should go through
[SECURITY.md](SECURITY.md), not a public issue.

## Privacy

SDE Utils is designed to process data in the browser. For most tools, input is not sent to a server. This makes the app suitable for working with local snippets, API payloads, logs, tokens, and configuration data.

If a future tool needs network access, it should clearly explain that behavior before sending any data outside the browser.

## Roadmap

- Expand the catalog beyond 150 tools.
- Implement all tools currently marked as coming soon.
- Improve documentation for every tool.
- Add more import/export options.
- Add better accessibility coverage.
- Add offline/PWA support.
- Add automated tests for shared helpers and complex tools.
- Add deployment instructions for static hosting.

## Repository Setup Guide (Maintainers)

The workflows in `.github/` do most of the work, but a handful of things
can only be configured in the GitHub UI (or via `gh`/API) — not from a file
in the repo. Do these once after enabling this setup on
`github.com/gtamilvanan17/sde-utils`:

### 1. Add secrets (required for the Render PR-preview workflows)

Settings → Secrets and variables → Actions → **New repository secret**:

| Secret | Value |
| --- | --- |
| `RENDER_API_KEY` | Render dashboard → Account Settings → API Keys → Create API Key |
| `RENDER_OWNER_ID` | `curl -H "Authorization: Bearer <key>" https://api.render.com/v1/owners` → copy the `id` |

Without these, `pr-preview.yml` / `pr-preview-cleanup.yml` will fail — the
rest of CI (validation, Docker build) doesn't need any secrets.

Equivalent via the CLI:

```bash
gh secret set RENDER_API_KEY --body "rnd_xxx"
gh secret set RENDER_OWNER_ID --body "usr-xxx"
```

### 2. Sync labels once

The `label-sync.yml` workflow only triggers on pushes to `master` that touch
`.github/labels.yml`. To seed labels the first time (or after cloning this
setup into a fresh repo), trigger it manually:

```bash
gh workflow run "Sync labels"
```

### 3. Branch protection on `master`

Settings → Branches → **Add branch protection rule** → branch name pattern
`master`:

- [x] Require a pull request before merging
  - [x] Require approvals: **1**
  - [x] Require review from Code Owners (uses `.github/CODEOWNERS`)
  - [x] Dismiss stale approvals when new commits are pushed
- [x] Require status checks to pass before merging
  - Search and select: `Validate JS & tool registry`, `Docker build test`,
    `amannn/action-semantic-pull-request` (PR title lint)
  - [x] Require branches to be up to date before merging
- [x] Require conversation resolution before merging
- [x] Do not allow bypassing the above settings (include administrators)
- [ ] Allow force pushes — leave unchecked
- [ ] Allow deletions — leave unchecked

Equivalent via the CLI (adjust check names if you rename jobs):

```bash
gh api -X PUT repos/gtamilvanan17/sde-utils/branches/master/protection \
  -F required_status_checks[strict]=true \
  -F required_status_checks[contexts][]='Validate JS & tool registry' \
  -F required_status_checks[contexts][]='Docker build test' \
  -F enforce_admins=true \
  -F required_pull_request_reviews[required_approving_review_count]=1 \
  -F required_pull_request_reviews[require_code_owner_reviews]=true \
  -F restrictions=null
```

### 4. General repo settings worth enabling

Settings → General:

- **Pull Requests**: enable "Allow squash merging" only (keeps history
  linear and matches the Conventional Commit PR titles); enable
  "Automatically delete head branches" (keeps merged PR branches from
  piling up — the Render preview cleanup runs off `pull_request: closed`,
  which fires regardless of whether the branch is deleted).
- **Features**: enable Issues and Discussions; enable "Preserve this
  repository" is optional.

### 5. Topics & description (discoverability)

Add repo topics (gear icon next to "About" on the repo homepage): `developer-tools`,
`utilities`, `static-site`, `javascript`, `docker`, `render`. Set the
description and the live-site URL in the same panel.

### 6. Assignee/reviewer routing

`.github/CODEOWNERS` currently routes everything to a single maintainer.
As more maintainers join, split it by path (e.g. `/tools/colors-*.html @teammate`)
so review load spreads out — CODEOWNERS-based review requests only fire
once step 3's "Require review from Code Owners" is enabled.

## License

Apache 2.0 

## Author

SDE Utils is built for developers who want fast, clean, privacy-respecting tools in one place.
