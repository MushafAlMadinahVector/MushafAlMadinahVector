const TOTAL_PAGES = 604;
const INDEX_PAGE_SIZE = 24;
const RECENT_LIMIT = 6;
const RECENT_STORAGE_KEY = "al-madinah.recent-pages.v1";
const SOURCE_BASE = "https://raw.githubusercontent.com/kausikhussain/Al-Madinah/main/quran-pages/";
const SOURCE_REPO = "https://github.com/kausikhussain/Al-Madinah/tree/main/quran-pages";
const PDFJS_MODULE_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs";
const PDFJS_WORKER_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";

const stage = document.getElementById("page-stage");
const canvasA = document.getElementById("page-canvas-a");
const canvasB = document.getElementById("page-canvas-b");
const placeholder = document.getElementById("page-placeholder");
const previewError = document.getElementById("preview-error");
const statusLabel = document.getElementById("stage-status");
const counterLabel = document.getElementById("counter-label");
const viewerPageInput = document.getElementById("viewer-page-number");
const pageIndexGrid = document.getElementById("page-index-grid");
const indexRangeLabel = document.getElementById("index-range-label");
const indexPageLabel = document.getElementById("index-page-label");
const previousButton = document.getElementById("page-prev");
const nextButton = document.getElementById("page-next");
const indexPreviousButton = document.getElementById("index-prev");
const indexNextButton = document.getElementById("index-next");
const downloadSource = document.getElementById("download-source");
const exportButton = document.getElementById("export-button");
const fullscreenButton = document.getElementById("fullscreen-button");
const shareButton = document.getElementById("share-page-button");
const zoomOutButton = document.getElementById("zoom-out");
const zoomInButton = document.getElementById("zoom-in");
const zoomResetButton = document.getElementById("zoom-reset");
const zoomLabel = document.getElementById("zoom-level");
const recentPages = document.getElementById("recent-pages");
const recentPageList = document.getElementById("recent-page-list");
const toast = document.getElementById("toast");

let pdfjsPromise = null;
let activeCanvas = canvasA;
let inactiveCanvas = canvasB;
let activeDocument = null;
let activeLoadingTask = null;
let activePageNumber = 1;
let activeRenderTask = null;
let loadVersion = 0;
let indexStart = Math.floor((pageFromUrl() - 1) / INDEX_PAGE_SIZE) * INDEX_PAGE_SIZE + 1;
let toastTimer = null;
let resizeTimer = null;
let zoomScale = 1;
let panX = 0;
let panY = 0;
let panStart = null;
let renderedPageNumber = 0;

function pageFilename(pageNumber) {
  return String(pageNumber).padStart(3, "0") + "___Hafs39__DM.ai";
}

function pageUrl(pageNumber) {
  return SOURCE_BASE + encodeURIComponent(pageFilename(pageNumber));
}

function formatPage(pageNumber) {
  return String(pageNumber).padStart(3, "0");
}

function pageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = Number.parseInt(params.get("page"), 10);
  const hashMatch = window.location.hash.match(/(?:^#|[&?])page=(\d+)/i);
  const fromHash = hashMatch ? Number.parseInt(hashMatch[1], 10) : NaN;
  const value = Number.isInteger(fromQuery) ? fromQuery : fromHash;
  return Number.isInteger(value) && value >= 1 && value <= TOTAL_PAGES ? value : 1;
}

function syncPageUrl(pageNumber, mode) {
  try {
    const url = new URL(window.location.href);
    if (pageNumber === 1 && mode === "replaceState") url.searchParams.delete("page");
    else url.searchParams.set("page", String(pageNumber));
    url.hash = "";
    const state = { ...(window.history.state || {}), alMadinahPage: pageNumber };
    window.history[mode](state, "", url);
  } catch (_error) {
    // The viewer remains usable even if a host disallows History API updates.
  }
}

function setStatus(message) {
  statusLabel.textContent = message;
}

function announce(message) {
  if (toastTimer) window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 2800);
}

function getPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import(PDFJS_MODULE_URL)
      .then(function (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        return pdfjs;
      })
      .catch(function (error) {
        pdfjsPromise = null;
        throw error;
      });
  }
  return pdfjsPromise;
}

