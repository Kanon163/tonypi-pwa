# BLOCKERS

## 当前阻塞

- 未知真实 BCI 厂商协议、采样频率、字段含义和 Web Bluetooth 可访问性。
- 隐私策略未决：原始 BCI 数据是否允许上传、保存多久、是否需要家长授权文案。
- 报告返回契约尚未正式纳入 `docs/CONTRACTS.md`。

## 可继续推进

- Wave 3 可先用 `shared/fixtures/bci-samples.json`、`report-request.json`、`report-response.json` 跑通 mock 闭环。
- 当前 fixtures 已避免上传逐条 `raw`，可支持 `summary_only` 隐私模式验收。
