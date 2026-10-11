# Lavender Heart — Design Specification

**Status:** Phase 2 design specification, awaiting review and explicit approval. No website implementation is included in this phase.

`PROJECT_CONTEXT.md` controls product scope, users, behavior, editing, architecture, and V1 boundaries. This document defines visual identity, composition, motion, and responsive presentation. It does not change product requirements or authorize implementation.

## 1. Design Vision

Lavender Heart is an intimate, personal birthday experience with premium editorial composition and cinematic pacing. Authentic photographs and personal writing lead the story; a translucent lavender crystal heart provides its principal sculptural motif.

The experience moves from **Lavender Day → Night**: warm ivory and pearl light become richer lavender, then deep plum and night violet. Negative space, image scale, typography, and restrained motion create emotional depth without excessive decoration.

## 2. Reference Direction

The Diamond website is a reference for editorial hierarchy, sculptural presence, oversized type, whitespace, photography, horizontal storytelling, parallax, and chapter transitions. Lavender Heart reinterprets those qualities with its own heart motif, personal content, lavender narrative, and original compositions.

The exact reference URL has not been supplied. This specification uses the approved reference qualities rather than claiming to reproduce or inspect a particular live site. Section 28 defines the study/copy boundary.

## 3. Design Principles

- Compose deliberately rather than repeating a section template.
- Give photographs and personal writing room to carry emotion.
- Use neutral surfaces broadly; lavender creates atmosphere and plum provides depth.
- Keep controls secondary and functional.
- Protect readable content before preserving a dramatic effect.
- Recompose for smaller screens and weaker devices rather than shrinking desktop scenes.
- Keep the nine major chapters fixed; visual design does not create page-builder freedom.

The page may feel long. Do not compress chapters simply to shorten scrolling. Hidden eligible sections leave no blank stage, invalid jump link, or orphaned transition. Hero and Final Closing remain required.

## 4. Emotional Tone

The intended tone is intimate, personal, elegant, dreamy, premium, emotional, calm, cinematic, and handcrafted.

Avoid childish or overly cute styling, dominant pink, generic Valentine's imagery, wedding-template presentation, SaaS composition, dashboard aesthetics on the public page, synthetic personal copy, and ornamental excess. A restrained scene should feel intentional rather than unfinished.

## 5. Color Narrative

The narrative is a progression inside **one global preset**, not a set of independently selectable section themes.

| Story phase | Atmosphere and surface direction |
| --- | --- |
| Opening, Hero, Intro | Warm ivory, pearl, pale lavender; soft studio light |
| Horizontal Story | Neutral space gradually gains lavender depth; photographs stay natural |
| Full-Width Memory | The photograph supplies the dominant color; surrounding atmosphere bridges chapters |
| Gallery | Pale/richer lavender surroundings balanced with neutral negative space |
| Things I Love About You, Timeline | Lilac and dusty-purple atmosphere gradually deepen toward plum |
| Birthday Letter | Warm neutral reading surface within the deepening surroundings; readable calm pause |
| Finale | Deep plum, charcoal violet, night plum; the full heart returns |

Use gradual tonal bridges and selected chapter transitions rather than hard background switches. The letter's light reading surface is a deliberate island of readability, not an abrupt reset of the whole page to the opening atmosphere. If sections are hidden, adjacent visible chapters still transition coherently.

Most surfaces should not be saturated purple. Dusty-purple accents and gradients may establish depth, but text remains on readable surfaces. Do not apply gradients to text.

## 6. Global Theme Presets

**Lavender Mist is the default.** All presets share typography, section order, compositions, interaction behavior, and motion language. Selecting a preset changes the coherent palette globally; it never changes layout or exposes per-section theme controls.

| Preset | Character |
| --- | --- |
| Lavender Mist | Warm ivory/pearl opening, pale lavender atmosphere, soft lilac middle, deep plum finale |
| Lavender Night | Cooler, duskier opening with stronger lavender contrast and a deeper violet finale; still progresses from lighter beginning to night |
| Pearl Lavender | Brighter pearl surfaces, quieter lavender accents, and a softened plum finale; preserves depth rather than staying white throughout |

Section 29 defines the complete preliminary palette for each preset. Do not scatter arbitrary purple values through components. Photography keeps its own colors across presets.

## 7. Typography

Use exactly two primary typefaces:

- **Cormorant Garamond:** hero and chapter titles, emotional statements, large editorial copy, numbered statement text, and selected quotes.
- **Inter:** body text, captions, dates, navigation, controls, labels, forms, and the admin interface.

Recommended weights are 400/500/600 for both families; use weight changes sparingly. A handwritten accent is not required and needs explicit approval before introduction. Font fallbacks must preserve readable content while fonts load; do not hide the page behind font loading.

Display typography uses intentional line breaks, a tight but unclipped line-height, and generous surrounding space. Use restrained uppercase labels with modest tracking. Body and long-form text use narrow readable measures and comfortable leading. Do not use gradient text, excessive bold/all-caps, tiny body text, overly wide paragraphs, or generic SaaS headings.

