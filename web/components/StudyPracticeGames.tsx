"use client";

import { useCallback, useMemo, useState } from "react";
import { CorrectSentenceDrill } from "@/components/CorrectSentenceDrill";
import { Hebrew } from "@/components/Hebrew";
import { McqDrill } from "@/components/McqDrill";
import { useAppShell } from "@/components/AppShell";
import { GRAMMAR_DRILLS } from "@/data/grammar-drills";
import { WORD_EMOJI_DRILLS } from "@/data/word-emoji-drills";
import {
  buildFillRound,
  buildStudyMatchRound,
  buildStudyPracticePool,
  buildStudyTransRound,
  buildTapRound,
  pickMcqItemsFromPool,
  shuffleArray,
} from "@/lib/study-practice-pool";
import type { GradedPracticeContext } from "@/lib/learn-progress";
import { buildCorrectSentencePackFromPool } from "@/lib/sentence-correctness";
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

type Mode = {
  id: "mc" | "fill" | "tap" | "sent" | "match" | "trans" | "img" | "gram";
  emoji: string;
  label: string;
};

const MODES: readonly Mode[] = [
  { id: "mc", emoji: "◈", label: "Multiple choice" },
  { id: "fill", emoji: "___", label: "Fill in blank" },
  { id: "tap", emoji: "◉", label: "Tap the word" },
  { id: "sent", emoji: "✓", label: "Correct sentence" },
  { id: "match", emoji: "⇄", label: "Match pairs" },
  { id: "trans", emoji: "→", label: "Translate" },
  { id: "img", emoji: "🖼", label: "Word & emoji" },
  { id: "gram", emoji: "📐", label: "Grammar drill" },
];

function StudyMcqModalBody({
  level,
  pool,
  preferredLemmas,
  onClose,
  onPracticeAnswer,
}: {
  level: number;
  pool: ReturnType<typeof buildStudyPracticePool>;
  preferredLemmas?: readonly string[];
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: GradedPracticeContext,
  ) => void;
}) {
  const pickOpts = useMemo(
    () =>
      preferredLemmas?.length
        ? { preferredHebrew: preferredLemmas }
        : undefined,
    [preferredLemmas],
  );
  const pack = useMemo(
    () => ({
      kind: "mcq" as const,
      title: "Study — multiple choice",
      intro: preferredLemmas?.length
        ? "Weighted toward lemmas due for review; rest from your level pool."
        : "Random lemmas from your active level pool (corpus + course list).",
      items: pickMcqItemsFromPool(pool, 8, level, pickOpts),
    }),
    [pool, level, pickOpts, preferredLemmas?.length],
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
        skillTags={["recognition", "definition"]}
        onPracticeAnswer={onPracticeAnswer}
        endHint="Close when you are done — launch another mode from Study anytime."
      />
    </div>
  );
}

