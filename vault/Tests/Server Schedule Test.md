---
type: test
sources: [functions/test/schedule.test.js, functions/lib/schedule.js]
last_verified: 2026-10-05
---
# Server Schedule Test

**In one line:** functions/test/schedule.test.js (17 tests) proves the reminder fire-time maths — HH:mm and IANA validation, the Asia/Kolkata fallback, today-vs-tomorrow, DST spring-forward and fall-back, timezone changes and malformed input — the part of reminders that cannot be eyeballed.

## How it works
- Pure Luxon computations, no emulator: e.g. 08:00 IST → 02:30 UTC; a time inside the missing DST hour resolves forward without drifting; ambiguous fall-back times stay consistent; fixed offsets are rejected.

## Key functions
- `isValidLocalTime`, `isValidTimezone`, `resolveTimezone`, `computeNextSendDate`, `getLocalDateString`.

## Data it touches
- none

## Connected to
- [[Reminder Scheduling]], [[sendDueReminders]], [[onReminderWrite]], [[Test Suites Overview]]

## If you change this
- These run in CI before every functions deploy; a failure blocks the deploy.

## Where in the code
- functions/test/schedule.test.js.
