# Static Slide Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the root skill, brand source, generator, generated assets, seven template styles, export path, and plugin mirror enforce one animation-free HTML presentation contract while preserving functional interaction.

**Architecture:** The repository root remains the single source of truth. `brand/source.json` contains no motion model; `scripts/sync-brand.py` generates only static brand assets, removes retired managed files, validates template static-contract markers, and mirrors managed root files into the packaged plugin. Runtime JavaScript continues to change navigation, editing, persistence, save, and print state, while CSS renders every state immediately.

**Tech Stack:** Python 3 standard library and `unittest`, JSON, Markdown, generated CSS/JavaScript, Bash with embedded Playwright JavaScript, Node.js/Playwright runtime validation.

## Global Constraints

- Root `SKILL.md` is authoritative: output is an animation-free HTML presentation.
- Remove decorative `animation`, `@keyframes`, and `transition`; do not replace them with `0ms` or `1ms` motion tokens.
- Preserve keyboard/button/touch navigation, page counter, inline editing, deck-scoped `localStorage` autosave, HTML save, and print/PDF controls.
- Keep the fixed 750-wide, 750×1320 authored stage and uniform viewport scaling unchanged.
- Keep template palettes in each template's `preview.md` and `design.md`; do not add colors to `brand/source.json`.
- Preserve words such as motion, movement, flow, transition, or sequence when they describe physical content, a color boundary, a chapter boundary, or a static reading order rather than visual interpolation.
- Edit canonical root files only; update generated files and `plugins/frontend-slides/skills/frontend-slides/` through `python scripts/sync-brand.py`.
- Do not include the unrelated untracked `.codex/` directory in any commit.

## RED Baseline Already Observed

Three read-only pressure scenarios were run against the current repository before changing the skill:

- Under the request “无动画，但按钮和切页最好别显得生硬”, one agent retained the existing `160ms` control transition and proposed new button transitions plus a `520ms` opacity slide transition. It treated `prefers-reduced-motion` as sufficient compliance.
- A second agent chose static output but planned to keep the contradictory motion resources and append `animation: none !important` / `transition: none !important` overrides after them.
- A third agent rejected `motion = 0ms` and identified the correct structural removal, confirming that the current tests pass without covering the no-animation contract.

The first two outcomes are the failing skill baseline. The implementation must make those interpretations impossible without relying on agent discretion.

---

### Task 1: Remove motion from the brand data and generated asset lifecycle

**Files:**

- Modify: `tests/test_brand_sync.py`
- Modify: `brand/source.json`
- Modify: `brand/impact-map.json`
- Modify: `scripts/sync-brand.py`
- Modify: `SKILL.md`
- Regenerate: `brand/generated/brand-rules.md`
- Regenerate: `brand/generated/brand-tokens.css`
- Regenerate: `viewport-base.css`
- Delete through sync: `animation-patterns.md`
- Regenerate/mirror through sync: `plugins/frontend-slides/skills/frontend-slides/brand/source.json`
- Regenerate/mirror through sync: `plugins/frontend-slides/skills/frontend-slides/brand/impact-map.json`
- Regenerate/mirror through sync: `plugins/frontend-slides/skills/frontend-slides/brand/generated/brand-rules.md`
- Regenerate/mirror through sync: `plugins/frontend-slides/skills/frontend-slides/brand/generated/brand-tokens.css`
- Regenerate/mirror through sync: `plugins/frontend-slides/skills/frontend-slides/viewport-base.css`
- Mirror through sync: `plugins/frontend-slides/skills/frontend-slides/SKILL.md`
- Delete through sync: `plugins/frontend-slides/skills/frontend-slides/animation-patterns.md`

**Interfaces:**

- Consumes: the existing `load_source() -> dict`, `generated_files(data: dict) -> dict[Path, str]`, and plugin mirror lifecycle.
- Produces: `REMOVED_MANAGED_FILES: tuple[str, ...]` and `remove_managed_files(check: bool, errors: list[str]) -> None`; a source model with no `motion`; static generated CSS with no motion properties.

- [ ] **Step 1: Add a failing test for the source, CSS, impact map, and retired file**

Add this method to `BrandSyncTests` in `tests/test_brand_sync.py`:

```python
    def test_motion_contract_is_absent_from_source_and_generated_assets(self) -> None:
        source = json.loads((ROOT / "brand/source.json").read_text(encoding="utf-8"))
        self.assertNotIn("motion", source)

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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
python -m unittest tests.test_brand_sync.BrandSyncTests.test_motion_contract_is_absent_from_source_and_generated_assets -v
```

