---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Challenges Page

**In one line:** Social › Challenges is entirely the Versus board: pending invites, live head-to-head wagers with progress bars, and recently resolved results, plus the sheet for creating a new challenge.

## How it works
- Tab `#challengesTab` → `#versusContent`; `switchTab('challenges')` → `vsRenderTab()` (and the Versus wrapper re-fetches and updates badges).
- Sections by status (`vsPaint`); cards `vsPendingCard`, `vsActiveCard`, `vsResolvedCard`; expanding a card attaches a live listener (`vsToggleDetail` / `vsAttachDetail`), leaving the tab detaches it.
- Create sheet (`vsOpenCreate`), accept walkthrough (`vsOpenAccept`), forfeit (`vsConfirmForfeit`).
- Solo and group challenges were removed; the sub-tab row went with them.

## Key functions
- `vsRenderTab`, `vsPaint`, `vsPendingCard`, `vsActiveCard`, `vsResolvedCard`, `vsToggleDetail`, `vsOpenCreate`, `vsOpenAccept`, `vsUpdateBadges`.

## Data it touches
- [[versusChallenges]], [[users]] (`grit`, `friends`)

## Connected to
- [[Versus Challenges]], [[Tab Switching]], [[Service Worker]], [[Versus Browser Test]]

## If you change this
- Removed solo/group challenge hosts must stay removed; the Versus test checks that no leftover host element remains.

## Where in the code
- index.html — `#challengesTab`.
- app.js — VERSUS CHALLENGES rendering (`vsRenderTab` and the board/card builders).
