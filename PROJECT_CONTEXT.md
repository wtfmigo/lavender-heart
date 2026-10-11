# Lavender Heart — Project Context

This document defines the approved product scope and technical direction for Lavender Heart. It is a specification, not a claim that the product features already exist. Phase 0 provides the technical foundation; Phase 1 creates this document only. Visual specification belongs in Phase 2, subject to explicit approval.

## 1. Project Overview

**Lavender Heart** is a private-link, cinematic, editable birthday-gift website created by the owner for his girlfriend. Photographs, shared memories, personal messages, meaningful dates, and a birthday letter form one continuous story.

The experience should feel handcrafted and personal. Personal content must be editable through the admin rather than hardcoded in React components.

The primary visual and interaction reference is **The Diamond website**. It provides context for premium editorial presentation, cinematic scrolling, generous spacing, strong photography, a sculptural centerpiece, horizontal storytelling, parallax, and refined motion. It is a reference, not a cloning target: do not copy its exact layout, proprietary assets, text, wedding-specific content, or attempt pixel-perfect reproduction. Detailed visual decisions belong in `DESIGN.md` later.

## 2. Purpose and Lifetime

The initial occasion is the girlfriend's birthday. The initial gift contains photographs, memories, personal messages, relationship moments, and a birthday letter.

The site is **evergreen**. After the birthday, the public experience remains available and the admin remains usable. The owner can add memories and photographs, grow the timeline, and update messages. There is no forced archival state.

## 3. Product Goals

- Present a personal, emotionally authentic birthday gift through a continuous cinematic experience.
- Keep photographs, messages, dates, memories, and other meaningful content editable by the owner.
- Support ongoing use beyond the birthday without becoming a general-purpose content platform.
- Preserve a curated story while providing controlled content editing, recovery, and backup.
- Deliver responsive, accessible interaction with smooth performance on desktop and mobile.

## 4. Product Principles and Priorities

Priorities, in approved order:

1. Emotional authenticity
2. Personal content
3. Premium cinematic experience
4. Smooth performance
5. Accessibility
6. Privacy
7. Maintainability
8. Controlled editability
9. Responsive behavior
10. Long-term usability

These priorities guide future decisions within the approved scope. They do not authorize additional features or unrestricted customization.

## 5. User Model

### Owner / admin

The owner is the only administrator and editor. Use one admin account with email and password authentication. Create the account during setup or seeding; provide no public or admin registration page.

The owner controls all content editing and can change the password later. Automated forgot-password email is not required for V1; manual password recovery/reset is acceptable. There are no additional administrators, staff accounts, or role/permission matrix.

### Girlfriend / visitor

The girlfriend is a visitor only. Her experience is read, view, and interact. She does not need registration, login, an account, a profile, comments, reactions, forms, or reply functionality. Visitors cannot create or edit content.

## 6. Privacy and Access

The public experience uses **private link only**. Anyone who has the URL can technically access the page. The owner controls access primarily by deciding who receives the URL; this is not cryptographic privacy or visitor authorization.

- No visitor passcode or login gate.
- No scheduled birthday unlock, countdown gate, or birthday-based access control.
- No public directory/listing or social-discovery features.
- Prefer `noindex` and search-engine exclusion behavior; these are discovery controls, not access controls.
- Protect the admin area separately through authentication and backend access control.

## 7. Public Experience

The girlfriend-facing experience is a **single page**, presented as one continuous cinematic story. Memories, Gallery, Timeline, Letter, and Things I Love About You are sections or chapters, not separate public routes/pages. The admin may have multiple routes/pages.

The visitor experience is view-only but interactive. Approved interactions include normal vertical scrolling, cinematic scrolling, parallax, pinned scenes, desktop horizontal memory storytelling, gallery/lightbox navigation, opening and reading content, minimal navigation jump links, and responsive/touch interaction.

Do not include comments, likes, reactions, submissions, forms, visitor-generated content, sharing buttons, or explicit download buttons.

Personal content may be English, Tagalog, or Taglish. V1 has no full localization/i18n system or language switcher. V1 also has no background music/audio feature and no analytics, advertising trackers, visitor profiling, analytics cookies, visit counters, or device analytics dashboard.

## 8. Core Section Structure

The major sections have this **fixed curated order**:

