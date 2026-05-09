# AGENTS.md

## 总规则

1. 始终使用简体中文回复。
2. 进入任何工作区或子工作区后，必须先读取该目录的 `AGENTS.md`。若该文件要求继续读取其他文档，也必须先读完。
3. 若没有读到明确工作流，停止执行并询问用户，不得自行进入实现。
4. 写文档遵循极简主义：只写能约束行动、接口、验收的信息。
5. 执行前先做一次元认知检查：这样做可能出什么错，风险如何降低。

## 本工作区必读

开始任何任务前，按顺序读取：

1. `AGENTS.md`
2. `docs/VISION.md`
3. `docs/PROJECT_STATE.md`
4. `docs/WORKFLOW.md`
5. `docs/COORDINATION.md`
6. `docs/CONTRACTS.md`
7. `docs/GITHUB_WORKFLOW.md`
8. 若进入 `workspaces/*`，继续读取该子目录的 `AGENTS.md`

## 产品边界

- 本项目目标是可交付产品级 PWA demo。
- 产品 SKU：BCI 头环、TonyPi 机器人、手机 PWA。
- 家长主要使用 PWA 开启训练、管理服务、查看报告。
- 儿童佩戴 BCI 头环，主要与 TonyPi 机器人互动完成训练。
- PWA 不是旧 pygame demo 的远程控制台，也不是儿童训练的主舞台。

## 执行边界

- 不允许把旧 `task12_three_level_demo_v1_0.py` 当作长期主程序直接调用；只能作为需求、规则和资源参考。
- 关卡、机器人动作、BCI 数据、云端报告、前端 UI 必须通过契约解耦。
- 每个 agent 只能改自己任务声明内的文件。
- 跨契约变更必须先写入本 agent 的 `HANDOFF.md` 或任务交付记录，由 `integration-review` 汇总后再改 `docs/CONTRACTS.md`。
- 任何任务交付必须说明：改了什么、影响哪些契约、如何验证、残余风险。

## 波次协作

- 每一波由主控发起 request。
- GitHub Issue 作为任务分发入口，PR 作为交付和审查入口。
- 用户分别与各 agent 配合推进。
- 各 agent 只在自己的子工作区上报进度、产出、依赖和阻塞。
- 主控读取各 agent 上报后，汇总到中央状态，再下放下一波。

## 开任务门禁

新任务开始前必须有 `tasks/*.md` 任务简报，至少包含：

- 目标
- 范围内/范围外
- 输入资料
- 依赖
- 预期交付
- 涉及契约
- 验收方式
