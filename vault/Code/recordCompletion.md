---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# recordCompletion

**In one line:** `recordCompletion(activity, xpEarned, isPenalty)` appends `{date, xp[, isPenalty]}` to an activity's `completionHistory`, trims it to the newest 365 entries, and returns the entry so callers can stamp what else they paid (the Grit drip) onto the same record.

## How it works
- Called by `completeActivity` (signed XP: negative for perform-negative activities) and `processSkipPenalty` (`isPenalty: true`, negative XP).
- `retroactiveComplete` inserts entries itself (sorted) rather than calling this.
- `completionHistory` is the source of truth for streak re-walks, analytics, Grit quotas, Map mastery, mode baselines and the server's reminder/quest/weaver logic.

## Key functions
- `recordCompletion`, `completeActivity`, `processSkipPenalty`, `retroactiveComplete`.

## Data it touches
- [[users]] (activity `completionHistory`)

## Connected to
- [[Activity Completion]], [[Negative Activities And Skip Penalty]], [[Activity History Log]], [[Streaks And Shields]], [[Grit Currency]], [[completeActivity]]

## If you change this
- The 365 cap silently drops old history, which shortens streak walks and analytics for high-frequency activities.

## Where in the code
- app.js — end of the Analytics section ("Hook into completeActivity to record completionHistory").
