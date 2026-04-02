"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  ROOT_TIER_LABELS,
  STATIC_ROOT_FAMILIES,
  flattenAllRootWords,
  type CourseRootFamily,
  type RootWordForm,
} from "@/data/course-roots";
import { getDynamicCourseRootFamiliesForLevel } from "@/lib/corpus-d-lookup";
import type { GradedPracticeContext } from "@/lib/learn-progress";
import {
  englishMcqOptionsForRootWord,
  getNextRootDrillWord,
  isRootFamilyDrillComplete,
  rootDrillSolidCount,
  getRootTiers,
} from "@/lib/root-drill";

const LEVEL_NAMES = ["Aleph", "Bet", "Gimel", "Dalet"] as const;

type RootSource = "course" | "lexicon";

type Props = {
  rootDrill: Record<string, Record<string, number>> | undefined;
  vocabLevels: Record<string, number> | undefined;
  onGradedPick: (correct: boolean, ctx: GradedPracticeContext) => void;
  /** Used as default / sync for lexicon cap (1–4). */
  activeLearnLevel?: number;
};

function vocabMasteredPct(
  family: CourseRootFamily,
  vocabLevels: Record<string, number> | undefined,
): number {
  const n = family.words.length;
  if (!n) return 0;
  const m = family.words.filter((w) => (vocabLevels?.[w.h] ?? 0) >= 3).length;
  return Math.round((m / n) * 100);
}

