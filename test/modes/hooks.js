// ── Modes test hooks (harness only) ───────────────────────────────────────
// Appended to the COPY of app.js the harness builds, inside the same module
// scope, so the suite can reach the things the invariants are actually about:
// the streak passes that wrap the authoritative walk, the offset store they
// own, and the rate card. None of it is exported into the shipped app.
window.__mm = {
    card: function () {
        return {
            cost: Object.assign({}, MODE_COST),
            wagerMin: MODE_WAGER_MIN, wagerMax: MODE_WAGER_MAX,
            wagerStep: MODE_WAGER_STEP, wagerReturn: MODE_WAGER_RETURN,
            pactWager: PACT_WAGER,
            berserkSwingPerHour: BERSERK_SWING_PER_H,
            berserkSwingAt: { 1: berserkSwingFor(1), 3: berserkSwingFor(3), 5: berserkSwingFor(5) },
            berserkFloor: BERSERK_FLOOR_PER_H,
            focusMultiplier: FOCUS_MULTIPLIER,
            habitDefaultDays: HABIT_DEFAULT_DAYS, habitResumeDays: HABIT_RESUME_DAYS,
            stakeMinDays: STAKE_MIN_DAYS, stakeMinTotal: STAKE_MIN_TOTAL,
            kinds: MODE_KINDS.slice()
        };
    },
    activate: function (kind, payload, cost) {
        return modesActivate(kind, payload, cost, 'test_' + kind);
    },
    active: function () { return JSON.parse(JSON.stringify(modesActive() || null)); },
    end: function (outcome) { return modesEnd(outcome || 'ended', ''); },
    state: function () { return JSON.parse(JSON.stringify(modesState())); },
    offsets: function () { return JSON.parse(JSON.stringify(modesState().streakOffsets)); },

    // One full login pass: the authoritative walk with the mode passes either
    // side of it, exactly as processStreakPauses runs them in the app.
    streakPass: async function () { await processStreakPauses(); },

    // Re-arm the once-a-day guards so a test can drive several consecutive
    // "days" in one page. Nothing in the app calls this.
    rearm: function () {
        var m = modesState();
        m.offsetDay = {};
        (window.userData.dimensions || []).forEach(function (d) {
            (d.paths || []).forEach(function (p) {
                (p.activities || []).forEach(function (a) { a.lastProcessedDate = null; });
            });
        });
    },

    berserkTarget: function (hours) { return berserkTargetFor(hours); },
    berserkPerHour: function () { return berserkPerHourTarget(); },
    berserkEarned: function () { return berserkEarned(modesActive()); },
    resolveBerserk: function (force) { return berserkMaybeResolve(force); },
    resolveStake: function (force) { return stakeMaybeResolve(force); },
    onCompletion: function (activityId) {
        return modesOnCompletion(gritFindActivity(activityId));
    },
    onUndo: function (activityId) { return modesOnUndo(gritFindActivity(activityId)); },
    multiplierFor: function (activityId, ms) {
        return modeBestMultiplierFor(gritFindActivity(activityId), ms);
    },
    ceilingFor: function (activityId) { return recoveryCeilingFor(gritFindActivity(activityId)); },
    habitAdvance: function () { return habitAdvanceDays(modesActive()); },
    runPass: function () { return modesRunPass(true); },
    windowTest: function (s, e, now, padB, padA) {
        return modeInWindow(modeMins(s), modeMins(e), modeMins(now), padB || 0, padA || 0);
    },
    // Pact Mode reads TWO document shapes: the original one activity a side,
    // and the multi-activity one it takes now. Both live in the wild, so the
    // seam between them is reached directly rather than through a UI that
    // would only ever exercise whichever shape it happens to write.
    pactItems: function (p, uid) { return JSON.parse(JSON.stringify(pactItems(p, uid))); },
    pactCount: function (p, uid, activityId) { return pactCount(p, uid, activityId); },
    pactStats: function (p, uid) { return pactStats(p, uid); },
    pactSummary: function (p, uid) { return pactTermSummary(p, uid); },
    pactImpossible: function (p, uid) { return pactImpossible(p, uid); },
    pactResolution: function (p) { return pactBuildResolution(p); },
    modePactItems: function (a) { return JSON.parse(JSON.stringify(modePactItems(a))); },
    modePactHas: function (a, activityId) { return modePactHasActivity(a, activityId); },

    // Berserk's baseline window and its two-condition gate. Neither is
    // visible from the UI as a number, and both are the whole point of the
    // redesign, so they are reached directly rather than inferred from a
    // target that several inputs could have produced.
    baselineDays: function () { return berserkBaselineDays(); },
    // Null once the window has resolved and the mode is gone — a suite that
    // asserts on the gate after an unexpected win should report a failure, not
    // die inside the hook.
    berserkGate: function () { var a = modesActive(); return a ? berserkGate(a) : null; },
    berserkPanel: function () { return berserkPanelHtml(modesActive()); },

    // What a mode activating today can see of today.
    completionsOnDay: function (activityId, dayStr) {
        return modeCompletionsOnDay(gritFindActivity(activityId), dayStr);
    },

    // The setup sheet's own state object, so a test can fill in the fields a
    // real user fills in with sliders and text boxes and then press the
    // sheet's own start button.
    setup: function () { return _modeSetup; },

    // Resolution cards queued while the app was in the background.
    drain: function () { return modesDrainPending(); },

    openSetup: function (kind) {
        window.modesOpenSetup(kind);
        return !!document.getElementById('modeSheet');
    },
    closeSetup: function () { modeCloseSheet(); }
};
