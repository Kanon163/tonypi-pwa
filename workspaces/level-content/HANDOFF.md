# HANDOFF

## Wave 2 产出

- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/resources-index/demo-assets.md`

## 对 integration-review

- Manifest 已按 `docs/CONTRACTS.md` 的 `LevelManifest` 形状声明规则、资源、cue、输入、事件、成功条件和降级。
- 本任务选择 `wave2_demo_default` 作为第二关候选默认节奏：GO 4.5-15.0 秒，NO-GO 4.5-9.0 秒，扫描保持 2.2 秒。
- 未修改 `docs/CONTRACTS.md`。

## 对 robot-bridge

- `robotCues` 中的 `speech` 为 S02 系列语音码，`actionGroup` 为动作白名单候选。
- 识别窗口中推荐 `rest`，避免动作干扰摄像头。
- 需要把 `camera_mode=aruco_scan` 与 marker id 0、中心区域 0.3-0.7 对齐。

## 对 app-pwa

- 可读取 manifest 展示家长端摘要：扫描数、违规数、生命值、降级模式、BCI 摘要。
- PWA 不直接读取音频文件或 D6A 文件路径，只引用资源 ID。
- 首切可用 `fallbacks` 进入 mock robot、operator scan override 或 simulated BCI。
