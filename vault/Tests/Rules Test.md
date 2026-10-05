---
type: test
sources: [test/rules/firestore.rules.test.mjs, test/rules/package.json, test/rules/firebase.json, test/rules/README.md]
last_verified: 2026-10-05
---
# Rules Test

> [!summary] In plain words
> Pretends to be a dishonest user and tries to break the database rules — reading other people's data, faking a challenge win, gifting to strangers — and checks that every attempt is refused. It currently cannot run, because the rules file is not stored in this project.
>
> **How it connects:** Guards the [[Security Rules]].

**In one line:** test/rules/firestore.rules.test.mjs runs a hostile client against the Firestore emulator to prove the security rules for Versus challenges, the Grit ledger, gifts and mirrors, leaderboard boards, pacts, friend requests and mode reminders — but it reads `../../firestore.rules`, a file that is not in the repository, so it cannot run as checked in.

## How it works
- `npm test` → `firebase emulators:exec --only firestore` (port 8088, project `demo-mindkraft`) → loads the rules file via `initializeTestEnvironment` and seeds users A and B (mutual friends) and C (no friends).
- Sections: VERSUS (create/read/accept/progress/resolve/forfeit/decline/claim), GRIT LEDGER, GIFTS & MIRRORS, LEADERBOARD BOARDS, PACTS (both term shapes), FRIEND REQUESTS, MODE REMINDERS, NO CROSS-ACCOUNT LEAK.
- README warns to check output for "maximum of 1000 expressions" — a blown evaluation budget looks like a normal denial.

## Key functions
- `t`, `payload`, `giftAt`, `seedReq`, `modeReminder` (plus assertSucceeds / assertFails from @firebase/rules-unit-testing).

## Data it touches
- Emulated [[versusChallenges]], [[gritLedger]], [[gifts]], [[giftsSent]], [[leaderboardBoards]], [[pacts]], [[friendRequests]], [[reminders]], [[users]]

## Connected to
- [[Security Rules]], [[Versus Challenges]], [[Social Gifting]], [[Leaderboard Payouts]], [[Pact Mode]], [[Friends]], [[Test Suites Overview]]

## If you change this
- To run it, the current console rules must first be exported to `firestore.rules` at the repo root (the README calls that the canonical copy).

## Where in the code
- test/rules/.
