# TableLens

TableLens is a static WebAR restaurant menu and, as of this phase, a Python-powered static-site compiler and asset pipeline. Developers edit structured source files (`tablelens.config.yaml` and `menu.yaml`) and run one command:

```bash
tablelens build
```

The compiler validates the restaurant data, optimizes assets, generates frontend data, produces QR codes, and emits a production-ready `dist/` folder without requiring manual edits to `menu-data.js`.

## Architecture

```text
tablelens/
├── compiler/              # Python CLI, schemas, pipeline, plugin hooks
│   ├── cli/               # Typer command modules and app entrypoint
│   ├── core/              # IO, cache, reporting helpers
│   ├── pipeline/          # build, validation, image, model, QR stages
│   ├── plugins/           # lightweight future extension contracts
│   └── schemas/           # strict Pydantic config and menu schemas
├── engine/                # Existing Phase 2 Three.js experience layer
├── assets/                # Source images, models, and QR placeholders
├── generated/             # Generated source artifacts, including menu-data.js
├── dist/                  # Production build output
├── docs/                  # Developer architecture notes
├── tests/                 # Pytest coverage for schemas, CLI, and builds
├── tablelens.config.yaml  # Project configuration
├── menu.yaml              # Structured restaurant menu source
└── pyproject.toml         # Python package metadata and tablelens executable
```

Existing Phase 1 and Phase 2 frontend files remain intact. The compiler builds on top of them by copying the static experience into `dist/` and replacing the old manual menu-data workflow with generated data.

## Developer Pipeline

1. Edit `tablelens.config.yaml` for restaurant metadata, theme, assets, output folders, PWA/AR settings, QR targets, validation limits, and quality presets.
2. Edit `menu.yaml` or `menu.json` for categories and dishes.
3. Add source images to `assets/images/` and models to `assets/models/`.
4. Run `tablelens validate`.
5. Run `tablelens build`.
6. Deploy the generated `dist/` directory.

## Build Flow

```text
Discover
  -> load tablelens.config.yaml and menu.yaml/json
Validate
  -> strict Pydantic schemas plus asset reference checks
Optimize
  -> resize, compress, and thumbnail supported images
Generate
  -> generated/menu-data.js and QR PNG/SVG files
Compile
  -> copy existing static frontend and engine files
Copy assets
  -> copy models and optimized images into dist/assets
Emit
  -> write dist/menu-data.js and summary report
```

Failures in validation stop later build stages. User mistakes are reported through Rich tables and concise messages rather than Python stack traces.

## CLI Reference

| Command | Purpose |
| --- | --- |
| `tablelens init` | Create starter project files when missing. |
| `tablelens validate` | Validate configuration, menu schema, references, prices, colors, and assets. |
| `tablelens build` | Run the complete production build pipeline. |
| `tablelens clean` | Safely remove build output and cache. |
| `tablelens doctor` | Check required project files and local health. |
| `tablelens audit` | Run validation and model audit reports together. |
| `tablelens optimize-images` | Resize, compress, and thumbnail supported image files. |
| `tablelens validate-models` | Check GLB/USDZ references, naming, duplicates, and existence. |
| `tablelens generate-qr` | Generate PNG and SVG QR codes for configured targets. |
| `tablelens manifest` | Print generated output locations. |
| `tablelens stats` | Print dish, category, and output statistics. |
| `tablelens version` | Print compiler version. |
| `tablelens help` / `tablelens --help` | Show command help from Typer. |

## Configuration

`tablelens.config.yaml` supports:

- `restaurant`: name, tagline, location label, ISO-like currency code, display symbol, theme, demo note.
- `theme`: theme id and validated hex colors.
- `assets`: source image/model/QR/generated folders.
- `output`: production build folder, default `dist`.
- `compression`: image quality, max image width, thumbnail width.
- `pwa`: PWA feature toggle for future expansion.
- `ar`: GLB/USDZ required flags.
- `qr`: base URL and targets.
- `validation`: max image/model sizes and strict asset behavior.

## Data Source and Generated Files

Developers should not manually edit `menu-data.js`. The source of truth is now `menu.yaml` or `menu.json`.

Generated files:

- `generated/menu-data.js`: source-side generated JavaScript constants for inspection and tooling.
- `dist/menu-data.js`: production JavaScript consumed by the existing frontend.
- `dist/assets/images/*`: optimized full-size image copies.
- `dist/assets/thumbnails/*`: generated thumbnails.
- `dist/assets/models/*`: copied model assets.
- `dist/assets/qr/*.png`: QR code bitmaps.
- `dist/assets/qr/*.svg`: QR code vectors.

## Validation Rules

Schema validation checks:

- Restaurant name is present.
- Currency is one of `INR`, `USD`, `EUR`, `GBP`, `JPY`, `CAD`, or `AUD`.
- Theme colors and dish accent colors are valid hex colors.
- Menu is not empty.
- Dish IDs are unique and URL-safe lowercase slugs.
- Dish names and descriptions are present.
- Prices are non-negative.
- Category references are valid when categories are declared.
- Image, GLB, and USDZ references are checked for existence.
- Image and model files are checked against configured size limits.
- Duplicate model references are reported.
- Model extensions must match `.glb` and `.usdz`.
- Local asset references are validated; external URLs are not executed.

With `validation.strictAssets: false`, missing demo assets are warnings so placeholder-only development remains possible. With strict mode enabled, missing required AR assets fail validation.

## Asset Rules

- Images: `.jpg`, `.jpeg`, `.png`, and `.webp` are supported by the optimizer. WebP/AVIF expansion is reserved in the pipeline design.
- Models: GLB is used for browser/Android, USDZ for iOS Quick Look.
- QR: configured targets produce both PNG and SVG where practical.
- Output writes are protected so the compiler refuses to write outside the project root.

## Performance Considerations

- The build cache stores SHA-256 hashes in `.tablelens-cache/hashes.json` and skips unchanged image optimization when outputs already exist.
- Pipeline stages are isolated so independent stages can be parallelized later.
- Validation avoids executing project files and uses direct structured data parsing.
- Filesystem scans are limited to configured asset folders rather than broad repository walks.

## Plugin Extension Points

`compiler/plugins/hooks.py` defines a minimal plugin protocol and manager. Future plugins can observe stages for analytics, cloud sync, CDN deployment, invoices, AI menu generation, Blender integration, localization, versioning, theme marketplaces, or restaurant dashboards. No external project plugins are executed in this phase.

- Phase 2: replace placeholders with optimized real food images and mobile-ready GLB/USDZ assets.
- Phase 2: add QR artwork and restaurant-specific theming options.
- Phase 2: add stronger local validation for model availability and asset sizes.
- Phase 3: consider a lightweight content pipeline only if static editing becomes limiting.
