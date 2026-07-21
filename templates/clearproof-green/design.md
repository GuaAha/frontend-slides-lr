---
version: alpha
name: Clearproof Green
description: >-
  A proof-led vertical presentation system derived from a 750px-wide Chinese
  product-detail page. It combines editorial black typography, a single
  functional green, clinical evidence, precise product imagery, and generous
  white space. The visual language is clean rather than delicate: large
  claims lead, measurements and footnotes substantiate them, and photography
  carries the sensory story. It is designed for skincare, personal care,
  wellness, consumer technology, ingredient stories, product training, and
  any presentation that must turn benefits into a credible evidence chain.
source:
  type: figma-audit
  fileName: "商详页面收集 ai分析用"
  nodeName: "清爽祛痘沐浴露"
  nodeId: "1:5803"
  observedFrame: "750×22001"
  observedSlices: 16
  observedTextLayers: 195
  observedImageFills: 45
  observedInstances: 22
  observedAutoLayoutNodes: 66
  translationRule: "Re-author the long commerce page as fixed 750×1320 slides; never scale the complete long page into one slide."

colors:
  ink: "#000000"
  near-black: "#101010"
  functional-green: "#42B265"
  botanical-green: "#588626"
  white: "#FFFFFF"
  soft-surface: "#F5F5F5"
  line-gray: "#DFDFDF"
  pale-gray: "#D9D9D9"
  cool-gray: "#B4B4B4"
  mid-gray: "#969696"
  dark-gray: "#484848"

shadows:
  flat: "none"
  image-scrim-dark: "inset 0 0 0 9999px rgba(0, 0, 0, 0.30)"
  image-scrim-light: "inset 0 0 0 9999px rgba(255, 255, 255, 0.40)"

typography:
  hero-display:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 75px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.045em
  display:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 60px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.04em
  headline:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 45px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.03em
  subhead:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1
  body-large:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
  support:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.25
  caption:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "45S"
    fontSize: 15px
    fontWeight: 300
    lineHeight: 1
  legal:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "45S"
    fontSize: 13px
    fontWeight: 300
    lineHeight: 1.15
  stat-number:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 60px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.035em
  step-label:
    fontFamily: "Arial, 'Noto Sans SC', sans-serif"
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1
    textTransform: uppercase

spacing:
  base-unit: 5px
  stage-width: 750px
  stage-height: 1320px
  safe-x: 60px
  safe-top: 120px
  safe-bottom: 60px
  content-width: 630px
  two-column-width: 310px
  two-column-gap: 10px
  section-gap: 60px
  content-gap-lg: 30px
  content-gap-md: 20px
  content-gap-sm: 10px
  card-padding: 30px
  evidence-padding: 25px
  footnote-gap: 20px

canvas:
  width: 750px
  height: 1320px
  aspectRatio: "25 / 44"
  overflow: hidden
  background: "{colors.white}"
  scaling: "uniform-stage-only"

