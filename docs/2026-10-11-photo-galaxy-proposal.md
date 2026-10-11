# Interactive photo galaxy — proposed design and implementation scope

The keepsake photo rows shown in the screenshots become one rotating spherical photo constellation. Preserve the gallery opening, the first ten editorial photos, captions, closing, and existing lightbox. Use the existing lavender palette with a soft purple nebula glow and subtle decorative stars behind the sphere.

## Approach

Recommended: CSS perspective and React pointer events. Place the remaining photo cards across a sphere, rotate their shared container slowly, and keep photos facing the viewer. This keeps the current semantic photo buttons and avoids another WebGL canvas alongside the existing heart.

Alternatives: the installed Three.js stack supports a full particle galaxy but adds rendering and accessibility complexity; a flat circular carousel is smaller but does not deliver the requested spherical rotation.

## Interaction and limits

- Drag horizontally or vertically with a mouse or touch to rotate and inspect the sphere. Distinguish a drag from a click so rotating never unexpectedly opens a photo.
- Clicking a photo opens the existing lightbox with its caption, previous/next controls, Escape handling, and focus restoration.
- Provide keyboard rotation, visible focus, and a pause/resume control. Pause automatic rotation during interaction, while the lightbox is open, when offscreen, and while the tab is hidden.
- Respect reduced motion: disable automatic rotation and retain manual navigation. Offer an accessible photo list so every photo remains reachable regardless of its position on the sphere.
- Fit the sphere to mobile viewports, preserve normal page scrolling outside the interaction surface, and use existing small image derivatives where available.
- Do not duplicate, discard, or reorder saved photo data. Empty and small collections remain valid.

## Proposed implementation

1. Update `DESIGN.md` with the approved keepsake constellation behavior.
2. Add `frontend/src/views/components/public/PhotoGalaxy.tsx` for sphere layout, drag, keyboard rotation, pause, and visibility handling. Reuse `useReducedMotion` and the existing gallery photo/lightbox contract.
3. Replace only the `collection-details` rows in `Gallery.tsx`; leave the first ten photos in their existing editorial layouts.
4. Extend `frontend/src/styles/gallery.css` with responsive sphere, stars, focus, and reduced-motion styles.
5. Adjust `frontend/src/animations/gsap/useJourneyAnimation.ts` selectors if necessary so scroll reveals do not overwrite the sphere/card transforms.
6. Update `Gallery.test.tsx` and add focused interaction tests for dragging versus clicking, keyboard access, pause, reduced motion, and complete photo reachability.
7. Run relevant Vitest tests and the frontend production build. Check desktop and touch-sized rendering and the lightbox in a real browser when available; explicitly report any browser verification limit.

## Risks and rollback

Large collections can crowd the sphere; adapt card size and retain access to every photo in the photo list. CSS depth and scroll animation transforms can conflict, so keep them on separate elements. No backend, media, dependency, or hosting changes are needed. Reverting the gallery changes restores the existing keepsake rows.

Approved by the user with “proceed” on 2026-10-11. Implementation follows `docs/superpowers/plans/2026-10-11-photo-galaxy.md` in the existing isolated domain-foundation worktree.
