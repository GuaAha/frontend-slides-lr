---
version: "1.0.0"
name: "Aqua Mint Proof"
description: "A bright, cooling evidence system built from icy white space, aquatic mint accents, tactile spray imagery, and compact product-proof modules."
source:
  type: "figma-audit"
  file_key: "CEC2c3kp8JfmTpisy8lZvH"
  node_id: "1:3010"
  source_name: "清凉干爽香氛喷雾_150ml"
  audited_size: "750×15432"
  audit_summary: "12 source sections, 315 descendants, 93 text nodes, 77 image fills, 49 hidden nodes"
canvas:
  width: 750
  height: 1320
  aspect_ratio: "25:44"
  overflow: "hidden"
colors:
  frost: "#F6FAF9"
  paper: "#FFFFFF"
  ink: "#111614"
  copy: "#525C58"
  mist: "#DDEEE8"
  mint: "#47AD8D"
  mint_deep: "#2C856E"
  ocean: "#4173D1"
  ice_blue: "#C9E4EE"
  line: "#C9D9D4"
typography:
  display: "Arial, PingFang SC, Microsoft YaHei, sans-serif"
  body: "Arial, PingFang SC, Microsoft YaHei, sans-serif"
  numeric: "Arial Narrow, Arial, sans-serif"
  source_reference_only: "MAKE SENSE 70S; Helvetica Now Display Medium"
spacing:
  base: 10
  safe_x: 60
  safe_top: 120
  safe_bottom: 60
  section_gap: 38
  card_gap: 16
  micro_gap: 8
shadows:
  product: "0 24px 56px rgba(30, 96, 78, 0.18)"
  glass: "0 10px 30px rgba(46, 126, 105, 0.12)"
components:
  - "AquaHero"
  - "MintClaimTag"
  - "BenefitRail"
  - "ApplicationMap"
  - "MechanismCutaway"
  - "CoolingMetric"
  - "ScentHorizon"
  - "ProofLedger"
  - "BotanicalQuartet"
  - "SprayDirectionDemo"
  - "SituationStrip"
  - "ProductSelector"
  - "SourceNote"
  - "PageMarker"
---

# Aqua Mint Proof

## Mandatory Fixed-Brand Override

This block overrides every conflicting reference value later in this file.

- Canvas: fixed `750×1320`, uniformly scaled without internal reflow.
- Safe area: top 120px / right 60px / bottom 60px / left 60px; every authored headline begins at y=120px.
- Chinese type: 75 / 45 / 45 / 30 / 15px for headline / subheadline / label / description / disclaimer, with 100% line height and -5% letter spacing. Metrics and proof numerals use the same five levels.
- Corners: every authored webpage layer uses `border-radius: 0`; cards, tags, controls, CSS/SVG fields, and image masks have square corners.
- The palette declared in this design is the color authority for the selected template. Use its declared `light` or `dark` tone and do not introduce colors outside this palette unless the user explicitly approves a palette change.
- Product-detail logo: do not add a separately authored brand-logo layer.
- Images: CSS visuals are allowed when selected; supplied or authorized images may be processed and rectangularly cropped while originals are preserved. Never use a rounded crop or mask.

## Fixed Stage Contract

Every page is authored on a fixed `750×1320` stage. The stage may be scaled uniformly for preview, export, or projection, but its internal coordinates, type sizes, crop logic, and spacing do not reflow. Keep all authored copy inside x=60–690 and y=120–1260. Background photography may bleed to the edge; captions and proof labels may not.

This is a clean product-evidence system, not a generic wellness theme. Its signature comes from five relationships: near-white air, decisive black type, one cool mint claim color, watery imagery, and proof blocks that remain visibly separate from atmosphere.

## Overview

The audited source is a long-form product detail page about cooling, dryness, deodorizing, scent, skin feel, and spray ergonomics. It alternates pale editorial sections with one immersive oceanic fragrance chapter. The reusable system preserves that rhythm while removing product-specific claims.

The recommended deck arc is:

1. Open with a single cooling promise and a tactile product crop.
2. Name the uncomfortable situation in plain language.
3. Summarize three or four benefits without pretending they are all the same kind of evidence.
4. Show where and how the product or method is applied.
5. Explain the physical mechanism with one controlled diagram.
6. Isolate a cooling, comfort, or mildness metric.
7. Change atmosphere for the scent or emotional chapter.
8. Return to white for test data and source notes.
9. Introduce ingredients as roles, not decoration.
10. Demonstrate package ergonomics or operating direction.
11. Close with situations, selection logic, or a concise recommendation.

