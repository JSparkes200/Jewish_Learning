#!/usr/bin/env python3
"""
Minimal Sefaria API example (classical texts — not modern news).
https://github.com/Sefaria/Sefaria-Project/wiki/API-Documentation

Usage:
  pip install requests
  python sefaria_fetch_example.py
"""

from __future__ import annotations

import json
import sys
from urllib.parse import quote
from urllib.request import Request, urlopen


def fetch_text(ref: str) -> dict[str, object]:
    """Return JSON for a textual ref (e.g. Mishnah Berakhot 1:1)."""
    enc = quote(ref)
    url = f"https://www.sefaria.org/api/texts/{enc}"
    req = Request(url, headers={"User-Agent": "HebrewAppContentPipeline/0.1"})
    with urlopen(req, timeout=30) as resp:  # noqa: S310 — fixed API host
        return json.loads(resp.read().decode("utf-8"))


def main() -> int:
    ref = "Mishnah_Berakhot.1.1" if len(sys.argv) < 2 else sys.argv[1]
    try:
        data = fetch_text(ref)
    except OSError as e:
        print(f"Request failed: {e}", file=sys.stderr)
        return 1
    print(json.dumps(data, ensure_ascii=False, indent=2)[:8000])
    print("\n… (truncated if long)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
