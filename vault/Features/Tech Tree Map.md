---
type: feature
sources: [app.js, index.html, functions/lib/web-weaver.js]
last_verified: 2026-10-05
---
# Tech Tree Map

**In one line:** The Map ("the Web", stored as `userData.techTree`) is an AI-woven graph that grows out of the user's real activities toward up to five goals: anchor nodes are their existing activities, suggestion nodes are new practices to adopt, and a node resolves when its activity reaches a mastery threshold, paying XP and Grit and widening the web.

## How it works
- `techTree` (schemaVersion 3): `status`, `goals[{id, text/shortName, color, sharpened, retiredAt, regenCount, freeWeaveAt, …}]`, `nodes[]`, `vision`, `goalText`, `rejections[]`, `loadBudget`, `lastGeneratedAt`, `lastExpandAt`, `introSeen`, `viewMode` (`sky` | `branch`), plus reveal-loop fields ([[Map Reveal Loop]]).
- Node: `{id, title, role ('anchor' | 'upgrade' | 'fusion' | 'wildcard'), goalIds[], dimensionId, prerequisites[{type: 'node_mastered' | 'activity_mastered', …}], lifecycle ('locked' | 'available' | 'active' | 'archived'), payload {type: 'activity', spec, mastery, activityId?}, whyNow, revealed, resolvedAt, resolvedVia}`.
- **Mastery:** an activity with `techTreeMastery {count, windowDays}` (defaults by frequency, e.g. daily 15 in 45 days) is mastered when enough positive completions fall inside the rolling window → `techTreeMasteredAt`.
- **`evaluateTechTreeMastery()`** (login, after each completion, on render, after quest seals): flips mastery, pays Grit mastery bonuses (`gritCheckMastery`), keeps anchors' dimensions in sync, archives nodes whose activity was deleted, resolves active nodes whose activity is mastered (XP = 20 × prerequisite depth via `ttAwardXP`), recomputes locked/available, triggers a silent `expand` weave, and auto-grows every 5 days (`ttMaybeAutoGrow`).
- **Adopting a node:** `ttOpenAccept` → activity editor prefilled from the spec with mastery fields (`window._ttAcceptContext`, step strip) → `ttResolveAcceptedNode` links the new activity; or `ttOpenLinkPicker` / `ttDoLinkActivity` links an existing one. `ttRejectNode` archives it and re-points children (`ttRepointChildrenOf`). Custom nodes: `ttOpenCustomNodeForm` / `ttSaveCustomNode`. Any activity can be added from the grid menu (`ttAddActivityToTree`).
- **Rendering:** `renderTechTree` draws the Sky view as an SVG web (`ttWebLayout`, `ttBuildWebSVG`, `ttComputeTiers`) or the Branch view as a readable chain per goal (`ttBranchHtml`); node sheet `ttOpenNode`.
- Migrations: `migrateTechTreeV2`, `migrateTechTreeV3`, `ttEnsureRevealFields` (inside `ensureTechTree`).

## Key functions
- `evaluateTechTreeMastery` — see [[evaluateTechTreeMastery]].
- `ensureTechTree`, `ttMasteryProgress`, `ttPayloadResolves`, `ttAwardXP`, `ttNodeResolveBonus`, `ttNodeUnlocked`, `ttPrereqMet`, `ttPrereqDepth`, `ttMaybeAutoGrow`, `renderTechTree`, `ttWebLayout`, `ttBuildWebSVG`, `ttOpenNode`, `ttOpenAccept`, `ttResolveAcceptedNode`, `ttOpenMasterySheet`, `ttSaveMastery`, `ttOpenLinkPicker`, `ttDoLinkActivity`, `ttRejectNode`, `ttAttachToGoal`, `ttAddActivityToTree`, `createActivityFromSpec`, `ttGoalMenu`, `ttRetireGoal`, `ttWeeklyLoad`, `ttRenderIfVisible`.

## Data it touches
- [[users]] (`techTree`, activity `techTreeMastery` / `techTreeMasteredAt`, user XP, `grit`), [[aiUsage]] (via [[weaveWeb]])

## Connected to
- [[Map Page]], [[Map Weaving]], [[Map Reveal Loop]], [[weaveWeb]], [[Activities]], [[Activity Editor Page]], [[Grit Currency]], [[Quests]], [[Login-Time Processing]], [[Hook Chains]], [[Tech Tree Reveal Test]]

## If you change this
- The Map is a view: it must never destructively mutate activities, quests, streaks or XP beyond awarding resolution XP.
- `ttAwardXP` is yet another copy of the level-up loop.
- Server materialization (functions/lib/web-weaver.js) defines what nodes look like; client rendering and lifecycle code must accept everything it emits.

## Where in the code
- app.js — "THE WEB (Map v3)" section through the Tech Tree hooks (before QUESTS).
- index.html — `#activitiesSubTechTree`, `#techTreeContainer`, `#ttAddGoalBtn`.
