---
type: start
last_verified: 2026-10-05
---
# App At A Glance

**In one line:** Mindkraft is a life-gamification Progressive Web App at mindkraft.life where people track habits as activities, earn XP and levels, keep streaks with shields, earn and spend a currency called Grit, run quests, an AI-woven skill map and Grit-staked modes, and compete or cooperate with friends — built as a single vanilla-JS client over one Firestore document per user, plus a small set of Firebase Cloud Functions.

## What the user sees
Four bottom-nav tabs × three sections ([[Bottom Navigation]]):

| Social | Pursuits | Activities | More |
|---|---|---|---|
| [[Friends Page]] | [[Quests Page]] | [[My Activities Page]] (home) | [[Analytics Page]] |
| [[Leaderboards Page]] | [[Modes Page]] | [[Categories Page]] | [[Rewards Page]] (Grit) |
| [[Challenges Page]] (Versus) | [[Narratives Page]] (coming soon) | [[Map Page]] | [[Settings Page]] |

Plus overlays: [[Landing And Sign In Page]], [[In-App Browser Page]], [[Onboarding Page]], [[Profile Page]], [[Friend Profile Page]], [[Activity Editor Page]], and the static [[Privacy Policy Page]] / [[Terms Of Use Page]].

## Stack
- **Client:** index.html (markup + three inline scripts: in-app browser escape, service-worker registration, Navigation v5), app.js (~29,400 lines, one ES module, no framework, no build step), style.css, sw.js, manifest.json. Firebase web SDK 10.8.0 from the gstatic CDN ([[Firebase Client]]). Served by GitHub Pages from the repo root ([[Web Hosting]]).
- **Data:** Firestore (asia-south1). One big `users/{uid}` document holds nearly all state ([[users]]); subcollections for server-written or append-only data ([[reminders]], [[gritLedger]], [[gifts]], [[giftsSent]], [[aiUsage]]); top-level shared/public collections ([[publicProfiles]], [[friendRequests]], [[leaderboardBoards]], [[versusChallenges]], [[pacts]]).
- **Server:** Cloud Functions v2 (Node 20, codebase `reminders`, region asia-south1): two schedulers ([[sendDueReminders]], [[resolveDueVersusChallenges]]), six Firestore triggers ([[onReminderWrite]], [[onGiftReceived]], [[onGiftConsumed]], [[onFriendRequestWrite]], [[onPactWrite]], [[onVersusWrite]]), three callables ([[createActivityReminder]], [[composeQuest]], [[weaveWeb]]). Web Push via VAPID ([[Push Delivery]]); Anthropic model for the two AI features ([[Model Adapter]]). Deployed by GitHub Actions ([[Deploy Pipeline]]). Security rules live in the Firebase Console ([[Security Rules]]).

## One-page mental model
1. **Sign in → load → login pass → render.** [[App Boot Sequence]] loads `users/{uid}` into `window.userData` ([[Loading And Migration]]), runs [[Login-Time Processing]] (streaks, shields, penalties, modes, Map, Grit week), then every feature's login hook.
2. **Everything is in memory, then saved whole.** Features mutate `window.userData` and call `saveUserData()`, which replaces the whole document — guarded by the [[Saving And The Write Invariant]]. Anything a server writes lives in a subcollection or a shared collection, never at the top of the user doc.
3. **The tap that matters is a completion.** [[Activity Completion]] (`completeActivity`) pays XP ([[XP And Levels]]), advances [[Streaks And Shields]], records history, pays Grit ([[Grit Currency]]), moves [[Dimension Levels]] and [[Quests]], and then a chain of wrappers ([[Hook Chains]]) updates the [[Daily Planner]], [[Tech Tree Map]], [[Versus Challenges]] and [[Modes]]. Undo reverses exactly what was recorded.
4. **Days are local, weeks start Monday.** [[Dates Days And Weeks]] and [[Activity Frequencies And Cycles]] define every window.
5. **Grit is the economy.** Earned by effort (drip, [[Grit Weekly Payout]], streaks, mastery, quests, [[Leaderboard Payouts]]), spent in the [[Grit Shop]], on [[Social Gifting]], [[Modes]] and wagers ([[Stake Mode]], [[Pact Mode]], [[Versus Challenges]]), and on the [[Map Reveal Loop]].
6. **Two-player features use shared documents.** Versus and Pacts escrow Grit in a shared doc; each client claims its own payout; the server only resolves/announces.
7. **AI returns drafts, never writes.** [[composeQuest]] and [[weaveWeb]] return results; the client decides and saves.

## Where to go next
- [[Change Impact Guide]] — what breaks what, the pre-ship checklist, and the known issues found while mapping.
- [[Home]] — every note.
- [[How To Use This Vault]], [[Glossary]], [[Function Index]], [[Vault Log]].

Lovely!