function updateViewerMetadata(pageNumber) {
  viewerPageInput.value = String(pageNumber);
  document.getElementById("browse-page-number").value = String(pageNumber);
  counterLabel.textContent = "PAGE " + formatPage(pageNumber) + " / " + TOTAL_PAGES;
  previousButton.disabled = pageNumber <= 1;
  nextButton.disabled = pageNumber >= TOTAL_PAGES;
  downloadSource.href = pageUrl(pageNumber);
  downloadSource.removeAttribute("download");
  downloadSource.setAttribute("aria-label", "Open original AI file for page " + pageNumber);
  document.getElementById("error-source-link").href = pageUrl(pageNumber);
  shareButton.setAttribute("aria-label", "Copy a shareable link to page " + pageNumber);
}

function setLoadingState(pageNumber) {
  previewError.hidden = true;
  placeholder.style.opacity = "1";
  stage.classList.remove("is-loaded");
  setStatus("Loading page " + formatPage(pageNumber) + "…");
  updateViewerMetadata(pageNumber);
  applyCanvasView();
}

function getDisplayScale(page, viewportAtOne) {
  const stageRect = stage.getBoundingClientRect();
  const availableWidth = Math.max(160, stageRect.width - 44);
  const availableHeight = Math.max(220, stageRect.height - 44);
  return Math.min(availableWidth / viewportAtOne.width, availableHeight / viewportAtOne.height);
}

function applyCanvasView() {
  const hasPage = stage.classList.contains("is-loaded") && previewError.hidden && Boolean(activeCanvas.width);
  const transform = "translate(calc(-50% + " + panX + "px), calc(-50% + " + panY + "px)) scale(" + zoomScale + ")";
  [canvasA, canvasB].forEach(function (canvas) {
    canvas.style.transform = transform;
  });
  stage.classList.toggle("is-zoomed", hasPage && zoomScale > 1.001);
  stage.classList.toggle("is-panning", hasPage && Boolean(panStart));
  stage.style.touchAction = hasPage && zoomScale > 1.001 ? "none" : "pan-y";
  zoomLabel.textContent = Math.round(zoomScale * 100) + "%";
  zoomOutButton.disabled = !hasPage || zoomScale <= 1.001;
  zoomInButton.disabled = !hasPage || zoomScale >= 2.5;
  zoomResetButton.disabled = !hasPage || (zoomScale === 1 && panX === 0 && panY === 0);
  zoomResetButton.setAttribute("aria-label", zoomScale === 1 ? "Page fits the viewer" : "Reset zoom and position");
}

function setZoom(value) {
  if (!activeCanvas.width || !previewError.hidden || !stage.classList.contains("is-loaded")) return;
  zoomScale = Math.max(1, Math.min(2.5, Math.round(value * 100) / 100));
  if (zoomScale <= 1.001) {
    zoomScale = 1;
    panX = 0;
    panY = 0;
  }
  applyCanvasView();
}

function resetZoom() {
  zoomScale = 1;
  panX = 0;
  panY = 0;
  panStart = null;
  applyCanvasView();
}

