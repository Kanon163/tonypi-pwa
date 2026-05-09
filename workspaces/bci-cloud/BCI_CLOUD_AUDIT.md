# BCI 与云端报告审计

## 执行前风险判断

- 风险：把未知 BCI 厂商协议提前固化，导致后续真实硬件替换困难。
- 降低：首版只定义标准样本、适配层、模拟源和报告最小形态。
- 风险：把实时 BCI 直接接入机器人动作，形成不可解释或高风险反馈。
- 降低：BCI 只进入记录、摘要和策略层；机器人动作仍由关卡/策略产生命令。
- 风险：儿童敏感数据上传过多。
- 降低：上传摘要优先，原始数据默认本地短期缓存或不上传。

## 已确认事实

- PWA 需要支持 BCI 头环蓝牙数据接入，并实时显示必要指标。
- 第一阶段不绑定具体 BCI 厂商协议，先做适配层和模拟源。
- BCI 数据可影响 TonyPi 行为，但必须经过明确策略层，不得散落在 UI 代码中。
- 训练详细报告由手机上传云端分析，云端结果再推送到手机前端。
- 当前契约已有 `BciSample`、`SessionEvent`、`ReportRequest` 草案。

## 分层边界

| 层 | 职责 | 不应做 |
|---|---|---|
| BCI 适配层 | Web Bluetooth/模拟源转标准样本 | 暴露厂商字段给产品逻辑 |
| 实时样本层 | 产出 `BciSample` | 直接触发机器人动作 |
| 训练事件层 | 把关键 BCI 状态写入 `SessionEvent` | 堆叠全量原始脑电 |
| 摘要层 | 计算注意力均值、有效采样率、低信号时长 | 做临床诊断 |
| 云端报告层 | 接收 `ReportRequest`，返回家长可读报告 | 保存不必要儿童敏感信息 |

## BciSample 建议

当前字段可作为首版最小集：

- `deviceId`
- `attention`
- `relaxation`
- `signalQuality`
- `bandPower`
- `raw`
- `timestamp`

建议 Wave 2 明确：

- 数值范围：`attention`、`relaxation`、`signalQuality` 使用 0-100。
- 缺失值：设备未提供时允许 `null`，不得伪造为 0。
- `raw`：只给调试和适配层使用，产品逻辑不得读取。
- `timestamp`：必须来自接收端统一时钟或标明来源。

## SessionEvent 建议

BCI 不应逐样本写入事件流。建议只记录训练相关事件：

- `bci_connected`
- `bci_disconnected`
- `bci_signal_quality_changed`
- `bci_attention_window_updated`
- `bci_summary_ready`

`payload` 放窗口摘要，不放厂商原始包。

## ReportRequest 建议

当前最小形态成立：

- `sessionId`
- `childProfileId`
- `events`
- `bciSummary`
- `appVersion`

建议 Wave 2 补充：

- `reportSchemaVersion`
- `startedAt`
- `endedAt`
- `deviceSummary`
- `privacyMode`

`bciSummary` 首版建议包含：

- `sampleCount`
- `validSampleRate`
- `attentionAvg`
- `attentionMin`
- `attentionMax`
- `signalQualityAvg`
- `lowSignalSeconds`
- `source`: `simulated` 或 `device`

## 云端返回最小形态

建议云端返回不含原始数据：

```json
{
  "sessionId": "session_001",
  "reportId": "report_001",
  "summary": "本次训练完成度良好，注意力保持较稳定。",
  "metrics": {
    "attentionAvg": 72,
    "validSampleRate": 0.94
  },
  "notes": [],
  "createdAt": "2026-05-08T12:10:00+08:00"
}
```

## 模拟 BCI 数据源建议

首版模拟源应支持：

- 固定频率输出 `BciSample`。
- 可配置场景：稳定、波动、低信号、断连。
- 可配置随机种子，便于 app-pwa 复现验收。
- 默认 `source=simulated` 写入摘要，避免与真实设备混淆。

建议默认参数：

- 频率：1Hz 到 5Hz。
- `attention`：围绕 60-80 轻微波动。
- `relaxation`：围绕 40-60 波动。
- `signalQuality`：正常 85-100，低信号场景低于 50。

## 隐私和安全风险

- 儿童身份、训练记录、脑电相关指标均属敏感数据。
- 首版应上传摘要，不默认上传原始 `raw`。
- `childProfileId` 应使用本地或云端匿名 ID，不上传姓名。
- 报告请求应避免包含音频、图像、家庭网络信息。
- 需要区分模拟数据和真实设备数据，防止演示数据进入真实报告。

## 契约影响

- `BciSample`：需要明确数值范围、缺失值、`raw` 使用边界和数据源标记。
- `SessionEvent`：需要增加 BCI 状态/窗口摘要事件类型。
- `ReportRequest`：需要补充报告版本、时间范围、设备摘要和隐私模式。

## 验收建议

- app-pwa 使用模拟源完成训练闭环。
- 训练结束生成 `bciSummary`。
- `ReportRequest` 不包含原始 `raw`。
- 低信号和断连场景能形成可解释事件。
