import hashlib
import json

import pytest

from app.models.artifacts import read_manifest


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
