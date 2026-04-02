"use client";

import { useCallback, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import type { GradedPracticeContext } from "@/lib/learn-progress";
import type { CorrectSentencePack } from "@/lib/sentence-correctness";

type Props = {
  pack: CorrectSentencePack;
  className?: string;
  onPracticeAnswer?: (
    correct: boolean,
    context?: GradedPracticeContext,
  ) => void;
  endHint?: string;
};

export function CorrectSentenceDrill({
  pack,
  className = "",
  onPracticeAnswer,
  endHint,
}: Props) {
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
      });
      if (ok) setCorrectCount((c) => c + 1);
    },
    [item, picked, onPracticeAnswer],
  );

  const next = useCallback(() => {
    setPicked(null);
    setIndex((i) => i + 1);
  }, []);

  const prompt = useMemo(() => item?.promptEn ?? "", [item]);

  if (done) {
    return (
      <div
        className={`rounded-2xl border border-sage/25 bg-sage/5 p-4 ${className}`.trim()}
      >
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          Correct sentence complete
        </p>
        <p className="mt-2 text-sm text-ink">
          You got{" "}
          <strong>
            {correctCount}/{pack.items.length}
          </strong>{" "}
          right.
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          {endHint ?? "This mode trains production + grammar judgment."}
        </p>
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setPicked(null);
            setCorrectCount(0);
          }}
          className="mt-4 rounded-lg border border-ink/15 bg-parchment-card px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
        >
          Practice again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-ink/12 bg-parchment-card/90 p-4 ${className}`.trim()}
    >
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        {pack.title}
      </p>
      {pack.intro ? (
        <p className="mt-1 text-xs text-ink-muted">{pack.intro}</p>
      ) : null}

      <div className="mt-4 flex items-center justify-between text-[10px] text-ink-faint">
        <span>
          Question {index + 1} of {pack.items.length}
        </span>
        <span>
          Score {correctCount}/{pack.items.length}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-ink">{prompt}</p>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {item.optionsHe.map((opt, j) => {
          const show = picked != null;
          const isCorrect = j === item.correctIndex;
          const isPicked = j === picked;
          let ring =
            "ring-1 ring-ink/12 hover:bg-parchment-deep/50 hover:ring-ink/20";
          if (show) {
            if (isCorrect) ring = "bg-sage/15 ring-2 ring-sage";
            else if (isPicked) ring = "bg-rust/10 ring-2 ring-rust/40 opacity-90";
            else ring = "opacity-50 ring-1 ring-ink/8";
          }
          return (
            <button
              key={`${item.id}-${j}`}
              type="button"
              disabled={show}
              onClick={() => onPick(j)}
              className={`rounded-xl px-3 py-3 text-right text-sm transition ${ring}`}
            >
              <Hebrew className="text-base text-ink">{opt}</Hebrew>
            </button>
          );
        })}
      </div>

      {picked != null ? (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-3 text-sm">
          {isRight ? (
            <p className="text-sage">Correct.</p>
          ) : (
            <p className="text-ink-muted">
              Review sentence structure and meaning, then try the next one.
            </p>
          )}
          <button
            type="button"
            onClick={next}
            className="mt-3 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            {index + 1 >= pack.items.length ? "Finish" : "Next question"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