Type sizes are fluid recommendations in Section 29. Editable names and longer copy must wrap naturally without cropping, overlap, or new hard character limits. Layout should tolerate English, Tagalog, and Taglish without introducing a language switcher.

## 8. Layout and Spacing

Use generous editorial spacing, limited content per viewport, intentional asymmetry, strong image/text relationships, and varied visual rhythm. Asymmetry must preserve hierarchy and reading order.

Use the shared spacing scale and recommended gutters/section gaps in Section 29. Long-form reading, wide editorial spreads, and full-bleed scenes have distinct width roles; do not place every chapter inside the same narrow container.

Full-viewport staging is appropriate only when content fits. Text-heavy entries must gain room or use natural flow rather than clipping inside a cinematic stage. Do not solve editable-content variation by imposing arbitrary hard limits.

Surfaces stay mostly flat. Use shadows only for necessary depth separation, with no heavy black shadows or stacked SaaS-card shadows. Glassmorphism is limited to small navigation/floating/lightbox controls where readability benefits; never apply it to every section, gallery item, or admin panel.

## 9. Photography and Atmosphere

Photography is **mostly natural**. Preserve skin tones, real colors, and emotional authenticity. Selected cinematic images may receive extremely subtle lavender/plum grading or gentle warmth/contrast adjustment. Never apply a purple filter to every photo.

Use mixed framing: square, near-square, and low-radius editorial images as the baseline; selected soft-rounded photographs where the composition benefits; full-bleed or near-full-viewport images for major cinematic moments. Do not give every image the same radius or make the gallery a collection of cards.

Respect original portrait/landscape proportions and the editable focal point/crop position where available. Do not crop a face or important subject to satisfy an arbitrary frame. Natural image color, surrounding surfaces, typography, spacing, and light provide theme coherence.

Atmosphere may include faint film grain, soft radial light, light haze, blurred lavender shapes, gentle depth gradients, and extremely subtle particles in selected scenes. These are optional accents, not required layers in every chapter. Avoid heavy fog, giant glowing blobs, constant particle fields, glitter, floating hearts, and excessive blur.

## 10. The Crystal / Glass Heart

The primary object is a **3D translucent lavender crystal/glass heart**: an elegant silhouette, lavender tint, soft refraction, subtle reflection, premium material, soft light interaction, and restrained glow. It must read as sculptural glass rather than plastic or an emoji.

Avoid bright red, cartoon geometry, glossy plastic, neon glow, rainbow refraction, and excessive bloom. Clear silhouette and controlled lighting matter more than expensive effects.

| Placement | Intended presence |
| --- | --- |
| Hero | Dominant central visual anchor; full heart |
| Intro | Smaller calm presence near upper-center |
| Story | Small upper-center supporting sculpture in reserved negative space; hidden during phone reading |
| Full-Width Memory, Gallery, Letter | Persistent sculpture recedes completely; Gallery opening retains its small static lavender motif |
| Little things, Timeline | Small controlled upper-center introduction; recedes during reading |
| Finale | Full heart returns centrally |

Do not keep the heart permanently visible or repeat the complete object after every chapter. Transition fragments should never compete with photographs or readability.

The owner's October 10, 2026 repair direction uses stable center-based choreography. Idle and scroll rotation remain subtle and bounded so the silhouette stays recognizable; no pointer rotation, camera wandering, full spins, or arbitrary side-to-side travel. Size and visibility interpolate reversibly through one chapter controller. Retain the normal system cursor.

Adaptive 3D preserves the heart's identity. Capable devices retain real 3D; mobile may reduce DPR, lights, shader/material complexity, particles, and rendering cost. Weak or unsupported devices receive a lightweight static/rendered heart fallback. A failed WebGL scene must never leave an empty hero or finale. No fallback assets are created in this phase.

## 11. Motion Language and Ownership

Motion is graceful, deliberate, fluid, calm, and responsive. It must never block reading, introduce cartoon bounce/elastic motion, or keep every element moving.

| Visual responsibility | Owner |
| --- | --- |
| Scroll choreography, pinning, horizontal story, parallax, major transitions, major text/image reveals | GSAP + ScrollTrigger |
| Heart, camera, light, material, WebGL scene | Three.js / React Three Fiber |
| Menu drawer, lightbox, modals, small React state transitions | Motion |
| Simple hover, focus, color, and very small transitions | CSS |
| Smooth scrolling | Lenis |

Do not let multiple systems compete over the same visual property. Detailed coding rules belong in future `AGENTS.md` work.

### Shared reveal language

- Major headings: editorial mask reveal.
- Body/captions: soft fade and small rise.
- Main editorial photographs: mask/curtain reveal.
- Full-bleed/parallax photographs: slow cinematic zoom.
- Gallery items: subtle fade and small scale settling.

Avoid typing effects, bouncing letters, constant character animation, excessive split-text spectacle, and random animation styles per object. Character-by-character treatment is exceptional, not the default.

Selected chapter transitions let preceding content exit, atmosphere change gradually, and the next chapter become dominant. Depth or pinning may support particular moments; every boundary must not become a dramatic set piece.

