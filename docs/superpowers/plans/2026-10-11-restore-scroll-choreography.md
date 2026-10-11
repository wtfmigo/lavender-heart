# Restore scroll choreography implementation plan

> Execute within the existing approved worktree and the owner's explicit request to restore all animations and optimize them.

**Goal:** Restore the approved opening, cloud/text parallax, masks, photographic depth, horizontal Story scene reveals, chapter heart travel and animated finale at every viewport size.

**Architecture:** Reuse the installed GSAP/ScrollTrigger and the original effects from `85b6ecc`. Keep native wheel/touch scrolling and the current calibrated sticky horizontal Story; remove competing CSS chapter animation ownership. Use scoped GSAP cleanup and coalesced measurement refreshes, never an observer that refreshes on its own animated dimensions. Keep the fixed GPU render budget, reserved image dimensions, accessibility pause/reduced motion, removed cloud-only passages, and current sphere design.

**Tech stack:** React, existing GSAP + ScrollTrigger, R3F, CSS sticky layout, Playwright, Vitest.

- [x] Add failing rendered regression checks for original cloud transform, masks, zoom and live finale at desktop, phone/tablet portrait and landscape.
- [x] Restore `src/animations/gsap/useExperienceAnimation.ts` and a bounded `useJourneyAnimation.ts`; connect `PublicExperiencePage.tsx` and `journey.css`. Preserve existing `useHorizontalStory` and `useReadingPosition` calibration. Restore the source-of-truth motion descriptions that the previous fix incorrectly weakened.
- [x] Update superseded animation tests to verify the restored behavior, retain native-scroll/resize/photo dimensions regressions, and verify pause cleanup. No backend or data changes, no new dependency.
- [x] Run focused Brave tests, unit suite, lint, type/build and formatting; obtain separate spec and quality reviews and fix findings. Physical phones/tablets remain outside local browser emulation coverage.

**Rollback:** Restore the previous commit's frontend files if verification identifies a regression; do not discard independent user changes.

**Owner refinement during execution:** Use full horizontal heart turns tied to scroll with stable X/Z tilt, and continuous photo-frame parallax beyond the entrance. Mathematical and rendered side/front regressions verify the turn and reversal; the resume regression prevents replaying accumulated turns. Explicit zero X/Y translation before centering avoids carrying the previous CSS offset into the stable scaled frame.

**Resize correction:** Scoped per-trigger refresh replaces the global refresh that reset native scroll to zero. Numeric ranges in both hooks use current viewport dimensions rather than GSAP's cached height. Every changed viewport size receives one debounced measurement pass, keeping the finale endpoint current even after small height changes. Regression checks reproduced the scroll reset, stale caption range, and stale finale endpoint before their fixes. GSAP still performs its own single reset/restore on orientation changes; rendered orientation checks retain the reader's chapter without recurring refresh loops.

**Verification, 2026-10-12:** 152 unit tests passed with `npx.cmd vitest run --maxWorkers 1`. All 134 distinct Brave browser cases were covered across cohorts: 52 unaffected cases passed in the sweep; 20 native-scroll/finale/choreography cases passed after the final resize fix; 62 remaining and resize-related cases passed afterward. Lint, formatting, TypeScript and production build passed. The build retains the large lazy-loaded Three.js chunk warning. Separate spec and quality reviews approved the final code. Fresh desktop/mobile rendered images were inspected; test-generated tracked images were restored. No physical device or Safari check was performed.
