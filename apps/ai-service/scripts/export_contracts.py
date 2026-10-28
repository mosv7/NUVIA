"""Export the canonical Python wire schemas for Node validation and API consumers."""

import json
from pathlib import Path

from app.main import app
from app.schemas.ai import REQUESTS, RESPONSES, Capabilities

root = Path(__file__).resolve().parents[3]
contracts = {
    "requests": {name: model.model_json_schema() for name, model in REQUESTS.items()},
    "responses": {name: model.model_json_schema() for name, model in RESPONSES.items()},
    "capabilities": Capabilities.model_json_schema(),
}
(root / "backend/src/integrations/ai-service").mkdir(parents=True, exist_ok=True)
(root / "backend/src/integrations/ai-service/contracts.json").write_text(
    json.dumps(contracts, indent=2) + "\n", encoding="utf-8"
)
(root / "docs/api/ai-openapi.json").write_text(json.dumps(app.openapi(), indent=2) + "\n")
print("Canonical AI schemas exported.")