components:
  editorial-title:
    width: 630px
    color: "{colors.ink}"
    font: "{typography.hero-display}"
    maxLines: 2
    description: "The dominant claim at y=120. Use one deliberate line break to create a two-beat statement. It owns the top of the page and is never placed inside a card."
  source-superscript:
    color: "{colors.ink}"
    fontSize: 13px
    verticalAlign: super
    description: "A compact evidence marker attached directly to the claim or metric it qualifies. Every visible marker must resolve to a readable footnote on the same slide."
  accent-phrase:
    color: "{colors.functional-green}"
    description: "A short result-bearing phrase inside an otherwise black headline. Green is applied to the proof or transformation, never to an entire paragraph."
  proof-rule:
    height: 1px
    background: "{colors.ink}"
    description: "A one-pixel horizontal divider used to structure evidence, steps, or comparisons. It aligns to the 630px content rail and never carries a shadow."
  metric-lockup:
    valueColor: "{colors.functional-green}"
    valueFont: "{typography.stat-number}"
    labelColor: "{colors.ink}"
    labelFont: "{typography.body}"
    description: "A large green number paired with a short black qualifier. Use the value as evidence, not decoration; include unit, period, and population context nearby."
  evidence-chart:
    width: 630px
    lineColor: "{colors.functional-green}"
    axisColor: "{colors.ink}"
    pointSize: 16px
    description: "A minimal black-and-green line or bar chart. Only the comparison points needed to support the slide claim are shown. Avoid full dashboard chrome, legends, and redundant grid lines."
  before-after-pair:
    width: 630px
    itemWidth: 310px
    gap: 10px
    labelColor: "{colors.white}"
    description: "Two equally cropped documentary images with BEFORE/AFTER labels placed inside the image. Match crop, lighting, and anatomical region as closely as evidence permits."
  product-stage:
    width: 750px
    background: "{colors.white}"
    description: "A full-bleed or near-full-bleed product render with abundant breathing room. Product glass, liquid, droplets, foam, or botanical material may escape the 630px text rail but must remain inside the stage."
  image-grid-four:
    width: 630px
    itemWidth: 310px
    itemHeight: 280px
    gap: 10px
    description: "A 2×2 problem or use-case grid. Each image carries one short centered label over a controlled dark scrim. The four captions must be grammatically parallel."
  ingredient-field:
    width: 630px
    background: "{colors.white}"
    description: "A scientific ingredient composition made from translucent orbs, botanical macro photography, or ingredient cut-outs. Labels orbit the forms without connector-line clutter."
  proof-panel:
    width: 630px
    background: "{colors.soft-surface}"
    padding: 30px
    description: "A pale gray panel that groups a result statement, two numeric outcomes, and a before/after proof pair. It is the only recurring card-like surface and stays square-edged."
  black-caption-strip:
    width: 750px
    background: "{colors.near-black}"
    color: "{colors.white}"
    description: "A high-contrast caption band used below liquid or texture photography. Restrict to short ingredient names or paired mechanism labels."
  fragrance-band:
    width: 750px
    background: "{colors.functional-green}"
    color: "{colors.white}"
    columns: 3
    description: "A bottom-anchored green band for top, middle, and base notes. Columns are separated by thin white rules and aligned symmetrically."
  step-row:
    width: 630px
    imageWidth: 310px
    textWidth: 283px
    labelBackground: "{colors.near-black}"
    labelColor: "{colors.white}"
    description: "One instructional row with a simplified line illustration on the left and STEP label plus action copy on the right. Three rows stack vertically with proof rules between them."
  scenario-strip:
    width: 630px
    itemHeight: 265px
    description: "A sequence of full-width lifestyle crops. Each receives a centered two-part caption: sequence number and occasion first, immediate benefit second."
  bundle-card:
    width: 630px
    height: 288px
    background: "{colors.soft-surface}"
    labelBackground: "{colors.functional-green}"
    description: "A horizontal product-combination row with TYPE tag, benefit pair, product names, and clean pack shots. Stack up to three; product scale remains consistent across rows."
  qa-list:
    width: 630px
    questionColumn: 445px
    indexColumn: 30px
    answerColor: "{colors.cool-gray}"
    description: "A numbered FAQ list. Questions are black and compact; answers are gray and explanatory. Preserve generous vertical separation so the final slide remains calm rather than legalistic."
  legal-note:
    width: 630px
    color: "{colors.mid-gray}"
    font: "{typography.legal}"
    description: "A bottom-aligned source, claim qualifier, patent number, or safety note. It is quiet but must remain readable at 100% stage scale."
---

## Frontend Slides Fixed-Stage Policy

Clearproof Green is a fixed vertical stage, not a responsive web page. Every slide is authored at exactly **750×1320px** and must preserve that composition at every viewport size. The browser may uniformly scale the complete stage to fit, but internal elements must not reflow, wrap differently, change order, or move between breakpoints.

The Figma source is a 750×22001px commerce narrative made from sixteen slices whose heights range from 1020px to 1630px. That long page is evidence for the system, not an output canvas. When a source module exceeds 1320px, split it at a semantic boundary, shorten it, or continue it on the next slide. Never shrink the full long page into one stage and never increase the fixed stage height.

Use `overflow: hidden` on each slide. Fit the stage inside the viewport with a single uniform scale based on both available width and height. Keep the 750×1320 coordinate system intact for screen, presenter, export, and print paths.

## Overview

Clearproof Green translates a high-performing Chinese product-detail grammar into a disciplined presentation template. The source frame contains 16 sequential modules, 649 descendant layers, 195 text layers, 45 image fills, 22 instances, and 66 auto-layout nodes. Those numbers reveal the governing idea: this is not a sparse moodboard. It is a structured evidence narrative in which claims, mechanisms, measurements, imagery, instructions, and legal qualifiers all have defined jobs.

The system feels clean because it is selective, not because it is empty. White is the continuous field. Black carries hierarchy. Functional green identifies the outcome, active mechanism, or proof. Grays absorb secondary copy, diagram bodies, and compliance material. Photography moves between pristine pack shots, documentary skin evidence, sensorial foam or liquid, botanical macro imagery, and lifestyle scenes. No shadow is needed because contrast, crop, scale, and spacing create the hierarchy.

The recommended narrative arc is:

