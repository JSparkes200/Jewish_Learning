"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HebrewTapText } from "@/components/HebrewTapText";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import { stripNikkud } from "@/lib/hebrew-nikkud";
import type { GradedPracticeContext, SkillMetricKey } from "@/lib/learn-progress";
import type {
  ComprehensionPassage,
  ComprehensionQuestion,
} from "@/data/course-comprehension";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffled options + correct answer text (stable check after shuffle). */
function choicesFor(q: ComprehensionQuestion): {
  options: string[];
  correctText: string;
} {
  const correctText = q.opts[q.ans];
  const options = shuffle([...q.opts]);
  return { options, correctText };
}

type Props = {
  passage: ComprehensionPassage;
  className?: string;
  /** Lesson default for showing vowel points; learner toggles for this screen only. */
  defaultShowNikkud?: boolean;
  /** Comprehension does not pass `promptHe` (English questions); second arg reserved for MCQ parity. */
  onPracticeAnswer?: (
    correct: boolean,
    context?: GradedPracticeContext,
  ) => void;
  /** Skill dimensions this drill should train. */
  skillTags?: SkillMetricKey[];
};

export function ComprehensionDrill({
  passage,
  className = "",
  defaultShowNikkud = true,
  onPracticeAnswer,
  skillTags = ["comprehension", "recognition", "definition"],
}: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showNikkud, setShowNikkud] = useState(defaultShowNikkud);

  useEffect(() => {
    setShowNikkud(defaultShowNikkud);
  }, [defaultShowNikkud, passage.source]);

  const q = passage.questions[qIndex];
  const { options, correctText } = useMemo(
    () => (q ? choicesFor(q) : { options: [] as string[], correctText: "" }),
    [q],
  );

  const passageDisplay = useMemo(
    () => (showNikkud ? passage.h : stripNikkud(passage.h)),
    [passage.h, showNikkud],
  );

  const done = qIndex >= passage.questions.length;
  const lastRight = picked != null && picked === correctText;

  const onPick = useCallback(
    (choice: string) => {
      if (picked != null || !q) return;
      setPicked(choice);
      onPracticeAnswer?.(choice === correctText, { skills: skillTags });
      if (choice === correctText) setCorrectCount((c) => c + 1);
    },
    [picked, q, correctText, onPracticeAnswer, skillTags],
  );

  const nextQ = useCallback(() => {
    setPicked(null);
    setQIndex((i) => i + 1);
  }, []);

  if (done) {
    return (
      <div
        className={`rounded-2xl border border-sage/25 bg-sage/5 p-4 ${className}`.trim()}
      >
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          Comprehension complete
        </p>
        <p className="mt-2 text-sm text-ink">
          Score:{" "}
          <strong>
            {correctCount}/{passage.questions.length}
          </strong>
          . Mark the section complete when you are ready.
        </p>
        <button
          type="button"
          onClick={() => {
            setQIndex(0);
            setPicked(null);
            setCorrectCount(0);
          }}
          className="mt-4 rounded-lg border border-ink/15 bg-parchment-card px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
        >
          Practice questions again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`.trim()}>
      <div className="rounded-2xl border border-ink/12 bg-parchment-card/90 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="min-w-0 flex-1 font-label text-[9px] uppercase tracking-[0.15em] text-ink-muted">
            Source · {passage.source}
          </p>
          <NikkudExerciseToggle
            showNikkud={showNikkud}
            onToggle={() => setShowNikkud((v) => !v)}
          />
        </div>
        <div className="mt-3">
          <HebrewTapText
            text={passageDisplay}
            className="text-base text-ink sm:text-lg"
            showSaveWord
          />
        </div>
        <p className="mt-4 border-t border-ink/10 pt-4 text-sm italic leading-relaxed text-ink-muted">
          {passage.e}
        </p>
        {passage.note ? (
          <p className="mt-3 rounded-lg border border-sage/20 bg-sage/5 px-3 py-2 text-xs text-ink-muted">
            {passage.note}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-ink/12 bg-parchment-card/90 p-4">
        <div className="flex justify-between text-[10px] text-ink-faint">
          <span>
            Question {qIndex + 1} of {passage.questions.length}
          </span>
          <span>
            Score {correctCount}/{passage.questions.length}
          </span>
        </div>
        <p className="mt-3 text-sm font-medium text-ink">{q.q}</p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {options.map((opt) => {
            const show = picked != null;
            const isCorrect = opt === correctText;
            const isPicked = opt === picked;
            let ring =
              "ring-1 ring-ink/12 hover:bg-parchment-deep/50 hover:ring-ink/20";
            if (show) {
              if (isCorrect) ring = "bg-sage/15 ring-2 ring-sage";
              else if (isPicked)
                ring = "bg-rust/10 ring-2 ring-rust/40 opacity-90";
              else ring = "opacity-50 ring-1 ring-ink/8";
            }
            return (
              <button
                key={opt}
                type="button"
                disabled={picked != null}
                onClick={() => onPick(opt)}
                className={`rounded-xl px-3 py-3 text-left text-sm text-ink transition ${ring}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {picked != null ? (
          <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-3 text-sm">
            {lastRight ? (
              <p className="text-sage">Correct.</p>
            ) : (
              <p className="text-ink-muted">{q.note}</p>
            )}
            <button
              type="button"
              onClick={nextQ}
              className="mt-3 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              {qIndex + 1 >= passage.questions.length ? "Finish" : "Next"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
