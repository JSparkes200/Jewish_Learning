"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { Hebrew } from "@/components/Hebrew";
import { generateContent } from "@/lib/generate-content";
import { LEARN_VOICE } from "@/lib/learn-user-voice";
import type {
  DashboardGameId,
  GradedPracticeContext,
} from "@/lib/learn-progress";
import type { RabbiLevel } from "@/lib/rabbi-types";
import type { CorrectSentencePack } from "@/lib/sentence-correctness";

function glossFromSentencePrompt(promptEn: string): string | undefined {
  const m = promptEn.match(/"([^"]+)"/);
  return m?.[1]?.trim() || undefined;
}

type Props = {
  pack: CorrectSentencePack;
  className?: string;
  onPracticeAnswer?: (
    correct: boolean,
    context?: GradedPracticeContext,
  ) => void;
  endHint?: string;
  studyGameId?: DashboardGameId;
  /** When set, shows Ask the Rabbi for the current cue (course sections). */
  rabbiLevel?: RabbiLevel;
  courseSurface?: "panel" | "embed";
  flowContinue?: { label: string; onContinue: () => void };
};

export function CorrectSentenceDrill({
  pack,
  className = "",
  onPracticeAnswer,
  endHint,
  studyGameId = "sent",
  rabbiLevel,
  courseSurface = "panel",
  flowContinue,
}: Props) {
  const { setRabbiAskContext } = useAppShell();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const item = pack.items[index];
  const done = index >= pack.items.length;
  const isRight = picked != null && item && picked === item.correctIndex;

  const onPick = useCallback(
    (j: number) => {
      if (!item || picked != null) return;
      setPicked(j);
      const ok = j === item.correctIndex;
      onPracticeAnswer?.(ok, {
        promptHe: item.promptHe,
        skills: ["production", "grammar", "definition"],
        studyGameId,
      });
      if (ok) setCorrectCount((c) => c + 1);
    },
    [item, picked, onPracticeAnswer, studyGameId],
  );

  const next = useCallback(() => {
    setPicked(null);
    setIndex((i) => i + 1);
  }, []);

  const prompt = useMemo(() => item?.promptEn ?? "", [item]);

  const rabbiTargetHe = useMemo(() => {
    if (!item) return "";
    const key = item.promptHe?.trim();
    if (key) return key;
    return item.optionsHe[item.correctIndex] ?? "";
  }, [item]);

  const rabbiMeaningEn = useMemo(
    () => (item ? glossFromSentencePrompt(item.promptEn) : undefined),
    [item],
  );

  const learnContent = useMemo(
    () =>
      item?.promptHe
        ? generateContent({
            promptHe: item.promptHe,
            correctEn:
              rabbiMeaningEn?.trim() ||
              item.promptEn.slice(0, 160) ||
              "this cue",
            translit: item.translit,
            shoresh: item.shoresh,
            mnemonic: item.mnemonic,
            culturalNote: item.vibeNote,
          })
        : null,
    [item, rabbiMeaningEn],
  );

  useEffect(() => {
    if (!rabbiTargetHe.trim()) {
      setRabbiAskContext(null);
      return;
    }
    setRabbiAskContext({
      targetHe: rabbiTargetHe.trim(),
      learnerLevel: rabbiLevel ?? "beginner",
      meaningEn: rabbiMeaningEn,
    });
    return () => setRabbiAskContext(null);
  }, [
    rabbiLevel,
    rabbiTargetHe,
    rabbiMeaningEn,
    item?.id,
    setRabbiAskContext,
  ]);

  const introText = pack.intro ?? LEARN_VOICE.correctSentenceIntro;

  if (done) {
    const doneWrap =
      courseSurface === "embed"
        ? "rounded-2xl border border-sage/25 bg-gradient-to-br from-sage/10 to-parchment-deep/25 p-4 sm:p-5"
        : "rounded-3xl border-2 border-sage/30 bg-gradient-to-br from-sage/12 via-parchment-card/95 to-parchment-deep/40 p-5 shadow-[0_10px_40px_rgba(74,104,48,0.1)]";
    return (
      <div className={`${doneWrap} ${className}`.trim()}>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
          {LEARN_VOICE.correctSentenceCompleteTitle}
        </p>
        <p className="mt-2 text-sm text-ink">
          You got{" "}
          <strong>
            {correctCount}/{pack.items.length}
          </strong>{" "}
          right — your ear’s leveling up.
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          {endHint ??
            "You’re training how real Hebrew sentences feel, not just word lists."}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setPicked(null);
              setCorrectCount(0);
            }}
            className="rounded-2xl border-2 border-sage/25 bg-parchment-card px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-ink shadow-sm transition hover:border-sage/40 hover:shadow-md"
          >
            {LEARN_VOICE.mcqPracticeAgain}
          </button>
          {flowContinue ? (
            <button
              type="button"
              onClick={flowContinue.onContinue}
              className="rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
            >
              {flowContinue.label}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const outerActive =
    courseSurface === "embed"
      ? `space-y-4 ${className}`.trim()
      : `rounded-3xl border-2 border-ink/10 bg-gradient-to-br from-parchment-card/95 to-parchment-deep/35 p-5 shadow-[0_8px_32px_rgba(44,36,22,0.07)] ${className}`.trim();

  return (
    <div className={outerActive}>
      <p className="mt-1 text-sm font-medium text-ink">{pack.title}</p>
      <p className="font-label text-[9px] uppercase tracking-[0.18em] text-sage/80">
        {LEARN_VOICE.correctSentenceTitle}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{introText}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] text-ink-faint">
        <span>
          Challenge {index + 1} of {pack.items.length}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <ExerciseAskRabbiButton compact />
          <span>
            Your score {correctCount}/{pack.items.length}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium leading-relaxed text-ink">
        {prompt}
      </p>

      {learnContent ? (
        <div className="mt-4 space-y-2 rounded-2xl border border-amber/30 bg-gradient-to-br from-amber/12 to-parchment-deep/30 px-4 py-3 shadow-inner">
          <p className="font-label text-[9px] uppercase tracking-[0.2em] text-amber">
            {LEARN_VOICE.mnemonicEyebrow}
          </p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
            {learnContent.mnemonic}
          </p>
          {learnContent.vibeLine ? (
            <>
              <p className="pt-1 font-label text-[9px] uppercase tracking-[0.2em] text-sage/90">
                {LEARN_VOICE.vibeEyebrow}
              </p>
              <p className="whitespace-pre-line text-xs leading-relaxed text-ink-muted">
                {learnContent.vibeLine}
              </p>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-2.5">
        {item.optionsHe.map((opt, j) => {
          const show = picked != null;
          const isCorrect = j === item.correctIndex;
          const isPicked = j === picked;
          let ring =
            "ring-2 ring-ink/10 hover:-translate-y-0.5 hover:bg-parchment-deep/55 hover:shadow-md hover:ring-sage/20";
          if (show) {
            if (isCorrect) ring = "bg-sage/20 ring-2 ring-sage shadow-sm";
            else if (isPicked)
              ring = "bg-rust/10 ring-2 ring-rust/35 opacity-90 shadow-sm";
            else ring = "opacity-45 ring-1 ring-ink/8";
          }
          return (
            <button
              key={`${item.id}-${j}`}
              type="button"
              disabled={show}
              onClick={() => onPick(j)}
              className={`rounded-2xl px-4 py-3.5 text-right text-sm transition-all duration-200 ${ring}`}
            >
              <Hebrew className="text-base text-ink">{opt}</Hebrew>
            </button>
          );
        })}
      </div>

      {picked != null ? (
        <div className="mt-4 rounded-2xl border-2 border-ink/10 bg-parchment/90 p-4 text-sm shadow-inner">
          {isRight ? (
            <p className="text-sage">{LEARN_VOICE.mcqCorrect}</p>
          ) : (
            <p className="text-ink-muted">
              {LEARN_VOICE.correctSentenceEncourageWrong}
            </p>
          )}
          <button
            type="button"
            onClick={next}
            className="mt-4 rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
          >
            {index + 1 >= pack.items.length
              ? LEARN_VOICE.correctSentenceFinish
              : LEARN_VOICE.correctSentenceNext}
          </button>
        </div>
      ) : null}
    </div>
  );
}
