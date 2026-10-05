---
type: feature
sources: [app.js]
last_verified: 2026-10-05
---
# Retroactive History Editing

> [!summary] In plain words
> Lets you fix the last seven days: add something you did but forgot to tick, or remove a wrong entry or an automatic penalty. After a change, the app recalculates your totals, streak and levels from your history.
>
> **How it connects:** Done from the [[Activity History Log]] on the [[Analytics Page]]. It updates [[Streaks And Shields]], [[XP And Levels]], [[Grit Currency]] and [[Quests]], but deliberately not challenges or modes. Known issues are listed in the [[Change Impact Guide]].

**In one line:** From Activity History a user can log a missed completion for any of the last 7 days ("+ Add missed") or delete a past completion or auto-penalty, after which counters, streak, dimension XP and level are recomputed from history rather than adjusted incrementally.

## How it works
- **Add:** `openRetroPicker(dateStr)` lists every activity for that day (`renderRetroPickerList`, searchable, already-done ones greyed unless multi-per-day) → `_retroPickerAdd` → `retroactiveComplete(activityId, dateStr)`: refuses today and anything older than 7 days, inserts `{date: <day>T12:00, xp: baseXP}` in sorted order (cap 365), then `applyRetroactiveRecalculation`.
- **Delete:** `confirmRetroDelete` → `retroactiveDelete(activityId, entryTimestamp)`: today's normal completions must use Undo; today's penalties and past entries (≤7 days) can be removed.
- **Recalculation** (`applyRetroactiveRecalculation`): `recomputeActivityCounters` → `recomputeStreakFromHistory` → `recomputeDimXP` for the activity's dimension → `totalXP += delta` → `recomputeLevelFromTotalXP` → `saveUserData` → `updateDashboard`.
- Hooks: `gritOnRetroComplete` / `gritOnRemoval` (Grit drip and weekly numerator), `updateQuestProgress` / `undoQuestProgress` (quest leaves; penalties never move quests), Daily Planner reconcile wrapper. Versus and Modes deliberately ignore retro edits (only live completions count).
- No streak multiplier and no boosts apply to retro entries — they record plain `baseXP`.

## Key functions
- `retroactiveComplete`, `retroactiveDelete`, `applyRetroactiveRecalculation`, `recomputeActivityCounters`, `recomputeLevelFromTotalXP`, `recomputeDimXP`, `recomputeStreakFromHistory`, `openRetroPicker`, `renderRetroPickerList`, `_retroPickerAdd`, `filterRetroPicker`, `closeRetroPicker`, `confirmRetroDelete`, `renderHistoryEdit`.

## Data it touches
- [[users]] (activity history and counters, `totalXP`, `level`, `currentXP`, dimension XP, `grit`, `projects`)

## Connected to
- [[Activity History Log]], [[Analytics Page]], [[Streaks And Shields]], [[Dimension Levels]], [[XP And Levels]], [[Grit Weekly Payout]], [[Quests]], [[Daily Planner]], [[Negative Activities And Skip Penalty]], [[Payout Browser Test]], [[Grit Clawback Test]]

## If you change this
- For a perform-negative activity, `retroactiveComplete` records `+baseXP` and adds XP — the opposite of a live completion (see [[Change Impact Guide]]).
- Custom-frequency activities get no `cycleHistory` entry from a retro add.
- `renderHistoryEdit()` targets `#historyEditList`, which no longer exists, so it always returns immediately; the live editor UI is inside `renderActivityHistory`.

## Where in the code
- app.js — "Retroactive Write Functions" (after `undoActivity`); "Retroactive Recalculation Engine" (after `recordCompletion`); retro picker and `confirmRetroDelete` in the Analytics "History Edit UI" block.
