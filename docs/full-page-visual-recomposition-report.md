# Lavender Heart — full-page visual recomposition

This revision recomposes the nine existing visitor chapters for visual review. It preserves the original cloudy Hero, crystal geometry, serif/sans typography, palette, public data adapter and content order. It adds no product features or backend changes. Personal names, dates, memories, statements, letter and owner photographs still await supplied content.

## A. Before/after full-page screenshots

Open the [side-by-side comparison](evidence/recomposition/comparison.html). Both comparison columns use the same viewport and the real reduced-motion reading flow, so all seven Story panels are visible in document order.

| Viewport   | Before                                                                      | After                                                                      |
| ---------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1440 × 900 | [Desktop full page](evidence/recomposition/before/static-fullpage-1440.png) | [Desktop full page](evidence/recomposition/after/static-fullpage-1440.jpg) |
| 390 × 844  | [Phone full page](evidence/recomposition/before/static-fullpage-390.png)    | [Phone full page](evidence/recomposition/after/static-fullpage-390.jpg)    |

Unmodified motion captures are also retained: [before desktop](evidence/recomposition/before/fullpage-1440.png), [after desktop](evidence/recomposition/after/motion-fullpage-1440.jpg), [before phone](evidence/recomposition/before/fullpage-390.png), [after phone](evidence/recomposition/after/motion-fullpage-390.jpg). A stitched motion screenshot collapses scroll time and shows pin spacers; it cannot show every horizontal Story panel or vertically staged Love statement at once. The static comparison is an accessibility mode, not a screenshot-only DOM reconstruction. The separate viewport sequences below show the actual motion composition.

## B. Reworked chapter structure

| Chapter     | Composition                                                                                |
| ----------- | ------------------------------------------------------------------------------------------ |
| Hero        | Original immersive clouds, supplied-name layout and large central live crystal             |
| Intro       | Calm serif reading passage with space reserved for a smaller companion heart               |
| Story       | Viewport chapter opening, followed by composed horizontal spreads                          |
| Full Memory | Edge-to-edge beach photograph filling at least one viewport, with restrained caption       |
| Gallery     | Large chapter opening and irregular portrait-led photo wall                                |
| Love        | Large chapter opening; oversized numbers and one desktop statement at a time               |
| Timeline    | Distinct title, full-viewport first date scene, alternating date/photo/memory compositions |
| Letter      | Warm ivory, large opening, narrow reading measure and quiet signature                      |
| Finale      | Deep plum night, cloud haze, central crystal and oversized closing line                    |

The rhythm changes from immersive to calm, editorial, photographic, typographic and intimate before the dark closing scene. Gallery has no Story numbering. Love has no photographs. Timeline foregrounds dates rather than image grids.

## C. Horizontal Story redesign

Eight memories occupy seven panels in owner order, using six archetypes: large portrait, wide photograph, oversized date with small photograph, two-image spread, typography with a floating portrait, and cinematic dark spread. The paired panel consumes two memories once; the final two panels use the cinematic treatment. Each panel fits the ordinary desktop viewport without clipping the fixture copy.

Desktop uses a measured horizontal ScrollTrigger pin. Phones and reduced motion use intentional vertical compositions; unusually tall editable copy also switches to readable native flow. Late image/font/resize changes refresh downstream chapter positions after a pin is removed.

Review [entry](evidence/recomposition/after/story-entry-1440.png), [middle](evidence/recomposition/after/story-middle-1440.png), [exit](evidence/recomposition/after/story-exit-1440.png), and the seven [individual panel captures](evidence/recomposition/after/). The production QA also sends native mouse-wheel input forward and backward and checks that the track moves and returns, rather than relying only on document jumps.

## D. Gallery redesign

Sixteen unique development photographs form a twelve-column desktop wall: large portrait anchors, small landscape companions, offset medium portraits, a wide row and a second wider photographic beat. Explicit row placement prevents auto-placement from creating accidental empty half-rows. Phone layouts retain asymmetric widths and deliberate vertical ordering without overlap. Images can occlude the subtle live heart; navigation remains above both.

