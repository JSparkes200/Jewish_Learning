"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RootDrillExplorer } from "@/components/RootDrillExplorer";
import {
  LEARN_PROGRESS_EVENT,
  createEmptyLearnProgressState,
  loadLearnProgress,
  recordGradedAnswer,
  recordRootDrillCorrect,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  touchDailyStreak,
  type LearnProgressState,
} from "@/lib/learn-progress";

export function RootsPageClient() {
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

  const onGradedPick = useCallback(
    (
      correct: boolean,
      ctx?: { promptHe?: string; rootKey?: string },
    ) => {
      setProgress((p) => {
        let n = touchDailyStreak(p);
        n = recordGradedAnswer(n, correct);
        n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
        if (correct && ctx?.rootKey && ctx?.promptHe) {
          n = recordRootDrillCorrect(n, ctx.rootKey, ctx.promptHe);
        }
        saveLearnProgress(n);
        return n;
      });
    },
    [],
  );

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.15em] text-ink-muted">
        <Link href="/learn" className="text-sage hover:underline">
          Learn
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink">Roots</span>
      </nav>
      <p className="text-sm text-ink-muted">
        Shoresh families and the same graduated drill as the Bet–Dalet roots
        sections — open anytime from the main menu.
      </p>
      <RootDrillExplorer
        rootDrill={progress.rootDrill}
        vocabLevels={progress.vocabLevels}
        activeLearnLevel={progress.activeLevel}
        onGradedPick={onGradedPick}
      />
    </div>
  );
}
