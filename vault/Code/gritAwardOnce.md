---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# gritAwardOnce

> [!summary] In plain words
> Pays a Grit bonus only if it has never been paid before, so milestones, masteries and quest bonuses can never be paid twice.
>
> **How it connects:** Used by [[Grit Currency]], [[Quests]] and the milestones in [[Streaks And Shields]].

**In one line:** `gritAwardOnce(marker, amount, reason, meta, toastLabel)` pays Grit only if `grit.awarded[marker]` is not yet set, setting it first — the idempotency primitive behind streak tiers, activity mastery and quest seals, whose checks run many times.

## How it works
- Returns false if the marker exists; otherwise marks, calls `gritApplyDelta`, optionally adds a burst toast.
- Marker examples: per-activity streak tiers, per-activity mastery, `quest:<id>` or `quest:<id>:cycle:<n>`; the leaderboard settlement uses the same `awarded` map with `leaderboard:<anchor>`.
- Callers: `gritCheckStreakMilestones`, `gritCheckMastery`, `payQuestGrit`.

## Key functions
- `gritAwardOnce`, `gritCheckStreakMilestones`, `gritCheckMastery`, `payQuestGrit`, `lbSettleClosedWeek`.

## Data it touches
- [[users]] (`grit.awarded`, `grit.balance`), [[gritLedger]]

## Connected to
- [[Grit Currency]], [[Quests]], [[Streaks And Shields]], [[Tech Tree Map]], [[Leaderboard Payouts]], [[gritApplyDelta]]

## If you change this
- `grit.awarded` only grows; markers are never pruned.

## Where in the code
- app.js — GRIT section, "Earn: idempotency".
