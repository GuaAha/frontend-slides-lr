#!/usr/bin/env python3
"""Generate fixed-brand artifacts and synchronize the packaged Skill mirror."""

from __future__ import annotations

import argparse
import base64
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "brand" / "source.json"
PLUGIN_ROOT = ROOT / "plugins" / "frontend-slides" / "skills" / "frontend-slides"

TEMPLATE_IDS = (
    "8-bit-orbit",
    "clearproof-green",
    "noir-amber-clinical",
    "aqua-mint-proof",
    "magnetic-gold-engineering",
    "monochrome-scent-lab",
    "blue-clay-clean",
)

TEMPLATE_FILES = (
    "templates/index.json",
    *(
        f"templates/{template_id}/{filename}"
        for template_id in TEMPLATE_IDS
        for filename in ("design.md", "preview.md")
    ),
)

MIRROR_FILES = (
    "SKILL.md",
    "viewport-base.css",
    "html-template.md",
    "animation-patterns.md",
    "agents/openai.yaml",
    "brand/source.json",
    "brand/impact-map.json",
    "brand/assets/MAKESENSE-70S.ttf",
    "brand/generated/brand-rules.md",
    "brand/generated/brand-tokens.css",
    "brand/generated/brand-runtime.js",
    "references/validation.md",
    "runtime/brand-runtime.template.js",
    *TEMPLATE_FILES,
    "scripts/extract-pptx.py",
    "scripts/export-pdf.sh",
    "scripts/validate-html.py",
    "scripts/validate-rendered.mjs",
    "scripts/validate-runtime.mjs",
    "package.json",
    "package-lock.json",
)

INVARIANT_FILES = (
    "SKILL.md",
    "html-template.md",
    "references/validation.md",
    "runtime/brand-runtime.template.js",
    "brand/generated/brand-runtime.js",
    "scripts/export-pdf.sh",
    "scripts/validate-html.py",
    "scripts/validate-rendered.mjs",
)

FORBIDDEN_ACTIVE_TEXT = (
    "1920×1080",
    "1920x1080",
    "1920 x 1080",
    "16:9",
    "1280×720",
    "1280x720",
)

DESIGN_CONTRACT_MARKER = "## Mandatory Fixed-Brand Override"
PREVIEW_CONTRACT_MARKER = "## Fixed-Brand Preview Override"
FORBIDDEN_DESIGN_GUIDANCE = (
    "radii may appear",
    "subtly rounded",
    "border-radius is reserved",
)


def load_source() -> dict:
    data = json.loads(SOURCE_PATH.read_text(encoding="utf-8"))
    required = (
        "schema_version",
        "approval_status",
        "brand",
        "canvas",
        "colors",
        "typography",
        "logo",
        "shape",
        "spacing",
        "motion",
        "density",
    )
    missing = [key for key in required if key not in data]
    if missing:
        raise ValueError(f"brand/source.json is missing: {', '.join(missing)}")
    if data["approval_status"] not in {"draft", "approved"}:
        raise ValueError("approval_status must be 'draft' or 'approved'")
    if data["canvas"] != {"width": 750, "height": 1320}:
        raise ValueError("the internal edition supports only a literal 750 × 1320 canvas")
    if data["shape"].get("corner_radius_px") != 0:
        raise ValueError("the fixed brand requires corner_radius_px = 0")
    spacing = data["spacing"]
    if (
        spacing.get("safe_top_px") != 120
        or spacing.get("safe_bottom_px") != 60
        or spacing.get("slide_padding_px") != 60
    ):
        raise ValueError("the fixed safe area must be top 120px / right 60px / bottom 60px / left 60px")
    typography = data["typography"]
    if typography.get("line_height_percent") != 100:
        raise ValueError("the fixed typography requires line_height_percent = 100")
    locale_rules = data["typography"].get("locale_rules", {})
    if set(locale_rules) != {"zh", "en", "vi", "th"}:
        raise ValueError("typography.locale_rules must contain exactly zh/en/vi/th")
    required_levels = {"headline", "subheadline", "label", "description", "disclaimer"}
    for locale, rule in locale_rules.items():
        if set(rule.get("styles", {})) != required_levels or set(rule.get("sizes_px", {})) != required_levels:
            raise ValueError(f"typography.locale_rules.{locale} must define all five levels")
    zh_rule = locale_rules["zh"]
    if zh_rule["sizes_px"] != {
        "headline": 75,
        "subheadline": 45,
        "label": 45,
        "description": 30,
        "disclaimer": 15,
    }:
        raise ValueError("the fixed Chinese type levels must be 75/45/45/30/15px")
    if zh_rule.get("letter_spacing_percent") != -5:
        raise ValueError("the fixed Chinese typography requires letter_spacing_percent = -5")
    for role_name in ("display", "body"):
        asset = data["typography"][role_name].get("asset")
        if not asset or not (ROOT / asset).is_file():
            raise ValueError(f"typography.{role_name}.asset must point to an existing local font")
    return data


