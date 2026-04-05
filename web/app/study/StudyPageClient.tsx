"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COURSE_LEVELS,
  getSectionsForLevel,
  maxUnlockMasteredRequirementForLevel,
} from "@/data/course";
import { getNextLearnUp } from "@/lib/learn-next-up";
import {
  YIDDISH_PROGRESS_EVENT,
  loadYiddishProgress,
} from "@/lib/yiddish-progress";
import { ProgressRing } from "@/components/ProgressRing";
import { StudyDailySession } from "@/components/StudyDailySession";
import { StudyPracticeGames } from "@/components/StudyPracticeGames";
import { StudyReviewQueue } from "@/components/StudyReviewQueue";
import {
  LEARN_PROGRESS_EVENT,
  SKILL_METRIC_LABELS,
  completionRatio,
  countCourseListMastery,
  countTrackedLemmasAtLeast,
  createEmptyLearnProgressState,
  effectiveCourseLevelMasteredCount,
  getSkillMetricSnapshot,
  getWeakestSkillMetrics,
  type GradedPracticeContext,
  loadLearnProgress,
  normalizeStreak,
  recordGradedAnswer,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  touchDailyStreak,
  type LearnProgressState,
  type SkillMetricKey,
} from "@/lib/learn-progress";

const SKILL_RING_ORDER: SkillMetricKey[] = [
  "recognition",
  "production",
  "grammar",
  "definition",
  "listening",
  "comprehension",
];

const RING_TONES: Array<"sage" | "amber" | "rust"> = [
  "sage",
  "amber",
  "rust",
  "sage",
  "amber",
  "rust",
];

