---
version: alpha
name: 8-Bit Orbit
description: A retro-futuristic pixel-art presentation system that fuses 16-bit arcade nostalgia with editorial discipline. Display type runs in Tektur (a chunky geometric display face built on pixel-grid logic) paired with Chakra Petch for body and Space Mono for code-flavored labels and tabular data. The palette pivots on a deep cosmic navy (`#0F1B3D` / `#0A0E27`) lit by three saturated neons — cyan, hot pink, and a high-key yellow — with a soft lavender pastel for warm reprieves. Depth is built from stacked hard offset shadows in 4px increments (the pixel unit), CRT scanlines, atmospheric grain, vignettes, and animated starfields. The effect sits between an arcade cabinet and a Tron-era boardroom — unmistakably digital, intentionally lo-fi, and engineered to feel as if it just booted up.

colors:
  dark-void: "#0A0E27"
  deep-navy: "#0F1B3D"
  neon-cyan: "#5EDCF4"
  neon-pink: "#F0A6CA"
  neon-yellow: "#F4D03F"
  soft-lavender: "#E2D5F2"
  white: "#FFFFFF"

shadows:
  pixel-stack-cyan-yellow: "4px 0 0 0 {colors.deep-navy}, 0 4px 0 0 {colors.deep-navy}, 4px 4px 0 0 {colors.deep-navy}, 8px 4px 0 0 {colors.neon-yellow}, 4px 8px 0 0 {colors.neon-yellow}, 8px 8px 0 0 {colors.neon-yellow}"
  pixel-stack-pink-cyan: "4px 0 0 0 {colors.deep-navy}, 0 4px 0 0 {colors.deep-navy}, 4px 4px 0 0 {colors.deep-navy}, 8px 4px 0 0 {colors.neon-cyan}, 4px 8px 0 0 {colors.neon-cyan}, 8px 8px 0 0 {colors.neon-cyan}"
  pixel-l-shape: "4px 0 0 0 {colors.deep-navy}, 0 4px 0 0 {colors.deep-navy}, 4px 4px 0 0 {colors.deep-navy}"
  pixel-text-shadow: "4px 4px 0 {colors.neon-yellow}, 8px 8px 0 {colors.deep-navy}"
  pixel-text-shadow-small: "3px 3px 0 {colors.deep-navy}"
  card-offset: "6px 6px 0 rgba(15, 27, 61, 0.15)"
  card-featured: "8px 8px 0 {colors.neon-yellow}"

typography:
  pixel-hero:
    fontFamily: "'Tektur', cursive"
    fontSize: 75px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.05em
  display:
    fontFamily: "'Tektur', cursive"
    fontSize: 75px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.05em
  headline:
    fontFamily: "'Tektur', cursive"
    fontSize: 75px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.05em
  subhead:
    fontFamily: "'Tektur', cursive"
    fontSize: 45px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.05em
  stat-number:
    fontFamily: "'Tektur', cursive"
    fontSize: 75px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.05em
  body:
    fontFamily: "'Chakra Petch', sans-serif"
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.05em
  hero-tagline:
    fontFamily: "'Chakra Petch', sans-serif"
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.05em
  quote-body:
    fontFamily: "'Chakra Petch', sans-serif"
    fontSize: 45px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.05em
  label-pill:
    fontFamily: "'Space Mono', monospace"
    fontSize: 45px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.05em
    textTransform: uppercase
  label-eyebrow:
    fontFamily: "'Space Mono', monospace"
    fontSize: 45px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.05em
    textTransform: uppercase
  badge:
    fontFamily: "'Space Mono', monospace"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.05em
    textTransform: uppercase
  chart-value:
    fontFamily: "'Space Mono', monospace"
    fontSize: 45px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.05em
  chart-label:
    fontFamily: "'Space Mono', monospace"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.05em
  date-chip:
    fontFamily: "'Space Mono', monospace"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.05em
  counter:
    fontFamily: "'Space Mono', monospace"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.05em

spacing:
  pixel-unit: 4px
  pad-slide-top: 120px
  pad-slide-bottom: 60px
  pad-slide-x: 60px
  pad-card-lg: "32px 40px"
  pad-card-md: "28px"
  pad-card-sm: "16px 20px"
  gap-grid-lg: 32px
  gap-grid-md: 24px
  gap-grid-sm: 16px
  content-max-width: 630px

canvas:
  width: 750
  height: 1320
  aspectRatio: "25 / 44"
  overflow: hidden
  scaling: "uniform-stage-only"

