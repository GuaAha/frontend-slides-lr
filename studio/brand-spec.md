# LR Brand Studio design contract

## Existing-work decision

- Mode: extension of the existing fixed-brand Skill into an internal Studio.
- Preserve: `brand/source.json` authority, MAKE SENSE typography, square geometry, safe areas, static slide contract, template provenance, and existing validation scripts.
- Improve: give users a visible three-proposal choice, structured editing, deterministic layout validation, revision recovery, and export feedback.
- Remove: content-driven page heights and template-owned palette authority because they contradict the confirmed fixed canvas and fixed-brand product.
- Protected contracts: plugin mirror flow, brand synchronization, template identifiers, validation entry points, and the no-authored-logo rule.
- Highest-risk change: normalizing every page to the fixed canvas; old variable-height fixtures and documentation must change together.

## Design Read

- Artifact: internal browser-based presentation editor and exporter.
- Audience: internal users who need brand-safe output without learning HTML or presentation engineering.
- Visual language: restrained operational tool wrapped around a high-contrast editorial canvas.
- Visual variance: 4/10 - stable editor grid; variation is concentrated in slide composition.
- Motion intensity: 1/10 - static slides and direct state feedback only.
- Information density: 7/10 - three working regions with progressive disclosure in the inspector and version panel.
- Asset dependence: 3/10 - the tool works with honest image slots; supplied images improve the deck but are not fabricated.
- Brand fidelity: 10/10 - canvas, type, palette, spacing, shape, and layout registry are enforced.

## Tokens and behavior

- Canonical tokens: `brand/source.json`; generated CSS and runtime files are derived outputs.
- Canvas: exactly `750 × 1320` CSS pixels on every page; only the outer stage scales.
- Typography: MAKE SENSE for authored Chinese slide content; neutral system typography is permitted only in the editor chrome.
- Palette: paper, surface, ink, muted, accent, accent dark, line, inverse, and inverse text from the brand source.
- Geometry: square corners; one-pixel tool borders; no ornamental elevation on slide content.
- Interaction: all edits update DeckSpec first; rendered DOM, PDF, and PPTX are projections of that state.
- Missing assets: display an explicit `IMAGE SLOT`; never imitate a logo, product, screenshot, or factual image with CSS.
