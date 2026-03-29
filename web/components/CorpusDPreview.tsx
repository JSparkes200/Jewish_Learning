"use client";

import { useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  LEGACY_CORPUS_D_LENGTH,
  corpusEntriesUpToLevel,
  findCorpusEntryByHebrew,
  getDynamicCorpusRootsForLevel,
} from "@/lib/corpus-d-lookup";

export function CorpusDPreview() {
  const [q, setQ] = useState("שָׁלוֹם");
  const entry = useMemo(() => {
    const t = q.trim();
    return t ? findCorpusEntryByHebrew(t) : undefined;
  }, [q]);

  const sampleStats = useMemo(() => {
    const l1 = corpusEntriesUpToLevel(1).length;
    const dyn4 = getDynamicCorpusRootsForLevel(4).length;
    return { l1, dyn4 };
  }, []);

  return (
    <div className="rounded-xl border border-ink/12 border-t-amber/25 bg-parchment-card/80 p-4">
      <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        Corpus D (legacy lexicon)
      </h3>
      <p className="mt-2 text-xs text-ink-muted">
        Learn MCQs request <strong className="text-ink">wrong answers</strong> from{" "}
        <code className="text-[10px]">POST /api/mcq-choices</code> (corpus + inline
        fallback on the server).
      </p>
      <p className="mt-2 text-xs text-ink-muted">
        <strong className="text-ink">{LEGACY_CORPUS_D_LENGTH.toLocaleString()}</strong>{" "}
        rows exported from{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          hebrew-v8.2.html
        </code>{" "}
        into{" "}
        <code className="text-[11px]">web/data/corpus-d.ts</code>. Regenerate
        from the <code className="text-[10px]">web/</code> folder:{" "}
        <code className="text-[10px]">npm run extract:corpus-d</code>.
      </p>
      <p className="mt-2 text-[11px] text-ink-faint">
        Level ≤1: {sampleStats.l1.toLocaleString()} lemmas · dict-derived roots
        (lv≤4, ≥2 words): {sampleStats.dyn4}
      </p>

      <label className="mt-4 block font-label text-[9px] uppercase tracking-wide text-ink-muted">
        Look up Hebrew headword
      </label>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        dir="rtl"
        className="mt-1 w-full rounded-lg border border-ink/15 bg-parchment-deep/30 px-3 py-2 font-body text-sm text-ink placeholder:text-ink-faint"
        placeholder="Paste Hebrew from the course…"
        spellCheck={false}
      />

      {entry ? (
        <div className="mt-3 rounded-lg border border-sage/25 bg-sage/5 p-3 text-sm">
          <Hebrew className="text-xl text-ink">{entry.h}</Hebrew>
          <p className="mt-1 text-[11px] text-ink-muted">
            <span className="italic">{entry.p}</span>
            <span className="text-ink-faint"> · l{entry.l}</span>
            {entry.shoresh ? (
              <span className="text-ink-faint"> · root {entry.shoresh}</span>
            ) : null}
          </p>
          <p className="mt-1 text-ink">{entry.e}</p>
          {entry.col ? (
            <p className="mt-2 text-[11px] text-ink-muted">{entry.col}</p>
          ) : null}
          {entry.gram ? (
            <p className="mt-1 text-[11px] text-ink-muted">{entry.gram}</p>
          ) : null}
        </div>
      ) : q.trim() ? (
        <p className="mt-3 text-xs text-amber">No exact match for that string.</p>
      ) : null}
    </div>
  );
}
