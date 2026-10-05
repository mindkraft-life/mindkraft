---
type: backend
sources: [scripts/send-reminders.js, scripts/package.json, .github/workflows/deploy-reminders.yml, app.js]
last_verified: 2026-10-05
---
# Legacy Reminder Script

**In one line:** scripts/send-reminders.js is the old GitHub-Actions-cron reminder sender, replaced by the `sendDueReminders` Cloud Function; nothing in the repository runs it any more and the user fields it reads are no longer written.

## How it works
- A Node script using `firebase-admin` and `web-push` with VAPID keys from env; it builds a set of UTC "HH:MM" strings for the past hour and converts each user's `reminderTime` + `tzOffset` to UTC to decide whom to notify.
- The workflow that ran it was replaced by deploy-reminders.yml ("Replaces the old send-reminders workflow"), and app.js notes that "the old reminderTime/tzOffset fields went away with the cron that read them".
- It still ships in the repo with its own scripts/package.json.

## Key functions
- `buildTimeWindow`, `localToUTC`, `main`.

## Data it touches
- [[users]] (reads fields that no longer exist)

## Connected to
- [[sendDueReminders]], [[Reminders]], [[Deploy Pipeline]], [[Push Delivery]]

## If you change this
- Running it today would send nothing useful (no `reminderTime` fields) but would need the same service-account and VAPID secrets. It is a candidate for deletion.

## Where in the code
- scripts/send-reminders.js, scripts/package.json.
