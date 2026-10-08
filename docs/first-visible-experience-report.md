# First Visible Lavender Heart Experience Report

## A. Browser-visible result

Local development preview: http://127.0.0.1:5174/. The Vite server is left running, and a visible Chromium window was launched for review. Hero and Intro consume one isolated development fixture. The production route deliberately shows a preparation page until real API data exists; the demo fixture is absent from the production JavaScript.

## B. Reference study findings from The Diamonds

Inspected https://thediamonds.framer.website/ in Chromium, including its scrolled cloud passage. Its useful design language is oversized split editorial typography, a floating transparent sculpture, low-contrast atmosphere, and foreground cloud occlusion during travel. Lavender Heart uses an original heart, original generated clouds, its approved palette, and its own composition. No reference source or imagery is shipped.

## C. Cloud implementation

Original transparent pearl/ivory clouds with lilac shadows form three desktop depth planes: soft background, surrounding midground, and overlapping foreground. Separate reveal, drift and travel wrappers prevent transform ownership conflicts. Drift takes 30 seconds per direction; foreground travel carries the transition. Mobile displays two planes, smaller WebP imagery, less blur and less parallax. Asset prompt, provenance and font licenses are documented in `visible-experience-assets.md`.

## D. Crystal heart

The primary object is a real Three.js/R3F/Drei sculpture: an original closed curved heart lens with indexed front/back geometry, physical lavender transmission material, restrained roughness and procedural studio lights. It gently floats/rotates, responds minimally to pointer movement, and changes scale, angle and camera depth with scrolling. The geometry is disposed on unmount. An original lightweight faceted SVG preserves the composition during loading, failed creation, unsupported WebGL and context loss. DOM clouds are composited around the sculpture, not physically refracted inside its transmission buffer.

## E. Hero / Intro composition

Desktop uses huge asymmetrical Cormorant Garamond recipient lettering around the sculpture, interleaved with clouds. Mobile places lettering above and below a smaller heart. Long names switch to natural document flow and remain readable through scrolling. Intro uses the supplied neutral statement, generous whitespace and a slightly richer light lavender background, without cards or a night section.

## F. GSAP / scrolling

Scoped GSAP opening, cloud drift, ScrollTrigger travel and Intro masking retain native scrolling and anchors. The nominal opening is about three seconds, with a 3.5-second completion guard and a shorter repeat visit. Canvas initialization begins after the opening overlay disappears: this fixes a measured software-GPU stall that previously prolonged the opening. Lightweight heart identity remains visible while the scene initializes. Timers, media queries, observers, listeners and animations clean up on unmount or motion changes.

## G. Responsive QA

Rendered QA covers 1440×900, 1024×768, 390×844, 320/360/375/414×844 and 768×1024. Checked sculpture, layered clouds, overlaps, typography, travel and Intro. No horizontal overflow or unexpected browser errors were recorded across these eight viewport compositions. A long supplied name was also checked at desktop/mobile, including a full-motion 320×640 browser regression.

## H. Reduced motion

Live `prefers-reduced-motion` updates remove the opening delay, sticky travel, cloud drift, pointer response and idle heart movement. Static clouds and the heart remain visible. An accessible pause/resume control also stops ongoing motion; operating-system reduced motion still takes precedence.

## I. Accessibility

Semantic main/headings/navigation, skip link, visible keyboard focus, native Home/Intro anchors, decorative image/canvas treatment, readable tokens and 44px motion control targets are present. Navigation hides on downward travel, returns upward, and remains visible while focus is inside. No unfinished links or unnecessary mobile drawer were added. Full assistive-technology testing was not performed.

## J. Performance observations

No dependency was added. Desktop cloud WebP is 254,270 bytes; mobile is 77,252 bytes. Fonts are self-hosted. Canvas is lazy, mobile DPR is capped at 1.25 versus 1.75 desktop, studio environment resolution is 128, and offscreen/hidden/reduced scenes use demand rendering. Frame updates mutate Three.js objects instead of React state. Viewport emulation verifies composition, not physical phone GPU performance. Upstream Three.js deprecation warnings remain; forced WebGL failure emits expected renderer errors that the fallback catches.

## K. Hallmark findings/fixes

The audit rejects SaaS cards, CTA hero buttons, pills, neon, generic blobs and gradient lettering. Fixed the initially broad flat glass face, oversized phone heart, premature long-name masking, small narrow-screen motion target, skip-link destination, incomplete geometry cleanup and opening GPU timing. Final spec review preceded code-quality/React/accessibility review; the independent reviewer reported no remaining blockers.

## L. Tests/build

Final verification passed: `npm.cmd run typecheck`, `lint`, `format:check`, `test` (100 tests in seven files), `build`, and `e2e` (13 tests). Browser coverage includes cloud travel, focus protection, motion pause, live reduced motion, forced WebGL failure, context loss, responsive anchors and long names. Existing Laravel health and development smoke tests pass. Production JavaScript contains neither the recipient demo value nor its fixture module.

## M. Screenshot paths

Evidence is in `docs/evidence/visible-experience/`: `hero-1440.png`, `transition-desktop.png`, `intro-1440.png`, `hero-390.png`, `intro-390.png`. Additional widths, reduced motion, fallback, long names and machine-readable `qa-results.json` are included. These are actual rendered screenshots, not image-generator mockups.

## N. Commits

The implementation and evidence are committed as two local checkpoints on `feat/domain-foundation`. Use `git log -2 --oneline` for their exact hashes; both descend from the unchanged A3 checkpoint `f94a37dfd4942931a2141573dd5bc4c82c787d51`.

## O. Scope confirmation

Backend and domain model/schema files are unchanged. A1/A2/A3 history remains intact. No remaining chapters, authentication, admin, upload/media pipeline, revisions, Trash or backup work was implemented. No merge, push, remote creation or deployment occurred. Work stops here for the user's visual review.
