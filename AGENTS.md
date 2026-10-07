# Lavender Heart — Agent Operating Rules

**Status:** Phase 3 documentation, awaiting review and explicit approval. `PROJECT_CONTEXT.md` and `DESIGN.md` are approved. These rules do not authorize product implementation or Phase 4.

## 1. Purpose

This file governs how Codex and other coding agents plan, implement, test, debug, review, verify, and report work in this project. It operationalizes the approved product and design specifications without redefining users, scope, chapters, visual identity, themes, or content features.

Read relevant authoritative documents and inspect the actual implementation before acting. Preserve the separate React SPA and Laravel REST API established in Phase 0. `README.md` explains local setup; `docs/phase-0-report.md` records historical checks and limitations, not proof that later changes pass.

## 2. Source of Truth

Resolve conflicting project instructions in this strict order:

1. Latest explicit user approval.
2. `PROJECT_CONTEXT.md`.
3. `DESIGN.md`.
4. `AGENTS.md`.
5. Approved implementation plan.
6. Existing code.
7. Generic skill/tool recommendations.

Existing code is not automatically correct. Skills supply expertise, not product authority. Earlier phase-end instructions describe those phases; the user's explicit approval to enter the next phase controls current authorized work.

If authoritative requirements conflict and the resolution is unclear, **stop and ask**. Do not silently reinterpret them or edit documents merely to justify existing code. Report implementation mismatches before changing the foundation or expanding scope.

## 3. Approval Gate

For substantial features, refactors, architecture changes, animation systems, admin workflows, media systems, authentication work, and backend features:

1. Read relevant project documents and inspect relevant code.
2. Use the available Superpowers brainstorming/planning workflow.
3. Produce a clear implementation plan with affected files, tests, verification, and risks.
4. **Stop and wait for explicit approval of the plan before implementation.**

Approval must be an explicit instruction equivalent to “Proceed,” “Approved,” “Go ahead,” or “Execute the plan.” Silence is not approval. Approval of product context or visual design alone is not approval of an implementation plan. Honor approval already given for the concrete work; do not repeatedly ask for the same authorization.

## 4. Scope Discipline

Implement only approved work. Do not silently add public chapters, admin features, presets, roles, visitor functionality, extra animations, page-builder freedom, analytics, audio/video, AI generation, deployment architecture, or unrelated conveniences. Propose useful additions and wait for approval.

Preserve the context's single-owner model, fixed chapter order, structured editor, and **Edit → Explicit Save → Live** workflow. No autosave, separate Publish action, or draft workflow. Reordering applies only to approved entries, not major chapters. Recommended content counts are soft guidance, not hard limits. Optional capabilities remain optional.

Do not modify unrelated files for cleanup or remove existing functionality unless the approved requirement replaces it.

## 5. Superpowers Workflow

Use obra/superpowers as the primary development methodology when available. Route work through relevant skills rather than invoking every skill blindly:

| Stage | Relevant skill |
| --- | --- |
| Understand and settle requirements | `brainstorming` |
| Isolate approved implementation when Git exists | `using-git-worktrees` |
| Define executable tasks | `writing-plans` |
| Execute an explicitly approved plan | `subagent-driven-development` |
| Implement functional behavior | `test-driven-development` |
| Review meaningful tasks | `requesting-code-review` |
| Diagnose failures | `systematic-debugging` |
| Confirm completion with evidence | `verification-before-completion` |
| Finish verified branch work | `finishing-a-development-branch` |

The normal methodology is brainstorming → worktree preparation → planning → approved subagent execution → TDD → review → verification → branch completion. Apply it within the current authorization: never create a branch/worktree during a documentation-only phase; if isolation is not yet authorized or Git is unavailable, record the prerequisite in the plan and perform it during approved implementation setup. No skill bypasses Section 3.

## 6. Planning and Execution

Later implementation plans must be executable by another competent developer: include task order, exact affected files where known, dependencies, tests, migration/data concerns, responsive behavior, visual QA, security, performance, rollback, and risk notes. Keep tasks small and reviewable. Do not create an implementation plan in Phase 3.

