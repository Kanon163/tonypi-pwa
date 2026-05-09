# 任务 0014：Wave 3 UX 验收

## 目标

审查 PWA mock 切片是否符合家长端产品体验边界。

## 负责 agent

- `product-ux`

## 范围内

- 审查页面流程、文案、状态表达、降级提示。
- 检查是否把儿童训练错误地迁移到手机。
- 输出验收意见和必须修正项。

## 范围外

- 不重做高保真 UI。
- 不改代码，除非任务被明确授权。
- 不读取 Wave 1 冻结产物。

## 输入资料

- `docs/VISION.md`
- `docs/CONTRACTS.md`
- `workspaces/integration-review/WAVE2_REVIEW.md`
- `workspaces/product-ux/GONOGO_DEMO_FLOW.md`
- `tasks/0013` 的交付说明
- PWA 可运行结果或截图

## 依赖

- depends_on：`0013`
- outputs_to：`integration-review`

## 预期交付

- `workspaces/product-ux/WAVE3_UX_REVIEW.md`

## 涉及契约

- reads：`SessionEvent`、`ReportResponse`
- proposes_changes：仅通过 `HANDOFF.md`

## 验收方式

- 明确 PASS / BLOCK / CONDITIONAL PASS。
- 列出必须修复项和可后置项。

## 执行前风险判断

- 风险：把视觉偏好当作阻塞。
- 降低：只阻塞影响产品边界、家长理解、降级解释的缺陷。
