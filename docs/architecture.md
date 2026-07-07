# TableLens Phase 2 Engine Architecture

```text
script.js
  ├─ core/TimingSystem.js          single requestAnimationFrame loop, tab visibility pause
  ├─ interaction/PointerSystem.js  normalized pointer state with spring smoothing
  ├─ utilities/QualityManager.js   DPR caps and FPS-adaptive quality hints
  ├─ renderer/WebGLRenderer.js     Three.js renderer, ResizeObserver, render bridge
  │   ├─ scene/TableScene.js       procedural cafe table, lights, fog, objects
  │   │   └─ particles/ParticleField.js  lightweight BufferGeometry dust field
  │   └─ camera/CameraController.js      damped cinematic camera motion
  └─ ui/
      ├─ CardPhysics.js           spring-based menu card tilt, lift, shadow inertia
      └─ ScrollReveals.js         IntersectionObserver section/card reveals
```

The Phase 2 layer is additive: the existing static pages, `menu-data.js` menu rendering, and `model-viewer` AR detail flow remain in place. `script.js` now composes small engine modules and still owns Phase 1 menu/dish rendering logic so GitHub Pages deployment stays static.
