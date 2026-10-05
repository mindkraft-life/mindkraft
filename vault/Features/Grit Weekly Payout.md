---
type: feature
sources: [app.js, test/payout/README.md]
last_verified: 2026-10-05
---
# Grit Weekly Payout

> [!summary] In plain words
> Every week, Monday to Sunday, the app works out how many ticks it expects from you based on the activities you are actively doing, counts what you actually did, and after the week ends pays a Grit bonus for how close you came plus a bonus for how much you did in total. Doing less than a fifth of what was expected pays nothing.
>
> **How it connects:** Paid the first time you open the app after Monday ([[Login-Time Processing]]). Progress is shown on the [[Rewards Page]]. The same weekly list also refills the "Active" routine ([[Routines]]).

**In one line:** Each Monday-to-Sunday week Mindkraft freezes a quota of expected completions from the user's live activities, counts completions against it, and on the next login after the week closes pays two summed curves — one on the completion ratio (30–100 Grit for 20%–130%, nothing below 20%) and one on absolute completions (up to 80 Grit at 85).

## How it works
- **Quota (denominator):** `gritBuildWeekQuota(anchor)` lists contributors — live activities (a completion within a frequency-shaped lookback, `gritIsLive` / `gritLookbackDays`) with quota units (`gritQuotaUnits`: daily 7, weekly 1, biweekly 0.5, monthly 7/30, custom cycle 7 × times ÷ days, custom day-pinned 1 per required completion, occasional 0). Frozen for the week.
- **Numerator:** `gritBumpNumerator` on every countable completion (and its reversal); a per-day tally (`gritDayKey`) counts each activity at most once per day toward the absolute curve only.
- **Payout:** `gritWeekPayout(week)` = `gritCurve(ratio)` (interpolated `GRIT_WEEKLY_CURVE`, ratio capped at 1.30) + `gritAbsBonus(week)` (interpolated `GRIT_ABS_CURVE`). `gritProjectedBonus` shows the running projection on the Rewards page.
- **Rollover:** `gritEnsureWeek()` → `gritEnsureWeekInner(g)`: when a Monday boundary has passed, reconciles only the last observed week (weeks away are not reconstructed), pays it once, builds the new quota (`gritNewWeek`) and resyncs the Active routine.
- Anchors use `gritWeekAnchorOf` (Monday, local).

## Key functions
- `gritEnsureWeek`, `gritEnsureWeekInner`, `gritNewWeek`, `gritBuildWeekQuota`, `gritQuotaUnits`, `gritIsLive`, `gritLookbackDays`, `gritReconcileContributors`, `gritBumpNumerator`, `gritDayKey`, `gritCurve`, `gritAbsCurve`, `gritAbsCompletions`, `gritAbsBonus`, `gritWeekPayout`, `gritWeekRatio`, `gritProjectedBonus`, `gritWeekAnchorOf`, `gritWeekAnchorStr`.

## Data it touches
- [[users]] (`grit.week`, activities' history), [[gritLedger]]

## Connected to
- [[Grit Currency]], [[Rewards Page]], [[Routines]], [[Activity Frequencies And Cycles]], [[Login-Time Processing]], [[Dates Days And Weeks]], [[Payout Browser Test]]

## If you change this
- Curves and anchors are pinned by the payout tests; the two components must always be summed into one number everywhere they are read.
- Quest composer's `activityMenu` reuses the same liveness idea server-side (separate copy).

## Where in the code
- app.js — GRIT section: "Dates", quota helpers, "The weekly quota engine (§3)", curves near the rate card.
