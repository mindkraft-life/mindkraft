---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Rewards Page

**In one line:** More › Rewards is the Grit page: balance and this week's projected bonus, the shop (shield, double-XP boost, gifts), the shield pool and picker, a "how Grit works" explainer and a paged ledger of every Grit movement.

## How it works
- Host `#mkEmptyMoreRewards`; the nav's `activateEmpty` calls `window.gritOpenRewards()` → `gritRenderRewards(true)` → `gritRenderRewardsInner` into `#gritRewardsRoot` (rewritten each render); the info button (`gritScrollToHow`) lives outside the root.
- The header Grit chip (`mkOpenGrit`) also opens this page.
- Ledger: `gritRenderLog` → `gritReadLedger` (ordered by `at`, newest first), `gritPaintLog`, `gritLogGoPage`, phrasing via `gritLedgerPhrase` / `gritRelTime`.
- Not the same as the Profile's user-defined level rewards ([[Level Rewards]]).

## Key functions
- `gritOpenRewards`, `gritRenderRewards`, `gritRenderRewardsInner`, `gritRewardsVisible`, `gritRenderShieldPicker`, `gritRenderLog`, `gritPaintLog`, `gritLogRows`, `gritLogGoPage`, `gritLedgerPhrase`, `gritRelTime`, `gritFillColor`, `gritScrollToHow`, `gritBuyShield`, `gritBuyBoost`, `gritApplyShield`, `giftOpenPicker`.

## Data it touches
- [[users]] (`grit`), [[gritLedger]]

## Connected to
- [[Grit Currency]], [[Grit Shop]], [[Grit Weekly Payout]], [[Social Gifting]], [[Bottom Navigation]]

## If you change this
- Like Modes, the host id still says "Empty" from its placeholder days; the nav references it by that id.

## Where in the code
- index.html — `#mkEmptyMoreRewards`.
- app.js — GRIT section rendering (`gritRenderRewards` … `gritOpenRewards`).
