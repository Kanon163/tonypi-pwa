# 任务 0008：Wave 2 Robot Fixtures

## 目标

产出 `RobotCommand` / `RobotEvent` fixtures 和 TonyPi 动作白名单索引。

## 所属波次

- Wave：2

## 负责 agent

- `robot-bridge`

## 范围内

- 编写 robot command/event 样例。
- 覆盖 `ok`、`busy`、`failed`、`unavailable`。
- 建立动作白名单索引。

## 范围外

- 不实现桥服务。
- 不读取或修改 Wave 1 原始审计文件。
- 不验证真实 TonyPi。

## 输入资料

- `docs/VISION.md`
- `docs/WAVE1_SYNTHESIS.md`
- `docs/CONTRACTS.md`
- `shared/level-manifests/level_gonogo_crystal_v1.json`（若已存在）

## 依赖

- depends_on：`docs/CONTRACTS.md`
- blocks：Wave 3 PWA 垂直切片实现
- needs_from：`level-content` 的 manifest 可增强样例，但不阻塞基础 fixtures
- outputs_to：`app-pwa`、`integration-review`

## 涉及契约

- reads：`RobotCommand`、`RobotEvent`
- proposes_changes：桥服务健康检查字段缺口
- must_not_change：`docs/CONTRACTS.md`

## 预期交付

- `shared/fixtures/robot-commands.json`
- `shared/fixtures/robot-events.json`
- `shared/resources-index/tonypi-actions.md`

## 上报要求

- 更新 `workspaces/robot-bridge/STATUS.md`
- 更新 `workspaces/robot-bridge/HANDOFF.md`
- 更新 `workspaces/robot-bridge/BLOCKERS.md`

## 验收方式

- fixtures 覆盖正常、忙碌、失败、不可用和健康检查。
- 动作名均来自白名单。

## 执行前风险判断

- 风险：fixtures 隐含真实桥服务尚未验证的能力。
- 降低：明确标注 mock 能力和待实机验证语义。

