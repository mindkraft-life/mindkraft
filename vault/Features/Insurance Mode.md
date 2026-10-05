---
type: feature
sources: [app.js, test/modes/README.md]
last_verified: 2026-10-05
---
# Insurance Mode

**In one line:** Insurance Mode protects up to three activities' streaks for a fixed term of one to three 30-day cycles (20, 35 or 50 Grit): while insured, a missed day never lowers the displayed streak and any shields the walk spent are handed back.

## How it works
- After each login walk, `modesAfterStreakWalk` sets `offset = max(0, previousDisplayed − freshlyWalkedBase)` in `modes.streakOffsets`, so displayed = max(previous, base); real completions still raise the streak.
- Consumed shields on insured activities are restored the same way.
- The credit outlives the mode until real history catches up; it is dropped once a gap after the cover ended outlasts the activity's shields.
- A check-in card appears every 30 days (`modesShowInsuranceCheckIn`); `insuranceFinish` ends the term.
- Pricing: `insuranceCostFor(cycles)`, `insuranceTermDays(cycles)`.

## Key functions
- `insuranceCostFor`, `insuranceTermDays`, `insuranceDaysOn`, `insuranceFinish`, `insuranceRenderSetup`, `insuranceStart`, `insurancePanelHtml`, `modesShowInsuranceCheckIn`, `modeMissedWindowsSince`, `modesBeforeStreakWalk`, `modesAfterStreakWalk`.

## Data it touches
- [[users]] (`modes.active`, `modes.streakOffsets`, activity streak/shield fields)

## Connected to
- [[Modes]], [[Streaks And Shields]], [[Login-Time Processing]], [[Modes Browser Test]]

## If you change this
- Like Recovery, it is strictly additive around `processStreakSystem`; it must never branch into the walk.

## Where in the code
- app.js — MODES "INSURANCE" block, "THE STREAK PASSES", `insuranceRenderSetup`.
