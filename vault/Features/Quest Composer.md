---
type: feature
sources: [app.js, functions/index.js, functions/lib/quest-composer.js, index.html]
last_verified: 2026-10-05
---
# Quest Composer

**In one line:** "Plan it for me" on the Quests page sends a short goal, a shape (one-off or repeating) and a size to the `composeQuest` Cloud Function, and opens the returned AI draft in the real quest builder, where nothing is saved until the user taps Create quest.

## How it works
- `openQuestComposer` — courtesy gate: `qcLiveActivityCount()` must find at least 3 activities with a completion inside their Grit lookback window. The server no longer filters on recency (any 3 countable activities pass), so this client gate is stricter than the server's.
- `qcPickShape`, `qcPickSize`, then `qcSubmit` → `qcCallCompose(payload)` (`httpsCallable('composeQuest')`, client timeout `QC_CALL_TIMEOUT_MS`).
- Server reasons map to messages via `qcSetError`: `gate`, `ratelimit` (3 per 7 days), `model`, `invalid`.
- The spec is re-validated client-side (`qcValidateGroup`, `qcValidateLeaf`, `qcDemoteExcessNewActivities`, `qcNewActivityAllowance`) and loaded into the builder (`qcDraftToBuilder`). Suggested new practices appear as badged task rows.
- On Create quest, `qcFinishDraft` turns surviving new-practice rows into real activities, then `qcOpenNewActivityReview` lets the user rename or remove each one (`qcEditNewActivity`, `qcRemoveNewActivity`).
- Closing the builder discards the draft (`window._qcDraft` cleared by a `closeProjectModal` wrapper).

## Key functions
- `openQuestComposer`, `closeQuestComposer`, `qcPickShape`, `qcPickSize`, `qcSubmit`, `qcCallCompose`, `qcClientCtx`, `qcValidateGroup`, `qcValidateLeaf`, `qcDraftToBuilder`, `qcFinishDraft`, `qcWalkLeaves`, `qcOpenNewActivityReview`, `qcRenderNewActivityReview`, `qcEditNewActivity`, `qcRemoveNewActivity`, `qcSetError`, `qcSetBusy`.

## Data it touches
- [[users]] (`projects`, new activities), [[aiUsage]] (server-side)

## Connected to
- [[composeQuest]], [[Quests]], [[Quests Page]], [[Activities]], [[Model Adapter]], [[Server Quest Composer Test]]

## If you change this
- The validators exist in both app.js and functions/lib/quest-composer.js and must stay identical.
- Composer names have "tt-shaped ancestors" (it was born inside the Tech Tree) but must not read Map data.

## Where in the code
- app.js — "QUEST COMPOSER" section (after the quest builder, before the back-button guard).
- index.html — `#questComposerModal`, `#qcReviewModal`.
