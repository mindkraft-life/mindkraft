---
type: engine
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Sheets Overlays And Back Button

**In one line:** Every `.modal-overlay` dialog becomes a bottom sheet on phones (index.html `mkBindSheet`), runtime sheets (Map, Versus, Gifts, Modes) are built by feature helpers, and an app-wide back-button guard in app.js closes the top overlay, then returns to Activities, then asks for a second press before letting the PWA exit.

## How it works
- **Bottom sheets (index.html Navigation v5 script):** `initSheets()` binds every `.modal-overlay`; `bindSheet` expands a sheet to 75% height on first scroll or an upward drag on its header; a `MutationObserver` resets the sheet whenever its `active` class is added. Dialogs created at runtime call `window.mkBindSheet(overlay)` to get the same behaviour. Purely presentational — open/close stays with each dialog.
- **Modals** open by adding `.active` to `#…Modal` and close via `close<Id>()` functions (`closeActivityModal`, `closeProjectModal`, `closeGroupModal`, …).
- **Feature sheets:** `ttShowSheet` / `ttShowOverlay` (Map), `vsSheet` (Versus), `giftSheet` (gifts), `modeSheet` (modes setup), `mkSwapSheetContents` (swap content without re-animating).
- **Back-button guard (app.js IIFE):** pushes one `{mkGuard: 1}` history entry and re-arms it on any click. On `popstate`: `closeTopOverlay()` closes (in order) the Map sheet, Map overlay, grid action menu, the activity picker / activity modal / quest modal, then any other `.modal.active` or `[id$="Modal"].active` via its conventional `close<Id>` function; otherwise switches to the Activities tab; otherwise toasts "Press back again to exit". Exposed as `window.mkCloseTopOverlay` for the quest detail view's own popstate handler.
- The profile overlay and quest detail push their own history entries (see [[Profile Page]], [[Quests Page]]).

## Key functions
- `closeTopOverlay` (`window.mkCloseTopOverlay`), `arm`, `bindSheet`, `expandSheet`, `resetSheet`, `initSheets`, `window.mkBindSheet`, `mkSwapSheetContents`, `ttShowSheet`, `vsSheet`, `giftSheet`, `modeSheet`.

## Data it touches
- none (UI only)

## Connected to
- [[Bottom Navigation]], [[Tab Switching]], [[Activity Editor Page]], [[Map Page]], [[Versus Challenges]], [[Social Gifting]], [[Modes]], [[Profile Page]], [[Quests Page]]

## If you change this
- A new modal whose id ends in `Modal` gets back-button support for free only if it has a matching `close<Id>` function; otherwise the guard just removes `.active` and skips any cleanup.
- The guard's ordering assumes Map sheets sit above modals; a new top-layer overlay should be added to `closeTopOverlay`.
- Sheets cannot be flung closed on purpose (unsaved form input).

## Where in the code
- app.js — "APP-WIDE BACK-BUTTON GUARD" IIFE (between the Quest Composer and the Grit section); profile `popstate` handler after `handleLogout`.
- index.html — Navigation v5 script, "Bottom sheets" block.
