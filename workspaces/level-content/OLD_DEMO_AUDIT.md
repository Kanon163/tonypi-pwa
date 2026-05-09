# 旧 demo 三关审计

## 审计范围

- 输入：`.参考资料/ExistingDemo/task8_core.py`、`task9_core.py`、`task10_core.py`、`task12_three_level_demo_v1_0.py`、`.参考资料/ExistingDemo/Demoresources/`。
- 结论类型：事实审计；不做实现，不迁移 pygame UI。
- 目标契约：`LevelManifest`、`SessionEvent`、`RobotCommand`。

## 元认知检查

- 风险：把 pygame 舞台节点、操作员热键误当成 PWA 产品流程。
- 降低：只提取关卡规则、状态、事件、资源、硬件输入和可数据化字段。
- 风险：旧 demo 中 task8 参数与 task12 展示参数不完全一致。
- 降低：分别记录 core 默认值和 task12 覆盖值。

## 总流程

旧 demo 是统一 pygame 展示壳，主题为“星际守护任务”：

1. 开场：TonyPi 介绍三项任务，目标是收集三块注意力能量碎片。
2. 第一关：拨清星际信号。
3. 第二关：收集能量晶石。
4. 第三关：破解反向指令。
5. 结尾：三块碎片融合，保存演示日志。

task12 节点事件可转成 `SessionEvent.type`：

- `mission_start`
- `mission_goal_spoken`
- `level_1_start`、`radio_listening_ready`、`radio_listening`、`answer_collected`、`level_1_success`、`level_1_retry`、`level_1_skipped`
- `level_2_start`、`level_2_rule_spoken`、`state_go`、`scan_requested`、`marker_detected`、`scan_success`、`state_nogo`、`nogo_success`、`nogo_violation`、`level_2_success`、`level_2_skipped`
- `level_3_start`、`round_prepare`、`instruction_spoken`、`pose_detected`、`round_feedback`、`level_3_success`
- `mission_success`、`demo_finished`

## 第一关：拨清星际信号

### 规则事实

- 训练目标：持续、慢速、连续地转动摇杆，同时听目标类别词，抑制干扰词。
- 目标类别：水果、动物、学习用品。
- 每轮目标词数：3。
- 默认难度：9 个干扰词，词间隔 3.0 秒。
- 进阶难度：14 个干扰词，词间隔 3.2 秒。
- 调频评分：初始分 45，范围 0-100。
- 噪音映射：0-33 高噪声增益 0.80；34-66 中噪声增益 0.50；67-100 低噪声增益 0.20。
- 成功条件：WonderEcho 识别词集合与目标词集合完全一致，且数量等于目标词数。
- 答题超时：task12 默认 16 秒。

### 状态流

```text

规则说明 -> 收音前提示 -> 调频收音中 -> 回答窗口 -> 成功 / 重试 / 跳过

```

### 关键事件

- `level1_radio_started`：包含类别、目标词、播放计划长度。
- `word_played`：包含 target/interference、词、序号、attention、noise_gain、noise_label、摇杆输入。
- `level1_answer_started`：回答窗口开始，唤醒 WonderEcho。
- `level1_answer_word_collected`：收到识别词。
- `level1_answer_evaluated`：包含目标词、识别词、missing、extra、attention、score、is_correct。
- `level1_answer_finished`：进入成功或重试。

### 资源

- 语音：`S01_001`-`S01_016`。
- 目标类别提示：`game_speech/remember_fruit.wav`、`remember_animal.wav`、`remember_stationery.wav`。
- 回答提示与反馈：`game_speech/tell_me.wav`、`correct.wav`、`wrong.wav`。
- 目标词音频：`target_words/01_apple.wav` 至 `10_ruler.wav`。
- 干扰词音频：`interference_words/*.wav`，20 个干扰词。
- 噪声：`noise/pink_noise.wav`，兜底查找 `SFX01_*`。
- 音效：`SFX00`、`SFX01`、`SFX02`、`SFX03`、`SFX04`。
- 动作组：`greeting`、`rest`、`celebrate_small`、`encourage_retry`。

### 硬件依赖

- 摇杆：pygame joystick，输入 x/y 或八方向索引。
- WonderEcho：串口 `/dev/ttyUSB0`，115200，5 字节包；词 id 映射到 01-10。
- 音频播放：pygame mixer。
- TonyPi 动作：`hiwonder.ActionGroupControl.runActionGroup`。

### LevelManifest 字段建议

