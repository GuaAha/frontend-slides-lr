# Frontend Slides LR — fixed-brand internal edition

This fork packages a single-brand internal presentation Skill derived from `zarazhangrui/frontend-slides`.

The active product contract is intentionally narrow:

- one brand source: `brand/source.json`;
- one fixed canvas: every page is exactly `750 × 1320` CSS pixels;
- one generated Runtime for scaling, keyboard/click/touch navigation, page count, editing, autosave, HTML save, and print;
- one nine-step workflow from content ingestion to editing/export;
- three real visual previews selected from one unified set of seven design-and-structure baselines while preserving one fixed palette;
- one browser Studio with ten registered layouts, constrained editing, version history, automatic repair, PDF/PPTX export, speaker notes, and timing;
- generated brand rules and a synchronized Claude Code plugin mirror;
- CI checks for source/derived drift and stale canvas rules.

The seven peer baselines live under `templates/`. They shape composition, pacing, evidence structure, and component grammar while `brand/source.json` remains the only brand authority.

## Brand status

The checked-in brand source remains `draft` until the owner explicitly promotes it. Draft tokens are suitable for pipeline development and internal prototypes.

Product-detail pages do not render a separately authored brand logo. Every run records a user-selected `light` or `dark` tone before preview generation. When no content images are supplied, the user may choose self-contained CSS visuals or geometry-matched image placeholders; supplied or explicitly authorized images may be processed and rectangularly cropped while originals are preserved.

## Develop

Edit only `brand/source.json` for brand-token changes, then run:

```bash
python scripts/sync-brand.py
python scripts/sync-brand.py --check
python -m unittest discover -s tests -v
npm ci
npx playwright install chromium
npm run validate:runtime
npm run validate:rendered
```

Run the visual Studio locally with:

```bash
npm run dev
```

The Studio implements the staged product path in one modular browser application:

- v0.1: content upload, purpose/density selection, automatic outline confirmation, DeckSpec plus JSON Schema, ten registered layouts, three real-content visual proposals, fixed 750 × 1320 rendering, DOM validation, and print/PDF export;
- v0.2: constrained text and image editing, image focal point and fit, page split/layout switch, local version history, and up to three automatic-repair passes;
- v0.3: editable PptxGenJS export with post-export package checks, presenter notes, next-slide preview, and timer.

Use these verification commands before release:

```bash
npm run build
npm run test:studio
npm run test:e2e
npm run export:pdf
```

Existing-PPTX modification, complex charts, realtime collaboration, multi-agent orchestration, and a free canvas remain explicit future extensions rather than hidden partial implementations.

Image inputs are intentionally restricted to embedded PNG, JPEG, or WebP data. This keeps decks self-contained, avoids CORS-dependent export, and prevents PptxGenJS's transitive image parser from receiving unsupported ICNS, JXL, or HEIF files.

### Studio architecture

- `studio/src/core.js` owns DeckSpec, content-to-outline parsing, proposal sequencing, and the ten-layout registry.
- `studio/src/renderer.js` is the single DOM renderer used by the editor, thumbnails, print output, validation, presenter view, and PPTX measurement.
- `studio/src/validator.js` combines schema/registry checks with real DOM bounds, scroll overflow, overlap, typography, orphan-line, density, and image-role checks; automatic repair is capped at three passes.
- `studio/src/store.js` keeps the current session and up to 24 snapshots in localStorage without introducing a backend.
- `studio/src/pptx.js` converts measured DOM objects to editable OOXML with PptxGenJS, then reopens the ZIP to verify slide size, page count, notes, editable objects, and object bounds.

The user flow is fixed: upload content → choose purpose and density → apply the embedded brand → confirm the generated outline → inspect three real-content proposals → select one → edit the complete deck → validate/repair → present or export.

Validate an explicitly acknowledged prototype deck with:

```bash
python scripts/validate-html.py path/to/deck.html --allow-draft-brand
```

## Install

The root is a standalone Skill. The synchronized Claude Code package remains under `plugins/frontend-slides/skills/frontend-slides/` for compatibility with the forked repository layout.
