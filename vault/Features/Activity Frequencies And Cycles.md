---
type: feature
sources: [app.js]
last_verified: 2026-10-05
---
# Activity Frequencies And Cycles

> [!summary] In plain words
> Decides when an activity counts as "done for now" and when it resets: every day, every week (weeks start on Monday), every two weeks, every month, a set number of times on chosen weekdays or every few days, or "whenever" for one-off tasks.
>
> **How it connects:** Streaks ([[Streaks And Shields]]), missed-period penalties ([[Negative Activities And Skip Penalty]]) and the weekly Grit bonus ([[Grit Weekly Payout]]) all rely on these periods. The calendar rules behind them are in [[Dates Days And Weeks]].

**In one line:** Each activity's `frequency` — daily, weekly, biweekly, monthly, custom (N times per week on chosen days, or N times per K-day cycle) or occasional — decides when it counts as done, when it resets, and which window streaks and penalties are judged in.

## How it works
- `isCompletedToday(activity)` answers "done for this period?": daily/occasional → completed today; weekly → since Monday; biweekly → since the current fortnight start (anchored to Monday 6 Jan 2025); monthly → since the 1st; custom → `cycleCompletionsNow(activity) >= timesPerCycle`.
- Custom activities track completions in `cycleHistory`. `customSubtype: 'days'` uses a Monday week and only allows completion on `scheduledDays` (`isScheduledDay`); `customSubtype: 'cycle'` uses `customDays`-long windows counted from `createdAt`.
- `canCompleteActivity` / `canCompleteCustomToday` gate taps; `allowMultiplePerDay` lets non-occasional activities be logged several times a day (streak still counts once per window via `streakGrantedDate`).
- `getCycleWindowStart` / `getNextCycleWindowStart` give the window for any date (used by streaks, skip penalties, Grit quotas, mode day counters). `getStreakGraceDays` gives a per-frequency grace for perform-negative streak expiry.

## Key functions
- `isCompletedToday`, `cycleCompletionsNow`, `canCompleteActivity`, `canCompleteCustomToday`, `isScheduledDay`, `todayDOW`, `countCompletionsToday`, `getStreakGraceDays`, `getCycleWindowStart`, `getNextCycleWindowStart`, `toggleCustomDays`, `setCustomSubtype`, `toggleDayBtn`, `getSelectedDays`, `setSelectedDays`.

## Data it touches
- [[users]] (activity `frequency`, `customSubtype`, `customDays`, `scheduledDays`, `timesPerCycle`, `allowMultiplePerDay`, `cycleHistory`, `lastCompleted`)

## Connected to
- [[Activities]], [[Activity Completion]], [[Streaks And Shields]], [[Negative Activities And Skip Penalty]], [[Grit Weekly Payout]], [[Dates Days And Weeks]], [[getCycleWindowStart]], [[Payout Browser Test]]

## If you change this
- The window rules are duplicated in `isCompletedToday` and `getCycleWindowStart` (both read `BIWEEKLY_ANCHOR`); change both.
- `canCompleteActivity` has a dead branch: for non-custom activities both paths return `true` (the once-per-day block happens inside `completeActivity`).
- The server's Grit-like liveness rules (quest composer `lookbackDays`, weaver `masteryWindowFor`) are separate copies of frequency logic.

## Where in the code
- app.js — "Activity Completion Functions" helpers just before the Streak & Shield System; `getCycleWindowStart` after `processStreakPauses`; custom-day form helpers inside the activity modal code.
