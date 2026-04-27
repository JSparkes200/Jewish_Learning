"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hebrew } from "@/components/Hebrew";

// ─── types ─────────────────────────────────────────────────────────────────────

export type MilestoneKind =
  | "level-complete"
  | "foundation-exit"
  | "bridge-complete"
  | "specialty-tier";

export type MilestoneData = {
  kind: MilestoneKind;
  /** Display letter (א, ב, ג, ד, or custom) */
  letter?: string;
  /** Main heading, e.g. "Level 2 Complete" */
  title: string;
  /** Optional Hebrew version of title */
  heTitle?: string;
  /** Short motivating description */
  message: string;
  /** Next step CTA text */
  ctaLabel?: string;
  /** Next step CTA href */
  ctaHref?: string;
};

// ─── floating particles ────────────────────────────────────────────────────────

const LETTERS = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"];

function FloatingLetter({ letter, delay, x, y }: { letter: string; delay: number; x: number; y: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute font-hebrew text-2xl text-sage/30 select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.7, 0],
        y: [-20, -80],
        scale: [0.5, 1, 0.8],
        rotate: [0, Math.random() > 0.5 ? 15 : -15],
      }}
      transition={{
        delay,
        duration: 2.5,
        ease: "easeOut",
        times: [0, 0.4, 1],
      }}
    >
      {letter}
    </motion.span>
  );
}

function Particles({ count = 14 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => ({
    letter: LETTERS[i % LETTERS.length],
    delay: i * 0.08,
    x: 5 + Math.floor((i * 23 + i * 7) % 90),
    y: 20 + Math.floor((i * 31 + i * 11) % 60),
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {items.map((p, i) => (
        <FloatingLetter key={i} {...p} />
      ))}
    </div>
  );
}

// ─── icon per kind ────────────────────────────────────────────────────────────

function MilestoneIcon({ kind, letter }: { kind: MilestoneKind; letter?: string }) {
  const COLOR_MAP: Record<MilestoneKind, string> = {
    "level-complete": "text-sage",
    "foundation-exit": "text-amber",
    "bridge-complete": "text-rust",
    "specialty-tier": "text-burg",
  };
  return (
    <div className={`flex h-20 w-20 items-center justify-center rounded-full border-2 border-current/30 bg-current/10 ${COLOR_MAP[kind]}`}>
      {letter ? (
        <Hebrew className={`text-4xl font-bold ${COLOR_MAP[kind]}`}>{letter}</Hebrew>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      )}
    </div>
  );
}

// ─── modal content ────────────────────────────────────────────────────────────

function CelebrationModal({
  data,
  onContinue,
}: {
  data: MilestoneData;
  onContinue: () => void;
}) {
  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onContinue();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onContinue]);

  return (
    <>
      {/* backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onContinue}
      />

      {/* card */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
        <motion.div
          className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/30 bg-parchment-card shadow-elevated"
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          <Particles />
          <div className="relative z-10 flex flex-col items-center px-6 pb-7 pt-8 text-center">
            <MilestoneIcon kind={data.kind} letter={data.letter} />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5"
            >
              {data.heTitle ? (
                <Hebrew as="p" className="text-sm text-ink-faint">
                  {data.heTitle}
                </Hebrew>
              ) : null}
              <h2 className="mt-1 text-2xl font-bold text-ink">{data.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {data.message}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 flex w-full flex-col gap-2"
            >
              {data.ctaHref ? (
                <a
                  href={data.ctaHref}
                  className="btn-elevated-primary text-center"
                  onClick={onContinue}
                >
                  {data.ctaLabel ?? "Continue"}
                </a>
              ) : null}
              <button
                type="button"
                onClick={onContinue}
                className="rounded-xl border border-ink/10 py-2.5 font-label text-xs uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/40"
              >
                {data.ctaHref ? "Maybe later" : "Continue studying"}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ─── exported hook ─────────────────────────────────────────────────────────────

/**
 * Returns a `celebrate` function and the rendered modal.
 *
 * Usage:
 * ```tsx
 * const { celebrate, MilestoneModal } = useMilestoneCelebration();
 * celebrate({ kind: "level-complete", title: "Level 2 Complete", ... });
 * return <>{MilestoneModal}</>;
 * ```
 */
export function useMilestoneCelebration() {
  const [pending, setPending] = useState<MilestoneData | null>(null);

  const celebrate = useCallback((data: MilestoneData) => {
    setPending(data);
  }, []);

  const dismiss = useCallback(() => setPending(null), []);

  const MilestoneModal = (
    <AnimatePresence>
      {pending ? (
        <CelebrationModal key="milestone" data={pending} onContinue={dismiss} />
      ) : null}
    </AnimatePresence>
  );

  return { celebrate, MilestoneModal };
}

// ─── standalone component (for direct use) ────────────────────────────────────

export function MilestoneCelebration({
  data,
  onDismiss,
}: {
  data: MilestoneData | null;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {data ? (
        <CelebrationModal key="milestone" data={data} onContinue={onDismiss} />
      ) : null}
    </AnimatePresence>
  );
}
