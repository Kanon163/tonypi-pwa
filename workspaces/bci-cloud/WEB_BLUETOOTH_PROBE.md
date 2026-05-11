# BCI Web Bluetooth 探针

## 结论

已建立安卓 Chrome Web Bluetooth 探针页面：

- `workspaces/bci-cloud/web-bluetooth-probe.html`
- `workspaces/bci-cloud/web-bluetooth-probe.js`

当前无法在本机替代安卓 Chrome 与真实 BCI 头环完成实测。探针已覆盖设备选择、GATT 连接、声明服务后的服务/特征值枚举、read/notify 尝试、断连记录和 `BciSample` 候选映射。

## 使用方式

1. 通过 HTTPS 或 localhost 打开 `web-bluetooth-probe.html`。
2. 使用安卓 Chrome。
3. 若知道 BCI 服务 UUID，必须填入“可选服务 UUID”。
4. 点击“选择并连接 BCI”。
5. 将页面输出的设备、服务、特征值、通知日志交给 `bci-cloud` / `app-pwa`。

`optionalServices` 留空时，只能验证浏览器能力、设备选择和 GATT 连接；不能承诺枚举 GATT services，也不能 read/notify。

## 安全上下文限制

- Web Bluetooth 需要安全上下文：HTTPS 或 localhost。
- 设备选择必须由用户点击触发，不能自动扫描。
- Web Bluetooth 只能访问 `filters.services` 或 `optionalServices` 中声明过的服务。
- iOS Safari 不支持此路径；Wave 4 目标限定安卓 Chrome。

## 探针行为

- 未知协议时可用 `acceptAllDevices` 触发设备选择，但这不等于获得 GATT service 访问权。
- 可选服务 UUID 由测试者输入，避免提前固化厂商协议。
- `optionalServices` 为空时，连接后只输出权限限制日志和下一步需求。
- `optionalServices` 非空时，连接后枚举已授权的 primary services 和 characteristics。
- 对可读特征值尝试 `readValue()`。
- 对 `notify` / `indicate` 特征值尝试 `startNotifications()`。
- 断连时记录 `gattserverdisconnected`。

## BciSample 映射

探针输出候选样本：

```json
{
  "deviceId": "browser_device_id",
  "source": "device",
  "attention": null,
  "relaxation": null,
  "signalQuality": null,
  "bandPower": {},
  "raw": {
    "characteristicUuid": "unknown",
    "inputMode": "notification",
    "byteLength": 0,
    "hexPreview": "",
    "textPreview": "",
    "parsedJson": false
  },
  "timestamp": "2026-05-11T00:00:00.000Z"
}
```

字段规则：

- 若特征值是 JSON 文本，尝试读取 `attention` / `att` / `focus`。
- 尝试读取 `relaxation` / `meditation` / `relax`。
- 尝试读取 `signalQuality` / `signal` / `poorSignal`。
- 无法稳定识别时标准字段为 `null`。
- `raw` 仅用于适配层调试，不进入 UI、关卡逻辑或报告正文。

## 真实字段 -> BciSample

| 真实字段 | BciSample 字段 | 当前状态 |
|---|---|---|
| 设备浏览器 ID | `deviceId` | 可获得 |
| 服务 UUID | `raw.characteristicUuid` 所属服务清单 | 可获得，需真机确认 |
| 特征值 UUID | `raw.characteristicUuid` | 可获得，需真机确认 |
| 通知 payload | `raw.hexPreview` / `raw.textPreview` | 可获得，协议未知 |
| 注意力 | `attention` | 未知，需厂商字段或样本数据 |
| 放松度 | `relaxation` | 未知，需厂商字段或样本数据 |
| 信号质量 | `signalQuality` | 未知，需厂商字段或样本数据 |
| 频段功率 | `bandPower` | 未知，需厂商字段或样本数据 |

## 不能解析协议时的最小需求

- BCI 头环型号和厂商。
- 目标 service UUID；没有 UUID 时只能验证设备选择，无法完成 read/notify。
- 安卓 Chrome 设备选择截图或日志。
- GATT service UUID 清单。
- characteristic UUID、properties 和样本 payload。
- 厂商字段说明，至少包含注意力、信号质量、采样频率。

## 验收状态

- 本地代码检查：已完成。
- 浏览器能力：页面会检测 `window.isSecureContext` 和 `navigator.bluetooth`。
- 安卓 Chrome 真机：待用户使用真实 BCI 验证。
- GATT read/notify：必须先提供目标 service UUID。
- 标准化样本：探针可生成 `source=device` 的候选 `BciSample`；真实字段映射待样本数据确认。

## 给 app-pwa live adapter

- `serviceUuid` 必须是配置项。
- 未知 `serviceUuid` 时只能进入 `bci_disconnected` / `unavailable` 降级，不应尝试通用 GATT 枚举。
- live adapter 仍只输出标准化 `BciSample`；`raw` 仅留在适配层调试。

## 执行前风险判断

- 风险：无真实设备协议时误写解析逻辑。
- 降低：未知字段保持 `null`，只记录服务、特征值和 raw 预览。
- 风险：raw 字段进入产品层。
- 降低：探针只在 bci-cloud 调试页面展示 raw，交接时要求 app-pwa 只消费标准字段。
