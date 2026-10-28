"""Same-input comparison and human-reviewed promotion; no automatic winner."""

import asyncio
import hashlib
import json
import random
import time
from dataclasses import replace
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from app.schemas.ai import SummaryRequest
from app.services.ai import AiService
from app.services.interfaces import validate_result
from app.services.summary_providers import PROVIDERS, SummaryProvider, summary_config
from app.services.worker import ExecutionError

CRITERIA = ("faithfulness", "coverage", "conciseness")


def digest(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, ensure_ascii=False).encode()
    ).hexdigest()


def validate_dataset(dataset):
    if dataset.get("version") != 1 or type(dataset.get("production_candidate")) is not bool:
        raise ValueError("Dataset must declare version 1 and production_candidate")
    cases = dataset.get("cases", [])
    if not 1 <= len(cases) <= 100 or len({c["id"] for c in cases}) != len(cases):
        raise ValueError("Provide 1-100 uniquely identified cases")
    for case in cases:
        if not isinstance(case["id"], str) or not case["id"].strip():
            raise ValueError("Missing case ID")
        SummaryRequest.model_validate(case["request"])
        if len(json.dumps(case["request"], ensure_ascii=False).encode()) > 65536:
            raise ValueError("Case exceeds the product HTTP byte limit")


async def compare(settings, dataset, providers, output, *, run=False, evaluator=None):
    validate_dataset(dataset)
    if (
        not providers
        or len(set(providers)) != len(providers)
        or any(p not in ("qwen", *PROVIDERS) for p in providers)
    ):
        raise ValueError("Choose distinct supported providers")
    output = Path(output)
    output.mkdir(parents=True, exist_ok=False)
    rows = []
    snapshot = {
        "version": 1,
        "executed": run,
        "dataset": dataset,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "providers": providers,
        "rows": rows,
        "configuration": {},
    }
    for provider in providers:
        if provider == "qwen":
            snapshot["configuration"][provider] = {
                "configured": (Path(settings.model_root) / "generation/manifest.json").exists(),
                "role": "comparison_baseline_only",
            }
        else:
            try:
                config = summary_config(replace(settings, summary_provider=provider))
                snapshot["configuration"][provider] = {
                    "configured": True,
                    "model": config.model,
                    "profile": config.profile,
                }
            except ValueError:
                snapshot["configuration"][provider] = {"configured": False}
    local = None

    async def evaluate(provider, request):
        nonlocal local
        if provider == "qwen":
            if local is None:
                local = AiService(replace(settings, summary_provider="qwen"), comparison=True)
            response = await local.execute("summaries", request)
            return (
                response["result"],
                {"input_tokens": None, "output_tokens": None},
                response["provenance"]["profile"],
            )
        adapter = SummaryProvider(replace(settings, summary_provider=provider))
        result, usage = await adapter.generate(request)
        return result, usage, adapter.config.profile

    candidates = []
    try:
        if run:
            if evaluator is None and "qwen" in providers:
                local = AiService(replace(settings, summary_provider="qwen"), comparison=True)
                caps = await asyncio.to_thread(local.capabilities)
                status = caps["capabilities"]["summaries"]
                snapshot["configuration"]["qwen"].update(
                    configured=status["ready"], profile=status["profile"], models=status["models"]
                )
            for case in dataset["cases"]:
                shuffled = list(providers)
                random.SystemRandom().shuffle(shuffled)
                for provider in shuffled:
                    candidate_id = str(uuid4())
                    row = {
                        "candidate_id": candidate_id,
                        "case_id": case["id"],
                        "provider": provider,
                        "profile": snapshot["configuration"][provider].get("profile"),
                    }
                    started = time.perf_counter()
                    request = SummaryRequest.model_validate(case["request"])
                    try:
                        result, usage, profile = await (evaluator or evaluate)(provider, request)
                        result = validate_result("summaries", result, request)
                        row.update(status="ok", result=result, usage=usage, profile=profile)
                    except ExecutionError as error:
                        safe_codes = {
                            "model_busy",
                            "model_timeout",
                            "invalid_model_output",
                            "capability_unavailable",
                            "input_too_large",
                            "provider_unavailable",
                        }
                        row["status"] = (
                            str(error) if str(error) in safe_codes else "provider_unavailable"
                        )
                    except ValueError:
                        row["status"] = "configuration_or_output_invalid"
                    row["latency_ms"] = round((time.perf_counter() - started) * 1000, 2)
                    rows.append(row)
                    candidates.append(
                        {
                            "candidate_id": candidate_id,
                            "case_id": case["id"],
                            "request": case["request"],
                            "result": row.get("result"),
                            "status": row["status"],
                            "ratings": {k: None for k in CRITERIA},
                        }
                    )
    finally:
        if local is not None:
            local.close()
    save_json(output / "results.json", snapshot)
    if run:
        save_json(
            output / "blind-review.json",
            {
                "results_digest": digest(snapshot),
                "instructions": (
                    "Rate each criterion 1-5. Review evidence first. "
                    "Do not open results.json until ratings are complete."
                ),
                "candidates": candidates,
            },
        )
    return snapshot


