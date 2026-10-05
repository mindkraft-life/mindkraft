# CLAUDE.md

## Documentation vault (`vault/`)

`vault/` is an Obsidian documentation vault that maps the whole Mindkraft app. It is documentation, not app code: nothing in the app imports from it, it is excluded from the GitHub Pages site by `_config.yml`, and it is never cached by the service worker or read by any test, lint or build step.

Rules for every change:
- **After ANY app change, update the affected vault notes in the same commit** (and their `last_verified` date). Use `vault/00 Start Here/Home.md`, `Function Index.md` or grep to find them; add, rename or remove rows in `Function Index.md` for functions you add, rename or delete.
- **Add a dated line to `vault/00 Start Here/Vault Log.md`** (newest first) describing what changed in the vault.
- **Keep every link resolving.** Run `node vault/.tools/check-vault.mjs` before committing; it must report 0 unresolved links, 0 template/source problems and 0 unknown function names. Never add a stub or placeholder note — write the full note or mention the thing as plain text.
- Read `vault/00 Start Here/App At A Glance.md` and `Change Impact Guide.md` before planning a change; grep the code before trusting any detail in a note.
