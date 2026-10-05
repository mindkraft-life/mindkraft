---
type: test
sources: [functions/package.json, test/rules/package.json, test/social/harness.mjs, .github/workflows/deploy-reminders.yml]
last_verified: 2026-10-05
---
# Test Suites Overview

**In one line:** Mindkraft has three kinds of tests — Node unit tests for the Cloud Functions libraries (run in CI before every functions deploy), headless-Chromium "invariant" suites that drive the real app.js against a stubbed Firestore (run by hand), and a Firestore-emulator suite for the security rules (run by hand, and currently missing the rules file it loads).

## How it works
| Kind | Files | Run | In CI |
|---|---|---|---|
| Server unit | functions/test/*.test.js | `cd functions && npm test` (`node --test`) | Yes — blocks the deploy |
| Browser invariants | test/{grit,modes,nav,payout,social,techtree,versus}/*.test.mjs | `node test/<suite>/<file>` | No |
| Security rules | test/rules/firestore.rules.test.mjs | `cd test/rules && npm install && npm test` (emulator) | No |
- Browser suites share [[Browser Test Harness]] and import Playwright from an absolute path (`/opt/node22/lib/node_modules/playwright/index.mjs`), so they only run where Playwright is installed there.
- Each browser suite appends a hook block to a temporary copy of app.js to reach module-private state; the shipped app.js is never modified.

## Key functions
- `build`, `serve` (harness); `node:test` `test()` for server suites; `t()` in the rules suite; `ok()` checks inside `page.evaluate` in browser suites.

## Data it touches
- [[users]], [[versusChallenges]], [[pacts]], [[gifts]], [[gritLedger]] (stubbed or emulated only)

## Connected to
- [[Browser Test Harness]], [[Grit Clawback Test]], [[Modes Browser Test]], [[Nav Browser Test]], [[Payout Browser Test]], [[Social Browser Test]], [[Tech Tree Reveal Test]], [[Versus Browser Test]], [[Rules Test]], [[Server Activities Test]], [[Server Deploy Test]], [[Server Modes Test]], [[Server Pact Test]], [[Server Pipeline Test]], [[Server Quest Composer Test]], [[Server Schedule Test]], [[Server Versus Test]], [[Server Web Weaver Test]], [[Deploy Pipeline]]

## If you change this
- A change to app.js is only checked by the browser suites if someone runs them; CI does not.
- Nothing in vault/ is read by any suite.

## Where in the code
- functions/package.json (`test` script), test/rules/package.json, test/*/README.md.
