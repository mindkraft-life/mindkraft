---
type: backend
sources: [functions/index.js, functions/lib/push.js, functions/lib/schedule.js, functions/lib/modes.js, functions/lib/activities.js]
last_verified: 2026-10-05
---
# sendDueReminders

> [!summary] In plain words
> A server task that runs every minute, finds every notification that is due for anyone, sends it to the right phone, and then sets when each one should go off next. It skips anything already sent today and switches off reminders for activities that were deleted.
>
> **How it connects:** Delivers [[Reminders]] and [[Habit Mode]] nudges using [[Push Delivery]] and [[Reminder Scheduling]].

**In one line:** `sendDueReminders` is a Cloud Scheduler function that runs every minute, queries every active reminder whose `nextSendAt` has passed across all users, sends each one as a Web Push, and rolls its `nextSendAt` forward whatever happened.

## How it works
- `onSchedule('every 1 minutes')`, region asia-south1, 256 MiB, 120 s timeout, no retries.
- Calls `ensureWebPush()` first (VAPID keys from env).
- Collection-group query on `reminders`: `active == true` and `nextSendAt <= now`, limit `MAX_DUE_PER_RUN` (500).
- Groups due reminders by owner uid and calls `processUser(uid, snaps, now)` once per user (one read of the large `users/{uid}` document).
- Per reminder in `processUser`:
  1. invalid `localTime` → deactivate;
  2. resolve timezone (reminder → user → fallback `Asia/Kolkata`, logged);
  3. `lastSentDate === today` → skip (idempotency) and roll forward;
  4. `type: 'activity'` → re-resolve the activity name; deleted activity → deactivate;
  5. `type: 'mode'` → `modeReminderCopy()` decides the text or "send nothing"; a stale mode → deactivate, otherwise roll forward;
  6. no usable `pushSubscription` → roll forward;
  7. `sendPush(subscription, buildPayload(...))`; success → `lastSentDate = today` and refresh the denormalized `activityName`; failure with 404/410 → delete `users/{uid}.pushSubscription` once for the batch.
- Every path calls `rollForward()` so a reminder can never stay matching the due query.

## Key functions
- `sendDueReminders`, `processUser`, `rollForward`, `nextSendTimestamp`, `ensureWebPush`.
- Libraries: `computeNextSendDate`, `getLocalDateString`, `resolveTimezone`, `isValidLocalTime` ([[Reminder Scheduling]]); `buildPayload`, `sendPush`, `isUsableSubscription` ([[Push Delivery]]); `modeReminderCopy`; `resolveActivityName`.

## Data it touches
- [[reminders]], [[users]]

## Connected to
- [[onReminderWrite]], [[Reminders]], [[Habit Mode]], [[Focus Window]], [[Service Worker]], [[Firestore Indexes]], [[Deploy Pipeline]], [[Server Schedule Test]], [[Server Modes Test]], [[Server Activities Test]]

## If you change this
- The collection-group index (`active`, `nextSendAt`) must exist or the query fails.
- Never skip `rollForward` on a new branch — a due reminder that is not rolled forward is re-read every minute forever.
- The dead-subscription delete is undone by the client's next full-document save (see [[Saving And The Write Invariant]]).
- Cost scales with reminders due per minute, not total users.

## Where in the code
- functions/index.js — `exports.sendDueReminders`, `processUser`, `rollForward`.