Expected: FAIL because `motion` exists, both `animation-patterns.md` copies exist, and generated CSS contains motion tokens or transitions.

- [ ] **Step 3: Remove the motion model and add retired-file lifecycle management**

In `brand/source.json`, delete the complete `motion` object. In `brand/impact-map.json`, delete `animation-patterns.md` from `generated`.

In `scripts/sync-brand.py`:

1. Remove `animation-patterns.md` from `MIRROR_FILES`.
2. Add the retired list immediately after `MIRROR_FILES`:

```python
REMOVED_MANAGED_FILES = (
    "animation-patterns.md",
)
```

3. Remove `motion` from `load_source()`'s required keys and reject its reintroduction:

```python
    if "motion" in data:
        raise ValueError("brand/source.json must not define motion for static presentations")
```

4. Remove the `motion = data["motion"]` read and all `--brand-motion-*` output from `render_brand_tokens()`.
5. Remove the `.deck-controls` `transition` declaration and the complete `@media (prefers-reduced-motion: reduce)` block from `render_viewport_css()`.
6. Change the generated rules sentence to:

```python
        "- Keep typography, shape tokens, static visual states, and the 750 × 1320 canvas fixed across all previews. Each preview uses its own declared palette while remaining compatible with the active light/dark tone.",
```

7. Delete `render_animation()` and its entry in `generated_files()`.
8. Add this function after `compare_or_write_bytes()`:

```python
def remove_managed_files(check: bool, errors: list[str]) -> None:
    for relative in REMOVED_MANAGED_FILES:
        for base in (ROOT, PLUGIN_ROOT):
            path = base / relative
            if not path.exists():
                continue
            label = path.relative_to(ROOT)
            if check:
                errors.append(f"retired managed file remains: {label}")
            else:
                path.unlink()
                print(f"removed {label}")
```

9. Call `remove_managed_files(args.check, errors)` after comparing `generated_files(data)` and before `sync_plugin()`.

10. Update `SKILL.md` in the same core-contract change:
   - Load only `html-template.md`, `viewport-base.css`, and `references/validation.md` before full generation.
   - Remove “动效时序” from the template/non-color source rules.
   - State that generated tokens contain no motion values.
   - Replace “动效重点” with “静态阅读路径和信息层级重点”.
   - Remove “减少动效行为” while retaining the complete functional interaction list.
   - Remove motion timing from values owned by `brand/source.json`.
   - Delete the `animation-patterns.md` resource-map row.
   - Add these binding rules after the functional interaction list:

```markdown
- 所有幻灯片、内容元素和控件状态均即时呈现。不得生成 `animation`、`@keyframes`、`transition`、自动循环、入场、淡入、位移补间或计数滚动；不得用 `0ms`、`1ms` 或全局覆盖保留一套名义上的动效结构。
- 导航、编辑、保存和打印属于功能性交互。JavaScript 可以立即切换类名、属性、当前页和持久化状态，但不得为状态变化添加视觉补间。
```

- [ ] **Step 4: Regenerate canonical assets and plugin mirrors**

Run:

```powershell
python scripts/sync-brand.py
```

Expected: generated rules, tokens, viewport CSS, source/impact-map mirrors are updated; both `animation-patterns.md` files are removed.

- [ ] **Step 5: Run the focused test and sync check**

Run:

```powershell
python -m unittest tests.test_brand_sync.BrandSyncTests.test_motion_contract_is_absent_from_source_and_generated_assets -v
python scripts/sync-brand.py --check
```

Expected: both commands PASS.

- [ ] **Step 6: Commit the generated-contract change**

```powershell
git add -- tests/test_brand_sync.py brand/source.json brand/impact-map.json scripts/sync-brand.py SKILL.md brand/generated/brand-rules.md brand/generated/brand-tokens.css viewport-base.css animation-patterns.md plugins/frontend-slides/skills/frontend-slides
git commit -m "refactor: remove generated motion contract"
```

Before committing, verify `git status --short` shows no staged `.codex/` path.

---

### Task 2: Make the HTML template and export path explicitly static

**Files:**

- Modify: `tests/test_brand_sync.py`
- Modify: `html-template.md`
- Modify: `scripts/export-pdf.sh`
- Mirror through sync: `plugins/frontend-slides/skills/frontend-slides/html-template.md`
- Mirror through sync: `plugins/frontend-slides/skills/frontend-slides/scripts/export-pdf.sh`

**Interfaces:**

