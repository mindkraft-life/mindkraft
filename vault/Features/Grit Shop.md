---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Grit Shop

**In one line:** On the Rewards page users spend Grit on streak shields (40 Grit into a pool, then applied to an activity), a monthly double-XP boost (50 Grit, one per calendar month, applied to the next completion) and half-price gifts for friends, with every purchase persisted before it is granted.

## How it works
- `gritPurchase(cost, reason, grant, revert, meta)`: checks the balance, locks against double taps, debits (`gritApplyDelta`), grants, then `gritPersist()`; on a failed save it reverts the grant, the balance and the buffered ledger entry.
- **Shield:** `gritBuyShield` adds to `grit.shieldPool`; `gritApplyShield(activityId)` (after a confirm, from `gritRenderShieldPicker`) appends a `shield_applied` event with a stable id (`gritShieldEventId`) to the activity's `shieldEvents` and refreshes its capacity. Refused when the activity holds 10 or has no streak (`gritShieldEligible`).
- **XP boost:** `gritBuyBoost` sets `grit.pendingBoost`; `gritIsBoostArmed` makes `predictCompletionXP` double the next completion; `gritConsumeBoost` clears it. `GRIT_BOOST_PER_MONTH` = 1 (`gritBoostsUsedThisMonth`, `gritBoostsLeftThisMonth`).
- **Gifts:** half price (shield 20, boost 25), up to 3 gifted boosts per month (`gritGiftBoostsLeftThisMonth`) — see [[Social Gifting]].
- Other Grit sinks live with their features: mode entries ([[Modes]]), wagers ([[Stake Mode]], [[Pact Mode]], [[Versus Challenges]]), Map reveals and regenerations ([[Map Reveal Loop]]), goal reweaves ([[Map Weaving]]).

## Key functions
- `gritPurchase`, `gritBuyShield`, `gritBuyBoost`, `gritApplyShield`, `gritShieldEligible`, `gritShieldEventId`, `gritIsBoostArmed`, `gritConsumeBoost`, `gritMonthKey`, `gritBoostsUsedThisMonth`, `gritBoostsLeftThisMonth`, `gritGiftBoostsLeftThisMonth`, `gritRenderShieldPicker`.

## Data it touches
- [[users]] (`grit.shieldPool`, `grit.pendingBoost`, `grit.boostPurchases`, activity `shieldEvents`), [[gritLedger]]

## Connected to
- [[Rewards Page]], [[Grit Currency]], [[Streaks And Shields]], [[Activity Completion]], [[Social Gifting]], [[Payout Browser Test]]

## If you change this
- "Persist before grant" is a tested invariant; a purchase path that grants first can mint items on a failed save.
- Shield application is an append-only event, never a count change — the streak walk derives capacity from it.

## Where in the code
- app.js — GRIT section "Spend (§5)" (`gritPurchase` … `gritConsumeBoost`) and `gritRenderShieldPicker`.
