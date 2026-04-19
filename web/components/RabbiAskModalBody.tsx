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
          There isn&apos;t a Hebrew cue registered yet. Use{" "}
          <strong className="font-medium text-ink">Ask the Rabbi</strong> on the
          exercise you&apos;re in (MCQ, sentences, listening, comprehension, roots,
          or the story card) — then the sheet can target that Hebrew.
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
