from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
PYTHON = sys.executable


def load_sync_brand():
    path = ROOT / "scripts" / "sync-brand.py"
    spec = importlib.util.spec_from_file_location("sync_brand_under_test", path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def deck_html(css: str, body: str = "Static evidence slide") -> str:
    return f"""<!doctype html><html><head>
    <meta name="frontend-slides-brand-status" content="draft">
    <meta name="frontend-slides-deck-id" content="static-contract-test">
    <style>.deck-stage{{width:750px;height:1320px}}{css}</style>
    </head><body data-tone-mode="light"><div class="deck-viewport"><main class="deck-stage">
    <section class="slide active visible">{body}</section>
    </main></div></body></html>"""


class StaticCssContractTests(unittest.TestCase):
    def run_validator(self, html: str) -> subprocess.CompletedProcess[str]:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            return subprocess.run(
                [PYTHON, "scripts/validate-html.py", str(path), "--allow-draft-brand"],
                cwd=ROOT,
                text=True,
                capture_output=True,
                check=False,
            )

    def test_validate_html_rejects_motion_css_independent_of_layout(self) -> None:
        forbidden_css = {
            "single-line transition": ".slide { transition: opacity 520ms; }",
            "animation property": ".bar{animation:grow 500ms ease-out}",
            "keyframes": "@keyframes grow { from { width: 0 } to { width: 100% } }",
            "brand motion token": ":root{--brand-motion-duration:500ms}",
            "reduced motion workaround": "@media (prefers-reduced-motion: reduce){.slide{opacity:1}}",
            "zero-duration shell": ".slide{animation:appear 0ms}",
            "one-millisecond shell": ".slide{transition:opacity 1ms}",
            "blanket override": "*{animation:none!important;transition:none!important}",
        }
        for label, css in forbidden_css.items():
            with self.subTest(label=label):
                result = self.run_validator(deck_html(css))
                self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
                self.assertIn("static/motion contract", result.stderr.lower())

    def test_validate_html_accepts_static_css_and_physical_semantics(self) -> None:
        body = (
            "Schematic motion lines show physical force. The user's cleansing motion and rinse "
            "remain part of the usage description. The next photograph is a chapter transition."
        )
        result = self.run_validator(
            deck_html(".slide{opacity:1;transform:none}.motion-line{stroke:#111}", body)
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


class SyncStaticContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.sync_brand = load_sync_brand()

    def run_sync_with_generated_css(self, css: str) -> tuple[int, str]:
        generated = {ROOT / "viewport-base.css": css}
        stderr = io.StringIO()
        with (
            mock.patch.object(self.sync_brand, "load_source", return_value={}),
            mock.patch.object(self.sync_brand, "generated_files", return_value=generated),
            mock.patch.object(self.sync_brand, "compare_or_write"),
            mock.patch.object(self.sync_brand, "remove_managed_files"),
            mock.patch.object(self.sync_brand, "check_invariants"),
            mock.patch.object(self.sync_brand, "check_templates"),
            mock.patch.object(self.sync_brand, "sync_plugin"),
            mock.patch.object(sys, "argv", ["sync-brand.py", "--check"]),
            contextlib.redirect_stderr(stderr),
            contextlib.redirect_stdout(io.StringIO()),
        ):
            return self.sync_brand.main(), stderr.getvalue()

    def test_sync_check_independently_rejects_generated_motion_css(self) -> None:
        forbidden_css = {
            "single-line transition": ".slide { transition: opacity 520ms; }",
            "animation property": ".bar{animation:grow 500ms}",
            "keyframes": "@keyframes grow{to{width:100%}}",
            "brand motion token": ":root{--brand-motion-duration:0ms}",
            "reduced motion workaround": "@media(prefers-reduced-motion:reduce){.slide{opacity:1}}",
            "blanket override": "*{animation:none!important;transition:none!important}",
        }
        for label, css in forbidden_css.items():
            with self.subTest(label=label):
                returncode, stderr = self.run_sync_with_generated_css(css)
                self.assertNotEqual(returncode, 0, stderr)
                self.assertIn("static/motion contract", stderr.lower())

    def test_sync_check_accepts_generated_static_css(self) -> None:
        returncode, stderr = self.run_sync_with_generated_css(
            ".slide{position:absolute;opacity:1}.motion-line{stroke:#111}"
        )
        self.assertEqual(returncode, 0, stderr)

    def test_template_guidance_matrix_applies_to_design_and_preview(self) -> None:
        forbidden_guidance = (
            "Animate every chart bar on slide entry.",
            "Use a 500ms opacity transition between slides.",
            "Crossfade the before and after images over 700ms.",
            "@keyframes pulse { to { opacity: 1; } }",
            ":root { --brand-motion-duration: 0ms; }",
            ".bar { animation: pulse 0ms; }",
            ".slide { transition: opacity 1ms; }",
            "* { animation: none !important; transition: none !important; }",
        )
        for filename in ("design.md", "preview.md"):
            with tempfile.TemporaryDirectory() as directory:
                temporary_root = Path(directory)
                shutil.copytree(ROOT / "templates", temporary_root / "templates")
                target = temporary_root / "templates" / "8-bit-orbit" / filename
                original = target.read_text(encoding="utf-8")
                with mock.patch.object(self.sync_brand, "ROOT", temporary_root):
                    for guidance in forbidden_guidance:
                        with self.subTest(filename=filename, guidance=guidance):
                            target.write_text(original + "\n" + guidance + "\n", encoding="utf-8")
                            errors: list[str] = []
                            self.sync_brand.check_templates(errors)
                            self.assertTrue(
                                any("motion" in error.lower() and filename in error for error in errors),
                                errors,
                            )
                    target.write_text(original, encoding="utf-8")

    def test_template_guidance_allows_physical_and_editorial_semantics(self) -> None:
        allowed_guidance = """
        Schematic motion lines show physical force and assembly direction.
        The user's physical cleansing motion and rinse remain part of the usage description.
        Ice blue is permitted in photographic transitions and data-area fills.
        Use the full-bleed photograph as a chapter transition.
        """
        for filename in ("design.md", "preview.md"):
            with tempfile.TemporaryDirectory() as directory:
                temporary_root = Path(directory)
                shutil.copytree(ROOT / "templates", temporary_root / "templates")
                target = temporary_root / "templates" / "8-bit-orbit" / filename
                target.write_text(
                    target.read_text(encoding="utf-8") + allowed_guidance,
                    encoding="utf-8",
                )
                errors: list[str] = []
                with mock.patch.object(self.sync_brand, "ROOT", temporary_root):
                    self.sync_brand.check_templates(errors)
                self.assertFalse(
                    any("motion" in error.lower() and filename in error for error in errors),
                    errors,
                )

    def test_template_index_brand_authority_must_be_explicitly_static(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            temporary_root = Path(directory)
            shutil.copytree(ROOT / "templates", temporary_root / "templates")
            index_path = temporary_root / "templates" / "index.json"
            index = json.loads(index_path.read_text(encoding="utf-8"))
            index["contract"]["brand_authority"] = (
                "The brand source is authoritative for typography, shape, canvas, and motion timing."
            )
            index_path.write_text(json.dumps(index, indent=2), encoding="utf-8")
            errors: list[str] = []
            with mock.patch.object(self.sync_brand, "ROOT", temporary_root):
                self.sync_brand.check_templates(errors)
            self.assertTrue(
                any("brand authority" in error.lower() and "static" in error.lower() for error in errors),
                errors,
            )

    def test_retired_managed_files_are_reported_then_removed_in_both_roots(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            temporary_root = Path(directory) / "root"
            plugin_root = temporary_root / "plugins" / "frontend-slides" / "skills" / "frontend-slides"
            temporary_root.mkdir(parents=True)
            plugin_root.mkdir(parents=True)
            retired_files = (
                temporary_root / "animation-patterns.md",
                plugin_root / "animation-patterns.md",
            )
            for path in retired_files:
                path.write_text("retired", encoding="utf-8")

            with (
                mock.patch.object(self.sync_brand, "ROOT", temporary_root),
                mock.patch.object(self.sync_brand, "PLUGIN_ROOT", plugin_root),
            ):
                errors: list[str] = []
                self.sync_brand.remove_managed_files(check=True, errors=errors)
                self.assertEqual(len(errors), 2, errors)
                self.assertTrue(all(path.exists() for path in retired_files))

                errors = []
                with contextlib.redirect_stdout(io.StringIO()):
                    self.sync_brand.remove_managed_files(check=False, errors=errors)
                self.assertEqual(errors, [])
                self.assertTrue(all(not path.exists() for path in retired_files))


if __name__ == "__main__":
    unittest.main()
