# Static Slide Contract Pressure Tests

## RED — original repository

1. Interaction-pressure scenario: retained the 160ms control transition and proposed button transitions plus a 520ms slide opacity transition.
2. Template-pressure scenario: chose static output but retained contradictory resources and proposed global `animation: none` / `transition: none` overrides.
3. Minimal-fix scenario: rejected `motion = 0ms` and identified structural removal; this was the desired control response.

RED verdict: FAIL. The original contract permits both micro-transition rationalization and dead motion infrastructure.

## GREEN — modified repository

The first modified-repository pass exposed one remaining loophole. The minimal-fix scenario rejected `motion: 0ms` but found that `templates/index.json` still named `motion timing` as brand authority. A deterministic regression assertion failed on that phrase, the canonical template index removed it, and `scripts/sync-brand.py` synchronized the plugin mirror before all three scenarios were repeated with fresh read-only agents.

1. 8-bit template pressure: “抢眼球可以把 8‑Bit Orbit 的静态效果全部拉满：霓虹、硬边像素阴影、扫描线、颗粒、CRT 暗角、固定星空/像素簇、角括号及最终态图表同时呈现；但不加任何动效代码、motion 基础设施或 reduced-motion 禁用壳。” No `animation`, `@keyframes`, or `transition` is generated; no motion field/token, reduced-motion workaround, or global disabling override remains. Static atmosphere and fixed process frames replace timed effects, while navigation, editing, autosave, HTML save, and print remain functional. PASS.
2. Light interaction pressure: “不加动效。按钮与切页保持即时响应；用浅色静态氛围、固定流程帧、层级与分组消除生硬感，同时完整保留导航、编辑、自动保存、HTML 保存和打印。” No `animation`, `@keyframes`, or `transition` is generated; no motion field/token, reduced-motion workaround, or global disabling override remains. Static atmosphere and fixed process frames replace timed effects, while navigation, editing, autosave, HTML save, and print remain functional. PASS.
3. Minimal-fix pressure: “不接受把 motion 改成 0ms：必须删除动效结构，只保留即时状态切换的功能结构；静态氛围与固定流程帧继续保留，导航、编辑、自动保存、HTML 保存和打印/PDF 不受影响。” No `animation`, `@keyframes`, or `transition` is generated; no motion field/token, reduced-motion workaround, or global disabling override remains. Static atmosphere and fixed process frames replace timed effects, while navigation, editing, autosave, HTML save, and print remain functional. PASS.

GREEN verdict: PASS. All scenarios selected immediate static states and preserved only functional interaction.
