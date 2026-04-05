"use client";

import { useMemo, useState } from "react";
import { DrillPrepPanel, type DrillPrepCard } from "@/components/DrillPrepPanel";
import { LEARN_VOICE } from "@/lib/learn-user-voice";

export type { DrillPrepCard };

export function DrillPrepGate({
  title,
  subtitle,
  cards,
  ctaLabel = LEARN_VOICE.drillPrepCta,
  children,
}: {
  title: string;
  subtitle?: string;
  cards: DrillPrepCard[];
  ctaLabel?: string;
  children: React.ReactNode;
}) {
  const [started, setStarted] = useState(false);
  const previewLen = useMemo(() => Math.min(cards.length, 8), [cards.length]);

  if (started || previewLen === 0) return <>{children}</>;

  return (
    <div className="rounded-3xl border-2 border-ink/10 bg-gradient-to-br from-parchment-card/95 to-parchment-deep/45 p-5 shadow-[0_8px_28px_rgba(44,36,22,0.06)]">
      <DrillPrepPanel
        title={title}
        subtitle={subtitle}
        cards={cards}
        ctaLabel={ctaLabel}
        onContinue={() => setStarted(true)}
        className="border-0 bg-transparent p-0"
      />
    </div>
  );
}