The native lightbox, keyboard arrows, touch swipe, Escape, focus containment and focus return remain. Review the [desktop wall](evidence/recomposition/after/gallery-wall-1440.png) and [phone wall](evidence/recomposition/after/gallery-wall-390.png).

The complete journey now assigns **31 different photographs to 31 positions**, with no repeated image source: eight Story, one Memory, sixteen Gallery and six Timeline. Subjects include portraits, pen detail, flowers, fern texture, coffee, interiors, architecture, city, water and wide landscapes. Full and 600px WebP variants remain self-hosted. [Media provenance and license](birthday-media-assets.md) records each source; [contact sheets](evidence/visual-recomposition/) show the inspected assets. These stock subjects do not represent the recipient or shared memories.

## E. Timeline/date redesign

The first date has a full-viewport stage and larger type before its photograph. Later moments alternate alignment and photograph scale around a prominent date, medium memory title and readable short copy. This creates a date-led sequence with a different hierarchy from Story and Gallery.

Real supplied dates render as semantic `<time dateTime="…">` with a large year and month/day. Actual dates remain null in development content. Optional presentation labels such as `YOUR YEAR` and `MONTH / DAY` demonstrate hierarchy without inventing a relationship history or false ISO dates. A missing date without a label produces no invented date scene.

Review [desktop date scene](evidence/recomposition/after/timeline-date-1440.png) and [phone date scene](evidence/recomposition/after/timeline-date-390.png).

## F. Persistent-heart state map

One live Canvas remains responsible for the journey. Measured section anchors drive interpolation; reverse scrolling restores the same states. The original geometry/materials stay intact. Generic progress-based mesh shrinking and camera retreat were removed so named chapter dimensions control scale.

| Chapter     | Desktop live state                                                     | Phone behavior                                                        |
| ----------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Hero        | Center; width `min(52vw, 760px)`; height `72vh`; opacity 1             | Center; width `min(92vw, 440px)`; height `52vh`                       |
| Intro       | Companion at 77% across/45% down; width 350px; opacity .9              | 110 × 145px at right; recedes before the reading passage              |
| Story       | Right-edge companion; width 200px; opacity .8                          | Recurs in the chapter opening, fades for memory reading               |
| Full Memory | Right edge; width 140px; opacity .5                                    | Secondary motif during arrival; fades before the caption              |
| Gallery     | Right edge; width 180px; opacity .65; photographs can cover it         | Visible at the opening, recedes for the photo wall                    |
| Love        | Left-edge companion; width 180px; opacity .85                          | Returns at the opening, fades for statements                          |
| Timeline    | Right-edge anchor; width 180px; opacity .75                            | Recurs between moments in reserved bridges, fades before dates/photos |
| Letter      | Width 140px; opacity 0                                                 | Quiet reading; opacity 0                                              |
| Finale      | Center at 38% down; width `min(70vw, 940px)`; height `72vh`; opacity 1 | Center; width `92vw`; height `62vh`; opacity 1                        |

Document-flow heart echoes preserve the motif in reduced-motion chapter openings and full-page reading captures. An onscreen echo hides while the live heart is visible, avoiding two competing hearts. This adds no WebGL contexts. Echo bounds are cached on refresh; the ticker changes attributes only when their values change.

## G. Blank-space audit

| Composition capture        | Before document height | After document height |
| -------------------------- | ---------------------: | --------------------: |
| Desktop static, 1440 × 900 |               30,159px |              33,322px |
| Phone static, 390 × 844    |               23,708px |              25,128px |
| Desktop raw motion         |               34,569px |              37,102px |
| Phone raw motion           |               23,455px |              27,246px |

Gallery row assignment removes accidental empty rows. The date Story spread uses its full text column, so a large neutral month label no longer breaks in the middle of a word. Desktop content reserves edge space for the heart without hiding photographs or body copy.

