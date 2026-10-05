---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Modes Page

**In one line:** Pursuits › Modes shows the user's Grit balance, the running mode (with its own progress panel and an End button) and the catalog of seven modes to start, plus any Pact invites waiting for an answer.

## How it works
- Host `#mkEmptyPursuitsModes`; the nav's `activateEmpty` calls `window.modesOpenPage()` → `modesRenderPage()` into `#modesRoot` (rewritten every render); the Grit chip `#modesGrit` sits outside and is lifted onto the title row.
- Cards: `modesCatalogCardHtml`, `modesActiveCardHtml` + per-kind panels (`habitPanelHtml`, `berserkPanelHtml`, `recoveryPanelHtml`, `insurancePanelHtml`, `stakePanelHtml`, `focusPanelHtml`, `pactPanelHtml`), `modesInviteCardsHtml`.
- Starting a mode opens a setup sheet (`modesOpenSetup`); "mark done" buttons call `modeMark` (a real completion); `modeGoToActivity` jumps to the activity.
- The `#modesBanner` under the header (every page) links here (`mkGoModes`).

## Key functions
- `modesOpenPage`, `modesRenderPage`, `modesRenderGritChip`, `modesOpenSetup`, `modeMark`, `modeGoToActivity`, `modesConfirmEnd`, `pactOpenAccept`, `pactDecline`, `pactWithdraw`.

## Data it touches
- [[users]] (`modes`, `grit`), [[pacts]]

## Connected to
- [[Modes]], [[Habit Mode]], [[Berserk Mode]], [[Recovery Mode]], [[Insurance Mode]], [[Stake Mode]], [[Pact Mode]], [[Focus Window]], [[Bottom Navigation]], [[Service Worker]] (mode/pact/versus pushes open this page)

## If you change this
- The host id still says "Empty" (`mkEmptyPursuitsModes`) from when the page was a placeholder; the nav references it by that id.

## Where in the code
- index.html — `#mkEmptyPursuitsModes`, `#modesBanner`.
- app.js — "THE MODES PAGE (Pursuits › Modes)" and "SETUP SHEETS".
