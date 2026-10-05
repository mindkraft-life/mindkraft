---
type: data
sources: [app.js, functions/index.js, functions/lib/activities.js, functions/lib/push.js]
last_verified: 2026-10-05
---
# users

**In one line:** `users/{uid}` is the single Firestore document that holds almost the entire Mindkraft account — activities, XP, streaks, quests, routines, planner, Map, Grit balance, modes and settings — written as a whole by the client's `saveUserData()` and read (never written, except two narrow paths) by Cloud Functions.

## How it works
Top-level fields (all optional; missing means default):

| Field | Owner feature | Notes |
|---|---|---|
| `dimensions[]` → `paths[]` → `activities[]` | [[Dimensions And Paths]], [[Activities]] | The activity tree. Activity fields include `id` (Date.now string), `name`, `baseXP` (1–50, always positive), `frequency`, `isNegative`, `isSkipNegative`, `negativeXpMode`, `allowMultiplePerDay`, `customSubtype`, `customDays`, `scheduledDays`, `timesPerCycle`, `deleteOnComplete`, `completionHistory[{date, xp, isPenalty?, gritAwarded?}]` (max 365), `cycleHistory[{date}]`, `streak`, `bestStreak`, `shieldsConsumed`, `shieldCapUsed`, `shieldEvents[]`, `streakGrantedDate`, `streakStartWindow`, `lastProcessedDate`, `skipPenaltyWindow`, `lastSkipCheckDate`, `skipStreak`, `completionCount`, `totalXP`, `techTreeMastery`, `techTreeMasteredAt`, `createdAt`. Dimensions also carry `dimLevel`, `dimXP`, `dimTotalXP`, `dimRewards`. |
| `level`, `currentXP`, `totalXP`, `levelStartedAt`, `cardLevelStartedAt` | [[XP And Levels]], [[Level-Up Share Card]] | `currentXP` is XP inside the current level. |
| `xpTodayGhost{date: xp}`, `xpDeletedGhost`, `deletedActivityLog[]` (max 200), `modeXPLog[]` | [[Activity History Log]] | XP that no longer hangs off a completion row. |
| `rewards{level: reward}` | [[Level Rewards]] | |
| `settings` | [[Settings Page]] | `theme`, `savedThemes`, `levelScaling`, `streakScaling`, `activitySort`, `activitiesLastSubTab`, `activityViewMode`, `gridCardTypes`, `leaderboardMetric`, `activeRoutineDismissed`. |
| `profile` | [[Profile Page]] | `username`, `spiderTags{activityId: category}`. |
| `friends[]` (uids, max 20), `friendCode`, `leaderboardHidden[]`, `leaderboard{optIn, optInFrom, lastWeek, pub}` | [[Friends]], [[Leaderboard Payouts]] | |
| `planner{recurring[], days{date}}` | [[Daily Planner]] | |
| `groups[]` | [[Routines]] | |
| `projects[]` | [[Quests]] | |
| `techTree` | [[Tech Tree Map]], [[Map Reveal Loop]] | |
| `grit` | [[Grit Currency]] | `balance`, `lifetimeEarned`, `lifetimeSpent`, `shieldPool`, `week`, `awarded{}`, `boostPurchases[]`, `cadence{}`, `pendingBoost`. |
| `modes` | [[Modes]] | `active`, `pending[]`, `history[]`, `suspendedHabit`, `streakOffsets{}`, … |
| `pushSubscription{endpoint, keys}`, `timezone` | [[Reminders]], [[Push Delivery]] | One subscription per user. |
| `onboardingComplete`, `tutorialStep` | [[Onboarding Page]], [[First-Run Tutorial]] | `tutorialStep` 99 = done. |
| `autoBackup{savedAt, savedDate, data}` | [[Backup Export Import]] | Full copy of the doc, once per day. |
| `schemaVersion`, `createdAt` | [[Loading And Migration]] | |
| `vsDraftMappings`, `vsSeenResults` | [[Versus Challenges]] | Listed as retired but still written. |

Subcollections: [[reminders]], [[gritLedger]], [[gifts]], [[giftsSent]], [[aiUsage]].

## Key functions
- Client: `loadUserData`, `saveUserData`, `gritPersist`, `vsReadBalance` (transaction read/update of `grit.*`).
- Server reads: `processUser` in [[sendDueReminders]], [[createActivityReminder]], [[composeQuest]], [[weaveWeb]], `pushToUser`.
- Server writes: only the deletion of a dead push subscription (in `processUser` and `pushToUser`).

## Data it touches
- [[reminders]], [[gritLedger]], [[gifts]], [[giftsSent]], [[aiUsage]], [[publicProfiles]]

## Connected to
- [[Saving And The Write Invariant]], [[Loading And Migration]], [[Security Rules]], [[saveUserData]], [[loadUserData]]

## If you change this
- The client replaces the whole document on every save — server-side writes to top-level fields do not survive (the server's `pushSubscription` delete is undone by the next client save).
- Server code mirrors the activity tree shape in functions/lib/activities.js, quest-composer.js and web-weaver.js; a shape change must update both runtimes.
- Document size is bounded only by caps on history arrays and the 1 MiB Firestore limit; `autoBackup` roughly doubles the size.
- Activity ids are `Date.now().toString()` and are referenced by reminders, quests, groups, planner, Map nodes, modes, versus and pacts.

## Where in the code
- app.js — `loadUserData`, `saveUserData`, `migrateUserData`; field owners in their feature sections.
- functions/lib/activities.js — `findActivity`, `resolveActivityName`.
