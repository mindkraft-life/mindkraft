---
type: backend
sources: [functions/lib/push.js, functions/index.js, app.js, sw.js]
last_verified: 2026-10-05
---
# Push Delivery

> [!summary] In plain words
> How phone notifications are actually sent. Each phone that allows notifications gives the app a private delivery address, and the server sends messages to that address, signed with a secret key so phones know they are genuine. Addresses that stop working are cleared.
>
> **How it connects:** Used by [[Reminders]], [[Social Gifting]], [[Friends]], [[Pact Mode]] and [[Versus Challenges]], and received on the phone by the [[Service Worker]].

**In one line:** Mindkraft sends notifications as raw Web Push signed with VAPID (not Firebase Cloud Messaging) to the single `pushSubscription` stored on `users/{uid}`, through `sendPush` in functions/lib/push.js, with every cross-account notification going through `pushToUser()`.

## How it works
- **Subscribe (client):** `subscribeToPush()` registers `PushManager.subscribe` with the hard-coded public `VAPID_PUBLIC_KEY`, stores `{endpoint, keys}` at `users/{uid}.pushSubscription`, and saves. One subscription per user — the latest device wins.
- **Configure (server):** `ensureWebPush()` calls `configureWebPush()` with `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_CONTACT_EMAIL` from the environment on every send path (each function has its own container; doing it once at module scope broke deploys and caused 401s).
- **Send:** `buildPayload(reminder, activityName, modeCopy)` builds `{title, body, tag, data: {type, activityId, modeKind}}` for `general`, `activity` and `mode` reminders; social triggers build their own payloads (`gift`, `friend`, `pact`, `versus`). `sendPush` never throws; 404/410 mark the subscription dead.
- **Dead subscriptions:** the server deletes `users/{uid}.pushSubscription` — which the client's next full-document save writes back from memory.
- **Fallback:** `scheduleReminder()` runs an in-tab timer for the daily reminder only when the device has no push subscription (chiefly iOS Safari outside a PWA).
- **Receive:** the service worker shows the notification and deep-links on tap.

## Key functions
- `configureWebPush`, `isUsableSubscription`, `buildPayload`, `sendPush` (lib/push.js; 404 and 410 count as dead); `ensureWebPush`, `pushToUser` (index.js); `subscribeToPush`, `urlBase64ToUint8Array`, `scheduleReminder`, `ensureNotificationPermission` (app.js).

## Data it touches
- [[users]] (`pushSubscription`)

## Connected to
- [[pushToUser]], [[sendDueReminders]], [[onGiftReceived]], [[onGiftConsumed]], [[onFriendRequestWrite]], [[onPactWrite]], [[onVersusWrite]], [[Service Worker]], [[Reminders]], [[Deploy Pipeline]], [[Server Deploy Test]]

## If you change this
- Rotating VAPID keys invalidates every stored subscription; the public key is also hard-coded in app.js.
- `data.type` values are a contract with sw.js `notificationclick` routing.
- Multi-device support would need `pushSubscription` to become a list (or a subcollection, to survive the full-document save).

## Where in the code
- functions/lib/push.js; functions/index.js `ensureWebPush`, `pushToUser`; app.js `subscribeToPush`, `scheduleReminder`; sw.js `push`/`notificationclick`.