def css_font(role: dict) -> str:
    names = [role["family"], *role.get("fallbacks", [])]
    return ", ".join(f'"{name}"' if " " in name else name for name in names)


def css_em_from_percent(value: int | float) -> str:
    """Render tracking as em so it scales with the active type level."""
    return f"{value / 100:g}em"


def render_embedded_font_faces(typography: dict) -> str:
    faces: list[str] = []
    seen_assets: set[str] = set()
    for role_name in ("display", "body"):
        role = typography[role_name]
        asset = role["asset"]
        if asset in seen_assets:
            continue
        seen_assets.add(asset)
        payload = base64.b64encode((ROOT / asset).read_bytes()).decode("ascii")
        family = role["family"].replace('"', '\\"')
        faces.append(
            "@font-face {\n"
            f'  font-family: "{family}";\n'
            "  font-style: normal;\n"
            "  font-weight: 100 900;\n"
            "  font-display: block;\n"
            f"  src: url(data:font/ttf;base64,{payload}) format('truetype');\n"
            "}"
        )
    return "\n\n".join(faces)


def render_brand_tokens(data: dict) -> str:
    colors = data["colors"]
    typography = data["typography"]
    shape = data["shape"]
    spacing = data["spacing"]
    motion = data["motion"]
    locale_rules = typography["locale_rules"]
    zh = locale_rules["zh"]
    return f"""/* GENERATED from brand/source.json. Do not edit. */
{render_embedded_font_faces(typography)}

:root {{
  --brand-canvas-width: 750px;
  --brand-canvas-height: 1320px;
  --brand-background: {colors['background']};
  --brand-surface: {colors['surface']};
  --brand-surface-strong: {colors['surface_strong']};
  --brand-text: {colors['text']};
  --brand-text-muted: {colors['text_muted']};
  --brand-primary: {colors['primary']};
  --brand-accent: {colors['accent']};
  --brand-success: {colors['success']};
  --brand-danger: {colors['danger']};
  --brand-font-display: {css_font(typography['display'])};
  --brand-font-body: {css_font(typography['body'])};
  --brand-type-headline: {zh['sizes_px']['headline']}px;
  --brand-type-subheadline: {zh['sizes_px']['subheadline']}px;
  --brand-type-label: {zh['sizes_px']['label']}px;
  --brand-type-description: {zh['sizes_px']['description']}px;
  --brand-type-disclaimer: {zh['sizes_px']['disclaimer']}px;
  --brand-letter-spacing: {css_em_from_percent(zh['letter_spacing_percent'])};
  --brand-letter-spacing-zh: {css_em_from_percent(locale_rules['zh']['letter_spacing_percent'])};
  --brand-letter-spacing-en: {css_em_from_percent(locale_rules['en']['letter_spacing_percent'])};
  --brand-letter-spacing-vi: {css_em_from_percent(locale_rules['vi']['letter_spacing_percent'])};
  --brand-letter-spacing-th: {css_em_from_percent(locale_rules['th']['letter_spacing_percent'])};
  --brand-line-height: {typography['line_height_percent']}%;
  --brand-min-body: {typography['minimum_body_px']}px;
  --brand-min-caption: {typography['minimum_caption_px']}px;
  --brand-slide-padding: {spacing['slide_padding_px']}px;
  --brand-safe-top: {spacing['safe_top_px']}px;
  --brand-safe-bottom: {spacing['safe_bottom_px']}px;
  --brand-content-gap: {spacing['content_gap_px']}px;
  --brand-item-gap: {spacing['item_gap_px']}px;
  --brand-disclaimer-gap: {spacing['disclaimer_gap_px']}px;
  --brand-corner-radius: {shape['corner_radius_px']}px;
  --brand-stroke-width: {shape['stroke_width_px']}px;
  --brand-motion-duration: {motion['duration_ms']}ms;
  --brand-motion-stagger: {motion['stagger_ms']}ms;
  --brand-motion-easing: {motion['easing']};
}}
"""


