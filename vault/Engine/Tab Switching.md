---
type: engine
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Tab Switching

**In one line:** `window.switchTab(tabName)` and `window.switchSubTab(parent, sub)` show one `.tab-content` panel, render it on demand and persist the Activities sub-tab; the Navigation v5 script in index.html drives them for every legacy page and toggles the three newer pages (Modes, Narratives, Rewards) itself.

## How it works
- Tab ids map to DOM ids `<tabName>Tab`: `activities`, `challenges`, `projects` (Quests), `friends` (Leaderboards), `people` (Friends), `analytics`, `settings`.
- `switchTab` sets `window.currentTab`, marks the retired zero-size `.nav-tab` bar, swaps `.active` on `.tab-content`, then renders: `vsRenderTab` (challenges), `renderProjects` (projects), `renderFriendsTab` (friends/people), `loadSettings` (settings), `renderAnalytics` + `renderDimProgress` (analytics), and for activities restores the persisted sub-tab or renders `renderActivitiesList` / `renderDimensions`.
- `switchSubTab` toggles `.sub-tab` pills and `<parent>Sub<Name>` panels, renders Categories, and stores `settings.activitiesLastSubTab` (debounced save). The Tech Tree wrapper renders the Map when `techTree` is chosen.
- [[updateDashboard]] only re-renders the visible tab; `switchTab` renders whatever becomes visible, so skipped tabs are never stale when shown.
- Wrappers: Versus fetches challenges on entering Challenges and detaches its listener on leaving; Modes refreshes the banner after every switch (see [[Hook Chains]]).
- The "Modes", "Narratives" and "Rewards" pages are not tabs to `switchTab`; the nav's `activateEmpty()` toggles `mkEmptyPursuitsModes` / `mkEmptyPursuitsNarratives` / `mkEmptyMoreRewards` and calls `modesOpenPage()` / `gritOpenRewards()`.

## Key functions
- `switchTab` — see [[switchTab]].
- `switchSubTab`, `activateEmpty` / `activateEntry` (index.html), `mkGo`, `mkGoSub`.

## Data it touches
- [[users]] (`settings.activitiesLastSubTab`)

## Connected to
- [[Bottom Navigation]], [[Hook Chains]], [[My Activities Page]], [[Categories Page]], [[Map Page]], [[Quests Page]], [[Challenges Page]], [[Friends Page]], [[Leaderboards Page]], [[Analytics Page]], [[Settings Page]], [[Modes Page]], [[Rewards Page]], [[Narratives Page]]

## If you change this
- Tab ids are matched by string in `onclick` attributes (`switchTab('…')`) and by regex in `switchTab`'s sub-tab restore — renaming a tab means editing markup, regexes and the nav's `NAV` table.
- The legacy `.nav-tab` bar must stay in the DOM (0×0) because `switchTab` marks it; the nav test asserts it stays inert.
- `switchTab` also hides a `.stats-grid` element that no longer exists in index.html (harmless leftover).

## Where in the code
- app.js — "Tab switching" (`window.switchTab`) and "Sub-tab navigation" (`window.switchSubTab`), before the Daily Planner section.
- index.html — Navigation v5 script: `NAV`, `activateEmpty`, `activateEntry`, `commit`, `mkGo`, `mkGoSub`.
