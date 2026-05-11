# HANDOFF

## 给 integration-review

- Issue #8 审查结论为 `BLOCK`。
- 阻塞原因限定为 mock 契约消费不足，不包括真实 TonyPi 未验证项。
- 必须修正项共 4 条，见 `WAVE3_ROBOT_REVIEW.md`。
- 未修改 `docs/CONTRACTS.md`，未修改 PWA 代码。

## 给 app-pwa

- 扫描路径需要消费 `scan_crystal`。
- 需要可操作的 `failed` 和 `stop` mock 路径。
- RobotEvent 关键字段需要保留到训练事件或报告设备摘要。
