// ── Payout-redesign test hooks (harness only) ─────────────────────────────
// Appended to the COPY of app.js the harness builds, inside the same module
// scope, so the suite can reach the rate cards, curves and week state the
// redesign is actually about. None of it is exported into the shipped app.
window.__pr = {
    // §1 — the two curves and the one number they add up to.
    absCurve:      function (n) { return gritAbsCurve(n); },
    absAnchors:    function () { return GRIT_ABS_CURVE.map(function (p) { return p.slice(); }); },
    ratioCurve:    function (r) { return gritCurve(r); },
    absCompletions: function () { return gritAbsCompletions(gritState().week); },
    payout:        function () { return gritWeekPayout(gritState().week); },
    projected:     function () { return gritProjectedBonus(gritState().week); },

    // §2 — the day tally the absolute bonus counts, and the week around it.
    week:      function () { return JSON.parse(JSON.stringify(gritState().week || null)); },
    dayTally:  function () { return Object.assign({}, (gritState().week || {}).dayTally || {}); },
    anchor:    function () { return gritWeekAnchorStr(new Date()); },
    ensureWeek: function () { return gritEnsureWeek(); },

    // §4 — the shield numbers, from the three angles that disagreed before.
    shields: function (id) {
        var a = gritFindActivity(id);
        return {
            applied:  appliedShieldCount(a),
            floor:    shieldFloorFor(a),
            floorFresh: shieldFloorFor(a, 0),
            capNow:   shieldCapNow(a),
            capUsed:  a.shieldCapUsed,
            consumed: a.shieldsConsumed || 0,
            held:     shieldsHeldNow(a),
            left:     Math.max(0, getShieldCap(a) - (a.shieldsConsumed || 0))
        };
    },
    absCap: function () { return SHIELD_ABS_CAP; },
    applyShield: function (id) { return window.gritApplyShield(id); },
    recomputeStreak: function (id) { return recomputeStreakFromHistory(gritFindActivity(id)); },

    // §5 — render the picker into a detached host and tap a row.
    pickerTap: function (id) {
        var host = document.createElement('div');
        document.body.appendChild(host);
        gritRenderShieldPicker(host);
        var btn = host.querySelector('.grit-pick-row[data-act="' + id + '"]');
        if (!btn) { host.remove(); return Promise.resolve('no-row'); }
        btn.click();
        return new Promise(function (r) { setTimeout(function () { host.remove(); r('tapped'); }, 250); });
    },

    // §6 — the four windows, plus the bucket they now read.
    weeklyXP:        function () { return computeWeeklyXP(); },
    weeklyFromActs:  function () { return computeWeeklyXPFromActivities(gritAllActivities()); },
    xpPerHour:       function () { return computeXPPerHour(gritAllActivities()); },
    dailyMap:        function (d) { return modeDailyXPMap(d); },
    avgPerHour:      function (d) { return modeAvgPerHour(d); },
    ghostRetention:  function () { return GHOST_XP_RETENTION_DAYS; },

    // §7 — the mode XP ledger and the history merge.
    logModeXP:  function (label, xp, at) { return modeLogXP(label, xp, at); },
    modeXPLog:  function () { return (window.userData.modeXPLog || []).slice(); },
    focusFinish: function (a) { return focusFinish(a); },

    // §8 / §9 — the anchors.
    analyticsWeekStart:  function () { return getWeekStartStr(); },
    leaderboardWeekStart: function () { return getLeaderboardWeekStartStr(); },
    cycleStart: function (id, iso) {
        var w = getCycleWindowStart(gritFindActivity(id), new Date(iso));
        return w ? toLocalDateStr(w) : null;
    },
    nextCycleStart: function (id, iso) {
        var w = getNextCycleWindowStart(gritFindActivity(id), new Date(iso));
        return w ? toLocalDateStr(w) : null;
    },
    completedToday: function (id) { return isCompletedToday(gritFindActivity(id)); },
    biweeklyAnchor: function () { return BIWEEKLY_ANCHOR; }
};

// A direct handle on the week numerator, so the day-keying can be asserted
// without needing a particular weekday for the suite to run on.
window.__pr.bump = function (id, delta, dayStr) {
    return gritBumpNumerator(gritState(), gritFindActivity(id), delta, dayStr);
};

// Opens the Activity History panel and renders it, returning the rows as the
// user would read them.
window.__pr.historyRows = function () {
    var body = document.getElementById('activityHistoryBody');
    if (!body) return null;
    body.classList.add('open');
    window._historyFilter = 'all';
    window._historyPage = 1;
    renderActivityHistory(true);
    var list = document.getElementById('activityHistoryList');
    return Array.prototype.map.call(list.querySelectorAll('.ah-row'), function (row) {
        return {
            xp:   (row.querySelector('.ah-xp') || {}).textContent || '',
            name: (row.querySelector('.ah-name') || {}).textContent || '',
            tags: Array.prototype.map.call(row.querySelectorAll('.ah-tag'),
                    function (t) { return t.textContent; }),
            hasDelete: !!row.querySelector('.ah-del-btn')
        };
    });
};

// The dashboard tick is what prunes the ghost bucket, and it is module-scoped.
window.__pr.dashboardTick = function () { return updateDashboard(); };
