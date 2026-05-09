# 任务 0016：Wave 3 BCI 与报告审查

## 目标

精简审查 PWA 是否正确消费 BCI fixtures 并生成家长可读 mock 报告。

## 负责 agent

- `bci-cloud`

## 范围内

- 检查 BCI 样本、摘要、断连、低信号场景。
- 检查 ReportRequest 是否为摘要上传。
- 检查 ReportResponse 展示是否家长可读并标注模拟数据。
- 输出最多 5 条必须修正项。

## 范围外

- 不接真实 BCI。
- 不接真实云端。
- 不处理医学结论。
- 不读取 Wave 1 冻结产物。

## 输入资料

- `docs/CONTRACTS.md`
- `docs/PROJECT_STATE.md`
- `shared/fixtures/bci-samples.json`
- `shared/fixtures/report-request.json`
- `shared/fixtures/report-response.json`
- `workspaces/app-pwa/app.js`
- 线上 PWA：`https://kanon163.github.io/tonypi-pwa/`

## 依赖

- depends_on：`0013d`
- outputs_to：`integration-review`

## 预期交付

- `workspaces/bci-cloud/WAVE3_BCI_REPORT_REVIEW.md`

## 涉及契约

- reads：`BciSample`、`SessionEvent`、`ReportRequest`、`ReportResponse`
- proposes_changes：仅通过 `HANDOFF.md`

## 验收方式

- 明确 PASS / BLOCK / CONDITIONAL PASS。
- 标出隐私和报告可信度风险，最多 5 条。

## 执行前风险判断

- 风险：报告看起来像医学诊断。
- 降低：只允许训练摘要和演示提示，不给诊断性表述。
