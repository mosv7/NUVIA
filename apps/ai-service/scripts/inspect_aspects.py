"""Diagnostic hypotheses only: these outputs do not verify the training input convention."""

import argparse
import json
import os
import time
from pathlib import Path

os.environ.update(USE_TF="0", USE_FLAX="0", HF_HUB_OFFLINE="1", TRANSFORMERS_OFFLINE="1")

from app.models.artifacts import read_manifest  # noqa: E402
from app.models.transformers_adapter import TransformersRuntime  # noqa: E402
from app.pipelines.aspects import extract_spans  # noqa: E402


def inspect(root, output):
    root = Path(root).resolve()
    manifests = {k: read_manifest(root / k / "manifest.json") for k in ("aspect", "polarity")}
    specs = {
        k: {"path": str(root / k / "manifest.json"), "fingerprint": v["fingerprint"]}
        for k, v in manifests.items()
    }
    runtime = TransformersRuntime(
        specs, {"device": "cpu", "max_tokens": 4096, "output_tokens": 768, "threshold": 0.7}
    )
    fixtures = json.loads(
        (Path(__file__).resolve().parents[1] / "tests/fixtures/ai-smoke.json").read_text(
            encoding="utf-8"
        )
    )
    records = []
    for case in fixtures["analysis_diagnostics"]:
        started = time.monotonic()
        tokenizer, model, _ = runtime.load("aspect")
        encoded = runtime.encode(tokenizer, case["text"], offsets=True)
        offsets = encoded.pop("offset_mapping")[0].tolist()
        with runtime.torch.inference_mode():
            scores, labels = model(**encoded).logits[0].softmax(-1).max(-1)
        spans = extract_spans(
            case["text"],
            [model.config.id2label[i] for i in labels.tolist()],
            offsets,
            scores.tolist(),
        )
        tok, pol, _ = runtime.load("polarity")
        hypotheses = []
        for expected in case["aspects"]:
            for order, a, b in [
                ("review_aspect_pair_v1", case["text"], expected["text"]),
                ("aspect_review_pair_hypothesis", expected["text"], case["text"]),
            ]:
                encoded = runtime.encode(tok, a, pair=b)
                with runtime.torch.inference_mode():
                    score, label = pol(**encoded).logits[0].softmax(-1).max(-1)
                hypotheses.append(
                    {
                        "aspect": expected["text"],
                        "format_hypothesis": order,
                        "expected": expected["sentiment"],
                        "predicted": pol.config.id2label[int(label)].lower(),
                        "score": float(score),
                    }
                )
        records.append(
            {
                "text": case["text"],
                "extracted_spans": spans,
                "pair_hypotheses": hypotheses,
                "seconds": time.monotonic() - started,
            }
        )
    Path(output).write_text(
        json.dumps(
            {
                "diagnostic_only": True,
                "reason": "training_input_convention_not_established",
                "artifacts": {k: m["fingerprint"] for k, m in manifests.items()},
                "records": records,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print("DeBERTa diagnostics saved; not an acceptance decision.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model-root", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    inspect(args.model_root, args.output)
