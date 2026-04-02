"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );
  const [developerMode, setDeveloperMode] = useState(false);

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
      <LearnJourneyCarousel
        progress={progress}
        developerMode={developerMode}
      />

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={openPathOverview}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink/15 bg-parchment-deep/50 font-serif text-base font-semibold italic leading-none text-ink-muted shadow-sm transition hover:border-sage/40 hover:bg-sage/10 hover:text-ink"
          aria-label="Full course path, goals, and how stages connect"
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
            Swipe the carousel — each card opens details, unlock rules, and
            links. Progress saves in this browser.
          </p>
        </div>
      </div>

      {showAlphabetBanner ? (
        <div className="rounded-2xl border border-amber/35 bg-amber/10 px-3 py-3">
          <p className="font-label text-[9px] uppercase tracking-[0.18em] text-amber">
            Alphabet (optional)
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            New to the letters? Optional track — dismiss if you already read
            Hebrew.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href="/learn/alphabet"
              className="rounded-lg bg-sage px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Alphabet
            </Link>
            <button
              type="button"
              onClick={dismissAlphabetBanner}
              className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-ink-muted hover:bg-parchment-deep/40"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {allLevelsComplete ? (
        <div className="rounded-2xl border border-sage/35 bg-sage/10 px-3 py-3">
          <p className="font-label text-[9px] uppercase tracking-[0.18em] text-sage">
            Milestone
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            Alef–Dalet subsections complete.
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Next: foundation exit, bridge, specialty badges.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href="/learn/foundation-exit"
              className="rounded-lg bg-sage px-3 py-1.5 font-label text-[9px] uppercase text-white hover:brightness-110"
            >
              Foundation exit
            </Link>
            <Link
              href="/progress"
              className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-ink-muted hover:bg-parchment-deep/40"
            >
              Progress
            </Link>
          </div>
        </div>
      ) : activeLevelComplete && progress.activeLevel < 4 ? (
        <div className="rounded-2xl border border-amber/35 bg-amber/10 px-3 py-3">
          <p className="font-label text-[9px] uppercase tracking-[0.18em] text-amber">
            Level {progress.activeLevel} complete
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Bump <strong className="text-ink">active level</strong> for Next up,
            or open the next level from the carousel.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                persist({
                  ...progress,
                  activeLevel: progress.activeLevel + 1,
                })
              }
              className="rounded-lg bg-sage px-3 py-1.5 font-label text-[9px] uppercase text-white hover:brightness-110"
            >
              Active → {progress.activeLevel + 1}
            </button>
            <Link
              href={`/learn/${progress.activeLevel + 1}`}
              className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-ink hover:bg-parchment-deep/40"
            >
              Open level {progress.activeLevel + 1}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 border-t border-ink/10 pt-4 text-[10px] text-ink-muted">
        {QUICK_LINKS.map((x) => (
          <Link
            key={x.href}
            href={x.href}
            className="text-sage underline hover:text-sage/90"
          >
            {x.label}
          </Link>
        ))}
      </div>

      <details className="rounded-xl border border-ink/10 bg-parchment-card/30 px-3 py-2">
        <summary className="cursor-pointer font-label text-[10px] uppercase tracking-wide text-ink-muted">
          Progress controls
        </summary>
        <p className="mt-2 text-[10px] text-ink-faint">
          Active level gates which foundation band is treated as current for Next
          up and unlock hints (developer bypass unlocks all carousel levels).
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => persist({ ...progress, activeLevel: n })}
              className={`rounded-lg border px-2 py-1 font-label text-[9px] uppercase tracking-wide ${
                progress.activeLevel === n
                  ? "border-sage bg-sage/15 text-sage"
                  : "border-ink/15 hover:bg-parchment-deep/40"
              }`}
            >
              Level {n}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
