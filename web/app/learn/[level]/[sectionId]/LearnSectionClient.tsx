"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { ComprehensionDrill } from "@/components/ComprehensionDrill";
import { CorrectSentenceDrill } from "@/components/CorrectSentenceDrill";
import { DrillPrepPanel } from "@/components/DrillPrepPanel";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
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
import { LEARN_VOICE } from "@/lib/learn-user-voice";
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
import { courseLevelToRabbiLevel } from "@/lib/course-rabbi-level";
import type { RabbiLevel } from "@/lib/rabbi-types";

function AlephStoryRabbiSync({
  he,
  en,
  rabbiLevel,
}: {
  he: string;
  en: string;
  rabbiLevel: RabbiLevel;
}) {
  const { setRabbiAskContext } = useAppShell();
  useEffect(() => {
    setRabbiAskContext({
      targetHe: he,
      learnerLevel: rabbiLevel,
      meaningEn: en,
    });
    return () => setRabbiAskContext(null);
  }, [he, en, rabbiLevel, setRabbiAskContext]);
  return null;
}

type Props = { level: number; sectionId: string };

type LessonPhase = "intro" | "prep" | "work";

type ActivityKey = "comp" | "story" | "roots" | "nums" | "mcq" | "sent";

type ActivityStep = { key: ActivityKey; label: string };

function continueLabelForNextKey(nextKey: ActivityKey): string {
  switch (nextKey) {
    case "comp":
      return LEARN_VOICE.sectionContinueReading;
    case "story":
      return LEARN_VOICE.sectionContinueStory;
    case "mcq":
      return LEARN_VOICE.sectionContinueVocab;
    case "roots":
      return LEARN_VOICE.sectionContinueRoots;
    case "nums":
      return LEARN_VOICE.sectionContinueNumbers;
    case "sent":
      return LEARN_VOICE.sectionContinueSentences;
    default:
      return "Continue";
  }
}

function LearnSectionStepHeader({
  stepIndex,
  total,
  label,
  onBackStep,
  onLessonOverview,
}: {
  stepIndex: number;
  total: number;
  label: string;
  onBackStep: () => void;
  onLessonOverview: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
      <div className="min-w-0">
        {total > 1 ? (
          <p className="font-label text-[9px] uppercase tracking-[0.2em] text-sage/80">
            {LEARN_VOICE.sectionStepLabel(stepIndex + 1, total)}
          </p>
        ) : null}
        <p className="mt-0.5 text-sm font-medium text-ink">{label}</p>
      </div>
      <div className="flex flex-shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={onBackStep}
          className="rounded-full border border-ink/12 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/50"
        >
          {LEARN_VOICE.sectionStepBack}
        </button>
        <button
          type="button"
          onClick={onLessonOverview}
          className="rounded-full border border-sage/30 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-sage transition hover:bg-sage/10"
        >
          Lesson overview
        </button>
      </div>
    </div>
  );
}

