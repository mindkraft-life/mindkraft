---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# gritApplyDelta

**In one line:** `gritApplyDelta(delta, reason, meta)` is the one function that moves a user's local Grit balance — it updates `grit.balance` and the lifetime earned/spent totals, writes a ledger entry, refreshes the Grit UI, and clamps at zero with a `correction` entry if arithmetic ever goes negative.

## How it works
- Rounds `delta`; zero is a no-op returning the balance.
- Negative result → balance 0, ledger records what actually moved plus a zero-delta `correction` note (so ledger deltas still sum to the balance).
- Otherwise updates `balance`, `lifetimeEarned` or `lifetimeSpent`, calls `gritLedgerWrite(delta, balance, reason, meta)` and `gritRefreshUI()`.
- Callers: `gritOnCompletion`, `gritOnRetroComplete`, `gritOnRemoval`, `gritAwardOnce`, weekly payout, `gritPurchase`, `lbSettleClosedWeek`, Map reveal/regeneration/reweave charges, mode wager payouts, `giftSend`.
- Versus and Pact balance moves happen in Firestore transactions and are mirrored locally with `vsMirrorBalance` instead.

## Key functions
- `gritApplyDelta`, `gritState`, `gritLedgerWrite`, `gritRefreshUI`, `vsMirrorBalance`.

## Data it touches
- [[users]] (`grit`), [[gritLedger]]

## Connected to
- [[Grit Currency]], [[gritAwardOnce]], [[gritOnCompletion]], [[Grit Shop]], [[Grit Weekly Payout]], [[Leaderboard Payouts]]

## If you change this
- The balance only persists with the next user-document save; purchases use `gritPersist()` to make that explicit before granting.

## Where in the code
- app.js — GRIT section, after the ledger functions.
