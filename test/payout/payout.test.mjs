// ══════════════════════════════════════════════════════════════════════════
// The Grit payout redesign, asserted against the real app.js in headless
// Chromium with a stubbed Firestore.
//
//     node test/payout/payout.test.mjs
//
// Nine sections of one living spec, each with its own block below. The thread
// running through them: a payout, a cap or a window means one thing, and every
// surface that reads it agrees.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { build, serve } from '../social/harness.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8776;
const dir = build(fs.readFileSync(path.join(here, 'hooks.js'), 'utf8'));
const server = await serve(dir, PORT);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
const errs = [];
page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
// Default: accept. Individual blocks below install their own handler when the
// point of the test is what the prompt says, or that refusing spends nothing.
page.on('dialog', d => d.accept());
await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load', timeout: 45000 });
await page.waitForTimeout(1000);

const out = await page.evaluate(async () => {
    const log = [];
    const ok = (n, c, x) => log.push((c ? 'PASS ' : 'FAIL ') + n + (x !== undefined ? '  ' + JSON.stringify(x) : ''));

    const ME = 'uidMe';
    const act = (id, n, extra) => Object.assign({
        id, name: n, baseXP: 10, frequency: 'daily', completionHistory: [],
        completionCount: 0, streak: 0, bestStreak: 0, totalXP: 0,
        createdAt: new Date(Date.now() - 200 * 86400000).toISOString()
    }, extra || {});

    function boot(opts) {
        opts = opts || {};
        window.__store.clear();
        window.__fail.clear();
        window.__writes.length = 0;
        window.currentUser = { uid: ME, displayName: 'Mira', photoURL: null };
        window.userData = {
            level: 12, currentXP: 0, totalXP: 0, friends: [],
            friendCode: 'MK-AAAA', profile: { username: 'Mira' },
            leaderboardHidden: [], rewards: {}, settings: {},
            projects: opts.projects || [],
            xpTodayGhost: opts.ghost || {},
            grit: {
                schemaVersion: 1, balance: opts.balance || 0,
                lifetimeEarned: opts.balance || 0, lifetimeSpent: 0,
                shieldPool: opts.pool || 0, week: null, awarded: {},
                boostPurchases: [], cadence: {}, pendingBoost: null
            },
            dimensions: [{ id: 'd1', name: 'Body', dimTotalXP: 0, paths: [
                { id: 'p1', name: 'Fit', activities: opts.activities || [act('a1', 'Run')] }
            ] }]
        };
        window._dataOwnerUid = ME;
        window._dataLoadFailed = false;
        window.__store.set('users/' + ME, JSON.parse(JSON.stringify(window.userData)));
        window.__pr.ensureWeek();
    }

    const G = () => window.userData.grit;
    const P = window.__pr;
    const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
                     '-' + String(d.getDate()).padStart(2, '0');
    const dayOffset = n => ymd(new Date(Date.now() - n * 86400000));

    // ══ §1 — the absolute curve ═══════════════════════════════════════════
    boot({});

    const anchors = P.absAnchors();
    ok('§1 the curve carries exactly the seven confirmed anchors',
        JSON.stringify(anchors) ===
        JSON.stringify([[0,0],[10,6],[20,16],[35,32],[50,50],[65,68],[85,80]]), anchors);

    let anchorsHit = anchors.every(p => P.absCurve(p[0]) === p[1]);
    ok('§1 every anchor pays exactly its listed Grit', anchorsHit,
       anchors.map(p => [p[0], P.absCurve(p[0])]));

    // Between anchors: linear, not stepped. 15 sits halfway between 10 and 20,
    // so it pays halfway between 6 and 16.
    ok('§1 15 completions interpolate to 11, not to 6',
        P.absCurve(15) === 11, P.absCurve(15));
    // 27 is 7/15 of the way from 20 to 35, so 16 + 7/15×16 = 23.47 → 23.
    ok('§1 27 interpolates between 20 and 35', P.absCurve(27) === 23, P.absCurve(27));
    // 57 is 7/15 of the way from 50 to 65, so 50 + 7/15×18 = 58.4 → 58.
    ok('§1 57 interpolates between 50 and 65', P.absCurve(57) === 58, P.absCurve(57));

    // Monotonic, and never stepped: every extra completion is worth >= 0 and
    // the run from 0 to 85 climbs without ever going backwards.
    let mono = true, stepped = 0;
    for (let n = 1; n <= 120; n++) {
        if (P.absCurve(n) < P.absCurve(n - 1)) mono = false;
        if (P.absCurve(n) === P.absCurve(n - 1)) stepped++;
    }
    ok('§1 the curve never goes backwards', mono);
    ok('§1 and is not a staircase — most steps actually move', stepped < 60, stepped);

    // The flattening the spec asks for, stated as the spec states it.
    const d20to35 = P.absCurve(35) - P.absCurve(20);
    const d65to85 = P.absCurve(85) - P.absCurve(65);
    ok('§1 20→35 is worth more than 65→85 — the curve flattens',
        d20to35 > d65to85, { d20to35, d65to85 });

    ok('§1 past the last anchor the curve is flat, never negative',
        P.absCurve(200) === 80 && P.absCurve(86) === 80, [P.absCurve(86), P.absCurve(200)]);
    ok('§1 zero completions pay zero', P.absCurve(0) === 0);
    ok('§1 and a nonsense negative count cannot pay', P.absCurve(-5) === 0, P.absCurve(-5));

    // ══ §1 — the two bonuses are added, and only the sum is exposed ═══════
    boot({});
    // A quota of 7 (one daily activity, live) with 7 completions = ratio 1.00.
    const A1 = () => window.userData.dimensions[0].paths[0].activities[0];
    A1().completionHistory.push({ date: new Date(Date.now() - 86400000).toISOString(), xp: 10 });
    G().week = null;
    P.ensureWeek();
    const quota = P.week().quota;
    ok('§1 a single daily activity sets a quota of 7', quota === 7, quota);

    for (let i = 0; i < 7; i++) {
        G().week.completions++;
        G().week.dayTally[dayOffset(i % 7) + '|a1'] = 1;
    }
    const ratioOnly = P.ratioCurve(1.0);
    const absOnly   = P.absCurve(7);
    ok('§1 the ratio half alone would pay 75', ratioOnly === 75, ratioOnly);
    ok('§1 the absolute half alone would pay 4', absOnly === 4, absOnly);
    ok('§1 the week pays the two added together, not either one',
        P.payout() === ratioOnly + absOnly, P.payout());
    ok('§1 and the projection the UI reads is that same single number',
        P.projected() === P.payout(), [P.projected(), P.payout()]);

    // No quota at all still earns the absolute half — it has no denominator
    // to be missing.
    boot({ activities: [act('a1', 'Read', { frequency: 'occasional' })] });
    G().week.completions = 12;
    for (let i = 0; i < 12; i++) G().week.dayTally['2026-0' + (i % 9 + 1) + '-01|a' + i] = 1;
    ok('§1 an occasional-only week has no ratio at all', P.week().quota === 0, P.week().quota);
    ok('§1 but still pays the absolute bonus',
        P.payout() === P.absCurve(12) && P.payout() > 0, P.payout());

    // ══ §2 — one completion per activity per day, for the absolute bonus ══
    // allowMultiplePerDay is what makes logging the same thing five times in
    // a day possible at all — which is exactly the padding §2 is about.
    boot({ activities: [act('a1', 'Run', { allowMultiplePerDay: true })] });
    const today = () => dayOffset(0);
    for (let i = 0; i < 5; i++) await window.completeActivity(0, 0, 0);

    ok('§2 five same-day completions all count for the ratio numerator',
        G().week.completions === 5, G().week.completions);
    ok('§2 but count as one toward the absolute bonus',
        P.absCompletions() === 1, P.absCompletions());
    ok('§2 the tally keeps the real count, so removals can be tracked',
        P.dayTally()[today() + '|a1'] === 5, P.dayTally());
    ok('§2 and the activity\'s own history still holds all five',
        A1().completionHistory.filter(e => !e.isPenalty).length === 5,
        A1().completionHistory.length);

    // Removing one of five leaves the day still counted — the cap is a cap,
    // not a flag that the first delete clears.
    await window.undoActivity(0, 0, 0);
    ok('§2 removing one of five leaves the day counted once',
        P.absCompletions() === 1, { abs: P.absCompletions(), tally: P.dayTally() });
    ok('§2 while the ratio numerator drops by exactly one',
        G().week.completions === 4, G().week.completions);

    // Removing the last one takes the day out entirely.
    for (let i = 0; i < 4; i++) await window.undoActivity(0, 0, 0);
    ok('§2 removing the last one drops the day from the tally',
        P.absCompletions() === 0 && Object.keys(P.dayTally()).length === 0,
        { abs: P.absCompletions(), tally: P.dayTally() });

    // Two different activities on the same day are two completions — the cap
    // is per activity per day, not per day.
    boot({ activities: [act('a1', 'Run', { allowMultiplePerDay: true }),
                        act('a2', 'Read', { allowMultiplePerDay: true })] });
    await window.completeActivity(0, 0, 0);
    await window.completeActivity(0, 0, 1);
    await window.completeActivity(0, 0, 1);
    ok('§2 two different activities on one day count as two',
        P.absCompletions() === 2, { abs: P.absCompletions(), tally: P.dayTally() });

    // The same activity on two days is two completions. Driven through the
    // numerator directly so the assertion does not depend on which weekday the
    // suite happens to run on.
    boot({});
    P.bump('a1', +1, '2026-03-02');
    P.bump('a1', +1, '2026-03-03');
    ok('§2 the same activity on two days counts as two',
        P.absCompletions() === 2, { abs: P.absCompletions(), tally: P.dayTally() });
    P.bump('a1', +1, '2026-03-03');
    ok('§2 a third log on the second day changes nothing',
        P.absCompletions() === 2, { abs: P.absCompletions(), tally: P.dayTally() });

    // A backdated completion is keyed to the day it was backdated TO — not to
    // the day the edit was made, which would let one day pad another.
    boot({});
    A1().completionHistory.push({ date: new Date(Date.now() - 86400000).toISOString(), xp: 10 });
    G().week = null; P.ensureWeek();
    await window.completeActivity(0, 0, 0);
    const yday = dayOffset(1);
    await window.retroactiveComplete('a1', yday);
    const backdatedInWeek = yday >= P.anchor();
    ok('§2 a backdated completion is keyed to the day it names',
        backdatedInWeek
            ? P.dayTally()[yday + '|a1'] === 1 && P.absCompletions() === 2
            : !(yday + '|a1' in P.dayTally()) && P.absCompletions() === 1,
        { anchor: P.anchor(), yday, tally: P.dayTally() });

    // Every frequency is treated alike: no special-casing by cadence.
    boot({ activities: [
        act('a1', 'Daily',    { frequency: 'daily',    allowMultiplePerDay: true }),
        act('a2', 'Weekly',   { frequency: 'weekly',   allowMultiplePerDay: true }),
        act('a3', 'Biweekly', { frequency: 'biweekly', allowMultiplePerDay: true }),
        act('a4', 'Monthly',  { frequency: 'monthly',  allowMultiplePerDay: true }),
        act('a5', 'Occ',      { frequency: 'occasional' })
    ] });
    for (let i = 0; i < 5; i++) {
        await window.completeActivity(0, 0, i);
        await window.completeActivity(0, 0, i);
        await window.completeActivity(0, 0, i);
    }
    ok('§2 the day cap applies to every frequency alike — no special cases',
        P.absCompletions() === 5, { abs: P.absCompletions(), tally: P.dayTally() });
    ok('§2 and the ratio numerator still counted every repeat',
        G().week.completions > 5, G().week.completions);

    // ══ §1 — the closed week pays the sum, once ═════════════════════
    boot({ balance: 500 });
    A1().completionHistory.push({ date: new Date(Date.now() - 86400000).toISOString(), xp: 10 });
    G().week = null;
    P.ensureWeek();
    // Fill last week: at target on the ratio, twelve days' worth of effort on
    // the absolute half, then back-date the anchor so a boundary has passed.
    G().week.completions = 7;
    for (let i = 0; i < 12; i++) G().week.dayTally['2026-0' + (i % 9 + 1) + '-01|a' + i] = 1;
    const owed = P.payout();
    const oldAnchor = ymd(new Date(new Date(P.anchor() + 'T12:00:00').getTime() - 7 * 86400000));
    G().week.anchor = oldAnchor;
    P.ensureWeek();
    ok('§1 closing the week credits the combined bonus, not just the ratio half',
        G().balance === 500 + owed && owed > P.ratioCurve(1.0),
        { balance: G().balance, owed, ratioOnly: P.ratioCurve(1.0) });
    ok('§1 the closed week records both halves for the ledger',
        G().lastClosedWeek.absCompletions === 12 && G().lastClosedWeek.payout === owed,
        G().lastClosedWeek);
    ok('§1 and a second rollover pass cannot pay it twice',
        (P.ensureWeek(), G().balance === 500 + owed), G().balance);
    ok('§1 the new week starts with an empty day tally',
        Object.keys(P.dayTally()).length === 0, P.dayTally());

    // ══ §3 — a retroactive completion moves a quest, and undoing it moves
    //         it back ════════════════════════════════════════════════════
    const questWith = (reqCount, doneCount) => ([{
        id: 'q1', name: 'Marathon', status: 'active', currentCycle: 1,
        cadence: { type: 'oneoff' }, createdAt: new Date().toISOString(),
        groups: [{ id: 'g1', kind: 'group', name: 'Base', children: [
            { id: 'l1', kind: 'leaf', type: 'activity', name: 'Run',
              linkedActivityId: 'a1', requiredCount: reqCount,
              completedCount: doneCount || 0 }
        ] }]
    }]);
    const leafCount = () => window.userData.projects[0].groups[0].children[0].completedCount;

    boot({ projects: questWith(5, 0) });
    await window.completeActivity(0, 0, 0);
    const liveCount = leafCount();
    ok('§3 a live completion moves the linked quest leaf', liveCount === 1, liveCount);

    boot({ projects: questWith(5, 0) });
    const backDay = dayOffset(2);
    await window.retroactiveComplete('a1', backDay);
    ok('§3 a retroactive completion moves it too — the whole point of the fix',
        leafCount() === 1, leafCount());

    // …and the decrement half, through the history editor's delete.
    const entryTs = A1().completionHistory[A1().completionHistory.length - 1].date;
    await window.retroactiveDelete('a1', entryTs);
    ok('§3 deleting that retroactive completion decrements it again',
        leafCount() === 0, leafCount());

    // Never past requiredCount, exactly as the live path guards.
    boot({ projects: questWith(1, 1) });
    await window.retroactiveComplete('a1', dayOffset(2));
    ok('§3 a leaf already at its required count is not pushed past it',
        leafCount() === 1, leafCount());

    // A penalty row is not a completion, so removing one must not decrement.
    boot({ projects: questWith(5, 3) });
    const penTs = new Date(Date.now() - 2 * 86400000).toISOString();
    A1().completionHistory.push({ date: penTs, xp: -10, isPenalty: true });
    await window.retroactiveDelete('a1', penTs);
    ok('§3 deleting a penalty row leaves quest progress alone',
        leafCount() === 3, leafCount());

    // ══ §4 — the cap is on shields HELD, not on the lifetime total ═══════
    const withShields = (n, consumed) => {
        const evs = [];
        for (let i = 0; i < n; i++) evs.push({ type: 'shield_applied', id: 'sa' + i, at: dayOffset(30) });
        return [act('a1', 'Run', {
            shieldEvents: evs, streak: 5, shieldsConsumed: consumed || 0,
            lastCompleted: new Date().toISOString()
        })];
    };

    boot({ activities: withShields(0, 0), pool: 3 });
    let sh = P.shields('a1');
    ok('§4 a fresh activity holds the base three',
        sh.held === 3 && sh.floor === 3, sh);

    // Seven applied, none consumed: genuinely full, and refused.
    boot({ activities: withShields(7, 0), pool: 3 });
    sh = P.shields('a1');
    ok('§4 seven applied with nothing consumed is 10 held — the real cap',
        sh.held === 10, sh);
    let res = await P.applyShield('a1');
    ok('§4 and applying another is refused', res.ok === false, res.message);
    ok('§4 the refusal talks about what is held, not about a lifetime total',
        /holding/.test(res.message || ''), res.message);
    ok('§4 and nothing was spent from the pool', G().shieldPool === 3, G().shieldPool);

    // The case the spec is about: the same seven, now spent.
    boot({ activities: withShields(7, 7), pool: 3 });
    sh = P.shields('a1');
    ok('§4 seven applied and seven consumed leaves only three in hand',
        sh.held === 3, sh);
    res = await P.applyShield('a1');
    ok('§4 so another shield is allowed — the cap is not a lifetime ceiling',
        res.ok === true, res.message || res);
    sh = P.shields('a1');
    ok('§4 and it actually lands: four in hand, not three',
        sh.held === 4, sh);
    ok('§4 the pool paid for it exactly once', G().shieldPool === 2, G().shieldPool);
    ok('§4 the success reports shields held, not raw capacity',
        res.cap === 4, res.cap);

    // Far past any lifetime ceiling: 20 earned, 18 spent, still has room.
    boot({ activities: withShields(20, 18), pool: 5 });
    sh = P.shields('a1');
    ok('§4 twenty applied and eighteen spent still holds only five',
        sh.held === 5, sh);
    res = await P.applyShield('a1');
    ok('§4 and can still earn more, indefinitely, for the life of the activity',
        res.ok === true && P.shields('a1').held === 6, P.shields('a1'));

    // Held never exceeds ten, from any direction.
    let overCap = null;
    for (const [applied, consumed] of [[0,0],[3,0],[7,0],[7,3],[12,0],[12,5],[30,25],[30,0]]) {
        boot({ activities: withShields(applied, consumed), pool: 0 });
        const h = P.shields('a1');
        if (h.held > 10 || h.left > 10) overCap = { applied, consumed, h };
    }
    ok('§4 whatever the history, shields held never exceed ten', overCap === null, overCap);

    // A retroactive recompute must not quietly delete an applied shield.
    boot({ activities: withShields(7, 0), pool: 0 });
    A1().completionHistory.push({ date: new Date(Date.now() - 86400000).toISOString(), xp: 10 });
    A1().completionHistory.push({ date: new Date().toISOString(), xp: 10 });
    P.recomputeStreak('a1');
    ok('§4 a recompute still credits every applied shield',
        P.shields('a1').held === 10, P.shields('a1'));

    // ══ §5 — the shield-apply tap asks first ═════════════════════════════
    boot({ activities: withShields(0, 0), pool: 2 });
    window.__prompts = [];
    const realConfirm = window.confirm;

    // Refused: nothing moves.
    window.confirm = function (msg) { window.__prompts.push(msg); return false; };
    await P.pickerTap('a1');
    ok('§5 tapping an activity asks before anything happens',
        window.__prompts.length === 1, window.__prompts);
    ok('§5 in the words the spec specifies',
        window.__prompts[0] === 'Are you sure you want to add one shield to this activity?',
        window.__prompts[0]);
    ok('§5 saying no spends nothing from the pool',
        G().shieldPool === 2, G().shieldPool);
    ok('§5 and applies no shield', P.shields('a1').held === 3, P.shields('a1'));

    // Confirmed: it goes through.
    window.confirm = function (msg) { window.__prompts.push(msg); return true; };
    await P.pickerTap('a1');
    ok('§5 saying yes spends exactly one shield',
        G().shieldPool === 1, G().shieldPool);
    ok('§5 and applies exactly one', P.shields('a1').held === 4, P.shields('a1'));
    window.confirm = realConfirm;

    // ══ §6 — mode XP reaches the weekly figures ══════════════════════════
    // Mode bonuses live in xpTodayGhost, attached to no completionHistory row,
    // so every window that walks history used to miss them entirely.
    const monday = P.leaderboardWeekStart();

    // One ghost entry on the week's own Monday, one far outside it. Keyed on
    // the anchor rather than on "today" so the two can never collide into one
    // entry on a Monday run.
    boot({ ghost: { [monday]: 200, '2026-01-05': 999 } });
    A1().completionHistory.push({ date: new Date().toISOString(), xp: 10 });
    const weekly = P.weeklyXP();
    ok('§6 computeWeeklyXP counts mode XP earned inside the week, and only that',
        weekly === 210, { weekly, monday, today: dayOffset(0) });

    // A ghost entry from before the week must not leak in.
    boot({ ghost: { '2026-01-05': 999, [monday]: 40 } });
    ok('§6 and only what falls inside it — older mode XP stays out',
        P.weeklyXP() === 40, P.weeklyXP());

    // The Analytics tile: unfiltered only.
    boot({ ghost: { [monday]: 60 } });
    window.analyticsState.view = 'all';
    const unfiltered = P.weeklyFromActs();
    window.analyticsState.view = 'dimension';
    const filtered = P.weeklyFromActs();
    window.analyticsState.view = 'all';
    ok('§6 the unfiltered "This Week" tile counts mode XP',
        unfiltered === 60, unfiltered);
    ok('§6 a dimension-filtered view does not — it belongs to no dimension',
        filtered === 0, filtered);

    // XP/hour reads yesterday, and only yesterday.
    boot({ ghost: { [dayOffset(1)]: 120, [dayOffset(0)]: 600, [dayOffset(2)]: 600 } });
    ok('§6 computeXPPerHour picks up yesterday\'s mode XP',
        P.xpPerHour() === 10, P.xpPerHour());

    // Berserk's own baselines.
    boot({ ghost: { [dayOffset(1)]: 240, [dayOffset(40)]: 999 } });
    const map = P.dailyMap(7);
    ok('§6 modeDailyXPMap folds mode XP into the day it was earned',
        map[dayOffset(1)] === 240, map);
    ok('§6 and leaves days outside the window alone',
        !(dayOffset(40) in map), Object.keys(map));
    ok('§6 so modeAvgPerHour sees it too',
        Math.abs(P.avgPerHour(7) - (240 / 7 / 12)) < 1e-9, P.avgPerHour(7));

    // None of the above can read anything if the bucket is pruned at midnight.
    ok('§6 the ghost bucket is kept long enough for the widest window to read it',
        P.ghostRetention() >= 28, P.ghostRetention());
    boot({ ghost: { [dayOffset(1)]: 30, [dayOffset(20)]: 40, [dayOffset(400)]: 50 } });
    P.dashboardTick();
    const kept = Object.keys(window.userData.xpTodayGhost);
    ok('§6 yesterday survives the prune that used to delete it',
        kept.indexOf(dayOffset(1)) !== -1, kept);
    ok('§6 and so does a day three weeks back', kept.indexOf(dayOffset(20)) !== -1, kept);
    ok('§6 while genuinely ancient entries are still cleared',
        kept.indexOf(dayOffset(400)) === -1, kept);

    // ══ §7 — mode and quest XP show up in Activity History ═══════════════
    boot({});
    A1().completionHistory.push({ date: new Date().toISOString(), xp: 10 });
    P.logModeXP('Berserk Mode', 250, new Date().toISOString());
    P.logModeXP('Focus Window', 180, new Date().toISOString());
    let rows = P.historyRows();
    const named = (n) => rows.filter(r => r.name === n);

    ok('§7 a resolved Berserk shows up in Activity History',
        named('Berserk Mode').length === 1, rows);
    ok('§7 carrying its XP', named('Berserk Mode')[0].xp === '+250 XP', named('Berserk Mode'));
    ok('§7 a closed Focus Window shows up too',
        named('Focus Window').length === 1 && named('Focus Window')[0].xp === '+180 XP',
        named('Focus Window'));
    ok('§7 neither offers a delete button — there is nothing to delete',
        named('Berserk Mode')[0].hasDelete === false &&
        named('Focus Window')[0].hasDelete === false, rows);
    ok('§7 and neither carries an activity tag',
        named('Berserk Mode')[0].tags.length === 0 &&
        named('Focus Window')[0].tags.length === 0, rows);
    ok('§7 the real completion beside them is untouched',
        rows.filter(r => r.name === 'Run').length === 1, rows);

    // And a past completion still carries the delete button the merged rows
    // deliberately lack — the new rows changed nothing about the old ones.
    boot({});
    A1().completionHistory.push({ date: new Date(Date.now() - 2 * 86400000).toISOString(), xp: 10 });
    P.logModeXP('Berserk Mode', 250, new Date(Date.now() - 2 * 86400000).toISOString());
    rows = P.historyRows();
    ok('§7 an editable past completion keeps its delete button',
        rows.filter(r => r.name === 'Run' && r.hasDelete).length === 1, rows);
    ok('§7 while the mode row beside it, on the same day, has none',
        rows.filter(r => r.name === 'Berserk Mode' && !r.hasDelete).length === 1, rows);

    // A lost Berserk is logged the same way — signed, and not mistaken for a
    // negative habit.
    boot({});
    P.logModeXP('Berserk Mode', -140, new Date().toISOString());
    rows = P.historyRows();
    ok('§7 a lost Berserk is logged with its real signed delta',
        rows.length === 1 && rows[0].xp === '-140 XP', rows);
    ok('§7 and is never tagged as a negative habit',
        rows[0].tags.length === 0, rows);

    // Quest cycle bonuses need no new store — cycleHistory already has them.
    boot({ projects: [{
        id: 'q1', name: 'Marathon', status: 'active', currentCycle: 2,
        cadence: { type: 'recurring' }, groups: [],
        cycleHistory: [
            { cycleNumber: 1, completedAt: new Date().toISOString(), bonusXp: 90, bonusGrit: 5 },
            { cycleNumber: 2, completedAt: new Date().toISOString(), bonusXp: 0 }
        ]
    }] });
    rows = P.historyRows();
    ok('§7 a sealed quest cycle shows up, labelled with the quest name',
        rows.length === 1 && rows[0].name === 'Quest: Marathon', rows);
    ok('§7 carrying its bonus XP', rows[0].xp === '+90 XP', rows);
    ok('§7 with no delete button', rows[0].hasDelete === false, rows);
    ok('§7 and a cycle that paid no bonus adds no row',
        rows.filter(r => r.xp === '+0 XP').length === 0, rows);

    // Nothing is backfilled: a mode that resolved before this shipped left no
    // XP figure anywhere, so it stays out rather than being guessed at.
    boot({});
    window.userData.modes = { schemaVersion: 1, active: null, pending: [], history: [
        { id: 'm1', kind: 'berserk', outcome: 'completed',
          startedAt: new Date().toISOString(), endedAt: new Date().toISOString(),
          summary: 'Cleared 400 XP in 3h' }
    ], suspendedHabit: null, streakOffsets: {} };
    ok('§7 an old mode-history record is not backfilled into the list',
        (P.historyRows() || []).length === 0, P.historyRows());

    // ══ §8 — Analytics' week starts on Monday ════════════════════════════
    boot({});
    ok('§8 the Analytics week and the leaderboard week are the same day',
        P.analyticsWeekStart() === P.leaderboardWeekStart(),
        { analytics: P.analyticsWeekStart(), leaderboard: P.leaderboardWeekStart() });
    ok('§8 and that day is a Monday',
        new Date(P.analyticsWeekStart() + 'T12:00:00').getDay() === 1,
        P.analyticsWeekStart());
    ok('§8 it also matches the Grit week anchor',
        P.analyticsWeekStart() === P.anchor(), [P.analyticsWeekStart(), P.anchor()]);

    // ══ §9 — weekly and biweekly cycles start on Monday ══════════════════
    boot({ activities: [
        act('a1', 'Weekly',   { frequency: 'weekly' }),
        act('a2', 'Biweekly', { frequency: 'biweekly' })
    ] });

    // Sunday 20 Sep 2026 and Monday 21 Sep 2026 must land in different weeks.
    const sun = P.cycleStart('a1', '2026-09-20T12:00:00');
    const mon = P.cycleStart('a1', '2026-09-21T12:00:00');
    ok('§9 a weekly window starts on the Monday', mon === '2026-09-21', mon);
    ok('§9 and the Sunday before belongs to the week before it',
        sun === '2026-09-14', sun);
    ok('§9 the two are genuinely different windows', sun !== mon, [sun, mon]);
    ok('§9 every day Mon–Sun maps to that same Monday',
        ['2026-09-21','2026-09-22','2026-09-23','2026-09-24','2026-09-25','2026-09-26','2026-09-27']
            .every(d => P.cycleStart('a1', d + 'T12:00:00') === '2026-09-21'),
        ['2026-09-21','2026-09-27'].map(d => P.cycleStart('a1', d + 'T12:00:00')));
    ok('§9 and the next weekly window is the Monday after',
        P.nextCycleStart('a1', '2026-09-23T12:00:00') === '2026-09-28',
        P.nextCycleStart('a1', '2026-09-23T12:00:00'));

    ok('§9 the biweekly anchor is a Monday',
        new Date(P.biweeklyAnchor()).getDay() === 1, P.biweeklyAnchor());
    const bi = P.cycleStart('a2', '2026-09-23T12:00:00');
    ok('§9 a biweekly window also starts on a Monday',
        new Date(bi + 'T12:00:00').getDay() === 1, bi);
    ok('§9 and runs exactly fourteen days',
        (new Date(P.nextCycleStart('a2', '2026-09-23T12:00:00') + 'T12:00:00') -
         new Date(bi + 'T12:00:00')) === 14 * 86400000,
        [bi, P.nextCycleStart('a2', '2026-09-23T12:00:00')]);

    // isCompletedToday carries the anchor separately, so it moved too. A
    // completion logged last Sunday must NOT count for a week that began on
    // the Monday after it.
    const lastSunday = (() => {
        const d = new Date(P.anchor() + 'T12:00:00');
        d.setDate(d.getDate() - 1);
        return d;
    })();
    boot({ activities: [act('a1', 'Weekly', {
        frequency: 'weekly', lastCompleted: lastSunday.toISOString()
    })] });
    ok('§9 isCompletedToday agrees: the Sunday before the anchor is last week',
        P.completedToday('a1') === false, {
            anchor: P.anchor(), lastCompleted: ymd(lastSunday)
        });
    boot({ activities: [act('a1', 'Weekly', {
        frequency: 'weekly', lastCompleted: new Date(P.anchor() + 'T12:00:00').toISOString()
    })] });
    ok('§9 while the Monday itself is this week',
        P.completedToday('a1') === true, P.anchor());

    return log;
});

await browser.close();
server.close();

out.forEach(l => console.log(l));
errs.forEach(e => console.log(e));
const failed = out.filter(l => l.startsWith('FAIL')).length;
console.log(`\n${out.length - failed} passed, ${failed} failed` + (errs.length ? `, ${errs.length} page errors` : ''));
process.exit(failed || errs.length ? 1 : 0);
