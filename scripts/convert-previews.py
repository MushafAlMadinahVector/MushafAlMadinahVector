"""
Convert official Mushaf Al-Madinah .ai vector files into clean SVG derivatives.
Preserves original source assets intact and isolates output to public/previews/.
Uses PyMuPDF (fitz) for vector-perfect conversion of the embedded %PDF-1.5% streams.
"""

import os
import sys
import glob

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

def convert_all():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_dir = os.path.join(root, 'quran-pages')
    output_dir = os.path.join(root, 'public', 'previews')

    if not os.path.isdir(source_dir):
        print(f"Error: Source directory {source_dir} not found.", file=sys.stderr)
        sys.exit(1)

    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("Error: PyMuPDF (fitz) is not installed in Python.", file=sys.stderr)
        sys.exit(2)

    os.makedirs(output_dir, exist_ok=True)
    pattern = os.path.join(source_dir, '*___Hafs39__DM.ai')
    files = sorted(glob.glob(pattern))

    if not files:
        print(f"No files matching *___Hafs39__DM.ai found in {source_dir}.", file=sys.stderr)
        sys.exit(1)

    print(f"Starting conversion of {len(files)} file(s) to vector SVG...")
    failures = 0
    converted = 0

    for ai_path in files:
        filename = os.path.basename(ai_path)
        base = os.path.splitext(filename)[0]
        out_path = os.path.join(output_dir, base + '.svg')

        try:
            doc = fitz.open(ai_path)
            if len(doc) == 0:
                raise ValueError("Empty document")
            page = doc[0]
            svg_data = page.get_svg_image()
            if not svg_data or len(svg_data) < 100:
                raise ValueError("Generated SVG is invalid or too small")
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(svg_data)
            converted += 1
            print(f"  [OK] {filename} -> {os.path.basename(out_path)} ({len(svg_data):,} bytes)")
        except Exception as e:
            failures += 1
            print(f"  [FAIL] {filename}: {e}", file=sys.stderr)

    print(f"\nConversion finished: {converted} succeeded, {failures} failed.")
    if failures > 0:
        sys.exit(1)

if __name__ == '__main__':
    convert_all()
