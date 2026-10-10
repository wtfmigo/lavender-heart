# Lavender Heart Scroll & Gallery Repair Report

Repair date: 10 October 2026. Local branch: `feat/domain-foundation`. Prepared for owner visual review; no merge, push or deployment.

## Confirmed causes and repairs

The story renderer combined two memories into one spread, leaving seven spreads for eight saved memories. Independent reveal transforms could hide a photograph while its message remained visible. Each of the eight owner-ordered memories now owns a viewport spread; its photograph and message travel together on one stable canvas. Desktop travel is exactly `track.scrollWidth - stage.clientWidth`, driven by one GSAP tween. Removing an additional scrub interpolation avoids adding a second delay to Lenis scrolling. Reverse scrolling follows the same track.

Story layouts reserve upper negative space for the supporting heart and share a two-column grid. Photography stays within the available reading height. Text-only memories remain text-only because their saved records contain no media assignment; they are not missing images or silently substituted photographs.

Resizing into the natural-flow fallback previously killed a pin without recreating it when space returned. A debounced viewport revision now rebuilds the existing GSAP context, including rapid resize round trips. A second issue appeared downstream: restoring Lenis scroll before ScrollTrigger refreshed let its cached, unpinned position replace the restored position later. Refreshing ScrollTrigger, then measuring Lenis, then restoring scroll fixes that jump. ResizeObserver, loaded-image and font-ready refreshes use the final pinned layout; existing single GSAP ticker integration and cleanup remain in place.

Full-scroll yaw previously allowed narrow, edge-on heart views. Rotation now stays between approximately -19.2 and -8.3 degrees with gentle idle variation; reduced motion holds -13.75 degrees. R3F owns the mesh orientation, the chapter controller owns frame placement/visibility, and pointer movement does not compete. Procedural crystal geometry, material and camera remain intact.

The collection's opening overlap, repeated collage treatment and oversized detail run weakened hierarchy. Its opening now uses separate portrait/detail slots; three numbered spreads have distinct image hierarchies; Favorite View preserves the source ratio with an adjacent caption; ten detail photographs appear in two ordered groups of five. Removing decorative card rotation and preserving natural image ratios protects faces. Mobile follows the saved source order. The lavender motif remains at the collection opening while the live heart recedes during photograph reading.

Reveal animations now move whole figures with their captions. Collection notes and nearby figures share the same spread trigger, preventing the confirmed opacity mismatch between a caption and its photograph. Personal photos have no independent zoom/parallax transform; restrained nonpersonal atmospheric motion remains. Animations preserve reserved layout dimensions.

## Preserved content and media

Nine chapters, Hero identity, color system, typography, saved dates and messages are preserved. `frontend/public/content/experience.json` has no changes. All 27 distinct personal photo sources resolve locally; the collection retains all 21 saved photographs, their captions and their order. No stock assets, replacements or filler duplicates were introduced.

Story association audit, in saved order:

| Memory | Existing media |
| --- | --- |
| memory-1 | img3772 |
| memory-2 | img0516 |
| memory-3 | No media assigned in saved content |
| memory-4 | No media assigned in saved content |
| memory-5 | img0085 |
| memory-6 | No media assigned in saved content |
| memory-7 | No media assigned in saved content |
| memory-8 | img0791 |

## Heart state map

All visible states remain horizontally centered. Sizes interpolate through chapter transitions, and reverse scrolling restores the same states.

| Chapter | Behavior |
| --- | --- |
| Hero | Large, dominant centered sculpture; gentle idle |
| Intro | 180px desktop / 90px phone, upper-center |
| Horizontal Story | 140px desktop in reserved upper space; phone heart recedes while reading |
| Full-width Memory | Live heart hidden during photograph reading |
| A Little Collection | Live heart hidden; static opening motif retained |
| Things I Love | Small upper-center introduction, hidden during body reading |
| Timeline | Small upper-center introduction, hidden during body reading |
| Birthday Letter | Hidden to prioritize the letter |
| Finale | Prominent centered sculpture follows its reserved document space as copy scrolls |

## Verification

All six requested frontend gates passed on the repaired source:

