# HANDOFF

## 给 integration-review

- Issue #10 修复集中在 app-pwa 与 shared fixtures。
- 未接真实 BCI、真实 TonyPi、真实云端。
- 未修改中央契约，未读取或修改 Wave 1 冻结产物。

## 契约消费

- `scan_requested` 路径使用 `scan_crystal`。
- `failed` 路径使用 `scan_crystal_failed_missing_action_file`。
- 结束训练先消费 `stop_requested` / `stop_ack_ok`，仅表达 mock 停止接收后续动作，不代表真实硬中断。
- RobotEvent 保留：`commandId`、`eventType`、`status`、`errorCode`、`missingActions`、`lastError`、`stopSemantics`。

## BCI/report

- `startTraining()` 会清空 `state.samples` 和 `bciSummary`。
- BCI 断连 fixture 可由“BCI 断开”触发，并进入降级提示。
- 低信号/断连时报告主摘要不再表达整体稳定。

## UX

- 家长主界面只强调监看。
- 演示推进按钮折叠在“服务人员演示控制”中。
