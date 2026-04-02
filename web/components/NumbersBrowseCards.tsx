"use client";

import { useCallback, useRef, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  NUMBER_CARD_ROWS,
  NUMBER_CARD_ROW_COUNT,
} from "@/data/course-numbers-cards";
import { speakHebrew } from "@/lib/speech-hebrew";

type BrowseProps = {
  /** Fires once on first swipe or first audio from this block. */
  onEngage?: () => void;
};

export function NumbersBrowseCards({ onEngage }: BrowseProps) {
  const [i, setI] = useState(0);
  const row = NUMBER_CARD_ROWS[i]!;
  const engagedRef = useRef(false);

  const fireEngage = useCallback(() => {
    if (engagedRef.current) return;
    engagedRef.current = true;
    onEngage?.();
  }, [onEngage]);

  const go = useCallback(
    (next: number) => {
      setI(Math.max(0, Math.min(NUMBER_CARD_ROW_COUNT - 1, next)));
      fireEngage();
    },
    [fireEngage],
  );

  const sameMf = row.masc === row.fem;

  return (
    <div className="rounded-2xl border border-amber/30 bg-gradient-to-b from-parchment-card/90 to-parchment-deep/30 p-4">
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Number cards — 0 to 100
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Swipe through every legacy cardinal: Arabic numeral, masculine and
        feminine Hebrew, pronunciation, and audio — same data as{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
          openNumCards
        </code>{" "}
        in the HTML app.
      </p>

      <div className="mt-5 rounded-2xl border border-ink/10 bg-parchment-card/95 px-4 py-6 text-center shadow-inner">
        <p
          className="font-label text-5xl font-bold tabular-nums text-rust sm:text-6xl"
          aria-live="polite"
        >
          {row.roman}
        </p>

        {sameMf ? (
          <div className="mt-5">
            <Hebrew className="block text-2xl leading-snug text-ink sm:text-3xl">
              {row.masc}
            </Hebrew>
            <p className="mt-2 text-[10px] text-ink-faint">
              Same written form for masculine and feminine
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap items-start justify-center gap-4 sm:gap-8">
            <div className="min-w-[120px]">
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                Masc
              </p>
              <Hebrew className="mt-1 block text-2xl leading-snug text-ink sm:text-3xl">
                {row.masc}
              </Hebrew>
            </div>
            <div
              className="hidden h-16 w-px bg-ink/15 sm:block"
              aria-hidden
            />
            <div className="min-w-[120px]">
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                Fem
              </p>
              <Hebrew className="mt-1 block text-2xl leading-snug text-ink sm:text-3xl">
                {row.fem}
              </Hebrew>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-1 text-sm italic text-ink-muted">
          <p>
            <span className="font-label text-[9px] uppercase not-italic text-ink-faint">
              Masc
            </span>{" "}
            {row.pronM}
          </p>
          {!sameMf && row.pronM !== row.pronF ? (
            <p>
              <span className="font-label text-[9px] uppercase not-italic text-ink-faint">
                Fem
              </span>{" "}
              {row.pronF}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              speakHebrew(row.masc);
              fireEngage();
            }}
            className="rounded-xl border border-rust/35 bg-parchment-deep/40 px-4 py-2 font-label text-[9px] uppercase tracking-wide text-ink hover:bg-parchment-deep/60"
          >
            Listen · masc
          </button>
          {!sameMf ? (
            <button
              type="button"
              onClick={() => {
                speakHebrew(row.fem);
                fireEngage();
              }}
              className="rounded-xl border border-rust/35 bg-parchment-deep/40 px-4 py-2 font-label text-[9px] uppercase tracking-wide text-ink hover:bg-parchment-deep/60"
            >
              Listen · fem
            </button>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={i <= 0}
            onClick={() => go(i - 1)}
            className="rounded-xl border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted enabled:hover:bg-parchment-deep/50 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="font-mono text-[11px] text-ink-muted">
            {i + 1} / {NUMBER_CARD_ROW_COUNT}
          </span>
          <button
            type="button"
            disabled={i >= NUMBER_CARD_ROW_COUNT - 1}
            onClick={() => go(i + 1)}
            className="rounded-lg bg-amber px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
