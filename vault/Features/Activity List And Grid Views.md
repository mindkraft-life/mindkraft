---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Activity List And Grid Views

**In one line:** The My Activities page renders activities either as a sorted, grouped list of cards or as a bento grid of resizable tiles, with four sort modes, per-activity tile sizes, a long-press action menu, and the state saved in settings.

## How it works
- `renderActivitiesList()` precomputes per-activity state once (completed today, can complete, scheduled day, streak, shields), sorts with the current mode and renders groups.
- Sort modes (`SORT_OPTIONS`): `by-routine` (By Routine — groups by [[Routines]]), `smart` (Today's Focus), `grouped` (by frequency), `streak-high`. Default is `smart` under 10 activities, else `grouped`; `setDefaultActivitySort` saves `settings.activitySort`.
- List view: `renderActivityCards` / `renderCard` (expand with `toggleCardExpand`, collapsible groups via `toggleActivityGroup`).
- Grid view: `toggleActivityView` flips `settings.activityViewMode`; `renderActivityGridCards` / `renderGridSection` lay out tiles; tile size per activity in `settings.gridCardTypes` (Small, Wide, Tall, Square, Column, Row, Showcase via `openCardTypePicker` / `selectCardType`); tap completes, long-press (`_gcPointerDown` … `_gcPointerUp`) opens `openGridActionMenu`; `openGridCardOverlay` shows the full card.
- Floating "+XP" / "+Grit" numbers spawn on completion.
- The inline Daily Planner replaces the list when toggled on ([[Daily Planner]]).

## Key functions
- `renderActivitiesList`, `renderActivityContent`, `renderActivityCards`, `renderCard`, `renderActivityGridCards`, `renderGridSection`, `toggleActivityView`, `updateViewToggleIcon`, `toggleFilterPanel`, `renderFilterOptions`, `applyActivitySort`, `setDefaultActivitySort`, `getCurrentSort`, `toggleCardExpand`, `toggleActivityGroup`, `openGridActionMenu`, `openCardTypePicker`, `selectCardType`, `openGridCardOverlay`, `completeActivityById`, `undoActivityById`.

## Data it touches
- [[users]] (`settings.activitySort`, `settings.activityViewMode`, `settings.gridCardTypes`, activities, `groups`)

## Connected to
- [[My Activities Page]], [[Activity Completion]], [[Routines]], [[Daily Planner]], [[Streaks And Shields]], [[Tech Tree Map]] ("Add to web" in the grid menu), [[updateDashboard]]

## If you change this
- `updateDashboard` re-renders this list after every completion when it is visible; render cost matters on large accounts.
- Sorting reads `activity.pinned`, which nothing sets.

## Where in the code
- app.js — "Activity Sort & Filter" through `completeActivityById` / `undoActivityById` (between `updateDashboard` and the activity limit).
- index.html — `#activitiesSubMyActivities`, `#gridCardOverlay`, `#cardTypePicker`.
