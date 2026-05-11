# HANDOFF

## 给 integration-review

- Issue #12 已交付 `REAL_BRIDGE_PROBE.md` 和 `tonypi_real_bridge_probe.py`。
- 当前结论为 `CONDITIONAL PASS`：脚本可直接上 TonyPi 执行，但当前环境无实机。
- 本地只验证了 `health_report` 契约形状；真实 `scan_crystal` 和 `stop` 语义未验证。
- 未修改 `docs/CONTRACTS.md`，未修改 PWA UI。

## 给 app-pwa

- 可先按探针输出字段接入：`networkMode`、`bridgeState`、`robotIp`、`cameraReady`、`missingActions`、`lastError`。
- 当前没有可供 PWA 直接调用的 live RobotBridge endpoint；本 PR 只有 TonyPi 本机一次性探针。
- #14 若本轮不实现 HTTP/SSE 桥，live Robot adapter 只能做“接口抽象 + endpoint 配置 + unavailable 降级”，不能声称已能直连 TonyPi。
- 若 #14 预留 endpoint，建议只作为下一步桥服务契约草案：`GET /health -> RobotEvent`、`POST /commands -> RobotEvent`、可选 `GET /events` 或 `SSE /events -> RobotEvent stream`；这些不是已实测事实。
- `stop` 在实机确认前只能映射为 `stopSemantics=accepts_no_new_actions_only_or_not_observed` 或同等保守语义，不能承诺硬急停。
- 若 `missingActions` 包含 `scan_crystal`，PWA 应进入机器人动作不可用降级。
