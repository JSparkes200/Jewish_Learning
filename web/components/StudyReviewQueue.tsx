"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Hebrew } from "@/components/Hebrew";
import type { LearnProgressState } from "@/lib/learn-progress";
import {
  buildStudyReviewQueue,
  findMcqSectionIdForLemma,
} from "@/lib/study-review-queue";

export function StudyReviewQueue({ progress }: { progress: LearnProgressState }) {
  const level = progress.activeLevel;
  const { belowGate, unseen } = useMemo(
    () => buildStudyReviewQueue(level, progress.vocabLevels),
    [level, progress.vocabLevels],
  );

  const nBelow = belowGate.length;
  const nUnseen = unseen.length;
  const highlight = nBelow >= 3;

  if (nBelow === 0 && nUnseen === 0) {
    return (
      <div
        id="study-review-queue"
        className="rounded-2xl border border-ink/10 bg-parchment-card/40 p-4"
      >
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Review queue
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          No course lemmas queued on{" "}
          <strong className="text-ink">level {level}</strong> yet. Answer MCQs
          in Learn (or import progress) to track per-word levels — words below 2
          stars show up here first.
        </p>
        <Link
          href={`/learn/${level}`}
          className="mt-3 inline-block rounded-lg bg-sage px-3 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
        >
          Open level {level}
        </Link>
      </div>
    );
  }

  return (
    <div
      id="study-review-queue"
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-amber/40 bg-amber/10"
          : "border-ink/10 bg-parchment-card/50"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Review queue
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Level {level} course list — legacy Study hub used a mistake queue (
            <code className="text-[10px]">learner.rq</code>); here we surface
            words still below the lv≥2 gate and a short &ldquo;not yet
            starred&rdquo; sample.
          </p>
        </div>
        {highlight ? (
          <span className="shrink-0 rounded-full border border-amber/50 bg-amber/15 px-2 py-1 font-label text-[8px] uppercase tracking-wide text-amber">
            {nBelow} need another win
          </span>
        ) : null}
      </div>

      {nBelow > 0 ? (
        <ul className="mt-4 space-y-2">
          {belowGate.map((e) => {
            const sid = findMcqSectionIdForLemma(level, e.lemma);
            const href = sid
              ? `/learn/${level}/${encodeURIComponent(sid)}`
              : `/learn/${level}`;
            return (
              <li
                key={`bg-${e.lemma}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-ink/8 bg-parchment-deep/25 px-3 py-2"
              >
                <div className="min-w-0">
                  <Hebrew className="text-lg text-ink">{e.lemma}</Hebrew>
                  <p className="text-[10px] text-ink-faint">
                    Star level {e.vocabLevel} · aim for 2+ for gates
                  </p>
                </div>
                <Link
                  href={href}
                  className="shrink-0 rounded-lg border border-sage/35 px-2 py-1 font-label text-[8px] uppercase tracking-wide text-sage hover:bg-sage/10"
                >
                  Drill →
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-sage">
          Nothing below the gate on this level — nice. Optional: pick fresh
          lemmas below.
        </p>
      )}

      {nUnseen > 0 ? (
        <div className="mt-5 border-t border-ink/10 pt-4">
          <p className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-faint">
            Not yet starred (sample)
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {unseen.map((e) => {
              const sid = findMcqSectionIdForLemma(level, e.lemma);
              const href = sid
                ? `/learn/${level}/${encodeURIComponent(sid)}`
                : `/learn/${level}`;
              return (
                <li key={`un-${e.lemma}`}>
                  <Link
                    href={href}
                    className="inline-block rounded-lg border border-ink/10 bg-parchment/80 px-2 py-1.5 transition hover:border-sage/40"
                  >
                    <Hebrew className="text-sm text-ink-muted">{e.lemma}</Hebrew>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <Link
        href={`/learn/${level}`}
        className="mt-4 inline-block font-label text-[9px] uppercase tracking-wide text-sage underline"
      >
        All subsections on level {level} →
      </Link>
    </div>
  );
}
