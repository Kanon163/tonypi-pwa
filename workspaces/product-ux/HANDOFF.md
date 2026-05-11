# HANDOFF

## 本波产出

- `WAVE3_UX_REVIEW.md` 已完成 Issue #7 / task 0014 精简 UX 验收。

## 给 app-pwa

- 必须修正家长端主流程中的“模拟 / mock / 后续阶段接入”等工程文案。
- 必须把训练运行页的演示控制与家长监看分区，避免手机看起来像儿童训练操作台。
- 必须让报告摘要数值与本次 session 一致，避免 fixture 文案和运行数据冲突。

## 给 bci-cloud

- 报告摘要应以本次 session 的 `ReportResponse`/运行指标为准。
- 模拟或降级提示应保留，但不要让家长误以为训练结果互相矛盾。

## 给 robot-bridge

- 训练中 TonyPi 状态空间已保留；本轮 UX review 未发现阻塞。

## 契约建议

- 暂无新增契约变更建议；本轮问题可在 app-pwa 表达层修正。
