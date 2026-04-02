"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { Hebrew } from "@/components/Hebrew";
import { NumbersBrowseCards } from "@/components/NumbersBrowseCards";
import { NumbersHubCarousel } from "@/components/NumbersHubCarousel";
import { NumbersListenDrill } from "@/components/NumbersListenDrill";
import { NumbersPricePeek } from "@/components/NumbersPricePeek";
import { NumbersTopicMcqDrill } from "@/components/NumbersTopicMcqDrill";
import { NUMBERS_HUB_ENTRIES } from "@/data/numbers-hub";
import {
  type GradedPracticeContext,
  LEARN_PROGRESS_EVENT,
  createEmptyLearnProgressState,
  loadLearnProgress,
  markNumbersDrillEngaged,
  recordGradedAnswer,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  touchDailyStreak,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { isNumbersTier2Unlocked } from "@/lib/numbers-carousel";

function NumbersHelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[min(100vw-2rem,26rem)] rounded-2xl border border-ink/12 bg-parchment-card p-5 shadow-elevated-lg">
      <h2
        id="numbers-help-title"
        className="font-label text-[10px] uppercase tracking-[0.2em] text-sage"
      >
        Numbers hub
      </h2>
      <p className="mt-2 text-sm font-medium text-ink">
        How tiles unlock and where practice is saved
      </p>
      <p className="mt-2 text-[11px] text-ink-faint">
        Press{" "}
        <kbd className="rounded border border-ink/15 bg-parchment-deep/50 px-1.5 py-0.5 font-mono text-[10px]">
          Esc
        </kbd>{" "}
        to close this panel.
      </p>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
        <li>
          <strong className="text-ink">Carousel</strong> — After{" "}
          <strong className="text-ink">1-nums</strong> in Learn, foundation tiles
          appear (cards, listen, grammar, prices). Ordinals, days, and time
          appear once you have started Bet (any work in level 2). Opening a tile
          scrolls to that section and recent tiles sort toward the front.
        </li>
        <li>
          <strong className="text-ink">Amber dot</strong> — Shown until you have
          tried that drill at least once (a pick, swipe, or listen on cards /
          prices). The grammar note has no drill, so no dot.
        </li>
        <li>
          <strong className="text-ink">Course overlap</strong> —{" "}
          <Link href="/learn/1/1-nums" className="text-sage underline hover:text-sage/90">
            Aleph · Numbers
          </Link>{" "}
          has MCQs and the same listen exercise; graded answers share the same
          progress storage as the rest of Learn.
        </li>
        <li>
          <strong className="text-ink">Review</strong> —{" "}
          <Link href="/study" className="text-sage underline hover:text-sage/90">
            Study
          </Link>{" "}
          and{" "}
          <Link href="/progress" className="text-sage underline hover:text-sage/90">
            Progress
          </Link>{" "}
          show streaks, counts, and word levels from those answers.
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

export function NumbersPageClient() {
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

  const tier2 = isNumbersTier2Unlocked(progress);

  const onMarkNumbersEngaged = useCallback((id: string) => {
    const p = loadLearnProgress();
    const next = markNumbersDrillEngaged(p, id);
    if (next !== p) saveLearnProgress(next);
  }, []);

  const onPracticeAnswer = useCallback(
    (correct: boolean, ctx?: GradedPracticeContext) => {
      const p = loadLearnProgress();
      let n = touchDailyStreak(p);
      n = recordGradedAnswer(n, correct, ctx);
      n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
      if (ctx?.numbersHubEngageId) {
        n = markNumbersDrillEngaged(n, ctx.numbersHubEngageId);
      }
      saveLearnProgress(n);
    },
    [],
  );

  const openNumbersHelp = useCallback(() => {
    openModal(
      <NumbersHelpModal
        onClose={() => {
          closeModal();
        }}
      />,
    );
  }, [openModal, closeModal]);

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <NumbersHubCarousel progress={progress} />

      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={openNumbersHelp}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink/15 bg-parchment-deep/50 font-serif text-base font-semibold italic leading-none text-ink-muted shadow-sm transition hover:border-sage/40 hover:bg-sage/10 hover:text-ink"
          aria-label="How numbers hub progress works"
        >
          i
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Topics on this page
          </p>
          <Hebrew
            as="p"
            className="mt-1 text-xl leading-snug text-ink sm:text-2xl"
          >
            מִסְפָּרִים
          </Hebrew>
          <p className="mt-1 text-xs text-ink-faint">
            Cardinals, ordinals, days, time, and prices — jump from the carousel
            or list below.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {NUMBERS_HUB_ENTRIES.map((e) => {
          const later = e.minLevel === 2 && !tier2;
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
                      {e.minLevel === 2 ? (
                        <span className="rounded-md bg-parchment-deep/60 px-2 py-0.5 font-mono text-[9px] text-ink-muted">
                          Bet+
                        </span>
                      ) : null}
                      {later ? (
                        <span className="text-[9px] uppercase tracking-wide text-amber">
                          Unlocks with Bet work
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
        — useful to see how numbers drills add up with the rest of Learn.
      </p>

      <section id="cards" className="scroll-mt-24">
        <NumbersBrowseCards onEngage={() => onMarkNumbersEngaged("cards")} />
      </section>

      <section id="listen" className="scroll-mt-24">
        <NumbersListenDrill onPracticeAnswer={onPracticeAnswer} />
      </section>

      <section id="ordinal" className="scroll-mt-24">
        <NumbersTopicMcqDrill
          variant="ordinal"
          onPracticeAnswer={onPracticeAnswer}
        />
      </section>

      <section id="days" className="scroll-mt-24">
        <NumbersTopicMcqDrill
          variant="days"
          onPracticeAnswer={onPracticeAnswer}
        />
      </section>

      <section id="time" className="scroll-mt-24">
        <NumbersTopicMcqDrill
          variant="time"
          onPracticeAnswer={onPracticeAnswer}
        />
      </section>

      <section id="price" className="scroll-mt-24">
        <NumbersPricePeek onEngage={() => onMarkNumbersEngaged("price")} />
      </section>

      <section
        id="grammar"
        className="scroll-mt-24 rounded-2xl border border-ink/10 bg-parchment-card/50 p-5"
      >
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Grammar note: number gender
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Hebrew numbers have{" "}
          <strong className="text-ink">masculine and feminine</strong> forms
          that can feel reversed — the feminine form is often used with
          masculine nouns, and vice versa.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-ink/10 bg-parchment-deep/30 p-3 text-center">
            <p className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-faint">
              With masculine nouns
            </p>
            <Hebrew className="mt-2 block text-xl text-ink">
              שְׁלֹשָׁה סְפָרִים
            </Hebrew>
            <p className="mt-1 text-[11px] text-ink-muted">
              three books (f. number)
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-parchment-deep/30 p-3 text-center">
            <p className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-faint">
              With feminine nouns
            </p>
            <Hebrew className="mt-2 block text-xl text-ink">
              שָׁלֹשׁ עָרִים
            </Hebrew>
            <p className="mt-1 text-[11px] text-ink-muted">
              three cities (m. number)
            </p>
          </div>
        </div>
      </section>

      <p className="flex flex-wrap justify-center gap-4 border-t border-ink/10 pt-4 text-[11px]">
        <Link href="/study" className="text-sage underline">
          Study
        </Link>
        <Link href="/learn" className="text-sage underline">
          Learn
        </Link>
        <Link href="/progress" className="text-sage underline">
          Progress
        </Link>
      </p>
    </div>
  );
}
