import { SURAHS, JUZ_START_PAGES, getSurahsForPage, getJuzForPage } from './scripts/quran-data.mjs';

/**
 * State Management
 */
let pages = [];
let selectedPage = null;
let zoom = 1.0;
let pan = { x: 0, y: 0 };
let isDragging = false;
let startPan = { x: 0, y: 0 };

/**
 * DOM Elements
 */
const ui = {
  heroReadyCount: document.getElementById('heroReadyCount'),
  manifestStatus: document.getElementById('manifestStatus'),
  pageList: document.getElementById('pageList'),
  pageSearch: document.getElementById('pageSearch'),
  clearSearch: document.getElementById('clearSearch'),
  juzSelect: document.getElementById('juzSelect'),
  surahSelect: document.getElementById('surahSelect'),
  stepperIndicator: document.getElementById('stepperIndicator'),
  previousPage: document.getElementById('previousPage'),
  nextPage: document.getElementById('nextPage'),
  viewerKicker: document.getElementById('viewerKicker'),
  viewerTitle: document.getElementById('viewerTitle'),
  stage: document.getElementById('stage'),
  imageWrapper: document.getElementById('imageWrapper'),
  pageImage: document.getElementById('pageImage'),
  emptyState: document.getElementById('emptyState'),
  emptyHeading: document.getElementById('emptyHeading'),
  emptyMessage: document.getElementById('emptyMessage'),
  zoomLevelDisplay: document.getElementById('zoomLevelDisplay'),
  zoomIn: document.getElementById('zoomIn'),
  zoomOut: document.getElementById('zoomOut'),
  fitWidth: document.getElementById('fitWidth'),
  fitPage: document.getElementById('fitPage'),
  resetZoom: document.getElementById('resetZoom'),
  toggleFullscreen: document.getElementById('toggleFullscreen'),
  browserGrid: document.getElementById('browserGrid'),
  inspectIntegrity: document.getElementById('inspectIntegrity'),
  integrityDialog: document.getElementById('integrityDialog'),
  closeIntegrityModal: document.getElementById('closeIntegrityModal'),
  closeIntegrityBtn: document.getElementById('closeIntegrityBtn'),
  integrityMetaList: document.getElementById('integrityMetaList'),
  languageToggle: document.getElementById('languageToggle')
};

/**
 * Localization Helpers
 */
function isArabic() {
  return document.documentElement.lang === 'ar';
}

function t(enText, arText) {
  return isArabic() ? arText : enText;
}

function formatPageNumber(num) {
  return String(num).padStart(3, '0');
}

/**
 * Populate Surah and Juz Select Dropdowns
 */
function initFilters() {
  // Populate Juz (1 to 30)
  for (let i = 1; i <= 30; i++) {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = isArabic() ? `الجزء ${i}` : `Juz ${i}`;
    ui.juzSelect.appendChild(opt);
  }

  // Populate Surahs (1 to 114)
  SURAHS.forEach((surah) => {
    const opt = document.createElement('option');
    opt.value = String(surah.id);
    opt.textContent = isArabic()
      ? `${surah.id}. سورة ${surah.nameAr}`
      : `${surah.id}. Surah ${surah.nameEn} (${surah.nameAr})`;
    ui.surahSelect.appendChild(opt);
  });
}

function updateFilterLabels() {
  // Update Juz dropdown text
  Array.from(ui.juzSelect.options).forEach((opt, idx) => {
    if (idx === 0) {
      opt.textContent = isArabic() ? 'جميع الأجزاء (1-30)' : 'All Juz (1–30)';
    } else {
      opt.textContent = isArabic() ? `الجزء ${idx}` : `Juz ${idx}`;
    }
  });

  // Update Surahs dropdown text
  Array.from(ui.surahSelect.options).forEach((opt, idx) => {
    if (idx === 0) {
      opt.textContent = isArabic() ? 'جميع السور' : 'All Surahs';
    } else {
      const s = SURAHS[idx - 1];
      opt.textContent = isArabic()
        ? `${s.id}. سورة ${s.nameAr}`
        : `${s.id}. Surah ${s.nameEn} (${s.nameAr})`;
    }
  });
}

/**
 * Transform & View Stage Updates
 */
function applyTransform() {
  ui.imageWrapper.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
  ui.zoomLevelDisplay.textContent = `${Math.round(zoom * 100)}%`;
}

function resetTransform() {
  zoom = 1.0;
  pan = { x: 0, y: 0 };
  applyTransform();
}

/**
 * Filter and Render Page List
 */
