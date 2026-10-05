---
type: feature
sources: [app.js, test/modes/README.md]
last_verified: 2026-10-05
---
# Stake Mode

> [!summary] In plain words
> Bet Grit on yourself: put down 25 to 100 Grit and set targets for up to three activities over 5 to 30 days. Hit every target and you get your Grit back plus a bonus (bigger for longer bets); miss any and you lose it.
>
> **How it connects:** One of the [[Modes]], paid with [[Grit Currency]]. [[Pact Mode]] is the two-person version.

**In one line:** Stake Mode lets a user bet 25–100 Grit that they will hit completion targets on up to three activities over 5–30 days; hitting every target returns the stake plus a 30%–90% bonus that grows with length, missing any loses it all.

## How it works
- Setup (`stakeRenderSetup`, `stakeBump`, `stakeStart`): wager in steps of 25, per-activity targets, combined target at least 5 (`STAKE_MIN_TOTAL`).
- Activation partway through a day counts today's completions (never past a target).
- Progress on each completion (`modesOnCompletion`), reversed on undo; every activity is judged against its own target, so over-logging one cannot carry another.
- `stakeMaybeResolve` at the end day (`stakeEndDay`, `stakeDaysLeft`): all hit (`stakeAllHit`) → payout `modeWagerPayoutFor(stake, days)`; otherwise lost. Ending early forfeits.

## Key functions
- `stakeEndDay`, `stakeDaysLeft`, `stakeAllHit`, `stakeTotalTarget`, `stakeTotalCount`, `stakeMaybeResolve`, `stakeRenderSetup`, `stakeBump`, `stakeStart`, `stakePanelHtml`, `modeWagerReturnFor`, `modeWagerPayoutFor`, `modeWagerReturnPct`.

## Data it touches
- [[users]] (`modes.active`, `grit`), [[gritLedger]]

## Connected to
- [[Modes]], [[Pact Mode]], [[Grit Currency]], [[Modes Browser Test]]

## If you change this
- The return curve is shared with Pact Mode (`modeWagerPayoutFor`); changing it changes both.

## Where in the code
- app.js — MODES "STAKE" block and `stakeRenderSetup`.
