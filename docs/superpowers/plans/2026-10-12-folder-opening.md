# Clickable folder opening

**Authorization:** Owner requested replacing the initial “For [name]” splash with a named folder containing a letter; clicking opens the folder and reveals Home. Direct editing remains authorized.

**Design:** A lavender paper folder, recipient tab and visible letter sit on the existing ivory opening surface. A native button starts a bounded cover-fold/letter-lift animation and the overlay fades into Home. The gate never advances without activation, including on reload or reduced motion. Reduced motion keeps activation but transitions immediately. Preserve existing Hero choreography after entry and all fixed photo frames/Love surprises.

**Files:** A small `FolderOpening.tsx` with scoped styles owns the entrance interaction. `PublicExperiencePage.tsx` owns entered state, inaccessible background and reversible scroll lock. `useExperienceAnimation.ts` starts Hero motion after entry and removes the automatic splash/session-storage timer; `experience.css` removes obsolete splash styles/reduced-motion hiding. Add focused component/browser tests and update the App unit test to enter the folder. Existing chapter browser tests use one shared auto-entry fixture so they continue testing the chapters, while dedicated entrance tests exercise actual click/keyboard/touch. Update DESIGN.md, PROJECT_CONTEXT.md and animation README.

- [x] Write a failing test proving the named folder waits for activation and opens Home.
- [x] Implement paper geometry, staged opening, interaction semantics, focus and scroll cleanup without new dependencies.
- [x] Update existing callers/tests for the entrance; verify responsive, long names, repeat loads, reduced motion and in-flight preference changes.
- [x] Inspect renders, independently review, run relevant unit/browser/format/lint/typecheck/build checks and retain photo-frame regressions.

**Verification:** 142 unit tests passed; lint, scoped Prettier, TypeScript and production build passed. Nine folder browser cases passed across six desktop/mobile/landscape sizes, including keyboard/touch entry, reload, long names and live reduced motion. All seven image-replacement cases passed with unchanged frame bounds, including full-motion desktop/mobile. The frame test now activates the gallery list without scrolling through its entry tweens before sampling. Existing experience, foundation, Love and orientation regressions passed (27 cases). Desktop, phone and landscape opening renders inspected; independent review found no blockers. Physical devices, Safari and screen-reader announcements were not tested. Existing Three.js deprecation and bundle-size warnings remain.

Nine additional native-scroll and preview-stability browser cases passed, including deferred photo loads, touch swipes, address-bar resizing and WebGL-free previews.

No invented personal letter body, media changes, storage bypass, extra visitor controls, publishing or dependencies. Use the saved recipient name and a UI “Letter” label. Cover and paper motion must be finite; locked scroll and hidden background must be restored on exit/unmount.
