# NR Studios visual system

## Direction

Modern Indian royal heritage meets contemporary luxury fashion. A warm, sunlit atelier with a physical brass rack, expressive silk colour, and fashion editorial proportions. Design variance 7, motion intensity 6, visual density 3.

## Colour

The supplied palette is authoritative: royal midnight navy `#101B3A`, heritage crimson `#B5122B`, warm heritage ivory `#E7D7B8`. Derived paper `#F3EBDD`, surface `#EBDDC5`, muted text `#655F59`, rules `#CBBEA8`, brass `#806138`. Crimson guides attention; navy anchors type and navigation. Photography provides secondary colours.

## Typography and identity

Retain self-hosted Cormorant Garamond and Manrope. Cormorant's calligraphic contrast suits the existing NR monogram and silk editorial. Manrope keeps shopping controls readable. Decorative Devanagari faces were considered; readable Latin product information takes priority. Body 13–14px, mobile shopping fields 16px, display 48–112px responsively. Preserve the NR monogram. There is no supplied original logo file; `brand.logo` in `src/lib/collection.ts` is the replacement point.

## Layout

Transparent header in normal document flow; centred mark; catalog/story/contact/bag destinations. Home: signature rack, staggered portraits, architectural story, colour journal, honest space for future customer stories. Catalog: unboxed grid and search/category/sort. Product: matching portrait and textile details with clear bag controls. Generous whitespace and fine rules.

## Motion

GSAP controls the rack and seven coordinated folding strips. Garments remain fixed to hangers during navigation, bounded by the rod. A selected garment advances, deliberately detaches, then unfolds through masked panels into the product route. A native dialog owns focus and escapes clipping. Interruptions cancel or reverse one timeline. Pointer motion uses refs. Reduced motion takes a direct route. Progressive scroll reveals leave content available without JavaScript.

## Assets and truthfulness

Seven matched drape/portrait pairs remain primary product imagery. Newly generated courtyard and wine-silk detail support the editorial; see `docs/assets.md`. Specs/prices are samples, contact drafts stay on this device, payment is unconfigured. No invented reviews, artisan partnerships, certifications, stock, shipping promises or brand history.

## Accessibility

Semantic controls, focus indicators, skip link, native dialogs, announced cart/form updates, keyboard rack navigation, touch intent locking, vertical scroll and pinch zoom. Verify 360/390/430/768/1024/1440px, real CDP touch, route/back behavior, persistence, validation, lint, TypeScript and production build. Record measured evidence rather than assuming device performance.