function renderPageList() {
  const query = ui.pageSearch.value.trim().toLowerCase();
  const selectedJuz = ui.juzSelect.value ? Number(ui.juzSelect.value) : null;
  const selectedSurahId = ui.surahSelect.value ? Number(ui.surahSelect.value) : null;

  ui.clearSearch.hidden = !query;

  const filtered = pages.filter((item) => {
    // Juz filter
    if (selectedJuz && item.juz !== selectedJuz) return false;

    // Surah filter
    if (selectedSurahId && item.surah?.id !== selectedSurahId) return false;

    // Text search query
    if (!query) return true;

    const pageStr = String(item.page);
    const padStr = formatPageNumber(item.page);
    const filename = (item.sourceFile || '').toLowerCase();
    const surahEn = (item.surah?.nameEn || '').toLowerCase();
    const surahAr = (item.surah?.nameAr || '');

    return (
      pageStr.includes(query) ||
      padStr.includes(query) ||
      filename.includes(query) ||
      surahEn.includes(query) ||
      surahAr.includes(query)
    );
  });

  ui.pageList.innerHTML = '';

  if (filtered.length === 0) {
    const li = document.createElement('li');
    li.className = 'page-item-empty';
    li.style.padding = '1.5rem';
    li.style.textAlign = 'center';
    li.style.color = 'var(--ink-muted)';
    li.textContent = t('No matching Quran pages found.', 'لم يتم العثور على صفحات مطابقة.');
    ui.pageList.appendChild(li);
    return;
  }

  filtered.forEach((item) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'page-item-btn';
    btn.dataset.page = String(item.page);
    btn.setAttribute('aria-current', selectedPage?.page === item.page ? 'page' : 'false');

    const mainInfo = document.createElement('div');
    mainInfo.className = 'item-main-info';

    const numSpan = document.createElement('span');
    numSpan.className = 'item-number';
    numSpan.textContent = isArabic()
      ? `صفحة ${formatPageNumber(item.page)}`
      : `Page ${formatPageNumber(item.page)}`;

    const surahSpan = document.createElement('span');
    surahSpan.className = 'item-surah';
    surahSpan.textContent = isArabic()
      ? `سورة ${item.surah?.nameAr || ''}`
      : `Surah ${item.surah?.nameEn || ''} (${item.surah?.nameAr || ''})`;

    mainInfo.appendChild(numSpan);
    mainInfo.appendChild(surahSpan);

    const sideMeta = document.createElement('div');
    sideMeta.className = 'item-meta-side';

    const juzSpan = document.createElement('span');
    juzSpan.className = 'item-juz';
    juzSpan.textContent = isArabic() ? `الجزء ${item.juz}` : `Juz ${item.juz}`;

    const badge = document.createElement('span');
    const isReady = item.display?.status === 'ready';
    badge.className = `item-badge ${isReady ? 'badge-ready' : 'badge-missing'}`;
    badge.textContent = isReady
      ? t('Verified', 'متحقق منه')
      : t('Pending', 'بانتظار الأصل');

    sideMeta.appendChild(juzSpan);
    sideMeta.appendChild(badge);

    btn.appendChild(mainInfo);
    btn.appendChild(sideMeta);

    btn.addEventListener('click', () => {
      selectPage(item);
    });

    li.appendChild(btn);
    ui.pageList.appendChild(li);
  });

  updateStepperIndicator();
}

/**
 * Select & Render Active Page
 */
function selectPage(page) {
  selectedPage = page;
  resetTransform();

  // Highlight list item
  const buttons = ui.pageList.querySelectorAll('.page-item-btn');
  buttons.forEach((b) => {
    b.setAttribute('aria-current', b.dataset.page === String(page.page) ? 'page' : 'false');
  });

  // Update Toolbar Metadata
  const pad = formatPageNumber(page.page);
  const surahName = isArabic() ? page.surah?.nameAr : page.surah?.nameEn;
  const juzNum = page.juz;

  ui.viewerKicker.textContent = isArabic()
    ? `مصحف المدينة النبوية · ${page.sourceFile}`
    : `Mushaf Al-Madinah · ${page.sourceFile}`;

  ui.viewerTitle.textContent = isArabic()
    ? `صفحة ${pad} — سورة ${surahName} (الجزء ${juzNum})`
    : `Page ${pad} — Surah ${surahName} (Juz ${juzNum})`;

  const isUsable = page.display?.status === 'ready' && page.display.path;

  if (isUsable) {
    ui.emptyState.hidden = true;
    ui.pageImage.hidden = false;
    ui.pageImage.alt = isArabic()
      ? `صفحة مصحف المدينة رقم ${pad} — سورة ${surahName}`
      : `Mushaf Al-Madinah page ${pad} — Surah ${surahName}`;
    ui.pageImage.src = page.display.path;
  } else {
    ui.pageImage.hidden = true;
    ui.emptyState.hidden = false;
    ui.emptyHeading.textContent = isArabic() ? 'معاينة غير متوفرة محلياً' : 'Local preview unavailable';
    ui.emptyMessage.textContent = isArabic()
      ? `لم يتم بعد تسجيل مشتق عرض متحقق منه للملف ${page.sourceFile}. يرجى توفير الأصل المعتمد محلياً.`
      : `No verified display derivative has been generated for ${page.sourceFile} yet. Place the source file and run conversion.`;
  }

  updateStepperIndicator();
}