components:
  label-pill:
    background: "{colors.deep-navy}"
    color: "{colors.neon-yellow}"
    padding: "6px 14px"
    fontSize: 45px
    fontWeight: 700
    letterSpacing: -0.05em
    textTransform: uppercase
    fontFamily: "'Space Mono', monospace"
    description: "Universal square section tag with border-radius 0. Default fill is deep-navy with neon-yellow text; variants may swap text color while retaining the rectangular geometry."
  pixel-button:
    background: "{colors.neon-cyan}"
    color: "{colors.deep-navy}"
    padding: "16px 36px"
    fontFamily: "'Tektur', cursive"
    fontWeight: 700
    letterSpacing: -0.05em
    textTransform: uppercase
    boxShadow: "{shadows.pixel-stack-cyan-yellow}"
    description: "The signature stacked-shadow CTA. The pink variant swaps cyan body for pink and yellow shadow halo for cyan halo."
  pixel-corner-bracket:
    width: 24px
    height: 24px
    borderWidth: 4px
    description: "Two outward-facing L-shapes (top-left + bottom-right) bracketing a region. Default color is neon-cyan; yellow and pink variants exist. Sits 8px outside the bracketed element."
  feature-card:
    background: "rgba(255, 255, 255, 0.15)"
    backdropFilter: "blur(8px)"
    padding: "32px 24px"
    border: "2px solid rgba(15, 27, 61, 0.2)"
    description: "Frosted-glass card with inset navy L-brackets (top-left + bottom-right) replacing rounded corners. Used on light-surface slides."
  stat-block:
    background: "rgba(94, 220, 244, 0.08)"
    border: "2px solid rgba(94, 220, 244, 0.2)"
    padding: "32px 16px"
    description: "Cyan-tinted glass stat tile with cyan L-bracket accents at opposite corners. Used on dark surfaces. Stat numeral uses the pixel-text-shadow-small treatment."
  bar-track-light:
    height: 32px
    background: "rgba(15, 27, 61, 0.1)"
    description: "Horizontal track for hbar charts on light surfaces. Fill is solid navy/cyan/pink with a yellow offset shadow."
  bar-vertical:
    background: "{colors.neon-cyan}"
    boxShadow: "{shadows.pixel-l-shape}"
    description: "Vertical chart bar with three-piece navy L-shadow. Color cycles cyan → pink → yellow."
  timeline-node:
    width: 24px
    height: 24px
    background: "{colors.neon-cyan}"
    border: "4px solid {colors.deep-navy}"
    description: "Square pixel node on timeline rails. Active state swaps fill to neon-yellow."
  timeline-rail:
    width: 4px
    background: "repeating-linear-gradient(to bottom, {colors.deep-navy} 0px, {colors.deep-navy} 16px, transparent 16px, transparent 24px)"
    description: "Dashed pixel rail running between timeline nodes."
  date-chip:
    background: "{colors.deep-navy}"
    color: "{colors.neon-cyan}"
    padding: "2px 10px"
    fontFamily: "'Space Mono', monospace"
    fontSize: 15px
    letterSpacing: -0.05em
    description: "Small square inline date marker on timeline events; border-radius remains 0."
  hero-badge:
    border: "2px solid {colors.neon-yellow}"
    color: "{colors.neon-yellow}"
    padding: "8px 16px"
    fontFamily: "'Space Mono', monospace"
    fontSize: 15px
    letterSpacing: -0.05em
    textTransform: uppercase
    description: "Outline-only chip used in clusters under hero headlines."
  bg-grid:
    backgroundColor: "{colors.dark-void}"
    backgroundImage: "linear-gradient(rgba(94, 220, 244, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(94, 220, 244, 0.07) 1px, transparent 1px)"
    backgroundSize: "40px 40px"
    description: "40px cyan-on-navy grid wallpaper for dark surfaces. Pink, cyan, and lavender variants invert the relationship (colored ground with low-opacity navy grid lines)."
  scanlines:
    background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(10, 14, 39, 0.04) 2px, rgba(10, 14, 39, 0.04) 4px)"
    mixBlendMode: multiply
    description: "Horizontal CRT scanline overlay applied via ::after at z-index 50. Always present on every slide."
  grain:
    opacity: 0.035
    description: "SVG fractal-noise grain layer applied via ::before at z-index 49. Always present on every slide."
  crt-glow:
    background: "radial-gradient(ellipse at center, transparent 50%, rgba(10, 14, 39, 0.25) 100%)"
    description: "Radial vignette that darkens the corners to mimic a CRT bulge. Applied to dark-surface slides via ::after at z-index 51."
  starfield:
    description: "Container of small 4-6px colored squares (cyan, yellow, pink) positioned absolutely with a 3s twinkle keyframe. Lives on dark surfaces only."
  pixel-particles:
    description: "Floating 8px colored squares with an 8s float keyframe. Decorative ambient layer on hero and CTA-type surfaces."
  nav-dot:
    width: 12px
    height: 12px
    border: "2px solid {colors.neon-cyan}"
    background: transparent
    description: "Hollow square pip with a 2px inset cyan fill on active state. Fixed vertical rail at right edge."
  quote-line:
    width: 60px
    height: 4px
    background: "{colors.neon-yellow}"
    boxShadow: "4px 4px 0 {colors.deep-navy}"
    description: "Short yellow rule with navy offset shadow, used as a separator under quote bodies."
---

## Mandatory Fixed-Brand Override

This block overrides every conflicting reference value later in this file.

- Canvas: fixed `750×1320`, uniformly scaled without internal reflow.
- Safe area: top 120px / right 60px / bottom 60px / left 60px; every authored headline begins at y=120px.
- Chinese type: 75 / 45 / 45 / 30 / 15px for headline / subheadline / label / description / disclaimer, with 100% line height and -5% letter spacing. Metrics and proof numerals use the same five levels.
- Corners: every authored webpage layer uses `border-radius: 0`; cards, tags, controls, CSS/SVG fields, and image masks have square corners.
- Tone: use the run's approved `light` or `dark` choice and colors declared by the brand source. Palette descriptions below explain reference contrast only.
- Product-detail logo: do not add a separately authored brand-logo layer.
- Images: CSS visuals are allowed when selected; supplied or authorized images may be processed and rectangularly cropped while originals are preserved. Never use a rounded crop or mask.

