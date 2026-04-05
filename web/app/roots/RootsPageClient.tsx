"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RootDrillExplorer } from "@/components/RootDrillExplorer";
import { RootsCurriculumFlow } from "@/components/RootsCurriculumFlow";
import {
  type GradedPracticeContext,
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
  const searchParams = useSearchParams();
  const groupFromQuery = searchParams.get("group");

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

  const applyCurriculum = useCallback(
    (fn: (s: LearnProgressState) => LearnProgressState) => {
      setProgress((p) => {
        const n = fn(p);
        saveLearnProgress(n);
        return n;
      });
    },
    [],
  );

  const onGradedPick = useCallback(
    (correct: boolean, ctx?: GradedPracticeContext) => {
      setProgress((p) => {
        let n = touchDailyStreak(p);
        n = recordGradedAnswer(n, correct, ctx);
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
        Work through shoresh families in small sets: read the forms, drill
        glosses, pass a mixed test, then move on. Every four groups, a checkpoint
        mixes tiers, roots, and vocabulary. Your place is saved with course
        progress; use the list to revisit any set. Full explorer (including
        lexicon mode) stays below.
      </p>
      <RootsCurriculumFlow
        learnProgress={progress}
        onGradedPick={onGradedPick}
        applyCurriculum={applyCurriculum}
        initialGroupId={groupFromQuery}
      />
      <details className="rounded-2xl border border-amber/20 bg-parchment-card/40 p-4">
        <summary className="cursor-pointer font-label text-[10px] uppercase tracking-[0.15em] text-amber/90">
          Full root explorer (all families, lexicon mode)
        </summary>
        <div className="mt-4">
          <RootDrillExplorer
            rootDrill={progress.rootDrill}
            vocabLevels={progress.vocabLevels}
            activeLearnLevel={progress.activeLevel}
            onGradedPick={onGradedPick}
          />
        </div>
      </details>
    </div>
  );
}
