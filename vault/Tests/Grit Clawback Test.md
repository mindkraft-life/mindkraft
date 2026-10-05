---
type: test
sources: [test/grit/clawback.test.mjs, test/grit/hooks.js, test/grit/README.md]
last_verified: 2026-10-05
---
# Grit Clawback Test

> [!summary] In plain words
> Proves you cannot create free Grit by ticking and un-ticking, or by adding and removing past entries — un-ticking always takes back exactly the Grit that was given.
>
> **How it connects:** Guards [[Grit Currency]] and [[Activity Completion]].

**In one line:** test/grit/clawback.test.mjs (31 checks) proves that "effort is the only source of Grit": undoing a completion or deleting a retroactive one takes back exactly the drip it paid, so complete/undo loops mint nothing.

## How it works
- Drives the real app.js in Chromium with `hooks.js` exposing the rate card and ledger.
- Asserts: the drip is granted and stamped on its history entry (`gritAwarded`); undo restores the balance, records a reversal in the ledger and removes the entry; five complete/undo cycles mint nothing; the weekly numerator and lifetime totals return too; the by-id paths behave the same; `gritAwarded` survives a save/reload; retro complete → retro delete is symmetric; an activity archived between completion and undo still gives its Grit back; an old entry without `gritAwarded` is left alone.

## Key functions
- Exercises `completeActivity`, `undoActivity`, `retroactiveComplete`, `retroactiveDelete`, `gritOnCompletion`, `gritOnRemoval`, `gritOnRetroComplete`.

## Data it touches
- [[users]] (`grit`, history), [[gritLedger]] (stubbed)

## Connected to
- [[Grit Currency]], [[Activity Completion]], [[Retroactive History Editing]], [[gritOnCompletion]], [[undoActivity]], [[Browser Test Harness]]

## If you change this
- Any new reversible reward paid on completion needs the same record-and-read-back treatment, or this class of bug returns (Focus Window's undo currently has it).

## Where in the code
- test/grit/clawback.test.mjs, test/grit/hooks.js.
