# Frontend-only cleanup implementation plan

> For agentic workers: use the execution and verification skills for this authorized cleanup, then obtain focused spec and code-quality review.

**Goal:** Remove the unused Laravel backend and its callers while retaining the current website, personal content, scrolling, and responsive animation.

**Authorization:** The owner explicitly requested deleting unused folders, including the backend, and updating project context to describe the current website. That replaces the earlier full-stack foundation requirement; no additional approval is needed for this cleanup.

**Architecture:** React loads and validates `/content/experience.json` directly. Vite builds a static website. No API, database, authentication, or editor server is part of the current application.

**Constraints:** Preserve all current public chapters, animation hooks, native horizontal Story, cloud/text/photo parallax, heart rendering, accessible lightbox/sphere, reduced motion, personal photographs, and owner-authored copy. Do not delete originals, modify external databases, remove Git worktrees, or delete historical evidence.

## Task 1: Documentation and content boundary

- [x] Rewrite `README.md` and `PROJECT_CONTEXT.md` for the existing frontend-only site, one-terminal setup, content editing, personal asset restoration, and current animation behavior.
- [x] Synchronize relevant `AGENTS.md`, `DESIGN.md`, and `docs/birthday-content-editing.md` statements; retain historical phase reports as history.
- [x] Confirm backend storage contains no uploads and its database folder contains no application database before deleting it. Git history retains tracked foundation code.

## Task 2: Remove backend dependencies

- [x] Replace API/fallback tests in `frontend/src/services/api/experience.test.ts` with direct local-content loading, schema rejection, request failure, and cancellation coverage. Assert the loader makes only one local request even when a stale API environment variable exists. Run the new test and observe the old API behavior fail.
- [x] Simplify `frontend/src/services/api/experience.ts` to the local fetch and existing validation/error handling; update its public-route import if moving to `src/services/experience.ts`.
- [x] Delete `backend/`, HTTP/API health services, `useHealth`, the unused setup page and React Query provider, stale API environment declarations/example, and unreferenced development components.
- [x] Remove unused admin/version schemas and backend parity tests; retain all public content validation and its tests.
- [x] Remove unused direct dependencies Axios, React Query, Lenis, and Zustand; update the library import test and npm lockfile. Keep libraries used by animations and rendering.
- [x] Remove README-only placeholder source directories and stale backend ignore rules. Keep active source, assets, scripts, documentation, and browser regression tests.

## Task 3: Standalone verification and delivery

- [x] Update `frontend/playwright.config.ts` to start only Vite, and replace the Laravel health assertion with public local-content rendering and zero API requests in `foundation.spec.ts`.
- [x] Run a clean npm install, the full unit suite, lint, formatting, typecheck, and production build.
- [x] Run the affected foundation browser checks plus responsive/scroll/heart/sphere regression checks against the standalone frontend; inspect any failures and avoid committing generated screenshots.
- [x] Obtain distinct spec-compliance and code-quality review; fix blocking findings and rerun affected checks.
- [ ] Commit the verified cleanup and update the existing private GitHub repository without force-pushing.

## Risks and recovery

- The former Laravel code remains in Git history; removing it removes the optional API path, not current local birthday content. No database server is changed.
- Personal derivatives under `frontend/public/photos/personal/` remain ignored by Git. A fresh clone needs these files restored separately before it matches the owner's local photographs.
- The existing Three.js bundle is substantial and is loaded lazily. This cleanup does not redesign its visual behavior or claim physical phone/Safari testing.

## Verified result and latest steering

The owner withdrew the sample-photo request. Original JSON, Gallery copy, all 59 personal derivatives, active UI/styles, GSAP choreography, and heart source were restored; they match checkpoint 893a828. The cleanup retains this original appearance and changes only unused foundation code and local-content loading.

Clean npm installation, 141 unit tests, lint, formatting, typecheck, and production build passed. Focused review found no material spec or code-quality issue. All 33 browser regression checks passed (runner exit 0); they cover native scrolling, desktop/phone/tablet portrait and landscape choreography, sphere rotation, photo frames, and WebGL fallback. Physical-device/Safari performance is not claimed. The existing lazy Three.js chunk-size warning remains.
