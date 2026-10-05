---
type: backend
sources: [CNAME, firebase.json, _config.yml, sw.js, manifest.json]
last_verified: 2026-10-05
---
# Web Hosting

**In one line:** The Mindkraft web client (index.html, app.js, style.css, sw.js, manifest, icons, legal pages) is served as static files by GitHub Pages from the repository root at mindkraft.life — Firebase Hosting is not used — and `_config.yml` keeps the documentation vault and CLAUDE.md out of the published site.

## How it works
- `CNAME` = `mindkraft.life`; the GitHub repository has Pages enabled; firebase.json has no `hosting` block (only `firestore` indexes and `functions`).
- GitHub Pages builds the branch with Jekyll on every push to the published branch. Files without front matter are copied as-is, so the app ships byte-for-byte; every other repo file (functions/, test/, scripts/) is also publicly served.
- `_config.yml` restates GitHub Pages' default `exclude` list and adds `vault` and `CLAUDE.md`. A GitHub Pages build of the repo with and without that file produces an identical site apart from those two entries.
- Cache busting is manual: [[Service Worker]] `CACHE_VERSION` must be bumped with each meaningful deploy.
- `manifest.json` scopes the PWA to `https://mindkraft.life/`; `APP_BASE_URL` in app.js hard-codes the same origin.

## Key functions
- none (static hosting).

## Data it touches
- none

## Connected to
- [[Service Worker]], [[Deploy Pipeline]], [[PWA Install]], [[Firebase Client]], [[Privacy Policy Page]], [[Terms Of Use Page]]

## If you change this
- Every file at the repo root is public on the site unless excluded; keep secrets out of the repo entirely.
- Setting `exclude` in `_config.yml` replaces the defaults — keep the restated defaults or `CNAME` and others start being published.
- A push to the Pages branch is a production deploy of the client; there is no CI gate for the browser tests.

## Where in the code
- CNAME, _config.yml, firebase.json, manifest.json.
