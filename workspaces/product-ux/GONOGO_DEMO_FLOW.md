# Go/No-Go 家长端演示流程

## 边界

- 本文面向 Wave 3 PWA 实现计划。
- 手机 PWA 是家长端服务入口；儿童训练主体验在 TonyPi。
- 不定义底层协议、不画视觉稿、不修改契约。

## 输入依据

- `docs/WAVE1_SYNTHESIS.md`
- `docs/CONTRACTS.md`
- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/fixtures/report-response.json`

## 关卡事实

- 关卡：`level_gonogo_crystal_v1`
- 名称：收集能量晶石
- 目标：抑制控制、持续注意
- 任务：Go 状态扫描 6 次晶石；No-Go 状态保持停止。
- 初始生命：3
- BCI：不阻塞关卡逻辑，但全程记录并进入摘要。
- 必需输入：TonyPi 摄像头、ArUco marker 0。
- 可降级输入：模拟 BCI、模拟 RobotBridge、人工扫描覆盖。

## 页面清单

### 训练准备

用途：让家长确认本次训练和开始条件。

显示：

- 关卡名：收集能量晶石。
- 训练目标：等待、停止、按提示行动。
- 设备摘要：BCI、TonyPi、摄像头、报告服务。
- 开始按钮，仅在最低条件满足时可用。

不显示：

- 原始 BCI 数据。
- 机器人动作组文件名或 SDK 细节。

### 设备连接

用途：完成训练前检查。

状态：

- BCI：未连接、连接中、已连接、低信号、断连、模拟。
- TonyPi：未连接、连接中、可用、忙碌、不可用、模拟。
- 摄像头/marker：待检测、检测中、可用、不可用、人工覆盖。
- 报告服务：可用、离线待上传。

家长动作：

- 重试连接。
- 使用模拟 BCI。
- 使用模拟 RobotBridge。
- 开启人工扫描覆盖。

### 训练进行

用途：家长监看，不抢走儿童注意力。

显示：

- 当前阶段：规则说明、Go、No-Go、扫描、完成。
- 进度：已扫描次数 / 6。
- 生命：剩余生命 / 3。
- BCI 摘要：注意力窗口、信号质量、是否模拟。
- 设备健康：BCI、TonyPi、报告记录状态。
- 安全操作：暂停或结束训练。

不做：

- 不把 Go/No-Go 判断做成儿童盯手机玩的按钮。
- 不展示机器人底层日志。

### 异常处理

用途：让家长知道发生了什么、还能不能继续。

场景：

- BCI 不可用：进入模拟 BCI，训练可继续，报告标注模拟数据。
- TonyPi 不可用：进入模拟 RobotBridge；若现场演示需要，可继续展示流程闭环。
- 摄像头不可用：进入人工扫描覆盖，报告标注降级。
- RobotBridge 忙碌：等待、重试或结束训练。
- 报告上传失败：本地保留记录，进入待上传状态。

每个异常必须说明：

- 影响哪个环节。
- 是否影响训练完成。
- 是否影响报告可信度。

### 训练完成

用途：确认儿童完成关卡，并准备报告摘要。

显示：

- 完成状态：成功或中止。
- 扫描数：最终扫描次数 / 6。
- No-Go 冲动反应次数。
- BCI 有效采样率、平均注意力、低信号时长。
- 是否使用降级模式。
- 报告状态：生成中、已生成、失败、待上传。

### 报告摘要

用途：给家长可理解反馈。

显示：

- 一句话总结。
- 完成情况。
- 注意力记录。
- No-Go 观察点。
- 下次建议。
- 警示：模拟数据或降级数据不作医学判断。

不显示：

- 逐条脑电原始数据。
- 儿童姓名作为云端标识。

## 状态到事件映射

- 进入训练：`session_started`、`level_started`
- 设备变化：`bci_connected`、`bci_disconnected`、`robot_connected`、`robot_unavailable`
- 阶段变化：`phase_changed`
- Go 状态：`state_go`
- No-Go 状态：`state_nogo`
- 请求扫描：`scan_requested`
- 扫描成功：`scan_success`
- No-Go 提前反应：`nogo_violation`
- BCI 窗口更新：`bci_attention_window_updated`
- 降级：`degraded_mode_entered`
- 完成：`level_completed`、`session_completed`
- 报告：`report_upload_pending`、`report_uploaded`、`report_failed`

## 演示脚本

1. 家长打开 PWA，进入训练准备。
2. PWA 展示“收集能量晶石”和训练目标。
3. 服务人员连接或切换模拟 BCI。
4. 服务人员连接或切换模拟 RobotBridge。
5. 家长点击开始训练。
6. TonyPi 讲解规则，儿童看 TonyPi。
7. Go 状态出现，TonyPi 邀请儿童扫描晶石。
8. PWA 只显示阶段、扫描进度和设备健康。
9. No-Go 状态出现，TonyPi 提示等待。
10. 演示一次 No-Go 冲动反应，生命减少并记录事件。
11. 儿童完成 6 次扫描。
12. PWA 显示训练完成页。
13. PWA 生成或读取 mock 报告摘要。
14. 家长查看报告，看到完成情况、注意力摘要、No-Go 观察点和模拟数据提示。

## 家长端状态缺口

- 需要明确 `camera_unavailable` 或等价事件，否则无法区分 TonyPi 不可用与摄像头不可用。
- 需要明确 `operator_override_enabled` 或在 `degraded_mode_entered.payload` 中记录人工覆盖类型。
- 需要报告生成中的状态；现有事件有上传状态，但缺少报告结果已可读的稳定状态名。

## Wave 3 验收要点

- 家长能从准备页启动 Go/No-Go 训练。
- 儿童不需要盯手机完成核心互动。
- PWA 能展示扫描进度、生命、设备健康和 BCI 摘要。
- 至少一个降级场景可演示。
- 训练结束能展示 mock 报告摘要。
- 报告明确标注模拟或降级数据。
