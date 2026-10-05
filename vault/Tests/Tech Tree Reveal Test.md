---
type: test
sources: [test/techtree/reveal.test.mjs, test/techtree/README.md]
last_verified: 2026-10-05
---
# Tech Tree Reveal Test

> [!summary] In plain words
> Checks the Map's hidden-parts system: what starts visible, uncovering in the right order, paying before receiving, nothing leaking out of hidden parts, and AI failures costing nothing.
>
> **How it connects:** Guards the [[Map Reveal Loop]] and the [[Tech Tree Map]].

**In one line:** test/techtree/reveal.test.mjs (67 checks) asserts the Map v5 reveal loop in the real app.js — which nodes are born revealed, the lineage rule, paid reveals persisted before granting, reveal not granting access, silhouettes leaking nothing, rejection fallback, the one-time migration, the regeneration gates, failed weaves costing nothing, and mastery paying once.

## How it works
- Builds and serves its own harness copy; `httpsCallable` is stubbed, so every weave fails — exactly what the "costs nothing" checks need.
- Also drives the Map screens: intro without an activity-count wall, typed goals registering immediately, no per-node "revise" path, and Branch view as a single-goal chain with locked nodes explaining what opens them.

## Key functions
- Exercises `ttIsFreeTier`, `ttEnsureRevealFields`, `ttRevealBlockers`, `ttConfirmReveal`, `ttSilhouettePreview`, `ttRejectNode`, `ttRegenStatus`, `ttConfirmRegen`, `ttWeave`, `evaluateTechTreeMastery`, `renderTechTree`.

## Data it touches
- Stubbed [[users]] (`techTree`, `grit`), [[gritLedger]]

## Connected to
- [[Map Reveal Loop]], [[Tech Tree Map]], [[Map Weaving]], [[weaveWeb]], [[evaluateTechTreeMastery]]

## If you change this
- The weaver's own gates and materializer are covered server-side by [[Server Web Weaver Test]].

## Where in the code
- test/techtree/reveal.test.mjs.
