# Full scroll-driven heart turn

The user explicitly selected a complete clockwise/counterclockwise turn with the front of the heart remaining visible.

The heart now rotates around its front-facing Z axis: downward scroll turns clockwise, upward scroll reverses it. X and Y remain fixed, so the sculpture never turns into the thin side view. Rotation follows scroll distance at 1.8 radians per viewport, using the existing smooth scrolling. There is no idle motion.

The scroll phase now updates from the actual scroll position on the existing Lenis ticker. A rendered-matrix probe found the previous ScrollTrigger-based phase returning to the default pose inside pinned Story despite visible opacity. Moving phase updates to the ticker restored the correct angle and complete-turn silhouette across chapters.

The fixed render surface is now a 750 × 750 square with matching contain-fit sizing. This gives the rotating silhouette enough room at diagonal angles while preserving a stable drawing buffer and one Canvas.

Verification:

- The complete-turn regression failed on the previous sway. Quarter-turn masks change, a full-turn mask returns to the same silhouette, and none touches the render boundary.
- Actual wheel scrolling passes direction and angle-jump checks over 45 frames.
- Stationary/reverse scrolling, closing silhouette and stable drawing-buffer regressions pass. Five browser checks passed across the main run and focused wheel rerun.
- 129 unit tests, ESLint, formatting and production/TypeScript build pass.
- Independent source review found no blocking issue. A 390px phone capture checks the Canvas remains inside the viewport.

Evidence: [first quarter](evidence/collection-scroll/turn-1.png), [half turn](evidence/collection-scroll/turn-2.png), [third quarter](evidence/collection-scroll/turn-3.png), [full turn](evidence/collection-scroll/turn-4.png), [phone](evidence/collection-scroll/full-turn-phone.png).

Physical Brave/GPU performance and Safari remain unverified.
