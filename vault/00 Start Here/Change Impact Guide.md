---
type: start
last_verified: 2026-10-05
---
# Change Impact Guide

> [!summary] In plain words
> This page answers the question "if we change this, what else could be affected?" It lists the parts of the app that many other parts depend on, a checklist to go through before releasing a change, and a numbered list of problems and leftovers that were spotted while this vault was being written — each explained, none of them fixed yet.
>
> **How it connects:** Each item points to the page that explains it in detail. Read it together with [[App At A Glance]] before planning any change.

**In one line:** Where a change to Mindkraft ripples furthest, what to check before shipping, and the bugs, gaps and leftovers found while mapping the code on 2026-10-05 (recorded here, not fixed).

## Biggest ripple points

| Change point | Why it ripples | What it reaches | Check |
|---|---|---|---|
| Shape of `users/{uid}` / [[saveUserData]] | One document, replaced whole on every save | Every feature; server readers in functions/lib; backup/restore; rules | [[Saving And The Write Invariant]], [[users]], [[Security Rules]] |
| [[completeActivity]] / [[undoActivity]] | Base function plus four wrappers plus direct hooks | XP, streaks, Grit, gifts, quests, dimensions, planner, Map, Versus, Modes | [[Hook Chains]], [[Activity Completion]] |
| `completionHistory` entry `{date, xp, isPenalty, gritAwarded}` | Single source of truth re-read everywhere | Streak walks, analytics, Grit quota and clawback, Map mastery, Berserk baseline, server reminder/quest/weaver logic | [[recordCompletion]], [[Activity History Log]] |
| The dimensions → paths → activities tree and activity ids | Ids referenced across features; server mirrors the walk | Reminders, routines, planner, quests, Map nodes, modes, Versus mappings, Pact terms; functions/lib/activities.js, quest-composer.js, web-weaver.js | [[Activities]], [[Activity Index]] |
| Day/window helpers | Every period boundary | Streaks, skip penalties, Grit weeks, mode day counters, leaderboards, analytics | [[Dates Days And Weeks]], [[getCycleWindowStart]], [[toLocalDateStr]] |
| Login pass order | Modes wrap the streak walk; Grit reads settled streaks | Streaks, shields, Recovery/Insurance offsets, Map, Grit | [[Login-Time Processing]], [[processStreakPauses]] |
| Grit balance, ledger and markers | Spendable currency; client-trusted | Shop, gifts, modes, wagers, Map reveals, payouts | [[Grit Currency]], [[gritApplyDelta]], [[gritAwardOnce]] |
| Versus resolution rules | Three copies must agree | app.js, functions/lib/versus.js, console rules | [[Versus Challenges]], [[resolveDueVersusChallenges]] |
| Pact progress maths | Two copies must agree | app.js `pactStats`, functions/lib/pact.js | [[Pact Mode]], [[onPactWrite]] |
| Quest spec validators | Two copies ("edit both or neither") | app.js `qcValidate*`, functions/lib/quest-composer.js | [[Quest Composer]], [[composeQuest]] |
| Map constants | Duplicated client/server | Goal count, palette, regen clocks and prices | [[Map Weaving]], [[weaveWeb]] |
| `window.*` handler names | Called from `onclick` strings in index.html and in HTML built by app.js | Every UI action | [[Rendering And Window Globals]] |
| Firebase SDK URLs | Test harness remaps these exact URLs | All browser suites | [[Firebase Client]], [[Browser Test Harness]] |
| Exported Cloud Functions | Deploy list is hand-maintained | Deploys | [[Deploy Pipeline]], [[Server Deploy Test]] |
| sw.js `CACHE_VERSION` / `APP_SHELL` | Installed clients keep old assets | Every client release | [[Service Worker]] |
| Push payload `data.type` | Contract between senders and sw.js routing | Notification taps | [[Push Delivery]] |
| Tab ids and the nav `NAV` table | Matched by string in markup, regexes and nav | Navigation, deep links | [[Tab Switching]], [[Bottom Navigation]] |

