# Lavender Heart — Birthday-Ready End-to-End Build Report

Verified October 8, 2026. The complete public journey works with neutral development content. Recipient details, personal photos, actual dates, statements and the birthday letter still await owner input, as authorized. No personal memories or romantic letter were invented.

Hallmark self-review: Philosophy 4, Hierarchy 4, Execution 4, Specificity 3, Restraint 5, Variety 4. Personal content remains provisional; the cloud/crystal identity, typography and chapter variety are established.

Development: http://127.0.0.1:5174/ · Production build preview: http://127.0.0.1:5175/.

## A. Public site completion

The root route renders the full nine-chapter experience in development and production. All chapters can be traversed from Hero to Finale. Hidden chapters and empty optional collections disappear together with their navigation targets. The production build uses a fresh, validated content request rather than a development-only fixture route.

## B. All nine chapters

| Chapter           | Delivered behavior                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| Hero              | Preserved cloud world, large editorial name, original crystal heart and bounded opening reveal             |
| Intro             | Birthday-message composition with editable structured text and a cloud bridge                              |
| Horizontal Story  | Eight memories; desktop vertical scrolling drives horizontal spreads; natural vertical phone flow          |
| Full-width Memory | Large photographic scene, gentle desktop/phone parallax, editable caption and optional date                |
| Gallery           | Sixteen slots, mixed portrait/landscape scales, asymmetric composition and working lightbox                |
| Things I Love     | Six numbered statements, generous spacing and large editorial typography                                   |
| Timeline          | Six alternating image/text moments, large indices and date-ready typography; owner position controls order |
| Birthday Letter   | Narrow, calm reading measure with editable opener/body/signature; one obvious temporary letter block       |
| Finale            | Night lavender/plum scene, returning crystal heart, closing message, signature/date and optional counter   |

No marketing footer, social controls or extra CTA was added. Dates remain absent until supplied; no relationship dates were fabricated.

## C. Persistent heart behavior

One Canvas accompanies the whole journey. One measured ScrollTrigger timeline owns its position, scale and opacity; forward and reverse scrolling restore the correct state. The desktop heart moves to reserved edge space, hides for the full-width photograph and letter, then returns above the closing text. The phone composition shows it in Hero and Finale and pauses it through the reading/photo chapters to prevent obstruction. Slow rotation and scroll progression remain; pointer-driven rotation was removed. The original static fallback covers missing WebGL and context loss. Reduced motion also has a static Finale heart.

## D. Photo/story layouts

Three alternating spread structures provide portrait/landscape and text/image variation. The desktop gallery reserves a clear gutter for the heart. Gallery controls include previous, next, close, arrow keys, Escape, touch swipe, native modal focus containment and thumbnail focus return. Eight reusable nature photographs supply the sixteen development gallery slots; these are explicitly development imagery. See [asset provenance](birthday-media-assets.md). Real replacements require descriptor changes, not component rewrites.

## E. Desktop/mobile behavior

Actual production-page traversal passed at 1440×900, 1024×768, 390×844, 320×844 and 360×844: correct nine-chapter order, loaded images, one Canvas, zero page errors and no horizontal overflow. Browser tests additionally cover the 768px breakpoint. Pinning begins at 1024px; smaller widths use vertical story flow. Minimal phone navigation retains brand/Home, Photos, Letter and motion control. Full-motion reverse scrolling and Finale heart/message separation have browser regression checks.

## F. Backend/API integration status

Read-only `GET /api/experience` serves explicit public DTOs from existing settings, visible chapters and collections. Owner position remains authoritative. Private owner/version/storage metadata is excluded. `GET /api/media/{ulid}` serves an existing ready derivative only when a visible live collection references it; hidden, deleted, pending, missing or unreferenced assets are unavailable.

The frontend adapter validates both API and local responses, resolves API media against its origin, limits the API wait to 2.5 seconds and preserves local content on an unavailable, invalid or unconfigured API. Caller cancellation prevents a fallback request. Leave `VITE_API_BASE_URL` blank for today's local editing path.

The present backend development configuration uses `DB_DATABASE=:memory:` and has no persistent content tables across HTTP requests. Its live API therefore returns a sanitized 503. A persistent database, approved migrations and real owner content are needed before enabling API content. No real database, owner credentials or personal records were modified. The existing full-width backend contract has no media assignment, so API `memoryPhoto` is `null`; the local source supports that photograph today.

## G. Admin editing status

The working owner path today is explicit file editing and Save in [the single content document](../frontend/public/content/experience.json), followed by reload or production rebuild. [Editing instructions](birthday-content-editing.md) map every chapter, collection, date, letter and photograph field.

A protected browser login/editor, CRUD screens, upload workflow and explicit browser Save are **not implemented**. They were deferred under the brief's public-first allowance rather than exposing unauthenticated writes. Existing persistence and contracts remain intact.

