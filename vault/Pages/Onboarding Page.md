---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Onboarding Page

**In one line:** A brand-new account sees a full-screen onboarding overlay — three explainer slides, then a choice between Quick Start (pick up to two focus areas and up to four suggested activities) and Build My Own (start empty with the first-activity tutorial).

## How it works
- Shown by the boot sequence when the account has no dimensions, 0 XP, level 1 and `onboardingComplete` is false (`showOnboardingOverlay`).
- Slides: habits → XP, the Dimensions → Paths → Activities hierarchy, streaks/shields/challenges (`obRenderSlide`, `obNext`, `obBack`, `obGoTo`).
- Choice screen (`obShowChoiceScreen`): **Quick Start** → `obShowFocusPicker` (areas from `FOCUS_AREAS`, max 2) → `obShowActivityPicker` (max 4) → `obFinishPicker` (`createDefaultOnboardingData` marks onboarding complete, then the chosen activities are created in the Uncategorized bucket and saved). **Build My Own** → `obBuildOwn` (mark complete, open Activities, start the tutorial).
- `createDefaultOnboardingData` refuses to touch an account that already has data.

## Key functions
- `showOnboardingOverlay`, `obRenderSlide`, `obNext`, `obBack`, `obGoTo`, `obShowChoiceScreen`, `obShowChoiceScreenAgain`, `obQuickStart`, `obBuildOwn`, `obShowFocusPicker`, `obToggleArea`, `obShowActivityPicker`, `obToggleActivity`, `obBackToFocus`, `obFinishPicker`, `createDefaultOnboardingData`, `obCloseOverlay`.

## Data it touches
- [[users]] (`onboardingComplete`, `dimensions`, new activities)

## Connected to
- [[App Boot Sequence]], [[First-Run Tutorial]], [[Activities]], [[Dimensions And Paths]], [[Landing And Sign In Page]]

## If you change this
- Onboarding-created activities get ids from `Date.now().toString(36) + random`, unlike the editor's `Date.now().toString()`; code comparing ids must treat them as opaque strings.
- The "new account" test in the boot sequence is what triggers this overlay; a failed load must never look like a new account.

## Where in the code
- index.html — `#onboardingOverlay`.
- app.js — onboarding functions after `initAuthScreen` (`showOnboardingOverlay` … `obFinishPicker`).