- Consumes: Task 1's static `viewport-base.css` and `scripts/sync-brand.py` mirror lifecycle.
- Produces: a static HTML example and an exporter with no animation-only waits while retaining legacy final-state normalization; the test also guards Task 1's root skill contract.

- [ ] **Step 1: Add a failing root-contract test**

Add this method to `BrandSyncTests`:

```python
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
python -m unittest tests.test_brand_sync.BrandSyncTests.test_skill_template_and_export_define_static_output -v
```

Expected: FAIL on root motion references, the `.reveal` transition example, reduced-motion guidance, and animation-specific exporter waits/messages.

- [ ] **Step 3: Replace the animated HTML example with a fully visible static example**

In `html-template.md`:

- Delete the `.reveal` and `.slide.visible .reveal` CSS blocks.
- Remove `class="reveal"` from the example heading.
- Replace the reduced-motion instruction with this rule:

```markdown
- Keep every authored visual state fully visible and immediate. Do not add `animation`, `@keyframes`, `transition`, delayed reveal classes, or looping effects.
```

Do not change the stage, editable attributes, brand runtime script, navigation, save, or print instructions.

- [ ] **Step 4: Remove only animation-specific export waits and wording**

In `scripts/export-pdf.sh`:

- Delete the first-slide `1500ms` animation-settle wait.
- Delete the per-slide `300ms` transition wait and `200ms` intersection-observer wait.
- Keep `networkidle`, `document.fonts.ready`, the existing legacy `.reveal` final-state normalization, and the final `100ms` paint wait.
- Rewrite the `.reveal` comments as “Normalize legacy hidden content before capture” without advertising animation support.
- Rewrite the final message as:

```bash
echo "  Static HTML is exported one slide per PDF page."
```

- [ ] **Step 5: Synchronize mirrors and run the focused test**

Run:

```powershell
python scripts/sync-brand.py
python -m unittest tests.test_brand_sync.BrandSyncTests.test_skill_template_and_export_define_static_output -v
python scripts/sync-brand.py --check
```

Expected: all three commands PASS; root and plugin copies are byte-identical.

- [ ] **Step 6: Commit the static foundation change**

```powershell
git add -- tests/test_brand_sync.py html-template.md scripts/export-pdf.sh plugins/frontend-slides/skills/frontend-slides
git commit -m "docs: make slide foundation static"
```

Before committing, verify `git status --short` shows no staged `.codex/` path.

---

### Task 3: Convert all seven template styles to static composition guidance

**Files:**

- Modify: `tests/test_brand_sync.py`
- Modify: `scripts/sync-brand.py`
- Modify: `templates/8-bit-orbit/design.md`
- Modify: `templates/8-bit-orbit/preview.md`
- Modify: `templates/aqua-mint-proof/design.md`
- Modify: `templates/blue-clay-clean/design.md`
- Modify: `templates/clearproof-green/design.md`
- Modify: `templates/magnetic-gold-engineering/design.md`
- Modify: `templates/monochrome-scent-lab/design.md`
- Modify: `templates/noir-amber-clinical/design.md`
- Mirror through sync: corresponding files below `plugins/frontend-slides/skills/frontend-slides/templates/`

**Interfaces:**

- Consumes: `TEMPLATE_IDS`, `check_templates(errors: list[str])`, and the canonical template mirror lifecycle.
- Produces: `STATIC_DESIGN_CONTRACT_MARKER` and `FORBIDDEN_PRESENTATION_MOTION_GUIDANCE`; seven templates whose visual identity is expressed with static composition only.

- [ ] **Step 1: Add a failing template static-contract test**

Add these constants near `TEMPLATE_IDS` in `tests/test_brand_sync.py`:

```python
STATIC_DESIGN_CONTRACT_MARKER = (
    "The generated presentation is static. All visible states are fully composed and appear immediately."
)
FORBIDDEN_PRESENTATION_MOTION_GUIDANCE = (
    "animation",
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
```

Add this test method:

```python
    def test_template_guidance_is_static_without_banning_physical_semantics(self) -> None:
        for template_id in TEMPLATE_IDS:
            design = (ROOT / "templates" / template_id / "design.md").read_text(encoding="utf-8")
            self.assertIn(STATIC_DESIGN_CONTRACT_MARKER, design, template_id)
            lowered = design.lower()
            for forbidden in FORBIDDEN_PRESENTATION_MOTION_GUIDANCE:
                self.assertNotIn(forbidden, lowered, f"{template_id}: {forbidden}")

        orbit_preview = (ROOT / "templates/8-bit-orbit/preview.md").read_text(encoding="utf-8").lower()
        self.assertNotIn("animated starfields", orbit_preview)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
python -m unittest tests.test_brand_sync.BrandSyncTests.test_template_guidance_is_static_without_banning_physical_semantics -v
```

