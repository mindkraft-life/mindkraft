---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Friends Page

**In one line:** Social › Friends shows incoming "someone added you" requests, the friends list (tap for a profile card with gift and leaderboard actions), the last five gifts sent, and the add-friend-by-code box.

## How it works
- Tab id `people` (`#peopleTab`); `switchTab('people')` → `renderFriendsTab()`, the same pass that fills the Leaderboards page.
- Hosts: `#friendsRequests` (`frRequestsHtml`), `#friendsAllList` (`frFriendListHtml`), `#friendsGiftsSent` (`giftRenderSentList`), `#friendsAddSection` (`frAddCardHtml` → `addFriendByCode`).
- Gift and friend pushes open this tab (`?tab=friends` or a service-worker message).

## Key functions
- `renderFriendsTab`, `frRequestsHtml`, `frFriendListHtml`, `frAddCardHtml`, `addFriendByCode`, `acceptFriendRequest`, `dismissFriendRequest`, `openFriendProfileCard`, `giftRenderSentList`.

## Data it touches
- [[users]] (`friends`, `friendCode`), [[publicProfiles]], [[friendRequests]], [[giftsSent]]

## Connected to
- [[Friends]], [[Friend Profile Page]], [[Social Gifting]], [[Leaderboards Page]], [[Public Profile]], [[onFriendRequestWrite]], [[Tab Switching]]

## If you change this
- The tab id `people` (Friends) and `friends` (Leaderboards) are swapped relative to their labels for historical reasons; the DOM ids were kept so `renderFriendsTab` still finds its hosts.

## Where in the code
- index.html — `#peopleTab`.
- app.js — FRIENDS FEATURE section.