def render_viewport_css(_: dict) -> str:
    return """/* GENERATED from brand/source.json. Do not edit. */
* { box-sizing: border-box; }
html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
body { background: #0B0D12; color: var(--brand-text); font-family: var(--brand-font-body); }

.deck-viewport {
  position: fixed;
  inset: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deck-stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 750px;
  height: 1320px;
  transform-origin: 0 0;
  overflow: hidden;
  background: var(--brand-background);
}

.slide {
  position: absolute;
  inset: 0;
  width: 750px;
  height: 1320px;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  background: var(--brand-background);
}

.slide.active,
.slide.visible {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}

.deck-controls {
  position: fixed;
  left: 50%;
  bottom: 18px;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 0;
  background: rgba(11, 13, 18, 0.94);
  color: #FFFFFF;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 12px);
  transition: opacity 160ms ease, transform 160ms ease;
}

.deck-controls.is-visible,
.deck-controls:focus-within {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
}

.deck-controls button,
.deck-controls output {
  min-height: 32px;
  padding: 8px 10px;
  border-radius: 0;
  color: inherit;
  font-family: var(--brand-font-body);
  font-size: 15px;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: -0.05em;
}

.deck-controls button {
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: transparent;
  cursor: pointer;
}

.deck-controls button:hover,
.deck-controls button:focus-visible,
.deck-controls button[aria-pressed="true"] {
  border-color: #FFFFFF;
  background: rgba(255, 255, 255, 0.14);
  outline: none;
}

.deck-controls output {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
}

.deck-controls__divider {
  align-self: stretch;
  width: 1px;
  background: rgba(255, 255, 255, 0.28);
}

body.is-editing [data-editable="text"][data-edit-id] {
  outline: 2px dashed currentColor;
  outline-offset: 4px;
  cursor: text;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}

@media print {
  @page { size: 750px 1320px; margin: 0; }
  html, body { width: 750px; height: auto; overflow: visible; background: white; }
  .deck-viewport { position: static; display: block; overflow: visible; }
  .deck-stage { position: static; width: 750px; height: auto; transform: none !important; overflow: visible; }
  .slide { position: relative; width: 750px; height: 1320px; visibility: visible; opacity: 1; pointer-events: auto; break-after: page; }
  .slide:last-child { break-after: auto; }
  .deck-controls { display: none !important; }
}
"""


def render_runtime(data: dict) -> str:
    status = json.dumps(data["approval_status"], ensure_ascii=False)
    name = json.dumps(data["brand"]["name"], ensure_ascii=False)
    template_path = ROOT / "runtime" / "brand-runtime.template.js"
    template = template_path.read_text(encoding="utf-8")
    required_placeholders = ("__BRAND_STATUS__", "__BRAND_NAME__")
    missing = [placeholder for placeholder in required_placeholders if placeholder not in template]
    if missing:
        raise ValueError(f"runtime template is missing placeholders: {', '.join(missing)}")
    rendered = template.replace("__BRAND_STATUS__", status).replace("__BRAND_NAME__", name)
    return rendered.replace(
        "/* SOURCE template for brand/generated/brand-runtime.js. Do not execute directly. */",
        "/* GENERATED from brand/source.json. Do not edit. */",
        1,
    )


