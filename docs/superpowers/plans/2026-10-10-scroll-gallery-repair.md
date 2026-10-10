# Lavender Heart Scroll & Gallery Repair

Authorization: the owner explicitly requested execution now, local logical commits, no merge/push/deploy. This supersedes earlier phase approval gates. Existing linked worktree: `feat/domain-foundation`.

Design: preserve the nine chapters, Hero, all supplied copy/dates/media, colors and typography. Give each owner-ordered memory one viewport spread; one GSAP track tween measures scrollWidth minus stage width. Photos and messages share a stable canvas and enter together. Mobile/reduced motion remain vertical; genuinely oversized content uses readable natural flow. Keep existing Lenis ticker integration; remove secondary scrub interpolation from story travel and refresh only on relevant measurements.

Heart: one chapter choreography controller, centered with bounded presentational rotation in R3F; dominant home/finale, small upper-center chapter introductions, receded during photographs and letter. Keep geometry/material. Gallery: retain every media association, art-direct opening, three spreads, favorite view, two small detail groups, quiet closing; natural image proportions and mobile source order.

- [x] Root diagnosis and regression: `StoryChapters.test.tsx` proves one memory per spread, then `StoryChapters.tsx`, story rules in `chapters.css`, scroll/reveal portion of `useJourneyAnimation.ts`; browser tests prove forward/reverse photo pairing, end distance, resize and no overflow.
- [x] Heart agent: diagnose `HeartScene.tsx` and chapter controller, failing bounded-rotation/state tests, implement centered states, replace obsolete full-spin acceptance tests. Review spec then code quality.
- [x] Gallery agent: diagnose `Gallery.tsx`/collection CSS, regression for unique media and grouped details, implement editorial repair without content edits. Review spec then code quality.
- [x] Capture before/after at 1440x900, 1024x768, 390x844, 360/320 widths, slow/fast wheel both ways, reduced motion and fallback. Save artifacts under `docs/evidence/scroll-gallery-repair`.
- [x] Run all six requested npm quality gates, review diff/content preservation, record evidence and logical local commit hashes in repair report.

Risks: very long saved copy may require vertical fallback; browser rendering quality requires visual inspection beyond geometry assertions. Missing supplied recording/mockup prevents direct comparison with those references. Backend/admin and dependencies remain outside this repair. Rollback is by reverting the repair commits; personal content source is unchanged.
