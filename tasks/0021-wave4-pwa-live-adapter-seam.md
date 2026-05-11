# 任务 0021：Wave 4 PWA live adapter 接口替换

## 目标

在 PWA 中建立 `mock/live` 设备适配层，让真实 TonyPi 和 BCI 可逐步替换 mock，同时保留 Pages mock demo。

## 所属波次

- Wave：4

## 负责 agent

- `app-pwa`

## 范围内

- 抽出 RobotBridge adapter 接口。
- 抽出 BCI source adapter 接口。
- 增加 `mock` / `live` 模式选择或配置入口。
- live 不可用时保留当前 mock demo 和降级提示。
- 消费 `0019`、`0020` 的 `HANDOFF.md` 中确认的最小字段。

## 范围外

- 不直接调用 TonyPi Python SDK。
- 不解析未知 BCI raw 协议。
- 不做高保真 UI 重设计。
- 不接真实云端。

## 输入资料

- `docs/CONTRACTS.md`
- `docs/PROJECT_STATE.md`
- `workspaces/app-pwa/HANDOFF.md`
- `workspaces/robot-bridge/HANDOFF.md`
- `workspaces/bci-cloud/HANDOFF.md`
- `tasks/0019-wave4-tonypi-bridge-probe.md`
- `tasks/0020-wave4-bci-web-bluetooth-probe.md`

## 依赖

- depends_on：`0019`、`0020` 的初版 `HANDOFF.md`
- blocks：`0022`
- needs_from：RobotBridge URL/协议、BCI Web Bluetooth 探针结论
- outputs_to：`integration-review`

## 涉及契约

- reads：`RobotCommand`、`RobotEvent`、`BciSample`、`SessionEvent`
- proposes_changes：仅当 live adapter 需要新字段
- must_not_change：报告正文不展示 BCI raw

## 预期交付

- app-pwa 代码更新。
- mock 模式继续可在 GitHub Pages 使用。
- live 模式有可测试入口和不可用提示。
- 更新 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`

## 验收方式

- mock demo 不回退。
- live 模式能尝试连接 RobotBridge 和 BCI source。
- live 失败时生成 `robot_unavailable`、`bci_disconnected` 或降级事件。
- 安卓手机 Pages 仍可访问 mock demo。

## 执行前风险判断

- 风险：PWA 提前假设硬件协议，导致返工。
- 降低：只消费 `0019`、`0020` 已确认字段；未知字段保持 mock 或 unavailable。

