# 任务 0022：Wave 4 集成门禁

## 目标

审查 Wave 4 真实硬件替换是否形成可继续开发的最小闭环。

## 所属波次

- Wave：4

## 负责 agent

- `integration-review`

## 范围内

- 审查 `0019`、`0020`、`0021` 的 PR 和上报。
- 判断真实硬件链路是否可进入产品化实现。
- 汇总契约变更建议。
- 输出 Wave 4 go/no-go 结论和 Wave 5 前置条件。

## 范围外

- 不直接实现新功能。
- 不重新审计 Wave 1 冻结材料。
- 不扩大到云端报告产品化。

## 输入资料

- `docs/CONTRACTS.md`
- `docs/PROJECT_STATE.md`
- `tasks/0019-wave4-tonypi-bridge-probe.md`
- `tasks/0020-wave4-bci-web-bluetooth-probe.md`
- `tasks/0021-wave4-pwa-live-adapter-seam.md`
- `workspaces/robot-bridge/HANDOFF.md`
- `workspaces/bci-cloud/HANDOFF.md`
- `workspaces/app-pwa/HANDOFF.md`

## 依赖

- depends_on：`0019`、`0020`、`0021`
- blocks：Wave 5
- needs_from：各 agent PR、验收记录、阻塞清单
- outputs_to：主控、全部 agent

## 涉及契约

- reads：全部 v0.1.1 契约
- proposes_changes：必要的 v0.1.2 契约修订
- must_not_change：不得绕过主控直接改中央契约

## 预期交付

- `workspaces/integration-review/WAVE4_REVIEW.md`
- 对 `docs/CONTRACTS.md` 的最小修订建议。
- 更新 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`

## 验收方式

- 明确 PASS / BLOCK / CONDITIONAL PASS。
- 每个 BLOCK 都指向具体文件、接口或缺失验收。
- 给出下一波最多 3 个任务建议。

## 执行前风险判断

- 风险：审查变成泛泛建议。
- 降低：只按真实硬件替换闭环判断，不讨论无关产品愿景。

