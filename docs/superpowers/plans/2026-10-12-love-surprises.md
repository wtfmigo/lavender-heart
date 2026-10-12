# Love tap-to-reveal surprises

**Authorization:** Owner requested removing the pictured progress strip and replacing the Love section's scroll-only reveal with distinctive interactive surprise messages. Continue direct editing in this worktree.

**Design:** Keep the heading, personal text, chapter sequence and fixed photo frames. The opening invites visitors to discover messages. Each numbered entry conceals its supplied heading/body behind a tappable paper seal. Three visual opening styles repeat by slot: envelope flap, unfolding note and parting heart seal. Clicking or pressing Enter/Space opens the message with a short staged reveal, retains it for the rest of the visit and moves keyboard focus to the message. Motion follows Pause/reduced-motion; tapping remains available with immediate reveal. Concealed content retains its layout footprint so reveal never pushes the next chapter or invalidates staging.

**Files:** `LoveSurprise.tsx` owns local reveal state, semantics and Motion text reveals; `StoryChapters.tsx` composes it and removes the progress strip; `love-motion.css` supplies the paper styles; `useJourneyAnimation.ts` retains outer entry/number motion while removing progress and scroll-owned word reveals. Update affected component/browser tests, DESIGN.md and PROJECT_CONTEXT.md.

- [x] Write failing tests for concealment, independent reveal, keyboard/focus, persistence and strip removal.
- [x] Implement three paper opening styles and the opening invitation using existing React/CSS/GSAP facilities.
- [x] Verify desktop/phone/tablet and landscape, Pause/reduced motion, returning to opened messages and long content.
- [x] Review, run unit/browser checks, lint, formatting and build; preserve photo frame checks.

**Verification:** 142 unit tests and 26 relevant browser cases passed, plus the new mid-reveal Pause/live reduced-motion regression (RED then GREEN). The final focused retry passed after one browser startup transport error (ERR_NO_BUFFER_SPACE) before rendering. Photo frame replacement, outer chapter choreography, Enter/Space, touch, return to opened notes and five viewport/orientation cases were checked. Independent review verified concealed semantics, focus and long-content fallback with unchanged entry heights after reveal. It found the in-flight Motion issue; keying only the animated text finishes active reveals immediately without resetting opened state or focus. Reviewer independently confirmed the fix and no remaining blockers. Desktop/phone closed, intermediate and opened paper states and the introduction were inspected. Build/typecheck, lint and scoped formatting checks passed. Physical devices and screen-reader speech were not checked; existing Three.js/bundle warnings remain.

No invented personal messages, storage, dependencies, media changes or photo layout changes. Render only the owner-supplied content. Native button accessibility is required; hidden copy is excluded from the accessibility tree until opened.
