---
type: data
sources: [app.js, functions/index.js, functions/lib/modes.js, firestore.indexes.json]
last_verified: 2026-10-05
---
# reminders

> [!summary] In plain words
> The list of scheduled notifications for each person — the daily reminder, activity reminders and mode nudges — each with the exact moment it should next go off.
>
> **How it connects:** Created from the [[Settings Page]] and by [[Habit Mode]], sent by the server ([[Reminder Scheduling]], [[Push Delivery]]). See [[Reminders]].

**In one line:** `users/{uid}/reminders/{reminderId}` holds every scheduled push for a user — the singleton daily reminder (`general`), up to five activity reminders, and mode reminders (`mode-…`) — each with a precomputed `nextSendAt` that the per-minute sender queries.

## How it works
- Fields: `type` (`general` | `activity` | `mode`), `activityId`, `activityName` (denormalized), `localTime` ("HH:mm"), `timezone` (IANA), `active`, `nextSendAt` (Timestamp, UTC), `lastSentDate` (local YYYY-MM-DD idempotency key), `createdAt`, `updatedAt`. Mode reminders add `modeKind`, `modeId`, `phase`, `windowStart`, `windowEnd`, `why`, `anchor`.
- The client writes `nextSendAt: null`; [[onReminderWrite]] fills it with Luxon maths. [[sendDueReminders]] rolls it forward after every attempt.
- Doc ids: `general` (fixed), auto-ids for activity reminders (created only through [[createActivityReminder]]), `mode-…` ids for mode reminders (batch-synced by `modesSyncNotifications`).
- It is a subcollection on purpose: `saveUserData()` overwrites the parent document and would clobber server-written fields.
- Collection-group index on (`active`, `nextSendAt`) in firestore.indexes.json.

## Key functions
- Client: `writeGeneralReminder`, `deactivateGeneralReminder`, `saveActivityReminder`, `toggleActivityReminder`, `deleteActivityReminder`, `loadRemindersFromFirestore`, `syncUserTimezone`, `modesSyncNotifications`.
- Server: `sendDueReminders` / `processUser`, `onReminderWrite`, `createActivityReminder`, `modeReminderCopy`.

## Data it touches
- [[users]] (parent; `pushSubscription`, `timezone`, activities)

## Connected to
- [[Reminders]], [[Modes]], [[Habit Mode]], [[sendDueReminders]], [[onReminderWrite]], [[createActivityReminder]], [[Reminder Scheduling]], [[Firestore Indexes]], [[Push Delivery]]

## If you change this
- Never write `nextSendAt` from the client — two DST implementations will disagree.
- The five-activity cap is enforced in the callable and backstopped in `onReminderWrite`; client rules allow toggling `active` directly.
- A reminder whose activity no longer exists is deactivated by the sender, not deleted.

## Where in the code
- app.js — "REMINDERS v2" section; Modes `modesSyncNotifications`.
- functions/index.js — `sendDueReminders`, `onReminderWrite`, `createActivityReminder`.
