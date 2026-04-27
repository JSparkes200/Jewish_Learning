"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { BilingualReadAloudPassage } from "@/components/BilingualReadAloudPassage";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { Hebrew } from "@/components/Hebrew";
import { McqDrill } from "@/components/McqDrill";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import type { StoryProgressiveFlow } from "@/data/story-progressive-lesson";
import type {
  GradedPracticeContext,
  SkillMetricKey,
} from "@/lib/learn-progress";
import { stripNikkud } from "@/lib/hebrew-nikkud";
import type { RabbiLevel } from "@/lib/rabbi-types";
import { useHebrewSpeech } from "@/hooks/useHebrewSpeech";

type Stage =
  | { k: "intro"; i: number }
  | { k: "quiz"; i: number }
  | { k: "full" }
  | { k: "final" };

function StoryRabbiSync({
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

type Props = {
  flow: StoryProgressiveFlow;
  glossByWord: Record<string, string>;
  storyShowNikkud: boolean;
  setStoryShowNikkud: (v: boolean | ((p: boolean) => boolean)) => void;
  nikkudDefault: boolean;
  rabbiLevel: RabbiLevel;
  onPracticeAnswer: (
    correct: boolean,
    context?: GradedPracticeContext,
  ) => void;
  flowContinue?: { label: string; onContinue: () => void };
  skillTags: SkillMetricKey[];
};

export function ProgressiveStoryLesson({
  flow,
  glossByWord,
  storyShowNikkud,
  setStoryShowNikkud,
  nikkudDefault,
  rabbiLevel,
  onPracticeAnswer,
  flowContinue,
  skillTags,
}: Props) {
  const [stage, setStage] = useState<Stage>({ k: "intro", i: 0 });
  const { speak } = useHebrewSpeech();

  const sentence = useMemo(() => {
    if (stage.k !== "intro" && stage.k !== "quiz") return null;
    return flow.sentences[stage.i] ?? null;
  }, [flow.sentences, stage]);

  const quizPack = useMemo(() => {
    if (stage.k !== "quiz" || !sentence) return null;
    return {
      kind: "mcq" as const,
      title: `Sentence ${stage.i + 1} — quick check`,
      intro: `Words and phrases from: “${sentence.en}”`,
      items: sentence.mcqItems,
    };
  }, [stage, sentence]);

  const rabbiHe = useMemo(() => {
    if (stage.k === "intro" || stage.k === "quiz") {
      return sentence?.he ?? flow.storyHe;
    }
    return flow.storyHe;
  }, [flow.storyHe, sentence, stage.k]);

  const rabbiEn = useMemo(() => {
    if (stage.k === "intro" || stage.k === "quiz") {
      return sentence?.en ?? flow.storyEn;
    }
    return flow.storyEn;
  }, [flow.storyEn, sentence, stage.k]);

  const afterSentenceQuiz = useCallback(() => {
    if (stage.k !== "quiz") return;
    const nextI = stage.i + 1;
    if (nextI < flow.sentences.length) {
      setStage({ k: "intro", i: nextI });
    } else {
      setStage({ k: "full" });
    }
  }, [flow.sentences.length, stage]);

  const startQuiz = useCallback(() => {
    if (stage.k !== "intro") return;
    setStage({ k: "quiz", i: stage.i });
  }, [stage]);

  return (
    <>
      <StoryRabbiSync he={rabbiHe} en={rabbiEn} rabbiLevel={rabbiLevel} />

      {stage.k === "intro" && sentence ? (
        <div className="space-y-4">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage/90">
            Sentence {stage.i + 1} of {flow.sentences.length}
          </p>
          <div className="rounded-2xl border border-ink/10 bg-parchment-deep/25 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap justify-end gap-2">
              <ExerciseAskRabbiButton compact />
              <button
                type="button"
                onClick={() => {
                  const t = storyShowNikkud ? sentence.he : stripNikkud(sentence.he);
                  speak(t.trim(), `story-intro-${sentence.id}`);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-ink-muted transition hover:border-sage/35 hover:bg-sage/5 hover:text-sage"
                aria-label="Play this sentence"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 5v10l8-5-8-5z" />
                </svg>
              </button>
              <NikkudExerciseToggle
                showNikkud={storyShowNikkud}
                onToggle={() => setStoryShowNikkud((v) => !v)}
              />
            </div>
            <Hebrew
              as="p"
              className="text-right text-xl font-medium leading-relaxed text-ink"
            >
              {storyShowNikkud ? sentence.he : stripNikkud(sentence.he)}
            </Hebrew>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {sentence.en}
            </p>
          </div>

          <div className="rounded-2xl border border-sage/20 bg-parchment-card/80 p-4 sm:p-5">
            <p className="font-label text-[9px] uppercase tracking-[0.2em] text-sage/90">
              Words
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              {sentence.words.map((w) => (
                <li
                  key={`${sentence.id}-${w.he}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/5 pb-2 last:border-0 last:pb-0"
                >
                  <Hebrew as="span" className="font-medium text-ink">
                    {storyShowNikkud ? w.he : stripNikkud(w.he)}
                  </Hebrew>
                  <span className="text-ink-muted">{w.en}</span>
                </li>
              ))}
            </ul>
            {sentence.phrases?.length ? (
              <>
                <p className="mt-4 font-label text-[9px] uppercase tracking-[0.2em] text-sage/90">
                  Phrases
                </p>
                <ul className="mt-2 space-y-2 text-sm text-ink-muted">
                  {sentence.phrases.map((p) => (
                    <li key={`${sentence.id}-${p.he}`}>
                      <Hebrew as="span" className="font-medium text-ink">
                        {p.he}
                      </Hebrew>
                      {" — "}
                      {p.noteEn}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className="mt-4 font-label text-[9px] uppercase tracking-[0.2em] text-sage/90">
              Grammar
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {sentence.grammar.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <p className="mt-4 font-label text-[9px] uppercase tracking-[0.2em] text-sage/90">
              Why it fits together
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {sentence.tieTogetherEn}
            </p>
          </div>

          <button
            type="button"
            onClick={startQuiz}
            className="w-full rounded-2xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
          >
            Quiz this sentence
          </button>
        </div>
      ) : null}

      {stage.k === "quiz" && quizPack ? (
        <McqDrill
          key={`quiz-${sentence?.id ?? stage.i}`}
          pack={quizPack}
          defaultShowNikkud={nikkudDefault}
          skillTags={skillTags}
          onPracticeAnswer={onPracticeAnswer}
          rabbiLevel={rabbiLevel}
          courseSurface="embed"
          flowContinue={{
            label:
              stage.i + 1 < flow.sentences.length
                ? "Next sentence"
                : "Read the whole story",
            onContinue: afterSentenceQuiz,
          }}
        />
      ) : null}

      {stage.k === "full" ? (
        <div className="space-y-4">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage/90">
            Full passage
          </p>
          <div className="rounded-2xl border border-ink/10 bg-parchment-deep/20 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap justify-end gap-2">
              <ExerciseAskRabbiButton compact />
              <NikkudExerciseToggle
                showNikkud={storyShowNikkud}
                onToggle={() => setStoryShowNikkud((v) => !v)}
              />
            </div>
            <BilingualReadAloudPassage
              he={flow.storyHe}
              en={flow.storyEn}
              showNikkud={storyShowNikkud}
              glossByWord={glossByWord}
              showSaveWord
            />
          </div>
          <button
            type="button"
            onClick={() => setStage({ k: "final" })}
            className="w-full rounded-2xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
          >
            Story comprehension — Hebrew answers
          </button>
        </div>
      ) : null}

      {stage.k === "final" ? (
        <McqDrill
          key="story-final-mcq"
          pack={flow.finalMcqPack}
          defaultShowNikkud={nikkudDefault}
          skillTags={[...skillTags, "comprehension"]}
          onPracticeAnswer={onPracticeAnswer}
          rabbiLevel={rabbiLevel}
          courseSurface="embed"
          flowContinue={flowContinue}
        />
      ) : null}
    </>
  );
}