def render_rules(data: dict) -> str:
    typography = data["typography"]
    density = data["density"]
    shape = data["shape"]
    locale_rules = typography["locale_rules"]
    lines = [
        "# Generated brand rules",
        "",
        "> Generated from `brand/source.json`. Do not edit this file directly.",
        "",
        f"- Brand: **{data['brand']['name']}**",
        f"- Approval status: **{data['approval_status']}**",
        "- Canvas: **750 × 1320 CSS pixels only**",
        f"- Display font: **{typography['display']['family']}**",
        f"- Body font: **{typography['body']['family']}**",
        f"- Minimum body text: **{typography['minimum_body_px']}px**",
        f"- Minimum caption text: **{typography['minimum_caption_px']}px**",
        f"- Corner radius: **{shape['corner_radius_px']}px** for every authored container",
        f"- Text safe area: **top {data['spacing']['safe_top_px']}px / right {data['spacing']['slide_padding_px']}px / bottom {data['spacing']['safe_bottom_px']}px / left {data['spacing']['slide_padding_px']}px**",
        "- Product-detail pages: **no separately authored brand logo**",
        "- Tone mode: the user chooses **light** or **dark** before preview generation.",
        "",
        "## Density",
        "",
        f"- Speaker-led: at most {density['speaker_led']['max_bullets']} bullets or {density['speaker_led']['max_cards']} cards per slide.",
        f"- Reading-first: at most {density['reading_first']['max_bullets']} bullets or {density['reading_first']['max_cards']} cards per slide.",
        "- Split content instead of reducing type below the minimum sizes.",
        "",
        "## Locale typography",
        "",
        "| Locale | Family | Headline | Subheadline | Label | Description | Disclaimer | Letter spacing |",
        "|---|---|---:|---:|---:|---:|---:|---:|",
        *(
            f"| {locale} | {rule['family']} | {rule['sizes_px']['headline']} | {rule['sizes_px']['subheadline']} | {rule['sizes_px']['label']} | {rule['sizes_px']['description']} | {rule['sizes_px']['disclaimer']} | {rule['letter_spacing_percent']}% |"
            for locale, rule in locale_rules.items()
        ),
        f"- All locale levels use **{typography['line_height_percent']}%** line height.",
        "- Every authored text run maps to one of the five locale levels; large proof numerals do not create a display-size exception.",
        "- Locale letter spacing and line height apply to every authored text leaf, including metrics, superscripts, utility labels, and dense answers.",
        "- Pure non-Chinese runs declare `lang`; mixed Chinese/Latin copy follows the Chinese contract unless explicitly separated by the source.",
        "- Chinese output embeds the approved local MAKE SENSE 70S font asset.",
        "",
        "## Shape",
        "",
        "- Authored text/container layers, CSS/SVG graphic layers, image masks/crops, cards, tags, chips, buttons, color fields, evidence panels, page markers, and runtime controls use zero radius.",
        "- Treat approved raster/vector asset content as opaque: natural or baked-in curves inside the asset remain allowed.",
        "- A CSS radius, clip-path, mask, or rounded wrapper applied to an image counts as authored image-mask geometry and is not exempt.",
        "- Never rasterize a rounded UI container merely to bypass the zero-radius rule.",
        "",
        "## Design and structure baselines",
        "",
        "- Read `templates/index.json` when preparing the three real branded previews.",
        "- Treat all seven baselines as peers and select by content, evidence type, pacing, and available imagery.",
        "- Use baseline composition and component grammar without overriding the brand source.",
        "- Keep the selected light/dark tone, approved color tokens, typography, shape tokens, motion timing, and the 750 × 1320 canvas fixed across all previews.",
        "",
        f"> Source note: {data['source_note']}",
        "",
    ]
    return "\n".join(lines)


