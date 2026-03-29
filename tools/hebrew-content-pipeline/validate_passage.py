#!/usr/bin/env python3
"""
Tokenize Hebrew with Stanza (offline). First-time setup:
  pip install -r requirements.txt
  python -c "import stanza; stanza.download('he')"
"""

from __future__ import annotations

import argparse
import json
import sys


def main() -> int:
    p = argparse.ArgumentParser(description="Stanza Hebrew tokenization for passages")
    p.add_argument("text", nargs="?", default="", help="Hebrew text")
    p.add_argument("-f", "--file", help="UTF-8 file path")
    p.add_argument("--json", action="store_true", help="Print JSON")
    args = p.parse_args()

    text = args.text or ""
    if args.file:
        with open(args.file, encoding="utf-8") as fh:
            text = fh.read()
    text = text.strip()
    if not text:
        print("No input text.", file=sys.stderr)
        return 1

    try:
        import stanza
    except ImportError:
        print(
            "Missing stanza. Run: pip install -r requirements.txt",
            file=sys.stderr,
        )
        return 2

    try:
        nlp = stanza.Pipeline(
            lang="he",
            processors="tokenize",
            verbose=False,
        )
    except Exception as ex:  # noqa: BLE001
        print(
            "Stanza Hebrew pipeline failed. If models are missing, run:\n"
            "  python -c \"import stanza; stanza.download('he')\"",
            file=sys.stderr,
        )
        print(str(ex), file=sys.stderr)
        return 3

    doc = nlp(text)
    sentences_out: list[dict[str, object]] = []
    for sent in doc.sentences:
        tokens = [t.text for t in sent.tokens]
        sentences_out.append({"tokens": tokens, "text": sent.text})

    if args.json:
        print(json.dumps({"sentences": sentences_out}, ensure_ascii=False, indent=2))
    else:
        for i, s in enumerate(sentences_out, 1):
            print(f"Sentence {i}: {s['text']}")
            print("  Tokens:", " | ".join(s["tokens"]))  # type: ignore[list-item]
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
