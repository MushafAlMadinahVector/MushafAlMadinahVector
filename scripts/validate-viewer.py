#!/usr/bin/env python3
"""Static integrity checks for the Al-Madinah web viewer enhancements."""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML_FILE = ROOT / "website" / "index.html"
JS_FILE = ROOT / "website" / "app.js"
README_FILE = ROOT / "README.md"

class MarkupAudit(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.tags: list[tuple[str, dict[str, str | None]]] = []
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = dict(attrs)
        self.tags.append((tag, attr))
        if attr.get("id"):
            self.ids.append(str(attr["id"]))
        if tag == "a" and attr.get("href"):
            self.links.append(str(attr["href"]))


def fail(message: str) -> None:
    print("Viewer validation FAILED: " + message, file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    for path in (HTML_FILE, JS_FILE, README_FILE):
        if not path.is_file():
            fail(f"required file is missing: {path.relative_to(ROOT)}")

    html = HTML_FILE.read_text(encoding="utf-8")
    js = JS_FILE.read_text(encoding="utf-8")
    readme = README_FILE.read_text(encoding="utf-8")
    audit = MarkupAudit()
    audit.feed(html)

    duplicates = sorted({item for item in audit.ids if audit.ids.count(item) > 1})
    if duplicates:
        fail("duplicate HTML id(s): " + ", ".join(duplicates))

    ids = set(audit.ids)
    references = set(re.findall(r'getElementById\(["\']([^"\']+)["\']\)', js))
    missing = sorted(references - ids)
    if missing:
        fail("JavaScript references missing element id(s): " + ", ".join(missing))

    required_ids = {
        "page-stage", "page-prev", "page-next", "page-index-grid",
        "zoom-in", "zoom-out", "zoom-reset", "zoom-level",
        "share-page-button", "recent-pages", "recent-page-list", "retry-page",
    }
    absent = sorted(required_ids - ids)
    if absent:
        fail("expected viewer control(s) missing: " + ", ".join(absent))

    required_behaviours = {
        "query-based page links": "searchParams.set(\"page\"",
        "local recent-page history": "al-madinah.recent-pages.v1",
        "zoom and pan": "function beginPan(event)",
        "reduced-motion support": "prefers-reduced-motion",
        "original source URL": "raw.githubusercontent.com/kausikhussain/Al-Madinah/main/quran-pages/",
        "PDF.js worker": "pdf.worker.mjs",
    }
    for label, marker in required_behaviours.items():
        if marker not in js:
            fail(f"required behaviour marker not found: {label}")

    for phrase in ("Direct page links", "Recent pages", "Zoom and pan", "Rights, ownership, and attribution"):
        if phrase.lower() not in readme.lower():
            fail(f"README does not document: {phrase}")

    print(f"Viewer validation passed: {len(ids)} unique IDs, {len(references)} JavaScript element references, and required viewer features documented.")
    print("Static checks do not replace browser-level testing of rendering fidelity or interaction timing.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
