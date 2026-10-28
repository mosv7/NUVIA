import hashlib
import json

import pytest

from app.models.artifacts import read_manifest


def test_v5_extra_special_tokens_keep_the_same_ids_in_v4_loader(tmp_path):
    from app.models.artifacts import tokenizer_compat_options

    (tmp_path / "tokenizer_config.json").write_text(
        json.dumps({"extra_special_tokens": ["[CLS]", "[SEP]"]})
    )
    assert tokenizer_compat_options(tmp_path) == {
        "extra_special_tokens": {},
        "additional_special_tokens": ["[CLS]", "[SEP]"],
    }


def test_package_hash_and_path_validation(tmp_path):
    (tmp_path / "model.safetensors").write_bytes(b"fixture")
    manifest = {
        "version": 1,
        "alias": "fixture",
        "adapter": "generation",
        "files": {"model.safetensors": hashlib.sha256(b"fixture").hexdigest()},
        "input_format": None,
    }
    path = tmp_path / "manifest.json"
    path.write_text(json.dumps(manifest))
    assert read_manifest(path)["alias"] == "fixture"
    (tmp_path / "model.safetensors").write_bytes(b"changed")
    with pytest.raises(ValueError):
        read_manifest(path)
    manifest["files"] = {"../model.safetensors": "0" * 64}
    path.write_text(json.dumps(manifest))
    with pytest.raises(ValueError):
        read_manifest(path)


def test_shard_index_cannot_load_undeclared_external_weights(tmp_path):
    index = tmp_path / "model.safetensors.index.json"
    index.write_text(json.dumps({"weight_map": {"layer": "../other/model.safetensors"}}))
    data = {
        "version": 1,
        "alias": "test",
        "adapter": "generation",
        "input_format": None,
        "files": {index.name: hashlib.sha256(index.read_bytes()).hexdigest()},
    }
    path = tmp_path / "manifest.json"
    path.write_text(json.dumps(data))
    with pytest.raises(ValueError):
        read_manifest(path)
