---
type: feature
sources: [app.js]
last_verified: 2026-10-05
---
# Public Profile

> [!summary] In plain words
> A small, safe summary of you that friends are allowed to see — name, picture, level, recent points, title and similar — refreshed every time your data is saved. Your private details and full history are never shared.
>
> **How it connects:** Read by the [[Friends Page]], [[Leaderboards Page]] and [[Friend Profile Page]]. The title comes from [[Character Title And Life Balance]].

**In one line:** After every save and on every login, the client publishes a small public snapshot of the account — name, photo, friend code, level, total/weekly/today XP, XP per hour, category XP, character title, best streak and active days — to `publicProfiles/{uid}` so friends can see it without reading the private user document.

## How it works
- `syncPublicProfile()` computes the figures from in-memory data: `computeWeeklyXP()` (Monday week, plus ghost XP), `computeXPPerHour()` (yesterday's XP ÷ 12 waking hours), `getProfileCategoryXP()` + `getCharacterTitle()`, best streak, active days, today's XP (with `xpTodayGhost`), and `totalXP + xpDeletedGhost`.
- Writes the whole document with `setDoc`; failures are logged and ignored.
- Readers: friends list, leaderboard metrics, friend profile card, add-by-code lookup.

## Key functions
- `syncPublicProfile` — see [[syncPublicProfile]].
- `computeWeeklyXP`, `computeWeeklyCompletions`, `computeXPPerHour`, `computeWeeklyXPFromActivities`, `getISOWeekLabel`, `getLeaderboardWeekStartStr`, `ghostXPBetween`.

## Data it touches
- [[publicProfiles]], [[users]]

## Connected to
- [[Friends]], [[Leaderboards Page]], [[Friend Profile Page]], [[Character Title And Life Balance]], [[Saving And The Write Invariant]], [[App Boot Sequence]]

## If you change this
- Anything added here becomes visible to every signed-in user who can read public profiles; keep it non-sensitive.
- It runs after every save, so expensive computation here slows every interaction's write path.

## Where in the code
- app.js — weekly/hourly XP helpers and `syncPublicProfile` near the top of the file.