After explicit plan approval, **default to subagent-driven development**. Give agents focused tasks and fresh context where appropriate, including authoritative constraints and concrete acceptance criteria. Avoid overlapping edits and coordinate shared contracts. If the required agent capability is unavailable, report that limitation rather than pretending delegation occurred.

For each meaningful task: implement using TDD where applicable, run relevant tests, obtain spec-compliance review, obtain code-quality review, fix findings, rerun affected verification, then commit logical verified work when Git exists. Continue only when the task is clean. Critical review findings block progression.

## 7. TDD

Functional behavior follows **RED → GREEN → REFACTOR**:

1. Write a meaningful failing test for the approved behavior.
2. Run it and confirm failure for the expected behavioral reason.
3. Implement the minimum required behavior.
4. Run the test and confirm it passes.
5. Refactor while keeping relevant tests green.

Do not write large amounts of production code first and append superficial tests. Use judgment for visual-only CSS where a unit test adds no meaningful protection; actual rendered visual QA still applies. Tests should exercise observable behavior, not simply mirror implementation.

## 8. Review Process

Every meaningful implementation task receives two distinct review passes, in this order:

| Pass | Required checks |
| --- | --- |
| Spec compliance | Matches context, design, approved plan, and expected workflows; nothing omitted or added without approval |
| Code quality | Correctness, maintainability, architecture, tests, security, performance, readability, duplication, complexity, resource cleanup, regression risk |

Fix critical findings before continuing; rerun relevant checks and have fixes reviewed. Use focused reviewers with enough context to assess the task. Do not treat a passing test suite as either review pass or dismiss technically valid feedback without evidence.

## 9. Git and Worktrees

**At Phase 3 creation, this workspace is not a Git repository and has no configured remote.** Worktrees, branches, and commits are unavailable. Report this limitation during later planning; do not claim Git verification or fabricate commit hashes. Do not initialize Git solely for a documentation phase. Propose initialization as a prerequisite when implementation setup is later approved.

Once Git is initialized and implementation begins, use feature branches and worktrees for substantial work, following `using-git-worktrees`. Keep main clean; large implementation directly on main requires explicit approval. Give major phases or isolated features suitable branches/worktrees and make a clean checkpoint before risky changes. Inspect existing changes and preserve the user's work.

## 10. Commit Discipline

Prefer one meaningful task/fix per logical commit where practical. Run relevant tests and required quality checks before committing. Use clear messages and keep history useful for review, rollback, and debugging.

Avoid giant catch-all commits, generated junk, temporary files, and secrets. Verify staged changes; never sweep unrelated user edits into a commit. Checkpoint before risky refactors. Branch completion follows verified work and the user's integration authorization; it does not imply permission to force-push or deploy.

## 11. Documentation Synchronization

For approved changes to behavior, scope, architecture, design direction, or major agent workflow, use **docs first**: update the relevant source-of-truth document, summarize the change, obtain meaningful approval where not already granted, then update implementation.

Keep docs and code synchronized. Do not weaken requirements to excuse a defect. Technical implementation details belong in the approved plan or appropriate technical documentation; product and visual requirements remain in their respective sources.

Use clear names and focused functions. Comments explain non-obvious reasons: tricky ScrollTrigger lifecycle/choreography, 3D performance decisions, media derivative cleanup, or unusual transaction/recovery behavior. Avoid comments repeating code, giant essays, stale notes, and dead commented-out code.

## 12. Frontend Architecture

Preserve the Phase 0 **MVC-inspired / layered React architecture**, without forcing traditional server-side MVC into React:

| Responsibility | Existing location / rule |
| --- | --- |
| Composition, routing, providers | `frontend/src/app/` |
| Domain types, interfaces, Zod schemas | `src/models/types/`, `src/models/schemas/` |
| Pages, layouts, presentational components | `src/views/` |
| Hooks/modules coordinating interactions, API, and state | `src/controllers/` |
| HTTP/API and application services | `src/services/` |
| Server state | TanStack Query |
| Truly shared client state | Zustand in `src/stores/`, only when needed |
| Feature/domain organization | `src/features/` as approved features grow |
| WebGL modules | `src/three/` |
| Animation modules/hooks | `src/animations/` |

