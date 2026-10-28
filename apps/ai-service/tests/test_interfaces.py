import pytest

from app.schemas.ai import REQUESTS
from app.services.interfaces import validate_result


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
