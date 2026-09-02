# Grit clawback — invariant tests

Drives the real `app.js` in headless Chromium against a stubbed Firestore and
asserts the one invariant the completion drip rests on: **effort is the only
source of Grit**.

    node test/grit/clawback.test.mjs

Grit is spendable currency — shields, XP boosts, gifts — so a completion that
can be removed without giving its drip back is a mint. Before this suite
existed, `complete → undo` and `retroactively complete → retroactively delete`
both paid 1 Grit per cycle, unlimited and unthrottled.

The reversal reads `gritAwarded` off the completion-history entry itself rather
than re-deriving it from `gritIsCountable()`, which is the same idiom
`undoActivity` already uses for XP (`lastUserEntry.xp`). Two consequences the
suite pins down:

- an activity **archived between the completion and the undo** still gives its
  Grit back — re-derivation would silently reverse nothing;
- an entry written **before the field existed** carries no `gritAwarded`, so it
  is left alone rather than guessed at.

Reuses `test/social/harness.mjs`, with `hooks.js` appended for the rate card
and ledger. Nothing in the repo's own `index.html` or `app.js` is modified.
