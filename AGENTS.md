# Lavender Heart - Agent Operating Rules

**Status:** Current frontend-only website, synchronized 2026-10-12 with the owner-approved cleanup. Earlier phase reports are historical records.

## 1. Purpose

These rules govern planning, implementation, debugging, review, and verification of the personal birthday website. Read `PROJECT_CONTEXT.md`, `DESIGN.md`, and relevant code before acting. Preserve the React/TypeScript/Vite SPA and its validated local JSON content. There is no backend, database, owner login, admin editor, or API configuration. `README.md` describes current setup; phase reports do not prove current checks pass.

## 2. Source of Truth

Resolve conflicting project instructions in this strict order:

1. Latest explicit user approval.
2. `PROJECT_CONTEXT.md`.
3. `DESIGN.md`.
4. `AGENTS.md`.
5. Approved implementation plan.
6. Existing code.
7. Generic skill/tool recommendations.

Existing code is not automatically correct. Skills supply expertise, not product authority. Historical phase boundaries do not cancel later explicit authorization.

If authoritative requirements conflict and the resolution is unclear, **stop and ask**. Do not silently reinterpret them or edit documents merely to justify existing code. Report implementation mismatches before changing the foundation or expanding scope.

## 3. Approval Gate

For substantial features, refactors, architecture changes, animation systems, admin workflows, media systems, authentication work, and backend features:

1. Read relevant project documents and inspect relevant code.
2. Use the available Superpowers brainstorming/planning workflow.
3. Produce a clear implementation plan with affected files, tests, verification, and risks.
4. **Stop and wait for explicit approval of the plan before implementation.**

Approval must be an explicit instruction equivalent to “Proceed,” “Approved,” “Go ahead,” or “Execute the plan.” Silence is not approval. Approval of product context or visual design alone is not approval of an implementation plan. Honor approval already given for the concrete work; do not repeatedly ask for the same authorization.

## 4. Scope Discipline

Implement only authorized work. Preserve the fixed chapter order, personal content, file-based editing, and explicit save/reload/rebuild workflow. Entry ordering follows saved content; do not reorder major chapters. Optional chapters must disappear from layout and navigation together; Hero and Final Closing remain required.

Do not add a CMS, backend, authentication, visitor features, analytics, audio/video, AI generation, new presets, or unrelated effects without an explicit request. Do not remove working animation, accessibility, media tools, tests, or personal assets as incidental cleanup.

## 5. Superpowers Workflow

Use obra/superpowers as the primary development methodology when available. Route work through relevant skills rather than invoking every skill blindly:

| Stage                                           | Relevant skill                   |
| ----------------------------------------------- | -------------------------------- |
| Understand and settle requirements              | `brainstorming`                  |
| Isolate approved implementation when Git exists | `using-git-worktrees`            |
| Define executable tasks                         | `writing-plans`                  |
| Execute an explicitly approved plan             | `subagent-driven-development`    |
| Implement functional behavior                   | `test-driven-development`        |
| Review meaningful tasks                         | `requesting-code-review`         |
| Diagnose failures                               | `systematic-debugging`           |
| Confirm completion with evidence                | `verification-before-completion` |
| Finish verified branch work                     | `finishing-a-development-branch` |

The normal methodology is brainstorming → worktree preparation → planning → approved subagent execution → TDD → review → verification → branch completion. Apply it within the current authorization: avoid unnecessary isolation for documentation-only edits; if isolation is not yet authorized or Git is unavailable, record the prerequisite in the plan and perform it during approved implementation setup. No skill bypasses Section 3.

## 6. Planning and Execution

Later implementation plans must be executable by another competent developer: include task order, exact affected files where known, dependencies, tests, migration/data concerns, responsive behavior, visual QA, security, performance, rollback, and risk notes. Keep tasks small and reviewable. Scale the plan to the authorized work.

