---
type: test
sources: [test/versus/versus.test.mjs, test/versus/README.md]
last_verified: 2026-10-05
---
# Versus Browser Test

**In one line:** test/versus/versus.test.mjs (72 checks) walks a whole Versus wager in the real app.js from both sides — the create sheet and the document it writes with the escrowed stake, the board's counts and bars, the receiver's accept walkthrough including creating an activity from the seed — and checks that the old solo/group challenge UI is fully gone.

## How it works
- Uses [[Browser Test Harness]]; hooks expose `vsFetch` and `vsPaint`; sets `window._dataOwnerUid` and shows `#appContainer` manually.
- Sender: friend-row opponent picker, searchable activity picker, no per-requirement name, three-cell stakes panel, requirement names backfilled, seed carries skip-negative mode, stake escrowed and balance debited.
- Board: capped hero count and percentage, opponent bar subordinate, lead readout, breakdown sub-bars.
- Receiver: one-sentence ask, two buttons, seeded activity modal with advanced section open, backing out returns to the walkthrough, swap path, review stakes, accept → active with both stakes in the pot.
- Removals: no sub-tab row, no solo/group hosts or modals.

## Key functions
- Exercises `vsOpenCreate`, `vsSubmitCreate`, `vsCreateChallenge`, `vsPaint`, `vsBoardModel`, `vsOpenAccept`, `vsCreateActivityFor`, `vsSubmitAccept`, `vsAcceptChallenge`.

## Data it touches
- Stubbed [[versusChallenges]], [[users]]

## Connected to
- [[Versus Challenges]], [[Challenges Page]], [[Activity Editor Page]]

## If you change this
- Server resolution is covered by [[Server Versus Test]]; rules by [[Rules Test]].

## Where in the code
- test/versus/versus.test.mjs.