## Fixed Stage Contract

Generate every slide as a **fixed 750×1320 stage**. Scale the complete stage uniformly to the browser viewport; it may letterbox or pillarbox, but it never reflows internal content. Keep all authored copy inside x=60–690 and y=120–1260.

This template is a design-style and narrative-structure baseline, not a brand source. Preserve its pixel-grid hierarchy, atmospheric layers, component grammar, and evidence treatment while translating palette, font family, logo, assets, spacing limits, and motion timing through `brand/source.json` and generated brand rules.

Use only the inlined `brand/generated/brand-runtime.js`: render at 750×1320, apply one uniform transform, and verify every rendered page for text overflow, panel overlap, minimum text size, and runtime interactions.


## Overview

8-Bit Orbit is a **retro-futuristic pixel-art presentation system**. Its foundational premise is the **4-pixel unit**: every shadow offset, every border, every corner bracket, every label height resolves to a multiple of 4px. Layouts feel as if they were rasterized on an old CRT and dragged into HTML — and atmospheric overlays (scanlines, grain, vignette glow, animated starfields) reinforce the illusion on every surface.

The type stack is three faces working in concert. **Tektur** is the display face — a chunky, geometric, semi-pixelated grotesque that carries headlines, hero text, stat numerals, and any text that needs to feel like it was drawn on the pixel grid. **Chakra Petch** is the body face — a humanist sans with subtle geometric cuts that avoids fighting Tektur for attention. **Space Mono** is the system face — used exclusively for labels, captions, badges, chart values, dates, and counters. Font choice preserves the HUD contrast while every Chinese text role follows the fixed five-level type contract.

The palette is built around **deep navy as ground** (`{colors.dark-void}` and `{colors.deep-navy}`) lit by **three saturated neons** — cyan, hot pink, yellow — plus a soft lavender pastel. Surfaces alternate: a dark navy surface (cyan grid wallpaper, white text, neon accents glowing in front) followed by a colored surface (pink, cyan, or lavender ground with navy text and navy grid lines etched at low opacity). The neons never appear as body text — they are reserved for headlines, stat numerals, accent rules, and label fills. The result is high contrast without being harsh: the neons feel illuminated rather than printed.

Depth is the system's signature trick: **stacked hard offset shadows in the pixel unit**. The flagship pattern is a six-piece shadow on buttons — three navy offsets stepping down-right at 4px, then three colored halo offsets stepping further at 8px. Hero text gets a two-layer text shadow (yellow at +4/+4, navy at +8/+8). Cards get either a 6px navy box shadow or an 8px yellow box shadow on the featured tier. Every shadow is hard-edged, zero blur, locked to the 4px grid. Atmospheric depth comes from the always-on **scanlines + grain + CRT glow** overlay trio that subtly modulates every surface.

**Density philosophy: moderately dense, atmospherically loaded.** The system reads as broken when surfaces are clean and unaccompanied — without scanlines, grain, vignette, particles, or a colored grid behind, the type loses its arcade context and starts to look like generic web typography. Always layer the atmosphere. Within content regions, however, breathing room matters: cards are widely spaced (24-32px gaps), stat tiles get heavy internal padding, and hero text is allowed to dominate. A typical slide carries one display moment + a small constellation of supporting elements (badges, labels, a chart, or a small grid), all sitting on a fully decorated atmospheric background.

**Key Characteristics:**
- Three-font stack: Tektur (display), Chakra Petch (body), Space Mono (HUD/labels) — never substitute, never mix outside their roles.
- Navy ground (`{colors.dark-void}` / `{colors.deep-navy}`) alternates with colored-grid surfaces (pink, cyan, lavender) — both carry the 40px etched grid.
- Three neons (cyan, pink, yellow) reserved for display, stats, rules, and label fills — never for body text.
- All measurements snap to the 4px pixel unit: borders 2-4px, shadow offsets 4px / 8px, corner brackets 24×24 with 4px stroke.
- Stacked hard offset shadows are the system's depth language — never blurred, never colored on text shadows except in the yellow→navy cascade.
- Every slide carries the persistent scanline + grain + CRT-vignette trio at z-index 49-51.
- L-shaped corner brackets (`{components.pixel-corner-bracket}`) replace rounded corners and frame regions, cards, and stat tiles.
- A monospace label rectangle (`{components.label-pill}`) sits as the universal eyebrow on every region — navy fill, neon text, `-0.05em` tracking, uppercase where the source language supports it.
- Animated starfields and floating particle squares wallpaper dark surfaces — ambient, not decorative.

## Colors

### Palette