For short decks, keep steps 1, 3, 5, 7, 8, and 11. For training or internal review, expand the evidence and operation steps rather than duplicating hero pages.

## Visual DNA

### Temperature

The page should feel cool before the audience reads the word “cool.” Use frosted whites, condensation, translucent liquid, mist, pale blue shadows, or wet mineral surfaces. Avoid default cyan gradients and medical-blue dashboards. Mint is the operating accent; ocean blue appears mainly where the narrative moves into water, fragrance, or duration.

### Contrast rhythm

Most pages are 70–85% light. Black type carries authority. Mint is reserved for the first phrase, a proof number, a directional mark, or a small field—not every heading. One full-bleed ocean or deep-water page may appear as an emotional reset, after which the deck returns to disciplined white.

### Product scale

Hero product imagery should occupy 35–55% of the stage and may cross an internal grid line. Secondary pages use smaller pack shots as anchors, never as repeated lower-right logos. A product shadow should look like colored light passing through cold air, not a generic card elevation.

## Color System

### Core palette

- `frost #F6FAF9` is the default canvas. It is less clinical than pure white and lets transparent water forms remain visible.
- `paper #FFFFFF` supports specimen panels, proof ledgers, and image mats.
- `ink #111614` is used for primary headings, critical labels, and diagrams.
- `copy #525C58` supports body text and non-critical metadata.
- `mint #47AD8D` is the main claim accent.
- `mint_deep #2C856E` is for small text, thin rules, and accessible labels on light backgrounds.
- `mist #DDEEE8` builds zones, panels, and low-contrast cooling fields.
- `ocean #4173D1` is a secondary narrative color, not a co-equal brand accent.
- `ice_blue #C9E4EE` is permitted in photographic transitions and data-area fills.

### Ratios

On a normal light page, target 72% frost/paper, 18% image or mist field, 8% ink, and no more than 2% saturated mint. On an atmospheric scent page, ocean imagery may cover 65–100%, with copy placed on a calm region or a restrained translucent veil.

### Accessible pairs

Use ink or mint_deep on frost. Use white on mint_deep or sufficiently dark ocean photography. Do not set body copy in mint on white. Never rely on mint versus blue alone to encode categories; pair color with labels, shapes, or ordering.

## Typography

The source uses proprietary display faces as visual reference only; they are not assumed to be bundled. The internal template uses a robust CJK stack and achieves character through scale, line breaks, tracking, and contrast.

### Scale on 750×1320

- Headline: 75px for hero, section claim, and primary proof number.
- Subheadline: 45px for the secondary claim or strong support line.
- Label: 45px for card titles, prominent evidence labels, and benefit names.
- Description: 30px for body copy, qualifiers, and concise explanations.
- Disclaimer: 15px for captions, eyebrows, source notes, methods, and legal copy.

Every Chinese role uses 100% line height and -5% letter spacing. Metrics and proof numerals use the same five levels rather than introducing oversized exceptions.

### Hierarchy rules

Lead with one sentence, not a stack of slogans. A colored first phrase can establish the cooling benefit, followed by black completion text. Avoid using both a giant number and a giant title unless one is clearly subordinate. When a page contains a test result, make the result the display element and reduce the rhetorical heading.

### CJK line breaking

Write Chinese headlines as semantic units. Preferred breaks are benefit / qualifier or action / outcome. Avoid leaving a one-character line, splitting a number from its unit, or separating a negation from the verb it modifies. English scent names may be smaller supporting labels; they should not displace Chinese meaning.

## Layout System

### Base grid

Use a 6-column internal grid between x=60 and x=690. Columns are separated by 14–18 px gutters. Most content uses either a 3/3 split or a 2/4 asymmetry. Start the main claim at y=120; do not place authored identity text above it.

### Vertical zones

The stage can be divided into:

- Identity and claim zone: 120–330
- Evidence or image zone: 350–1060
- Source and page marker zone: 1100–1260

These are guides, not boxes. A full-bleed image may ignore them; type still respects the safe area. Maintain at least 34 px between a headline and the next semantic group, and 18 px between card elements.

### Density

Light pages may contain one hero image plus two small proofs, or one mechanism plus four compact labels. They should not contain a hero image, four benefit cards, a chart, and a method note simultaneously. A practical ceiling is 85 Chinese characters of body copy per page, excluding source notes.

## Component Specifications

### AquaHero

