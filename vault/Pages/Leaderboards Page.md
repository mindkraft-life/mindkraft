---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Leaderboards Page

**In one line:** Social › Leaderboards ranks you and your friends by XP Today, This Week or XP per hour, lets you edit who is on your board, and holds the weekly Grit payout opt-in with last week's result.

## How it works
- Tab id `friends` (`#friendsTab`); `switchTab('friends')` → `renderFriendsTab()`.
- Metric tabs (`setLeaderboardMetric`, `frSyncMetricTabs`), rows (`frLeaderboardHtml` into `#friendsLeaderboard`), board editor sheet (`lbOpenBoardEditor`), payout section (`lbRenderPayoutSection` into `#lbPayoutSection`, `lbToggleOptIn`, `lbShowStandings`).
- Figures for friends come from their [[publicProfiles]]; your own row is computed live.

## Key functions
- `renderFriendsTab`, `setLeaderboardMetric`, `frLeaderboardHtml`, `frMetricVal`, `lbOpenBoardEditor`, `lbSyncRosterRow`, `toggleLeaderboardVisibility`, `lbRenderPayoutSection`, `lbToggleOptIn`, `lbShowStandings`.

## Data it touches
- [[users]] (`leaderboardHidden`, `leaderboard`, `settings.leaderboardMetric`), [[publicProfiles]], [[leaderboardBoards]]

## Connected to
- [[Leaderboard Payouts]], [[Friends]], [[Public Profile]], [[Friends Page]], [[Tab Switching]]

## If you change this
- Displayed ranks use public-profile figures (as fresh as each friend's last save); payouts use the published boards' frozen weekly numbers — the two can differ.

## Where in the code
- index.html — `#friendsTab`, `#frLbTabs`, `#friendsLeaderboard`, `#lbPayoutSection`.
- app.js — FRIENDS FEATURE (metric rendering) and LEADERBOARD PAYOUTS.
