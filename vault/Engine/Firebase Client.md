---
type: engine
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Firebase Client

> [!summary] In plain words
> Firebase is the Google service Mindkraft is built on. It handles signing in, stores everyone's data online, runs the helpers that live on the server, and counts basic usage. This part is the app's single connection to all of that.
>
> **How it connects:** Used by everything that saves or loads data ([[Saving And The Write Invariant]], [[Loading And Migration]]) and by the AI and reminder services ([[Model Adapter]], [[Reminders]]).

**In one line:** app.js imports the Firebase 10.8.0 web SDK from the gstatic CDN and creates one app, one Auth, one Firestore, one Analytics and one Functions client (region asia-south1) that every feature in the Mindkraft client shares.

## How it works
- app.js is loaded as `<script type="module" src="app.js">` from index.html. Its first lines import `firebase-app`, `firebase-auth`, `firebase-firestore`, `firebase-analytics` and `firebase-functions` straight from `https://www.gstatic.com/firebasejs/10.8.0/…` — there is no bundler or npm install for the client.
- The `firebaseConfig` object (project `life-gamification-app-b7674`) is hard-coded in app.js. It is a public web config, not a secret.
- `getFunctions(app, 'asia-south1')` must match `REGION` in functions/index.js; a mismatch shows up as a CORS error on the callables.
- `APP_BASE_URL` (`https://mindkraft.life`) and `APP_BASE_HOST` are the single source of truth for the public origin (friend share links, the domain printed on the level-up card) and are copied to `window` so index.html inline scripts can read them.
- Three global state handles live on `window`: `window.currentUser` (Firebase user), `window.userData` (the whole user document in memory) and `window.currentTab`.
- `window.trackEvent(name, params)` wraps Firebase Analytics `logEvent` and swallows errors. Only a handful of events are logged (`activity_reminder_created`, `cat_info_opened`, `cat_search_goto`, `mode_activated`, `mode_ended`, `quest_composed`).

## Key functions
- `window.trackEvent` — fire-and-forget analytics event.
- `httpsCallable(functions, name)` — used for the three callables: `createActivityReminder`, `composeQuest`, `weaveWeb`.

## Data it touches
- [[users]] (through every read/write in the app)

## Connected to
- [[App Boot Sequence]] — `onAuthStateChanged(auth, …)` is registered right after setup.
- [[Saving And The Write Invariant]] — every `setDoc` uses the `db` created here.
- [[createActivityReminder]], [[composeQuest]], [[weaveWeb]] — the callables.
- [[Service Worker]] — never intercepts Firebase/Google hosts.
- [[Deploy Pipeline]] — the server side of the same project.

## If you change this
- Upgrading the SDK version means changing five import URLs together; the test harness remaps these exact URLs to stubs (see [[Browser Test Harness]]), so its import map must change too.
- Changing the region needs the same change in functions/index.js `REGION` and the Firestore database location.
- `APP_BASE_URL` is deliberately absolute so links shared from a preview build still point at the real site.

## Where in the code
- app.js — top of file: imports, `firebaseConfig`, `initializeApp`, `getAuth`, `getFirestore`, `getAnalytics`, `getFunctions`, `APP_BASE_URL`, `window.trackEvent`.
