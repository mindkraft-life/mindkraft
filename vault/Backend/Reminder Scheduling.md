---
type: backend
sources: [functions/lib/schedule.js, functions/index.js]
last_verified: 2026-10-05
---
# Reminder Scheduling

> [!summary] In plain words
> The careful time maths behind reminders: turning "8:00 where I live" into the exact moment to send, correctly across daylight-saving changes and when someone moves time zone.
>
> **How it connects:** Used by the reminder services behind [[Reminders]], following the ideas in [[Dates Days And Weeks]], and checked by the [[Server Schedule Test]].

**In one line:** functions/lib/schedule.js is the pure, Luxon-based maths that turns a reminder's local "HH:mm" and IANA timezone into the next UTC fire time, validates times and zones, and produces the local-date key used to send each reminder at most once a day.

## How it works
- `isValidLocalTime(value)` — strict `HH:mm` 24-hour regex.
- `isValidTimezone(zone)` — must be a real IANA "Area/Location" name; fixed offsets like `+05:30` are rejected because they cannot follow DST.
- `resolveTimezone(zone)` → `{timezone, usedFallback}`; `normalizeTimezone(zone)` → a valid zone or `DEFAULT_TIMEZONE` (`Asia/Kolkata`).
- `computeNextSendDate(localTime, timezone, fromDate)` — the next occurrence strictly after `fromDate` in that zone, correct across DST gaps and overlaps.
- `getLocalDateString(timezone, date)` — the `YYYY-MM-DD` idempotency key stored as `lastSentDate`.
- `MAX_ACTIVITY_REMINDERS = 5`.
- Deliberately free of Firestore and web-push imports so it can be unit-tested directly.

## Key functions
- `isValidLocalTime`, `isValidTimezone`, `resolveTimezone`, `normalizeTimezone`, `computeNextSendDate`, `getLocalDateString`.

## Data it touches
- [[reminders]] (indirectly, via its callers)

## Connected to
- [[sendDueReminders]], [[onReminderWrite]], [[createActivityReminder]], [[Dates Days And Weeks]], [[Server Schedule Test]]

## If you change this
- The deploy workflow runs `npm test` before deploying; schedule tests (DST, zone change, idempotency key) block a bad change.
- The client never computes `nextSendAt` — keep it that way so there is one DST implementation.

## Where in the code
- functions/lib/schedule.js.
