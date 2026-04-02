"use client";

import { useCallback, useId, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  CARDINAL_MASC_0_TO_10,
  ROMAN_0_TO_10,
} from "@/data/course-numbers";
import type { GradedPracticeContext } from "@/lib/learn-progress";
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
};

export function NumbersListenDrill({ onPracticeAnswer }: Props) {
  const [round, setRound] = useState(() => buildRound());
  const [picked, setPicked] = useState<number | null>(null);

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
      });
    },
    [picked, round.correctIndex, round.correctHe, onPracticeAnswer],
  );

  const showResult = picked != null;
  const lastOk = picked === round.correctIndex;

  const titleId = useId();

  return (
    <div className="rounded-2xl border border-rust/25 bg-rust/5 p-4">
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Listen &amp; pick
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Play the spoken number (0–10), then tap the Hebrew you heard. Matches
        the legacy course numbers modal; uses your browser&apos;s Hebrew voice
        when available.
      </p>

      <button
        type="button"
        onClick={replay}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rust/30 bg-parchment-card/90 py-3 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/50"
        aria-describedby={titleId}
      >
        <span className="text-lg" aria-hidden>
          🔊
        </span>
        Play number
      </button>

      <p id={titleId} className="sr-only">
        Choose the Hebrew word for the number you hear
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
              className={`rounded-xl px-3 py-3 text-right transition ${ring}`}
            >
              <Hebrew className="text-lg text-ink">{opt}</Hebrew>
            </button>
          );
        })}
      </div>

      {showResult ? (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-3 text-sm">
          {lastOk ? (
            <p className="text-sage">Correct.</p>
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
            className="mt-3 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            Next number →
          </button>
        </div>
      ) : null}
    </div>
  );
}
