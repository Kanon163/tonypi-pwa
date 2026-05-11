#!/usr/bin/env python3
"""
TonyPi Wave 4 bridge probe.

Run this on the TonyPi Raspberry Pi. It is not a production bridge service.
It emits RobotEvent-compatible JSON lines for health_check, scan_crystal,
and stop probe paths.
"""

from __future__ import annotations

import argparse
import importlib
import json
import socket
import subprocess
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ACTION_DIR = Path("/home/pi/TonyPi/ActionGroups")
WHITELIST = {
    "greeting",
    "go_invite",
    "nogo_stop",
    "scan_crystal",
    "rest",
    "celebrate_small",
    "celebrate_big",
    "encourage_retry",
}
LOW_DISTURBANCE_ACTIONS = {"nogo_stop", "rest", "encourage_retry"}


def iso_now() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def robot_event(
    *,
    event_id: str,
    event_type: str,
    command_id: str,
    status: str,
    data: dict[str, Any],
) -> dict[str, Any]:
    return {
        "id": event_id,
        "type": event_type,
        "commandId": command_id,
        "status": status,
        "data": data,
        "timestamp": iso_now(),
    }


def print_event(event: dict[str, Any]) -> None:
    print(json.dumps(event, ensure_ascii=False, sort_keys=True), flush=True)


def run_text(command: list[str], timeout: float = 2.0) -> str | None:
    try:
        result = subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
    except Exception:
        return None
    return (result.stdout or "").strip() or None


def local_ips() -> list[str]:
    text = run_text(["hostname", "-I"])
    if not text:
        return []
    return [part for part in text.split() if part]


def default_route() -> str | None:
    return run_text(["sh", "-c", "ip route | awk '/default/ {print $3; exit}'"])


def infer_network_mode(ips: list[str]) -> str:
    if any(ip.startswith("192.168.149.") for ip in ips):
        return "ap"
    if ips:
        return "lan"
    return "unknown"


def import_agc() -> tuple[Any | None, str | None]:
    candidates = [
        "hiwonder.ActionGroupControl",
        "hiwonder.action_group_control",
    ]
    for name in candidates:
        try:
            return importlib.import_module(name), None
        except Exception as exc:
            last_error = f"{name}: {exc}"
    return None, last_error if "last_error" in locals() else "hiwonder AGC import failed"


def import_camera() -> tuple[Any | None, str | None]:
    candidates = ["hiwonder.Camera", "hiwonder.camera"]
    for name in candidates:
        try:
            return importlib.import_module(name), None
        except Exception as exc:
            last_error = f"{name}: {exc}"
    return None, last_error if "last_error" in locals() else "hiwonder Camera import failed"


def missing_actions(action_dir: Path = ACTION_DIR) -> list[str]:
    if not action_dir.exists():
        return sorted(WHITELIST)
    missing = []
    for action in sorted(WHITELIST):
        if not (action_dir / f"{action}.d6a").exists():
            missing.append(action)
    return missing


def build_health_event(command_id: str) -> dict[str, Any]:
    ips = local_ips()
    agc, agc_error = import_agc()
    camera, camera_error = import_camera()
    missing = missing_actions()
    action_dir_exists = ACTION_DIR.exists()
    network_mode = infer_network_mode(ips)
    robot_ip = "192.168.149.1" if network_mode == "ap" else (ips[0] if ips else None)
    errors = [error for error in [agc_error, camera_error] if error]

    return robot_event(
        event_id="evt_probe_health_001",
        event_type="health_report",
        command_id=command_id,
        status="ok" if agc and action_dir_exists else "unavailable",
        data={
            "networkMode": network_mode,
            "bridgeState": "idle" if agc else "unavailable",
            "robotIp": robot_ip,
            "localIps": ips,
            "defaultRoute": default_route(),
            "capabilities": [
                capability
                for capability, ready in {
                    "action_group": bool(agc),
                    "health_check": True,
                    "camera_mode": bool(camera),
                    "stop": True,
                }.items()
                if ready
            ],
            "cameraReady": bool(camera),
            "actionDir": str(ACTION_DIR),
            "actionDirExists": action_dir_exists,
            "missingActions": missing,
            "lowDisturbanceActions": sorted(LOW_DISTURBANCE_ACTIONS),
            "lastError": "; ".join(errors) if errors else None,
            "probeHost": socket.gethostname(),
            "realHardwareProbe": True,
        },
    )


