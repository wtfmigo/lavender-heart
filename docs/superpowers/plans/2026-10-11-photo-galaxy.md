# Photo Galaxy Implementation Plan

> **For agentic workers:** Use subagent-driven-development for implementation and independent review. The user approved the concrete scope in `docs/2026-10-11-photo-galaxy-proposal.md` with “proceed.”

**Goal:** Replace keepsake rows after the first ten gallery photos with an interactive, slowly rotating photo sphere.

**Architecture:** A React component positions semantic photo buttons on a sphere using CSS perspective. It owns manual rotation, animation lifecycle, and an accessible list; Gallery continues to own the existing lightbox. Keep GSAP transforms off sphere descendants.

**Tech Stack:** Existing React, TypeScript, CSS, Vitest, and Playwright; no new dependencies.

## Global constraints

Preserve the first ten editorial photos, source data/order, captions, gallery closing and lightbox. Support mouse, touch, keyboard, pause, reduced motion, offscreen/tab-hidden suspension and mobile layouts. Preserve the existing isolated worktree and local-only workflow.

### Task 1: Gallery interaction and integration

Files: create `frontend/src/views/components/public/PhotoGalaxy.tsx` and `PhotoGalaxy.test.tsx`; modify `Gallery.tsx`, `Gallery.test.tsx`, `frontend/src/styles/gallery.css`, and `frontend/src/animations/gsap/useJourneyAnimation.ts`.

- [x] Write tests first for galaxy keepsake reachability, caption preservation, keyboard rotation/pause, drag suppressing click, reduced-motion behavior, and small collections. Observe a failing assertion before implementation using `npm test -- src/views/components/public/Gallery.test.tsx`.
- [x] Implement `PhotoGalaxy` consuming the keepsake photos and a callback to Gallery's existing `open(index, button)`. Use a Fibonacci sphere, shared yaw/pitch, CSS custom properties for card position/size, and photo buttons facing the viewer. Bound pitch and ignore click after a drag threshold. Retain native image alt text, focal position, loading, and dimensions.
- [x] Pause requestAnimationFrame work during interaction, lightbox, offscreen and hidden tabs. Clean up observers/listeners/animation frames. Reduced motion disables auto rotation; list and manual controls keep every photo reachable. Use separate DOM elements for depth transforms and gallery styling.
- [x] Replace the keepsake rows only. Exclude `.photo-galaxy` descendants from GSAP reveal transforms. Implement stars/nebula with CSS; fit phone width with no page overflow.
- [x] Run focused tests and production build: `npm test -- src/views/components/public/Gallery.test.tsx src/views/components/public/PhotoGalaxy.test.tsx`; `npm run build`.
- [x] Obtain an independent spec pass and code-quality pass; fix material issues and rerun checks.

### Task 2: Documentation and rendered verification

Files: modify `DESIGN.md`, proposal status, and this plan's execution record. Add a focused Playwright check under `frontend/tests/e2e/` if browser infrastructure is available.

- [x] Synchronize DESIGN with the approved keepsake sphere, preserving the gallery's other layouts.
- [x] Check desktop and mobile sphere rendering, drag/click behavior, keyboard access, reduced motion, and the existing lightbox in the available local browser. Report unavailable browser checks accurately.
- [x] Run the frontend suite and production build after any fixes. Review the final diff and preserve unrelated work. Leave the changes in the user's active worktree for immediate local preview; do not merge or deploy.

## Execution record

Startup-delay correction: there was no timer; hover and retained pointer focus were suspending rotation. Removed hover suspension, resume immediately on pointer release, and retain keyboard interaction pause. Three regression tests reproduced the old behavior before fixes. Current verification: 19 focused tests passed, production build passed, and the real-hover/photo-drag browser regression verifies rotation changes within one second without moving the pointer away. Existing suspension for reduced/global motion, hidden/offscreen state and lightbox is preserved.

Owner refinement completed after live preview: normal visible toolbar/helper copy removed, 3× rotation, final radius340/card160 sizing (slightly reduced from the enlarged preview), and decorative galaxy background deleted. Accessibility controls reveal on keyboard focus. Verification of this refinement: 16 focused Vitest tests passed (speed regression observed failing before the change), six Playwright checks passed (desktop/phone sizing, ordinary photo clicks, touch drag, list access, pause and original editorial layout), and screenshot containment checked. No dependency/backend changes.

Both tasks complete. Spec and code-quality reviews passed after fixing scroll-measurement refresh, touch-drag click suppression in list mode, and focused-photo stacking. No remaining review findings. Fresh verification: npm.cmd test -- --maxWorkers=2 passed 147 tests; four galaxy Playwright checks passed (including ordinary photo clicks and actual touch input); 18 affected gallery/editorial/personal-photo Playwright checks passed; npm.cmd run build passed; git diff --check passed. Browser screenshots inspected at desktop and phone sizes. Chromium checked; Safari and physical-device testing were not performed. Existing HeartScene bundle-size advisory remains. Temporary browser config and private captures stay in ignored frontend/test-results. Work remains on the existing feat/domain-foundation branch; no merge or deployment.
