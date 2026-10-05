---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# processStreakSystem

> [!summary] In plain words
> The rule-keeper for streaks. Once a day it walks through each activity's past periods, counts the ones you completed, spends shields on the ones you missed, and ends the streak if the shields run out.
>
> **How it connects:** Explained in [[Streaks And Shields]] and [[Login-Time Processing]].

**In one line:** `processStreakSystem(activity, today)` is the single authoritative writer of an activity's streak and shields: once per day it walks every closed window from the streak's start, counting hits, spending shields on misses and breaking on an unshielded miss, and writes `streak`, `shieldsConsumed`, `bestStreak`, `streakStartWindow` and `shieldCapUsed`.

## How it works
- Skips occasional and perform-negative activities; idempotent via `lastProcessedDate`.
- Anchor: `streakStartWindow`; legacy streaks without one get it re-derived by walking back from `lastCompleted`.
- Walks closed windows (`getCycleWindowStart` / `getNextCycleWindowStart`) up to today's open window; capacity from `shieldFloorFor`, +1 at milestones, held cap via `shieldCapLimit`.
- Returns true if it changed anything; called only by `processStreakPauses`.

## Key functions
- `processStreakSystem`, `getCycleWindowStart`, `getNextCycleWindowStart`, `shieldFloorFor`, `shieldCapLimit`, `recomputeStreakFromHistory` (the retro-edit twin).

## Data it touches
- [[users]] (activity streak/shield fields)

## Connected to
- [[Streaks And Shields]], [[processStreakPauses]], [[getCycleWindowStart]], [[Recovery Mode]], [[Insurance Mode]], [[Modes Browser Test]]

## If you change this
- `recomputeStreakFromHistory` implements the same walk for retro edits; keep them aligned.
- Modes must never branch into this function; their offsets are applied around it.

## Where in the code
- app.js — "processStreakSystem" header block, after the Themes section.
