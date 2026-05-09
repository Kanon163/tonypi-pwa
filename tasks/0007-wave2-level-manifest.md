# 任务 0007：Wave 2 Go/No-Go LevelManifest

## 目标

把第二关 Go/No-Go 转成可执行的 `LevelManifest` 和资源索引。

## 所属波次

- Wave：2

## 负责 agent

- `level-content`

## 范围内

- 定义 `level_gonogo_crystal_v1` 的规则、成功条件、事件、机器人 cue、输入依赖。
- 建立 demo 资源索引。

## 范围外

- 不实现关卡引擎。
- 不读取或修改 Wave 1 原始审计文件。
- 不直接调用 TonyPi SDK。

## 输入资料

- `docs/VISION.md`
- `docs/WAVE1_SYNTHESIS.md`
- `docs/CONTRACTS.md`

## 依赖

- depends_on：`docs/CONTRACTS.md`
- blocks：Wave 3 PWA 垂直切片实现
- needs_from：无
- outputs_to：`app-pwa`、`robot-bridge`、`integration-review`

## 涉及契约

- reads：`LevelManifest`、`SessionEvent`、`RobotCommand`
- proposes_changes：必要字段缺口
- must_not_change：`docs/CONTRACTS.md`

## 预期交付

- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/resources-index/demo-assets.md`

## 上报要求

- 更新 `workspaces/level-content/STATUS.md`
- 更新 `workspaces/level-content/HANDOFF.md`
- 更新 `workspaces/level-content/BLOCKERS.md`

## 验收方式

- manifest 可被 PWA 计划和 robot fixtures 引用。
- 字段符合 `docs/CONTRACTS.md`。

## 执行前风险判断

- 风险：把旧 demo 展示壳逻辑再次硬编码进 manifest。
- 降低：只声明规则、事件、资源和 cue，不写运行逻辑。

