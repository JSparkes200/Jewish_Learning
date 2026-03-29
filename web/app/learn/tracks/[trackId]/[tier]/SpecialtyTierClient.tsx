"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { McqDrill } from "@/components/McqDrill";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import {
  SPECIALTY_PASS_PCT,
  getSpecialtyPassMinCorrect,
  getSpecialtyTrackMeta,
  type SpecialtyTierId,
} from "@/data/specialty-tracks";
import { getSpecialtyTierMcqPack } from "@/data/specialty-tier-packs";
import { meetsFoundationExitPassPercent } from "@/lib/foundation-exit-pass";
import {
  getBridgeModulePassed,
  isBridgeUnlocked,
  isSpecialtyTierRecordedPassed,
  isSpecialtyTracksUnlocked,
  recordGradedAnswer,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  setSpecialtyTierPassed,
  specialtyTierUnlockedForAttempt,
  touchDailyStreak,
} from "@/lib/learn-progress";
import { useLearnProgressSync } from "@/lib/use-learn-progress-sync";

type Props = {
  trackId: string;
  tier: SpecialtyTierId;
};

export function SpecialtyTierClient({ trackId, tier }: Props) {
  const [showNikkud, setShowNikkud] = useState(true);
  const [progress, setProgress] = useLearnProgressSync({});
  const [lastAttempt, setLastAttempt] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  const meta = getSpecialtyTrackMeta(trackId);
  const pack = getSpecialtyTierMcqPack(trackId, tier);
  const specialtyUnlocked = isSpecialtyTracksUnlocked(progress);
  const bridgePassed = getBridgeModulePassed(progress);
  const exitComplete = isBridgeUnlocked(progress);
  const tierOpen = specialtyTierUnlockedForAttempt(progress, trackId, tier);
  const alreadyPassed = isSpecialtyTierRecordedPassed(progress, trackId, tier);

  const passPct = SPECIALTY_PASS_PCT[tier];
  const total = pack?.items.length ?? 0;
  const minCorrect = useMemo(
    () => (total > 0 ? getSpecialtyPassMinCorrect(total, tier) : 0),
    [total, tier],
  );

  const onPracticeAnswer = useCallback(
    (correct: boolean, ctx?: { promptHe?: string }) => {
      setProgress((p) => {
        let n = touchDailyStreak(p);
        n = recordGradedAnswer(n, correct);
        n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
        saveLearnProgress(n);
        return n;
      });
    },
    [setProgress],
  );

  const onPackComplete = useCallback(
    (result: { correct: number; total: number }) => {
      setLastAttempt(result);
      if (
        meetsFoundationExitPassPercent(
          result.correct,
          result.total,
          passPct,
        )
      ) {
        setProgress((p) => {
          const next = setSpecialtyTierPassed(p, trackId, tier, true);
          saveLearnProgress(next);
          return next;
        });
      }
    },
    [setProgress, trackId, tier, passPct],
  );

  const tierTitle = tier.charAt(0).toUpperCase() + tier.slice(1);

  if (!meta || !pack) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <p className="text-sm text-rust">This track or tier is not available.</p>
        <Link href="/learn/tracks" className="mt-4 inline-block text-sage underline">
          ← Specialty tracks
        </Link>
      </div>
    );
  }

  if (!specialtyUnlocked) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-rust">
          Locked
        </p>
        {!exitComplete ? (
          <p className="mt-2 text-sm text-ink-muted">
            Pass all three foundation exit strands first.{" "}
            <Link href="/learn/foundation-exit" className="text-sage underline">
              Foundation exit
            </Link>
            .
          </p>
        ) : !bridgePassed ? (
          <p className="mt-2 text-sm text-ink-muted">
            Pass the bridge final checkpoint.{" "}
            <Link href="/learn/bridge" className="text-sage underline">
              Open bridge
            </Link>
            .
          </p>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">
            Specialty tracks are not available yet — check your progress.
          </p>
        )}
      </div>
    );
  }

  if (!tierOpen) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-amber">
          Locked
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Complete the previous tier on this track in order (Bronze → Silver →
          Gold).
        </p>
        <Link href="/learn/tracks" className="mt-4 inline-block text-sage underline">
          ← Back to tracks
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      {alreadyPassed ? (
        <div className="mb-6 rounded-2xl border border-sage/30 bg-sage/10 px-4 py-3">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
            Tier passed
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            You can retake for practice; your pass stays saved.
          </p>
        </div>
      ) : null}
      <header className="mb-6">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          {meta.title}
        </p>
        <h1 className="mt-1 font-hebrew text-2xl text-ink">{pack.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{pack.intro}</p>
        <p className="mt-2 text-xs text-ink-faint">
          Pass: at least {minCorrect} correct out of {total} (
          {total > 0 ? Math.round((minCorrect / total) * 100) : 0}% bar).
        </p>
      </header>

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
                passPct,
              )
              ? `Tier passed — ${lastAttempt.correct}/${lastAttempt.total}.`
              : `Score ${lastAttempt.correct}/${lastAttempt.total}. Need at least ${Math.ceil(passPct * lastAttempt.total - 1e-9)} for ${tierTitle}.`
            : `Need ${minCorrect}/${total}+ to pass ${tierTitle}.`
        }
        onPackComplete={onPackComplete}
      />

      {lastAttempt &&
      !meetsFoundationExitPassPercent(
        lastAttempt.correct,
        lastAttempt.total,
        passPct,
      ) ? (
        <p className="mt-2 text-xs text-rust">
          Last run: {lastAttempt.correct}/{lastAttempt.total} — below the bar.
        </p>
      ) : null}

      <p className="mt-8 text-center text-xs text-ink-faint">
        <Link href="/learn/tracks" className="text-sage underline">
          ← Specialty tracks
        </Link>
      </p>
    </div>
  );
}
