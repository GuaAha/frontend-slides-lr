---
version: alpha
name: Noir Amber Clinical
description: >-
  A premium evidence system built on black fields, warm amber proof accents,
  high-contrast Chinese display type, documentary before/after imagery, and
  precise product application photography. Derived from a vertical scalp-care
  commerce story, it is suited to efficacy-led beauty, advanced wellness,
  material science, specialist products, and any presentation that must make
  technical proof feel serious, human, and luxurious without becoming ornate.
source:
  type: figma-audit
  fileName: "商详页面收集 ai分析用"
  nodeName: "健发修护防脱头皮精华液"
  nodeId: "1:5461"
  observedFrame: "750×12601.8"
  observedSlices: 10
  observedDescendants: 349
  observedTextLayers: 75
  observedImageFills: 19
  observedInstances: 2
  observedAutoLayoutNodes: 25
  translationRule: "Translate the long commerce sequence into fixed 750×1320 stages; split the 1789px proof module and never compress the full long page."

colors:
  void: "#000000"
  near-black: "#0B0A08"
  warm-amber: "#F1E18D"
  copper-brown: "#8A6845"
  deep-brown: "#211A12"
  white: "#FFFFFF"
  fog-white: "#F5F5F5"
  quiet-gray: "#969696"
  line-gray: "#D1D1D1"
  soft-gray: "#E3E3E3"

shadows:
  flat: "none"
  amber-atmosphere: "radial-gradient(circle at 50% 75%, rgba(241,225,141,0.52), rgba(33,26,18,0.22) 46%, rgba(0,0,0,0) 72%)"
  black-scrim: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.72))"

typography:
  hero:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontStyle: "70S"
    fontSize: 75px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.04em
  section:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontStyle: "70S"
    fontSize: 45px
    fontWeight: 500
    lineHeight: 1
  label:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontStyle: "70S"
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1.1
  body:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontStyle: "70S"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.35
  evidence-marker:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', sans-serif"
    fontStyle: "70S"
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1
  legal:
    fontFamily: "'MAKE SENSE', 'Noto Sans SC', 'PingFang SC', sans-serif"
    fontStyle: "70S"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
  instruction-index:
    fontFamily: "'HYQiHei', 'Noto Sans SC', sans-serif"
    fontStyle: "70S"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.1

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
  evidence-gap: 20px
  legal-gap: 16px

canvas:
  width: 750px
  height: 1320px
  aspectRatio: "25 / 44"
  overflow: hidden
  defaultBackground: "{colors.void}"
  scaling: "uniform-stage-only"

components:
  noir-claim:
    width: 630px
    color: "{colors.white}"
    font: "{typography.hero}"
    maxLines: 3
    description: "Primary claim at x=60, y=120. One evidence-bearing line may switch to amber; all other lines remain white."
  amber-proof-phrase:
    color: "{colors.warm-amber}"
    description: "Outcome, material, percentage, or active mechanism highlighted inside a white headline. Never used for an unsupported emotional adjective."
  product-monument:
    width: 630px
    background: "{shadows.amber-atmosphere}"
    description: "A large product and pack composition on a black-to-amber atmospheric field. Packaging remains sharp and dimensional; atmosphere supports rather than obscures it."
  scalp-zone-map:
    width: 630px
    imageMode: documentary
    overlay: "white dashed contour"
    description: "A frontal scalp photograph with numbered focus zones and a concise application warning. Contours explain where to inspect or apply."
  matched-hair-pair:
    width: 630px
    itemWidth: 310px
    gap: 10px
    labelColor: "{colors.void}"
    description: "Before and after portraits or scalp crops with equivalent framing. White image fields sit directly on the black slide."
  efficacy-curve:
    width: 630px
    background: "{colors.void}"
    fill: "amber-to-brown gradient"
    axisColor: "{colors.white}"
    description: "A restrained time curve with week markers, endpoint emphasis, and the final result written near the terminal point."
  certification-stage:
    width: 630px
    description: "A report, patent page, seal, or test artifact shown as a recognizable physical object. Pair it with one trust headline, never an invented official badge."
  ingredient-filmstrip:
    width: 500px
    columns: 4
    imageTreatment: monochrome-macro
    labelColor: "{colors.white}"
    description: "Four small material crops with direct ingredient labels. Use as a mechanism overview, not as decorative texture."
  application-hero:
    width: 750px
    description: "A full-width hand-and-product photograph showing the applicator at the scalp or target surface. The action must be anatomically plausible."
  ampoule-feature-stack:
    width: 630px
    rows: 3
    description: "Three short advantages such as fresh seal, dosage control, and precise delivery aligned beside a single packaging photograph."
  fragrance-triptych:
    width: 630px
    columns: 3
    description: "Top, middle, and base notes set in three quiet columns over a dark botanical or material photograph."
  step-strip:
    width: 630px
    columns: 3
    labelBackground: "{colors.white}"
    labelColor: "{colors.void}"
    description: "Three illustrated use steps. Each cell contains one action and one short instruction; detailed warnings stay off the strip."
  advisory-list:
    width: 630px
    numberFont: "{typography.instruction-index}"
    description: "A numbered list for frequency, storage, timing, and precautions. It is the only long-copy page family."
  source-note:
    width: 630px
    color: "{colors.quiet-gray}"
    font: "{typography.legal}"
    description: "Bottom-aligned method, sample, period, patent, or qualification note connected to visible evidence markers."
