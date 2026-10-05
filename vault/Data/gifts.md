---
type: data
sources: [app.js, functions/index.js, test/rules/firestore.rules.test.mjs]
last_verified: 2026-10-05
---
# gifts

> [!summary] In plain words
> Each person's gift inbox: shields and boosts that friends have sent, waiting to be used.
>
> **How it connects:** Part of [[Social Gifting]]. The sender keeps a matching copy of each gift so both sides can see what happened to it.

**In one line:** `users/{receiverUid}/gifts/{giftId}` is a friend-sent gift (a shield or a double-XP boost) waiting in the receiver's inbox, created by the sender in the same batch as their [[giftsSent]] mirror and consumed by the receiver's device.

## How it works
- Fields: `id`, `type` (`shield` | `xp_boost`), `senderUid`, `senderName`, `receiverUid`, `receiverName` (names denormalized at write time), `sentAt`, `status` (`pending` → `consumed`), `consumedAt`, `consumedActivityId`, `consumedActivityTitle`, `baseXP`, `awardedXP`, `thanked`, `thankedAt`, plus `mirrorSynced` once the sender's mirror is updated.
- Shields resolve on login straight into `grit.shieldPool` (`giftResolveShield`). XP boosts sit silently and double the next completion (`giftPeekFor` → `giftOnCompletion`), oldest first, one per completion, never stacked with a self-bought boost.
- [[onGiftReceived]] pushes the receiver only for shields; boosts are a surprise.
- Rules (per the rules test): only a friend may create, not in their own inbox, with id = doc id, born pending/unthanked/without XP and without extra fields; the receiver may consume and thank; nobody may delete.

## Key functions
- `giftSend`, `giftFetchPending`, `giftResolveShield`, `giftPeekFor`, `giftOnCompletion`, `giftShowReveal`, `giftSyncMirror`, `giftOnLogin`.

## Data it touches
- [[giftsSent]], [[users]] (`grit.shieldPool`, `friends`)

## Connected to
- [[Social Gifting]], [[onGiftReceived]], [[Grit Shop]], [[Activity Completion]], [[Security Rules]], [[Social Browser Test]]

## If you change this
- Consumed is written before the pool is credited, so a failure loses a shield rather than minting one.
- Adding a field means updating the rules' allowed-keys list or creates will be refused.

## Where in the code
- app.js — SOCIAL GIFTING section.
- functions/index.js — `onGiftReceived`.
