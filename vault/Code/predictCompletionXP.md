---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# predictCompletionXP

**In one line:** `predictCompletionXP(activity)` is the pure function that says what completing an activity right now would award — whether the streak advances, the new streak, the multiplier, and the XP before and after a Grit or gifted ×2 boost — shared by the floating preview and the real award so they can never disagree.

## How it works
- Occasional activities: no streak, multiplier 1.
- Custom activities grant the streak only when the cycle was empty; others only if `streakGrantedDate !== today`.
- `multiplier = calculateConsistencyMultiplier(newStreak)`; `preBoostXP = floor(baseXP × multiplier)`.
- Boost: `gritIsBoostArmed(activity)` first; otherwise `giftPeekFor(activity)` (side-effect free); either doubles exactly once.
- Returns `{currentStreak, todayStr, shouldGrantStreak, newStreak, multiplier, earnedXP, preBoostXP, gritBoosted, giftBoost}`.
- Callers: `completeActivity`, `completeActivityById` (preview float).

## Key functions
- `predictCompletionXP`, `calculateConsistencyMultiplier`, `getStreakScaling`, `gritIsBoostArmed`, `giftPeekFor`, `cycleCompletionsNow`.

## Data it touches
- [[users]] (reads activity, `grit.pendingBoost`, settings), [[gifts]] (peeked from the in-memory queue)

## Connected to
- [[Activity Completion]], [[completeActivity]], [[Grit Shop]], [[Social Gifting]], [[Streaks And Shields]]

## If you change this
- Must stay side-effect free; anything it mutates would happen twice per tap.

## Where in the code
- app.js — just before `window.completeActivity`.
