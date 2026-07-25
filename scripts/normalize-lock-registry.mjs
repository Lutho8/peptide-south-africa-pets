import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const lockUrl = new URL('../package-lock.json', import.meta.url);

if (!existsSync(lockUrl)) {
  console.log('[normalize-lock] no package-lock.json found; skipping');
  process.exit(0);
}

const before = readFileSync(lockUrl, 'utf8');
const after = before.replaceAll('https://registry.npmmirror.com/', 'https://registry.npmjs.org/');

if (after !== before) {
  writeFileSync(lockUrl, after);
  console.log('[normalize-lock] rewrote registry.npmmirror.com to registry.npmjs.org in package-lock.json');
} else {
  console.log('[normalize-lock] package-lock.json already uses registry.npmjs.org');
}