- **Dark Void** (`{colors.dark-void}` — `#0A0E27`): The deepest ground, used on `<body>` and as the base for dark-grid surfaces. Reads as black-with-blue-bias under the CRT vignette.
- **Deep Navy** (`{colors.deep-navy}` — `#0F1B3D`): The structural color — all shadow stacks, label fills, dark cards, button text on neon surfaces, and chart bar text. Slightly warmer than the void; the two read as ground and figure when stacked.
- **Neon Cyan** (`{colors.neon-cyan}` — `#5EDCF4`): The system's primary glow. Used for headlines on dark surfaces, primary button fill, stat numerals, primary chart bars, timeline nodes, navigation dots, corner brackets, and grid lines on dark surfaces (at 7% opacity).
- **Neon Pink** (`{colors.neon-pink}` — `#F0A6CA`): The warm accent. Used as a colored surface ground (40px navy-on-pink grid), secondary button fill, secondary chart bars, mouth detail in pixel avatars, and tertiary corner brackets.
- **Neon Yellow** (`{colors.neon-yellow}` — `#F4D03F`): The high-key alert color. Used in shadow halos behind buttons and on featured tier cards, as the active timeline-node fill, on hero badges, in label-pill text variants, in the quote-line, and as Tektur text-shadow layer 1.
- **Soft Lavender** (`{colors.soft-lavender}` — `#E2D5F2`): The calm pastel surface — used as ground for slides that need a softer reprieve from the neon-on-navy intensity. Carries the same etched-navy grid wallpaper as the other colored surfaces.
- **White** (`{colors.white}` — `#FFFFFF`): Text color on dark/neon surfaces only. Never used as a slide background.

### Defaults

- **Default surface background**: `{colors.dark-void}` with the 40px cyan grid (`{components.bg-grid}`). Always apply scanlines + grain + crt-glow on top.
- **Default headline color on dark surfaces**: `{colors.neon-cyan}`, with the `{shadows.pixel-text-shadow-small}` or `{shadows.pixel-text-shadow}` treatment for hero-scale text.
- **Default headline color on colored grids (pink/cyan/lavender)**: `{colors.deep-navy}` — neon text becomes illegible on neon grounds.
- **Default body text color on dark surfaces**: `rgba(255, 255, 255, 0.7)` — softened white, not pure white.
- **Default body text color on colored grids**: `rgba(15, 27, 61, 0.75)` — softened navy.
- **Default label-pill fill**: `{colors.deep-navy}` with `{colors.neon-yellow}` text. On colored grids the text can swap to cyan or pink as long as contrast against navy holds.
- **Default accent color for callouts and stat numerals**: `{colors.neon-cyan}`.
- **Default chart palette order**: cyan → pink → yellow (in that order across series).
- **Default corner bracket color**: `{colors.neon-cyan}`. Yellow and pink variants exist for thematic accents.

When a slide needs to feel softer or warmer, switch the colored grid from cyan-on-navy (default) to navy-on-pink, navy-on-cyan, or navy-on-lavender — the structural relationship inverts (grid lines become navy at low opacity) but the typographic rules stay the same.

## Typography

### Font Family
The reference system runs three voices, each locked to a role. In the fixed-brand Skill, map these roles to the approved brand display, body, and annotation treatments; do not fetch or bundle the reference fonts unless the brand source explicitly approves them.

**Tektur** is the display face — a wide-bodied, semi-geometric grotesque with subtle pixel-grid cuts. Used for every hero title, headline, stat numeral, quote mark, and large numeral. Tektur's chunky personality is what makes the system feel arcade-native; replacing it with Inter or Space Grotesk breaks the entire aesthetic.

**Chakra Petch** is the body face — a humanist sans with mild geometric/squared character that reads cleanly at 14-22px and has enough personality to sit next to Tektur without disappearing. Used for paragraphs, hero taglines, quote bodies, and any longer-form prose.

**Space Mono** is the HUD face — a monospace used exclusively for labels, badges, chart values/axes, page counters, date chips, and any element that should feel like a system readout. The mono + wide-tracked uppercase combination is the system's "interface" voice.

The transferable rule is role separation: heavy geometric display, calm readable body, and compact system-style annotation. Preserve that contrast with approved brand typography rather than treating the reference family names as brand requirements.

### Typography Scale

| Contract role | Fixed size | Reference family | Weight | Use |
|---|---:|---|---:|---|
| Headline | 75px | Tektur | 700–900 | Hero, cover, section opener, or primary claim |
| Subheadline | 45px | Tektur / Chakra Petch | 500–700 | Region heading or quote |
| Label | 45px | Space Mono / approved brand family | 400–700 | Eyebrow, evidence value, or prominent label |
| Description | 30px | Chakra Petch | 400–500 | Body, lede, or short explanation |
| Disclaimer | 15px | Space Mono / approved brand family | 400–700 | Badge, chart annotation, date, counter, or legal note |

All five roles use `100%` line height and `-5%` (`-0.05em`) letter spacing. Metrics and proof numerals resolve to one of the same five levels; they do not create an exception.

### Defaults

- **Default size for a hero, cover title, or primary section headline**: 75px.
- **Default size for a subheadline or prominent label**: 45px.
- **Default size for paragraph body and lede copy**: 30px — never reduce it to force content into the stage.
- **Default size for a stat numeral**: 75px or 45px according to hierarchy; it may carry the reference text-shadow treatment.
- **Default size for a badge, chart annotation, counter, or disclaimer**: 15px.
- **Default tracking and leading for every Chinese role**: `-0.05em` letter spacing and `100%` line height.
- **Default body weight**: 400 for Chakra Petch, 500 for quote bodies.
- **Default display weight**: 700 for headlines, 900 for hero scale and stat numerals.

When unsure which display token to reach for, default to `{typography.headline}` — it's the section-level workhorse. Reserve `{typography.pixel-hero}` for cover and CTA moments only.

### Signature Treatments

These treatments are **non-optional whenever the corresponding element type is used**:

