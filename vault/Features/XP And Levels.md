---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# XP And Levels

> [!summary] In plain words
> XP are the points you earn. Collecting them moves you up through levels 1 to 100, and each level needs a bit more than the one before. The bar at the top of every screen shows your level and how close you are to the next. A slider in Settings makes levelling faster or slower.
>
> **How it connects:** Points come mostly from [[Activity Completion]], plus quests, the Map and some modes. Reaching a level can unlock [[Level Rewards]] and a shareable picture ([[Level-Up Share Card]]). Your level also limits how many [[Activities]] you can have.

**In one line:** Mindkraft accounts level from 1 to 100 on total XP, where level L needs `round(k × (2L − 1))` XP to clear (k = Level Scaling, default 8.5, adjustable 5–20 in Settings), shown in the sticky header as level, XP and a progress bar.

## How it works
- Stored: `level`, `currentXP` (XP inside the current level), `totalXP` (lifetime, net of negative activities and penalties).
- `calculateXPForLevel(L) = round(getLevelScaling() × (2L − 1))`. Level-ups loop until `currentXP` fits; level-downs happen for negative XP; hard cap at 100 (`currentXP` shows "MAX").
- XP sources: completions ([[Activity Completion]]), retroactive edits (level recomputed from `totalXP` by `recomputeLevelFromTotalXP`), quest seals (`payQuestBonus`), Berserk/Focus mode bonuses (`modesAwardXP`), skip penalties (negative).
- Level Scaling: `previewLevelScaling` / `applyLevelScaling` (Settings) keep `totalXP` and re-derive `level`, `currentXP` and every dimension's level from the new k.
- Header: `updateDashboard()` writes `#currentLevel`, `#currentXP` (animated), `#progressBar`, `#progressPercent`, `#xpToNextDisplay`; `_startProgressAltCycle` alternates "XP" and "% done" every 30 s.
- Level-up: `showLevelUpAnimation()`, global reward unlocks ([[Level Rewards]]), share card ([[Level-Up Share Card]]); `levelStartedAt` / `cardLevelStartedAt` mark level boundaries for the card.
- The activity cap also depends on level: `getActivityLimit(level)`.

## Key functions
- `calculateXPForLevel`, `getLevelScaling`, `recomputeLevelFromTotalXP`, `previewLevelScaling`, `applyLevelScaling`, `toggleLevelScaling`, `showLevelUpAnimation`, `_startProgressAltCycle`, `animateCounter`, `getActivityLimit`.

## Data it touches
- [[users]] (`level`, `currentXP`, `totalXP`, `levelStartedAt`, `cardLevelStartedAt`, `settings.levelScaling`)

## Connected to
- [[Activity Completion]], [[Dimension Levels]], [[Level Rewards]], [[Level-Up Share Card]], [[Retroactive History Editing]], [[Quests]], [[Berserk Mode]], [[Focus Window]], [[Settings Page]], [[updateDashboard]], [[Public Profile]]

## If you change this
- Level-up and level-down loops are repeated in `completeActivity`, `undoActivity`, `processSkipPenalty`, `payQuestBonus` (also used by `modesAwardXP` for positive mode XP), `modesAwardXP` (losses) and `applyLevelScaling` (which inlines the formula instead of calling `calculateXPForLevel`); a formula change touches all of them.
- Friends see `level` and `totalXP` via [[publicProfiles]].

## Where in the code
- app.js — `getLevelScaling` / `calculateXPForLevel` (after `saveUserData`); `updateDashboard`; Settings "Level Scaling" handlers (`previewLevelScaling`, `applyLevelScaling`); `showLevelUpAnimation` after the toast helpers.
