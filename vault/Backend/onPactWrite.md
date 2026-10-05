---
type: backend
sources: [functions/index.js, functions/lib/pact.js]
last_verified: 2026-10-05
---
# onPactWrite

> [!summary] In plain words
> Sends Pact notifications: a new invitation, accepted, declined, and the final result to both partners — plus a few encouraging nudges when your partner is halfway or pulling ahead, limited so it never turns into spam.
>
> **How it connects:** Part of [[Pact Mode]]; it uses [[Push Delivery]].

**In one line:** `onPactWrite` is a Firestore trigger on `pacts/{pactId}` that turns Pact status changes into pushes (invite, accepted, declined, resolved for both) and sends at most a few progress nudges (halfway, falling behind) during an active pact.

## How it works
- `onDocumentWritten('pacts/{pactId}')`, region asia-south1.
- **Progress nudges first** (writes that change only progress never reach the status branches): `sendPactProgressNudges` calls `pact.progressNudges(doc)` → writes the bookkeeping patch (`reached50.<uid>`, `gapNudgeCount`, `gapNudgeArmed`) **before** pushing, so a retry or re-entry cannot double-send. Halfway = 50%; gap = 30 points; gap nudges armed/disarmed and capped at 3 per pact.
- **Status pushes:** created (`pending`) → partner; `pending → active` → initiator ("It starts tomorrow"); `pending → declined` → initiator; `→ resolved` → both, with copy for kept / broken by one side / broken by both.
- Names come from the document's `names` map.

## Key functions
- `onPactWrite`, `sendPactProgressNudges`, `pactOtherUid`, `pactDisplayName`, `progressNudges`, `stats`, `items`, `count` (lib/pact.js), `pushToUser`.

## Data it touches
- [[pacts]], [[users]]

## Connected to
- [[Pact Mode]], [[Push Delivery]], [[Server Pact Test]], [[pushToUser]]

## If you change this
- `stats` in lib/pact.js is a port of `pactStats` in app.js — they must agree on both document shapes.
- Pacts have no scheduled resolver: the "resolved" push only fires when a participant's client resolves the pact on its next open.

## Where in the code
- functions/index.js — "PACT NOTIFICATIONS"; functions/lib/pact.js.