Keep components small and focused. Avoid giant components, unrelated concerns, large GSAP timelines buried in presentation, scattered direct API calls, unnecessary global state/effects, and avoidable prop drilling where a clearer approved architecture exists. Use orchestration hooks, centralized services, and query state appropriately. The frontend never accesses the database directly.

Features should own related UI, appropriate types, orchestration, and tests while preserving layer responsibilities. Do not grow enormous catch-all `components/`, `hooks/`, or `utils/` folders. Shared modules contain real reusable concerns; no speculative abstractions or scaffolding for hypothetical needs. Preserve strict TypeScript and the `@/*` alias.

## 13. Backend Architecture

Preserve Laravel conventions in `backend/`:

| Layer | Responsibility |
| --- | --- |
| Thin controllers | Receive requests, delegate validation, call application logic, return responses/resources |
| Form Requests | Authoritative request validation |
| Models | Data, relationships, domain state |
| Services / Actions | Application and business logic |
| Policies / Middleware | Authorization and access control |
| API Resources | Stable representations |

Avoid god controllers, unnecessarily fat models, duplicated rules, and large procedural route closures. Small existing technical health routes are not grounds for an unrelated refactor. Use the framework and existing patterns before introducing custom infrastructure.

## 14. API Contracts

Before implementing a meaningful endpoint, define its request/response shapes, validation, and error behavior in the approved work. Frontend TypeScript types must match backend contracts; React must not rely on undocumented response fields.

Use Zod for critical runtime payload validation where it adds meaningful safety. Centralize HTTP through the environment-configured Axios client. Breaking contracts require documentation synchronization, plan review, and coordinated frontend/backend changes.

## 15. Validation

Validate admin inputs on both frontend and backend; **backend validation is authoritative**. Share the intended rules without redundant divergent implementations. Provide clear field-level errors and predictable API error shapes. Never silently fail or report a failed Save as successful.

Validate uploads using appropriate MIME, extension, size, and dimension checks as defined in the approved media plan. Do not trust client-provided filenames or client-only validation. Enforce the approved limited rich-text format and sanitize rendered content; no arbitrary HTML/CSS, fonts, colors, or layout control.

## 16. Authentication and Security

Use **Laravel Sanctum SPA/session authentication** for the single owner, with email/password, HTTP-only session cookies, CSRF protection, and backend authorization. No JWT without explicit approval; no authentication bearer tokens in `localStorage`. No visitor authentication or registration. Installed Sanctum middleware is preparation, not an implemented login flow.

- Authorize every owner-only endpoint; hiding UI controls is insufficient.
- Expose only public data required by the public experience through public APIs.
- Keep `.env` private/local and `.env.example` safe; never commit secrets or embed backend secrets in frontend `VITE_*` variables.
- Validate/sanitize at trust boundaries, generate safe media filenames, and rate-limit login reasonably.
- Use secure production cookie/session configuration and safe error responses without sensitive stack traces.
- Resolve known critical dependency vulnerabilities before declaring applicable work complete.
- Verify unauthorized, invalid-credential, validation, CSRF, and other relevant failure cases.

Private-link access and `noindex` are distribution/discovery choices, not visitor authorization or cryptographic privacy. Do not silently add a gate to compensate.

## 17. Database Safety

Use non-destructive migration discipline. Do not casually drop tables/columns, reset real databases, or reseed over genuine content. Destructive schema/data changes require explicit approval. Preserve existing data, use reversible migrations where practical, and recommend/export an appropriate backup before risky operations within authorized access.

Seeders must not overwrite genuine owner content unless explicitly intended. Keep test databases isolated from real data. MySQL/MariaDB remains the application target; PHPUnit's SQLite memory configuration is test isolation, not a production architecture change.

## 18. Media Safety

Use **Laravel Storage**, avoiding scattered physical paths or vendor-specific assumptions. Follow the later approved upload/derivative design: preserve originals and their metadata/derivative relationships, use responsive optimized derivatives, and store references rather than image binaries in ordinary database fields.

Respect **Delete → Trash → Restore or Permanent Delete**. Do not permanently remove physical media before the approved lifecycle permits it. Preserve files required for restoration and avoid orphaned records, originals, and derivatives. Use transactions for database consistency and defensive file cleanup/recovery where practical; a database rollback alone does not undo filesystem changes.

