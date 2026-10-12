# Touch rotation and responsive loading

Owner authorization: improve phone/tablet sphere rotation, loading and layout stability while preserving desktop composition and fixed photo frames. Continue direct edits in the existing clean worktree.

Use viewport-relative touch sensitivity, one horizontal gesture decision, native vertical scrolling, and accessible rotation buttons discoverable on touch devices. Preserve desktop dragging and sphere geometry. Warm sphere thumbnails before arrival and use existing small photo variants in Story/Timeline. Preload both typography assets so mobile rendering does not wait to request body fonts. Diagnose delayed fonts/images and browser-bar resizing with real browser tests; do not replace responsive desktop composition with a separate mobile layout.

- [x] Add failing phone/tablet swipe and thumbnail prewarming checks.
- [x] Implement minimum gesture and loading fixes in PhotoGalaxy, StoryChapters and index.html; scope touch controls in gallery.css. Preserve Gallery's original responsive source sizes for photo-list quality.
- [x] Check slow asset loads, portrait/landscape, native scrolling, fixed frames, Love, desktop gallery and motion preferences.
- [x] Review, run unit/lint/format/build/browser checks and update context.

Delivery: commit and push the verified implementation, then check the new bundle and touch controls on `jalebong.vercel.app`.

Verification: 143 unit tests, lint, scoped formatting, TypeScript and production build passed. Browser suites cover short horizontal touch swipes on phone/tablet, tap arrows, prewarming, delayed image loads with unchanged frames and two-column composition, replacement images, desktop sphere, photo list, native scroll, address-bar changes, orientation, responsive parallax and Love surprises. Mobile/tablet screenshots inspected. Review caught an observer-fake collision and undersized list images; both resolved and independently verified. Existing Three.js deprecation and bundle-size warnings remain. Physical devices and Safari were not tested. Font preloading reduces late requests; it does not guarantee instant assets on slow networks.

No new dependencies, photo replacements, dimensions, private screenshots, global scroll interception or new loading gate. Browser emulation cannot establish actual-phone performance.
