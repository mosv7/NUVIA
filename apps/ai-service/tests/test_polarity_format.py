from types import SimpleNamespace

import pytest

from app.models.transformers_adapter import TransformersRuntime


@pytest.mark.parametrize(
    "input_format,first,second",
    [
        ("aspect_review_pair_v1", "الخدمة", "الأكل ممتاز لكن الخدمة سيئة"),
        ("review_aspect_pair_v1", "الأكل ممتاز لكن الخدمة سيئة", "الخدمة"),
    ],
)
def test_polarity_tokenizer_receives_the_manifest_order(input_format, first, second):
    runtime = object.__new__(TransformersRuntime)
    runtime.manifests = {"polarity": {"input_format": input_format}}
    recorded = []

    def tokenizer(text, **kwargs):
        recorded.append((text, kwargs["text_pair"], kwargs["truncation"]))
        return {"input_ids": SimpleNamespace(shape=(1, 8))}

    runtime.encode_polarity(tokenizer, "الأكل ممتاز لكن الخدمة سيئة", "الخدمة")
    assert recorded == [(first, second, False)]


def test_unknown_polarity_order_stays_rejected():
    runtime = object.__new__(TransformersRuntime)
    runtime.manifests = {"polarity": {"input_format": None}}
    with pytest.raises(ValueError, match="unverified_input_format"):
        runtime.encode_polarity(None, "Good food", "food")
