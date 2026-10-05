---
type: start
last_verified: 2026-10-05
---
# Home

**In one line:** The front door of the Mindkraft documentation vault — every note in the vault, grouped by folder, so anything about the app can be reached in two clicks.

New here? Read [[App At A Glance]], then [[Change Impact Guide]]. See also [[How To Use This Vault]], [[Glossary]], [[Function Index]], [[Vault Log]] and the vault [[README]].

## Start Here
- [[App At A Glance]]
- [[Change Impact Guide]]
- [[Function Index]]
- [[Glossary]]
- [[How To Use This Vault]]
- [[Vault Log]]

## Pages
Every user-facing screen.
- [[Activity Editor Page]]
- [[Analytics Page]]
- [[Categories Page]]
- [[Challenges Page]]
- [[Friend Profile Page]]
- [[Friends Page]]
- [[In-App Browser Page]]
- [[Landing And Sign In Page]]
- [[Leaderboards Page]]
- [[Map Page]]
- [[Modes Page]]
- [[My Activities Page]]
- [[Narratives Page]]
- [[Onboarding Page]]
- [[Privacy Policy Page]]
- [[Profile Page]]
- [[Quests Page]]
- [[Rewards Page]]
- [[Settings Page]]
- [[Terms Of Use Page]]

## Features
**Activities core**
- [[Activities]]
- [[Activity Frequencies And Cycles]]
- [[Activity Completion]]
- [[XP And Levels]]
- [[Streaks And Shields]]
- [[Negative Activities And Skip Penalty]]
- [[Retroactive History Editing]]
- [[Activity History Log]]
- [[Activity List And Grid Views]]
- [[Activity Search]]

**Organisation and planning**
- [[Dimensions And Paths]]
- [[Dimension Levels]]
- [[Level Rewards]]
- [[Routines]]
- [[Daily Planner]]

**Quests and the Map**
- [[Quests]]
- [[Quest Composer]]
- [[Tech Tree Map]]
- [[Map Weaving]]
- [[Map Reveal Loop]]

**Grit economy**
- [[Grit Currency]]
- [[Grit Weekly Payout]]
- [[Grit Shop]]

**Modes**
- [[Modes]]
- [[Habit Mode]]
- [[Berserk Mode]]
- [[Recovery Mode]]
- [[Insurance Mode]]
- [[Stake Mode]]
- [[Pact Mode]]
- [[Focus Window]]

**Social**
- [[Friends]]
- [[Public Profile]]
- [[Leaderboard Payouts]]
- [[Social Gifting]]
- [[Versus Challenges]]

**App shell and account**
- [[Reminders]]
- [[Level-Up Share Card]]
- [[Character Title And Life Balance]]
- [[Themes]]
- [[Bottom Navigation]]
- [[Backup Export Import]]
- [[First-Run Tutorial]]
- [[PWA Install]]

## Engine
Shared mechanics every feature relies on.
- [[Activity Index]]
- [[App Boot Sequence]]
- [[Dates Days And Weeks]]
- [[Firebase Client]]
- [[Hook Chains]]
- [[Icons]]
- [[Loading And Migration]]
- [[Login-Time Processing]]
- [[Rendering And Window Globals]]
- [[Saving And The Write Invariant]]
- [[Searchable Dropdown]]
- [[Service Worker]]
- [[Sheets Overlays And Back Button]]
- [[Tab Switching]]
- [[Toasts And Feedback]]

## Data
One note per Firestore collection, named exactly like the collection.
- [[aiUsage]]
- [[friendRequests]]
- [[gifts]]
- [[giftsSent]]
- [[gritLedger]]
- [[leaderboardBoards]]
- [[pacts]]
- [[publicProfiles]]
- [[reminders]]
- [[users]]
- [[versusChallenges]]

## Backend
Cloud Functions, deploy, rules, push, hosting.
- [[Deploy Pipeline]]
- [[Firestore Indexes]]
- [[Legacy Reminder Script]]
- [[Model Adapter]]
- [[Push Delivery]]
- [[Reminder Scheduling]]
- [[Security Rules]]
- [[Web Hosting]]
- [[composeQuest]]
- [[createActivityReminder]]
- [[onFriendRequestWrite]]
- [[onGiftConsumed]]
- [[onGiftReceived]]
- [[onPactWrite]]
- [[onReminderWrite]]
- [[onVersusWrite]]
- [[resolveDueVersusChallenges]]
- [[sendDueReminders]]
- [[weaveWeb]]

## Code
The most connected functions, named exactly like the function.
- [[canPersistUserData]]
- [[completeActivity]]
- [[escapeHtml]]
- [[evaluateTechTreeMastery]]
- [[findActivityById]]
- [[getCycleWindowStart]]
- [[gritApplyDelta]]
- [[gritAwardOnce]]
- [[gritOnCompletion]]
- [[loadUserData]]
- [[modesOnCompletion]]
- [[predictCompletionXP]]
- [[processStreakPauses]]
- [[processStreakSystem]]
- [[pushToUser]]
- [[recordCompletion]]
- [[saveUserData]]
- [[showToast]]
- [[switchTab]]
- [[syncPublicProfile]]
- [[toLocalDateStr]]
- [[undoActivity]]
- [[updateDashboard]]
- [[updateQuestProgress]]
- [[vsRunMaintenance]]

## Tests
What each test file protects.
- [[Browser Test Harness]]
- [[Grit Clawback Test]]
- [[Modes Browser Test]]
- [[Nav Browser Test]]
- [[Payout Browser Test]]
- [[Rules Test]]
- [[Server Activities Test]]
- [[Server Deploy Test]]
- [[Server Modes Test]]
- [[Server Pact Test]]
- [[Server Pipeline Test]]
- [[Server Quest Composer Test]]
- [[Server Schedule Test]]
- [[Server Versus Test]]
- [[Server Web Weaver Test]]
- [[Social Browser Test]]
- [[Tech Tree Reveal Test]]
- [[Test Suites Overview]]
- [[Versus Browser Test]]
