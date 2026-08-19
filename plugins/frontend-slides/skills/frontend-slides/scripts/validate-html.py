#!/usr/bin/env python3
"""Static validation for fixed 750 × 1320 brand HTML decks."""

from __future__ import annotations

import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

try:
    from static_contract import css_auto_spacing_violations, css_motion_violations
except ModuleNotFoundError:  # Supports importlib-based unit loading from the repository root.
    from scripts.static_contract import css_auto_spacing_violations, css_motion_violations


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "brand" / "source.json"
RESOURCE_TAGS = {"script", "link", "img", "source", "video", "audio", "iframe"}
VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
INTERNAL_LABELS = (
    "option a",
    "option b",
    "option c",
    "preview.md",
    "brand/source.json",
    ".frontend-slides/",
)


def is_zero_radius(value: str) -> bool:
    value = re.sub(r"\s*!important\s*$", "", value.strip(), flags=re.I)
    if value == "var(--brand-corner-radius)":
        return True
    parts = value.split()
    return bool(parts) and all(re.fullmatch(r"(?:0|0\.0+)(?:px|rem|em|%|pt)?", part, flags=re.I) for part in parts)


class DeckParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.class_counts: dict[str, int] = {}
        self.brand_status: str | None = None
        self.deck_id: str | None = None
        self.tone_mode: str | None = None
        self.external_resources: list[str] = []
        self.visible_text: list[str] = []
        self.css_sources: list[str] = []
        self.slides: list[dict[str, str | None]] = []
        self.slide_headline_counts: list[int] = []
        self._slide_depth = 0
        self._hidden_depth = 0
        self._style_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = dict(attrs)
        classes = (attr_map.get("class") or "").split()
        for class_name in classes:
            self.class_counts[class_name] = self.class_counts.get(class_name, 0) + 1
        if "slide" in classes:
            self.slides.append(attr_map)
            self.slide_headline_counts.append(0)
            self._slide_depth = 1
        elif self._slide_depth and tag not in VOID_TAGS:
            self._slide_depth += 1
        if self._slide_depth and (
            tag == "h1" or attr_map.get("data-type-level") == "headline"
        ):
            self.slide_headline_counts[-1] += 1
        if tag == "meta" and attr_map.get("name") == "frontend-slides-brand-status":
            self.brand_status = attr_map.get("content")
        if tag == "meta" and attr_map.get("name") == "frontend-slides-deck-id":
            self.deck_id = attr_map.get("content")
        if tag == "body":
            self.tone_mode = attr_map.get("data-tone-mode")
        if tag in RESOURCE_TAGS:
            value = attr_map.get("src") or attr_map.get("href")
            if value and re.match(r"^https?://", value, flags=re.I):
                self.external_resources.append(value)
        inline_style = attr_map.get("style")
        if inline_style:
            self.css_sources.append(inline_style)
        if tag in {"script", "style", "template", "svg"}:
            self._hidden_depth += 1
        if tag == "style":
            self._style_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag == "style" and self._style_depth:
            self._style_depth -= 1
        if tag in {"script", "style", "template", "svg"} and self._hidden_depth:
            self._hidden_depth -= 1
        if self._slide_depth:
            self._slide_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._style_depth and data.strip():
            self.css_sources.append(data)
        if not self._hidden_depth and data.strip():
            self.visible_text.append(data.strip())


