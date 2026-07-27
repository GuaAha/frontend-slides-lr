from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PYTHON = sys.executable
TEMPLATE_IDS = (
    "8-bit-orbit",
    "clearproof-green",
    "noir-amber-clinical",
    "aqua-mint-proof",
    "magnetic-gold-engineering",
    "monochrome-scent-lab",
    "blue-clay-clean",
)


class BrandSyncTests(unittest.TestCase):
    def run_command(self, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [PYTHON, *args],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )

    def test_generated_files_and_plugin_mirror_are_in_sync(self) -> None:
        result = self.run_command("scripts/sync-brand.py", "--check")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_brand_source_has_confirmed_type_and_square_corners(self) -> None:
        source = json.loads((ROOT / "brand/source.json").read_text(encoding="utf-8"))
        self.assertNotIn("colors", source)
        self.assertEqual(source["shape"]["corner_radius_px"], 0)
        self.assertEqual(source["spacing"]["safe_top_px"], 120)
        self.assertEqual(source["spacing"]["safe_bottom_px"], 60)
        self.assertEqual(source["spacing"]["slide_padding_px"], 60)
        self.assertEqual(source["typography"]["display"]["family"], "MAKE SENSE")
        self.assertEqual(source["typography"]["line_height_percent"], 100)
        self.assertEqual(set(source["typography"]["locale_rules"]), {"zh", "en", "vi", "th"})
        self.assertEqual(
            source["typography"]["locale_rules"]["zh"]["sizes_px"],
            {
                "headline": 75,
                "subheadline": 45,
                "label": 45,
                "description": 30,
                "disclaimer": 15,
            },
        )
        self.assertEqual(source["typography"]["locale_rules"]["zh"]["letter_spacing_percent"], -5)
        self.assertTrue((ROOT / source["typography"]["display"]["asset"]).is_file())

        css = (ROOT / "brand/generated/brand-tokens.css").read_text(encoding="utf-8")
        self.assertIn("--brand-letter-spacing: -0.05em;", css)
        self.assertIn("--brand-letter-spacing-en: -0.03em;", css)
        self.assertIn("--brand-line-height: 100%;", css)
        self.assertIn("--brand-item-gap: 10px;", css)
        self.assertIn("--brand-disclaimer-gap: 40px;", css)
        for color_token in (
            "--brand-background:",
            "--brand-surface:",
            "--brand-surface-strong:",
            "--brand-text:",
            "--brand-text-muted:",
            "--brand-primary:",
            "--brand-accent:",
            "--brand-success:",
            "--brand-danger:",
        ):
            self.assertNotIn(color_token, css)

    def test_templates_are_one_peer_collection(self) -> None:
        index = json.loads((ROOT / "templates/index.json").read_text(encoding="utf-8"))
        self.assertEqual(index["template_count"], len(TEMPLATE_IDS))
        self.assertEqual(tuple(item["id"] for item in index["templates"]), TEMPLATE_IDS)
        self.assertEqual(
            tuple(sorted(path.name for path in (ROOT / "templates").iterdir() if path.is_dir())),
            tuple(sorted(TEMPLATE_IDS)),
        )
        self.assertNotIn("visual_directions", json.loads((ROOT / "brand/source.json").read_text(encoding="utf-8")))
        self.assertFalse((ROOT / "STYLE_PRESETS.md").exists())
        self.assertFalse((ROOT / "bold-template-pack").exists())

        plugin_root = ROOT / "plugins/frontend-slides/skills/frontend-slides"
        self.assertFalse((plugin_root / "STYLE_PRESETS.md").exists())
        self.assertFalse((plugin_root / "bold-template-pack").exists())

        self.assertEqual({item["tone_mode"] for item in index["templates"]}, {"light", "dark"})
        self.assertEqual(sum(item["tone_mode"] == "light" for item in index["templates"]), 3)
        self.assertEqual(sum(item["tone_mode"] == "dark" for item in index["templates"]), 4)

        for template_id in TEMPLATE_IDS:
            for filename in ("design.md", "preview.md"):
                canonical = ROOT / "templates" / template_id / filename
                mirror = plugin_root / "templates" / template_id / filename
                self.assertTrue(canonical.is_file(), canonical)
                self.assertEqual(canonical.read_bytes(), mirror.read_bytes(), mirror)
                self.assertIn("750×1320", canonical.read_text(encoding="utf-8"))

            design = (ROOT / "templates" / template_id / "design.md").read_text(encoding="utf-8")
            preview = (ROOT / "templates" / template_id / "preview.md").read_text(encoding="utf-8")
            self.assertIn("## Mandatory Fixed-Brand Override", design)
            self.assertIn("The palette declared in this design is the color authority", design)
            self.assertIn("top 120px / right 60px / bottom 60px / left 60px", design)
            self.assertIn("75 / 45 / 45 / 30 / 15px", design)
            self.assertIn("border-radius: 0", design)
            self.assertIn("## Fixed-Brand Preview Override", preview)
            self.assertIn("The palette declared in this preview is the color authority", preview)
            self.assertIn("75/45/45/30/15px", preview)
            self.assertIn("border-radius: 0", preview)
            self.assertRegex(design, r"#[0-9A-Fa-f]{6}")
            self.assertRegex(preview, r"#[0-9A-Fa-f]{6}")
            self.assertNotIn("colors declared by the brand source", design)
            self.assertNotIn("reference palette below describes contrast roles only", preview)

    def test_skill_uses_separate_images_light_default_and_template_palette_authority(self) -> None:
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        validation = (ROOT / "references/validation.md").read_text(encoding="utf-8")
        index = json.loads((ROOT / "templates/index.json").read_text(encoding="utf-8"))
        readme = (ROOT / "README.md").read_text(encoding="utf-8")

        self.assertIn("接收笔记、文档、Markdown 文件。图片素材可由用户另行提供。", skill)
        self.assertIn("来源文案台账不是用户提供的原始文档本身", skill)
        self.assertNotIn("PPT/PPTX", skill)
        self.assertNotIn("scripts/extract-pptx.py", skill)
        self.assertIn("色调：`light`（明亮）或 `dark`（暗黑）", skill)
        self.assertIn("用户未指定时，先将 `tone_mode` 记录为 `light`", skill)
        self.assertIn("大型证据数字直接归入主标题层级", skill)
        self.assertIn("文字叶节点是直接承载可见文字", skill)
        self.assertIn("默认使用 `light` 色调并设置语义主题 `clean`", skill)
        self.assertIn("不生成颜色令牌", skill)
        self.assertIn("配色只从入选模板的 `preview.md`", skill)
        self.assertIn("`image_mode: placeholder`", skill)
        self.assertIn("`image_mode: css-visual`", skill)
        self.assertIn("## Image-source gate", validation)
        self.assertIn("do not browse the web, search local drives", validation)
        self.assertIn("image_mode: css-visual", validation)
        self.assertIn("rectangular cropping", validation)
        self.assertIn("clean semantic theme", index["selection_workflow"]["category_semantics"])
        self.assertIn("Default tone_mode to light", index["selection_workflow"]["tone_choice"])
        self.assertIn("preview.md and design.md", index["contract"]["palette_authority"])
        self.assertIn("selected template's preview.md and design.md", index["selection_workflow"]["category_color_limit"])
        self.assertNotIn("logos and font files were not present", readme.lower())
        self.assertNotIn("palette and logo approval remain draft", readme.lower())

    def test_static_validator_accepts_acknowledged_draft(self) -> None:
        css = (ROOT / "brand/generated/brand-tokens.css").read_text(encoding="utf-8")
        css += (ROOT / "viewport-base.css").read_text(encoding="utf-8")
        html = f"""<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="test-deck">
        <style>{css}</style></head><body data-tone-mode="light">
        <div class="deck-viewport"><main class="deck-stage">
        <section class="slide active visible"><h1>真实标题</h1></section>
        </main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_static_validator_rejects_stale_canvas(self) -> None:
        html = """<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="test-deck">
        <style>.deck-stage{width:750px;height:1320px}.legacy{width:1920x1080}</style>
        </head><body data-tone-mode="light"><div class="deck-viewport"><main class="deck-stage">
        <section class="slide">真实标题</section></main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("stale or alternative canvas", result.stderr)

    def test_static_validator_rejects_nonzero_radius(self) -> None:
        html = """<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="test-deck">
        <style>.deck-stage{width:750px;height:1320px}.card{border-radius:8px}</style>
        </head><body data-tone-mode="light"><div class="deck-viewport"><main class="deck-stage">
        <section class="slide"><div class="card">真实标题</div></section></main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("non-zero CSS border-radius", result.stderr)

    def test_packaged_runtime_controls_are_square(self) -> None:
        runtime_css = (ROOT / "viewport-base.css").read_text(encoding="utf-8")
        declared = re.findall(r"border-radius\s*:\s*([^;]+)", runtime_css, flags=re.I)
        self.assertTrue(declared)
        self.assertTrue(all(value.strip() in {"0", "0px"} for value in declared), declared)

    def test_canonical_runtime_has_no_deck_stage_dual_track(self) -> None:
        self.assertFalse((ROOT / "runtime/deck-stage.js").exists())
        generated = (ROOT / "brand/generated/brand-runtime.js").read_text(encoding="utf-8")
        self.assertIn("runtime: 'brand-runtime-v1'", generated)
        self.assertIn("toggleEdit", generated)
        self.assertIn("saveFile", generated)

    def test_static_validator_ignores_radius_words_inside_image_content_metadata(self) -> None:
        html = """<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="test-deck">
        <style>.deck-stage{width:750px;height:1320px}</style>
        </head><body data-tone-mode="light"><div class="deck-viewport"><main class="deck-stage">
        <section class="slide"><img src="data:image/png;base64,AA=="
        alt="approved source artwork includes border-radius: 24px in its metadata"></section>
        </main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_static_validator_rejects_css_radius_on_image_as_mask(self) -> None:
        html = """<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="test-deck">
        <style>.deck-stage{width:750px;height:1320px}img{border-radius:24px}</style>
        </head><body data-tone-mode="light"><div class="deck-viewport"><main class="deck-stage">
        <section class="slide"><img src="data:image/png;base64,AA==" alt="approved image"></section>
        </main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("image-mask layers", result.stderr)


if __name__ == "__main__":
    unittest.main()
