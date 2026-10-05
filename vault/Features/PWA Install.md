---
type: feature
sources: [app.js, index.html, manifest.json, sw.js]
last_verified: 2026-10-05
---
# PWA Install

> [!summary] In plain words
> Mindkraft can be installed on a phone's home screen like a normal app, without going through an app store. The app suggests this on the sign-in screen, with a small banner after logging in, and with step-by-step instructions in Settings.
>
> **How it connects:** Relies on the [[Service Worker]] and [[Web Hosting]], and is offered on the [[Landing And Sign In Page]] and the [[Settings Page]].

**In one line:** Mindkraft is an installable Progressive Web App (manifest + service worker) and nudges installation in three places — a platform-specific card on the landing screen, a snoozable banner after login, and step-by-step instructions with an Install button in Settings.

## How it works
- manifest.json: name "Mindkraft - Life Gamification", `start_url`/`scope` `https://mindkraft.life/`, standalone, portrait, `icon-192.svg` for both icon sizes.
- Landing: `initAuthScreen()` fills `#lpInstallCard` per platform and hides the install hero when already running standalone.
- Banner: an IIFE catches `beforeinstallprompt` into `window._mkDeferredPrompt`, shows `#pwaInstallBanner` ~3 s after login unless installed (`isInstalled`) or snoozed for 7 days (`mk_install_snoozed` in localStorage).
- Settings: `toggleInstallGuide` shows iOS/Android steps; `triggerAndroidInstall` uses a second captured prompt, `window._deferredInstallPrompt`, or reveals manual instructions.
- In-app browsers (Instagram, Facebook, …) get an escape screen instead ([[In-App Browser Page]]).

## Key functions
- `initAuthScreen`, `isSnoozed`, `snooze`, `isInstalled`, `showBanner`, `hideBanner`, `toggleInstallGuide`, `triggerAndroidInstall`.

## Data it touches
- none in Firestore (localStorage `mk_install_snoozed`)

## Connected to
- [[Landing And Sign In Page]], [[Settings Page]], [[Service Worker]], [[Web Hosting]], [[In-App Browser Page]]

## If you change this
- Two separate `beforeinstallprompt` listeners hold two references to the same one-shot event; after one surface uses it, the other's reference is spent.

## Where in the code
- app.js — "PWA Install Prompt" IIFE (before `initAuthScreen`), `toggleInstallGuide` / `triggerAndroidInstall` (Settings handlers).
- index.html — `#pwaInstallBanner`, landing `#lpInstallCard`, Settings `#installCard`; manifest.json.
