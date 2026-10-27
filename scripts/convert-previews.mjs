import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const sources = join(root, 'quran-pages');
const output = join(root, 'public', 'previews');

if (!existsSync(sources)) {
  console.error('Error: quran-pages/ is missing. Source files are never downloaded or invented by this script.');
  process.exit(1);
}

const pattern = /^(\d{3})___Hafs39__DM\.ai$/i;
const files = readdirSync(sources).filter((name) => pattern.test(name));
if (!files.length) {
  console.error('Error: No authorised source files match the documented filename pattern NNN___Hafs39__DM.ai.');
  process.exit(1);
}

mkdirSync(output, { recursive: true });

// Strategy 1: Check if Python with PyMuPDF is available (highest speed & vector fidelity)
const pyScript = join(root, 'scripts', 'convert-previews.py');
const pyCheck = spawnSync('python', ['-c', 'import fitz'], { encoding: 'utf8' });

if (pyCheck.status === 0 && existsSync(pyScript)) {
  console.log('Using PyMuPDF (fitz) vector engine for conversion...');
  const res = spawnSync('python', [pyScript], { stdio: 'inherit' });
  process.exit(res.status ?? 0);
}

// Strategy 2: Fallback to inkscape CLI
console.log('PyMuPDF not found; falling back to Inkscape CLI...');
const failures = [];

for (const name of files) {
  const target = join(output, name.replace(/\.ai$/i, '.svg'));
  const run = spawnSync('inkscape', [join(sources, name), `--export-filename=${target}`], { encoding: 'utf8' });
  if (run.status !== 0) {
    failures.push(name);
    console.error(`  ✗ ${name}: ${run.stderr?.trim() || 'conversion failed (ensure inkscape is installed and on PATH)'}`);
  } else {
    console.log(`  ✓ Converted ${name}`);
  }
}

if (failures.length) {
  console.error(`\n${failures.length} conversion(s) failed. No source file was changed.`);
  process.exit(1);
}

console.log(`\nSuccessfully converted ${files.length} vector previews to public/previews/.`);
