# 任务 0013：Wave 3 PWA mock 垂直切片

## 目标

实现可运行的家长端 PWA mock 闭环。

## 负责 agent

- `app-pwa`

## 范围内

- 创建或补齐 PWA 工程。
- 读取 shared manifest 和 fixtures。
- 实现训练准备、设备连接、训练进行、降级、完成、报告摘要。
- 实现 MockBciSource、MockRobotBridge、MockReportApi。
- 记录 SessionEvent，生成 ReportRequest，展示 ReportResponse。

## 范围外

- 不接真实 BCI、真实 TonyPi、真实云端。
- 不做儿童手机游戏。
- 不读取 Wave 1 冻结产物。

## 输入资料

- `docs/CONTRACTS.md`
- `workspaces/integration-review/WAVE2_REVIEW.md`
- `workspaces/app-pwa/VERTICAL_SLICE_PLAN.md`
- `workspaces/product-ux/GONOGO_DEMO_FLOW.md`
- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/fixtures/*.json`

若 `VERTICAL_SLICE_PLAN.md` 中的契约缺口与 v0.1.1 冲突，以 `CONTRACTS.md` 和 `WAVE2_REVIEW.md` 为准。

## 依赖

- depends_on：Wave 2 CONDITIONAL PASS
- blocks：`0014`、`0015`、`0016`、`0017`

## 预期交付

- 可运行 PWA 工程。
- 简短运行说明。
- 最小验证记录。

## 涉及契约

- reads：`LevelManifest`、`SessionEvent`、`BciSample`、`RobotCommand`、`RobotEvent`、`ReportRequest`、`ReportResponse`
- must_not_change：中央契约，除非先写入 `HANDOFF.md` 请求主控收口。

## 验收方式

- 默认 mock 路径完成 6 次扫描并显示报告。
- 至少一个降级场景可触发。
- UI 标注模拟或降级状态。
- PWA 不直接调用 TonyPi SDK。

## 执行前风险判断

- 风险：实现成旧 demo 控制台。
- 降低：页面只服务家长监看和启动，儿童互动默认发生在 TonyPi。
