---
type: feature
sources: [app.js, test/payout/README.md, test/modes/README.md]
last_verified: 2026-10-05
---
# Streaks And Shields

> [!summary] In plain words
> A streak counts how many periods in a row you have done an activity, and long streaks give bonus points. Shields protect a streak: if you miss a period, a shield is used up instead of losing the streak. You start each streak with three, earn more at milestones, and can add more bought with Grit (holding at most ten at a time). Every time you open the app, missed periods are checked and shields are used automatically.
>
> **How it connects:** The automatic check happens in [[Login-Time Processing]]. Extra shields come from the [[Grit Shop]] or as gifts ([[Social Gifting]]). [[Recovery Mode]] and [[Insurance Mode]] help rebuild or protect streaks.

**In one line:** Each non-occasional activity keeps a streak of consecutive completed windows, protected by shields (3 per streak, +1 at 25/50/75/100, plus any bought with Grit, holding at most 10 at once) that absorb missed windows; the login walk is the single authority that re-derives streak and shields from completion history.

## How it works
- **Fields:** `streak`, `bestStreak`, `shieldsConsumed`, `shieldCapUsed` (capacity), `shieldEvents[]` (append-only `shield_applied` events from the Grit pool), `streakGrantedDate`, `streakStartWindow`, `lastProcessedDate`.
- **Ownership:** `processStreakSystem()` (login, once per day per activity) owns streak and shields. `completeActivity` only adds today's +1 (guarded by `streakGrantedDate`); `undoActivity` reverses it. Render helpers `calculateStreak` and `getShieldsUsedDisplay` only read.
- **The walk:** from `streakStartWindow` through every closed window: hit → streak++; miss → consume a shield if any are held; otherwise the streak breaks to 0. Shield capacity starts at `shieldFloorFor(activity)` = min(cap, 3 + applied shields) and gains +1 at each milestone.
- **The cap:** `SHIELD_ABS_CAP = 10` limits shields *held* (capacity − consumed), via `shieldCapLimit(consumed) = 10 + consumed` — not a lifetime ceiling.
- **Retro edits:** `recomputeStreakFromHistory()` re-walks from the oldest verifiable window without trusting the stored anchor.
- **Multiplier:** streak ≥ 5 multiplies XP (`calculateConsistencyMultiplier`).
- **Perform-negative** activities have no shields; their streak expires after `getStreakGraceDays`. Occasional activities have no streak.
- **Modes:** Recovery and Insurance add mode-owned offsets after the walk (`modes.streakOffsets`), never on the activity.
- **Grit:** streak tiers 7/14/30/60/100 pay Grit once each (`gritCheckStreakMilestones`); shields can be bought (`gritBuyShield`) and applied (`gritApplyShield`) or gifted.

## Key functions
- `processStreakSystem` — see [[processStreakSystem]].
- `recomputeStreakFromHistory`, `calculateStreak`, `getShieldsUsedDisplay`, `appliedShieldCount`, `shieldCapLimit`, `shieldFloorFor`, `shieldCapNow`, `getShieldCap`, `shieldsHeldNow`, `checkStreakMilestone`, `calculateConsistencyMultiplier`.

## Data it touches
- [[users]] (activity streak fields, `grit.shieldPool`, `modes.streakOffsets`)

## Connected to
- [[Login-Time Processing]], [[Activity Completion]], [[Activity Frequencies And Cycles]], [[Grit Shop]], [[Social Gifting]], [[Recovery Mode]], [[Insurance Mode]], [[Retroactive History Editing]], [[Analytics Page]], [[Payout Browser Test]], [[Modes Browser Test]]

## If you change this
- Never write streak or shield fields outside the owners listed above; the next login walk overwrites them anyway.
- The header comment's "shieldsConsumed (0–3)" predates the cap of 10 and is stale.
- `processStreakSystem` and `recomputeStreakFromHistory` are two implementations of the same walk; change both.
- A user who misses many days and returns gets the whole gap processed at once on login.

## Where in the code
- app.js — "Streak & Shield System" header block (constants and shield helpers, `calculateStreak`), `recomputeStreakFromHistory` (Retroactive Recalculation Engine), `processStreakSystem` (before `processStreakPauses`).
