---
type: code
sources: [app.js]
last_verified: 2026-10-05
---
# escapeHtml

> [!summary] In plain words
> Cleans any text people typed (names, titles) before it is shown on screen, so it cannot break or hijack the page.
>
> **How it connects:** Explained in [[Rendering And Window Globals]].

**In one line:** `escapeHtml(text)` escapes `& < > " '` for safe insertion into HTML strings, returning `''` for null/undefined — used about 200 times wherever user or friend text (activity names, quest titles, friend names, challenge names) is built into `innerHTML`.

## How it works
- Fast path: if no special character is present, returns the string unchanged; otherwise replaces via `_escReplacer`.
- Feature aliases: `gritEsc`, `giftEsc`, `modeEsc` (→ `giftEsc`), `prAttr` (quest attributes).

## Key functions
- `escapeHtml`, `_escReplacer`, `gritEsc`, `giftEsc`, `modeEsc`, `prAttr`.

## Data it touches
- none

## Connected to
- [[Rendering And Window Globals]], [[Friends]], [[Versus Challenges]], [[Social Gifting]], [[Pact Mode]], [[Quests]]

## If you change this
- Values placed inside `onclick="…('…')"` attribute strings also need quote-safe ids; activity ids are numeric/alphanumeric strings today.

## Where in the code
- app.js — Categories renderers block (after `renderActivities`).
