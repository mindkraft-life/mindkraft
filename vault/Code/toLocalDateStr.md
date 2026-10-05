---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# toLocalDateStr

**In one line:** `toLocalDateStr(date)` formats a Date as a local-time `YYYY-MM-DD` string; it (with `localToday()` / `localYesterday()`) is the app-wide definition of "which day", used in about 60 places for streak stamps, penalties, Grit weeks, modes, planner days, leaderboard weeks and history grouping.

## How it works
- Uses `getFullYear`, `getMonth`, `getDate` (local), zero-padded. Never UTC.
- `localToday()` = `toLocalDateStr(new Date())`; `localYesterday()` subtracts one local day.
- Feature wrappers: `gritDayOf`, `modesToday`, `localDateStr` (planner).

## Key functions
- `toLocalDateStr`, `localToday`, `localYesterday`, `mkDayKey`.

## Data it touches
- [[users]] (format of every stored day string)

## Connected to
- [[Dates Days And Weeks]], [[getCycleWindowStart]], [[Streaks And Shields]], [[Grit Weekly Payout]], [[Daily Planner]]

## If you change this
- Changing the format invalidates every stored day key (`streakGrantedDate`, `lastProcessedDate`, `xpTodayGhost` keys, planner days, Grit weeks).

## Where in the code
- app.js — just after `processStreakPauses`.
