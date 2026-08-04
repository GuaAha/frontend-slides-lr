"""Shared static-presentation checks for CSS and template guidance."""

from __future__ import annotations

import re


_CSS_MOTION_RULES = (
    (
        "animation declaration",
        re.compile(r"(?<![\w-])(?:-(?:webkit|moz|o)-)?animation(?:-[\w-]+)?\s*:", re.I),
    ),
    (
        "transition declaration",
        re.compile(r"(?<![\w-])(?:-(?:webkit|moz|o)-)?transition(?:-[\w-]+)?\s*:", re.I),
    ),
    ("keyframes rule", re.compile(r"@(?:-webkit-)?keyframes\b", re.I)),
    ("motion custom property", re.compile(r"--(?:brand-)?motion(?:-[\w-]+)*\s*:", re.I)),
    ("reduced-motion workaround", re.compile(r"prefers-reduced-motion\b", re.I)),
)

_CSS_AUTO_SPACING_RULES = (
    ("auto-spacing margin", re.compile(r"margin(?:-top|-bottom)?\s*:\s*auto\b", re.I)),
    ("auto-spacing distribution", re.compile(r"justify-content\s*:\s*space-between\b", re.I)),
)

_ANIMATION_GUIDANCE = re.compile(r"\banimat(?:e|es|ed|ing|ion|ions)\b", re.I)
_CROSSFADE_GUIDANCE = re.compile(r"\bcross[- ]?fade(?:s|d|ing)?\b", re.I)
_FADE_GUIDANCE = re.compile(r"\bfade(?:s|d|ing)?\s+(?:in|out|between)\b", re.I)
_PRESENTATION_TRANSITION = re.compile(
    r"(?=[^.\n]*\btransition(?:s)?\b)"
    r"(?=[^.\n]*(?:\bopacity\b|\bbetween\s+(?:the\s+)?slides?\b|\b\d+(?:\.\d+)?\s*(?:ms|s)\b))"
    r"[^.\n]+",
    re.I,
)
_PRESENTATION_MOTION = re.compile(
    r"\bmotion\b(?=[^.\n]*(?:timing|duration|easing|delay|reveal|entry|effect|loop|pulse|float|animate))",
    re.I,
)


def _strip_css_comments_and_strings(text: str) -> str:
    """Remove opaque CSS content while preserving rule punctuation and positions."""
    output: list[str] = []
    index = 0
    quote: str | None = None
    in_comment = False
    while index < len(text):
        char = text[index]
        next_char = text[index + 1] if index + 1 < len(text) else ""
        if in_comment:
            if char == "*" and next_char == "/":
                output.extend("  ")
                index += 2
                in_comment = False
            else:
                output.append("\n" if char == "\n" else " ")
                index += 1
            continue
        if quote:
            if char == "\\" and next_char:
                output.extend("  ")
                index += 2
                continue
            output.append("\n" if char == "\n" else " ")
            index += 1
            if char == quote:
                quote = None
            continue
        if char == "/" and next_char == "*":
            output.extend("  ")
            index += 2
            in_comment = True
            continue
        if char in {"'", '"'}:
            output.append(" ")
            index += 1
            quote = char
            continue
        output.append(char)
        index += 1
    return "".join(output)


def _find_css_motion_violations(text: str, *, strip_opaque_css: bool) -> list[str]:
    inspectable = _strip_css_comments_and_strings(text) if strip_opaque_css else text
    return [label for label, pattern in _CSS_MOTION_RULES if pattern.search(inspectable)]


def css_motion_violations(css: str) -> list[str]:
    """Return distinct motion constructs found anywhere in authored CSS."""
    return _find_css_motion_violations(css, strip_opaque_css=True)


def css_auto_spacing_violations(css: str) -> list[str]:
    """Reject layout rules that absorb leftover canvas height with auto spacing."""
    inspectable = _strip_css_comments_and_strings(css)
    return [label for label, pattern in _CSS_AUTO_SPACING_RULES if pattern.search(inspectable)]


def template_motion_violations(text: str) -> list[str]:
    """Reject presentation motion instructions while allowing physical/editorial semantics."""
    # Markdown prose is not CSS: quotation marks and apostrophes may remain open
    # across a line, so inspect CSS-like constructs without CSS string stripping.
    violations = _find_css_motion_violations(text, strip_opaque_css=False)
    prose_rules = (
        ("animation instruction", _ANIMATION_GUIDANCE),
        ("crossfade instruction", _CROSSFADE_GUIDANCE),
        ("fade instruction", _FADE_GUIDANCE),
        ("timed slide transition instruction", _PRESENTATION_TRANSITION),
        ("presentation motion instruction", _PRESENTATION_MOTION),
    )
    for label, pattern in prose_rules:
        if pattern.search(text) and label not in violations:
            violations.append(label)
    return violations
