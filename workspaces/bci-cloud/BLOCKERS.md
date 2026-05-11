# BLOCKERS

## 当前阻塞

- 未知真实 BCI 厂商协议、采样频率、字段含义和 Web Bluetooth 可访问性。
- 隐私策略未决：原始 BCI 数据是否允许上传、保存多久、是否需要家长授权文案。
- Issue #9 审查发现 app-pwa 尚未消费 BCI 断连 fixture。
- Issue #9 审查发现 BCI 样本可能跨 session 累积，影响报告摘要可信度。
- Issue #9 审查发现低信号时报告主文案与风险提示不一致。

## 可继续推进

- 不需要真实 BCI 或真实云端即可修正以上问题。
- 当前问题不要求改契约，优先由 app-pwa 在 mock 运行时修正。
