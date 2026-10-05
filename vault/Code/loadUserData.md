---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# loadUserData

> [!summary] In plain words
> The step that fetches your account when you open the app. It falls back to the copy kept on your phone when you are offline, and switches to a safe read-only mode if nothing can be read.
>
> **How it connects:** Explained in [[Loading And Migration]]; it is the first step of the [[App Boot Sequence]].

**In one line:** `loadUserData(uid)` fetches `users/{uid}` (network, then cache), installs it as `window.userData`, decides whether the session may write, migrates the schema, backfills a friend code and timezone, and applies the light/dark mode early.

## How it works
- Clears `_dataOwnerUid` and pending saves → `getDoc` → fallback `getDocFromCache` (with an "Offline" toast) → `readFailed` if both fail.
- Exists: set data, owner uid, `mkTouchActivityIndex`, `migrateUserData` (+ save), friend-code backfill (`setDoc`), hydrate view settings.
- Missing: blank account; writable only if Firestore actually answered "no document".
- Then theme mode and `syncUserTimezone()`.
- Called once per sign-in from the `onAuthStateChanged` handler.

## Key functions
- `loadUserData`, `migrateUserData`, `generateFriendCode`, `syncUserTimezone`, `mkTouchActivityIndex`.

## Data it touches
- [[users]], [[reminders]] (timezone propagation via `syncUserTimezone`)

## Connected to
- [[Loading And Migration]], [[App Boot Sequence]], [[canPersistUserData]], [[saveUserData]], [[Activity Index]]

## If you change this
- The `readFailed` / "missing" distinction is what prevents a network error from wiping an account; keep it.
- `if (isOffline || true)` makes the cache fallback unconditional (dead condition).

## Where in the code
- app.js — after `migrateUserData`, before `updateDashboard`.
