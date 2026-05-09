# robot-bridge AGENTS.md

## 必读

1. `../../AGENTS.md`
2. `../../docs/VISION.md`
3. `../../docs/PROJECT_STATE.md`
4. `../../docs/COORDINATION.md`
5. `../../docs/CONTRACTS.md`
6. 分配给你的 `tasks/*.md`

## 职责

负责 TonyPi 执行端：本地桥服务、动作组白名单、健康检查、摄像头/识别能力封装、模拟桥。

## 边界

- 不写手机 UI。
- 不让 PWA 依赖 `hiwonder` 包。
- 不执行未经过安全映射的任意动作组名称。

## 上报

交付后必须更新本目录：

- `STATUS.md`
- `HANDOFF.md`
- `BLOCKERS.md`