1. **Promise** — one quantified transformation and a hero product image.
2. **Problem** — four familiar user tensions, expressed with parallel captions.
3. **Benefit architecture** — three or four concise benefits before deep evidence.
4. **Mechanism** — formula, technology, or ingredient logic.
5. **Proof** — measured results, charts, user recognition, and matched before/after evidence.
6. **Experience** — texture, foam, scent, handling, or emotional outcome.
7. **Trust** — safety testing, patent, professional validation, or transparent qualification.
8. **Use** — step-by-step operation and realistic use contexts.
9. **Ecosystem** — combinations, bundles, or next-best products.
10. **Objection handling** — a direct Q&A close.

This framework generalizes beyond personal care. Replace ingredients with technical architecture, before/after photography with benchmark comparison, fragrance notes with experience attributes, and the product bundle with solution packages. Preserve the proof order even when the subject changes.

## Colors

### Palette

| Token | Value | Role |
|---|---:|---|
| Ink | `#000000` | Primary headings, body copy, rules, axes, and instructional labels |
| Near Black | `#101010` | Caption strips and near-black product accents |
| Functional Green | `#42B265` | Results, proof lines, active tags, data points, and full-width sensory bands |
| Botanical Green | `#588626` | Restricted secondary accent for ingredients or natural materials |
| White | `#FFFFFF` | Default slide field and high-contrast reversed text |
| Soft Surface | `#F5F5F5` | Evidence panels, pack-shot wells, and quiet diagram surfaces |
| Line Gray | `#DFDFDF` | Subtle dividers and inactive diagram construction |
| Pale Gray | `#D9D9D9` | Instructional illustrations and low-emphasis geometry |
| Cool Gray | `#B4B4B4` | Answers, secondary descriptors, and diagram bodies |
| Mid Gray | `#969696` | Legal notes and tertiary labels |
| Dark Gray | `#484848` | Ingredient labels and supporting text that must remain stronger than legal copy |

### Defaults

The default slide is white with black text. A typical information slide should feel approximately 70–80% white or image-negative-space, 15–25% black/gray structure, and no more than 5–10% functional green. These are perceptual targets, not pixel quotas.

Green is semantic. It marks the number that changed, the mechanism currently discussed, the active category tag, or a complete sensory footer. If every headline, icon, rule, and card becomes green, the proof hierarchy disappears. Botanical green is not a second brand primary; use it only where the subject is explicitly botanical and where the functional green would feel too synthetic.

Black and white may reverse over documentary imagery, but only after a controlled scrim or crop makes the text unambiguous. Avoid placing green type directly on foliage or translucent green product photography. The colors may match while the contrast fails.

### Surface Modes

1. **Editorial white** — the default for claims, evidence, steps, Q&A, and product combinations.
2. **Image-dominant** — photography fills most of the stage; text remains in a protected white area or on a deliberate scrim.
3. **Black caption** — a narrow near-black band anchors ingredient or texture names below a light photograph.
4. **Functional green band** — a full-width bottom band carries a concise triptych such as fragrance stages, service phases, or feature tiers.
5. **Soft proof panel** — pale gray groups evidence without adding a visible card border.

Do not invent dark-mode slides for variety. The source system relies on cumulative white continuity, and a random dark page breaks its calm, clinical rhythm.

## Typography

### Font Family

The audited Figma source uses **MAKE SENSE** in two styles: `70S` for nearly all display and body content and `45S` for a small amount of lighter supporting copy. The typeface is tightly set, neutral, and distinctly modern Chinese. It is a brand asset, not assumed to be publicly licensed.

When the source font is available, load it explicitly and map `70S` to the main text roles and `45S` to captions/legal copy. When it is unavailable, use `Noto Sans SC`, then `PingFang SC`, then `Microsoft YaHei`. Do not substitute a high-contrast serif, rounded display face, or playful geometric font: the system depends on blunt, low-drama sans-serif authority.

Latin-only step labels may use Arial because the source treats `STEP 1`, `TYPE 1`, `BEFORE`, and `AFTER` as utility language rather than brand display copy. Keep these labels neutral and never introduce a decorative monospace merely because the content is technical.

### Typography Scale

| Role | Size | Weight | Line Height | Typical Use |
|---|---:|---:|---:|---|
| Hero Display | 75px | 500 | 1.0 | Two-line promise, problem, or section claim |
| Display | 60px | 500 | 1.0 | Large result or shorter cover title |
| Headline | 45px | 500 | 1.0 | Evidence group, benefit, ingredient, or module title |
| Subhead | 30px | 500 | 1.0 | Product name, question, action verb, or strong support line |
| Body Large | 30px | 500 | 1.2 | Q&A answers and short explanatory paragraphs |
| Body | 24px | 500 | 1.25 | Captions, axes, qualifiers, product combination copy |
| Support | 20px | 500 | 1.25 | Labels around images and secondary descriptors |
| Caption | 15px | 300 | 1.0 | User-recognition labels, small chart copy, product details |
| Legal | 13px | 300 | 1.15 | Sources, patents, superscripts, and claim qualification |
| Stat Number | 60–70px | 500 | 1.0 | Percentages, counts, dates, and measured outcomes |

