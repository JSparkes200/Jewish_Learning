# Scripts (repo root)

## LightRAG pipeline

1. **`ingest.py`** — Loads Markdown from `knowledge/exported/` and `knowledge/manual/` into `knowledge_store/` using OpenAI embeddings + `gpt-4o-mini` (see `requirements.txt`).
2. **Export** is implemented in the Next app: from `web/` run `npm run export:knowledge` (writes `knowledge/exported/`).

**API key:** `OPENAI_API_KEY` in repo-root `.env` and/or `web/.env.local` (both loaded; env wins).

**Smoke test** (few files, saves quota): PowerShell `$env:INGEST_MAX_DOCS='3'; py -3.12 scripts/ingest.py` — omit the variable for a full run (~550 files, many API calls).

## LightRAG query (retrieval only)

Prints compact context JSON for `/api/rabbi` or debugging:

```bash
py -3.12 scripts/query_lightrag.py --query "שלום greeting" --json
```

Optional: `--mode mix` (default in library is mix; script default is `naive` for empty-graph tolerance), `--working-dir path/to/knowledge_store`.

Install Python deps:

```bash
py -3.12 -m pip install -r scripts/requirements.txt
```
