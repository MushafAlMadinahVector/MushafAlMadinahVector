import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { getJuzForPage, getSurahsForPage } from './quran-data.mjs';

const root = resolve(import.meta.dirname, '..');
const sources = join(root, 'quran-pages');
const output = join(root, 'public', 'data', 'pages.json');
const previews = join(root, 'public', 'previews');
const pattern = /^(\d{3})___Hafs39__DM\.ai$/i;

if (!existsSync(sources)) {
  throw new Error('quran-pages/ is missing. Add authorised source files before generating a manifest.');
}

const seen = new Set();
const files = readdirSync(sources).filter((name) => pattern.test(name));

const pages = files.map((sourceFile) => {
  const match = sourceFile.match(pattern);
  const page = Number(match[1]);
  if (seen.has(page)) throw new Error(`Duplicate page number: ${page}`);
  seen.add(page);

  const sourcePath = join(sources, sourceFile);
  const previewName = basename(sourceFile, '.ai') + '.svg';
  const previewPath = join(previews, previewName);
  const surah = getSurahsForPage(page);
  const juz = getJuzForPage(page);

  const displayReady = existsSync(previewPath) && statSync(previewPath).size > 0;

  return {
    page,
    sourceFile,
    surah: {
      id: surah.id,
      nameEn: surah.nameEn,
      nameAr: surah.nameAr
    },
    juz,
    source: {
      format: 'Adobe Illustrator (.ai)',
      bytes: statSync(sourcePath).size,
      sha256: createHash('sha256').update(readFileSync(sourcePath)).digest('hex')
    },
    display: displayReady
      ? {
          status: 'ready',
          path: `./public/previews/${previewName}`,
          format: 'SVG',
          bytes: statSync(previewPath).size
        }
      : {
          status: 'missing',
          expectedPath: `./public/previews/${previewName}`
        }
  };
}).sort((a, b) => a.page - b.page);

if (!pages.length) {
  throw new Error('No source files match NNN___Hafs39__DM.ai. Nothing was written.');
}

mkdirSync(resolve(output, '..'), { recursive: true });
const manifestData = {
  schema: 2,
  edition: 'Mushaf Al-Madinah An-Nabawiyyah (Hafs narration)',
  publisher: 'King Fahd Glorious Quran Printing Complex (KFGQPC)',
  generatedAt: new Date().toISOString(),
  totalPages: pages.length,
  readyPreviews: pages.filter((p) => p.display?.status === 'ready').length,
  pages
};

writeFileSync(output, JSON.stringify(manifestData, null, 2) + '\n');
console.log(`Wrote ${pages.length} entries (${manifestData.readyPreviews} ready) to ${output}`);