The audited source concentrates on 30px, 15px, 24px, 45px, 75px, 13px, and 20px. Preserve those stops instead of filling the interface with intermediate sizes. The tight scale creates repeatable rhythm across otherwise diverse page types.

### Defaults

Headings use sentence meaning, not title case. Chinese headings should read as natural phrases and usually require one deliberate line break. A two-line title should form two balanced semantic units; never allow automatic wrapping to leave a single punctuation mark, numeral, or short particle stranded.

Use black for the claim and green for the transformation-bearing fragment. If the headline already contains a large green number, keep the remaining words black. Gray is for explanatory hierarchy only; primary claims must not be gray.

Avoid bold-weight inflation. The source creates strength through 75px scale, dense glyph construction, and tight line height rather than a heavy 800–900 weight. If a fallback font appears too thin at 500, use 600 at most and retest line breaks.

### Signature Treatments

- **Two-beat claim:** two 75px lines, each a complete phrase, aligned to the 60px left rail.
- **Outcome highlight:** a black phrase ending in a green verb, metric, or improvement statement.
- **Metric opposition:** black metric label at left, large green result at right, separated from the chart by a 1px rule.
- **Utility tab:** `STEP`, `TYPE`, `BEFORE`, or `AFTER` in neutral Latin capitals; white on black or green.
- **Quiet answer:** black question followed by a cool-gray explanation, using whitespace rather than boxes.
- **Same-line source marker:** 13px superscript placed immediately after the qualified text, with its note anchored near the bottom rail.

### Typography Principles

1. One dominant claim per slide.
2. The claim must be readable before the audience inspects the image.
3. Every number includes a unit or an immediately adjacent explanation.
4. Supporting copy is short enough to scan without paragraph fatigue, except on the dedicated Q&A page.
5. Green identifies meaning; it does not simulate emphasis everywhere.
6. Footnotes remain attached to the claim they qualify.
7. English utility labels remain subordinate to Chinese content.
8. Titles and data values use optical alignment, not purely mathematical centering.

## Layout

### Canvas System

The stage is **750×1320px**. The standard content rail starts at x=60 and ends at x=690, producing a 630px working width. The main title begins at y=120 on most slides. A 60px bottom safety zone is reserved for sources, continuation cues, or clean termination.

Full-bleed product and lifestyle imagery may extend to x=0 or x=750, but text should return to the 630px rail unless a composition is intentionally centered. Content may cross the rail only when it is visual, never when it is long-form copy.

The standard two-column system is `310px + 10px + 310px`. It is used for before/after evidence, paired product crops, two-up feature images, and combination modules. The narrow 10px gutter is a signature: it makes the pair read as one comparison rather than two unrelated cards.

### Vertical Rhythm

The default sequence is:

- y=120: headline begins.
- y=270–330: headline resolves and the main visual or evidence region begins.
- y=330–1120: primary visual, chart, comparison, ingredient field, or instruction stack.
- y=1120–1260: secondary band, metric summary, product detail, or legal note.
- y=1260–1320: clean termination or bottom safety zone.

This is a rhythm, not a rigid template. A cover may devote most of the lower 900px to the product. A Q&A page may use the full vertical rail for four questions. A fragrance page may reserve the final 200px for a green note band. The title position and rail alignment create continuity across these variations.

### Page Families

1. **Hero product:** promise at top, product as dominant central object, quiet source at bottom.
2. **Problem grid:** title plus four equal documentary images with parallel labels.
3. **Benefit mosaic:** two full-width benefits above a two-column pair; each cell contains a short headline and support line.
4. **Mechanism hero:** one decisive formula or technology title, large sensory macro image, paired mechanism labels at the base.
5. **Measured proof:** headline, metric lockup, chart, before/after pair, source.
6. **User recognition:** product image on one side, stacked percentages and short recognition statements on the other.
7. **Ingredient field:** large white field with translucent material forms and orbiting labels; proof panel below.
8. **Sensory stage:** high-key photograph with a black or green bottom band.
9. **Trust page:** professional report, certification, or validation artifact floating in controlled space.
10. **Packaging page:** one large pack shot plus two equal detail crops.
11. **Instruction page:** three step rows separated by thin rules.
12. **Scenario sequence:** three cinematic crops with numbered occasion captions.
13. **Bundle page:** three stacked 630×288 product rows.
14. **Q&A page:** editorial title at left, numbered content grid below.

### Content Density

The source is information-rich but each individual region is simple. A slide may contain many proof labels, yet it should still communicate one decision. Use no more than four primary modules on a 1320px stage and no more than two competing data stories. If more evidence is required, continue the claim on a second slide rather than reducing all text.

