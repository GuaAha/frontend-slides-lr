#!/usr/bin/env python3
"""Validate the root and packaged SKILL.md frontmatter without dependencies."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS = (
    ROOT / "SKILL.md",
    ROOT / "plugins/frontend-slides/skills/frontend-slides/SKILL.md",
)
EXPECTED_NAME = "frontend-slides-brand-internal"


def validate(path: Path) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n", text, flags=re.S)
    if not match:
        return [f"{path}: missing YAML frontmatter"]
    lines = [line for line in match.group(1).splitlines() if line.strip()]
    keys = [line.split(":", 1)[0].strip() for line in lines if ":" in line]
    if keys != ["name", "description"]:
        errors.append(f"{path}: frontmatter must contain only name and description")
    if f"name: {EXPECTED_NAME}" not in match.group(1):
        errors.append(f"{path}: unexpected skill name")
    if "750×1320" not in match.group(1):
        errors.append(f"{path}: description must trigger on the fixed canvas")
    return errors


def main() -> int:
    errors = [error for path in SKILLS for error in validate(path)]
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print("Skill metadata is valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
