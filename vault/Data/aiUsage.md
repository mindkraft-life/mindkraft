---
type: data
sources: [functions/index.js, functions/lib/web-weaver.js]
last_verified: 2026-10-05
---
# aiUsage

> [!summary] In plain words
> A small counter the server keeps for each person to limit how often the AI features can be used (quest plans per week, Map rebuilds per month).
>
> **How it connects:** Used by the [[Quest Composer]] and [[Map Weaving]].

**In one line:** `users/{uid}/aiUsage/{questComposer|mapWeave}` holds the server-only rate-limit and cooldown counters for the two AI callables, kept in a subcollection so the client's full-document save cannot overwrite them.

## How it works
- `aiUsage/questComposer`: `{ count, windowStart, lastAt }` — 3 compositions per rolling 7 days (`RATE_LIMIT_FREE`, `RATE_WINDOW_MS`). Read by `readQuota`, incremented by `consumeQuota` only after a valid spec exists.
- `aiUsage/mapWeave`: `{ count, windowStart, lastAt, lastTreeRegenAt, goalRegenAt{goalId}, goalRegenCount{goalId}, goalFreeAt{goalId} }` — an abuse ceiling of 20 weaves per 7 days (`WEAVE_WINDOW_MAX`), plus the monthly whole-tree regeneration clock and per-goal reweave pricing. Read by `readWeaveUsage`, written by `commitWeaveUsage` only after a successful weave.
- Only Cloud Functions (admin SDK) write here; `weaveWeb` returns the usage so the client can show prices (`ttSyncWeaveUsage` copies it onto goals).

## Key functions
- `readQuota`, `consumeQuota`, `readWeaveUsage`, `commitWeaveUsage`, `goalRegenPricing` (lib/web-weaver.js), `ttSyncWeaveUsage` (client).

## Data it touches
- [[users]] (parent)

## Connected to
- [[composeQuest]], [[weaveWeb]], [[Quest Composer]], [[Map Weaving]], [[Map Reveal Loop]]

## If you change this
- A failed model call must not spend a unit — both callables commit usage only on success, and the tests rely on that.

## Where in the code
- functions/index.js — QUEST COMPOSER (`readQuota`, `consumeQuota`) and MAP — "WEAVE MY WEB" (`readWeaveUsage`, `commitWeaveUsage`).
