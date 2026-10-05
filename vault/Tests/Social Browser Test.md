---
type: test
sources: [test/social/social.test.mjs, test/social/README.md]
last_verified: 2026-10-05
---
# Social Browser Test

> [!summary] In plain words
> Checks gifting and leaderboard prizes: gifts cost half price and are delivered exactly once, boosts stay secret until used, failures give the Grit back, and weekly prizes follow the anti-cheating rules.
>
> **How it connects:** Guards [[Social Gifting]] and [[Leaderboard Payouts]].

**In one line:** test/social/social.test.mjs (73 checks) asserts the gifting and leaderboard-payout invariants in the real app.js — half-price gifts and their separate cap, spend → persist → write ordering with refunds, stable gift ids, denormalized names, shields redeemed once, the silent boost queue, reveal and thanks, mirror sync, the payout table and anti-farming rules, opt-in timing, and the Friends/Leaderboards tab split.

## How it works
- Uses [[Browser Test Harness]] (this suite owns `harness.mjs` and the stubs); `window.__fail` path prefixes drive refused writes.
- Gifting: §3.2 prices and cap; §3.3 ordering and `correction` refund; retry-stable `giftId`; names at write time; §4 shield into the pool exactly once; §5.1 oldest-first queue, one gift per completion, never past ×2, self-bought boost first; §5.2/§5.3 reveal and thanks without free text; §6 mirror in one write, login catch-up.
- Leaderboards: §8.3 payout table and worked examples, tie split, active + mutual rules, opt-in from the following Monday; §1 tab split.

## Key functions
- Exercises `giftSend`, `giftResolveShield`, `giftPeekFor`, `giftOnCompletion`, `giftShowReveal`, `giftSyncMirror`, `giftSyncOrphanedMirrors`, `lbRank`, `lbPayForPosition`, `lbSettleClosedWeek`, `lbToggleOptIn`, `renderFriendsTab`.

## Data it touches
- Stubbed [[gifts]], [[giftsSent]], [[users]], [[gritLedger]], [[leaderboardBoards]]

## Connected to
- [[Social Gifting]], [[Leaderboard Payouts]], [[Friends]], [[Friends Page]], [[Leaderboards Page]]

## If you change this
- The two push triggers and the rules are server-side and are not covered here.

## Where in the code
- test/social/social.test.mjs.
