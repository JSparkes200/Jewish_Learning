"""
LightRAG retrieval-only helper: returns compact text context for the Rabbi LLM.

Uses the same `knowledge_store` and OpenAI embeddings as `ingest.py`.
Does not run the graph LLM inside LightRAG; only `aquery_data` (retrieval).

Usage (repo root):
  py -3.12 scripts/query_lightrag.py --query "שלום Hebrew greeting"
  py -3.12 scripts/query_lightrag.py --query "..." --mode naive --json

Env: OPENAI_API_KEY (and optional repo-root `.env` / `web/.env.local` via load_env).
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

from lightrag_query_core import run_async

REPO_ROOT = Path(__file__).resolve().parent.parent


def load_env() -> None:
    load_dotenv(REPO_ROOT / ".env", override=False)
    load_dotenv(REPO_ROOT / "web" / ".env.local", override=False)


def _ensure_utf8_stdio() -> None:
    """Avoid UnicodeEncodeError on Windows when JSON/context contains Hebrew."""
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            try:
                stream.reconfigure(encoding="utf-8")
            except (OSError, ValueError, AttributeError):
                pass


def main() -> None:
    load_env()
    _ensure_utf8_stdio()
    p = argparse.ArgumentParser(description="LightRAG retrieval for Rabbi / tooling")
    p.add_argument("--query", "-q", required=True, help="Search query (include Hebrew as needed)")
    p.add_argument(
        "--working-dir",
        type=Path,
        default=REPO_ROOT / "knowledge_store",
        help="LightRAG working directory (default: ./knowledge_store)",
    )
    p.add_argument(
        "--mode",
        default=os.environ.get("LIGHTRAG_QUERY_MODE", "naive"),
        choices=["local", "global", "hybrid", "naive", "mix", "bypass"],
        help="Retrieval mode (default: naive — vector chunks; use mix when graph is populated)",
    )
    p.add_argument("--json", action="store_true", help="Print JSON to stdout")
    args = p.parse_args()

    if not args.working_dir.is_dir():
        err = {
            "ok": False,
            "error": "working_dir_missing",
            "context": "",
            "hint": str(args.working_dir),
        }
        print(json.dumps(err, ensure_ascii=False))
        sys.exit(2)

    result = asyncio.run(run_async(args.query, args.working_dir, args.mode))

    if args.json:
        out = {k: v for k, v in result.items() if v is not None}
        print(json.dumps(out, ensure_ascii=False, default=str))
        return

    if result.get("ok"):
        print(result.get("context") or "(empty context)")
    else:
        print(result.get("error", "error"), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
