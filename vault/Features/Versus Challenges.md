---
type: feature
sources: [app.js, functions/index.js, functions/lib/versus.js, index.html, test/versus/README.md]
last_verified: 2026-10-05
---
# Versus Challenges

> [!summary] In plain words
> A bet between two friends. One person proposes targets (up to five activities with counts), a time limit, and a stake of 25 to 100 Grit; the other accepts by matching the stake and choosing which of their own activities count. Whoever finishes all targets first — or is ahead when time runs out — wins the whole pot; a tie gives both stakes back.
>
> **How it connects:** Shown on the [[Challenges Page]]. Progress comes from real ticks ([[Activity Completion]]), stakes use [[Grit Currency]], and deadlines are also enforced by a server helper that announces results by notification ([[Push Delivery]]).

**In one line:** Versus Challenges are head-to-head Grit wagers between two friends — up to five activity requirements with target counts over a set number of days, each side staking the same 25–100 Grit into a shared pot — and they are the whole of the Challenges page.

## How it works
- **Create** (`vsOpenCreate` → `vsRenderCreateForm` → `vsSubmitCreate` → `vsCreateChallenge`): opponent must be a friend; at most 3 live challenges (`VS_MAX_CONCURRENT`) and an activity can be committed to only one; the challenger's stake is debited in the same transaction that creates the [[versusChallenges]] document. Requirement names come from the challenger's activities; a `seed` lets the opponent recreate the activity.
- **Accept** (`vsOpenAccept` walkthrough → map each requirement to one of their activities or create one from the seed via the real activity modal → `vsSubmitAccept` → `vsAcceptChallenge`): equal stake added to the pot, `startedAt`/`endsAt` set. Draft mappings are saved in `userData.vsDraftMappings`. Decline / cancel / expire refund the challenger.
- **Progress:** live completions only — a wrapper on `completeActivity` calls `vsOnCompletion(activityId)` → `vsCommitProgress` (increments the user's own counter; crossing the final target resolves in the same write); `vsOnUndo` reverses. Retroactive edits never count.
- **Resolution:** first to complete everything wins; at the deadline the leader by capped totals wins; a tie refunds both; forfeit (explicit, or deleting a committed activity) hands the pot over. Resolved by any client (`vsRunMaintenance` on login, foreground and tab open) or by [[resolveDueVersusChallenges]]. Each side claims its own payout (`vsClaimPayout`); results are announced once (`vsAnnounceResults`, `userData.vsSeenResults`).
- **Board UI:** `vsRenderTab` / `vsPaint` (pending, active and resolved sections), `vsActiveCard` with hero count, opponent bar and per-requirement breakdown; a live `onSnapshot` while a card is expanded (`vsAttachDetail`); badges for pending invites (`vsUpdateBadges`).

## Key functions
- `vsRunMaintenance` — see [[vsRunMaintenance]].
- `vsCreateChallenge`, `vsAcceptChallenge`, `vsTerminatePending`, `vsDecline`, `vsCancel`, `vsCommitProgress`, `vsResolveDeadline`, `vsForfeit`, `vsConfirmForfeit`, `vsClaimPayout`, `vsBuildResolution`, `vsFetch`, `vsOnCompletion`, `vsOnUndo`, `vsOnLogin`, `vsAnnounceResults`, `vsRenderTab`, `vsPaint`, `vsBoardModel`, `vsOpenCreate`, `vsSubmitCreate`, `vsOpenAccept`, `vsSubmitAccept`, `vsMapExisting`, `vsCreateActivityFor`, `vsCappedTotal`, `vsCommittedActivityIds`, `vsReadBalance`, `vsMirrorBalance`.

## Data it touches
- [[versusChallenges]], [[users]] (`grit`, `friends`, `vsDraftMappings`, `vsSeenResults`), [[gritLedger]], [[publicProfiles]] (friend names)

## Connected to
- [[Challenges Page]], [[onVersusWrite]], [[resolveDueVersusChallenges]], [[Grit Currency]], [[Friends]], [[Activity Completion]], [[Activity Editor Page]], [[Hook Chains]], [[Security Rules]], [[Versus Browser Test]], [[Server Versus Test]], [[Rules Test]]

## If you change this
- Three copies of the resolution rules (client, server lib, security rules) must agree.
- `bonusXP` (20% of base XP × targets) is computed, stored and shown as "+N XP" on the board and accept screen, but nothing awards it.
- The module header still lists `switchSubTab` and a `vsGuardActivityDelete` hook; the current hooks are on `switchTab` and an anonymous `deleteActivity` wrapper.

## Where in the code
- app.js — "VERSUS CHALLENGES" section (after the Map reveal loop, before SOCIAL GIFTING).
- index.html — `#challengesTab` / `#versusContent`.
