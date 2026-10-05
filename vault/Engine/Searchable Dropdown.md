---
type: engine
sources: [app.js]
last_verified: 2026-10-05
---
# Searchable Dropdown

> [!summary] In plain words
> Turns long pick-from-a-list menus (for example, choosing one of fifty activities) into a tidier list with a search box.
>
> **How it connects:** Used mainly by the filters on the [[Analytics Page]].

**In one line:** `mkEnhanceSelect(sel)` wraps a native `<select>` in a styled, searchable picker while leaving the `<select>` in the DOM as the value holder, kept in sync by a `MutationObserver`, so existing `.value` reads and `onchange` handlers keep working.

## How it works
- A trigger button shows the chosen option; the list opens below it; a search field appears once there are at least `MKS_SEARCH_FROM` (8) options.
- `mkEnhanceFilterSelects()` enhances the Analytics filter selects (dimension, path, activity, calendar activity); `populateChartOverlayDropdown` enhances the chart "Compare" select.
- Selecting an option sets the native `<select>.value` and dispatches `change`.

## Key functions
- `mkEnhanceSelect`, `mkEnhanceFilterSelects`, `mksOpen`, `mksClose`, `mksCloseAll`, `mksRenderList`, `mksOptions`, `mksLabel`, `mksChevron`.

## Data it touches
- none (UI only)

## Connected to
- [[Analytics Page]], [[Rendering And Window Globals]]

## If you change this
- Rebuilding the `<select>`'s options via `innerHTML` is fine — the observer re-syncs; removing the `<select>` from the DOM is not.

## Where in the code
- app.js — "SEARCHABLE DROPDOWN (over a native <select>)" block inside the Analytics section.
