"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { Hebrew } from "@/components/Hebrew";
import { ReadingTapCarousel } from "@/components/ReadingTapCarousel";
import { READING_HUB_ENTRIES } from "@/data/reading-hub";
import {
  LEARN_PROGRESS_EVENT,
  createEmptyLearnProgressState,
  loadLearnProgress,
  type LearnProgressState,
} from "@/lib/learn-progress";

function ReadingHelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[min(100vw-2rem,26rem)] rounded-2xl border border-ink/12 bg-parchment-card p-5 shadow-elevated-lg">
      <h2
        id="reading-help-title"
        className="font-label text-[10px] uppercase tracking-[0.2em] text-sage"
      >
        Reading &amp; comprehension
      </h2>
      <p className="mt-2 text-sm font-medium text-ink">
        How progress is counted and where to practise
      </p>
      <p className="mt-2 text-[11px] text-ink-faint">
        Press <kbd className="rounded border border-ink/15 bg-parchment-deep/50 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>{" "}
        to close this panel.
      </p>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
        <li>
          <strong className="text-ink">Passage carousel</strong> — Cards appear
          as you unlock them in the course (first story, then each level).
          Jewish texts open one at a time: after you open one, the next appears.
          Open the center card, tap words to hear them, and use{" "}
          <strong className="text-ink">Start exercises</strong> when a passage
          includes quizzes. Correct answers count toward your daily streak and
          practice stats like other Learn drills.
        </li>
        <li>
          <strong className="text-ink">Longer comprehension</strong> — Full
          Hebrew passages with multiple questions live in{" "}
          <Link href="/learn" className="text-sage underline hover:text-sage/90">
            Learn
          </Link>{" "}
          as the sections marked comprehension in each level.
        </li>
        <li>
          <strong className="text-ink">Stories &amp; mini-quizzes</strong> — Use
          the level rows below (Aleph guided read, level stories). They reinforce
          vocabulary and count toward the same progress storage.
        </li>
        <li>
          <strong className="text-ink">Review</strong> —{" "}
          <Link href="/study" className="text-sage underline hover:text-sage/90">
            Study
          </Link>{" "}
          suggests re-runs and ties into your active level.
        </li>
        <li>
          <strong className="text-ink">Active level</strong> — The carousel
          filters some passages by your active level (set on the{" "}
          <Link href="/learn" className="text-sage underline hover:text-sage/90">
            Learn
          </Link>{" "}
          home). You can still open any hub link below anytime.
        </li>
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="btn-elevated-primary mt-6 w-full"
      >
        Close
      </button>
    </div>
  );
}

export function ReadingPageClient() {
  const { openModal, closeModal } = useAppShell();
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );

  const sync = useCallback(() => {
    setProgress(loadLearnProgress());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, [sync]);

  const active = progress.activeLevel;

  const openReadingHelp = useCallback(() => {
    openModal(
      <ReadingHelpModal
        onClose={() => {
          closeModal();
        }}
      />,
    );
  }, [openModal, closeModal]);

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <ReadingTapCarousel progress={progress} />

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={openReadingHelp}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink/15 bg-parchment-deep/50 font-serif text-base font-semibold italic leading-none text-ink-muted shadow-sm transition hover:border-sage/40 hover:bg-sage/10 hover:text-ink"
          aria-label="How reading progress and exercises work"
        >
          i
        </button>
        <div className="min-w-0 flex-1">
          <p
            id="reading-hubs-heading"
            className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted"
          >
            Stories &amp; reading hubs
          </p>
          <Hebrew
            as="p"
            className="mt-1 text-xl leading-snug text-ink sm:text-2xl"
          >
            אָלֶף עַד דָּלֶת
          </Hebrew>
          <p className="mt-1 text-xs text-ink-faint">
            Aleph guided read, level stories, and library — tap a row to open.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {READING_HUB_ENTRIES.map((e) => {
          const later = e.minLevel > active;
          return (
            <li key={e.id}>
              <Link
                href={e.href}
                className={`block rounded-2xl border bg-parchment-card/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${e.borderClass} ${
                  later ? "opacity-85" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden>
                    {e.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label text-[11px] uppercase tracking-wide text-ink">
                        {e.label}
                      </span>
                      <span className="rounded-md bg-parchment-deep/60 px-2 py-0.5 font-mono text-[9px] text-ink-muted">
                        L{e.minLevel}+
                      </span>
                      {later ? (
                        <span className="text-[9px] uppercase tracking-wide text-amber">
                          Later track
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">{e.description}</p>
                  </div>
                  <span className="shrink-0 text-rust" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="rounded-xl border border-ink/10 bg-parchment-deep/25 px-3 py-2.5 text-center text-[11px] text-ink-muted">
        Streak, section counts, and word levels are on{" "}
        <Link href="/progress" className="font-medium text-sage underline">
          Progress
        </Link>
        — useful to see how reading and comprehension drills add up.
      </p>

      <p className="flex flex-wrap justify-center gap-4 border-t border-ink/10 pt-4 text-[11px]">
        <Link href="/study" className="text-sage underline">
          Study
        </Link>
        <Link href="/library" className="text-sage underline">
          Library
        </Link>
        <Link href="/progress" className="text-sage underline">
          Progress
        </Link>
      </p>
    </div>
  );
}