export function RootDrillExplorer({
  rootDrill,
  vocabLevels,
  onGradedPick,
  activeLearnLevel = 1,
}: Props) {
  const cappedLearnLevel =
    activeLearnLevel >= 1 && activeLearnLevel <= 4 ? activeLearnLevel : 1;

  const [source, setSource] = useState<RootSource>("course");
  const [lexiconLevel, setLexiconLevel] = useState(cappedLearnLevel);

  useEffect(() => {
    setLexiconLevel(cappedLearnLevel);
  }, [cappedLearnLevel]);

  const families = useMemo((): readonly CourseRootFamily[] => {
    if (source === "course") return STATIC_ROOT_FAMILIES;
    return getDynamicCourseRootFamiliesForLevel(lexiconLevel);
  }, [source, lexiconLevel]);

  const allWords = useMemo(() => flattenAllRootWords(families), [families]);

  const [studyOpen, setStudyOpen] = useState<number | null>(null);
  const [drillFamilyIndex, setDrillFamilyIndex] = useState<number | null>(null);
  const [drillRound, setDrillRound] = useState<{
    word: RootWordForm;
    tier: 1 | 2 | 3;
    options: string[];
    correctIndex: number;
  } | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  const resetBrowseState = useCallback(() => {
    setStudyOpen(null);
    setDrillFamilyIndex(null);
    setDrillRound(null);
    setPicked(null);
  }, []);

  const switchSource = useCallback(
    (next: RootSource) => {
      setSource(next);
      resetBrowseState();
    },
    [resetBrowseState],
  );

  const startDrillRound = useCallback(
    (familyIndex: number) => {
      const family = families[familyIndex];
      if (!family) return;
      const next = getNextRootDrillWord(family, rootDrill);
      if (!next) return;
      const { options, correctIndex } = englishMcqOptionsForRootWord(
        next.word,
        allWords,
      );
      setDrillFamilyIndex(familyIndex);
      setDrillRound({ ...next, options, correctIndex });
      setPicked(null);
    },
    [allWords, families, rootDrill],
  );

  const onPickOption = useCallback(
    (j: number) => {
      if (picked != null || !drillRound || drillFamilyIndex == null) return;
      const fam = families[drillFamilyIndex];
      if (!fam) return;
      setPicked(j);
      const ok = j === drillRound.correctIndex;
      onGradedPick(ok, {
        promptHe: drillRound.word.h,
        rootKey: fam.root,
        skills: ["grammar", "production", "definition"],
      });
    },
    [drillRound, drillFamilyIndex, families, picked, onGradedPick],
  );

  const drillFamily =
    drillFamilyIndex != null ? families[drillFamilyIndex] : undefined;

  if (drillFamilyIndex != null && drillFamily && drillRound) {
    const prog = rootDrill?.[drillFamily.root]?.[drillRound.word.h] ?? 0;
    const tierLab =
      drillRound.tier === 1
        ? ROOT_TIER_LABELS[1]
        : drillRound.tier === 2
          ? ROOT_TIER_LABELS[2]
          : ROOT_TIER_LABELS[3];

    return (
      <div className="rounded-2xl border border-amber/30 bg-amber/5 p-4">
        <button
          type="button"
          onClick={resetBrowseState}
          className="mb-3 font-label text-[10px] uppercase tracking-wide text-sage hover:underline"
        >
          ← All roots
        </button>
        <p className="font-label text-[10px] uppercase tracking-[0.15em] text-ink-muted">
          Root drill — <Hebrew className="text-ink">{drillFamily.root}</Hebrew>
        </p>
        <p className="mt-1 text-xs text-ink-muted">{drillFamily.meaning}</p>
        <p className="mt-2 font-label text-[9px] uppercase tracking-wide text-ink-faint">
          {tierLab} · {prog}/3 solid for this form
        </p>
        <Hebrew
          as="p"
          className="mt-4 text-right text-3xl font-medium leading-relaxed text-ink"
        >
          {drillRound.word.h}
        </Hebrew>
        <p className="mt-2 text-center text-sm italic text-amber">
          {drillRound.word.p}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {drillRound.options.map((opt, j) => {
            const show = picked != null;
            const isCorrect = j === drillRound.correctIndex;
            const isSel = j === picked;
            let ring =
              "ring-1 ring-ink/12 hover:bg-parchment-deep/50 hover:ring-ink/20";
            if (show) {
              if (isCorrect) ring = "bg-sage/15 ring-2 ring-sage";
              else if (isSel) ring = "bg-rust/10 ring-2 ring-rust/40 opacity-90";
              else ring = "opacity-50 ring-1 ring-ink/8";
            }
            return (
              <button
                key={`${opt}-${j}`}
                type="button"
                disabled={picked != null}
                onClick={() => onPickOption(j)}
                className={`rounded-xl px-3 py-3 text-left text-sm text-ink transition ${ring}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {picked != null ? (
          <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-3 text-sm">
            {picked === drillRound.correctIndex ? (
              <p className="text-sage">Correct.</p>
            ) : (
              <p className="text-ink-muted">
                The answer is{" "}
                <strong className="text-ink">
                  {drillRound.options[drillRound.correctIndex]}
                </strong>
                .
              </p>
            )}
            <button
              type="button"
              onClick={() => startDrillRound(drillFamilyIndex)}
              className="mt-3 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Next →
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber/25 bg-parchment-card/80 p-4">
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Word roots — שׁוֹרָשִׁים
      </p>
      <Hebrew
        as="p"
        className="mt-2 text-right text-2xl font-medium text-amber"
      >
        שׁוֹרָשִׁים
      </Hebrew>
      <p className="mt-2 text-xs italic text-ink-muted">
        Every Hebrew word grows from a 3-letter root. Below is the same graduated
        drill as the legacy app: pick the English gloss for the form shown; each
        form becomes solid after three correct answers.{" "}
        <strong className="font-medium text-ink">
          Lexicon
        </strong>{" "}
        builds families from dictionary{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">D</code>{" "}
        (two+ lemmas per shoresh), capped by level — like legacy{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
          getRootsForLevel
        </code>
        .
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-muted">
          Source
        </span>
        <div className="flex rounded-xl border border-ink/12 bg-parchment-deep/50 p-0.5">
          {(
            [
              { id: "course" as const, label: "Course pack" },
              { id: "lexicon" as const, label: "Lexicon" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => switchSource(id)}
              className={`rounded-lg px-3 py-1.5 font-label text-[9px] uppercase tracking-wide transition ${
                source === id
                  ? "bg-amber text-white shadow-sm"
                  : "text-ink-muted hover:bg-parchment-deep/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {source === "lexicon" ? (
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-label text-[8px] uppercase tracking-wider text-ink-faint">
              Cap
            </span>
            {LEVEL_NAMES.map((name, i) => {
              const lv = i + 1;
              const on = lexiconLevel === lv;
              return (
                <button
                  key={lv}
                  type="button"
                  onClick={() => {
                    setLexiconLevel(lv);
                    resetBrowseState();
                  }}
                  className={`rounded-lg border px-2 py-1 font-label text-[8px] uppercase tracking-wide ${
                    on
                      ? "border-sage/50 bg-sage/15 text-sage"
                      : "border-ink/10 text-ink-muted hover:bg-parchment-deep/60"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <p className="mt-3 rounded-lg border border-sage/25 bg-sage/5 px-3 py-2 font-label text-[9px] uppercase tracking-[0.12em] text-sage">
        {families.length} root families · {allWords.length} forms
        {source === "lexicon"
          ? ` · corpus rows with level ≤ ${lexiconLevel}`
          : ""}
      </p>

      {source === "lexicon" && families.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          No multi-lemma roots at this level cap yet.
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {families.map((family, i) => {
          const pctV = vocabMasteredPct(family, vocabLevels);
          const { solid, total } = rootDrillSolidCount(family, rootDrill);
          const done = isRootFamilyDrillComplete(family, rootDrill);

          return (
            <li
              key={family.root}
              className="rounded-xl border border-ink/12 border-t-[3px] border-t-amber bg-parchment-deep/40 p-3"
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-[72px] shrink-0 rounded-lg border border-amber/35 bg-amber/10 px-2 py-2 text-center">
                  <Hebrew className="text-2xl text-amber">{family.root}</Hebrew>
                  <p className="mt-1 font-label text-[7px] uppercase tracking-[0.2em] text-amber/70">
                    root
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-label text-[11px] uppercase tracking-wide text-ink">
                    {family.meaning}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    {total} forms · {pctV}% vocab lv≥3 · drill {solid}/{total} solid
                  </p>
                  <Hebrew className="mt-1 block text-sm text-ink-muted">
                    {family.words
                      .slice(0, 4)
                      .map((w) => w.h)
                      .join(" · ")}
                  </Hebrew>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 font-label text-[9px] font-bold tabular-nums text-ink-muted"
                    style={{
                      borderColor:
                        pctV >= 80
                          ? "var(--tw-ring-color, #4a6830)"
                          : pctV >= 40
                            ? "#c87020"
                            : "#8B3A1A",
                    }}
                    title="Share of forms at vocab level ≥3"
                  >
                    {pctV}%
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setStudyOpen((x) => (x === i ? null : i))
                    }
                    className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/60"
                  >
                    Study
                  </button>
                  <button
                    type="button"
                    onClick={() => startDrillRound(i)}
                    className="rounded-lg bg-amber px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
                  >
                    Drill{done ? " ✓" : ""}
                  </button>
                </div>
              </div>

              {studyOpen === i ? (
                <div className="mt-4 border-t border-ink/10 pt-3">
                  <p className="font-label text-[9px] uppercase tracking-[0.15em] text-burg">
                    All forms by difficulty
                  </p>
                  {([1, 2, 3] as const).map((label) => {
                    const [t1, t2, t3] = getRootTiers(family.words);
                    const tier = label === 1 ? t1 : label === 2 ? t2 : t3;
                    if (!tier.length) return null;
                    return (
                      <div key={label} className="mt-3">
                        <p className="mb-1 font-label text-[8px] uppercase tracking-wider text-burg/90">
                          {ROOT_TIER_LABELS[label]}
                        </p>
                        <ul className="space-y-2 rounded-lg border border-burg/15 bg-burg/5 p-2">
                          {tier.map((w) => (
                            <li
                              key={w.h}
                              className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-burg/10 pb-2 last:border-b-0"
                            >
                              <Hebrew className="text-lg text-ink">{w.h}</Hebrew>
                              <span className="text-[11px] italic text-amber">
                                {w.p}
                              </span>
                              <span className="text-[12px] text-ink-muted">
                                — {w.e}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  {family.sentence ? (
                    <div className="mt-4 rounded-lg border border-sage/20 bg-sage/5 p-3">
                      <p className="font-label text-[9px] uppercase tracking-[0.15em] text-sage">
                        Example
                      </p>
                      <Hebrew className="mt-2 block text-right text-lg leading-relaxed text-ink">
                        {family.sentence}
                      </Hebrew>
                      {family.trans ? (
                        <p className="mt-2 border-t border-ink/10 pt-2 text-sm italic text-ink-muted">
                          {family.trans}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
