#!/usr/bin/env python3
"""Basic static checks for the website's HTML ids and local asset references."""
from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
HTML_FILE = ROOT / "website" / "index.html"


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.fragments: list[tuple[str, str]] = []
        self.local_assets: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            self.ids.append(element_id)
        for attr in ("href", "src"):
            value = values.get(attr)
            if not value:
                continue
            if value.startswith("#") and len(value) > 1:
                self.fragments.append((tag, value[1:]))
            elif attr in {"href", "src"} and not value.startswith(("https://", "http://", "data:", "mailto:", "tel:", "#")):
                self.local_assets.append((tag, value))


def main() -> int:
    if not HTML_FILE.is_file():
        print(f"ERROR: missing {HTML_FILE}", file=sys.stderr)
        return 1
    source = HTML_FILE.read_text(encoding="utf-8")
    parser = SiteParser()
    parser.feed(source)
    errors: list[str] = []
    duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    if duplicates:
        errors.append("duplicate HTML ids: " + ", ".join(duplicates))
    id_set = set(parser.ids)
    missing_fragments = sorted({fragment for _, fragment in parser.fragments if fragment not in id_set})
    if missing_fragments:
        errors.append("missing internal fragment targets: " + ", ".join(missing_fragments))
    for tag, raw_path in parser.local_assets:
        clean_path = urlsplit(raw_path).path
        if not clean_path or clean_path.startswith("/"):
            continue
        candidate = (HTML_FILE.parent / clean_path).resolve()
        if not candidate.exists():
            errors.append(f"missing local {tag} reference: {raw_path}")
    if errors:
        print("HTML validation FAILED:")
        for error in errors:
            print(" - " + error)
        return 1
    print(f"HTML validation passed: {len(parser.ids)} ids, {len(parser.fragments)} internal links, local assets checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
