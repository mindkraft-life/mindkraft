---
type: backend
sources: [functions/lib/model.js, functions/index.js, .github/workflows/deploy-reminders.yml, privacy.html]
last_verified: 2026-10-05
---
# Model Adapter

> [!summary] In plain words
> The single place where the server talks to the AI — a model from the company Anthropic called Claude Haiku. It sends the request, waits patiently while the answer arrives, tries once more if needed, and pulls the useful part out of the reply.
>
> **How it connects:** Used by the [[Quest Composer]] and [[Map Weaving]], and mentioned in the [[Privacy Policy Page]].

**In one line:** functions/lib/model.js is the single place Mindkraft's Cloud Functions call the Anthropic Messages API — streamed, with an idle clock and a total clock, one retry, and 413 token-budget recovery — shared by the Quest Composer and the Map weaver.

## How it works
- Native `fetch` to `https://api.anthropic.com` (API version `2023-06-01`), no SDK dependency. Key from `process.env.ANTHROPIC_API_KEY`.
- Model: `process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5'`. The deploy workflow does not set `ANTHROPIC_MODEL`, so the fallback is what runs.
- `streamOnce` reads the SSE stream and aborts if no data arrives for `idleMs` or the whole call exceeds `totalMs`; reports `truncated` when the token ceiling was hit.
- `callModel` retries once on 429/5xx; on a 413 it reads the stated limit and retries with fewer `maxTokens`.
- `parseModelJson` strips code fences and prose and parses the first `{…}` block, returning `null` on failure.

## Key functions
- `callModel`, `streamOnce`, `parseModelJson`, `modelName`, `timeoutError`.

## Data it touches
- none (external API only)

## Connected to
- [[composeQuest]], [[weaveWeb]], [[Deploy Pipeline]], [[Privacy Policy Page]]

## If you change this
- Changing the model or provider is user-visible in privacy.html §4 ("AI features") and terms.html §9.
- Budgets in `modelBudget()` (weaveWeb) multiply by the retry count; keep them under the function timeout and the client's own timeout.

## Where in the code
- functions/lib/model.js.