Backups must include the media/files needed to restore the site, not just paths. Keep backup/import-export within the approved simple recovery scope.

## 19. Environment Configuration

Use frontend environment variables for public frontend configuration and Laravel `.env` for backend configuration. Never hardcode local/production URLs, credentials, ports, or machine paths into application behavior. Development examples and isolated test/tooling configuration may specify local endpoints as documented in the foundation.

Keep local, test, and production environments separate. Production must not depend on XAMPP paths. Preserve configurable API origins, credentialed CORS, Sanctum stateful domains, and portable storage. Root Apache denial is a local private-file safeguard, not a selected production hosting architecture.

Follow `README.md` for setup. Do not overwrite an existing private `.env`, assume the application database is configured, or run migrations merely to make a documentation check pass.

## 20. Dependencies

Use the approved stack and minimum dependencies. Before adding a package, check existing code, standard/native facilities, and installed libraries; identify a real unmet need, verify maintenance, and justify why a simple existing solution is insufficient. Do not add packages for trivial effects or premature abstractions.

Another animation engine, smooth-scroll engine, UI framework, or state manager requires explicit approval. Avoid overlapping libraries and experimental/unmaintained packages unless approved.

Respect `frontend/package-lock.json` and `backend/composer.lock`; resolved versions come from lockfiles, not assumptions about manifest ranges. No casual major upgrades. Changes must address security, compatibility, or approved functionality. After dependency changes, verify clean installation and applicable tests, typecheck, lint/format checks, build, and backend platform compatibility. Do not install arbitrary skills because a skills inventory is missing.

## 21. Animation Ownership

| System | Exclusive responsibility |
| --- | --- |
| GSAP + ScrollTrigger | Scroll choreography, horizontal story, pinning, parallax, major chapter transitions and major text/image reveals |
| Three.js / React Three Fiber | Heart, camera, WebGL lights, materials, scene behavior |
| Motion | Menu, lightbox, modals, small React state transitions |
| CSS | Simple hover, focus, color, very small transitions |
| Lenis | Smooth scroll interpolation |

Never let two systems control the same property simultaneously without an explicitly approved technical reason. Coordinate systems through clear ownership; do not duplicate scrolling engines, frame loops, or transition logic. Preserve the shared reveal language and restrained motion character in `DESIGN.md`.

## 22. Three.js / GSAP Lifecycle

Initialize GSAP in React-safe lifecycle hooks/contexts. Clean up timelines, owned ScrollTriggers, listeners, observers, and subscriptions on unmount or configuration change. Avoid duplicate initialization under React lifecycle behavior. Reconfigure responsive/reduced-motion scenes safely, refresh measurements when relevant content changes, and remove pin spacers when stages leave the flow.

Respect R3F renderer/resource ownership. Dispose manually owned textures, geometries, materials, and other resources when appropriate; do not dispose shared or framework-managed resources still in use. Clean up custom listeners/frame work and avoid duplicate render loops.

Control DPR, resize handling, lighting/material cost, and device capability adaptation. Reduce unnecessary offscreen rendering. Test navigation/remounts and responsive changes for leaks or stale scenes. Hero and finale must remain readable and navigable through a lightweight heart fallback when WebGL is unavailable or fails.

## 23. Performance

Performance is a mandatory acceptance criterion, especially for image-heavy, animation-heavy, and WebGL work. Check unnecessary React renders, expensive frame loops, image payloads, offscreen effects, excessive blur/backdrop-filter, large DOM structures, layout thrashing, and mobile cost.

Use responsive optimized images, reserve image space, lazy-load non-critical media, and adapt rendering/effect complexity. Do not preload the whole photo collection to prolong the introduction. Obvious scroll/animation jank blocks completion; investigate and verify the fix rather than assuming a desktop build proves smoothness.

When decoration conflicts with performance, reduce decoration first. Protect, in order for this tradeoff: content, readability, interaction, accessibility, photography, essential heart identity, then decorative effects. Never lose content to preserve particles, blur, refraction, or elaborate transitions. This operational tradeoff does not replace the context's overall product priorities. Do not invent numeric performance budgets without approved planning.

## 24. Visual QA

