# Wave 2 Requests

本波目标：把 Wave 1 压缩为可执行契约、fixtures 和 Go/No-Go 垂直切片计划。

Wave 2 不做：

- 不实现安卓版 PWA demo。
- 不做高保真 UI。
- 不接真实 BCI。
- 不接真实云端报告。
- 不要求真实 TonyPi 跑通。

Wave 2 要做：

- 冻结共享契约 v0.1。
- 产出第二关 Go/No-Go 的 LevelManifest。
- 产出 Robot/BCI/Report fixtures。
- 产出 Wave 3 的最小实现计划。

## 通用启动提示

```text
你现在负责 TonyPi PWA 项目的 [agent-name] Wave 2 工作。

请先读取：
1. 根目录 AGENTS.md
2. docs/VISION.md
3. docs/PROJECT_STATE.md
4. docs/COORDINATION.md
5. docs/WAVE1_SYNTHESIS.md
6. docs/CONTRACTS.md
7. workspaces/[agent-name]/AGENTS.md
8. 本 request 中分配给你的任务

不要读取 Wave 1 原始审计文件，除非本任务明确列出。
不要修改 Wave 1 原始审计文件。

交付后更新：
- workspaces/[agent-name]/STATUS.md
- workspaces/[agent-name]/HANDOFF.md
- workspaces/[agent-name]/BLOCKERS.md
```

## level-content

目标：把第二关 Go/No-Go 转成可执行 LevelManifest 和资源索引。

交付：

- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/resources-index/demo-assets.md`

要求：

- 只基于 `docs/CONTRACTS.md` 和 `docs/WAVE1_SYNTHESIS.md`。
- 必须声明规则、成功条件、事件、机器人 cue、输入依赖。
- 不实现关卡引擎。

## robot-bridge

目标：产出 RobotCommand/RobotEvent fixtures 和动作白名单索引。

交付：

- `shared/fixtures/robot-commands.json`
- `shared/fixtures/robot-events.json`
- `shared/resources-index/tonypi-actions.md`

要求：

- 包含 `ok`、`busy`、`failed`、`unavailable` 场景。
- 包含健康检查样例。
- 不实现桥服务。

## bci-cloud

目标：产出 BCI 和报告 fixtures。

交付：

- `shared/fixtures/bci-samples.json`
- `shared/fixtures/report-request.json`
- `shared/fixtures/report-response.json`

要求：

- 包含稳定、波动、低信号、断连场景。
- `ReportRequest` 不包含逐条 raw。
- 报告返回必须家长可读。

## product-ux

目标：细化 Go/No-Go 垂直切片的家长端流程。

交付：

- `workspaces/product-ux/GONOGO_DEMO_FLOW.md`

要求：

- 不做高保真 UI。
- 明确训练前、连接、训练中、异常、完成、报告摘要。
- 明确儿童看 TonyPi，家长看 PWA。

## app-pwa

目标：制定 Wave 3 的 PWA 最小实现计划。

交付：

- `workspaces/app-pwa/VERTICAL_SLICE_PLAN.md`

要求：

- 基于 shared fixtures。
- 明确目录结构、状态流、mock 源、验收方式。
- 不实现代码。

## integration-review

目标：审查 Wave 2 产物是否足以进入 Wave 3。

交付：

- `workspaces/integration-review/WAVE2_REVIEW.md`

要求：

- 检查契约一致性。
- 检查 fixtures 是否覆盖 PWA 垂直切片。
- 下发或阻止 Wave 3 实现。

