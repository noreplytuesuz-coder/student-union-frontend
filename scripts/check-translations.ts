import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcDir = join(root, 'src');
const localesDir = join(root, 'public', 'locales');

const LANGS = ['en', 'ru', 'uz'];

function loadJson(p: string): Record<string, unknown> {
  return JSON.parse(readFileSync(p, 'utf8'));
}

// Flatten a nested JSON object into dot-keys for comparison with t() usage.
function flatten(obj: unknown, prefix = ''): Set<string> {
  const out = new Set<string>();
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const key = prefix ? `${prefix}.${k}` : k;
      out.add(key);
      if (v && typeof v === 'object') {
        for (const sub of flatten(v, key)) out.add(sub);
      }
    }
  }
  return out;
}

const dicts: Record<string, Set<string>> = {};
for (const lng of LANGS) {
  const file = join(localesDir, lng, 'translation.json');
  dicts[lng] = flatten(loadJson(file));
}

// Walk src, collect .ts/.tsx files.
function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith('.d.ts')) acc.push(full);
  }
  return acc;
}

const files = walk(srcDir);

// Match: t('some.key')  t("some.key")  t(`some.key`)
// Supports dot-keys and nested segments; ignores obviously dynamic/computed.
const KEY_RE = /(?:\bt)\(\s*['"`]([a-zA-Z0-9_.\- ]+)['"`]\s*\)/g;
// Also capture object-literal t({...}) not used here; skip.

const missing: Record<string, { key: string; file: string; line: number }[]> = {
  en: [], ru: [], uz: [],
};

let totalKeys = 0;

for (const file of files) {
  const rel = file.replace(root + '\\', '');
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    let m: RegExpExecArray | null;
    KEY_RE.lastIndex = 0;
    while ((m = KEY_RE.exec(line))) {
      const key = m[1];
      totalKeys++;
      for (const lng of LANGS) {
        if (!dicts[lng].has(key)) {
          missing[lng].push({ key, file: rel, line: i + 1 });
        }
      }
    }
  });
}

let problems = 0;
for (const lng of LANGS) {
  const list = missing[lng];
  if (list.length === 0) {
    console.log(`\n[${lng}] ✓ all ${totalKeys} referenced keys present`);
    continue;
  }
  problems += list.length;
  console.log(`\n[${lng}] ✗ ${list.length} missing key(s):`);
  // unique by key
  const seen = new Set<string>();
  for (const it of list) {
    if (seen.has(it.key)) continue;
    seen.add(it.key);
    console.log(`  - "${it.key}"  (used in ${it.file}:${it.line})`);
  }
}

console.log(`\nScanned ${totalKeys} t() key usages across ${files.length} source files.`);
if (problems === 0) console.log('RESULT: PASS — no missing translations.');
else console.log(`RESULT: ${problems} missing translation reference(s).`);
