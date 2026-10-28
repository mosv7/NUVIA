"""Local-only, hash-checked model packages; never execute downloaded Python."""

import hashlib
import json
from pathlib import Path


def fingerprint(manifest):
    identity = {k: manifest[k] for k in ("alias", "adapter", "files", "input_format")}
    return hashlib.sha256(json.dumps(identity, sort_keys=True).encode()).hexdigest()


def read_manifest(path):
    path = Path(path).resolve()
    data = json.loads(path.read_text(encoding="utf-8"))
    if (
        data.get("version") != 1
        or data.get("adapter") not in ("generation", "aspect", "polarity")
        or not data.get("files")
    ):
        raise ValueError("Invalid model manifest")
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
    # All loader inputs must be declared; undeclared tokenizer/config/weight files are forbidden.
    for file in path.parent.iterdir():
        if file.name == path.name:
            continue
        if file.suffix in (".json", ".txt", ".safetensors") and file.name not in data["files"]:
            raise ValueError("Undeclared model input")
    data["fingerprint"] = fingerprint(data)
    data["directory"] = str(path.parent)
    return data