## Pre-ship checklist
1. Grep every caller of what you changed — including `onclick="…"` strings inside app.js and index.html, and the wrappers in [[Hook Chains]].
2. Changed a `users/{uid}` field? Check the console rules allow it, whether old documents need a migration ([[Loading And Migration]]), what backup/restore/import do with it ([[Backup Export Import]]), and whether any Cloud Function reads it.
3. Changed something a completion pays? Make the undo and retro-delete paths reverse exactly what was recorded; run `node test/grit/clawback.test.mjs` and `node test/payout/payout.test.mjs`.
4. Changed dates, windows or streaks? Change both copies of the window rules; run the payout and modes suites.
5. Changed a mode, Versus, Pact or gift? Run `node test/modes/modes.test.mjs`, `node test/versus/versus.test.mjs`, `node test/social/social.test.mjs`; update the server copy and its tests.
6. Changed Cloud Functions? `cd functions && npm test`; add new functions to the deploy `--only` list; keep `REGION` and app.js `getFunctions(…, 'asia-south1')` in step.
7. Changed rules in the console? Export them to `firestore.rules` and run the rules suite (see [[Rules Test]]).
8. Client change going live? Bump `CACHE_VERSION` in sw.js. Browser suites are not in CI — run them by hand.
9. Changed data collection, visibility or AI use? Update [[Privacy Policy Page]] / [[Terms Of Use Page]].
10. Update the affected vault notes, add a [[Vault Log]] line, run `node vault/.tools/check-vault.mjs` (0 unresolved links).

## Observations (found while mapping — not fixed)
**Bugs and behavioural gaps**
1. **Versus "+N XP" bonus is never paid.** `vsDraftBonusXP` computes `bonusXP`, it is stored on the challenge and shown on the board and accept screen, but no code awards it. → [[Versus Challenges]], [[versusChallenges]]
2. **Focus Window bonus survives undo.** `modesOnUndo` has no Focus branch, so undoing a boosted completion keeps the +10% XP; complete → undo → complete pays it again. → [[Focus Window]], [[modesOnCompletion]], [[undoActivity]]
3. **Retro-logging a perform-negative activity adds XP.** `retroactiveComplete` records `+baseXP` and raises total XP, where a live completion deducts. → [[Retroactive History Editing]], [[Negative Activities And Skip Penalty]]
4. **Dimension XP has three inconsistent paths.** `applyDimXP` subtracts negative completions and penalties and has no level cap; `recomputeDimXP` (after any retro edit) adds `Math.abs(xp)`, ignores penalties, caps at 100; `applyLevelScaling` caps at 200. A retro edit can jump a dimension's level. → [[Dimension Levels]]
5. **Server's dead-push-subscription cleanup is undone.** The server deletes `users/{uid}.pushSubscription`; the client's next full save writes its in-memory copy back. → [[Push Delivery]], [[Saving And The Write Invariant]], [[pushToUser]]
6. **Security rules are not in the repo, so the rules suite cannot run.** test/rules loads `../../firestore.rules`, which does not exist; the deploy workflow confirms "this repo has no copy". → [[Security Rules]], [[Rules Test]]
7. **Pacts have no scheduled resolver.** Unlike Versus, an expired or finished Pact (and its result push) waits until a participant opens the app. → [[Pact Mode]], [[pacts]], [[onPactWrite]]
8. **Quest Composer's client gate is stricter than the server.** `qcLiveActivityCount` requires 3 recently completed activities; the server's `activityMenu` no longer filters on recency. The comment above `lookbackDays` in lib/quest-composer.js still describes the old filter. → [[Quest Composer]], [[composeQuest]]
9. **Import skips migration and an await.** `importData` does not run `migrateUserData` (restore does) and does not await `processStreakPauses`; importing another account's export takes over its friends, friend code and push subscription. Reset keeps only settings, so the friend code changes. → [[Backup Export Import]]
10. **Grit can be seeded from localStorage.** `gritMigrateLocalBalance` still credits a brand-new account with any number found under `mk_grit_balance`. → [[Grit Currency]]

