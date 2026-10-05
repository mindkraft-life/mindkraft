---
type: feature
sources: [app.js, style.css, test/modes/README.md]
last_verified: 2026-10-05
---
# Berserk Mode

> [!summary] In plain words
> A short, intense sprint. You choose 1 to 5 hours and the app sets a points target based on your normal pace. Hit it and you win extra points (10% for every hour you chose); miss it and you lose the same share. While it runs, the whole app turns red.
>
> **How it connects:** One of the [[Modes]]. It adds to or takes from your [[XP And Levels]], and the result appears in the [[Activity History Log]].

**In one line:** Berserk Mode (40 Grit) sets a personal XP target for a 1–5 hour sprint; clearing it (enough completions and enough base XP) pays a bonus of 10% of the session's XP per hour chosen, and missing it costs the same percentage — and the whole app turns red while it runs.

## How it works
- Target: `berserkPerHourTarget()` from the trailing 7-day XP-per-hour (12 waking-hour convention), dampened toward the longer baseline (`BERSERK_DAMPENER` 0.22 of anything above it), baseline window = real history up to 28 days (`berserkBaselineDays`), floor 20 XP/hour. `berserkTargetFor(hours)`.
- Gate (`berserkGate`): completions ≥ hours committed AND `baseXpEarned` (pre-bonus) ≥ target. Undo takes both counters back.
- Swing: `berserkSwingFor(hours)` = 10% per hour (±10% … ±50%) of the real XP earned in the session (`berserkEarned`), applied with `modesAwardXP` and logged with `modeLogXP`.
- Resolution: `berserkMaybeResolve` when the window expires (`modeBerserkExpired`); `berserkResolutionLines` for the card.
- `modesApplyTheme` toggles the `mk-mode-berserk` class on `<body>`, which style.css uses to override the accent, progress and glow colours with reds and pulse the background; a wrapper on `applyThemePreset` keeps it through theme changes.

## Key functions
- `berserkBaselineDays`, `berserkPerHourTarget`, `berserkTargetFor`, `berserkSwingFor`, `berserkSwingPct`, `berserkLedeText`, `berserkTargetLabel`, `modeBerserkExpired`, `berserkEarned`, `berserkTracked`, `berserkGate`, `berserkResolutionLines`, `berserkMaybeResolve`, `berserkRenderSetup`, `berserkStart`, `berserkPanelHtml`, `modeAvgPerHour`, `modeDailyXPMap`.

## Data it touches
- [[users]] (`modes.active`, user XP, `xpTodayGhost`, `modeXPLog`)

## Connected to
- [[Modes]], [[XP And Levels]], [[Activity History Log]], [[Themes]], [[Modes Browser Test]], [[Payout Browser Test]]

## If you change this
- The setup label and slider must state both gate halves before Grit is spent (one shared label builder).

## Where in the code
- app.js — MODES "BERSERK" block and `berserkRenderSetup`.
