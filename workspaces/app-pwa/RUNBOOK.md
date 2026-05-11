# 运行说明

## 启动

在仓库根目录运行：

```powershell
python -m http.server 8787 --bind 0.0.0.0
```

电脑本机访问：

```text
http://127.0.0.1:8787/workspaces/app-pwa/
```

查看电脑局域网 IP：

```powershell
ipconfig
```

## 验证

### 手机验证

1. 让手机和电脑处于同一局域网。
2. 将访问地址中的 `127.0.0.1` 换成电脑局域网 IP。
3. 用安卓浏览器竖屏打开 `http://<电脑IP>:8787/workspaces/app-pwa/`。
4. 检查准备页是否像手机 PWA：无桌面两栏、无工程术语、有机器人图片预留区。
5. 点击“进入设备连接”。
6. 点击“模拟摄像头不可用”验证降级。
7. 点击“开始训练”。
8. 不操作时训练不会自动完成。
9. 展开“服务人员演示控制”，点击“切换阶段”和“记录扫描完成”，完成 6 次扫描。
10. 在 No-Go 阶段点击“记录提前行动”，确认生命值变化。
11. 点击“BCI 低信号”或“TonyPi 不可用”，确认降级提示。
12. 在不足 6 次扫描时点击“结束训练”，确认页面显示“训练未完成/提前结束”，报告不标记为成功完成。
13. 展开“服务人员演示控制”，点击“扫描动作失败”，确认训练动态提示 TonyPi 扫描动作不可用。
14. 点击“BCI 断开”，确认训练动态提示 BCI 断开，报告摘要不再表达整体稳定。
15. 重新开始，完成 6 次扫描。
16. 进入训练完成页后点击“查看报告摘要”。
17. 确认报告标注演示或降级数据。

### live adapter 入口验证

1. 打开 `http://127.0.0.1:8787/workspaces/app-pwa/?v=0021`。
2. 在准备页选择“真实设备入口”。
3. 不填写 `RobotBridge endpoint` 和 `BCI service UUID`，点击“进入设备连接”。
4. 确认页面显示 BCI / TonyPi 不可用，并生成降级提示。
5. 点击“切回演示设备”，确认 mock demo 仍可继续完整训练。
6. 若已有 RobotBridge HTTP endpoint，可填写 endpoint 后重试。
7. 若已有 BCI service UUID，可在安卓 Chrome HTTPS 或 localhost 环境填写后重试。

当前 live 入口只做 adapter seam：

- RobotBridge 预留 `GET /health` 与 `POST /commands`。
- BCI 只在填写 service UUID 后触发 Web Bluetooth 设备选择。
- 未知协议不解析，不展示 BCI raw。

### PWA 安装验证

- `http://<电脑IP>:8787` 可验证手机访问和训练闭环，但 Android Chrome 通常不会在普通局域网 HTTP 下允许安装 PWA。
- 若要验证“添加到主屏幕”，需要 HTTPS 安全上下文。
- 可行方式：用 ngrok、Cloudflare Tunnel 或同类工具把 `http://127.0.0.1:8787` 暴露为 HTTPS 地址。
- 用安卓 Chrome 打开 HTTPS 地址后，检查页面“手机安装状态”，或从浏览器菜单选择“添加到主屏幕”。
- 若仍无法安装，记录浏览器提示；常见原因是证书不受信任、HTTPS 隧道不可用或浏览器策略限制。

示例：

```powershell
python -m http.server 8787 --bind 0.0.0.0
ngrok http 8787
```

### 桌面移动视口验证

1. 打开浏览器开发者工具。
2. 选择手机竖屏视口，建议 `390 x 844` 或 `412 x 915`。
3. 访问 `http://127.0.0.1:8787/workspaces/app-pwa/`。
4. 按“手机验证”的第 4 到 15 步检查。

## 边界

- 不直接调用 TonyPi Python SDK。
- 不解析未知 BCI raw 协议。
- 不接真实云端。
- 不展示 BCI raw 字段。
