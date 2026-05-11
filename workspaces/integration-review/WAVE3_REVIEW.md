# Wave 3 专项审查汇总

## 结论

BLOCK

Wave 3 已跑通手机 PWA 访问和 Go/No-Go mock 训练，但暂不进入 Wave 4。阻塞点不是硬件未知，而是当前 mock 切片尚未完整消费已定义契约。

## 输入

- `workspaces/product-ux/WAVE3_UX_REVIEW.md`
- `workspaces/robot-bridge/WAVE3_ROBOT_REVIEW.md`
- `workspaces/bci-cloud/WAVE3_BCI_REPORT_REVIEW.md`

## 专项结论

- UX：CONDITIONAL PASS
- Robot mock：BLOCK
- BCI/report：CONDITIONAL PASS

## 必须修正

1. Robot mock 必须消费 `scan_crystal`、`failed`、`stop` 路径，并保留关键 `RobotEvent` 字段。
2. BCI 摘要必须按 session 隔离，不能混入训练前或上一轮样本。
3. BCI 断连 fixture 必须进入可操作降级路径。
4. 低信号/降级时，报告主摘要不能继续表达“整体稳定”。
5. 家长端主流程中的工程文案和演示控制必须弱化或分区，避免手机像儿童训练操作台。

## 不作为阻塞

- 真实 TonyPi stop/busy 时序。
- 真实 BCI 协议、采样率、Web Bluetooth 可用性。
- 高保真 UI 打磨。

## 下一步

开单一 app-pwa 修复任务，修正以上 5 项后再复审。复审通过后再进入 Wave 4 真实硬件替换。
