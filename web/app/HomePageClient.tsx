"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CinematicIntro } from "@/components/CinematicIntro";
import { CourseProgressHero } from "@/components/CourseProgressHero";
import { HomeHubCarousel } from "@/components/HomeHubCarousel";
import { HomeParshaHero } from "@/components/HomeParshaHero";
import { COURSE_LEVELS, getSectionsForLevel } from "@/data/course";
import { getContinueDestination } from "@/lib/app-activity";
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

export function HomePageClient({
  serverSignedIn = false,
}: {
  /** From `auth()` on the server so signed-in users do not rely on client hydration for hiding the welcome. */
  serverSignedIn?: boolean;
} = {}) {
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

  const continueCta = useMemo(
    () => getContinueDestination(progress, loadYiddishProgress()),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yiddishTick bumps storage-driven updates
    [progress, yiddishTick],
  );

  return (
    <>
      <CinematicIntro serverSignedIn={serverSignedIn} />
      <div className="mx-auto max-w-6xl pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-20 pt-6 sm:pt-10">
        {/* Two columns: [ menu + progress ] | parsha — shared w-44 rail matches hub + progress tiles */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-6 lg:gap-8">
          <div className="mx-auto flex w-44 shrink-0 flex-col md:mx-0">
            <div className="sticky top-4 z-50 flex w-full flex-col gap-6">
              <HomeHubCarousel />
              <div className="w-full">
                <CourseProgressHero
                  sectionsDone={totalDone}
                  sectionsTotal={totalSecs}
                  streakCurrent={streak.current}
                  mcqAttempts={attempts}
                  mcqCorrect={correct}
                  heading="Your progress"
                expandableHub
                hubPanelAnchor="right-edge"
                continueHref={continueCta.href}
                  continueLabel={
                    continueCta.source === "last"
                      ? `Continue · ${continueCta.label} →`
                      : `${continueCta.label} →`
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col pt-1 md:pt-0">
            <div className="w-full min-w-0 max-w-none lg:max-w-2xl lg:pl-2 xl:max-w-3xl">
              <div
                className="mb-3 flex items-center gap-3 rounded-xl border border-ink/12 bg-gradient-to-b from-white/55 to-white/35 px-3 py-2 shadow-[0_8px_24px_-12px_rgba(44,36,22,0.12)] backdrop-blur-md"
                aria-hidden
              >
                <div className="flex gap-1.5">
                  <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]/95 shadow-inner" />
                  <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]/95 shadow-inner" />
                  <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]/90 shadow-inner" />
                </div>
                <p className="font-label text-[8px] uppercase tracking-[0.2em] text-ink-faint">
                  Parashat hashavua
                </p>
              </div>
              <div className="relative rounded-2xl shadow-[0_32px_64px_-24px_rgba(30,22,14,0.35)] ring-1 ring-ink/12">
                <HomeParshaHero />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