- **Every pixel-hero element carries the stacked text-shadow.** The pattern is `4px 4px 0 {colors.neon-yellow}, 8px 8px 0 {colors.deep-navy}` on cyan text. A pixel-hero element without this two-layer cascade reads as untreated display type and breaks the arcade voice.
- **Every stat numeral carries the small text-shadow.** The pattern is `3px 3px 0 {colors.deep-navy}` on cyan text. Stat numerals on dark surfaces need this shadow to feel illuminated; without it they read flat.
- **Every Chinese text element uses the fixed `-0.05em` tracking.** Uppercase remains a language-dependent styling choice, not a spacing exception.
- **Every Tektur display element uses the same `-0.05em` tracking and `100%` line height as the rest of the Chinese hierarchy.** Visual distinction comes from family, weight, color, and shadow.
- **Every Chakra Petch body block uses `100%` line height.** Create breathing room with block gaps instead of extra leading.
- **Every label rectangle resolves to 45px for a prominent label or 15px for annotation-level chrome.** It uses `-0.05em` tracking.
- **Every chart bar value / axis label uses Space Mono.** Numerical chrome is mono, never Tektur or Chakra Petch.

### Typography Principles

The voice contrast is **chunky display ↔ humanist body ↔ wide-tracked mono chrome**. Switching any of the three roles to a different face flattens the system into a generic dark-mode aesthetic. Italic is never used in display or body — the only italic that appears anywhere is implicit in the slight tilt on pixel-art decorative elements.

Tektur should always feel **planted** — left-aligned and separated by deliberate block spacing, never centered for body-length runs (centering is permitted on hero and CTA titles only). Chakra Petch should always feel **calm** and left-aligned by default. Both follow the fixed line-height and letter-spacing contract.

## Layout

### Canvas System
The system targets a fixed `750×1320` stage per slide. Slides remain mounted inside the runtime stage while only the active slide is visible. Navigation changes the active state; it does not move or reflow the authored geometry.

Use 60px horizontal padding, a 120px top safe area, a 60px bottom safe area, and a maximum content width of 630px. Use a 6-column internal grid with 14–18px gutters, then choose a 3/3, 2/4, or full-width composition according to the page job. Atmospheric backgrounds may bleed to the edge; text, labels, and evidence notes remain inside the safe area.

### Pixel Unit
Every measurement in the system snaps to a **4px grid**. Border widths are 2px or 4px. Shadow offsets are 4px or 8px. Corner brackets are 24×24 with 4px stroke. The background grid is 40px (10 × pixel-unit). Card padding usually resolves to multiples of 8 (16, 24, 32, 48). This discipline is what makes the system feel rasterized rather than vector.

### Persistent Chrome
Three elements appear on every slide:
- **Navigation dot rail** — vertical stack of 12×12 cyan-bordered squares, fixed at `right: 24px`, vertically centered. Active state fills the inner 8×8 with cyan.
- **Slide counter** — Space Mono `01 / 10` format at 15px, placed in application chrome outside the branded safe area.
- **Nav hint** — `USE KEYS ↑ ↓` at 15px, placed in application chrome outside the branded safe area.

The cursor across the entire deck is `crosshair` — an additional arcade signal.

### Atmospheric Overlay Stack
Every slide carries (in z-order):
1. Surface background — either `{components.bg-grid}` (cyan-on-navy) or one of the colored grid variants.
2. Grain layer at z-index 49, opacity 0.035.
3. Scanlines at z-index 50, multiply blend mode.
4. CRT vignette glow at z-index 51 (dark surfaces only).
5. Optional starfield / pixel particles at z-index 1 inside the surface.
6. `.slide-content` at z-index 10 above the atmospheric layers.

This overlay stack is the system's identity. A slide rendered without it looks like a wireframe.

## Depth and Elevation

### Stacked Hard Offset Shadow (Signature)
The system uses **stacked, multi-step hard offset shadows** in the 4px pixel unit. Every shadow value is composed in one of three patterns:

- **Three-step navy L-shape** (`{shadows.pixel-l-shape}`) — three offsets at `4px 0`, `0 4px`, `4px 4px` in deep-navy, zero blur. Used on chart bars and small elevated chrome to suggest a single-layer drop.
- **Six-step button cascade** (`{shadows.pixel-stack-cyan-yellow}` / `{shadows.pixel-stack-pink-cyan}`) — three navy offsets at 4px stepping then three colored halo offsets at 8px stepping behind. Creates a two-layer pixel-bevel effect. Used exclusively on `{components.pixel-button}`.
- **Two-layer text-shadow** (`{shadows.pixel-text-shadow}` / `{shadows.pixel-text-shadow-small}`) — yellow layer at +4/+4 then navy layer at +8/+8 (or just navy at +3/+3 for stat-scale numerals). Used on every Tektur display element.

All shadows are zero-blur, hard-edged, locked to the pixel unit. A blurred drop shadow does not exist anywhere in the system.

### Card Shadows
Two simpler patterns serve cards:
- `{shadows.card-offset}` = `6px 6px 0 rgba(15, 27, 61, 0.15)` — soft navy offset for non-featured tier cards on light surfaces.
- `{shadows.card-featured}` = `8px 8px 0 {colors.neon-yellow}` — neon-yellow offset for featured tier cards, paired with a `-12px` translateY lift.

