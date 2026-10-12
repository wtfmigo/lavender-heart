# Lavender Heart

A personal birthday website with a lavender folder opening, crystal heart, shared memories, interactive photo sphere, surprise messages, timeline, and letter.

Built with React, TypeScript, and Vite. Content comes from local JSON and image files. You only need Node.js and npm to run it.

## Run the website

Install Node.js 22.12+ or 24+, then open one terminal:

```sh
git clone https://github.com/wtfmigo/lavender-heart.git
cd lavender-heart/frontend
npm ci
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). On Windows PowerShell, use `npm.cmd` if `npm` is blocked by the execution policy. For an existing checkout, open its `frontend` folder and run the last two commands.

To try it on a phone connected to the same Wi-Fi:

```sh
npm run dev -- --host=0.0.0.0
```

Open Vite's **Network** URL on the phone. No PHP, database, backend server, or `.env` file is required.

## What visitors see

1. A folder with the recipient's name and a visible **Letter**. Tap/click it to open the cover, lift the letter, and reveal Home. It waits for activation on every reload.
2. Home, Intro, horizontal Story, Memory, Photos, Things I Love About You, Timeline, Letter, and Final Closing.
3. Three Love messages hidden inside an envelope, folded note, and parting heart. Tap each surprise to reveal its message.

Visitors can scroll, explore the photo sphere, open photos, and pause motion. Keyboard access, reduced motion, and a fallback for unavailable WebGL are supported.

On phones and tablets, swipe left/right to rotate the sphere or tap its arrow buttons. Swipe vertically to scroll the page; tap a photo to open it. Images reserve their frames while loading, and sphere thumbnails start loading before you reach them.

## Change names, messages, and photos

| What to change                                                               | File                                                |
| ---------------------------------------------------------------------------- | --------------------------------------------------- |
| Recipient name, dates, chapter visibility, messages, letter, and photo paths | `frontend/public/content/experience.json`           |
| Gallery introduction and closing text                                        | `frontend/src/features/public/collectionContent.ts` |
| Saved photo-frame proportions                                                | `frontend/src/features/public/photoFrames.json`     |

Back up the content file before editing. Keep its JSON valid; the website shows a retry screen if content cannot load. Keep Home and Final Closing visible. See [content editing](docs/birthday-content-editing.md) for the fields.

**To replace a picture without changing the layout:** put the replacement in `frontend/public/photos/personal/`, then update that photo's `src` in the JSON. For example, `frontend/public/photos/personal/new-photo.jpg` becomes `/photos/personal/new-photo.jpg`. Update `alt`, the actual image `width`/`height`, and optional `smallSrc` if needed. The existing frames use saved proportions; do not edit `photoFrames.json` unless you deliberately want a different frame. Crop/focal positions still affect which part of the image is visible.

Save, reload, and check desktop and phone before rebuilding.

## Photos and deployment

- The owner approved publishing the 56 image files referenced by the gift content. They are tracked in `frontend/public/photos/personal/` so Vercel can include them in the build.
- Additional untracked personal photos remain ignored. To deliberately deploy a new image, add that exact file with `git add -f frontend/public/photos/personal/your-photo.jpg`, update the JSON path, and push. Do not add the whole private folder indiscriminately.
- Visual-review screenshots under `docs/evidence/` and Playwright reports are ignored because they can show personal pictures.
- The tracked `photo01`–`photo31` assets are stock development images, documented in [media assets](docs/birthday-media-assets.md).
- Earlier visual captures were purged from branch history. The subsequently approved website photos are intentionally included; review screenshots remain excluded.

If you cloned the repo before the history cleanup, back up your local photos and changes, then clone it again. Do not merge or push the old history back into the cleaned repository.

Keep a separate backup of your originals. A production build copies local photos into `dist`, so a deployed website can expose those photos to anyone with its URL. `noindex` does not make it private.

## Build and check

Run inside `frontend`:

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

For browser checks:

```sh
npx playwright install chromium
npm run e2e
```

Playwright starts Vite on port 5174. Tests cover folder entry, Love reveals, fixed photo frames, scrolling, responsive layouts, photo interactions, and WebGL fallback. To inspect the built site, run `npm run preview`.

For hosting, upload the **contents** of `frontend/dist/` with SPA fallback to `index.html`. Build on a machine that has the required private photos, and deploy the JSON and media together. The root `.htaccess` protects workspace files under XAMPP; it is not the static hosting configuration.

## More project details

[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) explains current behavior and maintenance rules. [DESIGN.md](DESIGN.md) records the visual direction; [AGENTS.md](AGENTS.md) guides code changes. Older phase reports are historical and may describe a removed Laravel backend.
