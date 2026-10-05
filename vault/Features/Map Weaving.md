---
type: feature
sources: [app.js, functions/index.js, functions/lib/web-weaver.js]
last_verified: 2026-10-05
---
# Map Weaving

**In one line:** "Weave my web" is the client side of Map generation: the user types goals, the client calls the `weaveWeb` Cloud Function (generate, add a goal, reweave one goal, or expand), merges the returned `techTree` patch, charges any Grit price, and saves.

## How it works
- Goals are entered in the intro screen or added later (`ttAddGoalField`, `ttCollectGoalFields`, `ttAddGoal` → `_ttAddGoalConfirm`); max 5 goals.
- `ttWeave(payload, opts)` → `ttCallWeave` (`httpsCallable('weaveWeb')` with `TT_CALL_TIMEOUT_MS`) with rotating captions while waiting (`ttStartWeaveCaptions`); errors via `ttWeaveError`; on success `ttApplyWeave` merges the patch and `ttSyncWeaveUsage` copies server usage (free reweaves left, `freeWeaveAt`) onto goals.
- Modes: `generate` (`ttRequestGenerate`, first web free), `add_goal`, `regenerate` (one goal: first 3 free, then one free per month, else `TT_GOAL_REGEN_COST` = 100 Grit — `ttGoalRegenState`, `ttRegenerateGoal`), `expand` (silent, after a node resolves or every 5 days).
- Whole-tree regeneration is part of the reveal loop ([[Map Reveal Loop]]).
- A failed weave costs nothing: Grit is charged only after the patch arrives.

## Key functions
- `ttWeave`, `ttCallWeave`, `ttApplyWeave`, `ttSyncWeaveUsage`, `ttWeaveError`, `ttStartWeaveCaptions`, `ttStopWeaveCaptions`, `ttRequestGenerate`, `ttAddGoal`, `_ttAddGoalConfirm`, `ttAddGoalField`, `ttGoalRowHtml`, `ttCollectGoalFields`, `ttGoalRegenState`, `ttRegenerateGoal`, `ttCooldownLeft`, `ttEditReadings`, `_ttReadConfirm`, `ttMaybeAutoGrow`.

## Data it touches
- [[users]] (`techTree`, `grit`), [[aiUsage]] (server)

## Connected to
- [[weaveWeb]], [[Tech Tree Map]], [[Map Reveal Loop]], [[Map Page]], [[Grit Currency]], [[Model Adapter]], [[Server Web Weaver Test]]

## If you change this
- The client timeout must cover the server's worst case (two attempts), or users lose a weave they paid for in time.
- Pricing shown here must match `goalRegenPricing` on the server, which decides what is free.

## Where in the code
- app.js — Map v3 "weave" block (`ttCallWeave` … `ttRetireGoal`).
