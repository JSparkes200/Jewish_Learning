"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hebrew } from "@/components/Hebrew";
import { speakHebrew } from "@/lib/speech-hebrew";
import { type SavedWordEntry } from "@/lib/saved-words";

// ─── types ─────────────────────────────────────────────────────────────────────

type CardStatus = "unseen" | "known" | "learning";

type CardState = {
  word: SavedWordEntry;
  status: CardStatus;
};

// ─── icons ─────────────────────────────────────────────────────────────────────

function SpeakerIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function XIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── single card ───────────────────────────────────────────────────────────────

function FlashCard({
  card,
  onKnow,
  onLearn,
  index,
  total,
}: {
  card: CardState;
  onKnow: () => void;
  onLearn: () => void;
  index: number;
  total: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const w = card.word;

  useEffect(() => {
    setFlipped(false);
  }, [card]);

  const handleSpeak = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      void speakHebrew(w.he);
    },
    [w.he],
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* progress */}
      <div className="flex w-full items-center justify-between text-xs text-ink-faint">
        <span>
          {index + 1} / {total}
        </span>
        <div className="flex gap-1">
          <span className="text-sage">
            {total - index - 1} left
          </span>
        </div>
      </div>

      {/* card */}
      <div
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Card flipped — showing translation" : "Tap to reveal translation"}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setFlipped((f) => !f);
        }}
        className="relative w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* front */}
          <div
            className="surface-elevated flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="section-label">Hebrew</p>
            <Hebrew className="text-5xl font-bold tracking-wide text-ink">
              {w.he}
            </Hebrew>
            {w.translit ? (
              <p className="font-label text-sm text-ink-faint">{w.translit}</p>
            ) : null}
            <button
              type="button"
              aria-label={`Speak ${w.he}`}
              onClick={handleSpeak}
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-parchment-deep/40 text-ink-muted transition hover:bg-parchment-deep/70 hover:text-ink"
            >
              <SpeakerIcon className="h-4 w-4" />
            </button>
            <p className="text-xs text-ink-faint">tap to flip</p>
          </div>

          {/* back */}
          <div
            className="surface-elevated absolute inset-0 flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="section-label">Translation</p>
            {w.en ? (
              <p className="text-3xl font-semibold text-ink">{w.en}</p>
            ) : (
              <p className="text-ink-faint italic">No translation saved</p>
            )}
            {w.colloquial ? (
              <p className="text-sm text-ink-muted">
                Colloquial: {w.colloquial}
              </p>
            ) : null}
            <Hebrew className="mt-2 text-lg text-ink-faint">{w.he}</Hebrew>
          </div>
        </motion.div>
      </div>

      {/* grade buttons — only shown when flipped */}
      <AnimatePresence>
        {flipped ? (
          <motion.div
            key="grade"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex w-full gap-3"
          >
            <button
              type="button"
              onClick={onLearn}
              className="flex-1 rounded-xl border border-amber/40 bg-amber/8 py-3 font-label text-xs uppercase tracking-wide text-amber transition hover:bg-amber/15 active:scale-95"
            >
              Still learning
            </button>
            <button
              type="button"
              onClick={onKnow}
              className="flex-1 rounded-xl border border-sage/40 bg-sage/8 py-3 font-label text-xs uppercase tracking-wide text-sage transition hover:bg-sage/15 active:scale-95"
            >
              Got it ✓
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ─── session summary ──────────────────────────────────────────────────────────

function SessionSummary({
  known,
  learning,
  total,
  onRestart,
  onRestartLearning,
  onClose,
}: {
  known: number;
  learning: number;
  total: number;
  onRestart: () => void;
  onRestartLearning: () => void;
  onClose: () => void;
}) {
  const pct = total > 0 ? Math.round((known / total) * 100) : 0;
  return (
    <div className="text-center">
      <Hebrew as="p" className="text-4xl text-ink">
        {pct >= 80 ? "כָּל הַכָּבוֹד" : pct >= 50 ? "יָפֶה" : "הַמְשֵׁךְ"}
      </Hebrew>
      <p className="mt-1 font-label text-[10px] uppercase tracking-wide text-ink-muted">
        {pct >= 80 ? "Well done!" : pct >= 50 ? "Good progress" : "Keep going"}
      </p>
      <div className="mx-auto mt-5 grid w-full max-w-[240px] grid-cols-2 gap-3">
        <div className="rounded-xl border border-sage/30 bg-sage/8 py-3">
          <p className="text-2xl font-bold text-sage">{known}</p>
          <p className="mt-0.5 font-label text-[9px] uppercase tracking-wide text-sage/70">
            Got it
          </p>
        </div>
        <div className="rounded-xl border border-amber/30 bg-amber/8 py-3">
          <p className="text-2xl font-bold text-amber">{learning}</p>
          <p className="mt-0.5 font-label text-[9px] uppercase tracking-wide text-amber/70">
            Still learning
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {learning > 0 ? (
          <button
            type="button"
            className="btn-elevated-primary w-full"
            onClick={onRestartLearning}
          >
            Drill {learning} unsure card{learning !== 1 ? "s" : ""}
          </button>
        ) : null}
        <button
          type="button"
          className="btn-elevated-secondary w-full"
          onClick={onRestart}
        >
          Restart all {total}
        </button>
        <button
          type="button"
          className="w-full rounded-xl border border-ink/10 py-2.5 font-label text-xs uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/30"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── main component ────────────────────────────────────────────────────────────

type Props = {
  words: SavedWordEntry[];
  onClose: () => void;
};

export function SavedWordsFlashcard({ words, onClose }: Props) {
  const shuffle = (arr: SavedWordEntry[]) =>
    [...arr].sort(() => Math.random() - 0.5);

  const [cards, setCards] = useState<CardState[]>(() =>
    shuffle(words).map((w) => ({ word: w, status: "unseen" })),
  );
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleKnow = useCallback(() => {
    setCards((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status: "known" };
      return next;
    });
    if (index + 1 >= cards.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, cards.length]);

  const handleLearn = useCallback(() => {
    setCards((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status: "learning" };
      return next;
    });
    if (index + 1 >= cards.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, cards.length]);

  const handleRestart = useCallback(() => {
    setCards(shuffle(words).map((w) => ({ word: w, status: "unseen" })));
    setIndex(0);
    setDone(false);
  }, [words]);

  const handleRestartLearning = useCallback(() => {
    const learning = cards.filter((c) => c.status === "learning");
    setCards(shuffle(learning.map((c) => c.word)).map((w) => ({ word: w, status: "unseen" })));
    setIndex(0);
    setDone(false);
  }, [cards]);

  const known = cards.filter((c) => c.status === "known").length;
  const learning = cards.filter((c) => c.status === "learning").length;

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label">Flashcards</p>
          <p className="text-xs text-ink-muted">{words.length} saved word{words.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          aria-label="Close flashcard mode"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink-muted transition hover:bg-parchment-deep/50 hover:text-ink"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      {done ? (
        <SessionSummary
          known={known}
          learning={learning}
          total={cards.length}
          onRestart={handleRestart}
          onRestartLearning={handleRestartLearning}
          onClose={onClose}
        />
      ) : cards.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <FlashCard
              card={cards[index]}
              onKnow={handleKnow}
              onLearn={handleLearn}
              index={index}
              total={cards.length}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <p className="text-center text-sm text-ink-muted">No words to drill.</p>
      )}
    </div>
  );
}
