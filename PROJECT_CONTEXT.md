# Lavender Heart — Project Context

Updated 2026-10-12 to describe the current website and the owner's approved frontend-only cleanup. This replaces the earlier Phase 1 full-stack specification as the current scope. Earlier phase reports remain historical records.

## 1. Identity and purpose

Lavender Heart is a personal birthday-gift website from the owner to his girlfriend. Photographs, shared memories, messages, meaningful dates, and a birthday letter form one continuous cinematic story. It remains available beyond the birthday and can grow through file-based content edits.

The Diamond reference informs editorial spacing, photography, depth, and scrolling. Its proprietary assets, copy, code, and exact composition must not be copied. Personal messages and photographs come from the owner; do not invent relationship details.

## 2. Current architecture

The application is a **frontend-only React/TypeScript/Vite SPA**. There is no Laravel backend, database, owner login, admin editor, upload API, or server-side content service in the current project.

The public route loads `/content/experience.json` from the same static host and validates it with Zod before rendering. Request failure or invalid content produces a recoverable error with a retry action. Cancellation prevents an unmounted route from updating. There is no API request, API fallback delay, or backend environment configuration.

The former Laravel/API foundation was removed at the owner's request because the current website does not use it. Its tracked implementation is recoverable from Git history. External database servers are outside this cleanup's scope.

## 3. Visitor experience

One public page contains the following fixed chapter order:

| Order | Chapter                 | Current presentation                                                     |
| ----- | ----------------------- | ------------------------------------------------------------------------ |
| 1     | Hero                    | Staggered recipient name, layered clouds, lavender crystal heart         |
| 2     | Intro                   | Birthday message with editorial text and cloud choreography              |
| 3     | Horizontal Story        | Photo and message spreads progressing horizontally with vertical scroll  |
| 4     | Full-width Memory       | Large photograph with parallax and caption                               |
| 5     | Gallery                 | Editorial photo spreads, interactive photo sphere, and a closing message |
| 6     | Things I Love About You | Statements staged one at a time during scroll                            |
| 7     | Timeline                | Vertical relationship moments with text and photographs                  |
| 8     | Birthday Letter         | Calm, readable letter and signature                                      |
| 9     | Final Closing           | Returning heart and closing message                                      |

Hero and Final Closing remain required. Eligible intermediate chapters can be hidden through the content file; hidden chapters must leave no empty space or invalid navigation targets. Entry ordering comes from the saved content, with position fields where applicable. The visitor can read, scroll, drag the sphere, and open photographs; visitors cannot edit content.

Navigation provides Home, Intro, Photos, Letter, and Pause/Resume motion. It adapts to valid visible chapters and preserves keyboard focus. The photo lightbox supports full photographs, next/previous navigation, keyboard/touch interaction, Escape, and focus return.

The photo sphere rotates immediately when visible and motion is enabled. Drag/touch can rotate it, and keyboard controls remain available. Its background uses restrained static constellation details and lavender highlights. Orbital rings and extra cloud-only passage screens remain removed; clouds beside the Gallery closing message remain.

## 4. Visual and responsive requirements

Retain the lavender editorial identity, Cormorant Garamond and Inter, generous spacing, natural personal photography, and the translucent lavender crystal heart. The current presentation uses Lavender Mist. The content schema recognizes three preset identifiers, but there is no owner-facing theme switcher or implemented editor.

Preserve the desktop composition and animation choreography on phones and tablets in portrait and landscape, with dimensions adjusted to fit. Do not replace the normal mobile/tablet experience with a different static layout. Keep names, captions, text, navigation, and photographs readable and within the viewport. Long names, genuinely oversized content, Pause, and reduced motion retain accessible reading fallbacks.

Follow `DESIGN.md` for the detailed visual direction, as amended by the owner's later approved changes. Do not add generic marketing cards, invented romantic copy, random decoration, a new cursor, or unrelated spectacle.

## 5. Scrolling and animation

Native browser scrolling owns wheel, touch, and keyboard input. There is no Lenis scroll interception. Native sticky stages support horizontal Story and staged Love without GSAP pinning.

GSAP/ScrollTrigger owns opening reveals, cloud movement, text masks, photo curtains/parallax, chapter transitions, and heart travel. React Three Fiber/Three.js owns crystal rendering. The heart rotates horizontally around its Y axis with scroll and reverses direction when scrolling back. Motion handles small UI transitions; projected transforms animate the interactive photo sphere.