def save_json(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def promote(settings, result, review, provider):
    """Record reviewed superiority to Qwen; never edit provider selection or .env."""
    validate_dataset(result["dataset"])
    if (
        provider not in PROVIDERS
        or result.get("executed") is not True
        or result["dataset"]["production_candidate"] is not True
        or review.get("results_digest") != digest(result)
    ):
        raise ValueError("Run/review mismatch or smoke-only dataset")
    if {c["request"]["locale"] for c in result["dataset"]["cases"]} != {"en", "ar"}:
        raise ValueError("Production comparison must include both Arabic and English")
    config = summary_config(replace(settings, summary_provider=provider))
    rows = result["rows"]
    candidate_ids = [r["candidate_id"] for r in rows]
    reviews = review.get("candidates", [])
    if (
        len(set(candidate_ids)) != len(candidate_ids)
        or len(reviews) != len(rows)
        or {r["candidate_id"] for r in reviews} != set(candidate_ids)
    ):
        raise ValueError("Duplicate or incomplete candidate review")
    by_id = {r["candidate_id"]: r for r in reviews}
    scores = {}
    for name in ("qwen", provider):
        selected = [r for r in rows if r["provider"] == name]
        cases = result["dataset"]["cases"]
        if len(selected) != len(cases) or {r["case_id"] for r in selected} != {
            c["id"] for c in cases
        }:
            raise ValueError("Missing paired comparison")
        profiles = {r.get("profile") for r in selected}
        if len(profiles) != 1 or None in profiles or "0" * 64 in profiles:
            raise ValueError("Invalid candidate profile")
        if name == provider and profiles != {config.profile}:
            raise ValueError("Provider profile changed; rerun comparison")
        values = []
        for row in selected:
            source = next(c["request"] for c in cases if c["id"] == row["case_id"])
            baseline_invalid = name == "qwen" and row["status"] == "invalid_model_output"
            if row["status"] != "ok" and not baseline_invalid:
                raise ValueError("Every paired result must pass schema and evidence checks")
            if not baseline_invalid:
                validate_result("summaries", row["result"], SummaryRequest.model_validate(source))
            rating = by_id[row["candidate_id"]]
            if any(
                rating.get(k) != v
                for k, v in {
                    "case_id": row["case_id"],
                    "request": source,
                    "result": row.get("result"),
                    "status": row["status"],
                }.items()
            ):
                raise ValueError("Review content changed")
            grades = rating.get("ratings", {})
            if baseline_invalid:
                if set(grades) != set(CRITERIA) or any(v is not None for v in grades.values()):
                    raise ValueError(
                        "Invalid baseline has no human score; counted automatically as zero"
                    )
                values.extend([0, 0, 0])
                continue
            if set(grades) != set(CRITERIA) or any(
                type(v) is not int or not 1 <= v <= 5 for v in grades.values()
            ):
                raise ValueError("Complete all human ratings with integers 1-5")
            if name == provider and (
                grades["faithfulness"] < 4 or grades["coverage"] < 3 or grades["conciseness"] < 3
            ):
                raise ValueError("Candidate fails minimum human quality criteria")
            values.extend(grades.values())
        scores[name] = sum(values) / len(values)
    if scores[provider] < 4 or scores[provider] <= scores["qwen"]:
        raise ValueError("Candidate must average at least 4/5 and strictly beat Qwen")
    record = {
        "profile": config.profile,
        "passed": True,
        "reviewed": True,
        "comparison_digest": digest(result),
        "review_digest": digest(review),
        "scores": scores,
        "reviewed_at": datetime.now(timezone.utc).isoformat(),
    }
    root = Path(settings.model_root)
    root.mkdir(parents=True, exist_ok=True)
    destination = root / "acceptance.json"
    existing = json.loads(destination.read_text(encoding="utf-8")) if destination.exists() else {}
    if not isinstance(existing, dict):
        raise ValueError("Invalid acceptance store; preserve it for inspection")
    profiles = existing.setdefault("summary_profiles", {})
    if not isinstance(profiles, dict):
        raise ValueError("Invalid summary profile store")
    profiles[config.profile] = record
    existing["summaries"] = record
    temporary = root / ("acceptance-" + uuid4().hex + ".tmp")
    try:
        save_json(temporary, existing)
        temporary.replace(destination)
    finally:
        temporary.unlink(missing_ok=True)
    return record
