---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# modesOnCompletion

> [!summary] In plain words
> Lets the running mode react when you tick something off — counting habit days, sprint points, bet progress, pact progress or the Focus Window bonus.
>
> **How it connects:** Explained in [[Modes]]; it runs right after [[Activity Completion]].

**In one line:** `modesOnCompletion(activity)` applies a live completion to whichever mode is running — the Focus Window +10% bonus, Habit day credit and milestones, Berserk gate counters, Recovery bonus steps, Stake counts and Pact progress — called from the outermost `completeActivity` wrapper only when a completion actually landed.

## How it works
- Focus: `modeBestMultiplierFor` → `modesAwardXP(bonus)` and `bonusXP`/`bonusCount`.
- Habit: one credit per activity per day, milestone overlay, finish check.
- Berserk: `baseXpEarned` and `completionsCount`, then `berserkMaybeResolve`.
- Recovery: one bonus increment below the ceiling (streak offsets).
- Stake: increments the matching item's count while days remain; resolves early via `stakeMaybeResolve` once every item has hit its own target.
- Pact: `pactCommitProgress(pactId, activityId, +1)`.
- Saves (debounced), re-renders the Modes page and banner.
- Twin: `modesOnUndo(activity)` (no Focus branch).

## Key functions
- `modesOnCompletion`, `modesOnUndo`, `modeBestMultiplierFor`, `modesAwardXP`, `habitOf`, `habitCheckMilestone`, `berserkMaybeResolve`, `recoveryEntry`, `stakeMaybeResolve`, `pactCommitProgress`.

## Data it touches
- [[users]] (`modes`, user XP, `xpTodayGhost`), [[pacts]]

## Connected to
- [[Modes]], [[completeActivity]], [[Hook Chains]], [[Focus Window]], [[Habit Mode]], [[Berserk Mode]], [[Recovery Mode]], [[Stake Mode]], [[Pact Mode]]

## If you change this
- Every counter added here needs a matching reversal in `modesOnUndo`.

## Where in the code
- app.js — MODES "COMPLETION / UNDO HOOKS".
