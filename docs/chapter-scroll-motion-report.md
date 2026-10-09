# Scroll motion across the public journey

The requested scope is photo parallax and scroll animation throughout the existing chapters, including A little collection, Little things, Your year and For you. Keep the current composition and chapter order. Use the installed GSAP/ScrollTrigger and Lenis setup; introduce no dependencies or backend changes.

Photos pan vertically from -5% to 5% inside clipped frames, with a 1.12 scale to keep the frame filled. Figures, chapter headings, dates, statements and individual letter paragraphs fade up as they enter. Motion scrubs with scrolling and reverses on upward scroll. Mobile uses a shorter reveal distance. Hero and Intro retain their existing animation, and the heart's horizontal spin remains unchanged.

Story photo and text timing uses the horizontal track animation. Little things uses the pinned sequence's measured scroll start and each statement's position. Timeline, gallery, letter and finale use their own viewport entry positions. Reduced motion bypasses all of these additions, leaving the photos and reading content static and visible. Gallery lightbox content is excluded from the page parallax.

Affected files: the existing journey animation hook, shared chapter photo markup, chapter/gallery clipping styles and a focused browser regression file. The image wrapper keeps captions outside the crop window; transforms preserve layout dimensions.

Verification: 129 unit tests, 13 browser checks covering photo parallax on desktop/phone, reverse scroll, reduced motion, existing pins, late overflow, heart chapter positioning and lightbox controls passed. An additional statement/letter reveal and reverse check passed. ESLint, formatting, TypeScript and production build passed. The new photo-motion tests first failed against static photos before implementation. The desktop gallery screenshot was inspected for filled frames and spacing: [gallery evidence](evidence/collection-scroll/gallery-parallax.png).

Actual Brave/GPU performance and physical touch scrolling remain unverified.
