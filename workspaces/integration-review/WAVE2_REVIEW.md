# Wave 2 集成审查

## 结论

CONDITIONAL PASS。Wave 3 可以启动 PWA mock 垂直切片实现。

条件：

- Wave 3 默认使用模拟 BCI、模拟 RobotBridge、mock 报告。
- 真实 BCI、真实 TonyPi、真实云端不作为 Wave 3 验收标准。
- PWA 不直接调用 TonyPi SDK，不读取 Wave 1 冻结产物。

## 已审查产物

- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/fixtures/robot-commands.json`
- `shared/fixtures/robot-events.json`
- `shared/fixtures/bci-samples.json`
- `shared/fixtures/report-request.json`
- `shared/fixtures/report-response.json`
- `workspaces/product-ux/GONOGO_DEMO_FLOW.md`
- `workspaces/app-pwa/VERTICAL_SLICE_PLAN.md`

## 兼容性判断

- JSON 产物均可解析。
- `scan_success` 计数字段已统一为 `scanCount`。
- `camera_unavailable`、`operator_override_enabled`、`report_ready` 已纳入契约。
- `health_check` 和 `stop` 确认为命令类型例外，不进入动作白名单。
- `report-response.json` 可作为 Wave 3 家长端报告摘要来源。
- Go/No-Go 流程、manifest、BCI fixtures、Robot fixtures 和 PWA 计划可以组成最小闭环。

## 已收口决策

- 首切关卡：`level_gonogo_crystal_v1`。
- 默认节奏：`wave2_demo_default`。
- 报告可读状态：`report_ready`。
- 摄像头不可用：`camera_unavailable`。
- 人工扫描覆盖：`operator_override_enabled.payload.overrideType = operator_scan_override`。

## 残余风险

- RobotBridge 的 busy、stop、动作完成时序仍是 mock 语义。
- 真实 Web Bluetooth、真实 BCI 协议、TonyPi 网络发现未验证。
- 动作组文件是否真实存在于 TonyPi 仍需后续实机确认。
- Wave 3 必须在 UI 和报告中标注模拟或降级状态。

## Wave 3 门禁

允许下发 `tasks/WAVE3_REQUESTS.md`。

验收重点：

- 家长能从 PWA 启动训练。
- Go/No-Go mock 流程能完成 6 次扫描。
- BCI 样本进入会话记录和摘要。
- Robot mock 覆盖 ok、busy、failed、unavailable。
- 训练结束进入 mock 报告摘要。
- PWA 不把儿童训练做成手机小游戏。
