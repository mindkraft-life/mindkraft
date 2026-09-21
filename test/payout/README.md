# Grit payout redesign — spec tests

Drives the real `app.js` in headless Chromium against a stubbed Firestore and
asserts the nine sections of the payout-redesign spec.

    node test/payout/payout.test.mjs

Reuses `test/social/harness.mjs`, with `hooks.js` appended for the two weekly
curves, the week's day tally, the shield numbers and the mode XP ledger.
Nothing in the repo's own `index.html` or `app.js` is modified.

## What each block pins down

**§1–2 — the absolute bonus.** The weekly payout is now two curves added
together: the old ratio-against-your-own-quota curve, and a new one keyed on
raw completions that is the same yardstick for everybody. The suite asserts the
seven confirmed anchors exactly, that values between them interpolate rather
than step, and that the curve flattens (20→35 completions is worth more than
65→85). Then the part that is easy to get wrong: the two are **added**, and the
sum is the only number anything reads — `gritWeekPayout()`, the projection the
Rewards tab shows, and what a closed week actually credits.

The anti-spam cap has its own block because it is the one rule that had to NOT
leak: an activity counts at most once per calendar day **toward the absolute
bonus only**. Five completions of one activity on a Tuesday are five for the
ratio numerator, five in the activity's own history, and one for the absolute
bonus. The tally stores counts rather than flags, so deleting one of those five
leaves the day counted and deleting the fifth removes it.

**§3 — quest progress on retroactive edits.** A completion logged through the
history editor now moves a linked quest leaf exactly as a live one does, and
deleting it moves the leaf back. Two guards ride along: a leaf already at its
required count is not pushed past it, and deleting an auto-penalty row — which
never advanced a quest — does not decrement one.

**§4 — the shield cap counts what is held.** The cap of 10 was being compared
against capacity, which includes every shield ever applied, so an activity that
had earned and spent seven could never buy another. It now compares shields in
hand (capacity minus what this streak consumed). The suite drives it from both
sides: seven applied with nothing consumed is genuinely full and refused with
nothing spent; the same seven once consumed has room, and the shield that goes
in actually lands. A sweep over eight applied/consumed shapes asserts held never
exceeds ten from any direction, and a retroactive recompute is checked not to
delete an applied shield — the failure mode the capacity clamp used to cause.

**§5 — the shield-apply tap confirms first.** The picker is a scrollable list
and a mistimed touch used to spend a pooled shield with no way back. Asserted in
both directions, because only one of them is interesting: saying no must leave
the pool and the activity exactly as they were.

**§6 — mode XP reaches the weekly figures.** Berserk swings and Focus Window
bonuses hang off no completionHistory row, so every window that walks history
missed them. Four windows now read `xpTodayGhost`, each only within the range it
was already computing. The Analytics tile is the exception the spec calls out:
mode XP belongs to no dimension, so it counts toward the unfiltered total and
nothing else — otherwise the filtered views would sum to more than the whole.

The last three assertions in that block are the ones that make the rest
possible. `updateDashboard()` used to delete every ghost entry older than today,
which would have left all four windows reading an empty bucket. Retention is now
the widest window that reads it plus slack, so yesterday and three weeks back
survive while genuinely ancient entries are still cleared.

**§7 — mode and quest XP in Activity History.** One row per resolved mode, not
one per bonus. A lost Berserk is logged with its real negative delta and must
not pick up the "−habit" tag, which the row renderer would otherwise give any
negative number. None of the merged rows offer a delete button, because there is
nothing to delete — asserted next to a real past completion that still has one,
so the merge is shown not to have changed the rows that were already there.
Nothing is backfilled: `modes.history` carries no XP figure, so runs that
resolved before this shipped stay out rather than being guessed at.

**§8–9 — everything starts on Monday.** Analytics' week was the last
Sunday-anchored boundary in the app; weekly and biweekly activity cycles were
the last two Sunday-anchored windows. The biweekly anchor moved from Sunday
5 Jan 2025 to Monday 6 Jan 2025 and now lives in one constant, because the
cycle logic is genuinely duplicated: `getCycleWindowStart()` and
`isCompletedToday()` each carry their own copy, and both had to move. The suite
checks the pair agree, that a Sunday and the Monday after it land in different
weeks, and that a fortnight is still fourteen days long.
