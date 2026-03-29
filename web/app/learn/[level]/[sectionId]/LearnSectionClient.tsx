"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ComprehensionDrill } from "@/components/ComprehensionDrill";
import { Hebrew } from "@/components/Hebrew";
import { McqDrill } from "@/components/McqDrill";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import { NumbersListenDrill } from "@/components/NumbersListenDrill";
import { RootDrillExplorer } from "@/components/RootDrillExplorer";
import { getComprehensionForSection } from "@/data/course-comprehension";
import {
  getSectionsForLevel,
  LEVEL_1_STORY,
  sectionDefaultShowNikkud,
} from "@/data/course";
import { getMcqPackForSection } from "@/data/section-drills";
import { stripNikkud } from "@/lib/hebrew-nikkud";
import {
  recordGradedAnswer,
  recordRootDrillCorrect,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  sectionLockHint,
  sectionUnlocked,
  touchDailyStreak,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { useLearnProgressSync } from "@/lib/use-learn-progress-sync";

type Props = { level: number; sectionId: string };

export function LearnSectionClient({ level, sectionId }: Props) {
  const sections = useMemo(() => getSectionsForLevel(level), [level]);
  const sec = sections.find((s) => s.id === sectionId);
  const [progress, setProgress] = useLearnProgressSync({ level, sectionId });
  const nikkudDefault = sec ? sectionDefaultShowNikkud(sec) : true;
  const [storyShowNikkud, setStoryShowNikkud] = useState(nikkudDefault);

  useEffect(() => {
    setStoryShowNikkud(nikkudDefault);
  }, [sectionId, nikkudDefault]);

  const unlocked = sec
    ? sectionUnlocked(
        level,
        sections,
        sec.id,
        progress.completedSections,
        progress.vocabLevels,
      )
    : false;
  const lockHint = sec
    ? sectionLockHint(
        level,
        sections,
        sec.id,
        progress.completedSections,
        progress.vocabLevels,
      )
    : null;

  const onPracticeAnswer = useCallback(
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
    [setProgress],
  );

  const markComplete = useCallback(() => {
    if (!sec) return;
    setProgress((p) => {
      const withComplete: LearnProgressState = {
        ...p,
        completedSections: {
          ...p.completedSections,
          [sec.id]: true,
        },
      };
      const n = touchDailyStreak(withComplete);
      saveLearnProgress(n);
      return n;
    });
  }, [sec, setProgress]);

  if (!sec) {
    return (
      <p className="text-sm text-ink-muted">
        Unknown section.{" "}
        <Link href={`/learn/${level}`} className="text-sage underline">
          Back
        </Link>
      </p>
    );
  }

  if (!unlocked) {
    return (
      <div className="text-sm text-ink-muted">
        <p className="mb-2">
          {lockHint ??
            "This section is locked until you complete the previous one."}
        </p>
        <Link href={`/learn/${level}`} className="text-sage underline">
          Level menu
        </Link>
      </div>
    );
  }

  const isRead = sec.type === "read" && level === 1 && sectionId === "1-read";
  const comprehension = getComprehensionForSection(sectionId);
  const mcqPack = getMcqPackForSection(sectionId);

  return (
    <div>
      <nav className="mb-6 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.15em]">
        <Link href="/learn" className="text-sage hover:underline">
          Learn
        </Link>
        <span className="text-ink-faint">/</span>
        <Link href={`/learn/${level}`} className="text-sage hover:underline">
          Level {level}
        </Link>
      </nav>

      <h1 className="mb-4 font-label text-xs uppercase tracking-wide text-ink">
        {sec.label}
      </h1>

      {comprehension ? (
        <div className="mb-6">
          <ComprehensionDrill
            passage={comprehension}
            defaultShowNikkud={nikkudDefault}
            onPracticeAnswer={onPracticeAnswer}
          />
        </div>
      ) : isRead ? (
        <div className="mb-6 space-y-6">
          <div className="rounded-2xl border border-ink/12 bg-parchment-card/80 p-4">
            <div className="mb-3 flex justify-end">
              <NikkudExerciseToggle
                showNikkud={storyShowNikkud}
                onToggle={() => setStoryShowNikkud((v) => !v)}
              />
            </div>
            <Hebrew
              as="p"
              className="mb-4 text-right text-lg leading-relaxed text-ink"
            >
              {storyShowNikkud ? LEVEL_1_STORY.he : stripNikkud(LEVEL_1_STORY.he)}
            </Hebrew>
            <p className="border-t border-ink/10 pt-4 text-sm italic leading-relaxed text-ink-muted">
              {LEVEL_1_STORY.en}
            </p>
          </div>
          {mcqPack ? (
            <McqDrill
              pack={mcqPack}
              corpusMaxLevel={level}
              defaultShowNikkud={nikkudDefault}
              onPracticeAnswer={onPracticeAnswer}
            />
          ) : null}
        </div>
      ) : mcqPack ? (
        <div className="mb-6 space-y-6">
          {sec.type === "roots" ? (
            <RootDrillExplorer
              rootDrill={progress.rootDrill}
              vocabLevels={progress.vocabLevels}
              onGradedPick={onPracticeAnswer}
            />
          ) : null}
          {sec.type === "numbers" && sectionId === "1-nums" ? (
            <NumbersListenDrill onPracticeAnswer={onPracticeAnswer} />
          ) : null}
          <McqDrill
            pack={mcqPack}
            corpusMaxLevel={level}
            defaultShowNikkud={nikkudDefault}
            onPracticeAnswer={onPracticeAnswer}
          />
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-amber/25 bg-amber/5 p-4 text-sm text-ink-muted">
          <p className="mb-2 font-medium text-ink">Exercise UI not ported yet</p>
          <p>
            This section has no Next.js drill pack yet. Some special drills
            (e.g. numbers) may still live in{" "}
            <code className="rounded bg-parchment-deep/50 px-1 text-xs">
              hebrew-v8.2.html
            </code>
            . You can still{" "}
            <strong className="text-ink">mark complete</strong> to advance the
            course path here.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={markComplete}
          className="rounded-xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
        >
          Mark section complete
        </button>
        <Link
          href={`/learn/${level}`}
          className="rounded-xl border border-ink/15 px-5 py-3 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/50"
        >
          Back to level
        </Link>
      </div>
    </div>
  );
}
