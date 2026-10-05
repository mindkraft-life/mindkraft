---
type: backend
sources: [functions/index.js, functions/lib/versus.js, firestore.indexes.json]
last_verified: 2026-10-05
---
# resolveDueVersusChallenges

**In one line:** `resolveDueVersusChallenges` is a Cloud Scheduler function that every five minutes resolves Versus challenges past their deadline and expires invites past their 7-day window, writing the outcome and payout owed but never moving anyone's Grit.

## How it works
- `onSchedule('every 5 minutes')`, region asia-south1, 120 s timeout, no retries.
- Two queries (limit `MAX_VERSUS_PER_RUN` = 200 each): `status == 'active' && endsAt <= now` and `status == 'pending' && expiresAt <= now`.
- Each runs in a transaction that re-reads the document and applies `versus.resolveDeadlinePatch()` or `versus.expirePendingPatch()`; a `null` patch means a client got there first (counted as "raced").
- The written patch includes `payout`; each participant's client claims it later with `vsClaimPayout`. The resolve write triggers [[onVersusWrite]], which sends the result push.

## Key functions
- `resolveDueVersusChallenges`, `resolveDeadlinePatch`, `expirePendingPatch`, `buildResolution`, `cappedTotal`, `hasCompleted` (lib/versus.js).

## Data it touches
- [[versusChallenges]]

## Connected to
- [[Versus Challenges]], [[onVersusWrite]], [[Firestore Indexes]], [[Server Versus Test]], [[vsRunMaintenance]]

## If you change this
- Admin writes bypass the security rules, so pot conservation (pot → 0, payouts sum to the pot) is only guaranteed by lib/versus.js and its tests.
- lib/versus.js is a port of `vsResolveDeadline` / `vsTerminatePending` / `vsBuildResolution` in app.js — change both.
- Needs the (`status`, `endsAt`) and (`status`, `expiresAt`) indexes.

## Where in the code
- functions/index.js — `exports.resolveDueVersusChallenges`; functions/lib/versus.js.
