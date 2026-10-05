---
type: engine
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# App Boot Sequence

> [!summary] In plain words
> The order of events when you open the app while signed in: load your data, catch up on everything that happened while the app was closed (streaks, penalties, the weekly Grit bonus, challenges, gifts, friend requests, leaderboard prizes, modes), show the home screen, and then decide whether to show the welcome tour, the tutorial, or nothing.
>
> **How it connects:** Loading is explained in [[Loading And Migration]] and catching up in [[Login-Time Processing]]. New users see the [[Onboarding Page]].

**In one line:** When Firebase Auth reports a signed-in user, the `onAuthStateChanged` handler in app.js loads the user document, runs the login-time passes, renders the dashboard, fires every feature's login hook and then decides between onboarding, the tutorial or the normal app.

## How it works
1. index.html shows `#loading`. An inline script first checks for in-app browsers (see [[In-App Browser Page]]); if detected it sets `window._mkInAppBrowser` and the normal landing is skipped.
2. app.js starts an 8-second `authCheckTimeout`; if Auth never answers, the landing screen is shown via `initAuthScreen`.
3. `onAuthStateChanged(auth, async user => …)`:
   - **Signed in:** `window.currentUser = user` → `await loadUserData(uid)` → hide loading, show `#appContainer` → `loadSettings()` → `await processStreakPauses()` → `scheduleReminder()` → `updateDashboard()` → `updateProfileAvatar()` → restore the persisted Activities sub-tab → `syncPublicProfile()` (non-blocking) → `handleFriendDeepLink()` (`?add=` links) → handle `?tab=friends|modes` from a push cold start → login hooks in this order, each in its own try/catch: `vsOnLogin()`, `giftOnLogin()`, `frRequestsOnLogin()`, `lbOnLogin()`, `modesOnLogin()` → `mkHandleReminderDeepLink()` (`?reminder=`) → `updateRestoreBackupBtn()`.
   - Then: if the load failed → `showDataLoadFailure()`; else if the account is brand new (no dimensions, 0 XP, level 1, `onboardingComplete` false) → `showOnboardingOverlay()`; else if `tutorialStep === 0` → `showCurrentTutorialStep()`.
   - **Signed out:** `cancelPendingUserDataSave()`, clear `window._dataOwnerUid`, `currentUser`, `userData`, show the landing screen.
   - **Error while signed in:** a read-only placeholder `userData` is installed (with `_dataLoadFailed = true`) and the app opens in "offline mode".
4. After DOMContentLoaded the index.html Navigation v5 script runs `boot()` (see [[Bottom Navigation]]).

## Key functions
- `onAuthStateChanged` handler — the orchestrator described above.
- `loadUserData` — see [[loadUserData]].
- `processStreakPauses` — see [[processStreakPauses]].
- `initAuthScreen` — landing/login screen ([[Landing And Sign In Page]]).
- `showDataLoadFailure` — the "Couldn't load your data" overlay.
- `showOnboardingOverlay` — [[Onboarding Page]].

## Data it touches
- [[users]], [[publicProfiles]], [[versusChallenges]], [[gifts]], [[friendRequests]], [[leaderboardBoards]], [[pacts]], [[reminders]]

## Connected to
- [[Loading And Migration]], [[Login-Time Processing]], [[Saving And The Write Invariant]]
- [[Versus Challenges]], [[Social Gifting]], [[Friends]], [[Leaderboard Payouts]], [[Modes]], [[Reminders]], [[Backup Export Import]]
- [[updateDashboard]], [[syncPublicProfile]]

## If you change this
- Order matters: `processStreakPauses` must run after the load and before `updateDashboard`, because the dashboard reads the streaks it settles.
- A new feature's login hook belongs in this list, wrapped in its own try/catch so one failing feature cannot stop the others.
- Anything that writes during boot must respect `canPersistUserData` — boot-time writes are exactly how a failed load could overwrite a real account.
- Deep-link query params (`add`, `tab`, `reminder`) are consumed here; the service worker produces `tab` and `reminder`.

## Where in the code
- app.js — `onAuthStateChanged(auth, …)` block and `authCheckTimeout`, just before the "write invariant" section.
- index.html — inline in-app browser detector (top of body) and the Navigation v5 script (`boot`).
