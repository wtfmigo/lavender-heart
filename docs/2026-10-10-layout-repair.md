# Photo layout and journey repair

The personal-photo insertion replaced editorial frame proportions with natural image heights, stretching the collection. Photo sources were also reused across chapters. Restore the original editorial composition, match portrait frames to 3:4, and assign each photograph once across Story, Memory, Gallery and Timeline. There are 27 distinct photographs among 28 supplied files: the excluded phone-gallery screenshot duplicates IMG_6732. Originals remain untouched.

Landscape editorial frames may crop edges; visually checked faces remain visible. Story photos and the lightbox preserve the whole image. Gallery contains 21 photos, with six others assigned across the remaining chapters. Only confirmed milestone photos carry dates; the general cafe feature is undated. July 17 remains text-only.

Text-only desktop Story and Timeline panels now reserve their empty side for a larger heart. Existing GSAP journey interpolation resizes it between chapter headings, dated rows, photo panels and text-only panels. Shorter Timeline reading transitions prevent competing tweens from covering the next date.

The finale heart follows its document-space slot above the message. Its follow offset starts at zero at the end of entry, avoiding a jump when scrolling forward or backward. Resize and paused static placement use the same reserved slot. Existing ticker and reduced-motion paths are reused; no dependency added.

## Verification

- 135 unit tests, lint and TypeScript/production build passed.
- Nine browser checks passed: seven photo widths from 320 through 1864px, plus keyboard and touch gallery interaction. Asserted 27 placements with 27 unique sources, successful image loading, viewport bounds and text-only July 17.
- Heart browser checks cover horizontal Story, vertical fallback, text-only Timeline, subsequent date clearance, finale entry continuity in both scroll directions, resize, pause and reverse scrolling.
- Eight collection browser checks passed, including long captions, responsive editorial frames, cloud scrolling and pause. Six existing chapter-heart checks also passed; the five new heart cases passed in focused runs.
- Actual desktop opening, moments, wander, cinematic and detail screenshots and mobile finale inspected. Independent review found no blockers. Private screenshots remain under ignored test-results.

Applied systematic-debugging, local GSAP ScrollTrigger/performance, Impeccable and Hallmark guidance. The local Impeccable context launcher could not start its engine; source review and rendered browser checks supplied layout evidence.

No physical-device performance profiling or public deployment. Existing Three.js chunk-size warning remains. Personal derivatives are ignored local assets: a later deployment or clean clone must copy frontend/public/photos/personal separately.
