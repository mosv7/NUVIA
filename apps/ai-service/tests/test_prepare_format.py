import json
import zipfile

from scripts.prepare_models import prepare


def test_preparation_records_confirmed_order_only_for_polarity(tmp_path):
    source = tmp_path / "qwen"
    source.mkdir()
    (source / "model.safetensors").write_bytes(b"fixture")
    archive = tmp_path / "bert.zip"
    with zipfile.ZipFile(archive, "w") as output:
        output.writestr("aspect_extractor_mdeberta_v2/model.safetensors", b"aspect")
        output.writestr("deberta_absa_finetuned_v2/model.safetensors", b"polarity")
    target = tmp_path / "models"
    prepare(source, archive, target, polarity_input_format="aspect_review_pair_v1")
    assert json.loads((target / "polarity/manifest.json").read_text())["input_format"] == (
        "aspect_review_pair_v1"
    )
    assert json.loads((target / "aspect/manifest.json").read_text())["input_format"] is None
