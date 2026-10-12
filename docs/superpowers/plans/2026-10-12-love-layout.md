# Things I Love layout implementation plan

**Authorization:** The owner requested direct code edits to improve the pictured Love opening and statements with distinctive animation, using skills. Continue in the existing development worktree.

**Design:** Preserve owner text, lavender tokens and native sticky staging. Use oversized alternating solid/outlined numerals, asymmetric text, masked staggered word reveals, opposing numeral travel and a scroll progress rail. Keep the opening heading balanced. Reuse the scoped GSAP choreography; introduce no dependencies, images or content.

**Affected files:** `StoryChapters.tsx` supplies semantic word spans and a decorative progress rail; `love-motion.css` owns the section composition and responsive rules; `useJourneyAnimation.ts` supplies reversible scrubbed motion and scoped cleanup. Existing `useLoveSequence` remains the staging and oversized-content fallback.

- [x] Add and run a failing browser check for reversible numeral/progress motion and readable statements on desktop, phone and tablet, including landscape.
- [x] Implement the layout and animation in existing modules. Synchronize DESIGN.md.
- [x] Verify normal, Pause, reduced-motion and oversized-content reading. Inspect rendered desktop/mobile screenshots.
- [x] Run relevant unit/browser tests, lint, formatting, typecheck and build. Review scope and lifecycle independently.

**Verification:** All 141 unit tests passed; six new Love browser cases and five existing chapter-motion cases passed. Hidden chapters, oversized content and reduced-motion journey checks passed (one reduced-motion navigation timeout passed on focused rerun). Lint, production build/typecheck, changed-file Prettier and diff checks passed. Independent scope and quality review found no blockers and verified long unbroken words on phone. Desktop and phone opening/statement renders were inspected. Chromium emulation only; physical devices and screen-reader speech were not checked. Existing Three.js deprecation and bundle-size warnings remain.

**Risks:** Oversized numerals must not collide with text; word wrappers must preserve natural wrapping and accessible text. Animate transforms/opacity, avoid extra WebGL or perpetual animation, and revert through the existing GSAP context. Rollback is limited to these section changes. No deployment or remote writes are included.
