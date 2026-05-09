# TonyPi 动作白名单索引

## 范围

- 来源：`shared/level-manifests/level_gonogo_crystal_v1.json` 的 `assets.actions` 和 `robotCues.actionGroup`。
- 用途：Wave 3 Go/No-Go 垂直切片的模拟或真实 RobotBridge。
- 状态：mock 可用；真实 TonyPi 文件存在性和停止语义待实机验证。

## 白名单

| actionGroup | 用途 | 允许识别窗口中执行 | 备注 |
|---|---|---:|---|
| `greeting` | 开场、NO-GO 成功反馈 | 否 | 低风险反馈动作 |
| `go_invite` | GO 状态邀请 | 否 | 不应在摄像头识别窗口晃动执行 |
| `nogo_stop` | NO-GO 停止提示 | 是 | 低扰动动作 |
| `scan_crystal` | 扫描晶石提示 | 否 | 扫描前执行；识别窗口内保持稳定 |
| `rest` | 稳定姿态、恢复姿态 | 是 | 降级和停止后的首选恢复动作，需实机确认 |
| `celebrate_small` | 单次扫描成功 | 否 | 扫描完成后执行 |
| `celebrate_big` | 关卡完成 | 否 | 仅结尾执行 |
| `encourage_retry` | NO-GO 违规后鼓励 | 是 | 低扰动反馈 |

## 命令约束

- `RobotCommand.type = "action_group"` 时，`name` 必须是上表之一。
- `health_check` 和 `stop` 是命令类型，不属于动作白名单。
- 不允许路径、扩展名、相对目录或任意 TonyPi 动作组名。
- 首版不允许循环动作；连续节奏由关卡拆分为多条命令。

## 待验证

- 上表动作文件是否已部署到真实 TonyPi 的动作目录。
- `stop` 是否能中断正在执行的动作组。
- `rest` 是否适合作为所有异常后的默认恢复姿态。
