# Home cloud passage

Added a full-width cloud passage after the Home stage, inspired by the supplied reference screenshot. Two layers reuse the original local cloud-bank assets, with softly masked edges and different scroll speeds. The passage covers the outgoing heart and heading before the next visible chapter arrives. No reference assets or code were copied.

Hero height follows its stage and passage instead of a fixed height. Long-name layouts remain in natural flow. Compact WebP clouds serve phones. Pause and reduced motion omit the passage entirely, leaving direct reading flow. Existing GSAP cleanup handles reversal, resize, and motion-mode changes.

Verified 134 unit tests, lint, production build, six browser checks (desktop/mobile passage, reverse scroll, pause/resume/reduced motion, long names, anchors). Rendered desktop and phone screenshots are in `docs/evidence/atmosphere-tuning/1440-cloud-passage.png` and `390-cloud-passage.png`.

No deployment or physical low-end device performance profiling; existing large 3D bundle warning remains.

## Collection boundary

The same full-width layered passage also follows the Collection closing before the next visible chapter (Things I Love in the demo). It is a sibling of the Gallery section so its foreground clouds can cover the fixed heart. Empty/hidden galleries omit it. The closing text remains before the passage.

Both passages now initialize in the journey hook after the desktop Story and Love pins; measuring them earlier caused the Collection animation to finish before its actual scroll position. Each passage has its own parent-element trigger.

Verified four desktop/mobile passage browser checks including reversal, pause/resume, and reduced motion, plus the hidden-chapter case and 134 unit tests, lint and build. Collection screenshots: `1440-collection-cloud-passage.png` and `390-collection-cloud-passage.png` in the same evidence folder. Review found no remaining blockers.
