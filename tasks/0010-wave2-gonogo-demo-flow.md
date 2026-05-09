# 任务 0010：Wave 2 Go/No-Go 家长端流程

## 目标

细化 Go/No-Go 垂直切片的家长端 PWA 流程和演示脚本。

## 所属波次

- Wave：2

## 负责 agent

- `product-ux`

## 范围内

- 训练前、连接、训练中、异常、完成、报告摘要。
- 明确儿童看 TonyPi，家长看 PWA。
- 定义最小页面状态，不做视觉稿。

## 范围外

- 不做高保真 UI。
- 不定义底层协议。
- 不读取或修改 Wave 1 原始审计文件。

## 输入资料

- `docs/VISION.md`
- `docs/WAVE1_SYNTHESIS.md`
- `docs/CONTRACTS.md`
- `shared/level-manifests/level_gonogo_crystal_v1.json`（若已存在）
- `shared/fixtures/report-response.json`（若已存在）

## 依赖

- depends_on：`docs/CONTRACTS.md`
- blocks：Wave 3 PWA 体验实现
- needs_from：fixtures 可增强细节，但不阻塞流程草案
- outputs_to：`app-pwa`、`integration-review`

## 涉及契约

- reads：`SessionEvent`、`ReportRequest`、`BciSample`
- proposes_changes：家长端状态缺口
- must_not_change：`docs/CONTRACTS.md`

## 预期交付

- `workspaces/product-ux/GONOGO_DEMO_FLOW.md`

## 上报要求

- 更新 `workspaces/product-ux/STATUS.md`
- 更新 `workspaces/product-ux/HANDOFF.md`
- 更新 `workspaces/product-ux/BLOCKERS.md`

## 验收方式

- app-pwa 能据此写 Wave 3 实现计划。
- 流程不把手机变成儿童训练主舞台。

## 执行前风险判断

- 风险：流程变成控制台或营销页。
- 降低：只围绕家长服务任务和训练状态表达。

