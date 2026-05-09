# Wave 1 Requests

本波目标：事实审计。所有 agent 只产出事实、风险、依赖和建议，不进入实现。

## 通用启动提示

```text
你现在负责 TonyPi PWA 项目的 [agent-name] 工作。

请先读取：
1. 根目录 AGENTS.md
2. docs/VISION.md
3. docs/PROJECT_STATE.md
4. docs/WORKFLOW.md
5. docs/COORDINATION.md
6. docs/CONTRACTS.md
7. workspaces/[agent-name]/AGENTS.md
8. 分配给你的任务简报

只读取任务简报中列出的输入资料。不要扫描无关子工作区。

本波只做事实审计，不做实现。交付后必须更新：
- workspaces/[agent-name]/STATUS.md
- workspaces/[agent-name]/HANDOFF.md
- workspaces/[agent-name]/BLOCKERS.md
```

## level-content

任务：`tasks/0002-old-demo-level-audit.md`

交付：`workspaces/level-content/OLD_DEMO_AUDIT.md`

重点：旧三关规则、资源、状态流、硬件依赖、可转成 `LevelManifest` 的字段。

## robot-bridge

任务：`tasks/0003-tonypi-bridge-audit.md`

交付：`workspaces/robot-bridge/TONYPI_BRIDGE_AUDIT.md`

重点：TonyPi 网络路径、动作组调用、桥服务候选方案、动作白名单、安全降级。

## product-ux

任务：`tasks/0004-product-ux-demo-flow.md`

交付：`workspaces/product-ux/DEMO_FLOW.md`

重点：家长端 PWA 服务流程、儿童与 TonyPi 训练流程、训练前/中/后体验。

## app-pwa

任务：`tasks/0005-pwa-tech-baseline.md`

交付：`workspaces/app-pwa/PWA_BASELINE.md`

重点：PWA 技术基线、模拟源、设备连接流程、家长端信息架构约束。

## bci-cloud

任务：`tasks/0006-bci-cloud-audit.md`

交付：`workspaces/bci-cloud/BCI_CLOUD_AUDIT.md`

重点：BCI 实时数据、训练摘要、报告上传、隐私风险、模拟数据源。

## integration-review

任务：审查 Wave 1 各 agent 交付。

交付：`workspaces/integration-review/WAVE1_REVIEW.md`

重点：汇总依赖、冲突、契约修改建议，并提出 Wave 2 任务。

