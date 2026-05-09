# Wave 1 集成审查

## 结论

Wave 1 有实际意义，但它不是功能进展，而是约束进展。

本波没有让产品“更能运行”，但让项目少了很多模糊假设：PWA 的角色、旧三关可拆方式、TonyPi 桥接路径、BCI 数据边界、模拟源策略都被明确了。若不把这些结果压缩成 Wave 2 契约，本波会显得像资料堆积；若进入契约冻结，它就是必要前置。

## 有效产出

### product-ux

- 确认 PWA 是家长端服务入口，不是儿童训练主舞台。
- 定义 MVP 屏幕：训练准备、设备连接、训练进行、异常处理、训练完成、报告详情。
- 明确异常和降级必须成为产品体验的一部分。

### level-content

- 旧三关可拆成 3 个 `LevelManifest`：
  - `level_mind_radio_v1`
  - `level_gonogo_crystal_v1`
  - `level_reverse_instruction_v1`
- 抽取了每关规则、状态流、关键事件、资源、硬件依赖。
- 暴露了参数冲突：core 默认值与 task12 展示壳默认值不一致。
- 暴露了资源问题：`BGM03` 被引用但资源目录未发现。

### robot-bridge

- 建议首版采用 HTTP 控制面 + WebSocket/SSE 事件面。
- 明确 PWA 不依赖 `hiwonder`，只发 `RobotCommand`、接收 `RobotEvent`。
- 明确动作组必须走白名单。
- 明确 AP 模式可先假设 `192.168.149.1`，LAN 模式需要手动输入、二维码或后续发现机制。

### app-pwa

- 建议 React + TypeScript + Vite。
- 建议 IndexedDB 保存会话事件、标准化 BCI 样本、上传队列。
- 建议 Wave 3 使用 `MockBciSource`、`MockRobotBridge`、`MockReportApi`。
- 明确 `LevelManifest` 未冻结前，PWA 不应硬编码长期关卡流程。

### bci-cloud

- 明确 BCI 原始字段只进入 `raw`，产品逻辑不得读取。
- 建议 `attention`、`relaxation`、`signalQuality` 范围为 0-100，缺失值允许 `null`。
- 建议训练结束生成 `bciSummary`，不上传逐条 raw。
- 建议模拟源覆盖稳定、波动、低信号、断连场景。

## 关键判断

### Wave 3 首个垂直切片应选第二关

推荐首个可交付闭环围绕 `level_gonogo_crystal_v1`。

理由：

- 它最贴近 ADHD 执行功能中的抑制控制。
- 不依赖 WonderEcho 语音识别。
- 比第三关姿态识别更容易先用模拟输入替代。
- GO/NO-GO 状态天然适合展示 TonyPi 行为、儿童任务、BCI 注意力记录和家长端摘要。

### 首版必须允许模拟硬件

Wave 3 不应被真实 BCI、真实云端、自动发现 TonyPi、真实 stop 语义阻塞。

首版垂直切片允许：

- 模拟 BCI。
- 模拟 RobotBridge。
- 手动输入 TonyPi 地址。
- 本地报告摘要和待上传状态。
- 第二关摄像头识别先用模拟/人工事件替代，后续再接真实 ArUco。

### Wave 2 应冻结契约，不应实现 UI

现在进入实现仍过早。下一波要把五份审计压缩成共享契约和 fixtures。

## Wave 2 任务建议

### 1. Contracts v0.1

负责：`integration-review`

产出：

- 更新 `docs/CONTRACTS.md`
- 定义 `RobotCommand`、`RobotEvent`、`BciSample`、`SessionEvent`、`ReportRequest`、`LevelManifest` v0.1

### 2. LevelManifest v0.1

负责：`level-content`

产出：

- `shared/level-manifests/level_gonogo_crystal_v1.json`
- `shared/resources-index/tonypi-actions.md`
- `shared/resources-index/demo-assets.md`

### 3. RobotBridge Contract Fixtures

负责：`robot-bridge`

产出：

- `shared/fixtures/robot-events.json`
- `shared/fixtures/robot-commands.json`
- 桥服务健康检查字段建议

### 4. BCI/Report Fixtures

负责：`bci-cloud`

产出：

- `shared/fixtures/bci-samples.json`
- `shared/fixtures/report-request.json`
- `shared/fixtures/report-response.json`

### 5. PWA Vertical Slice Plan

负责：`app-pwa`

产出：

- `workspaces/app-pwa/VERTICAL_SLICE_PLAN.md`
- 明确基于 fixtures 的第一版实现路径

### 6. Demo Flow Refinement

负责：`product-ux`

产出：

- `workspaces/product-ux/GONOGO_DEMO_FLOW.md`
- 第二关垂直切片的家长端流程和演示脚本

## 需要用户/主控决策

1. 首个垂直切片是否确认选择第二关 `level_gonogo_crystal_v1`。
2. Wave 3 是否允许模拟 BCI 和模拟 RobotBridge。
3. Wave 3 是否允许云端报告先用 mock 返回。
4. 首版 TonyPi 连接是否允许手动输入 IP。
5. 第一关 WonderEcho 是否暂不进入首个垂直切片。

## 不通过项

无。

但有一个警告：Wave 1 产物如果不进入契约和 fixtures，会快速变成阅读负担。

