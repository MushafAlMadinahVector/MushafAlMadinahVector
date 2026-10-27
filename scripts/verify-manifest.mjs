import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
const allowEmpty = process.argv.includes('--allow-empty'), root = resolve(import.meta.dirname, '..'), file = join(root, 'public', 'data', 'pages.json');
if (!existsSync(file)) {
  const sources = join(root, 'quran-pages');
  const hasSources = existsSync(sources) && readdirSync(sources).some((name) => /^\d{3}___Hafs39__DM\.ai$/i.test(name));
  if (allowEmpty && !hasSources) { console.log('No manifest yet: build is asset-safe and valid without source files.'); process.exit(0); }
  throw new Error('Missing public/data/pages.json. Run npm run manifest before building with source assets.');
}
const manifest = JSON.parse(readFileSync(file, 'utf8')); const ids = new Set(); let errors = 0;
for (const page of manifest.pages ?? []) { if (!Number.isInteger(page.page) || ids.has(page.page)) { console.error(`Invalid or duplicate page: ${page.page}`); errors++; } ids.add(page.page); if (page.display?.status === 'ready') { const asset = resolve(root, page.display.path.replace(/^\.\//, '')); if (!existsSync(asset) || statSync(asset).size === 0) { console.error(`Missing preview for page ${page.page}: ${page.display.path}`); errors++; } } }
if (errors) process.exitCode = 1; else console.log(`Manifest valid: ${(manifest.pages ?? []).length} entries.`);
