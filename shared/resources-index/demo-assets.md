# Demo 资源索引

## 范围

- 关卡：`level_gonogo_crystal_v1`
- 用途：Wave 3 垂直切片引用资源 ID，不直接暴露文件系统路径给 PWA 或关卡逻辑。

## 音频

| 资源 ID | 建议文件 | 用途 |
|---|---|---|
| `bgm_level2_loop` | `audio/bgm/BGM01.mp3` | 第二关低音量循环背景 |
| `voice_level2_intro` | `audio/voice/S02_001.wav` | 第二关开场 |
| `voice_level2_go_rule` | `audio/voice/S02_002.wav` | GO 规则 |
| `voice_level2_nogo_rule` | `audio/voice/S02_003.wav` | NO-GO 规则 |
| `voice_level2_freeze_rule` | `audio/voice/S02_004.wav` | 停止规则 |
| `voice_level2_scan_rule` | `audio/voice/S02_005.wav` | 晶石卡扫描规则 |
| `voice_level2_goal` | `audio/voice/S02_006.wav` | 6 次扫描目标 |
| `voice_level2_go_cue` | `audio/voice/S02_007.wav` | GO 提示 |
| `voice_level2_nogo_cue` | `audio/voice/S02_010.wav` | NO-GO 提示 |
| `voice_level2_nogo_success` | `audio/voice/S02_012.wav` | 停住成功 |
| `voice_level2_scan_request` | `audio/voice/S02_013.wav` | 请求放入扫描框 |
| `voice_level2_scan_hold` | `audio/voice/S02_014.wav` | 扫描中保持稳定 |
| `voice_level2_scan_success` | `audio/voice/S02_015.wav` | 单次扫描成功 |
| `voice_level2_violation_retry` | `audio/voice/S02_017.wav` | NO-GO 违规后鼓励 |
| `voice_level2_violation_hint` | `audio/voice/S02_018.wav` | NO-GO 规则提醒 |
| `voice_level2_success` | `audio/voice/S02_019.wav` | 6 次扫描完成 |
| `voice_level2_success_summary` | `audio/voice/S02_020.wav` | 第二关能力反馈 |
| `voice_level2_skip` | `audio/voice/S02_023.wav` | 人工跳过说明 |
| `sfx_level2_start` | `audio/sfx/SFX00.wav` | 规则/转场 |
| `sfx_level2_go` | `audio/sfx/SFX05.wav` | GO 状态 |
| `sfx_level2_nogo` | `audio/sfx/SFX06.wav` | NO-GO 状态 |
| `sfx_level2_scan_request` | `audio/sfx/SFX07.wav` | 扫描请求 |
| `sfx_level2_scanning` | `audio/sfx/SFX08.wav` | 扫描中 |
| `sfx_level2_scan_success` | `audio/sfx/SFX09.wav` | 扫描成功 |
| `sfx_level2_violation` | `audio/sfx/SFX10.wav` | 违规/重试 |
| `sfx_level2_success` | `audio/sfx/SFX11.wav` | 关卡成功 |

## 机器人动作

| 动作 ID | 建议文件 | 用途 | 视觉窗口限制 |
|---|---|---|---|
| `greeting` | `ActionGroups/greeting.d6a` | 问候、正向反馈 | 可用 |
| `go_invite` | `ActionGroups/go_invite.d6a` | GO 邀请行动 | GO 语音后可用 |
| `nogo_stop` | `ActionGroups/nogo_stop.d6a` | NO-GO 停止提示 | 可用 |
| `scan_crystal` | `ActionGroups/scan_crystal.d6a` | 请求扫描晶石 | 进入识别前可用 |
| `rest` | `ActionGroups/rest.d6a` | 保持稳定 | 识别窗口推荐 |
| `celebrate_small` | `ActionGroups/celebrate_small.d6a` | 单次扫描成功 | 扫描完成后可用 |
| `celebrate_big` | `ActionGroups/celebrate_big.d6a` | 关卡成功 | 关卡结束后可用 |
| `encourage_retry` | `ActionGroups/encourage_retry.d6a` | 违规后鼓励 | 反馈阶段可用 |

## 识别资源

| 资源 ID | 类型 | 约束 |
|---|---|---|
| `robot_camera` | 摄像头 | 由 RobotBridge 管理，PWA 不直接持有 |
| `aruco_marker_0` | 视觉标记 | marker id 为 0 |
| `center_scan_zone` | 识别区域 | x/y 均为 0.3-0.7 |

## 已知缺口

- `BGM03` 是旧结尾引用，不属于本关必需资源；本索引不要求 Wave 3 首切补齐。
- 动作组是否存在、能否抢占停止，由 `robot-bridge` fixtures 和实机验证确认。