async function renderDocumentPage(pdfDocument, pageNumber, requestVersion, renderOptions) {
  const options = renderOptions || {};
  const page = await pdfDocument.getPage(1);
  if (requestVersion !== loadVersion) return false;

  const normalViewport = page.getViewport({ scale: 1 });
  const displayScale = getDisplayScale(page, normalViewport);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const renderViewport = page.getViewport({ scale: displayScale * pixelRatio });
  const displayWidth = normalViewport.width * displayScale;
  const displayHeight = normalViewport.height * displayScale;
  const stagingCanvas = document.createElement("canvas");
  stagingCanvas.width = Math.ceil(renderViewport.width);
  stagingCanvas.height = Math.ceil(renderViewport.height);
  const stagingContext = stagingCanvas.getContext("2d", { alpha: false });
  if (!stagingContext) throw new Error("Canvas rendering is unavailable in this browser.");

  stagingContext.fillStyle = "#fffefa";
  stagingContext.fillRect(0, 0, stagingCanvas.width, stagingCanvas.height);

  if (activeRenderTask && typeof activeRenderTask.cancel === "function") {
    try { activeRenderTask.cancel(); } catch (_error) { /* Previous render already ended. */ }
  }

  const renderTask = page.render({ canvasContext: stagingContext, viewport: renderViewport, background: "#fffefa" });
  activeRenderTask = renderTask;
  try {
    await renderTask.promise;
  } finally {
    if (activeRenderTask === renderTask) activeRenderTask = null;
  }

  if (requestVersion !== loadVersion) {
    stagingCanvas.width = 0;
    stagingCanvas.height = 0;
    return false;
  }

  inactiveCanvas.width = stagingCanvas.width;
  inactiveCanvas.height = stagingCanvas.height;
  inactiveCanvas.style.width = displayWidth + "px";
  inactiveCanvas.style.height = displayHeight + "px";
  const targetContext = inactiveCanvas.getContext("2d", { alpha: false });
  if (!targetContext) throw new Error("Canvas rendering is unavailable in this browser.");
  targetContext.clearRect(0, 0, inactiveCanvas.width, inactiveCanvas.height);
  targetContext.drawImage(stagingCanvas, 0, 0);
  stagingCanvas.width = 0;
  stagingCanvas.height = 0;
  if (typeof page.cleanup === "function") page.cleanup();

  inactiveCanvas.classList.add("is-active");
  activeCanvas.classList.remove("is-active");
  activeCanvas.setAttribute("aria-hidden", "true");
  inactiveCanvas.setAttribute("aria-hidden", "false");
  const previousCanvas = activeCanvas;
  activeCanvas = inactiveCanvas;
  inactiveCanvas = previousCanvas;
  activePageNumber = pageNumber;
  renderedPageNumber = pageNumber;
  stage.classList.add("is-loaded");
  previewError.hidden = true;
  exportButton.disabled = false;
  setStatus("Page " + formatPage(pageNumber) + " ready");
  if (options.preserveView) applyCanvasView();
  else resetZoom();
  updateIndexToPage(pageNumber);
  return true;
}

function saveRecentPage(pageNumber) {
  try {
    const prior = JSON.parse(window.localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
    const safePrior = Array.isArray(prior) ? prior.filter(function (n) { return Number.isInteger(n) && n >= 1 && n <= TOTAL_PAGES; }) : [];
    const updated = [pageNumber].concat(safePrior.filter(function (n) { return n !== pageNumber; })).slice(0, RECENT_LIMIT);
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    renderRecentPages(updated);
  } catch (_error) {
    // Storage may be disabled; page viewing must still work.
  }
}

function renderRecentPages(pages) {
  recentPageList.replaceChildren();
  if (!pages.length) {
    recentPages.hidden = true;
    return;
  }
  recentPages.hidden = false;
  const fragment = document.createDocumentFragment();
  pages.forEach(function (pageNumber) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "recent-page-chip" + (pageNumber === activePageNumber ? " is-current" : "");
    button.textContent = "Page " + formatPage(pageNumber);
    button.setAttribute("aria-label", "Return to recently viewed page " + pageNumber);
    if (pageNumber === activePageNumber) button.setAttribute("aria-current", "page");
    button.addEventListener("click", function () { showPage(pageNumber, { scrollToViewer: true }); });
    fragment.appendChild(button);
  });
  recentPageList.appendChild(fragment);
}

function loadRecentPages() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
    const pages = Array.isArray(stored) ? stored.filter(function (n) { return Number.isInteger(n) && n >= 1 && n <= TOTAL_PAGES; }).slice(0, RECENT_LIMIT) : [];
    renderRecentPages(pages);
  } catch (_error) {
    renderRecentPages([]);
  }
}

