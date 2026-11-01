"""Local-only, hash-checked model packages; never execute downloaded Python."""

import hashlib
import json
from pathlib import Path
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field

POLARITY_FORMATS = frozenset({"review_aspect_pair_v1", "aspect_review_pair_v1"})


class ModelManifest(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    version: Literal[1]
    alias: Annotated[str, Field(pattern=r"^[A-Za-z0-9_.-]{1,100}$")]
    adapter: Literal["generation", "aspect", "polarity"]
    files: Annotated[
        dict[str, Annotated[str, Field(pattern=r"^[a-f0-9]{64}$")]],
        Field(min_length=1, max_length=1000),
    ]
    input_format: Literal["review_aspect_pair_v1", "aspect_review_pair_v1"] | None


def tokenizer_compat_options(directory):
    config = json.loads((Path(directory) / "tokenizer_config.json").read_text(encoding="utf-8"))
    extra = config.get("extra_special_tokens")
    if isinstance(extra, list):
        if not all(isinstance(token, str) for token in extra):
            raise ValueError("Unsupported special token configuration")
        return {"extra_special_tokens": {}, "additional_special_tokens": extra}
    return {}


def fingerprint(manifest):
    identity = {k: manifest[k] for k in ("alias", "adapter", "files", "input_format")}
    return hashlib.sha256(json.dumps(identity, sort_keys=True).encode()).hexdigest()


def read_manifest(path):
    path = Path(path).resolve()
    if path.stat().st_size > 1048576:
        raise ValueError("Model manifest too large")
    data = ModelManifest.model_validate_json(path.read_text(encoding="utf-8")).model_dump()
    for name, expected in data["files"].items():
        file = (path.parent / name).resolve()
        if (
            not file.is_relative_to(path.parent)
            or Path(name).is_absolute()
            or file.suffix not in (".json", ".txt", ".safetensors")
            or not file.is_file()
        ):
            raise ValueError("Unsafe model artifact")
        with file.open("rb") as stream:
            digest = hashlib.file_digest(stream, "sha256").hexdigest()
        if digest != expected:
            raise ValueError("Model artifact hash mismatch")
        if name.endswith(".safetensors.index.json"):
            index = json.loads(file.read_text(encoding="utf-8"))
            shards = index.get("weight_map") if isinstance(index, dict) else None
            if (
                not isinstance(shards, dict)
                or not shards
                or any(
                    not isinstance(shard, str)
                    or shard not in data["files"]
                    or not shard.endswith(".safetensors")
                    for shard in shards.values()
                )
            ):
                raise ValueError("Undeclared model shard")
    # All loader inputs must be declared; undeclared tokenizer/config/weight files are forbidden.
    for file in path.parent.iterdir():
        if file.name == path.name:
            continue
        if file.suffix in (".json", ".txt", ".safetensors") and file.name not in data["files"]:
            raise ValueError("Undeclared model input")
    data["fingerprint"] = fingerprint(data)
    data["directory"] = str(path.parent)
    return data
