"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { Hebrew } from "@/components/Hebrew";
import { useHebrewSpeech } from "@/hooks/useHebrewSpeech";
import { getCourseSentence } from "@/data/course-sentences";
import { glossForHebrewToken } from "@/data/course-sentence-token-glosses";
import {
  sentenceFeedbackWhy,
  sentenceVariant,
} from "@/lib/correct-sentence-variant";
import { generateContent } from "@/lib/generate-content";
import { LEARN_VOICE } from "@/lib/learn-user-voice";
import { tokenizeHebrew } from "@/hooks/useHebrewSpeech";
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
  const { speak, voices } = useHebrewSpeech();
  const ttsAvailable = voices.length > 0;
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
            culturalNote: item.vibeNote,
          })
        : null,
    [item, rabbiMeaningEn],
  );

  const courseSentence = useMemo(
    () => (item?.promptHe ? getCourseSentence(item.promptHe) : null),
    [item?.promptHe],
  );

  const pickFeedback = useMemo(() => {
    if (picked == null || !item) return null;
    const he = item.optionsHe[picked]!;
    const en = (item.optionsEn?.[picked] ?? "").trim();
    const correctHe = item.optionsHe[item.correctIndex]!;
    const correctEn = (item.optionsEn?.[item.correctIndex] ?? "").trim();
    const v =
      courseSentence != null
        ? sentenceVariant(courseSentence, he)
        : null;
    const why = !isRight
      ? v != null
        ? sentenceFeedbackWhy(v, false)
        : "Compare the word glosses and the natural line below — your choice doesn’t match the best fit for this prompt."
      : v != null
        ? sentenceFeedbackWhy(v, true)
        : "Nice — this is the most natural line here.";
    const tokens = tokenizeHebrew(he);
    return { he, en, correctHe, correctEn, v, why, tokens };
  }, [picked, item, courseSentence, isRight]);

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

      {learnContent?.vibeLine ? (
        <div className="mt-4 space-y-2 rounded-2xl border border-sage/20 bg-gradient-to-br from-sage/5 to-parchment-deep/20 px-4 py-3 shadow-inner">
          <p className="font-label text-[9px] uppercase tracking-[0.2em] text-sage/90">
            {LEARN_VOICE.vibeEyebrow}
          </p>
          <p className="whitespace-pre-line text-xs leading-relaxed text-ink-muted">
            {learnContent.vibeLine}
          </p>
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

      {picked != null && pickFeedback ? (
        <div className="mt-4 rounded-2xl border-2 border-ink/10 bg-parchment/90 p-4 text-sm shadow-inner">
          <div className="flex items-start justify-between gap-4">
            <div>
              {isRight ? (
                <p className="text-sage">{LEARN_VOICE.mcqCorrect}</p>
              ) : (
                <p className="text-ink-muted">
                  {LEARN_VOICE.correctSentenceEncourageWrong}
                </p>
              )}
            </div>
            {ttsAvailable && (
              <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    speak(
                      item.optionsHe[picked]!,
                      `cs-picked-${item.id}`,
                    )
                  }
                  className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-ink/15 bg-parchment-card/80 px-3 text-ink-muted transition hover:border-sage/30 hover:text-ink"
                  aria-label="Play your chosen sentence"
                >
                  <span className="text-lg leading-none" aria-hidden>
                    🔊
                  </span>
                  <span className="font-label text-[9px] uppercase tracking-wide">
                    Yours
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    speak(
                      item.optionsHe[item.correctIndex]!,
                      `cs-correct-${item.id}`,
                    )
                  }
                  className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sage/30 bg-sage/10 px-3 text-sage transition hover:bg-sage/20"
                  aria-label="Play natural line"
                >
                  <span className="text-lg leading-none" aria-hidden>
                    🔊
                  </span>
                  <span className="font-label text-[9px] uppercase tracking-wide">
                    Natural
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 space-y-2 rounded-xl border border-ink/8 bg-parchment-card/60 px-3 py-2.5">
            <p className="font-label text-[9px] uppercase tracking-[0.12em] text-ink-faint">
              Your line
            </p>
            <Hebrew className="text-base font-medium leading-relaxed text-ink">
              {pickFeedback.he}
            </Hebrew>
            {pickFeedback.en ? (
              <p className="text-xs leading-relaxed text-ink-muted">
                {pickFeedback.en}
              </p>
            ) : null}
          </div>

          {pickFeedback.why && (
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              {pickFeedback.why}
            </p>
          )}

          {pickFeedback.tokens.length > 0 && (
            <div className="mt-3">
              <p className="font-label text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                Word gloss
              </p>
              <ul className="mt-1.5 space-y-1.5 text-xs">
                {pickFeedback.tokens.map((t, i) => {
                  const g = glossForHebrewToken(t);
                  return (
                    <li
                      key={i}
                      className="flex flex-wrap gap-x-2 gap-y-0.5 border-b border-ink/5 py-0.5 last:border-0"
                    >
                      <Hebrew as="span" className="text-ink">
                        {t}
                      </Hebrew>
                      <span className="text-ink-faint">→</span>
                      <span className="text-ink-muted">
                        {g ?? "— (see full line above)"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!isRight && (
            <div className="mt-4 rounded-xl border border-sage/25 bg-sage/5 px-3 py-2.5">
              <p className="font-label text-[9px] uppercase tracking-[0.12em] text-sage/90">
                Natural line
              </p>
              <Hebrew className="mt-1 text-base font-medium text-ink">
                {pickFeedback.correctHe}
              </Hebrew>
              {pickFeedback.correctEn ? (
                <p className="mt-1 text-xs text-ink-muted">
                  {pickFeedback.correctEn}
                </p>
              ) : null}
            </div>
          )}
          
          {item.streetVariant && isRight && (
            <div className="mt-4 rounded-xl bg-sage/5 p-3 border border-sage/15">
              <p className="font-label text-[9px] uppercase tracking-wide text-sage/80 mb-1">
                Street Hebrew Variant
              </p>
              <div className="flex items-center justify-between gap-2">
                <Hebrew className="text-base text-ink">{item.streetVariant}</Hebrew>
                {ttsAvailable && (
                  <button
                    type="button"
                    onClick={() =>
                      speak(item.streetVariant!, `cs-street-${item.id}`)
                    }
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sage/30 bg-sage/10 text-sage transition hover:bg-sage/20"
                    aria-label="Play street variant"
                  >
                    <span className="text-sm leading-none" aria-hidden>
                      🔊
                    </span>
                  </button>
                )}
              </div>
            </div>
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
