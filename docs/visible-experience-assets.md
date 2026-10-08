# Visible experience assets

No source code or asset from The Diamonds is used by this implementation. Reference screenshots are local study evidence only, outside the committed application assets.

## Original clouds

Generated on 2026-10-08 with the built-in image-generation tool, with transparent background enabled. The original RGBA PNG is preserved as `frontend/public/atmosphere/cloud-bank.png`. Chromium Canvas exports preserve its alpha in the 1536px desktop WebP (254,270 bytes) and 768px mobile WebP (77,252 bytes). These are compression/resizing derivatives, not artistic edits.

Final generation prompt:

> Create an ORIGINAL website compositing asset: a wide horizontal bank of luminous photorealistic cumulus clouds floating in isolation on a genuinely transparent background. Pearl white and warm ivory sunlit tops, very soft pale lavender and soft lilac shading underneath, dreamy elegant volumetric photographic studio lighting, delicate wispy edges. Cloud mass across lower two thirds of canvas, gently irregular sculpted billows, lots of transparent air above and around, full cloud edges fit within image frame. Premium atmospheric, realistic soft water vapor texture and light scattering, restrained contrast. No sky, no ground, no text, no hearts, no symbols, no icons, no cartoon, no storm, no neon. Intended as reusable cloud bank for three DOM depth layers around a real Three.js crystal heart; not a complete hero screenshot. Wide 3:2 composition.

`frontend/scripts/prepare-assets.mjs` reproduces the WebP exports and downloads the open-license fonts. It requires network access only for fonts/licenses and uses installed Playwright; no package was added.

## Fonts

Cormorant Garamond and Inter normal variable weights 400–600 are self-hosted as Latin WOFF2 files, with `font-display: swap` and readable system fallbacks. Source: [Google Fonts](https://fonts.google.com/). Font licenses are stored alongside the files in `frontend/public/fonts/` ([Cormorant Garamond license](https://github.com/google/fonts/blob/main/ofl/cormorantgaramond/OFL.txt), [Inter license](https://github.com/rsms/inter/blob/master/LICENSE.txt)). Other scripts may use font fallback; the first slice's English/Tagalog/Taglish demo uses Latin text.

## Heart

The primary object is a code-generated closed heart lens: cubic outline, concentric depth rings and indexed front/back triangles. It is not downloaded. The lightweight SVG used only for loading/failed WebGL is an original faceted heart drawn in code, with the same semantic palette. No external HDR map, model, texture, shader package or cloud package is used.

## Phase 8 refinement

The primary geometry now uses 320 planar triangles with an angled crown and cut bevels, replacing the smooth lens's 1,344 triangles. Existing Drei transmission material refracts the original cloud image through a local buffer: four samples, 512px desktop or 256px mobile, no backside pass, dispersion or animated distortion. A runtime CanvasTexture composites the source alpha over semantic pearl to prevent black transparent-image patches. The owned backdrop and geometry are disposed; the shared loader texture remains cache-owned. No additional public bitmap or dependency is added.

Four separately positioned and masked DOM fragments replace the prior three image layers plus a CSS pseudo-image. Mobile retains three visible fragments. Restrained saturation reduction preserves pearl highlights and lilac shadows without an overall purple filter. Existing original cloud/font provenance and licenses remain unchanged.
