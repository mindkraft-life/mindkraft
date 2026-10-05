---
type: feature
sources: [app.js, test/modes/README.md]
last_verified: 2026-10-05
---
# Recovery Mode

> [!summary] In plain words
> For getting back on track after losing a streak. Up to three activities climb twice as fast — one extra step on each day you do them — until each one is back to its old best.
>
> **How it connects:** One of the [[Modes]]. It works alongside the daily streak check ([[Streaks And Shields]], [[Login-Time Processing]]).

**In one line:** Recovery Mode (15 Grit) makes up to three broken streaks climb twice as fast — one bonus step on each day the activity is logged — until each is back at the best streak it had when the mode started (at most one past it).

## How it works
- Ceiling per activity captured at activation from `bestStreak` (`recoveryCeilingFor`), stored in the mode, never on the activity.
- The first completion of a covered activity each day adds a bonus increment (`modesOnCompletion`, guarded by `lastBonusDay`); `bonus[activityId]` lives in the mode and is re-added after every login walk by `modesAfterStreakWalk` so the authoritative walk cannot erase it.
- No bonus once at the ceiling; undo takes the bonus back.
- Concludes when every covered streak is at its ceiling (`recoveryAllAtCeiling`, `modesRecoveryConclude`).

## Key functions
- `recoveryCeilingFor`, `recoveryEntry`, `recoveryAllAtCeiling`, `modesRecoveryConclude`, `recoveryRenderSetup`, `recoveryStart`, `recoveryPanelHtml`, `modesBeforeStreakWalk`, `modesAfterStreakWalk`.

## Data it touches
- [[users]] (`modes.active`, `modes.streakOffsets`, activity `streak`)

## Connected to
- [[Modes]], [[Streaks And Shields]], [[Login-Time Processing]], [[Modes Browser Test]]

## If you change this
- Never write the bonus onto the activity's streak fields directly — `processStreakSystem` re-derives them every login.

## Where in the code
- app.js — MODES "RECOVERY" block, "THE STREAK PASSES", `recoveryRenderSetup`.
