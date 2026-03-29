"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CourseMasteryList } from "@/components/CourseMasteryList";
import { HtmlMigrationTracker } from "@/components/HtmlMigrationTracker";
import { LegacyParityPanel } from "@/components/LegacyParityPanel";
import {
  COURSE_LEVELS,
  getSectionsForLevel,
  maxUnlockMasteredRequirementForLevel,
} from "@/data/course";
import { ALPHABET_LETTER_IDS } from "@/data/alphabet-letters";
import { BRIDGE_UNITS } from "@/data/bridge-course";
import {
  SPECIALTY_TIER_IDS,
  SPECIALTY_TRACKS,
} from "@/data/specialty-tracks";
import { YIDDISH_SECTIONS } from "@/data/yiddish-course";
import { STATIC_ROOT_FAMILIES } from "@/data/course-roots";
import {
  LEARN_PROGRESS_EVENT,
  completionRatio,
  countAllTrackedLemmas,
  countCourseListMastery,
  countTrackedLemmasAtLeast,
  effectiveBridgeUnitsCompleted,
  effectiveCourseLevelMasteredCount,
  getBridgeModulePassed,
  getFoundationExitStrands,
  isBridgeUnlocked,
  isSpecialtyTierRecordedPassed,
  createEmptyLearnProgressState,
  isFoundationCourseComplete,
  loadLearnProgress,
  normalizeStreak,
  resolveAlphabetGateStatus,
  type LearnProgressState,
} from "@/lib/learn-progress";
import {
  YIDDISH_PROGRESS_EVENT,
  loadYiddishProgress,
  yiddishSectionsDoneCount,
} from "@/lib/yiddish-progress";
import {
  isRootFamilyDrillComplete,
  rootDrillSolidCount,
} from "@/lib/root-drill";

