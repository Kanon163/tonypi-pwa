# 任务 0013c：安卓手机 PWA 运行链路

## 目标

让当前 demo 可以被安卓手机实际访问、验证，并具备 PWA 安装条件。

## 负责 agent

- `app-pwa`

## 范围内

- 修正本地服务运行方式，支持手机从同一局域网访问。
- 补齐 PWA 安装所需 manifest、图标、service worker、离线缓存。
- 提供安卓手机验证步骤。
- 明确 HTTPS/安全上下文要求和可行方案。
- 保留现有 mock 训练闭环。

## 范围外

- 不上架应用商店。
- 不接真实 BCI、真实 TonyPi、真实云端。
- 不改中央契约。

## 输入资料

- `docs/VISION.md`
- `docs/CONTRACTS.md`
- `workspaces/integration-review/WAVE3_APP_REVIEW.md`
- 当前 `workspaces/app-pwa/` 工程

## 预期交付

- 可用于安卓手机访问的启动命令。
- PWA manifest 与图标补齐。
- service worker 在目标访问方式下可注册。
- 更新 `RUNBOOK.md`。
- 更新 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`。

## 验收方式

- 手机能打开 demo 地址，不依赖电脑浏览器移动视口。
- 手机可添加到主屏幕或明确记录无法安装的原因。
- 离线刷新可展示已缓存页面或明确降级。
- 默认 mock 路径仍可完成 6 次扫描和报告摘要。

## 执行前风险判断

- 风险：只修改文档，不解决手机无法访问或无法安装。
- 降低：必须给出可执行命令、手机验证记录和残余限制。