| Order | Section |
| --- | --- |
| 1 | Hero + 3D heart |
| 2 | Intro birthday message |
| 3 | Horizontal photo + message story |
| 4 | Full-width parallax memory |
| 5 | Curated gallery |
| 6 | Things I Love About You |
| 7 | Relationship / special moments timeline |
| 8 | Main birthday letter |
| 9 | Final heart scene + closing message |

The admin cannot rearrange these major sections or compose a free-form page. Entries inside appropriate sections may be reordered, including horizontal story memories, gallery images, Things I Love About You entries, and timeline moments.

Non-essential sections may support Show / Hide. **Hero and Final Closing remain required.** A hidden section is removed completely from the public flow without blank space. Navigation must not point to hidden or invalid content, and scroll/animation choreography must adapt safely.

## 9. Admin / Editor Experience

The admin uses a **structured visual section manager**. It is not Elementor, Webflow, a free-form page builder, or a block editor with unlimited layout control.

Recommended editor areas map to the curated story and supporting operations:

- Hero
- Intro
- Horizontal Story
- Full-Bleed Memory
- Gallery
- Things I Love About You
- Timeline
- Birthday Letter
- Final Message
- Site / Theme Settings
- Trash
- Revision History
- Backup / Import-Export

Per-section capabilities may include editing text and dates, uploading or replacing images, removing/deleting content, reordering approved entries, showing/hiding eligible sections, and previewing content. Capabilities must respect the fixed major section order and controlled presentation.

Include a live visual preview so the owner can see approximately how edited content will look. On desktop, a side-by-side arrangement or another practical preview arrangement is acceptable. On smaller screens, a separate preview mode is acceptable. Preview does not create a draft publishing system.

## 10. Save and Publishing Model

The approved workflow is **Edit → Explicit Save → Live**.

- Do not autosave while typing.
- Unsaved edits remain local to the current form until Save.
- Clicking Save persists the content.
- A successful Save publishes the updated content immediately.
- There is no separate Publish button and no draft workflow.

Preview helps the owner assess the current edits; it does not change this publishing model.

## 11. Content Model Overview

The high-level content includes the girlfriend's name/nickname, photographs, personal messages, shared memories, meaningful dates, Things I Love About You entries, relationship timeline moments, the birthday letter, and the final closing message.

Most memory entries should be short and concise. Selected important memories may contain longer text. Avoid unnecessarily strict hard character limits; soft guidance or warnings may protect layout and pacing.

Use these soft recommended content ranges:

| Content | Recommended range |
| --- | --- |
| Horizontal Story | 5–12 items |
| Gallery | 8–30 photos |
| Things I Love About You | 5–15 entries |
| Timeline | 4–12 moments |

The owner may exceed these ranges. If exceeding a range could harm pacing or performance, warn rather than hard-blocking the action.

### Limited rich text

Allow paragraphs, line breaks, bold, italic, and short blockquotes. Do not allow arbitrary fonts, text colors, font sizes, HTML/CSS, or layout control. The design system controls presentation.

This document establishes content responsibilities and behavior only; it does not define database schemas, API payloads, or editor implementation details.

## 12. Media Handling and Storage

V1 supports **photos/images only**, with no uploaded video. Accepted source formats may include JPG/JPEG, PNG, and WebP.

Future image handling should support:

- Preserving original uploads and generating optimized derivatives.
- WebP/AVIF derivatives where technically appropriate and responsive image sizes.
- Portrait and landscape images, with focal point/crop positioning where needed.
- Lazy loading for non-critical images.
- File type and file size validation.
- Safe server-generated filenames.

Do not store image binary data directly in normal database fields. Database records store paths/references and metadata.

Use **Laravel Storage abstraction**. Development uses local Laravel-managed storage. Production architecture remains portable to an S3-compatible or other cloud storage provider later, without permanently binding V1 to a specific vendor. No production storage vendor is selected here.

## 13. Editable Personalization

Admin-editable personalization includes girlfriend name, nickname, birthday date, hero title, hero subtitle, closing signature, and an optional relationship start date. Do not hardcode these values into React.

An optional relationship start date may drive a subtle automatically calculated relationship counter, such as a days-together message. The counter is optional, has a Show / Hide control, and must not become a dashboard/statistics block.

The editable birthday date may support birthday-related copy, date treatment, and optional year/age context. It must not control access, trigger automatic unlock, or create a countdown gate.

