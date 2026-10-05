---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Activities

**In one line:** An activity is a tracked habit or task inside the dimension → path → activity tree in `users/{uid}`, with a base XP of 1–50, a frequency, optional negative-XP mode, and its own completion history, streak and shields; creating, editing, moving and deleting them happens in the Activity Editor modal.

## How it works
- **Create/edit:** `openActivityModal(dimIndex, pathIndex, actIndex)` fills the form; `saveActivity(event)` reads it, clamps `baseXP` to 1–50, resolves the target dimension/path (falling back to an "Uncategorized" dimension or per-dimension "Uncategorized" path via `getOrCreateUncategorized` / `getOrCreateUncategorizedPath`), and either edits in place (moving between paths if changed) or pushes a new activity with id `Date.now().toString()`.
- **Activity limit:** new activities are blocked by `canAddActivity()` when the total reaches `getActivityLimit(level)` = `min(250, 2^(level-1) + 3)` (4 at level 1).
- **Delete:** `deleteActivity` confirms, preserves today's XP in `xpTodayGhost`, adds lifetime history XP to `xpDeletedGhost`, logs the activity to `deletedActivityLog` (`_logDeletedActivity`), splices it out and removes it from routines (`cleanupGroupsForActivity`).
- **Occasional + delete-on-complete:** a one-time task can delete itself when completed (`deleteOnComplete`).
- The form also carries Map mastery fields (`techTreeMastery`) when opened from the Map accept flow, and hands off to Versus when creating an activity for a challenge requirement.
- Wrappers on `saveActivity`, `deleteActivity` and `closeActivityModal` add Versus and Map behaviour (see [[Hook Chains]]).

## Key functions
- `openActivityModal`, `saveActivity`, `editActivity`, `deleteActivity`, `closeActivityModal`, `_logDeletedActivity`, `canAddActivity`, `getActivityLimit`, `getActivityCounts`, `getOrCreateUncategorized`, `getOrCreateUncategorizedPath`, `populateActivityPathSelect`, `toggleAdvancedSection`, `toggleNegativeXpSection`, `setActivityXP`.

## Data it touches
- [[users]] (`dimensions[].paths[].activities[]`, `xpTodayGhost`, `xpDeletedGhost`, `deletedActivityLog`, `groups`)

## Connected to
- [[Activity Editor Page]], [[Activity Frequencies And Cycles]], [[Activity Completion]], [[Negative Activities And Skip Penalty]], [[Dimensions And Paths]], [[Routines]], [[Versus Challenges]], [[Tech Tree Map]], [[Activity Index]], [[First-Run Tutorial]], [[findActivityById]]

## If you change this
- Activity ids are referenced by reminders, routines, planner items, quests, Map nodes, modes, Versus mappings and Pact terms; deleting an activity leaves some of those references dangling (each feature handles a missing activity its own way — e.g. reminders deactivate, Versus forfeits).
- `saveActivity` calls `mkTouchActivityIndex()` because in-place edits don't change the index fingerprint.
- Flags `pinned`, `archived` and `deleted` are read by sorting and Grit/Map filters but nothing ever sets them.

## Where in the code
- app.js — "uncategorized" helpers, `openActivityModal` … `_logDeletedActivity` (after the Categories action menu); activity limit just before `renderDimensions`.
- index.html — `#activityModal`.
