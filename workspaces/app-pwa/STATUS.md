# STATUS

## 当前状态

Issue #10 / 0018 已完成本地修复，等待 PR 审查。

## 本次修复

- `scan_requested` 改为消费 `scan_crystal` RobotCommand/RobotEvent。
- 增加可操作的 `scan_crystal failed`、`stop_ack_ok`、BCI 断连降级路径。
- RobotEvent 关键字段写入训练事件与报告 `deviceSummary.robot.lastEvents`。
- 训练开始清空本 session BCI 样本，报告只使用本轮摘要。
- 低信号/断连时报告摘要、重点和 warning 保持一致。
- 家长主界面改为监看优先，演示控制折叠到服务人员区。
- Service Worker cache 更新到 `tonypi-pwa-mock-v4`，降低手机旧缓存风险。

## 验证

- `node --check workspaces/app-pwa/app.js` 通过。
- `shared/fixtures/robot-commands.json`、`shared/fixtures/robot-events.json` JSON 解析通过。
- 本地静态访问 `http://127.0.0.1:8787/workspaces/app-pwa/` 返回 200。
- 代码检查确认 `scan_crystal_ok`、`scan_crystal_failed_missing_action_file`、`stop_ack_ok`、`bci-disconnect` 均有运行入口。

## 下一步

- 等待主控复审 Robot mock BLOCK 是否清除。
