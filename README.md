# Al-Madinah — Vector Edition

**A carefully designed, independent web viewer for the Mushaf Al-Madinah vector pages.**

The repository preserves the original Adobe Illustrator (`.ai`) page files and adds a lightweight browser experience for navigating and previewing them. The interface is independent of the official publisher; the original artwork remains attributed to the **King Fahd Glorious Quran Printing Complex (KFGQPC)**.

<p align="center">
  <a href="https://dm.qurancomplex.gov.sa/">Official source</a> ·
  <a href="https://dm.qurancomplex.gov.sa/rights/">Official usage rights</a> ·
  <a href="https://github.com/kausikhussain/Al-Madinah">Repository</a>
</p>

> **Important:** The source Quranic artwork is not modified by the viewer. The browser preview is a convenience layer; use the original `.ai` file when the vector source itself is required. This project is not an official KFGQPC website and does not imply endorsement.

## The experience

The website in [`website/`](website/) is a static, responsive interface featuring:

- **Page viewer:** Render a selected original page in the browser using PDF.js. The `.ai` files in this edition contain PDF-compatible data; browser rendering is best-effort and may vary by file or browser.
- **604-page index:** Navigate by page number, use previous/next controls, or select a page from the paginated index. The index follows the currently selected page.
- **Direct page links:** The selected page is reflected in the URL (`?page=42`), so a particular page can be shared and reopened directly.
- **Recent pages:** The last six successfully viewed pages are stored locally in the current browser for convenient return. This history is not sent to a server.
- **Zoom and pan:** Zoom the page from 100% to 250%, drag to inspect a magnified area, and use Fit to reset the view.
- **Original-source access:** Open the selected page's original AI file from this repository.
- **PNG preview export:** Export the fitted canvas preview for reference. This is a raster preview, not a replacement for the vector source.
- **Keyboard navigation:** Use left/right arrows for previous/next, Home/End for first/last page, `+`/`=` and `-` for zoom, and `0` to fit. Shortcuts are disabled while typing in form controls.
- **Responsive rendering:** Re-render the selected page when the viewer changes size, including fullscreen entry/exit. The zoomed page remains pannable and reduced-motion preferences are respected.
- **Source and rights visibility:** Direct links to the publisher's website and published usage-rights page.

The viewer loads only the requested page instead of downloading all 604 source files at startup. PDF.js and web fonts are loaded from external CDNs, and original page files are fetched from this repository's `main` branch. A direct-link query parameter restores the requested page on first load. The viewer makes no claims that a canvas preview is a semantic or accessible transcription of Quranic text.

## Preview the website locally

No build tool or package installation is required. Python 3 is sufficient to serve the static site.

From the repository root:

```bash
python -m http.server 8000 --directory website
```

Open <http://localhost:8000> in a modern browser. Serve the site over HTTP rather than opening `index.html` with a `file://` URL; browser module imports and document fetching require a web origin.

For this local preview, the page viewer still fetches original `.ai` files from the repository's public `main` branch. It therefore requires an internet connection. The most recently visited pages are stored in this browser only; clearing local site data removes that history.

## Publish with GitHub Pages

The workflow at [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) deploys only `website/`—not the large source-artwork directory—so the 604 source files do not have to be copied into the Pages artifact.

One-time repository setup:

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push or merge a change to `main`, or start the deployment workflow manually under **Actions**.
4. Open the URL shown in the successful `Deploy to GitHub Pages` workflow run.

The deployed interface reads the page assets from `https://raw.githubusercontent.com/kausikhussain/Al-Madinah/main/quran-pages/`. If the source repository or branch is renamed, update `SOURCE_BASE` in `website/app.js`.

## Repository layout

