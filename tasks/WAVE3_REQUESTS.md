# Wave 3 Requests

本波目标：实现并审查一个可运行的安卓手机端 PWA mock 垂直切片。

当前状态：`0013b` 已完成手机端视觉纠偏，但仍缺安卓手机真实运行链路和干预游戏运行时。

## 本波边界

做：

- 家长端 PWA 最小闭环。
- 安卓手机竖屏优先体验。
- 安卓手机真实访问/安装验证。
- 可交互干预游戏运行时。
- Go/No-Go `level_gonogo_crystal_v1` mock 关卡流程。
- 模拟 BCI、模拟 RobotBridge、mock 报告。
- 至少一个降级场景。

不做：

- 不接真实 BCI。
- 不接真实 TonyPi。
- 不接真实云端。
- 不做儿童盯手机玩的训练 UI。
- 不读取 Wave 1 冻结产物。

## 通用启动提示

```text
你现在负责 TonyPi PWA 项目的 [agent-name] Wave 3 工作。

请先读取：
1. 根目录 AGENTS.md
2. docs/VISION.md
3. docs/PROJECT_STATE.md
4. docs/COORDINATION.md
5. docs/CONTRACTS.md
6. workspaces/[agent-name]/AGENTS.md
7. 分配给你的 tasks/001x-*.md

只读取任务简报列出的输入资料。
若旧 Wave 2 产物中出现契约缺口描述，以 `docs/CONTRACTS.md` v0.1.1 和 `workspaces/integration-review/WAVE2_REVIEW.md` 为准。
不要读取 Wave 1 冻结产物。
交付后更新 workspaces/[agent-name]/STATUS.md、HANDOFF.md、BLOCKERS.md。
```

## 任务下发

- `app-pwa`：执行 `tasks/0013-wave3-pwa-mock-slice.md`
- `app-pwa`：执行 `tasks/0013b-wave3-mobile-pwa-correction.md`
- `app-pwa`：执行 `tasks/0013c-wave3-android-pwa-runtime.md`
- `app-pwa`：执行 `tasks/0013d-wave3-intervention-game-loop.md`
- `product-ux`：执行 `tasks/0014-wave3-ux-acceptance.md`
- `robot-bridge`：执行 `tasks/0015-wave3-robot-mock-review.md`
- `bci-cloud`：执行 `tasks/0016-wave3-bci-report-review.md`
- `integration-review`：执行 `tasks/0017-wave3-integration-review.md`

## 依赖关系

- `0013` 先执行。
- 若 `0013` 偏离安卓手机 PWA 目标，先执行 `0013b`。
- `0013c` 和 `0013d` 完成后，再执行 `0014`、`0015`、`0016`。
- `0017` 最后执行。
