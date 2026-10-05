---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# completeActivity

**In one line:** `window.completeActivity(dimIndex, pathIndex, actIndex)` logs one completion of an activity — XP with streak multiplier and boosts, streak grant, history entry, Grit drip, gifted boost, dimension XP, quest progress, level-ups, optional self-delete, toast and save — and is wrapped four times by the planner, Map, Versus and Modes.

## How it works
- Base body: guards → `predictCompletionXP` → streak/`streakGrantedDate`/`streakStartWindow` → `lastCompleted`, `skipPenaltyWindow`, custom `cycleHistory` → `streak`, `bestStreak`, milestone shield capacity → counters → `recordCompletion` → `gritOnCompletion` → `giftOnCompletion` → `applyDimXP` → `updateQuestProgress` → user XP and level loop (with an early-return branch on level-up) → `deleteOnComplete` splice → `updateDashboard`, `showXPToast`, `debouncedSaveUserData`.
- Wrapper order (outermost last): Daily Planner reconcile → Tech Tree `evaluateTechTreeMastery` → Versus `vsOnCompletion` → Modes `modesOnCompletion`.
- Called via `completeActivityById`, card/grid buttons, `searchCompleteActivity`, `modeMark`, planner slots and quest leaf taps.

## Key functions
- `completeActivity`, `predictCompletionXP`, `recordCompletion`, `gritOnCompletion`, `giftOnCompletion`, `applyDimXP`, `updateQuestProgress`, `showLevelUpAnimation`, `prebuildLevelUpCard`, `completeActivityById`.

## Data it touches
- [[users]], [[gifts]], [[versusChallenges]], [[pacts]], [[gritLedger]]

## Connected to
- [[Activity Completion]], [[Hook Chains]], [[predictCompletionXP]], [[recordCompletion]], [[gritOnCompletion]], [[updateQuestProgress]], [[modesOnCompletion]], [[evaluateTechTreeMastery]], [[undoActivity]], [[updateDashboard]]

## If you change this
- Keep the level-up early return and the normal tail in sync (both splice `deleteOnComplete` activities and save).
- Wrappers rely on `completionCount` increasing to know a completion landed.

## Where in the code
- app.js — `window.completeActivity` after `predictCompletionXP`; wrappers in the planner hooks, Tech Tree hooks, Versus hooks and Modes WIRING.
