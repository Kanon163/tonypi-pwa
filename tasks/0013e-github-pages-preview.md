# 任务 0013e：GitHub Pages 预览站点

## 目标

让安卓手机可通过 GitHub Pages 访问 PWA demo。

## 范围内

- 配置 Pages workflow。
- 只发布 PWA 必需静态资源。
- 提供默认入口和根路径跳转。
- 验证线上 URL。

## 范围外

- 不配置自定义域名，除非用户提供域名。
- 不接真实 BCI、TonyPi、云端。
- 不改中央契约。

## 输入资料

- `docs/GITHUB_WORKFLOW.md`
- `.github/workflows/pages.yml`
- `workspaces/app-pwa/`
- `shared/fixtures/`
- `shared/level-manifests/`

## 预期交付

- Pages artifact 只包含可公开访问的 PWA 运行内容。
- `https://kanon163.github.io/tonypi-pwa/` 跳转到 PWA。
- `https://kanon163.github.io/tonypi-pwa/workspaces/app-pwa/` 可访问。

## 验收方式

- GitHub Actions Pages 部署成功。
- 线上 URL 返回 PWA 页面，不再是 `Site not found`。
- 安卓手机可打开并尝试安装。