Pinning and horizontal progression are scroll-driven staging, not conventional carousels or forced autoplay. Preserve normal scrolling, keyboard access, native navigation, and readable content. Offscreen effects should not keep heavy animation running. Timing categories in Section 29 describe motion character, not fixed scene durations or performance budgets.

## 12. Navigation and Controls

Desktop uses **minimal floating navigation**: a small project mark/name and only a few useful section jump links. It is visually secondary, with transparency or light blur only when needed. It subtly hides on scroll down and returns on scroll up.

Navigation must remain usable when keyboard focus enters it; do not hide a focused control. Jump links target visible chapters and account for navigation overlap. Hidden sections are not listed.

Mobile uses a compact **top bar + menu drawer**. Show a restrained brand/project mark and a simple menu control. The drawer may be clean fullscreen or side-mounted, with only important jump links. Do not use bottom app navigation, squeezed desktop links, or a hamburger-animation spectacle.

Controls use minimal text links, subtle underlines, and small arrows or functional line icons when useful. Hover movement is restrained. Touch targets can be generous without appearing as giant buttons. Avoid oversized CTAs, gradient buttons, excessive pills, and thick shadows.

Menu and lightbox presentation must include keyboard focus management, visible focus, Escape dismissal, and focus returning to the initiating control. Mobile interaction cannot depend on hover. The normal system cursor remains unchanged.

## 13. Opening Experience

The first visit uses a **short cinematic introduction, approximately 2–4 seconds maximum**: a soft ivory/lavender canvas, brief genuine loading/progress treatment, an editable “For [Her Name]” style reveal, gradual heart appearance, and transition into the hero.

Do not add a long forced intro, fake progress, or a preload of the entire photo collection. Asset delays or WebGL failure must resolve into readable hero content and the lightweight fallback rather than indefinitely extending the introduction.

Repeat visits use a shortened introduction/quick reveal. Reduced motion uses an immediate or brief simple reveal. The storage mechanism and lifetime used to distinguish first/repeat visits are deferred; this design behavior is not analytics or visitor profiling.

A minimal first-visit “Scroll” cue with a thin line/understated arrow disappears once scrolling begins. Do not use an animated mouse illustration. Intro staging and the cue do not create an access gate, scheduled unlock, or countdown.

## 14. Section 1 — Hero + 3D Heart

- **Visual purpose:** establish the personal recipient and central sculptural identity.
- **Layout:** centered full crystal heart with split editorial typography around, behind, above/below, or partially layered with it. Preserve readable text and the heart silhouette; do not duplicate The Diamond's text placement.
- **Typography:** name-focused Cormorant Garamond display; “FOR / [HER NAME] / WITH LOVE” is compositional guidance, not hardcoded final copy. Birthday context uses smaller supporting copy/date rather than a dominant generic “HAPPY BIRTHDAY.” All actual copy stays editable.
- **Photography role:** none required; the heart is the visual anchor.
- **Atmosphere:** soft ivory/lavender studio background, radial illumination, faint grain/haze; no illustrated landscape.
- **Motion:** slow idle rotation/float, slight pointer response, controlled scroll-reactive camera/scale/angle, then exit through a layered, full-width cloud passage before the next visible chapter. Skip the passage in paused/reduced motion. The scroll cue is secondary.
- **Responsive behavior:** recompose split text above/below the heart as needed; do not hide or crop long names. Use adaptive 3D or the fallback. Reduced motion settles the object without unnecessary camera travel.
- **Avoid:** red/cartoon heart, plastic/neon material, aggressive spinning, oversized pointer effects, unreadable overlap, or a giant CTA.

## 15. Section 2 — Intro Birthday Message

- **Visual purpose:** provide breathing room after the hero and before photographs.
- **Layout:** one oversized editorial statement, approximately 1–3 short lines, with generous whitespace and an optional small supporting sentence. Longer saved content may wrap naturally.
- **Typography:** Cormorant Garamond statement; Inter supporting text.
- **Photography role:** little or none.
- **Motion:** calm heading mask reveal and restrained supporting fade/rise. The full heart is absent.
- **Responsive behavior:** narrower line breaks and proportionate spacing; maintain hierarchy rather than compressing the statement into a dense block.
- **Avoid:** decorative card, several competing images, repeated heart, or a dramatic transition around every line.

## 16. Section 3 — Horizontal Photo + Message Story

- **Visual purpose:** let shared memories unfold as editorial spreads; a signature interaction.
- **Layout:** desktop/capable large viewports use pinned horizontal storytelling driven by vertical scrolling, with one memory per viewport spread in saved order. Keep its photograph and message together on one stable editorial canvas; alternate portrait, wide, date, and cinematic arrangements within a consistent grid.
- **Typography:** serif editorial titles/selected statements, Inter dates/captions/messages; longer memories retain readable columns.
- **Photography role:** primary; vary image sizes and portrait/landscape framing within equal viewport canvases, preserving complete personal photographs and supplied focal metadata.
- **Motion:** GSAP/ScrollTrigger horizontal progression with restrained major reveals. Preserve the saved content order and understandable reading flow.
- **Responsive behavior:** phones use the same memories in vertical editorial storytelling, preserving order, hierarchy, images, messages, and pacing. Narrow/weaker tablets may also use vertical flow. Reduced motion uses natural vertical flow without strong pinning. Content that cannot fit a pinned stage must remain readable in flow.
- **Avoid:** conventional carousel, generic swipe carousel on mobile, repeated product slides, scroll traps, or horizontally forced phone navigation.