After explicit plan approval, use subagent-driven development when delegation is authorized and useful. Give agents focused tasks and fresh context where appropriate, including authoritative constraints and concrete acceptance criteria. Avoid overlapping edits and coordinate shared contracts. If the required agent capability is unavailable, report that limitation rather than pretending delegation occurred.

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

| Pass            | Required checks                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spec compliance | Matches context, design, approved plan, and expected workflows; nothing omitted or added without approval                                         |
| Code quality    | Correctness, maintainability, architecture, tests, security, performance, readability, duplication, complexity, resource cleanup, regression risk |

Fix critical findings before continuing; rerun relevant checks and have fixes reviewed. Use focused reviewers with enough context to assess the task. Do not treat a passing test suite as either review pass or dismiss technically valid feedback without evidence.

## 9. Git and Worktrees

The project is a Git repository with a private remote at `wtfmigo/lavender-heart`. Inspect existing changes and preserve the owner's work. Use feature branches/worktrees when substantial implementation needs isolation, following the applicable skill. Do not recreate an existing suitable worktree. Keep main clean and checkpoint before risky refactors; never fabricate commit hashes or claim unperformed Git checks.

## 10. Commit Discipline

Prefer one meaningful task/fix per logical commit where practical. Run relevant tests and required quality checks before committing. Use clear messages and keep history useful for review, rollback, and debugging.

Avoid giant catch-all commits, generated junk, temporary files, and secrets. Verify staged changes; never sweep unrelated user edits into a commit. Checkpoint before risky refactors. Branch completion follows verified work and the user's integration authorization; it does not imply permission to force-push or deploy.

## 11. Documentation Synchronization

For approved changes to behavior, scope, architecture, design direction, or major agent workflow, use **docs first**: update the relevant source-of-truth document, summarize the change, obtain meaningful approval where not already granted, then update implementation.

Keep docs and code synchronized. Do not weaken requirements to excuse a defect. Technical implementation details belong in the approved plan or appropriate technical documentation; product and visual requirements remain in their respective sources.

Use clear names and focused functions. Comments explain non-obvious reasons: tricky ScrollTrigger lifecycle/choreography, 3D performance decisions, media derivative cleanup, or unusual transaction/recovery behavior. Avoid comments repeating code, giant essays, stale notes, and dead commented-out code.

## 12. Frontend Architecture

Preserve the existing layered React organization and strict TypeScript with the `@/*` alias:

| Responsibility                            | Location                        |
| ----------------------------------------- | ------------------------------- |
| Composition and routing                   | `frontend/src/app/`             |
| Public contracts, route, and Gallery copy | `frontend/src/features/public/` |
| Domain types and Zod schemas              | `frontend/src/models/`          |
| Pages and presentational components       | `frontend/src/views/`           |
| Interaction/reading-position hooks        | `frontend/src/controllers/`     |
| Validated local-content loading           | `frontend/src/services/`        |
| WebGL heart and fallback                  | `frontend/src/three/`           |
| Scroll choreography                       | `frontend/src/animations/`      |
| Tokens and responsive styles              | `frontend/src/styles/`          |

Reuse active modules and platform facilities. Avoid speculative global state, wrappers, catch-all folders, API scaffolding, and dependencies. Keep ownership clear and GSAP choreography outside giant presentation components.

## 15. Validation and Content

Load `/content/experience.json` from the static host and validate it with Zod before rendering. Preserve recoverable errors, retry, and cancellation. There is no API fallback. Keep compatibility fields synchronized with section content; dates use `YYYY-MM-DD` or `null`.

Support only the approved structured rich text and marks, never arbitrary HTML/CSS. Preserve alt text, image dimensions, focal coordinates, responsive descriptors, and unique IDs. Gallery introduction/closing copy lives in `frontend/src/features/public/collectionContent.ts`; editing guidance lives in `docs/birthday-content-editing.md`.

## 16. Privacy and Security

Anyone with the deployed URL can read the site. Private links and `noindex` affect discovery, not authorization. Do not silently add a visitor gate. Never commit secrets or expose private content in logs, reports, fixtures, or third-party services. Frontend configuration and static assets are public.

