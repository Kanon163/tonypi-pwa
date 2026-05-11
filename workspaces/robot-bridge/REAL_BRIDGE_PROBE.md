# Wave 4 TonyPi Bridge 真实探针

## 结论

CONDITIONAL PASS

- 已交付可在 TonyPi 上直接运行的探针：`tonypi_real_bridge_probe.py`。
- 当前环境无 TonyPi 实机，未执行真实动作。
- 本地 dry run 已生成符合 `RobotEvent` 形状的 `health_report`，状态为 `unavailable`。
- `scan_crystal` 和 `stop` 的真实语义必须在 TonyPi 上执行后确认。

## 探针文件

`workspaces/robot-bridge/tonypi_real_bridge_probe.py`

它不是产品化桥服务，只做一次性实证：

- `health_check`：检查网络、`hiwonder` 导入、动作目录、白名单动作文件、摄像头模块。
- `scan_crystal`：默认 dry run；加 `--execute-action` 才调用 `AGC.runActionGroup("scan_crystal")`。
- `stop`：记录可发现的 AGC stop 方法；加 `--execute-action` 才调用。
- `stop-during-scan`：高风险验证项，只在空旷安全场地加 `--execute-action` 执行。

## TonyPi 执行步骤（MobaXterm）

### 1. 连接 TonyPi

官方 TonyPi Pro 文档说明机器人可通过 AP 直连或 LAN 模式访问树莓派。你的电脑使用 MobaXterm 时，按下面方式建立 SSH session。

AP 模式：

- 电脑先连接 TonyPi 的 `HW*` Wi-Fi 热点。
- MobaXterm 新建 `Session -> SSH`。
- `Remote host`: `192.168.149.1`
- `Specify username`: `pi`
- 密码按 TonyPi 系统版本填写；Pi 5 常见为 `raspberrypi`。

LAN 模式：

- 电脑和 TonyPi 连接到同一局域网。
- 在 MobaXterm 新建 `Session -> SSH`。
- `Remote host`: WonderPi 或路由器中看到的 TonyPi IP。
- `Specify username`: `pi`

### 2. 复制探针

MobaXterm 连上 TonyPi 后，左侧 SFTP 面板会显示 TonyPi 文件系统。

操作：

- 在左侧进入 `/home/pi/`。
- 从电脑文件区上传 `workspaces/robot-bridge/tonypi_real_bridge_probe.py`。
- 上传后 TonyPi 上应存在：`/home/pi/tonypi_real_bridge_probe.py`。

命令行替代方式：

```bash
scp workspaces/robot-bridge/tonypi_real_bridge_probe.py pi@192.168.149.1:/home/pi/tonypi_real_bridge_probe.py
```

### 3. 运行健康检查

在 MobaXterm 的 TonyPi 终端中执行：

```bash
python3 /home/pi/tonypi_real_bridge_probe.py --mode health --jsonl /home/pi/robot_probe_health.jsonl
```

验收点：

- 输出 `type=health_report`。
- `status=ok` 表示 `hiwonder` 和动作目录可用。
- `data.missingActions` 必须不包含 `scan_crystal`。
- `data.cameraReady` 记录摄像头模块是否可导入；摄像头不可用不阻塞动作探针。

### 4. 检查 `scan_crystal`

先 dry run：

```bash
python3 /home/pi/tonypi_real_bridge_probe.py --mode scan
```

确认动作文件存在后，在空旷场地执行：

```bash
python3 /home/pi/tonypi_real_bridge_probe.py --mode scan --execute-action --jsonl /home/pi/robot_probe_scan.jsonl
```

验收点：

- `status=ok` 且 `data.completedAction=scan_crystal`：真实可执行。
- `status=failed` 且 `errorCode=ACTION_FILE_MISSING`：白名单存在，但 TonyPi 未部署该动作文件。
- `status=unavailable` 且 `errorCode=AGC_IMPORT_FAILED`：TonyPi Python SDK 路径不可用。

### 5. 检查 `stop`

低风险检查：

```bash
python3 /home/pi/tonypi_real_bridge_probe.py --mode stop --execute-action
```

高风险中断检查：

```bash
python3 /home/pi/tonypi_real_bridge_probe.py --mode stop-during-scan --execute-action --jsonl /home/pi/robot_probe_stop.jsonl
```

验收点：

- `data.realInterruptVerified=true`：观察到硬中断。
- `stopSemantics=accepts_no_new_actions_only_or_not_observed`：未证明硬中断，只能作为“停止接收后续动作”处理。
- `actionThreadStillRunning=true`：动作仍在执行，PWA 不得承诺急停能力。

### 6. 取回结果

MobaXterm 左侧 SFTP 面板中下载这些文件：

- `/home/pi/robot_probe_health.jsonl`
- `/home/pi/robot_probe_scan.jsonl`
- `/home/pi/robot_probe_stop.jsonl`

把文件内容交给 `integration-review` 或贴回 Issue/PR，即可判断真实 TonyPi 能力。

## 本地 dry run 结果

当前 Windows 工作区无 `hiwonder` 和 `/home/pi/TonyPi/ActionGroups`，健康检查输出为：

```json
{
  "type": "health_report",
  "status": "unavailable",
  "data": {
    "networkMode": "unknown",
    "bridgeState": "unavailable",
    "capabilities": ["health_check", "stop"],
    "cameraReady": false,
    "missingActions": ["celebrate_big", "celebrate_small", "encourage_retry", "go_invite", "greeting", "nogo_stop", "rest", "scan_crystal"],
    "realHardwareProbe": true
  }
}
```

这只验证契约形状，不代表 TonyPi 实机结果。

## PWA 可消费字段

探针输出保持 `RobotEvent` v0.1.1 形状：

- `type`: `health_report` / `command_ack` / `command_finished` / `error`
- `status`: `ok` / `failed` / `unavailable`
- `data.networkMode`
- `data.bridgeState`
- `data.robotIp`
- `data.cameraReady`
- `data.missingActions`
- `data.lastError`

## 当前阻塞

- 需要用户提供 TonyPi AP 或 LAN 访问方式。
- 需要实机确认 `/home/pi/TonyPi/ActionGroups/scan_crystal.d6a` 是否存在。
- 需要实机确认 `AGC.runActionGroup("scan_crystal")` 是否阻塞、耗时多久、失败时抛什么异常。
- `stop` 是否硬中断仍未知；未验证前只能按“停止接收后续动作”对待。

## 不做的事

- 不改 PWA UI。
- 不接 BCI。
- 不暴露 TonyPi Python SDK 给 PWA。
- 不把该探针当长期桥服务。
