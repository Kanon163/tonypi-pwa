# HANDOFF

## 给 app-pwa

- Issue #9 审查结论为 `CONDITIONAL PASS`。
- 必须修正 BCI 样本跨 session 累积：每次训练开始时清空本 session 样本并重新计算摘要。
- 必须消费 `disconnected` fixture 并产生 `bci_disconnected` / 降级提示。
- 低信号或降级时，报告主摘要/重点文案不能继续表达“整体稳定”。

## 给 integration-review

- 审查未提出契约变更；仅指出 app-pwa 对既有 fixtures/契约的消费缺口。
- `ReportRequest` 未发现逐条 `raw` 上传。
- `ReportResponse` 已有 `SIMULATED_DATA` 警告，医学判断边界当前可接受。

## 给 robot-bridge / level-content

- BCI 实时样本不应直接触发机器人动作。
- 如需影响训练反馈，应通过关卡策略层或训练策略层转成明确事件/命令。