Use frost or an extremely pale vertical mint gradient. Place a short black claim in the upper-left or upper-center. A `MintClaimTag` may sit above it, but should not look like a commerce badge. Anchor one large pack shot in the lower half and let translucent liquid, glass ribbon, or mist create motion behind it. Preserve at least one calm area so the product silhouette reads immediately.

### MintClaimTag

A compact zero-radius field, underline, or open rule with mint emphasis and dark text. It carries a category, one qualifier, or a verified status. Maximum recommended length is 10 Chinese characters. Use one per page at most; never turn it into a capsule or rounded badge.

### BenefitRail

Use three or four benefits aligned horizontally or as a 2×2 field. Each benefit contains a 45px label and one 30px qualifier. Benefits that describe experience, mechanism, and test evidence must be labeled accordingly. Do not flatten unlike evidence into identical icon cards.

### ApplicationMap

Pair a human crop or silhouette with 3–5 application zones. Use hairline leaders in mint_deep and concise labels. The figure should occupy at least half the stage height; the labels need a consistent side or orbit. For sensitive-body contexts, keep the framing factual and non-sensational.

### MechanismCutaway

Show a simple before/action/after or surface/cause/result sequence. One material layer, one active process, and one outcome are enough. Use mint to identify the intervention and gray for baseline conditions. Add a visible “示意图” or equivalent note when the visual is conceptual.

### CoolingMetric

Use one large number, a compact unit, and one-sentence interpretation. The method, sample, time window, and source live below in small type. If no verified numeric result exists, replace the number with a qualitative scale and label it honestly.

### ScentHorizon

This is the deliberate atmospheric break. Use ocean, wave, condensation, or horizon imagery, ideally with a broad calm region. Place the fragrance name and 2–4 notes in a low-contrast typographic constellation. Do not turn the page into a perfume pyramid unless the narrative truly needs top/middle/base notes.

### ProofLedger

Return to white. Use a left-aligned result, a thin mint rule, and a right or lower method panel. A small chart may be included if it answers a clear question. Axis labels, baseline, unit, sample, and time period are mandatory. The source note is visually quiet but never hidden.

### BotanicalQuartet

Four ingredient roles appear as specimens rather than decorative leaves. Use consistent image crops and write one functional role per ingredient. Ingredients are supporting logic; they do not replace outcome evidence.

### SprayDirectionDemo

Use two or three sequential pack diagrams to show direction, angle, distance, or hygiene design. Arrows should be thin and operational. Keep product geometry consistent between frames. If the source package supports multiple directions, distinguish them by viewpoint and caption rather than dramatic perspective.

### SituationStrip

Use three photographic or illustrated situations with a shared horizon and identical label position. The situations should represent different contexts, not three nearly identical lifestyle images. A single close line can summarize the selection principle.

### ProductSelector

Compare no more than four options. Use rows for scenario, feel, intensity, and format; highlight the recommended column with mist, not a heavy border. When only one product exists, turn this component into a “when to use” decision strip.

### SourceNote and PageMarker

Source notes use the 15px disclaimer level and sit inside the safe area. Page markers are optional and may use `03 / 12` or a concise chapter name. Do not use them as decorative noise on every page if the deck is shorter than six slides.

## Page Blueprint Library

These blueprints are composition contracts, not mandatory sequence. Each keeps one dominant message and specifies the minimum content needed to make the page useful.

### A01 — Cold Promise

- Eyebrow identifies category or audience, never an unsupported award.
- Headline contains an action and an outcome in no more than three lines.
- One mint phrase identifies the functional difference.
- Product and translucent gesture occupy the lower 55–65%.
- Source or qualifier appears only if the headline contains measured language.

### A02 — Situation Tension

- Start with one uncomfortable context and one human consequence.
- Use two or three situation crops sharing scale and horizon.
- Keep the page empathetic; do not dramatize bodies or sweat marks.
- Close with a transition question or resolution sentence.
- Do not introduce mechanism details yet.

### A03 — Four-Benefit Map

- One overview claim explains the shared promise.
- Four cells use parallel grammar and 16–28 characters each.
- Each cell is tagged experience, mechanism, design, or evidence when useful.
- A single model or product image binds the grid.
- A lower band may carry the benefits if the upper image remains calm.

### A04 — Application Geography

- A figure or object map occupies at least 55% of the page.
- Three to five leaders terminate at specific, non-overlapping locations.
- Every label begins with an action verb or anatomical/object name.
- Distance, angle, avoidance, or sequence is shown where relevant.
- Sensitive or medical contexts require neutral framing and review.

### A05 — Mechanism Story