| Gate | Result |
| --- | --- |
| `npm.cmd run typecheck` | Passed |
| `npm.cmd run lint` | Passed |
| `npm.cmd run format:check` | Passed |
| `npm.cmd run test -- --maxWorkers=2` | 138 tests passed, 14 files |
| `npm.cmd run build` | Passed; existing 984KB 3D chunk warning |
| `npm.cmd run e2e -- --workers=1 --output=test-results/repair-final` | 71 tests passed, 8.0 minutes |

The final targeted resize/story/journey run also passed all 16 tests before the full suite. Worker limits keep local CPU/browser usage predictable. Earlier acceptance runs exposed the corrected scroll-cache restoration bug and one browser `ERR_NO_BUFFER_SPACE`; the final serial run had no failures. No assertions were weakened to bypass these failures. `git diff --check` passed with the repository's CRLF convention accounted for.

Regression coverage includes one memory per spread; bounded/reduced-motion yaw; first/middle/last photo pairing in both directions; slow/fast wheel reversal; exact pin end; rapid resize fallback recovery; downstream scroll restoration; figure/caption reveal synchronization; all collection photos loaded with original ratios and no overlap; gallery/lightbox keyboard, touch and focus behavior; heart silhouette and chapter positions; reduced motion; WebGL/context-loss/backdrop fallback; and no horizontal overflow.

Actual Chromium review sizes: 1440×900, 1024×768, 390×844, 360×844 and 320×844, plus existing 1864px desktop checks. Phones use vertical editorial story flow without sideways pinning. Reduced motion also uses natural flow. Spec and code-quality reviewers checked the story, gallery and heart repairs; the resize and refresh findings were corrected and reviewed again.

## Local visual evidence

Personal review captures remain local under `docs/evidence/scroll-gallery-repair/`, excluded from Git. They include every required width, desktop first/middle/last memories, gallery opening/spread/favorite/details/closing, letter/finale, reduced-motion captures and diagnostic JSON.

| View | Before | After |
| --- | --- | --- |
| Story 1440px | [Before](evidence/scroll-gallery-repair/before-story-1440.png) | [After](evidence/scroll-gallery-repair/after-story-1440.png) |
| Story 1024px | [Before](evidence/scroll-gallery-repair/before-story-1024.png) | [After](evidence/scroll-gallery-repair/after-story-1024.png) |
| Story 390px | [Before](evidence/scroll-gallery-repair/before-story-390.png) | [After](evidence/scroll-gallery-repair/after-story-390.png) |
| Story 360px | [Before](evidence/scroll-gallery-repair/before-story-360.png) | [After](evidence/scroll-gallery-repair/after-story-360.png) |
| Story 320px | [Before](evidence/scroll-gallery-repair/before-story-320.png) | [After](evidence/scroll-gallery-repair/after-story-320.png) |
| Collection 1440px | [Before](evidence/scroll-gallery-repair/before-gallery-1440.png) | [After](evidence/scroll-gallery-repair/after-gallery-1440.png) |
| Collection 390px | [Before](evidence/scroll-gallery-repair/before-gallery-390.png) | [After](evidence/scroll-gallery-repair/after-gallery-390.png) |

[Favorite View](evidence/scroll-gallery-repair/after-favorite-1440.png), [Little Details](evidence/scroll-gallery-repair/after-details-1440.png), [mobile collection](evidence/scroll-gallery-repair/after-gallery-320.png), [reduced-motion story](evidence/scroll-gallery-repair/reduced-story-1440.png).

[Browser screen recording, 1440px](evidence/scroll-gallery-repair/scroll-review-1440.webm). Reproduce captures with `node scripts/scroll-gallery-qa.mjs` from `frontend` while the local site runs on port 5174.

## Local commits

- `ef40fdc` — repair sequential scrolling and centered heart choreography, including regression coverage.
- `e57f41c` — compose collection as an editorial photo diary, including layout/media checks.

Both are local commits on `feat/domain-foundation`. Documentation and the reusable visual-capture script are recorded separately.

## Remaining limitations

The attachment available in this workspace is the written request. The referenced original recording and approved high-fidelity mockup were not available, so direct comparison with those references could not be performed. The collection follows the specified sequence and editorial rules; owner visual approval remains pending.

Browser verification uses desktop Chromium with phone-sized viewports, not physical phones or Safari/Firefox. The existing 3D bundle size warning remains; this repair adds no dependency. Backend/admin work, merge, push and deployment were outside the requested scope. Local ignored evidence needs to accompany any handoff outside this workspace.
