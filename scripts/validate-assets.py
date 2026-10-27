#!/usr/bin/env python3
"""Validate the expected original Mushaf page-file sequence without changing it."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

TOTAL_PAGES = 604
PATTERN = "{page:03d}___Hafs39__DM.ai"
PDF_HEADER = b"%PDF-"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1], help="Repository root")
    parser.add_argument("--expected-pages", type=int, default=TOTAL_PAGES, help="Expected number of page files")
    parser.add_argument("--allow-partial", action="store_true", help="Allow validating only present files on local/partial clones")
    args = parser.parse_args()

    pages_dir = args.root / "quran-pages"
    if not pages_dir.is_dir():
        print(f"ERROR: source directory not found: {pages_dir}", file=sys.stderr)
        return 1

    errors: list[str] = []
    checked_count = 0

    for page in range(1, args.expected_pages + 1):
        path = pages_dir / PATTERN.format(page=page)
        if not path.is_file():
            if not args.allow_partial:
                errors.append(f"missing page {page:03d}: {path.name}")
            continue
        checked_count += 1
        if path.stat().st_size == 0:
            errors.append(f"empty source file: {path.name}")
            continue
        try:
            with path.open("rb") as handle:
                header = handle.read(len(PDF_HEADER))
        except OSError as exc:
            errors.append(f"cannot read {path.name}: {exc}")
            continue
        if header != PDF_HEADER:
            errors.append(f"unexpected header in {path.name}: expected PDF-compatible AI source")

    actual_files = sorted(path.name for path in pages_dir.glob("*.ai"))
    expected_names = {PATTERN.format(page=page) for page in range(1, args.expected_pages + 1)}
    unexpected = sorted(set(actual_files) - expected_names)
    if unexpected:
        errors.append("unexpected .ai files: " + ", ".join(unexpected[:12]))

    if errors:
        print("Source asset validation FAILED:")
        for error in errors:
            print(" - " + error)
        return 1

    summary = f"{checked_count}/{args.expected_pages}" if args.allow_partial else f"{args.expected_pages}"
    print(f"Source asset validation passed: {summary} non-empty page files with expected names and PDF-compatible headers.")
    print("This check verifies file structure only; it does not certify Quranic content accuracy.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
