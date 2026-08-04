# Fixed-brand HTML architecture

Generate one self-contained HTML file. Inline the complete contents of `brand/generated/brand-tokens.css`, `viewport-base.css`, and `brand/generated/brand-runtime.js`.

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="frontend-slides-brand-status" content="draft">
  <meta name="frontend-slides-deck-id" content="presentation-slug">
  <title>Presentation title</title>
  <style>
    /* Paste brand/generated/brand-tokens.css here. */
    /* Paste viewport-base.css here. */

    .slide-content {
      position: relative;
      height: 100%;
      padding: var(--brand-slide-padding);
    }

    /* Keep this normalization block after all component CSS. */
    .slide [data-copy-id],
    .slide [data-copy-id] * {
      line-height: var(--brand-line-height);
      letter-spacing: var(--brand-letter-spacing-zh);
    }

    .slide [lang|="en"],
    .slide [lang|="en"] * {
      letter-spacing: var(--brand-letter-spacing-en);
    }

    /* Approved component exceptions: annotation prose is 0px; citation digits keep ordinary 100%. */
    .slide [data-annotation-text],
    .slide [data-annotation-text] * {
      line-height: var(--brand-annotation-line-height);
    }

    .slide [data-citation-marker] {
      line-height: var(--brand-line-height);
    }
  </style>
</head>
<body data-tone-mode="light" data-export-filename="presentation-slug.html">
  <div class="deck-viewport">
    <main class="deck-stage" id="deckStage" aria-live="polite">
      <section class="slide active visible" data-slide="1" data-slide-kind="kv" data-slide-height="1320">
        <div class="slide-content">
          <h1 data-copy-id="slide-01-title" data-editable="text" data-edit-id="slide-01-title">真实演示标题</h1>
        </div>
      </section>
    </main>
  </div>

  <div class="deck-controls" aria-label="Presentation controls"></div>
  <script>
    /* Paste brand/generated/brand-runtime.js here. */
  </script>
</body>
</html>
```

## Required behavior

- Author every `.slide` at exactly `750px` width. Set `data-slide-kind="kv"` and `data-slide-height="1320"` on covers, key visuals, or source-declared KV slides. Set `data-slide-kind="content"` on all other slides and derive its integer `data-slide-height` from the bottom edge of the lowest non-bleed content plus the 60px bottom safe margin; do not add unexplained empty height.
- Use a 40px gap between authored content blocks; do not use `margin-top: auto`, `margin-bottom: auto`, `justify-content: space-between`, or equivalent leftover-space distribution. Q&A groups use a 60px gap from the end of one answer to the next question.
- Give every slide exactly one main-title node: use one `h1`, or one `data-type-level="headline"` node when an `h1` cannot be used.
- Keep authored text inside x=60–690, below the 120px top safe margin, and above the 60px bottom safe margin for that slide's declared height.
- Scale only `.deck-stage`; fit it against the active slide's declared height without reflowing internal content.
- Use the inlined generated `brand-runtime.js` as the sole runtime. Do not add another stage component, router, editor, autosave layer, or print controller.
- Toggle `.active` and `.visible` for navigation. Do not use `display: none` for slide switching.
- Support Arrow keys, Page Up/Down, Space, Home/End, swipe/tap, and a page count outside the stage.
- Keep every authored visual state fully visible and immediate. Do not add `animation`, `@keyframes`, `transition`, delayed reveal classes, or looping effects.
- Include an edit toggle, content editing, localStorage autosave scoped by deck ID, and a save-to-file control unless the user requests a locked deck.
- Set a stable ASCII `frontend-slides-deck-id` meta value. Give every editable text leaf both `data-editable="text"` and a unique, stable `data-edit-id`.
- Use local approved font assets when present. Do not add network font links.
- Embed local logos/images as data URLs when practical; otherwise keep paths inside the deck directory.
- Set `frontend-slides-brand-status` to the exact value in `brand/source.json`.
- Set `data-tone-mode` to the user-approved `light` or `dark` value and keep it unchanged across all previews and slides.
- Do not add a separately authored brand logo to product-detail pages.
- Map every authored text leaf to a locale type level and keep the final normalization block after component CSS. Ordinary text leaves use 100% line height; annotation prose may use only the approved `data-annotation-text` 0px exception, while citation markers keep disclaimer size and 100% line height and may not be alone on a line. Do not introduce display-number exceptions, browser-default line height, or local tracking overrides.
- Add `lang="en"`, `lang="vi"`, or `lang="th"` to pure non-Chinese runs. Mixed Chinese/Latin copy remains `zh-CN` unless the source explicitly separates the run.

## Inline editing safety

- Make only intended text and approved image slots editable.
- Use plain-text editing for declared text leaves; preserve semantic styling in non-editable wrappers when rich formatting is required.
- Do not make scripts, styles, brand tokens, canvas dimensions, or validation metadata editable.
- Use a stable deck-specific localStorage key.
- Escape edited text when serializing the saved HTML.
- Preserve the fixed 750px width, each slide's declared height, and brand metadata in exported files.
- When supplied or authorized images need processing, keep the original, save a derived asset, and use only uncropped or rectangularly cropped output. CSS/SVG wrappers and masks remain zero-radius.
