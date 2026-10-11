# Timeline layout refinement

Status: the owner approved the high-fidelity layout with “proceed” on 2026-10-12. Implementation follows `docs/superpowers/plans/2026-10-12-timeline-layout.md`.

## Recommended composition

Replace the repeated centered date/photo/title stacks with three alternating editorial spreads. The first photo sits left of its copy, the second sits right, and the third returns left. Place each genuine date immediately above its title. A fine horizontal divider separates memories; the existing lavender gradient and typography connect the section to the rest of the website.

Use larger, complete photographs within the existing ivory frames. Portrait photographs retain their natural proportions, including the video-call screenshot. Pair captions with their photograph rather than placing them far beneath it. Preserve every original photograph, title, message, date, and the saved order.

Phone and tablet portrait/landscape retain the alternating side-by-side composition, with fluid typography, reduced gaps, and naturally expanding rows for longer copy. No clipped text, horizontal overflow, artificial dates, or new decorative content. Reduced motion shows all content directly.

Alternatives considered: a centered scrapbook keeps the current repeated stacking; a chronological card rail introduces unnecessary boxes. The alternating spreads make better use of the existing editorial identity and space.

## Motion and implementation scope

Preserve the existing GSAP date/text reveals and photo-frame parallax. Retain their selectors when moving the date into the caption group. Native scrolling, horizontal Story, cloud animation, heart rotation, Gallery, and other chapters remain as currently implemented. No new dependency or animation system.

Affected files: `StoryChapters.tsx` (Timeline markup only), `chapters.css` (Timeline rules and removal of its obsolete stacked breakpoint), Timeline browser acceptance tests, and the current Timeline descriptions in `DESIGN.md` and `PROJECT_CONTEXT.md`.

## Verification

Update the previous viewport-center assertion to check alternating image/copy placement, no overlap, complete loaded photographs, preserved content/order, and bounds on desktop, phone, and tablet portrait/landscape. Exercise normal-motion photo/text reveals and resize/scroll. Run relevant component/browser tests, formatting, lint, typecheck, and production build; inspect rendered screenshots. Review spec compliance and code quality separately.

## Local visual review

The owner requested a high-fidelity mockup on 2026-10-12. The ignored `.private-content/timeline-layout-preview.html` now includes original photographs, locally hosted fonts, navigation context, fine date rules, lavender light, frame shadows, and full-photo inspection. The local design board at `.private-content/timeline-high-fidelity.html` compares desktop, phone, and tablet compositions; a PNG beside it can be reviewed directly.

The preview was checked in Chromium at 1440×1000, 820×1180, 1180×820, 390×844, 844×390, and 320×740. Photographs load, image/copy placement alternates, and content stays within the viewport. Preview photo inspection and its Pause control were exercised. Screenshots use reduced motion to show completed layout. Physical devices remain untested.

This isolated mockup does not modify the React app or upload photos. Its native CSS scroll animation demonstrates the visual direction; it does not replace the live GSAP choreography. Run `node .private-content/serve-timeline-preview.cjs` for a local-only browser preview at `http://127.0.0.1:5318` and the comparison board at `/board`.
