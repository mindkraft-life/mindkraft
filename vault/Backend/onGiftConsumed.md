---
type: backend
sources: [functions/index.js]
last_verified: 2026-10-05
---
# onGiftConsumed

> [!summary] In plain words
> When someone uses a double-points boost you gave them, this server helper tells you — and whether they said thanks.
>
> **How it connects:** Part of [[Social Gifting]]; it uses [[Push Delivery]].

**In one line:** `onGiftConsumed` is a Firestore trigger on the sender's `users/{senderUid}/giftsSent/{giftId}` mirror that pushes the sender when a double-XP gift they sent was used (and whether they were thanked).

## How it works
- `onDocumentWritten('users/{senderUid}/giftsSent/{giftId}')`, region asia-south1.
- Ignores creates (the sender's own write) and deletes.
- Fires only on `status: pending → consumed` for `type: 'xp_boost'`; shields have no consumption beat.
- Body: "<receiver> used the double XP you sent." plus ", and said thanks." when `thanked` is true (set in the same write by the receiver's `giftSyncMirror`).

## Key functions
- `onGiftConsumed`, `pushToUser`.

## Data it touches
- [[giftsSent]], [[users]]

## Connected to
- [[Social Gifting]], [[onGiftReceived]], [[Push Delivery]], [[pushToUser]]

## If you change this
- The receiver must keep writing `status` and `thanked` in one update, otherwise this fires without the thanks.

## Where in the code
- functions/index.js — `exports.onGiftConsumed`.
