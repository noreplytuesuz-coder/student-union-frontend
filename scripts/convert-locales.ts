import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { en } from '../src/shared/config/locales/en';
import { ru } from '../src/shared/config/locales/ru';
import { uz } from '../src/shared/config/locales/uz';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outBase = resolve(__dirname, '../public/locales');

// Keys that are corrupted code fragments (leaked from JSX by an earlier
// auto-fixer) — never valid translations. Everything else is kept as-is,
// including English self-references, which are intentional ("Add" → "Add").
const CORRUPTED = new Set([
  "; case 'pending': return",
  ') : filteredNews.length > 0 ? (',
  'isSameDay(e.date, day)); days.push(',
  ') : ( profile.social.instagram ? (',
  ') : ( profile.social.telegram ? (',
]);

function clean(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && CORRUPTED.has(value.trim())) continue;
    out[key] = value as unknown;
  }
  return out;
}

const sets: Array<[string, Record<string, unknown>]> = [
  ['en', en as Record<string, unknown>],
  ['ru', ru as Record<string, unknown>],
  ['uz', uz as Record<string, unknown>],
];

for (const [lng, raw] of sets) {
  const cleaned = clean(raw);
  const dir = resolve(outBase, lng);
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, 'translation.json');
  writeFileSync(file, JSON.stringify(cleaned, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${file} (${Object.keys(cleaned).length} keys)`);
}
console.log('Done.');
