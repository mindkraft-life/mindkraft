---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# syncPublicProfile

**In one line:** `syncPublicProfile()` recomputes the user's shareable stats and overwrites `publicProfiles/{uid}` with them; it runs after every successful `saveUserData()` and once on each login.

## How it works
- Guarded by `canPersistUserData`; reads the current user and `userData`.
- Writes `displayName`, `photoURL`, `friendCode`, `level`, `totalXP` (+ `xpDeletedGhost`), `weeklyXP` / `weeklyXPWeek`, `xpPerHour` / `xpPerHourDate`, `categoryXP`, `characterTitle`, `bestStreak`, `activeDays`, `xpToday` / `xpTodayDate`, `updatedAt`.
- Errors are logged as non-critical.

## Key functions
- `syncPublicProfile`, `computeWeeklyXP`, `computeXPPerHour`, `getProfileCategoryXP`, `getCharacterTitle`, `getISOWeekLabel`.

## Data it touches
- [[publicProfiles]], [[users]]

## Connected to
- [[Public Profile]], [[saveUserData]], [[Friends]], [[Leaderboards Page]], [[App Boot Sequence]]

## If you change this
- Runs on every save, so its cost is paid on every interaction.

## Where in the code
- app.js — near the top, after the weekly XP helpers.
