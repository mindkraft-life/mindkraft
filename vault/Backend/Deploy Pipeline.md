---
type: backend
sources: [.github/workflows/deploy-reminders.yml, firebase.json, functions/package.json, functions/test/deploy.test.js, .gitignore]
last_verified: 2026-10-05
---
# Deploy Pipeline

> [!summary] In plain words
> How server changes go live. When the server code is updated on the main branch of the project, GitHub automatically runs its checks and, if they pass, installs the new server helpers. It never touches the app itself or the database's security rules.
>
> **How it connects:** It publishes the server helpers listed on [[App At A Glance]]; the app itself is published by [[Web Hosting]].

**In one line:** The GitHub Actions workflow "Deploy Reminder Functions" runs on pushes to `main` that touch functions/, firebase.json, firestore.indexes.json or the workflow itself; it runs the functions unit tests, writes secrets into functions/.env, and deploys each named Cloud Function plus Firestore indexes — never security rules and never the web client.

## How it works
- Trigger: `push` to `main` with a `paths:` allow-list, or manual `workflow_dispatch`. Concurrency group `deploy-reminders` (no cancel).
- Steps: checkout → Node 20 → `npm ci` (functions/) → `npm test` (`node --test test/*.test.js`) → write `functions/.env` from secrets (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_CONTACT_EMAIL`, `ANTHROPIC_API_KEY`; fails if missing) → `firebase-tools@13 deploy --only functions:reminders:<each>,firestore:indexes` with the `FIREBASE_SERVICE_ACCOUNT` secret, project `life-gamification-app-b7674`.
- Functions are listed one by one with the `reminders:` codebase prefix (from firebase.json); a bare `--only functions` would delete anything missing from source. The list today: sendDueReminders, onGiftReceived, onGiftConsumed, onFriendRequestWrite, onPactWrite, onVersusWrite, resolveDueVersusChallenges, onReminderWrite, createActivityReminder, composeQuest, weaveWeb.
- `functions/.env` is gitignored. firebase.json `functions[0].ignore` keeps `test/` and `node_modules` out of the upload.
- The browser tests under test/ and the rules tests are **not** run in CI.
- The web client (index.html, app.js, …) is not deployed by this workflow; see [[Web Hosting]].

## Key functions
- Workflow steps (no JS functions). Guarded by functions/test/deploy.test.js.

## Data it touches
- [[reminders]] (index), [[versusChallenges]] (indexes), [[pacts]] (index)

## Connected to
- [[Firestore Indexes]], [[Security Rules]], [[Web Hosting]], [[Server Deploy Test]], [[Test Suites Overview]], [[Push Delivery]], [[Model Adapter]]

## If you change this
- **A new Cloud Function must be added to the `--only` list** (with `functions:reminders:`), or it is never deployed — the deploy test fails if an export is missing.
- Editing the workflow file itself triggers a deploy when it reaches `main`.
- `paths-ignore` cannot be combined with `paths` on the same event in GitHub Actions; the allow-list already excludes vault/ and the web files.

## Where in the code
- .github/workflows/deploy-reminders.yml, firebase.json, functions/package.json.
