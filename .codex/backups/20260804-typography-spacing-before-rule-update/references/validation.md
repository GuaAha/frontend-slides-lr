# Validation gates

Treat validation as a release gate, not a suggestion.

## Image-source gate

Complete this gate before previews or full-deck generation:

1. Distinguish fixed brand assets declared in `brand/source.json` from content imagery.
2. Record exactly one run-manifest mode: `image_mode: provided`, `image_mode: authorized`, `image_mode: css-visual`, or `image_mode: placeholder`.
3. In provided mode, use only user-supplied image files. In authorized mode, record and stay inside the exact user-approved source scope.
4. When no content images were supplied or authorized, do not browse the web, search local drives, scan unrelated repository folders, inspect previous runs, or substitute discovered imagery. Ask whether the user will provide/authorize images, wants CSS visuals, or wants placeholders.
5. In CSS-visual mode, use only self-contained CSS/SVG atmosphere, geometry, diagrams, textures, and abstract material cues. Do not fabricate product photography, portraits, certificates, test evidence, or other source-dependent imagery.
6. In placeholder mode, use authored placeholder layers that match the final image-frame geometry and no content images. KV placeholders default to a full-bleed `750 × 1320` background. For single-image slides, use either full bleed or a `630px`-wide frame at least `870px` high. Keep placeholders free of invented visible labels unless the approved content source contains the exact label.
7. In provided or authorized mode, resizing, color adjustment, background cleanup, and rectangular cropping are allowed. Preserve the original, save a derived asset, record the transformation and source path, and never add a rounded mask or wrapper.
8. Fail the run when image provenance is missing, when an image falls outside the recorded source scope, or when placeholder/CSS-visual mode contains undeclared content imagery. Fixed brand fonts and declared brand assets are exempt.

## Markdown content-integrity gate

When Markdown is the declared content source, complete this gate before static or rendered validation:

1. Record the source slice count from explicit author-defined page/slide separators or top-level numbered content units. When boundaries are ambiguous, obtain user confirmation before generation.
2. Maintain a one-to-one source-slice-to-slide copy ledger. Subordinate headings, bullets, tables, captions, and footnotes remain attached to their parent slice unless the user explicitly defined another boundary.
3. Require the final `.slide` count to equal the approved Markdown slice count.
4. Verify every authored slide string—including headlines, body copy, labels, data annotations, image captions, footnotes, and calls to action—against the source ledger. Styling and line breaks may change; source wording may not, except that citation markers render without brackets while the ledger retains the original bracketed source.
5. Fail the run for invented, paraphrased, summarized, expanded, silently corrected, or otherwise unsupported copy; for an unapproved omission; or for a merged/split source slice.
6. If an additional slide is needed, stop before changing the deck. Report the affected slice, reason, proposed added count, and exact remapping action, then wait for explicit user approval.
7. Verify citation markers use the locale disclaimer size, contain the original number, and render without `【` or `】`.

Runtime controls outside the authored slide canvas are product UI, not slide copy, but they must not introduce visible deck content.

## Static gate

Run `python scripts/validate-html.py <deck.html>` for an approved brand deck. Add `--allow-draft-brand` only when the user has accepted a prototype using draft tokens.

Require:

- exactly one `.deck-viewport` and one `.deck-stage`;
- at least one `.slide`;
- literal `750px` width in the inlined stage rules;
- exactly one main title per slide, expressed as an `h1` or `data-type-level="headline"` text role;
- `data-slide-kind="kv|content"` and a positive integer `data-slide-height` on every slide; KV height is exactly `1320`, while non-KV height is content-driven and must leave the 120px top and 60px bottom safe margins;
- embedded brand status matching `brand/source.json`;
- one stable ASCII `frontend-slides-deck-id` meta value for deck-scoped autosave;
- no stale landscape-canvas, aspect-ratio, or alternative-stage language;
- no external script, stylesheet, font, image, video, or audio source;
- no visible workflow labels or internal file paths.
- no non-zero CSS `border-radius` on authored text/container layers, graphic layers, or image-mask layers;
- do not inspect or reject geometry baked into approved raster/vector asset content;
- treat `border-radius` applied to `<img>`, `<picture>`, or an image-cropping wrapper as an authored image mask, not as exempt image content.
- a recorded `tone_mode` of exactly `light` or `dark` before preview generation;
- no separately authored brand-logo layer when the run purpose is a product-detail page.