- `id`: `level_mind_radio_v1`
- `title`: `拨清星际信号`
- `rules.categories`: 类别到目标词表。
- `rules.targetsPerRound`: 3。
- `rules.difficulty`: normal/advanced 的干扰数和词间隔。
- `rules.scoring`: 调频评分、噪声阈值、答题判定。
- `assets.audio.voiceCodes`: S01 系列。
- `assets.audio.targetWords`、`assets.audio.interferenceWords`、`assets.audio.noise`。
- `robotCues`: 规则、安静、成功、重试对应动作与语音。
- `inputRequirements`: joystick、WonderEcho。
- `successCriteria`: `recognizedWords == targetWords`。
- `sessionEvents`: 上述 level1 事件。

## 第二关：收集能量晶石

### 规则事实

- 训练目标：GO 时行动并扫描晶石；NO-GO 时停止，抑制冲动。
- 目标扫描数：6。
- 目标标记：ArUco id=0。
- 扫描区域：画面中心 30%-70% 的矩形区域。
- core 默认节奏：GO 8 秒，NO-GO 4 秒，扫描冷却 5 秒。
- task12 展示节奏：GO 4.5-15.0 秒随机，NO-GO 4.5-9.0 秒随机。
- task12 扫描段：中心检测到 id=0 后进入独立扫描段，默认 2.2 秒后计数 +1。
- NO-GO 违规：NO-GO 中看到任意 id=0 即违规；task12 生命值从 3 扣减。
- 成功条件：扫描计数达到 6。

### 状态流

```text

GO 规则 -> NO-GO/扫描规则 -> GO/NO-GO 循环
GO -> 看到 id=0 且在中心 -> 扫描中 -> 扫描成功 -> 未满 6 回到 GO
NO-GO -> 未看到 id=0 -> 停住成功 / 计时切回 GO
NO-GO -> 看到 id=0 -> 违规重试
满 6 -> 成功

```

### 关键事件

- `level2_gonogo_started`：包含 GO/NO-GO 时长范围、扫描时长、BGM。
- `level2_gonogo_cue`：GO/NO-GO 语音提示。
- `level2_hold_started`：本次状态持续时间。
- `level2_scan_started`：开始扫描段。
- `level2_scan_success`：扫描成功计数。
- `level2_nogo_violation_real`：真实 ArUco 违规。
- `nogo_violation_manual`：人工违规。
- `manual_crystal_add`：人工加扫描。

### 资源

- 语音：`S02_001`-`S02_023`。
- GO/NO-GO 语音：GO=`S02_007`，NO-GO=`S02_010`。
- 音效：`SFX05`-`SFX11`。
- BGM：`BGM01`，第二关音量默认 0.2。
- 动作组：`go_invite`、`nogo_stop`、`scan_crystal`、`celebrate_small`、`celebrate_big`、`encourage_retry`、`greeting`、`rest`。

### 硬件依赖

- 摄像头：OpenCV `VideoCapture(camera_index)`。
- ArUco：OpenCV `cv2.aruco.DICT_4X4_50`。
- TonyPi 动作：D6A 动作组。
- 操作员兜底：键盘 C 加扫描、N 标记违规、S 人工通过、K 跳过。

### LevelManifest 字段建议

- `id`: `level_gonogo_crystal_v1`
- `title`: `收集能量晶石`
- `rules.targetMarkerId`: 0。
- `rules.totalScans`: 6。
- `rules.centerZone`: x/y 0.3-0.7。
- `rules.timing`: GO/NO-GO 范围、扫描段时长、core 冷却策略。
- `rules.violation`: NO-GO 看到目标标记即违规。
- `assets.audio.voiceCodes`: S02 系列。
- `assets.audio.sfx`: SFX05-SFX11。
- `robotCues`: GO、NO-GO、扫描、成功、违规。
- `inputRequirements`: camera、aruco。
- `successCriteria`: `scanCount >= 6`。
- `sessionEvents`: GO、NO-GO、scan、violation、success。

## 第三关：破解反向指令

### 规则事实

- 训练目标：听到指令后做相反动作。
- 正式轮数：10。
- core 默认响应窗口：4.5 秒，姿态稳定 0.35 秒。
- task12 展示覆盖：响应窗口 9.0 秒，稳定 1.2 秒，前 2.5 秒忽略过渡姿态。
- 通过阈值：task12 结束时正确数 >= 6 时碎片点亮，否则半亮；节点仍进入结束反馈。
- 指令集合：
  - 举左手 -> 举右手。
  - 举左手过顶 -> 举右手过顶。
  - 举右手 -> 举左手。
  - 举右手过顶 -> 举左手过顶。
  - 站起来打开双手 -> 放下双手。
  - 蹲下放下双手 -> 举起双手。

### 状态流

```text

规则说明 -> 单轮准备 -> 播放指令与机器人示范 -> 姿态识别窗口 -> 单轮反馈
重复 10 轮 -> 结束反馈

```

### 关键事件