## 17. Section 4 — Full-Width Parallax Memory

- **Visual purpose:** one major emotional pause around a favorite photograph.
- **Layout:** one near/full-viewport image, controlled crop and scale, and a short bottom-left editorial caption with generous edge spacing. Protect the subject. Add a restrained readability scrim/gradient only when the particular photograph needs it.
- **Typography:** Inter caption/date; a short serif emphasis may support hierarchy without becoming a giant quote.
- **Photography role:** dominant, mostly natural color; focal-point positioning controls the crop.
- **Motion:** selected cinematic pinned parallax, with restrained depth separation between copy, primary photo, optional secondary visual, and background. Slow image zoom and a cinematic pause are sufficient.
- **Responsive behavior:** adapt the crop and caption placement to retain the subject; reduce or remove pinning/parallax. If overlaid copy cannot stay readable, give it an adjacent reading area within the same chapter. Reduced motion uses a static composition.
- **Avoid:** huge centered generic quote, covering faces, mandatory dark scrim on every photo, heavy parallax throughout the site, or endless pinned travel.

## 18. Section 5 — Curated Gallery and Lightbox

- **Visual purpose:** present authentic photographs as an editorial collection rather than a social feed.
- **Layout:** art-directed memory chapter: a large serif opening with separate portrait/detail frames and a lavender motif, three distinct numbered spreads, a near-full-width favorite view with adjacent caption, small detail groups of up to five images, and a quiet closing. Use mixed sizing, asymmetry, and generous spacing without overlapping photographs, repeated large pairs, or uniform thumbnails. Recompose into a vertical editorial sequence on mobile in saved photo order. Soft cloud banks frame the opening and closing without covering photographs or copy.
- **Typography:** quiet Inter captions/dates where present; chapter heading uses Cormorant Garamond.
- **Photography role:** central; mixed framing, natural colors, and intentional crops rather than uniform thumbnails or card borders.
- **Motion:** progressive subtle stagger, fade, and very small scale settling. Selected larger photos may have light depth/parallax. Desktop hover scale is approximately **1.02–1.04 maximum**, with a tiny depth shift or caption/date fade when useful.
- **Responsive behavior:** touch interaction does not depend on hover; captions needed for understanding remain available. Reduce stagger/depth on smaller or weaker devices and use simple/static reveals for reduced motion.
- **Avoid:** identical cards, uniform thumbnail grid, chaotic motion, dramatic tilt, bounce, large zoom, or magnetic images.

### Approved keepsake photo galaxy — 2026-10-11

The gallery keeps its opening, first ten editorial photographs, and quiet closing. Remaining keepsake photographs form a slowly rotating spherical constellation, with a soft lavender nebula glow and decorative stars. Mouse and touch dragging rotate it on both axes; selecting a photograph opens the existing lightbox with its full image and caption.

The sphere includes keyboard rotation, visible focus, pause/resume, and a photo-list view in saved order so every image and caption remains reachable. Reduced motion disables automatic rotation while retaining manual navigation. Global motion pause, an open lightbox, interaction, offscreen placement, and hidden tabs suspend automatic rotation. Mobile uses a viewport-fitted sphere and retains ordinary scrolling outside its interaction surface. The sphere overrides the earlier gallery detail-group layout and subtle reveal treatment only for these keepsake photographs.

The owner's latest 2026-10-11 refinement uses a slightly enlarged sphere and photo cards (maximum radius 340px, card width 160px), triples automatic rotation to twelve degrees per second, and removes the decorative galaxy background entirely: no nebula glow, stars, halo or orbit rings behind the photos. This overrides the earlier decorative backdrop. The toolbar and instructions are absent from the normal visual layout; instructions remain available to assistive technology and the existing pause/list controls appear only when reached with keyboard focus. The navigation's global motion pause remains available.

Automatic rotation starts when the sphere enters view, with no intentional startup delay. Pointer hover does not pause it, and releasing a drag resumes it immediately. Keyboard focus/arrow-key interaction still pauses rotation for accurate navigation; leaving keyboard focus resumes it. Explicit pause, reduced motion, hidden/offscreen state and an open lightbox retain their existing suspension behavior.

### Minimal fullscreen lightbox

Use a large centered photograph on a deep-plum/near-black backdrop, with optional caption/date and only Close, Previous, and Next controls. Preserve the full photograph rather than forcing its gallery crop in the lightbox. Controls are legible, understated, and touch-friendly.

Desktop supports keyboard access; mobile supports touch/swipe navigation while retaining explicit controls. Use restrained fade/scale, reduced to simple fades or immediate state changes when requested. Focus stays within the open lightbox and returns to the initiating photograph on close. No share/download controls or extra toolbars are added.

