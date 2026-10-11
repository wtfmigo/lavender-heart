# Timeline Layout Implementation Plan

> **For agentic workers:** Implement the approved Timeline proposal as one coupled UI task; request separate spec compliance and code quality review.

**Goal:** Apply the owner-approved high-fidelity alternating photo/caption layout to Timeline entries.

**Architecture:** Keep `TimelineChapter`, `MemoryPhoto`, validated owner content, and the existing GSAP selectors. Move dates next to their captions and replace only Timeline layout rules. The chapter introduction and traveling heart retain their current choreography.

**Tech Stack:** React, TypeScript, CSS Grid, installed GSAP and Playwright.

## Constraints

- Preserve original photos, text, dates, order, and complete image proportions.
- Keep alternating side-by-side composition on phone/tablet portrait and landscape.
- Retain 4px ivory frames shared with Story/Gallery, existing motion, native scrolling, and reduced-motion reading.
- No new dependency, animation system, backend, or unrelated chapter changes.
- The prototype's photo inspection demonstrated full-image proportions; this task does not introduce a second lightbox system.

## Task: Timeline spreads

**Modify:** `frontend/src/views/components/public/StoryChapters.tsx`, `frontend/src/styles/chapters.css`, `frontend/tests/e2e/timeline-owner-refinement.spec.ts`, `DESIGN.md`, `PROJECT_CONTEXT.md`.

- [x] Update current context/design to reflect approved alternating spreads and fluid responsive dimensions.
- [x] Replace the obsolete centered-photo browser assertion with image/copy bounds, alternating placement, preserved content, and date/caption grouping across six representative viewports. Confirm it fails against the old layout.
- [x] Move date markup into `.timeline-copy` without changing `MemoryDate` or the GSAP selector. Use scoped CSS Grid, date rules, lavender lighting, subtle shadows, 490px maximum image height, and fluid spacing/type. Remove the old stacked Timeline breakpoint. Handle missing photos/dates and long copy without empty columns or clipping.
- [x] Run relevant component tests, browser layout/image-loading/native-scroll/choreography checks, formatting, lint, typecheck, and build. Inspect rendered desktop, phone, and tablet views including normal motion.
- [x] Review spec compliance, then code quality; fix findings and repeat affected checks. Record evidence and commit only scoped source/tests/docs; keep personal captures ignored.

Verification: `docs/2026-10-12-timeline-layout-verification.md`.
