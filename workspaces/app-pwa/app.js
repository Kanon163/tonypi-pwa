const paths = {
  manifest: "../../shared/level-manifests/level_gonogo_crystal_v1.json",
  bci: "../../shared/fixtures/bci-samples.json",
  robotCommands: "../../shared/fixtures/robot-commands.json",
  robotEvents: "../../shared/fixtures/robot-events.json",
  reportRequest: "../../shared/fixtures/report-request.json",
  reportResponse: "../../shared/fixtures/report-response.json"
};

const app = document.querySelector("#app");

const state = {
  page: "prepare",
  loaded: false,
  manifest: null,
  fixtures: {},
  sessionId: `session_mock_${Date.now()}`,
  devices: {
    bci: "未连接",
    robot: "未连接",
    camera: "待检测",
    report: "报告服务就绪"
  },
  robotState: "idle",
  scanCount: 0,
  lives: 3,
  phase: "准备",
  bciSummary: {
    attentionAvg: 0,
    signalQualityAvg: 0,
    lowSignalSeconds: 0,
    source: "simulated"
  },
  samples: [],
  events: [],
  degraded: false,
  degradationReason: "",
  violations: 0,
  reportRequest: null,
  reportResponse: null,
  startedAt: null,
  endedAt: null,
  deferredInstallPrompt: null,
  installStatus: "未检测",
  accessUrl: "",
  bciConfidence: "正常",
  robotIssue: "",
  finishReason: ""
};

function now() {
  return new Date().toISOString();
}

function addEvent(type, payload = {}) {
  const event = {
    sessionId: state.sessionId,
    levelId: state.manifest?.id ?? "level_gonogo_crystal_v1",
    type,
    payload,
    timestamp: now()
  };
  state.events.push(event);
  persistSession();
  return event;
}

function persistSession() {
  const compact = {
    sessionId: state.sessionId,
    levelId: state.manifest?.id,
    scanCount: state.scanCount,
    lives: state.lives,
    degraded: state.degraded,
    events: state.events,
    bciSummary: state.bciSummary,
    reportRequest: state.reportRequest,
    reportResponse: state.reportResponse
  };
  localStorage.setItem("tonypi-pwa-mock-session", JSON.stringify(compact));
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`无法读取 ${path}`);
  return response.json();
}

async function loadData() {
  const [manifest, bci, robotCommands, robotEvents, reportRequest, reportResponse] = await Promise.all([
    loadJson(paths.manifest),
    loadJson(paths.bci),
    loadJson(paths.robotCommands),
    loadJson(paths.robotEvents),
    loadJson(paths.reportRequest),
    loadJson(paths.reportResponse)
  ]);

  state.manifest = manifest;
  state.fixtures = { bci, robotCommands, robotEvents, reportRequest, reportResponse };
  state.lives = manifest.rules.initialLives;
  updateBciSummary("stable");
  state.loaded = true;
  render();
}

function updateBciSummary(scenarioId = "stable") {
  const scenario = state.fixtures.bci?.scenarios?.find((item) => item.id === scenarioId);
  if (!scenario) return;
  const samples = scenario.samples;
  state.samples = state.samples.concat(samples);
  const valid = state.samples.filter((sample) => typeof sample.attention === "number");
  const signalValues = state.samples
    .map((sample) => sample.signalQuality)
    .filter((value) => typeof value === "number");
  const attentionValues = valid.map((sample) => sample.attention);
  const average = (values) => {
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };
  state.bciSummary = {
    sampleCount: state.samples.length,
    validSampleRate: Number((valid.length / state.samples.length || 0).toFixed(2)),
    attentionAvg: average(attentionValues),
    attentionMin: attentionValues.length ? Math.min(...attentionValues) : null,
    attentionMax: attentionValues.length ? Math.max(...attentionValues) : null,
    signalQualityAvg: average(signalValues),
    lowSignalSeconds: state.samples.filter((sample) => sample.signalQuality < 50).length,
    source: "simulated"
  };
  addEvent("bci_attention_window_updated", {
    attentionAvg: state.bciSummary.attentionAvg,
    signalQualityAvg: state.bciSummary.signalQualityAvg,
    source: "simulated"
  });
}

function robotEventByCase(caseName) {
  return state.fixtures.robotEvents.events.find((item) => item.case === caseName)?.event;
}

