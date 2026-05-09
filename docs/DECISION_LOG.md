# 决策记录

## 2026-05-08

- 产品 SKU 定义为 BCI 头环、TonyPi 机器人、手机 PWA。
- 家长主要使用 PWA，儿童主要与 TonyPi 互动。
- 项目采用波次制协作。
- agent 产出先写入各自子工作区，再由主控汇总中央状态。
- Wave 1 定位为事实审计，不做实现。
- Wave 1 审查结论：本波是约束进展，不是功能进展。
- Wave 1 原始产物冻结；后续 agent 默认读取 `WAVE1_SYNTHESIS.md` 和 `CONTRACTS.md`。
- `docs/CONTRACTS.md` 升级为 v0.1。
- Wave 2 正式下发，拆分为 `tasks/0007` 到 `tasks/0012`。
- Wave 2 只做契约、manifest、fixtures、流程和实现计划，不实现 PWA demo。
- Wave 2 集成审查结论：CONDITIONAL PASS，可进入 Wave 3。
- 首个垂直切片确认使用 `level_gonogo_crystal_v1`。
- Wave 3 默认使用模拟 BCI、模拟 RobotBridge、mock 报告；真实硬件不作为首切片验收标准。
- 第二关默认节奏采用 `wave2_demo_default`：GO 4.5-15.0 秒，NO-GO 4.5-9.0 秒，扫描保持 2.2 秒。
- Go/No-Go 扫描计数字段统一为 `scanCount`。
- `camera_unavailable`、`operator_override_enabled`、`report_ready` 纳入契约 v0.1.1。
- `health_check` 与 `stop` 是命令类型例外，不进入动作白名单。
- Wave 3 `0013` 产物未通过产品形态验收：可运行 web demo 不等于安卓手机 PWA demo。
- 新增 `0013b`，先纠偏移动端 PWA 体验，再启动专项 review。
- Wave 3 `0013b` 通过手机视觉形态纠偏，但仍不是安卓手机可运行/可安装 PWA。
- 当前训练仍是顺序播放演示，不是可交互干预游戏运行时。
- 新增 `0013c` 和 `0013d`，先补运行链路与游戏运行时，再启动专项 review。