def validate(path: Path, allow_draft: bool) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    raw = path.read_text(encoding="utf-8")
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    parser = DeckParser()
    parser.feed(raw)

    if parser.class_counts.get("deck-viewport", 0) != 1:
        errors.append("require exactly one .deck-viewport")
    if parser.class_counts.get("deck-stage", 0) != 1:
        errors.append("require exactly one .deck-stage")
    if parser.class_counts.get("slide", 0) < 1:
        errors.append("require at least one .slide")
    if not re.search(r"width\s*:\s*750px", raw, flags=re.I):
        errors.append("missing literal width: 750px")

    safe_vertical = source["spacing"]["safe_top_px"] + source["spacing"]["safe_bottom_px"]
    for index, slide in enumerate(parser.slides, start=1):
        kind = slide.get("data-slide-kind")
        if kind not in {"kv", "content"}:
            errors.append(f"slide {index} data-slide-kind must be exactly 'kv' or 'content'")
        raw_height = slide.get("data-slide-height") or ""
        if not re.fullmatch(r"[1-9]\d*", raw_height):
            errors.append(f"slide {index} requires a positive integer data-slide-height")
            continue
        height = int(raw_height)
        if height != source["canvas"]["height"]:
            errors.append(f"slide {index} must have data-slide-height=1320")
        if parser.slide_headline_counts[index - 1] != 1:
            errors.append(
                f"slide {index} must contain exactly one main title (h1 or data-type-level='headline')"
            )

    stale_patterns = (
        r"1920\s*[×x]\s*1080",
        r"1280\s*[×x]\s*720",
        r"\b16\s*:\s*9\b",
    )
    for pattern in stale_patterns:
        if re.search(pattern, raw, flags=re.I):
            errors.append(f"stale or alternative canvas reference: {pattern}")

    # Inspect authored CSS only. Image bytes, data URLs, alt text, and visible
    # copy are opaque content and must not be classified by the shape gate.
    # A radius declared on <img> still counts as an authored image mask.
    authored_css = "\n".join(parser.css_sources)
    motion_violations = css_motion_violations(authored_css)
    if motion_violations:
        errors.append(
            "static/motion contract forbids CSS animation, transition, motion tokens, and workarounds: "
            + ", ".join(motion_violations)
        )
    auto_spacing_violations = css_auto_spacing_violations(authored_css)
    if auto_spacing_violations:
        errors.append(
            "auto-spacing contract forbids leftover-height distribution in authored content: "
            + ", ".join(auto_spacing_violations)
        )
    nonzero_radii = []
    for match in re.finditer(r"border(?:-(?:top|right|bottom|left|start|end)){0,2}-radius\s*:\s*([^;{}]+)", authored_css, flags=re.I):
        value = match.group(1).strip()
        if not is_zero_radius(value):
            nonzero_radii.append(value)
    if nonzero_radii:
        errors.append(
            "non-zero CSS border-radius is forbidden on authored text, graphic, or image-mask layers: "
            + ", ".join(sorted(set(nonzero_radii)))
        )

    expected_status = source["approval_status"]
    if parser.brand_status != expected_status:
        errors.append(f"brand status meta must equal {expected_status!r}")
    if not parser.deck_id or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*", parser.deck_id):
        errors.append("frontend-slides-deck-id meta must be a stable ASCII deck identifier")
    if parser.tone_mode not in {"light", "dark"}:
        errors.append("body data-tone-mode must be exactly 'light' or 'dark'")
    if expected_status != "approved":
        message = "brand source is draft; final delivery and external publishing are blocked"
        if allow_draft:
            warnings.append(message)
        else:
            errors.append(message + " (use --allow-draft-brand only for an acknowledged prototype)")

    if parser.external_resources:
        errors.append("external resources are not allowed: " + ", ".join(parser.external_resources))

    visible = " ".join(parser.visible_text).lower()
    leaked = [label for label in INTERNAL_LABELS if label in visible]
    if leaked:
        errors.append("visible internal workflow labels: " + ", ".join(leaked))

    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("html", type=Path)
    parser.add_argument("--allow-draft-brand", action="store_true")
    args = parser.parse_args()
    if not args.html.is_file():
        print(f"ERROR: file not found: {args.html}", file=sys.stderr)
        return 2
    try:
        errors, warnings = validate(args.html, args.allow_draft_brand)
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    for warning in warnings:
        print(f"WARNING: {warning}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"PASS: {args.html}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
