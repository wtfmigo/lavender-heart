# First Visible Lavender Heart Implementation Plan

**Goal:** Replace the public technical placeholder with the authorized cloud-filled Hero and Intro; stop for visual review after local verification.

**Architecture:** Presentational Hero, Intro, atmosphere and navigation in `src/views/components/public/`; public composition in `src/views/pages/PublicExperiencePage.tsx`; isolated development data in `src/features/public/demoExperience.ts`. Three.js owns the sculptural heart in `src/three/`, GSAP owns DOM opening and scroll choreography in `src/animations/gsap/`. Existing domain contracts and backend remain intact.

**Tech stack:** Installed React, TypeScript, Three.js, R3F, Drei, GSAP/useGSAP/ScrollTrigger, Vitest/RTL and Playwright. No new dependencies.

## Binding constraints

- Work on the clean existing `feat/domain-foundation` worktree starting at `f94a37d`; no merge, push, remote or deployment.
- Lavender Mist palette and Cormorant Garamond/Inter follow DESIGN.md. Only Home and Intro navigation.
- Neutral supplied demo content only; no fabricated recipient/date/romantic writing. Demo source excluded from production.
- Original transparent cloud asset in background, midground and foreground; no reference assets or source copying.
- Real procedural translucent lavender heart with restrained studio lighting. Loading, unsupported WebGL, context loss and rendering failure preserve a lightweight original heart fallback.
- Opening lasts 2–4 seconds, repeat visits enter quickly; no fake progress or content gate. Reduced motion enters immediately and removes idle/pointer/scroll travel.
- Desktop scroll travels through foreground clouds into a calm light lavender Intro. Mobile recomposes type and sculpture with fewer clouds and lower DPR; long content remains in natural flow.
- Lifecycle cleanup, keyboard access, focus-visible, navigation focus protection, readable contrast and no unfinished chapters.

## Execution

### 1. Public composition and visual foundation

- [x] Read existing contracts, route, placeholder tests and smoke/e2e setup.
- [x] Write failing behavioral tests for supplied recipient/long name, supplied Intro, exactly implemented anchors and removal of technical placeholder.
- [x] Add demo data/type boundary, Hero/Intro/CloudAtmosphere/Navigation and public page. Wire existing root route; retain development smoke route.
- [x] Add semantic palette, type, spacing and responsive styles in `src/styles/tokens.css`, `src/styles/experience.css`; import from base.css. Save self-hosted fonts and original optimized clouds to `public/`.
- [x] Run focused tests, typecheck and review boundaries.

### 2. Crystal heart

- [x] Write geometry self-checks and fallback/motion tests first and observe failure.
- [x] Add procedural geometry, studio scene and lazy Canvas/error boundary under `src/three/`; HTML fallback keeps silhouette through loading/failure.
- [x] Connect a mutable scroll progress ref; no React updates per frame. DPR adapts to mobile. Pause when offscreen/document hidden; reduced motion uses demand rendering.
- [x] Run focused tests and typecheck, then inspect actual heart material/silhouette in Chromium.

### 3. Opening and cloud travel

- [x] Add live reduced-motion hook and scoped GSAP lifecycle; test media-query changes/cleanup.
- [x] Animate separate reveal and scroll wrappers so property ownership cannot compete. Three.js reads only progress, owns camera/heart mutation.
- [x] Add short opening and restrained cloud depth travel, typography masking and Intro reveal; preserve native anchors and static reading fallback. No pinning on mobile or reduced motion.
- [x] Add focus-protected hide/show navigation and accessible compact mobile menu only if necessary.

### 4. Evidence, review and commits

- [x] Update obsolete foundation assertions while preserving API health and smoke coverage.
- [x] Run site and inspect reference in browser. Check 1440×900, 1024×768, 390×844, 320/360 and Hallmark widths 375/414/768; inspect rendered screenshots and interactive scroll.
- [x] Capture desktop Hero/transition/Intro and mobile Hero/Intro. Check reduced motion, WebGL blocked/context loss, focus, long names and overflow.
- [x] Perform spec-compliance then code-quality review; use Hallmark audit and Vercel React/accessibility guidance, fix blockers.
- [x] Run typecheck, lint, format:check, test, build and e2e. Verify backend and A1/A2/A3 unchanged.
- [x] Commit logical verified changes and report A–O with screenshots, URL, checks and limitations; wait for user visual review.

## Risks and rollback

GPU/material quality varies by hardware; actual physical mobile performance remains separate from viewport emulation. The demo is intentionally development-only until `/api/experience` exists. Asset or font failure retains readable text and heart identity. Revert this phase's commits to recover the technical root page; no database/data changes are involved.
