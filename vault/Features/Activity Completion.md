---
type: feature
sources: [app.js]
last_verified: 2026-10-05
---
# Activity Completion

> [!summary] In plain words
> What happens when you tick an activity off. You get points (more if you are on a streak, double if a boost is waiting), your streak grows, the moment is written into the activity's history, you earn a little Grit, your life area and any quests using that activity move forward, and you may level up. Un-ticking takes back what was given (one known exception, the Focus Window bonus, is listed in the [[Change Impact Guide]]).
>
> **How it connects:** This is the busiest moment in the app: right after it, the [[Daily Planner]], [[Tech Tree Map]], [[Versus Challenges]] and [[Modes]] all react in turn (see [[Hook Chains]]). Points and levels: [[XP And Levels]]. Streaks: [[Streaks And Shields]]. Grit: [[Grit Currency]].

**In one line:** Tapping an activity runs `completeActivity`, which predicts and awards XP (base XP × streak multiplier, ×2 with a Grit or gifted boost), advances the streak once per window, records the completion, pays the Grit drip, moves dimension XP and quest progress, levels the user up, and saves — then a chain of wrappers updates the planner, Map, Versus and Modes.

## How it works
1. Guards: `canCompleteActivity`; once-per-window activities stop if `isCompletedToday`.
2. `predictCompletionXP(activity)` → `{newStreak, multiplier, earnedXP, preBoostXP, gritBoosted, giftBoost}`. Multiplier = `calculateConsistencyMultiplier(streak)`: 1 below a 5 streak, then `1 + 0.1 × streak^k` with `k = settings.streakScaling` (default 1.2).
3. Streak: if not already granted today (`streakGrantedDate`), streak +1 and `bestStreak` updated; milestone toast; +1 shield capacity at 25/50/75/100.
4. `recordCompletion(activity, ±earnedXP)` appends `{date, xp}` (negative for perform-negative activities), capped at 365 entries.
5. Direct hooks: `gritOnCompletion` (Grit drip stamped on the entry), `giftOnCompletion` (gifted boost consumed), `applyDimXP`, `updateQuestProgress`.
6. User XP: add (or subtract for perform-negative, levelling down if needed); level-up loop via `calculateXPForLevel`, capped at 100; on level-up, `prebuildLevelUpCard` + `showLevelUpAnimation`.
7. `deleteOnComplete` occasional activities are spliced out (logged first).
8. `updateDashboard()`, `showXPToast()`, `debouncedSaveUserData()`.
- **Undo** (`undoActivity`) removes the last non-penalty entry, reverses exactly the XP and Grit recorded on it, rewinds `lastCompleted`/`skipPenaltyWindow`, reverts today's streak grant, undoes quest progress and dimension XP.
- Entry points: card buttons, grid cards (`completeActivityById`), search (`searchCompleteActivity`), planner slots (`plannerCompleteSlot`), Modes "mark" buttons (`modeMark`), quest "Do now" (`tapNextUp`, `bumpLeaf`).

## Key functions
- `completeActivity` — see [[completeActivity]]; `undoActivity` — see [[undoActivity]]; `predictCompletionXP` — see [[predictCompletionXP]]; `recordCompletion` — see [[recordCompletion]].
- `completeActivityById`, `undoActivityById`, `calculateConsistencyMultiplier`, `getStreakScaling`, `showXPToast`, `showUndoToast`, `spawnFloatingXP`.

## Data it touches
- [[users]] (activity fields, `level`, `currentXP`, `totalXP`, `levelStartedAt`, `grit`, `projects`, dimension XP), [[gifts]], [[versusChallenges]], [[pacts]], [[gritLedger]]

## Connected to
- [[Hook Chains]], [[Streaks And Shields]], [[XP And Levels]], [[Dimension Levels]], [[Grit Currency]], [[Social Gifting]], [[Quests]], [[Daily Planner]], [[Tech Tree Map]], [[Versus Challenges]], [[Modes]], [[Level-Up Share Card]], [[Toasts And Feedback]], [[My Activities Page]], [[updateDashboard]]

## If you change this
- The preview popup and the awarded XP both come from `predictCompletionXP`; keep it pure (gift peeking is side-effect free on purpose).
- Undo must reverse what was recorded on the entry (XP and `gritAwarded`), never re-derive — the clawback test guards this.
- The level-up branch has its own early `return` that duplicates the `deleteOnComplete` splice and the save; edits to the tail of the function must be made in both places.
- `completionHistory` is capped at 365 entries; very frequent activities lose old history, which affects streak re-walks and analytics.
- The comment above `getStreakScaling` still documents `1 + 0.1 × streak^1.5` with examples (×2.1 at 5, ×4.2 at 10); the code's default exponent is 1.2 (≈×1.7 at 5, ≈×2.6 at 10).

## Where in the code
- app.js — `predictCompletionXP`, `window.completeActivity`, `window.undoActivity` (after the Streak & Shield System); `completeActivityById` / `undoActivityById` near the grid view.