Treat footnotes separately from body copy. A 13px source line may run across the full 630px rail, but it should not become a dense paragraph. If the source qualification exceeds two lines, move the detailed methodology to a dedicated appendix slide and retain a short source label in the main narrative.

## Evidence Architecture

### Claim Ladder

Every evidence slide should answer five questions in order:

1. What changed?
2. By how much?
3. Over what period or condition?
4. How was it observed?
5. What source or qualification limits the claim?

The visible headline usually answers the first question. The green metric answers the second. A chart axis, caption, or step label answers the third. Before/after photography, user recognition, or testing language answers the fourth. The bottom source note answers the fifth.

### Chart Grammar

Charts use black axes and labels with green data lines, bars, or points. Remove backgrounds, legends, thick grids, and visual effects. Label the exact endpoint the audience needs; do not force a presenter to decode a legend. For two-period evidence, use a single sloped line with points. For multiple outcomes, use short independent bars or separate compact charts rather than a crowded multi-series plot.

Percent reductions should preserve the sign when the source uses it. Do not turn `-56.35%` into `56% better` unless the semantic meaning and calculation are verified. Use at most two decimal places, and keep the same precision across comparable metrics.

### Before/After Evidence

Matched images must use equivalent crop, scale, lighting, body region, and orientation. Labels sit inside the image at the upper-left or lower band. A result line or chart should precede the image pair so the audience knows what to inspect. Never blur, beautify, recolor, or selectively sharpen one side of the pair.

When the image contains sensitive skin or medical-adjacent content, ensure the use is appropriate for the audience and jurisdiction. If image consent or provenance is uncertain, replace the pair with a neutral measurement diagram and list the missing evidence in the slide notes.

### Sources and Qualifications

Source markers use consecutive numerals. The full note appears on the same slide when possible. Do not recycle a marker across unrelated claims. Keep consumer-recognition claims distinct from instrumental measurements, clinical studies, patents, and ingredient-function explanations; each type implies a different level of evidence.

Never copy the source product's claims into a new deck as generic template text. The template defines placement and hierarchy only. Every number, duration, ingredient function, patent, and safety statement must be supplied and verified for the actual presentation.

## Image Direction

### Product Photography

Product renders are large, isolated, and physically convincing. Favor transparent glass, controlled condensation, liquid menisci, precise cap detail, and directional studio light. The hero object may tilt slightly to create upward energy, but product labels must remain legible. Use one product as the focus; multiple SKUs belong on a bundle or comparison page.

Do not place products inside decorative mock-device frames. Do not add arbitrary floating pills, sparkles, glow, or soft shadows. Water bubbles, foam, droplets, and botanical material are acceptable only when they describe the product experience or formula.

### Documentary Photography

Problem, evidence, and scenario imagery should feel observed rather than aspirational. Crops are tight, backgrounds are simple, and the subject connects directly to the caption. Problem grids may use a dark scrim because the copy is embedded. Evidence images should remain minimally altered. Scenario strips can be cinematic, but captions must remain the primary interpretive layer.

### Material and Ingredient Imagery

Ingredient imagery uses translucent, wet, or botanical forms against white. Cluster forms by scale and leave enough negative space for labels. Avoid stock-photo ingredient flat lays, generic laboratory beakers, or an evenly spaced icon grid. The source system treats ingredients as material evidence, not an inventory of decorative symbols.

### Cropping Rules

- Preserve the product silhouette and functional part being discussed.
- Use consistent crop ratios within comparisons.
- Allow deliberate edge exit for large botanical or liquid forms.
- Keep critical labels and anatomy away from the 60px safety boundary.
- Never stretch imagery to fill a module.
- If a source image cannot support the required crop, change the layout instead of degrading the asset.

## Depth and Elevation

### Flat by Default

The audited source contains no visible drop-shadow effects. Preserve that flatness. Hierarchy comes from size, overlap, crop, whitespace, and surface contrast. Cards do not float; proof panels sit directly on the white stage as pale gray fields.

### Permitted Overlays

A dark scrim of roughly 30–50% black may be used over documentary images with white text. A light scrim of roughly 40–50% white may separate pale gray type or diagrams from a complicated photograph. Scrims are legibility tools, not atmospheric filters.

### Forbidden Elevation

Do not use soft card shadows, glassmorphism, neumorphism, inner glows, floating browser windows, layered paper stacks, or halo effects. They introduce interface metaphors that are absent from the visual source and weaken the clinical/editorial character.

## Shapes and Treatment

### Border Radius

Use square edges for every structural module. Functional tags, cards, image crops, badges, and information panels stay at zero radius. Natural rounded geometry may appear only inside approved product, bubble, droplet, or material imagery; never recreate it as rounded UI chrome.

### Border Weights

