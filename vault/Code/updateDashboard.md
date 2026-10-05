---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# updateDashboard

**In one line:** `updateDashboard()` refreshes the sticky header (level, XP, progress bar, XP-to-next), prunes old ghost-XP entries, and re-renders only the panels of the currently visible tab — it runs after nearly every state change (about 30 call sites).

## How it works
- Clamps `level` to 100; computes the bar from `calculateXPForLevel(level)`; measures the level SVG only when the level changes; animates the XP counter; pops the level on change.
- Deletes `xpTodayGhost` keys older than `GHOST_XP_RETENTION_DAYS` (35).
- Walks every activity to compute "completed today", "XP today" and "longest streak", and writes them into `#xpToday`, `#completedToday`, `#longestStreak` — elements that no longer exist in index.html.
- Re-renders: Activities (My Activities list, Categories, inline planner when visible), Challenges (`vsRenderTab`), Quests (`refreshProjectsView`), Analytics (`renderDimProgress`).
- Starts the header's alternating XP/% cycle once (`_startProgressAltCycle`).

## Key functions
- `updateDashboard`, `calculateXPForLevel`, `animateCounter`, `renderActivitiesList`, `renderDimensions`, `renderPlanner`, `_startProgressAltCycle`.

## Data it touches
- [[users]] (reads level/XP/history; prunes `xpTodayGhost`)

## Connected to
- [[XP And Levels]], [[Activity List And Grid Views]], [[Daily Planner]], [[Tab Switching]], [[Activity Completion]], [[Analytics Page]]

## If you change this
- It is on the hot path of every tap; the per-activity history walk for the three missing stat elements is pure overhead today.

## Where in the code
- app.js — directly after `loadUserData`.