function robotCommandByCase(caseName) {
  return state.fixtures.robotCommands.commands.find((item) => item.case === caseName)?.command;
}

function connectMocks() {
  state.devices = {
    bci: "模拟 BCI 已连接",
    robot: "模拟 TonyPi 可用",
    camera: "marker 检测可用",
    report: "mock 报告服务可用"
  };
  const health = robotEventByCase("health_check_ap_ok");
  state.robotState = health?.data?.bridgeState ?? "idle";
  addEvent("bci_connected", { deviceId: "bci_sim_001", source: "simulated" });
  addEvent("robot_connected", { bridgeMode: "mock", cameraReady: true });
  state.page = "devices";
  render();
}

function refreshPwaStatus() {
  const isSecure = window.isSecureContext;
  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    navigator.standalone === true;
  if (isStandalone) {
    state.installStatus = "已作为应用打开";
  } else if (state.deferredInstallPrompt) {
    state.installStatus = "可添加到主屏幕";
  } else if (!isSecure) {
    state.installStatus = "需要 HTTPS 才能安装";
  } else {
    state.installStatus = "浏览器菜单可安装";
  }
  state.accessUrl = window.location.href;
}

async function installPwa() {
  refreshPwaStatus();
  if (!state.deferredInstallPrompt) {
    render();
    return;
  }
  state.deferredInstallPrompt.prompt();
  const choice = await state.deferredInstallPrompt.userChoice;
  state.installStatus = choice.outcome === "accepted" ? "已开始安装" : "稍后安装";
  state.deferredInstallPrompt = null;
  render();
}

function enterDegradedMode(reason = "camera_unavailable") {
  state.degraded = true;
  state.degradationReason = "摄像头/marker 不可用，已启用人工扫描覆盖。";
  state.devices.camera = "人工扫描覆盖";
  addEvent("camera_unavailable", { reason, mode: "operator_scan_override" });
  addEvent("operator_override_enabled", {
    overrideType: "operator_scan_override",
    reason
  });
  addEvent("degraded_mode_entered", {
    reason,
    mode: "operator_scan_override",
    message: state.degradationReason
  });
  render();
}

function startTraining() {
  state.page = "training";
  state.scanCount = 0;
  state.lives = state.manifest.rules.initialLives;
  state.phase = "规则说明";
  state.startedAt = now();
  state.events = [];
  state.reportRequest = null;
  state.reportResponse = null;
  state.violations = 0;
  state.bciConfidence = "正常";
  state.robotIssue = "";
  addEvent("session_started", { mode: "mock" });
  addEvent("level_started", {
    levelId: state.manifest.id,
    targetMarkerId: state.manifest.rules.targetMarkerId,
    totalScans: state.manifest.rules.totalScans
  });
  if (state.degraded) {
    addEvent("camera_unavailable", { reason: "camera_unavailable", mode: "operator_scan_override" });
    addEvent("operator_override_enabled", {
      overrideType: "operator_scan_override",
      reason: "camera_unavailable"
    });
    addEvent("degraded_mode_entered", {
      reason: "camera_unavailable",
      mode: "operator_scan_override",
      message: state.degradationReason
    });
  }
  render();
}

function nextTrainingPhase() {
  if (state.page !== "training") return;
  if (state.scanCount >= state.manifest.rules.totalScans) {
    completeTraining();
    return;
  }
  if (state.phase === "规则说明" || state.phase === "No-Go" || state.phase === "扫描") {
    state.phase = "Go";
    addEvent("state_go", {
      durationSec: state.manifest.rules.timing.goDurationSecRange[0],
      scanCount: state.scanCount
    });
    addRobotFeedback("go_invite_ok");
  } else {
    state.phase = "No-Go";
    addEvent("state_nogo", {
      durationSec: state.manifest.rules.timing.nogoDurationSecRange[0],
      lives: state.lives
    });
    addRobotFeedback("nogo_stop_busy");
  }
  addEvent("phase_changed", {
    phase: state.phase,
    state: state.phase.toUpperCase(),
    scanCount: state.scanCount,
    lives: state.lives
  });
  render();
}

