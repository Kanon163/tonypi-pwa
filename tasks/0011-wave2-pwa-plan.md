# 任务 0011：Wave 2 PWA 垂直切片计划

## 目标

制定 Wave 3 的 PWA 最小实现计划。

## 所属波次

- Wave：2

## 负责 agent

- `app-pwa`

## 范围内

- 基于 shared fixtures 设计目录结构、状态流、mock 源、验收方式。
- 明确 Go/No-Go 垂直切片的最小可运行路径。

## 范围外

- 不实现代码。
- 不做高保真 UI。
- 不接真实 BCI、真实 TonyPi、真实云端。
- 不读取或修改 Wave 1 原始审计文件。

## 输入资料

- `docs/VISION.md`
- `docs/WAVE1_SYNTHESIS.md`
- `docs/CONTRACTS.md`
- `workspaces/product-ux/GONOGO_DEMO_FLOW.md`（若已存在）
- `shared/level-manifests/level_gonogo_crystal_v1.json`（若已存在）
- `shared/fixtures/*.json`（若已存在）

## 依赖

- depends_on：`docs/CONTRACTS.md`
- blocks：Wave 3 PWA 实现
- needs_from：`level-content`、`robot-bridge`、`bci-cloud`、`product-ux`
- outputs_to：`integration-review`

## 涉及契约

- reads：全部 v0.1 契约
- proposes_changes：实现前必须补齐的字段
- must_not_change：`docs/CONTRACTS.md`

## 预期交付

- `workspaces/app-pwa/VERTICAL_SLICE_PLAN.md`

## 上报要求

- 更新 `workspaces/app-pwa/STATUS.md`
- 更新 `workspaces/app-pwa/HANDOFF.md`
- 更新 `workspaces/app-pwa/BLOCKERS.md`

## 验收方式

- 计划可被 Wave 3 直接转为实现任务。
- 明确 mock 与真实适配的替换边界。

## 执行前风险判断

- 风险：计划提前绑定未完成 fixtures。
- 降低：把 fixtures 作为输入契约，并列出缺失时的阻塞项。

