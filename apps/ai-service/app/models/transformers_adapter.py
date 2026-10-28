"""Replaceable offline Transformers adapters; imports stay inside the model worker."""

import json

from app.models.artifacts import read_manifest, tokenizer_compat_options
from app.pipelines.aspects import analysis_result, extract_spans


class TransformersRuntime:
    def __init__(self, manifests, settings):
        import torch

        self.torch = torch
        self.settings = settings
        self.manifests = {k: read_manifest(v["path"]) for k, v in manifests.items()}
        if any(self.manifests[k]["fingerprint"] != v["fingerprint"] for k, v in manifests.items()):
            raise ValueError("Model changed since readiness assessment")
        self.loaded = {}
        torch.set_num_threads(4)

    def load(self, name):
        if name not in self.loaded:
            from transformers import (
                AutoModelForCausalLM,
                AutoModelForSequenceClassification,
                AutoModelForTokenClassification,
                AutoTokenizer,
            )

            manifest = self.manifests[name]
            classes = {
                "generation": AutoModelForCausalLM,
                "aspect": AutoModelForTokenClassification,
                "polarity": AutoModelForSequenceClassification,
            }
            # Keep DeBERTa on CPU so Qwen does not compete for the 4 GB device.
            device = self.settings["device"] if name == "generation" else "cpu"
            tokenizer = AutoTokenizer.from_pretrained(
                manifest["directory"],
                local_files_only=True,
                trust_remote_code=False,
                use_fast=True,
                **tokenizer_compat_options(manifest["directory"]),
            )
            from pathlib import Path

            from tokenizers import Tokenizer

            serialized = Tokenizer.from_file(str(Path(manifest["directory"]) / "tokenizer.json"))
            if serialized.get_vocab() != tokenizer.backend_tokenizer.get_vocab():
                raise ValueError("Tokenizer compatibility changed vocabulary IDs")
            model = (
                classes[name]
                .from_pretrained(
                    manifest["directory"],
                    local_files_only=True,
                    trust_remote_code=False,
                    use_safetensors=True,
                    torch_dtype=self.torch.float16 if device == "cuda" else self.torch.float32,
                )
                .to(device)
                .eval()
            )
            if name == "aspect" and set(model.config.id2label.values()) != {"O", "B", "I"}:
                raise ValueError("Invalid aspect label map")
            if name == "polarity" and {v.lower() for v in model.config.id2label.values()} != {
                "positive",
                "negative",
                "neutral",
            }:
                raise ValueError("Invalid polarity label map")
            self.loaded[name] = tokenizer, model, device
        return self.loaded[name]

    def encode(self, tokenizer, text, *, pair=None, limit=512, offsets=False):
        encoded = tokenizer(
            text,
            text_pair=pair,
            return_tensors="pt",
            truncation=False,
            return_offsets_mapping=offsets,
        )
        if encoded["input_ids"].shape[-1] > limit:
            raise ValueError("input_too_large")
        return encoded

    def generate(self, system, payload):
        tokenizer, model, device = self.load("generation")
        prompt = tokenizer.apply_chat_template(
            [
                {"role": "system", "content": system},
                {"role": "user", "content": json.dumps(payload, ensure_ascii=False)},
            ],
            tokenize=False,
            add_generation_prompt=True,
        )
        encoded = self.encode(tokenizer, prompt, limit=self.settings["max_tokens"])
        encoded = {k: v.to(device) for k, v in encoded.items()}
        with self.torch.inference_mode():
            output = model.generate(
                **encoded,
                do_sample=False,
                max_new_tokens=self.settings["output_tokens"],
                pad_token_id=tokenizer.eos_token_id,
            )
        generated = output[0, encoded["input_ids"].shape[-1] :]
        if (
            len(generated) == self.settings["output_tokens"]
            and generated[-1] != tokenizer.eos_token_id
        ):
            raise ValueError("invalid_model_output")
        return tokenizer.decode(generated, skip_special_tokens=True)

    def analyze(self, payload):
        if self.manifests["polarity"]["input_format"] != "review_aspect_pair_v1":
            raise ValueError("unverified_input_format")
        tokenizer, model, _ = self.load("aspect")
        polarity_tokenizer, polarity_model, _ = self.load("polarity")
        results = []
        for evidence in payload["texts"]:
            text = evidence["text"]
            encoded = self.encode(tokenizer, text, offsets=True)
            offsets = encoded.pop("offset_mapping")[0].tolist()
            with self.torch.inference_mode():
                probabilities = model(**encoded).logits[0].softmax(-1)
            scores, indices = probabilities.max(-1)
            spans = extract_spans(
                text, [model.config.id2label[i] for i in indices.tolist()], offsets, scores.tolist()
            )
            if len(spans) > 100:
                raise ValueError("input_too_large")
            mentions = []
            for index, span in enumerate(spans):
                encoded = self.encode(polarity_tokenizer, text, pair=span["text"])
                with self.torch.inference_mode():
                    probabilities = polarity_model(**encoded).logits[0].softmax(-1)
                score, label = probabilities.max(-1)
                score = float(score)
                mentions.append(
                    {
                        **span,
                        "id": f"m{index}",
                        "sentiment": polarity_model.config.id2label[int(label)].lower(),
                        "score": score,
                        "accepted": min(score, span["extraction_score"])
                        >= self.settings["threshold"],
                    }
                )
            results.append(analysis_result(evidence["id"], mentions))
        return {"items": results}
