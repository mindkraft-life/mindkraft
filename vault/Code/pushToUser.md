---
type: code
sources: [functions/index.js, functions/lib/push.js]
last_verified: 2026-10-05
---
# pushToUser

> [!summary] In plain words
> The server's "send this person a notification" helper, used for gifts, friend requests, pacts and challenges. It quietly skips anyone who has not turned notifications on.
>
> **How it connects:** Explained in [[Push Delivery]].

**In one line:** `pushToUser(uid, payload)` (functions/index.js) sends one Web Push to a user if their `users/{uid}.pushSubscription` is usable, deletes the subscription if the push service says it is dead, and never throws — every cross-account notification (gifts, friend requests, pacts, Versus) goes through it.

## How it works
- `ensureWebPush()` → read `users/{uid}` → `isUsableSubscription` → `sendPush(subscription, payload)` → on 404/410 `update({pushSubscription: FieldValue.delete()})`; all errors logged and swallowed.
- Callers: [[onGiftReceived]], [[onGiftConsumed]], [[onFriendRequestWrite]], [[onPactWrite]] (incl. `sendPactProgressNudges`), [[onVersusWrite]]. [[sendDueReminders]] has its own batched equivalent in `processUser`.

## Key functions
- `pushToUser`, `ensureWebPush`, `configureWebPush`, `isUsableSubscription`, `sendPush`.

## Data it touches
- [[users]] (`pushSubscription`)

## Connected to
- [[Push Delivery]], [[Service Worker]], [[Server Deploy Test]]

## If you change this
- Throwing from here would fail the trigger and could retry or lose other pushes; keep it non-throwing.
- The subscription delete is reverted by the client's next full-document save.

## Where in the code
- functions/index.js — "GIFT NOTIFICATIONS" section.
