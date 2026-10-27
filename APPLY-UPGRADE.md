# Applying the Al-Madinah Premium Upgrade

This archive is an **overlay package**, not a replacement copy of the complete repository. It intentionally does not include the 604 original `.ai` files in `quran-pages/` because those files are large source assets and should remain exactly where they are.

## Apply it safely

1. Make a backup of your existing repository or create a new Git branch.
2. Extract this archive into the root of your existing `Al-Madinah` clone.
3. Merge the included files into the matching paths and allow the updated website, documentation, scripts, and workflows to replace their older versions.
4. **Do not delete or replace `quran-pages/`.** The viewer expects the existing source assets to remain in that directory.
5. Run the checks below from the repository root.
6. Preview the website locally and inspect the browser console before committing.

## Validate

```bash
node --check website/app.js
python scripts/validate-html.py
python scripts/validate-viewer.py
python scripts/validate-assets.py
```

The final command should pass only when the original `quran-pages/` directory is present. It validates filenames and file signatures; it does not verify all calligraphy visually.

## Preview locally

```bash
python -m http.server 8000 --directory website
```

Open `http://localhost:8000` in a browser. A network connection is required because PDF.js and source files are fetched from public URLs.

## Commit the upgrade

```bash
git status --short
git diff --check
git add README.md CONTRIBUTING.md LICENSE RIGHTS-AND-ATTRIBUTION.md APPLY-UPGRADE.md UPGRADE_NOTES.md website scripts .github/workflows
git commit -m "feat: enhance Al-Madinah page viewer"
```

Review `git status` before pushing. Confirm that the original `.ai` source files have not changed.
