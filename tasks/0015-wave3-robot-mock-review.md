# 任务 0015：Wave 3 Robot mock 审查

## 目标

精简审查 PWA 中 RobotBridge mock 是否符合机器人契约和动作边界。

## 负责 agent

- `robot-bridge`

## 范围内

- 检查 RobotCommand/RobotEvent 消费方式。
- 检查动作白名单、busy、failed、unavailable、stop mock 语义。
- 输出最多 5 条必须修正项。

## 范围外

- 不接真实 TonyPi。
- 不验证真实动作组文件。
- 不读取 Wave 1 冻结产物。

## 输入资料

- `docs/CONTRACTS.md`
- `docs/PROJECT_STATE.md`
- `shared/fixtures/robot-commands.json`
- `shared/fixtures/robot-events.json`
- `shared/resources-index/tonypi-actions.md`
- `workspaces/app-pwa/app.js`
- 线上 PWA：`https://kanon163.github.io/tonypi-pwa/`

## 依赖

- depends_on：`0013d`
- outputs_to：`integration-review`

## 预期交付

- `workspaces/robot-bridge/WAVE3_ROBOT_REVIEW.md`

## 涉及契约

- reads：`RobotCommand`、`RobotEvent`
- proposes_changes：仅通过 `HANDOFF.md`

## 验收方式

- 明确 PASS / BLOCK / CONDITIONAL PASS。
- 说明 mock 与真实硬件差距，最多 5 条。

## 执行前风险判断

- 风险：把真实硬件未验证当成 Wave 3 阻塞。
- 降低：只阻塞 mock 契约不兼容或误导真实能力的实现。
