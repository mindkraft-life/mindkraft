---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# updateQuestProgress

**In one line:** `updateQuestProgress(activityId)` advances every active quest's leaves that link to that activity by one (up to their required count) and banks finished repetitions, so a completion anywhere in the app moves every quest that uses it.

## How it works
- For each `projects[]` with `status === 'active'`: `migrateProject(p)` → matching activity leaves `completedCount++` (capped at `requiredCount`) → `settleAll(p)`.
- Twin: `undoQuestProgress(activityId)` decrements (cannot un-bank a banked rep).
- Callers: `completeActivity`, `retroactiveComplete` (and `undoActivity` / `retroactiveDelete` for the twin, never for penalties).
- No XP is paid here; quest bonuses are paid on seal (`completeProjectCycle`).

## Key functions
- `updateQuestProgress`, `undoQuestProgress`, `migrateProject`, `allLeaves`, `itemReq`, `settleAll`.

## Data it touches
- [[users]] (`projects`)

## Connected to
- [[Quests]], [[completeActivity]], [[Retroactive History Editing]], [[Payout Browser Test]]

## If you change this
- `migrateProject` runs on every call and drops leaves whose activity no longer exists.

## Where in the code
- app.js — QUESTS "Passive progress (from completeActivity/undoActivity)".
