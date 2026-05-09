# 协作制度

## 角色

- 主控：发起每一波 request，汇总各 agent 产出，下放下一波。
- 用户：分别与各 agent 配合推进任务。
- agent：完成本角色任务，并主动上报产出、进度、依赖、阻塞。
- `integration-review`：审查任务、契约兼容性和跨 agent 冲突。

## 信息流

```text
主控发起 Wave Request
-> 主控创建 GitHub Issue
-> 用户分发 Issue/request 给各 agent
-> agent 通过 branch + PR 交付
-> agent 在各自 workspaces/<agent>/ 上报
-> 主控审查 PR 并汇总 PROJECT_STATE
-> 主控下放下一波
```

## agent 上报文件

每个子工作区必须维护：

- `STATUS.md`：当前进度。
- `HANDOFF.md`：对其他 agent 有用的交接信息。
- `BLOCKERS.md`：阻塞、依赖、需要主控或用户决策的问题。

## 中央文件

- `docs/PROJECT_STATE.md`：当前项目状态，只由主控或 `integration-review` 更新。
- `docs/ARTIFACT_INDEX.md`：产物索引，只由主控或 `integration-review` 更新。
- `docs/OPEN_QUESTIONS.md`：未决问题。
- `docs/DECISION_LOG.md`：已确认决策。
- `docs/RISK_REGISTER.md`：项目级风险。
- `docs/CONTRACTS.md`：跨模块契约。
- `docs/GITHUB_WORKFLOW.md`：GitHub Issue、branch、PR、Pages 规则。

## 读取规则

agent 开工前只读：

1. 根必读文档。
2. 自己的 `AGENTS.md`。
3. 分配给自己的任务简报。
4. 任务简报列出的输入资料。

不得主动扫描无关子工作区。需要其他 agent 信息时，先读 `PROJECT_STATE.md` 和对方 `HANDOFF.md`。

## 波次产物冻结

- 每一波结束后，原始 agent 产物进入冻结状态。
- 冻结产物不再作为后续 agent 默认输入。
- 后续 agent 只能读取主控压缩后的中央文档、契约、fixtures 和任务简报。
- 若确实需要读取冻结产物，必须由任务简报明确列出具体文件。
- 冻结产物不得被后续 agent 修改。

当前冻结产物：

- `workspaces/product-ux/DEMO_FLOW.md`
- `workspaces/level-content/OLD_DEMO_AUDIT.md`
- `workspaces/robot-bridge/TONYPI_BRIDGE_AUDIT.md`
- `workspaces/app-pwa/PWA_BASELINE.md`
- `workspaces/bci-cloud/BCI_CLOUD_AUDIT.md`
- `workspaces/integration-review/WAVE1_REVIEW.md`

## 修改规则

- agent 可以修改自己的子工作区文件。
- agent 可以产出契约修改建议。
- agent 不直接修改中央状态和中央契约。
- 中央文件由主控或 `integration-review` 汇总更新。
