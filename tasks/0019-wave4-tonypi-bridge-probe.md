# 任务 0019：Wave 4 TonyPi bridge 真实探针

## 目标

跑通 TonyPi 最小真实桥接路径，输出 PWA 可消费的 `RobotCommand` / `RobotEvent` 实证结果。

## 所属波次

- Wave：4

## 负责 agent

- `robot-bridge`

## 范围内

- 建立 TonyPi AP/LAN 连接探针。
- 验证 `health_check`、`scan_crystal`、`stop` 的真实或半真实路径。
- 输出动作白名单与 `scan_crystal` 映射检查。
- 记录真实 `stop` 的语义：停止接收后续动作、停止队列、或硬中断。
- 如没有实机，交付可直接在实机上运行的探针和阻塞清单。

## 范围外

- 不改 PWA UI。
- 不重构关卡逻辑。
- 不接 BCI。
- 不把 TonyPi Python SDK 暴露给 PWA。

## 输入资料

- `docs/CONTRACTS.md`
- `docs/PROJECT_STATE.md`
- `shared/resources-index/tonypi-actions.md`
- `shared/fixtures/robot-commands.json`
- `shared/fixtures/robot-events.json`
- `workspaces/robot-bridge/TONYPI_BRIDGE_AUDIT.md`

## 依赖

- depends_on：Wave 3 PR `#11`
- blocks：`0021`
- needs_from：用户提供 TonyPi 网络访问方式或说明暂无实机
- outputs_to：`app-pwa`、`integration-review`

## 涉及契约

- reads：`RobotCommand`、`RobotEvent`
- proposes_changes：仅当真实 TonyPi 无法表达现有字段
- must_not_change：`LevelManifest`、`BciSample`、`ReportRequest`

## 预期交付

- `workspaces/robot-bridge/REAL_BRIDGE_PROBE.md`
- 探针代码或命令脚本，放在 `workspaces/robot-bridge/`
- 更新 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`

## 验收方式

- 能生成至少一个符合契约的 `health_report`。
- 能说明 `scan_crystal` 是否真实可执行。
- 能说明 `stop` 的真实语义和风险。
- 若无实机，探针步骤足够具体，用户拿到 TonyPi 后可直接执行。

## 执行前风险判断

- 风险：把探针做成完整桥服务，消耗过大。
- 降低：只证明最小链路，后续再产品化。

