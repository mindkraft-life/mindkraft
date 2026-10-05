---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# First-Run Tutorial

**In one line:** After onboarding, a one-step tutorial card ("One habit. One tap.") prompts the user to create their first activity, and stays until they do, tracked by `userData.tutorialStep` (0 = in progress, 99 = done).

## How it works
- `TUTORIAL_STEPS` has a single step (eyebrow, icon, preview pills, CTA `openActivityModal(null,null); hideTutorialOverlay();`).
- `initTutorial()` sets `tutorialStep = 0` (only if never started) and shows the card; the boot sequence re-shows it on every app open while `tutorialStep === 0`.
- `saveActivity` sets `tutorialStep = 99` when the first activity is created and hides the overlay. Old values 1–3 from a retired four-step tour are treated as done.

## Key functions
- `initTutorial`, `showCurrentTutorialStep`, `hideTutorialOverlay`.

## Data it touches
- [[users]] (`tutorialStep`)

## Connected to
- [[Onboarding Page]], [[Activities]], [[Activity Editor Page]], [[App Boot Sequence]]

## If you change this
- Adding steps means handling `tutorialStep` values above 0 and below 99 again; the old 1–3 values are already treated as finished.

## Where in the code
- app.js — `TUTORIAL_STEPS`, `initTutorial`, `showCurrentTutorialStep`, `hideTutorialOverlay` (after the onboarding code).
- index.html — `#tutorialOverlay`.
