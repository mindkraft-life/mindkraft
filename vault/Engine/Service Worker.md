---
type: engine
sources: [sw.js, index.html, manifest.json]
last_verified: 2026-10-05
---
# Service Worker

**In one line:** sw.js pre-caches the Mindkraft app shell under a versioned cache (`mindkraft-shell-v185`), serves it cache-first with at most hourly background revalidation, never touches Firebase traffic, and receives Web Push notifications and routes taps back into the app.

## How it works
- **Install:** caches `APP_SHELL` — `./`, `index.html`, `style.css`, `app.js`, `manifest.json`, `icon-192.svg`, `privacy.html`, `terms.html` — one by one so a single 404 does not abort install; then `skipWaiting()`.
- **Activate:** deletes every `mindkraft-shell-*` cache except the current `CACHE_NAME`, then `clients.claim()`.
- **Fetch:** non-GET requests pass through; Firestore/Firebase/identity/securetoken/gstatic-firebasejs/accounts.google.com are never intercepted; Google Fonts and unpkg Phosphor are cache-first forever (URLs are versioned); everything else is cache-first with a background refresh at most once per `REVALIDATE_MS` (1 hour, judged from the cached response's `Date` header).
- **Push:** shows a notification from the payload's `title`/`body`/`tag`, keeping `data.type`, `activityId`, `modeKind`.
- **Notification click:** gift/friend → Friends tab; pact/versus/mode-without-activity → Modes page; activity reminders → that activity. If a window is open it `postMessage`s `mindkraft-gift-click`, `mindkraft-modes-click` or `mindkraft-notification-click` and focuses it; on a cold start it opens `./?tab=friends`, `./?tab=modes` or `./?reminder=<id>`.
- Registered by an inline script in index.html on `load`.

## Key functions
- sw.js event handlers for install, activate, fetch, push and notificationclick; `shouldRevalidate`.
- app.js receivers: `mkHandleReminderDeepLink`, `mkOpenActivityFromReminder`, and the `?tab=` handling in the auth handler.

## Data it touches
- none in Firestore (Cache Storage only)

## Connected to
- [[Push Delivery]], [[Reminders]], [[App Boot Sequence]], [[Icons]], [[PWA Install]], [[Web Hosting]]

## If you change this
- **Bump `CACHE_VERSION` on every meaningful deploy**, otherwise installed clients keep serving the old app.js for up to an hour per asset (and mixed old/new assets are possible).
- `APP_SHELL` is an explicit list — new top-level files the app needs offline must be added; nothing else (vault/, tests, functions) is ever cached.
- Payload `data.type` values are a contract with functions/lib/push.js `buildPayload` and the push senders in functions/index.js.

## Where in the code
- sw.js — whole file.
- index.html — service-worker registration `<script>` after `app.js`.
