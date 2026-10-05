---
type: backend
sources: [functions/index.js, functions/lib/activities.js, functions/lib/schedule.js, app.js]
last_verified: 2026-10-05
---
# createActivityReminder

> [!summary] In plain words
> When you add a reminder for a specific activity, the request goes to this server helper. It checks that the activity exists, that it does not already have a reminder, and that you are under the limit of five, and only then creates it.
>
> **How it connects:** Used from the [[Settings Page]]; part of [[Reminders]].

**In one line:** `createActivityReminder` is an HTTPS callable that creates a per-activity reminder document server-side, so the "max five active" cap, "one reminder per activity" rule and "activity must exist" check are enforced in a transaction with a synchronous error back to the client.

## How it works
- `onCall`, region asia-south1. Requires `request.auth`.
- Validates `activityId` and `localTime` (HH:mm); reads `users/{uid}`; `findActivity()` must find the activity in the caller's own tree.
- Timezone: the client-sent zone if it is a valid IANA name, else the stored `users/{uid}.timezone`, normalized.
- Transaction: reads all `type == 'activity'` reminders; throws `already-exists` for a duplicate activity and `resource-exhausted` at 5 active; then sets the new document with `nextSendAt` already computed.
- Returns `{ id, activityId, activityName, localTime, timezone, active: true }`.
- Client caller: `saveActivityReminder` → `httpsCallable(functions, 'createActivityReminder')`. Edits and toggles go straight to Firestore (`updateDoc`), not through this callable.

## Key functions
- `createActivityReminder`, `findActivity`, `isValidLocalTime`, `isValidTimezone`, `normalizeTimezone`, `nextSendTimestamp`.

## Data it touches
- [[reminders]], [[users]]

## Connected to
- [[Reminders]], [[Settings Page]], [[onReminderWrite]], [[sendDueReminders]], [[Firebase Client]]

## If you change this
- The client also defines `MAX_ACTIVITY_REMINDERS = 5` for its UI; the server constant lives in functions/lib/schedule.js. Keep them equal.
- Errors surface to users through `reminderErrorMessage()` in app.js; new error codes need copy there.

## Where in the code
- functions/index.js — `exports.createActivityReminder`.
- app.js — `window.saveActivityReminder`.