def render_animation(data: dict) -> str:
    motion = data["motion"]
    return f"""# Brand motion patterns

> Generated from `brand/source.json`. Do not edit this file directly.

- Standard duration: `{motion['duration_ms']}ms`
- Stagger: `{motion['stagger_ms']}ms`
- Easing: `{motion['easing']}`
- Animate opacity and transform by default.
- Use one dominant entrance sequence per slide.
- Keep navigation immediate and preserve `prefers-reduced-motion` behavior.
- Do not add decorative motion that changes layout, delays reading, or departs from the fixed brand timing.

## Structure-compatible sequences

- `type-sequence`: reveal headline lines and supporting text in reading order.
- `panel-sequence`: reveal evidence panels in a deliberate scan path.
- `image-reveal`: reveal one dominant image or statement, then its annotation.

Choose the sequence that fits the selected baseline's reading order. Motion never creates a separate theme or overrides brand timing.
"""


def generated_files(data: dict) -> dict[Path, str]:
    return {
        ROOT / "brand" / "generated" / "brand-rules.md": render_rules(data),
        ROOT / "brand" / "generated" / "brand-tokens.css": render_brand_tokens(data),
        ROOT / "brand" / "generated" / "brand-runtime.js": render_runtime(data),
        ROOT / "viewport-base.css": render_viewport_css(data),
        ROOT / "animation-patterns.md": render_animation(data),
    }


