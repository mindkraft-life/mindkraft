---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# loadUserData

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