Use 1px rules for charts, separators, and triptych dividers. A 2px border is acceptable only for a selected outline or an illustration that must hold at export size. Avoid heavy frames around photos, cards, and the slide itself.

### Decorative Element Types

- Transparent liquid spheres and droplets.
- Cropped botanical stems or leaves with realistic surface detail.
- Thin measurement lines, chart points, and simple axes.
- Flat gray instructional illustrations.
- Utility tabs such as `STEP 1`, `TYPE 2`, `BEFORE`, and `AFTER`.
- Small superscript evidence markers.
- Full-width black or green caption bands.

Avoid abstract blobs, gradients added without material meaning, decorative icon sets, sticker clusters, excessive badges, and background textures. The product and evidence already provide visual complexity.

## Content Modules

### Promise and Product

The opening slide combines a quantified promise with a single hero product. Keep the first line green only when it contains the concrete result; keep the emotional consequence black. Place the product name and one compact credibility line below the title, then give the lower two-thirds of the slide to the object. The source note sits at the bottom and should not compete with the product.

### Problem Grid

Use four images only when the four problems are genuinely parallel. Captions should follow the same grammar, such as `cause + consequence` or `occasion + problem`. Do not use a fifth item or an irregular card size. If the story contains three problems, switch to a three-strip scenario layout instead.

### Benefit Architecture

Introduce the benefit set before presenting evidence. Each benefit uses a 45px headline and a 20–24px explanation. Two wider benefits may span the full rail; two secondary benefits may share the bottom row. Do not place full charts on this overview page.

### Mechanism and Ingredients

Mechanism pages pair one decisive title with a visual that makes the material or process tangible. Use two named active ingredients, one technology stack, or up to six ingredient labels around a composition. If more items are required, group them by function rather than shrinking every label.

### Proof and Recognition

A measured proof page uses a chart plus matched evidence imagery. A recognition page uses large percentages plus a product or user image. Do not blend the two evidence types into one ambiguous chart. State whether the number is an instrument reading, a consumer survey response, an observed count, or another measurement.

### Sensory Experience

Foam, liquid, scent, and texture pages should be visually generous. One macro image may occupy most of the stage. Use a black bottom strip for paired material functions or a green triptych for fragrance stages. Avoid stacking small product claims over a sensorial image; sensory slides are pauses in the evidence rhythm.

### Trust, Patent, and Safety

Show a report, patent artifact, packaging detail, or validation result as a real object. Give it enough space to be recognized, but do not imply endorsement beyond the evidence. A patent number belongs in the legal note; a safety claim must identify the test and scope.

### Use, Scenario, and Ecosystem

Instruction pages use three steps with one action verb each. Scenario pages show where the product fits into real life. Bundle pages explain how related products combine. These three modules answer different user questions and should not be compressed into one busy closing slide.

### Q&A Close

Use Q&A to address real adoption friction, not to restate marketing claims. Four questions fit the standard stage when each answer is no longer than approximately four short Chinese lines. Longer policy, medical, or compatibility guidance should move to an appendix or reference sheet.

## Do's and Don'ts

### Do

- **Do preserve the 750×1320 stage.** Uniformly scale the finished slide; never reflow its contents for desktop or mobile.
- **Do keep the 60px side margins and 630px content rail.** Let only intentional photography or material forms bleed beyond it.
- **Do start most slides at y=120 with one two-line claim.** The repeated anchor creates coherence across diverse modules.
- **Do use functional green to identify the result, active mechanism, or selected category.** Every green element should have a semantic reason.
- **Do show the evidence chain.** Pair the claim with duration, method, source, and qualification rather than presenting a naked percentage.
- **Do match before/after crops.** Keep scale, orientation, lighting, and anatomical region comparable.
- **Do preserve the observed type stops.** Use 75/60/45/30/24/20/15/13px instead of inventing many near-duplicate sizes.
- **Do use square, flat surfaces.** Let whitespace, rules, and image crop create separation.
- **Do make image roles distinct.** Pack shots sell form, documentary images prove, ingredient images explain, and lifestyle images contextualize.
- **Do keep labels grammatically parallel within grids and sequences.** Repetition should feel intentional and scannable.
- **Do attach every superscript to a visible source note.** Missing or orphaned markers are a QA failure.
- **Do split overloaded source modules into additional slides.** The fixed stage is a design constraint, not a reason to shrink content.
- **Do use real presentation content in previews.** A viewer should recognize the intended use without seeing implementation labels.
- **Do retain generous white intervals between proof-heavy pages.** Sensory or product pages provide necessary pacing.

### Don't

