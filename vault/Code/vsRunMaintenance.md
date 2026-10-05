---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# vsRunMaintenance

**In one line:** `vsRunMaintenance()` is the Versus catch-up pass run on login, on app foreground (cache older than 60 s), on the Challenges tab and after key actions: it expires lapsed invites, resolves challenges past their deadline, claims any payout owed to this user, announces results once, prunes old cards and updates badges.

## How it works
- Re-entrancy guard `_vsMaintaining`; `vsFetch(false)` (cached list).
- For each: pending past `expiresAt` → `vsTerminatePending(id, 'expired', 'expired_refund')`; active past `endsAt` → `vsResolveDeadline(id)`.
- Re-fetch if anything changed; for terminal challenges `vsClaimPayout(ch)` (transaction credits balance, flips `payoutClaimed[uid]`), toasting returned Grit.
- `vsAnnounceResults()`, `vsPrune()`, `vsUpdateBadges()`.
- Callers: `vsOnLogin`, the visibility handler, `vsRenderTab`, `vsOnCompletion`, `vsCancel`, `vsConfirmForfeit`, the `deleteActivity` wrapper.

## Key functions
- `vsRunMaintenance`, `vsFetch`, `vsTerminatePending`, `vsResolveDeadline`, `vsClaimPayout`, `vsAnnounceResults`, `vsPrune`, `vsUpdateBadges`.

## Data it touches
- [[versusChallenges]], [[users]] (`grit`, `vsSeenResults`), [[gritLedger]]

## Connected to
- [[Versus Challenges]], [[resolveDueVersusChallenges]], [[Challenges Page]], [[App Boot Sequence]]

## If you change this
- Payout claims can only happen here (the server never moves Grit); a user who never reopens the app never receives their winnings.

## Where in the code
- app.js — VERSUS "Lazy maintenance".
