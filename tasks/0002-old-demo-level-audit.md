# 任务 0002：旧 demo 三关审计

## 目标

把旧 demo 的三关规则、资源、状态流和硬件依赖拆成可迁移的 `LevelManifest` 信息。

## 范围内

- 审计 `task8_core.py`、`task9_core.py`、`task10_core.py`。
- 审计 `task12_three_level_demo_v1_0.py` 中三关流程、节点、事件、资源调用。
- 列出音频、动作组、视觉/语音输入依赖。

## 范围外

- 不重写代码。
- 不设计 UI。

## 输入资料

- `.参考资料/ExistingDemo/`
- `docs/CONTRACTS.md`

## 涉及契约

- `LevelManifest`
- `SessionEvent`
- `RobotCommand`

## 预期交付

- `workspaces/level-content/OLD_DEMO_AUDIT.md`
- 第一版关卡 manifest 字段建议。

## 验收方式

- `integration-review` 能据此判断旧三关如何进入 PWA 垂直切片。

## 执行前风险判断

- 风险：把 pygame 控制台细节误当成产品需求。
- 降低：只提取规则、资源、状态和事件，不迁移控制台 UI。

