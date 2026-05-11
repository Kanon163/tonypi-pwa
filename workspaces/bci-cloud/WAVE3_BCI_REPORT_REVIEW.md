# Wave 3 BCI/report 审查

## 结论

CONDITIONAL PASS

主路径可继续：PWA 能读取 BCI/report fixtures，生成摘要型 `ReportRequest`，并展示家长可读 mock 报告。合并前需修正以下 BCI/report 风险。

## 审查范围

- Issue：#9 `[0016] Wave 3 BCI/report 精简审查`
- 任务：`tasks/0016-wave3-bci-report-review.md`
- 线上 PWA：`https://kanon163.github.io/tonypi-pwa/`，根路径、PWA 路径、BCI fixture、report fixture 均返回 200。

## 必须修正项

1. `workspaces/app-pwa/app.js:208` 启动训练时没有清空 `state.samples`，但 `loadData()` 会在 `app.js:102` 预先写入 stable 样本，`updateBciSummary()` 又在 `app.js:111` 持续追加样本。报告的 `bciSummary` 可能混入训练前或上一轮样本，必须确保每次训练的 BCI 摘要只来自本 session。

2. `shared/fixtures/bci-samples.json:182` 已有 `disconnected` 场景和 `bci_disconnected` 事件，但 `workspaces/app-pwa/app.js` 没有消费 `disconnected` / `bci_disconnected`，动作绑定也只有 `bci-low`（`app.js:833`）。必须补齐 BCI 断连降级路径，否则 tasks/0016 的断连审查未覆盖。

3. 低信号时报告主摘要仍沿用 fixture 的“整体注意力记录较稳定”（`app.js:476-479`），只在 `warnings` 追加低可信提示（`app.js:468-469`）。必须让低信号/降级状态进入报告摘要或重点文案，避免家长先读到与风险相反的结论。

## 已通过项

- `ReportRequest` 使用 `bciSummary`，未发现逐条 BCI `raw` 上传。
- `ReportResponse` 面向家长阅读，并包含 `SIMULATED_DATA` 警告。
- 报告文案未做医学诊断，仍停留在训练过程回顾和演示提示。

## 残余风险

- 本审查未接真实 BCI、真实云端或医学判断。
- 真实硬件接入、云端报告可信度和家长授权文案应留到后续波次。
