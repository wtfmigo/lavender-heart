# Preserve existing photo frames

**Authorization:** The owner explicitly requested fixed photo sizes on replacement, retaining the current layout and every existing frame size. Direct edits are authorized.

**Design:** Separate presentation dimensions from replacement image metadata. Freeze the current dimensions per Story, Gallery and Timeline slot in one small layout file. Retain all current gutters, grids, breakpoint rules and contain/cover behavior. Preserve the full-memory frame and lightbox slot proportions. Actual image metadata remains accurate for loading and responsive source selection.

**Scope:** Existing photo components, shared image CSS, source-dependent animation guards, a layout snapshot, editing/design documentation and browser replacement tests. No schema change, dependencies, content changes, redesign or new controls.

- [x] Record rendered dimensions before editing and run failing replacement tests.
- [x] Lock current slot geometry without altering the original rendered sizes.
- [x] Compare original and replacement photo/frame bounds on desktop, phone and tablet, including lightbox; verify original bounds against the pre-edit capture.
- [x] Run unit/browser tests, lint, formatting, typecheck/build and independent review.

**Verification:** Pre-edit vs post-edit bounds for all 32 rendered photos and sampled lightbox slots matched within 0.5px at 1440x900, 390x844, 844x390 and 768x1024. Seven replacement cases passed, including full motion on desktop/phone and a 568x320 lightbox regression; nine existing Gallery/Story browser checks and all 141 unit tests passed. Lint, changed-file formatting, typecheck/build and diff checks passed. Independent review found and verified a short-landscape lightbox correction, with no remaining blockers. Rendered desktop Gallery and phone Timeline were inspected. Chromium emulation only; physical devices and other engines were not checked. Existing Three.js deprecation and bundle-size warnings remain.

**Risk:** Mismatched replacement proportions must fit inside the saved frame without stretching. Story/Timeline/Memory retain contain; Gallery thumbnails retain cover. New slots use the existing role proportions; replacing existing slots is the requested scope. Responsive sizes continue to depend on viewport, never the replacement's dimensions. No original photos are changed or deleted.
