---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Activity History Log

> [!summary] In plain words
> A complete list of every time your points went up or down — ticks, automatic penalties, history from activities you deleted, bonuses from modes and finished quests — grouped by day, with filters for gains, losses and penalties.
>
> **How it connects:** It lives on the [[Analytics Page]]. Its add and remove buttons are [[Retroactive History Editing]]. Entries come from [[Activity Completion]], [[Negative Activities And Skip Penalty]], [[Modes]] and [[Quests]].

**In one line:** Analytics' "Activity History" is a paged, date-grouped list of every XP change — completions, auto-penalties, deleted activities' history, mode XP and quest seal bonuses — with filters for gains, losses and auto-deductions, and the add/remove buttons for retroactive edits.

## How it works
- `renderActivityHistory(reset)` builds one flat log from: every activity's `completionHistory`; `deletedActivityLog` (so deleted activities' history stays visible); `modeXPLog` (Berserk swings, Focus Window bonuses); quest cycle bonuses. Rows with no activity get no delete button.
- Filters: `setHistoryFilter('all'|'positive'|'negative'|'penalty')`; paging via `loadMoreHistory`; collapsible via `toggleActivityHistory`.
- Day headers sum that day's XP; past 7 days get "+ Add missed" ([[Retroactive History Editing]]).
- **Ghost XP:** XP that no history row carries is tracked per local day in `xpTodayGhost` (mode XP, XP of activities deleted that day) and summed by `ghostXPBetween` / `ghostXPOnDay` for "XP Today", weekly totals and XP/hour; entries older than `GHOST_XP_RETENTION_DAYS` (35) are pruned in `updateDashboard`. `xpDeletedGhost` keeps lifetime XP of deleted activities for totals.

## Key functions
- `renderActivityHistory`, `setHistoryFilter`, `loadMoreHistory`, `toggleActivityHistory`, `recordCompletion`, `_logDeletedActivity`, `modeLogXP`, `ghostXPBetween`, `ghostXPOnDay`, `getCompletionLog`.

## Data it touches
- [[users]] (`completionHistory`, `deletedActivityLog`, `modeXPLog`, `projects[].cycleHistory`, `xpTodayGhost`, `xpDeletedGhost`)

## Connected to
- [[Analytics Page]], [[Retroactive History Editing]], [[Modes]], [[Quests]], [[Activities]], [[Negative Activities And Skip Penalty]], [[Payout Browser Test]]

## If you change this
- Logs are capped (`completionHistory` 365 per activity, `deletedActivityLog` 200, `modeXPLog` 200), so very old history silently disappears.
- Mode runs resolved before `modeXPLog` existed are not backfilled.

## Where in the code
- app.js — `renderActivityHistory` (end of the Analytics section); `ghostXPBetween` near the top; `modeLogXP` in the Modes XP block.
