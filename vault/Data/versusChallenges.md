---
type: data
sources: [app.js, functions/index.js, functions/lib/versus.js, firestore.indexes.json, test/rules/firestore.rules.test.mjs]
last_verified: 2026-10-05
---
# versusChallenges

> [!summary] In plain words
> One record per head-to-head challenge, shared by both players: the targets, the Grit pot, each side's progress and the result.
>
> **How it connects:** Part of [[Versus Challenges]]. Deadlines are also checked by the server, and results are announced by notification ([[Push Delivery]]).

**In one line:** `versusChallenges/{id}` is one head-to-head Grit wager between two friends — the only document both accounts read and write — holding the stake escrowed in `pot`, each side's activity mapping and progress counters, and the payout waiting to be claimed.

## How it works
- Created by the challenger (`vsCreateChallenge`) inside a transaction that also debits their `grit.balance`: `schemaVersion` (3), `mode: 'versus'`, `createdBy`, `opponent`, `participants[2]`, `status`, `name`, `description`, `stake` (25–100, steps of 25), `pot`, `bonusXP`, `durationDays`, `createdAt`, `expiresAt` (+7 days), `startedAt`, `endsAt`, `resolvedAt`, `requirements[{reqId, targetCount, seed?}]` (max 5), `mapping{uid: {reqId: {activityId, activityName}}}`, `progress{uid: {reqId: count}}`, `totals{uid}`, `winner`, `outcome`, `payout{uid}`, `payoutClaimed{uid}`, `seen{uid}`, `names{uid}`; forfeits add `forfeitedBy` / `forfeitReason`. Times are epoch milliseconds.
- Status flow: `pending` → `active` (opponent accepts, maps every requirement, adds an equal stake) → `resolved` (all targets first, deadline lead, tie refund, or forfeit). Also `declined`, `cancelled` (challenger withdraws), `expired` (invite lapses). Terminal statuses: `resolved`, `expired`, `declined`, `cancelled`.
- Resolution sets `pot: 0` and records `payout`; each side's own client later claims its payout in a transaction that credits its balance and flips `payoutClaimed[uid]`. The server never moves Grit.
- [[resolveDueVersusChallenges]] resolves overdue active and lapsed pending challenges every 5 minutes; clients also resolve lazily (`vsRunMaintenance`). Both guard on the expected status.
- Read model: one `getDocs` on login/tab open (query `participants array-contains uid` and `status in` all statuses, falling back to the single-field query if the composite index is missing), cached 60 s; one `onSnapshot` while a detail card is open.
- Indexes: (`participants` contains, `status`), (`status`, `endsAt`), (`status`, `expiresAt`).

## Key functions
- Client: `vsCreateChallenge`, `vsAcceptChallenge`, `vsTerminatePending`, `vsCommitProgress`, `vsResolveDeadline`, `vsForfeit`, `vsClaimPayout`, `vsRunMaintenance`, `vsFetch`, `vsBuildResolution`.
- Server: `resolveDeadlinePatch`, `expirePendingPatch`, `buildResolution`, `resolutionBody` (functions/lib/versus.js).

## Data it touches
- [[users]] (`grit.balance` via transactions, `friends`, `vsDraftMappings`, `vsSeenResults`), [[gritLedger]]

## Connected to
- [[Versus Challenges]], [[Challenges Page]], [[onVersusWrite]], [[resolveDueVersusChallenges]], [[Security Rules]], [[Firestore Indexes]], [[vsRunMaintenance]], [[Server Versus Test]], [[Versus Browser Test]], [[Rules Test]]

## If you change this
- The resolution rules exist in three copies: app.js (`vsBuildResolution`, `vsResolveDeadline`), functions/lib/versus.js and the security rules. Change all three together.
- Pot conservation is enforced by rules for clients (`potConserved`) but not for the scheduler (admin SDK) — the server tests assert it.
- `bonusXP` is stored and shown on cards but no code path awards it (see [[Change Impact Guide]]).

## Where in the code
- app.js — VERSUS CHALLENGES section.
- functions/index.js — `onVersusWrite`, `resolveDueVersusChallenges`; functions/lib/versus.js.
