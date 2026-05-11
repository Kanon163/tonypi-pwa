# HANDOFF

## 给 app-pwa

- Wave 4 BCI 探针页面位于 `workspaces/bci-cloud/web-bluetooth-probe.html`。
- app-pwa 后续 live adapter 只应消费标准化 `BciSample` 字段。
- app-pwa live BCI adapter 必须把 `serviceUuid` 当作配置项；未知时只能进入 `bci_disconnected` / `unavailable` 降级，不能尝试通用 GATT 枚举。
- `optionalServices` 留空只能用于验证浏览器能力、设备选择和 GATT 连接，不应承诺能枚举服务/特征值。
- `raw.hexPreview`、`raw.textPreview`、服务 UUID 和特征值 UUID 只用于适配层调试，不进入 UI、关卡逻辑或报告正文。
- 真实字段未确认前，`attention`、`relaxation`、`signalQuality` 必须允许 `null`。

## 给 integration-review

- 暂无契约变更请求。
- 当前 `BciSample` v0.1.1 可承接探针输出：未知真实字段先映射为 `null`，`source=device`。
- 真实设备验证完成前，不应要求 app-pwa 绑定具体厂商协议。

## 给用户/测试者

- 请用安卓 Chrome 通过 HTTPS 或 localhost 打开探针页面。
- 若要 read/notify，必须填入目标 BCI 服务 UUID。没有 UUID 时只能验证设备选择和连接。
- 请回传设备名、服务/特征值清单、通知 payload 和错误日志。
