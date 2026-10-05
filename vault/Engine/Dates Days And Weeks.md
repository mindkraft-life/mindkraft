---
type: engine
sources: [app.js, functions/lib/schedule.js]
last_verified: 2026-10-05
---
# Dates Days And Weeks

**In one line:** All day logic in the Mindkraft client is local-time `YYYY-MM-DD` strings from `toLocalDateStr()`, every week starts on Monday, fortnights are anchored to Monday 6 January 2025, and only the server's reminder maths uses real IANA timezones.

## How it works
- `toLocalDateStr(d)` / `localToday()` / `localYesterday()` — local calendar dates. Never use `toISOString().slice(0,10)` (UTC), which is wrong east of UTC (the user base defaults to Asia/Kolkata).
- `mkDayKey(d)` / `mkTodayKey()` — integer `y*10000+m*100+d` keys for fast "same local day?" checks in hot loops.
- `localDateStr` (planner), `gritDayOf`, `modesToday`, `modeDayDiff`, `modeAddDays` — feature-local wrappers over the same local-date idea.
- **Cycle windows:** `getCycleWindowStart(activity, date)` and `getNextCycleWindowStart` define each frequency's window (daily = day, weekly = Monday-start week, biweekly = fortnight from `BIWEEKLY_ANCHOR = '2025-01-06T00:00:00'`, monthly = calendar month, custom = Monday week or N-day cycles from `createdAt`; occasional = none).
- `isCompletedToday` carries its own duplicate copy of the same window rules (deliberately, per the comments); both must move together.
- **Weeks:** Analytics, Grit (`gritWeekAnchorOf`), leaderboards (`lbClosedAnchorStr`, `getLeaderboardWeekStartStr`) and activity cycles all anchor on Monday.
- **Server:** functions/lib/schedule.js uses Luxon with IANA zones for reminder fire times; `getLocalDateString(timezone)` is the server's idempotency key.

## Key functions
- `toLocalDateStr` — see [[toLocalDateStr]].
- `getCycleWindowStart` — see [[getCycleWindowStart]].
- `localToday`, `localYesterday`, `mkDayKey`, `mkTodayKey`, `getNextCycleWindowStart`, `getWeekStartStr`, `getLeaderboardWeekStartStr`, `getISOWeekLabel`.

## Data it touches
- [[users]] (every stored date string)

## Connected to
- [[Activity Frequencies And Cycles]], [[Streaks And Shields]], [[Negative Activities And Skip Penalty]], [[Grit Weekly Payout]], [[Leaderboard Payouts]], [[Analytics Page]], [[Reminder Scheduling]], [[Payout Browser Test]]

## If you change this
- Window boundaries feed streaks, penalties, Grit quotas, mode day counters and the planner. A one-day shift breaks streaks for everyone on next login.
- Changing the biweekly anchor changes which fortnight every biweekly activity is in; both copies (`getCycleWindowStart`, `isCompletedToday`) read `BIWEEKLY_ANCHOR`.
- Some code still uses UTC slices (e.g. the active-day set in the friends tab uses `e.date.slice(0, 10)`), so "days" there can differ from local days near midnight.

## Where in the code
- app.js — `mkDayKey`/`mkTodayKey` and `BIWEEKLY_ANCHOR` near `isCompletedToday`; `toLocalDateStr`, `localToday`, `localYesterday`, `getCycleWindowStart`, `getNextCycleWindowStart` after `processStreakPauses`; `getWeekStartStr`, `getLeaderboardWeekStartStr` near the top.
- functions/lib/schedule.js — `computeNextSendDate`, `getLocalDateString`.
