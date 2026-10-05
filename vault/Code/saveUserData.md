---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# saveUserData

> [!summary] In plain words
> The single action that saves your whole account to the online database after any change, tucking a backup copy inside once a day. Almost every feature relies on it.
>
> **How it connects:** Explained in [[Saving And The Write Invariant]]. It also refreshes the summary friends can see ([[Public Profile]]).

**In one line:** `saveUserData()` writes the entire in-memory `window.userData` to `users/{uid}` with a replacing `setDoc`, embedding a once-a-day backup snapshot, then refreshes the public profile — it is the persistence call behind almost every feature (about 100 call sites).

## How it works
- Returns immediately unless `canPersistUserData('saveUserData')` passes.
- First save of the local day: deep-copies `userData` (minus `autoBackup`) into `autoBackup {savedAt, savedDate, data}` within the same write and updates the restore button.
- `await setDoc(doc(db, 'users', uid), dataToSave)`; then `syncPublicProfile()` (not awaited).
- On error: `console.error` and a blocking `alert('Failed to save data. Please try again.')`.
- Fire-and-forget callers use `debouncedSaveUserData()` (200 ms).

## Key functions
- `saveUserData`, `debouncedSaveUserData`, `canPersistUserData`, `syncPublicProfile`, `updateRestoreBackupBtn`.

## Data it touches
- [[users]], [[publicProfiles]]

## Connected to
- [[Saving And The Write Invariant]], [[canPersistUserData]], [[syncPublicProfile]], [[Backup Export Import]], [[loadUserData]]

## If you change this
- Replace semantics are load-bearing (deleted fields must disappear); merge semantics would break deletions and migrations.
- Anything written to the top level of `users/{uid}` by another writer is overwritten here.
- Every call costs two Firestore writes (user doc + public profile).

## Where in the code
- app.js — "Write budget management" block, just after the Retroactive Recalculation Engine.
