# 任务 0013d：干预游戏运行时

## 目标

把当前顺序播放演示改为可交互的 Go/No-Go 干预训练运行时。

## 负责 agent

- `app-pwa`

## 范围内

- 建立关卡状态机：规则、Go、No-Go、扫描、违规、完成、降级。
- 家长端可触发或模拟儿童/TonyPi 训练输入。
- BCI mock 至少影响一种反馈或报告可信度分支。
- Robot mock 至少影响一种训练状态或降级分支。
- 保留儿童主要看 TonyPi、家长手机只做启动和监看的产品边界。
- 训练结果由事件记录生成，而不是固定动画结束生成。

## 范围外

- 不接真实 TonyPi 摄像头。
- 不要求真实 ArUco 识别。
- 不接真实 BCI。
- 不做儿童手机游戏。
- 不改中央契约。

## 输入资料

- `docs/VISION.md`
- `docs/CONTRACTS.md`
- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/fixtures/*.json`
- `workspaces/integration-review/WAVE3_APP_REVIEW.md`
- 当前 `workspaces/app-pwa/` 工程

## 预期交付

- 可交互训练运行时。
- 清晰的模拟输入控件或脚本。
- 事件记录能解释训练结果。
- 更新 `RUNBOOK.md`。
- 更新 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`。

## 验收方式

- 不操作时训练不会只靠定时动画自动“玩完”。
- Go 状态下模拟扫描会增加 `scanCount`。
- No-Go 状态下错误扫描会触发 `nogo_violation` 和生命变化。
- BCI 低信号或断连会影响报告可信度提示。
- Robot unavailable 或 busy 会进入可解释降级。
- 完成报告来自真实事件记录。

## 执行前风险判断

- 风险：把手机做成儿童训练主舞台。
- 降低：模拟输入必须表达为家长/演示员辅助或 TonyPi mock 信号，不设计儿童盯手机操作。
