---
type: engine
sources: [app.js]
last_verified: 2026-10-05
---
# Activity Index

> [!summary] In plain words
> A quick-lookup list the app builds so it can find any activity instantly instead of searching through every life area and path each time. It rebuilds itself whenever activities are added, removed or edited.
>
> **How it connects:** It speeds up [[Routines]], the [[Daily Planner]] and [[Quests]].

**In one line:** `mkActivityIndex()` is a memoized `Map` from activity id to `{activity, dim, path, dimIndex, pathIndex, actIndex}` that replaces full tree walks, invalidated by a structural fingerprint and by explicit `mkTouchActivityIndex()` calls.

## How it works
- Activities live three levels deep: `userData.dimensions[].paths[].activities[]`. Looking one up by id used to walk the whole tree inside render loops.
- `_actTreeFingerprint()` encodes dimension count, path counts and activity counts; any add/delete/move changes it and forces a rebuild on next access.
- In-place edits (rename, XP change) do not change counts, so callers call `mkTouchActivityIndex()` — `saveActivity` and `loadUserData` both do.
- `findActivityById(id)` is the main reader. Many features keep their own finders over the same tree (`gritFindActivity`, `ttFindActivity`, `qcFindActivity`, `findDimForActivity`, the quest `_buildActIdx`/`actMeta`) — not all use this index.
- Server code mirrors the lookup in functions/lib/activities.js (`findActivity`).

## Key functions
- `findActivityById` — see [[findActivityById]].
- `mkActivityIndex`, `mkTouchActivityIndex`, `_actTreeFingerprint`.

## Data it touches
- [[users]] (`dimensions` tree)

## Connected to
- [[Activities]], [[Daily Planner]], [[Routines]], [[Dimensions And Paths]], [[Quests]], [[Reminders]], [[Loading And Migration]]

## If you change this
- Replacing `window.userData` wholesale (restore backup, import) must be followed by `mkTouchActivityIndex()` or a stale entry can be served when counts happen to match.
- Holders of a fresh activity object should pass the object rather than re-finding it (the planner does this on purpose).

## Where in the code
- app.js — "Activity index" section, just before "Groups — data model & helpers".
