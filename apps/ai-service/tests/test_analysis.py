import pytest

from app.pipelines.aspects import derive_sentiment, extract_spans
from app.schemas.ai import AnalyzeRequest


@pytest.mark.parametrize(
    "labels,want",
    [
        ([], None),
        (["neutral"], "neutral"),
        (["positive", "neutral"], "positive"),
        (["negative"], "negative"),
        (["positive", "negative"], "mixed"),
    ],
)
def test_overall_uses_only_accepted_mentions(labels, want):
    mentions = [{"sentiment": label, "accepted": True} for label in labels]
    mentions.append({"sentiment": "negative", "accepted": False})
    assert derive_sentiment(mentions) == want


def test_original_arabic_offsets_and_separate_mentions():
    text = "🍕 الأكل رائع والخدمة سيئة"
    spans = extract_spans(
        text,
        ["O", "B", "I", "O", "B"],
        [(0, 1), (2, 5), (5, 7), (8, 12), (13, 20)],
        [1, 0.9, 0.8, 1, 0.95],
    )
    assert [(s["start"], s["end"], s["text"]) for s in spans] == [
        (2, 7, text[2:7]),
        (13, 20, text[13:20]),
    ]
    assert spans[0]["extraction_score"] == 0.8


def test_unknown_fields_duplicates_and_blank_text_are_rejected():
    for value in [
        {"texts": [{"id": "a", "text": " "}]},
        {"texts": [{"id": "a", "text": "ok"}, {"id": "a", "text": "other"}]},
        {"texts": [{"id": "a", "text": "ok"}], "businessId": "foreign"},
    ]:
        with pytest.raises(ValueError):
            AnalyzeRequest.model_validate(value)


def test_survey_objective_must_not_be_whitespace():
    from app.schemas.ai import SurveyRequest

    with pytest.raises(ValueError):
        SurveyRequest(industry="restaurant", objective="   ", locale="en")
