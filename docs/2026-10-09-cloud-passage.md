# Home cloud passage

Added a full-width cloud passage after the Home stage, inspired by the supplied reference screenshot. Two layers reuse the original local cloud-bank assets, with softly masked edges and different scroll speeds. The passage covers the outgoing heart and heading before the next visible chapter arrives. No reference assets or code were copied.

Hero height follows its stage and passage instead of a fixed height. Long-name layouts remain in natural flow. Compact WebP clouds serve phones. Pause and reduced motion omit the passage entirely, leaving direct reading flow. Existing GSAP cleanup handles reversal, resize, and motion-mode changes.

Verified 134 unit tests, lint, production build, six browser checks (desktop/mobile passage, reverse scroll, pause/resume/reduced motion, long names, anchors). Rendered desktop and phone screenshots are in `docs/evidence/atmosphere-tuning/1440-cloud-passage.png` and `390-cloud-passage.png`.

No deployment or physical low-end device performance profiling; existing large 3D bundle warning remains.
