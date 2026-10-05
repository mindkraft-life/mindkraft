This folder is an Obsidian documentation vault. It is not part of the Mindkraft app, is never deployed, and nothing in the app imports from it.

# Mindkraft documentation vault

> [!summary] In plain words
> This folder is a set of linked notes that describe the Mindkraft app, written so the app can be understood without reading any program code. Open the folder in the free Obsidian app, start at the Home page, and read the "In plain words" box at the top of any page to understand that part of the app. Everything below that box on each page is detail for the people (and the AI assistant) who build the app.
>
> **How it connects:** Start with [[Home]] for the full list of pages and [[App At A Glance]] for the big picture.

It maps every part of Mindkraft — what each feature does, which functions run it, what data it touches and what it connects to — so changes can be planned without re-reading the codebase. The code is always the final authority: grep it before trusting a detail here.

- Open this folder (`vault/`) as a vault in Obsidian, then start at [[Home]] or [[App At A Glance]].
- Before changing the app, read [[Change Impact Guide]]; [[How To Use This Vault]] explains the conventions.
- After any app change, update the affected notes (including their "In plain words" box) in the same commit, add a dated line to [[Vault Log]], and run `node vault/.tools/check-vault.mjs` (it must report no problems).

How it is kept out of the app:
- GitHub Pages serves the repository root; `_config.yml` excludes `vault` (and `CLAUDE.md`) from the published site.
- The service worker caches only its explicit `APP_SHELL` list; no test, lint or build step reads `vault/`.
- `.gitattributes` marks `vault/**` as documentation for GitHub's language stats; `.gitignore` drops Obsidian's per-device workspace and cache files.
