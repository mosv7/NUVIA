"""Explicit CLI: dry run by default, then run, review and promote separately."""

import argparse
import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from app.core.settings import Settings, root_directory
from app.evaluation.summaries import compare, promote


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    run = sub.add_parser("compare")
    run.add_argument(
        "--dataset",
        type=Path,
        default=Path(__file__).parents[1] / "tests/fixtures/summary-comparison.json",
    )
    run.add_argument("--providers", default="qwen,gemini,groq,ollama")
    run.add_argument("--output", type=Path)
    run.add_argument(
        "--run",
        action="store_true",
        help="Actually send these dataset texts to configured providers",
    )
    approve = sub.add_parser("promote")
    approve.add_argument("--results", type=Path, required=True)
    approve.add_argument("--review", type=Path, required=True)
    approve.add_argument("--provider", choices=("gemini", "groq", "ollama"), required=True)
    args = parser.parse_args()
    settings = Settings.load()
    try:
        if args.command == "compare":
            dataset = json.loads(args.dataset.read_text(encoding="utf-8"))
            stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
            output = args.output or root_directory() / ".local/summary-comparison" / (
                stamp + "-" + uuid4().hex[:8]
            )
            result = asyncio.run(
                compare(settings, dataset, args.providers.split(","), output, run=args.run)
            )
            print(
                json.dumps(
                    {
                        "executed": result["executed"],
                        "results": str(output / "results.json"),
                        "configuration": result["configuration"],
                        "successful": sum(r["status"] == "ok" for r in result["rows"]),
                    }
                )
            )
        else:
            result = json.loads(args.results.read_text(encoding="utf-8"))
            review = json.loads(args.review.read_text(encoding="utf-8"))
            record = promote(settings, result, review, args.provider)
            print(
                json.dumps(
                    {
                        "accepted_profile": record["profile"],
                        "provider": args.provider,
                        "selection_changed": False,
                    }
                )
            )
    except (ValueError, KeyError, TypeError, OSError):
        parser.exit(
            1,
            "Comparison/promotion failed: check configuration, files "
            "and documented review requirements.\n",
        )


if __name__ == "__main__":
    main()