---

## Frontend Slides Fixed-Stage Policy

Noir Amber Clinical is authored only at **750×1320px**. Scale the whole stage uniformly to fit a viewport; never reflow or restack internal content. The audited source is a 750×12601.8px commerce sequence with ten slices, including an evidence module 1789px high. Long modules must be split at a semantic boundary, shortened, or continued on the next slide.

Use overflow clipping on every stage. Keep typography, safe areas, chart geometry, and image crops fixed in stage pixels. Navigation and presenter controls belong outside the branded canvas.

## Overview

This system converts specialist efficacy into a premium dark narrative. Black is not a fashionable background applied everywhere; it is the controlled field that allows white claims, amber results, documentation, scalp photography, and transparent product forms to read with authority. The audited source contains 349 descendant layers, 75 text layers, 19 image fills, and a notably high count of vectors and lines. That structure reveals a system built from evidence overlays, charts, technical illustration, and instruction—not merely photography.

The narrative is most effective in this order:

1. **Quantified promise** — a time-bound outcome and a monumental product image.
2. **Root cause** — a biological, technical, or behavioral mechanism simplified into two linked problems.
3. **Measured progression** — matched evidence images plus a time curve.
4. **Trust layer** — certification, patents, test scope, and claim qualification.
5. **Mechanism matrix** — active materials and how each addresses the root cause.
6. **Delivery design** — packaging, dosage, precision, hygiene, or portability.
7. **Use experience** — texture, leave-on behavior, scent, and comfort.
8. **Technique** — a short three-step application sequence.
9. **Advisory close** — frequency, timing, storage, and precautions.

The system generalizes to specialist skincare, medical-adjacent wellness, advanced materials, performance supplements, premium hardware, and other products where the audience must believe both the mechanism and the evidence.

## Colors

### Palette

| Token | Value | Role |
|---|---:|---|
| Void | #000000 | Default slide field, evidence charts, premium contrast |
| Near Black | #0B0A08 | Subtle tonal separation inside dark compositions |
| Warm Amber | #F1E18D | Measured result, active material, mechanism highlight |
| Copper Brown | #8A6845 | Product atmosphere and secondary material depth |
| Deep Brown | #211A12 | Gradient anchor and warm-black transition |
| White | #FFFFFF | Primary display, labels, dividers, reversed copy |
| Fog White | #F5F5F5 | Documentary image wells and report surfaces |
| Quiet Gray | #969696 | Supporting copy, notes, secondary steps |
| Line Gray | #D1D1D1 | Technical rules and inactive chart construction |
| Soft Gray | #E3E3E3 | Instructional diagrams and low-emphasis panels |

### Defaults

Dark slides should feel 65–80% black, 15–25% photographic or document surface, and under 10% amber. White provides the reading structure. Amber carries proof or material warmth; it is not a general brand wash.

