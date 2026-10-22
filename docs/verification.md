# Verification record

Implementation environment: Windows, Node 24.12.0, Next 16.4.2.

## Executed successfully

- ESLint, including Next accessibility and React hook rules: no errors or warnings.
- TypeScript strict type checking: passed.
- Next production build: compiled, type checked, and statically prerendered `/` and `/_not-found`.
- Development server: HTTP 200 at http://127.0.0.1:3000, using `npm run dev:in-process` because the standard CLI's child-process fork is denied by this host.
- Production server: HTTP 200 at http://127.0.0.1:3001.
- Four gesture tests: snapping at mobile and desktop spacing; fresh vs stale velocity; selection bounds after extreme swipes; symmetrical edge resistance.
- HTTP/asset integration: hero server rendering contains seven garments; all fifteen local WebP images return HTTP 200 and decode; all seven CSS silhouettes are valid; all portraits are at least 1000 px tall; the brass rail retains transparency; Next's image optimizer returns HTTP 200. All image derivatives together total 1.56 MiB.
- The original generated image contact sheet was visually inspected. Seven coordinated product/portrait pairs and the transparent brass rail are retained locally.

## Browser checks blocked by the host

`npm run test:e2e -- --project=desktop` discovered six tests, then failed before execution because Playwright's worker fork returned `spawn EPERM`. Direct browser launch also returned `spawn EPERM`. A hidden installed-browser attempt could expose its debugging port but crashed its rendering process with Windows `Access is denied`; no usable page screenshot was produced. Automatic approval review rejected further browser-launch attempts because sandbox approval is disabled.

Consequently, the supplied browser tests have **not passed**, and desktop/mobile visual QA, native swipe behavior, real focus behavior, Safari behavior, Lighthouse, and measured Core Web Vitals remain unverified. No claim of device-tested performance is made.

Run `npx playwright install chromium webkit` and `npm run test:e2e` in a normal terminal to execute the supplied coverage. The suite exercises mobile widths from 360 px, responsive overflow, image decode, mouse drag, native CDP touch input, vertical gesture intent, keyboard navigation, focus containment/restoration, reduced motion, rapid interruption, and local saved selections.

## Known scope limits

- No source logo existed in the workspace. A temporary typographic wordmark is used; replacement is centralized in `src/lib/collection.ts`.
- The imagery is generated concept artwork. Matching colour and major motifs does not guarantee the exact weave or repeat of a real inventory SKU.
- Unfolding is an animated five-panel texture approximation, not a physically simulated cloth mesh.
- The CTA reveals design information and can save a selection on the device. Checkout, appointments, stock, pricing, and external contact actions are outside this hero-only build.
