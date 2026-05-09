# GitHub 工作流

## 目标

GitHub 作为任务、集成、预览和验收中枢。

## 仓库原则

- 默认 private。
- `main` 只保留已审查成果。
- `.参考资料/` 不推送。
- 每个 agent 通过 branch + PR 交付。

## 分支

命名：

- `agent/app-pwa/<task-id>-<slug>`
- `agent/product-ux/<task-id>-<slug>`
- `agent/robot-bridge/<task-id>-<slug>`
- `agent/bci-cloud/<task-id>-<slug>`
- `agent/integration-review/<task-id>-<slug>`

## Issue

每个任务对应一个 Issue。

Issue 必须包含：

- 目标
- 范围内/范围外
- 输入资料
- 交付物
- 验收方式
- 风险判断

## PR

每个 PR 必须说明：

- 改了什么
- 影响哪些契约
- 如何验证
- 预览地址
- 残余风险

## Pages

PWA 预览优先使用 GitHub Pages。

用途：

- 安卓手机真实访问。
- PWA 安装条件验证。
- 给用户和 reviewer 一个稳定 URL。

默认预览路径：

- `https://<owner>.github.io/<repo>/workspaces/app-pwa/`

仓库包含 `.github/workflows/pages.yml`，从 `main` 部署整个仓库，保证 PWA 可以读取 `shared/`。

## 主控职责

- 创建/整理 Issue。
- 审查 PR 是否符合任务边界。
- 合并前检查契约兼容性。
- 合并后更新 `PROJECT_STATE.md`。