Use full white for the principal claim. Quiet gray may support a product name or explanatory line, but never the core outcome. Amber is allowed in one headline line, one chart fill, or one mechanism cluster per slide. If two amber systems compete, divide the content.

### Surface Modes

- **Noir evidence:** black field, white claim, amber result, documentary evidence.
- **Amber monument:** black-to-copper atmosphere behind pack and applicator.
- **White document well:** a certification or before/after image placed on a clean white rectangle.
- **Dark botanical:** close material photography with white/amber overlay labels.
- **Advisory white:** a white page may be used for long safety copy when dark gray text improves reading.

Avoid random alternating backgrounds. The source gains authority through sustained darkness and carefully timed white evidence surfaces.

## Typography

### Font Family

MAKE SENSE 70S is the primary observed family. HYQiHei 70S appears in a small subset of instructions. When licensed assets are unavailable, use Noto Sans SC, PingFang SC, or Microsoft YaHei. Preserve blunt, compact strokes and tight vertical rhythm.

Do not substitute a luxury serif. The premium quality comes from material photography, scale, and evidence discipline, not fashion-editorial ornament.

### Typography Scale

| Role | Size | Use |
|---|---:|---|
| Hero | 75px | Two- or three-line claim |
| Section | 45px | Mechanism, feature, action, result label |
| Label | 30px | Ingredient, week, step, product name |
| Body | 20px | Qualification and concise explanation |
| Evidence Marker | 40px | Asterisk or numbered proof marker |
| Legal | 15px | Source, scope, patent, and caution |

Keep line height close to 1.0 for large Chinese display text. A three-line claim may reach 225px but should remain a single thought. Explicitly break before the quantified outcome or mechanism shift.

### Signature Treatments

- White claim with one complete amber outcome line.
- Large amber percentage beside a small evidence marker.
- Gray product descriptor beneath the white claim.
- White labels inside black image or chart fields.
- Utility English such as BEFORE, AFTER, and STEP kept neutral and secondary.
- Patent or test markers connected to the smallest readable note on the same stage.

### Typography Principles

1. State the outcome before the mechanism.
2. Keep time period and percentage together.
3. Do not use amber on a claim that has no evidence.
4. Preserve Chinese semantic line breaks.
5. Keep product naming quieter than the benefit claim.
6. Limit a slide to one large numerical conclusion.
7. Do not let source notes merge with decorative copy.

## Layout

### Canvas and Rail

The standard content rail is x=60–690, width 630px. Most headlines begin at y=120. The main evidence or product region begins between y=330 and y=420. Reserve the lower 60–90px for source notes.

Full-bleed hair, scalp, hand, or botanical photography may escape the rail. Text, charts, and document surfaces return to it. The 310/10/310 comparison pair remains the default for before/after images.

### Page Families

1. **Product monument:** claim at top, pack and applicators dominating the lower stage.
2. **Root-cause diagram:** claim, short mechanism statement, two image-backed cause labels.
3. **Progression proof:** claim, target map, before/after pair, curve; often split into two slides.
4. **Patent and test:** large trust claim with report or certificate objects.
5. **Ingredient mechanism:** four-material filmstrip followed by application photography.
6. **Delivery design:** product format with three benefits and a precise use detail.
7. **Texture and scent:** one sensorial image, short experience line, fragrance triptych.
8. **Technique strip:** three actions with minimal labels.
9. **Advisory page:** numbered precautions with high reading contrast.

### Vertical Rhythm

Use 60px and 30px as major and minor intervals. Keep the claim block compact, then allow the main visual to occupy most of the remaining stage. Dense evidence slides should still include a clear pause between image evidence and chart evidence.

If a proof page contains a target map, a comparison pair, and a curve, split after the comparison pair when the chart would force notes below y=1260. Do not reduce 75px headings or 15px legal copy to force the original long-commerce module into the slide.

## Evidence Architecture

### Claim Contract

Every outcome slide must identify:

1. Measured change.
2. Time period.
3. Population or test scope.
4. Method or evidence type.
5. Qualification such as individual variation.

The headline may show the first two. The chart and captions show the third and fourth. The source note resolves the fifth. Missing any one of these changes the slide from proof to promotion.

### Scalp or Target Maps