function StudyFillModalBody({
  level,
  pool,
  preferredLemmas,
  onClose,
  onPracticeAnswer,
}: {
  level: number;
  pool: ReturnType<typeof buildStudyPracticePool>;
  preferredLemmas?: readonly string[];
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: GradedPracticeContext,
  ) => void;
}) {
  const pickOpts = useMemo(
    () =>
      preferredLemmas?.length
        ? { preferredHebrew: preferredLemmas }
        : undefined,
    [preferredLemmas],
  );
  const [round, setRound] = useState(() => buildFillRound(pool, pickOpts));
  const [picked, setPicked] = useState<number | null>(null);

  const nextRound = useCallback(() => {
    setRound(buildFillRound(pool, pickOpts));
    setPicked(null);
  }, [pool, pickOpts]);

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
    onPracticeAnswer?.(correct, {
      promptHe: target.h,
      skills: ["production", "definition", "grammar"],
      studyGameId: "fill",
    });
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

function StudyTapModalBody({
  level,
  pool,
  preferredLemmas,
  onClose,
  onPracticeAnswer,
}: {
  level: number;
  pool: ReturnType<typeof buildStudyPracticePool>;
  preferredLemmas?: readonly string[];
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: GradedPracticeContext,
  ) => void;
}) {
  const pickOpts = useMemo(
    () =>
      preferredLemmas?.length
        ? { preferredHebrew: preferredLemmas }
        : undefined,
    [preferredLemmas],
  );
  const [round, setRound] = useState(() => buildTapRound(pool, pickOpts));
  const [picked, setPicked] = useState<number | null>(null);

  const nextRound = useCallback(() => {
    setRound(buildTapRound(pool, pickOpts));
    setPicked(null);
  }, [pool, pickOpts]);

  if (!round) {
    return (
      <div className="text-sm text-ink-muted">
        <p>Need at least six lemmas in the pool for tap drills.</p>
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
  const show = picked != null;
  const ok = picked === correctIndex;

  const onPick = (idx: number) => {
    if (picked != null) return;
    setPicked(idx);
    const correct = idx === correctIndex;
    onPracticeAnswer?.(correct, {
      promptHe: target.h,
      skills: ["production", "recognition", "definition"],
      studyGameId: "tap",
    });
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
        Study - tap the word
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Pick the Hebrew that matches this gloss (level {level} pool).
      </p>
      <div className="mt-4 rounded-xl border border-amber/25 bg-amber/5 p-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          English cue
        </p>
        <p className="mt-1 text-lg font-semibold text-ink">{target.e}</p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
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
              Correct answer:{" "}
              <Hebrew className="inline text-lg text-ink">{target.h}</Hebrew>
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

function StudyGrammarModalBody({
  onClose,
  onPracticeAnswer,
}: {
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: GradedPracticeContext,
  ) => void;
}) {
  const [gramIdx, setGramIdx] = useState(() =>
    Math.floor(Math.random() * GRAMMAR_DRILLS.length),
  );
  const [itemIdx, setItemIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [topicScore, setTopicScore] = useState(0);

  const topic = GRAMMAR_DRILLS[gramIdx]!;
  const item = topic.items[itemIdx];
  const finishedTopic = !item;

  const startNewTopic = () => {
    setGramIdx(Math.floor(Math.random() * GRAMMAR_DRILLS.length));
    setItemIdx(0);
    setPicked(null);
    setTopicScore(0);
  };

  const onPick = (i: number) => {
    if (picked != null || !item) return;
    setPicked(i);
    const ok = i === item.ans;
    if (ok) setTopicScore((s) => s + 1);
    const refHe = item.opts[item.ans]?.trim();
    onPracticeAnswer?.(ok, {
      promptHe: refHe && /[\u0590-\u05FF]/.test(refHe) ? refHe : undefined,
      skills: ["grammar"],
      studyGameId: "gram",
    });
  };

  const nextItem = () => {
    setPicked(null);
    setItemIdx((j) => j + 1);
  };

  if (finishedTopic) {
    return (
      <div className="text-center">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-ink-muted hover:bg-parchment-deep/40"
          >
            Close
          </button>
        </div>
        <p className="text-4xl" aria-hidden>
          📐
        </p>
        <p className="mt-2 font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Topic complete
        </p>
        <p className="mt-2 text-2xl font-semibold tabular-nums text-sage">
          {topicScore}/{topic.items.length}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={startNewTopic}
            className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            Next topic
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
    );
  }

  const show = picked != null;

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
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
        Grammar — {topic.topic}
      </p>
      <p className="mt-1 text-xs text-ink-muted">{topic.prompt}</p>
      <Hebrew className="mt-4 block text-center text-2xl leading-relaxed text-ink">
        {item.h}
      </Hebrew>
      <p className="mt-2 text-center text-sm italic text-ink-muted">{item.cue}</p>
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {item.opts.map((o, i) => {
          const isCor = i === item.ans;
          const isSel = i === picked;
          let ring =
            "border border-ink/12 hover:bg-parchment-deep/50";
          if (show) {
            if (isCor) ring = "border-2 border-sage bg-sage/15";
            else if (isSel) ring = "border-2 border-rust bg-rust/10";
            else ring = "opacity-45 border border-ink/8";
          }
          return (
            <button
              key={`${o}-${i}`}
              type="button"
              disabled={show}
              onClick={() => onPick(i)}
              className={`rounded-xl px-3 py-3 text-left transition ${ring}`}
            >
              <Hebrew className="text-lg text-ink">{o}</Hebrew>
            </button>
          );
        })}
      </div>
      {show ? (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-3 text-sm text-ink-muted">
          <p>{item.note}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={nextItem}
              className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              {itemIdx + 1 >= topic.items.length ? "Finish topic" : "Next"}
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

function StudyMatchModalBody({
  pool,
  preferredLemmas,
  onClose,
  onPracticeAnswer,
}: {
  pool: ReturnType<typeof buildStudyPracticePool>;
  preferredLemmas?: readonly string[];
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: GradedPracticeContext,
  ) => void;
}) {
  const pickOpts = useMemo(
    () =>
      preferredLemmas?.length
        ? { preferredHebrew: preferredLemmas }
        : undefined,
    [preferredLemmas],
  );
  const [round, setRound] = useState(() => buildStudyMatchRound(pool, pickOpts));
  const [matched, setMatched] = useState<Array<{ h: number; e: number }>>([]);
  const [selH, setSelH] = useState<number | null>(null);
  const [flashBad, setFlashBad] = useState<{ h: number; e: number } | null>(
    null,
  );

  const resetRound = useCallback(() => {
    setRound(buildStudyMatchRound(pool, pickOpts));
    setMatched([]);
    setSelH(null);
    setFlashBad(null);
  }, [pool, pickOpts]);

  if (!round) {
    return (
      <div className="text-sm text-ink-muted">
        <p>Need at least four lemmas in the pool for match drills.</p>
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

  const { words, enShuffled } = round;
  const allDone = matched.length >= 4;

  const onPickE = (eIdx: number) => {
    if (allDone || selH === null) return;
    if (matched.some((m) => m.e === eIdx)) return;
    const hi = selH;
    const ok = words[hi]!.h === enShuffled[eIdx]!.h;
    if (ok) {
      setMatched((m) => [...m, { h: hi, e: eIdx }]);
      setSelH(null);
      onPracticeAnswer?.(true, {
        promptHe: words[hi]!.h,
        skills: ["recognition", "definition"],
        studyGameId: "match",
      });
      speakHebrew(words[hi]!.h);
    } else {
      setFlashBad({ h: hi, e: eIdx });
      onPracticeAnswer?.(false, {
        promptHe: words[hi]!.h,
        skills: ["recognition", "definition"],
        studyGameId: "match",
      });
      window.setTimeout(() => {
        setFlashBad(null);
        setSelH(null);
      }, 700);
    }
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
        Match pairs
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Tap a Hebrew word, then its English gloss.
      </p>
      {allDone ? (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-4 text-center text-sm">
          <p className="text-sage">All matched.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={resetRound}
              className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Next round
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
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            {words.map((w, i) => {
              const done = matched.some((m) => m.h === i);
              const sel = selH === i && !done;
              const bad = flashBad?.h === i;
              return (
                <button
                  key={w.h}
                  type="button"
                  disabled={done}
                  onClick={() => !done && setSelH(i)}
                  className={`block w-full rounded-xl border px-3 py-2 text-left transition ${
                    done
                      ? "border-sage bg-sage/15"
                      : sel
                        ? "border-amber ring-2 ring-amber/40"
                        : bad
                          ? "border-rust bg-rust/10"
                          : "border-ink/12 hover:bg-parchment-deep/50"
                  }`}
                >
                  <Hebrew className="text-lg text-ink">{w.h}</Hebrew>
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            {enShuffled.map((w, i) => {
              const done = matched.some((m) => m.e === i);
              const bad = flashBad?.e === i;
              return (
                <button
                  key={`${w.h}-en-${i}`}
                  type="button"
                  disabled={done}
                  onClick={() => onPickE(i)}
                  className={`block w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    done
                      ? "border-sage bg-sage/15 text-ink"
                      : bad
                        ? "border-rust bg-rust/10"
                        : "border-ink/12 hover:bg-parchment-deep/50"
                  }`}
                >
                  {w.e}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StudyTransModalBody({
  pool,
  preferredLemmas,
  onClose,
  onPracticeAnswer,
}: {
  pool: ReturnType<typeof buildStudyPracticePool>;
  preferredLemmas?: readonly string[];
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: GradedPracticeContext,
  ) => void;
}) {
  const pickOpts = useMemo(
    () =>
      preferredLemmas?.length
        ? { preferredHebrew: preferredLemmas }
        : undefined,
    [preferredLemmas],
  );
  const [round, setRound] = useState(() => buildStudyTransRound(pool, pickOpts));
  const [chosen, setChosen] = useState<string[]>([]);
  const [checked, setChecked] = useState<"idle" | "ok" | "bad">("idle");

  const resetRound = useCallback(() => {
    setRound(buildStudyTransRound(pool, pickOpts));
    setChosen([]);
    setChecked("idle");
  }, [pool, pickOpts]);

  if (!round) {
    return (
      <div className="text-sm text-ink-muted">
        <p>Need at least six lemmas in the pool for translate drills.</p>
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

  const { target, bankHe } = round;
  const addToken = (h: string) => {
    if (checked !== "idle") return;
    if (chosen.includes(h)) return;
    setChosen((c) => [...c, h]);
  };
  const removeToken = (h: string) => {
    if (checked !== "idle") return;
    setChosen((c) => c.filter((x) => x !== h));
  };

  const doCheck = () => {
    if (checked !== "idle") return;
    const ok = chosen.join(" ").trim() === target.h.trim();
    setChecked(ok ? "ok" : "bad");
    onPracticeAnswer?.(ok, {
      promptHe: target.h,
      skills: ["production", "definition", "recognition"],
      studyGameId: "trans",
    });
    if (ok) speakHebrew(target.h);
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
        Translate
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Build the Hebrew that matches the English (tap words, then Check).
      </p>
      <div className="mt-4 rounded-xl border border-ink/12 bg-parchment-deep/20 p-4 text-center">
        <p className="text-lg font-medium italic text-ink">&quot;{target.e}&quot;</p>
        <p className="mt-1 text-xs text-ink-muted">{target.p}</p>
      </div>
      <div
        className="mt-4 min-h-[52px] rounded-xl border-2 border-dashed border-ink/15 bg-parchment/80 p-3"
        dir="rtl"
      >
        {chosen.length === 0 ? (
          <span className="font-label text-[10px] uppercase text-ink-faint">
            Your answer
          </span>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            {chosen.map((h, idx) => (
              <button
                key={`ans-${idx}-${h}`}
                type="button"
                onClick={() => removeToken(h)}
                disabled={checked !== "idle"}
                className="rounded-lg border border-sage/40 bg-sage/10 px-2 py-1"
              >
                <Hebrew className="text-lg text-ink">{h}</Hebrew>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {bankHe.map((h) => (
          <button
            key={h}
            type="button"
            disabled={checked !== "idle" || chosen.includes(h)}
            onClick={() => addToken(h)}
            className="rounded-lg border border-ink/12 px-3 py-2 disabled:opacity-35"
          >
            <Hebrew className="text-xl text-ink">{h}</Hebrew>
          </button>
        ))}
      </div>
      {checked === "idle" ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            disabled={chosen.length === 0}
            onClick={doCheck}
            className="rounded-lg bg-rust px-5 py-2 font-label text-[10px] uppercase tracking-wide text-white disabled:opacity-40 hover:brightness-110"
          >
            Check
          </button>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-3 text-sm">
          {checked === "ok" ? (
            <p className="text-sage">Correct.</p>
          ) : (
            <p className="text-ink-muted">
              Expected:{" "}
              <Hebrew className="inline text-lg text-ink">{target.h}</Hebrew>
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetRound}
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
      )}
    </div>
  );
}

function StudyImgModalBody({
  onClose,
  onPracticeAnswer,
}: {
  onClose: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: GradedPracticeContext,
  ) => void;
}) {
  const [round] = useState(() => {
    const items = shuffleArray([...WORD_EMOJI_DRILLS]).slice(0, 4);
    return { items, emShuffled: shuffleArray([...items]) };
  });
  const [matched, setMatched] = useState<Array<{ w: number; e: number }>>([]);
  const [selW, setSelW] = useState<number | null>(null);
  const [flashBad, setFlashBad] = useState<{ w: number; e: number } | null>(
    null,
  );

  const { items, emShuffled } = round;
  const allDone = matched.length >= 4;

  const onPickE = (eIdx: number) => {
    if (allDone || selW === null) return;
    if (matched.some((m) => m.e === eIdx)) return;
    const wi = selW;
    const ok = items[wi]!.h === emShuffled[eIdx]!.h;
    if (ok) {
      setMatched((m) => [...m, { w: wi, e: eIdx }]);
      setSelW(null);
      onPracticeAnswer?.(true, {
        promptHe: items[wi]!.h,
        skills: ["recognition", "definition"],
        studyGameId: "img",
      });
      speakHebrew(items[wi]!.h);
    } else {
      setFlashBad({ w: wi, e: eIdx });
      onPracticeAnswer?.(false, {
        promptHe: items[wi]!.h,
        skills: ["recognition", "definition"],
        studyGameId: "img",
      });
      window.setTimeout(() => {
        setFlashBad(null);
        setSelW(null);
      }, 700);
    }
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
        Word &amp; emoji
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Tap a Hebrew word, then its emoji (Unicode symbols only).
      </p>
      {allDone ? (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment/80 p-4 text-center text-sm">
          <p className="text-sage">All matched.</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            {items.map((it, i) => {
              const done = matched.some((m) => m.w === i);
              const sel = selW === i && !done;
              const bad = flashBad?.w === i;
              return (
                <button
                  key={it.h}
                  type="button"
                  disabled={done}
                  onClick={() => !done && setSelW(i)}
                  className={`block w-full rounded-xl border px-3 py-2 text-left transition ${
                    done
                      ? "border-sage bg-sage/15"
                      : sel
                        ? "border-amber ring-2 ring-amber/40"
                        : bad
                          ? "border-rust bg-rust/10"
                          : "border-ink/12 hover:bg-parchment-deep/50"
                  }`}
                >
                  <Hebrew className="text-xl text-ink">{it.h}</Hebrew>
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            {emShuffled.map((it, i) => {
              const done = matched.some((m) => m.e === i);
              const bad = flashBad?.e === i;
              return (
                <button
                  key={`${it.h}-em-${i}`}
                  type="button"
                  disabled={done}
                  onClick={() => onPickE(i)}
                  className={`block w-full rounded-xl border px-3 py-2 text-center text-3xl transition ${
                    done
                      ? "border-sage bg-sage/15"
                      : bad
                        ? "border-rust bg-rust/10"
                        : "border-ink/12 hover:bg-parchment-deep/50"
                  }`}
                >
                  {it.em}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function StudyPracticeGames({
  activeLevel,
  preferredLemmas,
  onClearPreferredLemmas,
  onPracticeAnswer,
}: {
  activeLevel: number;
  /** When set, MCQ / fill / tap / sentence rounds prefer these Hebrew prompts. */
  preferredLemmas?: readonly string[];
  onClearPreferredLemmas?: () => void;
  onPracticeAnswer?: (
    correct: boolean,
    ctx?: GradedPracticeContext,
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
        preferredLemmas={preferredLemmas}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [
    openModal,
    closeModal,
    activeLevel,
    pool,
    preferredLemmas,
    onPracticeAnswer,
  ]);

  const openFill = useCallback(() => {
    openModal(
      <StudyFillModalBody
        key={`fill-${Date.now()}`}
        level={activeLevel}
        pool={pool}
        preferredLemmas={preferredLemmas}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [
    openModal,
    closeModal,
    activeLevel,
    pool,
    preferredLemmas,
    onPracticeAnswer,
  ]);

  const openTap = useCallback(() => {
    openModal(
      <StudyTapModalBody
        key={`tap-${Date.now()}`}
        level={activeLevel}
        pool={pool}
        preferredLemmas={preferredLemmas}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [
    openModal,
    closeModal,
    activeLevel,
    pool,
    preferredLemmas,
    onPracticeAnswer,
  ]);

  const openSent = useCallback(() => {
    const pack = buildCorrectSentencePackFromPool(
      pool,
      activeLevel,
      6,
      preferredLemmas,
    );
    if (!pack) return;
    openModal(
      <div>
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-ink-muted hover:bg-parchment-deep/40"
          >
            Close
          </button>
        </div>
        <CorrectSentenceDrill
          pack={pack}
          onPracticeAnswer={onPracticeAnswer}
          endHint="Great for grammar + production judgment. Mix with MCQ and listening."
        />
      </div>,
    );
  }, [
    openModal,
    closeModal,
    pool,
    activeLevel,
    preferredLemmas,
    onPracticeAnswer,
  ]);

  const openMatch = useCallback(() => {
    openModal(
      <StudyMatchModalBody
        key={`match-${Date.now()}`}
        pool={pool}
        preferredLemmas={preferredLemmas}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [openModal, closeModal, pool, preferredLemmas, onPracticeAnswer]);

  const openTrans = useCallback(() => {
    openModal(
      <StudyTransModalBody
        key={`trans-${Date.now()}`}
        pool={pool}
        preferredLemmas={preferredLemmas}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [openModal, closeModal, pool, preferredLemmas, onPracticeAnswer]);

  const openImg = useCallback(() => {
    openModal(
      <StudyImgModalBody
        key={`img-${Date.now()}`}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [openModal, closeModal, onPracticeAnswer]);

  const openGram = useCallback(() => {
    openModal(
      <StudyGrammarModalBody
        key={`gram-${Date.now()}`}
        onClose={closeModal}
        onPracticeAnswer={onPracticeAnswer}
      />,
    );
  }, [openModal, closeModal, onPracticeAnswer]);

  const poolOk = pool.length > 0;
  const fillOk = pool.length >= 4;
  const tapOk = pool.length >= 6;
  const sentOk = pool.length >= 4;
  const matchOk = pool.length >= 4;
  const transOk = pool.length >= 6;

  return (
    <div
      id="study-practice-games"
      className="rounded-2xl border border-ink/10 bg-parchment-card/45 p-4"
    >
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Practice games
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Same eight modes as the legacy HTML Study hub: corpus-backed drills use
        your active level pool; grammar and word–emoji sets work even when the
        pool is empty.
      </p>
      {preferredLemmas?.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-sage/30 bg-sage/10 px-3 py-2 text-[12px] text-ink-muted">
          <span>
            Practice is weighted to{" "}
            <strong className="text-ink">{preferredLemmas.length}</strong> due
            lemmas (today&apos;s plan).
          </span>
          {onClearPreferredLemmas ? (
            <button
              type="button"
              onClick={onClearPreferredLemmas}
              className="rounded-md border border-ink/15 px-2 py-1 font-label text-[9px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/50"
            >
              Use full pool
            </button>
          ) : null}
        </div>
      ) : null}
      {!poolOk ? (
        <p className="mt-3 text-sm text-amber">
          No practice pool for this level yet — grammar and word–emoji are still
          available; open other modes after you unlock vocabulary on Learn.
        </p>
      ) : (
        <p className="mt-2 text-[11px] text-ink-faint">
          Pool: {pool.length} lemmas
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {MODES.map((m, i) => {
          const col = GAME_STYLES[i % GAME_STYLES.length]!.color;
          const needsPool =
            m.id === "mc" ||
            m.id === "fill" ||
            m.id === "tap" ||
            m.id === "sent" ||
            m.id === "match" ||
            m.id === "trans";
          const enabled =
            m.id === "gram" ||
            m.id === "img" ||
            (poolOk &&
              (m.id !== "fill" || fillOk) &&
              (m.id !== "tap" || tapOk) &&
              (m.id !== "sent" || sentOk) &&
              (m.id !== "match" || matchOk) &&
              (m.id !== "trans" || transOk));
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
                  else if (m.id === "tap") openTap();
                  else if (m.id === "sent") openSent();
                  else if (m.id === "match") openMatch();
                  else if (m.id === "trans") openTrans();
                  else if (m.id === "img") openImg();
                  else if (m.id === "gram") openGram();
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
              {!poolOk && needsPool ? (
                <span className="text-[9px] text-ink-faint">Needs pool</span>
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
