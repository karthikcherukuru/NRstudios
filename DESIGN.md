# NR Studios visual direction

Reading: a luxury Indian fashion editorial for saree collectors. A physical boutique installation anchors the experience. Design variance 7, motion intensity 6, visual density 3.

The user's requested warm ivory (#f4f0e8), antique brass (#8c7350), and charcoal (#302d29) provide a quiet room for the seven textile colours. Cormorant Garamond's high-contrast forms and gentle italic reference Indian fashion editorials; Manrope supplies restrained interface labels. The theme deliberately stays light, as specified in the brief.

Desktop: asymmetric editorial introduction on the left, seven-piece rail on the right. Mobile: centered introduction followed by a cropped physical rack, visible neighboring textiles, selection information, swatches, and navigation controls. No product cards, gradients, frosted surfaces, or simulated commerce.

Motion communicates material, selection, and state. Nested wrappers separate ambient fabric sway from gesture-driven rotation. The rail translates as one composite. The reveal uses five masked pieces of the same garment asset and one reversible GSAP timeline. The editorial portrait is drawn from the same generated diptych as the hanging product. This is a lightweight 2.5D fold approximation, not a cloth simulation.

Z-order: room 0; active fabric 1; navigation 2; native dialogs in the browser top layer. All modal transitions honor reduced motion. No scroll hijacking; vertical gestures and pinch zoom remain available.
