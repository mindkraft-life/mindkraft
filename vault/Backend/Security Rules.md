---
type: backend
sources: [test/rules/firestore.rules.test.mjs, test/rules/README.md, .github/workflows/deploy-reminders.yml, functions/lib/versus.js]
last_verified: 2026-10-05
---
# Security Rules

**In one line:** Firestore security rules for Mindkraft are managed in the Firebase Console and are not in this repository; what the repo has is a hostile-client test suite (test/rules) that describes the intended rules and expects a `firestore.rules` file at the repo root that does not exist.

## How it works
- The deploy workflow deliberately does not deploy rules ("managed in the Firebase Console and this repo has no copy of them").
- test/rules/README.md says `firestore.rules` at the repo root is the canonical copy and must be kept in sync with the console by hand — but no such file is checked in, so the rules suite cannot run as-is.
- What the tests assert (the intended contract):
  - [[versusChallenges]]: only friends; creator = caller; stake 25–100; `pot == stake` at invite; cannot self-start active, pre-credit payouts or pre-fill progress; only participants read; nobody deletes; accept must match the pot and map every requirement; each side writes only its own progress/seen/claim keys; only the leader may resolve as winner; forfeit pays the other side; no double claim.
  - [[gritLedger]]: owner creates and reads; no updates or deletes.
  - [[gifts]] / [[giftsSent]]: friend-only creation with strict fields; receiver may consume/thank; four-field mirror update by the receiver; no deletes.
  - [[leaderboardBoards]]: owner writes their own; members of the board (live or frozen roster) may read — the mutuality test.
  - [[pacts]]: friend-only; initiator pins their term; partner writes only their own term and progress; both document shapes supported.
  - [[friendRequests]]: sender creates; recipient may only add the accept marker.
  - [[reminders]]: the owner may create mode reminders only under `mode-…` ids, with a `modeKind` the rules accept (the test accepts `habit` and refuses `berserk`) and a valid time; nobody may plant a reminder in someone else's tree.
  - [[users]]: a challenge or pact partner still cannot read the other's user document.
- Rules are the third copy of the Versus resolution contract (with app.js and functions/lib/versus.js). Admin-SDK writes from Cloud Functions bypass them.
- The README warns about Firestore's 1000-expression budget per evaluation.

## Key functions
- Test helpers in test/rules/firestore.rules.test.mjs (`t`, `payload`, `giftAt`).

## Data it touches
- [[users]], [[reminders]], [[gritLedger]], [[gifts]], [[giftsSent]], [[publicProfiles]], [[friendRequests]], [[leaderboardBoards]], [[versusChallenges]], [[pacts]]

## Connected to
- [[Rules Test]], [[Deploy Pipeline]], [[Saving And The Write Invariant]]

## If you change this
- Any new collection or new field written by the client needs a rules change in the console; field allow-lists will reject unexpected keys.
- A rules change in the console that denies reading `users/{uid}` makes every client open read-only (`showDataLoadFailure` says "the database security rules changed").

## Where in the code
- Firebase Console (live rules, not in repo).
- test/rules/firestore.rules.test.mjs, test/rules/README.md.
