# Frontend Slides LR — fixed-brand internal edition

This fork packages a single-brand internal presentation Skill derived from `zarazhangrui/frontend-slides`.

The active product contract is intentionally narrow:

- one brand source: `brand/source.json`;
- one fixed canvas: `750 × 1320`;
- one generated Runtime for scaling, keyboard/click/touch navigation, page count, editing, autosave, HTML save, and print;
- one nine-step workflow from content ingestion to editing/export;
- three real visual previews selected from one unified set of seven design-and-structure baselines;
- generated brand rules and a synchronized Claude Code plugin mirror;
- CI checks for source/derived drift and stale canvas rules.

The seven peer baselines live under `templates/`. They shape composition, pacing, evidence structure, and component grammar while `brand/source.json` remains the only brand authority.

## Brand status

The checked-in brand source remains `draft` until the owner explicitly promotes it. Draft tokens are suitable for pipeline development and internal prototypes.

Product-detail pages do not render a separately authored brand logo. Every run records a user-selected `light` or `dark` tone before preview generation. When no content images are supplied, the user may choose self-contained CSS visuals or square image placeholders; supplied or explicitly authorized images may be processed and rectangularly cropped while originals are preserved.

## Develop

Edit only `brand/source.json` for brand changes, then run:

```bash
python scripts/sync-brand.py
python scripts/sync-brand.py --check
python -m unittest discover -s tests -v
npm ci
npx playwright install chromium
npm run validate:runtime
npm run validate:rendered
```

Validate an explicitly acknowledged prototype deck with:

```bash
python scripts/validate-html.py path/to/deck.html --allow-draft-brand
```

## Install

The root is a standalone Skill. The synchronized Claude Code package remains under `plugins/frontend-slides/skills/frontend-slides/` for compatibility with the forked repository layout.