For UI work, inspect the **actual rendered result** at desktop, intermediate/tablet, and mobile widths, including unusually narrow widths and relevant orientation/text-zoom states. Compare with `DESIGN.md` and the approved task; screenshots alone do not verify interactive choreography.

Check applicable spacing, typography, wrapping/long names, long saved copy, image crops/focal points, natural colors, overflow, horizontal story progression, pinned-stage fit, navigation, drawer/lightbox, Day → Night transitions, restrained motion, reduced motion, hidden sections, WebGL fallback, admin forms, and preview accuracy. Exercise keyboard/focus and touch behavior.

Visual defects block completion even when tests pass. Recompose mobile scenes rather than scaling desktop down. If a stage cannot fit its content, use readable natural flow. Preserve content order and pacing without introducing hard limits or truncation.

## 25. Accessibility

Verify semantic headings, keyboard access, visible focus, sufficient contrast, useful alt text, readable sizing, text reflow, touch targets, labeled controls, and menu/modal/lightbox focus management. Escape dismisses applicable overlays and focus returns to the initiating control. Navigation must not hide a focused control.

Follow the design's contrast targets: at least 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries/focus indicators. Validate photo overlays and transitions, not only flat palettes. Body text starts at 1rem; aim for 44 × 44 CSS px hit areas with separation.

Respect `prefers-reduced-motion`: simplify smooth interpolation, parallax, pinning, heart motion, pointer depth, and camera travel. Use static layouts, brief simple fades, and vertical flow as appropriate. Preserve all content, reading order, navigation, gallery access, timeline, letter, and final message. Content must not depend on hover, animation completion, WebGL, or pointer precision. Accessibility takes priority over cinematic effects.

## 26. Testing Strategy

Use the existing layered test tools:

| Layer | Tools / coverage |
| --- | --- |
| Frontend unit/integration | Vitest + React Testing Library: components, hooks, utilities, rendering states, admin and interaction behavior |
| Backend | Existing PHPUnit: APIs, validation, authentication, authorization, revisions, Trash/restore, media, backup/import-export |
| End-to-end | Playwright: critical workflows such as owner login → edit → Save → verify public result, and major public interactions |

The foundation uses PHPUnit; do not install Pest merely because a generic recommendation mentions it. Test observable results, failures, and access boundaries rather than animation frames one by one. Visual QA supplies design-fidelity evidence.

Important bug fixes need practical regression tests that demonstrate the failure before the fix and protect against recurrence. Do not close a bug with only a manual patch when meaningful automated protection is available. Keep fixtures synthetic and test configuration isolated.

## 27. Debugging

Use `systematic-debugging` when available. Reproduce the problem, gather evidence, trace the real flow and root cause, form and verify a hypothesis, fix that cause, add/update tests, and verify again. Inspect affected callers and shared paths rather than patching only the reported symptom.

Do not guess-and-patch or repeatedly change unrelated code hoping a failure disappears. Distinguish application defects from environment/tool limitations and report the evidence for that distinction.

## 28. Logging

Remove temporary `console.log`, `dump()`, `dd()`, and debug-only UI from completed production work. The explicitly development-only Phase 0 smoke route is not an instruction to ship debug UI or delete it during unrelated work; verify its production exclusion when relevant.

Keep errors useful without exposing passwords, tokens, secrets, unnecessary private messages, or sensitive upload metadata. Use safe diagnostics and do not copy private payloads into logs or reports.

## 29. Quality Gates

Keep TypeScript strict; avoid unnecessary `any` and suppressions that conceal defects. Applicable frontend work must pass ESLint, Prettier, typecheck, relevant tests, and production build. Backend work must pass relevant tests and Laravel Pint without meaningful PHP errors.

Existing commands, run from the indicated app directory:

| Location | Verification commands |
| --- | --- |
| `frontend/` | `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd run test`, `npm.cmd run build`, `npm.cmd run e2e` |
| `backend/` | `composer test`, `composer lint`, `composer check-platform-reqs` |
| Dependency/manifest changes | Applicable clean install checks plus `composer validate --strict` for Composer changes |

Use equivalent `npm` commands outside restricted Windows PowerShell. Follow README's command-local PHP ZIP workaround when needed; do not change global configuration without authorization. Formatting commands that write files are different from verification checks: avoid formatting unrelated files.

