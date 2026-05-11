const state = {
  device: null,
  server: null,
  notifications: [],
  discovered: [],
  lastSample: null
};

const els = {
  supportStatus: document.querySelector("#supportStatus"),
  namePrefix: document.querySelector("#namePrefix"),
  optionalServices: document.querySelector("#optionalServices"),
  connectButton: document.querySelector("#connectButton"),
  disconnectButton: document.querySelector("#disconnectButton"),
  deviceOutput: document.querySelector("#deviceOutput"),
  sampleOutput: document.querySelector("#sampleOutput"),
  logOutput: document.querySelector("#logOutput")
};

function log(message, detail = null) {
  const line = {
    time: new Date().toISOString(),
    message,
    detail
  };
  els.logOutput.textContent = `${JSON.stringify(line, null, 2)}\n${els.logOutput.textContent}`;
}

function renderSupport() {
  const secure = window.isSecureContext;
  const bluetooth = Boolean(navigator.bluetooth);
  const supported = secure && bluetooth;
  els.supportStatus.classList.toggle("warn", !supported);
  els.supportStatus.textContent = supported
    ? "当前浏览器支持 Web Bluetooth，且处于安全上下文。"
    : `当前环境不可直接探测：secureContext=${secure}, bluetooth=${bluetooth}。请使用安卓 Chrome + HTTPS 或 localhost。`;
  els.connectButton.disabled = !supported;
}

function parseOptionalServices() {
  return els.optionalServices.value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildRequestOptions() {
  const prefix = els.namePrefix.value.trim();
  const optionalServices = parseOptionalServices();
  const options = prefix
    ? { filters: [{ namePrefix: prefix }] }
    : { acceptAllDevices: true };

  if (optionalServices.length) {
    options.optionalServices = optionalServices;
  }

  return options;
}

async function connect() {
  try {
    const options = buildRequestOptions();
    log("requestDevice", options);
    const device = await navigator.bluetooth.requestDevice(options);
    state.device = device;
    device.addEventListener("gattserverdisconnected", handleDisconnected);
    log("device selected", { id: device.id, name: device.name || null });

    state.server = await device.gatt.connect();
    els.disconnectButton.disabled = false;
    await discoverServices();
  } catch (error) {
    log("connect failed", { name: error.name, message: error.message });
  }
}

async function discoverServices() {
  if (!state.server) return;
  state.discovered = [];
  const services = await state.server.getPrimaryServices();

  for (const service of services) {
    const serviceInfo = {
      uuid: service.uuid,
      characteristics: []
    };
    let characteristics = [];
    try {
      characteristics = await service.getCharacteristics();
    } catch (error) {
      serviceInfo.error = error.message;
    }

    for (const characteristic of characteristics) {
      const item = {
        uuid: characteristic.uuid,
        properties: listProperties(characteristic.properties)
      };
      serviceInfo.characteristics.push(item);
      await tryReadCharacteristic(characteristic, item);
      await tryStartNotifications(characteristic, item);
    }

    state.discovered.push(serviceInfo);
  }

  renderDeviceInfo();
}

function listProperties(properties) {
  return [
    "broadcast",
    "read",
    "writeWithoutResponse",
    "write",
    "notify",
    "indicate",
    "authenticatedSignedWrites",
    "reliableWrite",
    "writableAuxiliaries"
  ].filter((name) => properties[name]);
}

async function tryReadCharacteristic(characteristic, item) {
  if (!characteristic.properties.read) return;
  try {
    const value = await characteristic.readValue();
    item.lastRead = decodeDataView(value);
    mapAndRenderSample(characteristic, value, "read");
  } catch (error) {
    item.readError = error.message;
  }
}

async function tryStartNotifications(characteristic, item) {
  if (!characteristic.properties.notify && !characteristic.properties.indicate) return;
  try {
    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", (event) => {
      mapAndRenderSample(event.target, event.target.value, "notification");
    });
    item.notification = "started";
    state.notifications.push(characteristic.uuid);
  } catch (error) {
    item.notificationError = error.message;
  }
}

function mapAndRenderSample(characteristic, value, inputMode) {
  const decoded = decodeDataView(value);
  state.lastSample = toBciSample({
    deviceId: state.device?.id || "unknown_bci_device",
    characteristicUuid: characteristic.uuid,
    decoded,
    inputMode
  });
  renderDeviceInfo();
  els.sampleOutput.textContent = JSON.stringify(state.lastSample, null, 2);
  log("bci sample candidate", state.lastSample);
}

function decodeDataView(value) {
  const bytes = Array.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
  const hex = bytes.map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
  let text = "";
  try {
    text = new TextDecoder("utf-8", { fatal: false }).decode(value);
  } catch {
    text = "";
  }
  return { byteLength: value.byteLength, hex, text, bytes };
}

function toBciSample({ deviceId, characteristicUuid, decoded, inputMode }) {
  const json = tryParseJson(decoded.text);
  const source = json || {};
  return {
    deviceId,
    source: "device",
    attention: normalizeScore(firstNumber(source.attention, source.att, source.focus)),
    relaxation: normalizeScore(firstNumber(source.relaxation, source.meditation, source.relax)),
    signalQuality: normalizeScore(firstNumber(source.signalQuality, source.signal, source.poorSignal)),
    bandPower: typeof source.bandPower === "object" && source.bandPower !== null ? source.bandPower : {},
    raw: {
      characteristicUuid,
      inputMode,
      byteLength: decoded.byteLength,
      hexPreview: decoded.hex.slice(0, 160),
      textPreview: decoded.text.slice(0, 160),
      parsedJson: Boolean(json)
    },
    timestamp: new Date().toISOString()
  };
}

function tryParseJson(text) {
  const trimmed = text.trim();
  if (!trimmed || (!trimmed.startsWith("{") && !trimmed.startsWith("["))) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function firstNumber(...values) {
  const value = values.find((item) => typeof item === "number" && Number.isFinite(item));
  return typeof value === "number" ? value : null;
}

function normalizeScore(value) {
  if (typeof value !== "number") return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function renderDeviceInfo() {
  els.deviceOutput.textContent = JSON.stringify(
    {
      device: state.device
        ? {
            id: state.device.id,
            name: state.device.name || null,
            gattConnected: Boolean(state.device.gatt?.connected)
          }
        : null,
      notifications: state.notifications,
      services: state.discovered
    },
    null,
    2
  );
}

function handleDisconnected() {
  els.disconnectButton.disabled = true;
  log("device disconnected", { id: state.device?.id || null });
  renderDeviceInfo();
}

function disconnect() {
  if (state.device?.gatt?.connected) {
    state.device.gatt.disconnect();
  }
}

els.connectButton.addEventListener("click", connect);
els.disconnectButton.addEventListener("click", disconnect);
renderSupport();
