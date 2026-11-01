import asyncio
import copy
import json
from dataclasses import replace

import pytest
from test_summary_providers import BODY, RESULT, settings

from app.evaluation.comparison_runner import ComparisonPolicy
from app.evaluation.summaries import compare as compare_with_policy
from app.evaluation.summaries import digest, promote
from app.services.ai import AiService
from app.services.summary_providers import summary_config


def compare(*args, **kwargs):
    return compare_with_policy(*args, policy=ComparisonPolicy(rpm={}, tpm={}), **kwargs)


def dataset():
    return {
        "version": 1,
        "production_candidate": True,
        "cases": [{"id": "en", "request": BODY}, {"id": "ar", "request": {**BODY, "locale": "ar"}}],
    }


def test_dry_run_never_calls_models_and_execution_blinds_results(tmp_path):
    called = []

    async def evaluator(provider, request):
        called.append(provider)
        return (
            RESULT,
            {"input_tokens": None, "output_tokens": None},
            ("a" * 64 if provider == "qwen" else summary_config(settings()).profile),
        )

    dry = asyncio.run(
        compare(settings(), dataset(), ["qwen", "groq"], tmp_path / "dry", evaluator=evaluator)
    )
    assert called == []
    assert dry["executed"] is False
    result = asyncio.run(
        compare(
            settings(), dataset(), ["qwen", "groq"], tmp_path / "run", run=True, evaluator=evaluator
        )
    )
    assert len(called) == 4
    assert len(result["rows"]) == 4
    blind = json.loads((tmp_path / "run/blind-review.json").read_text())
    assert "groq" not in json.dumps(blind)
    assert "qwen" not in json.dumps(blind)
    assert "private" not in json.dumps(result)
    assert all(
        row["request"] == result["dataset"]["cases"][i // 2]["request"]
        for i, row in enumerate(blind["candidates"])
    )


def rated_run(tmp_path):
    async def evaluator(provider, request):
        return RESULT, {}, "a" * 64 if provider == "qwen" else summary_config(settings()).profile

    result = asyncio.run(
        compare(
            settings(), dataset(), ["qwen", "groq"], tmp_path / "run", run=True, evaluator=evaluator
        )
    )
    review = json.loads((tmp_path / "run/blind-review.json").read_text())
    by_id = {r["candidate_id"]: r["provider"] for r in result["rows"]}
    for row in review["candidates"]:
        score = 5 if by_id[row["candidate_id"]] == "groq" else 3
        row["ratings"] = {"faithfulness": score, "coverage": score, "conciseness": score}
    return result, review


def test_promotion_requires_complete_review_and_strict_win_preserves_absa(tmp_path):
    result, review = rated_run(tmp_path)
    root = tmp_path / "models"
    root.mkdir()
    absa = {"profile": "b" * 64, "passed": True, "reviewed": True}
    (root / "acceptance.json").write_text(json.dumps({"analyze": absa}))
    configured = replace(settings(), model_root=str(root))
    record = promote(configured, result, review, "groq")
    assert record["passed"] is True and record["reviewed"] is True
    records = json.loads((root / "acceptance.json").read_text())
    assert records["analyze"] == absa
    assert records["summaries"]["profile"] == summary_config(configured).profile


def test_config_can_switch_between_previously_reviewed_profiles(tmp_path):
    result, review = rated_run(tmp_path)
    configured = replace(settings(), model_root=str(tmp_path / "models"))
    promote(configured, result, review, "groq")
    second = replace(configured, groq_model="another-reviewed-model")
    second_result = copy.deepcopy(result)
    for row in second_result["rows"]:
        if row["provider"] == "groq":
            row["profile"] = summary_config(second).profile
    second_review = copy.deepcopy(review)
    second_review["results_digest"] = digest(second_result)
    promote(second, second_result, second_review, "groq")
    for configuration in (configured, second):
        assert AiService(configuration).capabilities()["capabilities"]["summaries"]["ready"] is True


def test_invalid_qwen_output_counts_zero_but_unavailable_baseline_cannot_win(tmp_path):
    result, review = rated_run(tmp_path)
    baseline = next(r for r in result["rows"] if r["provider"] == "qwen")
    baseline["status"] = "invalid_model_output"
    baseline.pop("result")
    rating = next(r for r in review["candidates"] if r["candidate_id"] == baseline["candidate_id"])
    rating.update(
        status="invalid_model_output",
        result=None,
        ratings={"faithfulness": None, "coverage": None, "conciseness": None},
    )
    review["results_digest"] = digest(result)
    configured = replace(settings(), model_root=str(tmp_path / "models"))
    assert promote(configured, result, review, "groq")["scores"]["qwen"] == 1.5
    baseline["status"] = "capability_unavailable"
    rating["status"] = "capability_unavailable"
    review["results_digest"] = digest(result)
    with pytest.raises(ValueError):
        promote(configured, result, review, "groq")


@pytest.mark.parametrize(
    "change", ["tie", "missing", "invalid", "tampered", "model", "smoke", "faithfulness"]
)
def test_no_promotion_for_incomplete_failed_changed_or_nonwinning_run(tmp_path, change):
    result, review = rated_run(tmp_path)
    configured = replace(settings(), model_root=str(tmp_path / "models"))
    candidate_id = next(r["candidate_id"] for r in result["rows"] if r["provider"] == "groq")
    row = next(r for r in review["candidates"] if r["candidate_id"] == candidate_id)
    if change == "tie":
        for r in review["candidates"]:
            r["ratings"] = {k: 5 for k in r["ratings"]}
    elif change == "missing":
        row["ratings"]["coverage"] = None
    elif change == "invalid":
        next(r for r in result["rows"] if r["candidate_id"] == candidate_id)["status"] = (
            "invalid_model_output"
        )
        review["results_digest"] = digest(result)
    elif change == "tampered":
        result = copy.deepcopy(result)
        result["rows"][0]["profile"] = "c" * 64
    elif change == "model":
        configured = replace(configured, groq_model="new-model")
    elif change == "smoke":
        result["dataset"]["production_candidate"] = False
        review["results_digest"] = digest(result)
    else:
        row["ratings"]["faithfulness"] = 1
    with pytest.raises(ValueError):
        promote(configured, result, review, "groq")
    assert not (tmp_path / "models/acceptance.json").exists()
