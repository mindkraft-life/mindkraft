---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# canPersistUserData

> [!summary] In plain words
> A safety check that runs before anything is saved. It refuses if nobody is signed in, if your data did not load properly, or if the data on screen belongs to someone else.
>
> **How it connects:** Part of [[Saving And The Write Invariant]]; it guards against the problems described in [[Loading And Migration]].

**In one line:** `canPersistUserData(reason)` is the write guard every writer of user-scoped data checks first: it returns false when nobody is signed in, when the last load failed, when no account is loaded yet, or when the data in memory belongs to a different uid than the signed-in user.

## How it works
- Reads `window.currentUser`, `window._dataLoadFailed`, `window._dataLoadError`, `window._dataOwnerUid`.
- `loadUserData` sets `_dataOwnerUid = uid` only after a successful read (or a confirmed-missing document); sign-out clears it.
- Logs a console warning naming the blocked `reason` (except for the silent signed-out case).
- Callers include `saveUserData`, `gritPersist`, `gritFlushLedger`, `gritReadLedger`, `syncPublicProfile`, `giftSend`, `giftFetchPending`, `giftFetchSent`, `giftSyncOrphanedMirrors`, `lbPublishBoard`, `lbSettleClosedWeek`, `modesActivate`, `modesSyncNotifications`, `pactCreate`, `pactFetch`, `vsCreateChallenge`, `vsAcceptChallenge`, `vsFetch`. Exposed as `window.canPersistUserData`.

## Key functions
- `canPersistUserData`, `cancelPendingUserDataSave`, `loadUserData`, `showDataLoadFailure`.

## Data it touches
- [[users]] (guards writes to it and its subcollections)

## Connected to
- [[Saving And The Write Invariant]], [[saveUserData]], [[loadUserData]], [[App Boot Sequence]]

## If you change this
- A new writer that skips this check can overwrite a real account with a placeholder after a failed load, or write one account's data into another's document after a sign-out/sign-in race.

## Where in the code
- app.js — "The write invariant" block, right after the auth listener.
