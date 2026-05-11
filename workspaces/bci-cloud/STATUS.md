# STATUS

## 当前状态

Issue #13 / tasks 0020 BCI Web Bluetooth 探针已按主控门禁意见修正。

## 最近产出

- 新增 `WEB_BLUETOOTH_PROBE.md`。
- 新增 `web-bluetooth-probe.html`。
- 新增 `web-bluetooth-probe.js`。
- 探针覆盖设备选择、GATT 连接、服务/特征值枚举、read/notify 尝试、断连记录和 `BciSample` 候选映射。
- 已明确 `optionalServices` 为空时只能验证设备选择/GATT 连接，不能访问 GATT services。

## 下一步

- 等待用户用安卓 Chrome + 真实 BCI 头环运行探针并回传日志。
- 若拿到真实 payload，再补充稳定字段映射。
