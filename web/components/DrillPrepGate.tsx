"use client";

import { useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";

export type DrillPrepCard = {
  he?: string;
  en: string;
  note?: string;
};

export function DrillPrepGate({
  title,
  subtitle,
  cards,
  ctaLabel = "Start drills",
  children,
}: {
  title: string;
  subtitle?: string;
  cards: DrillPrepCard[];
  ctaLabel?: string;
  children: React.ReactNode;
}) {
  const [started, setStarted] = useState(false);
  const preview = useMemo(() => cards.slice(0, 8), [cards]);

  if (started || preview.length === 0) return <>{children}</>;

  return (
    <div className="rounded-2xl border border-ink/12 bg-parchment-card/85 p-4">
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Lesson prep
      </p>
      <h3 className="mt-1 text-sm font-medium text-ink">{title}</h3>
      {subtitle ? <p className="mt-1 text-xs text-ink-muted">{subtitle}</p> : null}
      <ul className="mt-4 space-y-2">
        {preview.map((c, i) => (
          <li
            key={`${i}-${c.he ?? c.en}`}
            className="rounded-xl border border-ink/10 bg-parchment/70 px-3 py-2"
          >
            {c.he ? (
              <Hebrew className="text-lg leading-relaxed text-ink">{c.he}</Hebrew>
            ) : null}
            <p className="text-sm text-ink-muted">{c.en}</p>
            {c.note ? <p className="mt-0.5 text-[11px] text-ink-faint">{c.note}</p> : null}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setStarted(true)}
        className="mt-4 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
