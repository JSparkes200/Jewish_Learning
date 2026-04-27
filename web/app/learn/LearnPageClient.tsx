"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { LearnJourneyCarousel } from "@/components/LearnJourneyCarousel";
import { LearnPathOverviewModal } from "@/components/LearnPathOverviewModal";
import {
  FOUNDATION_TRACK_INTRO,
  getSectionsForLevel,
} from "@/data/course";
import {
  DEVELOPER_MODE_EVENT,
  getDeveloperModeBypass,
} from "@/lib/developer-mode";
import {
  LEARN_CLOUD_HYDRATED_EVENT,
  LEARN_PROGRESS_EVENT,
  completionRatio,
  createEmptyLearnProgressState,
  isFoundationCourseComplete,
  loadLearnProgress,
  resolveAlphabetGateStatus,
  saveLearnProgress,
  setAlphabetGate,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { getUniversalResumePath } from "@/lib/app-activity";

const QUICK_LINKS: readonly { href: string; label: string }[] = [
  { href: "/learn/alphabet", label: "Alphabet" },
  { href: "/learn/foundation-exit", label: "Exit" },
  { href: "/learn/bridge", label: "Bridge" },
  { href: "/learn/tracks", label: "Tracks" },
  { href: "/learn/1/1-read", label: "Read" },
  { href: "/learn/1/1-nums", label: "Nums" },
  { href: "/roots", label: "Roots" },
  { href: "/learn/yiddish", label: "Yiddish" },
];

export function LearnPageClient() {
  const { openModal, closeModal } = useAppShell();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeOnceRef = useRef(false);
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );
  const [developerMode, setDeveloperMode] = useState(false);

  /** After cloud merge (if any), send `/learn` → last foundation section unless `?hub=1`. */
  useEffect(() => {
    if (searchParams.get("hub") === "1") return;
    const run = () => {
      if (resumeOnceRef.current) return;
      const path = getUniversalResumePath(loadLearnProgress());
      if (path) {
        resumeOnceRef.current = true;
        router.replace(path);
      }
    };
    const w = window as unknown as { hebrewLearnCloudReady?: boolean };
    if (w.hebrewLearnCloudReady) run();
    window.addEventListener(LEARN_CLOUD_HYDRATED_EVENT, run);
    return () => window.removeEventListener(LEARN_CLOUD_HYDRATED_EVENT, run);
  }, [router, searchParams]);

  useEffect(() => {
    const sync = () => setProgress(loadLearnProgress());
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, []);

  useEffect(() => {
    const sync = () => setDeveloperMode(getDeveloperModeBypass());
    sync();
    window.addEventListener(DEVELOPER_MODE_EVENT, sync);
    return () => window.removeEventListener(DEVELOPER_MODE_EVENT, sync);
  }, []);

  const persist = useCallback((next: LearnProgressState) => {
    setProgress(next);
    saveLearnProgress(next);
  }, []);

  const activeSections = useMemo(
    () => getSectionsForLevel(progress.activeLevel),
    [progress.activeLevel],
  );
  const activeProgress = useMemo(
    () => completionRatio(activeSections, progress.completedSections),
    [activeSections, progress.completedSections],
  );
  const activeLevelComplete =
    activeSections.length > 0 && activeProgress.pct === 100;
  const allLevelsComplete = useMemo(
    () => isFoundationCourseComplete(progress),
    [progress],
  );

  const alphabetEffective = useMemo(
    () => resolveAlphabetGateStatus(progress),
    [progress],
  );
  const showAlphabetBanner =
    alphabetEffective === "unseen" || alphabetEffective === "in_progress";

  const dismissAlphabetBanner = useCallback(() => {
    const cur = loadLearnProgress();
    persist(setAlphabetGate(cur, "skipped"));
  }, [persist]);

  const openPathOverview = useCallback(() => {
    openModal(
      <LearnPathOverviewModal
        onClose={() => {
          closeModal();
        }}
      />,
    );
  }, [openModal, closeModal]);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <div id="journey" className="scroll-mt-6">
          <Suspense
            fallback={
              <div className="h-[min(42vh,372px)] animate-pulse rounded-2xl border border-ink/10 bg-parchment-deep/30 sm:h-[min(44vh,392px)]" />
            }
          >
            <LearnJourneyCarousel
              progress={progress}
              developerMode={developerMode}
            />
          </Suspense>
        </div>

        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={openPathOverview}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink/15 bg-parchment-deep/50 font-serif text-base font-semibold italic leading-none text-ink-muted shadow-sm transition hover:border-sage/40 hover:bg-sage/10 hover:text-ink"
            aria-label="Open map of the full course path and how each stage connects"
          >
            i
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Learn home
            </p>
            <h1 className="font-hebrew mt-1 text-xl text-ink sm:text-2xl">
              מַסְלוּל הַלִּמּוּד
            </h1>
            <p className="mt-1 text-xs leading-snug text-ink-muted">
              {FOUNDATION_TRACK_INTRO}
            </p>
            <p className="mt-1 text-[10px] text-ink-faint">
              Opening Learn without “map” sends you back to your last lesson.
              Progress stays in this browser; when you’re signed in it also syncs
              to your account when the server is configured. Use the Progress page
              for milestones, or add{" "}
              <code className="rounded bg-ink/5 px-1">?hub=1</code> to this URL to
              always land here.
            </p>
          </div>
        </div>
      </div>

      {showAlphabetBanner ? (
        <div className="banner-amber rounded-2xl">
          <p className="section-label text-amber">Alphabet (optional)</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
            New to the letters? This track is optional — dismiss it if you
            already read Hebrew comfortably.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/learn/alphabet"
              className="rounded-lg bg-sage px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Alphabet
            </Link>
            <button
              type="button"
              onClick={dismissAlphabetBanner}
              className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/40"
            >
              Not needed
            </button>
          </div>
        </div>
      ) : null}

      {allLevelsComplete ? (
        <div className="banner-sage rounded-2xl">
          <p className="section-label text-sage">
            Milestone
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            You’ve cleared every Alef–Dalet subsection — that’s a real milestone.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Next up: foundation exit, the bridge, and the specialty badges when
            you’re ready.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/learn/foundation-exit"
              className="rounded-lg bg-sage px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Foundation exit
            </Link>
            <Link
              href="/progress"
              className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/40"
            >
              Progress
            </Link>
          </div>
        </div>
      ) : activeLevelComplete && progress.activeLevel < 4 ? (
        <div className="banner-amber rounded-2xl">
          <p className="section-label text-amber">
            Level {progress.activeLevel} complete
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
            Bump <strong className="text-ink">active level</strong> for Next up,
            or open the next level from the carousel.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                persist({
                  ...progress,
                  activeLevel: progress.activeLevel + 1,
                })
              }
              className="rounded-lg bg-sage px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Active → {progress.activeLevel + 1}
            </button>
            <Link
              href={`/learn/${progress.activeLevel + 1}`}
              className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-ink transition hover:bg-parchment-deep/40"
            >
              Open level {progress.activeLevel + 1}
            </Link>
          </div>
        </div>
      ) : null}

      {/* Placement test nudge — only for early learners */}
      {progress.activeLevel === 1 && activeProgress.done < 3 ? (
        <div className="rounded-xl border border-ink/10 bg-parchment-card/50 px-4 py-3">
          <p className="section-label">Already know some Hebrew?</p>
          <p className="mt-1 text-xs text-ink-muted">
            Take a 12-question quiz to find your starting level and skip the
            material you already know.
          </p>
          <Link
            href="/learn/placement"
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-ink/8 px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-ink-muted transition hover:bg-ink/15 hover:text-ink"
          >
            Placement quiz
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center gap-2 border-t border-ink/10 pt-4">
        {QUICK_LINKS.map((x) => (
          <Link key={x.href} href={x.href} className="nav-chip">
            {x.label}
          </Link>
        ))}
        <Link href="/learn/placement" className="nav-chip">
          Placement
        </Link>
        <Link href="/grammar" className="nav-chip">
          Grammar
        </Link>
      </div>

      {developerMode ? (
        <details className="rounded-xl border border-ink/10 bg-parchment-card/30 px-3 py-2">
          <summary className="cursor-pointer section-label">
            Progress controls
          </summary>
          <p className="mt-2 text-[10px] text-ink-faint">
            Active level gates which foundation band is treated as current for
            Next up and unlock hints (developer bypass unlocks all carousel
            levels).
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => persist({ ...progress, activeLevel: n })}
                className={`rounded-lg border px-3 py-1.5 font-label text-[10px] uppercase tracking-wide transition ${
                  progress.activeLevel === n
                    ? "border-sage bg-sage/15 text-sage"
                    : "border-ink/15 text-ink-muted hover:bg-parchment-deep/40"
                }`}
              >
                Level {n}
              </button>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
