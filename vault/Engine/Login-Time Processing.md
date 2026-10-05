---
type: engine
sources: [app.js]
last_verified: 2026-10-05
---
# Login-Time Processing

**In one line:** Every time the app signs in, `processStreakPauses()` walks every activity to settle streaks, shields and skip penalties for the days the app was closed, then runs the Modes, Tech Tree and Grit catch-up passes, and saves once if anything changed.

## How it works
- Called from the auth handler (see [[App Boot Sequence]]) after `loadUserData`, and also on the offline-mode path.
- Order inside `processStreakPauses`:
  1. `modesBeforeStreakWalk()` — Modes snapshot the activities they protect (Recovery/Insurance).
  2. For each activity: `processStreakSystem(act, today)` (streak + shields, once per day via `lastProcessedDate`) and `processSkipPenalty(act, today)` (missed-window XP deductions, once per day via `lastSkipCheckDate`).
  3. `modesAfterStreakWalk()` — add mode-owned streak offsets back on top.
  4. `evaluateTechTreeMastery()` — resolve Map nodes whose activities reached mastery.
  5. `gritOnLogin()` — localStorage balance migration, week rollover + weekly bonus, streak/mastery Grit sweeps.
  6. One `saveUserData()` if anything reported a change.
- Separately, the auth handler then fires the social/mode login hooks: `vsOnLogin`, `giftOnLogin`, `frRequestsOnLogin`, `lbOnLogin`, `modesOnLogin`. `modesOnLogin` also re-runs on app foreground.
- Despite its name, `processStreakPauses` does not pause anything; it is the login pass.

## Key functions
- `processStreakPauses` — see [[processStreakPauses]].
- `processStreakSystem` — see [[processStreakSystem]].
- `processSkipPenalty` — see [[Negative Activities And Skip Penalty]].
- `modesBeforeStreakWalk`, `modesAfterStreakWalk` — see [[Recovery Mode]] and [[Insurance Mode]].
- `evaluateTechTreeMastery` — see [[evaluateTechTreeMastery]].
- `gritOnLogin` — see [[Grit Weekly Payout]].

## Data it touches
- [[users]] (activities' streak fields, `grit`, `modes`, `techTree`), [[gritLedger]]

## Connected to
- [[Streaks And Shields]], [[Negative Activities And Skip Penalty]], [[Modes]], [[Tech Tree Map]], [[Grit Currency]], [[Dates Days And Weeks]], [[Saving And The Write Invariant]]

## If you change this
- The once-per-day stamps (`lastProcessedDate`, `lastSkipCheckDate`) make the pass idempotent; tests re-arm them via hooks to simulate several days.
- Anything inserted between the streak walk and `modesAfterStreakWalk` sees streaks *without* mode offsets.
- Grit runs last on purpose so it reads settled streaks for its milestone sweeps.
- A user who never opens the app is never processed: penalties and streak breaks are applied lazily on the next open (skip penalties are capped at 7 windows).

## Where in the code
- app.js — `processStreakPauses` (just after `processStreakSystem`), `processSkipPenalty` (after the cycle-window helpers).