function addRobotFeedback(caseName) {
  const command = robotCommandByCase(caseName);
  const eventCase = caseName === "nogo_stop_busy" ? "nogo_stop_busy" : "go_invite_finished_ok";
  const robotEvent = robotEventByCase(eventCase);
  state.robotState = robotEvent?.status === "busy" ? "busy" : robotEvent?.data?.bridgeState ?? "idle";
  if (command?.name) {
    addEvent("robot_command_mocked", {
      commandName: command.name,
      commandType: command.type,
      robotStatus: robotEvent?.status ?? "ok"
    });
  }
}

function requestScan() {
  if (state.page !== "training") return;
  state.phase = "扫描";
  addEvent("scan_requested", {
    scanCount: state.scanCount,
    centerZone: state.manifest.rules.centerZone
  });
  addRobotFeedback("go_invite_ok");
  render();
}

function recordScanSuccess() {
  if (state.page !== "training") return;
  if (state.phase === "No-Go") {
    recordNogoViolation();
    return;
  }
  if (state.phase !== "Go" && state.phase !== "扫描") {
    state.phase = "Go";
    addEvent("state_go", {
      durationSec: state.manifest.rules.timing.goDurationSecRange[0],
      scanCount: state.scanCount
    });
  }
  requestScan();
  state.scanCount = Math.min(state.manifest.rules.totalScans, state.scanCount + 1);
  addEvent("scan_success", {
    scanCount: state.scanCount,
    totalScans: state.manifest.rules.totalScans,
    markerId: state.manifest.rules.targetMarkerId,
    scanHoldSec: state.manifest.rules.timing.scanHoldSec
  });
  updateBciSummary(state.bciConfidence === "低可信" ? "low_signal" : "stable");
  if (state.scanCount >= state.manifest.rules.totalScans) {
    completeTraining();
  } else {
    state.phase = "No-Go";
    addEvent("state_nogo", {
      durationSec: state.manifest.rules.timing.nogoDurationSecRange[0],
      lives: state.lives
    });
  }
  render();
}

function recordNogoViolation() {
  if (state.page !== "training") return;
  state.violations += 1;
  state.lives = Math.max(0, state.lives - 1);
  addEvent("nogo_violation", {
    lives: state.lives,
    markerId: state.manifest.rules.targetMarkerId,
    markerInCenter: true,
    scanCount: state.scanCount
  });
  addRobotFeedback("nogo_stop_busy");
  if (state.lives <= 0) {
    state.degraded = true;
    state.degradationReason = "等待阶段连续提前行动，训练仍保留记录但需要家长协助。";
    addEvent("degraded_mode_entered", {
      reason: "too_many_nogo_violations",
      message: state.degradationReason
    });
  }
  render();
}

function simulateLowBciSignal() {
  if (state.page !== "training") return;
  state.bciConfidence = "低可信";
  updateBciSummary("low_signal");
  addEvent("bci_signal_quality_changed", {
    signalQualityAvg: state.bciSummary.signalQualityAvg,
    state: "low_signal",
    lowSignalSeconds: state.bciSummary.lowSignalSeconds
  });
  state.degraded = true;
  state.degradationReason = "BCI 信号偏低，本次报告会降低注意力记录可信度。";
  addEvent("degraded_mode_entered", {
    reason: "bci_low_signal",
    message: state.degradationReason
  });
  render();
}

function simulateRobotUnavailable() {
  if (state.page !== "training") return;
  const robotEvent = robotEventByCase("rest_unavailable_bridge_down");
  state.robotState = robotEvent?.status ?? "unavailable";
  state.robotIssue = "TonyPi 暂时不可用";
  state.degraded = true;
  state.degradationReason = "TonyPi 连接不可用，已切换为人工扫描覆盖。";
  state.devices.robot = "不可用";
  state.devices.camera = "人工扫描覆盖";
  addEvent("robot_unavailable", {
    bridgeMode: "mock",
    reason: "mock_bridge_unavailable"
  });
  addEvent("camera_unavailable", {
    reason: "robot_unavailable",
    mode: "operator_scan_override"
  });
  addEvent("operator_override_enabled", {
    overrideType: "operator_scan_override",
    reason: "robot_unavailable"
  });
  addEvent("degraded_mode_entered", {
    reason: "robot_unavailable",
    mode: "operator_scan_override",
    message: state.degradationReason
  });
  render();
}

