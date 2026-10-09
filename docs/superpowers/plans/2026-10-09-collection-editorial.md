# A Little Collection implementation plan

User request: implement the supplied editorial redesign brief and cloud reference, scoped to the collection chapter. Existing isolated worktree: domain-foundation. No backend, admin, authentication, schema, or media pipeline changes.

1. Replace Gallery composition with explicit opening / three spreads / favorite view / details / closing scenes. Keep all photos available exactly once, hide scenes without content, and retain existing dialog, focal positions, responsive image sources, keyboard/swipe controls, and focus restoration.
2. Replace gallery CSS with intentional photo roles, pale lavender atmosphere using existing cloud-bank assets, mixed ratios, readable caption styles, and mobile recomposition at 700px. Keep existing fonts/tokens and lightbox styles. Reuse heart fallback and gallery-only persistent-heart positioning; hide the persistent heart after the opening.
3. Isolate neutral intro/closing copy in collectionContent.ts. Use owner photo captions for numbered titles/notes (first line is title, remaining lines are body). Update only gallery photos/captions in the existing development fixture; stock photos remain replaceable by owner media.
4. Scope restrained clip/fade/scale animation and Home-style scroll cloud parallax to gallery in the existing journey hook. Create cloud triggers after earlier pinned scenes so desktop positions stay correct. Preserve other chapters' motion and reduced-motion cleanup. Update gallery-specific companion/motion assertions.
5. Verify photo preservation for 1, 2, 7, 16, 23 photos; existing dialog tests; full frontend unit tests, lint, format, typecheck/build. Browser-test 1440x900, 1024x768, 390x844, 320x844, 360x844 for overflow, loaded media, lightbox, and reduced motion; save and inspect scene screenshots. Review the diff for spec and code quality, correct findings, then commit only scoped changes and stop for visual review.

Risks: fixed roles follow owner photo order; focal points remain owner-controlled. Very long captions may enlarge a scene. No dependencies or new raster assets. Rollback uses the single scoped commit.
