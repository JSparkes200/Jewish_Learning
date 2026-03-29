"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { McqDrill } from "@/components/McqDrill";
import { FOUNDATION_EXIT_PACKS } from "@/data/foundation-exit-drills";
import {
  FOUNDATION_EXIT_MIN_PCT,
  meetsFoundationExitPassPercent,
} from "@/lib/foundation-exit-pass";
import {
  LEARN_PROGRESS_EVENT,
  countIncompleteFoundationSections,
  createEmptyLearnProgressState,
  getFoundationExitStrands,
  isBridgeUnlocked,
  isFoundationCourseComplete,
  loadLearnProgress,
  recordGradedAnswer,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  setFoundationExitStrand,
  touchDailyStreak,
  type FoundationExitStrands,
  type LearnProgressState,
} from "@/lib/learn-progress";

const STRANDS: {
  key: keyof FoundationExitStrands;
  label: string;
  hint: string;
}[] = [
  {
    key: "reading",
    label: "Reading",
    hint: "Vocabulary in context (12 items).",
  },
  {
    key: "grammar",
    label: "Grammar",
    hint: "Patterns and agreement (12 items).",
  },
  {
    key: "lexicon",
    label: "Lexicon",
    hint: "Core lemmas (12 items).",
  },
];

export function FoundationExitPageClient() {
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );
  const [lastAttempt, setLastAttempt] = useState<
    Partial<Record<keyof FoundationExitStrands, { correct: number; total: number }>>
  >({});

  const sync = useCallback(() => {
    setProgress(loadLearnProgress());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, [sync]);

  const strands = getFoundationExitStrands(progress);
  const bridgeOpen = isBridgeUnlocked(progress);
  const foundationReady = isFoundationCourseComplete(progress);
  const incompleteFoundation = countIncompleteFoundationSections(
    progress.completedSections,
  );

  const toggleStrand = (key: keyof FoundationExitStrands, passed: boolean) => {
    const cur = loadLearnProgress();
    const next = setFoundationExitStrand(cur, key, passed);
    saveLearnProgress(next);
    setProgress(next);
  };

  const onStrandPackComplete = (key: keyof FoundationExitStrands) => {
    return (result: { correct: number; total: number }) => {
      setLastAttempt((prev) => ({ ...prev, [key]: result }));
      if (meetsFoundationExitPassPercent(result.correct, result.total)) {
        const cur = loadLearnProgress();
        const next = setFoundationExitStrand(cur, key, true);
        saveLearnProgress(next);
        setProgress(next);
      }
    };
  };

  const onPracticeAnswer = useCallback(
    (correct: boolean, ctx?: { promptHe?: string }) => {
      setProgress((p) => {
        let n = touchDailyStreak(p);
        n = recordGradedAnswer(n, correct);
        n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
        saveLearnProgress(n);
        return n;
      });
    },
    [],
  );

  return (
    <div>
      <nav className="mb-6">
        <Link
          href="/learn"
          className="font-label text-[10px] uppercase tracking-[0.2em] text-sage hover:underline"
        >
          ← Learn
        </Link>
      </nav>

      <header className="mb-6">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Foundation exit
        </p>
        <h1 className="font-hebrew text-2xl text-ink">מִבְחָנֵי יְצִיאָה</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Pass each strand at{" "}
          <strong className="text-ink">
            {Math.round(FOUNDATION_EXIT_MIN_PCT * 100)}%
          </strong>{" "}
          or higher on each strand quiz below.
          {foundationReady
            ? " Dev simulate/clear controls stay for testing."
            : " Quizzes unlock after every Alef–Dalet subsection is marked complete in Learn."}
        </p>
      </header>

      {!foundationReady ? (
        <div className="mb-6 rounded-2xl border border-amber/40 bg-amber/10 px-4 py-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-amber">
            Foundation path
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Finish all subsections in levels Alef–Dalet first (
            <strong className="text-ink">{incompleteFoundation}</strong> left).
            Strand quizzes and dev simulate are disabled until then.
          </p>
          <Link
            href="/learn"
            className="mt-3 inline-block rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            Open Learn →
          </Link>
        </div>
      ) : null}

      <div className="rounded-2xl border border-amber/30 bg-amber/5 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-amber">
          Status
        </p>
        <p className="mt-2 text-sm text-ink">
          {bridgeOpen ? (
            <>
              <strong className="text-sage">Bridge unlocked.</strong>{" "}
              <Link href="/learn/bridge" className="text-sage underline">
                Open bridge →
              </Link>
            </>
          ) : (
            <>
              Need{" "}
              {
                [strands.reading, strands.grammar, strands.lexicon].filter((x) => !x)
                  .length
              }{" "}
              more strand(s).
            </>
          )}
        </p>
      </div>

      <ul className="mt-6 space-y-8">
        {STRANDS.map(({ key, label, hint }) => {
          const on = strands[key];
          const pack = FOUNDATION_EXIT_PACKS[key];
          const attempt = lastAttempt[key];
          return (
            <li key={key} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink/12 bg-parchment-card/90 px-4 py-3">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                    {label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">{hint}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 font-label text-[9px] uppercase tracking-wide ${
                    on
                      ? "bg-sage/20 text-sage"
                      : "bg-ink/10 text-ink-muted"
                  }`}
                >
                  {on ? "Passed" : "Not passed"}
                </span>
              </div>

              {!on ? (
                foundationReady ? (
                  <>
                    <McqDrill
                      key={key}
                      pack={pack}
                      defaultShowNikkud
                      onPracticeAnswer={onPracticeAnswer}
                      endHint={
                        attempt
                          ? meetsFoundationExitPassPercent(
                              attempt.correct,
                              attempt.total,
                            )
                            ? "This strand meets the score — marked passed. Finish the other strands to open the bridge."
                            : `Score ${attempt.correct}/${attempt.total}. Need at least ${Math.ceil(FOUNDATION_EXIT_MIN_PCT * attempt.total - 1e-9)} of ${attempt.total} for ${Math.round(FOUNDATION_EXIT_MIN_PCT * 100)}%.`
                          : "Scores at or above 90% mark this strand passed automatically."
                      }
                      onPackComplete={onStrandPackComplete(key)}
                    />
                    {attempt &&
                    !meetsFoundationExitPassPercent(
                      attempt.correct,
                      attempt.total,
                    ) ? (
                      <p className="text-xs text-rust">
                        Last run: {attempt.correct}/{attempt.total} — does not
                        meet {Math.round(FOUNDATION_EXIT_MIN_PCT * 100)}%.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="rounded-xl border border-dashed border-ink/20 bg-parchment-deep/30 px-4 py-3 text-sm text-ink-muted">
                    Quiz locked — complete the foundation path in Learn first.
                  </p>
                )
              ) : (
                <p className="text-sm text-ink-muted">
                  Strand passed.{" "}
                  <button
                    type="button"
                    className="font-medium text-sage underline"
                    onClick={() => toggleStrand(key, false)}
                  >
                    Clear pass
                  </button>{" "}
                  to retake the quiz.
                </p>
              )}

              {foundationReady ? (
                <div className="flex flex-wrap gap-2 border-t border-ink/10 pt-3">
                  <button
                    type="button"
                    disabled={on}
                    onClick={() => toggleStrand(key, true)}
                    className="rounded-lg bg-sage/80 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Simulate pass (dev)
                  </button>
                  <button
                    type="button"
                    disabled={!on}
                    onClick={() => toggleStrand(key, false)}
                    className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear (dev)
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-center text-[11px] text-ink-faint">
        Longer passages and proctored retake rules may be added later.
      </p>
    </div>
  );
}
