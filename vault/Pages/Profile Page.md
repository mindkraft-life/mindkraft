---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Profile Page

**In one line:** Tapping the header avatar opens the full-screen Profile: identity (avatar, character title, editable username, member-since, friend code with copy/share), level and stats, user-defined level rewards, and the life-balance spider chart with its category tagging.

## How it works
- `openProfileOverlay()` → `renderProfileOverlay()`; a wrapper pushes a history entry so the back button closes it (`closeProfileOverlay`).
- Username: `startUsernameEdit`, `saveUsername` (stored in `profile.username`; republished via the public profile), `cancelUsernameEdit`, `profileUsernameKeydown`.
- Friend code: `copyFriendCode`, `shareFriendCode`.
- Rewards card: `toggleProfileRewards` → `renderRewards`, `switchRewardMode` (global vs dimension).
- Life balance: `renderProfileSpiderChart`, `toggleSpiderConfig`, `setSpiderTag`.
- Header avatar: `updateProfileAvatar` (photo or initial).

## Key functions
- `openProfileOverlay`, `closeProfileOverlay`, `renderProfileOverlay`, `updateProfileAvatar`, `startUsernameEdit`, `saveUsername`, `toggleProfileRewards`, `toggleProfileInfo`, `renderProfileSpiderChart`, `copyFriendCode`, `shareFriendCode`.

## Data it touches
- [[users]] (`profile`, `rewards`, `friendCode`, `level`, stats), [[publicProfiles]]

## Connected to
- [[Level Rewards]], [[Character Title And Life Balance]], [[Friends]], [[Public Profile]], [[XP And Levels]], [[Sheets Overlays And Back Button]]

## If you change this
- `saveUsername` changes the name shown to friends only after the next public-profile sync and is not propagated into names already denormalized on gifts, challenges or pacts.

## Where in the code
- index.html — `#profileOverlay`.
- app.js — "Profile Overlay" section (`updateProfileAvatar` … `saveUsername`), profile toggles near the tab switching code.
