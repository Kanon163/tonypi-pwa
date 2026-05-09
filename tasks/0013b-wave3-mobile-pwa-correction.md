# 任务 0013b：Wave 3 手机端 PWA 纠偏

## 目标

把当前电脑端 web demo 改为面向安卓手机的家长端 PWA demo。

## 负责 agent

- `app-pwa`

## 背景

当前 `0013` 已跑通 mock 数据闭环，但产品形态偏电脑网页，不符合“安卓手机 PWA demo”的目标。

必须读取用户反馈：

- `workspaces/app-pwa/UX_FEEDBACK.md`

## 范围内

- 移动端优先布局，默认按安卓手机竖屏设计。
- 准备页去掉工程信息，如“契约来源”“Wave 3 mock slice”。
- 准备页预留产品图片/机器人图片空间。
- 运行页预留 TonyPi 视觉信号/机器人状态空间。
- 将“会话事件”改为家长可理解的训练动态。
- 保留现有 mock 闭环：6 次扫描、BCI 摘要、Robot mock、报告摘要、降级场景。

## 范围外

- 不接真实 BCI。
- 不接真实 TonyPi。
- 不接真实云端。
- 不做儿童手机游戏。
- 不读取 Wave 1 冻结产物。

## 输入资料

- `docs/VISION.md`
- `docs/CONTRACTS.md`
- `workspaces/app-pwa/UX_FEEDBACK.md`
- `workspaces/app-pwa/STATUS.md`
- 当前 `workspaces/app-pwa/` PWA 工程

## 预期交付

- 更新后的手机端 PWA。
- 更新 `RUNBOOK.md`：说明如何用手机访问或用移动端视口验证。
- 更新 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`。

## 涉及契约

- 不改中央契约。
- 不改 shared fixtures，除非先在 `HANDOFF.md` 请求主控批准。

## 验收方式

- 安卓手机竖屏宽度下无横向布局感。
- 主界面没有工程术语。
- 家长能理解当前训练状态、设备状态、降级影响和报告摘要。
- 页面保留图片/视频/视觉流占位区域。
- 默认 mock 路径仍可完成 6 次扫描并展示报告。

## 执行前风险判断

- 风险：只做 CSS 响应式，产品语义仍像工程控制台。
- 降低：先改信息架构和文案，再改布局。
