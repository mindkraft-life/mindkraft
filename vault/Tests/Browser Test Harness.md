---
type: test
sources: [test/social/harness.mjs, test/social/stub-firestore.js, test/social/stub-auth.js, test/social/README.md]
last_verified: 2026-10-05
---
# Browser Test Harness

> [!summary] In plain words
> The shared test setup that runs a copy of the real app in an invisible browser with a pretend database, so tests can try things safely without touching anyone's real account.
>
> **How it connects:** Used by all the in-browser checks listed in [[Test Suites Overview]].

**In one line:** test/social/harness.mjs builds a throwaway copy of the app in a temp directory — index.html with an import map that redirects the Firebase CDN modules to local stubs, app.js with test hooks appended inside its module scope, and style.css — serves it over HTTP, and every browser suite drives that copy in headless Chromium.

## How it works
- `build(extraHooks)` copies the app, injects the import map, appends a shared `window.__t` hook block plus the suite's own `hooks.js`, and returns the directory; `serve(dir, port)` starts a static server.
- stub-firestore.js: an in-memory path→document map supporting equality filters, `orderBy`/`limit`, dotted-path updates, batches, transactions and `array-contains`; `window.__fail` lists path prefixes whose writes are refused (to drive failure branches).
- stub-auth.js: a minimal Auth stub. `httpsCallable` is stubbed, so AI calls always take the failure path.
- Suites that skip the real sign-in set `window._dataOwnerUid` and show `#appContainer` themselves (otherwise `canPersistUserData` blocks writes and layout reads zero).

## Key functions
- `build`, `serve`; hook objects `window.__t`, `window.__mm`, `window.__tt*` (defined in each suite's hooks).

## Data it touches
- Stubbed [[users]], [[gifts]], [[giftsSent]], [[gritLedger]], [[leaderboardBoards]], [[versusChallenges]], [[pacts]]

## Connected to
- [[Test Suites Overview]], [[Social Browser Test]], [[Grit Clawback Test]], [[Modes Browser Test]], [[Nav Browser Test]], [[Payout Browser Test]], [[Tech Tree Reveal Test]], [[Versus Browser Test]], [[Firebase Client]], [[canPersistUserData]]

## If you change this
- Changing the Firebase SDK version or import style in app.js breaks the import map remapping.
- New Firestore features used by the app (e.g. new query operators) must be added to the stub or tests will throw.

## Where in the code
- test/social/harness.mjs, test/social/stub-firestore.js, test/social/stub-auth.js.
