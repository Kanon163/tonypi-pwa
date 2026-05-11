# STATUS

## 当前状态

Issue #14 / 0021 已完成本地修复，准备 PR。

## 本次产出

- 抽出 RobotBridge adapter：`mock` 消费 fixtures，`live` 预留 `GET /health`、`POST /commands`。
- 抽出 BCI source adapter：`mock` 消费 fixtures，`live` 使用 Web Bluetooth service UUID 配置入口。
- 准备页增加“演示设备 / 真实设备入口”模式选择。
- live 未配置或不可用时生成 `robot_unavailable`、`bci_disconnected` 与降级提示。
- mock 模式保持默认，Pages 仍可运行完整 demo。
- Service Worker cache 更新到 `tonypi-pwa-mock-v5`。

## 验证

- `node --check workspaces/app-pwa/app.js` 通过。
- 代码检查确认 live adapter、mode 选择、不可用降级与 cache v5 均存在。
- 本地静态访问 `http://127.0.0.1:8787/workspaces/app-pwa/?v=0021` 返回 200。
- `git diff --check` 通过。

## 下一步

- 开 PR 给 integration-review 复审。
