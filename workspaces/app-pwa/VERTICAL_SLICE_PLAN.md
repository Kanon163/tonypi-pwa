# PWA 垂直切片计划

## 目标

Wave 3 实现最小可运行闭环：

家长在 PWA 启动 `level_gonogo_crystal_v1` -> Go/No-Go 训练运行 -> 模拟 BCI 进入记录 -> 模拟 RobotBridge 返回事件 -> 结束后展示 mock 报告摘要。

## 输入

- `docs/WAVE1_SYNTHESIS.md`
- `docs/CONTRACTS.md`
- `workspaces/product-ux/GONOGO_DEMO_FLOW.md`
- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/fixtures/bci-samples.json`
- `shared/fixtures/robot-commands.json`
- `shared/fixtures/robot-events.json`
- `shared/fixtures/report-request.json`
- `shared/fixtures/report-response.json`

## 不做

- 不接真实 BCI。
- 不接真实 TonyPi。
- 不接真实云端。
- 不做儿童盯手机玩的训练 UI。
- 不读取或依赖 Wave 1 原始审计文件。

## 最小页面

1. 训练准备：显示关卡、目标、设备摘要、开始条件。
2. 设备连接：选择模拟 BCI、模拟 RobotBridge、报告 mock、人工扫描覆盖。
3. 训练进行：显示阶段、扫描进度 `scanCount / 6`、生命 `lives / 3`、BCI 摘要、设备健康、结束入口。
4. 异常处理：显示降级原因、影响范围、是否可继续。
5. 训练完成：显示完成状态、扫描数、No-Go 违规次数、BCI 摘要、报告状态。
6. 报告摘要：展示 `report-response.json` 的家长可读内容和模拟数据提示。

## 建议目录

```text
src/
  app/
    routes/
    App.tsx
  contracts/
    types.ts
    validators.ts
  features/
    devices/
    gonogo/
    report/
    session/
  fixtures/
  mocks/
    mockBciSource.ts
    mockRobotBridge.ts
    mockReportApi.ts
  storage/
    sessionStore.ts
  ui/
```

## 状态流

```text
idle
-> preparing
-> devices_ready
-> session_running
-> level_running
-> report_generating
-> completed
```

异常分支：

```text
devices_ready/session_running
-> degraded
-> session_running 或 completed
```

## 会话事件

Wave 3 至少写入：

- `session_started`
- `level_started`
- `robot_connected`
- `bci_connected`
- `phase_changed`
- `state_go`
- `state_nogo`
- `scan_requested`
- `scan_success`
- `nogo_violation`
- `bci_attention_window_updated`
- `degraded_mode_entered`
- `level_completed`
- `bci_summary_ready`
- `report_uploaded` 或 `report_upload_pending`
- `session_completed`

## Mock 边界

### BCI

- 使用 `bci-samples.json` 场景：`stable`、`fluctuating`、`low_signal`、`disconnected`。
- UI 只读标准字段：`attention`、`signalQuality`、`source`。
- `raw` 不进入 UI。

### RobotBridge

- 使用 `robot-commands.json` 生成命令。
- 使用 `robot-events.json` 模拟 `ok`、`busy`、`failed`、`unavailable`。
- 命令名只能来自 manifest `assets.actions` 和契约白名单。

### Report

- 训练结束后生成与 `report-request.json` 同形的请求。
- mock API 返回 `report-response.json`。
- 失败时进入 `report_upload_pending`，本地保留会话。

### 关卡输入

- `level_gonogo_crystal_v1.json` 是关卡唯一内容源。
- 摄像头/marker 首版允许人工扫描覆盖。
- BCI 不阻塞关卡逻辑，只影响记录和报告可信度。

## 实现顺序

1. 建立契约类型和 fixture 读取。
2. 建立会话 store 和事件追加机制。
3. 建立 mock BCI、mock RobotBridge、mock ReportApi。
4. 实现设备连接状态页。
5. 实现 Go/No-Go 关卡状态机：Go、No-Go、扫描、违规、完成。
6. 实现训练进行页和异常降级页。
7. 实现训练完成页和报告摘要页。
8. 加入本地存储和待上传状态。

## 验收

- 家长能从准备页启动 `收集能量晶石`。
- 默认 mock 路径可完成 6 次扫描并进入报告摘要。
- 训练中能展示阶段、扫描进度、生命、设备健康和 BCI 摘要。
- 能演示至少一个降级场景：BCI 低信号、RobotBridge 不可用或人工扫描覆盖。
- 报告明确标注模拟或降级数据，不展示原始 BCI。
- PWA 不直接调用 TonyPi SDK。

## 契约缺口

- 需要稳定表示摄像头不可用：建议 `camera_unavailable` 或 `degraded_mode_entered.payload.reason = camera_unavailable`。
- 需要稳定表示人工覆盖：建议 `degraded_mode_entered.payload.mode = operator_scan_override`。
- 需要报告结果可读状态：建议补充 `report_ready`，或明确 `report_uploaded` 后由 mock response 驱动 UI。
- `scan_success` fixture 使用 `scanIndex`，manifest 使用 `scanCount`；Wave 3 实现前需统一字段名。

## 残余风险

- RobotBridge stop、busy、动作完成时序仍是 mock 语义。
- 真实 Web Bluetooth 兼容性不在 Wave 3 首切片内验证。
- 真实摄像头/marker 识别不在首切片内验证。
