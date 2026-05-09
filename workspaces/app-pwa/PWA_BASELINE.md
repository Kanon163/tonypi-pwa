# PWA 技术基线

## 审计依据

- `docs/VISION.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTRACTS.md`
- `workspaces/product-ux/DEMO_FLOW.md`
- `tasks/0005-pwa-tech-baseline.md`

## 定位

家长端安卓 PWA 是服务入口、设备连接器、训练启动器、过程摘要和报告展示端。儿童训练主舞台是 TonyPi，不是手机屏幕。

## 最小技术方案

- 框架：React + TypeScript + Vite。
- PWA：Web App Manifest + Service Worker，首版只缓存应用壳和最近一次会话记录。
- 状态管理：先用轻量 store，按域拆分 `devices`、`session`、`report`；不要让 UI 直接读厂商原始 BCI 字段。
- 本地存储：IndexedDB 保存 `SessionEvent`、标准化 `BciSample`、上传队列和最近报告状态。
- 网络：PWA 通过 HTTP/WebSocket 访问 TonyPi 桥服务；不直接调用 TonyPi Python SDK。
- 蓝牙：真实 BCI 预留 Web Bluetooth 适配层；Wave 2/3 默认使用模拟 BCI，避免被浏览器兼容性阻塞。

## 模拟源

- `MockBciSource`：按 `BciSample` 输出 `attention`、`relaxation`、`signalQuality`、`bandPower`、`timestamp`，厂商字段只进入 `raw`。
- `MockRobotBridge`：接收 `RobotCommand`，返回 `RobotEvent`，覆盖 `ok`、`busy`、`unavailable`、`failed`。
- `MockLevelManifest`：只作为垂直切片临时输入；正式关卡流程等待 `LevelManifest` 契约草案。
- `MockReportApi`：接收 `ReportRequest`，返回报告占位结果；云端失败时进入待上传状态。

## 设备连接流程

1. 家长进入训练准备页。
2. PWA 检查 BCI 来源：模拟源可直接启用，真实源需浏览器支持 Web Bluetooth。
3. PWA 连接 TonyPi 桥服务：首版可手动输入地址，后续再评估 AP/LAN 发现。
4. PWA 确认训练内容、BCI、机器人桥均可用后允许开始。
5. 训练中 PWA 记录事件和健康状态，只展示家长需要理解的摘要。
6. 设备异常时写入 `SessionEvent`，展示降级原因，不把手机改造成儿童训练主舞台。

## 信息架构约束

- 必备屏幕：训练准备、设备连接、训练进行、异常处理、训练完成、报告详情。
- 开始条件：训练内容存在、BCI 来源可用、TonyPi 桥可用或明确进入降级。
- 训练中页面只做家长监看：剩余步骤、设备健康、摘要、停止入口。
- 报告页面展示家长可读解释，不堆叠原始脑电数据。

## 建议目录

```text
src/
  app/
  features/devices/
  features/session/
  features/report/
  contracts/
  mocks/
  storage/
  transport/
```

## 垂直切片建议

Wave 3 最小闭环：

1. 使用 `MockLevelManifest` 启动一段训练。
2. `MockBciSource` 产生标准化 `BciSample`。
3. 策略层把注意力指标转换为低风险 `RobotCommand`。
4. `MockRobotBridge` 返回 `RobotEvent`。
5. PWA 写入 `SessionEvent` 和本地会话记录。
6. 训练结束后生成 `ReportRequest`，展示摘要或待上传状态。

## 契约影响建议

- `SessionEvent` 需要覆盖设备连接、训练开始、阶段变化、异常、降级、完成、报告上传状态。
- `RobotEvent` 建议保留桥服务健康状态和命令失败原因字段。
- `BciSample` 的 UI 可读字段应保持标准化，`raw` 只供适配层和调试使用。
- `LevelManifest` 在草案确认前，PWA 不应硬编码长期关卡流程。

## 残余风险

- Web Bluetooth 安卓浏览器兼容性未实测。
- TonyPi 桥服务发现方式未定，首版只能建议手动地址或固定地址。
- 真实 BCI 厂商字段未提供，模拟源只能覆盖标准字段。
- `LevelManifest` 未冻结，垂直切片只能使用临时 mock。
