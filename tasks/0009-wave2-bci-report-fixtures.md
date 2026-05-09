# 任务 0009：Wave 2 BCI 与报告 Fixtures

## 目标

产出 BCI 样本、报告请求和报告返回 fixtures。

## 所属波次

- Wave：2

## 负责 agent

- `bci-cloud`

## 范围内

- 建立稳定、波动、低信号、断连 BCI 样例。
- 建立不含逐条 raw 的报告请求样例。
- 建立家长可读的报告返回样例。

## 范围外

- 不接真实 BCI。
- 不实现云端服务。
- 不读取或修改 Wave 1 原始审计文件。

## 输入资料

- `docs/VISION.md`
- `docs/WAVE1_SYNTHESIS.md`
- `docs/CONTRACTS.md`

## 依赖

- depends_on：`docs/CONTRACTS.md`
- blocks：Wave 3 PWA 垂直切片实现
- needs_from：无
- outputs_to：`app-pwa`、`product-ux`、`integration-review`

## 涉及契约

- reads：`BciSample`、`SessionEvent`、`ReportRequest`
- proposes_changes：报告返回契约缺口
- must_not_change：`docs/CONTRACTS.md`

## 预期交付

- `shared/fixtures/bci-samples.json`
- `shared/fixtures/report-request.json`
- `shared/fixtures/report-response.json`

## 上报要求

- 更新 `workspaces/bci-cloud/STATUS.md`
- 更新 `workspaces/bci-cloud/HANDOFF.md`
- 更新 `workspaces/bci-cloud/BLOCKERS.md`

## 验收方式

- BCI fixtures 覆盖稳定、波动、低信号、断连。
- `ReportRequest` 不包含逐条 raw。
- 报告返回能被家长端摘要页使用。

## 执行前风险判断

- 风险：模拟数据看起来像真实医学判断。
- 降低：明确 source 为 `simulated`，报告措辞避免诊断性语言。