Maintain validation at content boundaries, safe rendering, and recoverable errors. Resolve relevant critical dependency vulnerabilities before claiming applicable work complete. A future backend or CMS requires a new explicit request and architecture plan.

## 18. Media Safety

Preserve personal photographs, originals, metadata, and working derivatives during cleanup. `frontend/public/photos/personal/` is ignored by Git and must be restored separately after cloning. Backups must contain actual media, not just paths. Build output is replaceable; source content and personal media are not.

Use optimized responsive image derivatives and accurate dimensions. Files served from `frontend/public/` are accessible to visitors; only include images intended for the gift. Do not delete originals or publish personal media without authorization.

## 19. Environment and Delivery

Node.js and npm are the only development prerequisites. Run Vite from `frontend/`; no PHP, Composer, MySQL, `.env`, or second server is required. Follow `README.md`. Production output is `frontend/dist/`, served with the JSON/media and SPA fallback. Do not hardcode machine paths into application behavior or change global configuration for a local check.

## 20. Dependencies

Use the approved stack and minimum dependencies. Before adding a package, check existing code, standard/native facilities, and installed libraries; identify a real unmet need, verify maintenance, and justify why a simple existing solution is insufficient. Do not add packages for trivial effects or premature abstractions.

Another animation engine, smooth-scroll engine, UI framework, or state manager requires explicit approval. Avoid overlapping libraries and experimental/unmaintained packages unless approved.

Respect `frontend/package-lock.json`; resolved versions come from lockfiles, not assumptions about manifest ranges. No casual major upgrades. Changes must address security, compatibility, or approved functionality. After dependency changes, verify clean installation and applicable tests, typecheck, lint/format checks, build. Do not install arbitrary skills because a skills inventory is missing.

## 21. Animation Ownership

| System                                    | Responsibility                                                                     |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| Native browser scrolling                  | Wheel, touch, and keyboard scrolling                                               |
| Native sticky stages/CSS scroll timelines | Horizontal Story and staged Love progression, passive fallback where needed        |
| GSAP + ScrollTrigger                      | Opening, clouds, masks, photo curtains/parallax, chapter transitions, heart travel |
| Three.js / React Three Fiber              | Crystal heart geometry, camera, lights, materials, rendering                       |
| Motion                                    | Small UI state transitions and lightbox                                            |
| CSS/projected transforms                  | Hover/focus and interactive photo sphere                                           |

Do not restore Lenis interception or GSAP pinning for Story/Love. Never let systems compete over the same property. Preserve animation choreography at every viewport while optimizing lifecycle and rendering.

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

Check applicable spacing, typography, wrapping/long names, long saved copy, image crops/focal points, natural colors, overflow, horizontal story progression, sticky-stage fit, navigation, drawer/lightbox, Day → Night transitions, restrained motion, reduced motion, hidden sections, WebGL fallback. Exercise keyboard/focus and touch behavior.

Visual defects block completion even when tests pass. Preserve desktop composition and choreography on phones and tablets in both orientations, adapting dimensions to fit. Genuinely oversized content retains readable natural flow. Preserve content order and pacing without introducing hard limits or truncation.

## 25. Accessibility

Verify semantic headings, keyboard access, visible focus, sufficient contrast, useful alt text, readable sizing, text reflow, touch targets, labeled controls, and menu/modal/lightbox focus management. Escape dismisses applicable overlays and focus returns to the initiating control. Navigation must not hide a focused control.

Follow the design's contrast targets: at least 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries/focus indicators. Validate photo overlays and transitions, not only flat palettes. Body text starts at 1rem; aim for 44 × 44 CSS px hit areas with separation.

Respect `prefers-reduced-motion`: simplify smooth interpolation, parallax, pinning, heart motion, pointer depth, and camera travel. Use static layouts, brief simple fades, and vertical flow as appropriate. Preserve all content, reading order, navigation, gallery access, timeline, letter, and final message. Content must not depend on hover, animation completion, WebGL, or pointer precision. Accessibility takes priority over cinematic effects.