/**
 * Step Adjacent Page
 */
function stepPage(direction) {
  if (!pages.length) return;
  const currentIndex = selectedPage ? pages.findIndex((p) => p.page === selectedPage.page) : 0;
  const nextIndex = Math.max(0, Math.min(pages.length - 1, currentIndex + direction));
  if (nextIndex !== currentIndex) {
    selectPage(pages[nextIndex]);
    scrollSelectedIntoView();
  }
}

function scrollSelectedIntoView() {
  const currentBtn = ui.pageList.querySelector('[aria-current="page"]');
  if (currentBtn) {
    currentBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function updateStepperIndicator() {
  if (!pages.length) {
    ui.stepperIndicator.textContent = '— / —';
    return;
  }
  const currentIndex = selectedPage ? pages.findIndex((p) => p.page === selectedPage.page) : 0;
  ui.stepperIndicator.textContent = `${currentIndex + 1} / ${pages.length}`;
  ui.previousPage.disabled = currentIndex <= 0;
  ui.nextPage.disabled = currentIndex >= pages.length - 1;
}

/**
 * Load Manifest Data
 */
async function loadManifest() {
  try {
    const res = await fetch('./public/data/pages.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Manifest file not found');
    const data = await res.json();
    pages = (data.pages || []).sort((a, b) => a.page - b.page);

    const readyCount = pages.filter((p) => p.display?.status === 'ready').length;
    ui.heroReadyCount.textContent = String(readyCount);

    ui.manifestStatus.textContent = isArabic()
      ? `${pages.length} ملف مصدري موثق · ${readyCount} صفحة عرض جاهزة ومتحقق منها`
      : `${pages.length} source file(s) recorded · ${readyCount} verified preview(s) ready`;

    renderPageList();

    // Select first ready page or first overall
    const initial = pages.find((p) => p.display?.status === 'ready') || pages[0];
    if (initial) selectPage(initial);
  } catch (err) {
    ui.heroReadyCount.textContent = '0';
    ui.manifestStatus.textContent = isArabic()
      ? 'لم يتم العثور على بيان الصفحات بعد. شغّل npm run manifest بعد إضافة الملفات المصرح بها.'
      : 'No page manifest is available yet. Run npm run manifest after adding authorised source files.';
    renderPageList();
  }
}

/**
 * Interactive Pan & Drag Setup
 */
function initPanAndZoom() {
  // Zoom Controls
  ui.zoomIn.addEventListener('click', () => {
    zoom = Math.min(3.0, Number((zoom + 0.25).toFixed(2)));
    applyTransform();
  });

  ui.zoomOut.addEventListener('click', () => {
    zoom = Math.max(0.5, Number((zoom - 0.25).toFixed(2)));
    applyTransform();
  });

  ui.resetZoom.addEventListener('click', () => {
    resetTransform();
  });

  ui.fitPage.addEventListener('click', () => {
    resetTransform();
  });

  ui.fitWidth.addEventListener('click', () => {
    zoom = 1.35;
    pan = { x: 0, y: 0 };
    applyTransform();
  });

  // Double click stage to toggle zoom
  ui.stage.addEventListener('dblclick', (e) => {
    if (e.target.closest('button')) return;
    if (zoom > 1.05) {
      resetTransform();
    } else {
      zoom = 1.75;
      applyTransform();
    }
  });

  // Mouse Drag to Pan
  ui.stage.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Left click only
    isDragging = true;
    startPan = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    ui.stage.classList.add('is-panning');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    pan = { x: e.clientX - startPan.x, y: e.clientY - startPan.y };
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      ui.stage.classList.remove('is-panning');
    }
  });

  // Touch Support for Pan
  ui.stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      const touch = e.touches[0];
      startPan = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    pan = { x: touch.clientX - startPan.x, y: touch.clientY - startPan.y };
    applyTransform();
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Fullscreen Mode
  ui.toggleFullscreen.addEventListener('click', () => {
    const isFull = ui.browserGrid.classList.toggle('is-fullscreen');
    ui.toggleFullscreen.setAttribute('aria-pressed', String(isFull));
  });
}

/**
 * Technical Integrity Inspector Modal
 */
