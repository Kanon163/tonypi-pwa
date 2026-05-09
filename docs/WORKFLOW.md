# 工作流

## 原则

本项目采用波次制协作。agent 是长期角色，任务是短周期 request。每一波由主控发起，用户与各 agent 分别协作，agent 分别上报，再由主控汇总并下放下一波。

GitHub 作为任务、集成、预览和验收中枢。具体规则见 `docs/GITHUB_WORKFLOW.md`。

## 波次

### Wave 0：愿景与协作制度

目标：冻结产品愿景、协作规则、中央状态文档。

产出：

- `docs/VISION.md`
- `docs/COORDINATION.md`
- `docs/PROJECT_STATE.md`

### Wave 1：事实审计

目标：各 agent 只审计事实和风险，不做实现。

并行方向：

- `level-content`：旧 demo 三关和资源。
- `robot-bridge`：TonyPi 可控能力和网络路径。
- `product-ux`：家庭训练服务流程。
- `bci-cloud`：BCI 数据与云端报告边界。
- `app-pwa`：PWA 技术基线约束。

### Wave 2：契约草案

目标：根据 Wave 1 结果形成第一版可执行契约。

核心契约：

- `LevelManifest`
- `RobotCommand`
- `RobotEvent`
- `BciSample`
- `SessionEvent`
- `ReportRequest`

### Wave 3：垂直切片

目标：跑通一段最小产品闭环。

闭环：

家长在 PWA 开启训练 -> 儿童与 TonyPi 完成一关 -> BCI 模拟/真实数据进入记录 -> PWA 展示训练摘要。

### Wave 4：真实硬件替换

目标：把模拟 BCI、模拟机器人桥替换成真实设备路径。

### Wave 5：交付打磨

目标：完成演示脚本、异常恢复、报告体验、部署说明和验收清单。

## 单任务流程

1. 主控创建或更新 `tasks/*.md`。
2. 主控创建对应 GitHub Issue。
3. 用户把 Issue 或 request 发给对应 agent。
4. agent 读取根文档、任务简报、自己的 `AGENTS.md`。
5. agent 从任务分支提交并开 PR。
6. agent 更新 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`。
7. 主控审查 PR、预览地址和验收记录。
8. 合并后主控更新 `docs/PROJECT_STATE.md`，并决定下一波任务。

## 兼容性原则

- 前端不能直接依赖 TonyPi Python SDK。
- 机器人桥不能依赖 PWA UI 状态。
- BCI 原始数据、训练特征、干预策略分层保存。
- 关卡内容必须数据化，关卡运行时必须可测试。
- 中央状态由主控或 `integration-review` 更新，其他 agent 不直接改。
