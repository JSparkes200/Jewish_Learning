"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COURSE_LEVELS,
  courseLevelProgressLabel,
  getSectionsForLevel,
  type SectionMeta,
} from "@/data/course";
import {
  getLevelStoryShortcutInsertAfterIndex,
  getStoryForLevel,
  shouldShowLevelStoryShortcut,
} from "@/data/course-stories";
import {
  LEARN_PROGRESS_EVENT,
  completionRatio,
  createEmptyLearnProgressState,
  loadLearnProgress,
  sectionUnlocked,
  type LearnProgressState,
} from "@/lib/learn-progress";

function sectionTypePrefix(sec: SectionMeta): string {
  switch (sec.type) {
    case "read":
      return "📖 ";
    case "numbers":
      return "🔢 ";
    case "roots":
      return "שׁ ";
    case "comprehension":
      return "📚 ";
    default:
      return "";
  }
}

export function LearnLevelClient({ level }: { level: number }) {
  const meta = COURSE_LEVELS.find((l) => l.n === level);
  const sections = useMemo(() => getSectionsForLevel(level), [level]);
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );

  const refresh = useCallback(() => {
    setProgress(loadLearnProgress());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(LEARN_PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, refresh);
  }, [refresh]);

  const { done, total, pct } = completionRatio(
    sections,
    progress.completedSections,
  );

  const storyShortcut =
    getStoryForLevel(level) && shouldShowLevelStoryShortcut(level, progress.completedSections)
      ? {
          insertAfter: getLevelStoryShortcutInsertAfterIndex(level, sections),
        }
      : null;

  if (!meta) return null;

  return (
    <div>
      <nav className="mb-6">
        <Link
          href="/learn"
          className="font-label text-[10px] uppercase tracking-[0.2em] text-sage hover:underline"
        >
          ← Learn
        </Link>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg text-white shadow"
            style={{
              background: `linear-gradient(145deg, ${meta.hex}, ${meta.hex}cc)`,
            }}
          >
            {meta.icon}
          </span>
          <div>
            <h1 className="font-label text-xs uppercase tracking-wide text-ink">
              {meta.label}
            </h1>
            <p className="text-[11px] text-ink-muted">{meta.desc}</p>
            <p className="text-[10px] text-ink-faint">
              {courseLevelProgressLabel(level)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-parchment-deep/80">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${meta.hex}, ${meta.hex}99)`,
              }}
            />
          </div>
          <span className="font-label text-[10px] text-ink-faint">
            {done}/{total}
          </span>
        </div>
      </header>

      <ul className="space-y-2">
        {sections.flatMap((sec, idx) => {
          const u = sectionUnlocked(
            level,
            sections,
            sec.id,
            progress.completedSections,
            progress.vocabLevels,
          );
          const d = !!progress.completedSections[sec.id];
          const row = (
            <li key={sec.id}>
              {u ? (
                <Link
                  href={`/learn/${level}/${encodeURIComponent(sec.id)}`}
                  className="flex items-center justify-between rounded-xl border border-ink/10 bg-parchment-card/70 px-4 py-3 text-sm text-ink transition hover:border-sage/40 hover:bg-parchment-card"
                >
                  <span>
                    {d ? "✓ " : "○ "}
                    {sectionTypePrefix(sec)}
                    {sec.label}
                  </span>
                  <span className="text-ink-faint">→</span>
                </Link>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-ink/5 bg-parchment/40 px-4 py-3 text-sm text-ink-faint">
                  <span>
                    🔒 {sectionTypePrefix(sec)}
                    {sec.label}
                  </span>
                </div>
              )}
            </li>
          );
          if (
            storyShortcut?.insertAfter != null &&
            idx === storyShortcut.insertAfter
          ) {
            return [
              row,
              <li key={`${level}-level-story`}>
                <Link
                  href={`/learn/${level}/story`}
                  className="flex items-center justify-between rounded-xl border border-amber/30 bg-amber/5 px-4 py-3 text-sm text-ink transition hover:border-amber/50 hover:bg-amber/10"
                >
                  <span>
                    📖 Level reading passage + mini-quiz (after your first lessons
                    here)
                  </span>
                  <span className="text-ink-faint">→</span>
                </Link>
              </li>,
            ];
          }
          return [row];
        })}
      </ul>
    </div>
  );
}
