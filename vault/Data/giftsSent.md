---
type: data
sources: [app.js, functions/index.js, test/rules/firestore.rules.test.mjs]
last_verified: 2026-10-05
---
# giftsSent

> [!summary] In plain words
> The sender's own copy of each gift they sent, updated when the friend uses it or says thanks.
>
> **How it connects:** Part of [[Social Gifting]] and listed on the [[Friends Page]].

**In one line:** `users/{senderUid}/giftsSent/{giftId}` is the sender's private mirror of a gift they sent, the only place a pending gift is visible to them, updated by the receiver when the gift is consumed or thanked.

## How it works
- Same shape as [[gifts]]; created in the same `writeBatch` as the inbox copy.
- When the receiver consumes the gift, `giftSyncMirror` writes four fields (`status`, `consumedAt`, `thanked`, `thankedAt`) onto the mirror; if that fails, `giftSyncOrphanedMirrors` retries on the receiver's next login.
- [[onGiftConsumed]] watches this collection: a `pending → consumed` transition on an `xp_boost` pushes the sender ("used the double XP you sent", "and said thanks").
- The Friends page shows the last five (`giftFetchSent`, `giftRenderSentList`).

## Key functions
- `giftSend`, `giftSyncMirror`, `giftSyncOrphanedMirrors`, `giftFetchSent`, `giftRenderSentList`.

## Data it touches
- [[gifts]], [[users]]

## Connected to
- [[Social Gifting]], [[onGiftConsumed]], [[Friends Page]], [[Security Rules]]

## If you change this
- The receiver may touch only those four fields on someone else's mirror; a fifth field is refused by the rules.

## Where in the code
- app.js — SOCIAL GIFTING, "THE SENDER'S OWN SENT LIST" and `giftSyncMirror`.
