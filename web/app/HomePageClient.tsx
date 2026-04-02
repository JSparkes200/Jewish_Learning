"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CourseProgressHero } from "@/components/CourseProgressHero";
import { HomeHubCarousel } from "@/components/HomeHubCarousel";
import { HomeParshaHero } from "@/components/HomeParshaHero";
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
          intro="Course sections, streak, and practice accuracy — all saved in this browser."
          continueHref={nextUp.href}
          continueLabel={`${nextUp.label} →`}
        />
        <p className="mx-auto mt-3 max-w-md text-center text-[10px] text-ink-faint">
          No account yet — progress stays on this device. To move it, use{" "}
          <strong className="font-medium text-ink-muted/90">Advanced → Developer</strong>{" "}
          for backup options.
        </p>
      </div>
    </div>
  );
}
