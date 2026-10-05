---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Negative Activities And Skip Penalty

**In one line:** An activity can be "negative" in two ways — perform-negative (doing it costs XP, for habits you want to break) or skip-negative (doing it earns XP, and each missed window auto-deducts its base XP the next time the app opens, up to 7 windows at a time).

## How it works
- Set in the activity editor's advanced section: `negativeXpMode` = `perform` → `isNegative: true`; `skip` → `isSkipNegative: true`. `baseXP` stays positive either way.
- **Perform-negative:** `completeActivity` subtracts XP (levelling down if needed, never below level 1 / 0 XP; the actual amount is kept in `_lastActualXpDeducted` so undo restores it exactly), records a negative history entry and subtracts dimension XP. No shields; streak expires via grace days.
- **Skip-negative:** completing pays positive XP and resets `skipStreak`. At login `processSkipPenalty(activity, today)` walks closed windows after `skipPenaltyWindow`; each window with no completion is a miss; charges `baseXP × min(7, missed)` from user XP and the dimension, records an `isPenalty: true` history entry, bumps `skipStreak`, stamps `lastPenaltyDate`/`lastPenaltyDays`, and advances the anchor past every window walked so nothing is charged twice.
- Penalties appear in Activity History under "Auto-deductions" and can be deleted (restoring the XP) through the history editor.

## Key functions
- `processSkipPenalty`, `_getSkipPenaltyWindow`, `getStreakGraceDays`, `toggleNegativeXpSection`, `retroactiveDelete` (penalty removal).

## Data it touches
- [[users]] (activity `isNegative`, `isSkipNegative`, `negativeXpMode`, `skipStreak`, `skipPenaltyWindow`, `lastSkipCheckDate`, `lastPenaltyDate`, `lastPenaltyDays`, `completionHistory`; user XP; dimension XP)

## Connected to
- [[Login-Time Processing]], [[Activity Completion]], [[Activities]], [[Activity History Log]], [[Retroactive History Editing]], [[Dimension Levels]], [[Grit Currency]] (punitive activities earn no Grit drip)

## If you change this
- The penalty anchor migration (`skipPenaltyWindow` ← `lastSkipCheckDate` ← `lastCompleted`) prevents double charging for old accounts; keep the resolve-before-stamp order.
- Retroactively logging a perform-negative activity adds +baseXP instead of deducting it (see [[Change Impact Guide]]).

## Where in the code
- app.js — `processSkipPenalty` and `_getSkipPenaltyWindow`; negative handling inside `completeActivity` / `undoActivity`; editor UI `toggleNegativeXpSection`.
