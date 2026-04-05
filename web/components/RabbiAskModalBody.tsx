"use client";

import { RabbiCard, type RabbiAskPayload } from "@/components/RabbiCard";

export function RabbiAskModalBody({
  payload,
}: {
  payload: RabbiAskPayload | null;
}) {
  if (!payload?.targetHe?.trim()) {
    return (
      <div className="space-y-4 text-sm text-ink-muted">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
          Ask the Rabbi
        </p>
        <p className="leading-relaxed text-ink">
          There isn&apos;t a Hebrew headword on screen yet. Open a course lesson with
          multiple choice, sentence practice, or an active root drill — then tap
          here again and the Rabbi will speak to the exact form you&apos;re holding
          in mind.
        </p>
      </div>
    );
  }

  return (
    <RabbiCard
      variant="sheet"
      targetHe={payload.targetHe}
      learnerLevel={payload.learnerLevel}
      translit={payload.translit}
      meaningEn={payload.meaningEn}
      ragContext={payload.ragContext}
      className="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
