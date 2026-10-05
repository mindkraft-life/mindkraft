---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Quests Page

**In one line:** Pursuits › Quests lists the user's quests by status with an info button, "Plan it for me" (AI composer) and "New Quest", and drills into a quest detail view with what's next, pipelines, checklists and the seal button.

## How it works
- Tab `#projectsTab` (`switchTab('projects')` → `renderProjects()`).
- List view `#projectsListView` (`renderProjects`, `renderProjectCard`, collapsible sections) ↔ detail view `#projectsDetailView` (`openProjectDetail` → `renderProjectDetail`; `closeProjectDetail`), which pushes a history entry so the back button closes it.
- Builder modal `#projectModal` (`openProjectModal`, `saveProject`); composer modals `#questComposerModal`, `#qcReviewModal`.
- The nav lifts the toolbar buttons onto the page title row (and hides them while a detail view is open).

## Key functions
- `renderProjects`, `renderProjectCard`, `openProjectDetail`, `closeProjectDetail`, `renderProjectDetail`, `openProjectModal`, `openQuestComposer`, `openProjectsInfo`, `completeProjectCycle`.

## Data it touches
- [[users]] (`projects`)

## Connected to
- [[Quests]], [[Quest Composer]], [[composeQuest]], [[Tab Switching]], [[Bottom Navigation]], [[Sheets Overlays And Back Button]]

## If you change this
- The nav watches the detail view's `style` attribute to decide where the toolbar belongs; changing how the detail view is shown/hidden affects the title row.

## Where in the code
- index.html — `#projectsTab`, `#projectModal`, `#projectActivityPicker`, `#projectsInfoModal`, `#questComposerModal`, `#qcReviewModal`.
- app.js — QUESTS LIST VIEW / DETAIL VIEW / BUILDER sections.
