# Lavender Heart

A personal birthday website with a lavender crystal heart, cloud and text parallax, horizontal storytelling, an interactive photo sphere, a timeline, and a birthday letter.

**Current architecture: frontend only.** The React/TypeScript/Vite website loads validated local JSON and local image assets. It has no backend server, database, login, or admin editor. The earlier Laravel foundation was removed because the current website does not use it.

## Run locally

Install Node.js 22.12+ or 24+ and npm. Clone the repository, then use **one terminal**:

```powershell
git clone https://github.com/wtfmigo/lavender-heart.git
cd lavender-heart
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open the URL printed by Vite. On macOS/Linux, use `npm` instead of `npm.cmd`. PHP, Composer, MySQL, and a second terminal are unnecessary. No `.env` file is required.

If you already have the repository, start with `cd frontend` from its root. For a phone or tablet on the same network, run `npm.cmd run dev -- --host=0.0.0.0` and open Vite's Network URL on that device.

“Project root” means this repository folder, where this README and `frontend/` live. The previous “In another terminal” instruction started a separate Laravel API; it no longer applies.

## Edit content

- Main content, chapter visibility, photo assignments, and dates: `frontend/public/content/experience.json`.
- Gallery introduction and closing copy: `frontend/src/features/public/collectionContent.ts`.
- Images, clouds, and self-hosted fonts: `frontend/public/`.

Save changes and reload the page. Content is validated with Zod; invalid content shows a recoverable loading error. Hero and Final Closing remain required. See [content editing](docs/birthday-content-editing.md) for field details.

**Personal photo derivatives in `frontend/public/photos/personal/` are ignored by Git.** Restore them separately after cloning; otherwise the photos referenced by the JSON will be missing. Keep original photographs and their backups outside generated build output.

To make your own version:

1. Back up the JSON, then replace the recipient name, birthday, messages, letter, and signature.
2. Add your own images to `frontend/public/photos/` and update `src`, optional `smallSrc`, `alt`, actual `width`/`height`, captions, and focal positions in the JSON. For example, `public/photos/my-photo.webp` becomes `/photos/my-photo.webp`.
3. Change the Gallery introduction/closing in `collectionContent.ts`. Keep Hero and Final Closing visible and preserve the nine-chapter order.
4. Reload, check the photos and text on your target devices, then rebuild before deploying.

This checkout keeps the original gift content; it is not a generic sample-content edition. Replace that content before sharing your own version. Local development photo provenance is recorded in [media assets](docs/birthday-media-assets.md).

## Experience and animation

The nine chapters run from Hero and Intro through horizontal Story, full-width Memory, Gallery, Things I Love About You, Timeline, Letter, and Final Closing. Phone and tablet portrait/landscape retain the desktop composition and choreography at an appropriate scale.

The browser owns scrolling. Native sticky stages provide horizontal Story and staged Love statements. GSAP/ScrollTrigger drives cloud, text, photo, and chapter parallax; React Three Fiber/Three.js renders the crystal heart, including horizontal turns synchronized with scroll. Motion handles small UI transitions, and the photo sphere uses projected transforms with automatic rotation and drag/touch exploration. Pause and reduced motion provide a readable static experience; oversized content can use vertical reading.

## Build and check

Run from `frontend/`:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd run test -- --maxWorkers=1
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run e2e
```

Playwright starts **only Vite** on port 5174. The tests cover public content, scrolling, responsive layouts, animations, photo interactions, and WebGL fallback. `npm.cmd run preview` previews the build locally.

For hosting, serve the contents of `frontend/dist/` at the domain root with SPA fallback to `index.html`; deploy the JSON and referenced assets together. The repository's root `.htaccess` denies Apache access to private workspace files inside XAMPP. It is not the configuration for the built static website.

## Project documents

[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) describes the current scope; [DESIGN.md](DESIGN.md) records the visual direction; [AGENTS.md](AGENTS.md) guides maintenance. Older phase reports and proposals under `docs/` are historical, not current setup instructions.

The GitHub repository is private. A deployed website is accessible to anyone with its URL; `noindex` discourages indexing but does not enforce access control.
