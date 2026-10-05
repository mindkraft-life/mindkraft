---
type: backend
sources: [functions/index.js, functions/lib/schedule.js]
last_verified: 2026-10-05
---
# onReminderWrite

> [!summary] In plain words
> Whenever a reminder is created or its time changes, this server helper works out exactly when it should next go off in that person's time zone, and stops anyone from having more than five activity reminders switched on at once.
>
> **How it connects:** It prepares [[Reminders]] for the every-minute sender, using [[Reminder Scheduling]].

**In one line:** `onReminderWrite` is a Firestore trigger on `users/{uid}/reminders/{reminderId}` that computes `nextSendAt` with real timezone maths whenever the time, zone or active flag changes (or the schedule is missing), and forces an activity reminder back off if turning it on would exceed the five-reminder cap.

## How it works
- `onDocumentWritten('users/{uid}/reminders/{reminderId}')`, region asia-south1.
- Ignores deletes. Acts only if `localTime`, `timezone` or `active` changed, or the reminder is active with no `nextSendAt` (the client always writes `null`).
- Invalid `localTime` → set `active: false`.
- Cap backstop: an `activity` reminder turning on while 5 others are active → forced back to inactive (`MAX_ACTIVITY_REMINDERS`).
- Inactive → leave `nextSendAt` alone.
- Computes `nextSendTimestamp(localTime, timezone)`; skips the write if within 60 s of the stored value; if `localTime` changed, clears `lastSentDate` so a later time today still fires today.
- Its own writes do not retrigger work because only the relevant fields are compared.

## Key functions
- `onReminderWrite`, `nextSendTimestamp`, `isValidLocalTime`, `computeNextSendDate`.

## Data it touches
- [[reminders]]

## Connected to
- [[sendDueReminders]], [[createActivityReminder]], [[Reminders]], [[Reminder Scheduling]], [[Modes]]

## If you change this
- Adding another field that affects fire time requires adding it to the `relevantChanged` check.
- Removing the 60 s no-op guard creates a write loop with the sender's own updates.

## Where in the code
- functions/index.js — `exports.onReminderWrite`.
