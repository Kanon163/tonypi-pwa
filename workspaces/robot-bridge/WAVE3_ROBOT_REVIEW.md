# Wave 3 Robot Mock 审查

## 结论

BLOCK

原因：当前 PWA 只“读取 fixtures 中的少量字段”，没有按 `RobotCommand` / `RobotEvent` 契约完整消费 Robot mock；`stop`、`failed` 两个必备场景未进入可操作路径。

## 输入

- Issue：#8 `[0015] Wave 3 Robot mock 精简审查`
- 任务：`tasks/0015-wave3-robot-mock-review.md`
- 契约：`docs/CONTRACTS.md`
- fixtures：`shared/fixtures/robot-commands.json`、`shared/fixtures/robot-events.json`
- 白名单：`shared/resources-index/tonypi-actions.md`
- PWA：`workspaces/app-pwa/app.js`
- 线上只读检查：根路径 200，`/workspaces/app-pwa/` 200

## 必须修正项

1. `scan_requested` 没有使用 `scan_crystal` 命令。
   - 证据：`requestScan()` 在 `workspaces/app-pwa/app.js:285` 触发扫描，但 `app.js:292` 调用的是 `addRobotFeedback("go_invite_ok")`。
   - 影响：扫描阶段绕过了白名单中的 `scan_crystal`，Robot mock 与 LevelManifest 的机器人提示不一致。
   - 要求：扫描请求必须消费 `scan_crystal` 对应的 `RobotCommand` / `RobotEvent` mock。

2. `failed` 场景没有可操作入口。
   - 证据：fixtures 有 `scan_crystal_failed_missing_action_file`，但 `app.js` 只引用 `health_check_ap_ok`、`go_invite_ok`、`nogo_stop_busy`、`rest_unavailable_bridge_down`。
   - 影响：任务要求覆盖 `failed`，当前 UI/运行时无法验证缺动作文件或动作失败路径。
   - 要求：提供 mock 入口或运行分支，消费 `failed` RobotEvent，并进入可解释降级或错误提示。

3. `stop` mock 未被消费。
   - 证据：`completeTraining()` 在 `workspaces/app-pwa/app.js:399` 直接结束训练；`app.js:836` 的“结束训练”按钮直接调用 `completeTraining()`。fixtures 中的 `stop_requested` 和 `stop_ack_ok` 未被引用。
   - 影响：契约要求 `stop` 首版至少停止接收后续动作并上报状态；当前 PWA 没有验证该语义。
   - 要求：结束训练或取消训练路径必须消费 `stop` 命令和 `stop_ack_ok` 事件，并明确 mock stop 不代表真实硬中断。

4. RobotEvent 关键字段被丢弃。
   - 证据：`addRobotFeedback()` 在 `workspaces/app-pwa/app.js:271` 只抽取 `status` / `bridgeState`，然后写入自定义 `robot_command_mocked` SessionEvent；`commandId`、`event.type`、`data.errorCode`、`missingActions`、`lastError` 未进入训练事件或报告设备摘要。
   - 影响：PWA 无法证明它按 `RobotEvent` 契约处理 `busy`、`failed`、`unavailable` 的差异。
   - 要求：Robot mock 消费层必须保留并转写关键 RobotEvent 字段，至少包括 `commandId`、`type`、`status`、`errorCode`、`missingActions`、`lastError`。

## 真实硬件差距

- 本审查不接真实 TonyPi，不验证动作组文件。
- `AGC.runActionGroup` 的阻塞、并发、停止语义仍待后续硬件波次验证。
- 当前 BLOCK 只针对 mock 契约消费不足，不针对真实硬件未知项。
