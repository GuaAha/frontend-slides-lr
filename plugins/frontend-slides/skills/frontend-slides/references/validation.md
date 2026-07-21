# Validation gates

Treat validation as a release gate, not a suggestion.

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
- no non-zero CSS `border-radius`; natural curves must come from approved image/vector assets rather than rounded UI containers.

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

Use `data-allow-bleed` only for decorative elements intentionally extending beyond the slide. Use `data-allow-overlap` only for intentional text or panel overlaps. Never add these attributes merely to silence an unexplained failure.

Fix all failures, rerun both gates, and keep screenshots or logs with the run when the task is long-lived.
