# 任务 0006：BCI 与云端报告审计

## 目标

明确 BCI 实时数据、训练摘要和云端报告的分层边界。

## 范围内

- Web Bluetooth 接入假设。
- `BciSample` 标准字段建议。
- 报告上传和云端返回的最小数据形态。
- 隐私和安全风险。

## 范围外

- 不绑定具体厂商 SDK。
- 不实现云端服务。
- 不把实时 BCI 直接写进机器人动作逻辑。

## 输入资料

- `docs/PROJECT_BRIEF.md`
- `docs/CONTRACTS.md`

## 涉及契约

- `BciSample`
- `ReportRequest`
- `SessionEvent`

## 预期交付

- `workspaces/bci-cloud/BCI_CLOUD_AUDIT.md`
- 模拟 BCI 数据源建议。

## 验收方式

- `app-pwa` 能用模拟 BCI 完成第一版闭环。

## 执行前风险判断

- 风险：未知硬件协议导致架构卡死。
- 降低：先定义适配层和模拟源，真实设备作为后续替换。