async function showPage(pageNumber, options) {
  const opts = options || {};
  const requested = Math.max(1, Math.min(TOTAL_PAGES, Number.parseInt(pageNumber, 10) || 1));

  if (requested === activePageNumber && activeDocument && renderedPageNumber === requested && previewError.hidden && stage.classList.contains("is-loaded")) {
    updateIndexToPage(requested);
    if (opts.scrollToViewer) document.getElementById("viewer").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    if (opts.fromPopstate) syncPageUrl(requested, "replaceState");
    return;
  }

  const requestVersion = ++loadVersion;
  if (activeRenderTask && typeof activeRenderTask.cancel === "function") {
    try { activeRenderTask.cancel(); } catch (_error) { /* Previous render already ended. */ }
  }
  if (activeLoadingTask) {
    const previousTask = activeLoadingTask;
    activeLoadingTask = null;
    try { await previousTask.destroy(); } catch (_error) { /* The task may already have completed. */ }
    if (requestVersion !== loadVersion) return;
  }

  setLoadingState(requested);
  let nextDocument = null;
  let loadingTask = null;
  try {
    const pdfjs = await getPdfJs();
    if (requestVersion !== loadVersion) return;
    loadingTask = pdfjs.getDocument({
      url: pageUrl(requested),
      withCredentials: false,
      rangeChunkSize: 65536,
      useSystemFonts: true,
      isEvalSupported: false
    });
    activeLoadingTask = loadingTask;
    loadingTask.onProgress = function (progress) {
      if (requestVersion !== loadVersion || !progress || !progress.total) return;
      const percent = Math.min(99, Math.round((progress.loaded / progress.total) * 100));
      setStatus("Loading page " + formatPage(requested) + " · " + percent + "%");
    };
    nextDocument = await loadingTask.promise;
    if (activeLoadingTask === loadingTask) activeLoadingTask = null;
    if (requestVersion !== loadVersion) {
      await nextDocument.destroy();
      return;
    }
    const previousDocument = activeDocument;
    const rendered = await renderDocumentPage(nextDocument, requested, requestVersion);
    if (!rendered || requestVersion !== loadVersion) {
      if (nextDocument !== activeDocument) await nextDocument.destroy();
      return;
    }
    activeDocument = nextDocument;
    if (previousDocument && previousDocument !== nextDocument) {
      try { await previousDocument.destroy(); } catch (_error) { /* Ignore old-document cleanup errors. */ }
    }
    updateViewerMetadata(requested);
    saveRecentPage(requested);
    syncPageUrl(requested, opts.historyMode || (opts.initial || opts.fromPopstate ? "replaceState" : "pushState"));
    if (opts.scrollToViewer) {
      document.getElementById("viewer").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
  } catch (error) {
    if (requestVersion !== loadVersion) {
      if (nextDocument && nextDocument !== activeDocument) {
        try { await nextDocument.destroy(); } catch (_cleanupError) { /* Stale load cleanup. */ }
      } else if (loadingTask && activeLoadingTask === loadingTask) {
        try { await loadingTask.destroy(); } catch (_cleanupError) { /* Stale load cleanup. */ }
        activeLoadingTask = null;
      }
      return;
    }
    console.error("Unable to render Mushaf page", requested, error);
    previewError.hidden = false;
    stage.classList.add("is-loaded");
    activePageNumber = requested;
    updateViewerMetadata(requested);
    updateIndexToPage(requested);
    setStatus("Preview unavailable for page " + formatPage(requested));
    exportButton.disabled = true;
    applyCanvasView();
    document.getElementById("retry-page").dataset.page = String(requested);
    announce("The preview could not be rendered. Retry or open the original source file.");
    if (nextDocument && nextDocument !== activeDocument) {
      try { await nextDocument.destroy(); } catch (_cleanupError) { /* Failed document cleanup. */ }
    } else if (loadingTask && activeLoadingTask === loadingTask) {
      try { await loadingTask.destroy(); } catch (_cleanupError) { /* Failed load cleanup. */ }
      activeLoadingTask = null;
    }
  }
}

function renderPageIndex() {
  const start = indexStart;
  const end = Math.min(TOTAL_PAGES, start + INDEX_PAGE_SIZE - 1);
  const fragment = document.createDocumentFragment();
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "page-index-item" + (pageNumber === activePageNumber ? " is-current" : "");
    button.setAttribute("aria-label", "Open page " + pageNumber);
    if (pageNumber === activePageNumber) button.setAttribute("aria-current", "page");
    const small = document.createElement("span");
    small.className = "index-label";
    small.textContent = "PAGE";
    const number = document.createElement("span");
    number.className = "index-number";
    number.textContent = formatPage(pageNumber);
    button.append(small, number);
    button.addEventListener("click", function () { showPage(pageNumber, { scrollToViewer: true }); });
    fragment.appendChild(button);
  }
  pageIndexGrid.replaceChildren(fragment);
  indexRangeLabel.textContent = "Pages " + formatPage(start) + "–" + formatPage(end) + " of " + TOTAL_PAGES;
  indexPageLabel.textContent = "INDEX " + String(Math.floor((start - 1) / INDEX_PAGE_SIZE) + 1).padStart(2, "0") + " / " + String(Math.ceil(TOTAL_PAGES / INDEX_PAGE_SIZE)).padStart(2, "0");
  indexPreviousButton.disabled = start <= 1;
  indexNextButton.disabled = end >= TOTAL_PAGES;
}

