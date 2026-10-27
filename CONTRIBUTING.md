# Contributing

Thank you for helping improve the Al-Madinah vector viewer. This project combines a modern interface with source artwork that must be treated carefully.

## Before you begin

1. Read [Rights and attribution](RIGHTS-AND-ATTRIBUTION.md).
2. Check whether an issue or pull request already covers the same problem.
3. Keep changes focused and describe the user-visible or technical improvement.
4. Do not modify or replace files in `quran-pages/` as part of frontend work.

## Local setup

Requirements: Python 3 and a modern browser. PDF.js and source-page files are loaded from external URLs, so an internet connection is required for the page preview.

From the repository root:

```bash
python -m http.server 8000 --directory website
```

Open <http://localhost:8000>.

## Checks before opening a pull request

```bash
node --check website/app.js
python scripts/validate-html.py
python scripts/validate-viewer.py
python scripts/validate-assets.py
```

For a change to rendering or page navigation, test multiple pages, including the first page, a middle page, and the final page. Check desktop and mobile layouts, previous/next navigation, URL-based direct links, browser Back/Forward, recent-page return, zoom/pan/Fit, fullscreen resize, the original-file link, PNG preview export, reduced-motion behavior, and keyboard access. Confirm that rapid page changes cannot leave a stale page rendered as the selected page.

## Source-artwork integrity

- The `.ai` source files must remain unchanged.
- Do not reconstruct the Quranic content from OCR or generated text.
- If creating previews, place them in a separate output directory and retain a traceable relationship to the original source filename.
- Compare converted output visually with the original before claiming fidelity.
- Never report that all pages were checked if only a sample was inspected.

## Pull-request expectations

Include:
- A clear summary of the change
- The reason for the change
- Screenshots for significant visual changes
- Commands and tests actually run
- Any known limitation, especially around rendering or accessibility
- Confirmation that original source artwork was not altered

Keep UI changes respectful and restrained. The content should remain the focus; animation must never obscure the page or delay navigation.
