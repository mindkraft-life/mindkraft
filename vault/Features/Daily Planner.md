---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Daily Planner

> [!summary] In plain words
> A timeline for a day where you place activities or notes at certain times, once or every day. Its tick boxes simply mirror whether you really did the activity today, so ticking in the planner and ticking on the activity card always agree.
>
> **How it connects:** It opens inside the [[My Activities Page]], and ticking a planner slot is an ordinary [[Activity Completion]].

**In one line:** The Daily Planner is an inline day timeline on My Activities where users schedule activities or free-text notes at times (once or recurring), and whose ticks are a projection of the activity's real completion count today rather than a separate checkbox.

## How it works
- Data: `userData.planner = { recurring: [item], days: { 'YYYY-MM-DD': { items: [item], skipRecurring: [itemId] } } }`; item = `{id: 'pl_…', activityId | null, time: 'HH:MM' | '', title}`.
- UI: `togglePlannerInline` swaps the activity list for the planner; `renderPlanner` draws the date title, a scrollable day strip (`renderPlannerCalStrip`), the timeline (timed items by clock, then untimed), a "now" marker; `setPlannerDate` / `openPlannerDatePicker` move between days; past days are read-only.
- Add/remove: `openPlannerAddModal` (activity or note, optional recurring) → `savePlannerItem`; `openPlannerDeleteMenu` → `executePlannerDelete` ("today only" for recurring = `skipRecurring`, or permanent).
- **Reconciliation:** ticking a slot calls `completeActivityById` / `undoActivityById` (full completion chain). Wrappers on `completeActivity`, `undoActivity`, `retroactiveComplete` and `retroactiveDelete` call `plannerReconcileActivityToday(activity)`, which makes the number of ticked slots for that activity today equal its real completions today (earliest open slot fills, latest ticked clears).
- Saves are optimistic (`debouncedSaveUserData`).

## Key functions
- `ensurePlannerData`, `getPlannerDay`, `setPlannerDate`, `plannerSlotsFor`, `plannerSetSlotDone`, `plannerReconcileActivityToday`, `plannerRerenderIfVisible`, `renderPlanner`, `renderPlannerCard`, `renderPlannerCalStrip`, `renderNowMarker`, `plannerCompleteSlot`, `plannerUndoSlot`, `openPlannerAddModal`, `savePlannerItem`, `openPlannerDeleteMenu`, `executePlannerDelete`, `togglePlannerInline`, `formatPlannerDate`, `formatTime12`, `localDateStr`.

## Data it touches
- [[users]] (`planner`, activity `completionHistory`)

## Connected to
- [[My Activities Page]], [[Activity Completion]], [[Hook Chains]], [[Retroactive History Editing]], [[Activity Index]], [[updateDashboard]]

## If you change this
- Never write slot `completed` booleans directly; they are derived from completions (that was the old two-sources-of-truth bug).
- `planner.days` keeps an entry for every day that had items or skips; it is never pruned.

## Where in the code
- app.js — "Daily Planner" section (after Profile toggles) and the planner hooks/add-modal block after the Groups modal.
- index.html — `#activitiesInlinePlanner`, `#plannerAddModal`.
