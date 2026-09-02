// ── Grit clawback test hooks (harness only) ───────────────────────────────
// Appended to the COPY of app.js the harness builds, inside the same module
// scope, so the suite can read the rate card and the ledger the invariants are
// actually about. None of it is exported into the shipped app.
window.__gc = {
    drip: function () { return GRIT_DRIP; },
    ledgerReasons: function () {
        return _gritLedgerBuffer.map(function (b) { return b.data.reason; });
    },
    phrase: function (reason, meta) {
        return gritLedgerPhrase({ reason: reason, meta: meta || {} });
    },
    week: function () {
        var w = gritState().week;
        return w ? { anchor: w.anchor, completions: w.completions } : null;
    },
    anchor: function () { return gritWeekAnchorStr(new Date()); }
};
