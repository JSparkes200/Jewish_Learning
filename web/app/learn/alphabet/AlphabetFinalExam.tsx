"use client";

import { useState } from "react";
import { AlphabetTracePad } from "@/components/AlphabetTracePad";
import { McqDrill } from "@/components/McqDrill";
import {
  ALPHABET_FINAL_SOUND_MIN_PCT,
  ALPHABET_FINAL_SOUND_PACK,
  ALPHABET_FINAL_TRACE_IDS,
  getLetterById,
} from "@/data/alphabet-letters";
import { meetsFoundationExitPassPercent } from "@/lib/foundation-exit-pass";
import {
  completeAlphabetTrack,
  type GradedPracticeContext,
  loadLearnProgress,
  recordGradedAnswer,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  touchDailyStreak,
  type LearnProgressState,
} from "@/lib/learn-progress";

const SOUND_TOTAL = ALPHABET_FINAL_SOUND_PACK.items.length;
const SOUND_PASS_NEED = Math.ceil(
  ALPHABET_FINAL_SOUND_MIN_PCT * SOUND_TOTAL - 1e-9,
);

type Props = {
  onComplete: (next: LearnProgressState) => void;
};

export function AlphabetFinalExam({ onComplete }: Props) {
  const [traceIdx, setTraceIdx] = useState(0);
  const [soundAttempt, setSoundAttempt] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  const traceTotal = ALPHABET_FINAL_TRACE_IDS.length;
  const tid =
    traceIdx < traceTotal ? ALPHABET_FINAL_TRACE_IDS[traceIdx] : null;
  const letterMeta = tid ? getLetterById(tid) : null;

  const onSoundPractice = (
    correct: boolean,
    ctx?: GradedPracticeContext,
  ) => {
    const cur = loadLearnProgress();
    let n = touchDailyStreak(cur);
    n = recordGradedAnswer(n, correct, ctx);
    n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
    saveLearnProgress(n);
  };

  const onSoundPackComplete = (result: {
    correct: number;
    total: number;
  }) => {
    setSoundAttempt(result);
    if (
      meetsFoundationExitPassPercent(
        result.correct,
        result.total,
        ALPHABET_FINAL_SOUND_MIN_PCT,
      )
    ) {
      const cur = loadLearnProgress();
      const next = completeAlphabetTrack(cur);
      saveLearnProgress(next);
      onComplete(next);
    }
  };

  if (letterMeta && traceIdx < traceTotal) {
    return (
      <div className="rounded-2xl border border-amber/30 bg-amber/5 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-amber">
          Final — trace {traceIdx + 1}/{traceTotal}
        </p>
        <p className="mt-2 text-sm text-ink">
          Trace <strong className="font-hebrew text-lg">{letterMeta.char}</strong>{" "}
          ({letterMeta.name}) from memory — dotted guide helps.
        </p>
        <div className="mt-4">
          <AlphabetTracePad
            key={tid}
            letter={letterMeta.char}
            onPass={() => setTraceIdx((i) => i + 1)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sage/30 bg-sage/5 p-4">
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
        Final — sounds
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        {SOUND_TOTAL} questions — need at least {SOUND_PASS_NEED} correct for a
        pass.
      </p>
      <div className="mt-4">
        <McqDrill
          pack={ALPHABET_FINAL_SOUND_PACK}
          corpusMaxLevel={1}
          defaultShowNikkud={false}
          skillTags={["recognition", "listening", "definition"]}
          onPracticeAnswer={onSoundPractice}
          endHint={
            soundAttempt
              ? meetsFoundationExitPassPercent(
                  soundAttempt.correct,
                  soundAttempt.total,
                  ALPHABET_FINAL_SOUND_MIN_PCT,
                )
                ? "Score meets the bar — alphabet track complete."
                : `Score ${soundAttempt.correct}/${soundAttempt.total}. Need at least ${Math.ceil(ALPHABET_FINAL_SOUND_MIN_PCT * soundAttempt.total - 1e-9)} of ${soundAttempt.total}.`
              : "Pass to finish the alphabet track."
          }
          onPackComplete={onSoundPackComplete}
        />
      </div>
      {soundAttempt &&
      !meetsFoundationExitPassPercent(
        soundAttempt.correct,
        soundAttempt.total,
        ALPHABET_FINAL_SOUND_MIN_PCT,
      ) ? (
        <p className="mt-2 text-xs text-rust">
          Review the sounds and use Practice again to retry the quiz.
        </p>
      ) : null}
    </div>
  );
}
