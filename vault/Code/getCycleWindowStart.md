---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# getCycleWindowStart

> [!summary] In plain words
> Answers the question "which period does this date belong to?" for an activity — that day, that Monday-to-Sunday week, that fortnight, that month, or that custom cycle.
>
> **How it connects:** Explained in [[Activity Frequencies And Cycles]] and [[Dates Days And Weeks]].

**In one line:** `getCycleWindowStart(activity, date)` returns local midnight at the start of the frequency window containing `date` — the day, the Monday week, the fortnight from 6 Jan 2025, the calendar month, or the custom cycle — or `null` for occasional activities; it defines "a window" for streaks, penalties, Grit and modes.

## How it works
- daily → that day; weekly → Monday of that week; biweekly → fortnight start from `BIWEEKLY_ANCHOR`; monthly → the 1st; custom `days` → Monday week; custom `cycle` → `customDays`-long windows from `createdAt`; occasional → `null`.
- `getNextCycleWindowStart(activity, windowStart)` steps to the following window.
- Used by `processStreakSystem`, `recomputeStreakFromHistory`, `processSkipPenalty`, `_getSkipPenaltyWindow`, `completeActivity` / `undoActivity` (penalty anchor), and mode helpers.

## Key functions
- `getCycleWindowStart`, `getNextCycleWindowStart`, `isCompletedToday` (duplicate rules), `toLocalDateStr`.

## Data it touches
- [[users]] (reads activity frequency fields)

## Connected to
- [[Activity Frequencies And Cycles]], [[Dates Days And Weeks]], [[processStreakSystem]], [[Negative Activities And Skip Penalty]], [[toLocalDateStr]]

## If you change this
- `isCompletedToday` carries its own copy of these rules; change both.

## Where in the code
- app.js — after `localToday` / `localYesterday`, before `processSkipPenalty`.
