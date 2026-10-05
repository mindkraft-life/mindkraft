---
type: feature
sources: [app.js, index.html, test/payout/README.md]
last_verified: 2026-10-05
---
# Quests

> [!summary] In plain words
> A quest is a bigger goal split into steps. Steps can be your real activities (which move forward whenever you do them anywhere in the app) or simple tick-box tasks, grouped into stages that can repeat. When everything is done you "seal" the quest and receive a one-time bonus of points and Grit. Repeating quests start a fresh round after each seal.
>
> **How it connects:** Shown on the [[Quests Page]]. Quests can be drafted by AI ([[Quest Composer]]), are moved forward by [[Activity Completion]], and pay into [[XP And Levels]] and [[Grit Currency]].

**In one line:** A quest (stored in `userData.projects`) is a tree of ordered or unordered groups — repeatable N times — whose leaves are either linked activities or plain tasks with target counts; completing the linked activity anywhere advances the quest, and sealing a finished quest or cycle pays a one-time bonus of XP (20% of the linked base XP) plus Grit.

## How it works
- Project fields: `id`, `name`, `emoji` (icon `ph-<name>`), `status` (`active` | `paused` | `completed` | `archived`), `cadence {type: 'oneoff' | 'recurring'}`, `groups[]`, `dimensionIds[]` / `dimensionId` (inferred from linked activities), `currentCycle`, `cycleHistory[]`, `bonusPaidAt` / `bonusPaidCycles[]`, `createdAt`, `startedCycleAt`, `lastResetAt`.
- Group node: `{id, kind: 'group', name, ordered, repeat, repsDone, children[]}`; leaf: `{id, type: 'activity' | 'task', linkedActivityId?, name, requiredCount, completedCount, resetMode}`. Ordered groups render as pipelines (order is guidance, not a gate); unordered as checklists.
- **Progress:** `updateQuestProgress(activityId)` / `undoQuestProgress` (called from completion, undo and retro edits) bump `completedCount` on every active quest's matching leaves; `settleAll` banks finished repetitions. Task leaves and "Do now" taps use `bumpLeaf` / `undoLeaf` / `tapNextUp`, which route activity leaves through the real completion.
- **Seal:** `completeProjectCycle(id)` — only a fully ready quest/cycle pays; bonus XP = `questPotentialBonus` (20% of base XP × required reps), Grit = `questGritBonus` (effort curve 5–120 based on completions and distinct activities; tasks pay nothing), paid via `payQuestBonus` and `payQuestGrit` (idempotent marker per quest/cycle). Recurring quests clear per-cycle items and start the next cycle; one-offs become `completed`.
- **Lifecycle:** pause, resume, archive, unarchive, reopen, reset (`resetProject` keeps the paid marker), delete.
- **Views:** list (`renderProjects`, sections by status) and detail (`renderProjectDetail` with "What's next", pipelines, rep dots, Do-now panel; pushes a history entry for the back button).
- **Builder:** `openProjectModal` / `saveProject` build the tree from DOM rows (`addGroupCard`, `addLeafRow`, drag to reorder, activity picker); legacy pipelines/stages are migrated (`migrateProject`, `legacyStagesToPipelines`, `pipelinesToGroups`).

## Key functions
- `updateQuestProgress` — see [[updateQuestProgress]].
- `getProjects`, `findProject`, `migrateProject`, `allLeaves`, `settleAll`, `questStats`, `questPotentialBonus`, `questGritBonus`, `questBonusPaid`, `markQuestBonusPaid`, `payQuestBonus`, `payQuestGrit`, `completeProjectCycle`, `renderProjects`, `renderProjectDetail`, `computeWhatsNext`, `bumpLeaf`, `undoLeaf`, `tapNextUp`, `openProjectModal`, `saveProject`, `readTopLevelGroups`, `resetProject`, `deleteProject`, `computeProjectDimensions`.

## Data it touches
- [[users]] (`projects`, user XP, `grit`), [[gritLedger]]

## Connected to
- [[Quests Page]], [[Quest Composer]], [[Activity Completion]], [[Retroactive History Editing]], [[Grit Currency]], [[XP And Levels]], [[Tech Tree Map]] (seals re-evaluate mastery), [[Activity History Log]], [[Hook Chains]], [[Payout Browser Test]]

## If you change this
- The quest module header still says the 20% bonus is paid "through the same completeActivity/undoActivity path"; it is now a lump sum at seal.
- `migrateNode` drops activity leaves whose activity no longer exists, so deleting an activity silently shrinks quests that used it.
- Undo cannot un-bank an already-banked repetition (hard-reset model).
- Grit from quests is one-way: nothing in the quest lifecycle refunds it.

## Where in the code
- app.js — "QUESTS (Projects) — v5 redesign" through the BUILDER section (between the Tech Tree hooks and the Quest Composer).
- index.html — `#projectsTab`, `#projectModal`, `#projectActivityPicker`, `#projectsInfoModal`.
