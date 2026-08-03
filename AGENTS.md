# 项目路由

- 权威工作流程：[根 `SKILL.md`](SKILL.md)。完整流程以该文档为准，本文件不重复其内容。
- 同步镜像：[插件 `SKILL.md`](plugins/frontend-slides/skills/frontend-slides/SKILL.md)。不要直接编辑镜像。
- 模板清单由 [`templates/index.json`](templates/index.json) 管理。
- 非颜色品牌规则由 [`brand/source.json`](brand/source.json) 管理。
- 所有生成与镜像同步变更均通过 [`scripts/sync-brand.py`](scripts/sync-brand.py)：执行 `python scripts/sync-brand.py` 写入同步结果，执行 `python scripts/sync-brand.py --check` 检查同步状态。
