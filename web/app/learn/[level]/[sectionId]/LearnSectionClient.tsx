"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ComprehensionDrill } from "@/components/ComprehensionDrill";
import { CorrectSentenceDrill } from "@/components/CorrectSentenceDrill";
import { DrillPrepGate } from "@/components/DrillPrepGate";
import { LessonPrimerPanel } from "@/components/LessonPrimerPanel";
import { HebrewTapText } from "@/components/HebrewTapText";
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
import { getSectionLessonPrimer } from "@/data/course-section-primers";
import { getMcqPackForSection } from "@/data/section-drills";
import { stripNikkud } from "@/lib/hebrew-nikkud";
import {
  type GradedPracticeContext,
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
import {
  buildStudyPracticePool,
  pickMcqItemsFromPool,
} from "@/lib/study-practice-pool";
import {
  buildCorrectSentencePackFromMcq,
  buildCorrectSentencePackFromPool,
} from "@/lib/sentence-correctness";
import {
  buildPrepCardsFromComprehension,
  buildPrepCardsFromMcqPack,
  sectionGrammarHint,
} from "@/lib/drill-prep";

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
  const generatedPack =
    !mcqPack && !comprehension
      ? (() => {
          const pool = buildStudyPracticePool(level);
          const items = pickMcqItemsFromPool(pool, 10, level);
          if (!items.length) return null;
          return {
            kind: "mcq" as const,
            title: `${sec.label} - generated practice`,
            intro:
              "Section-specific pack is still being curated. This generated drill keeps your course path and mastery tracking moving.",
            items,
          };
        })()
      : null;
  const sentencePack = (() => {
    const sourcePack = mcqPack ?? generatedPack;
    if (sourcePack) return buildCorrectSentencePackFromMcq(sourcePack, level, 5);
    const pool = buildStudyPracticePool(level);
    return buildCorrectSentencePackFromPool(pool, level, 5);
  })();
  const prepCards =
    buildPrepCardsFromMcqPack(mcqPack ?? generatedPack, 6).length > 0
      ? buildPrepCardsFromMcqPack(mcqPack ?? generatedPack, 6)
      : buildPrepCardsFromComprehension(comprehension, 4);
  const prepSubtitle = sectionGrammarHint(level, sec.type);
  const lessonPrimer = getSectionLessonPrimer(sectionId);
  const storyGloss = Object.fromEntries(
    (mcqPack?.items ?? []).map((it) => [it.promptHe, it.correctEn]),
  );

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

      {lessonPrimer ? <LessonPrimerPanel primer={lessonPrimer} /> : null}

      {comprehension ? (
        <div className="mb-6">
          <DrillPrepGate
            title={sec.label}
            subtitle={prepSubtitle}
            cards={prepCards}
            ctaLabel="Start reading drills"
          >
            <ComprehensionDrill
              passage={comprehension}
              defaultShowNikkud={nikkudDefault}
              skillTags={["comprehension", "grammar", "recognition", "definition"]}
              onPracticeAnswer={onPracticeAnswer}
            />
            {sentencePack ? (
              <CorrectSentenceDrill
                pack={sentencePack}
                className="mt-4"
                onPracticeAnswer={onPracticeAnswer}
              />
            ) : null}
          </DrillPrepGate>
        </div>
      ) : isRead ? (
        <div className="mb-6 space-y-6">
          <DrillPrepGate
            title={sec.label}
            subtitle={prepSubtitle}
            cards={prepCards}
            ctaLabel="Start story drills"
          >
            <div className="rounded-2xl border border-ink/12 bg-parchment-card/80 p-4">
              <div className="mb-3 flex justify-end">
                <NikkudExerciseToggle
                  showNikkud={storyShowNikkud}
                  onToggle={() => setStoryShowNikkud((v) => !v)}
                />
              </div>
              <HebrewTapText
                text={storyShowNikkud ? LEVEL_1_STORY.he : stripNikkud(LEVEL_1_STORY.he)}
                className="text-lg text-ink"
                glossByWord={storyGloss}
                showSaveWord
              />
              <p className="border-t border-ink/10 pt-4 text-sm italic leading-relaxed text-ink-muted">
                {LEVEL_1_STORY.en}
              </p>
            </div>
            {mcqPack ? (
              <>
                <McqDrill
                  pack={mcqPack}
                  corpusMaxLevel={level}
                  defaultShowNikkud={nikkudDefault}
                  skillTags={["recognition", "definition"]}
                  onPracticeAnswer={onPracticeAnswer}
                />
                {sentencePack ? (
                  <CorrectSentenceDrill
                    pack={sentencePack}
                    onPracticeAnswer={onPracticeAnswer}
                  />
                ) : null}
              </>
            ) : null}
          </DrillPrepGate>
        </div>
      ) : mcqPack || generatedPack ? (
        <div className="mb-6 space-y-6">
          <DrillPrepGate
            title={sec.label}
            subtitle={prepSubtitle}
            cards={prepCards}
            ctaLabel="Start lesson drills"
          >
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
              pack={mcqPack ?? generatedPack!}
              corpusMaxLevel={level}
              defaultShowNikkud={nikkudDefault}
              skillTags={
                sec.type === "roots"
                  ? ["grammar", "production", "definition"]
                  : sec.type === "numbers"
                    ? ["recognition", "definition", "listening"]
                    : ["recognition", "definition"]
              }
              onPracticeAnswer={onPracticeAnswer}
            />
            {sentencePack ? (
              <CorrectSentenceDrill
                pack={sentencePack}
                onPracticeAnswer={onPracticeAnswer}
              />
            ) : null}
          </DrillPrepGate>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-amber/25 bg-amber/5 p-4 text-sm text-ink-muted">
          <p className="mb-2 font-medium text-ink">More exercises coming</p>
          <p>
            This section does not have interactive drills in the app yet. You
            can still{" "}
            <strong className="text-ink">mark complete</strong> when you are
            ready to move on in the course path.
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
