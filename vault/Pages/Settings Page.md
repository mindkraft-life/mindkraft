---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Settings Page

> [!summary] In plain words
> The control panel: how to install the app, a how-to guide, sliders for how quickly levels and streak bonuses grow, daily and per-habit reminders, the colour theme and menu style, saving, backing up and restoring your data, logging out, and links to the legal pages.
>
> **How it connects:** Reminders are covered in [[Reminders]], the theme in [[Themes]], the menu style in [[Bottom Navigation]], backups in [[Backup Export Import]], and the two sliders in [[XP And Levels]] and [[Streaks And Shields]].

**In one line:** More › Settings holds install instructions, the in-app guide, Level Scaling and Streak Bonus Scaling sliders, the daily and per-activity reminders, theme and navigation style, data tools (export, import, backup, restore, reset), the signed-in account with logout, and links to the privacy policy and terms.

## How it works
- Tab `#settingsTab`; `switchTab('settings')` → `loadSettings()` (fills sliders and previews, `loadTheme`, reminder state).
- Cards: Install Mindkraft (`toggleInstallGuide`, `triggerAndroidInstall`); How to Use (`toggleGuide`); Level Scaling (`previewLevelScaling`, `applyLevelScaling`); Streak Bonus Scaling (`previewStreakScaling`, `applyStreakScaling` → `settings.streakScaling`, 0.5–2.0, default 1.2); Daily Reminder + Activity Reminders (max 5); Theme + Navigation style (`applyThemePreset`, `saveTheme`, `mkSetNavStyle`); Data (`exportData`, `importData`, `backupNow`, `restoreAutoBackup`, `confirmResetData`); Account (`settingsEmail`, `handleLogout`); About & Legal.
- An empty `<!-- Streak Pausing -->` comment marks a removed card.

## Key functions
- `loadSettings`, `toggleInstallGuide`, `triggerAndroidInstall`, `toggleGuide`, `toggleLevelScaling`, `previewLevelScaling`, `applyLevelScaling`, `toggleStreakScaling`, `previewStreakScaling`, `applyStreakScaling`, `toggleReminder`, `saveReminder`, `clearReminder`, `openActivityReminderModal`, `saveTheme`, `mkSetNavStyle`, `exportData`, `importData`, `backupNow`, `restoreAutoBackup`, `confirmResetData`, `handleLogout`.

## Data it touches
- [[users]] (`settings`, `pushSubscription`, `timezone`, whole document for data tools), [[reminders]]

## Connected to
- [[XP And Levels]], [[Streaks And Shields]], [[Reminders]], [[Themes]], [[Bottom Navigation]], [[Backup Export Import]], [[PWA Install]], [[Landing And Sign In Page]], [[Privacy Policy Page]], [[Terms Of Use Page]], [[createActivityReminder]]

## If you change this
- Level Scaling re-derives every level from `totalXP`; Streak Scaling changes every future multiplier immediately.

## Where in the code
- index.html — `#settingsTab`, `#activityReminderModal`.
- app.js — Settings handlers (`toggleInstallGuide` … `applyLevelScaling`), Themes section, Reminders sections, backup/export functions.
