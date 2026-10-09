# Screenshot feedback fixes

The six supplied screenshots are addressed in the existing nine-chapter experience.

- **1–2, clipped heart:** the live Canvas now renders at a stable 600 × 750 size. The chapter frame scales that surface to fit instead of repeatedly resizing the GPU drawing buffer during scroll transitions. Original geometry, lighting and material remain intact.
- **3–4, broken words:** removed the compounded desktop content cap and inner Timeline padding that squeezed its columns. Display type is bounded and normal words stay whole, including YOUR, YEAR and Special moment.
- **5, centered narrow layout:** Timeline now uses broad alternating image/text spreads. At the supplied 1864px page width, the first photo grew from 313px to 807px.
- **6, photo placement:** Gallery companions have more balanced widths, smaller stagger offsets and closer spacing. Existing photo order and lightbox controls remain intact.

## Visual evidence

[Heart after](evidence/screenshot-fixes/after-heart-1864-dpr1-100.png), [Timeline before](evidence/screenshot-fixes/before-timeline-content-1864.png), [Timeline after](evidence/screenshot-fixes/after-timeline-content-1864.png), [alternating Timeline](evidence/screenshot-fixes/after-timeline-stagger-1864.png), [Gallery before](evidence/screenshot-fixes/before-gallery-1864.png), [Gallery after](evidence/screenshot-fixes/after-gallery-1864.png), [320px words](evidence/screenshot-fixes/after-timeline-date-320.png).

## Verification

- Heart regression failed before the renderer sizing correction and passed after it. One Canvas and a constant drawing buffer survive Intro, Story, Gallery, Finale and reverse scrolling.
- Heart probe checks frame containment and buffer stability at 1864px, fractional DPR 1.5, 390px and 320px. Screenshots show complete hearts at three Intro scroll positions per profile.
- Layout probe checks every Timeline heading word with browser text ranges, plus horizontal overflow, at 1864, 1920, 1440, 1024, 390 and 320px. All checks pass.
- 129 unit tests, ESLint, formatting and TypeScript/production build pass. An initial concurrent unit run timed out; the complete suite passed with two workers.
- 27 browser tests pass, including reverse scrolling, responsive composition, context-loss/static fallback, reduced motion and lightbox keyboard/touch behavior. The first all-green browser run stalled while shutting down its owned servers; a complete rerun using the running servers exited successfully.
- Independent source review found no blocking defect in the five changed source files.

The supplied Brave clipping was not independently reproduced in settled headless Chromium before the correction. The confirmed drawing-buffer churn has been removed, and current automated captures show complete hearts. Physical Brave/GPU and Safari checks remain unverified. Personal content placeholders remain pending. This revision stops for visual review.