### Corner Brackets as Depth
The L-shaped corner brackets (`{components.pixel-corner-bracket}`) replace traditional border treatments on regions and cards. Two brackets at opposite corners imply a frame without enclosing it — the eye fills in the missing edges. On stat blocks and feature cards, brackets sit inset at `top: -2px / left: -2px` and `bottom: -2px / right: -2px` so they break the cell edge slightly, reinforcing the pixel-bevel feel.

### Atmospheric Depth
The scanline + grain + CRT-vignette stack provides ambient depth on every surface without requiring shadow on individual elements. Animated starfields and floating particles layer additional spatial cues behind content. None of these are decorative add-ons — they are core to the depth perception of the system.

## Shapes and Treatment

### Border Radius
Effectively zero. The only round shape that appears anywhere is the donut-style nav dot inner-fill (which is still a square in this system — the nav dots are square pips, not circles). Rounded buttons, rounded cards, or rounded pill chips break the pixel-art aesthetic immediately.

The pixel-face avatar zone uses square eyes and a rectangular mouth — anatomy rendered in pixels, not curves.

### Border Weights
- **2px solid** — used on feature-card outlines, hero badges, nav dots, stat-block frames, chart bars (inline edges).
- **3px stroke** — used for chart axes inside SVG charts (deep-navy).
- **4px solid** — used on corner brackets, timeline node borders, the quote-line, and the inner pixel-bevel of buttons.

Borders are always solid, always navy or neon, never dashed except for the timeline rail (`{components.timeline-rail}`) which is intentionally rendered as a 16px-on, 8px-off repeating linear gradient to mimic a pixel-dashed line.

### Decorative Element Types

**Pixel corner bracket** — Two outward L-shapes (top-left + bottom-right) bracketing a region. 24×24 with 4px stroke. Default color is cyan; yellow and pink variants exist. The bracket pattern is the system's most distinctive non-typographic mark.

**Label rectangle** — Navy rectangle with a 45px prominent label or 15px annotation. It uses `-0.05em` tracking and the approved brand family for CJK. Variants flip the text color to cyan or pink while keeping the navy fill.

**Hero badge** — Outline-only 2px yellow border with yellow Space Mono text. Appears in clusters under hero titles as feature tags.

**Stat block** — Cyan-tinted glass tile (8% cyan fill, 20% cyan border) with cyan corner brackets at top-left and bottom-right. Holds a large stat numeral over a Space Mono pink label.

**Feature card** — Frosted-glass white card (15% white fill, blur) with navy corner brackets at opposite corners. Used on colored-grid surfaces.

**Pixel button** — Cyan rectangle with the six-step stacked shadow cascade. On hover, the button translates +2/+2 and the shadow collapses to a 4-step cascade — simulating a key-press in pixel art.

**Quote-line** — A 60×4 yellow rectangle with a 4×4 navy offset shadow. Used as a separator beneath quote bodies.

**Timeline node** — 24×24 cyan square with a 4px navy border, positioned on a dashed navy rail. Active state swaps fill to yellow.

**Date chip** — Inline 2px-padded navy rectangle with cyan Space Mono text, used to mark timeline events. It remains square with zero radius.

**Pixel face** — A 120×120 grouping of square "facial features" (cyan eyes, pink mouth) rendered as absolutely positioned divs inside a navy avatar zone. Functions as both a friendly mascot and a system-signature decorative module.

**Tier card** — White rectangle, 6px navy offset shadow. Featured tier swaps fill to deep-navy and shadow to 8px yellow, with a `-12px` translateY lift. Tier features use a `+` ::before glyph in cyan instead of standard bullets.

**Pixel landscape** — A row of variable-height navy mountains at the bottom of CTA-class surfaces, opacity 0.3. Pure decoration suggesting an arcade horizon.

## Do's and Don'ts

### Do

- Apply the scanlines + grain + CRT-vignette overlay stack to every slide. The atmosphere is the design system; surfaces without it look like wireframes.
- Use `{colors.neon-cyan}` as the default headline color on dark surfaces and `{colors.deep-navy}` as the default headline color on colored grids (pink/cyan/lavender).
- Apply `{shadows.pixel-text-shadow}` to every pixel-hero element and `{shadows.pixel-text-shadow-small}` to every stat numeral. Tektur display type without its text-shadow reads flat.
- Snap every measurement to the 4px pixel unit — border widths, shadow offsets, padding, corner-bracket dimensions. Off-grid values break the rasterized feel.
- Use Tektur for display, Chakra Petch for body, Space Mono for chrome — exclusively. Cross-mixing the three voices flattens the system.
- Wrap eyebrows in the square `{components.label-pill}` (navy background, yellow annotation text, `-0.05em` tracking) as the universal section tag.
- Pair the navy ground with at least one neon glow per region — text, chart bar, corner bracket, or button shadow halo. Pure navy without a neon accent reads as dead screen.
- Layer animated starfields and pixel-particle floaters on dark hero and CTA surfaces. The motion is part of the atmosphere.
- Render charts with cyan → pink → yellow series order and Space Mono numerals/labels. The neon trio is the chart palette.
- Bracket cards and stat tiles with the L-shaped corner brackets at opposite corners instead of fully outlining them. The implied frame is the system's signature card treatment.

### Don't