## 14. Controlled Theme Editing

The owner can choose one approved **whole-site preset**, active globally:

1. **Lavender Mist — default**
2. **Lavender Night**
3. **Pearl Lavender**

Do not allow arbitrary per-section theme editing, fonts, palettes, spacing, layouts, animation settings, or custom CSS through the admin. Detailed visual definitions of these presets belong in `DESIGN.md`; no colors, typography, spacing, or compositions are specified here.

## 15. Revisions and Trash

### Simple revision history

Because Save publishes immediately, meaningful editable content should preserve recent revisions where practical. Revision information includes the prior value/version, a timestamp, and the ability to Restore.

Applicable examples include messages, captions, the birthday letter, timeline content, section text, and significant settings. This is simple content recovery, not Git-style content version control.

### Soft deletion / Trash

Use **Delete → Trash → Restore or Permanent Delete** for meaningful editable records where appropriate. Applicable examples include uploaded photos, horizontal-story entries, gallery entries, Things I Love About You items, and timeline moments.

Destructive actions require clear confirmation.

## 16. Backup and Recovery

Include simple export/import backup capability that supports restoring editable content, settings, media references, and the required media/storage files or structure. References alone must not be mistaken for a backup of the files needed to restore the site.

This is not enterprise backup infrastructure, cloud backup scheduling, or complex retention management. The backup format and implementation are not specified in this phase. Manual password recovery/reset remains acceptable for the single owner account.

## 17. Frontend Architecture

Preserve the separate React SPA in `lavender-heart/frontend/`. Use the existing **MVC-inspired / layered React architecture**; React is not traditional server-side MVC.

| Responsibility | Location / approach |
| --- | --- |
| App composition, routing, providers | `src/app/` |
| Models: domain types, TypeScript interfaces, Zod schemas | `src/models/types/`, `src/models/schemas/` |
| Views: layouts, pages, presentational components | `src/views/` |
| Controllers / orchestration: hooks and modules coordinating interaction, state, and API behavior | `src/controllers/` |
| Services: API/HTTP and application services | `src/services/` |
| Server state | TanStack Query |
| Shared client state, only where genuinely necessary | Zustand in `src/stores/` |
| Feature organization as approved features are added | `src/features/` |
| Isolated Three.js / R3F modules | `src/three/` |
| Isolated animation modules and hooks | `src/animations/` |

Strict TypeScript and the `@/*` alias are configured in TypeScript and Vite. Avoid unnecessary global stores; server state belongs to TanStack Query. The frontend communicates through the centralized environment-configured Axios client and never accesses the database directly.

Animation responsibilities remain separate: native browser scrolling, CSS scroll timelines for the sticky horizontal Story and cloud/text parallax (passive, visible-only fallbacks where needed), Three.js/R3F for WebGL scenes, Motion for small React UI transitions, and CSS/IntersectionObserver for restrained chapter entrances. The owner's latest refinement preserves desktop arrangements, horizontal Story and parallax on phones/tablets in either orientation. Reduced motion and oversized content retain accessible vertical flow. The public journey uses no GSAP pins or Lenis interception; installed libraries remain available. Do not create competing systems for the same responsibility.

## 18. Backend Architecture

Preserve the Laravel REST API in `lavender-heart/backend/` and its normal conventions.

| Layer | Responsibility |
| --- | --- |
| Controllers | Thin HTTP request/response orchestration |
| Form Requests | Validation |
| Models | Data, relationships, and state |
| Services / Actions | Application and business logic |
| Policies / Middleware | Authorization and access control |
| Resources | Consistent API representations |

Avoid giant controllers, unnecessary fat models, and speculative abstractions. Laravel owns persistence, authentication, authorization, validation, media/storage, revisions, trash/restore, backup/import-export, and API responses.

MySQL/MariaDB is the application database target. SQLite memory settings in PHPUnit are test isolation, not a change to the approved application database.

## 19. Approved Tech Stack and Current Foundation

The versions below were checked against installed dependencies on **2026-10-07**, using `npm.cmd ls --depth=0 --json` and `composer show --direct --format=json`. They are resolved installed versions, not the version ranges in manifests. Lockfiles remain the authoritative complete dependency records.

