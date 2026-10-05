---
type: test
sources: [functions/test/pipeline.test.js, functions/lib/quest-composer.js]
last_verified: 2026-10-05
---
# Server Pipeline Test

> [!summary] In plain words
> Replays a real example — planning a video-production quest — to make sure the AI planner uses all the right activities.
>
> **How it connects:** Guards the [[Quest Composer]].

**In one line:** functions/test/pipeline.test.js (3 tests) replays the real case that once failed — a video-production quest built from activities the user already has — checking that every pipeline stage reaches the model, a full production pipeline survives validation intact, and a nine-leaf quest may introduce three new practices.

## How it works
- Builds the activity menu and a model-shaped spec, runs `activityMenu`, `buildComposePrompt`, `validateSpec`, and checks `newActivityAllowance`.

## Key functions
- `activityMenu`, `buildComposePrompt`, `validateSpec`, `newActivityAllowance`.

## Data it touches
- fixtures shaped like [[users]]

## Connected to
- [[composeQuest]], [[Quest Composer]], [[Server Quest Composer Test]], [[Test Suites Overview]]

## If you change this
- Re-introducing a recency filter in `activityMenu` would fail the first test.

## Where in the code
- functions/test/pipeline.test.js.
