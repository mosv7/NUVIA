"""Explicit CLI: dry run by default, then run, review and promote separately."""

import argparse
import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from app.core.settings import Settings, root_directory
from app.evaluation.comparison_runner import ComparisonPolicy
from app.evaluation.summaries import compare, promote


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    run = sub.add_parser("compare")
    run.add_argument(
        "--dataset",
        type=Path,
        default=None,
    )
    run.add_argument("--providers", default=None)
    run.add_argument("--output", type=Path)
    run.add_argument("--resume", type=Path, help="Resume this run directory; also requires --run")
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
    try:
        settings = Settings.load()
        if args.command == "compare":
            if args.resume and (not args.run or args.output):
                raise ValueError("Resume requires --run and cannot be combined with --output")
            saved = (
                json.loads((args.resume / "results.json").read_text(encoding="utf-8"))
                if args.resume
                else None
            )
            dataset_path = (
                args.dataset or Path(__file__).parents[1] / "tests/fixtures/summary-comparison.json"
            )
            dataset = (
                saved["dataset"]
                if saved and not args.dataset
                else json.loads(dataset_path.read_text(encoding="utf-8"))
            )
            providers = (
                args.providers.split(",")
                if args.providers
                else (saved["providers"] if saved else ["qwen", "gemini", "groq", "ollama"])
            )
            stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
            output = (
                args.resume
                or args.output
                or root_directory() / ".local/summary-comparison" / (stamp + "-" + uuid4().hex[:8])
            )
            result = asyncio.run(
                compare(
                    settings,
                    dataset,
                    providers,
                    output,
                    run=args.run,
                    resume=bool(args.resume),
                    policy=ComparisonPolicy.load(),
                    progress=lambda event: print(json.dumps(event), flush=True),
                )
            )
            print(
                json.dumps(
                    {
                        "executed": result["executed"],
                        "state": result["state"],
                        "results": str(output / "results.json"),
                        "configuration": result["configuration"],
                        "successful": sum(r["status"] == "ok" for r in result["rows"]),
                    }
                )
            )
            if result["state"] == "pending":
                parser.exit(3, "Comparison checkpoint saved; resume after provider cooldown.\n")
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
