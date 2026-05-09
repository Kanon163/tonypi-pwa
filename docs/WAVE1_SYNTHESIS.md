# Wave 1 压缩结论

Wave 1 原始审计文件已冻结。后续 agent 默认不得读取或修改这些文件，应读取本文件、`docs/CONTRACTS.md` 和任务简报。

## 产品结论

- PWA 是家长端服务入口，不是儿童训练主舞台。
- 儿童佩戴 BCI 头环，主要与 TonyPi 完成训练。
- 训练中 PWA 只做家长监看、设备状态、摘要和异常处理。

## 首个垂直切片建议

推荐选择第二关 `level_gonogo_crystal_v1`。

原因：

- 对应 ADHD 执行功能训练中的抑制控制。
- 不依赖 WonderEcho 语音识别。
- 比第三关姿态识别更适合先做模拟输入。
- 能自然串起 PWA、TonyPi、BCI 记录和报告摘要。

## Wave 2 目标

Wave 2 不实现 UI，不实现安卓 PWA demo，不接真实 BCI。

Wave 2 只做：

- 契约 v0.1。
- 第二关 LevelManifest。
- RobotCommand/RobotEvent fixtures。
- BciSample/ReportRequest fixtures。
- Go/No-Go 家长端流程细化。
- Wave 3 垂直切片实施计划。

## Wave 3 候选目标

Wave 3 才开始实现最小可运行闭环：

家长端 PWA 开启训练 -> Go/No-Go 关卡运行 -> 模拟 BCI 进入记录 -> 模拟或真实 RobotBridge 返回事件 -> 训练结束生成 mock 报告摘要。

## 已暴露风险

- 真实 BCI 厂商协议未知。
- TonyPi 自动发现路径未知。
- `AGC.runActionGroup` 的阻塞、抢占、停止语义未实机验证。
- `BGM03` 被旧 demo 引用但资源目录未发现。
- 第二关和第三关存在 core 默认值与 task12 展示值不一致。

