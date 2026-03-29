"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import type { McqDrillPack } from "@/data/section-drill-types";
import { stripNikkud } from "@/lib/hebrew-nikkud";
import { buildInlineMcqChoices } from "@/lib/mcq-inline-choices";

function hasHebrew(s: string): boolean {
  return /[\u0590-\u05FF]/.test(s);
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
    context?: { promptHe?: string },
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
};

export function McqDrill({
  pack,
  className = "",
  corpusMaxLevel,
  onPracticeAnswer,
  endHint,
  defaultShowNikkud = true,
  onPackComplete,
}: McqDrillProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showNikkud, setShowNikkud] = useState(defaultShowNikkud);
  const packCompleteReportedRef = useRef(false);

  useEffect(() => {
    setShowNikkud(defaultShowNikkud);
  }, [defaultShowNikkud]);

  useEffect(() => {
    packCompleteReportedRef.current = false;
  }, [pack.title]);

  const item = pack.items[index];

  const promptDisplay = useMemo(() => {
    if (!item) return "";
    return showNikkud ? item.promptHe : stripNikkud(item.promptHe);
  }, [item, showNikkud]);

  const inlineOptions = useMemo(() => {
    if (!item || corpusMaxLevel !== undefined) return null;
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
          setCorpusOptions(buildInlineMcqChoices(it));
          return;
        }
        setCorpusOptions(ch);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (e instanceof Error && e.name === "AbortError") return;
        setCorpusOptions(buildInlineMcqChoices(it));
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

  const done = index >= pack.items.length;
  const lastRight =
    picked != null && item != null && picked === item.correctEn;

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
      onPracticeAnswer?.(choice === item.correctEn, {
        promptHe: item.promptHe,
      });
      if (choice === item.correctEn) {
        setCorrectCount((c) => c + 1);
      }
    },
    [item, picked, onPracticeAnswer, choicesBusy],
  );

  const next = useCallback(() => {
    setPicked(null);
    setIndex((i) => i + 1);
  }, []);

  if (done) {
    return (
      <div
        className={`rounded-2xl border border-sage/25 bg-sage/5 p-4 ${className}`.trim()}
      >
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          Mini-quiz complete
        </p>
        <p className="mt-2 text-sm text-ink">
          You got{" "}
          <strong>
            {correctCount}/{pack.items.length}
          </strong>{" "}
          right.
        </p>
        {endHint !== undefined ? (
          <p className="mt-2 text-sm text-ink-muted">{endHint}</p>
        ) : (
          <p className="mt-2 text-sm text-ink">
            Use <strong>Mark section complete</strong> below when you are ready
            to continue the course path.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            packCompleteReportedRef.current = false;
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
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            {pack.title}
          </p>
          {pack.intro ? (
            <p className="mt-1 text-xs text-ink-muted">{pack.intro}</p>
          ) : null}
        </div>
        {hasHebrew(item.promptHe) ? (
          <NikkudExerciseToggle
            showNikkud={showNikkud}
            onToggle={() => setShowNikkud((v) => !v)}
          />
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 text-[10px] text-ink-faint">
        <span>
          Question {index + 1} of {pack.items.length}
        </span>
        <span>
          Score {correctCount}/{pack.items.length}
        </span>
      </div>

      {hasHebrew(item.promptHe) ? (
        <Hebrew
          as="p"
          className="mt-4 text-right text-xl font-medium leading-relaxed text-ink"
        >
          {promptDisplay}
        </Hebrew>
      ) : (
        <p className="mt-4 text-lg font-medium leading-relaxed text-ink">
          {promptDisplay}
        </p>
      )}

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
              Preparing choices…
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {options.map((opt) => {
              const showResult = picked != null;
              const isCorrect = opt === item.correctEn;
              const isPicked = opt === picked;
              const rtl = hasHebrew(opt);
              let ring =
                "ring-1 ring-ink/12 hover:bg-parchment-deep/50 hover:ring-ink/20";
              if (showResult) {
                if (isCorrect) ring = "bg-sage/15 ring-2 ring-sage";
                else if (isPicked)
                  ring = "bg-rust/10 ring-2 ring-rust/40 opacity-90";
                else ring = "opacity-50 ring-1 ring-ink/8";
              }
              return (
                <button
                  key={opt}
                  type="button"
                  dir={rtl ? "rtl" : "ltr"}
                  disabled={picked != null}
                  onClick={() => onPick(opt)}
                  className={`rounded-xl px-3 py-3 text-sm text-ink transition ${rtl ? "text-right font-hebrew" : "text-left"} ${ring}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {picked != null ? (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-3 text-sm">
          {lastRight ? (
            <p className="text-sage">Correct.</p>
          ) : (
            <p className="text-ink-muted">
              The answer is{" "}
              <strong
                className={`text-ink ${hasHebrew(item.correctEn) ? "font-hebrew" : ""}`}
                dir={hasHebrew(item.correctEn) ? "rtl" : undefined}
              >
                {item.correctEn}
              </strong>
              .
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
