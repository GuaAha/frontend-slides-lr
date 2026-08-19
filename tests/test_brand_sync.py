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

STATIC_DESIGN_CONTRACT_MARKER = (
    "The generated presentation is static. All visible states are fully composed and appear immediately."
)
FORBIDDEN_PRESENTATION_MOTION_GUIDANCE = (
    "animation",
    "animating text",
    "### motion",
    "prefers-reduced-motion",
    "reduced-motion mode",
    "animated starfield",
    "float keyframe",
    "motion timing",
    "motion can reveal",
    "motion may reveal",
    "motion should expose",
    "motion stops before",
    "add minimal motion",
    "add only reading-order motion",
    "use restrained, evidence-preserving motion",
    "motion behavior is inferred",
    "motion reference",
)


class BrandSyncTests(unittest.TestCase):
    def test_template_guidance_is_static_without_banning_physical_semantics(self) -> None:
        for template_id in TEMPLATE_IDS:
            design = (ROOT / "templates" / template_id / "design.md").read_text(encoding="utf-8")
            self.assertIn(STATIC_DESIGN_CONTRACT_MARKER, design, template_id)
            lowered = design.lower()
            for forbidden in FORBIDDEN_PRESENTATION_MOTION_GUIDANCE:
                self.assertNotIn(forbidden, lowered, f"{template_id}: {forbidden}")

        orbit_preview = (ROOT / "templates/8-bit-orbit/preview.md").read_text(encoding="utf-8").lower()
        self.assertNotIn("animated starfields", orbit_preview)

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

    def test_brand_source_has_confirmed_palette_type_canvas_and_square_corners(self) -> None:
        source = json.loads((ROOT / "brand/source.json").read_text(encoding="utf-8"))
        self.assertEqual(source["schema_version"], 3)
        self.assertEqual(source["canvas"], {"width": 750, "height": 1320})
        self.assertEqual(
            source["palette"],
            {
                "paper": "#F6F7F2",
                "surface": "#FFFFFF",
                "ink": "#101512",
                "muted": "#626B66",
                "accent": "#42B265",
                "accent_dark": "#215E38",
                "line": "#CFD8D1",
                "inverse": "#0B0D12",
                "inverse_text": "#FFFFFF",
            },
        )
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
        self.assertIn("--brand-canvas-height: 1320px;", css)
        self.assertNotIn("--brand-kv-height:", css)
        self.assertIn("--brand-letter-spacing: -0.05em;", css)
        self.assertIn("--brand-letter-spacing-en: -0.03em;", css)
        self.assertIn("--brand-line-height: 100%;", css)
        self.assertIn("--brand-item-gap: 10px;", css)
        self.assertIn("--brand-disclaimer-gap: 40px;", css)
        for color_token in (
            "--brand-paper: #F6F7F2;",
            "--brand-surface: #FFFFFF;",
            "--brand-ink: #101512;",
            "--brand-muted: #626B66;",
            "--brand-accent: #42B265;",
            "--brand-accent-dark: #215E38;",
            "--brand-line: #CFD8D1;",
            "--brand-inverse: #0B0D12;",
            "--brand-inverse-text: #FFFFFF;",
        ):
            self.assertIn(color_token, css)

    def test_brand_source_defines_annotation_and_qa_spacing_tokens(self) -> None:
        source = json.loads((ROOT / "brand/source.json").read_text(encoding="utf-8"))
        self.assertEqual(source["typography"]["annotation_line_height_percent"], 100)
        self.assertEqual(source["typography"]["large_evidence_secondary_px"], 60)
        self.assertEqual(source["spacing"]["qa_group_gap_px"], 60)
        self.assertEqual(source["spacing"]["annotation_gap_px"], 0)
        self.assertEqual(source["spacing"]["card_padding_px"], 20)
        self.assertEqual(source["spacing"]["card_content_gap_px"], 10)

        css = (ROOT / "brand/generated/brand-tokens.css").read_text(encoding="utf-8")
        self.assertIn("--brand-annotation-text-line-height: 100%;", css)
        self.assertIn("--brand-large-evidence-secondary: 60px;", css)
        self.assertIn("--brand-annotation-gap: 0px;", css)
        self.assertIn("--brand-card-padding: 20px;", css)
        self.assertIn("--brand-card-content-gap: 10px;", css)
        self.assertIn("--brand-qa-group-gap: 60px;", css)

    def test_skill_and_validation_define_annotation_atomic_and_evidence_rules(self) -> None:
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        validation = (ROOT / "references/validation.md").read_text(encoding="utf-8")
        self.assertIn("注释条目之间使用 `0px` 额外间距", skill)
        self.assertIn("注释说明文字和注释指引数字仍保留 `100%` 行高", skill)
        self.assertIn("xx%用户认可", skill)
        self.assertIn("2 组使用 `75px`", skill)
        self.assertIn("3 组及以上使用 `60px`", skill)
        self.assertIn("卡片内文字与卡片边缘保持 `20px` 内边距", skill)
        self.assertIn("内容组之间使用 `10px` 间距", skill)
        self.assertIn("Q&A 组间距为 `60px`", skill)
        self.assertIn("禁止用 `margin-top:auto`", skill)
        self.assertIn("annotation prose leaf", validation)
        self.assertIn("atomic", validation.lower())
        self.assertIn("large-evidence count", validation.lower())
        self.assertIn("60px", validation)

    def test_motion_contract_is_absent_from_source_and_generated_assets(self) -> None:
        source = json.loads((ROOT / "brand/source.json").read_text(encoding="utf-8"))
        self.assertNotIn("motion", source)

        template_index = json.loads((ROOT / "templates/index.json").read_text(encoding="utf-8"))
        self.assertNotIn("motion timing", template_index["contract"]["brand_authority"].lower())

        impact_map = json.loads((ROOT / "brand/impact-map.json").read_text(encoding="utf-8"))
        self.assertNotIn("animation-patterns.md", impact_map["generated"])

        plugin_root = ROOT / "plugins/frontend-slides/skills/frontend-slides"
        self.assertFalse((ROOT / "animation-patterns.md").exists())
        self.assertFalse((plugin_root / "animation-patterns.md").exists())

        motion_css = re.compile(
            r"--brand-motion-|@keyframes|^\s*(?:animation|transition)(?:-[\w-]+)?\s*:",
            flags=re.I | re.M,
        )
        for relative in ("brand/generated/brand-tokens.css", "viewport-base.css"):
            css = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIsNone(motion_css.search(css), relative)

        rules = (ROOT / "brand/generated/brand-rules.md").read_text(encoding="utf-8")
        self.assertNotIn("motion timing", rules.lower())

        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        for stale in ("animation-patterns.md", "动效时序", "动效值", "动效重点", "减少动效行为"):
            self.assertNotIn(stale, skill)
        self.assertIn("所有幻灯片、内容元素和控件状态均即时呈现", skill)

    def test_skill_template_and_export_define_static_output(self) -> None:
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("无动画 HTML 演示文稿", skill)
        for stale in (
            "animation-patterns.md",
            "动效时序",
            "动效值",
            "动效重点",
            "减少动效行为",
        ):
            self.assertNotIn(stale, skill)
        for capability in ("键盘", "触摸导航", "页码", "行内编辑", "localStorage", "HTML 文件保存", "打印"):
            self.assertIn(capability, skill)

        html_template = (ROOT / "html-template.md").read_text(encoding="utf-8")
        self.assertNotIn("class=\"reveal\"", html_template)
        self.assertNotIn("prefers-reduced-motion", html_template)
        self.assertNotRegex(html_template, r"(?im)^\s*(?:animation|transition)(?:-[\w-]+)?\s*:")

        exporter = (ROOT / "scripts/export-pdf.sh").read_text(encoding="utf-8")
        for stale in (
            "animations to settle",
            "slide transition animations",
            "intersection observer animations",
            "Animations are not preserved",
        ):
            self.assertNotIn(stale, exporter)

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
                template_text = canonical.read_text(encoding="utf-8")
                self.assertIn("750 × 1320", template_text)
                self.assertIn("brand/source.json", template_text)

            design = (ROOT / "templates" / template_id / "design.md").read_text(encoding="utf-8")
            preview = (ROOT / "templates" / template_id / "preview.md").read_text(encoding="utf-8")
            self.assertIn("## Mandatory Fixed-Brand Override", design)
            self.assertIn("`brand/source.json` is the color authority", design)
            self.assertIn("top 120px / right 60px / bottom 60px / left 60px", design)
            self.assertIn("75 / 45 / 45 / 30 / 15px", design)
            self.assertIn("border-radius: 0", design)
            self.assertIn("## Fixed-Brand Preview Override", preview)
            self.assertIn("`brand/source.json` is the color authority", preview)
            self.assertIn("75/45/45/30/15px", preview)
            self.assertIn("border-radius: 0", preview)
            self.assertRegex(design, r"#[0-9A-Fa-f]{6}")
            self.assertRegex(preview, r"#[0-9A-Fa-f]{6}")
            self.assertIn("Historical colors in this design describe contrast roles only", design)
            self.assertIn("historical colors below describe contrast and composition only", preview)

    def test_skill_uses_separate_images_light_default_and_brand_palette_authority(self) -> None:
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
        self.assertIn("大型证据数字归入主标题层级/副标题层级", skill)
        self.assertIn("文字叶节点是直接承载可见文字", skill)
        self.assertIn("默认使用 `light` 色调并设置语义主题 `clean`", skill)
        self.assertIn("颜色、字体、间距、形状和画布都由该文件统一控制", skill)
        self.assertIn("模板中的历史色值只能说明对比关系", skill)
        self.assertIn("`image_mode: placeholder`", skill)
        self.assertIn("`image_mode: css-visual`", skill)
        self.assertIn("## Image-source gate", validation)
        self.assertIn("do not browse the web, search local drives", validation)
        self.assertIn("image_mode: css-visual", validation)
        self.assertIn("rectangular cropping", validation)
        self.assertIn("clean semantic theme", index["selection_workflow"]["category_semantics"])
        self.assertIn("Default tone_mode to light", index["selection_workflow"]["tone_choice"])
        self.assertIn("brand/source.json", index["contract"]["palette_authority"])
        self.assertIn("brand/source.json", index["selection_workflow"]["category_color_limit"])
        self.assertNotIn("logos and font files were not present", readme.lower())
        self.assertNotIn("palette and logo approval remain draft", readme.lower())

    def test_skill_defines_citation_marker_image_geometry_and_highlight_checks(self) -> None:
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        validation = (ROOT / "references/validation.md").read_text(encoding="utf-8")

        self.assertIn("渲染时移除 `【` 和 `】`", skill)
        self.assertIn("KV 区域的图片或图片占位符默认使用满版底图", skill)
        self.assertIn("宽度固定为 `630px`，高度不得低于 `870px`", skill)
        self.assertIn("所有高亮元素必须解析为同一个最终色值", skill)
        self.assertNotIn("使用方形的自定义图像占位层", skill)
        self.assertNotIn("所有内容图像位置保持为方形编写图层", skill)
        self.assertIn("citation markers render without brackets", validation)
        self.assertIn("single-image slide geometry", validation)
        self.assertIn("one computed highlight color", validation)

    def test_fixed_canvas_contract_is_defined_end_to_end(self) -> None:
        source = json.loads((ROOT / "brand/source.json").read_text(encoding="utf-8"))
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        validation = (ROOT / "references/validation.md").read_text(encoding="utf-8")
        html_template = (ROOT / "html-template.md").read_text(encoding="utf-8")
        runtime = (ROOT / "runtime/brand-runtime.template.js").read_text(encoding="utf-8")
        rendered_validator = (ROOT / "scripts/validate-rendered.mjs").read_text(encoding="utf-8")

        self.assertEqual(source["canvas"], {"width": 750, "height": 1320})
        self.assertIn("每张幻灯片只承载一个主标题。", skill)
        self.assertIn("每张切片都使用精确的 `750 × 1320` CSS 像素画布", skill)
        self.assertIn("内容超出安全区时必须精简、换用注册布局或拆页", skill)
        self.assertIn("大型证据数字归入主标题层级/副标题层级，中文最大 `75px`/`60px`", skill)
        self.assertIn("一个汉字或一个汉字加一个标点符号", skill)
        self.assertIn("最小单位的修改", skill)
        self.assertIn("单独对对应切片进行校验", skill)
        self.assertIn("fixed `750 × 1320` canvas", validation)
        self.assertIn("--slide", validation)
        self.assertIn('data-slide-kind="kv"', html_template)
        self.assertIn('data-slide-height="1320"', html_template)
        self.assertIn("CANVAS_HEIGHT", runtime)
        self.assertIn("{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }", runtime)
        self.assertIn("--slide", rendered_validator)

        for stale in (
            "每张幻灯片只分配一个主要信息",
            "非 KV 切片根据内容高度灵活设定",
            "每张幻灯片的声明高度",
            "大型证据数字直接归入主标题层级",
            "任何可见行不得只剩一个汉字",
        ):
            self.assertNotIn(stale, skill)

    def test_static_validator_accepts_acknowledged_draft(self) -> None:
        css = (ROOT / "brand/generated/brand-tokens.css").read_text(encoding="utf-8")
        css += (ROOT / "viewport-base.css").read_text(encoding="utf-8")
        html = f"""<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="test-deck">
        <style>{css}</style></head><body data-tone-mode="light">
        <div class="deck-viewport"><main class="deck-stage">
        <section class="slide active visible" data-slide-kind="kv" data-slide-height="1320"><h1>真实标题</h1></section>
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
        <section class="slide" data-slide-kind="kv" data-slide-height="1320"><h1>真实标题</h1></section></main></div></body></html>"""
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
        <section class="slide" data-slide-kind="kv" data-slide-height="1320"><div class="card"><h1>真实标题</h1></div></section></main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("non-zero CSS border-radius", result.stderr)

    def test_static_validator_rejects_non_1320_content_height(self) -> None:
        html = """<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="invalid-content-height">
        <style>.deck-stage{width:750px;height:1320px}</style>
        </head><body data-tone-mode="light"><div class="deck-viewport"><main class="deck-stage">
        <section class="slide" data-slide-kind="content" data-slide-height="1680"><h1>内容页标题</h1></section>
        </main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must have data-slide-height=1320", result.stderr)

    def test_static_validator_rejects_non_1320_kv_height(self) -> None:
        html = """<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="invalid-kv-height">
        <style>.deck-stage{width:750px;height:1320px}</style>
        </head><body data-tone-mode="light"><div class="deck-viewport"><main class="deck-stage">
        <section class="slide" data-slide-kind="kv" data-slide-height="1680"><h1>KV 标题</h1></section>
        </main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must have data-slide-height=1320", result.stderr)

    def test_packaged_runtime_controls_are_square(self) -> None:
        runtime_css = (ROOT / "viewport-base.css").read_text(encoding="utf-8")
        declared = re.findall(r"border-radius\s*:\s*([^;]+)", runtime_css, flags=re.I)
        self.assertTrue(declared)
        self.assertTrue(all(value.strip() in {"0", "0px"} for value in declared), declared)

    def test_canonical_runtime_has_no_deck_stage_dual_track(self) -> None:
        self.assertFalse((ROOT / "runtime/deck-stage.js").exists())
        generated = (ROOT / "brand/generated/brand-runtime.js").read_text(encoding="utf-8")
        self.assertIn("runtime: 'brand-runtime-v3'", generated)
        self.assertIn("toggleEdit", generated)
        self.assertIn("saveFile", generated)

    def test_static_validator_ignores_radius_words_inside_image_content_metadata(self) -> None:
        html = """<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <meta name="frontend-slides-deck-id" content="test-deck">
        <style>.deck-stage{width:750px;height:1320px}</style>
        </head><body data-tone-mode="light"><div class="deck-viewport"><main class="deck-stage">
        <section class="slide" data-slide-kind="kv" data-slide-height="1320"><h1>真实标题</h1><img src="data:image/png;base64,AA=="
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
        <section class="slide" data-slide-kind="kv" data-slide-height="1320"><h1>真实标题</h1><img src="data:image/png;base64,AA==" alt="approved image"></section>
        </main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("image-mask layers", result.stderr)


if __name__ == "__main__":
    unittest.main()