function initIntegrityModal() {
  ui.inspectIntegrity.addEventListener('click', () => {
    if (!selectedPage) return;
    const p = selectedPage;
    const formatBytes = (bytes) => bytes ? `${(bytes / 1024).toFixed(1)} KB (${bytes.toLocaleString()} bytes)` : '—';

    ui.integrityMetaList.innerHTML = `
      <dt>${t('Page Number', 'رقم الصفحة')}</dt>
      <dd>${formatPageNumber(p.page)}</dd>

      <dt>${t('Surah & Juz', 'السورة والجزء')}</dt>
      <dd>${p.surah?.nameEn} (${p.surah?.nameAr}) · ${t('Juz', 'الجزء')} ${p.juz}</dd>

      <dt>${t('Source Filename', 'اسم الملف الأصلي')}</dt>
      <dd><code>${p.sourceFile}</code></dd>

      <dt>${t('Source Format', 'صيغة المصدر')}</dt>
      <dd>${p.source?.format || 'Adobe Illustrator (.ai) / %PDF-1.5%'}</dd>

      <dt>${t('Source File Size', 'حجم الملف الأصلي')}</dt>
      <dd>${formatBytes(p.source?.bytes)}</dd>

      <dt>${t('Cryptographic SHA-256', 'بصمة التجزئة SHA-256')}</dt>
      <dd style="font-size:0.75rem; color:var(--accent-jade-dark); font-weight:600;">${p.source?.sha256 || '—'}</dd>

      <dt>${t('Display Derivative', 'المشتق المعروض')}</dt>
      <dd>${p.display?.status === 'ready' ? `<code>${p.display.path}</code> (${p.display.format})` : t('Missing / Pending', 'غير متوفر')}</dd>

      <dt>${t('Derivative Size', 'حجم المشتق')}</dt>
      <dd>${formatBytes(p.display?.bytes)}</dd>

      <dt>${t('Upstream Source', 'المصدر المرجعي')}</dt>
      <dd><a href="https://github.com/MushafAlMadinahVector/MushafAlMadinahVector/blob/main/quran-pages/${p.sourceFile}" target="_blank" rel="noreferrer" style="color:var(--accent-gold-dark);">MushafAlMadinahVector GitHub ↗</a></dd>
    `;

    ui.integrityDialog.showModal();
  });

  const closeModal = () => ui.integrityDialog.close();
  ui.closeIntegrityModal.addEventListener('click', closeModal);
  ui.closeIntegrityBtn.addEventListener('click', closeModal);
  ui.integrityDialog.addEventListener('click', (e) => {
    if (e.target === ui.integrityDialog) closeModal();
  });
}

/**
 * Language Switching & RTL
 */
function initLanguageToggle() {
  ui.languageToggle.addEventListener('click', () => {
    const goingArabic = document.documentElement.lang !== 'ar';
    document.documentElement.lang = goingArabic ? 'ar' : 'en';
    document.documentElement.dir = goingArabic ? 'rtl' : 'ltr';

    ui.languageToggle.querySelector('.lang-label').textContent = goingArabic ? 'English' : 'العربية';
    ui.languageToggle.setAttribute('aria-pressed', String(goingArabic));

    // Update all data-en / data-ar text nodes
    document.querySelectorAll('[data-en]').forEach((el) => {
      const translation = el.dataset[goingArabic ? 'ar' : 'en'];
      if (translation) el.textContent = translation;
    });

    updateFilterLabels();
    renderPageList();
    if (selectedPage) selectPage(selectedPage);
  });
}

/**
 * Keyboard Navigation Shortcuts
 */
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Avoid intercepting input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      if (e.key === 'Escape') e.target.blur();
      return;
    }

    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      ui.zoomIn.click();
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      ui.zoomOut.click();
    } else if (e.key === '0') {
      e.preventDefault();
      ui.resetZoom.click();
    } else if (e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      ui.fitWidth.click();
    } else if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      ui.fitPage.click();
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      ui.toggleFullscreen.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepPage(isArabic() ? 1 : -1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepPage(isArabic() ? -1 : 1);
    } else if (e.key === 'Escape') {
      if (ui.integrityDialog.open) {
        ui.integrityDialog.close();
      } else if (ui.browserGrid.classList.contains('is-fullscreen')) {
        ui.browserGrid.classList.remove('is-fullscreen');
      }
    }
  });
}

/**
 * Event Listeners Initialization
 */
function initEvents() {
  ui.pageSearch.addEventListener('input', renderPageList);
  ui.clearSearch.addEventListener('click', () => {
    ui.pageSearch.value = '';
    renderPageList();
    ui.pageSearch.focus();
  });

  ui.juzSelect.addEventListener('change', renderPageList);
  ui.surahSelect.addEventListener('change', renderPageList);

  ui.previousPage.addEventListener('click', () => stepPage(-1));
  ui.nextPage.addEventListener('click', () => stepPage(1));
}

/**
 * Bootstrap Application
 */
initFilters();
initPanAndZoom();
initIntegrityModal();
initLanguageToggle();
initKeyboardShortcuts();
initEvents();
loadManifest();
