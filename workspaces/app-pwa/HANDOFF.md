# HANDOFF

## 给 integration-review

- #14 / 0021 只做 adapter seam，不声称已直连真实 TonyPi 或真实 BCI。
- mock 模式仍是默认路径，适合 GitHub Pages 验收。
- live 失败会进入可解释降级，不阻塞 mock demo。

## RobotBridge adapter

- `mock`：继续消费 `shared/fixtures/robot-commands.json` 与 `robot-events.json`。
- `live`：只预留 HTTP endpoint：
  - `GET /health -> RobotEvent`
  - `POST /commands -> RobotEvent`
- 当前 endpoint 未实测；字段只消费 `networkMode`、`bridgeState`、`robotIp`、`cameraReady`、`missingActions`、`lastError`。
- `missingActions` 包含 `scan_crystal` 时进入机器人动作不可用降级。
- `stop` 仍不承诺硬急停。

## BCI adapter

- `mock`：继续消费 `shared/fixtures/bci-samples.json`。
- `live`：必须配置 `serviceUuid` 后才触发 Web Bluetooth。
- 未知真实字段保持 `attention`、`relaxation`、`signalQuality` 为 `null`。
- `raw` 不进入 UI、关卡逻辑或报告正文。

## 验收入口

- mock：直接点击“进入设备连接”。
- live：选择“真实设备入口”，填写或留空配置后点击“进入设备连接”。
- live 留空应产生 `robot_unavailable` / `bci_disconnected` 降级。
