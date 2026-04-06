"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CoverFlowCarousel } from "@/components/CoverFlowCarousel";
import { Hebrew } from "@/components/Hebrew";
import type { ReadingPassageTq, ReadingPassageWq } from "@/data/reading-passages-rd";
import {
  buildProgressMirroredReadingItems,
  type ReadingCarouselItem,
} from "@/lib/reading-carousel";
import type { SavedLibraryPassage } from "@/lib/library-saved";
import {
  LIBRARY_SAVED_EVENT,
  loadLibrarySaved,
} from "@/lib/library-saved";
import {
  loadLearnProgress,
  markReadingPassageQuizComplete,
  recordGradedAnswer,
  saveLearnProgress,
  touchDailyStreak,
  touchReadingCarouselPassage,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { LEARN_VOICE } from "@/lib/learn-user-voice";
import { speakHebrew } from "@/lib/speech-hebrew";

const PUNCT_RE = /[.,!?;:'"׃]/g;

/** @deprecated Use {@link ReadingCarouselItem} from `@/lib/reading-carousel`. */
export type CarouselReadingItem = ReadingCarouselItem;

function stripPunct(token: string): string {
  return token.replace(PUNCT_RE, "");
}

function passageTokens(he: string): string[] {
  return he.trim().split(/\s+/).filter(Boolean);
}

function hasExercises(item: ReadingCarouselItem): boolean {
  const n =
    (item.tq?.length ?? 0) + (item.wq?.length ?? 0);
  return n > 0;
}

function clipPassageDesc(e: string): string {
  const t = e.trim().replace(/\s+/g, " ");
  if (!t) {
    return "Tap to read Hebrew, hear each word, and use exercises when available.";
  }
  return t.length <= 140 ? t : `${t.slice(0, 137).trim()}…`;
}

type ModalPhase =
  | { kind: "passage"; item: ReadingCarouselItem }
  | {
      kind: "quiz";
      item: ReadingCarouselItem;
      phase: "tq" | "wq";
      qIdx: number;
      score: number;
    }
  | {
      kind: "done";
      item: ReadingCarouselItem;
      score: number;
      total: number;
    };

export function ReadingTapCarousel({
  progress,
  focusPassageKey,
}: {
  progress: LearnProgressState;
  /** Center carousel on this passage key (`jt-0`, `rd-…`, library id). */
  focusPassageKey?: string | null;
}) {
  const [saved, setSaved] = useState<SavedLibraryPassage[]>([]);
  const [modal, setModal] = useState<ModalPhase | null>(null);
  const [pickedWordIdx, setPickedWordIdx] = useState<number | null>(null);
  const [quizPicked, setQuizPicked] = useState<string | null>(null);
  const [quizLocked, setQuizLocked] = useState(false);

  const syncLib = useCallback(() => setSaved(loadLibrarySaved()), []);
  useEffect(() => {
    syncLib();
    window.addEventListener(LIBRARY_SAVED_EVENT, syncLib);
    return () => window.removeEventListener(LIBRARY_SAVED_EVENT, syncLib);
  }, [syncLib]);

  const items = useMemo(
    () => buildProgressMirroredReadingItems(progress, saved),
    [progress, saved],
  );

  const coverItems = useMemo(() => {
    const quizDone = progress.readingPassageQuizComplete ?? {};
    return items.map((it) => ({
      key: it.id,
      label: it.label,
      desc: clipPassageDesc(it.e),
      category: it.src,
      emoji: it.icon,
      badgeDot: hasExercises(it) && !quizDone[it.id],
    }));
  }, [items, progress.readingPassageQuizComplete]);

  const openItem = useCallback((item: ReadingCarouselItem) => {
    const cur = loadLearnProgress();
    const next = touchReadingCarouselPassage(cur, item.id);
    saveLearnProgress(next);
    setPickedWordIdx(null);
    setModal({ kind: "passage", item });
  }, []);

  const onActivateCoverCenter = useCallback(
    (idx: number) => {
      const it = items[idx];
      if (it) openItem(it);
    },
    [items, openItem],
  );

  const closeModal = useCallback(() => {
    setModal(null);
    setPickedWordIdx(null);
    setQuizPicked(null);
    setQuizLocked(false);
  }, []);

  const onWordTap = useCallback(
    (rawToken: string, idx: number) => {
      const item = modal?.kind === "passage" ? modal.item : null;
      if (!item) return;
      const clean = stripPunct(rawToken);
      speakHebrew(clean);
      setPickedWordIdx(idx);
    },
    [modal],
  );

  const recordAnswer = useCallback((ok: boolean) => {
    const p = loadLearnProgress();
    let n = touchDailyStreak(p);
    n = recordGradedAnswer(n, ok, { skills: ["comprehension", "recognition"] });
    saveLearnProgress(n);
  }, []);

  const startExercises = useCallback(() => {
    if (modal?.kind !== "passage") return;
    const { item } = modal;
    if (!hasExercises(item)) return;
    setQuizPicked(null);
    setQuizLocked(false);
    const hasTq = (item.tq?.length ?? 0) > 0;
    setModal({
      kind: "quiz",
      item,
      phase: hasTq ? "tq" : "wq",
      qIdx: 0,
      score: 0,
    });
  }, [modal]);

  const currentQuizQuestion = useCallback((m: Extract<ModalPhase, { kind: "quiz" }>) => {
    const qs = m.phase === "tq" ? m.item.tq : m.item.wq;
    if (!qs || m.qIdx >= qs.length) return null;
    return qs[m.qIdx]!;
  }, []);

  const advanceQuiz = useCallback(
    (m: Extract<ModalPhase, { kind: "quiz" }>) => {
      const tqN = m.item.tq?.length ?? 0;
      const wqN = m.item.wq?.length ?? 0;
      const total = tqN + wqN;

      if (m.phase === "tq" && tqN > 0 && m.qIdx + 1 < tqN) {
        setModal({ ...m, qIdx: m.qIdx + 1 });
        setQuizPicked(null);
        setQuizLocked(false);
        return;
      }
      if (m.phase === "tq") {
        if (wqN > 0) {
          setModal({ ...m, phase: "wq", qIdx: 0 });
          setQuizPicked(null);
          setQuizLocked(false);
          return;
        }
        setModal({
          kind: "done",
          item: m.item,
          score: m.score,
          total,
        });
        setQuizPicked(null);
        setQuizLocked(false);
        return;
      }
      if (m.phase === "wq" && wqN > 0 && m.qIdx + 1 < wqN) {
        setModal({ ...m, qIdx: m.qIdx + 1 });
        setQuizPicked(null);
        setQuizLocked(false);
        return;
      }
      setModal({
        kind: "done",
        item: m.item,
        score: m.score,
        total,
      });
      setQuizPicked(null);
      setQuizLocked(false);
    },
    [],
  );

  const onPickQuizOption = useCallback(
    (val: string) => {
      if (modal?.kind !== "quiz" || quizLocked) return;
      const q = currentQuizQuestion(modal);
      if (!q) return;
      const ok = val === q.c;
      const newScore = ok ? modal.score + 1 : modal.score;
      recordAnswer(ok);
      setQuizPicked(val);
      setQuizLocked(true);
      const snap = { ...modal, score: newScore };
      window.setTimeout(() => advanceQuiz(snap), ok ? 550 : 1200);
    },
    [modal, quizLocked, currentQuizQuestion, recordAnswer, advanceQuiz],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (modal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, closeModal]);

  return (
    <>
      <CoverFlowCarousel
        key={`${progress.activeLevel}-${coverItems.length}-${Object.keys(progress.readingCarouselRevealed ?? {}).length}-${Object.keys(progress.readingPassageQuizComplete ?? {}).length}`}
        variant="minimal"
        items={coverItems}
        onActivateCenter={onActivateCoverCenter}
        centerActionLabel="Open passage →"
        prevAriaLabel="Previous passage"
        nextAriaLabel="Next passage"
        focusItemKey={focusPassageKey ?? null}
        emptySlot={
          coverItems.length === 0 ? (
            <>
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                Your reading shelf
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Passages appear here as you move through the course. Complete{" "}
                <strong className="text-ink">Alef — first story (1-read)</strong>{" "}
                to unlock Jewish texts and the first course reading. Higher-level
                readings unlock when you work in Bet–Dalet. Saved library snippets
                show up as soon as you save them.
              </p>
              <Link
                href="/learn/1/1-read"
                className="btn-elevated-primary mt-4 inline-flex no-underline"
              >
                Open first story in Learn →
              </Link>
            </>
          ) : undefined
        }
      />

      {modal ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:items-center"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="flex max-h-[min(90dvh,720px)] w-full max-w-lg min-h-0 flex-col overflow-hidden rounded-2xl border border-ink/15 bg-parchment-card shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reading-modal-title"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] [scrollbar-gutter:stable]">
              {modal.kind === "passage" ? (
                <PassageBody
                  item={modal.item}
                  pickedWordIdx={pickedWordIdx}
                  onWordTap={onWordTap}
                  onListenAll={() => speakHebrew(modal.item.h)}
                  onStartExercises={
                    hasExercises(modal.item) ? startExercises : undefined
                  }
                  onClose={closeModal}
                />
              ) : null}
              {modal.kind === "quiz" ? (
                <QuizBody
                  modal={modal}
                  picked={quizPicked}
                  onPick={onPickQuizOption}
                  onClose={closeModal}
                  onBackToPassage={() => {
                    setQuizPicked(null);
                    setQuizLocked(false);
                    setModal({ kind: "passage", item: modal.item });
                  }}
                />
              ) : null}
              {modal.kind === "done" ? (
                <DoneBody
                  modal={modal}
                  onClose={closeModal}
                  onRecordQuizFlowDone={() => {
                    if (modal.total <= 0) return;
                    const p = loadLearnProgress();
                    saveLearnProgress(
                      markReadingPassageQuizComplete(p, modal.item.id),
                    );
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function PassageBody({
  item,
  pickedWordIdx,
  onWordTap,
  onListenAll,
  onStartExercises,
  onClose,
}: {
  item: ReadingCarouselItem;
  pickedWordIdx: number | null;
  onWordTap: (token: string, idx: number) => void;
  onListenAll: () => void;
  onStartExercises?: () => void;
  onClose: () => void;
}) {
  const tokens = useMemo(() => passageTokens(item.h), [item.h]);
  const reveal = useMemo(() => {
    if (pickedWordIdx == null) return null;
    const raw = tokens[pickedWordIdx];
    if (raw == null) return null;
    const clean = stripPunct(raw);
    const voc = item.vocab?.find((v) => v.h === clean);
    return { clean, voc, raw };
  }, [pickedWordIdx, tokens, item.vocab]);

  return (
    <>
      <div
        className="rounded-t-2xl px-4 py-3 text-white"
        style={{
          background: `linear-gradient(135deg, ${item.col}, ${item.col}cc)`,
        }}
      >
        <p className="font-label text-[9px] uppercase tracking-[0.15em] text-white/75">
          {item.src}
        </p>
        <h2
          id="reading-modal-title"
          className="mt-1 text-base font-medium leading-snug"
        >
          {item.label}
        </h2>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onListenAll}
            className="rounded-lg border border-ink/15 bg-parchment-deep/40 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink hover:bg-parchment-deep/60"
          >
            Listen to passage
          </button>
        </div>
        <Hebrew
          as="div"
          className="text-right text-[22px] leading-[2.2] text-ink"
        >
          {tokens.map((w, i) => (
            <button
              key={`${i}-${w}`}
              type="button"
              onClick={() => onWordTap(w, i)}
              className={`mx-0.5 inline-block border-b-2 border-transparent transition hover:border-amber ${
                pickedWordIdx === i ? "text-amber" : ""
              }`}
            >
              {w}
            </button>
          ))}
        </Hebrew>
        <div className="min-h-[52px] rounded-xl border border-ink/10 bg-parchment-deep/30 p-3 text-sm italic text-ink-muted">
          {reveal ? (
            reveal.voc ? (
              <div className="flex flex-wrap items-baseline gap-2 not-italic">
                <Hebrew className="text-xl text-ink">{reveal.voc.h}</Hebrew>
                <button
                  type="button"
                  onClick={() => speakHebrew(reveal.voc!.h)}
                  className="rounded border border-ink/15 px-2 py-0.5 font-label text-[8px] uppercase text-ink-muted"
                >
                  Play
                </button>
                <span className="text-amber">{reveal.voc.p}</span>
                <span>= {reveal.voc.e}</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 not-italic">
                <Hebrew className="text-xl text-ink">{reveal.clean}</Hebrew>
                <button
                  type="button"
                  onClick={() => speakHebrew(reveal.clean)}
                  className="rounded border border-ink/15 px-2 py-0.5 font-label text-[8px] uppercase text-ink-muted"
                >
                  Play
                </button>
              </div>
            )
          ) : (
            <span>Tap any word to hear it and see a gloss when it is in the vocabulary list.</span>
          )}
        </div>
        {item.e ? (
          <p className="border-l-4 border-ink/15 pl-3 text-sm italic text-ink-muted">
            {item.e}
          </p>
        ) : null}
        {item.note ? (
          <div
            className="rounded-xl border-2 bg-gradient-to-br from-[#4a3520] to-[#5c4033] p-3 text-[13px] leading-relaxed text-[#e8d4a8]"
            style={{ borderColor: item.col }}
          >
            <p className="mb-2 font-label text-[9px] uppercase tracking-[0.15em] text-white/90">
              Grammar and context
            </p>
            <p>{item.note}</p>
          </div>
        ) : null}
        {item.sefariaLink ? (
          <a
            href={item.sefariaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-sage/35 bg-sage/10 px-3 py-2 font-label text-[9px] uppercase tracking-wide text-sage hover:bg-sage/15"
          >
            Browse full text on Sefaria →
          </a>
        ) : null}
        <div className="flex flex-wrap gap-2 border-t border-ink/10 pt-4">
          {onStartExercises ? (
            <button
              type="button"
              onClick={onStartExercises}
              className="rounded-lg bg-burg px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Start exercises
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-ink/20 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/50"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function QuizBody({
  modal,
  picked,
  onPick,
  onClose,
  onBackToPassage,
}: {
  modal: Extract<ModalPhase, { kind: "quiz" }>;
  picked: string | null;
  onPick: (val: string) => void;
  onClose: () => void;
  onBackToPassage: () => void;
}) {
  const q = modal.phase === "tq" ? modal.item.tq?.[modal.qIdx] : modal.item.wq?.[modal.qIdx];
  if (!q) return null;
  const isTq = modal.phase === "tq";
  const tqQ = q as ReadingPassageTq;
  const wqQ = q as ReadingPassageWq;

  return (
    <>
      <div className="border-b border-ink/10 bg-parchment-deep/40 px-4 py-3">
        <p className="font-label text-[9px] uppercase tracking-[0.18em] text-ink-muted">
          {isTq ? "Transliteration" : "Word choice"}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {isTq
            ? LEARN_VOICE.readingQuizTransliteration
            : LEARN_VOICE.readingQuizWordChoice}
        </p>
      </div>
      <div className="space-y-4 p-4 text-center">
        {isTq ? (
          <>
            <Hebrew className="block text-4xl text-ink">{tqQ.w}</Hebrew>
            <button
              type="button"
              onClick={() => speakHebrew(tqQ.w)}
              className="mt-2 rounded-lg border border-ink/15 px-3 py-1 font-label text-[9px] uppercase text-ink-muted"
            >
              Play word
            </button>
          </>
        ) : (
          <p className="text-xl italic text-ink">&ldquo;{wqQ.e}&rdquo;</p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {q.o.map((opt) => {
            const show = picked != null;
            const isCorrect = opt === q.c;
            const isSel = opt === picked;
            let ring =
              "border-ink/12 hover:bg-parchment-deep/50";
            if (show) {
              if (isCorrect) ring = "border-sage bg-sage/15 ring-2 ring-sage";
              else if (isSel) ring = "border-rust bg-rust/10 ring-2 ring-rust/40";
              else ring = "opacity-50 border-ink/8";
            }
            return (
              <button
                key={opt}
                type="button"
                disabled={show}
                onClick={() => onPick(opt)}
                className={`rounded-xl border px-3 py-3 text-sm transition ${ring}`}
              >
                {isTq ? (
                  opt
                ) : (
                  <Hebrew className="text-lg text-ink">{opt}</Hebrew>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-center gap-2 border-t border-ink/10 pt-4">
          <button
            type="button"
            onClick={onBackToPassage}
            className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-sage"
          >
            ← Back to passage
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase text-ink-muted"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function DoneBody({
  modal,
  onClose,
  onRecordQuizFlowDone,
}: {
  modal: Extract<ModalPhase, { kind: "done" }>;
  onClose: () => void;
  onRecordQuizFlowDone?: () => void;
}) {
  const pct = modal.total
    ? Math.round((modal.score / modal.total) * 100)
    : 100;
  const pass = pct >= 70;

  return (
    <div className="p-8 text-center">
      <p className="text-5xl" aria-hidden>
        {pass ? "🎉" : "📖"}
      </p>
      <p className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-ink">
        {pass ? "Passage exercises complete" : "Keep practising"}
      </p>
      <p
        className={`mt-3 text-4xl font-semibold tabular-nums ${pass ? "text-sage" : "text-amber"}`}
      >
        {modal.score}/{modal.total}
      </p>
      <p className="mt-2 text-sm italic text-ink-muted">
        {pass ? "Nice work on this passage." : "Try again to improve your score."}
      </p>
      <button
        type="button"
        onClick={() => {
          onRecordQuizFlowDone?.();
          onClose();
        }}
        className="mt-8 rounded-lg bg-sage px-6 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
      >
        Done
      </button>
    </div>
  );
}
