---
type: feature
sources: [app.js, test/techtree/README.md]
last_verified: 2026-10-05
---
# Map Reveal Loop

> [!summary] In plain words
> Most of the Map starts dark — you can see its shape but not what each part is. Spending Grit uncovers one part at a time, working outwards from what you already know. Uncovering only tells you what a part is; to actually take it on you still have to master what comes before it. Once a month you can pay to rebuild the whole web.
>
> **How it connects:** Part of the [[Tech Tree Map]], paid with [[Grit Currency]], and checked by the [[Tech Tree Reveal Test]].

**In one line:** In Tech Tree v5 most Map nodes start as dark silhouettes; spending 40 Grit reveals a node's title and details once everything before it is revealed, adopting still requires mastering its prerequisite, and the whole web can be regenerated for 300 Grit at most once a month after at least one new mastery.

## How it works
- "Grit buys information. Mastery buys access." `revealed` is separate from `lifecycle`.
- Born revealed: nodes with no prerequisites (anchors and wildcards) under `TT_FREE_TIER_RULE = 'no-prerequisites'` (`ttIsFreeTier`); a one-time generous migration (`ttEnsureRevealFields`, marked by `revealMigratedAt`).
- Reveal: `ttOpenRevealSheet` → `ttConfirmReveal`; allowed only when every ancestor is revealed (`ttRevealBlockers`, archived ancestors are transparent); cost `TT_REVEAL_COST` = 40 (or `node.revealCost`); persisted before granting.
- Silhouettes leak nothing in either view (`ttSilhouettePreview`).
- Regeneration: `ttRegenStatus` (30-day clock, `TT_REGEN_MASTERIES` = 1 mastery since last regen, 300 Grit) → `ttOpenRegenSheet` → `ttConfirmRegen` (weave first, charge after).
- Views: `ttViewMode` / `ttSetView` (Sky vs Branch), dark-node strip (`ttDarkStripHtml`), branch filter by goal (`ttBranchFilter`, `ttBranchHtml`, `ttBranchRow`).

## Key functions
- `ttIsFreeTier`, `ttEnsureRevealFields`, `ttSyncMasteryGate`, `ttRevealState`, `ttIsSilhouette`, `ttRevealBlockers`, `ttRevealable`, `ttRevealCost`, `ttDarkCount`, `ttOpenRevealSheet`, `ttConfirmReveal`, `ttSilhouettePreview`, `ttRegenStatus`, `ttOpenRegenSheet`, `ttConfirmRegen`, `ttViewMode`, `ttSetView`, `ttBranchHtml`, `ttBranchRow`, `ttRepointChildrenOf`.

## Data it touches
- [[users]] (`techTree` nodes' `revealed`, `lastRegenAt`, `masteriesSinceRegen`, `revealMigratedAt`, `viewMode`; `grit`), [[gritLedger]]

## Connected to
- [[Tech Tree Map]], [[Map Weaving]], [[Grit Currency]], [[Map Page]], [[Tech Tree Reveal Test]], [[weaveWeb]]

## If you change this
- Reveal state lives inside `userData.techTree`, which is safe only because the client is its only writer; a server-side reveal would have to move to a subcollection.
- The regen gate is derived from activities' own mastery timestamps (`ttSyncMasteryGate`) so it cannot drift from a counter.

## Where in the code
- app.js — "TECH TREE v5 — THE REVEAL LOOP" section (after the Grit section, before Versus).