export function StudyPageClient() {
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );
  const [yiddishRev, setYiddishRev] = useState(0);
  const [practiceBiasLemmas, setPracticeBiasLemmas] = useState<
    readonly string[] | undefined
  >(undefined);

  const sync = useCallback(() => {
    setProgress(loadLearnProgress());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, [sync]);

  useEffect(() => {
    const onY = () => setYiddishRev((r) => r + 1);
    window.addEventListener(YIDDISH_PROGRESS_EVENT, onY);
    return () => window.removeEventListener(YIDDISH_PROGRESS_EVENT, onY);
  }, []);

  const next = useMemo(
    () =>
      getNextLearnUp(progress, {
        yiddishProgress: loadYiddishProgress(),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yiddishRev bumps when Yiddish storage changes without Hebrew progress
    [progress, yiddishRev],
  );
  const streak = normalizeStreak(progress.streak);
  const attempts = progress.mcqAttempts ?? 0;
  const correct = progress.mcqCorrect ?? 0;
  const pctPractice =
    attempts > 0 ? Math.round((correct / attempts) * 100) : null;

  const activeMeta = COURSE_LEVELS.find((L) => L.n === progress.activeLevel);
  const activeSections = getSectionsForLevel(progress.activeLevel);
  const activeRatio = completionRatio(
    activeSections,
    progress.completedSections,
  );

  const al = progress.activeLevel;
  const { mastered: activeMastered, total: activeListTotal } =
    countCourseListMastery(al, progress.vocabLevels);
  const gateEff = effectiveCourseLevelMasteredCount(
    al,
    progress.completedSections,
    progress.vocabLevels,
  );
  const gateMax = maxUnlockMasteredRequirementForLevel(al);
  const lemmasGe2 = countTrackedLemmasAtLeast(progress.vocabLevels, 2);
  const skillSnapshot = getSkillMetricSnapshot(progress);
  const weakSkills = getWeakestSkillMetrics(progress, 2);

  const onPracticeAnswer = useCallback(
    (correct: boolean, ctx?: GradedPracticeContext) => {
      const p = loadLearnProgress();
      let n = touchDailyStreak(p);
      n = recordGradedAnswer(n, correct, ctx);
      n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
      saveLearnProgress(n);
      setProgress(n);
    },
    [],
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-muted">
        Your review home: jump to the next open section, replay a level story, or
        watch how your MCQ practice is stacking up — still saved only in this
        browser until you move it.
      </p>

      <div className="rounded-2xl border border-ink/10 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Suggested next
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink">
          {next.icon ? (
            <span className="text-lg" aria-hidden>
              {next.icon}
            </span>
          ) : null}
          <span>{next.label}</span>
        </p>
        <Link
          href={next.href}
          className="btn-elevated-rust mt-3 inline-flex items-center justify-center no-underline"
        >
          Go →
        </Link>
      </div>

      <StudyDailySession
        progress={progress}
        practiceBiasLemmas={practiceBiasLemmas}
        onApplyPracticeBias={(lemmas) => setPracticeBiasLemmas(lemmas)}
        onClearPracticeBias={() => setPracticeBiasLemmas(undefined)}
      />

      <StudyReviewQueue progress={progress} />

      <StudyPracticeGames
        activeLevel={progress.activeLevel}
        preferredLemmas={practiceBiasLemmas}
        onClearPreferredLemmas={() => setPracticeBiasLemmas(undefined)}
        onPracticeAnswer={onPracticeAnswer}
      />

      <div className="surface-elevated p-4 sm:p-5">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Learning balance
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Tips and nudges read these quiet skill metrics. Each ring fills when you
          have attempts; nudge every column over time so one muscle doesn’t carry
          the whole lift.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SKILL_RING_ORDER.map((key, i) => {
            const stat = skillSnapshot[key];
            const pct =
              stat.attempts > 0
                ? Math.round((stat.correct / stat.attempts) * 100)
                : 0;
            return (
              <div
                key={key}
                className="flex flex-col items-center gap-1 rounded-xl border border-white/50 bg-parchment-deep/25 px-2 py-3 shadow-insetSoft"
              >
                <p className="text-center font-label text-[8px] uppercase leading-tight tracking-wide text-ink-muted">
                  {SKILL_METRIC_LABELS[key]}
                </p>
                <ProgressRing
                  percent={pct}
                  label={`${pct}%`}
                  sublabel={
                    stat.attempts > 0
                      ? `${stat.correct}/${stat.attempts}`
                      : "—"
                  }
                  size={76}
                  stroke={7}
                  tone={RING_TONES[i] ?? "sage"}
                  compact
                />
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Gentle priority right now:{" "}
          <strong className="text-ink">
            {weakSkills.map((k) => SKILL_METRIC_LABELS[k]).join(" + ")}
          </strong>
          . Play the games and focus rows above, then tap the Rabbi (?) for pacing
          notes that match this screen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-amber/25 bg-amber/5 p-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Streak
          </p>
          <p className="mt-2 text-xl font-semibold tabular-nums text-ink">
            {streak.current}
            <span className="text-sm font-normal text-ink-muted">
              {" "}
              day{streak.current === 1 ? "" : "s"} · best {streak.longest}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-ink-faint">UTC calendar days</p>
        </div>
        <div className="rounded-2xl border border-sage/25 bg-sage/5 p-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            MCQ &amp; comprehension picks
          </p>
          {attempts > 0 ? (
            <>
              <p className="mt-2 text-xl font-semibold tabular-nums text-ink">
                {correct}
                <span className="text-sm font-normal text-ink-muted">
                  {" "}
                  / {attempts} correct
                </span>
              </p>
              <p className="mt-1 text-[11px] text-ink-muted">
                {pctPractice}% over lifetime (first click per question)
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-muted">
              Answer a question in Learn to start your tally.
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-ink/10 border-t-sage/30 bg-parchment-card/60 p-4 sm:col-span-2 lg:col-span-1">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Word levels (gates)
          </p>
          <p className="mt-2 text-sm text-ink">
            <strong className="tabular-nums">{lemmasGe2}</strong>
            <span className="text-ink-muted">
              {" "}
              lemma{lemmasGe2 === 1 ? "" : "s"} at lv ≥ 2 (all levels)
            </span>
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
            Active level {al}:{" "}
            <strong className="text-ink">
              {activeMastered}/{activeListTotal}
            </strong>{" "}
            course prompts at lv≥2 · gate score{" "}
            <strong className="tabular-nums text-ink">{gateEff}</strong>
            {gateMax != null ? (
              <span className="text-ink-faint"> (up to {gateMax})</span>
            ) : null}
          </p>
          <Link
            href="/progress"
            className="mt-3 inline-block text-[10px] text-sage underline"
          >
            Full breakdown on Progress →
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-parchment-card/40 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Active level snapshot
        </p>
        <p className="mt-2 text-sm text-ink">
          <strong>{activeMeta?.label ?? `Level ${progress.activeLevel}`}</strong>{" "}
          — {activeRatio.done}/{activeRatio.total} subsections marked (
          {activeRatio.pct}%)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/learn/${progress.activeLevel}`}
            className="btn-elevated-primary inline-flex items-center justify-center px-3 py-2 no-underline"
          >
            Level menu
          </Link>
          <Link
            href={`/learn/${progress.activeLevel}/story`}
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            Story + quiz
          </Link>
          <Link
            href="/numbers"
            className="rounded-lg border border-rust/30 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            Numbers
          </Link>
          <Link
            href="/roots"
            className="rounded-lg border border-amber/30 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            Word roots
          </Link>
        </div>
      </div>

      <div>
        <p className="mb-2 font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          All level stories
        </p>
        <ul className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((n) => (
            <li key={n}>
              <Link
                href={`/learn/${n}/story`}
                className="inline-block rounded-lg border border-ink/10 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:border-sage/40 hover:bg-parchment-deep/30"
              >
                L{n} story
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-ink/10 pt-4 text-[11px]">
        <Link href="/learn" className="text-sage underline">
          Learn home
        </Link>
        <Link href="/library" className="text-sage underline">
          Library
        </Link>
        <Link href="/reading" className="text-sage underline">
          Reading
        </Link>
        <Link href="/progress" className="text-sage underline">
          Progress
        </Link>
        <Link href="/developer" className="text-sage underline">
          Backup JSON
        </Link>
      </div>
    </div>
  );
}
