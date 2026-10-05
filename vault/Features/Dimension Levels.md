---
type: feature
sources: [app.js]
last_verified: 2026-10-05
---
# Dimension Levels

**In one line:** Every dimension has its own level track that rises with the XP its activities earn — each dimension level needs half what a user level needs — with optional per-level dimension rewards and a "Dimension Progress" panel in Analytics.

## How it works
- `calculateDimXPForLevel(L) = max(1, round((k/2) × (2L − 1)))` with k = Level Scaling.
- Live updates: `applyDimXP(dim, ±xp)` on completion, undo and skip penalties; level-up shows a dimension reward overlay (`showDimRewardUnlock`) if one is set for the new level, else a toast (`showDimLevelUpToast`).
- Recompute: `recomputeDimXP(dim)` rebuilds `dimTotalXP` from history after retroactive edits; `applyLevelScaling` re-derives levels from `dimTotalXP`.
- Display: `renderDimProgress()` on the Analytics page; dimension rewards in the Profile.

## Key functions
- `calculateDimXPForLevel`, `initDim`, `applyDimXP`, `recomputeDimXP`, `showDimLevelUpToast`, `showDimRewardUnlock`, `dismissDimRewardOverlay`, `renderDimProgress`, `findDimForActivity`.

## Data it touches
- [[users]] (`dimensions[].dimLevel`, `dimXP`, `dimTotalXP`, `dimRewards`)

## Connected to
- [[Dimensions And Paths]], [[Level Rewards]], [[Activity Completion]], [[Retroactive History Editing]], [[Negative Activities And Skip Penalty]], [[Analytics Page]], [[XP And Levels]]

## If you change this
- The three code paths disagree: `applyDimXP` subtracts XP for perform-negative completions and skip penalties and has no level cap; `recomputeDimXP` (after any retro edit in that dimension) adds `Math.abs(xp)` of non-penalty entries and caps at 100; `applyLevelScaling` caps at 200. A retro edit can therefore jump a dimension's level (see [[Change Impact Guide]]).

## Where in the code
- app.js — dimension XP block after the reward overlay functions (`calculateDimXPForLevel`, `initDim`, `applyDimXP`); `recomputeDimXP` in the Retroactive Recalculation Engine; `renderDimProgress` at the start of the Analytics section.