```text
.
├── quran-pages/                 # Original Mushaf Al-Madinah AI files; preserve unchanged
├── website/
│   ├── index.html                # Accessible page structure and navigation
│   ├── styles.css                # Responsive design system and visual styling
│   ├── app.js                    # PDF.js renderer, page navigation, export and interactions
│   ├── favicon.svg               # Interface favicon; not part of the Quranic artwork
│   └── LICENSE                   # MIT license scoped to website code only
├── scripts/
│   ├── validate-viewer.py          # Checks viewer control wiring and key documentation
│   ├── validate-assets.py        # Checks the expected source-page filenames and file signatures
│   └── validate-html.py          # Basic static checks for the website markup
├── .github/workflows/
│   ├── validate.yml              # Syntax and asset-integrity checks
│   └── deploy-pages.yml          # Static GitHub Pages deployment
├── LICENSE                      # Usage notice scoped to original source artwork
├── RIGHTS-AND-ATTRIBUTION.md     # Rights scope and attribution guidance
└── CONTRIBUTING.md               # Contribution workflow and integrity checklist
```

## Source assets

The current repository contains 604 files in `quran-pages/`, named with a pattern similar to:

```text
001___Hafs39__DM.ai
002___Hafs39__DM.ai
003___Hafs39__DM.ai
...
604___Hafs39__DM.ai
```

Run the source integrity check from the repository root:

```bash
python scripts/validate-assets.py
```

The check verifies the expected page-number sequence, file presence, non-empty files, and the PDF-compatible header used by the browser renderer. It does **not** prove the calligraphy is correct; content fidelity still requires visual comparison with the source and publisher's reference.

## Rights, ownership, and attribution

- Original Mushaf vector artwork is attributed to the King Fahd Glorious Quran Printing Complex. The Complex retains the intellectual-property rights identified in its published terms.
- The Complex publishes a free digital vector edition for a range of personal, institutional, printing, publishing, web, and software uses. Specific restrictions apply to commercial printing and importing physical Mushaf copies for commercial sale in Saudi Arabia. Read the official terms before use: [KFGQPC usage rights](https://dm.qurancomplex.gov.sa/rights/).
- The Quranic source artwork must not be edited or replaced by generated or reconstructed text in this project. Keep converted previews separate from the original `.ai` files.
- [`website/LICENSE`](website/LICENSE) applies only to the independently authored website code in `website/`. It does not apply to `quran-pages/`, the original Quranic artwork, or third-party components.
- The root [`LICENSE`](LICENSE) records the source-artwork notice. It is not a blanket open-source license for all content in the repository.

## Accessibility and limitations

The current viewer renders a page as a visual canvas. It does not provide semantic, searchable Quranic text or a screen-reader transcription of the page artwork. PDF.js, fonts, and source files need a network connection. Browser compatibility and rendering details can vary; if a page cannot be rendered, the interface provides a link to its original source file.

## Upgrade and contribution guides

- [Apply the premium viewer upgrade safely](APPLY-UPGRADE.md) — overlay instructions; keep `quran-pages/` untouched.
- [Upgrade notes and verification status](UPGRADE_NOTES.md) — recent improvements and what was actually checked.

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting changes. In particular, keep original source files untouched, preserve attribution, and test representative pages after any renderer or asset-pipeline change.

## Arabic — نبذة عن المشروع

يوفّر هذا المستودع واجهة مستقلة لتصفح ومعاينة ملفات مصحف المدينة النبوية المتجهية برواية حفص. تبقى ملفات المصدر الأصلية كما هي دون تعديل لمحتوى القرآن الكريم، وتعود حقوقها الفكرية إلى مجمع الملك فهد لطباعة المصحف الشريف وفق شروط الاستخدام المنشورة من المجمع.

- [المصدر الرسمي](https://dm.qurancomplex.gov.sa/)
- [حقوق الاستخدام الرسمية](https://dm.qurancomplex.gov.sa/rights/)
- [سياسة المساهمة](CONTRIBUTING.md)

هذه الواجهة مشروع مستقل وليست موقعًا رسميًا للمجمع ولا تعني وجود اعتماد أو تأييد رسمي. المعاينة داخل المتصفح هي صورة مرئية للصفحة، ولا تستبدل ملف المتجه الأصلي.

---

*Built with care. Original source artwork preserved separately.*