No unresolved relevant console/runtime errors, dead commented-out code, temporary hacks, or silently ignored meaningful warnings. Phase 0 records upstream smoke-test warnings and deliberately forced fallback errors; identify expected diagnostics explicitly and investigate new/unexpected ones. Historical passing checks are not current verification.

## 30. Definition of Done

A task is done only when **all applicable** items are satisfied:

- Approved requirements are implemented and match the approved plan.
- Relevant tests/quality gates pass; practical regression protection exists.
- Spec-compliance and code-quality reviews pass; blocking findings are fixed.
- Actual rendered visual QA, responsive behavior, and accessibility are verified for UI work.
- Performance and adaptive/fallback behavior are checked for animation/3D work.
- Security requirements and relevant failure/authorization cases are verified.
- No unresolved relevant console/runtime errors or concealed meaningful warnings remain.
- Documents are synchronized when approved requirements changed.
- Verification evidence and any limitations are reported honestly.

“It works” is insufficient. An unperformed applicable check is a reported limitation, not a pass; do not declare complete work that still has a required unresolved gate.

## 31. Skills Routing

Use relevant installed skills; read their instructions and disclose their use. Check actual availability rather than assuming a named skill is installed. `SKILLS_INSTALL.md` is absent at Phase 3 creation and belongs to a dedicated later phase. Its absence authorizes neither creating it now nor arbitrary installation.

| Skill family, when installed | Appropriate use |
| --- | --- |
| Superpowers | Brainstorming, planning, worktrees, approved subagent execution, TDD, debugging, review, verification |
| UI/UX Pro Max | Layout, typography, responsive composition, UX and visual implementation guidance; `DESIGN.md` wins |
| Hallmark | Reference study and anti-AI-slop audits; never proprietary cloning |
| Official GSAP skills | ScrollTrigger, timelines, pinning, horizontal scrolling, React cleanup, performance |
| Three.js / R3F skills | Heart, materials, lights, camera, responsive rendering, performance, debugging |
| Vercel React Best Practices | React performance, render behavior, client architecture review |
| Vercel Web Design Guidelines | Accessibility, UI behavior, keyboard/focus, responsive review |
| Impeccable | Critique, polish, simplification, refinement, anti-slop review **after the feature works**; no silent redesign |
| DESIGN-MD-CHROME | Optional reference extraction only; generated output is reference material and must never overwrite `DESIGN.md` |

If skill advice changes approved behavior or design, propose the change first. Skills cannot override the project hierarchy.

When a `.codegraph/` directory exists at the repository root, use CodeGraph before grep/find or reading code to locate/understand symbols: prefer `codegraph_explore` when available, otherwise `codegraph explore`. Name a file/symbol for current source and trace relevant paths. If no index exists, skip CodeGraph entirely; indexing is the user's decision. Otherwise use `rg`/`rg --files` for targeted searches.

## 32. Destructive Action Safety

Explicit approval is required for destructive operations such as `git reset --hard`, force-push, mass deletion, dropping production-like tables, destructive database resets, original-media deletion, or replacing large working subsystems. Make a safe checkpoint before risky refactors and confirm targets/environment before acting.

Respect approval already granted for a specific operation; broad feature approval does not silently authorize unrelated destruction. Approved product Permanent Delete must still present the context's clear destructive confirmation. Do not casually run destructive commands against real data while testing.

## 33. Ambiguity Handling

If uncertainty affects scope, visible UX, visual identity, architecture, data, security, privacy, destructive behavior, or an API contract, **stop and ask before the dependent action**. Continue independent authorized work where possible. For minor technical choices with no visible/product impact, choose the simplest maintainable option and report meaningful assumptions.

Do not invent photographs, dates, messages, personal stories, or romantic copy on the owner's behalf. Deferred choices in the source documents must be resolved in relevant later planning, not silently filled in here: these include the exact Diamond URL, first/repeat-visit persistence/lifetime, section-toggle eligibility, revision retention, image/derivative parameters, backup format, scene/capability details, and production hosting. Their absence does not block this operating document.

## 34. Personal Content Safety

