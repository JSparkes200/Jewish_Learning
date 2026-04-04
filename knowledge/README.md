# Knowledge corpus for LightRAG

Plain **Markdown / text** for `scripts/ingest.py` lives under:

| Path | Role |
|------|------|
| **`exported/`** | **Generated** — do not edit by hand. Regenerate after curriculum changes. |
| **`manual/`** | Optional notes you add (`.md` / `.txt`). Committed; ingested with `exported/`. |

The canonical app content stays in **`web/data/*.ts`** and **`docs/`**.

## Commands

1. **Export** (from `web/`, chunks ~15 entries per file for LLM-friendly size):

   ```bash
   cd web
   npm run export:knowledge
   ```

2. **Ingest** (repo root, requires `OPENAI_API_KEY`):

   **`OPENAI_API_KEY`** is read from, in order: existing environment → repo-root **`.env`** → **`web/.env.local`** (same as Next.js).

   ```env
   OPENAI_API_KEY=sk-...your-key...
   ```

   Repo-root `.env.example` is a template; both `.env` and `web/.env.local` are gitignored for secrets.

   ```bash
   py -3.12 -m pip install -r scripts/requirements.txt
   py -3.12 scripts/ingest.py
   ```

   **Next.js** still uses **`web/.env.local`** for the app (see `web/.env.example`). You can use the same key in both places for local dev, or separate keys per surface.

`exported/` and `knowledge_store/` are **gitignored** by default so the repo stays small. Remove `knowledge/exported/` from `.gitignore` if you want to commit snapshots.

## What gets exported

- **`exported/docs/`** — copies of root `docs/*.md` and `docs/*.txt`
- **`exported/course/`** — overview, section index, primers, stories, MCQs, bridge
- **`exported/reading/`** — RD/JT passages, comprehension, reading hub
- **`exported/specialty/`** — track metadata + tier MCQ chunks
- **`exported/corpus/`** — `LEGACY_CORPUS_D` in 15-entry chunks
- **`exported/study/`**, **`exported/numbers-roots/`**, **`exported/library/`** — grammar drills, roots, Aleph 0–10 cardinals, numbers hub, library links
