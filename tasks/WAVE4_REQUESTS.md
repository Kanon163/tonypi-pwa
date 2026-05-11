# Wave 4 Requests

本波目标：用最小真实硬件路径替换 mock，证明 TonyPi 与 BCI 可以进入 PWA 训练闭环。

## 本波边界

做：

- TonyPi bridge 真实探针。
- BCI Web Bluetooth 真实探针。
- PWA `mock/live` adapter 接口。
- 保留当前 GitHub Pages mock demo 可测。

不做：

- 不做高保真 UI 重设计。
- 不做云端报告产品化。
- 不把 PWA 变成 TonyPi 控制台。
- 不要求一次完成所有真实硬件异常处理。

## 通用启动提示

```text
你现在负责 TonyPi PWA 项目的 [agent-name] Wave 4 工作。

请先读取：
1. 根目录 AGENTS.md
2. docs/VISION.md
3. docs/PROJECT_STATE.md
4. docs/COORDINATION.md
5. docs/CONTRACTS.md
6. workspaces/[agent-name]/AGENTS.md
7. 分配给你的 tasks/00xx-*.md

只读取任务简报列出的输入资料。
不要主动扫描无关子工作区。
交付后更新 workspaces/[agent-name]/STATUS.md、HANDOFF.md、BLOCKERS.md。
PR 必须说明：改了什么、影响哪些契约、如何验证、残余风险。
```

## 任务下发

- `robot-bridge`：执行 `tasks/0019-wave4-tonypi-bridge-probe.md`
- `bci-cloud`：执行 `tasks/0020-wave4-bci-web-bluetooth-probe.md`
- `app-pwa`：等待 `0019`、`0020` 初版 `HANDOFF.md` 后执行 `tasks/0021-wave4-pwa-live-adapter-seam.md`
- `integration-review`：最后执行 `tasks/0022-wave4-integration-gate.md`

## 优先级

1. `0019` 和 `0020` 并行。
2. `0021` 只消费已确认字段，不猜硬件协议。
3. `0022` 做 go/no-go，不扩散讨论。