def validate_action_name(name: str) -> str | None:
    if name not in WHITELIST:
        return "ACTION_NOT_WHITELISTED"
    if "/" in name or "\\" in name or "." in name:
        return "ACTION_NAME_UNSAFE"
    return None


def run_action_group(agc: Any, action: str) -> None:
    runner = getattr(agc, "runActionGroup", None)
    if runner is None:
        raise RuntimeError("AGC.runActionGroup is not available")
    runner(action)


def scan_crystal_probe(command_id: str, execute_action: bool) -> dict[str, Any]:
    action = "scan_crystal"
    validation_error = validate_action_name(action)
    if validation_error:
        return robot_event(
            event_id="evt_probe_scan_failed_001",
            event_type="error",
            command_id=command_id,
            status="failed",
            data={
                "bridgeState": "idle",
                "failedAction": action,
                "errorCode": validation_error,
                "missingActions": [],
                "lastError": validation_error,
                "realHardwareProbe": True,
            },
        )

    action_file = ACTION_DIR / f"{action}.d6a"
    if not action_file.exists():
        return robot_event(
            event_id="evt_probe_scan_failed_001",
            event_type="error",
            command_id=command_id,
            status="failed",
            data={
                "bridgeState": "idle",
                "failedAction": action,
                "errorCode": "ACTION_FILE_MISSING",
                "missingActions": [action],
                "lastError": f"{action_file} does not exist",
                "realHardwareProbe": True,
            },
        )

    agc, agc_error = import_agc()
    if not agc:
        return robot_event(
            event_id="evt_probe_scan_failed_001",
            event_type="error",
            command_id=command_id,
            status="unavailable",
            data={
                "bridgeState": "unavailable",
                "failedAction": action,
                "errorCode": "AGC_IMPORT_FAILED",
                "missingActions": [],
                "lastError": agc_error,
                "realHardwareProbe": True,
            },
        )

    if not execute_action:
        return robot_event(
            event_id="evt_probe_scan_dry_run_001",
            event_type="command_ack",
            command_id=command_id,
            status="ok",
            data={
                "bridgeState": "idle",
                "acceptedAction": action,
                "actionFile": str(action_file),
                "dryRun": True,
                "realHardwareProbe": True,
            },
        )

    started = time.monotonic()
    try:
        run_action_group(agc, action)
    except Exception as exc:
        return robot_event(
            event_id="evt_probe_scan_failed_001",
            event_type="error",
            command_id=command_id,
            status="failed",
            data={
                "bridgeState": "idle",
                "failedAction": action,
                "errorCode": "ACTION_EXECUTION_FAILED",
                "missingActions": [],
                "lastError": str(exc),
                "realHardwareProbe": True,
            },
        )

    return robot_event(
        event_id="evt_probe_scan_finished_001",
        event_type="command_finished",
        command_id=command_id,
        status="ok",
        data={
            "bridgeState": "idle",
            "completedAction": action,
            "durationMs": round((time.monotonic() - started) * 1000),
            "missingActions": [],
            "lastError": None,
            "realHardwareProbe": True,
        },
    )


def stop_probe(command_id: str, execute_action: bool) -> dict[str, Any]:
    agc, agc_error = import_agc()
    stop_candidates = [
        "stopActionGroup",
        "stopAction",
        "stop",
        "stopRunning",
    ]
    available_stop_methods = [
        name for name in stop_candidates if agc is not None and hasattr(agc, name)
    ]

    data: dict[str, Any] = {
        "bridgeState": "stopping",
        "availableStopMethods": available_stop_methods,
        "realInterruptVerified": False,
        "realHardwareProbe": True,
    }

    if not agc:
        data.update(
            {
                "bridgeState": "unavailable",
                "stopSemantics": "agc_unavailable",
                "lastError": agc_error,
            }
        )
        return robot_event(
            event_id="evt_probe_stop_unavailable_001",
            event_type="error",
            command_id=command_id,
            status="unavailable",
            data=data,
        )

    if not execute_action:
        data.update(
            {
                "stopSemantics": "dry_run_accepts_no_new_actions_only",
                "lastError": None,
            }
        )
        return robot_event(
            event_id="evt_probe_stop_ack_001",
            event_type="command_ack",
            command_id=command_id,
            status="ok",
            data=data,
        )

    if not available_stop_methods:
        data.update(
            {
                "stopSemantics": "accepts_no_new_actions_only",
                "lastError": "No AGC hard-stop method found by probe.",
            }
        )
        return robot_event(
            event_id="evt_probe_stop_ack_001",
            event_type="command_ack",
            command_id=command_id,
            status="ok",
            data=data,
        )

    method_name = available_stop_methods[0]
    try:
        getattr(agc, method_name)()
        data.update(
            {
                "stopSemantics": "hard_stop_method_called_without_running_action",
                "realInterruptVerified": False,
                "calledMethod": method_name,
                "lastError": None,
            }
        )
        return robot_event(
            event_id="evt_probe_stop_ack_001",
            event_type="command_ack",
            command_id=command_id,
            status="ok",
            data=data,
        )
    except Exception as exc:
        data.update(
            {
                "stopSemantics": "hard_stop_method_call_failed",
                "calledMethod": method_name,
                "lastError": str(exc),
            }
        )
        return robot_event(
            event_id="evt_probe_stop_failed_001",
            event_type="error",
            command_id=command_id,
            status="failed",
            data=data,
        )


