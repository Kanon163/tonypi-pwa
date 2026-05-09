# HANDOFF

## Wave 3 0013c/0013d 产出

- `workspaces/app-pwa/` 已有可运行静态 PWA mock demo。
- 启动与手机/PWA 安装验证方式见 `RUNBOOK.md`。
- 本地服务改为绑定 `0.0.0.0`，支持同局域网手机访问。
- 页面暴露安装状态；普通局域网 HTTP 会提示需要 HTTPS 才能安装。
- 训练运行时已改为可交互 Go/No-Go，不再自动定时通关。
- 家长/演示员可触发：TonyPi 切换提示、扫描成功、提前行动、BCI 低信号、TonyPi 不可用。
- 本阶段未接真实 BCI、真实 TonyPi、真实云端。
- 未修改中央契约，未读取或修改 Wave 1 冻结产物。

## 对 integration-review

- smoke test 已覆盖交互式闭环、降级事件、报告 ready、UI 不渲染 BCI raw。
- 运行时验证：开始后不自动完成，必须通过模拟输入推进。
- 当前 app 以 `scanCount` 为唯一扫描计数字段。
- 降级使用 `camera_unavailable`、`operator_override_enabled`、`degraded_mode_entered`。
- 报告可读状态使用 `report_ready`。

## 对 robot-bridge

- 当前只使用 `MockRobotBridge` fixture。
- UI 只展示家长可读机器人状态，不展示 SDK 或动作组文件路径。
- `TonyPi 不可用` 会触发 `robot_unavailable`、视觉降级和人工扫描覆盖。

## 对 bci-cloud

- 当前使用 `bci-samples.json`、`report-request.json` 和 `report-response.json`。
- UI 不读取 `BciSample.raw`。
- 报告摘要必须展示模拟或降级提示。
- `BCI 低信号` 会影响 `bciSummary` 和报告 warning。

## 对 product-ux

- 已按手机端训练准备、设备连接、训练进行、异常处理、训练完成、报告摘要实现。
- 训练不再自动推进；家长端提供演示/辅助输入控件，但不把儿童训练主舞台转移到手机。
- 后续可替换准备页占位为真实产品图或机器人演示图。
