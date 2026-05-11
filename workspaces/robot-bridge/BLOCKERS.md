# BLOCKERS

## 当前阻塞

- app-pwa 当前 Robot mock 消费不足，Issue #8 判定 `BLOCK`。
- 必须修正项见 `WAVE3_ROBOT_REVIEW.md`。

## 非本轮阻塞

- 真实 TonyPi 上验证 `AGC.runActionGroup` 的阻塞、并发、停止行为。
- 确认动作组文件复制到 `/home/pi/TonyPi/ActionGroups` 后名称完全匹配。
- 确认 `rest` 是否适合作为异常后的默认恢复姿态。
