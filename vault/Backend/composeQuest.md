---
type: backend
sources: [functions/index.js, functions/lib/quest-composer.js, functions/lib/model.js, app.js]
last_verified: 2026-10-05
---
# composeQuest

**In one line:** `composeQuest` is an HTTPS callable that turns a short request ("what are you trying to get done?") plus the user's own recently-active activities into a validated quest draft via the Anthropic model, returning the draft without writing anything to the user document.

## How it works
- `onCall`, region asia-south1, 256 MiB, 60 s timeout, `maxInstances: 3`. Requires auth; uid comes from the token.
- Input: `request` (trimmed to `REQUEST_MAX_CHARS` = 280), `shape` (`oneoff` | `recurring`), `size` (`days` | `weeks` | `months` | null).
- Reads `users/{uid}`; `activityMenu()` offers every countable activity (not perform-negative), ranked by most recent completion, capped at 40, each flagged `doneRecently` — recency is a signal, not a filter. Fewer than 3 → `{ok: false, reason: 'gate'}`.
- Rate limit: 3 per rolling 7 days in [[aiUsage]] (`readQuota`); over → `reason: 'ratelimit'`.
- `buildComposePrompt` → `callModel({maxTokens: 2000})` → `parseModelJson` → `validateSpec` (max 20 leaves, nesting depth 3, new activities capped at ~30% of leaves, min 2 / max 6). Failures return `reason: 'model'` or `'invalid'` and cost nothing.
- Success: `consumeQuota`, return `{ok: true, spec, remaining}`. The client (`qcSubmit` → `qcCallCompose`) re-validates with its own copy (`qcValidateGroup`, `qcValidateLeaf`) and opens the draft in the quest builder.

## Key functions
- `composeQuest`, `readQuota`, `consumeQuota`; lib: `activityMenu`, `buildComposePrompt`, `validateSpec`, `validateGroup`, `validateLeaf`, `demoteExcessNewActivities`, `buildCtx`, `newActivityAllowance`.

## Data it touches
- [[users]] (read), [[aiUsage]] (`questComposer`)

## Connected to
- [[Quest Composer]], [[Quests]], [[Model Adapter]], [[Deploy Pipeline]], [[Server Quest Composer Test]], [[Server Pipeline Test]]

## If you change this
- The comment above `lookbackDays` in lib/quest-composer.js still describes the old recency filter; `activityMenu` itself no longer filters.
- The validators are a byte-for-byte counterpart of app.js `qcValidateGroup` / `qcValidateLeaf` — "edit both or neither".
- Needs `ANTHROPIC_API_KEY` in the deployed environment (written by the deploy workflow).
- The privacy policy names this feature and the model vendor; changing the provider means updating privacy.html.

## Where in the code
- functions/index.js — "QUEST COMPOSER" section; functions/lib/quest-composer.js.