## Runtime gate

Run the browser interaction validator against the completed self-contained HTML:

```bash
node scripts/validate-runtime.mjs path/to/deck.html
```

It verifies that the sole generated runtime owns the fixed-width, active-height stage scaler, keyboard/click/touch navigation, page counter, declared text editing, deck-scoped localStorage autosave, sanitized HTML file save, and print action. An unlocked deck must declare at least one `[data-editable="text"][data-edit-id]` layer. Do not satisfy this gate by adding a second runtime or a separate stage component.

## Rendered gate

Install Playwright and Chromium once if they are unavailable, then run:

```bash
node scripts/validate-rendered.mjs path/to/deck.html --screenshots .frontend-slides/validation
```

The rendered validator checks every slide at a fixed `750px` width and its declared per-slide height. KV slides are `1320px` high; non-KV slides use content-driven heights. To rerun only the slide changed by a minimal fix, use:

```bash
node scripts/validate-rendered.mjs path/to/deck.html --slide <one-based-number> --screenshots .frontend-slides/validation
```

Review failures and screenshots:

1. Every slide bounding box is exactly its authored width and declared height. KV means a cover, key visual, or source-declared KV slide and is exactly 1320px high. A non-KV height ends 60px below its lowest non-bleed content and does not add unexplained empty height.
2. Every authored text leaf stays inside x=60–690, below y=120, and above `slide height - 60px`; media stays inside the slide or carries an intentional bleed marker.
3. Text blocks do not overlap unless the composition explicitly marks the overlap decorative.
4. No content is hidden only because an ancestor uses `overflow: hidden`.
5. Approved fonts load; fallback use is a warning for prototypes and a failure for final delivery.
6. Local images and logos resolve without network access.
7. Require the separate runtime gate to pass; the geometry validator alone does not exercise interaction controls.
8. Computed border radii remain zero on authored slide elements. The rendered gate does not inspect curves contained inside image pixels.
9. Every authored text leaf uses one of the five type sizes defined for its locale. Large metrics and proof numerals use the locale headline or subheadline level and do not receive an exception above the locale headline size.
10. Every authored text leaf resolves to exactly 100% line height and the locale letter spacing from `brand/source.json`; browser `normal`, positive utility-label tracking, and component-specific overrides fail validation.
11. Pure non-Chinese runs declare `lang` so the validator can select the correct locale contract. Mixed Chinese/Latin text defaults to the Chinese contract.
12. Verify KV media or placeholders use a full-bleed `750 × 1320` background by default while authored text remains inside the safe area.
13. Verify single-image slide geometry: the only allowed forms are full bleed or exactly `630px` wide and at least `870px` high.
14. Inventory every authored highlight role and verify one computed highlight color across highlighted text, numerals, rules, borders, and blocks. A second highlight value, alpha variant, or local override fails the gate.
15. No visible line may contain only one Han character or one Han character followed by a punctuation mark. Fix the semantic break, text width, or layout without shrinking the type.

Use `data-allow-bleed` only for decorative elements intentionally extending beyond the slide. Use `data-allow-overlap` only for intentional text or panel overlaps. Never add these attributes merely to silence an unexplained failure.

Any failed item fails validation. Find the matching rule, make the smallest possible change, and rerun the affected slide with `--slide` until it passes. After all focused fixes pass, rerun the full static, runtime, and rendered gates and keep screenshots or logs with the run when the task is long-lived.