- State the baseline condition in one sentence.
- Diagram only the layers and process needed for the claim.
- Show intervention in mint and preserve gray for baseline.
- End with one interpreted outcome, not a second headline.
- Add schematic and evidence-status notes close to the diagram.

### A06 — Cooling or Comfort Result

- Use one result number or qualitative intensity scale.
- Place unit and comparator on the same visual line.
- Add method, population or sample, timing, and source below.
- A small product or application crop may support context.
- Do not include fragrance notes or ingredient roles here.

### A07 — Aquatic Scent Pause

- Full-bleed image establishes horizon, spray, or condensation.
- One scent name and up to four notes occupy a quiet area.
- A single mood sentence translates notes into experience.
- Keep proof and sourcing minimal unless a duration claim appears.
- The next page must return to a light evidence field.

### A08 — Proof and Choice

- Lead with the decision the evidence supports.
- Use one chart, matched comparison, or method ledger.
- Make qualifiers as easy to find as the large outcome.
- A selector below may compare no more than four scenarios.
- Close with a recommendation rule, not a promotional slogan.

## Copy Architecture

### Claim formula

Use `[action or experience] + [qualified outcome]`. Examples of structure include “快速降温，保持清爽体感” or “一喷覆盖，减少重复操作”; they are language patterns, not approved claims. Avoid chains of four-character phrases that lack a verb.

### Mechanism formula

Use `[baseline condition] → [intervention] → [observable consequence]`. If the intervention is only proposed or ingredient-based, say “用于说明” or “作用路径示意” rather than writing causal certainty.

### Evidence formula

Use `[result] + [population/object] + [method] + [time] + [source]`. The display line may contain the result and subject; the remaining fields stay immediately beneath it. Never detach a dramatic number from its measurement definition.

### Experience formula

Use sensory words that can be understood without pretending they are instrumental measurements: cool, dry, light, fine, clean, or aquatic. Clarify whether the wording comes from expert assessment, participant reporting, or editorial positioning.

### Decision formula

Use `If [situation], choose/use [option] because [criterion]`. A selection page succeeds when a reader can act without decoding marketing adjectives.

## Production QA Gates

Before approving an Aqua Mint Proof deck, verify:

1. Every stage reports 750×1320 in its authored coordinates.
2. Scaling is uniform and no internal breakpoint changes the layout.
3. No light page uses more than one saturated mint focal point.
4. Body copy meets contrast requirements on frost, mint, and photography.
5. Every headline has a deliberate semantic line break.
6. No benefit grid mixes evidence types without labels.
7. Every diagram says whether it is schematic.
8. Application leaders terminate at unambiguous targets.
9. Product direction, angle, and scale remain stable across sequences.
10. The scent page appears only when it advances the story.
11. Ocean photography contains a calm text region or local scrim.
12. Each numeric result retains method, unit, sample, and time.
13. Charts show baseline, axes, and readable labels.
14. Ingredient roles do not overstate outcome evidence.
15. Source notes remain legible at actual export size.
16. Images have documented rights and appropriate consent.
17. Source-specific product marks and claims have been replaced.
18. Motion stops before detailed reading begins.
19. Reduced-motion mode reveals the complete final state.
20. PDF, projector, and mobile previews preserve water-edge detail.

## Evidence and Content Discipline

Separate four content types:

1. Promise: what the page wants the audience to understand.
2. Mechanism: how the effect is proposed to happen.
3. Experience: what use feels, smells, or looks like.
4. Evidence: what was actually measured, observed, certified, or sourced.

These may coexist but must not borrow each other’s authority. A cool photograph cannot prove a temperature reduction. An ingredient illustration cannot prove an outcome. A test number must keep its qualifier and method. When adapting the template to internal strategy, replace product claims with actual project data or clearly marked placeholders.

## Image Direction

Preferred assets include pale product cutouts, translucent films, mist, controlled condensation, water horizons, blue-green glass, skin-safe application imagery, and clean botanical specimens. Keep highlights cool and shadows slightly green-gray. Crop human figures decisively; avoid floating stock-photo rectangles.

Masking should feel physical: liquid ribbons may cross behind a product, mist may soften an edge, and a wave may create a full-page horizon. Never apply arbitrary blobs around text. Use one image treatment per page and repeat it across the chapter for continuity.

## Depth and Effects

Depth is shallow and luminous. Use the product shadow token only for a major cutout. Glass fields may use a 1 px white highlight, a 1 px mint-gray border, and restrained blur. Source audit found blur and one drop shadow, but this does not justify widespread frosted-glass UI. Editorial planes should remain crisp.

