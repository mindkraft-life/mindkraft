---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Routines

> [!summary] In plain words
> Routines are named bundles of activities, like "Morning Routine", optionally with a time of day. They power the "By Routine" ordering on the home screen. One special routine, "Active", is refilled automatically every Monday with the activities that count towards that week's Grit bonus.
>
> **How it connects:** Used by [[Activity List And Grid Views]]. The "Active" routine is taken from the [[Grit Weekly Payout]] week.

**In one line:** Routines (stored as `groups`) bundle activities into time-aware blocks like "Morning Routine" with an optional time window, power the "By Routine" sort on My Activities, and include a system "Active" routine that is refilled every Monday from the week's Grit contributors.

## How it works
- `userData.groups[]` = `{id, name, color, timeStart, timeEnd ("HH:MM" or null for all day), activityIds[], collapsed, createdAt, isSystemDefault?}`.
- Membership: an activity belongs to one routine unless it allows multiple completions per day (`activityAllowsMultiGroup`), in which case it may be in several (`setGroupMembership`, `setActivityGroup`, `findGroupsForActivity`).
- Time awareness: `isGroupActiveNow`, `getActiveGroupId`, `getNextUpcomingGroupId` order routines around the current time.
- Defensive `_dedupeGroupsArr` runs on every read to repair an old double-save bug.
- **Active routine:** `syncActiveRoutine()` (called from the Grit week rollover) creates or rewrites the `isSystemDefault: 'active'` group's `activityIds` with this week's contributors; deleting it sets `settings.activeRoutineDismissed`; `restoreActiveRoutine` brings it back.
- Modal: `openGroupModal`, `renderGroupActPicker`, `toggleGroupAct`, `saveGroupFromModal`, `deleteGroupFromModal`, `toggleGroupAllDay`, `_buildGroupTimeOptions` (30-minute steps).
- Console-only helpers: `wipeAllGroups()`, `dedupeGroupsNow()`.

## Key functions
- `getGroups`, `findGroupById`, `findGroupForActivity`, `findGroupsForActivity`, `getActivitiesInGroup`, `addGroup`, `updateGroup`, `deleteGroup`, `setGroupMembership`, `setActivityGroup`, `cleanupGroupsForActivity`, `activityAllowsMultiGroup`, `isGroupActiveNow`, `getActiveGroupId`, `getNextUpcomingGroupId`, `syncActiveRoutine`, `findActiveRoutine`, `activeRoutineSeedIds`, `restoreActiveRoutine`, `openGroupModal`, `saveGroupFromModal`, `deleteGroupFromModal`.

## Data it touches
- [[users]] (`groups`, `settings.activeRoutineDismissed`, `grit.week.contributors`)

## Connected to
- [[Activity List And Grid Views]], [[My Activities Page]], [[Grit Weekly Payout]], [[Activities]], [[Activity Index]]

## If you change this
- The group header comment says "each activity belongs to at most one group", which is no longer true for multi-per-day activities.
- `window.addGroup` is assigned here and then overwritten by the Quest builder's `addGroup`; internal calls still reach the routine version because they use the module-level function.
- Mid-week edits to the Active routine are overwritten on Monday by design.

## Where in the code
- app.js — "Groups — data model & helpers" and "Groups — modal UI" sections (after the Activity index).
- index.html — `#groupModal`.
