// Vault checker — documentation tooling only. Nothing in the Mindkraft app
// imports or runs this. Run from the repo root:
//
//     node vault/.tools/check-vault.mjs
//
// Reports, and exits non-zero on the first three:
//   1. unresolved [[links]] (must be 0)
//   2. notes outside "00 Start Here" missing the template (front matter,
//      "In one line", the six sections) or citing a `sources:` path that
//      does not exist
//   3. names in "Key functions" sections, and Function Index entries, that
//      are not defined anywhere in the code
// and, informationally:
//   4. orphan notes (no incoming links)
//   5. functions defined in the code but missing from the Function Index
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(VAULT, '..');
const SKIP_DIRS = new Set(['.obsidian', '.tools', '.trash']);
const SECTIONS = ['How it works', 'Key functions', 'Data it touches', 'Connected to', 'If you change this', 'Where in the code'];

// ── Notes ────────────────────────────────────────────────────────────────
function walk(dir, out) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        if (ent.isDirectory()) { if (!SKIP_DIRS.has(ent.name)) walk(path.join(dir, ent.name), out); }
        else if (ent.name.endsWith('.md')) out.push(path.join(dir, ent.name));
    }
    return out;
}
const files = walk(VAULT, []);
const notes = new Map();   // basename → {file, folder, text}
for (const f of files) {
    const name = path.basename(f, '.md');
    if (notes.has(name)) console.log('DUPLICATE NOTE NAME', name);
    notes.set(name, { file: f, folder: path.relative(VAULT, path.dirname(f)), text: fs.readFileSync(f, 'utf8') });
}
const stripCode = (t) => t.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
const linksOf = (t) => [...stripCode(t).matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)].map((m) => m[1].trim());

// ── Code: every defined function name ────────────────────────────────────
const CODE_FILES = ['app.js', 'index.html', 'sw.js', 'scripts/send-reminders.js'];
const addDir = (d, re) => { if (fs.existsSync(path.join(REPO, d))) for (const f of fs.readdirSync(path.join(REPO, d))) if (re.test(f)) CODE_FILES.push(d + '/' + f); };
addDir('functions', /\.js$/); addDir('functions/lib', /\.js$/); addDir('functions/test', /\.js$/);
for (const s of ['grit', 'modes', 'nav', 'payout', 'rules', 'social', 'techtree', 'versus']) addDir('test/' + s, /\.(m?js)$/);
const defined = new Map();  // name → first file
const DEF_RES = [
    /(?:^|[\s;(])(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g,
    /window\.([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function|\(|[A-Za-z_$][\w$]*\s*=>|\(function)/g,
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g,
    /exports\.([A-Za-z_$][\w$]*)\s*=/g,
];
for (const rel of CODE_FILES) {
    const src = fs.readFileSync(path.join(REPO, rel), 'utf8');
    for (const re of DEF_RES) for (const m of src.matchAll(re)) if (!defined.has(m[1])) defined.set(m[1], rel);
}

// ── Checks ───────────────────────────────────────────────────────────────
const unresolved = [], incoming = new Map([...notes.keys()].map((n) => [n, 0]));
const templateProblems = [], unknownFns = [];
for (const [name, n] of notes) {
    for (const target of linksOf(n.text)) {
        if (!notes.has(target)) unresolved.push(`${n.folder}/${name} → [[${target}]]`);
        else if (target !== name) incoming.set(target, incoming.get(target) + 1);
    }
    const isStart = n.folder === '00 Start Here', isReadme = name === 'README' && n.folder === '';
    if (!isStart && !isReadme) {
        const fm = n.text.match(/^---\n([\s\S]*?)\n---\n/);
        if (!fm) templateProblems.push(`${name}: no front matter`);
        else {
            for (const k of ['type', 'sources', 'last_verified']) if (!new RegExp('^' + k + ':', 'm').test(fm[1])) templateProblems.push(`${name}: front matter lacks ${k}`);
            const src = fm[1].match(/^sources:\s*\[(.*)\]/m);
            if (src) for (const p of src[1].split(',').map((s) => s.trim()).filter(Boolean)) if (!fs.existsSync(path.join(REPO, p))) templateProblems.push(`${name}: source not found: ${p}`);
        }
        if (!n.text.includes('**In one line:**')) templateProblems.push(`${name}: no "In one line"`);
        for (const s of SECTIONS) if (!n.text.includes('## ' + s)) templateProblems.push(`${name}: missing section "${s}"`);
        const kf = n.text.match(/## Key functions\n([\s\S]*?)\n## /);
        if (kf) for (const m of kf[1].matchAll(/`([A-Za-z_$][\w$]*)`/g)) if (!defined.has(m[1])) unknownFns.push(`${name}: \`${m[1]}\``);
    }
    if (n.folder === 'Code' && !defined.has(name)) unknownFns.push(`Code note names no real function: ${name}`);
}
const fi = notes.get('Function Index');
const indexed = new Set();
if (fi) for (const m of fi.text.matchAll(/^\| `([A-Za-z_$][\w$]*)` \|/gm)) { indexed.add(m[1]); if (!defined.has(m[1])) unknownFns.push(`Function Index: \`${m[1]}\``); }
const missingFromIndex = [...defined.keys()].filter((k) => !indexed.has(k) && !/test|hooks|harness|stub/.test(defined.get(k)));
const orphans = [...incoming].filter(([, c]) => c === 0).map(([n]) => n);

const show = (title, list, max = 200) => { console.log(`\n${title}: ${list.length}`); list.slice(0, max).forEach((l) => console.log('  ' + l)); };
console.log(`notes: ${notes.size}   functions defined in code: ${defined.size}   indexed: ${indexed.size}`);
show('UNRESOLVED LINKS', unresolved);
show('TEMPLATE / SOURCE PROBLEMS', templateProblems);
show('UNKNOWN FUNCTION NAMES', unknownFns);
show('ORPHAN NOTES (no incoming links)', orphans);
show('CODE FUNCTIONS MISSING FROM FUNCTION INDEX', missingFromIndex, 40);
process.exit(unresolved.length || templateProblems.length || unknownFns.length ? 1 : 0);
