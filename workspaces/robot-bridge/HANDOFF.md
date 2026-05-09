# HANDOFF

## 给 integration-review

- `robot-commands.json` 和 `robot-events.json` 已覆盖 `ok`、`busy`、`failed`、`unavailable`、`health_report`。
- fixtures 使用 wrapper：每项包含 `case` 和纯 `command`/`event` 对象，便于测试消费。
- `stop` fixture 只声明 mock 语义：停止接收后续动作；真实中断能力未验证。
- 未修改 `docs/CONTRACTS.md`。

## 给 level-content

- Wave 3 Go/No-Go 可用动作见 `shared/resources-index/tonypi-actions.md`。
- `nogo_stop`、`rest`、`encourage_retry` 标为可在识别窗口中执行；其他动作默认不在识别窗口中执行。

## 给 app-pwa

- 可用 `shared/fixtures/robot-events.json` 模拟 RobotBridge：正常、忙碌、缺动作文件、桥不可达、停止请求。
- 健康检查事件包含 `networkMode`、`bridgeState`、`robotIp`、`cameraReady`、`missingActions`、`lastError`。