Use dashed contours and simple numbers to identify regions. The map is explanatory, not diagnostic. Avoid red heatmaps, alarming medical colors, or simulated follicles unless the project provides verified scientific visualization.

### Progression Curves

Use one curve with week markers and a single endpoint. The amber fill may shift from bright to dark to imply accumulation, but the axis must remain readable. Do not smooth sparse measurements into false precision. If only three measurements exist, show three points connected by straight or gently interpolated segments and state the actual collection dates.

### Before/After Evidence

Match face, hair length, pose, crop, lighting, and styling conditions. Label regions that require focused inspection. Never use hairstyle changes as a substitute for measured density. Do not retouch flyaways, hairline, scalp exposure, or contrast differently between images.

### Patents and Reports

A patent proves ownership of an invention, not automatically its consumer efficacy. A report proves only the tested scope. Present each artifact with an accurate description and keep claim language proportionate to the document.

## Image Direction

### Product Imagery

Use dark transparent packaging, precise applicators, controlled specular highlights, and warm amber liquid. The pack may float or stand monumentally, but perspective and labels must remain credible. Avoid excessive glow or particles.

### Human Evidence

Hair and scalp photography must be direct, respectful, and technically comparable. Hands should show correct application pressure and direction. Faces should not become beauty portraits when the evidence is located on the scalp.

### Material Imagery

Ingredient crops are monochrome or low-saturation, wet, dense, and macro. They may appear in a four-cell filmstrip or one large field. Avoid decorative herb flat lays and laboratory clichés.

### Cropping

- Keep the target region fully visible.
- Do not cut the applicator tip from an application photograph.
- Maintain consistent before/after scale.
- Allow product packages to overlap atmosphere but not legal notes.
- Protect 60px side margins for all essential text.

## Depth and Elevation

The source uses no drop shadows. Preserve flat document surfaces and let the black field provide separation. Apparent depth comes from product lighting, transparent materials, gradients, and cropping.

Amber atmosphere is permitted behind a product monument. It must behave like light, not a blurred card shadow. Do not add glass panels, floating UI, neon outlines, or cinematic lens flares.

## Shapes and Treatment

Use square image wells and charts. Small 8px radii may appear on functional annotations. Product capsules and liquid drops keep their natural curvature; interface surfaces do not inherit it.

Technical diagrams use 1px lines, dashed contours, circles, and restrained arrows. Avoid thick infographic icons. STEP labels may use white rectangles on black, but they should not become pill buttons.

## Content Modules

### Promise

Pair a time-bound claim with one product monument. The legal note must remain visible. If the opening number is still provisional, replace it with a non-quantified benefit rather than using dummy data.

### Root Cause

Reduce complex science to two or three linked mechanisms and identify the intended scope. Avoid diagnosing the audience. Use a diagram, anatomical crop, or process pair to make the mechanism understandable.

### Proof

Separate evidence into visual observation, measurement trend, and participant evaluation. Use different slide families if more than two evidence types are present.

### Mechanism

Group active ingredients by function. The ingredient filmstrip introduces the set; the application hero shows delivery. Do not list every INCI item as if each carries equal efficacy.

### Product Delivery

Describe freshness, precision, dosage, hygiene, and portability only where the package design supports them. One photograph should show how the feature works.

### Technique and Advisory

Technique is three steps. Advisory is a numbered list. Do not merge them: action and caution require different reading speeds.

## Do's and Don'ts

### Do

- **Do preserve the exact 750×1320 stage and 630px content rail.**
- **Do use black as a continuous evidence field, not a fashionable background switch.**
- **Do reserve amber for a measured result, active material, or meaningful warmth.**
- **Do bind every time claim and percentage to a source marker.**
- **Do match before/after crops, lighting, hair condition, and pose.**
- **Do identify scalp or target zones with restrained contours and numbers.**
- **Do keep charts minimal and label the actual collection points.**
- **Do distinguish patent ownership, test result, and participant self-assessment.**
- **Do show packaging functions through real use photography.**
- **Do split oversized evidence modules across slides.**
- **Do keep application and advisory content separate.**
- **Do test all Chinese headline breaks with the actual approved font.**
- **Do keep legal notes readable at the smallest expected stage scale.**
- **Do obtain appropriate consent and provenance for human evidence imagery.**

