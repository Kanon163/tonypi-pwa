# BLOCKERS

## 需要决策

- 是否允许 `health_check` / `stop` 使用非动作白名单的 `name` 值：`health_check`、`stop`。

## 外部依赖

- 真实 TonyPi 上验证 `AGC.runActionGroup` 的阻塞、并发、停止行为。
- 确认动作组文件复制到 `/home/pi/TonyPi/ActionGroups` 后名称完全匹配。
- 确认 `rest` 是否适合作为异常后的默认恢复姿态。
