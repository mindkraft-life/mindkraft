---
type: feature
sources: [app.js, test/grit/README.md, test/payout/README.md]
last_verified: 2026-10-05
---
# Grit Currency

**In one line:** Grit is Mindkraft's spendable effort currency — earned only from real activity (a 1-Grit drip per completion, weekly bonuses, streak, mastery, cadence, quest, leaderboard and wager payouts) and spent on shields, XP boosts, gifts, mode entries, wagers, Map reveals and regenerations — with the balance in `users/{uid}.grit` and every movement in the `gritLedger` subcollection.

## How it works
- **State** (`gritState()`, created on first touch): `balance`, `lifetimeEarned`, `lifetimeSpent`, `shieldPool`, `week` (current quota week), `awarded{marker: true}` (idempotency markers), `boostPurchases[]`, `cadence{}`, `pendingBoost`.
- **Every movement** goes through `gritApplyDelta(delta, reason, meta)` (clamps at 0 with a `correction` ledger note) or a Versus/Pact transaction mirrored by `vsMirrorBalance`. Ledger entries are buffered and flushed ([[gritLedger]]).
- **Earning (rate card):** drip `GRIT_DRIP` = 1 per countable completion (not perform-negative); occasional on-rhythm cadence bonus 5 (needs 4 prior completions, within 0.5–1.5× the median gap); streak tiers 7/14/30/60/100 days → 10/20/40/60/100; activity mastery 40–120 (1 per required rep); weekly payout ([[Grit Weekly Payout]]); quest seals 5–120; leaderboard places; wager returns.
- **Idempotency:** `gritAwardOnce(marker, …)` checks and sets `awarded[marker]`, so sweeps that run on login, after completions and on render pay once.
- **Reversal:** the drip is stamped on the completion entry (`gritAwarded`); `gritOnRemoval` gives back exactly that on undo/retro delete — "effort is the only source of Grit".
- **Hooks:** `gritOnCompletion` (drip, week numerator, cadence, streak milestones, boost consumption), `gritOnRetroComplete`, `gritOnRemoval`, `gritOnLogin` (local-storage migration, week rollover, sweeps).
- **UI:** header chip (`mkGritBtn`, `window.mkRenderGrit`), floats and burst toasts, the Rewards page.

## Key functions
- `gritApplyDelta` — see [[gritApplyDelta]]; `gritOnCompletion` — see [[gritOnCompletion]]; `gritAwardOnce` — see [[gritAwardOnce]].
- `gritState`, `gritBalance`, `gritPersist`, `gritLedgerWrite`, `gritFlushLedger`, `gritOnRetroComplete`, `gritOnRemoval`, `gritOnLogin`, `gritCheckStreakMilestones`, `gritCheckMastery`, `gritCheckCadence`, `gritIsCountable`, `gritIsPunitive`, `gritDripPreview`, `gritMigrateLocalBalance`, `gritBurstAdd`, `gritFlushBurst`, `gritRefreshUI`.

## Data it touches
- [[users]] (`grit`), [[gritLedger]], [[versusChallenges]], [[pacts]]

## Connected to
- [[Grit Weekly Payout]], [[Grit Shop]], [[Rewards Page]], [[Activity Completion]], [[Streaks And Shields]], [[Quests]], [[Leaderboard Payouts]], [[Social Gifting]], [[Modes]], [[Versus Challenges]], [[Map Reveal Loop]], [[Map Weaving]], [[Saving And The Write Invariant]], [[Grit Clawback Test]], [[Payout Browser Test]]

## If you change this
- Grit math is client-side and trusted; the server never moves Grit (Versus/Pact payouts are claimed by each side's own client).
- Any new earning path must use a marker (`gritAwardOnce`) or a recorded stamp, or repeated passes will mint Grit.
- `gritMigrateLocalBalance` still seeds a brand-new account's balance from the `mk_grit_balance` localStorage key (a leftover one-time migration).

## Where in the code
- app.js — "GRIT CURRENCY SYSTEM" section (after the back-button guard).
