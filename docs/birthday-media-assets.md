# Birthday development photography

Eight neutral nature photographs are self-hosted under `frontend/public/photos/`. They are development composition material, not personal photographs or claims about shared memories. The removable `developmentPhotos.ts` module supplies descriptive alt text, dimensions, neutral captions and central focal positions. The owner content adapter can replace these descriptors without changing presentation.

The [official Unsplash license](https://unsplash.com/license), checked 2026-10-08, permits free download and use for commercial and noncommercial purposes. These ordinary Unsplash image-CDN assets are used within a website, not sold as photographs or compiled into a competing image service. No reference-site imagery was used.

| File         | Original source                                              | Dimensions | Bytes  |
| ------------ | ------------------------------------------------------------ | ---------- | ------ |
| photo01.webp | https://images.unsplash.com/photo-1500530855697-b586d89ba3ee | 800×1067   | 210734 |
| photo02.webp | https://images.unsplash.com/photo-1470770841072-f978cf4d019e | 1200×800   | 243958 |
| photo03.webp | https://images.unsplash.com/photo-1470252649378-9c29740c9fa8 | 1200×800   | 248294 |
| photo04.webp | https://images.unsplash.com/photo-1464822759023-fed622ff2c3b | 800×1067   | 218814 |
| photo05.webp | https://images.unsplash.com/photo-1441974231531-c6227db76b6e | 1200×800   | 371108 |
| photo06.webp | https://images.unsplash.com/photo-1519681393784-d120267933ba | 800×1067   | 239168 |
| photo07.webp | https://images.unsplash.com/photo-1501785888041-af3ef285b470 | 1200×800   | 335880 |
| photo08.webp | https://images.unsplash.com/photo-1469474968028-56623f02e42e | 1200×800   | 125262 |

`frontend/scripts/prepare-birthday-media.mjs` reproduces the CDN WebP derivatives with quality 80 and bounded width/height. Natural source colors are preserved; no filters, invented personal captions, or remote runtime dependencies are introduced. All eight downloads were inspected together to confirm meaningful subjects and portrait/landscape variety. Gallery thumbnails lazy-load with explicit dimensions; the dialog loads only its selected photograph.

Each source also has a `photoXX-small.webp` derivative at 600px wide, quality 78. Portrait derivatives are 600×800; landscapes 600×400. The eight small files total 771630 bytes; Gallery uses responsive `srcSet`/`sizes` while the selected lightbox photograph uses the full local derivative.
