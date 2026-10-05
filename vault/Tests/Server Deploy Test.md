---
type: test
sources: [functions/test/deploy.test.js, .github/workflows/deploy-reminders.yml, functions/index.js]
last_verified: 2026-10-05
---
# Server Deploy Test

> [!summary] In plain words
> Checks that every server helper is on the list to be published, plus a few safety rules for the AI planner and notifications — so nothing silently fails to go live.
>
> **How it connects:** Guards the [[Deploy Pipeline]].

**In one line:** functions/test/deploy.test.js (8 tests) reads the deploy workflow and functions/index.js to make silent deploy failures loud: every exported function must be in the `--only` list with the `reminders:` prefix, the deploy is never a bare functions deploy, the composer stays safe, and VAPID is configured on every send path but never at module scope.

## How it works
- Parses `.github/workflows/deploy-reminders.yml` and the exports of `functions/index.js`.
- Composer checks: `ANTHROPIC_API_KEY` from the runtime environment, no writes to the user document, uid from the auth token not the payload, a failed composition consumes nothing.

## Key functions
- Static checks over `exports.*`, `ensureWebPush`, `pushToUser`, `composeQuest`.

## Data it touches
- none (source text only)

## Connected to
- [[Deploy Pipeline]], [[Push Delivery]], [[composeQuest]], [[pushToUser]], [[Test Suites Overview]]

## If you change this
- Adding a Cloud Function without adding it to the workflow's `--only` list fails this test (and therefore the deploy job).

## Where in the code
- functions/test/deploy.test.js.
