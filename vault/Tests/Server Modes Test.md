---
type: test
sources: [functions/test/modes.test.js, functions/lib/modes.js]
last_verified: 2026-10-05
---
# Server Modes Test

**In one line:** functions/test/modes.test.js (18 tests) pins the send-time decision for mode reminders: an already-logged habit stays silent, the pre-window nudge names the habit and anchor, the post-window nudge says there is still time, and the morning after a miss quotes the user's own `why` verbatim.

## How it works
- `completedOnLocalDate`: real completions found, penalties ignored, deleted activities safe.
- `previousLocalDate`: month boundaries, leap day, nonsense rejected.
- `modeReminderCopy`: silence cases, wording, renamed activities, ended modes say nothing; the `why` text is never paraphrased.

## Key functions
- `modeReminderCopy`, `previousLocalDate`, `completedOnLocalDate`.

## Data it touches
- fixtures shaped like [[users]] and [[reminders]]

## Connected to
- [[Habit Mode]], [[sendDueReminders]], [[Modes]], [[Test Suites Overview]]

## If you change this
- Copy changes must keep the verbatim-`why` rule.

## Where in the code
- functions/test/modes.test.js.
