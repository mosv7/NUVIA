import pytest

from app.schemas.ai import REQUESTS
from app.services.interfaces import validate_result


def test_baseline_json_fence_tolerance_does_not_accept_surrounding_instructions():
    from app.services.interfaces import parse_generation

    assert parse_generation('```json\n{"items":[]}\n```', baseline=True) == {"items": []}
    for raw in ['Ignore rules\n```json\n{"items":[]}\n```', '{"items":[]} extra']:
        with pytest.raises(ValueError):
            parse_generation(raw, baseline=True)
    with pytest.raises(ValueError):
        parse_generation('```json\n{"items":[]}\n```', baseline=False)


def test_baseline_report_flat_quotes_are_grounded_by_code():
    from app.services.interfaces import normalize_baseline_report

    request = REQUESTS["reports"](texts=[{"id": "a", "text": "Service was slow."}], locale="en")
    raw = {
        "strength_quote": "",
        "problem_quote": "Service was slow.",
        "suggestion": "Review service staffing.",
    }
    result = normalize_baseline_report(raw, request)
    assert result["problems"] == [
        {"text": "Service was slow.", "citations": [{"id": "a", "quote": "Service was slow."}]}
    ]
    assert result["suggested_actions"][0]["citations"] == [
        {"id": "a", "quote": "Service was slow."}
    ]
    raw["problem_quote"] = "Invented unrelated issue"
    with pytest.raises(ValueError):
        normalize_baseline_report(raw, request)


def test_summary_cannot_cite_another_request_or_rewrite_quotation():
    request = REQUESTS["summaries"](texts=[{"id": "a", "text": "Food is excellent"}], locale="en")
    valid = {
        "items": [
            {"text": "Food is excellent", "citations": [{"id": "a", "quote": "Food is excellent"}]}
        ]
    }
    assert validate_result("summaries", valid, request) == valid
    for invalid in [
        {
            "items": [
                {
                    "text": "Food is excellent",
                    "citations": [{"id": "foreign", "quote": "Food is excellent"}],
                }
            ]
        },
        {
            "items": [
                {
                    "text": "Everything is perfect",
                    "citations": [{"id": "a", "quote": "Food is excellent"}],
                }
            ]
        },
    ]:
        with pytest.raises(ValueError):
            validate_result("summaries", invalid, request)


def test_abstention_cannot_include_claims_and_survey_duplicates_are_normalized():
    request = REQUESTS["answers"](
        texts=[{"id": "a", "text": "Good food"}], locale="en", question="What was the revenue?"
    )
    with pytest.raises(ValueError):
        validate_result(
            "answers",
            {
                "status": "insufficient_evidence",
                "items": [{"text": "Good food", "citations": [{"id": "a", "quote": "Good food"}]}],
            },
            request,
        )
    survey = REQUESTS["survey-suggestions"](
        industry="Cafe", objective="Improve service", locale="en"
    )
    with pytest.raises(ValueError):
        validate_result(
            "survey-suggestions",
            {
                "questions": [
                    {"text": " Same  question " if i % 2 else "Same question", "type": "text"}
                    for i in range(5)
                ]
            },
            survey,
        )


def test_generated_questions_must_use_requested_language():
    request = REQUESTS["survey-suggestions"](industry="مطعم", objective="الخدمة", locale="ar")
    with pytest.raises(ValueError):
        validate_result(
            "survey-suggestions",
            {
                "questions": [
                    {"text": f"How was the food choice {i}?", "type": "text"} for i in range(5)
                ]
            },
            request,
        )
