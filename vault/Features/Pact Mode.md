---
type: feature
sources: [app.js, functions/index.js, functions/lib/pact.js, test/modes/README.md]
last_verified: 2026-10-05
---
# Pact Mode

**In one line:** Pact Mode is a two-person commitment: each friend stakes 40 Grit and sets their own activities and targets (up to three, combined at least 3) for at least 5 days; if both hit their targets both get their stake back with a bonus, and if either falls short both lose it.

## How it works
- Setup (`pactRenderSetup`): pick a friend (names fetched into `_friendProfileCache`), pick activities/targets (`pactBump`, `pactTargetRowsHtml`), choose days → `pactSend` → `pactCreate` (transaction: debit 40 Grit, create the [[pacts]] doc as `pending`).
- Partner: invite card on the Modes page (`modesInviteCardsHtml`, `pactCheckInvites`) → `pactOpenAccept` → `pactRenderAccept` → `pactDoAccept` → `pactAccept` (their own term, their own 40 Grit) → `active`, starting the next day. Both clients adopt it as their active mode (`modesAdoptPact`).
- Progress: `modesOnCompletion` → `pactCommitProgress(id, activityId, ±1)` writes only the user's own counter.
- Resolution: `pactMaybeResolve` → `pactBuildResolution` (kept: both payouts `modeWagerPayoutFor(stake, days)`; broken: `failedBy` one side or `both`) → each side `pactClaimPayout`; `pactSettleLocal` ends the local mode. Decline, withdraw (`pactWithdraw`, `pactTerminatePending`) and expiry refund the initiator.
- Server: [[onPactWrite]] pushes status changes and halfway/gap nudges.
- Lifecycle rail: `pactStageHtml` / `pactStageOf` (setup → invite sent → … → resolved).

## Key functions
- `pactCreate`, `pactAccept`, `pactCommitProgress`, `pactMaybeResolve`, `pactBuildResolution`, `pactClaimPayout`, `pactTerminatePending`, `pactRunMaintenance`, `pactFetch`, `pactGet`, `pactItems`, `pactCount`, `pactStats`, `pactHit`, `pactImpossible`, `modesAdoptPact`, `pactSettleLocal`, `pactRenderSetup`, `pactSend`, `pactOpenAccept`, `pactDoAccept`, `pactDecline`, `pactWithdraw`, `pactPanelHtml`.

## Data it touches
- [[pacts]], [[users]] (`modes`, `grit`, `friends`), [[gritLedger]]

## Connected to
- [[Modes]], [[onPactWrite]], [[Stake Mode]], [[Friends]], [[Grit Currency]], [[Modes Page]], [[Server Pact Test]], [[Modes Browser Test]], [[Rules Test]]

## If you change this
- Two term shapes must stay readable (single-activity legacy and multi-activity `items`), on client and server.
- No scheduled resolver exists for pacts; resolution waits for a participant's client.
- A pending Pact blocks starting any other mode.

## Where in the code
- app.js — MODES "PACT" block, Pact setup/accept sheets; functions/index.js `onPactWrite`; functions/lib/pact.js.
