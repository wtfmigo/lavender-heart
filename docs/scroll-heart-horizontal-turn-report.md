# Horizontal 3D heart turn

The user's reference clarifies the intended motion: a horizontal 3D turn around the vertical Y axis, like a turning gemstone. The prior Z-axis roll was the wrong interpretation.

The live heart now turns through 360° on Y while X and Z remain fixed. It stays upright, reverses with upward scroll and stops with the scroll position. The existing speed, smooth scroll, per-frame scroll phase and stable square Canvas remain intact.

Checks cover the actual rendered matrices during mouse-wheel scrolling: fixed upright orientation, consistent turn direction and no abrupt angle jumps. Quarter-turn and full-turn pixel masks check visible geometry, no clipping against the render surface and return to the same pose after 360°. Closing checks allow natural side profiles, which occur during a full Y-axis turn. Idle/reverse and drawing-buffer checks remain in place.

The reference URL could not be inspected: the web reader returned an inaccessible page and browser navigation was denied network access. The axis is implemented from the user's explicit clarification; exact reference timing has not been claimed.

Evidence: [first quarter](evidence/collection-scroll/horizontal-turn-1.png), [half turn](evidence/collection-scroll/horizontal-turn-2.png), [third quarter](evidence/collection-scroll/horizontal-turn-3.png), [full turn](evidence/collection-scroll/horizontal-turn-4.png), [closing](evidence/collection-scroll/horizontal-finale.png).

Physical Brave/GPU rendering and Safari remain unverified.

Five focused browser regressions, ESLint, formatting and TypeScript/production build pass.
