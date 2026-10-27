# Upgrade Notes — Al-Madinah Premium Viewer

## Added in this refinement

- Zoom controls from 100% to 250%, Fit/Reset, and drag-to-pan for magnified page inspection.
- Direct page URLs using `?page=N`; the viewer restores shared page links and uses browser history for navigation.
- A small, locally stored list of recently viewed pages. This information stays in the current browser's local storage and is not sent to a backend.
- A retry action when a source page cannot be loaded.
- Loading progress reporting when the remote asset reports a content length.
- Cancellation and stale-request safeguards for rapid page changes.
- Re-rendering after viewport/fullscreen size changes while preserving the user's zoom where possible.
- Page-index range synchronization after navigation.
- A static viewer validation script and an added CI validation step.
- Documentation for the new controls and safe overlay installation.

## Source integrity

The public repository inventory was checked for the expected sequence of 604 source filenames, from `001___Hafs39__DM.ai` through `604___Hafs39__DM.ai`, with no missing numeric filename in that listing. The original source assets are intentionally not packaged here; overlay these files onto the existing repository and keep `quran-pages/` unchanged.

The viewer reads the original source file as a browser-rendering input and displays a canvas preview. The preview is not a semantic Quranic text layer and does not replace the original vector file.

## Verification performed for this package

- JavaScript syntax check (`node --check website/app.js`)
- HTML/static asset check (`scripts/validate-html.py`)
- Viewer-control wiring and documentation check (`scripts/validate-viewer.py`)
- Source-asset validator exercised against a small synthetic test fixture
- GitHub directory listing checked for the 604 expected source filenames

A full browser interaction/render-fidelity test against all 604 assets was not completed in this environment. Before publishing, run the site in a real browser, inspect the console, and visually compare representative source pages—especially dense pages with diacritics and decorative marks.
