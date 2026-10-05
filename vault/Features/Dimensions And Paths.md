---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Dimensions And Paths

> [!summary] In plain words
> How activities are organised. Dimensions are big life areas you choose (for example Health or Career), each with its own colour. Inside each dimension are paths (smaller themes), and inside paths are activities. Anything without a home goes into an "Uncategorized" area.
>
> **How it connects:** Managed on the [[Categories Page]]. Each dimension earns its own level ([[Dimension Levels]]) and can have its own rewards ([[Level Rewards]]). The colours show up on activity cards, quests and the Map.

**In one line:** Dimensions (life areas like Health or Career, each with a colour) contain Paths (sub-areas), which contain Activities; this three-level tree is the organising structure of `users/{uid}.dimensions` and is edited on the Categories page.

## How it works
- Dimension: `{id, name, color, expanded, paths[], dimLevel, dimXP, dimTotalXP, dimRewards}`; path: `{id, name, expanded, activities[]}`.
- A hidden-from-the-list `uncategorized` dimension (and per-dimension "Uncategorized" paths) catch activities created without a home (`getOrCreateUncategorized`, `getOrCreateUncategorizedPath`). `renderDimensions` filters `uncategorized` out of the main list.
- Colours: `DIM_COLOR_ORDER` / `DIM_HEX_MAP` map colour names to hex; used across cards, the Map, quests and analytics.
- Editing: `openDimensionModal` / `saveDimension` / `deleteDimension`, `openPathModal` / `savePath` / `deletePath`, plus a per-item action menu (`openCatActionMenu`) for edit / delete / add path / add activity / history.
- Rendering: `renderDimensions` → `renderPaths` → `renderCategoriesActivities`, lazily filling bodies when expanded (`_fillDimBody`, `_fillPathBody`); `toggleDimension` / `togglePath` remember `expanded`.

## Key functions
- `renderDimensions`, `renderPaths`, `renderCategoriesActivities`, `renderActivities`, `countDimensionActivities`, `toggleDimension`, `togglePath`, `openDimensionModal`, `saveDimension`, `editDimension`, `deleteDimension`, `renderDimensionColorPills`, `selectDimensionColor`, `openPathModal`, `savePath`, `editPath`, `deletePath`, `openCatActionMenu`, `closeCatActionMenu`, `findDimForActivity`.

## Data it touches
- [[users]] (`dimensions`)

## Connected to
- [[Categories Page]], [[Activities]], [[Dimension Levels]], [[Level Rewards]], [[Character Title And Life Balance]], [[Tech Tree Map]], [[Quests]], [[Analytics Page]], [[Activity Search]]

## If you change this
- Deleting a dimension or path deletes every activity inside it; the activity-level side effects (ghost XP, routines cleanup, Versus forfeits) only run on the per-activity delete path.
- The server reads the same tree (functions/lib/activities.js, quest-composer.js, web-weaver.js); renaming `dimensions`/`paths`/`activities` breaks them.

## Where in the code
- app.js — `renderDimensions` … `deletePath`, `openCatActionMenu`, uncategorized helpers; `DIM_HEX_MAP` near the activity card renderers.
- index.html — `#activitiesSubCategories`, `#dimensionModal`, `#pathModal`, `#categoriesInfoModal`.