## 19. Section 6 — Things I Love About You

- **Visual purpose:** foreground personal writing through large numbered editorial statements.
- **Layout:** large ordinal number, large serif statement, and strong negative space; minimal supporting visual treatment. Numbers label entries, not statistics.
- **Typography:** Cormorant Garamond statement and large editorial number; Inter supporting details when present. Example phrases are not final personal content.
- **Photography role:** optional restrained backdrop/support; the words lead.
- **Motion:** capable desktop uses a pinned **one-at-a-time** sequence: 01 reveals, transitions to 02, then 03. Background/photo may shift subtly. This section is never horizontal.
- **Responsive behavior:** mobile, reduced motion, or unsuitable content height uses a normal vertical editorial sequence with every statement readable.
- **Avoid:** feature cards, icon grids, marketing claims, cramped repeated boxes, or a second horizontal story.

## 20. Section 7 — Relationship / Special Moments Timeline

- **Visual purpose:** show meaningful relationship moments in a readable chronological story.
- **Layout:** vertical editorial timeline; alternate left/right composition where space allows. Large date/year treatment, photograph, short personal memory, and generous spacing replace corporate timeline widgets.
- **Typography:** expressive date/year and chapter heading may use Cormorant Garamond; labels/body use Inter.
- **Photography role:** supports selected memories; preserve authentic crops and color.
- **Motion:** subtle date/timeline progression as the visitor reaches each memory; text and photo can enter with slightly offset timing. Selected images may use mild parallax.
- **Responsive behavior:** simplify into a single readable vertical composition; reduce depth and remove unnecessary motion while preserving chronology. An optional relationship counter near the ending is minimal inline text only.
- **Avoid:** project-management styling, progress bar, dashboard metrics, fake dates, or excessive connecting decoration.

## 21. Section 8 — Main Birthday Letter

- **Visual purpose:** a calm, comfortable reading moment for the most sustained personal writing.
- **Layout:** warm ivory/neutral reading surface, narrow column, strong opening, generous paragraph spacing, and subtle signature/date. Surrounding atmosphere continues toward night. Do not turn the letter into a floating glass card.
- **Typography:** Cormorant Garamond heading/opening; clean Inter body. Use the reading measure and body leading in Section 29. Supported limited rich text retains the design system's typography.
- **Photography role:** none required; reading has priority.
- **Motion:** gentle section entrance, opening-line mask reveal, naturally appearing body, and minimal/no parallax.
- **Responsive behavior:** maintain a readable column with comfortable gutters; text expands naturally with editable content. Reduced motion reveals the letter directly without making reading dependent on scroll choreography.
- **Avoid:** pinning every paragraph, page-turn gimmicks, overly wide paragraphs, tiny type, forced truncation, or changing fonts through rich text.

## 22. Section 9 — Final Heart Scene + Closing

- **Visual purpose:** a quiet, intimate, complete emotional ending.
- **Layout:** full crystal heart returns centrally in dark lavender/deep-plum/night atmosphere. Place editable closing message with restrained signature/date. Birthday date and subtle relationship counter remain optional, following the context's visibility rules.
- **Typography:** Cormorant Garamond final statement; Inter supporting date/signature/inline counter. Give the message and silhouette clear separation.
- **Photography role:** not required; the heart completes the visual narrative.
- **Motion:** gradual transition into night, controlled heart return, quiet settling. Do not add a constantly dramatic loop after the story ends.
- **Responsive behavior:** adapt type/object composition and 3D cost; preserve the final message when using a static fallback. Reduced motion uses a settled heart and simple reveal.
- **Avoid:** marketing footer, giant CTA, contact/social links, promotional copy, or unrelated decoration.

The relationship counter, when configured and shown, is a small inline phrase such as a days-together message. It may sit near a chapter transition, timeline ending, or finale. It is not a metrics component and must not be repeated as a decorative statistic throughout the page.

## 23. Admin Visual Direction

The admin is **clean lavender editorial administration**, not the cinematic public experience. Use white and very light lavender, Inter, subtle accents, a clear section sidebar, readable forms, useful upload states, and practical preview. Keep decoration minimal and unnecessary motion almost absent; no 3D or GSAP spectacle.

The recommended areas in `PROJECT_CONTEXT.md` organize the interface. Panels/cards are appropriate only when they group related work; avoid excessive nested containers and floating glass fields. Moderate functional radius and subtle borders/shadows are acceptable.

- Give fields clear labels, useful spacing, readable values, and nearby validation/help text.
- Make upload/loading/success/failure states understandable through words and functional icons, not color alone.
- Present Save clearly as the explicit action that makes changes live. Show pending/success/error feedback without creating autosave, a separate Publish button, or a draft workflow.
- Show approved entry reordering and eligible section visibility as structured controls, never unrestricted chapter composition.
- Present revision timestamps/Restore and Trash Restore/Permanent Delete plainly; confirmations distinguish destructive actions.
- Keep backup/import-export presentation practical and consistent with the approved simple recovery scope.
- Any owner authentication presentation uses restrained email/password fields; no registration or visitor login is introduced.

