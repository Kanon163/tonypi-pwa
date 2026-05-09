# HANDOFF

## 本波产出

- `GONOGO_DEMO_FLOW.md` 已完成 Wave 2 Go/No-Go 家长端流程细化。

## 给 app-pwa

- Wave 3 最小页面：训练准备、设备连接、训练进行、异常处理、训练完成、报告摘要。
- 训练中 PWA 只显示阶段、扫描进度、生命、设备健康和 BCI 摘要。
- 儿童核心互动必须发生在 TonyPi，不要做手机端儿童操作台。
- 需要支持模拟 BCI、模拟 RobotBridge、报告待上传或失败状态。

## 给 bci-cloud

- 报告摘要页需要：一句话总结、完成情况、注意力记录、No-Go 观察点、下次建议、模拟/降级提示。
- 家长端只展示摘要字段，不展示逐条 BCI raw。

## 给 robot-bridge

- 家长端需要区分 TonyPi 不可用、RobotBridge 忙碌、摄像头不可用。
- 摄像头不可用时，流程建议进入人工扫描覆盖，并标记降级。

## 契约建议

- 增补或规范摄像头不可用事件，例如 `camera_unavailable`。
- 增补人工覆盖状态，例如 `operator_override_enabled`，或在 `degraded_mode_entered.payload` 中记录覆盖类型。
- 增补报告结果可读状态；现有上传事件不足以表达“报告已生成并可展示”。
