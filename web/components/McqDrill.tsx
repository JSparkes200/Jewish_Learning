"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { HebrewAudioControls } from "@/components/HebrewAudioControls";
import { Hebrew } from "@/components/Hebrew";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import { SaveWordButton } from "@/components/SaveWordButton";
import type { McqItem, McqDrillPack } from "@/data/section-drill-types";
import { stripNikkud } from "@/lib/hebrew-nikkud";
import type {
  DashboardGameId,
  GradedPracticeContext,
  SkillMetricKey,
} from "@/lib/learn-progress";
import { generateContent } from "@/lib/generate-content";
import { LEARN_VOICE } from "@/lib/learn-user-voice";
import {
  buildInlineMcqChoices,
  buildInlineMcqHebrewChoices,
} from "@/lib/mcq-inline-choices";
import type { RabbiLevel } from "@/lib/rabbi-types";
import { useHebrewSpeech } from "@/hooks/useHebrewSpeech";

function hasHebrew(s: string): boolean {
  return /[\u0590-\u05FF]/.test(s);
}

function itemCorrectSurface(item: McqItem): string {
  if (item.choicesAreHebrew && item.correctHe?.trim()) return item.correctHe.trim();
  return item.correctEn.trim();
}

/** Hebrew (or stripped) string to read for this item — matches on-screen nikkud setting. */
function hebrewTtsText(item: McqItem, showNikkud: boolean): string | null {
  if (item.choicesAreHebrew && item.correctHe?.trim()) {
    const t = item.correctHe.trim();
    return showNikkud ? t : stripNikkud(t);
  }
  const ph = item.promptHe.trim();
  const ce = item.correctEn.trim();
  if (hasHebrew(ph)) return showNikkud ? ph : stripNikkud(ph);
  if (hasHebrew(ce)) return showNikkud ? ce : stripNikkud(ce);
  return null;
}

function mcqItemForRabbi(item: McqItem): { targetHe: string; meaningEn?: string } {
  if (item.choicesAreHebrew && item.correctHe?.trim()) {
    return {
      targetHe: item.correctHe.trim(),
      meaningEn: item.promptEn?.trim() || undefined,
    };
  }
  const ph = item.promptHe.trim();
  const ce = item.correctEn.trim();
  if (hasHebrew(ph)) {
    return {
      targetHe: ph,
      meaningEn: hasHebrew(ce) ? undefined : ce,
    };
  }
  return {
    targetHe: ce,
    meaningEn: ph || undefined,
  };
}

type McqDrillProps = {
  pack: McqDrillPack;
  className?: string;
  /**
   * When set, wrong answers are built on the server (`/api/mcq-choices`) using
   * legacy corpus `D` + inline fallback — not shipped in this client bundle.
   */
  corpusMaxLevel?: number;
  /**
   * First click on each question: `correct` is whether the chosen option matched.
   * Use for streak + practice totals (see `recordGradedAnswer`).
   * `promptHe` is the item’s Hebrew prompt for vocabulary mastery in local storage.
   */
  onPracticeAnswer?: (
    correct: boolean,
    context?: GradedPracticeContext,
  ) => void;
  /**
   * When set, replaces the default “Mark section complete” footer copy on the
   * completion screen (e.g. Study practice modal).
   */
  endHint?: string;
  /**
   * Hebrew vowel points shown by default; learner toggles for this screen only.
   * When omitted, defaults to on (e.g. Study practice).
   */
  defaultShowNikkud?: boolean;
  /**
   * Fires once when the learner reaches the completion screen (after the last
   * question). Not called again until they hit “Practice again” and finish again.
   */
  onPackComplete?: (result: { correct: number; total: number }) => void;
  /** Skill dimensions this drill should train. */
  skillTags?: SkillMetricKey[];
  /**
   * Progress dashboard bucket (defaults to `mc` for course + study multiple choice).
   */
  studyGameId?: DashboardGameId;
  /** When set, shows Ask the Rabbi for the current question (course sections). */
  rabbiLevel?: RabbiLevel;
  /** Nested inside LearnSectionClient shell — drop outer “card chrome”. */
  courseSurface?: "panel" | "embed";
  /** After this pack’s completion screen, advance to the next lesson step. */
  flowContinue?: { label: string; onContinue: () => void };
};

