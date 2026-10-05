---
type: test
sources: [test/nav/nav.test.mjs, test/nav/README.md]
last_verified: 2026-10-05
---
# Nav Browser Test

> [!summary] In plain words
> Checks the bottom menu on a phone-sized screen: no invisible dead zones that swallow taps, readable in both light and dark themes, buttons big enough to tap, and calm when the phone asks for less motion.
>
> **How it connects:** Guards the [[Bottom Navigation]] and [[Themes]].

**In one line:** test/nav/nav.test.mjs (11 checks) loads index.html + app.js at phone size and asserts what screenshots cannot show about the bottom navigation: no dead tap zone above any of the five nav styles, theme-correct surfaces in light and dark, 24px touch targets (three documented exceptions), reduced-motion compliance, and that the retired flat nav bar stays inert.

## How it works
- No hook block needed (the nav is index.html's own script); it hides `#loading` and shows `#appContainer` by hand.
- Walks up from each nav's top edge pixel by pixel asking which element receives a tap; asserts the gradient (`.mk-nav-shield` look) and the tap-swallower heights stay deliberately different; checks the Ledger's collapsed state.

## Key functions
- Exercises `mkSetNavStyle`, `mkGo`, `mkToggleLedger`, `switchTab` (legacy bar marking).

## Data it touches
- none

## Connected to
- [[Bottom Navigation]], [[Themes]], [[Tab Switching]], [[Browser Test Harness]]

## If you change this
- Any new nav control under 24px fails unless added to the exemption list (which needs a product decision).

## Where in the code
- test/nav/nav.test.mjs.
