---
type: test
sources: [functions/test/activities.test.js]
last_verified: 2026-10-05
---
# Server Activities Test

> [!summary] In plain words
> Checks that the server can find the right activity inside someone's account, notices when one has been deleted, and writes reminder messages using the activity's current name.
>
> **How it connects:** Guards [[Reminders]].

**In one line:** functions/test/activities.test.js (11 tests) protects the server's lookup of activities nested inside `users/{uid}` and the reminder payload copy — so a reminder always names the right, current activity and a deleted one is detected.

## How it works
- `findActivity` finds an activity three levels deep, matches ids across string/number, returns null when deleted, survives missing branches.
- `resolveActivityName` returns the current name (renames picked up), null for deleted, treats a blank name as missing.
- `buildPayload`: general copy verbatim, activity reminders name the activity with a deep-link id and per-activity tags, fall back to the denormalized then a generic name.

## Key functions
- `findActivity`, `resolveActivityName`, `buildPayload`.

## Data it touches
- fixtures shaped like [[users]] and [[reminders]]

## Connected to
- [[sendDueReminders]], [[createActivityReminder]], [[Push Delivery]], [[Test Suites Overview]]

## If you change this
- Changing the activity tree shape in app.js must be mirrored in functions/lib/activities.js and these fixtures.

## Where in the code
- functions/test/activities.test.js.
