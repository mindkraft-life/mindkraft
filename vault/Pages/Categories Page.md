---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Categories Page

**In one line:** Activities › Categories ("Your Dimensions") lists the user's dimensions, their paths and the activities inside, with search, an explainer, a per-row action menu and Add Dimension.

## How it works
- Panel `#activitiesSubCategories`; rendered by `renderDimensions()` when opened (`switchSubTab('activities','categories')`), and remembered as the Activities sub-tab across sessions.
- Info button → `openCategoriesInfo`; search → `openCategoriesSearch`; add → `openDimensionModal`; row menus → `openCatActionMenu`.

## Key functions
- `renderDimensions`, `renderPaths`, `renderCategoriesActivities`, `openCategoriesInfo`, `openCategoriesSearch`, `openDimensionModal`, `openPathModal`, `openCatActionMenu`, `toggleDimension`, `togglePath`.

## Data it touches
- [[users]] (`dimensions`, `settings.activitiesLastSubTab`)

## Connected to
- [[Dimensions And Paths]], [[Activity Search]], [[Activities]], [[Dimension Levels]], [[Tab Switching]]

## If you change this
- The nav lifts this page's toolbar buttons onto the title row; keep them outside `#dimensionsContainer`, which is re-rendered.

## Where in the code
- index.html — `#activitiesSubCategories`, `#dimensionModal`, `#pathModal`, `#categoriesInfoModal`, `#categoriesSearchOverlay`.
- app.js — Categories renderers and modals.