- Don't substitute fonts. Tektur, Chakra Petch, and Space Mono are the three voices — replacing any of them with Inter, Roboto, or Space Grotesk collapses the system.
- Don't round any corner. The pixel aesthetic depends on square edges. SVG charts may use intrinsic circular geometry, but every containing webpage layer still uses `border-radius: 0`.
- Don't blur any shadow. Every shadow is hard-edged at zero blur. `0 4px 12px rgba(0,0,0,0.1)` does not exist here.
- Don't place neon text on neon surfaces. Cyan headlines on the pink grid become illegible — switch to deep-navy on colored grounds.
- Don't use Tektur in sentence-case body runs or Chakra Petch in chrome/labels. Each face has a single role.
- Don't introduce a fourth neon. The palette is cyan + pink + yellow + lavender pastel. Adding green or orange breaks the curated neon trio.
- Don't omit the atmospheric overlay stack on any slide, even chart-heavy or table-heavy slides. The overlays are non-negotiable.
- Don't use uppercase Chakra Petch body text. Body always sentence-case; uppercase is reserved for Space Mono and Tektur display.
- Don't drop the square navy label rectangle in favor of a plain text eyebrow. The filled rectangular tag is the most recognizable small chrome in the system.
- Don't shadow text or chrome with off-axis offsets. Every shadow steps down-right in 4px increments — left or upward offsets do not exist.

## Responsive Behavior

8-Bit Orbit is a **fixed-stage system**. All internal coordinates, type sizes, gaps, and image crops are authored once at `750×1320`. The browser scales the complete stage with one uniform transform. No component changes columns or reading order because the viewport is narrower.

### Scaling Behavior
- Author headline text at 75px, subheadlines and prominent labels at 45px, descriptions at 30px, and captions or HUD labels at 15px.
- Keep the 4px pixel unit, 40px background grid, 4px scanline stripe, and 24px corner-bracket geometry fixed inside the authored stage.
- Compute scale as `min(viewportWidth / 750, viewportHeight / 1320)` and apply it to the whole stage.
- Permit letterboxing or pillarboxing outside the stage. Never crop the stage to fill the viewport.

### Internal Grid
- Use up to three cards or stat blocks on one row; use a 2×2 field only when each item remains legible at the 30px description scale.
- Split four-column feature grids into two stages rather than shrinking them.
- Preserve the same layout at desktop, tablet, mobile, screenshot, PDF, and presenter sizes.
- Keep page-to-page navigation outside the branded content area.

### Presenter Behavior
- Slides advance via `ArrowDown`, `ArrowRight`, or `Space`.
- Slides reverse via `ArrowUp` or `ArrowLeft`.
- `Home` jumps to first, `End` to last.
- Vertical swipe on touch devices advances/reverses with a 50px threshold.
- Mouse wheel scroll advances/reverses with an 800ms debounce lock.
- Presenter controls and notes remain outside the fixed stage.

### Animation Triggers
Chart bars and stat counters may animate in reading order using the approved brand duration and stagger values. When a slide is exited, its bars/counters may reset so re-entry replays the animation. The `prefers-reduced-motion` media query disables transitions and starfield or particle twinkle while preserving the complete final state.

### Print Behavior
Print and PDF export render every stage at exactly `750×1320`, one stage per page, with no browser margins. Disable presenter chrome and navigation. Preserve atmospheric overlays only when they remain legible and do not obscure source notes; test scanlines and grain after PDF flattening.

## CJK & International Content

When using this template for Chinese or other CJK content, use the approved brand CJK stack and apply the universal adjustments below. Do not load fonts from a CDN or external URL unless the brand source explicitly approves that asset.

### Recommended Chinese Pairing

| Role | Latin (default) | Chinese counterpart |
|---|---|---|
| Display / hero / stat numerals | Tektur 700–900 | 思源黑体 Noto Sans SC 900 |
| Body / hero tagline / quote body | Chakra Petch 400–500 | 思源黑体 Noto Sans SC 400 |
| HUD labels / badges / chart values / counter | Space Mono 400–700 | 思源黑体 Noto Sans SC 500 with the fixed `-0.05em` tracking |

### Mixed-Content Strategy

**Strategy A** — single CJK family with built-in Latin glyph coverage. Set every text element to `font-family: 'Noto Sans SC', sans-serif`. 思源黑体 ships Latin glyphs that read cleanly alongside Chinese characters, so a sentence like `使用 Tektur 字体` renders in one consistent face rather than font-switching mid-word. This system normally runs three faces (display / body / HUD); collapsing to one CJK face is the right tradeoff because none of the three Latin faces have credible Chinese counterparts, and visual hierarchy still works through weight (900 / 700 / 500 / 400) plus the system's signature shadow stacks.

### Loading

Load only the font assets declared in `brand/source.json`. When no approved font file is present, use the generated fallback stack. The reference pairing explains visual roles; it does not authorize a network request.

### Universal CJK Adjustments

