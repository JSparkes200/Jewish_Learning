# Railway: LightRAG retrieve API

The Next.js app (e.g. on Vercel) can call a small Python service for LightRAG retrieval instead of running `scripts/query_lightrag.py` on the serverless host.

## What you deploy

- **Docker image** built from the **repository root** using `services/lightrag-api/Dockerfile`.
- **Persistent disk** (Railway Volume) mounted at **`/data`**, with a populated **`/data/knowledge_store`** (same layout as local `knowledge_store/` after `ingest.py`).

## One-time: build the store

On a machine with Python 3.12, OpenAI quota, and exported knowledge:

1. `npm run export:knowledge` (from `web/`) → `knowledge/exported/`
2. `py -3.12 scripts/ingest.py` (from repo root) → `knowledge_store/`

Copy that `knowledge_store` directory onto the Railway volume (one-off upload, rsync, or a temporary “ingest” job — whatever fits your workflow).

## Railway project steps

1. [Railway](https://railway.app) → **New project** → **Deploy from GitHub** → select this repo.
2. **Important:** Railway does **not** upload or “fill” your GitHub repo. Your code lives in GitHub; Railway **clones** it on each deploy. You must **push commits** to the branch Railway watches (usually `main`).
3. If the GitHub connection shows **no repos** or **no deployments**, open [GitHub → Settings → Applications](https://github.com/settings/installations) → **Railway** → **Configure**, and ensure this repository is **allowed** (not “Only select repositories” with the wrong list).
4. The repo includes **`railway.toml`** at the **root** so the service uses **`services/lightrag-api/Dockerfile`** and build context stays the monorepo root. In the service **Settings**, leave **Root directory** empty or **`/`** (not `web/`).
5. If you ever override config in the dashboard: **Dockerfile path** = `services/lightrag-api/Dockerfile`, **root** = repository root.
6. **Variables** (service → Variables):
   - `OPENAI_API_KEY` — required for embeddings at query time.
   - `LIGHTRAG_RETRIEVE_SECRET` — long random string; required for production so random callers cannot burn your key.
   - `LIGHTRAG_QUERY_MODE` — optional (default `naive`).
   - `KNOWLEDGE_STORE_PATH` — optional; default **`/data/knowledge_store`** (use the volume path).
7. **Volumes:** create a volume, mount it at **`/data`**, ensure `knowledge_store` exists under it after ingest.
8. **Generate domain** (or attach your own). Your public base URL should look like `https://….up.railway.app`.

## Vercel (or any Next host)

Set:

- `RABBI_LIGHTRAG_RETRIEVE_URL` = Railway base URL (no trailing slash, no `/retrieve`).
- `RABBI_LIGHTRAG_RETRIEVE_SECRET` = same value as `LIGHTRAG_RETRIEVE_SECRET`.

Do **not** set `RABBI_USE_LIGHTRAG=0` if you want retrieval.

## HTTP contract

- `GET /health` — `{ ok, store_exists, store_path }`.
- `POST /retrieve` — JSON `{ "query": "…", "mode": "naive" }` (mode optional).
- Header **`X-Lightrag-Retrieve-Secret`**: required when `LIGHTRAG_RETRIEVE_SECRET` is set on the service.

Response shape matches the local script: `ok`, `context`, `error`, etc.

## Local Docker smoke test

From the **repo root**:

```bash
docker build -f services/lightrag-api/Dockerfile -t lightrag-api .
docker run --rm -e OPENAI_API_KEY=sk-... -e PORT=8080 -p 8080:8080 -v "%CD%\knowledge_store:/data/knowledge_store:ro" lightrag-api
```

Then `GET http://localhost:8080/health` (PowerShell: `irm http://localhost:8080/health`).
