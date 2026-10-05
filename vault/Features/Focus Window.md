---
type: feature
sources: [app.js, functions/lib/modes.js]
last_verified: 2026-10-05
---
# Focus Window

> [!summary] In plain words
> For a set number of days (3 to 90), every activity you tick earns 10% extra points. Longer windows cost more Grit to start.
>
> **How it connects:** One of the [[Modes]]; it adds to [[XP And Levels]]. A known issue — the bonus is not taken back when you un-tick — is listed in the [[Change Impact Guide]].

**In one line:** Focus Window is a mode that adds +10% XP to every positive completion, all day, for 3–90 days, priced from 25 Grit (3 days) to 150 Grit (90 days); each boost is paid immediately as separate mode XP, and the total is logged to history when the window ends.

## How it works
- `focusRenderSetup` / `focusStart` → `modesActivate('focus', {targetDays, daysElapsed, bonusXP, bonusCount})`, cost `focusCostFor(days)`.
- `modeBestMultiplierFor(activity)` returns `FOCUS_MULTIPLIER` (0.10) while the window runs, never for perform-negative activities; `modesOnCompletion` pays it with `modesAwardXP` and accumulates `bonusXP` / `bonusCount`.
- Ends after `targetDays` (`modeFocusFinished`, `focusFinish`), logging the total with `modeLogXP`.
- `modesOnUndo` has no Focus branch: undoing a boosted completion removes its base XP but keeps the +10% already paid, so complete → undo → complete pays the bonus again (see [[Change Impact Guide]]).
- Older runs carried a daily time window (`windowStart`/`windowEnd`); it is no longer read, and no focus reminders are scheduled any more.

## Key functions
- `focusCostFor`, `modeBestMultiplierFor`, `modeFocusFinished`, `focusFinish`, `focusRenderSetup`, `focusStart`, `focusPanelHtml`.

## Data it touches
- [[users]] (`modes.active`, user XP, `xpTodayGhost`, `modeXPLog`)

## Connected to
- [[Modes]], [[XP And Levels]], [[Activity History Log]], [[sendDueReminders]], [[Modes Browser Test]]

## If you change this
- functions/lib/modes.js still has a focus branch ("Your focus window opens at …") that nothing triggers any more.

## Where in the code
- app.js — MODES "FOCUS WINDOW" block and `focusRenderSetup`; functions/lib/modes.js `modeReminderCopy`.
