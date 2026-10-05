---
type: feature
sources: [app.js, functions/index.js, index.html]
last_verified: 2026-10-05
---
# Friends

> [!summary] In plain words
> How people connect. Everyone has a friend code; entering someone's code adds them to your friends list (up to 20) and tells them, so they can add you back. Friends can then see each other's progress, send gifts, compete on leaderboards, challenge each other and make pacts.
>
> **How it connects:** Managed on the [[Friends Page]]. What friends see comes from the [[Public Profile]]. Friends power [[Leaderboard Payouts]], [[Social Gifting]], [[Versus Challenges]] and [[Pact Mode]].

**In one line:** Friends are added one-sidedly by sharing an `MK-XXXX` friend code (up to 20), which writes a "someone added you" notice the other person can answer by adding back; friends then appear on the Friends page, the leaderboard, friend profile cards, and the pickers for gifts, Versus and Pact.

## How it works
- Code: `generateFriendCode()` on account creation (backfilled on load); shown in the Profile with copy/share (`copyFriendCode`, `shareFriendCode` — share link `APP_BASE_URL/?add=<code>`).
- Add: `addFriendByCode()` looks up [[publicProfiles]] by `friendCode`, appends the uid to `userData.friends`, puts them on the leaderboard board (`frJoinBoard`), saves, republishes the board, and writes a [[friendRequests]] notice. Deep link: `handleFriendDeepLink()` handles `?add=`.
- Requests: listed on the Friends page and as a popup on app open (`frRequestsOnLogin`, `frShowRequestPopup`, de-duplicated per device in localStorage); `acceptFriendRequest` / `frPopupAddBack` add back, mark `accepted`, delete; `dismissFriendRequest` deletes.
- Remove: `removeFriend(uid)` drops them from `friends` and `leaderboardHidden`.
- Rendering: `renderFriendsTab()` fills both the Friends and Leaderboards pages in one pass with a sequence guard (`_frSeq`) so stale passes never paint.

## Key functions
- `generateFriendCode`, `addFriendByCode`, `handleFriendDeepLink`, `renderFriendsTab`, `frFriendListHtml`, `frRequestsHtml`, `frAddCardHtml`, `acceptFriendRequest`, `dismissFriendRequest`, `removeFriend`, `frRequestsOnLogin`, `frShowRequestPopup`, `frPopupAddBack`, `frCloseRequestPopup`, `frSeenIds`, `frMarkShown`, `openFriendProfileCard`, `copyFriendCode`, `shareFriendCode`, `frJoinBoard`, `frRenderIfVisible`.

## Data it touches
- [[users]] (`friends`, `friendCode`, `leaderboardHidden`), [[publicProfiles]], [[friendRequests]], [[leaderboardBoards]]

## Connected to
- [[Friends Page]], [[Friend Profile Page]], [[Leaderboards Page]], [[Public Profile]], [[Leaderboard Payouts]], [[Social Gifting]], [[Versus Challenges]], [[Pact Mode]], [[onFriendRequestWrite]], [[Social Browser Test]]

## If you change this
- Friendship is not symmetric in data: each side lists the other in its own `friends`. Security rules check "is a friend" from the writer's list.
- `acceptFriendRequest` dynamically re-imports `deleteDoc` although it is already imported at the top of app.js (harmless leftover).

## Where in the code
- app.js — "FRIENDS FEATURE" section and the "SOMEONE ADDED YOU" popup block; `generateFriendCode` near the top.
