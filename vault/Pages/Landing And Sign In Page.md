---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# Landing And Sign In Page

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
