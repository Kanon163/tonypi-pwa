# 项目状态

## 当前波次

Wave 3 app-pwa 已完成安卓 PWA 访问链路、可交互 Go/No-Go mock 运行时和审查修复。

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
- `#2` 干预游戏运行时已通过 PR `#4` 合并到 `main`。
- `#5` GitHub Pages 预览站点已通过 PR `#6` 完成。
- 用户已在安卓手机上验证 Pages PWA 可正常使用。
- 用户已验证可交互 Go/No-Go mock 训练路径可正常使用。
- GitHub 仓库：`https://github.com/Kanon163/tonypi-pwa`
- PWA Pages 预览目标：`https://kanon163.github.io/tonypi-pwa/workspaces/app-pwa/`
- Wave 3 专项审查修复已通过 PR `#11` 合并到 `main`，解除进入 Wave 4 的 app-pwa 阻塞。
- 当前开放 Issue：暂无 Wave 3 app-pwa 阻塞项。
- 第二关默认节奏采用 `wave2_demo_default`。
- Go/No-Go 扫描计数字段统一为 `scanCount`。
- `camera_unavailable`、`operator_override_enabled`、`report_ready` 已进入契约。

## 当前阻塞

- GitHub Pages 已部署成功，桌面复测根路径、PWA 路径、manifest、关卡 JSON 均为 200。
- 安卓手机真实访问已通过用户验收。
- Robot mock、BCI/report 与 UX 审查修复已合并。
- 真实硬件接入、Web Bluetooth、TonyPi stop 真实语义进入后续波次。

## 下一步

1. 进入 Wave 4：用最小真实硬件路径替换 mock。
2. Wave 4 先做小步验证：真实 TonyPi bridge 连通、Web Bluetooth BCI 探针、PWA 适配层接口，不做大规模 UI 重设计。
