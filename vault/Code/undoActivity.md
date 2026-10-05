---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# undoActivity

> [!summary] In plain words
> The action behind un-ticking. It removes today's last tick of an activity and takes back what that tick gave: points, Grit, streak progress and quest progress. One known gap: a Focus Window bonus is not taken back (see the [[Change Impact Guide]]).
>
> **How it connects:** Explained in [[Activity Completion]] and guarded by the [[Grit Clawback Test]].

**In one line:** `window.undoActivity(dimIndex, pathIndex, actIndex)` removes today's most recent real completion of an activity and reverses exactly what that entry recorded — XP, Grit drip, streak grant, cycle count, quest progress and dimension XP — then wrapped by the planner, Versus and Modes.

## How it works
- Requires a non-penalty completion today (or `isCompletedToday`).
- Reads XP from the last user entry, calls `gritOnRemoval(activity, entry)` before splicing it out (penalty entries are skipped, not popped).
- Rewinds `lastCompleted` / `skipPenaltyWindow` to the previous completion; reverts today's streak +1 if no completion remains today; never touches `shieldsConsumed`.
- Perform-negative activities restore `_lastActualXpDeducted` exactly; positive ones subtract with level-down.
- `undoQuestProgress`, `applyDimXP(-xp)`, `updateDashboard`, `showUndoToast`, `debouncedSaveUserData`.
- Wrappers: planner reconcile → `vsOnUndo` → `modesOnUndo`.

## Key functions
- `undoActivity`, `gritOnRemoval`, `undoQuestProgress`, `applyDimXP`, `undoActivityById`, `modesOnUndo`, `vsOnUndo`.

## Data it touches
- [[users]], [[versusChallenges]], [[pacts]], [[gritLedger]]

## Connected to
- [[Activity Completion]], [[completeActivity]], [[Hook Chains]], [[Grit Currency]], [[Grit Clawback Test]]

## If you change this
- Reversal must read what the entry recorded, never recompute it.
- Mode bonuses are reversed per mode in `modesOnUndo`; Focus Window has no branch there, so its bonus XP is not taken back.

## Where in the code
- app.js — `window.undoActivity` right after `window.completeActivity`.
