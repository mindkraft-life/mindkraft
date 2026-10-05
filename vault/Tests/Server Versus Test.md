---
type: test
sources: [functions/test/versus.test.js, functions/lib/versus.js]
last_verified: 2026-10-05
---
# Server Versus Test

**In one line:** functions/test/versus.test.js (15 tests) pins who wins a Versus challenge when the scheduler resolves it — completing first, the capped deadline lead, or a tie refund — that inflated counters cannot buy a win, that lapsed invites refund in full, and that every resolution empties the pot into payouts that sum back to it.

## How it works
- `cappedTotal`, `hasCompleted`, `resolveDeadlinePatch`, `expirePendingPatch`, `buildResolution`, `resolutionBody` over fixture challenges; the pot invariant is asserted directly because admin writes bypass the rules.

## Key functions
- `cappedTotal`, `hasCompleted`, `resolveDeadlinePatch`, `expirePendingPatch`, `buildResolution`, `resolutionBody`.

## Data it touches
- fixtures shaped like [[versusChallenges]]

## Connected to
- [[resolveDueVersusChallenges]], [[onVersusWrite]], [[Versus Challenges]], [[Test Suites Overview]]

## If you change this
- The client copy (`vsResolveDeadline`, `vsBuildResolution`) is not unit-tested; keep it identical by hand.

## Where in the code
- functions/test/versus.test.js.
