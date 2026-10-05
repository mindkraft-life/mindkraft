---
type: data
sources: [app.js]
last_verified: 2026-10-05
---
# publicProfiles

**In one line:** `publicProfiles/{uid}` is the small, readable-by-others summary of a Mindkraft account (name, photo, friend code, level, XP figures, character title) that the owner's client rewrites after every save and that friends read for leaderboards, friend cards and add-by-code lookups.

## How it works
- Written only by `syncPublicProfile()` with a full `setDoc`: `displayName`, `photoURL`, `friendCode`, `level`, `totalXP` (includes `xpDeletedGhost`), `weeklyXP`, `weeklyXPWeek`, `xpPerHour`, `xpPerHourDate`, `categoryXP`, `characterTitle`, `bestStreak`, `activeDays`, `xpToday`, `xpTodayDate`, `updatedAt`.
- Called after every successful `saveUserData()` and once per login.
- Readers: `addFriendByCode` (query `where('friendCode', '==', code)`), `renderFriendsTab` (friend rows and the leaderboard metrics `xpToday`, `weeklyXP`, `xpPerHour`), `openFriendProfileCard`, Pact/Versus/gift friend pickers (cached in `window._friendProfileCache`).
- Nothing private (activities, history, Grit balance) is published.

## Key functions
- `syncPublicProfile` — see [[syncPublicProfile]].
- `computeWeeklyXP`, `computeXPPerHour`, `getProfileCategoryXP`, `getCharacterTitle`, `addFriendByCode`, `renderFriendsTab`, `openFriendProfileCard`, `giftEnsureFriendNames`.

## Data it touches
- [[users]] (source of every figure)

## Connected to
- [[Public Profile]], [[Friends]], [[Leaderboards Page]], [[Friend Profile Page]], [[Character Title And Life Balance]], [[Saving And The Write Invariant]]

## If you change this
- Every save rewrites this document, so it costs one extra Firestore write per save.
- Leaderboard numbers are only as fresh as each friend's last save — a friend who has not opened the app shows stale `xpToday` (the date fields let readers detect that).
- `friendCode` must stay unique per user for add-by-code to work; uniqueness is not enforced server-side.

## Where in the code
- app.js — `syncPublicProfile` near the top; FRIENDS FEATURE section.