- **Don't copy the 22001px long page into a single slide.** It becomes unreadable and violates the fixed-stage contract.
- **Don't paint the whole deck green.** The accent loses meaning when it becomes the default text or background color.
- **Don't use shadows, glow, glass panels, or floating cards.** The system is intentionally flat and editorial.
- **Don't round every image and panel.** Rounded UI language conflicts with the source's square evidence modules.
- **Don't use generic health, science, or leaf icons as decoration.** Prefer real material imagery, measured diagrams, or no icon at all.
- **Don't place text on a photograph without a protected contrast zone.** Color similarity is not legibility.
- **Don't compress a chart into a dashboard.** Show the exact comparison required for the claim and remove redundant chrome.
- **Don't mix survey recognition, instrument measurements, and clinical outcomes under one undifferentiated heading.** Name the evidence type.
- **Don't alter evidence imagery to exaggerate a result.** No selective retouching, lighting shifts, smoothing, or inconsistent crops.
- **Don't let automatic wrapping decide Chinese headline rhythm.** Set semantic line breaks and inspect punctuation.
- **Don't shrink legal notes below 13px on the 750px stage.** Move detail elsewhere if it cannot fit legibly.
- **Don't use the source product's percentages, ingredients, patents, or safety claims as placeholder facts.** Replace and verify every claim.
- **Don't combine instructions, lifestyle scenes, bundles, and FAQ on one closing slide.** Each module answers a different decision question.
- **Don't ship with generic labels such as `标题`, `TYPE`, or `Q&A` unless they are intentional audience-facing content.** Remove source placeholders.

## Responsive Behavior

### Scaling Behavior

The stage scales as one object. Use a wrapper that calculates a single scale factor from the available viewport width and height. Center the stage in the viewport and preserve the `25:44` aspect ratio. Internal type sizes, margins, and coordinates remain fixed in stage pixels.

Do not use container queries or viewport-relative type inside the stage. A 75px heading is always 75px in the authored coordinate system. The browser may render the complete stage at 50% or 125%, but the relationship between title, image, and footnote must remain identical.

### Component Breakpoints

There are no internal layout breakpoints. The two-column 310/10/310 grid does not collapse. The Q&A list does not become an accordion. The three-step diagram does not become a carousel. If the viewport is narrow, the stage is scaled down; if readability then becomes insufficient, the viewer should zoom or use a single-slide mode.

### Presenter Behavior

Navigation controls live outside the stage and must not cover the 60px safety margins. Keep next/previous hit areas large, but visually quiet. Page counters may sit in application chrome; do not add persistent navigation dots, progress bars, or browser UI inside the branded slide.

### Animation Triggers

Use restrained, evidence-preserving motion:

- Fade or rise the headline by 12–20px.
- Reveal metric, chart, and evidence image in that order.
- Draw a chart line once from start to endpoint.
- Stagger grid cells by no more than 80ms.
- Crossfade matched before/after images only when both remain inspectable.
- Keep product movement slow and under 3 degrees or 20px.

No bounce, elastic easing, continuous bobbing, spinning ingredients, liquid shaders, or looping chart animation. Motion must clarify sequence, not simulate efficacy.

### Print Behavior

Print one stage per page with backgrounds and images preserved. White slides should remain white rather than acquiring a gray browser canvas. Disable transitions, animated masks, and video. If the deck uses a source-dependent web font, embed it or rasterize only after confirming text remains searchable where accessibility requirements apply.

## CJK & International Content

### Recommended Chinese Pairing

| Role | Preferred | Fallback |
|---|---|---|
| Display / Body | MAKE SENSE 70S | Noto Sans SC Medium, PingFang SC Medium, Microsoft YaHei Semibold |
| Captions / Legal | MAKE SENSE 45S | Noto Sans SC Regular, PingFang SC Regular, Microsoft YaHei Regular |
| Latin Utility | Arial Regular | Inter Regular, system-ui |

The source uses one family across nearly all roles. Preserve that unified voice. Avoid mixing Chinese serif body text with sans-serif headlines, or combining several fashionable CJK families on the same slide.

### Mixed-Content Strategy

Chinese carries the narrative. English is used as a compact utility language for labels such as `BEFORE`, `AFTER`, `STEP`, `TYPE`, `Q&A`, and selected product naming. Do not translate every Chinese heading into English on the same slide; the duplicate copy consumes the vertical rhythm and weakens hierarchy.

Latin product names and percentages should align optically with nearby Chinese. Keep digits upright, use the percent sign without a space unless the chosen locale requires otherwise, and retain the source's precision. Avoid full-width Latin characters.

### Loading

Declare the full CJK fallback stack and wait for fonts before measuring or animating text. A fallback swap can change Chinese line breaks, answer height, and metric alignment. For HTML output, preload only the weights actually used. If MAKE SENSE is an internal font, store it in the approved brand asset path and document its license; do not fetch an unofficial copy from the web.

### Universal CJK Adjustments

