// Splice src/kit.js + each src/scenes/*.js into the verbatim Motion Studio shell
// (only the region between SCENE:BEGIN and SCENE:END is replaced).
// Usage: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shell = fs.readFileSync(path.join(root, 'src/shell.html'), 'utf8').split('\n');
const kit = fs.readFileSync(path.join(root, 'src/kit.js'), 'utf8');
const begin = shell.findIndex(l => l.startsWith('// ============ SCENE:BEGIN'));
const end = shell.findIndex(l => l.startsWith('// ============ SCENE:END'));
if (begin < 0 || end < begin) throw new Error('SCENE markers not found in shell');

fs.mkdirSync(path.join(root, 'studios'), { recursive: true });
for (const f of fs.readdirSync(path.join(root, 'src/scenes')).filter(f => f.endsWith('.js')).sort()) {
  const scene = fs.readFileSync(path.join(root, 'src/scenes', f), 'utf8');
  const out = [...shell.slice(0, begin + 1), kit, scene, ...shell.slice(end)].join('\n');
  const dest = path.join(root, 'studios', f.replace(/\.js$/, '-studio.html'));
  fs.writeFileSync(dest, out);
  console.log('built', path.relative(root, dest));
}