Expected: FAIL because the marker is absent and the seven designs contain active animation headings or instructions; the 8-bit preview promises animated starfields.

- [ ] **Step 3: Make static composition an enforced template invariant**

In `scripts/sync-brand.py`, define the same `STATIC_DESIGN_CONTRACT_MARKER` and `FORBIDDEN_PRESENTATION_MOTION_GUIDANCE` constants beside the existing template contract constants.

In `check_templates()` after confirming `DESIGN_CONTRACT_MARKER`, add:

```python
        if STATIC_DESIGN_CONTRACT_MARKER not in design:
            errors.append(f"missing static presentation contract: {design_path.relative_to(ROOT)}")
        lowered = design.lower()
        for forbidden in FORBIDDEN_PRESENTATION_MOTION_GUIDANCE:
            if forbidden in lowered:
                errors.append(
                    f"forbidden presentation-motion guidance {forbidden!r}: {design_path.relative_to(ROOT)}"
                )
```

Keep the existing rounded-corner, typography, palette, and fixed-canvas checks.

- [ ] **Step 4: Add the static marker and rewrite active guidance in every design**

Insert the marker immediately below each `## Mandatory Fixed-Brand Override` block's introductory authority text. Replace active animation guidance with these static rules, adapted only for grammar around existing paragraphs:

```markdown
The generated presentation is static. All visible states are fully composed and appear immediately.
```

Use the following exact static intent per template:

- `8-bit-orbit`: fixed star patterns and fixed pixel clusters may provide atmosphere; charts and counters show final values; reading order comes from placement, contrast, and grouping. Remove JS-created random particles, keyframes, delays, replay, grow, twinkle, float, and rollup instructions. Change both preview occurrences of “animated starfields” to “fixed starfields”.
- `clearproof-green`: headline, metric, chart, and evidence image are simultaneously inspectable in a deliberate static scan order. Replace “Animation Triggers” and the “Add minimal motion” workflow step with static reading-order composition.
- `noir-amber-clinical`: show the white claim, amber outcome, curve, contours, markers, and evidence in their complete final state; establish sequence through placement. Replace the Animation section and remove inferred-motion caveats.
- `aqua-mint-proof`: use still mist, liquid, glass ribbon, spray paths, and sequential mechanism frames as fixed imagery. Replace motion/reduced-motion checklist items and the Motion subsection with static composition.
- `blue-clay-clean`: show the mineral gradient, contact/capture/lift/rinse frames, ingredient spheres, and removal evidence as fixed states. Retain “motion” only where it means the user's physical cleansing action.
- `magnetic-gold-engineering`: use separate fixed frames for open, attraction, closed, exploded, and assembled states; retain schematic motion lines because they explain physical behavior, but remove timed reveals, sweeps, rotation, and reduced-motion guidance.
- `monochrome-scent-lab`: use fixed split-tone fields, matched before/after images, paired scent materials, and pump-operation frames. Preserve measured product-duration language; remove timed crossfades and looping ambient effects.

Where a section heading currently combines `Responsive, Presenter, Animation, and Print`, rename it to `Responsive, Presenter, Static Composition, and Print` or split it into `Static Composition` plus the unchanged responsive/presenter/print subsections.

- [ ] **Step 5: Run targeted text inspection before synchronization**

Run:

```powershell
rg -n -i -g '*.md' "animation|### motion|prefers-reduced-motion|reduced-motion mode|animated starfield|float keyframe|motion timing|motion can reveal|motion may reveal|motion should expose|motion stops before|add minimal motion|add only reading-order motion|use restrained, evidence-preserving motion|motion behavior is inferred|motion reference" templates
```

Expected: no matches. Manually retain physical-process uses such as `motion lines`, `motion and rinse`, and color/chapter transitions.

- [ ] **Step 6: Synchronize templates and run focused checks**

Run:

```powershell
python scripts/sync-brand.py
python -m unittest tests.test_brand_sync.BrandSyncTests.test_template_guidance_is_static_without_banning_physical_semantics -v
python scripts/sync-brand.py --check
```

Expected: all three commands PASS and all canonical template files match their plugin mirrors.

- [ ] **Step 7: Commit the template conversion**

```powershell
git add -- tests/test_brand_sync.py scripts/sync-brand.py templates plugins/frontend-slides/skills/frontend-slides/templates
git commit -m "docs: make template guidance static"
```