Optimize lifecycle and rendering while preserving the requested animation. Use scoped cleanup and debounced viewport refresh; do not globally reset reader position during resize. Keep the bounded WebGL renderer, visibility-aware rendering, reduced-motion handling, and heart fallback. Do not restore expensive refraction buffers or recreate the renderer during every viewport change.

## 6. Content editing and assets

Today the owner edits files, saves explicitly, and reloads/rebuilds the site:

- `frontend/public/content/experience.json`: names, dates, messages, chapter visibility, Story, Gallery, Love entries, Timeline, Letter, and photo descriptors.
- `frontend/src/features/public/collectionContent.ts`: Gallery introduction and closing copy.
- `frontend/public/`: local cloud images, fonts, and photographs referenced by the website.

Keep the JSON's top-level compatibility fields synchronized with their corresponding section content. Dates use `YYYY-MM-DD` or `null`. Preserve runtime validation, limited rich-text support, alt text, focal positions, and responsive image descriptors. No arbitrary HTML is accepted.

Personal derivatives in `frontend/public/photos/personal/` are ignored by Git and must be restored separately after cloning. Keep photographs and originals safe during cleanup. Build output is replaceable; source content and personal media are not.

The optional relationship-days display uses the supplied relationship date and visibility flag. Do not invent a date to enable it. Further editing details are in `docs/birthday-content-editing.md`.

## 7. Source organization

| Location                        | Responsibility                                        |
| ------------------------------- | ----------------------------------------------------- |
| `frontend/src/app/`             | Application composition and routing                   |
| `frontend/src/features/public/` | Experience data contracts, route, and collection copy |
| `frontend/src/models/`          | Public domain types and validation schemas            |
| `frontend/src/views/`           | Public page and presentational components             |
| `frontend/src/controllers/`     | Interaction and reading-position hooks                |
| `frontend/src/services/`        | Loading validated local content                       |
| `frontend/src/animations/`      | GSAP choreography and scroll helpers                  |
| `frontend/src/three/`           | Heart geometry, rendering, scenes, and fallback       |
| `frontend/src/styles/`          | Tokens and responsive chapter styling                 |
| `frontend/public/`              | Static content and media                              |
| `frontend/tests/e2e/`           | Browser regressions                                   |
| `frontend/scripts/`             | Media preparation and visual inspection tools         |
| `docs/`                         | Plans, editing guidance, and historical reports       |

Use the existing active modules and platform features before adding dependencies. Remove demonstrably unused scaffolding; do not delete working animation, accessibility, media tools, regression tests, or personal assets just to reduce the file count.

## 8. Setup and delivery

Node.js and npm are the only development prerequisites. One terminal runs Vite from `frontend/`; see `README.md` for exact commands. No PHP, Composer, MySQL, or `.env` is needed.

A production build creates `frontend/dist/`, suitable for static hosting with SPA fallback. The JSON and media must ship with the build. The repository is private at `wtfmigo/lavender-heart`; the Git worktree is a development arrangement, not a hosting requirement.

Older documents describing Phase 0, two app servers, API health, Laravel migrations, or owner CMS setup do not describe the current application.

## 9. Accessibility, privacy, and verification

Support keyboard focus, semantic chapters, descriptive photo alternatives, touch interaction, Pause/Resume, live reduced-motion preference changes, and WebGL failure fallback. Motion must not make text or chapter navigation inaccessible.

There is no visitor authentication. Anyone with the deployed URL can access it. `noindex` is a discovery preference, not authorization. Do not add analytics, advertising trackers, visitor accounts, forms, comments, reactions, social sharing, background audio/video, or AI-generated personal content.

For frontend changes run relevant unit/browser checks, lint, formatting, typecheck, and production build. Responsive animation work requires desktop, phone, and tablet portrait/landscape verification. Report physical-device and browser coverage honestly; emulation does not prove performance on every device.

## 10. Earlier CMS proposal

The earlier specification proposed a single-owner structured editor, authentication, uploads, explicit Save-to-live, revision recovery, trash, and backup/import-export. These features were not completed. They are **outside the current frontend-only scope**, and no admin or backend scaffolding is retained solely for that proposal. Reintroducing a CMS or backend requires a new explicit request and architecture plan.

## 11. Source of truth

Resolve conflicts in this order: latest explicit owner instructions, this current context, `DESIGN.md`, `AGENTS.md`, an approved implementation plan, then existing code. Historical phase boundaries do not cancel later approved work. Keep documentation synchronized with actual behavior without weakening the owner's visual or accessibility requirements to excuse bugs.
