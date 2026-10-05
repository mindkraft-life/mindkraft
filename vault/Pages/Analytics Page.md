---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Analytics Page

> [!summary] In plain words
> Your statistics: totals, a chart of points over time, a calendar of active days, a full history of every change to your points (where you can also add or remove something you forgot), your top activities and streaks, how often you do each thing, progress in each life area, and which activities you tend to do on the same day. Everything can be filtered by area, path, activity and time period.
>
> **How it connects:** The history list is explained in [[Activity History Log]], fixing past days in [[Retroactive History Editing]], and progress per life area in [[Dimension Levels]].

**In one line:** More › Analytics shows summary stat tiles, an XP-over-time canvas chart (cumulative or daily, with comparison series), a month calendar, the Activity History log with retroactive editing, XP and streak leaderboards of activities, completion frequency, dimension progress and "activity pairs" done on the same day — all filterable by dimension, path, activity and period.

## How it works
- `switchTab('analytics')` → `renderAnalytics()`: `getAllActivitiesFlat` → `filterByScope(window.analyticsState)` → `getCompletionLog` → `filterByPeriod`, then `renderAnalyticsSummary`, `renderXPChart` (hand-drawn on `<canvas>`, ranges 1M–All, overlays via `addChartOverlay`), `renderXPLeaderboard`, `renderStreakBoard`, `renderFrequencyChart`, `renderCombosPanel`, `renderCalendar` (with `calendarNav`, activity filter, `toggleCalTip`), `renderDimProgress`, `renderActivityHistory`.
- Filters: `toggleAnalyticsFilterPanel`, `setAnalyticsFilter`, `applyAnalyticsFilters`, enhanced selects ([[Searchable Dropdown]]).
- Weeks start on Monday; summary totals include ghost XP (mode XP, deleted activities) only in the unfiltered view.

## Key functions
- `renderAnalytics`, `renderAnalyticsSummary`, `renderXPChart`, `buildSeriesPoints`, `filterByTimeRange`, `setChartTimeRange`, `setChartMode`, `populateChartOverlayDropdown`, `addChartOverlay`, `removeChartOverlay`, `renderCalendar`, `renderXPLeaderboard`, `renderStreakBoard`, `renderFrequencyChart`, `renderCombosPanel`, `renderDimProgress`, `renderActivityHistory`, `getCompletionLog`, `filterByScope`, `filterByPeriod`.

## Data it touches
- [[users]] (activities' history, `deletedActivityLog`, `modeXPLog`, `xpTodayGhost`, `xpDeletedGhost`, dimensions, projects)

## Connected to
- [[Activity History Log]], [[Retroactive History Editing]], [[Dimension Levels]], [[Searchable Dropdown]], [[Dates Days And Weeks]], [[Tab Switching]], [[Payout Browser Test]]

## If you change this
- Several render targets no longer exist in the markup and their functions return early: `renderTimeOfDay` (`#timeOfDayChart`), `renderHistoryEdit` (`#historyEditList`), and the `#xpToday` / `#completedToday` / `#longestStreak` stats that `updateDashboard` still computes.

## Where in the code
- index.html — `#analyticsTab`.
- app.js — Analytics section (`renderDimProgress` through `renderActivityHistory`).
