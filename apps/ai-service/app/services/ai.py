"""Readiness is tied to artifacts, policy and an explicit local assessment."""

import asyncio
import hashlib
import importlib.util
import json
import threading
from dataclasses import asdict
from importlib.metadata import PackageNotFoundError, version
from pathlib import Path

from app.models.artifacts import POLARITY_FORMATS, read_manifest
from app.schemas.ai import OPERATIONS, REQUESTS, RESULTS
from app.services.interfaces import (
    BASELINE_PROMPT_VERSION,
    PROMPT_VERSION,
    RULES,
    baseline_prompt,
    validate_result,
)
from app.services.worker import ExecutionError, Supervisor


def profile_fingerprint(manifests, settings):
    def installed(name):
        try:
            return version(name)
        except PackageNotFoundError:
            return "missing"

    profile = {
        "models": {k: v["fingerprint"] for k, v in manifests.items()},
        "prompt": BASELINE_PROMPT_VERSION if settings.baseline else PROMPT_VERSION,
        "schema": "1",
        "device": settings.device,
        "threshold": settings.threshold,
        "max_tokens": settings.max_tokens,
        "output_tokens": settings.output_tokens,
        "libraries": {name: installed(name) for name in ("torch", "transformers", "tokenizers")},
        "contracts": {
            name: [REQUESTS[name].model_json_schema(), RESULTS[name].model_json_schema()]
            for name in OPERATIONS
        },
        "instructions": {
            operation: baseline_prompt(operation)
            for operation in OPERATIONS
            if operation != "analyze"
        }
        if settings.baseline
        else RULES,
    }
    return hashlib.sha256(json.dumps(profile, sort_keys=True).encode()).hexdigest()


class AiService:
    def __init__(self, settings):
        self.settings = settings
        self.manifests = {}
        self.reasons = {}
        self.worker = None
        self.initialized = False
        self.init_lock = threading.Lock()

    def initialize(self):
        with self.init_lock:
            self._initialize()

    def _initialize(self):
        if self.initialized:
            return
        for name in ("generation", "aspect", "polarity"):
            try:
                self.manifests[name] = read_manifest(
                    Path(self.settings.model_root) / name / "manifest.json"
                )
                if self.manifests[name]["adapter"] != name:
                    raise ValueError("Wrong adapter")
            except (OSError, ValueError, KeyError, TypeError):
                self.manifests.pop(name, None)
                self.reasons[name] = "package_unavailable"
        self.initialized = True

    def capabilities(self):
        self.initialize()
        try:
            acceptance = json.loads(
                (Path(self.settings.model_root) / "acceptance.json").read_text()
            )
        except (OSError, ValueError):
            acceptance = {}
        if not isinstance(acceptance, dict):
            acceptance = {}
        capabilities = {}
        dependencies = all(importlib.util.find_spec(n) for n in ("torch", "transformers"))
        for operation in OPERATIONS:
            names = ("aspect", "polarity") if operation == "analyze" else ("generation",)
            models = {k: self.manifests[k] for k in names if k in self.manifests}
            reason = next(
                (self.reasons.get(k, "package_unavailable") for k in names if k not in models), None
            )
            if not reason and not dependencies:
                reason = "inference_dependencies_missing"
            if (
                not reason
                and operation == "analyze"
                and (models["polarity"]["input_format"] not in POLARITY_FORMATS)
            ):
                reason = "unverified_input_format"
            profile = profile_fingerprint(models, self.settings)
            record = acceptance.get(operation, {})
            accepted = (
                not reason
                and isinstance(record, dict)
                and (
                    record.get("profile") == profile
                    and record.get("passed") is True
                    and record.get("reviewed") is True
                )
            )
            if not reason and not accepted and not self.settings.baseline:
                reason = "unassessed"
            quality = "unavailable" if reason else "accepted" if accepted else "baseline"
            warnings = (
                ["experimental_baseline", "quality_not_accepted"] if quality == "baseline" else []
            )
            capabilities[operation] = {
                "ready": reason is None,
                "reason": reason,
                "models": [m["alias"] for m in models.values()],
                "profile": profile,
                "quality_status": quality,
                "quality_accepted": bool(accepted),
                "warnings": warnings,
            }
        return {"schema_version": "1", "capabilities": capabilities}

    async def execute(self, operation, request):
        capabilities = await asyncio.to_thread(self.capabilities)
        capability = capabilities["capabilities"][operation]
        if not capability["ready"]:
            raise ExecutionError("capability_unavailable")
        if self.worker is None:
            specs = {
                k: {
                    "path": str(Path(v["directory"]) / "manifest.json"),
                    "fingerprint": v["fingerprint"],
                }
                for k, v in self.manifests.items()
            }
            self.worker = Supervisor(
                specs,
                {
                    k: v
                    for k, v in asdict(self.settings).items()
                    if k not in ("token", "model_root")
                },
            )
        result = await self.worker.execute(
            operation, request.model_dump(), timeout=self.settings.timeout
        )
        result = validate_result(operation, result, request)
        return {
            "schema_version": "1",
            "operation": operation,
            "provenance": {
                "models": capability["models"],
                "profile": capability["profile"],
                "prompt_version": BASELINE_PROMPT_VERSION
                if self.settings.baseline
                else PROMPT_VERSION,
                "method_version": "aspects-v1",
                "scores": "uncalibrated",
                "quality_status": capability["quality_status"],
                "quality_accepted": capability["quality_accepted"],
                "warnings": capability["warnings"],
            },
            "result": result,
        }

    def close(self):
        if self.worker:
            self.worker.close()
