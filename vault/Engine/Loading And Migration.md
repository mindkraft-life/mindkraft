---
type: engine
sources: [app.js]
last_verified: 2026-10-05
---
# Loading And Migration

**In one line:** `loadUserData(uid)` reads the single `users/{uid}` document into `window.userData`, falls back to the Firestore cache when offline, marks the session read-only if nothing could be read, runs the one schema migration and backfills a friend code and timezone.

## How it works
- Clears `window._dataOwnerUid` and cancels pending saves first, so nothing from a previous session can land mid-fetch.
- `getDoc` → on error `getDocFromCache` → if both fail, `readFailed = true`.
- Document exists: `window.userData = data`, `_dataOwnerUid = uid`, `mkTouchActivityIndex()`, then `migrateUserData()` (saves if it changed anything), backfills `friendCode` with a direct `setDoc`, hydrates `settings.activityViewMode` and `settings.gridCardTypes` into window globals.
- Document missing: a blank account object is created. If the read *failed* (not "missing"), `_dataLoadFailed = true` and `_dataOwnerUid = null`, which makes every write refuse (see [[canPersistUserData]]).
- Applies `data-theme-mode` (light/dark) early to avoid a flash, then calls `syncUserTimezone()` (non-blocking).
- **Schema migration:** `USER_SCHEMA_VERSION = 1`. `migrateUserData` deletes `RETIRED_USER_FIELDS` (`challenges`, `activeGroupChallengeId`, `vsDraftMappings`, `vsSeenResults`) from the document and from `autoBackup.data`, then stamps `schemaVersion`.
- Feature sub-objects also self-migrate lazily when first touched: `gritState()` ([[Grit Currency]]), `modesState()` ([[Modes]]), `ensureTechTree()` / `migrateTechTreeV2` / `migrateTechTreeV3` ([[Tech Tree Map]]), `migrateProject()` ([[Quests]]).

## Key functions
- `loadUserData` — see [[loadUserData]].
- `migrateUserData` — one-shot purge of retired fields, gated on the document's schema version.
- `generateFriendCode` — `MK-XXXX`-style code backfilled for old accounts.
- `syncUserTimezone` — stores the IANA zone and pushes it to existing reminders.
- `showDataLoadFailure` — read-only warning overlay.

## Data it touches
- [[users]], [[reminders]] (timezone propagation)

## Connected to
- [[App Boot Sequence]], [[Saving And The Write Invariant]], [[Activity Index]], [[Reminders]], [[Friends]], [[Themes]]

## If you change this
- Never let a failed read look like a new account: the blank placeholder must stay unwritable, or a network blip wipes a real user.
- Adding a top-level field needs no migration (missing = default), but removing one should go through `RETIRED_USER_FIELDS` plus a version bump.
- The `vsDraftMappings` / `vsSeenResults` fields are listed as retired, but current Versus code writes them again — see [[Change Impact Guide]] observations.
- `if (isOffline || true)` makes the cache fallback unconditional; the `isOffline` test is dead code.

## Where in the code
- app.js — `USER_SCHEMA_VERSION`, `RETIRED_USER_FIELDS`, `migrateUserData`, `loadUserData`, `showDataLoadFailure` (section after "The write invariant").
