# Personal photographs - October 10, 2026

User approved placing the photos from the local PICS folder, preserving landscape and portrait frames. Originals remain untouched. The active frontend uses 27 unique photographs; the excluded phone-gallery screenshot duplicates IMG_6732.

Historical insertion report. The repeated placements and layout below were superseded by [the layout repair](2026-10-10-layout-repair.md).

## Confirmed placements

- IMG_0516: first meet, May 18, 2025; Story, Gallery and Timeline.
- IMG_0085: Tagaytay trip, May 29, 2025; Story and Gallery.
- IMG_0100: Hiraya mirror photograph, May 29, 2025; Story, featured Memory, Gallery and Timeline.
- July 17, 2025: text-only in Story and Timeline because the owner has no photograph from that day.
- Remaining photographs: general undated memories in the Gallery. No dates or new events inferred from image metadata. Food and coffee story entries remain text-only rather than attaching an unconfirmed photograph.

## Media and layout

Browser-compatible JPEG copies include all three HEIC originals, with a 1600px longest-edge maximum and 600px-wide gallery derivatives. Conversion corrects EXIF orientation, keeps original aspect ratios and strips camera metadata. Originals are retained in PICS. All 27 photographs have descriptive alt text. Full-frame contain layouts and image ratio reservations preserve faces and prevent lazy-loading layout collapse. Image zoom/parallax is skipped for personal photos; existing frame reveals and cloud motion remain. The featured portrait has a separate text area. Extra collage photos no longer use negative margins that cover previous images.

Personal derivatives are local files in frontend/public/photos/personal, excluded from Git to keep photo binaries out of source control. A clean clone or later deployment MUST also copy this directory. JSON references alone do not contain the photos. No deployment performed.

## Verification

135 unit tests passed, including regression protection against personal image zoom. Five browser checks cover all real photos at 1440px, 768px and 390px, plus keyboard/touch lightbox controls and the text-only July 17 milestone. Lint, TypeScript/production build and changed-file formatting checks passed. Actual local screenshots of featured Memory, Gallery, collage and Timeline inspected. Screenshots remain in ignored test-results, not committed as personal-content examples. Spec-compliance and code-quality review reported no blockers.

The existing large Three.js bundle warning remains. No physical-phone performance profiling or public deployment performed.
