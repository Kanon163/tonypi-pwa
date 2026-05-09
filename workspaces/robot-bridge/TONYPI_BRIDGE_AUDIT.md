# TonyPi 桥服务审计

## 范围

- 输入资料：`.参考资料/TonypiTutorial/`、`.参考资料/ExistingDemo/Demoresources/ActionGroups/`、`docs/CONTRACTS.md`。
- 本波只审计事实和风险，不实现桥服务。

## 事实

### 网络路径

- TonyPi 默认 AP 直连模式：机器人开机后创建 `HW*` 热点，默认密码 `hiwonder`。
- AP 模式默认 VNC 地址为 `192.168.149.1`；AP 不提供外网。
- STA/LAN 模式：机器人连接指定 Wi-Fi，手机和机器人在同一局域网；WonderPi 可查看机器人 IP 和设备 ID。
- AP 与 STA/LAN 不能同时使用。
- LAN 配置可通过 WonderPi 或 `hiwonder-toolbox/wifi_conf.py`；`HW_WIFI_MODE = 2` 表示 STA/LAN。
- 教程已有 PC 软件扫描/连接能力，但未暴露可直接复用的 Web API。

### 动作调用

- 动作组文件要求放在 `/home/pi/TonyPi/ActionGroups`。
- 教程示例通过 `hiwonder.ActionGroupControl as AGC` 调用动作组，形式为 `AGC.runActionGroup('name')`。
- 动作名必须与动作组文件名一致，否则调用失败。
- 部分示例支持 `times`、`lock_servos`、`with_stand` 等参数；首版桥服务应先限制为单次安全动作。

### 摄像头/识别

- TonyPi 有实时摄像头回传、颜色识别、目标跟踪、AprilTag、脸部检测、手势/姿态识别等能力。
- 摄像头云台可由舵机控制，但存在限位保护；不应允许 PWA 任意连续控制云台。
- 视觉识别依赖光照、阈值、背景干扰和目标距离。
- 颜色阈值基于 LAB 空间；教程支持通过工具调整并保存阈值。

## 动作白名单草案

白名单来源：`.参考资料/ExistingDemo/Demoresources/ActionGroups/`。

| 命令名 | 文件 | 用途 | 安全备注 |
|---|---|---|---|
| `greeting` | `greeting.d6a` | 开场问候 | 可默认允许 |
| `scan_left_right` | `scan_left_right.d6a` | 扫描环境 | 摄像头识别期间禁用 |
| `go_invite` | `go_invite.d6a` | GO 邀请动作 | 单次执行 |
| `nogo_stop` | `nogo_stop.d6a` | NO-GO 停止提示 | 必须温和 |
| `scan_crystal` | `scan_crystal.d6a` | 扫描晶石 | 应保持镜头稳定 |
| `celebrate_small` | `celebrate_small.d6a` | 小成功 | 可默认允许 |
| `celebrate_big` | `celebrate_big.d6a` | 关卡成功 | 仅关卡结束允许 |
| `encourage_retry` | `encourage_retry.d6a` | 错误后鼓励 | 可默认允许 |
| `demo_left_hand` | `demo_left_hand.d6a` | 第三关示范 | 识别窗口前执行 |
| `demo_left_hand_overhead` | `demo_left_hand_overhead.d6a` | 第三关示范 | 识别窗口前执行 |
| `demo_right_hand` | `demo_right_hand.d6a` | 第三关示范 | 识别窗口前执行 |
| `demo_right_hand_overhead` | `demo_right_hand_overhead.d6a` | 第三关示范 | 识别窗口前执行 |
| `demo_stand_open_hands` | `demo_stand_open_hands.d6a` | 第三关示范 | 识别窗口前执行 |
| `demo_squat_put_down_hands` | `demo_squat_put_down_hands.d6a` | 第三关示范 | 识别窗口前执行 |
| `rest` | `rest.d6a` | 恢复稳定姿态 | 降级/停止后优先 |

拒绝规则：

- 拒绝白名单外动作名。
- 拒绝路径、扩展名、相对目录、大小写混淆后的动作名。
- 拒绝连续循环执行；需要节奏控制由关卡引擎拆成多条命令。
- 摄像头识别窗口内，只允许 `nogo_stop`、`encourage_retry`、`rest` 等低扰动动作。

## 桥服务候选

| 方案 | 用途 | 优点 | 风险 | 建议 |
|---|---|---|---|---|
| HTTP 本地桥 | PWA 发 `RobotCommand`，桥返回 `RobotEvent` | 简单、易调试、适合健康检查 | 浏览器跨域、网络变更、命令并发 | 首选控制面 |
| WebSocket | 命令 ACK、busy、完成事件、状态推送 | 适合实时状态 | 断线重连复杂 | 首选事件面 |
| 局域网发现 | AP/LAN 下发现机器人 IP | 降低手输 IP 成本 | 浏览器能力受限，mDNS/UDP 不一定可用 | 先做桥端发现信息页或二维码，后续再评估 |
| 模拟桥 | 无硬件开发和演示 | 支持 PWA/关卡并行开发 | 可能掩盖真实网络和动作耗时 | Wave 3 必需 |

推荐首版组合：

- TonyPi 上运行 Python 桥服务。
- HTTP 提供 `/health`、`/commands`、`/stop`。
- WebSocket 或 SSE 推送 `RobotEvent`。
- PWA 不依赖 `hiwonder`，只依赖 `RobotCommand/RobotEvent`。
- AP 模式优先使用固定地址；LAN 模式允许输入/扫描/二维码导入机器人地址。

## 健康检查草案

`health_check` 应返回：

- 桥服务存活。
- 网络模式：`ap`、`lan`、`unknown`。
- 机器人 IP。
- `hiwonder`/`AGC` 是否可导入。
- 动作目录是否存在。
- 白名单动作文件是否存在。
- 当前执行状态：`idle`、`busy`、`stopping`、`unavailable`。
- 摄像头是否可打开。
- 最近错误。

## 安全降级

- 找不到 TonyPi：PWA 进入模拟桥或手动输入 IP，不开始真实动作。
- 桥服务不可达：返回 `unavailable`，展示连接排查，不排队动作。
- 动作执行中收到新动作：返回 `busy`，除 `stop` 外不抢占。
- 白名单缺文件：返回 `failed`，不尝试同名替代动作。
- 摄像头不可用：禁用识别类能力，可继续纯动作训练或模拟识别。
- 网络断开：桥本地停止接收新命令；前端标记 session 中断。
- 急停：`stop` 应优先尝试停止当前动作并执行 `rest`；若 SDK 不支持硬停止，至少拒绝后续动作并上报风险。

## 契约建议

不直接修改 `docs/CONTRACTS.md`，建议后续由 `integration-review` 评估：

- `RobotCommand.params` 增加 `durationMs`、`allowDuringVision`、`idempotencyKey` 可选字段。
- `RobotEvent.type` 增加 `command_started`、`command_finished`、`health_report`。
- `RobotEvent.data` 约定 `networkMode`、`capabilities`、`missingActions`、`cameraReady`。

## 残余风险

- 教程未给出 WonderPi/PC 软件扫描协议，浏览器原生局域网发现能力不可假设。
- 未接触真实 TonyPi，无法确认 `AGC.runActionGroup` 的阻塞、抢占和停止语义。
- AP 模式无外网，PWA 若依赖云端资源会失败。
- 摄像头识别能力适合本地封装，不适合作为 PWA 直接远程视频控制台。
