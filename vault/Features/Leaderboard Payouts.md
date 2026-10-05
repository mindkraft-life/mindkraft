---
type: feature
sources: [app.js, index.html, test/social/README.md]
last_verified: 2026-10-05
---
# Leaderboard Payouts

**In one line:** Friends leaderboards rank XP Today, This Week or XP/Hour, and users who opt in are paid Grit each Monday for 1st, 2nd and 3rd place last week — 3×, 2× and 1× the number of scored players — where only friends who were active that week and have you on their own board count.

## How it works
- **Ranking display:** `setLeaderboardMetric('xpToday' | 'weeklyXP' | 'xpPerHour')` (stored in `settings.leaderboardMetric`) ranks friends' [[publicProfiles]] figures; `lbOpenBoardEditor` / `toggleLeaderboardVisibility` hide or show people (`leaderboardHidden`, an exclusion list — new friends are on by default).
- **Opt-in:** `lbToggleOptIn` sets `leaderboard.optIn` with `optInFrom` = next Monday; opting out deletes the board document.
- **Publish:** `lbPublishBoard()` writes [[leaderboardBoards]] (members, frozen scored roster, this and last week's XP/completions), throttled to 5 minutes.
- **Settle (login, Monday rollover):** `lbSettleClosedWeek()` → for each member of last week's frozen roster, `lbReadBoard` (a denied read = not mutual) and keep those opted in, mutual and with completions → `lbRank(rows, scoredSize)` (ties split the combined pay, rounded down) → pay `lbPayForPosition(place, size)` (nothing below 3 players; 3rd place only from 8) via `gritApplyDelta`, marker `leaderboard:<anchor>` set first. Toast opens the final standings (`lbShowStandings`).
- `lbRenderPayoutSection()` shows the opt-in card and last week's result.

## Key functions
- `lbOnLogin`, `lbState`, `lbPublishBoard`, `lbReadBoard`, `lbMyWeek`, `lbRosterFor`, `lbBoardMembers`, `lbSettleClosedWeek`, `lbRank`, `lbPayForPosition`, `lbShowStandings`, `lbToggleOptIn`, `lbToggleOptInInfo`, `lbRenderPayoutSection`, `lbOpenBoardEditor`, `lbCloseBoardEditor`, `lbSyncRosterRow`, `setLeaderboardMetric`, `toggleLeaderboardVisibility`, `frLeaderboardHtml`.

## Data it touches
- [[users]] (`leaderboard`, `leaderboardHidden`, `settings.leaderboardMetric`, `grit`), [[leaderboardBoards]], [[publicProfiles]], [[gritLedger]]

## Connected to
- [[Leaderboards Page]], [[Friends]], [[Grit Currency]], [[Dates Days And Weeks]], [[Security Rules]], [[Social Browser Test]]

## If you change this
- Payout ranking runs on each client, so the idempotency marker is the only guard against paying once per device.
- The two anti-farming rules (active and mutual) are both required.

## Where in the code
- app.js — "LEADERBOARD PAYOUTS" section; leaderboard metric/visibility in the FRIENDS FEATURE section.
- index.html — `#friendsTab`, `#lbPayoutSection`.
