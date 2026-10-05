---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Activity Search

> [!summary] In plain words
> Two search boxes for finding activities by name: one on the home screen that lets you tick things off straight from the results, and one on the Categories screen that jumps to where the activity lives.
>
> **How it connects:** Used on the [[My Activities Page]] and the [[Categories Page]].

**In one line:** Two search overlays find activities by name — one on My Activities that lets you complete or undo straight from the results, and one on Categories that jumps to the activity inside its dimension and path.

## How it works
- My Activities: `openActivitySearch` → `renderSearchResults` (live as you type; Enter/Escape handled by `searchKeyHandler`); results have complete/undo buttons (`searchCompleteActivity`, `searchUndoActivity`) that go through the full completion chain.
- Categories: `openCategoriesSearch` → `renderCategoriesSearchResults` → `categoriesGoToActivity(dimIndex, pathIndex, actIndex)` expands the dimension and path, scrolls to the row and flashes it (tracked as `cat_search_goto`).

## Key functions
- `openActivitySearch`, `closeActivitySearch`, `searchKeyHandler`, `renderSearchResults`, `searchCompleteActivity`, `searchUndoActivity`, `openCategoriesSearch`, `closeCategoriesSearch`, `categoriesSearchKeyHandler`, `renderCategoriesSearchResults`, `categoriesGoToActivity`.

## Data it touches
- [[users]] (activities, read-only except via completion)

## Connected to
- [[My Activities Page]], [[Categories Page]], [[Activity Completion]], [[Dimensions And Paths]]

## If you change this
- Search results are re-rendered after each complete/undo; keep them cheap.

## Where in the code
- app.js — "Activity Search" (after `calculateXPForLevel`) and the Categories search block.
- index.html — `#activitySearchOverlay`, `#categoriesSearchOverlay`.
