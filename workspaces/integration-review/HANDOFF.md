# HANDOFF

Wave 2 已完成审查，结论为 CONDITIONAL PASS。

## 给 Wave 3 agents

- 首切关卡：`level_gonogo_crystal_v1`。
- 默认路径：模拟 BCI、模拟 RobotBridge、mock 报告。
- 扫描字段统一使用 `scanCount`。
- 报告可读状态使用 `report_ready`。
- 摄像头不可用使用 `camera_unavailable`。
- 人工扫描覆盖使用 `operator_override_enabled.payload.overrideType = operator_scan_override`。
- `health_check` 与 `stop` 是命令类型，不进入动作白名单。

## 边界

- 不读取 Wave 1 冻结产物。
- 不接真实 BCI、真实 TonyPi、真实云端。
- PWA 不直接调用 TonyPi SDK。

## 当前审查结论

- `0013b` 手机视觉形态纠偏通过。
- 但安卓手机真实运行/安装未验证。
- 干预游戏仍是顺序播放演示，未形成可交互运行时。
- 先执行 `0013c` 和 `0013d`，再做专项 review。