function completeTraining() {
  const completed = state.scanCount >= state.manifest.rules.totalScans;
  state.phase = "完成";
  state.endedAt = now();
  state.finishReason = completed ? "completed" : "ended_early_by_parent";
  if (!completed) {
    addEvent("session_ended_early", {
      reason: "parent_finished_before_target",
      scanCount: state.scanCount,
      totalScans: state.manifest.rules.totalScans
    });
  }
  addEvent("level_completed", {
    success: completed,
    scanCount: state.scanCount,
    totalScans: state.manifest.rules.totalScans,
    violations: state.violations,
    durationSec: 180,
    degradedMode: state.degraded,
    reason: state.finishReason
  });
  addEvent("bci_summary_ready", state.bciSummary);
  addEvent("session_completed", { completedLevels: 1 });
  buildReport();
  state.page = "complete";
  render();
}

function buildReport() {
  state.reportRequest = {
    ...state.fixtures.reportRequest,
    sessionId: state.sessionId,
    startedAt: state.startedAt,
    endedAt: state.endedAt,
    events: state.events,
    bciSummary: state.bciSummary,
    deviceSummary: {
      bci: {
        deviceId: "bci_sim_001",
        source: "simulated",
        lowSignalSeconds: state.bciSummary.lowSignalSeconds
      },
      robot: {
        bridgeMode: "mock",
        degraded: state.degraded
      }
    }
  };
  addEvent("report_uploaded", { target: "mock_report_api" });
  state.reportResponse = {
    ...state.fixtures.reportResponse,
    sessionId: state.sessionId,
    metrics: {
      ...state.fixtures.reportResponse.metrics,
      completionRate: state.scanCount / state.manifest.rules.totalScans,
      attentionAvg: state.bciSummary.attentionAvg,
      validSampleRate: state.bciSummary.validSampleRate,
      lowSignalSeconds: state.bciSummary.lowSignalSeconds,
      nogoViolationCount: state.violations,
      source: "simulated"
    },
    warnings: [
      ...state.fixtures.reportResponse.warnings,
      ...(state.finishReason !== "completed"
        ? [{ code: "SESSION_ENDED_EARLY", message: "本次训练提前结束，未达到 6 次扫描目标。" }]
        : []),
      ...(state.degraded
        ? [{ code: "DEGRADED_MODE", message: "本次演示启用了人工扫描覆盖。" }]
        : []),
      ...(state.bciConfidence === "低可信"
        ? [{ code: "LOW_BCI_CONFIDENCE", message: "本次 BCI 信号偏低，注意力记录可信度降低。" }]
        : []),
      ...(state.robotIssue
        ? [{ code: "ROBOT_MOCK_DEGRADED", message: `${state.robotIssue}，训练使用降级路径完成。` }]
        : [])
    ]
  };
  state.reportResponse.summary =
    state.finishReason === "completed"
      ? state.fixtures.reportResponse.summary
      : `本次训练提前结束。孩子完成了 ${state.scanCount} / ${state.manifest.rules.totalScans} 次晶石扫描，记录已保留，但不应视为完整训练。`;
  state.reportResponse.highlights =
    state.finishReason === "completed"
      ? state.fixtures.reportResponse.highlights
      : [
          `完成 ${state.scanCount} / ${state.manifest.rules.totalScans} 次扫描。`,
          "本次为提前结束记录，报告仅用于回顾过程。",
          `训练中出现 ${state.violations} 次 No-Go 提前反应。`
        ];
  addEvent("report_ready", {
    reportId: state.reportResponse.reportId,
    status: "ready",
    outcome: state.finishReason
  });
  persistSession();
}

function resetDemo() {
  state.page = "prepare";
  state.sessionId = `session_mock_${Date.now()}`;
  state.devices = {
    bci: "未连接",
    robot: "未连接",
    camera: "待检测",
    report: "报告服务就绪"
  };
  state.scanCount = 0;
  state.lives = state.manifest.rules.initialLives;
  state.phase = "准备";
  state.events = [];
  state.samples = [];
  state.degraded = false;
  state.degradationReason = "";
  state.violations = 0;
  state.reportRequest = null;
  state.reportResponse = null;
  state.finishReason = "";
  updateBciSummary("stable");
  render();
}

function renderShell(content) {
  app.innerHTML = `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">TP</span><span>TonyPi 训练</span></div>
      <span class="pill">家长端</span>
    </header>
    ${content}
  `;
  bindActions();
}