def compare_or_write(path: Path, expected: str, check: bool, errors: list[str]) -> None:
    expected = expected.rstrip() + "\n"
    actual = path.read_text(encoding="utf-8") if path.exists() else None
    if actual == expected:
        return
    if check:
        errors.append(f"out of sync: {path.relative_to(ROOT)}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(expected, encoding="utf-8", newline="\n")
    print(f"updated {path.relative_to(ROOT)}")


def compare_or_write_bytes(path: Path, expected: bytes, check: bool, errors: list[str]) -> None:
    actual = path.read_bytes() if path.exists() else None
    if actual == expected:
        return
    if check:
        errors.append(f"out of sync: {path.relative_to(ROOT)}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(expected)
    print(f"updated {path.relative_to(ROOT)}")


def check_invariants(errors: list[str]) -> None:
    for relative in INVARIANT_FILES:
        path = ROOT / relative
        if not path.exists():
            errors.append(f"missing invariant file: {relative}")
            continue
        text = path.read_text(encoding="utf-8")
        if "750" not in text or "1320" not in text:
            errors.append(f"missing fixed canvas literals: {relative}")
        if relative != "scripts/validate-html.py":
            for forbidden in FORBIDDEN_ACTIVE_TEXT:
                if forbidden.lower() in text.lower():
                    errors.append(f"stale canvas rule '{forbidden}' in {relative}")
        if relative in {"runtime/brand-runtime.template.js", "brand/generated/brand-runtime.js"}:
            for match in re.finditer(r"border-radius\s*:\s*([^;]+)", text, flags=re.I):
                if match.group(1).strip().lower() not in {"0", "0px"}:
                    errors.append(f"non-zero runtime control radius {match.group(1).strip()}: {relative}")


def check_templates(errors: list[str]) -> None:
    index_path = ROOT / "templates" / "index.json"
    try:
        index = json.loads(index_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"invalid template index: {exc}")
        return

    indexed_ids = [item.get("id") for item in index.get("templates", [])]
    if index.get("template_count") != len(TEMPLATE_IDS):
        errors.append(f"template_count must be {len(TEMPLATE_IDS)}")
    if tuple(indexed_ids) != TEMPLATE_IDS:
        errors.append("template index ids must match the canonical seven-template order")

    tones = [item.get("tone_mode") for item in index.get("templates", [])]
    if any(tone not in {"light", "dark"} for tone in tones):
        errors.append("every template index entry must declare tone_mode as light or dark")

    actual_ids = tuple(sorted(path.name for path in index_path.parent.iterdir() if path.is_dir()))
    if actual_ids != tuple(sorted(TEMPLATE_IDS)):
        errors.append("template directories do not match the canonical seven-template set")

    for template_id in TEMPLATE_IDS:
        for filename in ("design.md", "preview.md"):
            path = index_path.parent / template_id / filename
            if not path.exists():
                errors.append(f"missing template file: {path.relative_to(ROOT)}")
                continue
            if "750×1320" not in path.read_text(encoding="utf-8"):
                errors.append(f"missing fixed template canvas literal: {path.relative_to(ROOT)}")
        preview_path = index_path.parent / template_id / "preview.md"
        if preview_path.exists():
            preview = preview_path.read_text(encoding="utf-8")
            if PREVIEW_CONTRACT_MARKER not in preview:
                errors.append(f"missing fixed-brand preview override: {preview_path.relative_to(ROOT)}")
            for required in (
                "x=60–690 and y=120–1260",
                "75/45/45/30/15px",
                "100% line height",
                "-5% letter spacing",
                "border-radius: 0",
                "Product-detail pages have no separately authored brand-logo layer",
            ):
                if required not in preview:
                    errors.append(f"missing preview contract text {required!r}: {preview_path.relative_to(ROOT)}")

        design_path = index_path.parent / template_id / "design.md"
        if not design_path.exists():
            continue
        design = design_path.read_text(encoding="utf-8")
        if DESIGN_CONTRACT_MARKER not in design:
            errors.append(f"missing mandatory fixed-brand override: {design_path.relative_to(ROOT)}")
        for required in (
            "top 120px / right 60px / bottom 60px / left 60px",
            "75 / 45 / 45 / 30 / 15px",
            "100% line height",
            "-5% letter spacing",
            "border-radius: 0",
        ):
            if required not in design:
                errors.append(f"missing design contract text {required!r}: {design_path.relative_to(ROOT)}")
        lowered = design.lower()
        for forbidden in FORBIDDEN_DESIGN_GUIDANCE:
            if forbidden in lowered:
                errors.append(f"forbidden rounded-corner guidance {forbidden!r}: {design_path.relative_to(ROOT)}")
        for match in re.finditer(r"fontSize:\s*(\d+)px", design):
            if int(match.group(1)) not in {75, 45, 30, 15}:
                errors.append(
                    f"non-contract fontSize {match.group(1)}px: {design_path.relative_to(ROOT)}"
                )
        for match in re.finditer(r"lineHeight:\s*([^\s]+)", design):
            if match.group(1).strip('"\'') not in {"1", "100%"}:
                errors.append(
                    f"non-contract lineHeight {match.group(1)}: {design_path.relative_to(ROOT)}"
                )
        for match in re.finditer(r"letterSpacing:\s*([^\s]+)", design):
            if match.group(1).strip('"\'') != "-0.05em":
                errors.append(
                    f"non-contract letterSpacing {match.group(1)}: {design_path.relative_to(ROOT)}"
                )


def sync_plugin(check: bool, errors: list[str]) -> None:
    for relative in MIRROR_FILES:
        source = ROOT / relative
        if not source.exists():
            errors.append(f"missing package source: {relative}")
            continue
        target = PLUGIN_ROOT / relative
        compare_or_write_bytes(target, source.read_bytes(), check, errors)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail when generated or mirrored files differ")
    args = parser.parse_args()
    try:
        data = load_source()
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"brand source error: {exc}", file=sys.stderr)
        return 2

    errors: list[str] = []
    for path, expected in generated_files(data).items():
        compare_or_write(path, expected, args.check, errors)
    check_invariants(errors)
    check_templates(errors)
    sync_plugin(args.check, errors)

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("brand artifacts and plugin mirror are synchronized")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
