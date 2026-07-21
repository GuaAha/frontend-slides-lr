#!/usr/bin/env python3
"""Static validation for fixed-brand 750 × 1320 HTML decks."""

from __future__ import annotations

import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "brand" / "source.json"
RESOURCE_TAGS = {"script", "link", "img", "source", "video", "audio", "iframe"}
INTERNAL_LABELS = (
    "option a",
    "option b",
    "option c",
    "preview.md",
    "brand/source.json",
    ".frontend-slides/",
)


class DeckParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.class_counts: dict[str, int] = {}
        self.brand_status: str | None = None
        self.external_resources: list[str] = []
        self.visible_text: list[str] = []
        self._hidden_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = dict(attrs)
        for class_name in (attr_map.get("class") or "").split():
            self.class_counts[class_name] = self.class_counts.get(class_name, 0) + 1
        if tag == "meta" and attr_map.get("name") == "frontend-slides-brand-status":
            self.brand_status = attr_map.get("content")
        if tag in RESOURCE_TAGS:
            value = attr_map.get("src") or attr_map.get("href")
            if value and re.match(r"^https?://", value, flags=re.I):
                self.external_resources.append(value)
        if tag in {"script", "style", "template", "svg"}:
            self._hidden_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "template", "svg"} and self._hidden_depth:
            self._hidden_depth -= 1

    def handle_data(self, data: str) -> None:
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
    if not re.search(r"height\s*:\s*1320px", raw, flags=re.I):
        errors.append("missing literal height: 1320px")

    stale_patterns = (
        r"1920\s*[×x]\s*1080",
        r"1280\s*[×x]\s*720",
        r"\b16\s*:\s*9\b",
    )
    for pattern in stale_patterns:
        if re.search(pattern, raw, flags=re.I):
            errors.append(f"stale or alternative canvas reference: {pattern}")

    expected_status = source["approval_status"]
    if parser.brand_status != expected_status:
        errors.append(f"brand status meta must equal {expected_status!r}")
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
