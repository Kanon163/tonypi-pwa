# 任务 0020：Wave 4 BCI Web Bluetooth 探针

## 目标

确认安卓 PWA 能否通过 Web Bluetooth 获取 BCI 数据，并输出标准化 `BciSample` 适配方案。

## 所属波次

- Wave：4

## 负责 agent

- `bci-cloud`

## 范围内

- 建立安卓 Chrome Web Bluetooth 探针页面或脚本。
- 发现设备、服务、特征值和通知机制。
- 尝试把收到的数据映射为 `BciSample`。
- 明确哪些字段可稳定获得：`attention`、`relaxation`、`signalQuality`、`raw`。
- 记录断连、权限、HTTPS、安全上下文限制。

## 范围外

- 不做云端报告。
- 不改 PWA 主界面。
- 不把厂商 raw 字段扩散到 UI 或报告正文。
- 不要求一次完成所有 BCI 厂商协议解析。

## 输入资料

- `docs/CONTRACTS.md`
- `docs/PROJECT_STATE.md`
- `shared/fixtures/bci-samples.json`
- `workspaces/bci-cloud/BCI_CLOUD_AUDIT.md`

## 依赖

- depends_on：Wave 3 PR `#11`
- blocks：`0021`
- needs_from：用户提供 BCI 头环型号、安卓测试机、是否可连接设备
- outputs_to：`app-pwa`、`integration-review`

## 涉及契约

- reads：`BciSample`、`SessionEvent`
- proposes_changes：仅当真实 BCI 无法映射现有字段
- must_not_change：`RobotCommand`、`RobotEvent`、`LevelManifest`

## 预期交付

- `workspaces/bci-cloud/WEB_BLUETOOTH_PROBE.md`
- 探针页面或脚本，放在 `workspaces/bci-cloud/`
- 样本映射说明：真实字段 -> `BciSample`
- 更新 `STATUS.md`、`HANDOFF.md`、`BLOCKERS.md`

## 验收方式

- 安卓 Chrome 能触发设备选择，或明确说明不可触发原因。
- 若能收到数据，至少输出一条标准化 `BciSample` 示例。
- 若不能解析协议，输出服务/特征值清单和下一步最小需求。

## 执行前风险判断

- 风险：没有设备协议，agent 编造解析。
- 降低：未知就记录未知，先证明蓝牙可达和数据形态。

