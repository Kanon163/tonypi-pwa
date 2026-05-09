# HANDOFF

## 给 app-pwa

- 可直接使用 `shared/fixtures/bci-samples.json` 驱动 MockBciSource。
- 场景 ID：`stable`、`fluctuating`、`low_signal`、`disconnected`。
- `report-request.json` 不包含逐条 BCI `raw`，只包含事件和 `bciSummary`。
- `report-response.json` 可用于家长端报告摘要页。

## 给 integration-review

- 报告返回契约仍未进入 `docs/CONTRACTS.md`，本次 fixture 暂用 `reportSchemaVersion`、`status`、`summary`、`highlights`、`metrics`、`sections`、`warnings`。
- `bci-samples.json` 为便于验收，在每个场景内同时给出 `BciSample` 和相关 `SessionEvent`。

## 给 robot-bridge / level-content

- BCI 实时样本不应直接触发机器人动作。
- 如需影响训练反馈，应通过关卡策略层或训练策略层转成明确事件/命令。
