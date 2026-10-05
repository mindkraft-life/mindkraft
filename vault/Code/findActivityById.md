---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# findActivityById

**In one line:** `findActivityById(activityId)` returns the activity object with that id in O(1) through the memoized activity index, or `null`; it is used by routines, the planner and quest leaves.

## How it works
- `mkActivityIndex().get(id)` — rebuilt when the dimension/path/activity counts change or after `mkTouchActivityIndex()`.
- Callers: `activeRoutineSeedIds`, `getActivitiesInGroup`, `setGroupMembership`, `renderGroupActPicker`, `plannerReconcileActivityToday`, `bumpLeaf`, `undoLeaf`, `itemPerformable`.
- Other features use their own finders (`gritFindActivity`, `ttFindActivity`, `qcFindActivity`, `findDimForActivity`).

## Key functions
- `findActivityById`, `mkActivityIndex`, `mkTouchActivityIndex`.

## Data it touches
- [[users]] (`dimensions` tree)

## Connected to
- [[Activity Index]], [[Routines]], [[Daily Planner]], [[Quests]]

## If you change this
- After in-place edits or wholesale replacement of `userData`, call `mkTouchActivityIndex()` or this can return a stale object.

## Where in the code
- app.js — "Activity index" section.