Desktop preview may sit beside the editor or use another practical arrangement; smaller screens may use a separate preview mode. It shows approximately how current form content will look, including the selected preset, without implying draft publishing.

Theme selection presents exactly Lavender Mist, Lavender Night, and Pearl Lavender as one global choice, with small palette previews and a clear selected state. Do not expose color pickers or independent section themes. The admin remains light and functional across presets; its preview accurately presents the chosen public narrative, without a separate admin theme setting.

## 24. Responsive Composition

Breakpoints respond to **available layout space and device capability**, not device labels alone. Tailwind breakpoints are implementation tools; no fixed “tablet equals desktop/mobile” rule applies.

| Context | Intended adaptation |
| --- | --- |
| Small mobile, roughly below 360 CSS px | Safest gutters, smaller fluid display limits, single-column images where necessary, wrapped names/controls, natural vertical chapters |
| Mobile | Art-directed vertical story and statements; top bar/drawer; simpler timeline; reduced parallax; adaptive heart; editorial spacing retained within the width |
| Tablet / narrow desktop | Decide whether text, image stages, navigation, and capability actually support cinematic treatment; reduce pin distance/duration, parallax, complexity, or use vertical story |
| Full desktop / capable wide viewport | Generous spreads, floating navigation, pinned horizontal memories, selected parallax, and one-at-a-time statements where content fits |

Reference tools may use Tailwind's 40rem/48rem/64rem/80rem/96rem breakpoints, but composition changes when it stops working, including at intermediate widths. A wide but weak device may still use simpler motion.

Mobile must preserve content order, hierarchy, photographs, messages, and pacing. Do not merely scale the entire desktop stage down. Account for variable viewport height, portrait/landscape orientation, text zoom, long content, and touch use without clipped stages or unwanted page-level horizontal overflow.

Short screens retain the staggered opening names and centered heart within the available height. Landscape keepsake spheres scale their radius and photo cards with viewport height; photo viewers allow natural scrolling. Changing orientation should retain the current reading location when cinematic stages switch to vertical flow.

The faceted heart uses translucent crystal shading with its existing lighting and reflections. Expensive framebuffer refraction is removed to keep rendering responsive during viewport changes; the heart's geometry, composition, and rotation are preserved.

## 25. Accessibility and Reduced Motion

Require sufficient contrast, meaningful hierarchy, semantic headings, readable body sizing, visible keyboard focus, and touch-friendly controls. Pale lavender aesthetics must not compromise readability.

- Use one meaningful public page heading with correctly nested chapter headings. Visual scale need not determine semantic heading level.
- Normal text should achieve at least **4.5:1** contrast; large text and meaningful UI boundaries/focus indicators should achieve at least **3:1** against their surroundings. Validate overlays and transitional states as well as flat surfaces.
- Body text starts at a readable 1rem minimum; captions are not a substitute for small body text. Support text resizing and natural reflow.
- Use clear focus outlines; do not remove focus for aesthetics. Navigation hiding must not obscure keyboard focus.
- Aim for at least 44 × 44 CSS px interactive hit areas, including visually small text/icon controls; allow separation between targets.
- Provide useful alt text for meaningful personal photographs. Decorative heart fragments/grain do not need redundant descriptions; the actual text carries the message.
- Do not make any content dependent on hover, animation completion, WebGL, or pointer precision.
- Keep lightbox/menu controls labeled and keyboard/touch usable; preserve focus management and dismissal behavior.

Respect **`prefers-reduced-motion`**: disable/reduce smooth interpolation, remove strong parallax, simplify pinned scenes into natural vertical flow, reduce heart movement, remove unnecessary camera travel and pointer depth, and use simple fades or immediate visibility where useful. Shorten the opening reveal. Preserve all content, sequence, navigation, and reading access. Accessibility takes priority over cinematic fidelity.

## 26. Performance-Aware Design and Visual QA Intent

Graceful degradation is part of the intended design. The premium effect comes from composition, photography, and lighting—not a requirement to sustain expensive rendering on every device.

Use responsive optimized image derivatives rather than original full-resolution sources everywhere. Lazy-load non-critical photography without obstructing the opening's essential content. Reserve space to avoid disruptive visual jumps. Adapt WebGL, reduce offscreen rendering, and simplify effects on weaker devices.

Avoid requirements for dozens of WebGL objects, hundreds of particles, giant moving blur layers, excessive backdrop-filter, always-running heavy effects, and stacked expensive glass/refraction/bloom passes. Reduce decorative cost before reducing readability or losing content. A static heart and simple editorial flow remain recognizably Lavender Heart.

Future visual QA should judge deliberate spacing, clear hierarchy, fluid typography/long-name handling, subject-safe cropping, natural color, varied editorial rhythm, restrained motion, coherent Day → Night progression, responsive integrity, useful focus/contrast, and reference inspiration without copying. Hidden sections and reduced effects must still produce a complete story. Detailed testing procedures belong in future `AGENTS.md`, not this document.

## 27. AI-Slop Prevention