## H. Deferred noncritical features

Protected admin editing, production media processing, full-width API photo assignment, backup/import, revision/Trash UI polish, advanced preview and production S3 remain follow-up work. No dependency was added. Impeccable tooling was not invoked because its runtime hooks were not verified. Hallmark and separate spec/quality reviews passed; the page retains structural variety, serif typography, established tokens and restrained chrome.

## I. Accessibility/reduced motion

Skip link, semantic chapter regions/headings, supplied image descriptions, usable anchor targets, keyboard lightbox controls, modal focus handling and motion pause remain available. OS reduced motion responds live, stops Lenis and strong parallax, removes story pinning and keeps every memory in vertical flow. Browser checks cover reduced motion, hidden sections, long names, WebGL failure and context loss. Real assistive-technology testing remains outstanding.

## J. Performance

Images below the opening are lazy, dimensioned and decoded asynchronously; the gallery uses responsive variants. Sixteen self-hosted photo files total about 2.76 MB (eight main images plus eight smaller variants). The heart scene is lazy-loaded, uses bounded DPR (phone 1–1.25; desktop 1–1.75) and demand rendering when paused/hidden. One Lenis owner, scoped ScrollTriggers, debounced image-load refresh and listener/ticker cleanup prevent accumulating work.

Vite still reports the Three/R3F scene chunk above 500 KB: approximately 984 KB minified / 266 KB gzip. It is deferred behind the opening, but physical-phone GPU and network performance have not been calibrated.

## K. Tests/build

| Check                            | Result                                        |
| -------------------------------- | --------------------------------------------- |
| `npm.cmd run typecheck`          | Passed                                        |
| `npm.cmd run lint`               | Passed, no warnings                           |
| `npm.cmd run format:check`       | Passed                                        |
| `npm.cmd run test`               | 119 passed across 13 files                    |
| `npm.cmd run build`              | Passed; lazy scene chunk-size warning remains |
| `npm.cmd run e2e -- --workers=2` | 22 browser tests passed                       |
| `php artisan test --compact`     | 164 passed, 1,166 assertions                  |
| Pint, changed backend files      | Passed                                        |
| Production visual script         | All five required viewports passed            |

## L. Screenshot paths

Evidence is in [birthday-ready](evidence/birthday-ready/): 57 PNGs, [QA results](evidence/birthday-ready/qa-results.json) and [captured scroll/heart positions](evidence/birthday-ready/capture-positions.json).

Required representative captures:

1. [Hero](evidence/birthday-ready/hero-1440.png)
2. [Mid-scroll heart](evidence/birthday-ready/mid-heart-1440.png)
3. [Horizontal Story](evidence/birthday-ready/story-1440.png)
4. [Large editorial/date-ready scene](evidence/birthday-ready/editorial-date-1440.png)
5. [Full-width Memory](evidence/birthday-ready/memory-1440.png)
6. [Gallery](evidence/birthday-ready/gallery-1440.png)
7. [Things I Love](evidence/birthday-ready/love-1440.png)
8. [Timeline](evidence/birthday-ready/timeline-1440.png)
9. [Letter](evidence/birthday-ready/letter-1440.png)
10. [Finale](evidence/birthday-ready/finale-1440.png)
11. [Mobile Hero](evidence/birthday-ready/hero-390.png)
12. [Mobile middle](evidence/birthday-ready/gallery-390.png)
13. [Mobile Finale](evidence/birthday-ready/finale-390.png)

Additional evidence includes every chapter at each tested width, the [phone lightbox](evidence/birthday-ready/lightbox-mobile.png) and [WebGL fallback](evidence/birthday-ready/fallback-mobile.png). Reproduce the production pass from `frontend` with `BIRTHDAY_QA_URL=http://127.0.0.1:5175/` and `node scripts/birthday-visual-qa.mjs` while preview is running.

## M. Commits

Local implementation commits on `feat/domain-foundation`:

- `1dcf323` — complete nine-chapter public experience and safe data fallback.
- `61438a6` — whitelisted read-only experience API and protected derivative delivery.
- A subsequent documentation commit records this report, editing instructions, asset provenance and screenshot evidence; its exact hash is in the final handoff.

Approved A1/A2/A3 and Phase 8 history was preserved. No merge, push or deployment was performed.

## N. Exact remaining blockers

There is no blocker to traversing the complete local public experience. Personalization awaits the owner's recipient name, dates, photographs, memories, statements, letter and closing signature. These placeholders are authorized and do not block the structure.

API-backed owner content needs persistent database setup and populated records. Browser admin and upload remain deferred. The site has not been deployed, so the local preview is not a publicly shareable gift URL. No deployment authorization was requested or assumed.

Physical-phone GPU, real screen reader and production hosting checks were not performed. The visible development content must be replaced before presenting it as a personalized birthday gift.