export function McqDrill({
  pack,
  className = "",
  corpusMaxLevel,
  onPracticeAnswer,
  endHint,
  defaultShowNikkud = true,
  onPackComplete,
  skillTags,
  studyGameId = "mc",
  rabbiLevel,
  courseSurface = "panel",
  flowContinue,
}: McqDrillProps) {
  const { setRabbiAskContext } = useAppShell();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showNikkud, setShowNikkud] = useState(defaultShowNikkud);
  const packCompleteReportedRef = useRef(false);

  const {
    speak,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
  } = useHebrewSpeech();

  const packHasHebrew = useMemo(
    () =>
      pack.items.some(
        (i) =>
          hasHebrew(i.promptHe) ||
          hasHebrew(i.correctEn) ||
          hasHebrew(i.correctHe ?? ""),
      ),
    [pack.items],
  );

  useEffect(() => {
    setShowNikkud(defaultShowNikkud);
  }, [defaultShowNikkud]);

  useEffect(() => {
    packCompleteReportedRef.current = false;
  }, [pack.title]);

  const item = pack.items[index];

  const promptDisplay = useMemo(() => {
    if (!item) return "";
    if (item.choicesAreHebrew && item.promptEn?.trim()) return item.promptEn.trim();
    return showNikkud ? item.promptHe : stripNikkud(item.promptHe);
  }, [item, showNikkud]);

  const inlineOptions = useMemo(() => {
    if (!item || corpusMaxLevel !== undefined) return null;
    if (item.choicesAreHebrew) return buildInlineMcqHebrewChoices(item);
    return buildInlineMcqChoices(item);
  }, [item, corpusMaxLevel]);

  const [corpusOptions, setCorpusOptions] = useState<string[]>([]);
  const [corpusLoading, setCorpusLoading] = useState(false);

  const itemKey = item ? `${index}:${item.id}` : "";

  useEffect(() => {
    if (corpusMaxLevel === undefined) {
      setCorpusOptions([]);
      setCorpusLoading(false);
      return;
    }

    const it = pack.items[index];
    if (!it) {
      setCorpusOptions([]);
      setCorpusLoading(false);
      return;
    }

    const ac = new AbortController();
    setCorpusLoading(true);
    setCorpusOptions([]);

    fetch("/api/mcq-choices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: it, corpusMaxLevel }),
      signal: ac.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<{ choices?: unknown }>;
      })
      .then((data) => {
        const ch = data.choices;
        if (
          !Array.isArray(ch) ||
          ch.length !== 4 ||
          !ch.every((x) => typeof x === "string")
        ) {
          setCorpusOptions(
            it.choicesAreHebrew
              ? buildInlineMcqHebrewChoices(it)
              : buildInlineMcqChoices(it),
          );
          return;
        }
        setCorpusOptions(ch);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (e instanceof Error && e.name === "AbortError") return;
        setCorpusOptions(
          it.choicesAreHebrew
            ? buildInlineMcqHebrewChoices(it)
            : buildInlineMcqChoices(it),
        );
      })
      .finally(() => {
        if (ac.signal.aborted) return;
        setCorpusLoading(false);
      });

    return () => ac.abort();
  }, [itemKey, corpusMaxLevel, index, pack]);

  const options =
    corpusMaxLevel === undefined ? (inlineOptions ?? []) : corpusOptions;

  const choicesBusy =
    corpusMaxLevel !== undefined && (corpusLoading || options.length < 4);

  const rabbiFocus = useMemo(
    () => (item ? mcqItemForRabbi(item) : null),
    [item],
  );

  useEffect(() => {
    if (!rabbiFocus?.targetHe?.trim()) {
      setRabbiAskContext(null);
      return;
    }
    setRabbiAskContext({
      targetHe: rabbiFocus.targetHe.trim(),
      learnerLevel: rabbiLevel ?? "beginner",
      meaningEn: rabbiFocus.meaningEn,
    });
    return () => setRabbiAskContext(null);
  }, [rabbiLevel, rabbiFocus, item?.id, setRabbiAskContext]);

  const learnContent = useMemo(
    () =>
      item
        ? generateContent({
            promptHe: item.choicesAreHebrew
              ? (item.correctHe ?? item.promptHe)
              : item.promptHe,
            correctEn: item.choicesAreHebrew
              ? (item.promptEn ?? item.correctEn)
              : item.correctEn,
            translit: item.translit,
            shoresh: item.shoresh,
            culturalNote: item.vibeNote,
          })
        : null,
    [item],
  );

  const done = index >= pack.items.length;
  const lastRight =
    picked != null &&
    item != null &&
    picked === itemCorrectSurface(item);

  useEffect(() => {
    if (!done || pack.items.length === 0 || !onPackComplete) return;
    if (packCompleteReportedRef.current) return;
    packCompleteReportedRef.current = true;
    onPackComplete({ correct: correctCount, total: pack.items.length });
  }, [done, correctCount, pack.items.length, onPackComplete]);

  const onPick = useCallback(
    (choice: string) => {
      if (picked != null || !item || choicesBusy) return;
      setPicked(choice);
      const ok = choice === itemCorrectSurface(item);
      onPracticeAnswer?.(ok, {
        promptHe: item.choicesAreHebrew
          ? (item.correctHe ?? item.promptHe)
          : item.promptHe,
        skills: skillTags,
        studyGameId,
      });
      if (ok) {
        setCorrectCount((c) => c + 1);
        const tts = hebrewTtsText(item, showNikkud);
        if (tts?.trim()) {
          speak(tts.trim(), `mcq-correct-${item.id}-${index}`);
        }
      }
    },
    [
      item,
      picked,
      onPracticeAnswer,
      choicesBusy,
      skillTags,
      studyGameId,
      showNikkud,
      speak,
      index,
    ],
  );

  const next = useCallback(() => {
    setPicked(null);
    setIndex((i) => i + 1);
  }, []);

  if (done) {
    const doneWrap =
      courseSurface === "embed"
        ? "rounded-2xl border border-sage/25 bg-gradient-to-br from-sage/12 to-parchment-deep/20 p-4 sm:p-5"
        : "rounded-3xl border-2 border-sage/30 bg-gradient-to-br from-sage/15 via-parchment-card/90 to-sage/5 p-5 shadow-[0_10px_40px_rgba(74,104,48,0.12)]";
    return (
      <div className={`${doneWrap} ${className}`.trim()}>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
          {LEARN_VOICE.mcqCompleteTitle}
        </p>
        <p className="mt-2 text-sm text-ink">
          You got{" "}
          <strong>
            {correctCount}/{pack.items.length}
          </strong>{" "}
          right — nice focus.
        </p>
        {endHint !== undefined ? (
          <p className="mt-2 text-sm text-ink-muted">{endHint}</p>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">
            {LEARN_VOICE.mcqCompleteBody}
          </p>
        )}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => {
              packCompleteReportedRef.current = false;
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
      : `rounded-3xl border-2 border-ink/10 bg-gradient-to-br from-parchment-card/95 via-parchment-card/90 to-parchment-deep/40 p-5 shadow-[0_8px_32px_rgba(44,36,22,0.07)] ${className}`.trim();

  return (
    <div className={outerActive}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage/90">
            {LEARN_VOICE.mcqQuestionEyebrow}
          </p>
          <p className="mt-1 text-base font-medium text-ink">{pack.title}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <ExerciseAskRabbiButton compact />
          {hasHebrew(item.promptHe) ||
          (item.choicesAreHebrew && hasHebrew(item.correctHe ?? "")) ? (
            <NikkudExerciseToggle
              showNikkud={showNikkud}
              onToggle={() => setShowNikkud((v) => !v)}
            />
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 text-[10px] text-ink-faint">
        <span>
          You&apos;re on {index + 1} of {pack.items.length}
        </span>
        <span>
          Your score {correctCount}/{pack.items.length}
        </span>
      </div>

      {packHasHebrew && voices.length > 0 && selectedVoice ? (
        <div className="mt-3 -mx-1 overflow-hidden rounded-xl border border-ink/10">
          <HebrewAudioControls
            rate={rate}
            setRate={setRate}
            voices={voices}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />
        </div>
      ) : packHasHebrew ? (
        <p className="mt-3 font-label text-[9px] text-amber-800/90">
          Add a Hebrew voice in system settings to hear prompts and correct answers.
        </p>
      ) : null}

      {item.choicesAreHebrew && item.promptEn?.trim() ? (
        <p className="mt-4 text-lg font-medium leading-relaxed text-ink">
          {promptDisplay}
        </p>
      ) : hasHebrew(item.promptHe) ? (
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <Hebrew
            as="p"
            className="min-w-0 flex-1 text-right text-xl font-medium leading-relaxed text-ink"
          >
            {promptDisplay}
          </Hebrew>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {hebrewTtsText(item, showNikkud) ? (
              <button
                type="button"
                onClick={() => {
                  const t = hebrewTtsText(item, showNikkud);
                  if (t?.trim()) speak(t.trim(), `mcq-prompt-${item.id}-${index}`);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-ink-muted transition hover:border-sage/35 hover:bg-sage/5 hover:text-sage"
                aria-label="Play Hebrew audio for this prompt"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 5v10l8-5-8-5z" />
                </svg>
              </button>
            ) : null}
            <SaveWordButton
              variant="compact"
              he={item.promptHe}
              en={hasHebrew(item.correctEn) ? undefined : item.correctEn}
              className="shrink-0"
            />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-lg font-medium leading-relaxed text-ink">
          {promptDisplay}
        </p>
      )}

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

      <div className="relative mt-4 min-h-[120px]">
        {choicesBusy ? (
          <div
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
            aria-busy="true"
            aria-label="Loading answer choices"
          >
            {[0, 1, 2, 3].map((k) => (
              <div
                key={k}
                className="h-14 animate-pulse rounded-xl bg-parchment-deep/50"
              />
            ))}
            <p className="col-span-full text-center text-[11px] text-ink-faint">
              {LEARN_VOICE.mcqLoadingChoices}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {options.map((opt) => {
              const showResult = picked != null;
              const isCorrect = opt === itemCorrectSurface(item);
              const isPicked = opt === picked;
              const rtl = hasHebrew(opt);
              let ring =
                "ring-2 ring-ink/10 hover:-translate-y-0.5 hover:bg-parchment-deep/60 hover:shadow-md hover:ring-sage/25";
              if (showResult) {
                if (isCorrect) ring = "bg-sage/20 ring-2 ring-sage shadow-sm";
                else if (isPicked)
                  ring = "bg-rust/10 ring-2 ring-rust/35 opacity-90 shadow-sm";
                else ring = "opacity-45 ring-1 ring-ink/8";
              }
              return (
                <button
                  key={opt}
                  type="button"
                  dir={rtl ? "rtl" : "ltr"}
                  disabled={picked != null}
                  onClick={() => onPick(opt)}
                  className={`rounded-2xl px-4 py-3.5 text-sm text-ink transition-all duration-200 ${rtl ? "text-right font-hebrew" : "text-left"} ${ring}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {picked != null ? (
        <div className="mt-4 rounded-2xl border-2 border-ink/10 bg-parchment/90 p-4 text-sm shadow-inner">
          {lastRight ? (
            <p className="text-sage">{LEARN_VOICE.mcqCorrect}</p>
          ) : (
            <p className="text-ink-muted">
              {LEARN_VOICE.mcqReveal}:{" "}
              <strong
                className={`text-ink ${hasHebrew(itemCorrectSurface(item)) ? "font-hebrew" : ""}`}
                dir={hasHebrew(itemCorrectSurface(item)) ? "rtl" : undefined}
              >
                {itemCorrectSurface(item)}
              </strong>
              .
            </p>
          )}
          <button
            type="button"
            onClick={next}
            className="mt-4 rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
          >
            {index + 1 >= pack.items.length
              ? LEARN_VOICE.mcqFinish
              : LEARN_VOICE.mcqNext}
          </button>
        </div>
      ) : null}
    </div>
  );
}
