# Collection clouds and chapter hearts

The collection closing previously stretched one cloud bank across its center. It now uses two softly masked banks at the outer edges, leaving the closing text clear. The opening clouds are softer too. Existing scroll parallax, pause, and mobile cloud assets remain in use.

Story, Little things, and Timeline now center their desktop headings vertically and use a larger crystal heart beside them (up to 500px). Reading uses a smaller 320px companion. Timeline companions alternate with the memory layout and hide while their bounds intersect a date, photo, or full copy block. Mobile retains its compact layout. The same WebGL heart is reused.

Validation: 134 unit tests, lint and production build; eight collection browser checks; chapter heart browser checks at 1024, 1440, and 1864px, including both Timeline orientations and a long-message regression. Screenshots are in `docs/evidence/atmosphere-tuning/` and refreshed collection views in `docs/evidence/collection-editorial/`.

No deployment or physical low-end device frame-rate profiling. The existing large HeartScene build chunk warning remains.
