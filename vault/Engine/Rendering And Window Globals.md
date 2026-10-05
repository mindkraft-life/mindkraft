---
type: engine
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Rendering And Window Globals

**In one line:** The Mindkraft UI is built by app.js functions that concatenate HTML strings into `innerHTML`, wire events with inline `onclick="someFn(...)"` attributes, and therefore expose every callable handler on `window` because app.js is an ES module whose top-level functions are otherwise private.

## How it works
- No framework, no virtual DOM. Each page has a render function (`renderActivitiesList`, `renderDimensions`, `renderProjects`, `renderTechTree`, `vsRenderTab`, `modesRenderPage`, `gritRenderRewards`, `renderAnalytics`, …) that rebuilds a container's `innerHTML`.
- Handlers referenced from markup must be `window.X = function…`. Module-private helpers (`function foo()`) cannot be called from `onclick`.
- Anything user-typed that goes into markup must pass through `escapeHtml(text)` (or a feature alias: `gritEsc`, `giftEsc`, `modeEsc`, `prAttr`). `showToast` sets its message with `textContent`.
- index.html's inline scripts (in-app browser detector, service-worker registration, Navigation v5) talk to app.js only through `window.*` entry points such as `switchTab`, `switchSubTab`, `applyThemePreset`, `saveTheme`, `gritBalance`, `gritOpenRewards`, `modesOpenPage`, `mkBindSheet`.
- Several render loops guard against stale async paints with sequence numbers (`_frSeq` in the friends tab) or "is visible" checks (`ttRenderIfVisible`, `vsRenderIfVisible`, `frRenderIfVisible`, `plannerRerenderIfVisible`).
- Containers that the nav "lifts" buttons out of (`placeAction`) keep those buttons outside the re-rendered root, otherwise a re-render would destroy them.

## Key functions
- `escapeHtml` — see [[escapeHtml]].
- `phIcon` — icon markup ([[Icons]]).
- Per-page render functions listed above.

## Data it touches
- [[users]] (read-only during render)

## Connected to
- [[Hook Chains]], [[Tab Switching]], [[Bottom Navigation]], [[Toasts And Feedback]], [[Icons]], [[Sheets Overlays And Back Button]]

## If you change this
- Renaming a `window.*` handler breaks every `onclick` string that names it — grep both app.js (HTML built in strings) and index.html.
- Two features once assigned the same window name: `window.addGroup` is set by Routines and then overwritten by the Quest builder (see [[Change Impact Guide]]).
- A missed `escapeHtml` on a user-provided string (activity, quest, friend name) is an XSS hole, including names that arrive from other users via [[publicProfiles]], [[versusChallenges]], [[pacts]] and [[gifts]].

## Where in the code
- app.js — `escapeHtml` / `_escReplacer` near the Categories renderers; render functions throughout.
- index.html — every `onclick=` attribute and the three inline `<script>` blocks.
