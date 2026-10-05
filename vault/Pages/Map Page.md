---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Map Page

**In one line:** Activities › Map shows the user's AI-woven web of goals and suggested practices — an intro/goal screen before the first weave, then a Sky view (silhouettes and threads) or a Branch view (readable chain per goal) — with a "+ Goal" button on the title row.

## How it works
- Panel `#activitiesSubTechTree`; the Tech Tree wrapper on `switchSubTab` calls `renderTechTree()` when it opens; `#techTreeContainer` is rewritten on every render.
- `#ttAddGoalBtn` lives outside the container so the nav can lift it onto the title row.
- Sheets and overlays (`ttShowSheet`, `ttShowOverlay`) handle node details, reveal, regeneration, accept/link, goal menus.

## Key functions
- `renderTechTree`, `ttAddGoal`, `ttOpenNode`, `ttOpenRevealSheet`, `ttOpenRegenSheet`, `ttSetView`, `ttBranchFilter`, `ttOpenAvailableList`.

## Data it touches
- [[users]] (`techTree`, activities, `grit`)

## Connected to
- [[Tech Tree Map]], [[Map Weaving]], [[Map Reveal Loop]], [[weaveWeb]], [[Tab Switching]], [[Sheets Overlays And Back Button]]

## If you change this
- The back-button guard closes Map sheets first; new Map overlays should be added to `closeTopOverlay`.

## Where in the code
- index.html — `#activitiesSubTechTree`.
- app.js — Map v3 and Tech Tree v5 sections.