export function LearnSectionClient({ level, sectionId }: Props) {
  const sections = useMemo(() => getSectionsForLevel(level), [level]);
  const sec = useMemo(
    () => sections.find((s) => s.id === sectionId),
    [sections, sectionId],
  );
  const [progress, setProgress] = useLearnProgressSync({ level, sectionId });
  const nikkudDefault = useMemo(
    () => (sec ? sectionDefaultShowNikkud(sec) : true),
    [sec],
  );
  const [storyShowNikkud, setStoryShowNikkud] = useState(nikkudDefault);

  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [workIndex, setWorkIndex] = useState(0);

  const unlocked = useMemo(() => {
    if (!sec) return false;
    return sectionUnlocked(
      level,
      sections,
      sec.id,
      progress.completedSections,
      progress.vocabLevels,
    );
  }, [
    sec,
    level,
    sections,
    progress.completedSections,
    progress.vocabLevels,
  ]);

  const lockHint = useMemo(() => {
    if (!sec || unlocked) return null;
    return sectionLockHint(
      level,
      sections,
      sec.id,
      progress.completedSections,
      progress.vocabLevels,
    );
  }, [
    sec,
    unlocked,
    level,
    sections,
    progress.completedSections,
    progress.vocabLevels,
  ]);

  const comprehension = useMemo(
    () => getComprehensionForSection(sectionId),
    [sectionId],
  );
  const mcqPack = useMemo(
    () => getMcqPackForSection(sectionId),
    [sectionId],
  );

  const isRead = useMemo(
    () => sec?.type === "read" && level === 1 && sectionId === "1-read",
    [sec, level, sectionId],
  );

  const generatedPack = useMemo(() => {
    if (!sec || mcqPack || comprehension) return null;
    const pool = buildStudyPracticePool(level);
    const items = pickMcqItemsFromPool(pool, 10, level);
    if (!items.length) return null;
    return {
      kind: "mcq" as const,
      title: `${sec.label} - generated practice`,
      intro:
        "We’re still polishing a hand-built pack for this spot — meanwhile this set keeps your feet on the path and your stats honest.",
      items,
    };
  }, [sec, mcqPack, comprehension, level]);

  const sentencePack = useMemo(() => {
    const sourcePack = mcqPack ?? generatedPack;
    if (sourcePack) return buildCorrectSentencePackFromMcq(sourcePack, level, 5);
    const pool = buildStudyPracticePool(level);
    return buildCorrectSentencePackFromPool(pool, level, 5);
  }, [mcqPack, generatedPack, level]);

  const prepCards = useMemo(() => {
    const base = mcqPack ?? generatedPack;
    const fromMcq = buildPrepCardsFromMcqPack(base, 6);
    if (fromMcq.length > 0) return fromMcq;
    return buildPrepCardsFromComprehension(comprehension, 4);
  }, [mcqPack, generatedPack, comprehension]);

  const prepSubtitle = useMemo(
    () => sectionGrammarHint(level, sec?.type),
    [level, sec],
  );
  const lessonPrimer = useMemo(
    () => getSectionLessonPrimer(sectionId),
    [sectionId],
  );
  const storyGloss = useMemo(
    () =>
      Object.fromEntries(
        (mcqPack?.items ?? []).map((it) => [it.promptHe, it.correctEn]),
      ),
    [mcqPack],
  );
  const rabbiLevel = useMemo(
    () => courseLevelToRabbiLevel(level),
    [level],
  );

  const activities = useMemo((): ActivityStep[] => {
    if (!sec) return [];
    const steps: ActivityStep[] = [];
    if (comprehension) {
      steps.push({ key: "comp", label: "Reading check" });
      if (sentencePack) steps.push({ key: "sent", label: "How real sentences sound" });
    } else if (isRead) {
      steps.push({ key: "story", label: "Story" });
      if (mcqPack) {
        steps.push({ key: "mcq", label: "Meaning match" });
        if (sentencePack) steps.push({ key: "sent", label: "How real sentences sound" });
      }
    } else if (mcqPack || generatedPack) {
      if (sec.type === "roots") steps.push({ key: "roots", label: "Root families" });
      if (sec.type === "numbers" && sectionId === "1-nums") {
        steps.push({ key: "nums", label: "Numbers you hear" });
      }
      steps.push({ key: "mcq", label: "Vocabulary choices" });
      if (sentencePack) steps.push({ key: "sent", label: "How real sentences sound" });
    }
    return steps;
  }, [
    sec,
    comprehension,
    generatedPack,
    isRead,
    mcqPack,
    sectionId,
    sentencePack,
  ]);

  const hasPrep = prepCards.length > 0;
  const hasLessonTrack = activities.length > 0;

  const goLessonOverview = useCallback(() => {
    setPhase("intro");
    setWorkIndex(0);
  }, []);

  const goBackStep = useCallback(() => {
    if (workIndex > 0) {
      setWorkIndex((i) => i - 1);
      return;
    }
    if (phase === "work") {
      if (hasPrep) setPhase("prep");
      else setPhase("intro");
    }
  }, [workIndex, phase, hasPrep]);

  const flowForIndex = useCallback(
    (i: number) => {
      if (i >= activities.length - 1) return undefined;
      const next = activities[i + 1]!;
      return {
        label: continueLabelForNextKey(next.key),
        onContinue: () => setWorkIndex(i + 1),
      };
    },
    [activities],
  );

  useEffect(() => {
    setStoryShowNikkud(nikkudDefault);
  }, [sectionId, nikkudDefault]);

  useEffect(() => {
    setPhase("intro");
    setWorkIndex(0);
  }, [sectionId]);

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
        This section ID isn&apos;t on the map.{" "}
        <Link href={`/learn/${level}`} className="text-sage underline">
          Back to level {level}
        </Link>
      </p>
    );
  }

  if (!unlocked) {
    return (
      <div className="text-sm text-ink-muted">
        <p className="mb-2">
          {lockHint ??
            "This section opens after you finish the one before it — your path stays in order."}
        </p>
        <Link href={`/learn/${level}`} className="text-sage underline">
          Level menu
        </Link>
      </div>
    );
  }

  const mcqSource = mcqPack ?? generatedPack;

  const renderWorkStep = () => {
    const step = activities[workIndex];
    if (!step) return null;
    const fc = flowForIndex(workIndex);
    const skillMcq =
      sec.type === "roots"
        ? (["grammar", "production", "definition"] as const)
        : sec.type === "numbers"
          ? (["recognition", "definition", "listening"] as const)
          : (["recognition", "definition"] as const);

    switch (step.key) {
      case "comp":
        return (
          <ComprehensionDrill
            passage={comprehension!}
            defaultShowNikkud={nikkudDefault}
            skillTags={["comprehension", "grammar", "recognition", "definition"]}
            onPracticeAnswer={onPracticeAnswer}
            courseSurface="embed"
            flowContinue={fc}
            rabbiLevel={rabbiLevel}
          />
        );
      case "story":
        return (
          <>
            <AlephStoryRabbiSync
              he={LEVEL_1_STORY.he}
              en={LEVEL_1_STORY.en}
              rabbiLevel={rabbiLevel}
            />
            <div className="rounded-2xl border border-ink/10 bg-parchment-deep/20 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap justify-end gap-2">
                <ExerciseAskRabbiButton compact />
                <NikkudExerciseToggle
                  showNikkud={storyShowNikkud}
                  onToggle={() => setStoryShowNikkud((v) => !v)}
                />
              </div>
              <HebrewTapText
                text={
                  storyShowNikkud ? LEVEL_1_STORY.he : stripNikkud(LEVEL_1_STORY.he)
                }
                className="text-lg text-ink"
                glossByWord={storyGloss}
                showSaveWord
              />
              <p className="mt-4 border-t border-ink/10 pt-4 text-sm italic leading-relaxed text-ink-muted">
                {LEVEL_1_STORY.en}
              </p>
            </div>
            {fc ? (
              <div className="mt-6 border-t border-ink/10 pt-4">
                <p className="mb-3 text-xs text-ink-muted">
                  When you&apos;ve read it through at your pace, move on — you can
                  always come back.
                </p>
                <button
                  type="button"
                  onClick={fc.onContinue}
                  className="w-full rounded-2xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
                >
                  {fc.label}
                </button>
              </div>
            ) : null}
          </>
        );
      case "roots":
        return (
          <RootDrillExplorer
            rootDrill={progress.rootDrill}
            vocabLevels={progress.vocabLevels}
            onGradedPick={onPracticeAnswer}
            activeLearnLevel={level}
            courseSurface="embed"
            flowContinue={fc}
          />
        );
      case "nums":
        return (
          <NumbersListenDrill
            onPracticeAnswer={onPracticeAnswer}
            courseSurface="embed"
            flowContinue={fc}
          />
        );
      case "mcq":
        return mcqSource ? (
          <McqDrill
            pack={mcqSource}
            corpusMaxLevel={level}
            defaultShowNikkud={nikkudDefault}
            skillTags={[...skillMcq]}
            onPracticeAnswer={onPracticeAnswer}
            rabbiLevel={rabbiLevel}
            courseSurface="embed"
            flowContinue={fc}
          />
        ) : null;
      case "sent":
        return sentencePack ? (
          <CorrectSentenceDrill
            pack={sentencePack}
            onPracticeAnswer={onPracticeAnswer}
            rabbiLevel={rabbiLevel}
            courseSurface="embed"
            flowContinue={fc}
          />
        ) : null;
      default:
        return null;
    }
  };

  const prepCta =
    comprehension != null
      ? "Start reading drills"
      : isRead
        ? "Start story drills"
        : "Start lesson drills";

  const mainShell = (
    <div className="rounded-[1.75rem] border-2 border-ink/8 bg-gradient-to-b from-parchment-card via-parchment-card/95 to-parchment-deep/25 p-1 shadow-[0_24px_60px_rgba(44,36,22,0.09)] sm:p-1.5">
      <div className="rounded-[1.35rem] bg-parchment-card/85 px-4 py-5 sm:px-6 sm:py-7">
        {phase === "intro" && hasLessonTrack ? (
          <>
            <p className="font-label text-[10px] uppercase tracking-[0.22em] text-sage/90">
              {LEARN_VOICE.sectionIntroEyebrow}
            </p>
            <h1 className="mt-2 text-lg font-medium tracking-tight text-ink sm:text-xl">
              {sec.label}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {LEARN_VOICE.sectionIntroLead}
            </p>
            {lessonPrimer ? (
              <div className="mt-4">
                <LessonPrimerPanel primer={lessonPrimer} defaultOpen={false} />
              </div>
            ) : null}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {hasPrep ? (
                <button
                  type="button"
                  onClick={() => setPhase("prep")}
                  className="rounded-2xl border-2 border-sage/30 bg-parchment-deep/30 px-5 py-3 font-label text-[10px] uppercase tracking-wide text-ink shadow-sm transition hover:border-sage/45 hover:bg-parchment-deep/45"
                >
                  {LEARN_VOICE.sectionIntroStartWithWarmup}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setPhase("work");
                  setWorkIndex(0);
                }}
                className="rounded-2xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
              >
                {hasPrep
                  ? LEARN_VOICE.sectionIntroSkipWarmup
                  : LEARN_VOICE.sectionIntroStartLesson}
              </button>
            </div>
            {hasPrep ? (
              <p className="mt-3 text-[11px] text-ink-faint">
                Skip the warm-up whenever you already feel sharp — the pacing is
                yours.
              </p>
            ) : null}
          </>
        ) : null}

        {phase === "intro" && !hasLessonTrack ? (
          <>
            <p className="font-label text-[10px] uppercase tracking-[0.22em] text-amber/90">
              {LEARN_VOICE.sectionIntroEyebrow}
            </p>
            <h1 className="mt-2 text-lg font-medium text-ink sm:text-xl">
              {sec.label}
            </h1>
            <p className="mt-4 text-sm text-ink-muted">
              Interactive drills for this slice aren&apos;t in the app yet — you can
              still{" "}
              <strong className="text-ink">mark complete</strong> when you&apos;ve
              done the work elsewhere and you&apos;re ready to advance.
            </p>
          </>
        ) : null}

        {phase === "prep" && hasLessonTrack ? (
          <>
            <LearnSectionStepHeader
              stepIndex={0}
              total={Math.max(activities.length, 1)}
              label="Warm-up peek"
              onBackStep={() => setPhase("intro")}
              onLessonOverview={goLessonOverview}
            />
            <DrillPrepPanel
              title={sec.label}
              subtitle={prepSubtitle}
              cards={prepCards}
              ctaLabel={prepCta}
              onContinue={() => {
                setPhase("work");
                setWorkIndex(0);
              }}
            />
          </>
        ) : null}

        {phase === "work" && hasLessonTrack ? (
          <>
            <LearnSectionStepHeader
              stepIndex={workIndex}
              total={activities.length}
              label={activities[workIndex]?.label ?? ""}
              onBackStep={goBackStep}
              onLessonOverview={goLessonOverview}
            />
            {renderWorkStep()}
            {workIndex >= activities.length - 1 ? (
              <div className="mt-8 rounded-2xl border border-sage/20 bg-sage/5 px-4 py-3 text-sm text-ink-muted">
                <p className="font-label text-[9px] uppercase tracking-[0.18em] text-sage">
                  {LEARN_VOICE.sectionWrapEyebrow}
                </p>
                <p className="mt-1">{LEARN_VOICE.sectionWrapBody}</p>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="min-h-[72vh] bg-gradient-to-b from-parchment-deep/15 via-transparent to-parchment-deep/10 pb-16">
      <div className="mx-auto w-full max-w-lg px-4 pt-6 sm:max-w-xl">
        <nav className="mb-5 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.15em]">
          <Link href="/learn" className="text-sage hover:underline">
            Learn
          </Link>
          <span className="text-ink-faint">/</span>
          <Link href={`/learn/${level}`} className="text-sage hover:underline">
            Level {level}
          </Link>
        </nav>

        {mainShell}

        <div className="mt-8 flex flex-wrap gap-3 px-1">
          <button
            type="button"
            onClick={markComplete}
            className="rounded-2xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110"
          >
            Mark section complete
          </button>
          <Link
            href={`/learn/${level}`}
            className="rounded-2xl border-2 border-ink/12 px-5 py-3 font-label text-[10px] uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/40"
          >
            Back to level
          </Link>
        </div>
      </div>
    </div>
  );
}
