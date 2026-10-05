---
type: data
sources: [app.js, functions/index.js, functions/lib/pact.js, firestore.indexes.json, test/rules/firestore.rules.test.mjs]
last_verified: 2026-10-05
---
# pacts

**In one line:** `pacts/{id}` is a Pact Mode agreement between two friends — each commits their own activities and targets, each escrows 40 Grit, and both either keep the pact (stakes back with a bonus) or both lose — stored top-level because two accounts must read it.

## How it works
- Created by the initiator (`pactCreate`) in a transaction that debits 40 Grit (`PACT_WAGER`): `id`, `schemaVersion`, `participants[2]`, `createdBy`, `partner`, `names{uid}`, `status`, `stake`, `pot`, `durationDays`, `createdAt`, `expiresAt` (+7 days), `startedAt`, `endsAt`, `terms{uid}`, `progress{uid}`, `outcome` (`kept` | `broken`), `failedBy` (uid | `both`), `resolvedAt`, `payout{uid}`, `payoutClaimed{uid}`, `seen{uid}`, plus nudge bookkeeping written by [[onPactWrite]]: `reached50{uid}`, `gapNudgeCount`, `gapNudgeArmed`.
- **Two term shapes:** older pacts store `terms[uid] = {activityId, activityName, target}` with a numeric `progress[uid]`; newer ones store `terms[uid] = {items: [{activityId, activityName, target}]}` with `progress[uid] = {activityId: count}`. Both are read with `pactItems` / `pactCount` / `pactStats` (client) and `items` / `count` / `stats` (functions/lib/pact.js).
- Flow: `pending` → partner accepts with their own term and stake (`pactAccept`) → `active` (starts the next day) → `resolved` by `pactMaybeResolve` (also `declined`, withdrawn, `expired`). Each side claims its own payout (`pactClaimPayout`).
- Resolution and expiry are **client-side only** (`pactRunMaintenance` on login/foreground); there is no scheduled resolver for pacts.
- Index: (`participants` contains, `status`).

## Key functions
- Client: `pactCreate`, `pactAccept`, `pactCommitProgress`, `pactMaybeResolve`, `pactBuildResolution`, `pactTerminatePending`, `pactClaimPayout`, `pactRunMaintenance`, `pactFetch`, `pactCheckInvites`, `modesAdoptPact`.
- Server: `progressNudges` (lib/pact.js) via [[onPactWrite]].

## Data it touches
- [[users]] (`grit`, `modes.active`, `friends`), [[gritLedger]]

## Connected to
- [[Pact Mode]], [[Modes]], [[onPactWrite]], [[Security Rules]], [[Firestore Indexes]], [[Server Pact Test]], [[Modes Browser Test]]

## If you change this
- The progress maths is ported, not shared, between app.js and functions/lib/pact.js — keep them identical or nudges fire at the wrong time.
- Rules pin the other side's term and progress by equality; a partner may only write their own keys.
- Because nothing server-side resolves pacts, a pact whose end date passes while both partners are away stays `active` (and its result push is delayed) until one of them opens the app.

## Where in the code
- app.js — MODES section, "PACT — the only mode two accounts can see" and the Pact setup sheets.
- functions/index.js — `onPactWrite`; functions/lib/pact.js.
