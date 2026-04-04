"""
Shared LightRAG retrieval logic for `query_lightrag.py` and the Railway FastAPI service.
"""

from __future__ import annotations

import os
from pathlib import Path


def compact_context(result: dict) -> str:
    """Turn LightRAG aquery_data payload into a plain-text blob for the Rabbi prompt."""
    if result.get("status") != "success":
        return ""
    data = result.get("data") or {}
    parts: list[str] = []

    for c in data.get("chunks") or []:
        content = (c.get("content") or "").strip()
        fp = c.get("file_path") or ""
        if content:
            parts.append(f"[{fp}]\n{content}" if fp else content)

    for e in data.get("entities") or []:
        name = e.get("entity_name") or ""
        desc = (e.get("description") or "").strip()
        if name or desc:
            line = f"Entity: {name}"
            if desc:
                line += f" — {desc[:800]}"
            parts.append(line)

    for r in data.get("relationships") or []:
        src = r.get("src_id") or ""
        tgt = r.get("tgt_id") or ""
        desc = (r.get("description") or "").strip()
        if src and tgt:
            parts.append(f"Relation: {src} → {tgt}" + (f" — {desc[:400]}" if desc else ""))

    text = "\n\n---\n\n".join(parts)
    max_chars = int(os.environ.get("LIGHTRAG_QUERY_MAX_CHARS", "24000"))
    if len(text) > max_chars:
        text = text[:max_chars] + "\n\n[…truncated…]"
    return text


async def run_async(query: str, working_dir: Path, mode: str) -> dict:
    if not os.environ.get("OPENAI_API_KEY"):
        return {"ok": False, "error": "missing_openai_key", "context": ""}

    from lightrag import LightRAG
    from lightrag.base import QueryParam
    from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed

    rag = LightRAG(
        working_dir=str(working_dir),
        embedding_func=openai_embed,
        llm_model_func=gpt_4o_mini_complete,
    )
    await rag.initialize_storages()
    try:
        param = QueryParam(mode=mode)  # type: ignore[arg-type]
        raw = await rag.aquery_data(query.strip(), param)
    finally:
        await rag.finalize_storages()

    ctx = compact_context(raw if isinstance(raw, dict) else {})
    return {
        "ok": True,
        "context": ctx,
        "status": raw.get("status") if isinstance(raw, dict) else "unknown",
        "message": raw.get("message") if isinstance(raw, dict) else "",
        "raw": raw if os.environ.get("LIGHTRAG_QUERY_VERBOSE") == "1" else None,
    }
