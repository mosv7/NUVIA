"""Exact source spans and deterministic, per-review sentiment derivation."""


def derive_sentiment(mentions):
    labels = {m["sentiment"] for m in mentions if m["accepted"]}
    if {"positive", "negative"} <= labels:
        return "mixed"
    for label in ("positive", "negative", "neutral"):
        if label in labels:
            return label
    return None


def extract_spans(text, labels, offsets, scores):
    spans = []
    current = None
    for label, (start, end), score in zip(labels, offsets, scores, strict=True):
        if not 0 <= start <= end <= len(text):
            raise ValueError("Invalid tokenizer offset")
        if start == end:
            continue
        if label not in ("O", "B", "I"):
            raise ValueError("Unknown BIO label")
        if label == "O":
            current = None
            continue
        if label == "B" or current is None:
            current = {"start": start, "end": end, "extraction_score": float(score)}
            spans.append(current)
        else:
            current["end"] = end
            current["extraction_score"] = min(current["extraction_score"], float(score))
        current["text"] = text[current["start"] : current["end"]]
    return spans


def analysis_result(evidence_id, mentions):
    sentiment = derive_sentiment(mentions)
    return {
        "id": evidence_id,
        "sentiment": sentiment,
        "reason": None if sentiment else "insufficient_evidence",
        "method": "aspect_derived",
        "coverage": "partial_aspects",
        "mentions": mentions,
        "contributing_ids": [m["id"] for m in mentions if m["accepted"]],
        "excluded_count": sum(not m["accepted"] for m in mentions),
    }
