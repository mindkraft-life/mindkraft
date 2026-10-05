---
type: data
sources: [app.js, test/rules/firestore.rules.test.mjs]
last_verified: 2026-10-05
---
# gritLedger

> [!summary] In plain words
> A permanent record of every Grit each person earned or spent, like a bank statement. Lines are only ever added — never changed or deleted.
>
> **How it connects:** Written by [[Grit Currency]] and shown on the [[Rewards Page]].

**In one line:** `users/{uid}/gritLedger/{entryId}` is the append-only record of every Grit movement (earn, spend, stake, payout, correction), buffered on the client and flushed in batches, never edited or deleted.

## How it works
- Entry: `{ at (ISO), delta, balanceAfter, reason, meta{} }`. Ids come from `gritLedgerId(at)`: a compact timestamp + sequence + random suffix, so ids sort chronologically.
- `gritLedgerWrite()` pushes into an in-memory buffer; `gritFlushLedger()` writes the buffer with one `writeBatch` after a 5 s debounce, on window `blur`, when the page becomes hidden (`visibilitychange`) and on `pagehide`.
- The Rewards page reads it newest-first ordered by `at` (`gritReadLedger`), paging with `gritLogGoPage`.
- `reason` values include completion drips, weekly bonuses, streak/mastery/cadence bonuses, purchases (shield, boost, reveal, regen, mode entry), challenge/pact stakes and payouts, gifts sent/received, `quest_completion`, and `correction` (a zero-delta note written when a negative balance was clamped).
- Summing every `delta` should land exactly on `grit.balance` in [[users]].
- Rules (per the rules test): owner may create and read; updates and deletes are refused; nobody else can read.

## Key functions
- `gritLedgerWrite`, `gritFlushLedger`, `gritLedgerId`, `gritReadLedger`, `gritLedgerPhrase`, `gritRenderLog`, `vsMirrorBalance`.

## Data it touches
- [[users]] (parent; `grit.balance` is the live number)

## Connected to
- [[Grit Currency]], [[Rewards Page]], [[Versus Challenges]], [[Pact Mode]], [[Social Gifting]], [[Security Rules]], [[Rules Test]], [[gritApplyDelta]]

## If you change this
- It is a subcollection so `saveUserData()`'s overwrite can never clobber it; do not move it into the user doc.
- Entries still in the buffer are lost if the tab dies before a flush — the balance in `users/{uid}.grit` is the source of truth, the ledger is the audit trail.

## Where in the code
- app.js — GRIT CURRENCY SYSTEM, "Ledger (users/{uid}/gritLedger)" block and `gritRenderLog`.
