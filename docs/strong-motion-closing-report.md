# Stronger scroll motion and closing heart

The user requested noticeably stronger animation and clarified that the closing heart should face forward instead of resting on its side.

Photo pan now spans 24% instead of 10%, with a scroll-linked zoom from 1.42 to 1.3. Text reveals travel 110px on desktop and 64px on phones, compared with 32px and 18px. The full-width memory also has stronger pan and enough overscan to fill its frame. Photo reveals animate the inner frame rather than the ScrollTrigger measuring figure; this keeps the parallax geometry stable when images finish loading or scroll direction reverses.

The closing text previously could not finish revealing because its end position fell beyond the maximum page scroll. Viewport reveal start/end positions now clamp to the available scroll range. The final part of the heart's scroll phase continues toward the next complete Y turn, finishing at its front pose. It remains centered, reverses when scrolling upward and does not rotate while idle. Earlier chapters retain the horizontal 3D spin.

Focused browser checks verify stronger photo displacement at desktop/phone sizes, reverse scrolling, statements and letter reveals, static reduced motion, fully visible closing text, wheel rotation, complete turns, idle/reverse behavior and a broad forward-facing closing silhouette. The closing screenshot was visually inspected: [closing](evidence/collection-scroll/strong-closing.png). Unit tests (129), ESLint, formatting and production build passed.

Physical Brave/GPU performance and actual touch-device motion remain unverified.
