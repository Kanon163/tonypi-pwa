# 项目状态

## 当前波次

Wave 3 app-pwa 已完成手机端视觉纠偏，并开始补齐安卓 PWA 运行链路。

项目已切换到 GitHub-centered workflow：Issue 管任务、PR 管交付、GitHub Pages 管手机预览。

## 当前结论

- 产品 SKU：BCI 头环、TonyPi 机器人、手机 PWA。
- 家长主要使用 PWA 获取服务并开启训练。
- 儿童佩戴 BCI 头环，主要与 TonyPi 机器人互动完成训练。
- 首个垂直切片确认为第二关 `level_gonogo_crystal_v1`。
- Wave 3 默认使用模拟 BCI、模拟 RobotBridge、mock 报告。
- Wave 3 不接真实 BCI、真实 TonyPi、真实云端。
- Wave 3 的 PWA 必须能在安卓手机端实际访问/验证，而不只是电脑移动视口。
- 工程信息不得出现在家长端主界面。
- 训练运行页需要预留 TonyPi 视觉信号/机器人状态空间。
- `#1` 安卓手机 PWA 运行链路已通过 PR `#3` 合并到 `main`。
- `#2` 干预游戏运行时已提交 PR `#4`，但因提前结束训练仍会标记 `success=true`，暂缓合并。
- `#5` 已拆出 GitHub Pages 站点启用与真实 URL 验证。
- GitHub 仓库：`https://github.com/Kanon163/tonypi-pwa`
- PWA Pages 预览目标：`https://kanon163.github.io/tonypi-pwa/workspaces/app-pwa/`
- 当前开放 Issue：`#2` 干预游戏运行时，`#5` GitHub Pages 预览站点。
- 第二关默认节奏采用 `wave2_demo_default`。
- Go/No-Go 扫描计数字段统一为 `scanCount`。
- `camera_unavailable`、`operator_override_enabled`、`report_ready` 已进入契约。

## 当前阻塞

- GitHub Pages 合并后复测仍是站点级 `Site not found` 404，需处理 `#5`。
- 尚未由安卓手机真实验证 Pages 访问、安装入口和离线刷新。
- 尚未实现可交互干预游戏运行时。
- `product-ux`、`robot-bridge`、`bci-cloud` 的 Wave 3 review 暂缓，等 `0013c` 和 `0013d` 完成后再做。
- 真实硬件接入、Web Bluetooth、TonyPi stop 真实语义进入后续波次。

## 下一步

1. 处理 `#5`，让 Pages 预览 URL 真实可访问。
2. 让 `app-pwa` 修复 PR `#4` 的提前结束语义，并更新到最新 `main`。
3. `#4` 合并且手机 URL 可访问后再启动专项 review。