**Dead code and leftovers**
11. **Dead render targets.** `updateDashboard` walks every activity's history on each tick to fill `#xpToday`, `#completedToday`, `#longestStreak`, which do not exist; `switchTab` toggles a missing `.stats-grid`; `renderTimeOfDay` (`#timeOfDayChart`) and `renderHistoryEdit` (`#historyEditList`) always return early. → [[updateDashboard]], [[Analytics Page]], [[Retroactive History Editing]], [[Tab Switching]]
12. **Activity flags read but never set.** `pinned` (sorting), `archived` and `deleted` (Grit, Map, composer, modes filters) — nothing writes them; functions/lib/activities.js says no such flags exist. → [[Activities]], [[Activity List And Grid Views]]
13. **Share card "Most active areas" reads `dimension.lifeCategory`,** a field nothing in the app sets, so the section only appears for legacy data. → [[Level-Up Share Card]], [[Character Title And Life Balance]]
14. **Retired fields are still written.** `vsDraftMappings` and `vsSeenResults` are in `RETIRED_USER_FIELDS` ("deleted, not left inert") but current Versus code writes and reads both; `vsSeenResults` is never pruned. → [[Loading And Migration]], [[Versus Challenges]]
15. **`window.addGroup` is assigned twice** (Routines, then the Quest builder overwrites it). Works today only because routine code calls the module-level function. → [[Routines]], [[Quests]], [[Rendering And Window Globals]]
16. **Wrapper for a function that does not exist.** The Tech Tree hooks wrap `window.completeProject` if present; it is never defined. → [[Hook Chains]], [[Tech Tree Map]]
17. **Legacy reminder sender still in the repo.** scripts/send-reminders.js reads `reminderTime` / `tzOffset`, which the client no longer writes; nothing runs it. → [[Legacy Reminder Script]]
18. **Unused server copy.** functions/lib/modes.js still has the Focus "your window opens at…" branch; nothing schedules Focus reminders any more. → [[Focus Window]]
19. **`ANTHROPIC_MODEL` is "pinned by the deploy environment" but never set** by the workflow; the `claude-haiku-4-5` fallback always runs. → [[Model Adapter]], [[Deploy Pipeline]]
20. **Two `beforeinstallprompt` listeners** hold separate references to the same one-shot prompt. → [[PWA Install]]
21. **Locked custom-theme editor.** ~400 lines serve only accounts that already had a custom theme. → [[Themes]]
22. **Small leftovers.** `if (isOffline || true)` in `loadUserData`; `canCompleteActivity`'s identical branches; `acceptFriendRequest` re-imports `deleteDoc`; an empty "Streak Pausing" comment in Settings markup and the `processStreakPauses` misnomer; "mkEmpty…" host ids on live pages; the Narratives page is a placeholder. → [[Loading And Migration]], [[Activity Frequencies And Cycles]], [[Friends]], [[Settings Page]], [[Modes Page]], [[Narratives Page]]

**Stale comments and docs**
23. Quest module header says the 20% bonus is paid per completion (it is a lump sum at seal) → [[Quests]]; Versus header names `switchSubTab` and `vsGuardActivityDelete` hooks that no longer exist → [[Versus Challenges]]; Streak header says shields consumed are "0–3" (cap is 10) → [[Streaks And Shields]]; multiplier comment documents `streak^1.5` (default exponent is 1.2) → [[Activity Completion]]; Groups header says one routine per activity (multi-per-day activities may be in several) → [[Routines]]; test/rules/README calls a non-existent `firestore.rules` canonical → [[Rules Test]].

**Testing gaps**
24. **Browser suites are manual and machine-specific.** They import Playwright from `/opt/node22/lib/node_modules/playwright/index.mjs` and are not run in CI; only functions unit tests gate a deploy, and nothing gates a client release. → [[Test Suites Overview]], [[Deploy Pipeline]], [[Web Hosting]]
