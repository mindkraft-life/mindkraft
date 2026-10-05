---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Landing And Sign In Page

> [!summary] In plain words
> The first screen people see before they are logged in. It explains how to add Mindkraft to their phone and has a single "Continue with Google" button. After signing in, the app loads the person's saved data and opens.
>
> **How it connects:** If the link was opened inside Instagram, Facebook and similar apps, the [[In-App Browser Page]] appears instead. New users continue to the [[Onboarding Page]]. Installing is explained in [[PWA Install]], and what happens right after signing in is in [[App Boot Sequence]].

**In one line:** The signed-out screen (`#authContainer`) shows a platform-specific install card and a single "Continue with Google" button; sign-in uses a Firebase Google popup, and everything after that is the boot sequence.

## How it works
- Shown by the auth listener when no user is signed in (or after the 8 s auth timeout); hidden entirely if the in-app browser escape screen took over.
- `initAuthScreen()` decides whether to show the install hero (not when running standalone) and fills `#lpInstallCard` for iOS/Android/desktop.
- `handleGoogleSignIn()` → `signInWithPopup(auth, GoogleAuthProvider)` with a spinner; errors go through `getErrorMessage(code)` → `showError` / `hideError`.
- Logout (`handleLogout`, from Settings or the Profile) signs out and the listener returns here.

## Key functions
- `initAuthScreen`, `handleGoogleSignIn`, `handleLogout`, `showError`, `hideError`, `getErrorMessage`.

## Data it touches
- none directly ([[users]] is loaded after sign-in)

## Connected to
- [[App Boot Sequence]], [[PWA Install]], [[In-App Browser Page]], [[Onboarding Page]], [[Firebase Client]], [[Privacy Policy Page]], [[Terms Of Use Page]]

## If you change this
- Google is the only sign-in method; adding another provider means a new button and handler here, and an auth-domain change in the Firebase project.

## Where in the code
- index.html — `#authContainer` (`#lpInstallSection`, `#lpLoginSection`, `#googleBtn`).
- app.js — `handleGoogleSignIn`, `handleLogout`, error helpers, `initAuthScreen`.
