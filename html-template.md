# Fixed-brand HTML architecture

Generate one self-contained HTML file. Inline the complete contents of `brand/generated/brand-tokens.css`, `viewport-base.css`, and `brand/generated/brand-runtime.js`.

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="frontend-slides-brand-status" content="draft">
  <title>Presentation title</title>
  <style>
    /* Paste brand/generated/brand-tokens.css here. */
    /* Paste viewport-base.css here. */

    .slide-content {
      position: relative;
      height: 100%;
      padding: var(--brand-slide-padding);
    }

    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition:
        opacity var(--brand-motion-duration) var(--brand-motion-easing),
        transform var(--brand-motion-duration) var(--brand-motion-easing);
    }

    .slide.visible .reveal {
      opacity: 1;
      transform: none;
    }
  </style>
</head>
<body>
  <div class="deck-viewport">
    <main class="deck-stage" id="deckStage" aria-live="polite">
      <section class="slide active visible" data-slide="1">
        <div class="slide-content">
          <h1 class="reveal">真实演示标题</h1>
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

- Author every `.slide` directly at `750px × 1320px`.
- Scale only `.deck-stage`; do not calculate or expose another canvas size.
- Toggle `.active` and `.visible` for navigation. Do not use `display: none` for slide switching.
- Support Arrow keys, Page Up/Down, Space, Home/End, swipe/tap, and a page count outside the stage.
- Respect `prefers-reduced-motion`.
- Include an edit toggle, content editing, localStorage autosave scoped by deck ID, and a save-to-file control unless the user requests a locked deck.
- Use local approved font assets when present. Do not add network font links.
- Embed local logos/images as data URLs when practical; otherwise keep paths inside the deck directory.
- Set `frontend-slides-brand-status` to the exact value in `brand/source.json`.

## Inline editing safety

- Make only intended text and approved image slots editable.
- Do not make scripts, styles, brand tokens, canvas dimensions, or validation metadata editable.
- Use a stable deck-specific localStorage key.
- Escape edited text when serializing the saved HTML.
- Preserve the fixed stage and brand metadata in exported files.
