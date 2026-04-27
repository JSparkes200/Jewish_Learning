"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { ComprehensionDrill } from "@/components/ComprehensionDrill";
import { CorrectSentenceDrill } from "@/components/CorrectSentenceDrill";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { LessonPrimerPanel } from "@/components/LessonPrimerPanel";
import { Hebrew } from "@/components/Hebrew";
import { HebrewAudioControls } from "@/components/HebrewAudioControls";
import { BilingualReadAloudPassage } from "@/components/BilingualReadAloudPassage";
import { McqDrill } from "@/components/McqDrill";
import { ProgressiveStoryLesson } from "@/components/ProgressiveStoryLesson";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import { NumbersListenDrill } from "@/components/NumbersListenDrill";
import { RootDrillExplorer } from "@/components/RootDrillExplorer";
import { ShoreshSlotDrill } from "@/components/ShoreshSlotDrill";
import { SmikhutTetrisDrill } from "@/components/SmikhutTetrisDrill";
import { getComprehensionForSection } from "@/data/course-comprehension";
import {
  getSectionsForLevel,
  LEVEL_1_STORY,
  sectionDefaultShowNikkud,
} from "@/data/course";
import { getSectionLessonPrimer } from "@/data/course-section-primers";
import { getMcqPackForSection } from "@/data/section-drills";
import {
  getStoryProgressiveFlow,
  storyProgressiveFullGloss,
} from "@/data/story-progressive-lesson";
import {
  type GradedPracticeContext,
  recordGradedAnswer,
  recordRootDrillCorrect,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  sectionLockHint,
  sectionUnlocked,
  touchDailyStreak,
  touchLastCoursePosition,
  withResumeFromNextUpHref,
  LEARN_HUB_PATH,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { getNextLearnUp } from "@/lib/learn-next-up";
import { loadYiddishProgress } from "@/lib/yiddish-progress";
import { LEARN_VOICE, buildSectionIntroLead } from "@/lib/learn-user-voice";
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
  type DrillPrepCard,
} from "@/lib/drill-prep";
import type { McqDrillPack } from "@/data/section-drill-types";
import { courseLevelToRabbiLevel } from "@/lib/course-rabbi-level";
import { getGrammarGamesOffer } from "@/lib/grammar-games-section-offer";
import type { RabbiLevel } from "@/lib/rabbi-types";
import { useHebrewSpeech } from "@/hooks/useHebrewSpeech";

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

type LessonPhase = "intro" | "work";

type ActivityKey =
  | "comp"
  | "story"
  | "roots"
  | "nums"
  | "mcq"
  | "sent"
  | "slot"
  | "smikhut";

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
    case "slot":
      return "Continue to construct pairs";
    case "smikhut":
      return "Finish lesson games";
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

type SectionIntroVocabRow = { he: string; en: string };

function buildSectionIntroVocabRows(
  mcqSource: McqDrillPack | null,
  fallbackCards: DrillPrepCard[],
  max = 24,
): SectionIntroVocabRow[] {
  const out: SectionIntroVocabRow[] = [];
  const seen = new Set<string>();
  if (mcqSource?.items.length) {
    for (const it of mcqSource.items) {
      const he = it.promptHe?.trim();
      if (!he) continue;
      const en = (it.correctEn ?? "").trim();
      const k = `${he}\0${en}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ he, en });
    }
  } else {
    for (const c of fallbackCards) {
      if (!c.he) continue;
      const he = c.he.trim();
      const en = c.en.trim();
      const k = `${he}\0${en}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ he, en });
    }
  }
  return out.slice(0, max);
}

