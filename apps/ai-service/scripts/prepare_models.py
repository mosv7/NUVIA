"""Prepare supplied local files only; never download or unpickle training artifacts."""

import argparse
import hashlib
import json
import os
import shutil
import zipfile
from pathlib import Path


def manifest(directory, alias, adapter, input_format=None):
    files = {}
    for file in sorted(directory.iterdir()):
        if file.name != "manifest.json" and file.suffix in (".json", ".txt", ".safetensors"):
            with file.open("rb") as stream:
                files[file.name] = hashlib.file_digest(stream, "sha256").hexdigest()
    result = {
        "version": 1,
        "alias": alias,
        "adapter": adapter,
        "input_format": input_format,
        "files": files,
    }
    (directory / "manifest.json").write_text(json.dumps(result, indent=2) + "\n")


def prepare(qwen_source, bert_zip, destination, *, polarity_input_format=None):
    if polarity_input_format not in (None, "aspect_review_pair_v1", "review_aspect_pair_v1"):
        raise ValueError("Unsupported polarity input format")
    destination = Path(destination).resolve()
    destination.mkdir(parents=True, exist_ok=True)
    generation = destination / "generation"
    generation.mkdir(exist_ok=True)
    for source in Path(qwen_source).iterdir():
        if source.suffix not in (".json", ".txt", ".safetensors") or source.name == "manifest.json":
            continue
        target = generation / source.name
        if target.exists():
            raise ValueError("Destination exists; use a fresh model root")
        try:
            os.link(source, target)
        except OSError:
            shutil.copyfile(source, target)
    manifest(generation, "qwen2.5-1.5b", "generation")
    mapping = {"aspect_extractor_mdeberta_v2": "aspect", "deberta_absa_finetuned_v2": "polarity"}
    with zipfile.ZipFile(bert_zip) as archive:
        for entry in archive.infolist():
            parts = Path(entry.filename).parts
            if (
                len(parts) != 2
                or parts[0] not in mapping
                or ".." in parts
                or Path(entry.filename).is_absolute()
            ):
                raise ValueError("Unsafe archive entry")
            if Path(parts[1]).suffix not in (".json", ".txt", ".safetensors"):
                continue
            folder = destination / mapping[parts[0]]
            folder.mkdir(exist_ok=True)
            target = folder / parts[1]
            if target.exists() or entry.file_size > 4 * 1024**3:
                raise ValueError("Unsafe archive destination or size")
            with archive.open(entry) as source, target.open("xb") as output:
                shutil.copyfileobj(source, output)
    for original, adapter in mapping.items():
        manifest(
            destination / adapter,
            original,
            adapter,
            polarity_input_format if adapter == "polarity" else None,
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--qwen-source", required=True)
    parser.add_argument("--bert-zip", required=True)
    parser.add_argument("--destination", required=True)
    parser.add_argument(
        "--polarity-input-format", choices=("aspect_review_pair_v1", "review_aspect_pair_v1")
    )
    args = parser.parse_args()
    prepare(
        args.qwen_source,
        args.bert_zip,
        args.destination,
        polarity_input_format=args.polarity_input_format,
    )
    print("Local model packages prepared; capabilities require assessment before activation.")
