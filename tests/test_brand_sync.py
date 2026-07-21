from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PYTHON = sys.executable


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

    def test_static_validator_accepts_acknowledged_draft(self) -> None:
        css = (ROOT / "brand/generated/brand-tokens.css").read_text(encoding="utf-8")
        css += (ROOT / "viewport-base.css").read_text(encoding="utf-8")
        html = f"""<!doctype html><html><head>
        <meta name="frontend-slides-brand-status" content="draft">
        <style>{css}</style></head><body>
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
        <style>.deck-stage{width:750px;height:1320px}.legacy{width:1920x1080}</style>
        </head><body><div class="deck-viewport"><main class="deck-stage">
        <section class="slide">真实标题</section></main></div></body></html>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "deck.html"
            path.write_text(html, encoding="utf-8")
            result = self.run_command("scripts/validate-html.py", str(path), "--allow-draft-brand")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("stale or alternative canvas", result.stderr)


if __name__ == "__main__":
    unittest.main()
