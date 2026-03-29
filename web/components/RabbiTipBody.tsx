"use client";

import Link from "next/link";
import type { RabbiTip } from "@/lib/rabbi-tips";

export function RabbiTipBody({
  tip,
  onClose,
}: {
  tip: RabbiTip;
  onClose: () => void;
}) {
  return (
    <div className="text-sm text-ink-muted">
      <p className="mb-3 font-label text-[10px] uppercase tracking-[0.2em] text-sage">
        Ask the Rabbi
      </p>
      <h2 className="mb-3 text-lg font-medium text-ink">{tip.title}</h2>
      <ul className="list-inside list-disc space-y-2 leading-relaxed">
        {tip.lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        {tip.cta ? (
          <Link
            href={tip.cta.href}
            onClick={onClose}
            className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            {tip.cta.label}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
        >
          Close
        </button>
      </div>
    </div>
  );
}
