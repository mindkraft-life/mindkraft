---
type: test
sources: [test/payout/payout.test.mjs, test/payout/hooks.js, test/payout/README.md]
last_verified: 2026-10-05
---
# Payout Browser Test

> [!summary] In plain words
> Checks the rules for the weekly Grit bonus, shield limits, quest progress when past days are fixed, extra points from modes appearing in the history, and that every week starts on Monday.
>
> **How it connects:** Guards the [[Grit Weekly Payout]], [[Grit Shop]], [[Retroactive History Editing]] and [[Dates Days And Weeks]].

**In one line:** test/payout/payout.test.mjs (119 checks) pins the nine sections of the Grit payout redesign: the absolute weekly bonus curve and its once-per-day-per-activity cap, quest progress on retroactive edits, the shield cap counting shields held, confirm-before-apply for shields, mode XP in weekly figures, mode/quest XP in Activity History, and Monday-anchored weeks and fortnights.

## How it works
- Uses [[Browser Test Harness]] with `hooks.js` exposing both weekly curves, the day tally, shield numbers and the mode XP ledger.
- §1–2: seven anchors exact, interpolation, flattening, ratio + absolute summed into one payout everywhere; one count per activity per day toward the absolute bonus only.
- §3: retro add/delete moves linked quest leaves; capped at required count; penalty deletes never decrement.
- §4–5: held-vs-capacity shield cap across eight shapes; declining the confirm changes nothing.
- §6–7: `xpTodayGhost` read by weekly windows; retention no longer drops yesterday; mode and quest XP rows in history without delete buttons.
- §8–9: Monday weeks; biweekly anchor 6 Jan 2025 shared by `getCycleWindowStart` and `isCompletedToday`.

## Key functions
- Exercises `gritWeekPayout`, `gritAbsBonus`, `gritCurve`, `gritBumpNumerator`, `retroactiveComplete`, `retroactiveDelete`, `updateQuestProgress`, `gritApplyShield`, `shieldsHeldNow`, `renderActivityHistory`, `ghostXPBetween`, `getCycleWindowStart`, `isCompletedToday`.

## Data it touches
- Stubbed [[users]], [[gritLedger]]

## Connected to
- [[Grit Weekly Payout]], [[Grit Shop]], [[Streaks And Shields]], [[Retroactive History Editing]], [[Quests]], [[Activity History Log]], [[Analytics Page]], [[Dates Days And Weeks]], [[Activity Frequencies And Cycles]]

## If you change this
- Curve anchors and the Monday/biweekly anchors are asserted literally.

## Where in the code
- test/payout/payout.test.mjs, test/payout/hooks.js.
