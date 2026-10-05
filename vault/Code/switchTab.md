---
type: code
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# switchTab

> [!summary] In plain words
> Shows the screen you asked for and draws its contents.
>
> **How it connects:** Explained in [[Tab Switching]]; driven by the [[Bottom Navigation]].

**In one line:** `window.switchTab(tabName)` activates one of the legacy page panels (`activities`, `challenges`, `projects`, `friends`, `people`, `analytics`, `settings`), renders it, and is wrapped by Versus (fetch on entry, detach listener on exit) and Modes (refresh the banner).

## How it works
- Sets `window.currentTab`, toggles `.tab-content.active`, marks the hidden legacy bar, and calls the tab's renderer; for `activities` restores the persisted sub-tab.
- Called by the Navigation v5 script, the back-button guard (returns to `activities`), deep links (`?tab=friends`), reminder taps, the tutorial and many in-app shortcuts.

## Key functions
- `switchTab`, `switchSubTab`, `vsRenderTab`, `renderProjects`, `renderFriendsTab`, `loadSettings`, `renderAnalytics`, `renderActivitiesList`, `renderDimensions`, `modesRefreshBanner`.

## Data it touches
- [[users]] (reads `settings.activitiesLastSubTab`)

## Connected to
- [[Tab Switching]], [[Bottom Navigation]], [[Hook Chains]], [[Sheets Overlays And Back Button]], [[Versus Challenges]], [[Modes]]

## If you change this
- Modes, Narratives and Rewards are not `switchTab` targets; the nav shows them directly.

## Where in the code
- app.js — "Tab switching" block before the Daily Planner; wrappers at the end of VERSUS and in Modes WIRING.
