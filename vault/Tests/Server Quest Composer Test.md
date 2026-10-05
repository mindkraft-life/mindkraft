---
type: test
sources: [functions/test/quest-composer.test.js, functions/lib/quest-composer.js]
last_verified: 2026-10-05
---
# Server Quest Composer Test

> [!summary] In plain words
> Checks that the AI planner cleans up messy AI answers properly: no invented activities, sensible size limits, and nothing broken ever reaching the app.
>
> **How it connects:** Guards the [[Quest Composer]].

**In one line:** functions/test/quest-composer.test.js (34 tests) protects how the Quest Composer repairs and validates model output — wrapper tolerance, gathering loose leaves, rejecting empty quests, keeping only real activity ids, clamping frequencies and XP, capping leaves and depth — and how it chooses the activities offered to the model.

## How it works
- Repair: optional spec wrapper; loose leaves gathered into groups; mixes kept; zero valid groups fails.
- Safety: invented `linkedActivityId`s never reach the client; new activities fall back to a real dimension; bogus frequency → weekly; `baseXP` clamped; leaves truncated at 20; excess depth flattened; cadence honours the model, then the requested shape.
- Menu: dormant and never-completed activities are still offered; recency ranks but does not gate.

## Key functions
- `validateSpec`, `validateGroup`, `validateLeaf`, `demoteExcessNewActivities`, `activityMenu`, `buildCtx`.

## Data it touches
- fixtures shaped like [[users]]

## Connected to
- [[composeQuest]], [[Quest Composer]], [[Server Pipeline Test]], [[Test Suites Overview]]

## If you change this
- The client's `qcValidateGroup` / `qcValidateLeaf` must change in step; only the server copy is unit-tested.

## Where in the code
- functions/test/quest-composer.test.js.
