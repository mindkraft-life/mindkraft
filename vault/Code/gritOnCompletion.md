---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# gritOnCompletion

> [!summary] In plain words
> The Grit side of ticking something off: it pays one Grit, counts the tick towards this week's bonus, checks for streak and rhythm bonuses, and uses up a waiting boost if there is one.
>
> **How it connects:** Explained in [[Grit Currency]] and [[Grit Weekly Payout]].

**In one line:** `gritOnCompletion(activity, entry)` is the Grit hook inside every live completion: it pays the 1-Grit drip (stamping `entry.gritAwarded`), counts the completion toward the week's quota, checks the cadence bonus and streak milestones, and consumes an armed double-XP boost.

## How it works
- Ignores non-countable activities (perform-negative, or flagged `archived`/`deleted`).
- `gritEnsureWeek()` → `gritApplyDelta(GRIT_DRIP, 'completion')` → `entry.gritAwarded = 1` → `gritBumpNumerator` → `gritBurstAdd` (floated, not toasted) → `gritCheckCadence` → `gritCheckStreakMilestones` → `gritConsumeBoost` → `gritRefreshUI`.
- Its reversal is `gritOnRemoval(activity, entry)`, which reads `gritAwarded` back; retro adds use `gritOnRetroComplete`.

## Key functions
- `gritOnCompletion`, `gritOnRemoval`, `gritOnRetroComplete`, `gritEnsureWeek`, `gritBumpNumerator`, `gritCheckCadence`, `gritCheckStreakMilestones`, `gritConsumeBoost`.

## Data it touches
- [[users]] (`grit`, the completion entry), [[gritLedger]]

## Connected to
- [[Grit Currency]], [[Grit Weekly Payout]], [[completeActivity]], [[gritApplyDelta]], [[Grit Clawback Test]]

## If you change this
- Anything paid here must be recorded on the entry, or undo cannot take it back.

## Where in the code
- app.js — GRIT section, "Earn" hooks.
