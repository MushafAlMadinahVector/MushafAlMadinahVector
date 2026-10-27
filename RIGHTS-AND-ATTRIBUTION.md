# Rights and attribution

This repository contains more than one kind of material. The rights applicable to the original Mushaf page artwork are different from those applicable to the independently authored web interface.

## Original Mushaf vector artwork

The `quran-pages/` directory contains original Adobe Illustrator (`.ai`) files for the Mushaf Al-Madinah vector edition in the Hafs narration. These assets are attributed to the **King Fahd Glorious Quran Printing Complex (KFGQPC)**, Al-Madinah Al-Munawwarah, Kingdom of Saudi Arabia.

Official references:

- Publisher website: <https://dm.qurancomplex.gov.sa/>
- Published usage rights: <https://dm.qurancomplex.gov.sa/rights/>
- Technical information: <https://dm.qurancomplex.gov.sa/techinfo/>

The publisher's usage-rights page states that its digital vector edition may be used free of charge in a range of personal, institutional, publishing, website, and software contexts. It also identifies restrictions related to commercial printing of physical Mushaf copies in Saudi Arabia and importing them from abroad for commercial sale. Consult the official terms for the full, current wording and any use-specific requirements.

The repository's source notice also instructs that Quranic content must not be modified. Accordingly, this project's tooling must preserve the original `.ai` files and write any previews or conversions separately. A converted preview is not a replacement for the original source.

## Website code

The `website/LICENSE` file applies only to the independently authored files in `website/` (HTML, CSS, JavaScript, and favicon). It does not apply to `quran-pages/`, the Quranic artwork, or any third-party libraries loaded from a CDN.

## No official affiliation

The website is an independent community-built interface. It is not operated, certified, or endorsed by KFGQPC unless the publisher separately confirms such a relationship. Attribution does not imply endorsement.

## Practical guidance for contributors

- Do not alter, regenerate, OCR-reconstruct, or replace the original Quranic artwork.
- Do not overwrite `.ai` files with converted output.
- Keep derived previews in a separate directory if a future build step requires them.
- Preserve source links and attribution in the website and documentation.
- Verify any new font, icon, library, or media asset under its own terms.
- Do not assume the website-code license grants rights to the underlying Mushaf artwork.

This document summarizes repository intent; it is not legal advice. When a proposed use is outside the official published terms or is otherwise unclear, obtain clarification from the publisher before proceeding.
