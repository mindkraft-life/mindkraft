---
type: feature
sources: [index.html, app.js, test/nav/README.md]
last_verified: 2026-10-05
---
# Bottom Navigation

> [!summary] In plain words
> The menu at the bottom of the phone screen. It organises the app into four tabs — Social, Pursuits, Activities and More — each with three sections, and comes in five visual styles to choose from. You can also swipe to move between sections.
>
> **How it connects:** It opens every screen listed on [[App At A Glance]]. The style is chosen on the [[Settings Page]], and the screen changing itself is [[Tab Switching]].

**In one line:** Navigation v5 is a self-contained script in index.html that organises the app into 4 tabs × 3 sections (Social, Pursuits, Activities, More) and draws them as one of five switchable phone bottom-bar styles (Plate, Arc, Plume, Ledger, Spine), driving app.js only through `window.switchTab` / `window.switchSubTab`.

## How it works
- `NAV` table: Social → Friends (`people`), Leaderboards (`friends`), Challenges (`challenges`); Pursuits → Quests (`projects`), Modes (empty-page host), Narratives (empty page); Activities → My Activities, Categories, Map (sub-tabs of `activities`); More → Analytics, Rewards (empty-page host), Settings.
- `mkGo(t)` / `mkGoSub(t, s)` / `mkGoSubAt(s)` → `commit()` → `activateEntry` (legacy tabs via `switchTab`/`switchSubTab`) or `activateEmpty` (Modes/Narratives/Rewards, calling `modesOpenPage` / `gritOpenRewards`), with a forward/back animation and per-tab section memory.
- Styles: `renderPlate`, `renderArc` (two rotating dials, swipe), `renderPlume`, `renderLedger` (collapses after 20 s idle), `renderSpine` (`fitSpine` shrinks labels). Chosen with `mkSetNavStyle` in Settings, stored in localStorage `mk_nav_style`, applied as `body.mk-nav-<style>`.
- Page strip/heading: `renderPageStrip` shows crumb + title and lifts page buttons onto the title row (`placeAction`, `liftAction`, `restoreActions`); the Grit chip (`renderGrit` = `window.mkRenderGrit`, `mkOpenGrit`) and `mkGoModes` shortcuts.
- `syncNavToPage` / `bindNavSync` keep the nav in step when app.js switches tabs itself.
- Swipe between sections/tabs (`initSwipe`, ignoring horizontally scrollable areas); `.mk-nav-shield` swallows taps in the nav strip so a miss cannot complete an activity underneath.
- Also hosts the bottom-sheet behaviour for modals ([[Sheets Overlays And Back Button]]).

## Key functions
- `mkGo`, `mkGoSub`, `mkGoSubAt`, `mkStep`, `commit`, `activateEntry`, `activateEmpty`, `renderNav`, `renderPlate`, `renderArc`, `renderPlume`, `renderLedger`, `renderSpine`, `fitSpine`, `renderPageStrip`, `placeAction`, `renderGrit`, `syncNavToPage`, `bindNavSync`, `initSwipe`, `initArcDials`, `mkToggleLedger`, `mkSetNavStyle`, `mkOpenGrit`, `mkGoModes`, `boot`.

## Data it touches
- none in Firestore (localStorage `mk_nav_style`)

## Connected to
- [[Tab Switching]], [[Sheets Overlays And Back Button]], [[Settings Page]], [[Themes]], [[Modes Page]], [[Rewards Page]], [[Narratives Page]], [[Nav Browser Test]]

## If you change this
- The retired six-tab `.nav-tab` bar must stay in the DOM at zero size (`switchTab` marks it); the nav test asserts it stays inert.
- Three controls are deliberately below the 24px touch-target floor (`.mk-ledger-name`, `.mk-ledger-sub`, `.mk-spine-sub`); others must not be.
- The nav honours `prefers-reduced-motion` and the light theme; both are tested.

## Where in the code
- index.html — "Navigation v5" `<script>` (after the service-worker registration) and the five `<nav class="mk-bottom-nav …">` blocks.
