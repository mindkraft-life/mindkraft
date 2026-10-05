---
type: data
sources: [app.js, test/rules/firestore.rules.test.mjs]
last_verified: 2026-10-05
---
# leaderboardBoards

**In one line:** `leaderboardBoards/{uid}` is a user's published leaderboard roster and weekly score, readable only by people on that roster, which is how the weekly Grit payout tests mutuality between friends.

## How it works
- Written by `lbPublishBoard()` (at most every 5 minutes unless forced) only while the user is opted in: `uid`, `optIn`, `optInFrom`, `members[]` (live board), `scored[]` + `scoredFrom` (roster frozen at this week's Monday), `prevScored[]` + `prevScoredFrom`, `week{anchor, xp, completions}`, `prev{…}` (last closed week), `displayName`, `photoURL`, `level`, `updatedAt`.
- Read by `lbReadBoard()` during weekly settlement: a denied read *is* the "not mutual" answer.
- Deleted by the owner on opt-out (`lbToggleOptIn`).
- Opting in takes effect the following Monday (`optInFrom`).

## Key functions
- `lbPublishBoard`, `lbReadBoard`, `lbMyWeek`, `lbRosterFor`, `lbSettleClosedWeek`, `lbToggleOptIn`, `lbBoardMembers`.

## Data it touches
- [[users]] (`leaderboard`, `friends`, `leaderboardHidden`), [[gritLedger]] (payouts)

## Connected to
- [[Leaderboard Payouts]], [[Leaderboards Page]], [[Grit Currency]], [[Security Rules]], [[Social Browser Test]]

## If you change this
- `prev` and `prevScored` must survive the Monday roll or nobody can score last week after a friend opens the app first.
- Read rule = mutuality test; widening reads would let anyone farm payouts from one-sided boards.

## Where in the code
- app.js — LEADERBOARD PAYOUTS section.