- **Line-height**: use `100%` for every level. Add separation through layout gaps, not leading exceptions.
- **Letter-spacing**: use `-0.05em` for every Chinese role, including display, labels, numerals, and disclaimers.
- **Text transform**: don't apply `uppercase` to Chinese text — CJK has no case. Every Space Mono label in this system uses `text-transform: uppercase`; remove it for CJK runs.
- **Punctuation**: use full-width Chinese punctuation （，。：；！？「」（））.
- **No period on display headlines**: Chinese typography convention omits trailing 。 on display-scale headlines.
- **Space between CJK and Latin (盘古之白)**: insert an ASCII space between every Chinese character and adjacent Latin character or digit. Write `8 位赛博 / 1989 模式` not `8位赛博/1989模式`.
- **One font per sentence**: 思源黑体 covers both CJK and Latin glyphs in a unified style — let it handle mixed sentences. Don't let the browser fall back to Tektur or Space Mono mid-sentence for ASCII characters.

### Aesthetic Notes for This System

The system's identity rests on three voices — Tektur (chunky arcade display), Chakra Petch (humanist body), Space Mono (HUD readouts) — and a CJK build cannot preserve that three-face contrast. Compensate by leaning harder on the **non-typographic** signature elements: the stacked text-shadow (yellow at +4/+4, navy at +8/+8) still works on 思源黑体 900 headlines and is what carries the arcade voice when the face itself is generic. Keep all atmospheric overlays (scanlines, grain, CRT vignette, starfields, grid wallpaper) — they do more identity work in a CJK build than in the Latin original.

The system's label rectangle is recognizable chrome. Render Chinese label text with the approved brand body family at weight 500, `-0.05em` tracking, `100%` line height, and either the 45px label or 15px disclaimer level. The colored rectangular background and corner-bracket framing carry the recognition load.

### Known CJK Gap

- **No approved Chinese pixel face is assumed.** A conventional bold CJK family gives heft but loses the pixel-grid signal. Let scanlines, grain, vignette, starfields, grid wallpaper, and pixel-bevel shadow stacks carry the arcade voice.
- **CJK does not depend on Latin uppercase rhythm.** Lean on label fill, contrast, geometry, and corner-bracket framing while keeping text on the fixed five-level scale.

## Iteration Guide

1. Any new slide gets the full atmospheric overlay trio (scanlines + grain + crt-glow on dark surfaces, scanlines + grain on colored surfaces) and a 40px etched grid surface. Don't skip the overlays.
2. Any new display element uses Tektur. Any new body element uses Chakra Petch. Any new label, badge, counter, or chart value uses Space Mono. Never cross the role boundaries.
3. Any new headline gets `{colors.neon-cyan}` on dark surfaces or `{colors.deep-navy}` on colored grids — both with the appropriate Tektur weight and (for hero scale) the stacked text-shadow.
4. Any new eyebrow uses the square `{components.label-pill}` — navy fill, neon-yellow annotation text at 45px or 15px, and `-0.05em` tracking. Don't substitute a plain h-tag.
5. Any new card or region gets the L-shaped corner brackets at opposite corners (top-left + bottom-right) instead of a full outline. The implied frame is the system's signature.
6. Any new measurement snaps to the 4px pixel unit. Borders 2-4px, shadow offsets 4px / 8px, corner brackets 24px, grid 40px. Off-grid values feel wrong.
7. Any new shadow is hard-edged at zero blur. For buttons use the six-step cascade; for cards use 6px navy or 8px yellow; for text use the two-layer cascade.
8. Any new chart cycles cyan → pink → yellow in series order. Numerical labels and axis labels are always Space Mono.
9. If a surface needs to feel warmer or softer, switch to the pink, cyan, or lavender etched grid variant — but keep all typographic rules intact (navy headlines, softened-navy body).
10. Animated elements (starfield, particles, chart bar grow, counter rollup) should respect `prefers-reduced-motion`. Atmospheric overlays (scanlines, grain, vignette) are not animated and stay on always.

## Known Gaps

- **Tektur, Chakra Petch, and Space Mono are Google Fonts** loaded via a preconnect + `<link>`. The system has no fallback strategy beyond `cursive` / `sans-serif` / `monospace` — in environments where Google Fonts fail (offline, restricted networks), the aesthetic collapses to system defaults and loses its character.
- **Starfield and pixel-particle elements are generated by inline JS** that creates a fixed count of absolutely-positioned divs with random positions and animation delays. The animation keyframes are present in CSS, but the elements are only created if the JS runs successfully.
- **The chart system is hardcoded**: bar heights, hbar widths, and stat counter targets are stored in `data-*` attributes and animated via `setTimeout` staggers triggered by slide-index matching. There is no data-binding layer — adding a new chart requires copying the HTML pattern and updating the JS slide-index matcher.
- **The pixel-landscape on CTA surfaces is JS-generated** from a hardcoded heights array `[30, 50, 70, ...]`. Width varies per mountain (60 + (i % 3) * 20px). Replacing the landscape requires editing the JS heights array.
- **The CRT vignette glow uses a fixed dark-navy radial gradient.** Adjusting it requires editing the CSS gradient stops; there is no tokenized vignette intensity.
- **The cursor is set to `crosshair` deck-wide** for atmospheric reasons. This may conflict with text-selection expectations in contexts where the deck is embedded.
- **No keyboard navigation hint exists for the wheel/touch fallback.** The nav-hint reads `USE KEYS ↑ ↓` even though wheel and touch are also wired up.
- **The slide counter format is fixed at `NN / NN` zero-padded.** Decks with more than 99 slides would render with a layout-shifting counter.
- **The pixel-corner-bracket sizing is fixed at 24×24 with 4px stroke** and does not scale with viewport. On very large or very small viewports the brackets may feel proportionally off.
