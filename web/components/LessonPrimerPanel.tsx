"use client";

import { Hebrew } from "@/components/Hebrew";
import type { SectionLessonPrimer } from "@/data/course-section-primers";

export function LessonPrimerPanel({ primer }: { primer: SectionLessonPrimer }) {
  return (
    <details
      open
      className="mb-6 rounded-2xl border border-sage/20 bg-parchment-card/90 shadow-elevated"
    >
      <summary className="cursor-pointer list-none px-4 py-3 font-label text-[10px] uppercase tracking-[0.18em] text-sage marker:content-none [&::-webkit-details-marker]:hidden">
        Before you study — words, grammar &amp; ideas
      </summary>
      <div className="space-y-4 border-t border-ink/10 px-4 pb-4 pt-3 text-sm text-ink-muted">
        <p className="leading-relaxed text-ink">{primer.intro}</p>

        {primer.words && primer.words.length > 0 ? (
          <div>
            <p className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
              Words &amp; phrases
            </p>
            <ul className="mt-2 space-y-2">
              {primer.words.map((w, i) => (
                <li
                  key={`${w.he}-${i}`}
                  className="rounded-lg border border-ink/8 bg-parchment/60 px-3 py-2"
                >
                  <Hebrew className="text-base text-ink">{w.he}</Hebrew>
                  <p className="text-xs text-ink-muted">{w.en}</p>
                  {w.hint ? (
                    <p className="mt-1 text-[11px] text-ink-faint">{w.hint}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {primer.grammar && primer.grammar.length > 0 ? (
          <div>
            <p className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
              Grammar focus
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed">
              {primer.grammar.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {primer.ideas && primer.ideas.length > 0 ? (
          <div>
            <p className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
              Ideas &amp; context
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed">
              {primer.ideas.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}
