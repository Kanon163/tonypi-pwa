# 任务 0004：产品演示闭环 UX

## 目标

定义一个可交付 demo 的家庭训练服务流程，使 PWA 像家长端产品，而不是控制台。

## 范围内

- 用户角色：家长、儿童、演示/服务人员。
- 一次训练的设备连接、训练开启、儿童与 TonyPi 互动、反馈、报告流程。
- 关键 UI 状态和异常状态。

## 范围外

- 不画高保真 UI。
- 不选择前端框架。
- 不定义底层协议。

## 输入资料

- `docs/PROJECT_BRIEF.md`
- `docs/ARCHITECTURE.md`

## 涉及契约

- `SessionEvent`
- `ReportRequest`
- `BciSample`

## 预期交付

- `workspaces/product-ux/DEMO_FLOW.md`
- MVP 屏幕清单和演示脚本。

## 验收方式

- `app-pwa` 能据此实现第一版家长端 PWA 体验。

## 执行前风险判断

- 风险：做成营销页或控制台。
- 降低：首屏必须进入训练准备/连接体验，界面围绕真实任务流。
