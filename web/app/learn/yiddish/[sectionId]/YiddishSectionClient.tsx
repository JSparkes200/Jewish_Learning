"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { McqDrill } from "@/components/McqDrill";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import { getYiddishSectionMeta } from "@/data/yiddish-course";
import { getYiddishDrillPack } from "@/data/yiddish-drills";
import { meetsFoundationExitPassPercent } from "@/lib/foundation-exit-pass";
import {
  loadLearnProgress,
  recordGradedAnswer,
  saveLearnProgress,
  touchDailyStreak,
} from "@/lib/learn-progress";
import {
  YIDDISH_SECTION_PASS_PCT,
  saveYiddishProgress,
  setYiddishSectionCompleted,
  yiddishSectionUnlocked,
} from "@/lib/yiddish-progress";
import { useYiddishProgressSync } from "@/lib/use-yiddish-progress-sync";

type Props = { sectionId: string };

export function YiddishSectionClient({ sectionId }: Props) {
  const [showNikkud, setShowNikkud] = useState(true);
  const [yiddish, setYiddish] = useYiddishProgressSync();
  const [lastAttempt, setLastAttempt] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  const meta = getYiddishSectionMeta(sectionId);
  const pack = getYiddishDrillPack(sectionId);
  const unlocked = yiddishSectionUnlocked(yiddish, sectionId);
  const passedSection = yiddish.completedSections[sectionId] === true;

  const onPracticeAnswer = useCallback((correct: boolean) => {
    const p = loadLearnProgress();
    let n = touchDailyStreak(p);
    n = recordGradedAnswer(n, correct);
    saveLearnProgress(n);
  }, []);

  const onPackComplete = useCallback(
    (result: { correct: number; total: number }) => {
      setLastAttempt(result);
      if (
        meetsFoundationExitPassPercent(
          result.correct,
          result.total,
          YIDDISH_SECTION_PASS_PCT,
        )
      ) {
        setYiddish((prev) => {
          const next = setYiddishSectionCompleted(prev, sectionId, true);
          saveYiddishProgress(next);
          return next;
        });
      }
    },
    [setYiddish, sectionId],
  );

  if (!meta || !pack) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <p className="text-sm text-rust">Section not found.</p>
        <Link href="/learn/yiddish" className="mt-4 inline-block text-sage underline">
          ← Yiddish course
        </Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-rust">
          Locked
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Complete the previous section on the list first.
        </p>
        <Link href="/learn/yiddish" className="mt-4 inline-block text-sage underline">
          ← Yiddish course
        </Link>
      </div>
    );
  }

  const passPctLabel = Math.round(YIDDISH_SECTION_PASS_PCT * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      <header className="mb-6">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          ייִדיש · {meta.label}
        </p>
        <h1 className="mt-1 font-hebrew text-2xl text-ink">{pack.title}</h1>
        {pack.intro ? (
          <p className="mt-2 text-sm text-ink-muted">{pack.intro}</p>
        ) : null}
        <p className="mt-2 text-xs text-ink-faint">
          Mark complete: at least {passPctLabel}% correct on this run (
          {Math.ceil(YIDDISH_SECTION_PASS_PCT * pack.items.length - 1e-9)}/
          {pack.items.length}+).
        </p>
      </header>

      {passedSection ? (
        <div className="mb-6 rounded-2xl border border-sage/30 bg-sage/10 px-4 py-3">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
            Section passed
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            You can practice again; completion stays saved.
          </p>
        </div>
      ) : null}

      <div className="mb-4 flex justify-end">
        <NikkudExerciseToggle
          showNikkud={showNikkud}
          onToggle={() => setShowNikkud((v) => !v)}
        />
      </div>

      <McqDrill
        pack={pack}
        defaultShowNikkud={showNikkud}
        onPracticeAnswer={onPracticeAnswer}
        endHint={
          lastAttempt
            ? meetsFoundationExitPassPercent(
                lastAttempt.correct,
                lastAttempt.total,
                YIDDISH_SECTION_PASS_PCT,
              )
              ? `Marked complete — ${lastAttempt.correct}/${lastAttempt.total}.`
              : `Score ${lastAttempt.correct}/${lastAttempt.total}. Need ${passPctLabel}%+ to mark this section.`
            : `Reach ${passPctLabel}%+ to mark this section complete.`
        }
        onPackComplete={onPackComplete}
      />

      <p className="mt-8 flex flex-wrap gap-4 text-xs text-ink-faint">
        <Link href="/learn/yiddish" className="text-sage underline">
          ← Yiddish course
        </Link>
        <Link href="/learn" className="text-sage underline">
          Learn home
        </Link>
      </p>
    </div>
  );
}
