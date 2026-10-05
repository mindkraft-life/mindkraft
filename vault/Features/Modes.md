---
type: feature
sources: [app.js, index.html, functions/lib/modes.js, test/modes/README.md]
last_verified: 2026-10-05
---
# Modes

> [!summary] In plain words
> Seven optional challenges you switch on with Grit, one at a time: Habit (build a new habit), Berserk (a short points sprint), Recovery (rebuild a broken streak quickly), Insurance (protect streaks for a while), Stake (bet on yourself), Pact (a shared promise with a friend) and Focus Window (extra points for a number of days). Each keeps its own score and ends with a results card.
>
> **How it connects:** Shown on the [[Modes Page]]. Modes react to every tick ([[Activity Completion]]), some adjust streaks during [[Login-Time Processing]], and they are paid for with [[Grit Currency]]. Each mode has its own page.

**In one line:** Modes are seven opt-in, Grit-priced challenges on the Pursuits › Modes page — Habit, Berserk, Recovery, Insurance, Stake, Pact and Focus Window — of which exactly one can run at a time, stored in `userData.modes` (Pact also in the shared `pacts` collection) and hooked into completions, undos and the login streak walk.

## How it works
- **State** (`modesState()`): `{schemaVersion, active, pending[], history[], suspendedHabit, streakOffsets{}, seenHabitOverlay, offsetDay, …}`. `active` is one object `{kind, id, startedAt, startedDay, cost, …kind-specific}`.
- **Price list:** entry costs Habit 30, Berserk 40, Recovery 15, Insurance 20/35/50 (by term), Focus 25–150 (by days); Stake 25–100 and Pact 40 are wagers returned with a 30%–90% bonus that scales with length (`modeWagerPayoutFor`).
- **Activate:** `modesOpenSetup(kind)` opens a setup sheet; `modeStartOptimistic` → `modesActivate(kind, payload, cost)` refuses a second mode or a pending Pact, charges via `gritPurchase`, sets `active`, syncs reminders (`modesSyncNotifications`), applies the theme and banner. Tracked as `mode_activated`.
- **Hooks:** `modesOnCompletion` / `modesOnUndo` (wrappers on `completeActivity` / `undoActivity`); `modesBeforeStreakWalk` / `modesAfterStreakWalk` (inside `processStreakPauses`); `modesOnLogin` and app foreground → `modesRunPass` (advance day counters, resolve due modes, show resolution cards); `modesRefreshBanner` after every tab switch.
- **End:** `modesEnd(outcome, summary)` moves `active` into `history`, queues a resolution card (`modesQueueResolution` → `modesShowResolution`), removes mode reminders. User-ended via `modesConfirmEnd` → `modesEndByUser` (wagers are forfeited).
- **XP from modes:** `modesAwardXP` (Berserk swings, Focus bonuses) adds to user XP and `xpTodayGhost`; `modeLogXP` records it in `modeXPLog` for history.
- **Page/UI:** `modesOpenPage` → `modesRenderPage` (catalog cards, active card with a per-kind panel, Pact invites); `#modesBanner` across the app (`modesRefreshBanner`, `modeBannerStatus`); setup sheets (`modeSheet`, sliders, steppers, activity pickers).

## Key functions
- `modesOnCompletion` — see [[modesOnCompletion]].
- `modesState`, `modesActive`, `modesActivate`, `modesEnd`, `modesEndByUser`, `modesConfirmEnd`, `modesRunPass`, `modesOnLogin`, `modesOnUndo`, `modesBeforeStreakWalk`, `modesAfterStreakWalk`, `modesAwardXP`, `modeLogXP`, `modesSyncNotifications`, `modesDesiredReminders`, `modesApplyTheme`, `modesRefreshBanner`, `modesOpenPage`, `modesRenderPage`, `modesOpenSetup`, `modeStartOptimistic`, `modeStartRollback`, `modesShowResolution`, `modeMark`, `modeEligibleActivities`, `modeCompletionsOnDay`, `modeWagerPayoutFor`.

## Data it touches
- [[users]] (`modes`, `grit`, `modeXPLog`, `xpTodayGhost`, activity streaks), [[reminders]] (`mode-…` docs), [[pacts]], [[gritLedger]]

## Connected to
- [[Habit Mode]], [[Berserk Mode]], [[Recovery Mode]], [[Insurance Mode]], [[Stake Mode]], [[Pact Mode]], [[Focus Window]], [[Modes Page]], [[Grit Currency]], [[Login-Time Processing]], [[Hook Chains]], [[Reminders]], [[sendDueReminders]], [[Modes Browser Test]], [[Server Modes Test]]

## If you change this
- Only one mode at a time is enforced in `modesActivate` (and `pactCreate`); allowing several needs `active` to become a list everywhere.
- Mode offsets for streaks must stay outside `processStreakSystem` (additive passes only).
- Entry costs are never refunded; wagers are escrowed.

## Where in the code
- app.js — "MODES" section to the end of the file (rate card, lifecycle, XP movement, per-mode blocks, streak passes, completion hooks, login pass, Pact, Modes page, setup sheets, resolution cards, wiring).
- functions/lib/modes.js — reminder copy.
