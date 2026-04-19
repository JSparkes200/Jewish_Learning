"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { Hebrew } from "@/components/Hebrew";
import {
  CARDINAL_MASC_0_TO_10,
  ROMAN_0_TO_10,
} from "@/data/course-numbers";
import type { GradedPracticeContext } from "@/lib/learn-progress";
import { LEARN_VOICE } from "@/lib/learn-user-voice";
import { speakHebrew } from "@/lib/speech-hebrew";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(): {
  index: number;
  correctHe: string;
  roman: string;
  options: string[];
  correctIndex: number;
} {
  const n = CARDINAL_MASC_0_TO_10.length;
  const index = Math.floor(Math.random() * n);
  const correctHe = CARDINAL_MASC_0_TO_10[index]!;
  const roman = ROMAN_0_TO_10[index] ?? String(index);
  const wrong = shuffle(
    CARDINAL_MASC_0_TO_10.filter((_, j) => j !== index),
  ).slice(0, 3);
  const options = shuffle([correctHe, ...wrong]);
  return {
    index,
    correctHe,
    roman,
    options,
    correctIndex: options.indexOf(correctHe),
  };
}

type Props = {
  onPracticeAnswer?: (
    correct: boolean,
    context?: GradedPracticeContext,
  ) => void;
  courseSurface?: "panel" | "embed";
  flowContinue?: { label: string; onContinue: () => void };
};

export function NumbersListenDrill({
  onPracticeAnswer,
  courseSurface = "panel",
  flowContinue,
}: Props) {
  const { setRabbiAskContext } = useAppShell();
  const [round, setRound] = useState(() => buildRound());
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    setRabbiAskContext({
      targetHe: round.correctHe,
      learnerLevel: "beginner",
      meaningEn: `Hebrew cardinal for this round (digit ${round.roman})`,
    });
    return () => setRabbiAskContext(null);
  }, [round.correctHe, round.roman, setRabbiAskContext]);

  const replay = useCallback(() => {
    speakHebrew(round.correctHe);
  }, [round.correctHe]);

  const nextRound = useCallback(() => {
    setRound(buildRound());
    setPicked(null);
  }, []);

  const onPick = useCallback(
    (j: number) => {
      if (picked != null) return;
      setPicked(j);
      const ok = j === round.correctIndex;
      onPracticeAnswer?.(ok, {
        promptHe: round.correctHe,
        skills: ["listening", "recognition", "definition"],
        numbersHubEngageId: "listen",
        studyGameId: "num",
      });
    },
    [picked, round.correctIndex, round.correctHe, onPracticeAnswer],
  );

  const showResult = picked != null;
  const lastOk = picked === round.correctIndex;

  const titleId = useId();

  const wrap =
    courseSurface === "embed"
      ? "rounded-2xl border border-rust/20 bg-gradient-to-br from-rust/8 to-parchment-deep/20 p-4 sm:p-5"
      : "rounded-3xl border-2 border-rust/25 bg-gradient-to-br from-rust/10 to-parchment-card/90 p-5 shadow-sm";

  return (
    <div className={wrap}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-rust/90">
          {LEARN_VOICE.numbersListenEyebrow}
        </p>
        <ExerciseAskRabbiButton compact />
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        {LEARN_VOICE.numbersListenBody}
      </p>

      <button
        type="button"
        onClick={replay}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-rust/25 bg-parchment-card/90 py-3 font-label text-[10px] uppercase tracking-wide text-ink shadow-sm transition hover:bg-parchment-deep/50 hover:shadow-md"
        aria-describedby={titleId}
      >
        <span className="text-lg" aria-hidden>
          🔊
        </span>
        {LEARN_VOICE.numbersListenPlay}
      </button>

      <p id={titleId} className="sr-only">
        {LEARN_VOICE.numbersListenSr}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {round.options.map((opt, j) => {
          const isCorrect = j === round.correctIndex;
          const isSel = j === picked;
          let ring =
            "ring-1 ring-ink/12 hover:bg-parchment-deep/50 hover:ring-ink/20";
          if (showResult) {
            if (isCorrect) ring = "bg-sage/15 ring-2 ring-sage";
            else if (isSel) ring = "bg-rust/10 ring-2 ring-rust/40 opacity-90";
            else ring = "opacity-50 ring-1 ring-ink/8";
          }
          return (
            <button
              key={`${opt}-${j}`}
              type="button"
              disabled={picked != null}
              onClick={() => onPick(j)}
              className={`rounded-2xl px-3 py-3 text-right transition ${ring}`}
            >
              <Hebrew className="text-lg text-ink">{opt}</Hebrew>
            </button>
          );
        })}
      </div>

      {showResult ? (
        <div className="mt-4 rounded-2xl border border-ink/10 bg-parchment/80 p-3 text-sm">
          {lastOk ? (
            <p className="text-sage">Nice — that’s the one you heard.</p>
          ) : (
            <p className="text-ink-muted">
              The word was{" "}
              <Hebrew className="inline text-ink">{round.correctHe}</Hebrew>
              <span className="text-ink-faint"> ({round.roman})</span>.
            </p>
          )}
          <button
            type="button"
            onClick={nextRound}
            className="mt-3 rounded-2xl bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110"
          >
            Next number →
          </button>
        </div>
      ) : null}
      {flowContinue ? (
        <div className="mt-6 border-t border-ink/10 pt-4">
          <p className="mb-3 text-xs text-ink-muted">
            When you&apos;ve had enough listening reps, you&apos;re ready for the next
            beat.
          </p>
          <button
            type="button"
            onClick={flowContinue.onContinue}
            className="w-full rounded-2xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
          >
            {flowContinue.label}
          </button>
        </div>
      ) : null}
    </div>
  );
}
