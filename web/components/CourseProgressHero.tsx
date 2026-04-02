"use client";

import Link from "next/link";
import { ProgressRing } from "@/components/ProgressRing";

/**
 * Dashboard-style summary: compact stacked stats (sections, streak) beside a
 * larger course ring centered in the remaining width; practice + continue below.
 */
export function CourseProgressHero({
  sectionsDone,
  sectionsTotal,
  streakCurrent,
  mcqAttempts,
  mcqCorrect,
  continueHref = "/learn",
  continueLabel = "Continue learning",
  heading = "Course snapshot",
  intro = "Sections marked complete and your current streak. Tap through Learn or Study to move the ring.",
}: {
  sectionsDone: number;
  sectionsTotal: number;
  streakCurrent: number;
  mcqAttempts: number;
  mcqCorrect: number;
  continueHref?: string;
  continueLabel?: string;
  heading?: string;
  intro?: string;
}) {
  const coursePct =
    sectionsTotal > 0
      ? Math.round((sectionsDone / sectionsTotal) * 100)
      : 0;
  const practicePct =
    mcqAttempts > 0 ? Math.round((mcqCorrect / mcqAttempts) * 100) : null;

  return (
    <div className="surface-elevated flex flex-col gap-5 p-5">
      <div>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          {heading}
        </p>
        <p className="mt-1 text-sm text-ink-muted">{intro}</p>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex w-[50.6%] max-w-[12.65rem] shrink-0 flex-col gap-4">
          <div className="rounded-xl border border-white/50 bg-parchment-deep/35 px-3 py-2 shadow-insetSoft">
            <div className="flex items-center justify-between gap-2">
              <p className="font-label text-[8px] uppercase tracking-wide text-ink-faint">
                Sections
              </p>
              <p className="text-sm font-semibold tabular-nums text-ink">
                {sectionsDone}
                <span className="text-xs font-normal text-ink-muted">
                  {" "}
                  / {sectionsTotal}
                </span>
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-white/50 bg-parchment-deep/35 px-3 py-2 shadow-insetSoft">
            <div className="flex items-center justify-between gap-2">
              <p className="font-label text-[8px] uppercase tracking-wide text-ink-faint">
                Streak
              </p>
              <p className="text-sm font-semibold tabular-nums text-ink">
                {streakCurrent}
                <span className="text-xs font-normal text-ink-muted">
                  {" "}
                  day{streakCurrent === 1 ? "" : "s"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2">
          <ProgressRing
            percent={coursePct}
            label={`${coursePct}%`}
            size={134}
            stroke={12}
            tone="sage"
          />
          <p className="max-w-[10rem] text-center text-[9px] leading-snug text-ink-faint">
            Alef–Dalet completion
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/50 bg-parchment-deep/35 px-3 py-2 shadow-insetSoft">
        <p className="font-label text-[8px] uppercase tracking-wide text-ink-faint">
          Practice accuracy
        </p>
        <p className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
          {practicePct != null ? (
            <>
              {practicePct}%
              <span className="text-xs font-normal text-ink-muted">
                {" "}
                · {mcqCorrect}/{mcqAttempts} picks
              </span>
            </>
          ) : (
            <span className="text-xs font-normal text-ink-muted">
              Answer a drill to start
            </span>
          )}
        </p>
      </div>

      <Link
        href={continueHref}
        className="btn-elevated-primary inline-flex w-fit items-center justify-center no-underline"
      >
        {continueLabel}
      </Link>
    </div>
  );
}
