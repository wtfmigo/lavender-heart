# Phase 8 Visual Refinement Plan

> **For agentic workers:** Use subagent-driven-development for the focused sculpture task and independent review; preserve the existing public slice.

**Goal:** Execute the user's concrete Phase 8 revision brief, improving still-image crystal quality and cloud depth without adding functionality.

**Architecture:** Keep current data boundary, components, GSAP ownership and lazy/error-safe Canvas. Refine existing geometry/material, cloud composition and responsive CSS. No backend or domain schema changes, libraries, new sections, merge, push or deployment.

**Design decision:** Use a restrained cut-glass heart, four separated cloud fragments with distant/surrounding/foreground roles, intentional type overlap, transparent editorial navigation with an icon motion utility, and a quiet connected Intro reading group. Reuse and grade existing original cloud imagery rather than add large new assets. A smooth lens alone retains the rejected inflated silhouette; a custom shader adds unnecessary complexity. Existing physical material and studio environment are the smallest adequate approach.

## Execution and verification

- [x] Preserve prior desktop Hero/Intro/mobile Hero evidence in a before directory; verify clean feature branch and server.
- [x] Sculpture task: modify `frontend/src/three/utils/heartGeometry.ts`, its tests, and `frontend/src/three/scenes/HeartScene.tsx`. Preserve finite symmetric heart bounds, depth, cleft and disposal; introduce controlled planar facets and improve lavender attenuation/reflection. Test geometry integrity before and after. Keep fallback, reduced motion, context lifecycle and DPR behavior.
- [x] Composition task: refine `Hero.tsx`, `CloudAtmosphere.tsx`, `Navigation.tsx`, `Intro.tsx`, `experience.css`, and `demoExperience.ts`. Remove visible demo/status metadata, preserve supplied copy and full names, introduce distinct cloud masks/placements and subtle neutral grading, floating nav and labelled motion icon. Keep semantic main/heading/focus/native anchors and 44px utility. Add behavioral checks for absent prototype labels and accessible motion name.
- [x] Update cloud-count e2e assertion to the four actual fragments and keep all failure/reduced-motion/focus/long-name tests.
- [x] Use `frontend/scripts/visual-qa.mjs` to capture after evidence separately. Visually inspect desktop and mobile, iterate geometry/material/composition as required; compare still images and cloud transition. Check 1440×900, 1024×768, 390×844, 320/360 and 375/414/768 widths, long names and fallback.
- [x] Repeat reference study, Hallmark, spec-compliance then quality review. Resolve blockers before final verification.
- [x] Run `npm.cmd run typecheck`, `lint`, `format:check`, `test`, `build`, `e2e`; confirm backend/domain baseline untouched. Commit logical local checkpoints and return A–L report with before/after paths. Stop for user visual approval.

**Limits:** Browser viewport emulation cannot establish physical phone GPU speed. The final transmission material refracts an original cloud backdrop; DOM typography is outside that buffer. Studio reflections and real geometry provide crystal depth. No strong blur/bloom/dispersion or new asset downloads are required. Revert this refinement's commits to restore the prior review checkpoint without affecting data.
