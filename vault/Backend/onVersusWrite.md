---
type: backend
sources: [functions/index.js, functions/lib/versus.js]
last_verified: 2026-10-05
---
# onVersusWrite

> [!summary] In plain words
> Sends challenge notifications: a new challenge, accepted, declined, and the result to both players.
>
> **How it connects:** Part of [[Versus Challenges]]; it uses [[Push Delivery]].

**In one line:** `onVersusWrite` is a Firestore trigger on `versusChallenges/{challengeId}` that pushes the opponent on a new challenge, the challenger on accept or decline, and both players when the challenge resolves (including forfeits and scheduler resolutions).

## How it works
- `onDocumentWritten('versusChallenges/{challengeId}')`, region asia-south1.
- Created `pending` → opponent: "<name> challenged you to “…”. Their stake is already down."
- `pending → active` → challenger; `pending → declined` → challenger.
- `→ resolved` → each participant with `versus.resolutionBody(doc, uid)` (won / lost / tie / forfeit, from their own side).
- Expiry and withdrawal are silent (refunds are claimed on next open).

## Key functions
- `onVersusWrite`, `displayName`, `resolutionBody` (lib/versus.js), `pushToUser`.

## Data it touches
- [[versusChallenges]], [[users]]

## Connected to
- [[Versus Challenges]], [[resolveDueVersusChallenges]], [[Push Delivery]], [[Server Versus Test]], [[pushToUser]]

## If you change this
- Because the scheduler resolves by writing the same document, its result push comes from this trigger — do not add a second push in the scheduler.

## Where in the code
- functions/index.js — "VERSUS CHALLENGE NOTIFICATIONS".
