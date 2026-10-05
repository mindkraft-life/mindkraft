# CLAUDE.md

## Documentation vault (`vault/`)

`vault/` is an Obsidian documentation vault that maps the whole Mindkraft app. It is documentation, not app code: nothing in the app imports from it, it is excluded from the GitHub Pages site by `_config.yml`, and it is never cached by the service worker or read by any test, lint or build step.

Rules for every change:
- **After ANY app change, update the affected vault notes in the same commit** (and their `last_verified` date). Use `vault/00 Start Here/Home.md`, `Function Index.md` or grep to find them; add, rename or remove rows in `Function Index.md` for functions you add, rename or delete.
- **Keep each page's "In plain words" box accurate.** It sits at the top of every vault page and is written for a non-technical reader: everyday language, no function, variable or database names, no backticks, and links only to plainly named pages. Update it whenever the thing it describes changes, and give every new page one.
- **Add a dated line to `vault/00 Start Here/Vault Log.md`** (newest first) describing what changed in the vault.
- **Keep every link resolving.** Run `node vault/.tools/check-vault.mjs` before committing; it must report 0 unresolved links, 0 template/source problems, 0 unknown function names and 0 plain-words box problems. Never add a stub or placeholder note — write the full note or mention the thing as plain text.
- Read `vault/00 Start Here/App At A Glance.md` and `Change Impact Guide.md` before planning a change; grep the code before trusting any detail in a note.
