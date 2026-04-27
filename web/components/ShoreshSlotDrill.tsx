"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { HebrewAudioControls } from "@/components/HebrewAudioControls";
import { Hebrew } from "@/components/Hebrew";
import {
  buildConjugationFeedbackDetail,
  buildConjugationMcqChoices,
  pickRandomConjugationPuzzle,
  validateConjugationAnswer,
  type ConjugationFeedbackDetail,
  type ConjugationPuzzle,
  type ConjugationTaskKind,
} from "@/lib/conjugation-engine";
import { useHebrewSpeech } from "@/hooks/useHebrewSpeech";
import type { RabbiLevel } from "@/lib/rabbi-types";
import type { GradedPracticeContext } from "@/lib/learn-progress";

const ROUNDS_GOAL = 3;

export type ShoreshSlotDrillProps = {
  maxDifficulty: 1 | 2 | 3 | 4;
  /** Alef–Dalet level from the URL: levels 1–2 use MCQ; 3–4 use typing. */
  courseLearnLevel: number;
  onPracticeAnswer: (correct: boolean, ctx?: GradedPracticeContext) => void;
  rabbiLevel: RabbiLevel;
  courseSurface?: "embed" | "page";
  flowContinue?: { label: string; onContinue: () => void };
};

function taskReelLabel(taskEn: string): string {
  if (taskEn.length <= 18) return taskEn;
  return taskEn.split("·")[0]?.trim() ?? taskEn;
}

function rootInfoBody(): string {
  return "The shoresh (שֹׁרֶשׁ) is the three consonants that carry the core meaning of a verb family. Everything you add—binyan, tense, person—is built on this skeleton.";
}

function patternInfoBody(binyanLabel: string): string {
  return `The binyan (pattern / מִשְׁקַל) is the “mold” around the root: it signals things like simple action, intensive/causative, passive, or reflexive coloring, and it fixes typical vowels. This reel landed on: ${binyanLabel}.`;
}

function taskInfoBody(taskEn: string, kind: ConjugationTaskKind): string {
  const head = `This reel states the job: “${taskEn}”.`;
  switch (kind) {
    case "infinitive":
      return `${head} Hebrew infinitives usually begin with ל־ and name the action without pinning a subject.`;
    case "past_3ms":
      return `${head} Past tense, third person masculine singular—one of the anchor “picture” forms in the verb table.`;
    case "past_3fs":
      return `${head} Past tense, third person feminine singular—the ending and vowels mark she as the doer.`;
    case "present_3ms":
      return `${head} Present / participle masculine singular — the form you often use for “he is …‑ing” in the present-time band (with the usual aspect caveats).`;
    default:
      return head;
  }
}

type ReelKind = "root" | "pattern" | "task";

