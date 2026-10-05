---
type: feature
sources: [app.js]
last_verified: 2026-10-05
---
# Level-Up Share Card

**In one line:** When a user levels up, Mindkraft draws a 540×960 image card on a `<canvas>` — brand, new level, XP bar, stats for the level just finished, top activity and most active areas — prebuilt in the background so the "Share progress" button can open it instantly as an image to save or share.

## How it works
- On level-up `completeActivity` stamps `cardLevelStartedAt` (start of the level just finished) and `levelStartedAt`, then `prebuildLevelUpCard(level)` renders and caches the blob in `window._levelUpCardCache` (done ahead of time to stay within the mobile user-gesture window).
- `buildLevelUpCard(level)` waits for the icon font (`ensureIconFont`), reads theme colours from CSS variables, and draws six sections with small canvas helpers (`rr`, `glow`, `hline`, `celebCard`, `sf`); the top activity comes from `getTopActivitiesThisLevel`, areas from `getCategoryXPSince` / `getTop2Categories`.
- `shareLevelUpCard(level)` (the button built by `buildShareLevelUpBtn`) uses the cache or rebuilds, then `_showCardOverlay(blob, level)` shows the image full screen. The domain printed on the card comes from `APP_BASE_HOST`.

## Key functions
- `buildLevelUpCard`, `prebuildLevelUpCard`, `shareLevelUpCard`, `_showCardOverlay`, `buildShareLevelUpBtn`, `getTopActivitiesThisLevel`, `getCategoryXP`, `getCategoryXPSince`, `getTop2Categories`, `celebCard`, `_hexToRgbStr`, `showLevelUpAnimation`.

## Data it touches
- [[users]] (`level`, `cardLevelStartedAt`, `levelStartedAt`, activities' history, dimensions)

## Connected to
- [[XP And Levels]], [[Activity Completion]], [[Level Rewards]], [[Character Title And Life Balance]], [[Icons]], [[Themes]], [[Social Gifting]] (gift reveals wait for the card)

## If you change this
- "Most active areas" sums XP by `dimension.lifeCategory`, a field nothing in the current app sets, so that section only appears for accounts carrying legacy data (see [[Change Impact Guide]]).

## Where in the code
- app.js — `getTopActivitiesThisLevel` … `shareLevelUpCard` (near the top, before the auth listener).
