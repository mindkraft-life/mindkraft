---
type: index
last_verified: 2026-10-05
---
# Function Index

> [!summary] In plain words
> This page is a lookup table for the people who build the app. The program is made of many small named pieces, and this table says which vault page explains each one. You don't need it to understand the app; it exists so a builder can go from a name they saw in the program to the right explanation.
>
> **How it connects:** Builders use it alongside [[Home]]. If you are reading to understand the app rather than build it, the Pages and Features groups on [[Home]] are a better starting point.

**In one line:** Every function defined in the Mindkraft web client (app.js, the inline scripts in index.html, sw.js) and server (functions/index.js, functions/lib/*.js, scripts/send-reminders.js) — 1442 names — mapped alphabetically to the vault note that documents the code around it, plus any other note that names it under "Key functions".

How to read it: **Note** is where the function lives conceptually (its feature, page, engine mechanic, Cloud Function or — for hub functions — its own Code note). **Also in** lists other notes that mention it. Inner helpers (`close`, `card`, `tick`, …) appear under every note whose code defines one with that name. `window.X` handlers are listed by their bare name. Test-file helpers are not listed; see the Tests notes.

Keep it live: when you add, rename or delete a function, update its row. `node vault/.tools/check-vault.mjs` lists functions missing from this table and rows naming functions that no longer exist.

Back to [[Home]].

| Function | Note | Also in | File |
|---|---|---|---|
| `$` | [[In-App Browser Page]], [[Bottom Navigation]] | — | index.html |
| `acceptFriendRequest` | [[Friends]] | [[Friends Page]], [[friendRequests]] | app.js |
| `actIconSvg` | [[Dimensions And Paths]] | — | app.js |
| `activateCustomTheme` | [[Themes]] | — | app.js |
| `activateEmpty` | [[Bottom Navigation]] | [[Narratives Page]], [[Tab Switching]] | index.html |
| `activateEntry` | [[Bottom Navigation]] | [[Tab Switching]] | index.html |
| `activePathsAndDims` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `activeRoutineDismissed` | [[Routines]] | — | app.js |
| `activeRoutineSeedIds` | [[Routines]] | — | app.js |
| `activeSubName` | [[Bottom Navigation]] | — | index.html |
| `activityAllowsMultiGroup` | [[Routines]] | — | app.js |
| `activityMenu` | [[composeQuest]] | [[Server Pipeline Test]], [[Server Quest Composer Test]] | functions/lib/quest-composer.js |
| `activitySnapshot` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `actMeta` | [[Quests]] | — | app.js |
| `_actTreeFingerprint` | [[Activity Index]] | — | app.js |
| `addAnchor` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `addChartOverlay` | [[Analytics Page]] | — | app.js |
| `addFriendByCode` | [[Friends]] | [[Friends Page]], [[friendRequests]], [[publicProfiles]] | app.js |
| `addGroup` | [[Routines]], [[Quests]] | — | app.js |
| `addGroupCard` | [[Quests]] | — | app.js |
| `addLeafRow` | [[Quests]] | — | app.js |
| `addNestedGroup` | [[Quests]] | — | app.js |
| `addTaskRow` | [[Quests]] | — | app.js |
| `adjustColor` | [[Themes]] | — | app.js |
| `allLeaves` | [[Quests]] | [[updateQuestProgress]] | app.js |
| `anchorSummaries` | [[weaveWeb]] | — | functions/index.js |
| `angle` | [[Character Title And Life Balance]] | — | app.js |
| `animate` | [[Bottom Navigation]] | — | index.html |
| `animateCounter` | [[Toasts And Feedback]] | [[XP And Levels]], [[updateDashboard]] | app.js |
| `appliedShieldCount` | [[Streaks And Shields]] | — | app.js |
| `applyActivitySort` | [[Activity List And Grid Views]] | — | app.js |
| `applyAnalyticsFilters` | [[Analytics Page]] | — | app.js |
| `applyBgGlow` | [[Themes]] | — | app.js |
| `_applyCadenceUI` | [[Quests]] | — | app.js |
| `applyDimXP` | [[Dimension Levels]] | [[completeActivity]], [[undoActivity]] | app.js |
| `_applyGlowsFromSaved` | [[Themes]] | — | app.js |
| `applyGradientPreset` | [[Themes]] | — | app.js |
| `applyLevelScaling` | [[XP And Levels]] | [[Settings Page]] | app.js |
| `applyPersistedActivitiesSubTab` | [[App Boot Sequence]] | — | app.js |
| `applyRetroactiveRecalculation` | [[Retroactive History Editing]] | — | app.js |
| `applyStreakScaling` | [[Activity Completion]] | [[Settings Page]] | app.js |
| `_applyThemeMode` | [[Themes]] | — | app.js |
| `applyThemePreset` | [[Themes]], [[Hook Chains]] | — | app.js |
| `archiveProject` | [[Quests]] | — | app.js |
| `arcTransform` | [[Bottom Navigation]] | — | index.html |
| `arm` | [[Sheets Overlays And Back Button]] | — | app.js |
| `atTime` | [[Reminder Scheduling]] | — | functions/lib/schedule.js |
| `backupNow` | [[Backup Export Import]] | [[Settings Page]] | app.js |
| `berserkBaselineDays` | [[Berserk Mode]] | — | app.js |
| `berserkEarned` | [[Berserk Mode]] | — | app.js |
| `berserkGate` | [[Berserk Mode]] | [[Modes Browser Test]] | app.js |
| `berserkLedeText` | [[Berserk Mode]] | — | app.js |
| `berserkMaybeResolve` | [[Berserk Mode]] | [[modesOnCompletion]] | app.js |
| `berserkPanelHtml` | [[Berserk Mode]] | — | app.js |
| `berserkPerHourTarget` | [[Berserk Mode]] | [[Modes Browser Test]] | app.js |
| `berserkRenderSetup` | [[Berserk Mode]] | — | app.js |
| `berserkResolutionLines` | [[Berserk Mode]] | — | app.js |
| `berserkStart` | [[Berserk Mode]] | — | app.js |
| `berserkSwingFor` | [[Berserk Mode]] | — | app.js |
| `berserkSwingPct` | [[Berserk Mode]] | — | app.js |
| `berserkTargetFor` | [[Berserk Mode]] | — | app.js |
| `berserkTargetLabel` | [[Berserk Mode]] | — | app.js |
| `berserkTracked` | [[Berserk Mode]] | — | app.js |
| `bindCopy` | [[In-App Browser Page]] | — | index.html |
| `bindNavSync` | [[Bottom Navigation]] | — | index.html |
| `bindSheet` | [[Sheets Overlays And Back Button]] | — | index.html |
| `blankGroup` | [[Quests]] | — | app.js |
| `boot` | [[Bottom Navigation]] | — | index.html |
| `_bucketRank` | [[Activity List And Grid Views]] | — | app.js |
| `_bucketSort` | [[Activity List And Grid Views]] | — | app.js |
| `_buildActIdx` | [[Quests]] | — | app.js |
| `buildColorGrid` | [[Themes]] | — | app.js |
| `buildComposePrompt` | [[composeQuest]] | [[Server Pipeline Test]] | functions/lib/quest-composer.js |
| `buildCtx` | [[composeQuest]] | [[Server Quest Composer Test]] | functions/lib/quest-composer.js |
| `buildExpandPrompt` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `buildGeneratePrompt` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `buildGradientPresets` | [[Themes]] | — | app.js |
| `_buildGroupTimeOptions` | [[Routines]] | — | app.js |
| `buildLevelUpCard` | [[Level-Up Share Card]] | — | app.js |
| `buildNode` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `buildOverlayLog` | [[Analytics Page]] | — | app.js |
| `buildPayload` | [[Push Delivery]] | [[Server Activities Test]], [[sendDueReminders]] | functions/lib/push.js |
| `buildResolution` | [[resolveDueVersusChallenges]] | [[Server Versus Test]], [[versusChallenges]] | functions/lib/versus.js |
| `buildSeriesPoints` | [[Analytics Page]] | — | app.js |
| `buildShareLevelUpBtn` | [[Level-Up Share Card]] | — | app.js |
| `buildTimeWindow` | [[Legacy Reminder Script]] | — | scripts/send-reminders.js |
| `buildWildcardPrompt` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `bumpIdle` | [[Model Adapter]] | — | functions/lib/model.js |
| `bumpLeaf` | [[Quests]] | — | app.js |
| `bumpLedgerIdle` | [[Bottom Navigation]] | — | index.html |
| `cadenceFooterText` | [[Quests]] | — | app.js |
| `calculateConsistencyMultiplier` | [[Activity Completion]] | [[Streaks And Shields]], [[predictCompletionXP]] | app.js |
| `calculateDimXPForLevel` | [[Dimension Levels]] | — | app.js |
| `calculateStreak` | [[Streaks And Shields]] | — | app.js |
| `calculateXPForLevel` | [[XP And Levels]] | [[updateDashboard]] | app.js |
| `calendarNav` | [[Analytics Page]] | — | app.js |
| `callModel` | [[Model Adapter]] | — | functions/lib/model.js |
| `canAddActivity` | [[Activities]] | — | app.js |
| `cancelPendingUserDataSave` | [[Saving And The Write Invariant]] | [[canPersistUserData]] | app.js |
| `cancelUsernameEdit` | [[Profile Page]] | — | app.js |
| `canCompleteActivity` | [[Activity Frequencies And Cycles]] | — | app.js |
| `canCompleteCustomToday` | [[Activity Frequencies And Cycles]] | — | app.js |
| `canPersistUserData` | [[canPersistUserData]] | [[Saving And The Write Invariant]], [[saveUserData]] | app.js |
| `cappedTotal` | [[resolveDueVersusChallenges]] | [[Server Versus Test]] | functions/lib/versus.js |
| `card` | [[Social Gifting]] | — | app.js |
| `cards` | [[Quests]] | — | app.js |
| `categoriesGoToActivity` | [[Activity Search]] | — | app.js |
| `categoriesSearchKeyHandler` | [[Activity Search]] | — | app.js |
| `celebCard` | [[Level-Up Share Card]] | — | app.js |
| `centerPipes` | [[Quests]] | — | app.js |
| `checkAndNotify` | [[Reminders]] | — | app.js |
| `checkStreakMilestone` | [[Streaks And Shields]] | [[Toasts And Feedback]] | app.js |
| `chev` | [[Quests]] | — | app.js |
| `claimColor` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `cleanupGroupsForActivity` | [[Routines]] | — | app.js |
| `clearCycleNode` | [[Quests]] | — | app.js |
| `clearRecurringItems` | [[Quests]] | — | app.js |
| `clearReminder` | [[Reminders]] | [[Settings Page]] | app.js |
| `close` | [[Social Gifting]], [[Modes]] | — | app.js |
| `closeActivityInfo` | [[Activities]] | — | app.js |
| `closeActivityModal` | [[Activities]], [[Tech Tree Map]], [[Versus Challenges]] | [[Activity Editor Page]] | app.js |
| `closeActivityReminderModal` | [[Reminders]] | — | app.js |
| `closeActivitySearch` | [[Activity Search]] | — | app.js |
| `closeCardTypePicker` | [[Activity List And Grid Views]] | — | app.js |
| `closeCatActionMenu` | [[Dimensions And Paths]] | — | app.js |
| `closeCategoriesInfo` | [[Categories Page]] | — | app.js |
| `closeCategoriesSearch` | [[Activity Search]] | — | app.js |
| `closeDimensionModal` | [[Dimensions And Paths]] | — | app.js |
| `closeFilterPanel` | [[Activity List And Grid Views]] | — | app.js |
| `closeFriendProfileCard` | [[Friend Profile Page]] | — | app.js |
| `closeGridActionMenu` | [[Activity List And Grid Views]] | — | app.js |
| `closeGridCardOverlay` | [[Activity List And Grid Views]] | — | app.js |
| `closeGroupModal` | [[Routines]] | — | app.js |
| `closeIconPicker` | [[Icons]] | — | app.js |
| `closePathModal` | [[Dimensions And Paths]] | — | app.js |
| `closePlannerAddModal` | [[Daily Planner]] | — | app.js |
| `closeProfileOverlay` | [[Profile Page]] | — | app.js |
| `closeProjectActivityPicker` | [[Quests]] | — | app.js |
| `closeProjectDetail` | [[Quests Page]] | — | app.js |
| `closeProjectModal` | [[Quests]], [[Quest Composer]] | — | app.js |
| `closeProjectsInfo` | [[Quests Page]] | — | app.js |
| `closeQuestComposer` | [[Quest Composer]] | — | app.js |
| `closeRetroPicker` | [[Retroactive History Editing]] | — | app.js |
| `closeRewardModal` | [[Level Rewards]] | — | app.js |
| `closeTopOverlay` | [[Sheets Overlays And Back Button]] | — | app.js |
| `collectActivities` | [[composeQuest]], [[weaveWeb]] | — | functions/lib/quest-composer.js, functions/lib/web-weaver.js |
| `commit` | [[Bottom Navigation]] | — | index.html |
| `commitWeaveUsage` | [[weaveWeb]] | [[aiUsage]] | functions/index.js |
| `completeActivity` | [[completeActivity]] | [[Activity Completion]], [[Grit Clawback Test]], [[Hook Chains]], [[recordCompletion]] | app.js |
| `completeActivityById` | [[Activity Completion]] | [[Activity List And Grid Views]], [[My Activities Page]], [[completeActivity]] | app.js |
| `completedOnLocalDate` | [[Habit Mode]] | [[Server Modes Test]] | functions/lib/activities.js |
| `completeProject` | [[Tech Tree Map]] | — | app.js |
| `completeProjectCycle` | [[Tech Tree Map]], [[Quests]] | [[Quests Page]] | app.js |
| `composeQuest` | [[composeQuest]] | [[Firebase Client]], [[Server Deploy Test]] | functions/index.js |
| `computeNextSendDate` | [[Reminder Scheduling]] | [[Server Schedule Test]], [[onReminderWrite]], [[sendDueReminders]] | functions/lib/schedule.js |
| `computeProjectDimensions` | [[Quests]] | — | app.js |
| `computeWeeklyCompletions` | [[Public Profile]] | — | app.js |
| `computeWeeklyXP` | [[Public Profile]] | [[publicProfiles]], [[syncPublicProfile]] | app.js |
| `computeWeeklyXPFromActivities` | [[Public Profile]] | — | app.js |
| `computeWhatsNext` | [[Quests]] | — | app.js |
| `computeXPPerHour` | [[Public Profile]] | [[publicProfiles]], [[syncPublicProfile]] | app.js |
| `configureWebPush` | [[Push Delivery]] | [[pushToUser]] | functions/lib/push.js |
| `confirmProjectActivityPicker` | [[Quests]] | — | app.js |
| `confirmResetData` | [[Backup Export Import]] | [[Settings Page]] | app.js |
| `confirmRetroDelete` | [[Retroactive History Editing]] | — | app.js |
| `consumeQuota` | [[composeQuest]] | [[aiUsage]] | functions/index.js |
| `cooldownLeft` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `copyFriendCode` | [[Friends]] | [[Profile Page]] | app.js |
| `copyHex` | [[Themes]] | — | app.js |
| `count` | [[onPactWrite]] | [[Server Pact Test]] | functions/lib/pact.js |
| `_countAllActivities` | [[Activity List And Grid Views]] | — | app.js |
| `countCompletionsToday` | [[Activity Frequencies And Cycles]] | — | app.js |
| `countDimensionActivities` | [[Dimensions And Paths]] | — | app.js |
| `createActivityFromSpec` | [[Tech Tree Map]] | — | app.js |
| `createActivityReminder` | [[createActivityReminder]] | [[Firebase Client]], [[reminders]] | functions/index.js |
| `createDefaultOnboardingData` | [[Onboarding Page]] | — | app.js |
| `crossBias` | [[Tech Tree Map]] | — | app.js |
| `crumbFor` | [[Quests]] | — | app.js |
| `currentFocusIndex` | [[Quests]] | — | app.js |
| `currentIndex` | [[Quests]] | — | app.js |
| `customPerWeek` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `cycleCompletionsNow` | [[Activity Frequencies And Cycles]] | [[predictCompletionXP]] | app.js |
| `cycleSection` | [[Bottom Navigation]] | — | index.html |
| `cycleTab` | [[Bottom Navigation]] | — | index.html |
| `_cyclicDist` | [[Routines]] | — | app.js |
| `_dataLoadError` | [[App Boot Sequence]] | — | app.js |
| `daysSince` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `deactivateGeneralReminder` | [[Reminders]] | [[reminders]] | app.js |
| `debouncedSaveUserData` | [[Saving And The Write Invariant]] | [[saveUserData]] | app.js |
| `_dedupeGroupsArr` | [[Routines]] | — | app.js |
| `dedupeGroupsNow` | [[Routines]] | — | app.js |
| `deleteActivity` | [[Activities]], [[Versus Challenges]] | [[Activity Editor Page]] | app.js |
| `deleteActivityReminder` | [[Reminders]] | [[reminders]] | app.js |
| `deleteDimension` | [[Dimensions And Paths]] | — | app.js |
| `deleteDimReward` | [[Level Rewards]] | — | app.js |
| `deleteGroup` | [[Routines]] | — | app.js |
| `deleteGroupFromModal` | [[Routines]] | — | app.js |
| `deletePath` | [[Dimensions And Paths]] | — | app.js |
| `deleteProject` | [[Quests]] | — | app.js |
| `deleteReward` | [[Level Rewards]] | — | app.js |
| `deleteSavedThemeSlot` | [[Themes]] | — | app.js |
| `demoteExcessNewActivities` | [[composeQuest]] | [[Server Quest Composer Test]] | functions/lib/quest-composer.js |
| `depth` | [[Tech Tree Map]] | — | app.js |
| `_dimRgb` | [[Activity List And Grid Views]] | — | app.js |
| `dismiss` | [[Modes]] | — | app.js |
| `dismissDimRewardOverlay` | [[Level Rewards]] | [[Dimension Levels]] | app.js |
| `dismissFriendRequest` | [[Friends]] | [[Friends Page]], [[friendRequests]] | app.js |
| `dismissRewardOverlay` | [[Level Rewards]] | — | app.js |
| `displayName` | [[resolveDueVersusChallenges]] | [[onVersusWrite]] | functions/lib/versus.js |
| `done` | [[In-App Browser Page]] | — | index.html |
| `drop` | [[Bottom Navigation]] | — | index.html |
| `editActivity` | [[Activities]] | [[Activity Editor Page]] | app.js |
| `editDimension` | [[Dimensions And Paths]] | — | app.js |
| `editIconSvg` | [[Dimensions And Paths]] | — | app.js |
| `editPath` | [[Dimensions And Paths]] | — | app.js |
| `enforceLoadBudget` | [[weaveWeb]] | [[Server Web Weaver Test]] | functions/lib/web-weaver.js |
| `enforceNodeCeiling` | [[weaveWeb]] | [[Server Web Weaver Test]] | functions/lib/web-weaver.js |
| `_ensureGroupsArr` | [[Routines]] | — | app.js |
| `ensureIconFont` | [[Icons]] | — | app.js |
| `ensureNotificationPermission` | [[Reminders]] | [[Push Delivery]] | app.js |
| `ensurePlannerData` | [[Daily Planner]] | — | app.js |
| `ensureTechTree` | [[Tech Tree Map]] | [[evaluateTechTreeMastery]] | app.js |
| `_ensureToastStack` | [[Toasts And Feedback]] | [[showToast]] | app.js |
| `ensureWebPush` | [[Push Delivery]] | [[Server Deploy Test]], [[pushToUser]], [[sendDueReminders]] | functions/index.js |
| `escapeHtml` | [[escapeHtml]] | [[Rendering And Window Globals]] | app.js |
| `_escReplacer` | [[Rendering And Window Globals]] | [[escapeHtml]] | app.js |
| `evaluateTechTreeMastery` | [[evaluateTechTreeMastery]] | [[Hook Chains]], [[Login-Time Processing]], [[Tech Tree Map]], [[Tech Tree Reveal Test]], [[processStreakPauses]] | app.js |
| `executePlannerDelete` | [[Daily Planner]] | — | app.js |
| `expandSheet` | [[Sheets Overlays And Back Button]] | — | index.html |
| `expirePendingPatch` | [[resolveDueVersusChallenges]] | [[Server Versus Test]], [[versusChallenges]] | functions/lib/versus.js |
| `exportData` | [[Backup Export Import]] | [[Settings Page]] | app.js |
| `_fillDimBody` | [[Dimensions And Paths]] | — | app.js |
| `_fillPathBody` | [[Dimensions And Paths]] | — | app.js |
| `filterByPeriod` | [[Analytics Page]] | — | app.js |
| `filterByScope` | [[Analytics Page]] | — | app.js |
| `filterByTimeRange` | [[Analytics Page]] | — | app.js |
| `filterPlannerActivities` | [[Daily Planner]] | — | app.js |
| `filterRetroPicker` | [[Retroactive History Editing]] | — | app.js |
| `findActiveRoutine` | [[Routines]] | — | app.js |
| `findActivity` | [[sendDueReminders]] | [[Server Activities Test]], [[createActivityReminder]] | functions/lib/activities.js |
| `findActivityById` | [[findActivityById]] | [[Activity Index]] | app.js |
| `findDimForActivity` | [[Dimension Levels]] | [[Dimensions And Paths]] | app.js |
| `findGroupById` | [[Routines]] | — | app.js |
| `findGroupForActivity` | [[Routines]] | — | app.js |
| `findGroupsForActivity` | [[Routines]] | — | app.js |
| `findNode` | [[Quests]] | — | app.js |
| `findPath` | [[Quests]] | — | app.js |
| `findProject` | [[Quests]] | — | app.js |
| `finishMutation` | [[Quests]] | — | app.js |
| `fireRedirect` | [[In-App Browser Page]] | — | index.html |
| `firstPerformableLeaf` | [[Quests]] | — | app.js |
| `fitSpine` | [[Bottom Navigation]] | — | index.html |
| `focusCostFor` | [[Focus Window]] | — | app.js |
| `focusFinish` | [[Focus Window]] | — | app.js |
| `focusPanelHtml` | [[Focus Window]] | — | app.js |
| `focusRenderSetup` | [[Focus Window]] | — | app.js |
| `focusStart` | [[Focus Window]] | — | app.js |
| `foldGeneration` | [[weaveWeb]] | [[Server Web Weaver Test]] | functions/lib/web-weaver.js |
| `formatDate` | [[Analytics Page]] | — | app.js |
| `formatPlannerDate` | [[Daily Planner]] | — | app.js |
| `formatPlannerDateFull` | [[Daily Planner]] | — | app.js |
| `formatTime12` | [[Daily Planner]] | — | app.js |
| `frAddCardHtml` | [[Friends]] | [[Friends Page]] | app.js |
| `frAvatar` | [[Friends]] | — | app.js |
| `frCloseRequestPopup` | [[Friends]] | — | app.js |
| `frFriendListHtml` | [[Friends]] | [[Friends Page]] | app.js |
| `frJoinBoard` | [[Friends]] | — | app.js |
| `frLeaderboardHtml` | [[Leaderboard Payouts]] | [[Leaderboards Page]] | app.js |
| `frMarkShown` | [[Friends]] | — | app.js |
| `frMetric` | [[Leaderboard Payouts]] | — | app.js |
| `frMetricVal` | [[Leaderboard Payouts]] | [[Leaderboards Page]] | app.js |
| `frPopupAddBack` | [[Friends]] | [[friendRequests]] | app.js |
| `frRenderIfVisible` | [[Friends]] | — | app.js |
| `frRepaintBoardViews` | [[Leaderboard Payouts]] | — | app.js |
| `frRequestPopupRow` | [[Friends]] | — | app.js |
| `frRequestsHtml` | [[Friends]] | [[Friends Page]] | app.js |
| `frRequestsOnLogin` | [[Friends]] | [[friendRequests]] | app.js |
| `frSeenIds` | [[Friends]] | — | app.js |
| `frShowRequestPopup` | [[Friends]] | [[friendRequests]] | app.js |
| `frSyncMetricTabs` | [[Leaderboard Payouts]] | — | app.js |
| `frSyncProfileBoardBtn` | [[Friend Profile Page]] | — | app.js |
| `g` | [[Versus Challenges]] | — | app.js |
| `gateFor` | [[weaveWeb]] | [[Server Web Weaver Test]] | functions/lib/web-weaver.js |
| `gather` | [[Quests]] | — | app.js |
| `_gcPointerCancel` | [[Activity List And Grid Views]] | — | app.js |
| `_gcPointerDown` | [[Activity List And Grid Views]] | — | app.js |
| `_gcPointerMove` | [[Activity List And Grid Views]] | — | app.js |
| `_gcPointerUp` | [[Activity List And Grid Views]] | — | app.js |
| `_gcRing` | [[Activity List And Grid Views]] | — | app.js |
| `generateFriendCode` | [[Friends]] | [[Loading And Migration]], [[loadUserData]] | app.js |
| `getActiveGroupId` | [[Routines]] | — | app.js |
| `getActivitiesInGroup` | [[Routines]] | — | app.js |
| `getActivityCounts` | [[Activities]] | — | app.js |
| `getActivityLimit` | [[Activities]] | [[XP And Levels]] | app.js |
| `getAllActivitiesFlat` | [[Analytics Page]] | — | app.js |
| `getCategoryXP` | [[Level-Up Share Card]] | [[Character Title And Life Balance]] | app.js |
| `getCategoryXPSince` | [[Level-Up Share Card]] | — | app.js |
| `getCharacterTitle` | [[Character Title And Life Balance]] | [[publicProfiles]], [[syncPublicProfile]] | app.js |
| `getCompletionLog` | [[Analytics Page]] | [[Activity History Log]] | app.js |
| `getCurrentSort` | [[Activity List And Grid Views]] | — | app.js |
| `getCustomSubtype` | [[Activities]] | — | app.js |
| `getCycleWindowStart` | [[getCycleWindowStart]] | [[Activity Frequencies And Cycles]], [[Dates Days And Weeks]], [[Payout Browser Test]], [[processStreakSystem]] | app.js |
| `getDefaultActivitySort` | [[Activity List And Grid Views]] | — | app.js |
| `getErrorMessage` | [[Landing And Sign In Page]] | — | app.js |
| `getGroups` | [[Routines]] | — | app.js |
| `getISOWeekLabel` | [[Public Profile]] | [[Dates Days And Weeks]], [[syncPublicProfile]] | app.js |
| `getLeaderboardWeekStartStr` | [[Dates Days And Weeks]] | [[Public Profile]] | app.js |
| `getLevelScaling` | [[XP And Levels]] | — | app.js |
| `getLocalDateString` | [[Reminder Scheduling]] | [[Server Schedule Test]], [[sendDueReminders]] | functions/lib/schedule.js |
| `getNextCycleWindowStart` | [[Activity Frequencies And Cycles]] | [[Dates Days And Weeks]], [[getCycleWindowStart]], [[processStreakSystem]] | app.js |
| `getNextUpcomingGroupId` | [[Routines]] | — | app.js |
| `getOrCreateUncategorized` | [[Activities]] | — | app.js |
| `getOrCreateUncategorizedPath` | [[Activities]] | — | app.js |
| `getPlannerDay` | [[Daily Planner]] | — | app.js |
| `getProfileCategoryXP` | [[Character Title And Life Balance]] | [[publicProfiles]], [[syncPublicProfile]] | app.js |
| `getProjects` | [[Quests]] | — | app.js |
| `getSelectedDays` | [[Activities]] | [[Activity Frequencies And Cycles]] | app.js |
| `getShieldCap` | [[Streaks And Shields]] | — | app.js |
| `getShieldsUsedDisplay` | [[Streaks And Shields]] | — | app.js |
| `_getSkipPenaltyWindow` | [[Negative Activities And Skip Penalty]] | — | app.js |
| `getStreakGraceDays` | [[Activity Frequencies And Cycles]] | [[Negative Activities And Skip Penalty]] | app.js |
| `getStreakScaling` | [[Activity Completion]] | [[predictCompletionXP]] | app.js |
| `getTop2Categories` | [[Level-Up Share Card]] | — | app.js |
| `getTopActivitiesThisLevel` | [[Level-Up Share Card]] | — | app.js |
| `getWeekStartStr` | [[Analytics Page]] | [[Dates Days And Weeks]] | app.js |
| `ghostXPBetween` | [[Activity History Log]] | [[Payout Browser Test]], [[Public Profile]] | app.js |
| `ghostXPOnDay` | [[Activity History Log]] | — | app.js |
| `giftCloseSheet` | [[Social Gifting]] | — | app.js |
| `giftConfirm` | [[Social Gifting]] | — | app.js |
| `giftCost` | [[Social Gifting]] | — | app.js |
| `giftDropBoostRecord` | [[Social Gifting]] | — | app.js |
| `giftEnsureFriendNames` | [[Social Gifting]] | [[publicProfiles]] | app.js |
| `giftEsc` | [[Rendering And Window Globals]] | [[escapeHtml]] | app.js |
| `giftFetchPending` | [[Social Gifting]] | [[gifts]] | app.js |
| `giftFetchSent` | [[Social Gifting]] | [[giftsSent]] | app.js |
| `giftFriendName` | [[Social Gifting]] | — | app.js |
| `giftHeader` | [[Social Gifting]] | — | app.js |
| `giftMyName` | [[Social Gifting]] | — | app.js |
| `giftNewId` | [[Social Gifting]] | — | app.js |
| `giftOnCompletion` | [[Social Gifting]] | [[Social Browser Test]], [[completeActivity]], [[gifts]] | app.js |
| `giftOnLogin` | [[Social Gifting]] | [[gifts]] | app.js |
| `giftOpenPicker` | [[Social Gifting]] | [[Friend Profile Page]], [[Rewards Page]] | app.js |
| `giftPeekFor` | [[Social Gifting]] | [[Social Browser Test]], [[gifts]], [[predictCompletionXP]] | app.js |
| `giftPickFriend` | [[Social Gifting]] | — | app.js |
| `giftQueueReveal` | [[Social Gifting]] | — | app.js |
| `giftRenderFriendStep` | [[Social Gifting]] | — | app.js |
| `giftRenderSentList` | [[Social Gifting]] | [[Friends Page]], [[giftsSent]] | app.js |
| `giftRenderTypeStep` | [[Social Gifting]] | — | app.js |
| `giftResolveShield` | [[Social Gifting]] | [[Social Browser Test]], [[gifts]] | app.js |
| `giftRunInbox` | [[Social Gifting]] | — | app.js |
| `giftSend` | [[Social Gifting]] | [[Social Browser Test]], [[gifts]], [[giftsSent]] | app.js |
| `giftSheet` | [[Social Gifting]] | [[Sheets Overlays And Back Button]] | app.js |
| `giftShowReveal` | [[Social Gifting]] | [[Social Browser Test]], [[gifts]] | app.js |
| `giftSyncMirror` | [[Social Gifting]] | [[Social Browser Test]], [[gifts]], [[giftsSent]] | app.js |
| `giftSyncOrphanedMirrors` | [[Social Gifting]] | [[Social Browser Test]], [[giftsSent]] | app.js |
| `giftUid` | [[Social Gifting]] | — | app.js |
| `glow` | [[Level-Up Share Card]] | — | app.js |
| `glowFor` | [[Tech Tree Map]] | — | app.js |
| `_glowInt` | [[Themes]] | — | app.js |
| `_glowVal` | [[Themes]] | — | app.js |
| `goalRegenPricing` | [[weaveWeb]] | [[Server Web Weaver Test]], [[aiUsage]] | functions/lib/web-weaver.js |
| `_gRank` | [[Activity List And Grid Views]] | — | app.js |
| `gritAbsBonus` | [[Grit Weekly Payout]] | [[Payout Browser Test]] | app.js |
| `gritAbsCompletions` | [[Grit Weekly Payout]] | — | app.js |
| `gritAbsCurve` | [[Grit Weekly Payout]] | — | app.js |
| `gritAllActivities` | [[Grit Currency]] | — | app.js |
| `gritApplyDelta` | [[gritApplyDelta]] | [[Grit Currency]] | app.js |
| `gritApplyShield` | [[Grit Shop]] | [[Payout Browser Test]], [[Rewards Page]] | app.js |
| `gritAwardOnce` | [[gritAwardOnce]] | [[Grit Currency]] | app.js |
| `gritBalance` | [[Grit Currency]] | — | app.js |
| `gritBoostsLeftThisMonth` | [[Grit Shop]] | — | app.js |
| `gritBoostsUsedThisMonth` | [[Grit Shop]] | — | app.js |
| `gritBuildWeekQuota` | [[Grit Weekly Payout]] | — | app.js |
| `gritBumpNumerator` | [[Grit Weekly Payout]] | [[Payout Browser Test]], [[gritOnCompletion]] | app.js |
| `gritBurstAdd` | [[Grit Currency]] | — | app.js |
| `gritBurstNote` | [[Grit Currency]] | — | app.js |
| `gritBuyBoost` | [[Grit Shop]] | [[Rewards Page]] | app.js |
| `gritBuyShield` | [[Grit Shop]] | [[Rewards Page]] | app.js |
| `gritCheckCadence` | [[Grit Currency]] | [[gritOnCompletion]] | app.js |
| `gritCheckMastery` | [[Grit Currency]] | [[evaluateTechTreeMastery]], [[gritAwardOnce]] | app.js |
| `gritCheckStreakMilestones` | [[Grit Currency]] | [[gritAwardOnce]], [[gritOnCompletion]] | app.js |
| `gritConsumeBoost` | [[Grit Shop]] | [[gritOnCompletion]] | app.js |
| `gritCurve` | [[Grit Weekly Payout]] | [[Payout Browser Test]] | app.js |
| `gritDayKey` | [[Grit Weekly Payout]] | — | app.js |
| `gritDayOf` | [[Grit Currency]] | — | app.js |
| `gritDaysBetween` | [[Grit Currency]] | — | app.js |
| `gritDripPreview` | [[Grit Currency]] | — | app.js |
| `gritEnsureWeek` | [[Grit Weekly Payout]] | [[gritOnCompletion]] | app.js |
| `gritEnsureWeekInner` | [[Grit Weekly Payout]] | — | app.js |
| `gritEsc` | [[Rendering And Window Globals]] | [[escapeHtml]] | app.js |
| `gritFillColor` | [[Rewards Page]] | — | app.js |
| `gritFindActivity` | [[Grit Currency]] | — | app.js |
| `gritFlushBurst` | [[Grit Currency]] | — | app.js |
| `gritFlushLedger` | [[Grit Currency]] | [[gritLedger]] | app.js |
| `gritGiftBoostsLeftThisMonth` | [[Grit Shop]] | — | app.js |
| `gritIsBoostArmed` | [[Grit Shop]] | [[predictCompletionXP]] | app.js |
| `gritIsCountable` | [[Grit Currency]] | — | app.js |
| `gritIsLive` | [[Grit Weekly Payout]] | — | app.js |
| `gritIsOccasional` | [[Grit Currency]] | — | app.js |
| `gritIsPunitive` | [[Grit Currency]] | — | app.js |
| `gritLedgerId` | [[Grit Currency]] | [[gritLedger]] | app.js |
| `gritLedgerPhrase` | [[Rewards Page]] | [[gritLedger]] | app.js |
| `gritLedgerWrite` | [[Grit Currency]] | [[gritApplyDelta]], [[gritLedger]] | app.js |
| `gritLogGoPage` | [[Rewards Page]] | — | app.js |
| `gritLogRows` | [[Rewards Page]] | — | app.js |
| `gritLookbackDays` | [[Grit Weekly Payout]] | — | app.js |
| `gritMasteryReps` | [[Grit Currency]] | — | app.js |
| `gritMedian` | [[Grit Currency]] | — | app.js |
| `gritMigrateLocalBalance` | [[Grit Currency]] | — | app.js |
| `gritMonthKey` | [[Grit Shop]] | — | app.js |
| `gritNewWeek` | [[Grit Weekly Payout]] | — | app.js |
| `gritOnCompletion` | [[gritOnCompletion]] | [[Grit Clawback Test]], [[Grit Currency]], [[completeActivity]] | app.js |
| `gritOnLogin` | [[Grit Currency]] | [[Login-Time Processing]], [[processStreakPauses]] | app.js |
| `gritOnRemoval` | [[Grit Currency]] | [[Grit Clawback Test]], [[gritOnCompletion]], [[undoActivity]] | app.js |
| `gritOnRetroComplete` | [[Grit Currency]] | [[Grit Clawback Test]], [[gritOnCompletion]] | app.js |
| `gritOpenRewards` | [[Rewards Page]] | — | app.js |
| `gritOrdinal` | [[Leaderboard Payouts]] | — | app.js |
| `gritPaintLog` | [[Rewards Page]] | — | app.js |
| `gritPersist` | [[Saving And The Write Invariant]] | [[Grit Currency]], [[users]] | app.js |
| `gritProjectedBonus` | [[Grit Weekly Payout]] | — | app.js |
| `gritPurchase` | [[Grit Shop]] | — | app.js |
| `gritQuotaUnits` | [[Grit Weekly Payout]] | — | app.js |
| `gritReadLedger` | [[Grit Currency]] | [[gritLedger]] | app.js |
| `gritReconcileContributors` | [[Grit Weekly Payout]] | — | app.js |
| `gritRefreshUI` | [[Grit Currency]] | [[gritApplyDelta]] | app.js |
| `gritRelTime` | [[Rewards Page]] | — | app.js |
| `gritRenderLog` | [[Rewards Page]] | [[gritLedger]] | app.js |
| `gritRenderRewards` | [[Rewards Page]] | — | app.js |
| `gritRenderRewardsInner` | [[Rewards Page]] | — | app.js |
| `gritRenderShieldPicker` | [[Grit Shop]] | [[Rewards Page]] | app.js |
| `gritRewardsVisible` | [[Rewards Page]] | — | app.js |
| `gritScrollToHow` | [[Rewards Page]] | — | app.js |
| `gritShieldEligible` | [[Grit Shop]] | — | app.js |
| `gritShieldEventId` | [[Grit Shop]] | — | app.js |
| `gritState` | [[Grit Currency]] | [[gritApplyDelta]] | app.js |
| `gritWeekAnchorOf` | [[Grit Weekly Payout]] | — | app.js |
| `gritWeekAnchorStr` | [[Grit Weekly Payout]] | — | app.js |
| `gritWeekPayout` | [[Grit Weekly Payout]] | [[Payout Browser Test]] | app.js |
| `gritWeekRatio` | [[Grit Weekly Payout]] | — | app.js |
| `groupBodyAttrs` | [[Activity List And Grid Views]] | — | app.js |
| `groupBodyHtml` | [[Activity List And Grid Views]] | — | app.js |
| `_groupDistanceFromNow` | [[Routines]] | — | app.js |
| `_groupTimeToMin` | [[Routines]] | — | app.js |
| `habitAdvanceDays` | [[Habit Mode]] | [[Modes Browser Test]] | app.js |
| `habitCheckMilestone` | [[Habit Mode]] | [[modesOnCompletion]] | app.js |
| `habitDetailNext` | [[Habit Mode]] | — | app.js |
| `habitFinish` | [[Habit Mode]] | — | app.js |
| `habitMaybeShowOverlay` | [[Habit Mode]] | — | app.js |
| `habitOf` | [[Habit Mode]] | [[modesOnCompletion]] | app.js |
| `habitOpenResume` | [[Habit Mode]] | — | app.js |
| `habitOverlayDue` | [[Habit Mode]] | — | app.js |
| `habitPanelHtml` | [[Habit Mode]] | — | app.js |
| `habitQuote` | [[Habit Mode]] | — | app.js |
| `habitRenderSetup` | [[Habit Mode]] | — | app.js |
| `habitResume` | [[Habit Mode]] | — | app.js |
| `habitSetupNext` | [[Habit Mode]] | — | app.js |
| `habitStart` | [[Habit Mode]] | — | app.js |
| `habitStartFresh` | [[Habit Mode]] | — | app.js |
| `handleFriendDeepLink` | [[Friends]] | — | app.js |
| `handleGoogleSignIn` | [[Landing And Sign In Page]] | — | app.js |
| `handleLogout` | [[Landing And Sign In Page]] | [[Settings Page]] | app.js |
| `hasCompleted` | [[resolveDueVersusChallenges]] | [[Server Versus Test]] | functions/lib/versus.js |
| `hasHScrollAncestor` | [[Bottom Navigation]] | — | index.html |
| `hexA` | [[Quests]] | — | app.js |
| `hexRgb` | [[Level-Up Share Card]] | — | app.js |
| `hexToRgb` | [[Themes]] | — | app.js |
| `_hexToRgbStr` | [[Level-Up Share Card]] | — | app.js |
| `hideBanner` | [[PWA Install]] | — | app.js |
| `hideError` | [[Landing And Sign In Page]] | — | app.js |
| `hideTutorialOverlay` | [[First-Run Tutorial]] | — | app.js |
| `historyIconSvg` | [[Dimensions And Paths]] | — | app.js |
| `hline` | [[Level-Up Share Card]] | — | app.js |
| `importData` | [[Backup Export Import]] | [[Settings Page]] | app.js |
| `inHead` | [[Sheets Overlays And Back Button]] | — | index.html |
| `initArcDials` | [[Bottom Navigation]] | — | index.html |
| `initAuthScreen` | [[Landing And Sign In Page]] | [[App Boot Sequence]], [[In-App Browser Page]], [[PWA Install]] | app.js |
| `initDim` | [[Dimension Levels]] | — | app.js |
| `initSheets` | [[Sheets Overlays And Back Button]] | — | index.html |
| `initSwipe` | [[Bottom Navigation]] | — | index.html |
| `initTutorial` | [[First-Run Tutorial]] | — | app.js |
| `insuranceCostFor` | [[Insurance Mode]] | — | app.js |
| `insuranceDaysOn` | [[Insurance Mode]] | — | app.js |
| `insuranceFinish` | [[Insurance Mode]] | — | app.js |
| `insurancePanelHtml` | [[Insurance Mode]] | — | app.js |
| `insuranceRenderSetup` | [[Insurance Mode]] | — | app.js |
| `insuranceStart` | [[Insurance Mode]] | — | app.js |
| `insuranceTermDays` | [[Insurance Mode]] | — | app.js |
| `isCompletedToday` | [[Activity Frequencies And Cycles]] | [[Payout Browser Test]], [[getCycleWindowStart]] | app.js |
| `isCountable` | [[composeQuest]] | — | functions/lib/quest-composer.js |
| `isGroupActiveNow` | [[Routines]] | — | app.js |
| `isInstalled` | [[PWA Install]] | — | app.js |
| `isMobile` | [[Bottom Navigation]] | — | index.html |
| `isScheduledDay` | [[Activity Frequencies And Cycles]] | — | app.js |
| `isSnoozed` | [[PWA Install]] | — | app.js |
| `isUsableSubscription` | [[Push Delivery]] | [[pushToUser]], [[sendDueReminders]] | functions/lib/push.js |
| `isValidLocalTime` | [[Reminder Scheduling]] | [[Server Schedule Test]], [[createActivityReminder]], [[onReminderWrite]], [[sendDueReminders]] | functions/lib/schedule.js |
| `isValidTimezone` | [[Reminder Scheduling]] | [[Server Schedule Test]], [[createActivityReminder]] | functions/lib/schedule.js |
| `itemName` | [[Quests]] | — | app.js |
| `itemPerformable` | [[Quests]] | — | app.js |
| `itemReq` | [[Quests]] | [[updateQuestProgress]] | app.js |
| `items` | [[onPactWrite]] | [[Server Pact Test]] | functions/lib/pact.js |
| `lastCompletionMs` | [[composeQuest]] | — | functions/lib/quest-composer.js |
| `lastUserIdx` | [[Activity Completion]] | — | app.js |
| `lbBoardCountText` | [[Leaderboard Payouts]] | — | app.js |
| `lbBoardMembers` | [[Leaderboard Payouts]] | [[leaderboardBoards]] | app.js |
| `lbCloseBoardEditor` | [[Leaderboard Payouts]] | — | app.js |
| `lbClosedAnchorStr` | [[Leaderboard Payouts]] | — | app.js |
| `lbMyWeek` | [[Leaderboard Payouts]] | [[leaderboardBoards]] | app.js |
| `lbNextAnchorStr` | [[Leaderboard Payouts]] | — | app.js |
| `lbOnLogin` | [[Leaderboard Payouts]] | — | app.js |
| `lbOpenBoardEditor` | [[Leaderboard Payouts]] | [[Leaderboards Page]] | app.js |
| `lbOrdinal` | [[Leaderboard Payouts]] | — | app.js |
| `lbPayForPosition` | [[Leaderboard Payouts]] | [[Social Browser Test]] | app.js |
| `lbPublishBoard` | [[Leaderboard Payouts]] | [[leaderboardBoards]] | app.js |
| `lbRank` | [[Leaderboard Payouts]] | [[Social Browser Test]] | app.js |
| `lbReadBoard` | [[Leaderboard Payouts]] | [[leaderboardBoards]] | app.js |
| `lbRenderPayoutSection` | [[Leaderboard Payouts]] | [[Leaderboards Page]] | app.js |
| `lbRosterAvatar` | [[Leaderboard Payouts]] | — | app.js |
| `lbRosterFor` | [[Leaderboard Payouts]] | [[leaderboardBoards]] | app.js |
| `lbRosterRowHtml` | [[Leaderboard Payouts]] | — | app.js |
| `lbSettleClosedWeek` | [[Leaderboard Payouts]] | [[Social Browser Test]], [[gritAwardOnce]], [[leaderboardBoards]] | app.js |
| `lbShiftAnchor` | [[Leaderboard Payouts]] | — | app.js |
| `lbShowStandings` | [[Leaderboard Payouts]] | [[Leaderboards Page]] | app.js |
| `lbState` | [[Leaderboard Payouts]] | — | app.js |
| `lbSyncRosterRow` | [[Leaderboard Payouts]] | [[Leaderboards Page]] | app.js |
| `lbToggleOptIn` | [[Leaderboard Payouts]] | [[Leaderboards Page]], [[Social Browser Test]], [[leaderboardBoards]] | app.js |
| `lbToggleOptInInfo` | [[Leaderboard Payouts]] | — | app.js |
| `lbUid` | [[Leaderboard Payouts]] | — | app.js |
| `leafDone` | [[Quests]] | — | app.js |
| `leave` | [[Modes]] | — | app.js |
| `legacyItemToLeaf` | [[Quests]] | — | app.js |
| `legacyStagesToPipelines` | [[Quests]] | — | app.js |
| `legacyStageToNode` | [[Quests]] | — | app.js |
| `lifecycleAtBirth` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `liftAction` | [[Bottom Navigation]] | — | index.html |
| `liveActivities` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `liveNodes` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `loadMoreHistory` | [[Activity History Log]] | — | app.js |
| `loadRemindersFromFirestore` | [[Reminders]] | [[reminders]] | app.js |
| `loadSavedThemeSlot` | [[Themes]] | — | app.js |
| `loadSettings` | [[Settings Page]] | [[switchTab]] | app.js |
| `loadTheme` | [[Themes]] | — | app.js |
| `loadUserData` | [[loadUserData]] | [[App Boot Sequence]], [[Loading And Migration]], [[canPersistUserData]], [[users]] | app.js |
| `localDateStr` | [[Daily Planner]] | — | app.js |
| `localToday` | [[Dates Days And Weeks]] | [[toLocalDateStr]] | app.js |
| `localToUTC` | [[Legacy Reminder Script]] | — | scripts/send-reminders.js |
| `localYesterday` | [[Dates Days And Weeks]] | [[toLocalDateStr]] | app.js |
| `_logDeletedActivity` | [[Activities]] | [[Activity History Log]] | app.js |
| `lookbackDays` | [[composeQuest]] | — | functions/lib/quest-composer.js |
| `looksLeaf` | [[composeQuest]] | — | functions/lib/quest-composer.js |
| `main` | [[Legacy Reminder Script]] | — | scripts/send-reminders.js |
| `markQuestBonusPaid` | [[Quests]] | — | app.js |
| `masteryTargetFor` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `masteryThresholdFor` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `masteryWindowFor` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `materializeExpansion` | [[weaveWeb]] | [[Server Web Weaver Test]] | functions/lib/web-weaver.js |
| `materializeWeb` | [[weaveWeb]] | [[Server Web Weaver Test]] | functions/lib/web-weaver.js |
| `materializeWildcards` | [[weaveWeb]] | [[Server Web Weaver Test]] | functions/lib/web-weaver.js |
| `measureSpineTier` | [[Bottom Navigation]] | — | index.html |
| `medalSvg` | [[Analytics Page]] | — | app.js |
| `mergeNodes` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `migrateNode` | [[Quests]] | — | app.js |
| `migrateProject` | [[Quests]] | [[updateQuestProgress]] | app.js |
| `migrateTechTreeV2` | [[Tech Tree Map]] | — | app.js |
| `migrateTechTreeV3` | [[Tech Tree Map]] | — | app.js |
| `migrateUserData` | [[Loading And Migration]] | [[loadUserData]] | app.js |
| `mkActivityIndex` | [[Activity Index]] | [[findActivityById]] | app.js |
| `mkBindSheet` | [[Sheets Overlays And Back Button]] | — | index.html |
| `mkDateFmt` | [[Daily Planner]] | — | app.js |
| `mkDayKey` | [[Dates Days And Weeks]] | [[toLocalDateStr]] | app.js |
| `mkDetectTimezone` | [[Reminders]] | — | app.js |
| `mkEnhanceFilterSelects` | [[Searchable Dropdown]] | — | app.js |
| `mkEnhanceSelect` | [[Searchable Dropdown]] | — | app.js |
| `mkGo` | [[Bottom Navigation]] | [[Nav Browser Test]], [[Tab Switching]] | index.html |
| `mkGoModes` | [[Bottom Navigation]] | — | index.html |
| `mkGoSub` | [[Bottom Navigation]] | [[Tab Switching]] | index.html |
| `mkGoSubAt` | [[Bottom Navigation]] | — | index.html |
| `mkHandleReminderDeepLink` | [[Reminders]] | [[Service Worker]] | app.js |
| `mkOpenActivityFromReminder` | [[Reminders]] | [[Service Worker]] | app.js |
| `mkOpenGrit` | [[Bottom Navigation]] | — | index.html |
| `mksChevron` | [[Searchable Dropdown]] | — | app.js |
| `mksClose` | [[Searchable Dropdown]] | — | app.js |
| `mksCloseAll` | [[Searchable Dropdown]] | — | app.js |
| `mkSetNavStyle` | [[Bottom Navigation]] | [[Nav Browser Test]], [[Settings Page]] | index.html |
| `mksLabel` | [[Searchable Dropdown]] | — | app.js |
| `mksOpen` | [[Searchable Dropdown]] | — | app.js |
| `mksOptions` | [[Searchable Dropdown]] | — | app.js |
| `mksRenderList` | [[Searchable Dropdown]] | — | app.js |
| `mkStep` | [[Bottom Navigation]] | — | index.html |
| `mkSwapSheetContents` | [[Versus Challenges]] | [[Sheets Overlays And Back Button]] | app.js |
| `mkTodayKey` | [[Dates Days And Weeks]] | — | app.js |
| `mkToggleLedger` | [[Bottom Navigation]] | [[Nav Browser Test]] | index.html |
| `mkTouchActivityIndex` | [[Activity Index]] | [[findActivityById]], [[loadUserData]] | app.js |
| `modeActivityPos` | [[Modes Page]] | — | app.js |
| `modeAddDays` | [[Modes]] | — | app.js |
| `modeAffordable` | [[Modes]] | — | app.js |
| `modeAvgPerHour` | [[Modes]] | [[Berserk Mode]] | app.js |
| `modeBannerStatus` | [[Modes Page]] | — | app.js |
| `modeBarHtml` | [[Modes Page]] | — | app.js |
| `modeBerserkExpired` | [[Berserk Mode]] | — | app.js |
| `modeBestMultiplierFor` | [[Focus Window]] | [[modesOnCompletion]] | app.js |
| `modeCanMark` | [[Modes Page]] | — | app.js |
| `modeClockSync` | [[Modes Page]] | — | app.js |
| `modeCloseSheet` | [[Modes]] | — | app.js |
| `modeCompletionsOnDay` | [[Modes]] | — | app.js |
| `modeCostLabel` | [[Modes]] | — | app.js |
| `modeCostLine` | [[Modes]] | — | app.js |
| `modeCountdownLabel` | [[Modes Page]] | — | app.js |
| `modeDailyXPMap` | [[Modes]] | [[Berserk Mode]] | app.js |
| `modeDateLabel` | [[Modes Page]] | — | app.js |
| `modeDayDiff` | [[Modes]] | — | app.js |
| `modeEligibleActivities` | [[Modes]] | — | app.js |
| `modeErrText` | [[Modes Page]] | — | app.js |
| `modeEsc` | [[Rendering And Window Globals]] | [[escapeHtml]] | app.js |
| `modeFilterActs` | [[Modes]] | — | app.js |
| `modeFocusFinished` | [[Focus Window]] | — | app.js |
| `modeGoToActivity` | [[Modes Page]] | — | app.js |
| `modeHHMM` | [[Modes]] | — | app.js |
| `modeHourLabel` | [[Modes]] | — | app.js |
| `modeInWindow` | [[Modes]] | — | app.js |
| `modelBudget` | [[weaveWeb]] | — | functions/index.js |
| `modeLiveMap` | [[Modes]] | — | app.js |
| `modelName` | [[Model Adapter]] | — | functions/lib/model.js |
| `modeLogXP` | [[Modes]] | [[Activity History Log]] | app.js |
| `modeMark` | [[Modes Page]] | [[Modes]] | app.js |
| `modeMarkBtnHtml` | [[Modes Page]] | — | app.js |
| `modeMins` | [[Modes]] | — | app.js |
| `modeMinutesNow` | [[Modes]] | — | app.js |
| `modeMissedWindowsSince` | [[Modes]] | [[Insurance Mode]] | app.js |
| `modeOutcomeWord` | [[Modes Page]] | — | app.js |
| `modePactHasActivity` | [[Pact Mode]] | — | app.js |
| `modePactItems` | [[Pact Mode]] | — | app.js |
| `modePickerHtml` | [[Modes]] | — | app.js |
| `modePickListHtml` | [[Modes]] | — | app.js |
| `modeRangeFill` | [[Modes]] | — | app.js |
| `modeReminderCopy` | [[Habit Mode]] | [[Server Modes Test]], [[reminders]], [[sendDueReminders]] | functions/lib/modes.js |
| `modeRerenderSetup` | [[Modes]] | — | app.js |
| `modeResLineHtml` | [[Modes]] | — | app.js |
| `modesActivate` | [[Modes]] | [[Modes Browser Test]] | app.js |
| `modesActive` | [[Modes]] | — | app.js |
| `modesActiveCardHtml` | [[Modes Page]] | — | app.js |
| `modesActiveKind` | [[Modes]] | — | app.js |
| `modesAdoptPact` | [[Pact Mode]] | [[pacts]] | app.js |
| `modesAfterStreakWalk` | [[Modes]] | [[Insurance Mode]], [[Login-Time Processing]], [[Modes Browser Test]], [[Recovery Mode]], [[processStreakPauses]] | app.js |
| `modesApplyTheme` | [[Modes]] | — | app.js |
| `modesAwardXP` | [[Modes]] | [[modesOnCompletion]] | app.js |
| `modesBeforeStreakWalk` | [[Modes]] | [[Insurance Mode]], [[Login-Time Processing]], [[Modes Browser Test]], [[Recovery Mode]], [[processStreakPauses]] | app.js |
| `modesCatalogCardHtml` | [[Modes Page]] | — | app.js |
| `modesConfirmEnd` | [[Modes Page]] | [[Modes]] | app.js |
| `modesDesiredReminders` | [[Modes]] | — | app.js |
| `modesDrainPending` | [[Modes]] | — | app.js |
| `modeSearchActs` | [[Modes]] | — | app.js |
| `modeSearchHtml` | [[Modes]] | — | app.js |
| `modesEnd` | [[Modes]] | — | app.js |
| `modesEndByUser` | [[Modes Page]] | [[Modes]] | app.js |
| `modeSetField` | [[Modes]] | — | app.js |
| `modeSetNum` | [[Modes]] | — | app.js |
| `modeSheet` | [[Modes]] | [[Sheets Overlays And Back Button]] | app.js |
| `modeSheetFoot` | [[Modes]] | — | app.js |
| `modeSheetHead` | [[Modes]] | — | app.js |
| `modesInviteCardsHtml` | [[Modes Page]] | — | app.js |
| `modeSlide` | [[Modes]] | — | app.js |
| `modeSlideEnd` | [[Modes]] | — | app.js |
| `modeSliderHtml` | [[Modes]] | — | app.js |
| `modesLocalNotify` | [[Modes]] | — | app.js |
| `modesNewId` | [[Modes]] | — | app.js |
| `modesNow` | [[Modes]] | — | app.js |
| `modesOnCompletion` | [[modesOnCompletion]] | [[Hook Chains]], [[Modes]], [[Modes Browser Test]] | app.js |
| `modesOnLogin` | [[Modes]] | — | app.js |
| `modesOnUndo` | [[Modes]] | [[Hook Chains]], [[Modes Browser Test]], [[modesOnCompletion]], [[undoActivity]] | app.js |
| `modesOpenPage` | [[Modes Page]] | [[Modes]] | app.js |
| `modesOpenSetup` | [[Modes]] | [[Modes Page]] | app.js |
| `modesPageVisible` | [[Modes Page]] | — | app.js |
| `modesQueueResolution` | [[Modes]] | — | app.js |
| `modesRecoveryConclude` | [[Recovery Mode]] | — | app.js |
| `modesRefreshBanner` | [[Modes Page]] | [[Modes]], [[switchTab]] | app.js |
| `modesRenderGritChip` | [[Modes Page]] | — | app.js |
| `modesRenderPage` | [[Modes Page]] | [[Modes]] | app.js |
| `modesResolveNow` | [[Modes]] | — | app.js |
| `modesRoot` | [[Modes Page]] | — | app.js |
| `modesRunPass` | [[Modes]] | — | app.js |
| `modesShowInsuranceCheckIn` | [[Insurance Mode]] | — | app.js |
| `modesShowMilestone` | [[Modes]] | — | app.js |
| `modesShowResolution` | [[Modes]] | [[Modes Browser Test]] | app.js |
| `modesState` | [[Modes]] | — | app.js |
| `modesSyncNotifications` | [[Modes]] | [[reminders]] | app.js |
| `modeStartBlocked` | [[Modes]] | — | app.js |
| `modeStartOptimistic` | [[Modes]] | — | app.js |
| `modeStartRollback` | [[Modes]] | — | app.js |
| `modeStepperHtml` | [[Modes]] | — | app.js |
| `modeStepTo` | [[Modes]] | — | app.js |
| `modesToday` | [[Modes]] | — | app.js |
| `modesTrackedActivityIds` | [[Modes]] | — | app.js |
| `modesUid` | [[Modes]] | — | app.js |
| `modesXPBetween` | [[Modes]] | — | app.js |
| `modeSyncLive` | [[Modes]] | — | app.js |
| `modeTimeLabel` | [[Modes]] | — | app.js |
| `modeTogglePick` | [[Modes]] | — | app.js |
| `modeWagerPayoutFor` | [[Stake Mode]] | [[Modes]] | app.js |
| `modeWagerReturnFor` | [[Stake Mode]] | — | app.js |
| `modeWagerReturnPct` | [[Stake Mode]] | — | app.js |
| `modeWarnHtml` | [[Modes]] | — | app.js |
| `modeWriteDetail` | [[Modes]] | — | app.js |
| `nameOf` | [[onPactWrite]] | — | functions/lib/pact.js |
| `newActivityAllowance` | [[composeQuest]] | [[Server Pipeline Test]] | functions/lib/quest-composer.js |
| `newId` | [[composeQuest]], [[weaveWeb]] | — | functions/lib/quest-composer.js, functions/lib/web-weaver.js |
| `nextSendTimestamp` | [[sendDueReminders]] | [[createActivityReminder]], [[onReminderWrite]] | functions/index.js |
| `nodeCtx` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `nodeDone` | [[Quests]] | — | app.js |
| `nodeGroup` | [[Tech Tree Map]] | — | app.js |
| `nodeNewLoad` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `nodeStats` | [[Quests]] | — | app.js |
| `normalizeParsed` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `normalizeTimezone` | [[Reminder Scheduling]] | [[createActivityReminder]] | functions/lib/schedule.js |
| `normalizeToHex` | [[Themes]] | — | app.js |
| `nowISO` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `obBack` | [[Onboarding Page]] | — | app.js |
| `obBackToFocus` | [[Onboarding Page]] | — | app.js |
| `obBuildOwn` | [[Onboarding Page]] | — | app.js |
| `obCloseOverlay` | [[Onboarding Page]] | — | app.js |
| `obFinishPicker` | [[Onboarding Page]] | — | app.js |
| `obGoTo` | [[Onboarding Page]] | — | app.js |
| `obNext` | [[Onboarding Page]] | — | app.js |
| `obQuickStart` | [[Onboarding Page]] | — | app.js |
| `obRenderSlide` | [[Onboarding Page]] | — | app.js |
| `obShowActivityPicker` | [[Onboarding Page]] | — | app.js |
| `obShowChoiceScreen` | [[Onboarding Page]] | — | app.js |
| `obShowChoiceScreenAgain` | [[Onboarding Page]] | — | app.js |
| `obShowFocusPicker` | [[Onboarding Page]] | — | app.js |
| `obToggleActivity` | [[Onboarding Page]] | — | app.js |
| `obToggleArea` | [[Onboarding Page]] | — | app.js |
| `obUpdateActivityProgress` | [[Onboarding Page]] | — | app.js |
| `obUpdateFocusNextBtn` | [[Onboarding Page]] | — | app.js |
| `onColorHexTextInput` | [[Themes]] | — | app.js |
| `onCustomColorInput` | [[Themes]] | — | app.js |
| `onDragMove` | [[Quests]] | — | app.js |
| `onDragUp` | [[Quests]] | — | app.js |
| `onFriendRequestWrite` | [[onFriendRequestWrite]] | — | functions/index.js |
| `onGiftConsumed` | [[onGiftConsumed]] | — | functions/index.js |
| `onGiftReceived` | [[onGiftReceived]] | — | functions/index.js |
| `onGlowColorInput` | [[Themes]] | — | app.js |
| `onGlowHexInput` | [[Themes]] | — | app.js |
| `onPactWrite` | [[onPactWrite]] | — | functions/index.js |
| `onReminderWrite` | [[onReminderWrite]] | [[reminders]] | functions/index.js |
| `onVersusWrite` | [[onVersusWrite]] | — | functions/index.js |
| `openActivityInfo` | [[Activities]] | [[Activity Editor Page]] | app.js |
| `openActivityModal` | [[Activities]] | [[Activity Editor Page]], [[My Activities Page]] | app.js |
| `openActivityPicker` | [[Quests]] | — | app.js |
| `openActivityReminderModal` | [[Reminders]] | [[Settings Page]] | app.js |
| `openActivitySearch` | [[Activity Search]] | [[My Activities Page]] | app.js |
| `openCardTypePicker` | [[Activity List And Grid Views]] | — | app.js |
| `openCatActionMenu` | [[Dimensions And Paths]] | [[Categories Page]] | app.js |
| `openCategoriesInfo` | [[Categories Page]] | — | app.js |
| `openCategoriesSearch` | [[Activity Search]] | [[Categories Page]] | app.js |
| `openDimensionModal` | [[Dimensions And Paths]] | [[Categories Page]] | app.js |
| `openDimRewardForAnyLevel` | [[Level Rewards]] | — | app.js |
| `openDimRewardModal` | [[Level Rewards]] | — | app.js |
| `openEntryIndex` | [[Bottom Navigation]] | — | index.html |
| `openFriendProfileCard` | [[Friend Profile Page]] | [[Friends]], [[Friends Page]], [[publicProfiles]] | app.js |
| `openGridActionMenu` | [[Activity List And Grid Views]], [[Tech Tree Map]] | — | app.js |
| `openGridCardOverlay` | [[Activity List And Grid Views]] | — | app.js |
| `openGroupModal` | [[Routines]] | — | app.js |
| `openIconPicker` | [[Icons]] | — | app.js |
| `openPathModal` | [[Dimensions And Paths]] | [[Categories Page]] | app.js |
| `openPlannerAddModal` | [[Daily Planner]] | — | app.js |
| `openPlannerDatePicker` | [[Daily Planner]] | — | app.js |
| `openPlannerDeleteMenu` | [[Daily Planner]] | — | app.js |
| `openProfileOverlay` | [[Profile Page]] | — | app.js |
| `openProjectDetail` | [[Quests Page]] | — | app.js |
| `openProjectModal` | [[Quests]] | [[Quests Page]] | app.js |
| `openProjectsInfo` | [[Quests Page]] | — | app.js |
| `openQuestComposer` | [[Quest Composer]] | [[Quests Page]] | app.js |
| `openRetroPicker` | [[Retroactive History Editing]] | — | app.js |
| `openRewardForAnyLevel` | [[Level Rewards]] | — | app.js |
| `openRewardModal` | [[Level Rewards]] | — | app.js |
| `other` | [[onPactWrite]] | — | functions/lib/pact.js |
| `otherParticipant` | [[resolveDueVersusChallenges]] | — | functions/lib/versus.js |
| `pactAccept` | [[Pact Mode]] | [[pacts]] | app.js |
| `pactAcceptBump` | [[Pact Mode]] | — | app.js |
| `pactBuildResolution` | [[Pact Mode]] | [[pacts]] | app.js |
| `pactBuildTerm` | [[Pact Mode]] | — | app.js |
| `pactBump` | [[Pact Mode]] | — | app.js |
| `pactCheckInvites` | [[Pact Mode]] | [[pacts]] | app.js |
| `pactClaimPayout` | [[Pact Mode]] | [[pacts]] | app.js |
| `pactClearPartner` | [[Pact Mode]] | — | app.js |
| `pactCommitProgress` | [[Pact Mode]] | [[modesOnCompletion]], [[pacts]] | app.js |
| `pactCount` | [[Pact Mode]] | — | app.js |
| `pactCreate` | [[Pact Mode]] | [[pacts]] | app.js |
| `pactDecline` | [[Pact Mode]] | [[Modes Page]] | app.js |
| `pactDisplayName` | [[onPactWrite]] | — | functions/index.js |
| `pactDoAccept` | [[Pact Mode]] | — | app.js |
| `pactFetch` | [[Pact Mode]] | [[Firestore Indexes]], [[pacts]] | app.js |
| `pactGet` | [[Pact Mode]] | — | app.js |
| `pactHit` | [[Pact Mode]] | — | app.js |
| `pactImpossible` | [[Pact Mode]] | — | app.js |
| `pactIsTerminal` | [[Pact Mode]] | — | app.js |
| `pactItems` | [[Pact Mode]] | [[Modes Browser Test]] | app.js |
| `pactMaybeResolve` | [[Pact Mode]] | [[pacts]] | app.js |
| `pactMyName` | [[Pact Mode]] | — | app.js |
| `pactName` | [[Pact Mode]] | — | app.js |
| `pactOpenAccept` | [[Pact Mode]] | [[Modes Page]] | app.js |
| `pactOther` | [[Pact Mode]] | — | app.js |
| `pactOtherUid` | [[onPactWrite]] | — | functions/index.js |
| `pactPanelHtml` | [[Pact Mode]] | — | app.js |
| `pactPickPartner` | [[Pact Mode]] | — | app.js |
| `pactRenderAccept` | [[Pact Mode]] | — | app.js |
| `pactRenderSetup` | [[Pact Mode]] | [[Modes Browser Test]] | app.js |
| `pactRunMaintenance` | [[Pact Mode]] | [[pacts]] | app.js |
| `pactSend` | [[Pact Mode]] | — | app.js |
| `pactSettleLocal` | [[Pact Mode]] | — | app.js |
| `pactStageHtml` | [[Pact Mode]] | — | app.js |
| `pactStageOf` | [[Pact Mode]] | — | app.js |
| `pactStakesHtml` | [[Pact Mode]] | — | app.js |
| `pactStats` | [[Pact Mode]] | [[Modes Browser Test]] | app.js |
| `pactTargetRowsHtml` | [[Pact Mode]] | — | app.js |
| `pactTerm` | [[Pact Mode]] | — | app.js |
| `pactTerminatePending` | [[Pact Mode]] | [[pacts]] | app.js |
| `pactTermSummary` | [[Pact Mode]] | — | app.js |
| `pactTotalTarget` | [[Pact Mode]] | — | app.js |
| `pactWarnHtml` | [[Pact Mode]] | — | app.js |
| `pactWithdraw` | [[Pact Mode]] | [[Modes Page]] | app.js |
| `parseModelJson` | [[Model Adapter]] | — | functions/lib/model.js |
| `pathIconSvg` | [[Dimensions And Paths]] | — | app.js |
| `pauseProject` | [[Quests]] | — | app.js |
| `payQuestBonus` | [[Quests]] | — | app.js |
| `payQuestGrit` | [[Quests]] | [[gritAwardOnce]] | app.js |
| `peekEntry` | [[Retroactive History Editing]] | — | app.js |
| `phGlyph` | [[Icons]] | — | app.js |
| `phIcon` | [[Icons]] | [[Rendering And Window Globals]], [[showToast]] | app.js |
| `pickIcon` | [[Icons]] | — | app.js |
| `pipelinesToGroups` | [[Quests]] | — | app.js |
| `placeAction` | [[Bottom Navigation]] | — | index.html |
| `plannerCompleteSlot` | [[Daily Planner]] | — | app.js |
| `plannerReconcileActivityToday` | [[Daily Planner]] | [[Hook Chains]] | app.js |
| `plannerRerenderIfVisible` | [[Daily Planner]] | — | app.js |
| `plannerSetSlotDone` | [[Daily Planner]] | — | app.js |
| `plannerSlotsFor` | [[Daily Planner]] | — | app.js |
| `plannerUndoSlot` | [[Daily Planner]] | — | app.js |
| `populateActivityPathSelect` | [[Activities]] | [[Activity Editor Page]] | app.js |
| `populateChartOverlayDropdown` | [[Analytics Page]] | — | app.js |
| `populateDimRewardSelect` | [[Level Rewards]] | — | app.js |
| `populateFilterDropdowns` | [[Analytics Page]] | — | app.js |
| `populatePlannerActivityList` | [[Daily Planner]] | — | app.js |
| `positionFilterPanel` | [[Activity List And Grid Views]] | — | app.js |
| `prArrowSvg` | [[Quests]] | — | app.js |
| `prAttr` | [[Quests]] | [[escapeHtml]] | app.js |
| `prCheckSvg` | [[Quests]] | — | app.js |
| `prChevSvg` | [[Quests]] | — | app.js |
| `prDragSvg` | [[Quests]] | — | app.js |
| `prebuildLevelUpCard` | [[Level-Up Share Card]] | [[completeActivity]] | app.js |
| `predictCompletionXP` | [[predictCompletionXP]] | [[Activity Completion]], [[completeActivity]] | app.js |
| `previewLevelScaling` | [[XP And Levels]] | [[Settings Page]] | app.js |
| `previewStreakScaling` | [[Activity Completion]] | [[Settings Page]] | app.js |
| `previewThemeColor` | [[Themes]] | — | app.js |
| `previousLocalDate` | [[Habit Mode]] | [[Server Modes Test]] | functions/lib/modes.js |
| `prFreqLabel` | [[Quests]] | — | app.js |
| `prGroupSvg` | [[Quests]] | — | app.js |
| `prId` | [[Quests]] | — | app.js |
| `prLinkSvg` | [[Quests]] | — | app.js |
| `prMinusSvg` | [[Quests]] | — | app.js |
| `processSkipPenalty` | [[Negative Activities And Skip Penalty]] | [[Login-Time Processing]], [[processStreakPauses]], [[recordCompletion]] | app.js |
| `processStreakPauses` | [[processStreakPauses]] | [[App Boot Sequence]], [[Login-Time Processing]], [[Modes Browser Test]] | app.js |
| `processStreakSystem` | [[processStreakSystem]] | [[Login-Time Processing]], [[Streaks And Shields]], [[processStreakPauses]] | app.js |
| `processUser` | [[sendDueReminders]] | [[reminders]], [[users]] | functions/index.js |
| `profileUsernameKeydown` | [[Profile Page]] | — | app.js |
| `progressNudges` | [[onPactWrite]] | [[Server Pact Test]], [[pacts]] | functions/lib/pact.js |
| `projectCycleReady` | [[Quests]] | — | app.js |
| `projectDimHexes` | [[Quests]] | — | app.js |
| `projectStripStyle` | [[Quests]] | — | app.js |
| `prPlaySvg` | [[Quests]] | — | app.js |
| `prPlusSvg` | [[Quests]] | — | app.js |
| `prUndoSvg` | [[Quests]] | — | app.js |
| `_prUpdatePickerAddBtn` | [[Quests]] | — | app.js |
| `prXSvg` | [[Quests]] | — | app.js |
| `pushToUser` | [[pushToUser]] | [[Push Delivery]], [[Server Deploy Test]], [[onFriendRequestWrite]], [[onGiftConsumed]], [[onGiftReceived]], [[onPactWrite]], [[onVersusWrite]], [[users]] | functions/index.js |
| `px` | [[Analytics Page]] | — | app.js |
| `py` | [[Analytics Page]] | — | app.js |
| `q` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `qcCallCompose` | [[Quest Composer]] | — | app.js |
| `qcClientCtx` | [[Quest Composer]] | — | app.js |
| `qcCloseNewActivityReview` | [[Quest Composer]] | — | app.js |
| `qcDemoteExcessNewActivities` | [[Quest Composer]] | — | app.js |
| `qcDraftToBuilder` | [[Quest Composer]] | — | app.js |
| `qcEditNewActivity` | [[Quest Composer]] | — | app.js |
| `qcFindActivity` | [[Quest Composer]] | — | app.js |
| `qcFinishDraft` | [[Quest Composer]] | — | app.js |
| `qcLiveActivityCount` | [[Quest Composer]] | — | app.js |
| `qcNewActivityAllowance` | [[Quest Composer]] | — | app.js |
| `qcNewId` | [[Quest Composer]] | — | app.js |
| `qcOpenNewActivityReview` | [[Quest Composer]] | — | app.js |
| `qcPickShape` | [[Quest Composer]] | — | app.js |
| `qcPickSize` | [[Quest Composer]] | — | app.js |
| `qcRemoveNewActivity` | [[Quest Composer]] | — | app.js |
| `qcRenderNewActivityReview` | [[Quest Composer]] | — | app.js |
| `qcSetBusy` | [[Quest Composer]] | — | app.js |
| `qcSetError` | [[Quest Composer]] | — | app.js |
| `qcSubmit` | [[Quest Composer]] | — | app.js |
| `qcSyncCount` | [[Quest Composer]] | — | app.js |
| `qcSyncReviewCount` | [[Quest Composer]] | — | app.js |
| `qcValidateGroup` | [[Quest Composer]] | — | app.js |
| `qcValidateLeaf` | [[Quest Composer]] | — | app.js |
| `qcWalkLeaves` | [[Quest Composer]] | — | app.js |
| `questBonusPaid` | [[Quests]] | — | app.js |
| `questCounts` | [[Quests]] | — | app.js |
| `questDaysActive` | [[Quests]] | — | app.js |
| `questDetailOpen` | [[Bottom Navigation]] | — | index.html |
| `questEffortScore` | [[Quests]] | — | app.js |
| `questFlavor` | [[Quests]] | — | app.js |
| `questGritBonus` | [[Quests]] | — | app.js |
| `questPotentialBonus` | [[Quests]] | — | app.js |
| `questStats` | [[Quests]] | — | app.js |
| `reaches` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `readGroupCard` | [[Quests]] | — | app.js |
| `readGroupTree` | [[Quests]] | — | app.js |
| `readLeafRow` | [[Quests]] | — | app.js |
| `readQuota` | [[composeQuest]] | [[aiUsage]] | functions/index.js |
| `readTopLevelGroups` | [[Quests]] | — | app.js |
| `readWeaveUsage` | [[weaveWeb]] | [[aiUsage]] | functions/index.js |
| `recomputeActivityCounters` | [[Retroactive History Editing]] | — | app.js |
| `recomputeDimXP` | [[Dimension Levels]] | [[Retroactive History Editing]] | app.js |
| `recomputeLevelFromTotalXP` | [[XP And Levels]] | [[Retroactive History Editing]] | app.js |
| `recomputeStreakFromHistory` | [[Streaks And Shields]] | [[Retroactive History Editing]], [[processStreakSystem]] | app.js |
| `recordCompletion` | [[recordCompletion]] | [[Activity Completion]], [[Activity History Log]], [[completeActivity]] | app.js |
| `recoveryAllAtCeiling` | [[Recovery Mode]] | — | app.js |
| `recoveryCeilingFor` | [[Recovery Mode]] | — | app.js |
| `recoveryEntry` | [[Recovery Mode]] | [[modesOnCompletion]] | app.js |
| `recoveryPanelHtml` | [[Recovery Mode]] | — | app.js |
| `recoveryRenderSetup` | [[Recovery Mode]] | — | app.js |
| `recoveryStart` | [[Recovery Mode]] | — | app.js |
| `refreshCalendar` | [[Analytics Page]] | — | app.js |
| `refreshProjectsView` | [[Quests]] | — | app.js |
| `refreshReminderState` | [[Reminders]] | — | app.js |
| `refreshZoneEmptyState` | [[Quests]] | — | app.js |
| `rejectionStrings` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `reloadRemindersUI` | [[Reminders]] | — | app.js |
| `reminderDocRef` | [[Reminders]] | — | app.js |
| `reminderErrorMessage` | [[Reminders]] | — | app.js |
| `remindersColRef` | [[Reminders]] | — | app.js |
| `removeChartOverlay` | [[Analytics Page]] | — | app.js |
| `removeFriend` | [[Friends]] | [[Friend Profile Page]] | app.js |
| `removeGroupCard` | [[Quests]] | — | app.js |
| `removeLeafRow` | [[Quests]] | — | app.js |
| `renderActivities` | [[Dimensions And Paths]] | — | app.js |
| `renderActivitiesList` | [[Activity List And Grid Views]] | [[My Activities Page]], [[switchTab]], [[updateDashboard]] | app.js |
| `renderActivityCards` | [[Activity List And Grid Views]] | — | app.js |
| `renderActivityContent` | [[Activity List And Grid Views]] | — | app.js |
| `renderActivityGridCards` | [[Activity List And Grid Views]] | — | app.js |
| `renderActivityHistory` | [[Activity History Log]] | [[Analytics Page]], [[Payout Browser Test]] | app.js |
| `renderActivityReminderPicker` | [[Reminders]] | — | app.js |
| `renderActivityReminders` | [[Reminders]] | — | app.js |
| `renderAnalytics` | [[Analytics Page]] | [[switchTab]] | app.js |
| `renderAnalyticsSummary` | [[Analytics Page]] | — | app.js |
| `renderArc` | [[Bottom Navigation]] | — | index.html |
| `renderCalendar` | [[Analytics Page]] | — | app.js |
| `renderCard` | [[Activity List And Grid Views]] | — | app.js |
| `renderCategoriesActivities` | [[Dimensions And Paths]] | [[Categories Page]] | app.js |
| `renderCategoriesSearchResults` | [[Activity Search]] | — | app.js |
| `renderChecklist` | [[Quests]] | — | app.js |
| `renderCombosPanel` | [[Analytics Page]] | — | app.js |
| `renderDimensionColorPills` | [[Dimensions And Paths]] | — | app.js |
| `renderDimensions` | [[Dimensions And Paths]] | [[Categories Page]], [[switchTab]], [[updateDashboard]] | app.js |
| `renderDimProgress` | [[Dimension Levels]] | [[Analytics Page]] | app.js |
| `renderDimRewards` | [[Level Rewards]] | — | app.js |
| `renderDoNowPanel` | [[Quests]] | — | app.js |
| `renderFilterOptions` | [[Activity List And Grid Views]] | — | app.js |
| `renderFrequencyChart` | [[Analytics Page]] | — | app.js |
| `renderFriendsTab` | [[Friends]] | [[Friends Page]], [[Leaderboards Page]], [[Social Browser Test]], [[publicProfiles]], [[switchTab]] | app.js |
| `renderGridSection` | [[Activity List And Grid Views]] | — | app.js |
| `renderGrit` | [[Bottom Navigation]] | — | index.html |
| `renderGroupActPicker` | [[Routines]] | — | app.js |
| `renderGroupBlock` | [[Quests]] | — | app.js |
| `renderGroupBody` | [[Quests]] | — | app.js |
| `renderHistoryEdit` | [[Retroactive History Editing]] | — | app.js |
| `renderLeafCard` | [[Quests]] | — | app.js |
| `renderLeafDetail` | [[Quests]] | — | app.js |
| `renderLedger` | [[Bottom Navigation]] | — | index.html |
| `renderNav` | [[Bottom Navigation]] | — | index.html |
| `renderNestedGroupHeader` | [[Quests]] | — | app.js |
| `renderNowMarker` | [[Daily Planner]] | — | app.js |
| `renderOverlayChips` | [[Analytics Page]] | — | app.js |
| `renderPageStrip` | [[Bottom Navigation]] | — | index.html |
| `renderPaths` | [[Dimensions And Paths]] | [[Categories Page]] | app.js |
| `renderPipelineRow` | [[Quests]] | — | app.js |
| `renderPlanner` | [[Daily Planner]] | [[updateDashboard]] | app.js |
| `renderPlannerCalStrip` | [[Daily Planner]] | — | app.js |
| `renderPlannerCard` | [[Daily Planner]] | — | app.js |
| `renderPlate` | [[Bottom Navigation]] | — | index.html |
| `renderPlume` | [[Bottom Navigation]] | — | index.html |
| `renderProfileOverlay` | [[Profile Page]] | — | app.js |
| `renderProfileSpiderChart` | [[Character Title And Life Balance]] | [[Profile Page]] | app.js |
| `renderProjectActivityPickerList` | [[Quests]] | — | app.js |
| `renderProjectCard` | [[Quests Page]] | — | app.js |
| `renderProjectDetail` | [[Quests Page]] | [[Quests]] | app.js |
| `renderProjectDimReadout` | [[Quests]] | — | app.js |
| `renderProjectFooter` | [[Quests]] | — | app.js |
| `renderProjects` | [[Quests Page]] | [[Quests]], [[switchTab]] | app.js |
| `renderRepDots` | [[Quests]] | — | app.js |
| `renderRetroPickerList` | [[Retroactive History Editing]] | — | app.js |
| `renderRewards` | [[Level Rewards]] | — | app.js |
| `renderSavedThemeSlots` | [[Themes]] | — | app.js |
| `renderSearchResults` | [[Activity Search]] | — | app.js |
| `renderSpiderChartCanvas` | [[Character Title And Life Balance]] | [[Friend Profile Page]] | app.js |
| `renderSpiderConfigList` | [[Character Title And Life Balance]] | — | app.js |
| `renderSpine` | [[Bottom Navigation]] | — | index.html |
| `renderStoredIcon` | [[Icons]] | — | app.js |
| `renderStreakBoard` | [[Analytics Page]] | — | app.js |
| `renderTechTree` | [[Tech Tree Map]] | [[Map Page]], [[Tech Tree Reveal Test]] | app.js |
| `renderThemeCard` | [[Bottom Navigation]] | — | index.html |
| `renderThreadRow` | [[Quests]] | — | app.js |
| `renderTimeOfDay` | [[Analytics Page]] | — | app.js |
| `renderWhatsNext` | [[Quests]] | — | app.js |
| `renderXPChart` | [[Analytics Page]] | — | app.js |
| `renderXPLeaderboard` | [[Analytics Page]] | — | app.js |
| `reopenProject` | [[Quests]] | — | app.js |
| `repComplete` | [[Quests]] | — | app.js |
| `repsSnapshot` | [[Quests]] | — | app.js |
| `resetNode` | [[Quests]] | — | app.js |
| `resetProject` | [[Quests]] | — | app.js |
| `resetSheet` | [[Sheets Overlays And Back Button]] | — | index.html |
| `resolutionBody` | [[resolveDueVersusChallenges]] | [[Server Versus Test]], [[onVersusWrite]], [[versusChallenges]] | functions/lib/versus.js |
| `resolveActivityName` | [[sendDueReminders]] | [[Server Activities Test]] | functions/lib/activities.js |
| `resolveDeadlinePatch` | [[resolveDueVersusChallenges]] | [[Server Versus Test]], [[versusChallenges]] | functions/lib/versus.js |
| `resolveDueVersusChallenges` | [[resolveDueVersusChallenges]] | [[Firestore Indexes]] | functions/index.js |
| `resolveTimezone` | [[Reminder Scheduling]] | [[Server Schedule Test]], [[sendDueReminders]] | functions/lib/schedule.js |
| `restoreActions` | [[Bottom Navigation]] | — | index.html |
| `restoreActiveRoutine` | [[Routines]] | — | app.js |
| `restoreAutoBackup` | [[Backup Export Import]] | [[Settings Page]] | app.js |
| `_restoreGlowSliders` | [[Themes]] | — | app.js |
| `resumeProject` | [[Quests]] | — | app.js |
| `retroactiveComplete` | [[Retroactive History Editing]] | [[Grit Clawback Test]], [[Payout Browser Test]], [[recordCompletion]] | app.js |
| `retroactiveDelete` | [[Retroactive History Editing]] | [[Grit Clawback Test]], [[Negative Activities And Skip Penalty]], [[Payout Browser Test]] | app.js |
| `_retroPickerAdd` | [[Retroactive History Editing]] | — | app.js |
| `rgba` | [[Level-Up Share Card]] | — | app.js |
| `ringDelta` | [[Bottom Navigation]] | — | index.html |
| `rollForward` | [[sendDueReminders]] | — | functions/index.js |
| `rollingWindowMet` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `rowFor` | [[Tech Tree Map]] | — | app.js |
| `rr` | [[Level-Up Share Card]] | — | app.js |
| `safe` | [[Dimension Levels]] | — | app.js |
| `saveActivity` | [[Activities]], [[Versus Challenges]] | [[Activity Editor Page]] | app.js |
| `saveActivityReminder` | [[Reminders]] | [[reminders]] | app.js |
| `saveCustomSlot` | [[Themes]] | — | app.js |
| `saveDimension` | [[Dimensions And Paths]] | — | app.js |
| `saveGroupFromModal` | [[Routines]] | — | app.js |
| `savePath` | [[Dimensions And Paths]] | — | app.js |
| `savePlannerItem` | [[Daily Planner]] | — | app.js |
| `saveProject` | [[Quests]] | — | app.js |
| `saveReminder` | [[Reminders]] | [[Settings Page]] | app.js |
| `saveReward` | [[Level Rewards]] | — | app.js |
| `saveTheme` | [[Themes]] | [[Settings Page]] | app.js |
| `saveUserData` | [[saveUserData]] | [[Backup Export Import]], [[Saving And The Write Invariant]], [[users]] | app.js |
| `saveUsername` | [[Profile Page]] | — | app.js |
| `scheduleReminder` | [[Reminders]] | [[Push Delivery]] | app.js |
| `searchCompleteActivity` | [[Activity Search]] | — | app.js |
| `searchKeyHandler` | [[Activity Search]] | — | app.js |
| `searchUndoActivity` | [[Activity Search]] | — | app.js |
| `section` | [[Versus Challenges]] | — | app.js |
| `selectActivityReminderActivity` | [[Reminders]] | — | app.js |
| `selectCardType` | [[Activity List And Grid Views]] | — | app.js |
| `selectDimensionColor` | [[Dimensions And Paths]] | — | app.js |
| `selectPlannerActivity` | [[Daily Planner]] | — | app.js |
| `sendDueReminders` | [[sendDueReminders]] | [[Firestore Indexes]], [[reminders]] | functions/index.js |
| `sendPactProgressNudges` | [[onPactWrite]] | — | functions/index.js |
| `sendPush` | [[Push Delivery]] | [[pushToUser]], [[sendDueReminders]] | functions/lib/push.js |
| `set` | [[Versus Challenges]] | — | app.js |
| `setActivityGroup` | [[Routines]] | — | app.js |
| `setActivityXP` | [[Activities]] | [[Activity Editor Page]] | app.js |
| `setAdvancedSectionOpen` | [[Activities]] | — | app.js |
| `setAnalyticsFilter` | [[Analytics Page]] | — | app.js |
| `setChartMode` | [[Analytics Page]] | — | app.js |
| `setChartTimeRange` | [[Analytics Page]] | — | app.js |
| `setCustomSubtype` | [[Activities]] | [[Activity Frequencies And Cycles]] | app.js |
| `setCustomSubtypeUI` | [[Activities]] | — | app.js |
| `setDefaultActivitySort` | [[Activity List And Grid Views]] | — | app.js |
| `setFocusPath` | [[Quests]] | — | app.js |
| `setGroupMembership` | [[Routines]] | — | app.js |
| `setHistoryFilter` | [[Activity History Log]] | — | app.js |
| `setHTML` | [[In-App Browser Page]] | — | index.html |
| `setIconPickerValue` | [[Icons]] | — | app.js |
| `setIconStatus` | [[Icons]] | — | app.js |
| `setLeaderboardMetric` | [[Leaderboard Payouts]] | [[Leaderboards Page]] | app.js |
| `setLedgerCollapsed` | [[Bottom Navigation]] | — | index.html |
| `setPlannerAddType` | [[Daily Planner]] | — | app.js |
| `setPlannerDate` | [[Daily Planner]] | — | app.js |
| `setProjectCadence` | [[Quests]] | — | app.js |
| `setSelectedDays` | [[Activities]] | [[Activity Frequencies And Cycles]] | app.js |
| `setSingle` | [[Themes]] | — | app.js |
| `setSpiderTag` | [[Character Title And Life Balance]] | — | app.js |
| `setText` | [[In-App Browser Page]] | — | index.html |
| `settle` | [[Quests]] | — | app.js |
| `settleAll` | [[Quests]] | [[updateQuestProgress]] | app.js |
| `sf` | [[Level-Up Share Card]] | — | app.js |
| `shareFriendCode` | [[Friends]] | [[Profile Page]] | app.js |
| `shareLevelUpCard` | [[Level-Up Share Card]] | — | app.js |
| `shieldCapLimit` | [[Streaks And Shields]] | [[processStreakSystem]] | app.js |
| `shieldCapNow` | [[Streaks And Shields]] | — | app.js |
| `shieldFloorFor` | [[Streaks And Shields]] | [[processStreakSystem]] | app.js |
| `shieldsHeldNow` | [[Streaks And Shields]] | [[Payout Browser Test]] | app.js |
| `shouldRevalidate` | [[Service Worker]] | — | sw.js |
| `showBanner` | [[PWA Install]] | — | app.js |
| `_showCardOverlay` | [[Level-Up Share Card]] | — | app.js |
| `showCurrentTutorialStep` | [[First-Run Tutorial]] | — | app.js |
| `showDataLoadFailure` | [[Loading And Migration]] | [[App Boot Sequence]], [[canPersistUserData]] | app.js |
| `showDimLevelUpToast` | [[Dimension Levels]] | — | app.js |
| `showDimRewardUnlock` | [[Level Rewards]] | [[Dimension Levels]] | app.js |
| `showError` | [[Landing And Sign In Page]] | — | app.js |
| `showLevelUpAnimation` | [[XP And Levels]] | [[Level-Up Share Card]], [[completeActivity]] | app.js |
| `showOnboardingOverlay` | [[Onboarding Page]] | [[App Boot Sequence]] | app.js |
| `showRewardUnlock` | [[Level Rewards]] | — | app.js |
| `showToast` | [[showToast]] | [[Toasts And Feedback]] | app.js |
| `_showToastPill` | [[Toasts And Feedback]] | — | app.js |
| `showUndoToast` | [[Toasts And Feedback]] | [[Activity Completion]] | app.js |
| `showXPToast` | [[Toasts And Feedback]] | [[Activity Completion]] | app.js |
| `sideLabel` | [[Modes Page]] | — | app.js |
| `sideLines` | [[Modes]] | — | app.js |
| `slotAngle` | [[Bottom Navigation]] | — | index.html |
| `_smartDefaultSort` | [[Activity List And Grid Views]] | — | app.js |
| `snapshotReps` | [[Quests]] | — | app.js |
| `snooze` | [[PWA Install]] | — | app.js |
| `spawnFloat` | [[Toasts And Feedback]] | — | app.js |
| `spawnFloatingGrit` | [[Toasts And Feedback]] | — | app.js |
| `spawnFloatingXP` | [[Toasts And Feedback]] | [[Activity Completion]] | app.js |
| `spiderR` | [[Character Title And Life Balance]] | — | app.js |
| `stakeAllHit` | [[Stake Mode]] | — | app.js |
| `stakeBump` | [[Stake Mode]] | — | app.js |
| `stakeDaysLeft` | [[Stake Mode]] | — | app.js |
| `stakeEndDay` | [[Stake Mode]] | — | app.js |
| `stakeMaybeResolve` | [[Stake Mode]] | [[Modes Browser Test]], [[modesOnCompletion]] | app.js |
| `stakePanelHtml` | [[Stake Mode]] | — | app.js |
| `stakeRenderSetup` | [[Stake Mode]] | — | app.js |
| `stakeStart` | [[Stake Mode]] | — | app.js |
| `stakeTotalCount` | [[Stake Mode]] | — | app.js |
| `stakeTotalTarget` | [[Stake Mode]] | — | app.js |
| `stale` | [[Friends]] | — | app.js |
| `stampReveal` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `startDrag` | [[Quests]] | — | app.js |
| `_startProgressAltCycle` | [[XP And Levels]] | [[updateDashboard]] | app.js |
| `startUsernameEdit` | [[Profile Page]] | — | app.js |
| `stats` | [[onPactWrite]] | [[Server Pact Test]] | functions/lib/pact.js |
| `stepGroupRepeat` | [[Quests]] | — | app.js |
| `stepLeafCount` | [[Quests]] | — | app.js |
| `storedIconName` | [[Icons]] | — | app.js |
| `streamOnce` | [[Model Adapter]] | — | functions/lib/model.js |
| `subscribeToPush` | [[Push Delivery]] | [[Reminders]] | app.js |
| `switchRewardMode` | [[Level Rewards]] | — | app.js |
| `switchSubTab` | [[Tab Switching]], [[Tech Tree Map]] | [[switchTab]] | app.js |
| `switchTab` | [[switchTab]] | [[Hook Chains]], [[Nav Browser Test]], [[Tab Switching]] | app.js |
| `syncActiveRoutine` | [[Routines]] | — | app.js |
| `syncActivityXPPreset` | [[Activities]] | — | app.js |
| `syncLevelSvgWidth` | [[updateDashboard]] | — | app.js |
| `syncNavToPage` | [[Bottom Navigation]] | — | index.html |
| `syncPublicProfile` | [[syncPublicProfile]] | [[Public Profile]], [[publicProfiles]], [[saveUserData]] | app.js |
| `syncUserTimezone` | [[Reminders]] | [[Loading And Migration]], [[loadUserData]], [[reminders]] | app.js |
| `tapNextUp` | [[Quests]] | — | app.js |
| `tapPipelineNode` | [[Quests]] | — | app.js |
| `tick` | [[Toasts And Feedback]] | — | app.js |
| `tier` | [[Tech Tree Map]] | — | app.js |
| `timeoutError` | [[Model Adapter]] | — | functions/lib/model.js |
| `timeStr` | [[Level-Up Share Card]] | — | app.js |
| `todayDOW` | [[Activity Frequencies And Cycles]] | — | app.js |
| `toggleActivityGroup` | [[Activity List And Grid Views]] | — | app.js |
| `toggleActivityHistory` | [[Activity History Log]] | — | app.js |
| `toggleActivityReminder` | [[Reminders]] | [[reminders]] | app.js |
| `toggleActivityView` | [[Activity List And Grid Views]] | [[My Activities Page]] | app.js |
| `toggleAdvancedSection` | [[Activities]] | [[Activity Editor Page]] | app.js |
| `toggleAnalyticsFilterPanel` | [[Analytics Page]] | — | app.js |
| `toggleAnSection` | [[Analytics Page]] | — | app.js |
| `toggleBuilderHelp` | [[Quests]] | — | app.js |
| `toggleCalTip` | [[Analytics Page]] | — | app.js |
| `toggleCardExpand` | [[Activity List And Grid Views]] | — | app.js |
| `toggleChartHideMain` | [[Analytics Page]] | — | app.js |
| `toggleCombosPanel` | [[Analytics Page]] | — | app.js |
| `toggleCustomDays` | [[Activities]] | [[Activity Frequencies And Cycles]] | app.js |
| `toggleCustomThemePanel` | [[Themes]] | — | app.js |
| `toggleDayBtn` | [[Activities]] | [[Activity Frequencies And Cycles]] | app.js |
| `toggleDimension` | [[Dimensions And Paths]] | [[Categories Page]] | app.js |
| `toggleDimProgress` | [[Analytics Page]] | — | app.js |
| `toggleFilterPanel` | [[Activity List And Grid Views]] | [[My Activities Page]] | app.js |
| `toggleFrequencyChart` | [[Analytics Page]] | — | app.js |
| `toggleGroupAct` | [[Routines]] | — | app.js |
| `toggleGroupAllDay` | [[Routines]] | — | app.js |
| `toggleGroupOrdered` | [[Quests]] | — | app.js |
| `toggleGuide` | [[Settings Page]] | — | app.js |
| `toggleInfoHint` | [[Routines]] | — | app.js |
| `toggleInstallGuide` | [[PWA Install]] | [[Settings Page]] | app.js |
| `toggleLeaderboardVisibility` | [[Leaderboard Payouts]] | [[Friend Profile Page]], [[Leaderboards Page]] | app.js |
| `toggleLeafDetail` | [[Quests]] | — | app.js |
| `toggleLevelScaling` | [[Settings Page]] | [[XP And Levels]] | app.js |
| `toggleNegativeXpSection` | [[Activities]] | [[Activity Editor Page]], [[Negative Activities And Skip Penalty]] | app.js |
| `togglePath` | [[Dimensions And Paths]] | [[Categories Page]] | app.js |
| `togglePlannerInline` | [[Daily Planner]] | [[My Activities Page]] | app.js |
| `toggleProfileInfo` | [[Profile Page]] | — | app.js |
| `toggleProfileRewards` | [[Profile Page]] | — | app.js |
| `toggleProjectPick` | [[Quests]] | — | app.js |
| `toggleProjectsSection` | [[Quests]] | — | app.js |
| `toggleReminder` | [[Reminders]] | [[Settings Page]] | app.js |
| `toggleSpiderConfig` | [[Character Title And Life Balance]] | — | app.js |
| `toggleStreakScaling` | [[Settings Page]] | — | app.js |
| `toks` | [[Tech Tree Map]] | — | app.js |
| `toLocalDateStr` | [[toLocalDateStr]] | [[Dates Days And Weeks]], [[getCycleWindowStart]] | app.js |
| `trackBank` | [[Quests]] | — | app.js |
| `trackDrag` | [[Bottom Navigation]] | — | index.html |
| `trackEvent` | [[Firebase Client]] | — | app.js |
| `trashIconSvg` | [[Dimensions And Paths]] | — | app.js |
| `triggerAndroidInstall` | [[PWA Install]] | [[Settings Page]] | app.js |
| `ttActiveGoals` | [[Tech Tree Map]] | — | app.js |
| `ttAddActivityToTree` | [[Tech Tree Map]] | — | app.js |
| `ttAddGoal` | [[Map Weaving]] | [[Map Page]] | app.js |
| `_ttAddGoalConfirm` | [[Map Weaving]] | — | app.js |
| `ttAddGoalField` | [[Map Weaving]] | — | app.js |
| `ttAllActivities` | [[Tech Tree Map]] | — | app.js |
| `ttApplyWeave` | [[Map Weaving]] | — | app.js |
| `ttAttachToGoal` | [[Tech Tree Map]] | — | app.js |
| `ttAwardXP` | [[Tech Tree Map]] | [[evaluateTechTreeMastery]] | app.js |
| `ttBackToShape` | [[Tech Tree Map]] | — | app.js |
| `ttBranchFilter` | [[Map Reveal Loop]] | [[Map Page]] | app.js |
| `ttBranchFilterId` | [[Map Reveal Loop]] | — | app.js |
| `ttBranchGoalChip` | [[Map Reveal Loop]] | — | app.js |
| `ttBranchHtml` | [[Map Reveal Loop]] | — | app.js |
| `ttBranchRow` | [[Map Reveal Loop]] | — | app.js |
| `ttBuildWebSVG` | [[Tech Tree Map]] | — | app.js |
| `ttCallWeave` | [[Map Weaving]] | — | app.js |
| `ttCloseOverlay` | [[Tech Tree Map]] | — | app.js |
| `ttCloseSheet` | [[Tech Tree Map]] | — | app.js |
| `ttCollectGoalFields` | [[Map Weaving]] | — | app.js |
| `ttComputeTiers` | [[Tech Tree Map]] | — | app.js |
| `ttConfirmRegen` | [[Map Reveal Loop]] | [[Tech Tree Reveal Test]] | app.js |
| `ttConfirmReveal` | [[Map Reveal Loop]] | [[Tech Tree Reveal Test]] | app.js |
| `ttCooldownLeft` | [[Map Weaving]] | — | app.js |
| `ttDarkCount` | [[Map Reveal Loop]] | — | app.js |
| `ttDarkStripHtml` | [[Map Reveal Loop]] | — | app.js |
| `ttDimHexRaw` | [[Tech Tree Map]] | — | app.js |
| `ttDimName` | [[Tech Tree Map]] | — | app.js |
| `ttDoAttachGoal` | [[Tech Tree Map]] | — | app.js |
| `ttDoLinkActivity` | [[Tech Tree Map]] | — | app.js |
| `ttDupCandidate` | [[Tech Tree Map]] | — | app.js |
| `ttEditReadings` | [[Tech Tree Map]] | [[Map Weaving]] | app.js |
| `ttEnsureRevealFields` | [[Map Reveal Loop]] | [[Tech Tree Reveal Test]] | app.js |
| `ttFindActivity` | [[Tech Tree Map]] | — | app.js |
| `ttFindActivityIndexes` | [[Tech Tree Map]] | — | app.js |
| `ttFreqWeight` | [[Tech Tree Map]] | — | app.js |
| `ttGlyph` | [[Tech Tree Map]] | — | app.js |
| `ttGlyphRadius` | [[Tech Tree Map]] | — | app.js |
| `ttGoalById` | [[Tech Tree Map]] | — | app.js |
| `ttGoalMenu` | [[Tech Tree Map]] | — | app.js |
| `ttGoalRegenState` | [[Map Weaving]] | — | app.js |
| `ttGoalRowHtml` | [[Map Weaving]] | — | app.js |
| `ttGoldFlash` | [[Tech Tree Map]] | — | app.js |
| `ttGotoPayload` | [[Tech Tree Map]] | — | app.js |
| `ttIcon` | [[Tech Tree Map]] | — | app.js |
| `ttInjectStepStrip` | [[Tech Tree Map]] | — | app.js |
| `ttIsFreeTier` | [[Map Reveal Loop]] | [[Tech Tree Reveal Test]] | app.js |
| `ttIsSilhouette` | [[Map Reveal Loop]] | — | app.js |
| `ttLockHint` | [[Tech Tree Map]] | — | app.js |
| `ttLockReason` | [[Tech Tree Map]] | — | app.js |
| `ttMakeGoal` | [[Tech Tree Map]] | — | app.js |
| `ttMasteryDefaultFor` | [[Tech Tree Map]] | — | app.js |
| `ttMasteryProgress` | [[Tech Tree Map]] | [[evaluateTechTreeMastery]] | app.js |
| `ttMaybeAutoGrow` | [[Tech Tree Map]] | [[Map Weaving]], [[evaluateTechTreeMastery]] | app.js |
| `ttNewId` | [[Tech Tree Map]] | — | app.js |
| `ttNodeColor` | [[Tech Tree Map]] | — | app.js |
| `ttNodeGoals` | [[Tech Tree Map]] | — | app.js |
| `ttNodeResolveBonus` | [[Tech Tree Map]] | [[evaluateTechTreeMastery]] | app.js |
| `ttNodeState` | [[Tech Tree Map]] | — | app.js |
| `ttNodeSublabel` | [[Tech Tree Map]] | — | app.js |
| `ttNodeUnlocked` | [[Tech Tree Map]] | [[evaluateTechTreeMastery]] | app.js |
| `ttOpenAccept` | [[Tech Tree Map]] | — | app.js |
| `ttOpenAvailableList` | [[Tech Tree Map]] | [[Map Page]] | app.js |
| `ttOpenCustomNodeForm` | [[Tech Tree Map]] | — | app.js |
| `ttOpenLinkPicker` | [[Tech Tree Map]] | — | app.js |
| `ttOpenMasterySheet` | [[Tech Tree Map]] | — | app.js |
| `ttOpenNode` | [[Tech Tree Map]] | [[Map Page]] | app.js |
| `ttOpenRegenSheet` | [[Map Reveal Loop]] | [[Map Page]] | app.js |
| `ttOpenRevealSheet` | [[Map Reveal Loop]] | [[Map Page]] | app.js |
| `ttPayloadResolves` | [[Tech Tree Map]] | [[evaluateTechTreeMastery]] | app.js |
| `ttPrereqDepth` | [[Tech Tree Map]] | — | app.js |
| `ttPrereqMet` | [[Tech Tree Map]] | — | app.js |
| `ttProgressArc` | [[Tech Tree Map]] | — | app.js |
| `_ttReadConfirm` | [[Tech Tree Map]] | [[Map Weaving]] | app.js |
| `ttRegenerateGoal` | [[Map Weaving]] | — | app.js |
| `ttRegenStatus` | [[Map Reveal Loop]] | [[Tech Tree Reveal Test]] | app.js |
| `ttRejectNode` | [[Tech Tree Map]] | [[Tech Tree Reveal Test]] | app.js |
| `ttRemoveStepStrip` | [[Tech Tree Map]] | — | app.js |
| `ttRenderIfVisible` | [[Tech Tree Map]] | — | app.js |
| `ttRepointChildrenOf` | [[Map Reveal Loop]] | — | app.js |
| `ttRequestGenerate` | [[Map Weaving]] | — | app.js |
| `ttResolveAcceptedNode` | [[Tech Tree Map]] | — | app.js |
| `ttRetireGoal` | [[Map Weaving]] | [[Tech Tree Map]] | app.js |
| `ttRevealable` | [[Map Reveal Loop]] | — | app.js |
| `ttRevealBlockers` | [[Map Reveal Loop]] | [[Tech Tree Reveal Test]] | app.js |
| `ttRevealCost` | [[Map Reveal Loop]] | — | app.js |
| `ttRevealState` | [[Map Reveal Loop]] | — | app.js |
| `ttSaveCustomNode` | [[Tech Tree Map]] | — | app.js |
| `ttSaveMastery` | [[Tech Tree Map]] | — | app.js |
| `ttSetView` | [[Map Reveal Loop]] | [[Map Page]] | app.js |
| `ttShort` | [[Tech Tree Map]] | — | app.js |
| `ttShowAddGoalBtn` | [[Tech Tree Map]] | — | app.js |
| `ttShowOverlay` | [[Tech Tree Map]] | — | app.js |
| `ttShowSheet` | [[Tech Tree Map]] | [[Sheets Overlays And Back Button]] | app.js |
| `ttSilhouettePreview` | [[Map Reveal Loop]] | [[Tech Tree Reveal Test]] | app.js |
| `ttStartWeaveCaptions` | [[Map Weaving]] | — | app.js |
| `ttStatTiles` | [[Tech Tree Map]] | — | app.js |
| `ttStopWeaveCaptions` | [[Map Weaving]] | — | app.js |
| `ttSyncMasteryGate` | [[Map Reveal Loop]] | — | app.js |
| `ttSyncWeaveUsage` | [[Map Weaving]] | [[aiUsage]] | app.js |
| `ttTargetPathFor` | [[Tech Tree Map]] | — | app.js |
| `ttTokenOverlap` | [[Tech Tree Map]] | — | app.js |
| `ttViewMode` | [[Map Reveal Loop]] | — | app.js |
| `ttViewToggleHtml` | [[Map Reveal Loop]] | — | app.js |
| `ttWeave` | [[Map Weaving]] | [[Tech Tree Reveal Test]] | app.js |
| `ttWeaveError` | [[Map Weaving]] | — | app.js |
| `ttWebLayout` | [[Tech Tree Map]] | — | app.js |
| `ttWeeklyLoad` | [[Tech Tree Map]] | — | app.js |
| `typicalXP` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `uid` | [[Onboarding Page]] | — | app.js |
| `unarchiveProject` | [[Quests]] | — | app.js |
| `undoActivity` | [[undoActivity]] | [[Activity Completion]], [[Grit Clawback Test]], [[Hook Chains]] | app.js |
| `undoActivityById` | [[Activity Completion]] | [[Activity List And Grid Views]], [[undoActivity]] | app.js |
| `undoLeaf` | [[Quests]] | — | app.js |
| `undoNextUp` | [[Quests]] | — | app.js |
| `undoQuestProgress` | [[Quests]] | [[undoActivity]], [[updateQuestProgress]] | app.js |
| `updateDashboard` | [[updateDashboard]] | — | app.js |
| `updateGradientPreview` | [[Themes]] | — | app.js |
| `updateGroup` | [[Routines]] | — | app.js |
| `updateGroupActCount` | [[Routines]] | — | app.js |
| `updateProfileAvatar` | [[Profile Page]] | — | app.js |
| `updateQuestProgress` | [[updateQuestProgress]] | [[Payout Browser Test]], [[Quests]], [[completeActivity]] | app.js |
| `updateRestoreBackupBtn` | [[Backup Export Import]] | [[saveUserData]] | app.js |
| `updateViewToggleIcon` | [[Activity List And Grid Views]] | — | app.js |
| `urlBase64ToUint8Array` | [[Push Delivery]] | — | app.js |
| `validateGroup` | [[composeQuest]] | [[Server Quest Composer Test]] | functions/lib/quest-composer.js |
| `validateLeaf` | [[composeQuest]] | [[Server Quest Composer Test]] | functions/lib/quest-composer.js |
| `validatePayload` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `validateSpec` | [[composeQuest]] | [[Server Pipeline Test]], [[Server Quest Composer Test]] | functions/lib/quest-composer.js |
| `vsAcceptChallenge` | [[Versus Challenges]] | [[Versus Browser Test]], [[versusChallenges]] | app.js |
| `vsAcceptGoto` | [[Versus Challenges]] | — | app.js |
| `vsAcceptStepDots` | [[Versus Challenges]] | — | app.js |
| `vsActiveCard` | [[Versus Challenges]] | [[Challenges Page]] | app.js |
| `vsActivitySeed` | [[Versus Challenges]] | — | app.js |
| `vsActListHtml` | [[Versus Challenges]] | — | app.js |
| `vsAddReqBtnHtml` | [[Versus Challenges]] | — | app.js |
| `vsAddRow` | [[Versus Challenges]] | — | app.js |
| `vsAnnounceResults` | [[Versus Challenges]] | [[vsRunMaintenance]] | app.js |
| `vsAttachDetail` | [[Versus Challenges]] | — | app.js |
| `vsAvatar` | [[Versus Challenges]] | — | app.js |
| `vsBoardModel` | [[Versus Challenges]] | [[Versus Browser Test]] | app.js |
| `vsBuildResolution` | [[Versus Challenges]] | [[versusChallenges]] | app.js |
| `vsCacheGet` | [[Versus Challenges]] | — | app.js |
| `vsCacheReplace` | [[Versus Challenges]] | — | app.js |
| `vsCancel` | [[Versus Challenges]] | — | app.js |
| `vsCappedTotal` | [[Versus Challenges]] | — | app.js |
| `vsChevron` | [[Versus Challenges]] | — | app.js |
| `vsChips` | [[Versus Challenges]] | — | app.js |
| `vsClaimPayout` | [[Versus Challenges]] | [[versusChallenges]], [[vsRunMaintenance]] | app.js |
| `vsClosePick` | [[Versus Challenges]] | — | app.js |
| `vsCloseSheet` | [[Versus Challenges]] | — | app.js |
| `vsCommitProgress` | [[Versus Challenges]] | [[versusChallenges]] | app.js |
| `vsCommittedActivityIds` | [[Versus Challenges]] | — | app.js |
| `vsConfirmForfeit` | [[Versus Challenges]] | — | app.js |
| `vsCountLive` | [[Versus Challenges]] | — | app.js |
| `vsCreateActivityFor` | [[Versus Challenges]] | [[Versus Browser Test]] | app.js |
| `vsCreateChallenge` | [[Versus Challenges]] | [[Versus Browser Test]], [[versusChallenges]] | app.js |
| `vsDecline` | [[Versus Challenges]] | — | app.js |
| `vsDelRow` | [[Versus Challenges]] | — | app.js |
| `vsDetachDetail` | [[Versus Challenges]] | — | app.js |
| `vsDraftAddRow` | [[Versus Challenges]] | — | app.js |
| `vsDraftBonusXP` | [[Versus Challenges]] | — | app.js |
| `vsDurationText` | [[Versus Challenges]] | — | app.js |
| `vsErrText` | [[Versus Challenges]] | — | app.js |
| `vsFetch` | [[Versus Challenges]] | [[Firestore Indexes]], [[versusChallenges]], [[vsRunMaintenance]] | app.js |
| `vsFilterActs` | [[Versus Challenges]] | — | app.js |
| `vsFlushBeforeStake` | [[Saving And The Write Invariant]] | — | app.js |
| `vsFmtLeft` | [[Versus Challenges]] | — | app.js |
| `vsForfeit` | [[Versus Challenges]] | [[versusChallenges]] | app.js |
| `vsHasCompleted` | [[Versus Challenges]] | — | app.js |
| `vsHero` | [[Versus Challenges]] | — | app.js |
| `vsIsTerminal` | [[Versus Challenges]] | — | app.js |
| `vsLiveMappingsFor` | [[Versus Challenges]] | — | app.js |
| `vsMapExisting` | [[Versus Challenges]] | — | app.js |
| `vsMappingOf` | [[Versus Challenges]] | — | app.js |
| `vsMarkSeen` | [[Versus Challenges]] | — | app.js |
| `vsMirrorBalance` | [[Versus Challenges]] | [[gritApplyDelta]], [[gritLedger]] | app.js |
| `vsName` | [[Versus Challenges]] | — | app.js |
| `vsNewId` | [[Versus Challenges]] | — | app.js |
| `vsNow` | [[Versus Challenges]] | — | app.js |
| `vsOnCompletion` | [[Versus Challenges]] | [[Hook Chains]] | app.js |
| `vsOnLogin` | [[Versus Challenges]] | — | app.js |
| `vsOnUndo` | [[Versus Challenges]] | [[Hook Chains]], [[undoActivity]] | app.js |
| `vsOpenAccept` | [[Versus Challenges]] | [[Challenges Page]], [[Versus Browser Test]] | app.js |
| `vsOpenCreate` | [[Versus Challenges]] | [[Challenges Page]], [[Versus Browser Test]] | app.js |
| `vsOpenPick` | [[Versus Challenges]] | — | app.js |
| `vsOpenPicker` | [[Versus Challenges]] | — | app.js |
| `vsOppBar` | [[Versus Challenges]] | — | app.js |
| `vsOppRow` | [[Versus Challenges]] | — | app.js |
| `vsOther` | [[Versus Challenges]] | — | app.js |
| `vsPaint` | [[Versus Challenges]] | [[Challenges Page]], [[Versus Browser Test]] | app.js |
| `vsPct` | [[Versus Challenges]] | — | app.js |
| `vsPendingCard` | [[Versus Challenges]] | [[Challenges Page]] | app.js |
| `vsPendingForMe` | [[Versus Challenges]] | — | app.js |
| `vsPersistAcceptDraft` | [[Versus Challenges]] | — | app.js |
| `vsPickableActivities` | [[Versus Challenges]] | — | app.js |
| `vsPickAct` | [[Versus Challenges]] | — | app.js |
| `vsPickOpponent` | [[Versus Challenges]] | — | app.js |
| `vsProgressOf` | [[Versus Challenges]] | — | app.js |
| `vsPrune` | [[Versus Challenges]] | [[vsRunMaintenance]] | app.js |
| `vsReadBalance` | [[Versus Challenges]] | [[users]] | app.js |
| `vsReadCreateForm` | [[Versus Challenges]] | — | app.js |
| `vsRenderAcceptReview` | [[Versus Challenges]] | — | app.js |
| `vsRenderAcceptStep` | [[Versus Challenges]] | — | app.js |
| `vsRenderCreateForm` | [[Versus Challenges]] | — | app.js |
| `vsRenderDetail` | [[Versus Challenges]] | — | app.js |
| `vsRenderIfVisible` | [[Versus Challenges]] | — | app.js |
| `vsRenderTab` | [[Challenges Page]] | [[Versus Challenges]], [[switchTab]] | app.js |
| `vsReqName` | [[Versus Challenges]] | — | app.js |
| `vsReqRowsHtml` | [[Versus Challenges]] | — | app.js |
| `vsResolvedCard` | [[Versus Challenges]] | [[Challenges Page]] | app.js |
| `vsResolveDeadline` | [[Versus Challenges]] | [[versusChallenges]], [[vsRunMaintenance]] | app.js |
| `vsRunMaintenance` | [[vsRunMaintenance]] | [[Versus Challenges]], [[versusChallenges]] | app.js |
| `vsSeedActivityModal` | [[Versus Challenges]] | — | app.js |
| `vsSheet` | [[Versus Challenges]] | [[Sheets Overlays And Back Button]] | app.js |
| `vsSheetHead` | [[Versus Challenges]] | — | app.js |
| `vsStakes` | [[Versus Challenges]] | — | app.js |
| `vsStakesHtml` | [[Versus Challenges]] | — | app.js |
| `vsSubBar` | [[Versus Challenges]] | — | app.js |
| `vsSubmitAccept` | [[Versus Challenges]] | [[Versus Browser Test]] | app.js |
| `vsSubmitCreate` | [[Versus Challenges]] | [[Versus Browser Test]] | app.js |
| `vsTerminatePending` | [[Versus Challenges]] | [[versusChallenges]], [[vsRunMaintenance]] | app.js |
| `vsTermsChanged` | [[Versus Challenges]] | — | app.js |
| `vsToggleDetail` | [[Versus Challenges]] | [[Challenges Page]] | app.js |
| `vsUid` | [[Versus Challenges]] | — | app.js |
| `vsUpdateBadges` | [[Versus Challenges]] | [[Challenges Page]], [[vsRunMaintenance]] | app.js |
| `vsUpdateCreateForm` | [[Versus Challenges]] | — | app.js |
| `walk` | [[Quests]], [[Quest Composer]] | — | app.js |
| `weaveExpansion` | [[weaveWeb]] | — | functions/index.js |
| `weaveGeneration` | [[weaveWeb]] | — | functions/index.js |
| `weaveWeb` | [[weaveWeb]] | [[Firebase Client]] | functions/index.js |
| `weeklyLoad` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `whyNowOf` | [[weaveWeb]] | — | functions/lib/web-weaver.js |
| `wipeAllGroups` | [[Routines]] | — | app.js |
| `wireDragHandle` | [[Quests]] | — | app.js |
| `writeGeneralReminder` | [[Reminders]] | [[reminders]] | app.js |
| `xpLblW` | [[Level-Up Share Card]] | — | app.js |
