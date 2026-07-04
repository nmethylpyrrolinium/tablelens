# TableLens

TableLens is a hard-coded static WebAR cafe menu demo with browser 3D previews and AR launch support.

## What it does

- Opens as a static mobile-first website from a QR code or link.
- Shows a premium cafe-style landing page.
- Renders a hard-coded menu from `menu-data.js`.
- Filters dishes by category without reloading.
- Opens dish detail pages with `dish.html?id=<dish-id>`.
- Wires dish model paths into Google's `<model-viewer>` component.
- Keeps non-AR and missing-asset states usable with helper text and fallbacks.

## Demo flow

1. Open `index.html`.
2. Tap **Open Demo Menu** to visit `menu.html`.
3. Filter the menu or tap a dish card.
4. `dish.html` reads the `id` query parameter and renders the matching dish.
5. The 3D stage loads the dish GLB and USDZ paths into `<model-viewer>`.
6. Supported phones can use the model-viewer AR button to launch AR.

## Tech stack

- HTML
- CSS
- Vanilla JavaScript
- Google `<model-viewer>` web component
- Static assets and relative paths for GitHub Pages

No backend, database, login, framework, build step, analytics, or ordering system is included in Phase 1.

## File structure

```text
tablelens/
├── index.html
├── menu.html
├── dish.html
├── style.css
├── script.js
├── menu-data.js
├── manifest.json
├── README.md
└── assets/
    ├── images/
    │   ├── burger.jpg
    │   ├── iced-coffee.jpg
    │   └── chocolate-dessert.jpg
    ├── models/
    │   ├── burger.glb
    │   ├── burger.usdz
    │   ├── iced-coffee.glb
    │   ├── iced-coffee.usdz
    │   ├── chocolate-dessert.glb
    │   └── chocolate-dessert.usdz
    └── qr/
        └── tablelens-demo-qr.png
```

The Phase 1 code references the asset paths above. Binary demo assets are not committed here; the UI uses CSS image placeholders and a model-viewer error fallback when files are unavailable or invalid.

## How menu data works

`menu-data.js` exposes two editable constants:

- `RESTAURANT`: demo restaurant metadata such as name, tagline, currency, theme, and note.
- `MENU`: exactly three Phase 1 dish objects.

Each dish includes `id`, `name`, `category`, `price`, `type`, `spice`, `description`, `tags`, `portionNote`, `image`, `modelGlb`, `modelUsdz`, and `accent`.

`script.js` reads this data and renders the menu and dish pages. Cards are not hard-coded in HTML.

## How to add a dish

1. Add a new object to the `MENU` array in `menu-data.js`.
2. Give it a unique URL-safe `id`.
3. Add image, GLB, and USDZ asset paths.
4. Place the image in `assets/images/`.
5. Place the `.glb` and `.usdz` files in `assets/models/`.
6. Open `dish.html?id=<your-id>` to verify the detail page.

If a category is new, the filter rail will include it automatically. The Phase 1 demo categories `All`, `Burgers`, `Drinks`, and `Desserts` always remain available.

## How 3D/AR works

The dish page loads:

```html
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
```

For each dish, JavaScript creates a `<model-viewer>` element and assigns:

- `src` from `dish.modelGlb` for web and Android 3D/Scene Viewer paths.
- `ios-src` from `dish.modelUsdz` for iOS Quick Look.
- `ar` to enable AR launch behavior.
- `ar-modes="webxr scene-viewer quick-look"` for WebXR, Android Scene Viewer, and iOS Quick Look support.
- `camera-controls`, `auto-rotate`, `shadow-intensity`, `exposure`, and `ar-scale="fixed"` for the Phase 1 viewing experience.

AR support depends on the device, browser, OS, model validity, and deployment context. WebXR AR requires HTTPS. GitHub Pages is suitable because it serves sites over HTTPS.

## Asset requirements

Recommended production assets:

- Optimized JPG or WebP food images with matching committed `.jpg` paths or updated data paths.
- Valid GLB models for browser viewing and Android.
- Valid USDZ models for iOS Quick Look.
- A generated QR PNG that points to the deployed GitHub Pages URL.

Keep models compressed and mobile-friendly. Do not commit very large binary files unless they are intentionally optimized for the demo.

## GitHub Pages deployment

1. Commit the static files to a GitHub repository.
2. In repository settings, enable GitHub Pages for the target branch and root folder.
3. Open the HTTPS GitHub Pages URL.
4. Generate a QR code that points to that URL and save it as `assets/qr/tablelens-demo-qr.png` if needed.
5. Test AR on real supported devices over HTTPS.

All internal links use relative paths, so the site works under a GitHub Pages project subpath.

## Limitations

- Phase 1 has no backend, database, dashboard, ordering flow, authentication, payments, or analytics.
- The demo includes only three hard-coded dishes.
- Placeholder handling is used until real image and 3D model binaries are added.
- Desktop browsers usually show the 3D viewer but may not support AR.
- AR was not validated on a physical phone in this repository setup.

## Phase roadmap

- Phase 2: replace placeholders with optimized real food images and mobile-ready GLB/USDZ assets.
- Phase 2: add QR artwork and restaurant-specific theming options.
- Phase 2: add stronger local validation for model availability and asset sizes.
- Phase 3: consider a lightweight content pipeline only if static editing becomes limiting.
