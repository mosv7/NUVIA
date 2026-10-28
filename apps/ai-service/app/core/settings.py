"""Only AI settings, with root-relative development configuration."""

import os
from dataclasses import dataclass
from pathlib import Path


def root_directory():
    for parent in Path(__file__).resolve().parents:
        if (parent / "pnpm-workspace.yaml").exists():
            return parent
    return Path(__file__).resolve().parents[2]  # /service/app/core -> /service


@dataclass(frozen=True)
class Settings:
    token: str = ""
    model_root: str = ""
    timeout: float = 180
    device: str = "cpu"
    max_tokens: int = 4096
    output_tokens: int = 768
    threshold: float = 0.7
    baseline: bool = False

    @classmethod
    def load(cls):
        values = {}
        if os.environ.get("NODE_ENV") != "production":
            from dotenv import dotenv_values

            path = root_directory() / ".env"
            if path.exists():
                values = {k: v for k, v in dotenv_values(path).items() if k.startswith("AI_")}
        values.update({k: v for k, v in os.environ.items() if k.startswith("AI_")})
        timeout = float(values.get("AI_TASK_TIMEOUT_SECONDS", 180))
        max_tokens = int(values.get("AI_MAX_INPUT_TOKENS", 4096))
        output_tokens = int(values.get("AI_MAX_OUTPUT_TOKENS", 768))
        threshold = float(values.get("AI_SENTIMENT_THRESHOLD", 0.7))
        device = values.get("AI_DEVICE", "cpu")
        baseline = str(values.get("AI_BASELINE_MODE") or "false").strip().lower()
        if (
            not 1 <= timeout <= 600
            or not 256 <= max_tokens <= 8192
            or not 64 <= output_tokens <= 2048
            or not 0.5 <= threshold <= 1
            or device not in ("cpu", "cuda")
            or baseline not in ("true", "false")
        ):
            raise ValueError("Invalid AI limits")
        model_root = Path(values.get("AI_MODEL_ROOT") or root_directory() / ".local/models")
        if not model_root.is_absolute():
            model_root = root_directory() / model_root
        return cls(
            token=values.get("AI_SERVICE_TOKEN", ""),
            model_root=str(model_root),
            timeout=timeout,
            device=device,
            max_tokens=max_tokens,
            output_tokens=output_tokens,
            threshold=threshold,
            baseline=baseline == "true",
        )