Remaining large spaces have a specific role: chapter titles with a restrained heart, the first full-viewport Timeline date, one Love statement per desktop viewport, phone heart bridges, and the Finale crystal. The bridges exist only during phone full motion; reduced motion reads directly through the Timeline. Long copy expands into native flow instead of disappearing behind a fixed stage.

Overall document length is not used as a success score: large date and typography scenes intentionally add room. Raw desktop pin spacers account for horizontal/vertical animation travel. The motion-input checks verify that travel changes visible content rather than producing dead scroll. Exact before/after dimensions are recorded in the [baseline](evidence/recomposition/before/qa-results.json) and [final QA results](evidence/recomposition/after/qa-results.json).

## H. Finale improvements

The final chapter has a deep plum-to-night background, visible cloud haze, a substantially larger rendered crystal and a large closing line. The recipient line sits above the crystal at a quieter scale so it remains readable. The heart returns to the center and reaches full opacity. Closing text begins after the reserved heart space; browser assertions check that the heart bounds stay clear of the message.

The development closing is `With love.`. Technical closing instructions were removed from the visitor-facing Finale. Recipient name, real birthday date and signature remain awaiting supplied content; none is fabricated. Review [desktop Finale](evidence/recomposition/after/finale-1440.png) and [phone Finale](evidence/recomposition/after/finale-390.png).

## I. Desktop/mobile QA

Production preview captures cover 1440 × 900, 1024 × 768, 390 × 844, 320 × 844 and 360 × 844 in both full and reduced motion. Each profile checks all nine chapters in order, loaded images, horizontal containment, one Canvas and absence of page runtime errors. Desktop checks require both Story and Love to retain their pins for the normal fixture.

Viewport captures cover every chapter, the Gallery wall, first date scene, every desktop Story panel and Story/Love entry/middle/exit. Browser regressions cover reverse handoffs, single-statement Love staging, phone date/photo/text clearance, hidden/empty chapters, long names, pause/live reduced-motion changes, blocked WebGL and context loss. A regression forces late Story and Love overflow and confirms downstream Love positioning and Finale restoration after the follow-up refresh.

I inspected browser screenshots; scrolling/input was driven through Chromium automation, including native mouse-wheel events. A human manual session on physical devices and Safari/iOS performance were not tested. User visual approval is still pending.

## J. Tests/build and review

- Unit suite: **129 passed** across 13 files.
- Complete Chromium suite: **26 passed** with two workers. After the final date-scene CSS adjustment, the eight affected journey browser tests also passed; both forward/reverse heart tests passed again after the recipient-line adjustment.
- ESLint, Prettier and TypeScript production build passed.
- Media self-check decoded all 31 main/31 small WebP assets, validated dimensions, unique assignments and null real dates.
- All ten production capture profiles passed: see the final QA JSON linked above. [Scroll QA](evidence/recomposition/after/scroll-qa-results.json) records the actual wheel progression: desktop Story moved from about −180px to −1080px and returned to −180px; 1024px Story moved from −154px to −922px and returned to −154px.
- Source and rendered spec review passed. Quality review passed after the late pin-removal refresh issue was corrected; its regression now passes. User visual approval is pending.

The production build retains the existing warning for the approximately 984kB uncompressed lazy Three.js scene chunk. No dependencies were added. Backend tests were not rerun for this frontend-only revision; the browser suite still checks Laravel health. The local API database remains unconfigured for real owner content, so the existing safe development-content fallback serves this preview.

## K. Commit and review stop

This revision is committed locally on `feat/domain-foundation`, with parent `28db31c`, under **`visual: recompose the nine-chapter lavender journey`**. Source, development assets, evidence, this report and the plan are included. The final handoff records the resulting commit SHA. No merge, push or deployment is part of this revision.

**Stop here for visual review.** Review the full-page comparison and actual local preview before approving the public composition. No next product feature has been started.
