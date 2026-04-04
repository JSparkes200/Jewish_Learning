"use client";

import { useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  LEGACY_CORPUS_D_LENGTH,
  corpusEntriesUpToLevel,
} from "@/lib/corpus-d-lookup";

const LEVEL_CAP_OPTIONS = [
  { value: 1, label: "Level ≤ 1" },
  { value: 2, label: "Level ≤ 2" },
  { value: 3, label: "Level ≤ 3" },
  { value: 4, label: "Level ≤ 4 (all)" },
] as const;

const RESULT_CAP = 120;

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function DeveloperLexiconBrowse() {
  const [q, setQ] = useState("");
  const [maxLevel, setMaxLevel] = useState<(typeof LEVEL_CAP_OPTIONS)[number]["value"]>(4);

  const pool = useMemo(() => corpusEntriesUpToLevel(maxLevel), [maxLevel]);

  const uncappedMatches = useMemo(() => {
    const needle = norm(q);
    if (!needle) return pool;
    return pool.filter((w) => {
      const hay = `${w.h} ${w.p} ${w.e} ${w.shoresh ?? ""} ${w.gram ?? ""} ${w.col ?? ""}`;
      return norm(hay).includes(needle) || hay.includes(q.trim());
    });
  }, [pool, q]);

  const rows = useMemo(
    () => uncappedMatches.slice(0, RESULT_CAP),
    [uncappedMatches],
  );
  const totalMatch = uncappedMatches.length;
  const truncated = uncappedMatches.length > RESULT_CAP;

  return (
    <div className="rounded-xl border border-ink/12 border-t-sage/25 bg-parchment-card/80 p-4">
      <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        Lexicon browse (corpus D)
      </h3>
      <p className="mt-2 text-xs text-ink-muted">
        Read-only slice of <strong className="text-ink">{LEGACY_CORPUS_D_LENGTH.toLocaleString()}</strong>{" "}
        legacy rows in <code className="text-[11px]">web/data/corpus-d.ts</code>. Matches the Developer →
        Lexicon search idea from the single-file app; edits and master export still belong in the HTML
        toolchain or future tooling.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 font-label text-[9px] uppercase tracking-wide text-ink-muted">
          Search (Hebrew, transliteration, English, notes)
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            dir="auto"
            className="mt-1 w-full rounded-lg border border-ink/15 bg-parchment-deep/30 px-3 py-2 font-body text-sm text-ink placeholder:text-ink-faint"
            placeholder="e.g. shalom, שלום, peace…"
            spellCheck={false}
          />
        </label>
        <label className="shrink-0 font-label text-[9px] uppercase tracking-wide text-ink-muted">
          Pool
          <select
            value={maxLevel}
            onChange={(e) =>
              setMaxLevel(Number(e.target.value) as (typeof LEVEL_CAP_OPTIONS)[number]["value"])
            }
            className="mt-1 block w-full rounded-lg border border-ink/15 bg-parchment-deep/30 px-3 py-2 font-body text-sm text-ink sm:w-44"
          >
            {LEVEL_CAP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-2 text-[11px] text-ink-faint">
        Pool: {pool.length.toLocaleString()} entr{pool.length === 1 ? "y" : "ies"}
        {q.trim()
          ? ` · ${totalMatch.toLocaleString()} match${totalMatch === 1 ? "" : "es"}`
          : ""}
        {truncated ? ` · showing first ${RESULT_CAP}` : ""}
      </p>

      {uncappedMatches.length > 0 ? (
        <div className="mt-2">
          <button
            type="button"
            className="rounded-lg border border-ink/15 bg-parchment-deep/40 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/60"
            onClick={() => {
              const payload = {
                exportedAt: new Date().toISOString(),
                source: "corpus-d-lookup",
                maxLevel,
                query: q.trim() || null,
                count: uncappedMatches.length,
                entries: uncappedMatches,
              };
              const blob = new Blob([JSON.stringify(payload, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              const qslug = q.trim() ? "-q" : "";
              a.download = `corpus-d-l${maxLevel}${qslug}-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download filtered set as JSON
          </button>
          <p className="mt-1 text-[10px] text-ink-faint">
            Exports every row matching the current pool and search (not only the preview list).
          </p>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <p className="mt-3 text-xs text-amber">No rows in this pool match the filter.</p>
      ) : (
        <ul className="mt-3 max-h-[min(24rem,50vh)] space-y-2 overflow-y-auto rounded-lg border border-ink/10 bg-parchment-deep/20 p-2">
          {rows.map((w, i) => (
            <li
              key={`${w.h}|${w.p}|${w.l}|${i}`}
              className="rounded-md border border-white/30 bg-parchment-card/60 px-2 py-2 text-sm shadow-sm"
            >
              <Hebrew className="text-base text-ink">{w.h}</Hebrew>
              <p className="mt-0.5 text-[11px] text-ink-muted">
                <span className="italic">{w.p}</span>
                <span className="text-ink-faint"> · l{w.l}</span>
                {w.shoresh ? <span className="text-ink-faint"> · {w.shoresh}</span> : null}
              </p>
              <p className="mt-1 text-xs text-ink">{w.e}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
