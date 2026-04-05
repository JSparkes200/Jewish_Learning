"use client";

import { useMemo } from "react";
import { Hebrew } from "@/components/Hebrew";
import { LEARN_VOICE } from "@/lib/learn-user-voice";

export type DrillPrepCard = {
  he?: string;
  en: string;
  note?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  cards: DrillPrepCard[];
  ctaLabel?: string;
  onContinue: () => void;
  className?: string;
};

/** Stateless warm-up preview (vocab peek) before drills — parent controls navigation. */
export function DrillPrepPanel({
  title,
  subtitle,
  cards,
  ctaLabel = LEARN_VOICE.drillPrepCta,
  onContinue,
  className = "",
}: Props) {
  const preview = useMemo(() => cards.slice(0, 8), [cards]);
  if (preview.length === 0) return null;

  return (
    <div
      className={`rounded-2xl border border-sage/15 bg-gradient-to-br from-parchment-deep/25 to-transparent p-4 sm:p-5 ${className}`.trim()}
    >
      <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage/90">
        {LEARN_VOICE.drillPrepEyebrow}
      </p>
      <h3 className="mt-1 text-base font-medium text-ink">{title}</h3>
      {subtitle ? (
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{subtitle}</p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {preview.map((c, i) => (
          <li
            key={`${i}-${c.he ?? c.en}`}
            className="rounded-2xl border border-ink/8 bg-parchment-card/70 px-3.5 py-2.5"
          >
            {c.he ? (
              <Hebrew className="text-base leading-relaxed text-ink">{c.he}</Hebrew>
            ) : null}
            <p className="text-sm text-ink-muted">{c.en}</p>
            {c.note ? (
              <p className="mt-0.5 text-[11px] text-ink-faint">{c.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onContinue}
        className="mt-5 w-full rounded-2xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg sm:w-auto"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