| Area | Approved technology | Installed version |
| --- | --- | --- |
| Frontend core | React / React DOM | 19.3.0 / 19.3.0 |
| Frontend language | TypeScript | 6.0.3 |
| Build tooling | Vite | 8.3.3 |
| Styling | Tailwind CSS / Vite plugin; custom CSS where justified | 4.3.3 / 4.3.3 |
| Routing | React Router (`react-router`) | 8.4.0 |
| 3D | Three.js / React Three Fiber / Drei | 0.186.1 / 9.8.1 / 10.7.9 |
| Scroll animation | GSAP / `@gsap/react` / ScrollTrigger | 3.15.0 / 2.1.2 / included in GSAP |
| Smooth scrolling | Lenis | 1.3.26 |
| React UI transitions | Motion (`motion`, the approved Motion/Framer Motion choice) | 14.0.0 |
| HTTP / server state | Axios / TanStack Query | 1.20.0 / 5.104.1 |
| Shared client state | Zustand | 5.0.15 |
| Validation | Zod | 4.6.5 |
| Backend | Laravel / REST API | 12.69.3 |
| Authentication foundation | Laravel Sanctum | 4.3.3 |
| Frontend tests | Vitest / React Testing Library / jest-dom / user-event | 5.0.3 / 16.3.3 / 7.0.1 / 14.6.7 |
| E2E tests | Playwright | 1.63.0 |
| Backend tests | PHPUnit (existing approved Pest/PHPUnit choice) | 11.5.57 |
| Frontend quality | ESLint / Prettier | 10.12.0 / 3.9.9 |
| Backend quality | Laravel Pint | 1.30.4 |
| Local environment | XAMPP; PHP / Node / npm / Composer | 8.2.12 / 24.18.0 / 11.16.0 / 2.10.2 |
| Database | MySQL / MariaDB | Target configured; live server version not verified |
| Version control | Git / GitHub | Approved tools; repository/remote not initialized or configured |

### Existing Phase 0 state

- Separate frontend/backend folders, installed dependencies, environment examples, strict TypeScript, aliases, quality scripts, and smoke-test tooling exist.
- `/` is a plain technical frontend placeholder with an optional environment-configured API health check. `/__smoke/three` is a development-only primitive/fallback smoke route; it is not the product heart or a final scene.
- Laravel provides `GET /api/health` with `{"status":"ok"}`, stateful Sanctum middleware, environment-driven CORS/Sanctum configuration, and normal framework scaffolding. No admin auth flow or Lavender Heart domain features exist.
- Backend environment examples target MySQL with blank credential placeholders. Database creation, credentials, and migrations remain manual setup; product database connectivity is not established by this document.
- `SKILLS_INSTALL.md` is absent from this workspace, despite the Phase 1 request expecting it. It was neither created nor modified for this phase.
- No Git repository or GitHub remote currently exists. Git/GitHub remain approved version-control tools; this phase does not initialize or connect them.

These observations do not change the approved architecture. All working Phase 0 files are preserved. `README.md` remains the technical setup reference; `docs/phase-0-report.md` records prior verification results and environment limitations.

## 20. Authentication

Use **Laravel Sanctum SPA/session authentication** for the single owner/admin: email and password, secure sessions/cookies, and CSRF protection. Backend authorization protects all owner-only operations.

JWT is not required. Do not store auth bearer tokens in `localStorage`. There is no visitor authentication, no public registration, and no admin registration. Account creation occurs during setup/seed; password changes and manual recovery must remain possible.

Sanctum's installed foundation is preparation for this behavior, not an implemented login flow.

## 21. Deployment Expectations

Development uses the existing XAMPP-based environment with separate Vite and Laravel development servers. The current project root denies direct Apache access to private files; this is a local workspace safeguard, not a production hosting decision.

The architecture must remain deployable online later:

- Frontend API base URL comes from environment configuration (`VITE_API_BASE_URL`).
- Backend configuration comes from environment values, including frontend origins and Sanctum stateful domains.
- No localhost URLs may be hardcoded into application behavior.
- Keep local, test, and production environments separate, and keep real credentials out of source control.
- Do not rely on XAMPP-specific production assumptions.
- Preserve portable Laravel-managed storage.

No production host, deployment provider, or cloud storage vendor is selected in this document.

## 22. Performance Expectations

Performance is a core requirement because the final site will be image-heavy, animation-heavy, and WebGL-enabled.

