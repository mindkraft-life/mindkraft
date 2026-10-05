---
type: start
last_verified: 2026-10-05
---
# How To Use This Vault

**In one line:** How Jerry and Claude should read, navigate and keep this Obsidian vault current — it maps every part of Mindkraft so changes can be planned without re-reading the code, but the code is always the final authority.

## For Jerry
- **Open** the `vault/` folder as an Obsidian vault. Start at [[Home]] or [[App At A Glance]].
- **Graph view:** each folder has its own colour (Start Here gold, Pages blue, Features green, Engine purple, Data orange, Backend pink, Code teal, Tests grey). Big hubs: [[users]], [[Activity Completion]], [[Grit Currency]], [[Hook Chains]].
- **Local graph:** on any note, open the local graph and set depth to **2** — that is the blast radius of a change to that note's thing.
- **Backlinks:** the backlinks pane lists everything that depends on the current note; for Data notes it is "every feature that reads or writes this collection".
- **Search:** every note starts with "**In one line:**" — searching a word shows those one-liners as results.
- **Before changing something:** read its note's "If you change this" and the [[Change Impact Guide]].

## For Claude
1. Read [[App At A Glance]] and [[Change Impact Guide]] first.
2. Find the note for the thing being changed (use [[Home]], [[Glossary]] or [[Function Index]]), then follow its **Connected to** links two levels out.
3. **Grep the code before trusting any detail** — notes have no line numbers on purpose, and names in backticks are real identifiers to search for. If a note disagrees with the code, the code wins; fix the note.
4. **Keep the vault live:** in the same commit as any app change, update the affected notes (and their `last_verified`), update [[Function Index]] rows for added/renamed/removed functions, add a dated line to [[Vault Log]], and run `node vault/.tools/check-vault.mjs` — it must report 0 unresolved links, 0 template problems and 0 unknown function names.
5. Never put a placeholder note in the vault: write the full note or mention the thing as plain text.

## Note anatomy
Every note outside "00 Start Here" has front matter (`type`, `sources`, `last_verified`) and the sections **In one line**, How it works, Key functions, Data it touches, Connected to, If you change this, Where in the code.

## Folders
- `00 Start Here` — orientation, indexes, log.
- `Pages` — user-facing screens (names end in "Page").
- `Features` — features and systems.
- `Engine` — shared mechanics (saving, dates, hooks, login pass, rendering…).
- `Data` — one note per Firestore collection, named exactly like the collection.
- `Backend` — each Cloud Function plus deploy, rules, push, hosting.
- `Code` — the most connected hub functions, named exactly like the function.
- `Tests` — what each test file protects.
- `.tools` — the vault checker (documentation tooling; not part of the app).

Back to [[Home]].
