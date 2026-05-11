# 任务 0018：Wave 3 app-pwa 审查修复

## 目标

修复 Wave 3 专项审查发现的阻塞项，使 PWA mock 切片可进入 Wave 4。

## 负责 agent

- `app-pwa`

## 范围内

- Robot mock 消费 `scan_crystal`、`failed`、`stop`。
- 保留关键 `RobotEvent` 字段到训练事件或报告设备摘要。
- BCI 样本按 session 隔离。
- 消费 BCI 断连 fixture 并生成降级提示。
- 低信号/降级时修正报告主摘要。
- 弱化工程文案，区分家长监看与服务人员演示控制。

## 范围外

- 不接真实 TonyPi。
- 不接真实 BCI。
- 不接真实云端。
- 不做高保真 UI 重设计。
- 不改中央契约，除非发现现有契约无法表达。

## 输入资料

- `docs/VISION.md`
- `docs/CONTRACTS.md`
- `docs/PROJECT_STATE.md`
- `workspaces/integration-review/WAVE3_REVIEW.md`
- `workspaces/product-ux/WAVE3_UX_REVIEW.md`
- `workspaces/robot-bridge/WAVE3_ROBOT_REVIEW.md`
- `workspaces/bci-cloud/WAVE3_BCI_REPORT_REVIEW.md`
- `workspaces/app-pwa/`
- `shared/fixtures/*.json`

## 预期交付

- app-pwa 修复代码。
- 更新 `workspaces/app-pwa/STATUS.md`
- 更新 `workspaces/app-pwa/HANDOFF.md`
- 更新 `workspaces/app-pwa/BLOCKERS.md`

## 验收方式

- `scan_requested` 路径消费 `scan_crystal`。
- 可触发 `failed` RobotEvent 并显示可解释错误或降级。
- 结束训练消费 `stop` mock，并说明不代表真实硬中断。
- 每次训练的 BCI 摘要只来自本 session。
- 可触发 BCI 断连并影响报告可信度提示。
- 低信号/断连报告主摘要与 warnings 不矛盾。
- 家长主界面不再优先展示工程/控制台语义。

## 风险判断

- 风险：把 review 修复扩大成新一轮产品重做。
- 降低：只修审查列出的阻塞项和表达层问题。
