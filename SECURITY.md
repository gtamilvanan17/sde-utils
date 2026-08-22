# Security Policy

SDE Utils is a static, client-side toolbox — every tool runs in the
visitor's browser and nothing is sent to a server. That drastically limits
the attack surface, but a few classes of issue still matter:

- **XSS** via unsanitized `innerHTML` usage with user-supplied input in any
  `tools/*.html` file.
- **Supply-chain risk** from the CDN-loaded dependencies (Bootstrap, Bootstrap
  Icons, Google Fonts) in `index.html`.
- **Dockerfile / nginx misconfiguration** that could expose more than
  intended when self-hosted.

## Reporting a Vulnerability

Please **do not** open a public issue for security reports. Instead:

1. Use GitHub's [private vulnerability reporting](https://github.com/gtamilvanan17/sde-utils/security/advisories/new)
   for this repo (Security tab → "Report a vulnerability"), or
2. Email the maintainer listed in `.github/CODEOWNERS`.

Include the affected tool/file, a reproduction, and the impact you believe
it has. We aim to acknowledge reports within 5 business days.

## Supported Versions

This project doesn't maintain long-term release branches — only the latest
commit on `master` receives fixes.
