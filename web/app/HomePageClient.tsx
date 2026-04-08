"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CourseProgressHero } from "@/components/CourseProgressHero";
import { HomeHubCarousel } from "@/components/HomeHubCarousel";
import { HomeParshaHero } from "@/components/HomeParshaHero";
import { WelcomeScrollHero } from "@/components/WelcomeScrollHero";
import { COURSE_LEVELS, getSectionsForLevel } from "@/data/course";
import { getNextLearnUp } from "@/lib/learn-next-up";
import {
  LEARN_PROGRESS_EVENT,
  createEmptyLearnProgressState,
  loadLearnProgress,
  normalizeStreak,
  type LearnProgressState,
} from "@/lib/learn-progress";
import {
  YIDDISH_PROGRESS_EVENT,
  loadYiddishProgress,
} from "@/lib/yiddish-progress";

export function HomePageClient() {
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );
  const [yiddishTick, setYiddishTick] = useState(0);

  const sync = useCallback(() => {
    setProgress(loadLearnProgress());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, [sync]);

  useEffect(() => {
    const onY = () => setYiddishTick((t) => t + 1);
    window.addEventListener(YIDDISH_PROGRESS_EVENT, onY);
    return () => window.removeEventListener(YIDDISH_PROGRESS_EVENT, onY);
  }, []);

  const { totalDone, totalSecs } = useMemo(() => {
    let done = 0;
    let total = 0;
    for (const L of COURSE_LEVELS) {
      const secs = getSectionsForLevel(L.n);
      total += secs.length;
      done += secs.filter((s) => progress.completedSections[s.id]).length;
    }
    return { totalDone: done, totalSecs: total };
  }, [progress.completedSections]);

  const streak = normalizeStreak(progress.streak);
  const attempts = progress.mcqAttempts ?? 0;
  const correct = progress.mcqCorrect ?? 0;

  const nextUp = useMemo(
    () =>
      getNextLearnUp(progress, {
        yiddishProgress: loadYiddishProgress(),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yiddishTick bumps storage-driven updates
    [progress, yiddishTick],
  );

  return (
    <div className="space-y-6">
      <WelcomeScrollHero />
      <HomeHubCarousel />
      <HomeParshaHero />

      <div>
        <CourseProgressHero
          sectionsDone={totalDone}
          sectionsTotal={totalSecs}
          streakCurrent={streak.current}
          mcqAttempts={attempts}
          mcqCorrect={correct}
          heading="Your progress"
          intro="Sections you’ve finished, the streak you’re building, and how your practice answers are landing — sign in to sync the course and saved lemmas across devices."
          continueHref={nextUp.href}
          continueLabel={`${nextUp.label} →`}
        />
        <p className="mx-auto mt-3 max-w-md text-center text-[10px] text-ink-faint">
          <Link href="/learn/alphabet" className="text-sage underline">
            Try Alef–Bet (א–ד) without signing in
          </Link>
          . The full Alef–Dalet path, practice hubs, and progress tracking require an
          account. For backups and merges, open{" "}
          <strong className="font-medium text-ink-muted/90">Advanced → Developer</strong>.
        </p>
      </div>
    </div>
  );
}