Treat personal photos and messages as private project content. Do not upload them unnecessarily to third-party services, expose them in logs, publish examples, copy them into external issues, or leak them through fixtures/snapshots. Use synthetic test fixtures unless actual-media testing is explicitly required. Keep sensitive examples and generated artifacts out of public reports/source control as appropriate.

V1 excludes AI-generated personal content. Do not manufacture production love letters, memories, Things I Love About You entries, dates, or stories. Actual content comes from the owner. Use clearly labeled placeholders only when technically necessary. A separate explicit request for writing assistance does not authorize adding an AI-generation product feature.

## 35. Design Fidelity

Follow `DESIGN.md`; do not improvise a replacement aesthetic. Preserve Lavender Day → Night, Lavender Mist default, exactly three global presets, Cormorant Garamond + Inter, generous editorial spacing, natural photography, and the translucent lavender crystal/glass heart. Use its reusable tokens rather than arbitrary scattered values.

Preserve the fixed nine-chapter order: Hero/heart, Intro, Horizontal Story, Full-Width Memory, Gallery, Things I Love About You, Timeline, Birthday Letter, Final Heart/Closing. Capable desktop memories use horizontal storytelling; mobile uses vertical editorial flow. Statements use one-at-a-time desktop staging and vertical mobile flow, never a second horizontal story. Retain selected restrained parallax, masonry gallery/minimal lightbox, vertical timeline, calm neutral reading letter, and dark heart finale.

The full heart anchors hero and finale, disappears between them, and appears only as restrained fragments in selected transitions. Adaptive 3D/fallback preserves identity. Keep the opening brief with genuine progress; do not invent fake loading or access gates. Recompose for content and capability, including long names/copy, rather than shrinking or clipping desktop stages.

Hero and Final Closing remain required. Hide only eligible non-essential sections: remove their content, invalid anchors, and empty spacing; recalculate scroll staging and bridge remaining chapters coherently. Do not assume all nine chapters are visible or describe all nine as optional.

Public design is cinematic, editorial, and expressive. Admin design is light, practical, restrained, and minimally animated, with a preview of the selected public preset. No public spectacle in admin or dashboard-style card grids on the public page.

Enforce the design's anti-AI-slop rules: no repetitive feature cards/templates, random blobs/animations, gradient text/pill headings, glass everywhere, giant generic CTAs, fake testimonials/statistics/marketing copy, decorative icon/heart fields, typing overload, unnecessary marquees, arbitrary 3D, or excessive glow. Keep the normal cursor.

The Diamond is inspiration only. Study hierarchy, spacing, pacing, image/text relationships, depth, and scroll concepts. Never copy exact HTML/CSS, assets, animation values/components, compositions, proprietary imagery/fonts, or wedding content. Create an original Lavender Heart experience; reference extraction is not permission to clone.

## 36. Reporting

After each approved implementation task, report concisely: what changed, files changed, tests run, verification performed, applicable visual QA and performance/accessibility checks, review findings, remaining issues, and commit/hash when Git is available.

Distinguish observed results from assumptions and unperformed checks. Identify blockers and limitations directly. Never claim a pass, rendered inspection, delegated review, commit, or completion without evidence.

## 37. Verification

Use `verification-before-completion` when available. Before claiming success or committing, run the relevant tests, lint, formatting checks, typecheck, build, backend checks, and browser verification, and inspect their output. Scale verification to the actual change; documentation-only work requires document/scope review, not an unrelated application test run.

For UI, inspect the actual rendered experience. For 3D, exercise adaptive and forced-failure fallback behavior. For auth/security, verify authorization and failure cases. Rerun affected checks after fixes. Confirm only intended files changed and no secrets/generated junk entered the deliverable. If a required check cannot run, report the exact limitation rather than substituting an unsupported success claim.

## 38. Phase Boundary

**Phase 3 creates `AGENTS.md` only.** `PROJECT_CONTEXT.md` and `DESIGN.md` are approved; this new document awaits review. Existing application files, configurations, dependencies, assets, migrations, and earlier documents remain unchanged.

No implementation, components, final heart/fallback assets, animations, auth/media/admin features, implementation plan, branch/worktree, Git initialization, or `SKILLS_INSTALL.md` is created in this phase. Skills installation belongs to a dedicated later phase.

**Stop after creating and reviewing this document. Wait for explicit approval before Phase 4.**
