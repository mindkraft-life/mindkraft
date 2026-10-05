---
type: feature
sources: [app.js, index.html]
last_verified: 2026-10-05
---
# Backup Export Import

**In one line:** Settings › Data offers a once-a-day automatic cloud backup embedded in the user document, "Backup Now", "Restore Backup", JSON export/import of the whole account, and a double-confirmed full reset.

## How it works
- **Auto backup:** the first `saveUserData()` of each local day embeds `autoBackup: {savedAt, savedDate, data}` (a deep copy minus `autoBackup`) in the same write. `updateRestoreBackupBtn` shows the date.
- **Backup Now:** `backupNow()` clears `_backupSavedDate` and saves, forcing a fresh snapshot.
- **Restore:** `restoreAutoBackup()` re-reads the stored document for the freshest snapshot (falls back to memory offline), confirms, replaces `window.userData` with the snapshot, runs `migrateUserData`, touches the activity index, runs `processStreakPauses`, saves, reloads settings and the dashboard.
- **Export:** `exportData()` downloads `window.userData` as `levelup-backup-<date>.json`.
- **Import:** `importData(event)` parses a JSON file (must have `dimensions` or `level`), confirms, replaces `window.userData`, touches the index, starts `processStreakPauses` (not awaited), saves.
- **Reset:** `confirmResetData()` — two confirms plus typing RESET — replaces the document with a blank account that keeps only `settings`: friends, friend code, Grit, push subscription and everything else are wiped (a new friend code is generated on the next load), and the onboarding wizard shows again.

## Key functions
- `saveUserData` (backup embedding), `updateRestoreBackupBtn`, `backupNow`, `restoreAutoBackup`, `exportData`, `importData`, `confirmResetData`.

## Data it touches
- [[users]] (whole document, `autoBackup`)

## Connected to
- [[Settings Page]], [[Saving And The Write Invariant]], [[Loading And Migration]], [[Login-Time Processing]], [[Activity Index]]

## If you change this
- Import does not run `migrateUserData`, so an old export can reintroduce retired fields; restore does run it.
- Importing someone else's export replaces `friends`, `friendCode` and `pushSubscription` with theirs.
- Subcollections (reminders, ledger, gifts) and shared documents (Versus, Pacts) are not part of a backup, export or reset.
- `autoBackup` roughly doubles the user document's size.

## Where in the code
- app.js — backup helpers after `processSkipPenalty` (`updateRestoreBackupBtn` … `confirmResetData`); embedding inside `saveUserData`.
- index.html — Settings "Data" card.
