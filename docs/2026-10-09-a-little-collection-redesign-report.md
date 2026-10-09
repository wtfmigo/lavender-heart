# A Little Collection Redesign Report

A. Opening composition: large Cormorant title and chapter 03 label, right portrait, overlapping flower detail, neutral introductory copy. Existing cloud-bank artwork creates the lavender atmosphere. Portrait note stays clear of the overlap.

B. Spread 01: large mountain-lake landscape, numbered memory copy, and smaller woodland portrait with generous space.

C. Spread 02: large writing detail, coffee image, supporting lakeside photograph, and a separate numbered note.

D. Spread 03: text and two small ocean/sunlight photographs on the left, large sunset beach on the right. Mobile recomposes these into a vertical sequence.

E. Full-width favorite view: wide lake photograph with a readable scrim and numbered copy. Grid overlay allows long owner captions to grow the image frame instead of colliding with preceding content.

F. Detail collage: five staggered photographs, one restrained rotation, mixed sizes, italic serif notes. Additional owner photos remain available; no photos are dropped.

G. Closing composition: centered label, vertical rule, neutral copy, small outline heart, and soft cloud atmosphere.

H. Heart behavior: existing crystal motif is smaller in the opening, recedes as the spreads begin, and does not cover the cinematic image. A small outline returns at the end. Cloud banks follow scroll with restrained vertical/horizontal parallax, reverse with upward scrolling, and become static when paused or reduced motion is enabled. Existing GSAP context handles cleanup.

I. Desktop QA: rendered scene screenshots inspected at 1440x900 and 1024x768. Photo scale, hierarchy, whitespace, captions, and mixed crops reviewed. Earlier desktop pinning required cloud triggers to be created after pinned chapters; scroll regression checks verify the corrected behavior.

J. Mobile QA: rendered checks at 390x844, 360x844, and 320x844. No horizontal overflow; all sixteen images load and stay within the viewport. Existing lightbox supports keyboard, touch swipes, focus containment, and return focus. A 320px long-caption regression passes.

K. Performance: reuses local WebP cloud banks, smaller mobile cloud asset, responsive photo derivatives, existing fonts, and lazy-loaded images. No dependencies or additional WebGL scenes. Existing large Three.js chunk warning remains; no hardware FPS profiling performed.

L. Tests/build: 134 unit tests pass; lint, production typecheck/build, and changed-file formatting pass. Collection/cloud/lightbox checks pass (10 browser tests); chapter motion/reduced-motion checks also pass (5 browser tests). Five responsive screenshot checks regenerated after final demo-photo refinement. Review completed for spec compliance and code quality, with caption overlap, heart glyph, and long-caption findings fixed.

M. Screenshot paths: docs/evidence/collection-editorial/{1440,1024,390,360,320}-{collection-opening,collection-spread--air,collection-spread--moments,collection-spread--wander,collection-favorite,collection-details,collection-closing}.png. All screenshots use development stock content.

N. Commit: this report is included in the scoped redesign commit; the final chat response records its hash. Work stays in the existing domain-foundation worktree for visual review; no merge or deployment performed.

Owner content: only the existing development fixture's gallery was changed. Personal content is not invented; neutral presentation copy lives in collectionContent.ts, and owner photo captions supply numbered titles and notes. The first caption line serves as the title, subsequent lines as body. Photo ordering assigns editorial roles, and focal points continue to control crops.
