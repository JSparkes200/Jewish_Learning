# Hebrew content pipeline (authoring & validation)

This folder complements the Next app (`web/`):

- **`web/lib/hebrew-passage-pipeline.ts`** — tokenization, overlap with `corpus-d`, register hints (`media` | `literary` | `rabbinic`), optional max-level filtering.
- **`web/scripts/validate-hebrew-passage.ts`** — CLI (run from `web/`):  
  `npm run validate:hebrew-passage -- "טקסט בעברית"`  
  `npm run validate:hebrew-passage -- --level 2 --file ./snippet.txt`
- **`/developer`** — interactive **Passage validator** panel (same overlap logic in the browser).
- **`POST /api/validate-hebrew-passage`** — JSON `{ "text": "…", "maxLevel": 2 }` (optional `maxLevel` 1–4) → `{ validation }` for scripts / CI.

```bash
curl -s -X POST http://localhost:3000/api/validate-hebrew-passage \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"שלום עולם\"}" | jq .
```
- **`validate_passage.py`** — optional **Stanza** tokenization for sentences/tokens (offline NLP).

## Python setup

```bash
cd tools/hebrew-content-pipeline
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python -c "import stanza; stanza.download('he')"   # once; downloads models
python validate_passage.py "שלום לכולם"
python validate_passage.py --file snippet.txt --json
python sefaria_fetch_example.py   # urllib only; fetches sample Mishnah JSON
```

## Libraries & repos that help these goals

### Morphology, tagging, parsing (Python)

| Resource | Notes |
| -------- | ----- |
| **[Stanza](https://github.com/stanfordnlp/stanza)** (`pip install stanza`) | Multilingual; **Hebrew** pipeline: tokenization, POS, lemma (good for validation & stats). |
| **[HebPipe](https://github.com/amir-zeldes/HebPipe)** | End-to-end Hebrew NLP pipeline (UD). |
| **[YAP](https://github.com/OnlpLab/yap)** | Morphological analyzer / dependency for Hebrew (research-grade). |
| **[dicta](https://dicta.org.il/)** (tools, some API) | Nakdan, morphology; check **terms** for batch use. |

### Neural models & embeddings (Python / Hugging Face)

| Resource | Notes |
| -------- | ----- |
| **[Hugging Face](https://huggingface.co/models?language=he)** | Search `he` — e.g. **DictaBERT**, **AlephBERT** for classification, similarity, “is this sentence modern?” heuristics. |
| **sentence-transformers** | Semantic similarity between generated passage and reference snippets (roll your own guardrails). |

### Reference text APIs (Jewish / classical)

| Resource | Notes |
| -------- | ----- |
| **[Sefaria API](https://github.com/Sefaria/Sefaria-Project/wiki/API-Documentation)** | Fetch **Tanakh / Mishnah / Talmud** by ref; great for **rabbinic** register checks, not for **modern media** Hebrew. |
| **National Library of Israel** | Digital collections; API availability changes — check current developer docs. |

### TypeScript / Node (already in app)

| Resource | Notes |
| -------- | ----- |
| **`web/data/corpus-d.ts`** | App dictionary — overlap scoring for generated passages. |
| **`/api/mcq-choices`** | Server-side distractor building from corpus. |

### “Modern Hebrew as used now”

- **Corpus frequency / collocation**: use **licensed** modern corpora (subtitles, Wikipedia dumps with license clarity), or your own growing **approved** passage bank — not scraped paywalled news without permission.
- **Hebrew Language Academy** ([hebrew-academy.org.il](https://hebrew-academy.org.il/)) — norms and terminology (human-facing reference).

## Suggested pipeline (future)

1. Generate draft (LLM) with **register** from `REGISTER_PROMPT_HINTS` in `hebrew-passage-pipeline.ts`.
2. **Validate** overlap with `corpus-d` (TS CLI) + Stanza tokens (Python).
3. Optional: compare embeddings to **reference snippets** you own.
4. Human review for published Gold content.

## License

Scripts here follow the repo license; **third-party models** (Stanza, HF) have their own licenses.
