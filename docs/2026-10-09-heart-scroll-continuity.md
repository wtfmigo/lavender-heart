# Heart scroll continuity

User requested a stable heart after Timeline and scroll pacing inspired by the Diamonds reference. The reference was viewed in a browser for hierarchy and pacing only; no assets or source were reused.

Root cause: Timeline used a binary visibility mask whenever the moving frame intersected content, while alternating its position through the content columns. Letter then explicitly set opacity to zero.

Fix: keep the large desktop chapter opening; shrink smoothly into Timeline's existing 180px outer gutter as reading begins. Letter retains a visible companion scaled to its available side space. Remove collision hiding and alternating crossovers. Add a short scrub catch-up and damped 3D rotation so fast scroll and reverse scroll settle smoothly. Compact phone reading fades and reduced-motion behavior are preserved.

Regression coverage: a browser test failed on the original hidden Timeline heart, then passed with continuous visibility. Desktop checks cover 1024, 1440, and 1864px, long copy, successive memories, Letter, Finale, and reverse scrolling. Existing rotation and mobile checks cover affected motion behavior. No additional canvas or dependency was introduced.

No deployment or physical low-end device performance profiling. Existing large 3D bundle warning remains.
