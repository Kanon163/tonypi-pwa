# 任务 0017：Wave 3 集成审查

## 目标

判断 PWA mock 垂直切片是否达到可演示 demo 标准，并决定是否进入真实硬件替换波次。

## 负责 agent

- `integration-review`

## 范围内

- 审查 `0013` 到 `0016` 的交付。
- 验证 PWA mock 闭环。
- 汇总阻塞、风险和下一波任务。

## 范围外

- 不替其他 agent 实现功能。
- 不接真实硬件。
- 不读取 Wave 1 冻结产物。

## 输入资料

- `docs/CONTRACTS.md`
- `workspaces/integration-review/WAVE2_REVIEW.md`
- `tasks/0013` 到 `tasks/0016` 交付结果
- 各 agent 的 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`

## 依赖

- depends_on：`0013`、`0014`、`0015`、`0016`
- blocks：Wave 4

## 预期交付

- `workspaces/integration-review/WAVE3_REVIEW.md`
- 更新 `docs/PROJECT_STATE.md`
- 必要时新增 Wave 4 request

## 涉及契约

- reads：全部 v0.1.1 契约
- proposes_changes：必要时升级契约

## 验收方式

- 明确 PASS / BLOCK / CONDITIONAL PASS。
- 若 PASS，说明真实硬件替换的最小顺序。

## 执行前风险判断

- 风险：只看页面存在，不看闭环数据是否贯通。
- 降低：按事件、fixtures、报告、降级路径逐项验收。