function render() {
  if (!state.loaded) {
    renderShell(`<section class="hero"><span class="eyebrow">准备中</span><h1>正在准备训练</h1><p>请稍等，正在读取本次训练内容。</p></section>`);
    return;
  }
  refreshPwaStatus();

  const pages = {
    prepare: renderPrepare,
    devices: renderDevices,
    training: renderTraining,
    complete: renderComplete,
    report: renderReport
  };
  renderShell(pages[state.page]());
}

function renderPrepare() {
  return `
    <main class="page">
      <section class="hero">
        <span class="eyebrow">今日训练</span>
        <h1>${state.manifest.title}</h1>
        <p>家长负责开始和观察，孩子跟 TonyPi 完成等待、停止和扫描练习。</p>
      </section>
      <section class="visual-stage product-visual" aria-label="机器人图片预留区域">
        <div class="robot-figure">
          <span class="robot-head"></span>
          <span class="robot-body"></span>
        </div>
        <div>
          <strong>TonyPi 将在这里作为训练主角</strong>
          <p>后续可替换为产品图、机器人照片或演示视频封面。</p>
        </div>
      </section>
      <section class="mobile-section">
        <div class="panel stack">
          <h2>训练准备</h2>
          <p class="label">家长负责启动和监看；儿童主要与 TonyPi 互动。</p>
          <div class="quick-stats">
            <div class="metric"><span class="label">目标扫描</span><b>${state.manifest.rules.totalScans}</b></div>
            <div class="metric"><span class="label">初始生命</span><b>${state.manifest.rules.initialLives}</b></div>
            <div class="metric"><span class="label">互动对象</span><b>TonyPi</b></div>
          </div>
          <button class="primary" data-action="connect">进入设备连接</button>
        </div>
        <div class="panel stack">
          <h3>家长会看到什么</h3>
          <p>训练进度、设备状态、注意力摘要和结束后的报告提示。</p>
        </div>
        <div class="panel stack">
          <h3>手机安装状态</h3>
          <p>${state.installStatus}</p>
          <p class="label">当前地址：${state.accessUrl}</p>
          <button class="secondary" data-action="install">添加到主屏幕</button>
        </div>
      </section>
    </main>
  `;
}

function renderDevices() {
  const ready = state.devices.bci.includes("已连接") && state.devices.robot.includes("可用");
  return `
    <main class="page">
      <section class="hero">
        <span class="eyebrow">开始前检查</span>
        <h1>设备连接</h1>
        <p>演示模式会使用模拟设备；真实硬件将在后续阶段接入。</p>
      </section>
      <section class="mobile-section">
        <div class="panel">
          ${statusRow("BCI 头环", state.devices.bci, "ok")}
          ${statusRow("TonyPi 桥", state.devices.robot, "ok")}
          ${statusRow("视觉识别", state.devices.camera, state.degraded ? "warn" : "ok")}
          ${statusRow("报告服务", state.devices.report, "ok")}
        </div>
        <div class="panel stack">
          <button class="secondary" data-action="connect">重新检查设备</button>
          <button class="secondary" data-action="degrade">模拟摄像头不可用</button>
          <button class="primary" data-action="start" ${ready ? "" : "disabled"}>开始训练</button>
          ${state.degraded ? `<p class="warning">${state.degradationReason}</p>` : ""}
        </div>
      </section>
    </main>
  `;
}

