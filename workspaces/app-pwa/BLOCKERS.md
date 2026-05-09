# BLOCKERS

## 阻塞

- 无阻塞影响当前手机端交互式 mock demo 运行。

## 风险

- RobotBridge stop、busy、动作完成时序仍是 mock 语义。
- 真实 Web Bluetooth、真实 BCI、真实 TonyPi、真实云端均未验证。
- Edge headless 截图在本机未生成；已用 HTTP 检查和程序化 smoke test 替代。
- Android PWA 安装需要 HTTPS 安全上下文；普通局域网 HTTP 只能验证访问和功能闭环，通常不能安装。
- 尚未在真实安卓手机上由用户确认访问/安装结果。
- `python -m http.server` 的 `4173` 端口曾被系统拒绝，运行说明继续使用 `8787`。