Before committing, verify `git status --short` shows no staged `.codex/` path.

---

### Task 4: Re-run skill pressure tests and complete full regression validation

**Files:**

- Create: `docs/superpowers/validation/2026-08-03-static-slide-contract-pressure-tests.md`
- Modify only if validation exposes a defect: files owned by Tasks 1–3 and their tests.

**Interfaces:**

- Consumes: the complete static source/generator/template contract and existing Playwright runtime validator.
- Produces: recorded RED/GREEN skill evidence and final command output demonstrating static generation plus preserved functional interaction.

- [ ] **Step 1: Record the RED baseline evidence**

Create the validation document with this structure and the already observed conclusions:

```markdown
# Static Slide Contract Pressure Tests

## RED — original repository

1. Interaction-pressure scenario: retained the 160ms control transition and proposed button transitions plus a 520ms slide opacity transition.
2. Template-pressure scenario: chose static output but retained contradictory resources and proposed global `animation: none` / `transition: none` overrides.
3. Minimal-fix scenario: rejected `motion = 0ms` and identified structural removal; this was the desired control response.

RED verdict: FAIL. The original contract permits both micro-transition rationalization and dead motion infrastructure.
```

- [ ] **Step 2: Re-run the same three pressure scenarios against the modified repository**

Use fresh agents without giving them `superpowers:writing-skills`. Reuse the same pressures:

1. 8-bit template + “抓眼球，模板里能用的效果都用上” + deadline.
2. Light theme + preserve all runtime features + “按钮和切页最好别显得生硬” + deadline.
3. “最省事就是 motion 设为 0ms，别删结构” + fear of breaking PDF/mirrors.

Each response must conclude all of the following:

- No `animation`, `@keyframes`, or `transition` is generated.
- No `motion` field, motion token, reduced-motion workaround, or global disabling override exists.
- Static atmosphere and fixed process frames replace timed effects.
- Navigation, editing, autosave, save, and print remain functional.

- [ ] **Step 3: Append the GREEN results**

Update the validation document with concise verbatim decision excerpts and end with exactly one verdict:

```markdown
GREEN verdict: PASS. All scenarios selected immediate static states and preserved only functional interaction.
```

If any scenario proposes a transition, override, or retained motion infrastructure, keep the verdict FAIL, add a failing deterministic test for the loophole, make the minimal root/generator/template correction, synchronize, and repeat all three scenarios.

- [ ] **Step 4: Run the user-specified validation commands**

Run:

```powershell
python scripts/sync-brand.py --check
python -m unittest discover -s tests -v
```

Expected: both commands exit 0; every unit test passes.

- [ ] **Step 5: Verify preserved functional interaction**

Run:

```powershell
npm run validate:runtime
```

Expected: exit 0 with capabilities containing exactly the existing functional set: `navigation`, `touch`, `counter`, `editing`, `autosave`, `save-html`, and `print`.

- [ ] **Step 6: Perform final static-contract and worktree inspection**

Run:

```powershell
rg -n -i -g '*.css' -- "--brand-motion-|@keyframes\s+[a-z_-]|^\s*(animation|transition)(-[a-z-]+)?\s*:" brand/generated viewport-base.css
rg -n -i "animation-patterns.md" SKILL.md brand/impact-map.json html-template.md templates plugins/frontend-slides/skills/frontend-slides/SKILL.md plugins/frontend-slides/skills/frontend-slides/brand/impact-map.json
rg -n -i -g '*.md' "animation|### motion|prefers-reduced-motion|reduced-motion mode|animated starfield|float keyframe|motion timing|motion can reveal|motion may reveal|motion should expose|motion stops before|add minimal motion|add only reading-order motion|use restrained, evidence-preserving motion|motion behavior is inferred|motion reference" templates
git status --short
```

Expected: the three `rg` commands report no matches. `scripts/sync-brand.py` intentionally retains `animation-patterns.md` only in `REMOVED_MANAGED_FILES` so stale copies can be rejected. Semantically valid physical-process prose discovered by broader searches is allowed. `git status` may show the user's pre-existing untracked `.codex/`, but no unintended staged or modified files.

- [ ] **Step 7: Commit validation evidence and any final test-only correction**

```powershell
git add -- docs/superpowers/validation/2026-08-03-static-slide-contract-pressure-tests.md tests/test_brand_sync.py
git commit -m "test: verify static slide contract"
```

If `tests/test_brand_sync.py` did not change during final validation, stage only the validation document. Confirm `.codex/` is not staged.
