---
type: feature
sources: [app.js, functions/index.js, test/social/README.md]
last_verified: 2026-10-05
---
# Social Gifting

**In one line:** Users can spend Grit to gift a friend a streak shield (20 Grit) or a double-XP boost (25 Grit, max 3 gifted per month) at half the self-purchase price; shields land in the friend's pool with a push, while boosts stay secret until they double the friend's next completion and a reveal (with an optional one-tap thanks) appears.

## How it works
- **Send:** `giftOpenPicker(uid, type)` (from a friend card or the Rewards shop) → friend/type steps → `giftConfirm` → `giftSend(type, receiverUid, receiverName)`: check cost (`giftCost`), debit Grit, persist (`gritPersist`), then one `writeBatch` creating [[gifts]] (receiver inbox) and [[giftsSent]] (sender mirror) with a client-generated, retry-stable `giftId`; a failed write refunds with a ledger `correction`. Names are denormalized at write time.
- **Receive (login):** `giftOnLogin` → `giftRunInbox` → `giftFetchPending`: shields resolve into `grit.shieldPool` (`giftResolveShield`, consumed before credit); boosts are queued silently.
- **Consume:** `predictCompletionXP` asks `giftPeekFor(activity)` (oldest boost, only if no self-bought boost is armed, never stacking past ×2) → `completeActivity` calls `giftOnCompletion(gift, activity, baseXP, awardedXP)`, which marks it consumed with the XP figures and queues the reveal (`giftQueueReveal`) to show after any level-up card (`giftShowReveal`).
- **Thanks:** the reveal's thank button (no free text) → `giftSyncMirror` updates both copies; failures are retried by `giftSyncOrphanedMirrors` on next login.
- **Sent list:** last five on the Friends page (`giftFetchSent`, `giftRenderSentList`).
- **Pushes:** [[onGiftReceived]] (shields only) and [[onGiftConsumed]] (boost used).

## Key functions
- `giftSend`, `giftCost`, `giftOpenPicker`, `giftConfirm`, `giftPickFriend`, `giftRenderFriendStep`, `giftRenderTypeStep`, `giftEnsureFriendNames`, `giftFetchPending`, `giftResolveShield`, `giftPeekFor`, `giftOnCompletion`, `giftQueueReveal`, `giftShowReveal`, `giftSyncMirror`, `giftSyncOrphanedMirrors`, `giftFetchSent`, `giftRenderSentList`, `giftRunInbox`, `giftOnLogin`, `giftDropBoostRecord`.

## Data it touches
- [[gifts]], [[giftsSent]], [[users]] (`grit`, `friends`), [[gritLedger]]

## Connected to
- [[Grit Shop]], [[Grit Currency]], [[Friends]], [[Friends Page]], [[Rewards Page]], [[Activity Completion]], [[onGiftReceived]], [[onGiftConsumed]], [[Social Browser Test]], [[Rules Test]]

## If you change this
- The gift price is always derived as half the self-purchase price (`GRIT_GIFT_RATIO`); never hand-write a second number.
- The boost must stay silent until consumed; a notification on arrival would break the design.

## Where in the code
- app.js — "SOCIAL GIFTING" section (between Versus and Leaderboard Payouts).