Future implementation must prioritize responsive images, lazy loading, WebGL adaptation, reduced effect complexity on weaker devices, avoiding unnecessary React re-renders, avoiding obvious scroll/animation jank, and mobile performance.

Detailed budgets and implementation rules belong in later approved `DESIGN.md` / `AGENTS.md` work. Do not invent numerical budgets or exact animation choreography in this phase.

## 23. Accessibility Expectations

Accessibility is required. Future implementation must consider keyboard accessibility, visible focus states, semantic structure, useful alt text, sufficient contrast, touch usability, reduced-motion preferences, and content remaining readable when animations are reduced or disabled.

Detailed visual and interaction implementation belongs in `DESIGN.md`. Accessibility is not optional because the experience is cinematic.

## 24. V1 Scope

Approved V1 product scope comprises:

- The single-page story with the fixed nine-section order, required Hero/Final Closing, eligible section visibility, and approved visitor interactions.
- One authenticated owner and one structured visual section manager, with content editing, appropriate image operations and entry reordering, and practical visual preview.
- Explicit Save that immediately publishes; simple revision Restore and Trash recovery with confirmed destructive actions.
- Photos/images only, smart image handling, Laravel Storage, editable personalization, optional relationship counter, and limited rich text.
- One global preset selected from Lavender Mist, Lavender Night, or Pearl Lavender.
- Simple export/import backup and recovery.
- Evergreen use, responsive performance, accessibility, private-link distribution, and search-discovery exclusion preference.

This is approved scope for later implementation, not authorization to implement it during Phase 1. Optional capabilities remain optional; recommended ranges and editor arrangements remain guidance rather than hard restrictions.

## 25. V1 Out of Scope

Do not implement any of the following without future explicit approval:

- Video uploads.
- Background music/audio.
- Comments, likes, reactions, submissions, visitor forms, replies, or visitor-generated content.
- Visitor accounts, profiles, or login.
- Public registration or admin registration.
- Multiple admins, employee/staff accounts, or a role/permission matrix.
- Social share buttons or explicit image-download controls.
- Analytics/tracking, including Google Analytics, advertising trackers, visitor profiling, analytics cookies, visit counters, and device analytics dashboards.
- Visitor passcode gates, scheduled birthday unlocks, or countdown access gates.
- Free-form page building or unrestricted drag-and-drop section composition.
- Arbitrary fonts, colors/palettes, font sizes, spacing, layouts, animation settings, per-section themes, or custom CSS through the admin.
- Arbitrary HTML/CSS or unrestricted rich-text layout control.
- Autosave while typing, a separate Publish action, or a draft publishing workflow.
- A full multilingual/i18n system or language switcher.
- A mobile application.
- AI-generated personal messages/content.
- Enterprise backup infrastructure, scheduled cloud backups, or complex retention management.

Automated forgot-password email is not required for V1; manual recovery is acceptable.

## 26. Non-Goals

Lavender Heart must not become a general-purpose CMS/page-builder product, social network/platform, commercial SaaS or multi-user platform, e-commerce application, wedding website/platform, public portfolio or portfolio builder, generic Valentine's website, generic template marketplace, or content-generation AI product.

The scope serves one owner and a personal gift that remains usable over time.

## 27. Source-of-Truth Rules and Phase Boundary

`PROJECT_CONTEXT.md` is the source of truth for project identity, product scope, users, functional behavior, editing/publishing model, the high-level content model, architecture, approved stack, and V1 boundaries.

It is not the primary source for precise colors, typography, spacing, animations, or visual compositions. Those belong in a future approved `DESIGN.md`. Future implementation/agent rules may belong in `AGENTS.md`; neither file is created in this phase.

Some details are intentionally deferred: exact reference URL, detailed visual treatment, eligibility of other non-essential section toggles, revision retention, image size/derivative parameters, backup format, and production hosting. No choice is invented here. They do not block documenting the approved product context.

When implementation differs from approved requirements, report the mismatch and request approval before changing the foundation or expanding scope. Do not silently reinterpret optional guidance as a hard rule or add unapproved features.

**Phase 1 ends after creating and reviewing this document.** No product/application code, packages, database migrations, authentication flow, uploads, editor, animations, or 3D scenes are changed. Do not create `DESIGN.md`, `AGENTS.md`, another specification, or an implementation plan. Stop for user review and explicit approval before Phase 2.
