# Lavender Heart — Cinematic Parallax Redesign Report

October 10, 2026. Public frontend only, on `feat/domain-foundation`. Latest owner corrections take precedence over the earlier mockup's varied mounts and oversized feature.

## A. Confirmed problems and root causes

The owner's original MP4 shows weak scene differentiation, nearly static heart response, oversized Timeline years, and Timeline entries without assigned photos. A shared Story grid override flattened the intended compositions. Raw page progress diluted heart rotation across long pinned travel. Fixed image heights combined with constrained widths produced ivory letterboxing; the video-call figure also stretched beyond its narrow image. The Gallery feature depended on an array position, so removing its photo promoted another photo into the oversized slot. Details followed natural aspect ratios and staggered placement, producing unequal heights.

## B. Horizontal Story

Restored four distinct portrait, wide, date, and cinematic compositions. Each photo and its associated title/message enter together through a reversible directional curtain. Scene atmosphere moves independently. The existing single pinned track still uses measured overflow for travel, with no extra pin duration. All eight Story objects, captions, dates, photo associations and order match the previous commit exactly.

## C. Frames

All Story, Collection and Timeline photo mounts use 4px ivory padding and a 1px pearl border. Timeline frames follow the image's actual proportions and stay centered, with a 420px maximum image height. Desktop wide Story photos size naturally inside their available space, eliminating internal letterboxing.

The owner explicitly requested equal-sized detail tiles: those thumbnails now use 3:4 with focal-position-aware `object-fit: cover`. Their full originals remain available in the lightbox. Other editorial photos retain natural proportions.

## D. A Little Collection

Kept the lavender cloud opening, oversized display heading, alternating large anchors and smaller supporting photos. Removed the entire oversized feature slot. Moved its night couple photo to Timeline; no replacement photo is enlarged automatically. All 20 remaining Collection photos appear once and in their existing order.

Details form three columns and three rows per group on desktop. A remaining single tile is centered; two remaining tiles form a centered pair. Mobile uses two equal columns with an odd final tile centered. Equal tile dimensions align captions across each row.

## E. Choreography by chapter

| Chapter | Final behavior |
| --- | --- |
| Home | Existing title/cloud depth with bounded sculptural heart response |
| Intro | Large headline curtain, calm paragraph reveal |
| Horizontal Story | Photo/copy curtains, varied compositions, independent cloud depth |
| Full Memory | Whole image plane scales and translates beneath its existing title |
| Collection | Shared photo/note reveal per spread; cloud passage and framed detail entrances |
| Love | Existing measured statement sequence with headline curtains |
| Timeline | Centered compact dates, framed photo entrances, centered captions |
| Letter | Readable paragraph reveals and restrained heading motion |
| Finale | Existing recipient, heart and signature; previously removed closing prose stays removed |

## F. Heart

Progress follows measured chapter anchors, including pinned Story travel, rather than raw page percentage. Smooth interpolation targets yaw between −0.42 and +0.38 radians, plus a small ±0.012 idle sway. R3F damping drives modest tilt and roll from the same target. Geometry, material, camera, scale system and chapter placement remain intact. Rendered silhouette tests check all nine depths and reverse travel, including meaningful first/middle/last Story changes without an edge-on heart.

## G. Story exit

The existing Full Memory chapter supplies the payoff immediately after measured horizontal travel ends. Its whole image plane adds depth beneath the existing personal photo/title. No new chapter, duplicate memory or extra empty pin was added. Pin measurement completes before downstream depth triggers are created.

## H. Visual QA

Inspected browser captures at 1440×900, 1024×768, 390×844, 360×844 and 320×844. Checked Story scenes, reverse travel, slow and fast wheel movement, exit, Collection opening/spreads/details/closing, Timeline photos, Letter and Finale. All required captures show no document horizontal overflow. Browser photo regressions additionally cover 1864, 768, 414 and 375px.

Timeline now centers the selected night couple photo with “One of my favorite photos of us.” and the exact `IMG_3772.JPG` video-call original with “So pretty, even through a screen.” All three oversized Timeline years are gone; date metadata remains. Independent spec and code reviews found no outstanding confirmed source issue. Two refinement passes corrected frame bulk, feature promotion and unequal detail heights.

## I. Performance

Reused existing GSAP context, Lenis ticker and R3F frame ownership. Scroll progress updates refs rather than React state. No new dependencies or additional pinning. Production build succeeds; its existing lazy Three.js scene is approximately 984kB minified / 266kB gzip and still triggers the bundle-size warning. Cold lazy photo decoding can briefly show a mount before its image; loaded-photo regressions verify every original resolves. No physical-phone frame-rate claim is made.

## J. Accessibility

Retained semantic chapter headings, date metadata, photo descriptions, native dialog lightbox, keyboard controls, focus restoration and visible focus styling. Reduced motion and the pause control remove animated travel and expose reading content in vertical flow. Existing WebGL failure/context-loss fallbacks remain covered by browser tests. Review used the project's installed skills and the [Vercel interface guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## K. Verification

All six gates passed: typecheck, lint, formatting, 140 unit tests, production build and all 77 browser tests. The full browser run passed 73 tests; four stale tests assumed 21 Gallery photos or photo-free real Timeline entries. Updated their count/explicit text-only fixtures and reran those four successfully with `npm.cmd run e2e -- --last-failed --workers=1`. No application code changed after the full run. Lint and formatting passed again after the fixture updates. Meaningful regressions first reproduced the year labels, feature promotion, depth measurement and unequal detail dimensions before their fixes.

## L. Screenshots

Private evidence is intentionally ignored by Git. [Original recording frames](evidence/visual-quality/reference/) document the supplied before state. Final contact sheets: [desktop](evidence/visual-quality/final/contact-1440.png), [tablet](evidence/visual-quality/final/contact-1024.png), [390px](evidence/visual-quality/final/contact-390.png), [360px](evidence/visual-quality/final/contact-360.png), [320px](evidence/visual-quality/final/contact-320.png).

Detailed examples: [equal detail tiles](evidence/visual-quality/final/after-details-1440.png), [centered video call](evidence/visual-quality/final/after-timeline-call-1440.png), [last Story scene](evidence/visual-quality/final/after-story-1024-7.png).

## M. Recordings

Before: owner's original `lavender-heart/PICS/Lavender Heart - Brave 2026-10-10 10-36-29.mp4` (39.49 seconds). After: [final browser recording](evidence/visual-quality/final/scroll-review-1440.webm). Both were decoded through uninterrupted real-time playback to their end; inspected sampled consecutive playback frames rather than relying solely on static endpoint screenshots. [Before playback sequence](evidence/visual-quality/playback/before-contact.png) and [after playback sequence](evidence/visual-quality/playback/after-contact.png) record that review.

## N. Commits

`ac7d52a` — cinematic choreography, bounded heart response, owner-selected Timeline photos, uniform borders, equal 3×3 details and regression coverage. The following documentation commit contains this report, approved execution record and reproducible capture script. No push, merge or deployment.

## O. Remaining limits

Physical-device GPU performance and other browser engines were not measured. The external Framer reference was unavailable through the web tool; used the supplied approved inline mockup and local MP4. The Impeccable CLI engine was unavailable; applied installed visual-review guidance manually. Personal originals and QA media remain local and ignored; any future deployment must include the existing photo assets. No backend/admin change was made.
