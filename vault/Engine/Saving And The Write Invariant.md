---
type: engine
sources: [app.js, functions/index.js]
last_verified: 2026-10-05
---
# Saving And The Write Invariant

**In one line:** Almost all client state is persisted by `saveUserData()`, which does a full `setDoc` overwrite of `users/{uid}` from `window.userData`, guarded by `canPersistUserData()` and folded with a once-a-day backup snapshot — so anything another writer puts at the top level of that document is clobbered on the next save.

## How it works
- **One document, one writer.** Activities, dimensions, XP, streaks, quests, groups, planner, tech tree, Grit balance, modes state and settings all live inside `users/{uid}`. `saveUserData()` writes the entire in-memory object back with `setDoc` (replace, not merge).
- **The write invariant.** `canPersistUserData(reason)` refuses when: no user is signed in; the last load failed (`window._dataLoadFailed`); no account is loaded yet (`window._dataOwnerUid` null); or the data in memory belongs to a different uid than the signed-in one. Every writer of the user doc checks it.
- **Debounce.** `debouncedSaveUserData()` coalesces rapid saves into one write after 200 ms; `cancelPendingUserDataSave()` drops a queued save when the user changes.
- **Daily backup.** The first save of each local day embeds `autoBackup: { savedAt, savedDate, data }` (a deep copy minus `autoBackup`) inside the same write — zero extra writes. `_backupSavedDate` gates it.
- After every successful save, `syncPublicProfile()` refreshes [[publicProfiles]].
- On failure `saveUserData` logs and shows a blocking `alert('Failed to save data…')`.
- **Other writers of `users/{uid}`:** `gritPersist()` (full `setDoc`, returns success so purchases can check it), the `friendCode` backfill in `loadUserData`, and Versus/Pact transactions that `tx.update` only `grit.balance` / `grit.lifetimeSpent`. Before staking, `vsFlushBeforeStake()` cancels the debounce and saves so the transaction reads fresh data.
- **Why subcollections exist.** Server-written or append-only data lives in subcollections ([[reminders]], [[gritLedger]], [[gifts]], [[giftsSent]], [[aiUsage]]) precisely so this overwrite can never clobber it. The AI callables return results instead of writing the user doc for the same reason.

## Key functions
- `saveUserData` — see [[saveUserData]].
- `canPersistUserData` — see [[canPersistUserData]].
- `debouncedSaveUserData` — 200 ms coalescing wrapper.
- `cancelPendingUserDataSave` — clears the debounce timer.
- `gritPersist` — checked save used before granting purchases.
- `vsFlushBeforeStake` — flush before a Grit transaction.

## Data it touches
- [[users]], [[publicProfiles]]

## Connected to
- [[Loading And Migration]], [[App Boot Sequence]], [[Backup Export Import]], [[Public Profile]], [[Grit Currency]], [[Versus Challenges]], [[Pact Mode]], [[Push Delivery]]

## If you change this
- Any new server-side writer of a top-level `users/{uid}` field will be overwritten by the next client save. Example already in the code: the server deletes a dead `pushSubscription`, and the client writes its in-memory copy back on the next save (see [[Change Impact Guide]]).
- Switching to `merge: true` would stop deletions from ever persisting (fields removed in memory would survive in Firestore) — the app relies on replace semantics to drop fields.
- The document grows with `completionHistory` (capped at 365 entries per activity), `deletedActivityLog` (200), `modeXPLog` and the embedded `autoBackup` copy; Firestore's 1 MiB document limit is the ceiling.
- Calls that must be durable before continuing `await saveUserData()`; fire-and-forget paths use the debounce.

## Where in the code
- app.js — "The write invariant" section (`canPersistUserData`, `cancelPendingUserDataSave`, `showDataLoadFailure`); "Write budget management" section (`saveUserData`, `debouncedSaveUserData`); Grit section (`gritPersist`); Versus section (`vsFlushBeforeStake`, `vsReadBalance`).
