// ══════════════════════════════════════════════════════════════════════════
// Grit clawback invariants, asserted against the real app.js in headless
// Chromium with a stubbed Firestore.
//
//     node test/grit/clawback.test.mjs
//
// One invariant, from several directions: effort is the only source of Grit.
// Removing a completion — same-day undo or retroactive delete — has to give
// the drip back, or the complete/undo loop mints spendable currency for free.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { build, serve } from '../social/harness.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8773;
const dir = build(fs.readFileSync(path.join(here, 'hooks.js'), 'utf8'));
const server = await serve(dir, PORT);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
const errs = [];
page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
page.on('dialog', d => d.accept());
await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'load', timeout: 45000 });
await page.waitForTimeout(1000);

const out = await page.evaluate(async () => {
    const log = [];
    const ok = (n, c, x) => log.push((c ? 'PASS ' : 'FAIL ') + n + (x !== undefined ? '  ' + JSON.stringify(x) : ''));

    const ME = 'uidMe';
    const DRIP = window.__gc.drip();
    const act = (id, n) => ({
        id, name: n, baseXP: 10, frequency: 'daily', completionHistory: [],
        completionCount: 0, streak: 0, bestStreak: 0, totalXP: 0
    });

    function boot(balance) {
        window.__store.clear();
        window.__fail.clear();
        window.__writes.length = 0;
        window.currentUser = { uid: ME, displayName: 'Mira', photoURL: null };
        window.userData = {
            level: 12, currentXP: 0, totalXP: 0, friends: [],
            friendCode: 'MK-AAAA', profile: { username: 'Mira' },
            leaderboardHidden: [], rewards: {}, settings: {},
            grit: {
                schemaVersion: 1, balance, lifetimeEarned: balance, lifetimeSpent: 0,
                shieldPool: 0, week: null, awarded: {}, boostPurchases: [],
                cadence: {}, pendingBoost: null
            },
            dimensions: [{ id: 'd1', name: 'Body', dimTotalXP: 0, paths: [
                { id: 'p1', name: 'Fit', activities: [act('a1', 'Run')] }
            ] }]
        };
        window._dataOwnerUid = ME;
        window._dataLoadFailed = false;
        window.__store.set('users/' + ME, JSON.parse(JSON.stringify(window.userData)));
    }

    const G = () => window.userData.grit;
    const A = () => window.userData.dimensions[0].paths[0].activities[0];
    const hist = () => (A().completionHistory || []).filter(e => !e.isPenalty);
    const dayOffset = n => {
        const d = new Date(Date.now() - n * 86400000);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
               '-' + String(d.getDate()).padStart(2, '0');
    };

    // ── 1: a completion stamps what it actually paid ──────────────────────
    boot(100);
    await window.completeActivity(0, 0, 0);
    ok('the drip is granted', G().balance === 100 + DRIP, G().balance);
    ok('the amount is stamped on the entry it paid for',
        hist().length === 1 && hist()[0].gritAwarded === DRIP, hist()[0]);

    // ── 2: undo takes exactly that back ───────────────────────────────────
    await window.undoActivity(0, 0, 0);
    ok('undo returns the balance to where it started', G().balance === 100, G().balance);
    ok('the ledger records the reversal',
        window.__gc.ledgerReasons().indexOf('completion_undo') !== -1,
        window.__gc.ledgerReasons());
    ok('the reversal reads as an undo, not a raw reason',
        window.__gc.phrase('completion_undo', { activityTitle: 'Run' }) === 'Undid Run');
    ok('the entry left history with it', hist().length === 0);

    // ── 3: the loop is net zero, not a mint ───────────────────────────────
    boot(100);
    for (let i = 0; i < 5; i++) {
        await window.completeActivity(0, 0, 0);
        await window.undoActivity(0, 0, 0);
    }
    ok('five complete/undo cycles mint nothing', G().balance === 100, G().balance);
    ok('the weekly numerator is back to zero too',
        window.__gc.week().completions === 0, window.__gc.week());
    ok('the lifetime line is not inflated by the loop',
        G().lifetimeEarned === 100 && G().lifetimeSpent === 0,
        { earned: G().lifetimeEarned, spent: G().lifetimeSpent });

    // ── 3b: the path the card's buttons actually take ─────────────────────
    // completeActivity/undoActivity are reached through the *ById wrappers in
    // the real UI, and the entry has usually been through Firestore before it
    // is undone. Both are covered here because neither was, and the stamp has
    // to survive a JSON round-trip to be readable after a reload.
    boot(100);
    await window.completeActivityById('a1');
    ok('completing by id stamps the entry', hist()[0].gritAwarded === DRIP, hist()[0]);
    await window.undoActivityById('a1');
    ok('undoing by id claws the drip back', G().balance === 100, G().balance);

    boot(100);
    await window.completeActivityById('a1');
    // setDoc(ref, window.userData) is a JSON round-trip in effect.
    window.userData = JSON.parse(JSON.stringify(window.userData));
    ok('gritAwarded survives being persisted and reloaded',
        hist()[0].gritAwarded === DRIP, hist()[0]);
    await window.undoActivityById('a1');
    ok('an undo after a reload still claws the drip back', G().balance === 100, G().balance);

    // ── 4: XP reversal is untouched by any of this ────────────────────────
    boot(100);
    const xp0 = window.userData.totalXP, streak0 = A().streak;
    await window.completeActivity(0, 0, 0);
    ok('XP was awarded', window.userData.totalXP > xp0);
    await window.undoActivity(0, 0, 0);
    ok('XP is reversed exactly as before', window.userData.totalXP === xp0, window.userData.totalXP);
    ok('the streak is reversed exactly as before', A().streak === streak0, A().streak);

    // ── 5: the backdated loop closes too ──────────────────────────────────
    boot(100);
    const back = dayOffset(2);
    await window.retroactiveComplete('a1', back);
    ok('backdating pays the drip', G().balance === 100 + DRIP, G().balance);
    ok('backdating stamps the entry too',
        hist().length === 1 && hist()[0].gritAwarded === DRIP, hist()[0]);
    const inWeek = back >= window.__gc.anchor();
    ok('a backdated completion inside the week feeds the numerator',
        window.__gc.week().completions === (inWeek ? 1 : 0), window.__gc.week());
    await window.retroactiveDelete('a1', hist()[0].date);
    ok('retroactive delete claws the drip back', G().balance === 100, G().balance);
    ok('and takes the numerator back out', window.__gc.week().completions === 0, window.__gc.week());
    // The day is derived from the entry, not passed in, so a backdated removal
    // still reads differently from a same-day undo in the ledger.
    const undone = window.__t.ledger().filter(e => e.reason === 'completion_undo').pop();
    ok('a backdated removal names the day it removed',
        undone && undone.meta.backdatedTo === back, undone && undone.meta);
    ok('and phrases it as a removal, not an undo',
        window.__gc.phrase('completion_undo', { activityTitle: 'Run', backdatedTo: back })
            === 'Removed Run for ' + back);

    // ── 6: archived between completion and undo — still reversed ──────────
    // The point of reading the stamp instead of re-deriving countability:
    // gritIsCountable() is false for an archived activity, so re-deriving
    // would silently reverse nothing and leave the Grit minted.
    boot(100);
    await window.completeActivity(0, 0, 0);
    A().archived = true;
    await window.undoActivity(0, 0, 0);
    ok('an activity archived after the completion still gives its Grit back',
        G().balance === 100, G().balance);
    A().archived = false;

    // ── 7: entries written before the field existed are left alone ────────
    // We don't know what they paid. Reversing a guess is worse than skipping.
    boot(100);
    const legacyDate = new Date(Date.now() - 2 * 86400000).toISOString();
    A().completionHistory.push({ date: legacyDate, xp: 10 });   // no gritAwarded
    A().completionCount = 1;
    await window.retroactiveDelete('a1', legacyDate);
    ok('a pre-existing entry is deleted without an incorrect deduction',
        G().balance === 100, G().balance);
    ok('and without throwing', hist().length === 0);

    boot(100);
    const legacyToday = new Date().toISOString();
    A().completionHistory.push({ date: legacyToday, xp: 10 });  // no gritAwarded
    A().completionCount = 1;
    A().lastCompleted = legacyToday;
    await window.undoActivity(0, 0, 0);
    ok('a pre-existing entry can be undone without an incorrect deduction',
        G().balance === 100, G().balance);

    // ── 8: streak-milestone and mastery Grit stay marker-idempotent ───────
    // Out of scope for the clawback — they are already paid once per marker
    // and must not be reversed by an undo.
    boot(100);
    A().streak = 6;
    await window.completeActivity(0, 0, 0);
    const afterMilestone = G().balance;
    ok('crossing 7 days pays the milestone on top of the drip',
        afterMilestone === 100 + DRIP + 10, afterMilestone);
    ok('the milestone is marked awarded', window.__t.awarded('streak:a1:7'));
    await window.undoActivity(0, 0, 0);
    ok('undo reverses only the drip, never the milestone',
        G().balance === afterMilestone - DRIP, G().balance);
    ok('the milestone marker survives, so it cannot re-pay',
        window.__t.awarded('streak:a1:7'));

    return log;
});

await browser.close();
server.close();

out.forEach(l => console.log(l));
errs.forEach(e => console.log(e));
const failed = out.filter(l => l.startsWith('FAIL')).length;
console.log(`\n${out.length - failed} passed, ${failed} failed` + (errs.length ? `, ${errs.length} page errors` : ''));
process.exit(failed || errs.length ? 1 : 0);
