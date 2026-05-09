# 任务 0012：Wave 2 集成审查

## 目标

审查 Wave 2 产物是否足以进入 Wave 3 PWA 垂直切片实现。

## 所属波次

- Wave：2

## 负责 agent

- `integration-review`

## 范围内

- 检查契约一致性。
- 检查 fixtures 是否覆盖垂直切片。
- 汇总阻塞项。
- 决定是否下发 Wave 3。

## 范围外

- 不替其他 agent 实现产物。
- 不读取 Wave 1 原始审计文件，除非发现中央契约无法解释的冲突。

## 输入资料

- `docs/VISION.md`
- `docs/WAVE1_SYNTHESIS.md`
- `docs/CONTRACTS.md`
- Wave 2 各 agent 交付物
- 各 agent 的 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`

## 依赖

- depends_on：Wave 2 其他任务交付
- blocks：Wave 3 下发
- needs_from：全部 Wave 2 agent
- outputs_to：中央状态和下一波 request

## 涉及契约

- reads：全部 v0.1 契约
- proposes_changes：必要时提出 v0.2 修改
- must_not_change：冻结的 Wave 1 原始产物

## 预期交付

- `workspaces/integration-review/WAVE2_REVIEW.md`
- 更新 `docs/PROJECT_STATE.md`
- 必要时新增 `tasks/WAVE3_REQUESTS.md`

## 上报要求

- 更新 `workspaces/integration-review/STATUS.md`
- 更新 `workspaces/integration-review/HANDOFF.md`
- 更新 `workspaces/integration-review/BLOCKERS.md`

## 验收方式

- 明确 PASS / BLOCK / CONDITIONAL PASS。
- 若 PASS，Wave 3 能直接进入实现。

## 执行前风险判断

- 风险：审查只做摘要，不做兼容性判断。
- 降低：逐项检查 manifest、fixtures、PWA plan 是否互相可用。