- `level3_reverse_started`：第三关开始。
- `level3_round_started`：包含轮次、command_id、voice_code、expected_action、expected_overhead。
- `level3_response_window_started`：包含响应窗口、稳定时长、忽略过渡时长。
- `level3_round_result`：包含 expected、actual、correct、timeout、manual、response_time。
- `manual_round_correct` / `manual_round_wrong`：人工覆盖。

### 资源

- 语音：`S03_001`-`S03_020`。
- 音效：`SFX12`、`SFX14`、`SFX15`、`SFX16`。
- 动作组：`demo_left_hand`、`demo_left_hand_overhead`、`demo_right_hand`、`demo_right_hand_overhead`、`demo_stand_open_hands`、`demo_squat_put_down_hands`、`celebrate_small`、`encourage_retry`、`greeting`、`rest`。

### 硬件依赖

- 摄像头：OpenCV。
- 姿态识别：MediaPipe Pose Landmarker，默认模型路径 `/home/pi/TonyPi/Functions/model/pose_landmarker_lite.task`。
- TonyPi 动作：D6A 动作组。
- 操作员兜底：Y/N 判定正确或错误。

### LevelManifest 字段建议

- `id`: `level_reverse_instruction_v1`
- `title`: `破解反向指令`
- `rules.totalRounds`: 10。
- `rules.commands`: 指令、语音、同向动作组、期望相反动作。
- `rules.timing`: responseWindow、stableSec、minDecisionSec。
- `rules.scoring`: correctCount、accuracy、manualOverrides、timeout。
- `assets.audio.voiceCodes`: S03 系列。
- `assets.audio.sfx`: SFX12/SFX14/SFX15/SFX16。
- `robotCues`: 规则示范、单轮指令、正确反馈、错误反馈、结算。
- `inputRequirements`: camera、poseDetector。
- `successCriteria`: `correctCount >= 6`。
- `sessionEvents`: round_started、pose_detected、round_result、level_success。

## 共享资源审计

### BGM

- 已存在：`BGM00.mp3`、`BGM01.mp3`。
- task12 引用了 `BGM03`，但资源清单中未发现对应文件。

### 语音

- 开场：`S00_001`-`S00_004`。
- 第一关：`S01_001`-`S01_016`。
- 第二关：`S02_001`-`S02_023`。
- 第三关：`S03_001`-`S03_020`。
- 结尾：`S99_001`-`S99_006`，task12 使用 `S99_001`-`S99_003`。

### 动作组

已有 D6A：

- `greeting`
- `scan_left_right`
- `rest`
- `nogo_stop`
- `go_invite`
- `encourage_retry`
- `scan_crystal`
- `celebrate_small`
- `celebrate_big`
- `demo_left_hand`
- `demo_left_hand_overhead`
- `demo_right_hand`
- `demo_right_hand_overhead`
- `demo_stand_open_hands`
- `demo_squat_put_down_hands`

### 视觉/语音输入

- 第一关：摇杆、WonderEcho 串口词识别。
- 第二关：摄像头、ArUco id=0。
- 第三关：摄像头、MediaPipe 姿态。

## RobotCommand 映射建议

- 语音播放：`type=speech`，`name=<voice_code>`。
- 动作组：`type=action_group`，`name=<action_group>`。
- 摄像头/识别模式：`type=camera_mode`，`name=aruco_scan` 或 `pose_detect`。
- 停止：`type=stop`，用于暂停 BGM/前景音频/动作。

关卡内容不应直接调用 D6A 或 Python SDK；只声明 `robotCues`，由机器人桥解释为 `RobotCommand`。

## LevelManifest 最小公共字段建议

```json
{
  "id": "level_id",
  "title": "关卡名",
  "version": 1,
  "story": {
    "theme": "星际守护任务",
    "fragmentIndex": 1
  },
  "rules": {},
  "assets": {
    "audio": [],
    "actionGroups": []
  },
  "robotCues": [
    {
      "on": "event_type",
      "speech": "Sxx_xxx",
      "actionGroup": "greeting"
    }
  ],
  "inputRequirements": [],
  "sessionEvents": [],
  "successCriteria": {},
  "fallbacks": []
}
```

## 残余风险

- 旧 demo 的视觉界面字段只适合作为舞台提示，不应成为 PWA 主体验。
- 第一关依赖 WonderEcho；若 PWA 垂直切片不接该硬件，需要定义语音输入降级。
- 第二关 task8 core 与 task12 展示壳在 GO/NO-GO 节奏上有差异，Wave 2 需要统一契约口径。
- 第三关 task10 core 默认时间与 task12 展示时间不同，Wave 2 需要明确产品默认值。
- `BGM03` 被引用但资源目录未见文件，需要补资源或改引用。