## 26. Testing

Use Vitest/React Testing Library for content loading, validation, hooks, and observable component behavior. Use Playwright for public reading, navigation, lightbox/sphere interactions, responsive stages, reduced motion, and fallback regressions. Keep fixtures synthetic and configuration isolated.

Important bug fixes need practical regression protection. Tests should show the failure before the fix rather than mirror implementation or assert every animation frame. Visual QA supplies design-fidelity evidence.

## 27. Debugging

Use `systematic-debugging` when available. Reproduce the problem, gather evidence, trace the real flow and root cause, form and verify a hypothesis, fix that cause, add/update tests, and verify again. Inspect affected callers and shared paths rather than patching only the reported symptom.

Do not guess-and-patch or repeatedly change unrelated code hoping a failure disappears. Distinguish application defects from environment/tool limitations and report the evidence for that distinction.

## 28. Logging

Remove temporary logging and debug-only UI from completed production work.

Keep errors useful without exposing passwords, tokens, secrets, unnecessary private messages, or sensitive upload metadata. Use safe diagnostics and do not copy private payloads into logs or reports.

## 29. Quality Gates

Keep TypeScript strict; avoid unnecessary `any` and suppressions that conceal defects. Applicable frontend work must pass ESLint, Prettier, typecheck, relevant tests, and production build.

Existing commands, run from the indicated app directory:

| Location                    | Verification commands                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/`                 | `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd run test`, `npm.cmd run build`, `npm.cmd run e2e` |
| Dependency/manifest changes | Clean installation and applicable frontend checks                                                                                   |

Use equivalent `npm` commands outside restricted Windows PowerShell. Formatting commands that write files are different from verification checks: avoid formatting unrelated files.

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

Use relevant installed skills; read their instructions and disclose their use. Check actual availability rather than assuming a named skill is installed. Do not install arbitrary skills or create an inventory without a need in the authorized work.

| Skill family, when installed | Appropriate use                                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Superpowers                  | Brainstorming, planning, worktrees, approved subagent execution, TDD, debugging, review, verification           |
| UI/UX Pro Max                | Layout, typography, responsive composition, UX and visual implementation guidance; `DESIGN.md` wins             |
| Hallmark                     | Reference study and anti-AI-slop audits; never proprietary cloning                                              |
| Official GSAP skills         | ScrollTrigger, timelines, pinning, horizontal scrolling, React cleanup, performance                             |
| Three.js / R3F skills        | Heart, materials, lights, camera, responsive rendering, performance, debugging                                  |
| Vercel React Best Practices  | React performance, render behavior, client architecture review                                                  |
| Vercel Web Design Guidelines | Accessibility, UI behavior, keyboard/focus, responsive review                                                   |
| Impeccable                   | Critique, polish, simplification, refinement, anti-slop review **after the feature works**; no silent redesign  |
| DESIGN-MD-CHROME             | Optional reference extraction only; generated output is reference material and must never overwrite `DESIGN.md` |

If skill advice changes approved behavior or design, propose the change first. Skills cannot override the project hierarchy.

When a `.codegraph/` directory exists at the repository root, use CodeGraph before grep/find or reading code to locate/understand symbols: prefer `codegraph_explore` when available, otherwise `codegraph explore`. Name a file/symbol for current source and trace relevant paths. If no index exists, skip CodeGraph entirely; indexing is the user's decision. Otherwise use `rg`/`rg --files` for targeted searches.

## 32. Destructive Action Safety

Explicit approval is required for destructive operations such as `git reset --hard`, force-push, mass deletion, dropping production-like tables, destructive database resets, original-media deletion, or replacing large working subsystems. Make a safe checkpoint before risky refactors and confirm targets/environment before acting.

Respect approval already granted for a specific operation; broad feature approval does not silently authorize unrelated destruction. Do not casually run destructive commands against real data while testing.

## 33. Ambiguity Handling

If uncertainty affects scope, visible UX, visual identity, architecture, data, security, privacy, destructive behavior, or an API contract, **stop and ask before the dependent action**. Continue independent authorized work where possible. For minor technical choices with no visible/product impact, choose the simplest maintainable option and report meaningful assumptions.

Do not invent photographs, dates, messages, personal stories, or romantic copy on the owner's behalf. Resolve deferred choices only when relevant to authorized work; do not invent CMS requirements from historical proposals.

## 34. Personal Content Safety

Treat personal photos and messages as private project content. Do not upload them unnecessarily to third-party services, expose them in logs, publish examples, copy them into external issues, or leak them through fixtures/snapshots. Use synthetic test fixtures unless actual-media testing is explicitly required. Keep sensitive examples and generated artifacts out of public reports/source control as appropriate.

V1 excludes AI-generated personal content. Do not manufacture production love letters, memories, Things I Love About You entries, dates, or stories. Actual content comes from the owner. Use clearly labeled placeholders only when technically necessary. A separate explicit request for writing assistance does not authorize adding an AI-generation product feature.

## 35. Design Fidelity

Follow `DESIGN.md`, including the later approved Section 11 motion direction. Preserve Lavender Mist, Cormorant Garamond + Inter, editorial spacing, natural personal photography, the lavender crystal heart, and the fixed nine-chapter sequence. Preset identifiers in the schema do not imply an owner-facing theme switcher.

Preserve desktop composition and animation on phone/tablet portrait and landscape: staggered names, side-by-side spreads, horizontal Story, staged Love, independent clouds, masks, curtains, parallax, and the heart's chapter/finale return. Fit dimensions to the viewport without clipping names, text, captions, or photos. Pause, reduced motion, and genuinely oversized content retain readable alternatives; do not replace ordinary mobile animation with a static layout.

The heart turns around Y with scroll and reverses on upward scroll. Preserve the bounded WebGL renderer, visibility-aware rendering, adaptive cost, and failure fallback; do not recreate it for every viewport change or restore expensive refraction buffers. Keep debounced refresh and reading position through resize.

Preserve the interactive sphere, immediate visible rotation, lightbox/focus behavior, static constellation details, and lavender highlights. Orbital rings and extra cloud-only passage screens remain removed; closing Gallery clouds remain. Hero and Final Closing are required; hidden chapters leave no blank stages or invalid anchors.

Enforce the design's anti-AI-slop and reference boundaries: no generic marketing cards, invented romantic content, random decoration, extra cursor, or unrelated spectacle. The Diamond informs hierarchy, spacing, pacing, and depth; never copy its proprietary assets, code, copy, or exact composition.

## 36. Reporting

After each approved implementation task, report concisely: what changed, files changed, tests run, verification performed, applicable visual QA and performance/accessibility checks, review findings, remaining issues, and commit/hash when Git is available.

Distinguish observed results from assumptions and unperformed checks. Identify blockers and limitations directly. Never claim a pass, rendered inspection, delegated review, commit, or completion without evidence.

## 37. Verification

Use `verification-before-completion` when available. Before claiming success or committing, run the relevant tests, lint, formatting checks, typecheck, build, and browser verification, and inspect their output. Scale verification to the actual change; documentation-only work requires document/scope review, not an unrelated application test run.

For UI, inspect the actual rendered experience. For 3D, exercise adaptive and forced-failure fallback behavior. For content loading, verify failure and retry cases. Rerun affected checks after fixes. Confirm only intended files changed and no secrets/generated junk entered the deliverable. If a required check cannot run, report the exact limitation rather than substituting an unsupported success claim.

## 38. Current Scope and Historical Records

The owner-approved current scope is the frontend-only gift. Keep these instructions and current context synchronized with actual approved behavior. Retain historical phase reports; their old phase gates, Laravel setup, and CMS proposals do not describe the current app or cancel later authorization. Reintroducing the former backend/CMS requires a new explicit request.
