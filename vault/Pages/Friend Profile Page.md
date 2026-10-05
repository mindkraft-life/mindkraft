---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Friend Profile Page

> [!summary] In plain words
> A pop-up card about one friend, showing their level, title, statistics and life-balance chart, with buttons to send them a gift, show or hide them on your leaderboard, or remove them.
>
> **How it connects:** It opens from the [[Friends Page]]. The information comes from their [[Public Profile]], and gifts are covered in [[Social Gifting]].

**In one line:** Tapping a friend opens a bottom-sheet profile card built from their public profile — level, title, stats and life-balance chart — with actions to send a gift, show or hide them on your leaderboard, and remove them.

## How it works
- `openFriendProfileCard(uid)` reads `window._friendProfileCache[uid]` (filled by `renderFriendsTab`) and renders into `#friendProfileContent`, reusing `renderSpiderChartCanvas` with the friend's `categoryXP`.
- Actions: `giftOpenPicker(uid, type)`, `toggleLeaderboardVisibility(uid)`, `removeFriend(uid)`; `closeFriendProfileCard`.

## Key functions
- `openFriendProfileCard`, `closeFriendProfileCard`, `renderSpiderChartCanvas`, `giftOpenPicker`, `toggleLeaderboardVisibility`, `removeFriend`, `frSyncProfileBoardBtn`.

## Data it touches
- [[publicProfiles]], [[users]] (`friends`, `leaderboardHidden`)

## Connected to
- [[Friends]], [[Friends Page]], [[Social Gifting]], [[Leaderboard Payouts]], [[Character Title And Life Balance]]

## If you change this
- The card only works for uids already in the profile cache; opening it before the Friends tab has loaded does nothing.

## Where in the code
- index.html — `#friendProfileOverlay`.
- app.js — `openFriendProfileCard` (FRIENDS FEATURE).