function ConjugationExplainPanel({
  detail,
  feedback,
  explainToken,
}: {
  detail: ConjugationFeedbackDetail;
  feedback: "ok" | "no";
  explainToken: number;
}) {
  const {
    speak,
    stop,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
  } = useHebrewSpeech();

  useEffect(() => {
    const id = window.setTimeout(() => {
      speak(detail.targetForm, `slot-explain-auto-${explainToken}`);
    }, 500);
    return () => {
      window.clearTimeout(id);
      stop();
    };
  }, [detail.targetForm, explainToken, speak, stop]);

  return (
    <div
      className={`rounded-2xl border-2 px-4 py-4 text-sm leading-relaxed shadow-inner ${
        feedback === "ok"
          ? "border-sage/35 bg-sage/8 text-ink"
          : "border-amber/35 bg-amber/5 text-ink"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-label text-[9px] uppercase tracking-[0.18em] text-sage/90">
            Answer review
          </p>
          <p className="mt-2 text-xs text-ink-muted">{detail.summary}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            speak(detail.targetForm, `slot-explain-replay-${explainToken}`)
          }
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink/12 bg-parchment-card/80 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink-muted transition hover:border-sage/35 hover:text-sage"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-3 w-3"
            fill="currentColor"
            aria-hidden
          >
            <path d="M8 5v10l8-5-8-5z" />
          </svg>
          Play word
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-ink/10">
        {voices.length > 0 && selectedVoice ? (
          <HebrewAudioControls
            rate={rate}
            setRate={setRate}
            voices={voices}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />
        ) : (
          <p data-slot="tts-warning" className="px-3 py-2 font-label text-[9px] text-amber-900/85">
            Add a Hebrew voice in system settings to hear automatic playback.
          </p>
        )}
      </div>

      <p className="mt-3 font-label text-[8px] uppercase tracking-widest text-ink-faint">
        Automatic read-aloud once — speed applies to replay and Play word.
      </p>

      <div className="mt-4 rounded-xl border border-ink/8 bg-parchment-deep/25 px-3 py-3">
        <p className="font-label text-[8px] uppercase tracking-[0.15em] text-sage/80">
          Target form
        </p>
        <Hebrew className="mt-1 text-xl font-semibold text-ink">
          {detail.targetForm}
        </Hebrew>
        <p className="mt-3 font-label text-[8px] uppercase tracking-[0.15em] text-sage/80">
          What it means
        </p>
        <p className="mt-1 text-sm text-ink">{detail.glossEn}</p>
        <p className="mt-3 font-label text-[8px] uppercase tracking-[0.15em] text-sage/80">
          Example sentences
        </p>
        <ul className="mt-2 space-y-3">
          {detail.examples.map((ex, i) => (
            <li
              key={i}
              className="border-t border-ink/6 pt-2 first:border-t-0 first:pt-0"
            >
              <Hebrew className="block text-right text-base text-ink">
                {ex.he}
              </Hebrew>
              <p className="mt-1 text-xs leading-snug text-ink-muted">{ex.en}</p>
              <button
                type="button"
                onClick={() =>
                  speak(ex.he, `slot-explain-ex-${explainToken}-${i}`)
                }
                className="mt-1.5 font-label text-[8px] uppercase tracking-wide text-sage underline hover:text-sage/85"
              >
                Play this line
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SlotReelCard({
  label,
  kind,
  value,
  spinning,
  displayHebrew,
  puzzle,
  onInfo,
}: {
  label: string;
  kind: ReelKind;
  value: string;
  spinning: boolean;
  displayHebrew: boolean;
  puzzle: ConjugationPuzzle | null;
  onInfo: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-[#3d2f24]/25 bg-gradient-to-b from-parchment-deep/45 via-parchment-deep/25 to-parchment-deep/40 px-2 py-3 text-center shadow-[inset_0_3px_0_rgba(255,255,255,0.35),inset_0_-8px_16px_rgba(0,0,0,0.08)] sm:px-3">
      <button
        type="button"
        onClick={onInfo}
        className="absolute right-1 top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-ink/12 bg-parchment-card/90 font-serif text-[11px] font-semibold italic leading-none text-ink-muted shadow-sm transition hover:border-sage/35 hover:text-sage"
        aria-label={`Quick definition: ${label}`}
      >
        i
      </button>
      <p className="font-label text-[8px] uppercase tracking-[0.18em] text-sage/90">
        {label}
      </p>
      <div className="relative mt-2 flex h-[3.25rem] items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {spinning ? (
            <motion.div
              key="spinning"
              className="absolute inset-0 flex flex-col items-center"
              initial={{ y: 0 }}
              animate={{ y: [-8, -52, -104, -40, 0] }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              {["◆", "◎", "◇", "●", "▣"].map((sym, i) => (
                <span
                  key={i}
                  className="flex h-[2.6rem] items-center font-mono text-lg text-ink/25 blur-[1.5px]"
                >
                  {sym}
                </span>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={value}
              initial={{ y: -36, opacity: 0.2, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="px-1"
            >
              {displayHebrew ? (
                <Hebrew className="block text-sm font-medium leading-snug text-ink sm:text-base">
                  {value}
                </Hebrew>
              ) : (
                <span className="block text-xs font-medium leading-snug text-ink sm:text-sm">
                  {value}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!spinning && puzzle ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-ink/8 to-transparent"
          aria-hidden
        />
      ) : null}
    </div>
  );
}

export function ShoreshSlotDrill({
  maxDifficulty,
  courseLearnLevel,
  onPracticeAnswer,
  rabbiLevel,
  courseSurface = "page",
  flowContinue,
}: ShoreshSlotDrillProps) {
  const { setRabbiAskContext } = useAppShell();
  const mcqMode = courseLearnLevel <= 2;

  const [puzzle, setPuzzle] = useState<ConjugationPuzzle | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [mcqChoices, setMcqChoices] = useState<string[]>([]);
  const [mcqPick, setMcqPick] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "ok" | "no">("idle");
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [explanation, setExplanation] = useState<ConjugationFeedbackDetail | null>(
    null,
  );
  const [explainToken, setExplainToken] = useState(0);
  const [infoOpen, setInfoOpen] = useState<ReelKind | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);

  const applyNewPuzzle = useCallback(
    (next: ConjugationPuzzle) => {
      setPuzzle(next);
      const built = buildConjugationMcqChoices(next, maxDifficulty);
      setMcqChoices(built.choices);
      setMcqPick(null);
    },
    [maxDifficulty],
  );

  const spin = useCallback(() => {
    if (spinTimeoutRef.current != null) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    setSpinning(true);
    setFeedback("idle");
    setInput("");
    setMcqPick(null);
    setRevealed(false);
    setExplanation(null);
    const delay = 720;
    spinTimeoutRef.current = window.setTimeout(() => {
      spinTimeoutRef.current = null;
      const next = pickRandomConjugationPuzzle(maxDifficulty);
      if (next) applyNewPuzzle(next);
      setSpinning(false);
    }, delay);
  }, [maxDifficulty, applyNewPuzzle]);

  useEffect(() => {
    spin();
    return () => {
      if (spinTimeoutRef.current != null) {
        window.clearTimeout(spinTimeoutRef.current);
        spinTimeoutRef.current = null;
      }
    };
  }, [spin]);

  useEffect(() => {
    if (!puzzle) return;
    const sample = puzzle.expectedAccepted[0] ?? "";
    setRabbiAskContext({
      targetHe: sample,
      learnerLevel: rabbiLevel,
      meaningEn: `${puzzle.binyanLabel} · ${puzzle.taskEn} · root ${puzzle.rootKey}`,
    });
    return () => setRabbiAskContext(null);
  }, [puzzle, rabbiLevel, setRabbiAskContext]);

  const canFinish = roundCorrect >= ROUNDS_GOAL;

  const submit = useCallback(() => {
    if (!puzzle || spinning) return;
    let attempt = "";
    if (mcqMode) {
      if (mcqPick == null) return;
      attempt = mcqChoices[mcqPick] ?? "";
    } else {
      attempt = input;
    }
    const ok = validateConjugationAnswer(attempt, puzzle);
    setFeedback(ok ? "ok" : "no");
    setExplanation(buildConjugationFeedbackDetail(puzzle, ok, attempt));
    setExplainToken((t) => t + 1);
    onPracticeAnswer(ok, {
      promptHe: puzzle.expectedAccepted[0],
      rootKey: puzzle.rootKey,
      skills: ["production", "grammar"],
    });
    if (ok) {
      setRoundCorrect((n) => n + 1);
    }
  }, [
    input,
    mcqChoices,
    mcqMode,
    mcqPick,
    onPracticeAnswer,
    puzzle,
    spinning,
  ]);

  const showSolution = useCallback(() => {
    if (!puzzle || mcqMode) return;
    const attempt = input.trim();
    setRevealed(true);
    setFeedback("no");
    setExplanation(
      buildConjugationFeedbackDetail(
        puzzle,
        false,
        attempt || "(peeked solution)",
      ),
    );
    setExplainToken((t) => t + 1);
    onPracticeAnswer(false, {
      promptHe: puzzle.expectedAccepted[0],
      rootKey: puzzle.rootKey,
      skills: ["production", "grammar"],
    });
  }, [input, mcqMode, onPracticeAnswer, puzzle]);

  const reelValues = useMemo(
    () => ({
      root: spinning ? "···" : puzzle?.rootLetters ?? "···",
      binyan: spinning ? "···" : puzzle?.binyanLabel ?? "···",
      task: spinning ? "···" : (puzzle ? taskReelLabel(puzzle.taskEn) : "···"),
    }),
    [puzzle, spinning],
  );

  const embedPad = courseSurface === "embed" ? "pb-2" : "pb-6";

  const infoText =
    infoOpen && puzzle
      ? infoOpen === "root"
        ? rootInfoBody()
        : infoOpen === "pattern"
          ? patternInfoBody(puzzle.binyanLabel)
          : taskInfoBody(puzzle.taskEn, puzzle.taskKind)
      : null;

  return (
    <div className={embedPad}>
      <p className="text-sm leading-relaxed text-ink-muted">
        {mcqMode ? (
          <>
            <strong className="font-medium text-ink">Alef–Bet stop:</strong> spin
            the reels, then pick one of four Hebrew forms and press Check.{" "}
            <strong className="font-medium text-ink">Gimel–Dalet</strong> uses the
            same reels but you type the answer.
          </>
        ) : (
          <>
            Spin the root, binyan, and task, then type the Hebrew form — nikkud
            optional if your keyboard can’t reach every dot.
          </>
        )}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        <SlotReelCard
          label="Root"
          kind="root"
          value={reelValues.root}
          spinning={spinning}
          displayHebrew
          puzzle={puzzle}
          onInfo={() => setInfoOpen("root")}
        />
        <SlotReelCard
          label="Pattern"
          kind="pattern"
          value={reelValues.binyan}
          spinning={spinning}
          displayHebrew={false}
          puzzle={puzzle}
          onInfo={() => setInfoOpen("pattern")}
        />
        <SlotReelCard
          label="Task"
          kind="task"
          value={reelValues.task}
          spinning={spinning}
          displayHebrew={false}
          puzzle={puzzle}
          onInfo={() => setInfoOpen("task")}
        />
      </div>

      {infoOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/25 p-4 sm:items-center"
          role="dialog"
          aria-modal
          aria-labelledby="slot-info-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default border-0 bg-transparent"
            aria-label="Close"
            onClick={() => setInfoOpen(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-ink/12 bg-parchment-card p-4 shadow-2xl">
            <p
              id="slot-info-title"
              className="font-label text-[10px] uppercase tracking-[0.2em] text-sage"
            >
              Quick explanation
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink">{infoText}</p>
            <button
              type="button"
              onClick={() => setInfoOpen(null)}
              className="mt-4 w-full rounded-xl bg-sage px-4 py-2.5 font-label text-[10px] uppercase tracking-wide text-white"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="rounded-full border border-sage/35 bg-sage/10 px-4 py-2 font-label text-[9px] uppercase tracking-wide text-sage transition hover:bg-sage/20 disabled:opacity-50"
        >
          Spin again
        </button>
        <ExerciseAskRabbiButton compact />
        <span className="text-xs text-ink-muted">
          {roundCorrect}/{ROUNDS_GOAL} correct this stop
        </span>
      </div>

      {puzzle && !spinning ? (
        <div className="mt-5 space-y-3">
          {mcqMode ? (
            <>
              <p className="text-xs font-medium text-ink-muted">
                Choose the form that fits the reels, then Check.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {mcqChoices.map((choice, i) => {
                  const show = feedback !== "idle";
                  const pickedHere = mcqPick === i;
                  const isAnswer = validateConjugationAnswer(choice, puzzle);
                  const lockMcq = feedback === "ok";
                  let ring =
                    "ring-2 ring-ink/10 hover:-translate-y-0.5 hover:bg-parchment-deep/50 hover:ring-sage/25";
                  if (show && isAnswer) {
                    ring = "bg-sage/20 ring-2 ring-sage shadow-sm";
                  } else if (show && pickedHere && !isAnswer) {
                    ring =
                      "bg-rust/10 ring-2 ring-rust/35 opacity-95 shadow-sm";
                  } else if (show) {
                    ring = "opacity-40 ring-1 ring-ink/8";
                  } else if (pickedHere) {
                    ring = "bg-sage/10 ring-2 ring-sage/40 shadow-sm";
                  }
                  return (
                    <button
                      key={`${choice}-${i}`}
                      type="button"
                      disabled={lockMcq}
                      onClick={() => {
                        if (lockMcq) return;
                        setMcqPick(i);
                        if (feedback !== "idle") {
                          setFeedback("idle");
                          setExplanation(null);
                        }
                      }}
                      dir="rtl"
                      className={`rounded-2xl px-3 py-3 text-sm font-hebrew text-ink transition-all duration-200 ${ring}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <label className="block text-xs font-medium text-ink-muted">
              Your answer
              <input
                dir="rtl"
                lang="he"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (feedback === "no") {
                    setFeedback("idle");
                    setExplanation(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                className="mt-1.5 w-full rounded-xl border border-ink/12 bg-parchment-card px-3 py-2.5 font-hebrew text-lg text-ink outline-none ring-sage/20 focus:ring-2"
                autoComplete="off"
                spellCheck={false}
              />
            </label>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={
                spinning ||
                (mcqMode ? mcqPick == null || feedback === "ok" : !input.trim())
              }
              className="rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 disabled:opacity-45"
            >
              Check
            </button>
            {!mcqMode ? (
              <button
                type="button"
                onClick={showSolution}
                className="rounded-2xl border border-ink/15 px-4 py-2.5 font-label text-[10px] uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/40"
              >
                Show form
              </button>
            ) : null}
          </div>

          {puzzle.hintEn && feedback === "idle" && !mcqMode ? (
            <p className="text-xs text-ink-faint">{puzzle.hintEn}</p>
          ) : null}

          {explanation && feedback !== "idle" ? (
            <ConjugationExplainPanel
              detail={explanation}
              feedback={feedback}
              explainToken={explainToken}
            />
          ) : null}

          {feedback === "no" && revealed && puzzle && !mcqMode ? (
            <p className="text-sm text-ink-muted">
              One accepted form:{" "}
              <Hebrew className="font-medium text-ink">
                {puzzle.expectedAccepted[0]}
              </Hebrew>
            </p>
          ) : null}
          {feedback === "no" && !revealed && !mcqMode ? (
            <p className="text-sm text-amber">Not quite — try again or reveal.</p>
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
