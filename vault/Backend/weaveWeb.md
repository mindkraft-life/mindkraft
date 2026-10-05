---
type: backend
sources: [functions/index.js, functions/lib/web-weaver.js, functions/lib/model.js, app.js]
last_verified: 2026-10-05
---
# weaveWeb

> [!summary] In plain words
> The server side of building your Map. It reads your goals and activities, asks the AI to design or grow the web, checks the answer, enforces the free and monthly limits, and sends the result back for the app to save.
>
> **How it connects:** Behind [[Map Weaving]] and the [[Tech Tree Map]]; it talks to the AI through the [[Model Adapter]].

**In one line:** `weaveWeb` is an HTTPS callable that generates or grows the user's Map ("Weave my web") from their real activities and goals using the Anthropic model, enforces the server-side gates and monthly regeneration clock, and returns a `techTree` patch for the client to save.

## How it works
- `onCall`, region asia-south1, 512 MiB, 300 s timeout, `maxInstances: 5`. Requires auth.
- Modes (`VALID_MODES`): `generate` (first weave or whole-tree regeneration), `add_goal`, `regenerate` (one goal's thread), `expand` (grow under the latest mastered node and refill wildcards). Optional `goalId`, `nodeIds` (max 5).
- Usage: [[aiUsage]] `mapWeave`; more than 20 weaves in 7 days → `ratelimit`.
- `gateFor()`: generate needs ≥1 goal and ≥3 live activities, and a rebuild of an existing web is once per 30 days; add_goal/regenerate need the goal to exist (max 5 goals); expand needs live nodes. Blocked calls return the reason plus current usage.
- `weaveGeneration` → `buildGeneratePrompt` → `callModel` (streamed; generate 7000 tokens / 100 s total, others less, 30 s idle) → `materializeWeb` (validate nodes, enforce load budget and 40-node ceiling, assign goal colours from a 5-colour palette) → `foldGeneration`.
- `weaveExpansion` → `buildExpandPrompt` / `buildWildcardPrompt` → `materializeExpansion` / `materializeWildcards`.
- On success `commitWeaveUsage` records counts, the tree-regeneration time and per-goal reweave counts; returns `{ok, mode, techTree: patch, usage}`. The client (`ttWeave` → `ttApplyWeave`) merges the patch and saves.
- Node roles: `anchor` (the user's own activities), `upgrade`, `fusion`, `wildcard`; the only payload type is an activity spec with a mastery target.

## Key functions
- `weaveWeb`, `weaveGeneration`, `weaveExpansion`, `readWeaveUsage`, `commitWeaveUsage`, `modelBudget`, `anchorSummaries`; lib: `gateFor`, `goalRegenPricing`, `buildGeneratePrompt`, `buildExpandPrompt`, `buildWildcardPrompt`, `materializeWeb`, `materializeExpansion`, `materializeWildcards`, `foldGeneration`, `enforceLoadBudget`, `enforceNodeCeiling`, `liveNodes`.

## Data it touches
- [[users]] (read `techTree`, activities), [[aiUsage]] (`mapWeave`)

## Connected to
- [[Map Weaving]], [[Tech Tree Map]], [[Map Reveal Loop]], [[Model Adapter]], [[Server Web Weaver Test]], [[Tech Tree Reveal Test]]

## If you change this
- Grit prices for reweaves, reveals and whole-tree regeneration are charged client-side; the server only enforces the free-allowance bookkeeping, the monthly tree clock and the weekly ceiling.
- The client timeout must exceed the server's worst case (2 attempts × total budget), or a user loses a regeneration they never saw.
- Constants are duplicated client-side (`TT_MAX_GOALS`, `TT_LINE_PALETTE`, `TT_GOAL_REGEN_FREE`, `TT_REGEN_COOLDOWN_DAYS`).

## Where in the code
- functions/index.js — 'MAP — "WEAVE MY WEB"' section; functions/lib/web-weaver.js.