Explicitly forbid repetitive feature-card grids, random gradient blobs, gradient pill labels over every heading, glass cards everywhere, huge generic CTAs, fake testimonials, fake statistics, meaningless marketing copy, excessive rounded cards, floating decorative icons, floating heart particles, identical section templates, random animation for every object, unnecessary marquees, typing-effect overload, arbitrary 3D decoration, and excessive glow.

Prefer authentic photographs, real personal writing, whitespace, editorial asymmetry, restrained motion, and deliberate composition. Icons are minimal functional line icons; avoid cartoon sets, repeated decorative hearts, and large feature icons. The sculptural heart is the primary heart motif.

## 28. The Diamond Reference Boundary

**Approved to study:** hierarchy, composition, visual pacing, whitespace, editorial scale, image/text relationships, scroll concepts, depth, and the sculptural centerpiece concept.

**Do not copy:** exact section layout, exact CSS, proprietary fonts, exact animations/components, assets, copy, wedding branding/content, or proprietary illustrations. Do not recreate the site pixel-for-pixel.

Lavender Heart must be recognizable as its own design. Its authentic photographs and writing, heart silhouette, lavender palette, nine curated chapters, and calm personal ending establish that identity. A reference resemblance is not permission to borrow proprietary material.

## 29. Preliminary Reusable Design Tokens

These are design specifications only. No CSS, Tailwind configuration, fonts, or theme code is created here. Names are suitable for future Tailwind CSS + custom CSS use. Ranges guide responsive composition rather than forcing identical values across devices.

### Palette primitives

Lavender Mist uses the canonical approved palette exactly. Night and Pearl provide coherent whole-site variations.

| Token | Canonical Mist name | Lavender Mist (default) | Lavender Night | Pearl Lavender |
| --- | --- | --- | --- | --- |
| `color-ivory` | Warm Ivory | `#F8F5FB` | `#E9E3F0` | `#FAF8FC` |
| `color-pearl` | Pearl | `#FCFAFD` | `#F1ECF5` | `#FFFFFF` |
| `color-lavender-pale` | Pale Lavender | `#EEE7F8` | `#D8CCE7` | `#F2EDF8` |
| `color-lavender-mist` | Lavender Mist | `#D9C8F2` | `#BEA6DC` | `#E5DAF2` |
| `color-lilac` | Soft Lilac | `#CBB4E8` | `#A78ACB` | `#D4C4E7` |
| `color-purple-dusty` | Dusty Purple | `#A78BC7` | `#8D6BAF` | `#AD96C5` |
| `color-plum-deep` | Deep Plum | `#5E4B73` | `#4B355A` | `#625170` |
| `color-violet-charcoal` | Charcoal Violet | `#2D2434` | `#281E32` | `#312938` |
| `color-plum-night` | Night Plum | `#1F1728` | `#16101F` | `#241C2D` |

### Semantic color roles

| Role | Palette mapping / rule |
| --- | --- |
| `surface-start` / `surface-reading` | `color-ivory` or `color-pearl` |
| `surface-soft` | `color-lavender-pale` |
| `surface-middle` | Pale lavender through mist/lilac, with neutral reading areas |
| `surface-night` / `surface-overlay` | `color-plum-night` or `color-violet-charcoal` |
| `text-on-light` | `color-violet-charcoal`; default on light and lavender reading surfaces |
| `text-secondary-on-light` | `color-plum-deep` only when the actual surface maintains required contrast |
| `text-on-dark` | `color-ivory` / `color-pearl` |
| `text-secondary-on-dark` | `color-lavender-pale` with verified contrast |
| `accent-atmosphere` | Mist/lilac/dusty purple; decoration rather than pale body text |
| `focus-on-light` / `focus-on-dark` | Charcoal / pearl with a separated visible outline |
| `border-subtle` | A restrained translucent text-color border for grouping; stronger contrast for meaningful control boundaries |

Body text must not rely on pale accents or dusty purple as a universal foreground. Text over photographs needs a verified clear region or restrained scrim; palette tokens alone cannot guarantee contrast over an image. Feedback states use explicit labels/icons and readable text, not color alone.

### Fonts and fluid type scale

| Token | Recommendation |
| --- | --- |
| `font-display` | Cormorant Garamond, Georgia, serif |
| `font-body` | Inter, system-ui, sans-serif |
| `text-hero` | Fluid 3.5–10rem; roughly 0.95–1.05 line-height; cap by available width/content |
| `text-chapter` | Fluid 2.5–6rem; roughly 1.05–1.15 line-height |
| `text-statement` | Fluid 2–5rem; roughly 1.1–1.2 line-height |
| `text-title` | Fluid 1.5–2.5rem; roughly 1.2 line-height |
| `text-body` | 1–1.125rem; 1.6–1.75 line-height |
| `text-letter` | 1.125–1.25rem where width allows; 1.7–1.85 line-height |
| `text-caption` | 0.875–1rem; roughly 1.5 line-height |
| `text-label` | 0.75–0.875rem; restrained uppercase only for short labels, approximately 0.08–0.12em tracking |

