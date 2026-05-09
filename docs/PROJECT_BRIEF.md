# 项目简报

## 目标

基于 TonyPi 机器人、BCI 头环和安卓 PWA，制作一套可交付演示的 ADHD 家庭执行功能训练产品。家长主要使用 PWA 获取服务并开启训练；儿童佩戴 BCI 头环，主要与 TonyPi 机器人互动完成训练。

## 关键要求

- 手机 PWA 支持 BCI 头环蓝牙数据接入，并可实时显示必要指标。
- BCI 数据可影响 TonyPi 行为，但必须通过明确策略层，不得散落在 UI 代码中。
- 训练详细报告由手机上传云端分析，分析结果再推送到手机前端。
- 旧 demo 的三关逻辑要重构为可改关卡、可换内容、可独立测试的结构。
- UI/UX 要按家长端服务产品设计，不做“电脑控制台”的迁移版。

## 参考资料

- `.参考资料/ExistingDemo/`：旧 pygame demo、三个规则核心、动作/音频资源。
- `.参考资料/TonypiTutorial/`：TonyPi 网络、动作组、视觉、语音、传感器教程。

## 已知现状

- `task8_core.py`、`task9_core.py`、`task10_core.py` 已经是较好的纯规则核心参考。
- `task12_three_level_demo_v1_0.py` 仍混合了流程、pygame UI、摄像头、语音、动作组、日志和人工按键。
- TonyPi 动作组依赖 `.d6a` 文件和 `hiwonder.ActionGroupControl`。
- TonyPi 支持 AP 直连和 LAN 模式；手机 PWA 与机器人通信需要单独设计桥接服务。

## 非目标

- 不在第一阶段追求完整临床有效性证明。
- 不把 PWA 写成旧 demo 的远程屏幕。
- 不先绑定某个未知 BCI 厂商协议；先做适配层和模拟源。
