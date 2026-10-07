---
type: backend
sources: [CNAME, firebase.json, _config.yml, sw.js, manifest.json, marketing/winter-arc/README.md]
last_verified: 2026-10-07
---
# Web Hosting

> [!summary] In plain words
> Where the app itself lives online: GitHub Pages publishes the app's files at mindkraft.life whenever the main branch of the project changes. This vault and the source files for marketing videos are deliberately kept out of what gets published.
>
> **How it connects:** Works with the [[Service Worker]] and [[PWA Install]]. The server helpers are published separately by the [[Deploy Pipeline]].

**In one line:** The Mindkraft web client (index.html, app.js, style.css, sw.js, manifest, icons, legal pages) is served as static files by GitHub Pages from the repository root at mindkraft.life — Firebase Hosting is not used — and `_config.yml` keeps the documentation vault, the marketing video sources and CLAUDE.md out of the published site.

## How it works
- `CNAME` = `mindkraft.life`; the GitHub repository has Pages enabled; firebase.json has no `hosting` block (only `firestore` indexes and `functions`).
- GitHub Pages builds the branch with Jekyll on every push to the published branch. Files without front matter are copied as-is, so the app ships byte-for-byte; every other repo file (functions/, test/, scripts/) is also publicly served.
- `_config.yml` restates GitHub Pages' default `exclude` list and adds `vault`, `marketing` and `CLAUDE.md`. A GitHub Pages build of the repo with and without that file produces an identical site apart from those entries.
- `marketing/` holds sources for marketing videos, not app code. `marketing/winter-arc` is the Winter Arc reel: a frame-rendered motion scene that links the app's own style.css and rebuilds app components from the app's markup, a synthesised score, and the build scripts (see its README). Nothing in the app imports it and the service worker never caches it.
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
- Renaming component classes in style.css (activity cards, the sticky header, analytics cards, the calendar, Activity History, the activity editor, toasts, the level-up card) also changes the Winter Arc scene in `marketing/winter-arc`, which renders real app markup with that stylesheet; re-render a few stills after such a change (`node tools/render.mjs stills` from that folder).

## Where in the code
- CNAME, _config.yml, firebase.json, manifest.json.
- marketing/winter-arc/ — marketing video sources (excluded from the site).