Hero type may reduce below its initial range on exceptionally narrow screens or long names to prevent clipping while retaining hierarchy. Do not horizontally squeeze lettering or force arbitrary fixed line breaks across all content.

### Spacing and width

Use a 0.25rem base step, with these reusable scale values:

| Token | Value |
| --- | --- |
| `space-1` / `space-2` | 0.25rem / 0.5rem |
| `space-3` / `space-4` | 0.75rem / 1rem |
| `space-6` / `space-8` | 1.5rem / 2rem |
| `space-12` / `space-16` | 3rem / 4rem |
| `space-24` / `space-32` | 6rem / 8rem |
| `space-48` / `space-64` | 12rem / 16rem |

| Composition token | Recommended range / role |
| --- | --- |
| `gutter-small` | 1–1.5rem on very narrow screens |
| `gutter-mobile` | 1.5–2rem |
| `gutter-adaptive` | 2–3rem on intermediate widths |
| `gutter-desktop` | 3–6rem on wide screens |
| `section-gap-mobile` | Approximately 4–7rem; composition can breathe beyond this when useful |
| `section-gap-desktop` | Approximately 8–15rem; adapt to viewport and chapter purpose |
| `memory-gap` | Generous space from the shared scale, varying by spread/viewport; no identical card gutter requirement |
| `width-reading` | Approximately 48–60ch for the letter |
| `width-prose` | Up to approximately 65ch for general reading |
| `width-editorial` | Up to approximately 84rem for broad spreads, with responsive gutters |
| `width-cinematic` | Viewport-wide where approved; copy still uses safe gutters |

### Corners, shadows, and surface restraint

| Token | Recommendation |
| --- | --- |
| `radius-editorial` | 0–0.25rem for square/low-radius framing |
| `radius-photo-soft` | 0.75–1.5rem, selected photographs only |
| `radius-control` | 0.25–0.5rem |
| `radius-admin` | 0.5–0.75rem where functional grouping benefits |
| `shadow-soft` | Initial 0 0.5rem 1.75rem shadow, preset charcoal-violet at approximately 8% opacity; only for needed separation |
| `shadow-none` | Default for editorial photos and public content surfaces |

No universal pill radius or glass-panel treatment. Blur and grain remain extremely subtle and removable; they are not structural dependencies.

### Motion categories

| Token | Initial character |
| --- | --- |
| `motion-instant` | Immediate visibility/state change when motion is unnecessary |
| `motion-fast` | Approximately 120–180ms for restrained CSS hover/focus/color |
| `motion-ui` | Approximately 180–300ms for drawer/lightbox/modal state changes |
| `motion-reveal` | Approximately 500–900ms for editorial heading/image entrances |
| `motion-chapter` | Approximately 800–1400ms character for selected atmospheric transitions, or equivalent restrained scroll progression |
| `motion-idle` | Very slow, low-amplitude heart motion; no fixed perpetual dramatic loop |
| `ease-editorial` | Smooth ease-out or gentle ease-in-out; no bounce/elastic character |

Scroll-driven choreography follows the visitor rather than forcing these durations onto every scene. Reduced motion overrides these categories with static presentation or brief simple fades. Photo-hover scale remains 1.02–1.04 maximum.

### Layering philosophy

| Token | Intended stacking role |
| --- | --- |
| `layer-background` (0) | Surface, grain, radial light |
| `layer-media` (10) | Photography and scene media |
| `layer-copy` (20) | Readable content |
| `layer-sculpture` (30) | Selected hero/transition object layering, without obscuring readable text |
| `layer-navigation` (40) | Floating navigation/top bar |
| `layer-drawer` (50) | Menu drawer and its backdrop |
| `layer-dialog` (60) | Lightbox or admin modal and its backdrop |

These values express a controlled hierarchy, not permission for arbitrary high z-index values. Focus indicators remain visible in their active layer. Decorative fragments must not intercept controls, and overlays must not compete for attention.

## 30. Source-of-Truth Rules and Review Boundary

After approval, `PROJECT_CONTEXT.md` controls **what** the product is and `DESIGN.md` controls **how it should look and feel**. Product-context requirements win if visual decisions conflict. This document does not add public chapters, visitor features, editing freedom, or publishing steps.

No conflict with the approved context is intended. The letter retains its neutral reading surface inside the Day → Night narrative; global presets change public atmosphere while the admin stays practical; cinematic desktop behavior has accessible vertical/static alternatives.

Remaining genuine ambiguities are the exact The Diamond reference URL and the persistence/lifetime definition of first versus repeat visits. Neither blocks this specification. Specific scene geometry, material parameters, asset selection, capability thresholds, and implementation/testing rules remain for later approved work rather than being invented here.

This phase creates **DESIGN.md only**. Existing application code, `PROJECT_CONTEXT.md`, configuration, dependencies, migrations, and assets remain unchanged. `SKILLS_INSTALL.md` is absent and is not recreated. No `AGENTS.md`, implementation plan, feature branch, components, heart asset, or animation implementation is created.

**Stop after review. Wait for explicit approval before Phase 3.**