/** Vocab + per-line Hebrew TTS on the section intro (same TTS as drills). */
function SectionIntroVocabAudioBlock({
  items,
}: {
  items: SectionIntroVocabRow[];
}) {
  const {
    speak,
    activeKey,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
  } = useHebrewSpeech();
  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="font-label text-[9px] uppercase tracking-[0.18em] text-ink-faint">
        {LEARN_VOICE.sectionIntroVocabHeading}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        {LEARN_VOICE.sectionIntroVocabTtsNote}
      </p>
      {voices.length > 0 && selectedVoice ? (
        <div className="mt-3 -mx-1">
          <HebrewAudioControls
            rate={rate}
            setRate={setRate}
            voices={voices}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />
        </div>
      ) : null}
      <ul className="mt-3 space-y-2">
        {items.map((row, i) => {
          const k = `section-intro-voc-${i}`;
          const on = activeKey === k;
          return (
            <li
              key={k}
              className="rounded-2xl border border-ink/8 bg-parchment-deep/20 px-3 py-2.5"
            >
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => speak(row.he, k)}
                  className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-ink/10 transition ${
                    on
                      ? "bg-sage/20 text-sage"
                      : "text-ink-faint hover:border-sage/30 hover:bg-sage/5 hover:text-sage"
                  }`}
                  aria-label={on ? "Stop" : `Play: ${row.he}`}
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" />
                    <path d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" />
                  </svg>
                </button>
                <div className="min-w-0">
                  <Hebrew className="text-base font-medium leading-relaxed text-ink">
                    {row.he}
                  </Hebrew>
                  <p className="text-sm text-ink-muted">{row.en}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
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

  const storyProgressive = useMemo(
    () => getStoryProgressiveFlow(sectionId),
    [sectionId],
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

  const introVocabFallbackCards = useMemo(() => {
    const base = mcqPack ?? generatedPack;
    const fromMcq = buildPrepCardsFromMcqPack(base, 6);
    if (fromMcq.length > 0) return fromMcq;
    return buildPrepCardsFromComprehension(comprehension, 4);
  }, [mcqPack, generatedPack, comprehension]);

  const lessonPrimer = useMemo(
    () => getSectionLessonPrimer(sectionId),
    [sectionId],
  );
  const storyGloss = useMemo(() => {
    const fromMcq = Object.fromEntries(
      (mcqPack?.items ?? []).map((it) => [it.promptHe, it.correctEn]),
    );
    const fromProgressive = storyProgressive
      ? storyProgressiveFullGloss(storyProgressive)
      : {};
    return { ...fromMcq, ...fromProgressive };
  }, [mcqPack, storyProgressive]);
  const rabbiLevel = useMemo(
    () => courseLevelToRabbiLevel(level),
    [level],
  );

  const baseActivities = useMemo((): ActivityStep[] => {
    if (!sec) return [];
    const steps: ActivityStep[] = [];
    if (comprehension) {
      steps.push({ key: "comp", label: "Reading check" });
      if (sentencePack) steps.push({ key: "sent", label: "How real sentences sound" });
    } else if (isRead) {
      steps.push({ key: "story", label: "Story" });
      if (mcqPack && !storyProgressive) {
        steps.push({ key: "mcq", label: "Meaning match" });
      }
      if (sentencePack) {
        steps.push({ key: "sent", label: "How real sentences sound" });
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
    storyProgressive,
  ]);

  const grammarGamesOffer = useMemo(
    () =>
      getGrammarGamesOffer({
        level,
        sectionId,
        sec,
        vocabLevels: progress.vocabLevels,
        hasLessonTrack: baseActivities.length > 0,
      }),
    [level, sectionId, sec, progress.vocabLevels, baseActivities.length],
  );

  const activities = useMemo((): ActivityStep[] => {
    const steps = [...baseActivities];
    if (grammarGamesOffer) {
      steps.push({ key: "slot", label: "שׁוֹרֶשׁ slot machine" });
      if (grammarGamesOffer.smikhutMaxDifficulty != null) {
        steps.push({ key: "smikhut", label: "Smikhut Tetris" });
      }
    }
    return steps;
  }, [baseActivities, grammarGamesOffer]);

  const mcqSource = useMemo(
    () => mcqPack ?? generatedPack,
    [mcqPack, generatedPack],
  );

  const sectionIntroVocab = useMemo(
    () => buildSectionIntroVocabRows(mcqSource, introVocabFallbackCards),
    [mcqSource, introVocabFallbackCards],
  );

  const sectionIntroLeadText = useMemo(
    () =>
      sec
        ? buildSectionIntroLead(
            sec.label,
            activities.map((a) => a.key),
          )
        : "",
    [sec, activities],
  );

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
    if (phase === "work") setPhase("intro");
  }, [workIndex, phase]);

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

  useEffect(() => {
    if (!unlocked || !sec) return;
    setProgress((p) => {
      const n = touchLastCoursePosition(p, level, sectionId);
      if (n === p) return p;
      saveLearnProgress(n);
      return n;
    });
  }, [level, sectionId, sec, unlocked, setProgress]);

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
      let n = touchDailyStreak(withComplete);
      n = withResumeFromNextUpHref(
        n,
        getNextLearnUp(n, { yiddishProgress: loadYiddishProgress() }).href,
      );
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
        if (storyProgressive) {
          return (
            <ProgressiveStoryLesson
              flow={storyProgressive}
              glossByWord={storyGloss}
              storyShowNikkud={storyShowNikkud}
              setStoryShowNikkud={setStoryShowNikkud}
              nikkudDefault={nikkudDefault}
              rabbiLevel={rabbiLevel}
              onPracticeAnswer={onPracticeAnswer}
              flowContinue={fc}
              skillTags={
                sec.type === "roots"
                  ? (["grammar", "production", "definition"] as const)
                  : sec.type === "numbers"
                    ? (["recognition", "definition", "listening"] as const)
                    : (["recognition", "definition"] as const)
              }
            />
          );
        }
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
              <BilingualReadAloudPassage
                he={LEVEL_1_STORY.he}
                en={LEVEL_1_STORY.en}
                showNikkud={storyShowNikkud}
                glossByWord={storyGloss}
                showSaveWord
              />
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
      case "slot":
        return grammarGamesOffer ? (
          <ShoreshSlotDrill
            maxDifficulty={grammarGamesOffer.slotMaxDifficulty}
            courseLearnLevel={level}
            onPracticeAnswer={onPracticeAnswer}
            rabbiLevel={rabbiLevel}
            courseSurface="embed"
            flowContinue={fc}
          />
        ) : null;
      case "smikhut":
        return grammarGamesOffer?.smikhutMaxDifficulty != null ? (
          <SmikhutTetrisDrill
            maxDifficulty={grammarGamesOffer.smikhutMaxDifficulty}
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

  const mainShell = (
    <div
      className={[
        "rounded-[1.75rem] border-[1.5px] border-ink/22",
        "bg-gradient-to-b from-parchment-card from-15% via-parchment-card/98 to-parchment-deep/35",
        "p-2 sm:p-2.5",
        "shadow-[0_1px_0_0_rgba(255,252,244,0.5)_inset,0_2px_0_0_rgba(18,10,4,0.2),0_12px_28px_-6px_rgba(18,10,4,0.18),0_36px_70px_-20px_rgba(12,6,2,0.45)]",
        "ring-1 ring-ink/5",
      ].join(" ")}
    >
      <div
        className={[
          "rounded-[1.35rem] border border-ink/14",
          "bg-gradient-to-b from-parchment-card/98 via-parchment-card/92 to-parchment-deep/18",
          "px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),inset_0_0_0_1px_rgba(0,0,0,0.04)] sm:px-6 sm:py-7",
        ].join(" ")}
      >
        {phase === "intro" && hasLessonTrack ? (
          <>
            <p className="font-label text-[10px] uppercase tracking-[0.22em] text-sage/90">
              {LEARN_VOICE.sectionIntroEyebrow}
            </p>
            <h1 className="mt-2 text-lg font-medium tracking-tight text-ink sm:text-xl">
              {sec.label}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {sectionIntroLeadText}
            </p>
            <SectionIntroVocabAudioBlock items={sectionIntroVocab} />
            {lessonPrimer ? (
              <div className="mt-4">
                <LessonPrimerPanel primer={lessonPrimer} defaultOpen={false} />
              </div>
            ) : null}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setPhase("work");
                  setWorkIndex(0);
                }}
                className="w-full rounded-2xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg sm:w-auto"
              >
                {LEARN_VOICE.sectionIntroStartLesson}
              </button>
            </div>
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
          <Link href={LEARN_HUB_PATH} className="text-sage hover:underline">
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
