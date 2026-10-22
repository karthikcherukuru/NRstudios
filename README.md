# NR Studios / The Heirloom Edit

A single interactive saree hero built with Next.js App Router, React, TypeScript, Tailwind CSS 4, and GSAP. Seven generated silk designs hang from a generated antique brass rail. No Three.js runtime, external image service, commerce backend, or additional website pages.

## Run

```sh
npm ci
npm run dev
```

Open http://localhost:3000. On restricted Windows hosts that deny the standard Next CLI child-process fork, use `npm run dev:in-process`. This starts the same Next development server directly, with the required development environment flags. Production: `npm run build && npm start`.

## Interaction

- Touch swipe / mouse drag: Pointer Events, axis intent detection, pointer capture, elastic edge resistance, velocity projection, and animated snapping. Continuous position lives in refs and GSAP, outside React renders.
- Tap / click: five textured fabric panels travel forward, fan apart, then dissolve into that design's corresponding editorial portrait. Slow portrait decoding holds the transition before the photograph fades in.
- Close / Escape: reverses the existing GSAP timeline, including an interrupted opening. The native dialog contains keyboard focus and makes the background inert. Scroll position is reset before reversing; focus returns to the garment.
- Arrow keys, Home, End: browse the rack. Enter / Space opens the focused garment. Colour selectors and previous / next buttons provide alternatives to dragging.
- Explore this saree: opens design details. Save to my edit persists selection locally when storage is available; no data is sent externally.
- Reduced motion: no fabric sway or travel animation; dialogs open and close immediately. Touch allows vertical page scrolling and pinch zoom. Safe-area padding supports mobile displays.

## Assets and brand

`assets/originals/` contains eight original images generated using the built-in image generation capability: seven matched product/portrait diptychs and one transparent brass stand. `docs/image-prompts.json` records the exact prompts. `public/images/` contains fifteen local WebP production derivatives. `scripts/prepare-assets.mjs` reproducibly crops and compresses the originals and calculates CSS product silhouettes. No remote image dependencies are required.

These are generated concept designs, not verified inventory photographs. Their names, descriptions, and collection copy are editorial concepts. Product and portrait pairs share a colour and motif direction, but generative imagery is not a guarantee of exact commercial textile pattern fidelity. Replace each pair with approved photography before selling a real SKU.

No NR Studios logo was supplied in the empty workspace. The header currently uses a temporary typographic NR wordmark. Add the real asset to `public/` and set `brand.logo` in `src/lib/collection.ts`. The same setting updates both header and portrait views. Search indexing is disabled until the concept assets and brand identity are approved.

Fonts are self-hosted from the installed Cormorant Garamond and Manrope packages. The GSAP 3.13.0 runtime in `vendor/gsap` is the unmodified official distribution retrieved from jsDelivr because npm network access was restricted. Its original license notice is preserved; the local package also contains official core type declarations. See https://gsap.com/standard-license/.

## Structure

- `src/components/saree-hero.tsx`: single hero, collection selection, navigation overlays.
- `src/components/saree-rack.tsx`: physical installation, gesture ownership, hover feedback.
- `src/components/saree-reveal.tsx`: native dialog, reversible timeline, editorial details.
- `src/components/fabric.tsx`: shared masked fabric rendering.
- `src/lib/collection.ts`: design content and logo configuration.
- `src/lib/gesture.ts`: tested edge resistance and release projection.
- `src/app/globals.css`: mobile-first layout, material styling, ambient motion.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run test:assets
npm run build
npm run test:e2e
```

The Playwright suite covers widths 360–1440, image loading, drag, native touch swipe, vertical gesture intent, keyboard browsing, focus containment/restoration, interrupted transitions, details, persistence, and reduced motion. Install its browser binaries with `npx playwright install chromium webkit` on a host that permits browser processes. Run against an existing server with `BASE_URL` if needed.

See `docs/verification.md` for which checks were actually run in the implementation environment. Do not interpret supplied browser tests as passing tests until they have executed successfully.
