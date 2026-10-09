# Collection and scroll-heart revision

The user requested a stronger “A little collection” composition, better heart placement, and heart rotation that follows scrolling and stops at rest.

The collection now uses a compact three-column photo spread: a large lead fills two columns and two rows, with two stacked companions beside it. Subsequent rows alternate wide and narrow images; the closing image spans the spread. Photo frames crop using the existing focal points, while the lightbox still shows complete photographs. On phones, leads use the full width and supporting photos share two columns. Photo order stays intact.

The collection heading is shorter and has more restrained type. Its live heart is larger and placed in the open area beside the heading. It fades before the photo spread, freeing the photo area from the fixed heart at the screen edge.

The old heart motion mixed idle sine-wave animation with only half a radian of rotation across the whole page. Rotation now depends on scroll distance in viewport units: roughly 103 degrees of turn per viewport scrolled, increased following the user's request for a faster, smooth turn. Existing smooth scrolling supplies the continuous movement. There is no time-driven rotation or bobbing. Scrolling upward reverses the turn, and reduced motion retains a static pose. The stable Canvas buffer from the prior clipping fix remains in use.

## Checks and evidence

- The new browser regression failed on idle motion before the change and passed afterward. It compares actual Canvas screenshots to confirm an unchanged pose at rest, a changed pose after scrolling, and the same pose on returning to the original scroll position.
- Collection probe checks overflow, nonzero photo sizes, no overlap and the heart clearing desktop photos at 1864, 1440, 1024, 768, 390 and 320px.
- Independent review additionally checked photo counts 1–16 at five widths, including both sides of the phone breakpoint; no blocking issue found.
- 129 unit tests and production/TypeScript build pass. Existing gallery keyboard, focus-return and touch controls pass.
- All 28 browser checks pass across the full run and focused rerun. Three existing checks expected the previous gallery heart opacity; they were updated for the authorized placement change and passed on rerun. ESLint and formatting pass.

Screenshots: [desktop heading](evidence/collection-scroll/heading-1864.png), [desktop collection](evidence/collection-scroll/photos-1864.png), [phone heading](evidence/collection-scroll/heading-390.png), [phone collection](evidence/collection-scroll/photos-390.png).

Physical Brave/GPU and Safari remain unverified. Development photos and personal-content placeholders are unchanged.
