---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# processStreakPauses

**In one line:** `processStreakPauses()` is the login-time pass: Modes pre-walk, then for every activity the streak/shield walk and skip penalty, then the Modes post-walk, Map mastery evaluation and Grit login pass, followed by one save if anything changed — despite its name it pauses nothing.

## How it works
- `today = toLocalDateStr(new Date())`.
- `modesBeforeStreakWalk()` → per activity `processStreakSystem(act, today)` and `processSkipPenalty(act, today)` → `modesAfterStreakWalk()` → `evaluateTechTreeMastery()` → `gritOnLogin()` → `saveUserData()` if any step reported a change.
- Callers: the auth handler (signed-in and offline-mode paths), `restoreAutoBackup`, `importData` (not awaited there).

## Key functions
- `processStreakPauses`, `processStreakSystem`, `processSkipPenalty`, `modesBeforeStreakWalk`, `modesAfterStreakWalk`, `evaluateTechTreeMastery`, `gritOnLogin`.

## Data it touches
- [[users]], [[gritLedger]]

## Connected to
- [[Login-Time Processing]], [[processStreakSystem]], [[evaluateTechTreeMastery]], [[App Boot Sequence]], [[Grit Weekly Payout]], [[Modes]], [[Backup Export Import]]

## If you change this
- Ordering is semantic (mode offsets wrap the walk; Grit reads settled streaks).

## Where in the code
- app.js — immediately after `processStreakSystem`.
