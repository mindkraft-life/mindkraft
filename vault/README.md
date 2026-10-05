This folder is an Obsidian documentation vault. It is not part of the Mindkraft app, is never deployed, and nothing in the app imports from it.

# Mindkraft documentation vault

It maps every part of Mindkraft — what each feature does, which functions run it, what data it touches and what it connects to — so changes can be planned without re-reading the codebase. The code is always the final authority: grep it before trusting a detail here.

- Open this folder (`vault/`) as a vault in Obsidian, then start at [[Home]] or [[App At A Glance]].
- Before changing the app, read [[Change Impact Guide]]; [[How To Use This Vault]] explains the conventions.
- After any app change, update the affected notes in the same commit, add a dated line to [[Vault Log]], and run `node vault/.tools/check-vault.mjs` (unresolved links must be 0).

How it is kept out of the app:
- GitHub Pages serves the repository root; `_config.yml` excludes `vault` (and `CLAUDE.md`) from the published site.
- The service worker caches only its explicit `APP_SHELL` list; no test, lint or build step reads `vault/`.
- `.gitattributes` marks `vault/**` as documentation for GitHub's language stats; `.gitignore` drops Obsidian's per-device workspace and cache files.
