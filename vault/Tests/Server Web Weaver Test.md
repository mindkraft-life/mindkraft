---
type: test
sources: [functions/test/web-weaver.test.js, functions/lib/web-weaver.js]
last_verified: 2026-10-05
---
# Server Web Weaver Test

**In one line:** functions/test/web-weaver.test.js (34 tests) protects the Map weaver's server-side gates (what weaves are allowed and when reweaves are free) and its materializer (almost-right model JSON must shrink to a smaller valid web, never a broken one).

## How it works
- Gates: first generation needs a goal and three activities; retired goals don't count; the first weave is free and doesn't start the tree clock; three free reweaves per thread, then one free per month (not stacking), paying doesn't delay the next free one; old usage records get a free reweave; tree and goal clocks are independent; vanished goals refused; expansion needs a web.
- Materializer: unknown payloads dropped; out-of-range frequency/XP clamped; a generate response becomes anchors, a locked chain and a wildcard; unusable nodes dropped without losing the rest; invented activity ids never become anchors; fusions need two real sources in different dimensions; self-referential prerequisites dropped; already-mastered anchors born resolved; rolling-window mastery.
- Folding: regeneration keeps adopted, mastered or paid-for nodes; per-goal reweaves leave other goals alone; incoming anchors fold into existing ones; thread colours are kept and never shared; the vision changes only on a full generation; every node carries reveal state; prompts carry real ids and no retired goals; no revise mode.

## Key functions
- `gateFor`, `goalRegenPricing`, `materializeWeb`, `materializeExpansion`, `materializeWildcards`, `foldGeneration`, `enforceLoadBudget`, `enforceNodeCeiling`.

## Data it touches
- fixtures shaped like [[users]] (`techTree`) and [[aiUsage]]

## Connected to
- [[weaveWeb]], [[Map Weaving]], [[Tech Tree Map]], [[Tech Tree Reveal Test]], [[Test Suites Overview]]

## If you change this
- The client's displayed prices must match `goalRegenPricing`.

## Where in the code
- functions/test/web-weaver.test.js.
