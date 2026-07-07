# TableLens Phase 2 Performance Report

## Optimization strategy

- Uses one shared `TimingSystem` requestAnimationFrame loop instead of per-component loops.
- Pauses frame subscribers when the tab is hidden with the Page Visibility API.
- Caps device pixel ratio through `QualityManager`, using a lower mobile cap and lowering quality when sustained FPS drops.
- Keeps the landing WebGL scene procedural: cylinders, boxes, lights, fog, and a single `Points` particle draw call.
- Uses `ResizeObserver` to resize the renderer without polling or layout-heavy animation work.
- Uses transform, opacity, and CSS custom properties for card motion; card physics never mutates layout properties.
- Respects `prefers-reduced-motion` by skipping WebGL startup, particle motion, camera drift, and card physics.

## FPS optimization notes

- Desktop target: 60 FPS with DPR capped to 2.
- Mobile target: stable interaction with DPR capped to 1.5 and particle count scaled down.
- Particle budget is adaptive through `particleScale`; particles share one `BufferGeometry` and `PointsMaterial`.
- Expensive systems initialize lazily only when their host elements exist, so menu and dish pages do not create the landing scene.

## Acceptance coverage

- Landing page has a real Three.js tabletop scene.
- Camera, pointer, particles, and lighting are driven by the shared engine loop.
- Menu and related cards use delta-time spring interpolation.
- GitHub Pages compatibility is preserved because all code is static HTML/CSS/JS with CDN Three.js imports.
- Existing `model-viewer` AR wiring is untouched on the dish page.
