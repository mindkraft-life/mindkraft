---
type: feature
sources: [app.js, functions/lib/modes.js, test/modes/README.md]
last_verified: 2026-10-05
---
# Habit Mode

**In one line:** Habit Mode (30 Grit) has the user pick up to three activities, each with a daily time window, a "why" in their own words and an optional anchor, and counts "N of M days achieved" over a 7–120 day run (default 33), with push nudges before and after each window.

## How it works
- Setup steps: `habitRenderSetup` → `habitSetupNext` / `habitDetailNext` → `habitStart` (activities, windows, `why`, `anchor`, target days).
- Days advance only while the mode is on (`habitAdvanceDays`); turning it off suspends the run (`modes.suspendedHabit`), and it can be resumed within 7 days (`habitOpenResume`, `habitResume`) or restarted (`habitStartFresh`).
- Activation partway through a day seeds today's completion (at most one per habit, day-stamped).
- Milestones show hand-written quotes (`habitCheckMilestone`, `modesShowMilestone`, `MODE_MILESTONE_QUOTES`); an overlay can appear around the window (`habitOverlayDue`, `habitMaybeShowOverlay`).
- Reminders: two `mode-habit-…` docs per habit — 60 min before the window (`pre`) and 30 min after (`post`); the server decides at send time whether to stay silent (already done today) or quote the user's `why` after a missed day.
- `habitFinish` ends the run.

## Key functions
- `habitRenderSetup`, `habitSetupNext`, `habitDetailNext`, `habitStart`, `habitAdvanceDays`, `habitOf`, `habitCheckMilestone`, `habitQuote`, `habitOverlayDue`, `habitMaybeShowOverlay`, `habitOpenResume`, `habitResume`, `habitStartFresh`, `habitFinish`, `habitPanelHtml`, and server-side `modeReminderCopy`, `previousLocalDate`, `completedOnLocalDate`.

## Data it touches
- [[users]] (`modes.active.habits`, `modes.suspendedHabit`), [[reminders]]

## Connected to
- [[Modes]], [[sendDueReminders]], [[Reminders]], [[Server Modes Test]], [[Modes Browser Test]]

## If you change this
- The user's `why` text is sent verbatim, never paraphrased or generated — a tested requirement.

## Where in the code
- app.js — MODES "HABIT" block, setup sheet `habitRenderSetup`; functions/lib/modes.js.