Avoid heavy black shadows, embossed icons, neon outer glows, and multiple blur layers. If an image already contains condensation or haze, reduce synthetic effects around it.

## Shapes and Iconography

Shapes come from spray cones, droplets, horizon lines, and thin circles present inside approved imagery. Every authored specimen panel, card, tag, crop, and color field uses zero-radius corners. Icons should be monoline, 1.5–2 px at this canvas, with flat caps. Use a single icon family.

## Do

1. Do establish cooling through the whole palette and imagery before adding a mint wordmark.
2. Do keep the main claim to one sentence and give it a deliberate two- or three-line break.
3. Do reserve saturated mint for one claim, number, or route per page.
4. Do identify whether each benefit is a promise, experience, mechanism, or measured result.
5. Do show method, unit, sample, and time window beside quantitative proof.
6. Do use a full-bleed water or fragrance page as a single chapter transition.
7. Do return to white after the atmospheric page so evidence regains authority.
8. Do keep product silhouettes large enough to read their physical operating features.
9. Do label conceptual mechanism imagery as schematic.
10. Do align application labels to a consistent edge or orbit.
11. Do use ingredient imagery to explain roles, not to imply unverified efficacy.
12. Do keep CJK source notes legible at export size.
13. Do use the fixed 750×1320 stage and scale it uniformly.
14. Do replace all source-specific claims and data before reuse.

## Don't

1. Don't turn the system into a generic teal SaaS dashboard.
2. Don't use mint body copy on white or pale mint backgrounds.
3. Don't place every benefit in an identical rounded icon card.
4. Don't use ocean photography on every page; it removes the chapter contrast.
5. Don't present sensory imagery as proof of measured cooling or duration.
6. Don't strip qualifiers, footnotes, baselines, or units from a large number.
7. Don't place text over busy foam, droplets, or spray without a calm field.
8. Don't combine more than one hero image treatment on a single page.
9. Don't use decorative leaves when ingredient role is not discussed.
10. Don't overuse blur, glass panels, glows, or cold-gradient backgrounds.
11. Don't let a product selector become a dense commerce comparison table.
12. Don't split Chinese numbers from units or leave a one-character headline line.
13. Don't reflow the internal stage at different viewport sizes.
14. Don't reuse the audited page’s proprietary fonts, logos, awards, or claims as bundled assets.

## Responsive, Presenter, Animation, and Print

### Responsive shell

The HTML shell centers the fixed stage and computes one uniform scale from available width and height. It may add a neutral outer background. It must not change internal columns or crop the stage. On small screens, allow vertical page-to-page scrolling rather than internal reflow.

### Presenter mode

Presenter mode may show notes and navigation outside the stage. Keep navigation clear of all content. If a section label is needed, expose it to the presenter shell rather than duplicating it inside each slide.

### Motion

Use 300–700 ms dissolves, gentle upward reveals, one spray-line draw, or one sequential mechanism step. Stagger labels by 70–110 ms. Do not animate every droplet or run continuous water loops behind proof text. Respect `prefers-reduced-motion` by replacing motion with final-state visibility.

### Print and export

Flatten blur cautiously and confirm transparent water assets retain edges. Keep footnotes at the 15px disclaimer level on the 750-wide source stage. Test white-on-ocean copy in grayscale. Export without the outer responsive shell.

## CJK Content Guidance

Prefer concise verbs and concrete outcomes. Use Chinese punctuation consistently and avoid mixing full-width and half-width punctuation in one block. Numerals may remain Arabic when they are data; units attach to numbers. English scent or technical names should be supporting metadata, not oversized decoration. For bilingual pages, assign one language as primary and keep the other within 55–70% of its size.

## Iteration Guide

Start with a six-page skeleton: hero, benefit overview, mechanism, experience, proof, decision. Audit each page for a single dominant object and a single evidence type. Then add only the chapters the story requires: application, scent, ingredients, package operation, or use situations.

During review, temporarily remove all images. The text hierarchy should still reveal the narrative. Then remove all text. The image sequence should still move from cold promise to explanation, atmosphere, evidence, and choice. If both tests fail, the deck likely relies on decoration instead of structure.

## Known Gaps

The audit was performed on a composite Figma board rather than original layered production files or research documentation. Hidden nodes, image-internal typography, blend modes, precise asset licenses, and exact testing methodology were not independently verified. The two source typefaces are references only and are not packaged. Long source sections must be split into multiple fixed slides. All brand marks, claims, certificates, fragrance descriptions, ingredient functions, duration statements, and comparison data require rights and factual review before reuse.
