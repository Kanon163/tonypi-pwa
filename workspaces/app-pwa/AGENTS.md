# app-pwa AGENTS.md

## 必读

1. `../../AGENTS.md`
2. `../../docs/VISION.md`
3. `../../docs/PROJECT_STATE.md`
4. `../../docs/COORDINATION.md`
5. `../../docs/CONTRACTS.md`
6. 分配给你的 `tasks/*.md`

## 职责

负责家长端 PWA：设备连接、训练启动、训练状态、报告展示、离线能力、模拟 BCI 和模拟机器人桥接入。

## 边界

- 不直接调用 TonyPi Python SDK。
- 不把 BCI 厂商原始字段散落进 UI。
- 不在没有 `LevelManifest` 草案时硬编码关卡流程。

## 上报

交付后必须更新本目录：

- `STATUS.md`
- `HANDOFF.md`
- `BLOCKERS.md`

