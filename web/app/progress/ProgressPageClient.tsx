"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CourseMasteryList } from "@/components/CourseMasteryList";
import { CourseProgressHero } from "@/components/CourseProgressHero";
import { ProgressLegacyDashboard } from "@/components/ProgressLegacyDashboard";
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
  type SpecialtyTierId,
} from "@/data/specialty-tracks";
import { YIDDISH_SECTIONS } from "@/data/yiddish-course";
import { STATIC_ROOT_FAMILIES } from "@/data/course-roots";
import { ROOTS_GROUPS } from "@/data/roots-curriculum";
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
  getNextSpecialtyTierForTrack,
  isBridgeUnlocked,
  isFoundationCourseComplete,
  isSpecialtyTierRecordedPassed,
  isSpecialtyTracksUnlocked,
  createEmptyLearnProgressState,
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

  const specialtyUnlocked = isSpecialtyTracksUnlocked(progress);

  const tierBadgeShell: Record<SpecialtyTierId, string> = {
    bronze: "border-amber-900/40 bg-amber-950/[0.07]",
    silver: "border-slate-500/45 bg-slate-600/[0.08]",
    gold: "border-yellow-700/45 bg-yellow-600/[0.1]",
  };

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
          Course and Yiddish progress stay in this browser until you add an
          account. To move devices, open{" "}
          <strong className="text-ink">Advanced → Developer</strong> for JSON
          backup (Hebrew + optional Yiddish) or optional cloud sync when your
          host supports it.
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
            href="/developer/tools#dev-cloud-backup"
            className="text-sage underline hover:text-sage/90"
          >
            Advanced → Developer → Cloud backup
          </Link>
          . Uses a per-browser sync key (not a login). If you self-host, see{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
            docs/cloud-progress.md
          </code>{" "}
          in the repo for setup and security notes.
        </p>
      </div>

      <CourseProgressHero
        sectionsDone={totalDone}
        sectionsTotal={totalSecs}
        streakCurrent={streak.current}
        mcqAttempts={progress.mcqAttempts ?? 0}
        mcqCorrect={progress.mcqCorrect ?? 0}
        heading="Your snapshot"
      />

      <ProgressLegacyDashboard progress={progress} />

      {(progress.mcqAttempts ?? 0) === 0 ? (
        <p className="text-[11px] text-ink-muted">
          First drill pick starts your lifetime practice tally — open{" "}
          <Link href="/study" className="text-sage underline">
            Study
          </Link>{" "}
          or any Learn MCQ.
        </p>
      ) : null}

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
          <Link href="/learn" className="text-sage hover:underline">
            Learn path (tap i)
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
          Post-bridge domain tracks: modern (news, literature, spoken) and
          traditional (Talmudic / rabbinic Hebrew, Jewish Babylonian Aramaic).
          Each runs Bronze → Silver → Gold (MCQ banks grow stricter). Badges live
          here; drills stay open for review. Outcomes and links below match how
          the app expects you to mix Reading, Study, and Library with tiers.
        </p>
        <ul className="mt-4 space-y-4 text-[11px] text-ink">
          {SPECIALTY_TRACKS.map((track) => {
            const next = specialtyUnlocked
              ? getNextSpecialtyTierForTrack(progress, track.id)
              : null;
            const trackComplete =
              specialtyUnlocked &&
              SPECIALTY_TIER_IDS.every((tier) =>
                isSpecialtyTierRecordedPassed(progress, track.id, tier),
              );
            return (
              <li
                key={track.id}
                className="rounded-xl border border-ink/10 bg-parchment-deep/20 p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-ink">{track.title}</span>
                    <span className="ml-2 font-hebrew text-ink-muted">
                      {track.domainHe}
                    </span>
                  </div>
                  {specialtyUnlocked ? (
                    next ? (
                      <Link
                        href={next.href}
                        className="shrink-0 font-label text-[9px] uppercase tracking-wide text-sage underline"
                      >
                        Next: {next.tier} →
                      </Link>
                    ) : trackComplete ? (
                      <span className="font-label text-[9px] uppercase tracking-wide text-sage">
                        Complete
                      </span>
                    ) : (
                      <span className="text-[10px] text-ink-faint">—</span>
                    )
                  ) : null}
                </div>
                <p className="mt-1 text-[11px] text-ink-muted">{track.blurb}</p>
                <p className="mt-2 font-label text-[8px] uppercase tracking-wide text-ink-faint">
                  Aims
                </p>
                <ul className="mt-1 list-inside list-disc text-[11px] leading-relaxed text-ink-muted">
                  {track.outcomes.slice(0, 3).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-ink/10 pt-2">
                  {track.practiceLinks.map((pl) => (
                    <Link
                      key={pl.href + pl.label}
                      href={pl.href}
                      className="text-[10px] text-sage underline"
                    >
                      {pl.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SPECIALTY_TIER_IDS.map((tier) => {
                    const ok = isSpecialtyTierRecordedPassed(
                      progress,
                      track.id,
                      tier,
                    );
                    return (
                      <div
                        key={tier}
                        title={track.tierGoals[tier]}
                        className={`min-w-[5.5rem] flex-1 rounded-lg border px-2 py-1.5 ${tierBadgeShell[tier]}`}
                      >
                        <p className="font-label text-[8px] uppercase tracking-wide text-ink-muted">
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </p>
                        <p className="mt-0.5 text-center text-sm">
                          {ok ? (
                            <span className="text-sage">✓</span>
                          ) : (
                            <span className="text-ink-faint">—</span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
        <Link
          href="/learn/tracks"
          className="mt-4 inline-block rounded-lg bg-sage px-3 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
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
          correct answers. Saved with your course progress (Advanced → Developer
          can merge older device data).
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
        <p className="mt-3 font-label text-[9px] uppercase tracking-[0.12em] text-ink-faint">
          Roots study groups
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {ROOTS_GROUPS.map((g) => {
            const st = progress.rootsCurriculum?.groups[g.id];
            const label = st?.testPassed
              ? "Done"
              : st?.introSeen
                ? "In progress"
                : "Not started";
            return (
              <li key={g.id}>
                <Link
                  href={`/roots?group=${encodeURIComponent(g.id)}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-ink/8 bg-parchment-deep/20 px-2.5 py-1.5 text-[11px] text-ink hover:border-sage/30 hover:bg-parchment-deep/40"
                >
                  <span className="min-w-0 truncate">
                    {g.title.replace(/^Group \d+ — /, "")}
                  </span>
                  <span className="shrink-0 text-[10px] text-ink-muted">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
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
          Each Hebrew word you practice can reach familiarity{" "}
          <strong className="text-ink">0–5</strong>.{" "}
          <strong className="text-ink">Level 2+</strong> counts toward Bet–Dalet
          comprehension gates together with finished subsections — whichever is
          higher for you.
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
              complete (UTC calendar).
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">
            Open a Learn section and answer a question or mark progress — your
            streak starts on the first activity each UTC day.
          </p>
        )}
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
