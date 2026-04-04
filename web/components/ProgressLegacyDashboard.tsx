"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  DASHBOARD_GAME_IDS,
  FLUENCY_TARGET_WORDS,
  countWordsMasteredForFluency,
  dashboardGameShortLabel,
  fluencyBarPercent,
  fluencyTierLabel,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { LIBRARY_SAVED_EVENT, loadLibrarySaved } from "@/lib/library-saved";
import { speakHebrew } from "@/lib/speech-hebrew";
import { buildStudyReviewQueue } from "@/lib/study-review-queue";

/**
 * Mirrors `rDash()` in `hebrew-v8.2.html`: fluency bar, tri-stats, per-game
 * accuracy, weak / strong lemmas, library snapshot (no Rabbi assets).
 */
export function ProgressLegacyDashboard({
  progress,
}: {
  progress: LearnProgressState;
}) {
  const [libraryPassages, setLibraryPassages] = useState(() =>
    loadLibrarySaved(),
  );

  useEffect(() => {
    const onLib = () => setLibraryPassages(loadLibrarySaved());
    window.addEventListener(LIBRARY_SAVED_EVENT, onLib);
    return () => window.removeEventListener(LIBRARY_SAVED_EVENT, onLib);
  }, []);

  const fluencyPct = fluencyBarPercent(progress.vocabLevels);
  const fluencyLabel = fluencyTierLabel(fluencyPct);
  const masteredLv3 = countWordsMasteredForFluency(progress.vocabLevels);
  const lessonTotal = progress.lessonAnswerTotal ?? 0;

  const reviewCount = useMemo(() => {
    const q = buildStudyReviewQueue(progress.activeLevel, progress);
    return q.belowGate.length + q.unseen.length;
  }, [progress]);

  const weakLemmas = useMemo(() => {
    const vl = progress.vocabLevels ?? {};
    return Object.entries(vl)
      .filter(([h]) => h.trim() && /[\u0590-\u05FF]/.test(h))
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5);
  }, [progress.vocabLevels]);

  const topLemmas = useMemo(() => {
    const vl = progress.vocabLevels ?? {};
    return Object.entries(vl)
      .filter(([h]) => h.trim() && /[\u0590-\u05FF]/.test(h))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [progress.vocabLevels]);

  const gameStats = progress.studyGameStats ?? {};

  return (
    <div className="space-y-4">
      <div>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Learning snapshot
        </p>
        <p className="mt-1 font-hebrew text-xl text-ink sm:text-2xl">
          הַתְּקָדְמוּת שֶׁלִּי
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Same ideas as the legacy HTML dashboard: fluency target, graded-answer
          totals, study modes, and library — computed from this device.
        </p>
      </div>

      <div className="rounded-2xl border border-ink/10 border-t-amber/25 bg-parchment-card/50 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Fluency path
          </p>
          <span className="font-label text-[10px] text-amber">{fluencyLabel}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-parchment-deep/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage/90 via-amber/80 to-rust/70 transition-all"
            style={{ width: `${fluencyPct}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-1 text-[11px] text-ink-muted">
          <span>
            <strong className="tabular-nums text-ink">{masteredLv3}</strong>{" "}
            words at lv ≥ 3
          </span>
          <span className="text-ink-faint">
            {FLUENCY_TARGET_WORDS.toLocaleString()} for fluency (legacy bar)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0 overflow-hidden rounded-2xl border border-ink/10 bg-parchment-deep/20">
        {(
          [
            ["Total", lessonTotal, "text-amber"],
            ["Mastered", masteredLv3, "text-sage"],
            ["In queue", reviewCount, "text-rust"],
          ] as const
        ).map(([label, val, col], i) => (
          <div
            key={label}
            className={`px-2 py-3 text-center ${i < 2 ? "border-r border-ink/10" : ""}`}
          >
            <div
              className={`font-label text-xl font-bold tabular-nums ${col}`}
            >
              {val}
            </div>
            <div className="mt-1 font-label text-[8px] uppercase tracking-[0.15em] text-ink-muted">
              {label}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-ink-faint">
        Total = graded drill answers (first pick per question). “In queue” ≈
        review suggestions on your active level.
      </p>

      <div className="rounded-2xl border border-ink/10 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Game accuracy
        </p>
        <ul className="mt-3 space-y-2">
          {DASHBOARD_GAME_IDS.map((id) => {
            const st = gameStats[id];
            const tot = st ? st.correct + st.wrong : 0;
            const pct = tot > 0 ? Math.round((st!.correct / tot) * 100) : null;
            const fillW = pct ?? 0;
            const bar =
              pct == null
                ? "bg-parchment-deep/60"
                : pct < 60
                  ? "bg-rust"
                  : pct < 80
                    ? "bg-amber"
                    : "bg-sage";
            return (
              <li key={id} className="flex items-center gap-2">
                <span className="w-12 shrink-0 font-label text-[9px] uppercase tracking-wide text-ink-muted">
                  {dashboardGameShortLabel(id)}
                </span>
                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-parchment-deep/80">
                  <div
                    className={`h-full rounded-full transition-all ${bar}`}
                    style={{ width: `${fillW}%` }}
                  />
                </div>
                <span
                  className={`w-9 shrink-0 text-right font-label text-[10px] tabular-nums ${
                    pct == null
                      ? "text-ink-faint"
                      : pct < 60
                        ? "text-rust"
                        : pct < 80
                          ? "text-amber"
                          : "text-sage"
                  }`}
                >
                  {pct != null ? `${pct}%` : "—"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {weakLemmas.length > 0 ? (
        <div className="rounded-2xl border border-rust/25 bg-rust/[0.06] p-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-rust">
            Needs work ({weakLemmas.length})
          </p>
          <ul className="mt-3 space-y-2">
            {weakLemmas.map(([w, lv]) => (
              <li key={w} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => speakHebrew(w)}
                  className="min-w-0 flex-1 text-right"
                >
                  <Hebrew className="text-lg text-rust">{w}</Hebrew>
                  <span className="ml-2 text-xs text-ink-faint" aria-hidden>
                    🔊
                  </span>
                </button>
                <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-parchment-deep/80">
                  <div
                    className="h-full rounded-full bg-rust/80"
                    style={{ width: `${Math.min(100, lv * 20)}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-label text-[10px] text-rust">
                  lv {lv}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/study#study-review-queue"
            className="btn-elevated-rust mt-4 inline-flex w-full items-center justify-center font-label text-[10px] uppercase tracking-wide no-underline"
          >
            Study now →
          </Link>
        </div>
      ) : null}

      {topLemmas.length > 0 ? (
        <div className="rounded-2xl border border-ink/10 bg-parchment-card/50 p-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Top tracked words
          </p>
          <ul className="mt-3 space-y-2">
            {topLemmas.map(([w, lv]) => (
              <li key={w} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => speakHebrew(w)}
                  className="min-w-0 flex-1 text-right"
                >
                  <span className="text-xs text-ink-faint" aria-hidden>
                    🔊
                  </span>
                  <Hebrew className="ml-2 text-lg text-ink">{w}</Hebrew>
                </button>
                <div className="h-2 w-28 shrink-0 overflow-hidden rounded-full bg-parchment-deep/80">
                  <div
                    className={`h-full rounded-full ${
                      lv < 2
                        ? "bg-rust/75"
                        : lv < 4
                          ? "bg-amber/80"
                          : "bg-sage/80"
                    }`}
                    style={{ width: `${Math.min(100, lv * 20)}%` }}
                  />
                </div>
                <span className="font-label text-[9px] text-ink-muted">
                  Lv{lv}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-ink/10 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Library stats
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          <strong className="text-ink">{libraryPassages.length}</strong> passages
          in My Library
        </p>
        {libraryPassages.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {libraryPassages.slice(0, 10).map((p) => (
              <span
                key={p.id}
                className="rounded-full border border-sage/35 bg-sage/10 px-2.5 py-1 font-label text-[8px] uppercase tracking-wide text-sage"
              >
                {p.title}
              </span>
            ))}
          </div>
        ) : null}
        <Link
          href="/library"
          className="mt-3 inline-block text-[10px] text-sage underline"
        >
          Open library →
        </Link>
      </div>
    </div>
  );
}
