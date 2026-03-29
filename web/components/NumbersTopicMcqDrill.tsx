"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  DAYS_EN,
  DAYS_HE,
  ORDINAL_HE,
  ORDINAL_PRON,
  TIME_EN,
  TIME_HE,
  TIME_PRON,
} from "@/data/course-numbers-extra";
import { speakHebrew } from "@/lib/speech-hebrew";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function enOrdinalPosition(i: number): string {
  const n = i + 1;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
  return `${n}th`;
}

export type NumbersTopicVariant = "ordinal" | "days" | "time";

type Round = {
  index: number;
  prompt: string;
  subline?: string;
  options: string[];
  correctHe: string;
  correctIndex: number;
};

function buildRound(variant: NumbersTopicVariant): Round {
  if (variant === "ordinal") {
    const pool = ORDINAL_HE;
    const n = pool.length;
    const index = Math.floor(Math.random() * n);
    const correctHe = pool[index]!;
    const wrong = shuffle(pool.filter((_, j) => j !== index)).slice(0, 3);
    const options = shuffle([correctHe, ...wrong]);
    return {
      index,
      prompt: enOrdinalPosition(index),
      subline: "Which Hebrew ordinal matches this position?",
      options,
      correctHe,
      correctIndex: options.indexOf(correctHe),
    };
  }
  if (variant === "days") {
    const pool = DAYS_HE;
    const n = pool.length;
    const index = Math.floor(Math.random() * n);
    const correctHe = pool[index]!;
    const wrong = shuffle(pool.filter((_, j) => j !== index)).slice(0, 3);
    const options = shuffle([correctHe, ...wrong]);
    return {
      index,
      prompt: DAYS_EN[index] ?? "",
      subline: "Pick the Hebrew day name.",
      options,
      correctHe,
      correctIndex: options.indexOf(correctHe),
    };
  }
  const pool = TIME_HE;
  const n = pool.length;
  const index = Math.floor(Math.random() * n);
  const correctHe = pool[index]!;
  const wrong = shuffle(pool.filter((_, j) => j !== index)).slice(0, 3);
  const options = shuffle([correctHe, ...wrong]);
  return {
    index,
    prompt: TIME_EN[index] ?? "",
    subline: "Pick the Hebrew time word.",
    options,
    correctHe,
    correctIndex: options.indexOf(correctHe),
  };
}

const VARIANT_META: Record<
  NumbersTopicVariant,
  { title: string; border: string; bg: string }
> = {
  ordinal: {
    title: "Ordinals",
    border: "border-amber/25",
    bg: "bg-amber/5",
  },
  days: {
    title: "Days of the week",
    border: "border-burg/25",
    bg: "bg-burg/5",
  },
  time: {
    title: "Time words",
    border: "border-sage/25",
    bg: "bg-sage/5",
  },
};

type Props = {
  variant: NumbersTopicVariant;
  onPracticeAnswer?: (
    correct: boolean,
    context?: { promptHe?: string },
  ) => void;
};

export function NumbersTopicMcqDrill({ variant, onPracticeAnswer }: Props) {
  const [round, setRound] = useState(() => buildRound(variant));
  const [picked, setPicked] = useState<number | null>(null);

  const meta = VARIANT_META[variant];

  const nextRound = useCallback(() => {
    setRound(buildRound(variant));
    setPicked(null);
  }, [variant]);

  const onPick = useCallback(
    (j: number) => {
      if (picked != null) return;
      setPicked(j);
      const ok = j === round.correctIndex;
      onPracticeAnswer?.(ok, { promptHe: round.correctHe });
    },
    [picked, round.correctHe, round.correctIndex, onPracticeAnswer],
  );

  const playAnswer = useCallback(() => {
    speakHebrew(round.correctHe);
  }, [round.correctHe]);

  const showResult = picked != null;
  const lastOk = picked === round.correctIndex;

  const hint = useMemo(() => {
    if (variant !== "ordinal") return null;
    return ORDINAL_PRON[round.index];
  }, [variant, round.index]);

  const timeHint = useMemo(() => {
    if (variant !== "time") return null;
    return TIME_PRON[round.index];
  }, [variant, round.index]);

  const titleId = useId();

  return (
    <div
      className={`rounded-2xl border p-4 ${meta.border} ${meta.bg}`}
      aria-labelledby={titleId}
    >
      <p
        id={titleId}
        className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted"
      >
        {meta.title}
      </p>
      <p
        className={`mt-3 text-center font-serif text-3xl font-semibold text-rust ${
          variant === "ordinal" ? "" : "capitalize"
        }`}
      >
        {round.prompt}
      </p>
      <p className="mt-1 text-center text-[11px] text-ink-faint">
        {round.subline}
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
              Answer:{" "}
              <Hebrew className="inline text-ink">{round.correctHe}</Hebrew>
            </p>
          )}
          <button
            type="button"
            onClick={playAnswer}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-ink/12 bg-parchment-deep/40 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/60"
          >
            <span aria-hidden>🔊</span>
            Play Hebrew
          </button>
          {hint ? (
            <p className="mt-1 text-[11px] text-ink-faint italic">{hint}</p>
          ) : null}
          {timeHint ? (
            <p className="mt-1 text-[11px] text-ink-faint italic">
              {timeHint}
            </p>
          ) : null}
          <button
            type="button"
            onClick={nextRound}
            className="mt-3 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}
