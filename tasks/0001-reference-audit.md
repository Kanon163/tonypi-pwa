# 任务 0001：参考资料审计

## 目标

把旧 demo、TonyPi 能力、产品 UX、BCI/云端需求拆成可并行的事实审计任务。

## 范围内

- 审计 `.参考资料/ExistingDemo/` 的三关规则、资源、硬件依赖。
- 审计 `.参考资料/TonypiTutorial/` 中与动作组、网络、摄像头、语音相关的能力。
- 输出第一批后续实现任务。

## 范围外

- 不写 PWA 代码。
- 不改旧 demo。
- 不绑定具体 BCI 厂商。

## 输入资料

- `docs/PROJECT_BRIEF.md`
- `docs/CONTRACTS.md`
- `.参考资料/ExistingDemo/`
- `.参考资料/TonypiTutorial/`

## 涉及契约

- `RobotCommand`
- `RobotEvent`
- `LevelManifest`
- `BciSample`

## 预期交付

- 各子工作区的审计记录。
- 第二批任务简报。
- 必要的契约修改建议。

## 验收方式

- `integration-review` 能从审计结果中开出垂直切片计划。

## 执行前风险判断

- 风险：审计变成大而全资料摘抄。
- 降低：只记录会影响接口、架构、任务优先级的信息。

