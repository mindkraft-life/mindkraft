---
type: test
sources: [functions/test/pact.test.js, functions/lib/pact.js]
last_verified: 2026-10-05
---
# Server Pact Test

> [!summary] In plain words
> Checks the maths of pact progress and that pact nudges fire at the right moments and never become spam.
>
> **How it connects:** Guards [[Pact Mode]].

**In one line:** functions/test/pact.test.js (19 tests) protects the Pact progress maths on both document shapes and the anti-spam behaviour of the halfway and falling-behind nudges across sequences of writes.

## How it works
- `items` / `count` / `stats` read both the multi-activity and original single-activity shapes; empty terms are not "complete"; percentages span every activity; over-logging one cannot carry another; a hit needs every target.
- `progressNudges`: halfway pushes the other party once per party; a 30-point gap pushes both sides as one event; a gap that stays wide does not re-fire; it re-arms only after closing; hard cap of three gap events.

## Key functions
- `items`, `count`, `stats`, `progressNudges`.

## Data it touches
- fixtures shaped like [[pacts]]

## Connected to
- [[Pact Mode]], [[onPactWrite]], [[Test Suites Overview]]

## If you change this
- `stats` must stay equal to the client's `pactStats`.

## Where in the code
- functions/test/pact.test.js.
