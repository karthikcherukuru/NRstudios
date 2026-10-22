# Image provenance

## New editorial assets — 23 October 2026

Both assets were generated during this redesign with the built-in `image_gen` tool, visually inspected, copied into the repository, and encoded locally as WebP using Sharp. Original PNGs are preserved under `assets/generated/`. Complete prompts and reference paths are in `docs/editorial-image-prompts.json`.

| Web asset | Dimensions | Size | Use |
| --- | --- | --- | --- |
| `public/images/heritage-editorial.webp` | 1536 × 1024 | 191,542 bytes | Fictional Indian heritage courtyard, architectural editorial |
| `public/images/textile-detail.webp` | 1536 × 1024 | 377,326 bytes | Wine silk and antique-gold zari editorial detail |

`textile-detail.webp` used the existing `wine-portrait.webp` as its visual reference. The wine silk, gold buti, and temple-style border were retained at the level of an editorial interpretation. Generated micro-patterns should not be treated as exact product specifications. Keep the existing original drape/portrait pair as the primary product imagery.

The courtyard is a generated concept image, not a documented NR Studios property, workshop, or actual location. Neither image proves a manufacturing process, historical brand claim, material certification, or availability of physical goods.

## Existing assets

Seven coordinated hanging-drape and model-portrait pairs, plus brass rack imagery, were already present at the start of the redesign. They are preserved. `assets/originals/` contains source PNGs, and `docs/image-prompts.json` contains the pre-existing prompts that describe built-in image generation. Their generation was not performed in the present redesign, and no new claims about provenance are implied.

## Logo

No original logo image or vector file was present in the supplied repository. The existing `src/components/brand-mark.tsx` renders the NR/Studios typographic mark when `brand.logo` is null. Preserve this recognizable fallback; an owner-supplied official logo can replace it through `src/lib/collection.ts` without inventing a new logo.

## Publication notes

The sample catalogue and editorial imagery represent a portfolio concept. Replace with approved product photography and verified product information before selling actual merchandise. Do not label fictional testimonials as verified customer reviews.
