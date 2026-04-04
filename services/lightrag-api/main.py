"""
HTTP API for LightRAG retrieval (Railway / Docker).

POST /retrieve  JSON { "query": "...", "mode": "naive" (optional) }
Optional env LIGHTRAG_RETRIEVE_SECRET: require header X-Lightrag-Retrieve-Secret.
Env KNOWLEDGE_STORE_PATH: LightRAG working dir (default /data/knowledge_store).
"""

from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

from lightrag_query_core import run_async

app = FastAPI(title="LightRAG retrieve", version="1.0.0")


def store_path() -> Path:
    return Path(os.environ.get("KNOWLEDGE_STORE_PATH", "/data/knowledge_store"))


class RetrieveBody(BaseModel):
    query: str = Field(..., min_length=1, max_length=8000)
    mode: str | None = None


@app.get("/health")
def health() -> dict:
    d = store_path()
    return {"ok": True, "store_exists": d.is_dir(), "store_path": str(d)}


@app.post("/retrieve")
async def retrieve(
    body: RetrieveBody,
    x_lightrag_retrieve_secret: str | None = Header(default=None, alias="X-Lightrag-Retrieve-Secret"),
) -> dict:
    secret = os.environ.get("LIGHTRAG_RETRIEVE_SECRET", "").strip()
    if secret and (not x_lightrag_retrieve_secret or x_lightrag_retrieve_secret != secret):
        raise HTTPException(status_code=401, detail="unauthorized")

    wd = store_path()
    if not wd.is_dir():
        return {"ok": False, "error": "working_dir_missing", "context": "", "hint": str(wd)}

    mode = (body.mode or os.environ.get("LIGHTRAG_QUERY_MODE", "naive")).strip()
    allowed = {"local", "global", "hybrid", "naive", "mix", "bypass"}
    if mode not in allowed:
        raise HTTPException(status_code=400, detail=f"invalid mode, use one of {sorted(allowed)}")

    result = await run_async(body.query, wd, mode)
    return {k: v for k, v in result.items() if v is not None}
