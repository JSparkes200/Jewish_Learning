"use client";

import { useCallback, useRef, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  CARDINAL_MASC_0_TO_10,
  PRON_MASC_0_TO_10,
} from "@/data/course-numbers";
import { speakHebrew } from "@/lib/speech-hebrew";

type PriceProps = {
  onEngage?: () => void;
};

export function NumbersPricePeek({ onEngage }: PriceProps) {
  const [n, setN] = useState(() => Math.floor(Math.random() * 10) + 1);
  const engagedRef = useRef(false);

  const fireEngage = useCallback(() => {
    if (engagedRef.current) return;
    engagedRef.current = true;
    onEngage?.();
  }, [onEngage]);

  const refresh = useCallback(() => {
    setN(Math.floor(Math.random() * 10) + 1);
    fireEngage();
  }, [fireEngage]);

  const idx = Math.min(n, 10);
  const he = CARDINAL_MASC_0_TO_10[idx]!;
  const pron = PRON_MASC_0_TO_10[idx] ?? "";
  const phrase = `${he} שְׁקָלִים`;

  return (
    <div className="rounded-2xl border border-sage/30 bg-sage/5 p-4">
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Prices (peek)
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Sample shekel amounts (1–10 ₪), like the legacy “Prices” card — listen
        and read the masculine cardinal + שקלים.
      </p>
      <p className="mt-4 text-center font-serif text-5xl font-semibold text-sage">
        ₪{n}
      </p>
      <p className="mt-1 text-center text-[11px] text-ink-muted">
        {n} shekel{n > 1 ? "s" : ""}
      </p>
      <div className="mt-4 rounded-xl border border-ink/10 bg-parchment-card/80 p-4 text-center">
        <Hebrew className="block text-2xl text-ink">{phrase}</Hebrew>
        <p className="mt-1 text-[11px] italic text-ink-faint">
          {pron} shkalim
        </p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            speakHebrew(phrase);
            fireEngage();
          }}
          className="rounded-lg border border-sage/35 bg-parchment-card px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
        >
          🔊 Listen
        </button>
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
        >
          Next amount →
        </button>
      </div>
    </div>
  );
}
