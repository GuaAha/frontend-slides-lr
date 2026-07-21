# Frontend Slides LR — fixed-brand internal edition

This fork packages a single-brand internal presentation Skill derived from `zarazhangrui/frontend-slides`.

The active product contract is intentionally narrow:

- one brand source: `brand/source.json`;
- one fixed canvas: `750 × 1320`;
- one nine-step workflow from content ingestion to editing/export;
- three real visual previews that vary layout, not brand identity;
- generated brand rules and a synchronized Claude Code plugin mirror;
- CI checks for source/derived drift and stale canvas rules.

The inherited bold template library remains in the repository as upstream reference material, but the internal Skill does not load it or treat it as a brand source.

## Brand status

The checked-in brand source is currently `draft` because approved logos and font files were not present in the working materials. Draft tokens are suitable for pipeline development and prototypes. Set `approval_status` to `approved` only after the real brand package is installed and verified.

## Develop

Edit only `brand/source.json` for brand changes, then run:

```bash
python scripts/sync-brand.py
python scripts/sync-brand.py --check
python -m unittest discover -s tests -v
npm ci
npx playwright install chromium
npm run validate:rendered
```

Validate an explicitly acknowledged prototype deck with:

```bash
python scripts/validate-html.py path/to/deck.html --allow-draft-brand
```

## Install

The root is a standalone Skill. The synchronized Claude Code package remains under `plugins/frontend-slides/skills/frontend-slides/` for compatibility with the forked repository layout.
