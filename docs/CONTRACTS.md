# 契约 v0.1.1

本文件是跨 agent 的唯一共享契约入口。Wave 1 原始审计文件已冻结，后续 agent 不得直接读取或修改，除非任务简报明确允许。

## 总原则

- PWA 是家长端服务入口，不直接依赖 TonyPi Python SDK。
- 儿童训练主体验发生在 TonyPi 与儿童之间。
- BCI 原始字段只进入适配层和调试层，不进入 UI、关卡逻辑或报告正文。
- 真实硬件不阻塞垂直切片；必须支持模拟 BCI、模拟 RobotBridge、mock 报告。
- 首个垂直切片关卡为 `level_gonogo_crystal_v1`。

## RobotCommand

PWA 或关卡/策略层发给 TonyPi 桥服务的命令。

```json
{
  "id": "cmd_001",
  "type": "action_group",
  "name": "go_invite",
  "params": {
    "durationMs": null,
    "allowDuringVision": false,
    "idempotencyKey": "level2_go_001"
  },
  "priority": "normal",
  "source": "level_engine",
  "sessionId": "session_001",
  "timestamp": "2026-05-08T12:00:00+08:00"
}
```

允许的 `type`：

- `action_group`
- `speech`
- `camera_mode`
- `stop`
- `health_check`

约束：

- `type=action_group` 时，`name` 必须映射到桥服务动作白名单。
- `type=health_check` 和 `type=stop` 时，`name` 可分别为 `health_check`、`stop`，不进入动作白名单。
- 不允许路径、扩展名、相对目录或任意动作组名。
- 摄像头识别窗口中只能执行低扰动动作。
- `stop` 的真实中断语义需实机验证；首版至少要求停止接收后续动作并上报状态。

## RobotEvent

TonyPi 桥服务返回给 PWA 的事件。

```json
{
  "id": "evt_001",
  "type": "command_finished",
  "commandId": "cmd_001",
  "status": "ok",
  "data": {
    "networkMode": "ap",
    "capabilities": ["action_group", "speech"],
    "cameraReady": false,
    "missingActions": []
  },
  "timestamp": "2026-05-08T12:00:01+08:00"
}
```

允许的 `type`：

- `command_ack`
- `command_started`
- `command_finished`
- `health_report`
- `error`

允许的 `status`：

- `ok`
- `failed`
- `busy`
- `unavailable`

健康状态建议字段：

- `networkMode`: `ap` / `lan` / `unknown`
- `bridgeState`: `idle` / `busy` / `stopping` / `unavailable`
- `robotIp`
- `cameraReady`
- `missingActions`
- `lastError`

## BciSample

PWA 从 BCI 适配层收到的标准化实时样本。

```json
{
  "deviceId": "bci_001",
  "source": "simulated",
  "attention": 72,
  "relaxation": 48,
  "signalQuality": 91,
  "bandPower": {},
  "raw": {},
  "timestamp": "2026-05-08T12:00:02+08:00"
}
```

字段约束：

- `source`: `simulated` / `device`
- `attention`: 0-100，缺失允许 `null`
- `relaxation`: 0-100，缺失允许 `null`
- `signalQuality`: 0-100，缺失允许 `null`
- `raw`: 只供适配层和调试使用；UI、关卡、报告正文不得读取。
- `timestamp`: 由接收端统一时钟生成，或明确来源。

## LevelManifest

关卡内容配置。首个垂直切片实现第二关 Go/No-Go。

```json
{
  "id": "level_gonogo_crystal_v1",
  "title": "收集能量晶石",
  "version": 1,
  "trainingTargets": ["inhibitory_control", "sustained_attention"],
  "rules": {
    "targetMarkerId": 0,
    "totalScans": 6,
    "centerZone": { "xMin": 0.3, "xMax": 0.7, "yMin": 0.3, "yMax": 0.7 },
    "timing": {},
    "violation": {}
  },
  "assets": {
    "audio": [],
    "actions": []
  },
  "robotCues": [],
  "bciPolicy": {},
  "successCriteria": {},
  "inputRequirements": [],
  "sessionEvents": []
}
```

约束：

- 关卡只声明规则、资源、输入依赖、机器人提示和事件。
- 关卡不得直接调用 pygame、D6A 文件或 TonyPi SDK。
- 第二关产品默认节奏采用 `wave2_demo_default`。

## SessionEvent

训练过程统一事件。

```json
{
  "sessionId": "session_001",
  "levelId": "level_gonogo_crystal_v1",
  "type": "level_started",
  "payload": {},
  "timestamp": "2026-05-08T12:00:03+08:00"
}
```

首版事件类型应覆盖：

- 设备连接：`bci_connected`、`bci_disconnected`、`robot_connected`、`robot_unavailable`
- 训练流程：`session_started`、`level_started`、`phase_changed`、`level_completed`、`session_completed`
- Go/No-Go：`state_go`、`state_nogo`、`scan_requested`、`scan_success`、`nogo_violation`
- BCI 摘要：`bci_signal_quality_changed`、`bci_attention_window_updated`、`bci_summary_ready`
- 异常降级：`error_occurred`、`degraded_mode_entered`、`camera_unavailable`、`operator_override_enabled`
- 报告：`report_upload_pending`、`report_uploaded`、`report_ready`、`report_failed`

字段约定：

- Go/No-Go 扫描计数统一使用 `scanCount`。
- `camera_unavailable` 表示 RobotBridge 可达但摄像头或 marker 检测不可用。
- `operator_override_enabled.payload.overrideType` 首版允许 `operator_scan_override`。
- `report_ready` 表示报告已生成且可展示给家长。

## ReportRequest

PWA 上传给云端或 mock 报告服务的最小请求。

```json
{
  "reportSchemaVersion": "0.1",
  "sessionId": "session_001",
  "childProfileId": "local_or_cloud_id",
  "startedAt": "2026-05-08T12:00:00+08:00",
  "endedAt": "2026-05-08T12:10:00+08:00",
  "events": [],
  "bciSummary": {
    "sampleCount": 300,
    "validSampleRate": 0.92,
    "attentionAvg": 68,
    "attentionMin": 31,
    "attentionMax": 91,
    "signalQualityAvg": 88,
    "lowSignalSeconds": 14,
    "source": "simulated"
  },
  "deviceSummary": {},
  "privacyMode": "summary_only",
  "appVersion": "0.1.0"
}
```

约束：

- 首版默认上传摘要，不上传逐条 `raw`。
- `childProfileId` 不应使用儿童姓名。
- 报告返回必须家长可读，不堆叠原始脑电数据。

## ReportResponse

mock 或云端报告服务返回给 PWA 的家长可读报告。

```json
{
  "reportSchemaVersion": "0.1",
  "sessionId": "session_001",
  "reportId": "report_001",
  "status": "ready",
  "summary": "本次训练已完成。",
  "highlights": [],
  "metrics": {},
  "sections": [],
  "warnings": []
}
```

约束：

- `status`: `ready` / `failed` / `pending`
- `summary`、`highlights`、`sections` 面向家长阅读。
- 使用模拟或降级数据时，必须在 `warnings` 中标注。

## 首版模拟要求

Wave 3 垂直切片必须具备：

- `MockBciSource`：稳定、波动、低信号、断连场景。
- `MockRobotBridge`：`ok`、`busy`、`unavailable`、`failed` 场景。
- `MockReportApi`：成功、失败、待上传场景。
