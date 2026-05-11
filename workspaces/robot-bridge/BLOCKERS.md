# BLOCKERS

## 当前阻塞

- 缺少 TonyPi 实机访问方式，无法完成真实 AP/LAN、`scan_crystal`、`stop` 验证。
- `scan_crystal.d6a` 是否已部署到 `/home/pi/TonyPi/ActionGroups` 未知。
- `AGC.runActionGroup("scan_crystal")` 的阻塞、异常、耗时语义未知。
- `stop` 是否能硬中断动作未知。

## 非本轮阻塞

- 探针不是长期桥服务；实机验证通过后仍需产品化 HTTP/SSE 桥。
