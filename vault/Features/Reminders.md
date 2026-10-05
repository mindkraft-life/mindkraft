---
type: feature
sources: [app.js, functions/index.js, sw.js, index.html]
last_verified: 2026-10-05
---
# Reminders

**In one line:** Users can set one daily reminder and up to five per-activity reminders (local time, in their own timezone) in Settings; they are stored as documents in `users/{uid}/reminders`, scheduled and sent as Web Push by Cloud Functions, and tapping one opens the app on that activity.

## How it works
- **Daily reminder:** `saveReminder()` asks for notification permission (`Notification.requestPermission`), subscribes to push (`subscribeToPush`), keeps a localStorage fallback (`reminderTime`) and writes the `general` doc (`writeGeneralReminder`; update-not-overwrite so the server's `nextSendAt` survives). `clearReminder` → `deactivateGeneralReminder`.
- **Activity reminders:** `openActivityReminderModal` → pick activity (`renderActivityReminderPicker`) and time → `saveActivityReminder`: new ones via the [[createActivityReminder]] callable (cap and duplicate checks), edits via `updateDoc`; `toggleActivityReminder`, `deleteActivityReminder`; list in `renderActivityReminders` (`window._activityReminders`).
- **Timezone:** `mkDetectTimezone` / `syncUserTimezone` keep `users/{uid}.timezone` and each reminder's `timezone` current (IANA names only).
- **Delivery:** [[onReminderWrite]] computes `nextSendAt`; [[sendDueReminders]] sends; the service worker shows it and deep-links (`mkHandleReminderDeepLink`, `mkOpenActivityFromReminder` → switches to Activities and highlights the card).
- **Fallback:** `scheduleReminder()` runs a once-a-minute in-tab check only when there is no push subscription.
- Mode reminders (Habit) share the same collection ([[Habit Mode]]).

## Key functions
- `saveReminder`, `clearReminder`, `toggleReminder`, `scheduleReminder`, `subscribeToPush`, `ensureNotificationPermission`, `writeGeneralReminder`, `deactivateGeneralReminder`, `loadRemindersFromFirestore`, `refreshReminderState`, `reloadRemindersUI`, `renderActivityReminders`, `openActivityReminderModal`, `saveActivityReminder`, `toggleActivityReminder`, `deleteActivityReminder`, `reminderErrorMessage`, `mkDetectTimezone`, `syncUserTimezone`, `mkHandleReminderDeepLink`, `mkOpenActivityFromReminder`.

## Data it touches
- [[reminders]], [[users]] (`pushSubscription`, `timezone`)

## Connected to
- [[Settings Page]], [[sendDueReminders]], [[onReminderWrite]], [[createActivityReminder]], [[Push Delivery]], [[Service Worker]], [[Reminder Scheduling]], [[Habit Mode]], [[Legacy Reminder Script]]

## If you change this
- Client and server both define the five-reminder cap; keep them equal.
- Only one push subscription per account is stored, so reminders go to the most recently subscribed device.

## Where in the code
- app.js — push/subscribe helpers and `saveReminder` (after the tutorial), "REMINDERS v2" section (before FRIENDS FEATURE).
- index.html — Settings "Daily Reminder" card, `#activityReminderModal`.