def stop_during_scan_probe(command_id: str) -> dict[str, Any]:
    action = "scan_crystal"
    action_file = ACTION_DIR / f"{action}.d6a"
    agc, agc_error = import_agc()
    if not agc or not action_file.exists():
        return robot_event(
            event_id="evt_probe_stop_during_scan_unavailable_001",
            event_type="error",
            command_id=command_id,
            status="unavailable",
            data={
                "bridgeState": "unavailable",
                "stopSemantics": "not_tested",
                "realInterruptVerified": False,
                "missingActions": [] if action_file.exists() else [action],
                "lastError": agc_error if not agc else f"{action_file} does not exist",
                "realHardwareProbe": True,
            },
        )

    stop_methods = [name for name in ["stopActionGroup", "stopAction", "stop"] if hasattr(agc, name)]
    result: dict[str, Any] = {"exception": None}

    def target() -> None:
        try:
            run_action_group(agc, action)
        except Exception as exc:
            result["exception"] = str(exc)

    thread = threading.Thread(target=target, daemon=True)
    started = time.monotonic()
    thread.start()
    time.sleep(0.25)
    stop_called = None
    stop_error = None

    if stop_methods:
        stop_called = stop_methods[0]
        try:
            getattr(agc, stop_called)()
        except Exception as exc:
            stop_error = str(exc)

    thread.join(timeout=2.0)
    interrupted = not thread.is_alive()
    duration_ms = round((time.monotonic() - started) * 1000)

    return robot_event(
        event_id="evt_probe_stop_during_scan_001",
        event_type="command_finished" if interrupted and not stop_error else "error",
        command_id=command_id,
        status="ok" if interrupted and not stop_error else "failed",
        data={
            "bridgeState": "idle" if interrupted else "stopping",
            "stopSemantics": "hard_interrupt_observed" if stop_called and interrupted else "accepts_no_new_actions_only_or_not_observed",
            "completedAction": action if interrupted else None,
            "durationMs": duration_ms,
            "availableStopMethods": stop_methods,
            "calledMethod": stop_called,
            "realInterruptVerified": bool(stop_called and interrupted and not stop_error),
            "actionThreadStillRunning": thread.is_alive(),
            "lastError": stop_error or result["exception"],
            "realHardwareProbe": True,
        },
    )


def write_jsonl(path: Path, events: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for event in events:
            handle.write(json.dumps(event, ensure_ascii=False, sort_keys=True))
            handle.write("\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="TonyPi real bridge probe")
    parser.add_argument(
        "--mode",
        choices=["health", "scan", "stop", "stop-during-scan", "all"],
        default="health",
    )
    parser.add_argument(
        "--execute-action",
        action="store_true",
        help="Actually call AGC.runActionGroup('scan_crystal') or AGC stop methods.",
    )
    parser.add_argument(
        "--jsonl",
        default="",
        help="Optional path to write emitted RobotEvent JSON lines.",
    )
    args = parser.parse_args()

    events: list[dict[str, Any]] = []

    if args.mode in {"health", "all"}:
        events.append(build_health_event("cmd_probe_health_001"))
    if args.mode in {"scan", "all"}:
        events.append(scan_crystal_probe("cmd_probe_scan_001", args.execute_action))
    if args.mode in {"stop", "all"}:
        events.append(stop_probe("cmd_probe_stop_001", args.execute_action))
    if args.mode == "stop-during-scan":
        if not args.execute_action:
            print("stop-during-scan requires --execute-action", file=sys.stderr)
            return 2
        events.append(stop_during_scan_probe("cmd_probe_stop_during_scan_001"))

    for event in events:
        print_event(event)

    if args.jsonl:
        write_jsonl(Path(args.jsonl), events)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
