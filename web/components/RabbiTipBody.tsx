"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { RabbiTip } from "@/lib/rabbi-tips";
import {
  SKILL_METRIC_LABELS,
  getSkillMetricSnapshot,
  getWeakestSkillMetrics,
  loadLearnProgress,
} from "@/lib/learn-progress";

export function RabbiTipBody({
  tip,
  onClose,
}: {
  tip: RabbiTip;
  onClose: () => void;
}) {
  const progress = useMemo(() => loadLearnProgress(), []);
  const skillSnapshot = getSkillMetricSnapshot(progress);
  const weakest = getWeakestSkillMetrics(progress, 2);

  const coachLines = useMemo(() => {
    if ((progress.mcqAttempts ?? 0) === 0) return [];
    return weakest.map((k) => {
      const label = SKILL_METRIC_LABELS[k];
      if (k === "production")
        return `${label} is a current growth edge — run Fill + Correct sentence in Study before new sections.`;
      if (k === "grammar")
        return `${label} is lagging — focus roots sections, bridge checks, and Correct sentence rounds.`;
      if (k === "listening")
        return `${label} needs reps — add Numbers listen drills between reading blocks.`;
      if (k === "comprehension")
        return `${label} needs depth — do passage quizzes in Reading and level stories.`;
      if (k === "definition")
        return `${label} can be sharper — use MCQ + tap-the-word to tighten meaning recall.`;
      return `${label} is behind the others — prioritize quick review sets in Study.`;
    });
  }, [progress.mcqAttempts, weakest]);

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
      {(progress.mcqAttempts ?? 0) > 0 ? (
        <div className="mt-4 rounded-xl border border-amber/25 bg-amber/5 p-3">
          <p className="font-label text-[9px] uppercase tracking-[0.15em] text-amber">
            Personalized coaching
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-[13px] leading-relaxed text-ink-muted">
            {coachLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-ink-faint">
            Balance snapshot:{" "}
            {(
              Object.keys(skillSnapshot) as Array<keyof typeof skillSnapshot>
            )
              .map((k) => {
                const s = skillSnapshot[k];
                const pct =
                  s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
                return `${SKILL_METRIC_LABELS[k]} ${pct}%`;
              })
              .join(" · ")}
          </p>
        </div>
      ) : null}
      <div className="mt-5 rounded-xl border border-sage/20 bg-sage/5 p-3">
        <p className="font-label text-[9px] uppercase tracking-[0.15em] text-sage">
          Today&apos;s plan
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/study#daily-session"
            onClick={onClose}
            className="rounded-lg bg-sage px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-white hover:brightness-110"
          >
            Adaptive session
          </Link>
          <Link
            href="/study#study-practice-games"
            onClick={onClose}
            className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            Practice games
          </Link>
          <Link
            href="/study#study-review-queue"
            onClick={onClose}
            className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            Review queue
          </Link>
          <Link
            href="/reading"
            onClick={onClose}
            className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            Reading
          </Link>
          <Link
            href="/numbers#listen"
            onClick={onClose}
            className="rounded-lg border border-ink/15 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            Listen — numbers
          </Link>
        </div>
      </div>
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
