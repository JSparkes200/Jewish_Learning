"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { useAppShell } from "@/components/AppShell";
import {
  pickRandomSmikhutPair,
  smikhutAnswerMatches,
  type SmikhutPair,
} from "@/data/smikhut-game-pairs";
import type { RabbiLevel } from "@/lib/rabbi-types";
import type { GradedPracticeContext } from "@/lib/learn-progress";

const ROUNDS_GOAL = 3;

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export type SmikhutTetrisDrillProps = {
  maxDifficulty: 1 | 2 | 3;
  onPracticeAnswer: (correct: boolean, ctx?: GradedPracticeContext) => void;
  rabbiLevel: RabbiLevel;
  courseSurface?: "embed" | "page";
  flowContinue?: { label: string; onContinue: () => void };
};

export function SmikhutTetrisDrill({
  maxDifficulty,
  onPracticeAnswer,
  rabbiLevel,
  courseSurface = "page",
  flowContinue,
}: SmikhutTetrisDrillProps) {
  const { setRabbiAskContext } = useAppShell();
  const [pair, setPair] = useState<SmikhutPair | null>(null);
  const [phase, setPhase] = useState<"fall" | "choose">("fall");
  const [choices, setChoices] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [y, setY] = useState(0);
  const raf = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const loadRound = useCallback(() => {
    const rng = Math.random;
    const p = pickRandomSmikhutPair(maxDifficulty, rng);
    setPair(p);
    setPhase("fall");
    setPicked(null);
    setY(0);
    if (p) {
      const opts = shuffle(
        [p.correct, ...p.distractors.slice(0, 2)],
        rng,
      ).slice(0, 3);
      setChoices(opts);
    } else {
      setChoices([]);
    }
  }, [maxDifficulty]);

  useEffect(() => {
    loadRound();
  }, [loadRound]);

  useEffect(() => {
    if (!pair || phase !== "fall") return;
    if (prefersReducedMotion.current) {
      setY(42);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      setY((prev) => {
        const next = prev + dt * 0.045;
        return next > 100 ? 100 : next;
      });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [pair, phase]);

  useEffect(() => {
    if (!pair) return;
    setRabbiAskContext({
      targetHe: pair.correct,
      learnerLevel: rabbiLevel,
      meaningEn: pair.glossEn ?? "Construct state (סְמִיכוּת)",
    });
    return () => setRabbiAskContext(null);
  }, [pair, rabbiLevel, setRabbiAskContext]);

  const lockPair = useCallback(() => {
    setPhase("choose");
    if (raf.current != null) cancelAnimationFrame(raf.current);
  }, []);

  const onPick = useCallback(
    (c: string) => {
      if (!pair || picked) return;
      setPicked(c);
      const ok = smikhutAnswerMatches(c, pair.correct);
      onPracticeAnswer(ok, {
        promptHe: pair.correct,
        skills: ["grammar", "production"],
      });
      if (ok) setRoundCorrect((n) => n + 1);
    },
    [onPracticeAnswer, pair, picked],
  );

  const canFinish = roundCorrect >= ROUNDS_GOAL;

  const fallStyle = useMemo(
    () => ({
      transform: `translateY(${y * 1.15}px)`,
    }),
    [y],
  );

  const embedPad = courseSurface === "embed" ? "pb-2" : "pb-6";

  if (!pair) {
    return (
      <p className="text-sm text-ink-muted">
        No construct pairs at this difficulty yet.
      </p>
    );
  }

  return (
    <div className={embedPad}>
      <p className="text-sm leading-relaxed text-ink-muted">
        Let the base noun and the modifier meet — then pick the phrase that
        shows real סְמִיכוּת (not just two words sitting side by side).
      </p>

      {phase === "fall" ? (
        <div className="relative mt-5 h-40 overflow-hidden rounded-2xl border border-ink/10 bg-gradient-to-b from-parchment-deep/15 to-parchment-deep/40">
          <div
            className="absolute inset-x-0 top-0 flex justify-center gap-4 px-3 transition-transform duration-75 ease-linear"
            style={fallStyle}
          >
            <div className="rounded-lg border border-sage/25 bg-parchment-card/95 px-3 py-2 shadow-sm">
              <p className="font-label text-[7px] uppercase tracking-widest text-sage">
                Base
              </p>
              <Hebrew className="text-base font-medium text-ink">{pair.base}</Hebrew>
            </div>
            <div className="rounded-lg border border-amber/25 bg-parchment-card/95 px-3 py-2 shadow-sm">
              <p className="font-label text-[7px] uppercase tracking-widest text-amber">
                Modifier
              </p>
              <Hebrew className="text-base font-medium text-ink">{pair.modifier}</Hebrew>
            </div>
          </div>
          <div className="absolute inset-x-4 bottom-0 h-9 rounded-t-lg border-x-2 border-t-2 border-dashed border-sage/35 bg-sage/5" />
          <p className="absolute bottom-10 inset-x-0 text-center text-[10px] text-ink-faint">
            Tap lock when the pair sits in the dashed band
          </p>
        </div>
      ) : null}

      {phase === "fall" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={lockPair}
            className="rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110"
          >
            Lock pair
          </button>
          <ExerciseAskRabbiButton compact />
        </div>
      ) : null}

      {phase === "choose" ? (
        <div className="mt-5 space-y-3">
          <p className="text-xs text-ink-muted">
            Joined phrase — which shape is grammatical?
            {pair.glossEn ? (
              <span className="block text-[11px] text-ink-faint">
                Hint: {pair.glossEn}
              </span>
            ) : null}
          </p>
          <div className="flex flex-col gap-2">
            {choices.map((c) => {
              const isSel = picked === c;
              let tone =
                "border-ink/12 bg-parchment-card hover:border-sage/30 hover:bg-parchment-deep/25";
              if (picked && isSel) {
                tone = smikhutAnswerMatches(c, pair.correct)
                  ? "border-sage bg-sage/10"
                  : "border-amber/40 bg-amber/5";
              }
              return (
                <button
                  key={c}
                  type="button"
                  disabled={!!picked}
                  onClick={() => onPick(c)}
                  className={`rounded-xl border px-4 py-3 text-right text-base text-ink transition ${tone}`}
                  dir="rtl"
                >
                  <Hebrew>{c}</Hebrew>
                </button>
              );
            })}
          </div>
          {picked ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadRound}
                className="rounded-full border border-sage/35 px-4 py-2 font-label text-[9px] uppercase tracking-wide text-sage hover:bg-sage/10"
              >
                Next pair
              </button>
              <span className="self-center text-xs text-ink-muted">
                {roundCorrect}/{ROUNDS_GOAL} correct
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {canFinish && flowContinue ? (
        <div className="mt-8 border-t border-ink/10 pt-4">
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
