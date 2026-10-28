"""Opt-in actual inference. Records evidence, never automatically approves a model."""

import argparse
import asyncio
import hashlib
import json
import platform
import time
from dataclasses import asdict
from pathlib import Path

from app.core.settings import Settings
from app.models.artifacts import POLARITY_FORMATS, read_manifest
from app.schemas.ai import REQUESTS
from app.services.ai import profile_fingerprint
from app.services.worker import ExecutionError, Supervisor


async def run(args):
    root = Path(args.model_root).resolve()
    settings = Settings(
        model_root=str(root), device=args.device, timeout=args.timeout, output_tokens=768
    )
    # Fixtures are committed before any inference output is observed.
    fixture_path = Path(__file__).resolve().parents[1] / "tests/fixtures/ai-smoke.json"
    fixture_bytes = fixture_path.read_bytes()
    fixtures = json.loads(fixture_bytes)
    analysis_bytes = (fixture_path.parent / "analysis-aspect-first-v1.json").read_bytes()
    analysis_fixture = json.loads(analysis_bytes)
    manifests = {
        k: read_manifest(root / k / "manifest.json") for k in ("generation", "aspect", "polarity")
    }
    specs = {
        k: {"path": str(root / k / "manifest.json"), "fingerprint": m["fingerprint"]}
        for k, m in manifests.items()
    }
    worker = Supervisor(
        specs, {k: v for k, v in asdict(settings).items() if k not in ("model_root", "token")}
    )
    records = []
    cases = list(fixtures["generation"])
    confirmed = manifests["polarity"]["input_format"] in POLARITY_FORMATS
    if confirmed:
        for index, case in enumerate(analysis_fixture["cases"]):
            cases.append(
                {
                    "operation": "analyze",
                    "payload": {"texts": [{"id": f"a{index}", "text": case["text"]}]},
                    "expected_sentiment": case["expected_sentiment"],
                    "expected_aspects": case["aspects"],
                    "locale": case["locale"],
                }
            )
    try:
        for case in cases:
            if case["operation"] not in args.operations:
                continue
            started = time.monotonic()
            request = REQUESTS[case["operation"]].model_validate(case["payload"])
            try:
                output = await worker.execute(
                    case["operation"], request.model_dump(), timeout=settings.timeout
                )
                status_ok = case.get("expected_status", output.get("status")) == output.get(
                    "status"
                )
                if case["operation"] == "analyze":
                    item = output["items"][0]
                    status_ok = item["sentiment"] == case["expected_sentiment"] and all(
                        any(
                            m["text"].strip().casefold() == expected["text"].casefold()
                            and m["sentiment"] == expected["sentiment"]
                            and m["accepted"]
                            for m in item["mentions"]
                        )
                        for expected in case["expected_aspects"]
                    )
                record = {"valid": True, "expected_status_passed": status_ok, "output": output}
            except ExecutionError as error:
                record = {"valid": False, "error": str(error)}
            records.append({**case, **record, "seconds": round(time.monotonic() - started, 3)})
            print(
                case["operation"],
                case["payload"].get("locale", "analysis"),
                record.get("error", "schema_valid"),
                flush=True,
            )
    finally:
        worker.close()
    import torch
    import transformers

    report = {
        "fixture_sha256": hashlib.sha256(fixture_bytes).hexdigest(),
        "analysis_fixture_sha256": hashlib.sha256(analysis_bytes).hexdigest(),
        "analysis_criteria": analysis_fixture["criteria"],
        "criteria": fixtures["criteria"],
        "platform": platform.platform(),
        "torch": torch.__version__,
        "transformers": transformers.__version__,
        "device": settings.device,
        "hardware": torch.cuda.get_device_name()
        if settings.device == "cuda"
        else platform.processor(),
        "settings": {k: v for k, v in asdict(settings).items() if k not in ("token", "model_root")},
        "profiles": {
            op: profile_fingerprint(
                {
                    k: manifests[k]
                    for k in (("aspect", "polarity") if op == "analyze" else ("generation",))
                },
                settings,
            )
            for op in REQUESTS
        },
        "artifacts": {k: m["fingerprint"] for k, m in manifests.items()},
        "records": records,
        "analysis_reason": None if confirmed else "unverified_input_format",
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Assessment report saved; manual semantic review and acceptance still required.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model-root", required=True)
    parser.add_argument("--device", choices=("cpu", "cuda"), default="cpu")
    parser.add_argument("--timeout", type=int, default=180)
    parser.add_argument("--output", required=True)
    parser.add_argument("--operations", nargs="+", choices=list(REQUESTS), default=list(REQUESTS))
    asyncio.run(run(parser.parse_args()))
