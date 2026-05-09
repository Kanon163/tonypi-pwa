# 任务 0005：PWA 技术基线

## 目标

提出家长端安卓 PWA 的最小技术方案，支持模拟 BCI、模拟机器人桥和训练垂直切片。

## 范围内

- 前端框架、状态管理、离线缓存、设备连接与蓝牙接入策略。
- 模拟数据源和本地开发方式。
- 第一版目录结构建议。

## 范围外

- 不实现完整应用。
- 不接真实 BCI。
- 不直接调用 TonyPi SDK。

## 输入资料

- `docs/ARCHITECTURE.md`
- `docs/CONTRACTS.md`
- `workspaces/product-ux/DEMO_FLOW.md`（若已存在）

## 涉及契约

- `BciSample`
- `LevelManifest`
- `RobotCommand`
- `RobotEvent`
- `SessionEvent`

## 预期交付

- `workspaces/app-pwa/PWA_BASELINE.md`
- 第一版垂直切片实施建议。

## 验收方式

- 能让集成审查开出家长端 PWA 垂直切片实施任务。

## 执行前风险判断

- 风险：过早追求完整技术栈。
- 降低：只选择能支撑垂直切片的最小方案。