function updateIndexToPage(pageNumber) {
  indexStart = Math.floor((pageNumber - 1) / INDEX_PAGE_SIZE) * INDEX_PAGE_SIZE + 1;
  renderPageIndex();
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
    if (Array.isArray(stored)) renderRecentPages(stored.filter(function (n) { return Number.isInteger(n) && n >= 1 && n <= TOTAL_PAGES; }).slice(0, RECENT_LIMIT));
  } catch (_error) { /* The index itself does not depend on storage. */ }
}

function parsePageInput(input) {
  const value = Number.parseInt(input.value, 10);
  if (!Number.isInteger(value) || value < 1 || value > TOTAL_PAGES) {
    input.setAttribute("aria-invalid", "true");
    announce("Enter a page number between 1 and " + TOTAL_PAGES + ".");
    input.focus();
    return null;
  }
  input.removeAttribute("aria-invalid");
  return value;
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function exportCurrentPreview() {
  if (!stage.classList.contains("is-loaded") || !activeCanvas.width || !previewError.hidden) {
    announce("Load a page successfully before exporting its preview.");
    return;
  }
  activeCanvas.toBlob(function (blob) {
    if (!blob) {
      announce("The preview export could not be created.");
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "mushaf-al-madinah-page-" + formatPage(activePageNumber) + "-preview.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 1500);
    announce("PNG preview exported. This is a raster preview, not the original vector file.");
  }, "image/png");
}

async function shareCurrentPage() {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(activePageNumber));
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url.toString());
      announce("A direct link to page " + formatPage(activePageNumber) + " was copied.");
      return;
    }
  } catch (_error) {
    // Fall through to the manual-copy option.
  }
  window.prompt("Copy this link to share the selected page:", url.toString());
}