- Set headline line height to approximately `1.0`; add optical breathing room through block spacing, not leading.
- Use explicit `<br>` boundaries for two-line claims after editorial review.
- Prevent line starts with closing punctuation and line ends with opening punctuation.
- Avoid orphaned numerals, units, and superscript markers.
- Keep body copy near 1.2–1.3 line height; Q&A answers need enough space to separate dense strokes.
- Do not use artificial letter spacing to make Chinese look premium. Tighten display copy only after testing the actual font.
- Keep Chinese emphasis typographic or color-based; do not rely on italics.
- Use localized punctuation and full-width Chinese marks in Chinese sentences.
- Test simplified Chinese at 100%, 75%, and the smallest expected presenter scale.

### Aesthetic Notes for This System

The visual authority comes from large Chinese sans-serif headlines set against open white fields. CJK density is not a problem to hide; it is the structural mass of the page. Green phrases, gray answers, and Latin utility tags create secondary rhythm around that mass.

For Japanese or Korean adaptations, preserve the 630px rail and stage scale but re-edit line breaks rather than forcing the Chinese composition. Do not assume the same glyph count fits a title block. The utility-label system can remain Latin if appropriate to the brand.

### Known CJK Gap

The MAKE SENSE font observed in Figma is not bundled with this template. Fallback metrics will change title widths and may require new line breaks. A production implementation must either provide the licensed brand font or record approved fallback compositions for each page family.

## Preview Card Standard

The companion `preview.md` is deliberately shorter than this specification. It must contain enough information to select the template before loading the full design: identity, mood, density, scheme, best-fit use cases, one rich visual snapshot, palette, type, signature moves, CJK note, and rules for rendering a real first-slide preview.

The preview must not become a reduced design manual. Keep it around one substantial page. The full file remains responsible for exact tokens, component behavior, evidence ethics, responsiveness, implementation rules, and known gaps.

## Iteration Guide

1. **Define the decision.** Write the one conclusion the audience should retain from the slide.
2. **Choose the evidence type.** Separate claim, mechanism, measured result, recognition, sensory experience, trust artifact, instruction, scenario, bundle, or objection.
3. **Select one page family.** Do not hybridize several modules before the primary hierarchy is stable.
4. **Lock the rail.** Establish 750×1320, x=60/690, y=120, and the 630px content width before styling.
5. **Set the title first.** Use one or two semantic lines at 75px; verify the fallback font before continuing.
6. **Place the primary proof or image.** Give it enough scale to perform its role without decoration.
7. **Apply green semantically.** Highlight the outcome, active mechanism, or selected category and nothing else.
8. **Attach qualification.** Add duration, method, unit, source marker, and footnote while the claim is still visible.
9. **Split overflow.** If the content extends below the bottom safety zone, continue on another slide instead of shrinking.
10. **Add minimal motion.** Reveal the reading order and keep evidence simultaneously inspectable.
11. **Run CJK QA.** Inspect punctuation, orphan characters, product names, numerals, superscripts, and legal line breaks.
12. **Run stage QA.** Capture every slide at 750×1320 and at the smallest expected uniform scale; compare positions, crops, and contrast.

## Known Gaps

1. **Font availability:** MAKE SENSE 70S/45S was observed in the source but is not distributed with this template; licensing and loading remain implementation tasks.
2. **Asset package:** the template describes product, liquid, botanical, skin-evidence, and lifestyle imagery but does not include those source assets.
3. **Brand isolation:** the Figma source includes brand-specific product forms and words. A new implementation must replace them instead of recreating protected artwork as generic template content.
4. **Source slice heights:** the audited long page uses non-uniform modules from 1020px to 1630px. This specification normalizes the presentation stage to 1320px and therefore requires editorial splitting for several source modules.
5. **Variables:** no semantic Figma variable system was available from the audited node; color and spacing tokens here were reconstructed from observed properties and repeated geometry.
6. **Placeholder remnants:** the source contains hidden layers and at least one draft-like title layer. Production slides must remove unused, hidden, or placeholder content.
7. **Claim portability:** percentages, timelines, ingredients, patents, safety statements, and Q&A answers in the source are not reusable facts. They require project-specific verification.
8. **Minimum legal size:** 13px matches the source but can become difficult at small presenter scales. Use an appendix when qualification cannot remain legible.
9. **Evidence imagery:** before/after skin photography may involve consent, privacy, sensitivity, and jurisdiction-specific advertising requirements that this visual specification cannot resolve.
10. **Motion reference:** the Figma node is static. Animation guidance is an inferred presentation translation, not an observed source behavior.
11. **Accessibility:** the observed cool-gray answer text may not meet contrast expectations at every size and display. Darken it where required while preserving hierarchy.
12. **Sample implementation:** this folder provides `design.md` and `preview.md`; no production HTML or rendered reference slide is included yet.
