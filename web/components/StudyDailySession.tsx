"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Hebrew } from "@/components/Hebrew";
import type { LearnProgressState } from "@/lib/learn-progress";
import {
  buildDailySessionPlan,
  preferredHebrewForPracticeBias,
} from "@/lib/study-daily-session";

export function StudyDailySession({
  progress,
  practiceBiasLemmas,
  onApplyPracticeBias,
  onClearPracticeBias,
}: {
  progress: LearnProgressState;
  practiceBiasLemmas?: readonly string[];
  onApplyPracticeBias: (lemmas: readonly string[]) => void;
  onClearPracticeBias?: () => void;
}) {
  const level = progress.activeLevel;
  const plan = useMemo(
    () => buildDailySessionPlan(progress, level),
    [progress, level],
  );
  const biasList = useMemo(
    () => preferredHebrewForPracticeBias(progress, 24),
    [progress],
  );
  const hasMetrics =
    !!progress.lemmaSkillMetrics &&
    Object.keys(progress.lemmaSkillMetrics).length > 0;

  const { bucketCounts, entryCount, topDueLemmas, mixActions } = plan;

  return (
    <div
      id="daily-session"
      className="surface-elevated scroll-mt-24 space-y-4 border border-sage/25 p-5"
    >
      <div>
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Today&apos;s adaptive session
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Buckets use per-word skill timestamps from your drills. Mix MCQ, fill,
          tap, and correct sentence below for a balanced rep.
        </p>
      </div>

      {!hasMetrics || entryCount === 0 ? (
        <p className="text-sm text-ink-muted">
          Answer a few graded questions in Learn (MCQ, comprehension, etc.) to
          unlock spaced-review buckets and lemma-weighted practice.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-rust/25 bg-parchment-card/60 px-3 py-2">
            <p className="font-label text-[9px] uppercase text-rust">Due now</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
              {bucketCounts.due}
              <span className="text-sm font-normal text-ink-muted">
                {" "}
                skill reviews
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-amber/25 bg-parchment-card/60 px-3 py-2">
            <p className="font-label text-[9px] uppercase text-amber">Soon</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
              {bucketCounts.soon}
              <span className="text-sm font-normal text-ink-muted">
                {" "}
                within ~3d
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-parchment-card/60 px-3 py-2">
            <p className="font-label text-[9px] uppercase text-ink-muted">
              Later
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-ink">
              {bucketCounts.later}
              <span className="text-sm font-normal text-ink-muted">
                {" "}
                scheduled
              </span>
            </p>
          </div>
        </div>
      )}

      {biasList.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              onApplyPracticeBias(biasList);
              requestAnimationFrame(() =>
                document
                  .getElementById("study-practice-games")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" }),
              );
            }}
            className="btn-elevated-primary"
          >
            Weight practice to due lemmas
          </button>
          {practiceBiasLemmas?.length && onClearPracticeBias ? (
            <button
              type="button"
              onClick={onClearPracticeBias}
              className="btn-elevated-secondary"
            >
              Clear weighting
            </button>
          ) : null}
        </div>
      ) : null}

      {topDueLemmas.length > 0 ? (
        <div>
          <p className="font-label text-[9px] uppercase tracking-wide text-ink-muted">
            Jump in — urgent lemmas
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {topDueLemmas.map(({ lemma, href, skillsDue }) => (
              <li key={lemma}>
                {href ? (
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 bg-parchment/90 px-2 py-1.5 text-[12px] text-ink hover:border-sage/40"
                  >
                    <Hebrew className="text-base text-ink">{lemma}</Hebrew>
                    {skillsDue.length ? (
                      <span className="text-[10px] text-ink-faint">
                        ({skillsDue.slice(0, 2).join(" · ")}
                        {skillsDue.length > 2 ? "…" : ""})
                      </span>
                    ) : null}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-ink/8 px-2 py-1.5 text-[12px] text-ink-muted">
                    <Hebrew className="text-base">{lemma}</Hebrew>
                    <span className="text-[10px]">(pool only)</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="font-label text-[9px] uppercase tracking-wide text-ink-muted">
          Suggested mix (weak skills)
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {mixActions.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="text-sm text-sage underline decoration-sage/40 underline-offset-2 hover:decoration-sage"
              >
                {a.label}
              </Link>
              {a.note ? (
                <span className="text-[11px] text-ink-faint"> — {a.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
