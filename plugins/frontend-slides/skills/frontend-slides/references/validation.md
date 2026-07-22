# Validation gates

Treat validation as a release gate, not a suggestion.

## Markdown content-integrity gate

When Markdown is the declared content source, complete this gate before static or rendered validation:

1. Record the source slice count from explicit author-defined page/slide separators or top-level numbered content units. When boundaries are ambiguous, obtain user confirmation before generation.
2. Maintain a one-to-one source-slice-to-slide copy ledger. Subordinate headings, bullets, tables, captions, and footnotes remain attached to their parent slice unless the user explicitly defined another boundary.
3. Require the final `.slide` count to equal the approved Markdown slice count.
4. Verify every authored slide string—including headlines, body copy, labels, data annotations, image captions, footnotes, and calls to action—against the source ledger. Styling and line breaks may change; source wording may not.
5. Fail the run for invented, paraphrased, summarized, expanded, silently corrected, or otherwise unsupported copy; for an unapproved omission; or for a merged/split source slice.
6. If an additional slide is needed, stop before changing the deck. Report the affected slice, reason, proposed added count, and exact remapping action, then wait for explicit user approval.

Runtime controls outside the authored slide canvas are product UI, not slide copy, but they must not introduce visible deck content.

## Static gate

Run `python scripts/validate-html.py <deck.html>` for an approved brand deck. Add `--allow-draft-brand` only when the user has accepted a prototype using draft tokens.

Require:

- exactly one `.deck-viewport` and one `.deck-stage`;
- at least one `.slide`;
- literal `750px` width and `1320px` height in the inlined stage rules;
- embedded brand status matching `brand/source.json`;
- no stale landscape-canvas, aspect-ratio, or alternative-stage language;
- no external script, stylesheet, font, image, video, or audio source;
- no visible workflow labels or internal file paths.
- no non-zero CSS `border-radius` on authored text/container layers, graphic layers, or image-mask layers;
- do not inspect or reject geometry baked into approved raster/vector asset content;
- treat `border-radius` applied to `<img>`, `<picture>`, or an image-cropping wrapper as an authored image mask, not as exempt image content.

## Rendered gate

Install Playwright and Chromium once if they are unavailable, then run:

```bash
node scripts/validate-rendered.mjs path/to/deck.html --screenshots .frontend-slides/validation
```

The rendered validator checks every slide at `750 × 1320`. Review its failures and screenshots:

1. Every slide bounding box is exactly the authored canvas.
2. Text and media stay inside the slide and their intended container.
3. Text blocks do not overlap unless the composition explicitly marks the overlap decorative.
4. No content is hidden only because an ancestor uses `overflow: hidden`.
5. Approved fonts load; fallback use is a warning for prototypes and a failure for final delivery.
6. Local images and logos resolve without network access.
7. Keyboard, touch, reduced-motion, inline editing, autosave, and file save work.
8. Computed border radii remain zero on authored slide elements. The rendered gate does not inspect curves contained inside image pixels.

Use `data-allow-bleed` only for decorative elements intentionally extending beyond the slide. Use `data-allow-overlap` only for intentional text or panel overlaps. Never add these attributes merely to silence an unexplained failure.

Fix all failures, rerun both gates, and keep screenshots or logs with the run when the task is long-lived.
