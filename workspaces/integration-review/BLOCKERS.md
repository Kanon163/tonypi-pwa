# BLOCKERS

## 当前阻塞

- Robot mock 未完整消费 `RobotCommand` / `RobotEvent` 契约：`scan_crystal`、`failed`、`stop` 路径缺失。
- BCI mock 未消费断连场景，样本可能跨 session 累积。
- 低信号/降级报告主摘要与 warning 可能矛盾。
- 家长端仍暴露工程文案和演示控制台语义。

## 后续阻塞

- 真实 BCI 协议与 Web Bluetooth 可访问性未知。
- 真实 TonyPi stop、busy、动作完成时序未实机验证。
- 首版 TonyPi 真实连接方式是否允许手动输入 IP 仍待决策。
- 第一关 WonderEcho 是否进入后续版本仍待决策。
