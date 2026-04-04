"""
Ingest text/markdown files from ./knowledge into a LightRAG working directory.

Requires OPENAI_API_KEY (and optional .env in repo root). Uses OpenAI embeddings +
gpt-4o-mini for extraction/summaries per lightrag-hku defaults.

Install deps:
  py -3.12 -m pip install -r scripts/requirements.txt

Generate chunks first (from web/):
  cd web && npm run export:knowledge

Run from repository root:
  py -3.12 scripts/ingest.py
"""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent


def load_env() -> None:
    """Repo-root `.env` first, then `web/.env.local` (Next.js dev) — no override of real env."""
    load_dotenv(REPO_ROOT / ".env", override=False)
    load_dotenv(REPO_ROOT / "web" / ".env.local", override=False)
# Generated chunks (see `web` npm script `export:knowledge`) + optional hand-authored notes
KNOWLEDGE_DIRS = [
    REPO_ROOT / "knowledge" / "exported",
    REPO_ROOT / "knowledge" / "manual",
]
WORKING_DIR = REPO_ROOT / "knowledge_store"

TEXT_EXTENSIONS = {".txt", ".md", ".mdx"}


def load_text_files(folders: list[Path]) -> tuple[list[str], list[str]]:
    """Return (contents, file_paths_as_str) for each text file under all folders."""
    contents: list[str] = []
    paths: list[str] = []
    for folder in folders:
        if not folder.is_dir():
            continue
        for path in sorted(folder.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
                continue
            if path.name.startswith("."):
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except OSError as e:
                print(f"Skip {path}: {e}", file=sys.stderr)
                continue
            if not text.strip():
                continue
            contents.append(text)
            paths.append(str(path.relative_to(REPO_ROOT)))
    return contents, paths


async def main() -> None:
    load_env()
    if not os.environ.get("OPENAI_API_KEY"):
        print(
            "Missing OPENAI_API_KEY. Set it in repo-root `.env` or `web/.env.local`.",
            file=sys.stderr,
        )
        sys.exit(1)

    from lightrag import LightRAG
    from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed

    docs, file_paths = load_text_files(KNOWLEDGE_DIRS)
    max_docs = int(os.environ.get("INGEST_MAX_DOCS", "0") or "0")
    if max_docs > 0:
        docs = docs[:max_docs]
        file_paths = file_paths[:max_docs]
        print(f"INGEST_MAX_DOCS={max_docs} (partial run for testing)", flush=True)
    if not docs:
        print(
            "No .txt / .md / .mdx files under knowledge/exported or knowledge/manual.\n"
            "From the web app folder run: npm run export:knowledge",
            file=sys.stderr,
        )
        sys.exit(1)

    rag = LightRAG(
        working_dir=str(WORKING_DIR),
        embedding_func=openai_embed,
        llm_model_func=gpt_4o_mini_complete,
    )
    await rag.initialize_storages()
    try:
        await rag.ainsert(docs, file_paths=file_paths)
    finally:
        await rag.finalize_storages()

    print(f"Ingested {len(docs)} document(s) into {WORKING_DIR}.")


if __name__ == "__main__":
    asyncio.run(main())
