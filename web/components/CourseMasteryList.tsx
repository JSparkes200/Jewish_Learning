"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { COURSE_LEVELS } from "@/data/course";
import { getMasteryWordListForLevel } from "@/data/course-mastery-words";

function starsForVocabLv(lv: number | undefined): string {
  const v = lv ?? 0;
  if (v >= 4) return "★★★★";
  if (v >= 3) return "★★★☆";
  if (v >= 2) return "★★☆☆";
  if (v >= 1) return "★☆☆☆";
  return "☆☆☆☆";
}

function starColorClass(lv: number | undefined): string {
  const v = lv ?? 0;
  if (v >= 3) return "text-sage";
  if (v >= 1) return "text-amber";
  return "text-ink-faint";
}

function sortLemmas(
  words: readonly string[],
  vocabLevels: Record<string, number> | undefined,
): string[] {
  return [...words].sort((a, b) => {
    const pa = vocabLevels?.[a];
    const pb = vocabLevels?.[b];
    const sa = pa === undefined ? -1 : pa;
    const sb = pb === undefined ? -1 : pb;
    if (sa !== sb) return sa - sb;
    return a.localeCompare(b, "he");
  });
}

type Filter = number | "all";

type Props = {
  vocabLevels: Record<string, number> | undefined;
  /** Used as default open section when filter is "all". */
  activeLevel: number;
};

export function CourseMasteryList({ vocabLevels, activeLevel }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const levelSummaries = useMemo(() => {
    return COURSE_LEVELS.map((L) => {
      const words = getMasteryWordListForLevel(L.n);
      let ge2 = 0;
      for (const h of words) {
        if ((vocabLevels?.[h] ?? 0) >= 2) ge2++;
      }
      return {
        n: L.n,
        label: L.label,
        short: L.label.split("—")[0]?.trim() ?? `Level ${L.n}`,
        words,
        ge2,
        total: words.length,
      };
    });
  }, [vocabLevels]);

  const singleLevel = useMemo(() => {
    if (filter === "all") return null;
    return levelSummaries.find((s) => s.n === filter) ?? null;
  }, [filter, levelSummaries]);

  return (
    <div className="mt-4 border-t border-ink/10 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-muted">
          Browse lemmas
        </label>
        <select
          className="max-w-[220px] rounded-lg border border-ink/15 bg-parchment-deep/40 px-2 py-1.5 font-label text-[10px] uppercase tracking-wide text-ink"
          value={filter === "all" ? "all" : String(filter)}
          onChange={(e) => {
            const v = e.target.value;
            setFilter(v === "all" ? "all" : Number(v));
          }}
        >
          <option value="all">All levels</option>
          {COURSE_LEVELS.map((L) => (
            <option key={L.n} value={L.n}>
              {L.label.split("—")[0]?.trim() ?? `Level ${L.n}`}
            </option>
          ))}
        </select>
      </div>

      {filter === "all" ? (
        <ul className="mt-3 space-y-2">
          {levelSummaries.map((s) => (
            <li key={s.n}>
              <details
                className="group rounded-lg border border-ink/10 bg-parchment-deep/30"
                open={s.n === activeLevel}
              >
                <summary className="cursor-pointer select-none px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink marker:text-ink-muted">
                  <span className="mr-2">{s.short}</span>
                  <span className="font-normal normal-case tracking-normal text-ink-muted">
                    {s.ge2}/{s.total} at lv ≥ 2
                  </span>
                </summary>
                <LemmaRows
                  words={s.words}
                  vocabLevels={vocabLevels}
                  level={s.n}
                />
              </details>
            </li>
          ))}
        </ul>
      ) : singleLevel ? (
        <div className="mt-3">
          <p className="mb-2 text-[10px] text-ink-muted">
            {singleLevel.ge2}/{singleLevel.total} lemmas at lv ≥ 2 on the course
            list for this level.
          </p>
          <LemmaRows
            words={singleLevel.words}
            vocabLevels={vocabLevels}
            level={singleLevel.n}
          />
        </div>
      ) : null}

      <Link
        href="/learn"
        className="mt-3 inline-block text-[10px] text-sage hover:underline"
      >
        Practice in Learn →
      </Link>
    </div>
  );
}

function LemmaRows({
  words,
  vocabLevels,
  level,
}: {
  words: readonly string[];
  vocabLevels: Record<string, number> | undefined;
  level: number;
}) {
  const sorted = useMemo(
    () => sortLemmas(words, vocabLevels),
    [words, vocabLevels],
  );

  if (sorted.length === 0) {
    return (
      <p className="px-3 pb-3 text-[11px] text-ink-muted">
        No course lemmas indexed for this level yet.
      </p>
    );
  }

  return (
    <ul className="max-h-[min(360px,50vh)] overflow-y-auto border-t border-ink/10 px-2 py-2 text-[12px]">
      {sorted.map((h) => {
        const lv = vocabLevels?.[h];
        return (
          <li
            key={h}
            className="flex items-center gap-3 border-b border-ink/5 py-2 last:border-b-0"
          >
            <Hebrew className="min-w-0 flex-1 text-right text-base leading-snug text-ink">
              {h}
            </Hebrew>
            <span
              className={`shrink-0 font-label text-[10px] tabular-nums ${starColorClass(lv)}`}
              title={
                lv === undefined
                  ? "Not practiced in this app yet"
                  : `Stored level ${lv} (0–5)`
              }
            >
              {starsForVocabLv(lv)}
            </span>
          </li>
        );
      })}
      <li className="px-1 pt-2 text-[10px] text-ink-faint">
        <Link href={`/learn/${level}`} className="text-sage hover:underline">
          Open level {level} →
        </Link>
      </li>
    </ul>
  );
}