function renderTraining() {
  const total = state.manifest.rules.totalScans;
  const progress = Math.round((state.scanCount / total) * 100);
  return `
    <main class="page">
      <section class="hero">
        <span class="eyebrow">训练进行中</span>
        <h1>${state.phase}</h1>
        <p>${parentPhaseText(state.phase)}</p>
      </section>
      <section class="visual-stage video-visual" aria-label="TonyPi 视觉信号预留区域">
        <div class="scan-frame">
          <span></span><span></span><span></span><span></span>
        </div>
        <div>
          <strong>TonyPi 视觉信号</strong>
          <p>${state.degraded ? "视觉不可用，家长已启用人工扫描覆盖。" : "预留机器人摄像头画面或识别状态流。"}</p>
        </div>
      </section>
      <section class="mobile-section">
        <div class="panel stack">
          <h2>交互运行时</h2>
          <p class="label">训练不会自动通关；请按 TonyPi mock 信号或演示需要记录扫描、等待和降级。</p>
          <div class="split">
            <div class="metric"><span class="label">扫描进度</span><b>${state.scanCount} / ${total}</b></div>
            <div class="metric"><span class="label">生命值</span><b>${state.lives} / ${state.manifest.rules.initialLives}</b></div>
          </div>
          <div class="progress" aria-label="扫描进度"><span style="width:${progress}%"></span></div>
          <div class="metrics">
            <div class="metric"><span class="label">注意力均值</span><b>${state.bciSummary.attentionAvg}</b></div>
            <div class="metric"><span class="label">信号质量</span><b>${state.bciSummary.signalQualityAvg}</b></div>
            <div class="metric"><span class="label">TonyPi</span><b>${robotStateText(state.robotState)}</b></div>
          </div>
          ${state.degraded ? `<p class="warning">${state.degradationReason}</p>` : ""}
          <div class="split">
            <button class="secondary" data-action="next-phase">TonyPi 切换提示</button>
            <button class="danger" data-action="finish">结束训练</button>
          </div>
          <div class="split">
            <button class="primary" data-action="scan-success">收到扫描成功</button>
            <button class="secondary" data-action="nogo-violation">提前动了</button>
          </div>
          <div class="split">
            <button class="secondary" data-action="bci-low">BCI 低信号</button>
            <button class="secondary" data-action="robot-down">TonyPi 不可用</button>
          </div>
        </div>
        <div class="panel stack">
          <h2>训练动态</h2>
          ${renderParentActivity()}
        </div>
      </section>
    </main>
  `;
}

function renderComplete() {
  const completed = state.finishReason === "completed";
  return `
    <main class="page">
      <section class="hero">
        <span class="eyebrow">${completed ? "已完成" : "提前结束"}</span>
        <h1>${completed ? "训练完成" : "训练未完成"}</h1>
        <p>${completed ? "已生成本次训练摘要，报告会标注模拟或降级数据。" : "本次训练提前结束，记录会保留，但不会标记为成功完成。"}</p>
      </section>
      <section class="mobile-section">
        <div class="panel stack">
          <div class="metrics">
            <div class="metric"><span class="label">最终扫描</span><b>${state.scanCount} / ${state.manifest.rules.totalScans}</b></div>
            <div class="metric"><span class="label">No-Go 反应</span><b>${state.violations}</b></div>
            <div class="metric"><span class="label">报告状态</span><b>ready</b></div>
          </div>
          <p class="label">BCI 有效采样率 ${Math.round(state.bciSummary.validSampleRate * 100)}%，平均注意力 ${state.bciSummary.attentionAvg}。</p>
          <button class="primary" data-action="report">查看报告摘要</button>
        </div>
        <div class="panel stack">
          <h2>本次观察</h2>
          <p>${completed ? "孩子完成了本段练习。手机端已保留训练记录，并准备好报告摘要。" : `孩子完成了 ${state.scanCount} / ${state.manifest.rules.totalScans} 次扫描，手机端已保留未完成记录。`}</p>
          ${state.degraded ? `<p class="warning">${state.degradationReason}</p>` : ""}
        </div>
      </section>
    </main>
  `;
}

function renderReport() {
  const report = state.reportResponse;
  return `
    <main class="page">
      <section class="hero">
        <span class="eyebrow">家长报告</span>
        <h1>报告摘要</h1>
        <p>${report.summary}</p>
      </section>
      <section class="mobile-section">
        <div class="panel stack">
          <h2>重点</h2>
          ${report.highlights.map((item) => `<p>${item}</p>`).join("")}
          <div class="metrics">
            <div class="metric"><span class="label">完成率</span><b>${Math.round(report.metrics.completionRate * 100)}%</b></div>
            <div class="metric"><span class="label">注意力</span><b>${report.metrics.attentionAvg}</b></div>
            <div class="metric"><span class="label">低信号秒</span><b>${state.bciSummary.lowSignalSeconds}</b></div>
          </div>
        </div>
        <div class="panel stack">
          ${report.sections.map((section) => `
            <article class="report-section">
              <h3>${section.title}</h3>
              <p>${section.body}</p>
            </article>
          `).join("")}
          ${report.warnings.map((warning) => `<p class="warning">${warning.message}</p>`).join("")}
          <button class="secondary" data-action="reset">重新开始演示</button>
        </div>
      </section>
    </main>
  `;
}

function statusRow(label, value, tone) {
  return `
    <div class="status-row">
      <div><span class="dot ${tone}"></span><strong>${label}</strong></div>
      <span class="pill">${value}</span>
    </div>
  `;
}

