"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COURSE_LEVELS,
  FOUNDATION_TRACK_INTRO,
  courseLevelProgressLabel,
  getSectionsForLevel,
} from "@/data/course";
import {
  DEVELOPER_MODE_EVENT,
  getDeveloperModeBypass,
} from "@/lib/developer-mode";
import {
  LEARN_PROGRESS_EVENT,
  completionRatio,
  countCourseListMastery,
  createEmptyLearnProgressState,
  isFoundationCourseComplete,
  loadLearnProgress,
  resolveAlphabetGateStatus,
  saveLearnProgress,
  setAlphabetGate,
  type LearnProgressState,
} from "@/lib/learn-progress";

function LevelRow({
  level,
  expanded,
  onToggle,
  progress,
  developerMode,
}: {
  level: (typeof COURSE_LEVELS)[0];
  expanded: boolean;
  onToggle: () => void;
  progress: LearnProgressState;
  developerMode: boolean;
}) {
  const sections = useMemo(() => getSectionsForLevel(level.n), [level.n]);
  const { done, total, pct } = completionRatio(
    sections,
    progress.completedSections,
  );
  const wordMastery = useMemo(
    () => countCourseListMastery(level.n, progress.vocabLevels),
    [level.n, progress.vocabLevels],
  );
  const unlocked = developerMode || level.n <= progress.activeLevel;
  const doneLevel = !developerMode && level.n < progress.activeLevel;

  return (
    <div className="border-b border-ink/10 pb-4 last:border-0">
      <button
        type="button"
        onClick={() => unlocked && onToggle()}
        className={`flex w-full items-start gap-3 text-left ${
          unlocked ? "" : "cursor-not-allowed opacity-50"
        }`}
      >
        <div
          className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl text-white shadow-md"
          style={{
            background: `linear-gradient(145deg, ${level.hex}, ${level.hex}cc)`,
          }}
        >
          <span
            className="absolute inset-0 rounded-full border-2 border-white/25"
            style={{
              background: `conic-gradient(from 0deg, rgba(255,255,255,.35) ${pct}%, transparent ${pct}%)`,
            }}
            aria-hidden
          />
          <span className="relative z-[1]">{level.icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label text-xs uppercase tracking-wide text-ink">
              {level.label}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 font-label text-[9px] uppercase tracking-wide ${
                doneLevel
                  ? "bg-sage/20 text-sage"
                  : unlocked
                    ? level.n === progress.activeLevel
                      ? "bg-amber/20 text-amber"
                      : "bg-ink/10 text-ink-muted"
                    : "bg-ink/5 text-ink-faint"
              }`}
            >
              {doneLevel ? "Done" : unlocked ? (level.n === progress.activeLevel ? "Now" : "Open") : "Locked"}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-ink-muted">
            {level.desc}
          </p>
          <p className="mt-0.5 text-[10px] leading-snug text-ink-faint">
            {courseLevelProgressLabel(level.n)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-parchment-deep/80">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${level.hex}, ${level.hex}99)`,
                }}
              />
            </div>
            <span className="shrink-0 font-label text-[10px] text-ink-faint">
              {done}/{total}
            </span>
          </div>
          {wordMastery.total > 0 ? (
            <p className="mt-1.5 text-[10px] text-ink-faint">
              Course prompts at lv≥2:{" "}
              <span className="tabular-nums text-ink-muted">
                {wordMastery.mastered}/{wordMastery.total}
              </span>{" "}
              (MCQ + legacy import)
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-lg text-amber" aria-hidden>
          {expanded ? "▾" : "→"}
        </span>
      </button>

      {unlocked && expanded && (
        <div className="ml-[4.5rem] mt-3 rounded-xl border border-ink/10 bg-parchment-card/60 p-3">
          <p className="mb-2 font-label text-[9px] uppercase tracking-[0.2em] text-ink-muted">
            Subsections
          </p>
          <Link
            href={`/learn/${level.n}`}
            className="mb-3 inline-block rounded-lg bg-sage px-3 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            Open level {level.n} →
          </Link>
          <ul className="space-y-1 text-[11px] text-ink-muted">
            {sections.slice(0, 8).map((s) => (
              <li key={s.id}>
                <span className="text-ink-faint">○</span> {s.label}
              </li>
            ))}
            {sections.length > 8 ? (
              <li className="text-ink-faint">… +{sections.length - 8} more</li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
}

export function LearnPageClient() {
  const [expanded, setExpanded] = useState<number | null>(1);
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );
  const [developerMode, setDeveloperMode] = useState(false);

  useEffect(() => {
    const sync = () => setProgress(loadLearnProgress());
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, []);

  useEffect(() => {
    const sync = () => setDeveloperMode(getDeveloperModeBypass());
    sync();
    window.addEventListener(DEVELOPER_MODE_EVENT, sync);
    return () => window.removeEventListener(DEVELOPER_MODE_EVENT, sync);
  }, []);

  const persist = useCallback((next: LearnProgressState) => {
    setProgress(next);
    saveLearnProgress(next);
  }, []);

  const toggleLevel = useCallback((n: number) => {
    setExpanded((e) => (e === n ? null : n));
  }, []);

  const activeSections = useMemo(
    () => getSectionsForLevel(progress.activeLevel),
    [progress.activeLevel],
  );
  const activeProgress = useMemo(
    () => completionRatio(activeSections, progress.completedSections),
    [activeSections, progress.completedSections],
  );
  const activeLevelComplete =
    activeSections.length > 0 && activeProgress.pct === 100;
  const allLevelsComplete = useMemo(
    () => isFoundationCourseComplete(progress),
    [progress],
  );

  const alphabetEffective = useMemo(
    () => resolveAlphabetGateStatus(progress),
    [progress],
  );
  const showAlphabetBanner =
    alphabetEffective === "unseen" || alphabetEffective === "in_progress";

  const dismissAlphabetBanner = useCallback(() => {
    const cur = loadLearnProgress();
    persist(setAlphabetGate(cur, "skipped"));
  }, [persist]);

  return (
    <div>
      <header className="mb-8">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Learn
        </p>
        <h1 className="font-hebrew text-2xl text-ink">מַסְלוּל הַלִּמּוּד</h1>
        <p className="mt-1 text-sm text-ink-muted">{FOUNDATION_TRACK_INTRO}</p>
        <p className="mt-2 text-xs text-ink-faint">
          Progress is saved in this browser (Next app). The legacy HTML app uses
          separate storage until we unify accounts.
        </p>
      </header>

      {showAlphabetBanner ? (
        <div className="mb-6 rounded-2xl border border-amber/35 bg-amber/10 px-4 py-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-amber">
            Alphabet (optional)
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            New to the Hebrew letters? The alphabet track is optional — the main
            course starts at Alef. Open it when you want, or dismiss if you
            already read Hebrew.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/learn/alphabet"
              className="inline-block rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Alphabet track
            </Link>
            <button
              type="button"
              onClick={dismissAlphabetBanner}
              className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            >
              I read Hebrew — dismiss
            </button>
          </div>
        </div>
      ) : null}

      {allLevelsComplete ? (
        <div className="mb-6 rounded-2xl border border-sage/35 bg-sage/10 px-4 py-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
            Milestone
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            You&apos;ve marked every foundation subsection complete (Alef–Dalet).
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Next: foundation exit exams (three strands), then the bridge, then
            specialty badges. Revisit drills anytime; Progress shows your snapshot.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/learn/foundation-exit"
              className="inline-block rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Foundation exit →
            </Link>
            <Link
              href="/progress"
              className="inline-block rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            >
              Progress →
            </Link>
          </div>
        </div>
      ) : activeLevelComplete && progress.activeLevel < 4 ? (
        <div className="mb-6 rounded-2xl border border-amber/35 bg-amber/10 px-4 py-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-amber">
            Level {progress.activeLevel} complete
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Advance <strong className="text-ink">active level</strong> so Next
            up and badges match your next track, or jump straight into the next
            level.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                persist({
                  ...progress,
                  activeLevel: progress.activeLevel + 1,
                })
              }
              className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Active → level {progress.activeLevel + 1}
            </button>
            <Link
              href={`/learn/${progress.activeLevel + 1}`}
              className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
            >
              Open level {progress.activeLevel + 1} menu
            </Link>
          </div>
        </div>
      ) : null}

      <section className="mb-10 rounded-2xl border border-ink/10 bg-parchment-card/40 p-4 shadow-sm">
        <h2 className="mb-4 font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Your journey
        </h2>
        <div className="flex flex-col gap-4">
          {COURSE_LEVELS.map((level) => (
            <LevelRow
              key={level.n}
              level={level}
              expanded={expanded === level.n}
              onToggle={() => toggleLevel(level.n)}
              progress={progress}
              developerMode={developerMode}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ink/10 border-t-sage/25 bg-parchment-card/25 p-4 pt-6">
        <h2 className="mb-2 font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Before &amp; after Alef–Dalet
        </h2>
        <p className="mb-4 text-sm text-ink-muted">
          Zero Hebrew? Start with the alphabet track (optional). After the
          foundation exit exams, the bridge opens specialty badges (bridge stays
          locked until all three exit strands pass).
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <Link
            href="/learn/alphabet"
            className="flex flex-col gap-2 rounded-xl border border-ink/10 bg-parchment-card/70 p-4 transition hover:border-sage/30 hover:bg-parchment-deep/20"
          >
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Pre-foundation
            </span>
            <span className="text-lg" aria-hidden>
              א
            </span>
            <span className="font-label text-[9px] uppercase tracking-wide text-ink">
              Alphabet
            </span>
            <span className="font-label text-[9px] text-sage">Open →</span>
          </Link>
          <Link
            href="/learn/foundation-exit"
            className={`flex flex-col gap-2 rounded-xl border border-ink/10 bg-parchment-card/70 p-4 transition hover:border-sage/30 hover:bg-parchment-deep/20 ${
              allLevelsComplete ? "" : "opacity-70"
            }`}
          >
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              End of Alef–Dalet
            </span>
            <span className="text-lg" aria-hidden>
              ✓
            </span>
            <span className="font-label text-[9px] uppercase tracking-wide text-ink">
              Foundation exit
            </span>
            <span
              className={`font-label text-[9px] ${
                allLevelsComplete ? "text-sage" : "text-ink-muted"
              }`}
            >
              {allLevelsComplete ? "Open →" : "Locked until foundation done →"}
            </span>
          </Link>
          <Link
            href="/learn/bridge"
            className="flex flex-col gap-2 rounded-xl border border-ink/10 bg-parchment-card/70 p-4 transition hover:border-sage/30 hover:bg-parchment-deep/20"
          >
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Post-foundation
            </span>
            <span className="text-lg" aria-hidden>
              🌉
            </span>
            <span className="font-label text-[9px] uppercase tracking-wide text-ink">
              Bridge
            </span>
            <span className="font-label text-[9px] text-sage">Open →</span>
          </Link>
        </div>
        <div className="mt-4 rounded-xl border border-sage/20 bg-parchment-card/50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                After the bridge
              </span>
              <p className="mt-1 text-sm text-ink-muted">
                Specialty tracks — modern (news, literature, spoken) and
                traditional (Talmudic / Aramaic): Bronze → Silver → Gold — 8 / 15
                / 25 MCQs with stricter bars each tier.
              </p>
              <p className="mt-2 text-xs text-ink-faint">
                <Link href="/learn/fluency" className="text-sage underline">
                  Fluency path overview
                </Link>
              </p>
            </div>
            <Link
              href="/learn/tracks"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-sage/90 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            >
              Specialty tracks →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink/10 border-t-amber/30 bg-parchment-card/30 p-4 pt-6">
        <h2 className="mb-2 font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Also in Learn
        </h2>
        <p className="mb-4 text-sm text-ink-muted">
          Jump to Aleph reading &amp; numbers, roots, or the Yiddish mini-course
          (separate saves); the main menu also links Reading and Roots.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              href: "/learn/1/1-read",
              label: "Reading",
              emoji: "📖",
              col: "#c87020",
            },
            {
              href: "/learn/1/1-nums",
              label: "Numbers",
              emoji: "🔢",
              col: "#8B3A1A",
            },
            {
              href: "/roots",
              label: "Roots",
              emoji: "שׁ",
              col: "#6a1828",
            },
            {
              href: "/learn/yiddish",
              label: "Yiddish",
              emoji: "ײַ",
              col: "#3d4f6f",
            },
          ].map((x) => (
            <Link
              key={x.label}
              href={x.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-transparent p-2 transition hover:border-ink/10 hover:bg-parchment-deep/30"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-xl text-white shadow-inner"
                style={{ background: x.col }}
              >
                {x.emoji}
              </span>
              <span className="font-label text-[9px] uppercase tracking-wide text-ink-muted">
                {x.label}
              </span>
              <span className="font-label text-[9px] text-sage">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-[11px] text-ink-muted">
        <span>Active level (unlock next):</span>
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => persist({ ...progress, activeLevel: n })}
            className={`rounded-lg border px-2 py-1 font-label text-[10px] uppercase tracking-wide ${
              progress.activeLevel === n
                ? "border-sage bg-sage/15 text-sage"
                : "border-ink/15 hover:bg-parchment-deep/40"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