### Don't

- **Don't compress the 12601.8px long page into one slide.**
- **Don't turn every headline amber or gold.**
- **Don't use a patent badge to imply untested efficacy.**
- **Don't smooth or decorate a curve beyond the actual measurement density.**
- **Don't retouch one side of a before/after pair differently.**
- **Don't use medical heatmaps or follicle diagrams without verified data.**
- **Don't add shadows, glass cards, neon glow, or luxury serif ornament.**
- **Don't shrink source notes below 15px on the authored stage.**
- **Don't mix survey, laboratory, and clinical claims without naming the evidence type.**
- **Don't let product atmosphere cover the applicator or label.**
- **Don't use decorative botanicals where a material mechanism is required.**
- **Don't combine technique, storage, timing, and safety into a tiny footer.**
- **Don't reuse the source product's percentages, patents, or ingredients as template facts.**
- **Don't allow automatic wrapping to break Chinese numerals or qualifiers from their claim.**

## Responsive Behavior

### Scaling

Render the slide as a fixed 750×1320 object and compute one uniform scale from available width and height. Never collapse comparison pairs, rewrap the claim, or convert steps into a carousel.

### Presenter

Controls remain outside the stage. Dark application chrome may blend with the slide, so provide a visible but restrained boundary around the viewport rather than placing navigation on the canvas.

### Animation

Reveal the white claim first, the amber outcome second, then evidence. Draw the progression curve once. Fade contours and markers together. Keep product motion under 20px and avoid fluid simulations that suggest a false mechanism.

### Print

Preserve black backgrounds and amber gradients. Confirm that white legal copy remains legible in PDF. Disable motion and export one stage per page.

## CJK & International Content

### Chinese Font Strategy

Use MAKE SENSE 70S when licensed. Use HYQiHei only for the instruction role where the source does so. Fallback to Noto Sans SC or PingFang SC and re-edit every headline because width and stroke density will change.

### Mixed Content

Chinese leads. BEFORE, AFTER, STEP, week numbers, and patent IDs are utility text. Keep English labels neutral and do not translate the entire claim twice.

### Adjustments

- Use explicit semantic breaks for 75px headlines.
- Keep line height near 1.0 for display and 1.2–1.35 for notes.
- Prevent asterisks and evidence numbers from wrapping alone.
- Keep DHT, PVP, patent IDs, and percentages on one line where possible.
- Use full-width Chinese punctuation in Chinese sentences.
- Avoid italics for emphasis.
- Test white and amber glyph edges against compressed black video or PDF output.

### Known CJK Gap

MAKE SENSE and HYQiHei are not bundled. Their fallback metrics may change the three-line claim, step labels, and chart annotation positions.

## Iteration Guide

1. Write one evidence-bearing conclusion.
2. Identify claim type and required qualification.
3. Choose the dark page family.
4. Lock x=60–690 and y=120.
5. Set the Chinese claim at 75px.
6. Assign one amber semantic highlight.
7. Place one primary proof or product image.
8. Add method, period, sample, and source.
9. Split any content below the safety zone.
10. Add only reading-order motion.
11. Inspect evidence ethics and image comparability.
12. Validate at 750×1320 and minimum presenter scale.

## Known Gaps

1. **Fonts:** MAKE SENSE and HYQiHei are observed but not bundled or licensed by this folder.
2. **Gradient reconstruction:** the amber atmosphere is derived visually because the audited node exposes several gradients without semantic tokens.
3. **Assets:** product renders, scalp photography, reports, ingredient macros, and diagrams are not included.
4. **Claim portability:** the source timeline, percentages, patents, and ingredient statements cannot be reused.
5. **Evidence ethics:** consent, privacy, and advertising requirements for hair/scalp imagery require project review.
6. **Long proof module:** the 1789px source slice requires at least two fixed-stage slides.
7. **No semantic variables:** tokens were reconstructed from repeated properties and screenshots.
8. **Static source:** motion behavior is inferred for presentation use.
9. **Legal scale:** observed notes may be difficult after uniform downscaling.
10. **Sample implementation:** this folder supplies documentation only; no HTML reference slide is included.
