# 任务 0003：TonyPi 桥服务审计

## 目标

确认 TonyPi 可通过何种本地桥服务接收手机命令，并安全调用动作组/摄像头能力。

## 范围内

- 审计 TonyPi 教程中网络模式、动作组调用、摄像头/识别能力。
- 列出桥服务候选方案：HTTP、WebSocket、局域网发现、模拟桥。
- 设计动作组白名单和健康检查草案。

## 范围外

- 不实现桥服务。
- 不写 PWA UI。

## 输入资料

- `.参考资料/TonypiTutorial/`
- `.参考资料/ExistingDemo/Demoresources/ActionGroups/`
- `docs/CONTRACTS.md`

## 涉及契约

- `RobotCommand`
- `RobotEvent`

## 预期交付

- `workspaces/robot-bridge/TONYPI_BRIDGE_AUDIT.md`
- 桥服务推荐方案和风险清单。

## 验收方式

- 能说明手机 PWA 在 AP/LAN 模式下如何找到并控制 TonyPi。

## 执行前风险判断

- 风险：默认网络稳定或默认浏览器可访问机器人。
- 降低：必须列出 AP/LAN 两种连接路径和失败降级。

