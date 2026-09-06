# Modes — invariant tests

Drives the real `app.js` in headless Chromium against a stubbed Firestore and
asserts the modes spec's behaviour directly, rather than through the UI.

    node test/modes/modes.test.mjs

## Harness

Reuses `test/social/harness.mjs`, which builds a throwaway copy of the app in a
temp directory with the Firebase CDN URLs remapped to local stubs. `build()`
takes an optional second block of hooks; this suite passes `hooks.js`, which is
appended to the **copy** of `app.js` and therefore sits inside the same module
scope. That is what lets the tests reach the module-private things the
invariants are actually about — the two streak passes, the offset store they
own, and the rate card — without any of it being exported into the shipped app.

Nothing in the repo's own `index.html` or `app.js` is modified.

`window.__mm.rearm()` re-arms the once-a-day guards (`lastProcessedDate` and
`modes.offsetDay`) so a test can drive several consecutive "days" inside one
page load. Nothing in the app calls it.

## What it covers

The centre of gravity is the **streak interaction**, because none of it is
visible from the UI and all of it is load-bearing.

`processStreakSystem()` is the single authoritative writer for streak and
shield state, and it **re-derives both from `completionHistory` on every
login**. Recovery and Insurance therefore cannot live inside it — they run as
additive passes on either side of the walk (`modesBeforeStreakWalk` /
`modesAfterStreakWalk`, both called from `processStreakPauses`, never from
`processStreakSystem`). The credit they grant lives in `modes.streakOffsets`,
never on the activity.

Covered there: a control case proving the walk really does break an unshielded
streak; an insured activity surviving that same history; the shields the walk
would have spent being handed back; logging still raising an insured streak;
the credit outliving the mode that granted it; and the credit being dropped
once a gap **after** the cover ended outlasts the activity's shields — the one
case where a streak has genuinely broken.

For Recovery: the ceiling read from `bestStreak` at activation rather than
stored on the activity, one bonus step per completion, no bonus at the ceiling,
never past the old peak plus one, and an undo taking the bonus back with it.

Also covered: the Berserk target's dampener (a personal best must make tomorrow
*a little* harder, not proportionally harder) and its floor on a new account;
the swing scaling with the chosen window at 10% per hour and landing on the
user's own XP ledger rather than a shadow one;
the Focus Window multiplier, its exclusion of perform-negative activities, and
windows that cross midnight; Stake's all-or-nothing payout and its forfeit;
both wagered modes actually ending when ended early; Habit's
completions-vs-days-elapsed pair, its pause/resume rule and the seven-day
expiry; the one-mode-at-a-time guard; and the rate card itself.

## Berserk's baseline and its two-condition gate

Two things about Berserk are invisible from the UI as numbers and are the whole
reason the mode was rebuilt, so both are reached directly through the hooks
rather than inferred from a target several inputs could have produced.

**The baseline window** is however far back real `completionHistory` goes,
capped at 28 days — not a flat 28. A flat 28 put a zero in the numerator for
every day the account had not existed yet and still divided by 28, so the
baseline collapsed and the floor became the binding number for *every* user,
not just new ones. Covered: a week-old account baselining on its week and
targeting its real pace rather than a diluted one, and an account with more
than 28 days of history still baselining on 28 and getting exactly the number
it got before the fix.

**The gate** is two conditions, both of which must hold: as many completions as
hours committed, and `baseXP` (not the bonused figure that lands in
`completionHistory`) past the target. Covered: one heavily bonused completion
failing to clear a three-hour target while still paying the user in full;
enough base XP failing on its own when the completions floor is short; the bar
filling at the pace of whichever half is behind; three completions clearing it
and still paying 30% of the *real* bonused XP; an undo taking both counters
back with it, because a counter that only rises makes complete-undo-complete
free progress; and a session started before the gate existed still being judged
on earned XP, since it never had the chance to fill counters it does not carry.

The setup sheet has to name both halves before the Grit is spent, and the
slider has to carry both with it — the label is built in one place for exactly
that reason, so the two copies cannot drift.

## Activating partway through a day

A mode switched on at 6pm used to start counting from zero, as if the morning
had not happened. Stake and Habit are the two modes that count completions from
activation, so they are the two that seed from `modeCompletionsOnDay`. Covered:
today's completions counting and yesterday's not, a penalty not counting as
one, a stake opening with today already on the board but never past its own
target, and a habit seeding at most one — with the day stamped, so the next
completion today cannot count the same day twice.

## The resolution card's icons

Stake's lost lines used to bake `phIcon()`'s markup into the line string, and
the card escapes every line — so the user read the raw `<i class="ph...">` tag
instead of seeing a tick or a cross. A line is now either a plain string or
`{icon, text}`, escaped apart. The test drives a real forfeit and asserts on
the card's DOM: real `<i>` elements present, no markup anywhere in its text.

## Pact Mode's two document shapes

Both sides of a Pact may name several activities, each with its own target.
Pacts made before that finish out under the shape they were agreed under — read
tolerance, not migration — so `pactItems`, `pactCount` and `pactStats` have to
give the same answer for `terms[uid] = {activityId, target}` with a bare number
counter as they do for `{items: [...]}` with a per-activity map. Getting that
wrong would silently zero a running pact, and none of it is visible from the
UI, so the seam is reached directly through the hooks.

Also covered: the per-activity cap (an over-logged item cannot carry an
under-logged one), "out of reach" judged per activity rather than on the totals
— several activities can be logged the same day, so a combined shortfall is not
an unreachable one — and the setup sheet driven for real from picking a partner
through to the document it writes, because that sheet borrows Stake Mode's
multi-select picker and had never been pointed at a Pact before.

The sheet's friend picker reads `_friendProfileCache`, which only the Friends
tab and a gift send ever filled — so on a fresh session every friend read
"Adventurer". It fetches the names itself now and re-renders, and the re-render
is guarded: the fetch can land after the user has already tapped a name, and
rebuilding then would throw them back to the step they just left. Both
directions are covered.

Three things this cannot cover, because they are server-side: the Firestore
rules (see `test/rules`), the mode-reminder copy decision (see
`functions/test/modes.test.js`) and the pact push triggers — status changes and
the two progress nudges — in `functions/index.js` and `functions/lib/pact.js`
(see `functions/test/pact.test.js`).
