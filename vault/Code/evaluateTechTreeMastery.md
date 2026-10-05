---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# evaluateTechTreeMastery

**In one line:** `evaluateTechTreeMastery()` is the Map's evaluation pass — it marks activities mastered, pays Grit mastery bonuses, archives orphaned nodes, resolves active nodes (paying XP by depth), recomputes locked/available, and triggers background expansion — run on login, after every completion, on render and after quest seals.

## How it works
- Activity mastery: `ttMasteryProgress` vs `techTreeMastery` → `techTreeMasteredAt` + toast.
- `gritCheckMastery()` (marker-guarded).
- `ensureTechTree()` (migration).
- Nodes: sync anchors' dimension, archive nodes whose activity is gone, adopt mastery thresholds, resolve active nodes whose payload activity is mastered (`ttAwardXP(ttNodeResolveBonus)`).
- Lifecycle: `ttNodeUnlocked` → `available` / `locked`.
- New resolutions → `ttWeave({mode: 'expand'})` silently; `ttMaybeAutoGrow`.
- Returns true if anything changed (callers save).
- Callers: `processStreakPauses`, Tech Tree `completeActivity` and `completeProjectCycle` wrappers, `renderTechTree`, Map actions (`ttDoLinkActivity`, `ttSaveMastery`, `ttApplyWeave`, `ttAddActivityToTree`, `ttDoAttachGoal`).

## Key functions
- `evaluateTechTreeMastery`, `ttMasteryProgress`, `ttPayloadResolves`, `ttAwardXP`, `ttNodeResolveBonus`, `ttNodeUnlocked`, `ttMaybeAutoGrow`, `gritCheckMastery`, `ensureTechTree`.

## Data it touches
- [[users]] (`techTree`, activity mastery fields, user XP, `grit`), [[gritLedger]]

## Connected to
- [[Tech Tree Map]], [[Map Weaving]], [[Grit Currency]], [[processStreakPauses]], [[completeActivity]], [[Tech Tree Reveal Test]]

## If you change this
- It runs on render, so it must stay idempotent and cheap; every payout inside it must be guarded.

## Where in the code
- app.js — Map v3 "The evaluation pass".
