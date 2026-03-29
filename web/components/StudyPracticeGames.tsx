"use client";

import { useCallback, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { McqDrill } from "@/components/McqDrill";
import { useAppShell } from "@/components/AppShell";
import {
  buildFillRound,
  buildStudyPracticePool,
  pickMcqItemsFromPool,
} from "@/lib/study-practice-pool";
import { speakHebrew } from "@/lib/speech-hebrew";

const GAME_STYLES = [
  { color: "#4a6830" },
  { color: "#c87020" },
  { color: "#8B3A1A" },
  { color: "#6a1828" },
  { color: "#5a7040" },
  { color: "#b04820" },
  { color: "#7a5030" },
] as const;

type Mode =
  | { id: "mc"; emoji: string; label: string; ready: true }
  | { id: "fill"; emoji: string; label: string; ready: true }
  | { id: "tap" | "match" | "trans" | "img" | "gram"; emoji: string; label: string; ready: false };

const MODES: readonly Mode[] = [
  { id: "mc", emoji: "◈", label: "Multiple choice", ready: true },
  { id: "fill", emoji: "___", label: "Fill in blank", ready: true },
  { id: "tap", emoji: "◉", label: "Tap the word", ready: false },
  { id: "match", emoji: "⇄", label: "Match pairs", ready: false },
  { id: "trans", emoji: "→", label: "Translate", ready: false },
  { id: "img", emoji: "🖼", label: "Word & image", ready: false },
  { id: "gram", emoji: "📐", label: "Grammar drill", ready: false },
];

function StudyMcqModalBody({
  level,
  pool,
  onClose,
  onPracticeAnswer,
}: {
  level: number;
  pool: ReturnType<typeof buildStudyPracticePool>;
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: { promptHe?: string },
  ) => void;
}) {
  const pack = useMemo(
    () => ({
      kind: "mcq" as const,
      title: "Study — multiple choice",
      intro: "Random lemmas from your active level pool (corpus + course list).",
      items: pickMcqItemsFromPool(pool, 8, level),
    }),
    [pool, level],
  );

  if (pack.items.length === 0) {
    return (
      <div className="text-sm text-ink-muted">
        <p>Not enough words in the practice pool for this level.</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase text-ink"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-ink-muted hover:bg-parchment-deep/40"
        >
          Close
        </button>
      </div>
      <McqDrill
        pack={pack}
        corpusMaxLevel={level}
        onPracticeAnswer={onPracticeAnswer}
        endHint="Close when you are done — launch another mode from Study anytime."
      />
    </div>
  );
}

function StudyFillModalBody({
  level,
  pool,
  onClose,
  onPracticeAnswer,
}: {
  level: number;
  pool: ReturnType<typeof buildStudyPracticePool>;
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: { promptHe?: string },
  ) => void;
}) {
  const [round, setRound] = useState(() => buildFillRound(pool));
  const [picked, setPicked] = useState<number | null>(null);

  const nextRound = useCallback(() => {
    setRound(buildFillRound(pool));
    setPicked(null);
  }, [pool]);

  if (!round) {
    return (
      <div className="text-sm text-ink-muted">
        <p>Need at least four lemmas in the pool for fill-in drills.</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase text-ink"
        >
          Close
        </button>
      </div>
    );
  }

  const { target, optionsHe, correctIndex } = round;
  const sentence = `אֲנִי ${target.h} כָּל יוֹם.`;
  const show = picked != null;
  const ok = picked === correctIndex;

  const onPick = (idx: number) => {
    if (picked != null) return;
    setPicked(idx);
    const correct = idx === correctIndex;
    onPracticeAnswer?.(correct, { promptHe: target.h });
    if (correct) speakHebrew(target.h);
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-ink-muted hover:bg-parchment-deep/40"
        >
          Close
        </button>
      </div>
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Study — fill in the blank
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Legacy pattern: daily habit sentence (level {level} pool).
      </p>
      <div className="mt-4 text-center">
        <Hebrew className="block text-xl leading-relaxed text-ink sm:text-2xl">
          אֲנִי{" "}
          <span className="border-b-4 border-amber px-2 text-amber">
            {show ? target.h : "…"}
          </span>{" "}
          כָּל יוֹם.
        </Hebrew>
        <button
          type="button"
          onClick={() => speakHebrew(sentence)}
          className="mt-3 rounded-lg border border-rust/30 px-3 py-1.5 font-label text-[9px] uppercase text-ink-muted"
        >
          Listen to sentence
        </button>
        <p className="mt-2 text-[11px] italic text-ink-muted">
          Hint: {target.e}
        </p>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {optionsHe.map((h, idx) => {
          const isCor = idx === correctIndex;
          const isSel = idx === picked;
          let ring =
            "border border-ink/12 hover:bg-parchment-deep/50";
          if (show) {
            if (isCor) ring = "border-2 border-sage bg-sage/15";
            else if (isSel) ring = "border-2 border-rust bg-rust/10";
            else ring = "opacity-45 border border-ink/8";
          }
          return (
            <button
              key={`${h}-${idx}`}
              type="button"
              disabled={show}
              onClick={() => onPick(idx)}
              className={`rounded-xl px-3 py-3 text-left transition ${ring}`}
            >
              <Hebrew className="text-lg text-ink">{h}</Hebrew>
            </button>
          );
        })}
      </div>
      {show ? (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-3 text-sm">
          {ok ? (
            <p className="text-sage">Correct.</p>
          ) : (
            <p className="text-ink-muted">
              The line uses{" "}
              <Hebrew className="inline text-lg text-ink">{target.h}</Hebrew>.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={nextRound}
              className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Next
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase text-ink-muted"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function StudyPracticeGames({
  activeLevel,
  onPracticeAnswer,
}: {
  activeLevel: number;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: { promptHe?: string },
  ) => void;
}) {
  const { openModal, closeModal } = useAppShell();

  const pool = useMemo(
    () => buildStudyPracticePool(activeLevel),
    [activeLevel],
  );

  const openMcq = useCallback(() => {
    openModal(
      <StudyMcqModalBody
        key={`mcq-${Date.now()}`}
        level={activeLevel}
        pool={pool}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [openModal, closeModal, activeLevel, pool, onPracticeAnswer]);

  const openFill = useCallback(() => {
    openModal(
      <StudyFillModalBody
        key={`fill-${Date.now()}`}
        level={activeLevel}
        pool={pool}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [openModal, closeModal, activeLevel, pool, onPracticeAnswer]);

  const poolOk = pool.length > 0;
  const fillOk = pool.length >= 4;

  return (
    <div
      id="study-practice-games"
      className="rounded-2xl border border-ink/10 bg-parchment-card/45 p-4"
    >
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Practice games
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Legacy Study grid: multiple choice and fill-in are live (corpus pool
        capped to your active level). Other modes match the HTML app but are
        not wired in Next yet.
      </p>
      {!poolOk ? (
        <p className="mt-3 text-sm text-amber">
          No practice pool for this level yet — try another level on Learn.
        </p>
      ) : (
        <p className="mt-2 text-[11px] text-ink-faint">
          Pool: {pool.length} lemmas
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {MODES.map((m, i) => {
          const col = GAME_STYLES[i % GAME_STYLES.length]!.color;
          const enabled =
            m.ready &&
            poolOk &&
            (m.id !== "fill" || fillOk);
          return (
            <div
              key={m.id}
              className="flex flex-col items-center gap-2 text-center"
            >
              <button
                type="button"
                disabled={!enabled}
                onClick={() => {
                  if (m.id === "mc") openMcq();
                  else if (m.id === "fill") openFill();
                }}
                className="flex h-14 w-14 items-center justify-center rounded-full text-lg text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:brightness-110"
                style={{
                  background: `linear-gradient(145deg, ${col}, ${col}dd)`,
                }}
                aria-label={m.label}
              >
                {m.emoji}
              </button>
              <span className="font-label text-[8px] uppercase leading-tight tracking-wide text-ink-muted">
                {m.label}
              </span>
              {!m.ready ? (
                <span className="text-[9px] text-ink-faint">Soon</span>
              ) : null}
            </div>
          );
        })}
      </div>
      <a
        href="#study-review-queue"
        className="mt-4 inline-block font-label text-[9px] uppercase tracking-wide text-sage underline"
      >
        Jump to review queue →
      </a>
    </div>
  );
}
