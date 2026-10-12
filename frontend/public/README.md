# Static website files

Vite serves these files directly and copies them into production builds.

- `content/experience.json`: names, messages, dates, chapters, and photo paths.
- `photos/personal/`: the owner-approved website images are tracked for Vercel deployment. Additional untracked images remain ignored until explicitly added.
- `photos/photo01*` through `photo31*`: tracked stock development images.
- `atmosphere/` and `fonts/`: shared visual assets.

Paths omit `public`: `public/photos/personal/example.jpg` is `/photos/personal/example.jpg` in the content file. Building on a machine with personal photos includes them in `dist`; Git ignore rules do not make a deployed site private.
