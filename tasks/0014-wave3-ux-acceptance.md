# 任务 0014：Wave 3 UX 验收

## 目标

精简审查当前线上 PWA 是否符合家长端产品体验边界。

## 负责 agent

- `product-ux`

## 范围内

- 审查页面流程、文案、状态表达、降级提示。
- 检查是否把儿童训练错误地迁移到手机。
- 输出最多 5 条必须修正项。

## 范围外

- 不重做高保真 UI。
- 不改代码，除非任务被明确授权。
- 不读取 Wave 1 冻结产物。

## 输入资料

- `docs/VISION.md`
- `docs/CONTRACTS.md`
- `docs/PROJECT_STATE.md`
- 线上 PWA：`https://kanon163.github.io/tonypi-pwa/`
- `workspaces/app-pwa/RUNBOOK.md`

## 依赖

- depends_on：`0013c`、`0013d`、`0013e`
- outputs_to：`integration-review`

## 预期交付

- `workspaces/product-ux/WAVE3_UX_REVIEW.md`

## 涉及契约

- reads：`SessionEvent`、`ReportResponse`
- proposes_changes：仅通过 `HANDOFF.md`

## 验收方式

- 明确 PASS / BLOCK / CONDITIONAL PASS。
- 只列必须修复项；可后置项最多 3 条。

## 执行前风险判断

- 风险：把视觉偏好当作阻塞。
- 降低：只阻塞影响产品边界、家长理解、降级解释的缺陷。
