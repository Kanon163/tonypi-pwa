# HANDOFF

## 给 integration-review

- Issue #12 已交付 `REAL_BRIDGE_PROBE.md` 和 `tonypi_real_bridge_probe.py`。
- 当前结论为 `CONDITIONAL PASS`：脚本可直接上 TonyPi 执行，但当前环境无实机。
- 本地只验证了 `health_report` 契约形状；真实 `scan_crystal` 和 `stop` 语义未验证。
- 未修改 `docs/CONTRACTS.md`，未修改 PWA UI。

## 给 app-pwa

- 可先按探针输出字段接入：`networkMode`、`bridgeState`、`robotIp`、`cameraReady`、`missingActions`、`lastError`。
- `stop` 在实机确认前只能展示为“停止接收后续动作”，不能承诺硬急停。
- 若 `missingActions` 包含 `scan_crystal`，PWA 应进入机器人动作不可用降级。
