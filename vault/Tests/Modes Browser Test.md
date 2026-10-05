---
type: test
sources: [test/modes/modes.test.mjs, test/modes/hooks.js, test/modes/README.md]
last_verified: 2026-10-05
---
# Modes Browser Test

> [!summary] In plain words
> Checks that all seven modes behave as designed — prices, rewards, how they protect or boost streaks, targets, and pacts with friends.
>
> **How it connects:** Guards [[Modes]] and the individual mode pages.

**In one line:** test/modes/modes.test.mjs (153 checks) drives the real app.js to pin the Modes rate card and every mode's hidden mechanics — above all how Recovery and Insurance stay additive around the login streak walk — plus Berserk's baseline and gate, mid-day activation, the resolution card, and Pact's two document shapes.

## How it works
- Uses [[Browser Test Harness]] with `hooks.js` (`window.__mm`, incl. `rearm()` to simulate consecutive days).
- Covers: costs and wager ranges; one-mode-at-a-time; a control case where an unshielded miss breaks a streak; Insurance keeping a streak and returning shields, credit outliving the mode until a real gap; Recovery's ceiling from `bestStreak`, one step per completion, undo reversal; Berserk's dampened target, 28-day baseline window, 20/hour floor, two-condition gate, 10%-per-hour swing and undo of gate counters; Focus multiplier excluding perform-negative and midnight-crossing windows; Stake all-or-nothing and forfeit; Habit days-achieved, pause/resume and 7-day expiry; today's completions seeding Stake and Habit; resolution-card icons rendered as elements not text; Pact read tolerance, per-activity caps, "out of reach" per activity, the setup sheet end-to-end and its friend-name fetch.

## Key functions
- Exercises `modesActivate`, `modesOnCompletion`, `modesOnUndo`, `modesBeforeStreakWalk`, `modesAfterStreakWalk`, `processStreakPauses`, `berserkPerHourTarget`, `berserkGate`, `stakeMaybeResolve`, `habitAdvanceDays`, `pactItems`, `pactStats`, `pactRenderSetup`, `modesShowResolution`.

## Data it touches
- Stubbed [[users]] (`modes`, activities), [[pacts]]

## Connected to
- [[Modes]], [[Habit Mode]], [[Berserk Mode]], [[Recovery Mode]], [[Insurance Mode]], [[Stake Mode]], [[Pact Mode]], [[Focus Window]], [[Streaks And Shields]], [[processStreakSystem]]

## If you change this
- Server-side parts (rules, mode reminder copy, pact pushes) are covered by [[Rules Test]], [[Server Modes Test]] and [[Server Pact Test]], not here.

## Where in the code
- test/modes/modes.test.mjs, test/modes/hooks.js.
