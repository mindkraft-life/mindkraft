---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Activity Editor Page

**In one line:** The activity modal is where an activity is created or edited — name, base XP (1–50), frequency (with custom days/cycles), dimension and path, description, and an advanced section for multiple-per-day, delete-on-complete and negative-XP mode — and it doubles as the hand-off form for the Map accept flow and the Versus accept walkthrough.

## How it works
- `openActivityModal(dimIndex, pathIndex, actIndex)` (null indexes = new) fills `#activityModal`; `saveActivity(event)` saves; `closeActivityModal` closes.
- Wrappers: Versus maps a newly created activity to a challenge requirement and returns to its walkthrough on close; the Map clears its accept context on close. Saving with `window._ttAcceptContext` resolves the pending Map node; Map mastery fields (`#ttMasteryGroup`) appear only then.
- Info modal (`openActivityInfo`), XP presets (`setActivityXP`, `syncActivityXPPreset`), advanced accordion (`toggleAdvancedSection`), negative section (`toggleNegativeXpSection`), custom frequency UI (`toggleCustomDays`, `setCustomSubtype`, `toggleDayBtn`).

## Key functions
- `openActivityModal`, `saveActivity`, `closeActivityModal`, `editActivity`, `deleteActivity`, `populateActivityPathSelect`, `toggleAdvancedSection`, `toggleNegativeXpSection`, `setActivityXP`, `openActivityInfo`.

## Data it touches
- [[users]] (activities)

## Connected to
- [[Activities]], [[Activity Frequencies And Cycles]], [[Negative Activities And Skip Penalty]], [[Tech Tree Map]], [[Versus Challenges]], [[First-Run Tutorial]], [[Hook Chains]], [[Sheets Overlays And Back Button]]

## If you change this
- `closeActivityModal` has three layers (base, Versus, Map); a new behaviour on close should be another wrapper, not an edit that drops the others.

## Where in the code
- index.html — `#activityModal`, `#activityInfoModal`.
- app.js — `openActivityModal` … `deleteActivity`.