function toggleNavigation() {
  const button = document.getElementById("nav-toggle");
  const nav = document.getElementById("primary-nav");
  const isOpen = nav.classList.toggle("is-open");
  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

function setupRevealMotion() {
  const elements = document.querySelectorAll(".reveal");
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    elements.forEach(function (element) { element.classList.add("is-visible"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
  elements.forEach(function (element) { observer.observe(element); });
}

function beginPan(event) {
  if (zoomScale <= 1.001 || event.button !== 0 || event.target.closest("button, a, input")) return;
  panStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: panX, panY: panY };
  stage.classList.add("is-panning");
  try { stage.setPointerCapture(event.pointerId); } catch (_error) { /* Pointer capture is optional. */ }
  event.preventDefault();
}

function movePan(event) {
  if (!panStart || event.pointerId !== panStart.pointerId) return;
  panX = panStart.panX + event.clientX - panStart.x;
  panY = panStart.panY + event.clientY - panStart.y;
  applyCanvasView();
}

function endPan(event) {
  if (!panStart || (event && event.pointerId !== undefined && event.pointerId !== panStart.pointerId)) return;
  panStart = null;
  stage.classList.remove("is-panning");
  applyCanvasView();
}

function rerenderOnResize() {
  if (resizeTimer) window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(async function () {
    if (!activeDocument || previewError.hidden === false || !stage.classList.contains("is-loaded")) return;
    const pageToRerender = renderedPageNumber;
    if (!pageToRerender) return;
    const requestVersion = ++loadVersion;
    try {
      const rendered = await renderDocumentPage(activeDocument, pageToRerender, requestVersion, { preserveView: true });
      if (rendered && requestVersion === loadVersion) {
        updateViewerMetadata(pageToRerender);
        setStatus("Page " + formatPage(pageToRerender) + " ready");
      }
    } catch (error) {
      if (requestVersion === loadVersion) {
        console.error("Unable to resize page preview", error);
        setStatus("Page " + formatPage(pageToRerender) + " remains available at the previous size");
      }
    }
  }, 180);
}

function setupEvents() {
  document.getElementById("viewer-jump-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const pageNumber = parsePageInput(viewerPageInput);
    if (pageNumber !== null) showPage(pageNumber);
  });
  document.getElementById("browse-jump-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const input = document.getElementById("browse-page-number");
    const pageNumber = parsePageInput(input);
    if (pageNumber !== null) showPage(pageNumber, { scrollToViewer: true });
  });
  previousButton.addEventListener("click", function () { if (activePageNumber > 1) showPage(activePageNumber - 1); });
  nextButton.addEventListener("click", function () { if (activePageNumber < TOTAL_PAGES) showPage(activePageNumber + 1); });
  indexPreviousButton.addEventListener("click", function () {
    indexStart = Math.max(1, indexStart - INDEX_PAGE_SIZE);
    renderPageIndex();
  });
  indexNextButton.addEventListener("click", function () {
    indexStart = Math.min(Math.floor((TOTAL_PAGES - 1) / INDEX_PAGE_SIZE) * INDEX_PAGE_SIZE + 1, indexStart + INDEX_PAGE_SIZE);
    renderPageIndex();
  });
  exportButton.addEventListener("click", exportCurrentPreview);
  shareButton.addEventListener("click", shareCurrentPage);
  zoomOutButton.addEventListener("click", function () { setZoom(zoomScale - 0.25); });
  zoomInButton.addEventListener("click", function () { setZoom(zoomScale + 0.25); });
  zoomResetButton.addEventListener("click", resetZoom);
  document.getElementById("retry-page").addEventListener("click", function () {
    const pageNumber = Number.parseInt(this.dataset.page, 10) || activePageNumber;
    showPage(pageNumber, { historyMode: "replaceState", force: true });
  });
  fullscreenButton.addEventListener("click", async function () {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.getElementById("page-stage-shell").requestFullscreen();
    } catch (_error) {
      announce("Fullscreen viewing is not available in this browser.");
    }
  });
  stage.addEventListener("pointerdown", beginPan);
  stage.addEventListener("pointermove", movePan);
  stage.addEventListener("pointerup", endPan);
  stage.addEventListener("pointercancel", endPan);
  stage.addEventListener("lostpointercapture", endPan);
  document.getElementById("nav-toggle").addEventListener("click", toggleNavigation);
  document.querySelectorAll("#primary-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      document.getElementById("primary-nav").classList.remove("is-open");
      document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");
      document.getElementById("nav-toggle").setAttribute("aria-label", "Open navigation");
    });
  });
  document.addEventListener("keydown", function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target && target.closest("input, textarea, select, button, a, [contenteditable='true']")) return;
    if (event.key === "ArrowLeft" && activePageNumber > 1) {
      event.preventDefault();
      showPage(activePageNumber - 1);
    } else if (event.key === "ArrowRight" && activePageNumber < TOTAL_PAGES) {
      event.preventDefault();
      showPage(activePageNumber + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      showPage(1);
    } else if (event.key === "End") {
      event.preventDefault();
      showPage(TOTAL_PAGES);
    } else if (event.key === "+" || event.key === "=") {
      setZoom(zoomScale + 0.25);
    } else if (event.key === "-") {
      setZoom(zoomScale - 0.25);
    } else if (event.key === "0") {
      resetZoom();
    } else if (event.key === "Escape" && document.fullscreenElement) {
      document.exitFullscreen().catch(function () {});
    }
  });
  window.addEventListener("popstate", function () {
    const pageNumber = pageFromUrl();
    showPage(pageNumber, { fromPopstate: true, historyMode: "replaceState" });
  });
  window.addEventListener("resize", rerenderOnResize, { passive: true });
  document.addEventListener("fullscreenchange", rerenderOnResize);
  window.addEventListener("pagehide", function () {
    if (activeRenderTask && typeof activeRenderTask.cancel === "function") {
      try { activeRenderTask.cancel(); } catch (_error) { /* no-op */ }
    }
    if (activeLoadingTask && typeof activeLoadingTask.destroy === "function") activeLoadingTask.destroy();
    if (activeDocument && typeof activeDocument.destroy === "function") activeDocument.destroy();
  });
}

setupEvents();
setupRevealMotion();
loadRecentPages();
renderPageIndex();
applyCanvasView();
showPage(pageFromUrl(), {
  initial: true,
  historyMode: "replaceState",
  scrollToViewer: new URLSearchParams(window.location.search).has("page")
});