function renderTimeline() {
  const recent = state.events.slice(-8).reverse();
  return `
    <ol class="timeline">
      ${recent.map((event) => `
        <li>
          <strong>${event.type}</strong>
          <span class="label">${new Date(event.timestamp).toLocaleTimeString("zh-CN", { hour12: false })}</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function parentPhaseText(phase) {
  const copy = {
    "规则说明": "TonyPi 正在讲解规则，请让孩子看向机器人。",
    "Go": "现在可以行动，孩子可跟随 TonyPi 扫描晶石。",
    "No-Go": "现在需要等待，观察孩子能否暂停动作。",
    "扫描": "正在完成一次扫描，手机端只记录进度。",
    "完成": "训练已结束。"
  };
  return copy[phase] ?? "训练正在进行。";
}

function robotStateText(robotState) {
  if (robotState === "busy") return "忙碌";
  if (robotState === "stopping") return "停止中";
  if (robotState === "unavailable") return "不可用";
  return "就绪";
}

function activityText(event) {
  const payload = event.payload ?? {};
  const map = {
    session_started: "训练已开始。",
    level_started: "TonyPi 开始引导本关。",
    state_go: "进入行动阶段，可以扫描晶石。",
    state_nogo: "进入等待阶段，请孩子先停下来。",
    scan_requested: "TonyPi 发出扫描提示。",
    scan_success: `已完成第 ${payload.scanCount ?? state.scanCount} 次扫描。`,
    nogo_violation: "孩子在等待阶段提前行动，生命值减少。",
    bci_attention_window_updated: `注意力记录已更新，当前均值 ${payload.attentionAvg ?? state.bciSummary.attentionAvg}。`,
    bci_signal_quality_changed: "BCI 信号偏低，报告会降低可信度。",
    robot_unavailable: "TonyPi 暂时不可用，已切换降级路径。",
    session_ended_early: "训练提前结束，已保留未完成记录。",
    camera_unavailable: "视觉识别不可用。",
    operator_override_enabled: "已启用人工扫描覆盖。",
    degraded_mode_entered: "训练进入降级模式，仍可继续完成演示。",
    level_completed: payload.success === false ? "本关未完成，已生成过程记录。" : "本关训练已完成。",
    bci_summary_ready: "注意力摘要已生成。",
    report_uploaded: "训练摘要已提交到报告服务。",
    report_ready: "报告摘要已准备好。"
  };
  return map[event.type] ?? null;
}

function renderParentActivity() {
  const recent = state.events
    .map((event) => ({ event, text: activityText(event) }))
    .filter((item) => item.text)
    .slice(-6)
    .reverse();

  return `
    <ol class="timeline parent-activity">
      ${recent.map(({ event, text }) => `
        <li>
          <strong>${text}</strong>
          <span class="label">${new Date(event.timestamp).toLocaleTimeString("zh-CN", { hour12: false })}</span>
        </li>
      `).join("")}
    </ol>
  `;
}

function bindActions() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "connect") connectMocks();
      if (action === "degrade") enterDegradedMode();
      if (action === "start") startTraining();
      if (action === "next-phase") nextTrainingPhase();
      if (action === "scan-success") recordScanSuccess();
      if (action === "nogo-violation") recordNogoViolation();
      if (action === "bci-low") simulateLowBciSignal();
      if (action === "robot-down") simulateRobotUnavailable();
      if (action === "install") installPwa();
      if (action === "finish") completeTraining();
      if (action === "report") {
        state.page = "report";
        render();
      }
      if (action === "reset") resetDemo();
    });
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.deferredInstallPrompt = event;
  state.installStatus = "可添加到主屏幕";
  if (state.loaded) render();
});

window.addEventListener("appinstalled", () => {
  state.installStatus = "已安装";
  state.deferredInstallPrompt = null;
  if (state.loaded) render();
});

loadData().catch((error) => {
  app.innerHTML = `
    <main class="app-shell">
      <section class="hero">
        <span class="eyebrow">LOAD ERROR</span>
        <h1>无法读取共享数据</h1>
        <p>${error.message}</p>
      </section>
      <section class="panel">
        <p>请从仓库根目录启动静态服务器，再访问 /workspaces/app-pwa/。</p>
      </section>
    </main>
  `;
});