export function ProgressPageClient() {
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );

  const [yiddishSnap, setYiddishSnap] = useState(() => loadYiddishProgress());

  const refresh = useCallback(() => {
    setProgress(loadLearnProgress());
  }, []);

  const refreshYiddish = useCallback(() => {
    setYiddishSnap(loadYiddishProgress());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(LEARN_PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, refresh);
  }, [refresh]);

  useEffect(() => {
    refreshYiddish();
    window.addEventListener(YIDDISH_PROGRESS_EVENT, refreshYiddish);
    return () =>
      window.removeEventListener(YIDDISH_PROGRESS_EVENT, refreshYiddish);
  }, [refreshYiddish]);

  const alphabetLettersDone = useMemo(
    () =>
      ALPHABET_LETTER_IDS.filter((id) => progress.alphabetLettersTraced?.[id])
        .length,
    [progress.alphabetLettersTraced],
  );

  const totalDone = COURSE_LEVELS.reduce((acc, L) => {
    const secs = getSectionsForLevel(L.n);
    return (
      acc + secs.filter((s) => progress.completedSections[s.id]).length
    );
  }, 0);
  const totalSecs = COURSE_LEVELS.reduce(
    (acc, L) => acc + getSectionsForLevel(L.n).length,
    0,
  );

  const streak = normalizeStreak(progress.streak);
  const hasStreak =
    streak.longest > 0 || streak.current > 0 || streak.lastDay !== "";

  const trackedLemmas = countAllTrackedLemmas(progress.vocabLevels);
  const trackedGe2 = countTrackedLemmasAtLeast(progress.vocabLevels, 2);

  const rootDrillSummary = useMemo(() => {
    let familiesDone = 0;
    let solidForms = 0;
    let totalForms = 0;
    for (const f of STATIC_ROOT_FAMILIES) {
      if (isRootFamilyDrillComplete(f, progress.rootDrill)) familiesDone++;
      const { solid, total } = rootDrillSolidCount(f, progress.rootDrill);
      solidForms += solid;
      totalForms += total;
    }
    return {
      familiesDone,
      familyTotal: STATIC_ROOT_FAMILIES.length,
      solidForms,
      totalForms,
    };
  }, [progress.rootDrill]);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Progress
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Saved in this browser as{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            hebrew-web-course-v1
          </code>{" "}
          (separate from the legacy HTML app for now). Yiddish uses{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            hebrew-web-yiddish-v1
          </code>
          . Developer → JSON backup (schema v2) bundles Hebrew + optional
          Yiddish for device moves.
        </p>
      </div>

      <div className="rounded-2xl border border-ink/10 border-t-sage/20 bg-parchment-card/40 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Optional cloud backup
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          On a deployed app with{" "}
          <strong className="text-ink">Vercel KV</strong> linked, you can push
          Learn progress to the server from{" "}
          <Link
            href="/developer#dev-cloud-backup"
            className="text-sage underline hover:text-sage/90"
          >
            Developer → Cloud backup
          </Link>
          . Uses a per-browser sync key (not a login). Full details and security
          notes:{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
            docs/cloud-progress.md
          </code>
          .
        </p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Overview
        </p>
        <p className="mt-2 text-2xl font-semibold text-ink">
          {totalDone}
          <span className="text-lg font-normal text-ink-muted">
            {" "}
            / {totalSecs}
          </span>
        </p>
        <p className="text-xs text-ink-muted">Sections marked complete</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-parchment-deep/80">
          <div
            className="h-full rounded-full bg-sage transition-all"
            style={{
              width: `${totalSecs ? Math.round((totalDone / totalSecs) * 100) : 0}%`,
            }}
          />
        </div>
        <Link
          href="/learn"
          className="mt-4 inline-block rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
        >
          Open Learn →
        </Link>
        {(progress.mcqAttempts ?? 0) > 0 ? (
          <p className="mt-4 border-t border-ink/10 pt-3 text-[11px] text-ink-muted">
            <strong className="text-ink">
              {progress.mcqCorrect ?? 0}/{progress.mcqAttempts}
            </strong>{" "}
            MCQ &amp; comprehension answers correct (lifetime, first pick per
            question).{" "}
            <Link href="/study" className="text-sage underline">
              Study hub →
            </Link>
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-ink/10 border-t-sage/20 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Course gates
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Alphabet (resolved):{" "}
          <strong className="text-ink">
            {resolveAlphabetGateStatus(progress)}
          </strong>
          . Letters practiced:{" "}
          <strong className="text-ink">
            {alphabetLettersDone}/{ALPHABET_LETTER_IDS.length}
          </strong>
          . Alphabet final:{" "}
          {progress.alphabetFinalExamPassed ? (
            <strong className="text-sage">passed</strong>
          ) : (
            <span className="text-ink-muted">not complete</span>
          )}
          . Alef–Dalet path:{" "}
          {isFoundationCourseComplete(progress) ? (
            <strong className="text-sage">complete</strong>
          ) : (
            <span className="text-ink-muted">in progress</span>
          )}
          . Foundation exit: reading{" "}
          {getFoundationExitStrands(progress).reading ? "✓" : "·"} grammar{" "}
          {getFoundationExitStrands(progress).grammar ? "✓" : "·"} lexicon{" "}
          {getFoundationExitStrands(progress).lexicon ? "✓" : "·"}. Bridge:{" "}
          {isBridgeUnlocked(progress) ? (
            <strong className="text-sage">unlocked</strong>
          ) : (
            <span className="text-ink-muted">locked</span>
          )}
          . Bridge study units:{" "}
          <strong className="text-ink">
            {
              BRIDGE_UNITS.filter(
                (u) => effectiveBridgeUnitsCompleted(progress)[u.id],
              ).length
            }
            /{BRIDGE_UNITS.length}
          </strong>
          . Bridge final (~75%):{" "}
          {getBridgeModulePassed(progress) ? (
            <strong className="text-sage">passed</strong>
          ) : (
            <span className="text-ink-muted">not complete</span>
          )}
          .
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-[10px]">
          <Link href="/learn/alphabet" className="text-sage hover:underline">
            Alphabet
          </Link>
          <Link
            href="/learn/foundation-exit"
            className="text-sage hover:underline"
          >
            Foundation exit
          </Link>
          <Link href="/learn/bridge" className="text-sage hover:underline">
            Bridge
          </Link>
          <Link href="/learn/tracks" className="text-sage hover:underline">
            Specialty tracks
          </Link>
          <Link href="/learn/fluency" className="text-sage hover:underline">
            Fluency path
          </Link>
          <Link href="/learn/yiddish" className="text-sage hover:underline">
            Yiddish
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 border-t-sage/25 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Specialty badges
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Modern tracks (news, literature, spoken) and traditional tracks
          (Talmudic / rabbinic Hebrew, Jewish Babylonian Aramaic) — Bronze,
          Silver, Gold per track. Unlocks after foundation exit + bridge pass;
          saved with course progress. Revisit any tier anytime.
        </p>
        <ul className="mt-3 space-y-2 text-[11px] text-ink">
          {SPECIALTY_TRACKS.map((track) => (
            <li key={track.id} className="flex flex-wrap items-baseline gap-2">
              <span className="font-medium">{track.title}</span>
              <span className="font-hebrew text-ink-muted">{track.domainHe}</span>
              <span className="text-ink-muted">
                {SPECIALTY_TIER_IDS.map((tier) => {
                  const ok = isSpecialtyTierRecordedPassed(
                    progress,
                    track.id,
                    tier,
                  );
                  return (
                    <span key={tier} className="mr-2 inline-flex items-center gap-0.5">
                      <span className="uppercase">{tier.slice(0, 1)}</span>
                      {ok ? (
                        <span className="text-sage">✓</span>
                      ) : (
                        <span className="text-ink-faint">·</span>
                      )}
                    </span>
                  );
                })}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/learn/tracks"
          className="mt-3 inline-block text-[10px] text-sage hover:underline"
        >
          Open specialty tracks →
        </Link>
      </div>

      <div className="rounded-2xl border border-ink/10 border-t-amber/20 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Yiddish course
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Separate track: own storage key{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
            hebrew-web-yiddish-v1
          </code>
          . MCQ sections in order.
        </p>
        <p className="mt-2 text-sm text-ink">
          <strong className="tabular-nums">
            {yiddishSectionsDoneCount(yiddishSnap)}
          </strong>
          <span className="text-ink-muted">
            {" "}
            / {YIDDISH_SECTIONS.length} sections complete
          </span>
        </p>
        <Link
          href="/learn/yiddish"
          className="mt-3 inline-block rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
        >
          Open Yiddish →
        </Link>
      </div>

      <div className="rounded-2xl border border-ink/10 border-t-amber/25 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Root drill (שׁוֹרָשִׁים)
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Graduated drill on static root families: each form is solid after three
          correct picks (same as legacy). Saved under{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
            rootDrill
          </code>{" "}
          in course storage; merged from legacy{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
            ivrit_lr
          </code>{" "}
          on Developer import.
        </p>
        <p className="mt-3 text-sm text-ink">
          <strong className="tabular-nums">{rootDrillSummary.familiesDone}</strong>
          <span className="text-ink-muted">
            {" "}
            / {rootDrillSummary.familyTotal} families complete
          </span>
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          <strong className="tabular-nums text-ink">
            {rootDrillSummary.solidForms}
          </strong>
          {" "}
          / {rootDrillSummary.totalForms} forms solid (≥3 hits each)
        </p>
        <Link
          href="/roots"
          className="mt-3 inline-block text-[10px] text-sage hover:underline"
        >
          Open roots hub →
        </Link>
      </div>

      <div className="rounded-2xl border border-ink/10 border-t-sage/20 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Word levels (course gates)
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Hebrew MCQ prompts in this app (plus legacy import) store a level{" "}
          <strong className="text-ink">0–5</strong> per lemma.{" "}
          <strong className="text-ink">Lv ≥ 2</strong> counts toward Bet–Dalet{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
            unlockMastered
          </code>
          , together with subsection completions — whichever is higher.
        </p>
        <p className="mt-3 text-sm text-ink">
          <strong className="tabular-nums">{trackedGe2}</strong>
          <span className="text-ink-muted">
            {" "}
            lemma{trackedGe2 === 1 ? "" : "s"} at lv ≥ 2
          </span>
          {trackedLemmas > 0 ? (
            <span className="text-xs text-ink-muted">
              {" "}
              · {trackedLemmas} tracked total
            </span>
          ) : null}
        </p>
        <ul className="mt-3 space-y-2 border-t border-ink/10 pt-3 text-[11px] text-ink-muted">
          {COURSE_LEVELS.map((L) => {
            const { mastered, total } = countCourseListMastery(
              L.n,
              progress.vocabLevels,
            );
            const gateMax = maxUnlockMasteredRequirementForLevel(L.n);
            const eff = effectiveCourseLevelMasteredCount(
              L.n,
              progress.completedSections,
              progress.vocabLevels,
            );
            return (
              <li key={L.n} className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-label text-[10px] uppercase tracking-wide text-ink">
                  {L.label.split("—")[0]?.trim() ?? `Level ${L.n}`}
                </span>
                <span className="text-right tabular-nums">
                  {mastered}/{total} prompts lv≥2
                  {gateMax != null ? (
                    <>
                      {" "}
                      · gate score {eff}
                      <span className="text-ink-faint">
                        {" "}
                        (up to {gateMax})
                      </span>
                    </>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
        <CourseMasteryList
          vocabLevels={progress.vocabLevels}
          activeLevel={progress.activeLevel}
        />
      </div>

      <div className="rounded-2xl border border-ink/10 border-t-amber/25 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Study streak
        </p>
        {hasStreak ? (
          <>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-ink">
              {streak.current}
              <span className="text-lg font-normal text-ink-muted">
                {" "}
                day{streak.current === 1 ? "" : "s"} current
              </span>
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Best run: <strong className="text-ink">{streak.longest}</strong>{" "}
              day{streak.longest === 1 ? "" : "s"}
              {streak.lastDay ? (
                <>
                  {" "}
                  · last activity (UTC date){" "}
                  <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
                    {streak.lastDay}
                  </code>
                </>
              ) : null}
            </p>
            <p className="mt-2 text-[11px] text-ink-faint">
              Counts a day when you answer a Learn drill or mark a section
              complete (same rules as legacy, UTC calendar).
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">
            Open a Learn section and answer a question or mark progress — your
            streak starts on the first activity each UTC day.
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <LegacyParityPanel variant="compact" />
        <HtmlMigrationTracker variant="compact" />
      </div>

      <div>
        <p className="mb-3 font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          By level
        </p>
        <ul className="space-y-3">
          {COURSE_LEVELS.map((L) => {
            const sections = getSectionsForLevel(L.n);
            const { done, total, pct } = completionRatio(
              sections,
              progress.completedSections,
            );
            return (
              <li
                key={L.n}
                className="rounded-xl border border-ink/10 bg-parchment-card/30 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label text-[11px] uppercase tracking-wide text-ink">
                    {L.label}
                  </span>
                  <span className="text-[10px] text-ink-muted">
                    {done}/{total} · {pct}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-parchment-deep/80">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${L.hex}, ${L.hex}99)`,
                    }}
                  />
                </div>
                <Link
                  href={`/learn/${L.n}`}
                  className="mt-2 inline-block text-[10px] text-sage hover:underline"
                >
                  Level {L.n} sections →
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-[11px] text-ink-faint">
        Active level for unlocks:{" "}
        <strong className="text-ink-muted">{progress.activeLevel}</strong> — set
        on the Learn page.
      </p>
    </div>
  );
}
