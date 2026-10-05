---
type: backend
sources: [functions/index.js]
last_verified: 2026-10-05
---
# onGiftReceived

> [!summary] In plain words
> When a friend sends you a shield, this server helper sends you a notification saying so. Double-points boosts are meant to be a surprise, so they deliberately send nothing.
>
> **How it connects:** Part of [[Social Gifting]]; it uses [[Push Delivery]].

**In one line:** `onGiftReceived` is a Firestore create trigger on `users/{receiverUid}/gifts/{giftId}` that pushes "<sender> sent you a shield." to the receiver — and deliberately stays silent for double-XP gifts, which are meant to be a surprise.

## How it works
- `onDocumentCreated('users/{receiverUid}/gifts/{giftId}')`, region asia-south1.
- Returns unless `type === 'shield'` and `status === 'pending'`.
- Sends through `pushToUser(receiverUid, {title, body, tag: 'mindkraft-gift-<giftId>', data: {type: 'gift'}})`; the service worker routes a tap to the Friends tab.
- Uses the denormalized `senderName`; never reads another user's profile.

## Key functions
- `onGiftReceived`, `pushToUser`.

## Data it touches
- [[gifts]], [[users]] (receiver's `pushSubscription`)

## Connected to
- [[Social Gifting]], [[onGiftConsumed]], [[Push Delivery]], [[Service Worker]], [[pushToUser]]

## If you change this
- Announcing `xp_boost` gifts would break the gifting design (the reveal happens on the next completion).

## Where in the code
- functions/index.js — "GIFT NOTIFICATIONS", `exports.onGiftReceived`.
