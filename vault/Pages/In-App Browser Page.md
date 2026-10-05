---
type: page
sources: [index.html, app.js]
last_verified: 2026-10-05
---
# In-App Browser Page

**In one line:** When Mindkraft is opened inside an app's embedded browser (Instagram, Facebook, LinkedIn, TikTok, X, Snapchat, Pinterest, WeChat, KakaoTalk, Line, WhatsApp, Threads), an inline script replaces the landing page with instructions — or an automatic Android redirect to Chrome — because Google sign-in and PWA install do not work there.

## How it works
- Inline `<script>` at the top of index.html runs before app.js: skips if already standalone; matches the user agent; picks a friendly platform name; on Android tries an `intent://` URL into Chrome; on iOS shows tailored "open in Safari" steps (Apple blocks programmatic launch).
- Sets `window._mkInAppBrowser = {platform, isIOS, isAndroid}`, hides `#loading` and shows `#inAppBrowserScreen`; `initAuthScreen()` then refuses to draw the normal landing.

## Key functions
- Inline IIFE in index.html (helpers `$`, `setHTML`, `setText`); `initAuthScreen` check in app.js.

## Data it touches
- none

## Connected to
- [[Landing And Sign In Page]], [[PWA Install]], [[App Boot Sequence]]

## If you change this
- The UA regex is the whole detection; a new in-app browser needs adding there.

## Where in the code
- index.html — `#inAppBrowserScreen` and the "In-App Browser Detection & Escape" script.
