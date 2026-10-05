---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# My Activities Page

> [!summary] In plain words
> The home screen. It lists all the habits and tasks you track; tapping one marks it as done and gives you points. A toolbar lets you switch between a list and a grid of tiles, change the order, open the day planner, search, and add a new activity. The bar at the very top always shows your level and how close you are to the next one.
>
> **How it connects:** Ticking something off is explained in [[Activity Completion]], the list and grid in [[Activity List And Grid Views]], the planner in [[Daily Planner]], and adding or editing opens the [[Activity Editor Page]].

**In one line:** Activities › My Activities is the home screen of Mindkraft: a toolbar (grid/list toggle, sort, Daily Planner, search, activity count, Add) above the user's activities as list cards or grid tiles, where one tap completes an activity.

## How it works
- Panel `#activitiesSubMyActivities` inside `#activitiesTab`; it is the default page (`window.currentTab = 'activities'`, nav state Activities/My Activities).
- Toolbar → `toggleActivityView`, `toggleFilterPanel` (sort), `togglePlannerInline` ([[Daily Planner]]), `openActivitySearch` ([[Activity Search]]), `openActivityModal(null, null)` ([[Activity Editor Page]]).
- List/grid rendering and sorting: [[Activity List And Grid Views]]. Completing/undoing: [[Activity Completion]].
- The sticky header above every page shows level, XP and progress ([[XP And Levels]]), the avatar ([[Profile Page]]), the Grit chip and the modes banner.
- Re-rendered by `updateDashboard()` after every change while visible.

## Key functions
- `renderActivitiesList`, `toggleActivityView`, `toggleFilterPanel`, `togglePlannerInline`, `openActivitySearch`, `openActivityModal`, `completeActivityById`.

## Data it touches
- [[users]] (activities, `settings`, `planner`, `groups`)

## Connected to
- [[Activity List And Grid Views]], [[Activity Completion]], [[Daily Planner]], [[Activity Search]], [[Activity Editor Page]], [[Routines]], [[Tab Switching]], [[Bottom Navigation]], [[updateDashboard]]

## If you change this
- This page re-renders on every completion; heavy work in the card renderers is felt on every tap.

## Where in the code
- index.html — `#activitiesTab` › `#activitiesSubMyActivities`.
- app.js — `renderActivitiesList` and the Activity Sort & Filter block.
