"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CorrectSentenceDrill } from "@/components/CorrectSentenceDrill";
import { DrillPrepGate } from "@/components/DrillPrepGate";
import { HebrewTapText } from "@/components/HebrewTapText";
import { McqDrill } from "@/components/McqDrill";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import { BRIDGE_UNITS } from "@/data/bridge-course";
import { BRIDGE_FINAL_EXAM_PACK } from "@/data/bridge-drills";
import {
  BRIDGE_PASS_TARGET_PCT,
  BRIDGE_TRACK_BLURB,
  BRIDGE_TRACK_TITLE,
} from "@/data/course-post-foundation";
import type { GradedPracticeContext } from "@/lib/learn-progress";
import { meetsFoundationExitPassPercent } from "@/lib/foundation-exit-pass";
import { stripNikkud } from "@/lib/hebrew-nikkud";
import {
  DEVELOPER_MODE_EVENT,
  getDeveloperModeBypass,
} from "@/lib/developer-mode";
import {
  areAllBridgeUnitsComplete,
  effectiveBridgeUnitsCompleted,
  getBridgeModulePassed,
  isBridgeFinalExamUnlocked,
  isBridgeUnlocked,
  recordGradedAnswer,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  setBridgeModulePassed,
  setBridgeUnitCompleted,
  touchDailyStreak,
} from "@/lib/learn-progress";
import { useLearnProgressSync } from "@/lib/use-learn-progress-sync";
import { buildCorrectSentencePackFromMcq } from "@/lib/sentence-correctness";
import { buildPrepCardsFromMcqPack } from "@/lib/drill-prep";

function bridgeUnitUnlocked(
  state: Parameters<typeof effectiveBridgeUnitsCompleted>[0],
  index: number,
  devBypass: boolean,
): boolean {
  if (devBypass) return true;
  if (index === 0) return true;
  const e = effectiveBridgeUnitsCompleted(state);
  const prevId = BRIDGE_UNITS[index - 1]?.id;
  return prevId ? !!e[prevId] : true;
}

export function BridgePageClient() {
  const [showNikkud, setShowNikkud] = useState(false);
  const [progress, setProgress] = useLearnProgressSync({});
  const [lastBridgeAttempt, setLastBridgeAttempt] = useState<{
    correct: number;
    total: number;
  } | null>(null);
  const [devBypass, setDevBypass] = useState(false);

  useEffect(() => {
    const sync = () => setDevBypass(getDeveloperModeBypass());
    sync();
    window.addEventListener(DEVELOPER_MODE_EVENT, sync);
    return () => window.removeEventListener(DEVELOPER_MODE_EVENT, sync);
  }, []);

  const unlocked = isBridgeUnlocked(progress);
  const bridgePassed = getBridgeModulePassed(progress);
  const unitsDone = effectiveBridgeUnitsCompleted(progress);
  const finalUnlocked = isBridgeFinalExamUnlocked(progress);
  const allUnitsDone = areAllBridgeUnitsComplete(progress);

  const bridgePctLabel = Math.round(BRIDGE_PASS_TARGET_PCT * 100);

  const onPracticeAnswer = useCallback(
    (correct: boolean, ctx?: GradedPracticeContext) => {
      setProgress((p) => {
        let n = touchDailyStreak(p);
        n = recordGradedAnswer(n, correct, ctx);
        n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
        saveLearnProgress(n);
        return n;
      });
    },
    [setProgress],
  );

  const onBridgePackComplete = useCallback(
    (result: { correct: number; total: number }) => {
      setLastBridgeAttempt(result);
      if (
        meetsFoundationExitPassPercent(
          result.correct,
          result.total,
          BRIDGE_PASS_TARGET_PCT,
        )
      ) {
        setProgress((p) => {
          const next = setBridgeModulePassed(p, true);
          saveLearnProgress(next);
          return next;
        });
      }
    },
    [setProgress],
  );

  const clearBridgePass = useCallback(() => {
    setProgress((p) => {
      const next = setBridgeModulePassed(p, false);
      saveLearnProgress(next);
      return next;
    });
    setLastBridgeAttempt(null);
  }, [setProgress]);

  const markUnitComplete = useCallback(
    (unitId: string) => {
      setProgress((p) => {
        const next = setBridgeUnitCompleted(p, unitId, true);
        saveLearnProgress(next);
        return next;
      });
    },
    [setProgress],
  );

  const unitsCompleteCount = useMemo(
    () => BRIDGE_UNITS.filter((u) => unitsDone[u.id]).length,
    [unitsDone],
  );

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
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Post-foundation
        </p>
        <h1 className="font-hebrew text-2xl text-ink">{BRIDGE_TRACK_TITLE}</h1>
        <p className="mt-2 text-sm text-ink-muted">{BRIDGE_TRACK_BLURB}</p>
      </header>

      {!unlocked ? (
        <div className="mb-6 rounded-2xl border border-rust/30 bg-rust/5 p-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-rust">
            Locked
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Pass all three foundation exit strands (reading, grammar, lexicon) on{" "}
            <Link
              href="/learn/foundation-exit"
              className="font-medium text-sage underline"
            >
              Foundation exit
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-2xl border border-sage/25 bg-sage/5 p-4">
            <p className="text-sm text-ink-muted">
              <strong className="text-ink">Flow:</strong> four short study units
              (read + practice), then a {bridgePctLabel}% final checkpoint. Your
              place is saved in this browser.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-amber/30 bg-amber/5 p-4">
            <p className="font-label text-[10px] uppercase tracking-[0.18em] text-amber">
              Progress
            </p>
            <p className="mt-2 text-sm text-ink">
              Study units:{" "}
              <strong className="text-ink">
                {unitsCompleteCount}/{BRIDGE_UNITS.length}
              </strong>
              {bridgePassed ? (
                <>
                  {" "}
                  · <strong className="text-sage">Final checkpoint passed</strong>
                </>
              ) : allUnitsDone ? (
                <>
                  {" "}
                  · Ready for <strong className="text-ink">final checkpoint</strong>
                </>
              ) : (
                <>
                  {" "}
                  · Complete each unit in order to unlock the next.
                </>
              )}
            </p>
          </div>

          <div className="mb-4 flex justify-end">
            <NikkudExerciseToggle
              showNikkud={showNikkud}
              onToggle={() => setShowNikkud((v) => !v)}
            />
          </div>
          <p className="mb-6 text-[11px] text-ink-faint">
            Bridge passages default to unpointed below; use the toggle for vowels.
          </p>

          <ol className="mb-10 space-y-8">
            {BRIDGE_UNITS.map((unit, idx) => {
              const uOpen = bridgeUnitUnlocked(progress, idx, devBypass);
              const uDone = !!unitsDone[unit.id];
              const unitSentencePack = buildCorrectSentencePackFromMcq(
                unit.practicePack,
                4,
                4,
              );
              return (
                <li key={unit.id}>
                  <div className="rounded-2xl border border-ink/12 bg-parchment-card/90 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                          Unit {idx + 1}
                        </p>
                        <h2 className="mt-1 font-label text-sm text-ink">
                          {unit.title}
                        </h2>
                        <p className="mt-1 text-xs text-ink-muted">{unit.intro}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 font-label text-[9px] uppercase tracking-wide ${
                          uDone
                            ? "bg-sage/20 text-sage"
                            : "bg-ink/10 text-ink-muted"
                        }`}
                      >
                        {uDone ? "Done" : uOpen ? "In progress" : "Locked"}
                      </span>
                    </div>
                    {!uOpen ? (
                      <p className="mt-3 text-sm text-ink-faint">
                        Finish the previous unit to unlock this one.
                      </p>
                    ) : (
                      <>
                        <div className="mt-4">
                          <HebrewTapText
                            text={showNikkud ? unit.he : stripNikkud(unit.he)}
                            className="text-lg text-ink"
                            showSaveWord
                          />
                        </div>
                        <p className="mt-3 border-t border-ink/10 pt-3 text-sm italic leading-relaxed text-ink-muted">
                          {unit.en}
                        </p>
                        <div className="mt-6 space-y-4">
                          <DrillPrepGate
                            title={`${unit.title} prep`}
                            subtitle="Read, tap-hear, then quiz."
                            cards={buildPrepCardsFromMcqPack(unit.practicePack, 5)}
                            ctaLabel="Start unit drills"
                          >
                            <McqDrill
                              key={unit.id}
                              pack={unit.practicePack}
                              defaultShowNikkud={false}
                              skillTags={["grammar", "definition", "recognition"]}
                              onPracticeAnswer={onPracticeAnswer}
                            />
                            {unitSentencePack ? (
                              <CorrectSentenceDrill
                                pack={unitSentencePack}
                                onPracticeAnswer={onPracticeAnswer}
                              />
                            ) : null}
                          </DrillPrepGate>
                          {!uDone ? (
                            <button
                              type="button"
                              onClick={() => markUnitComplete(unit.id)}
                              className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
                            >
                              Mark unit complete — continue
                            </button>
                          ) : (
                            <p className="text-xs text-sage">
                              Unit complete. Continue to the next unit or the final
                              checkpoint when all four are done.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="rounded-2xl border border-amber/35 bg-amber/5 p-4">
            <p className="font-label text-[10px] uppercase tracking-[0.18em] text-amber">
              Final checkpoint ({bridgePctLabel}%+)
            </p>
            {!finalUnlocked && !bridgePassed ? (
              <p className="mt-2 text-sm text-ink-muted">
                Complete all four study units above to unlock the final quiz.
              </p>
            ) : bridgePassed ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-ink-muted">
                  You met the {bridgePctLabel}% bar on the final quiz. Clearing
                  resets the checkpoint and study units so you can run the module
                  again.
                </p>
                <button
                  type="button"
                  onClick={clearBridgePass}
                  className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
                >
                  Clear bridge completion (retake)
                </button>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm text-ink-muted">
                  Twelve questions — need at least{" "}
                  {Math.ceil(BRIDGE_PASS_TARGET_PCT * 12 - 1e-9)} correct for{" "}
                  {bridgePctLabel}%.
                </p>
                <div className="mt-4">
                  <DrillPrepGate
                    title="Bridge final prep"
                    subtitle="Quick review before the checkpoint exam."
                    cards={buildPrepCardsFromMcqPack(BRIDGE_FINAL_EXAM_PACK, 6)}
                    ctaLabel="Start final checkpoint"
                  >
                    <McqDrill
                      pack={BRIDGE_FINAL_EXAM_PACK}
                      defaultShowNikkud={false}
                      skillTags={["grammar", "comprehension", "definition", "recognition"]}
                      onPracticeAnswer={onPracticeAnswer}
                      endHint={
                        lastBridgeAttempt
                          ? meetsFoundationExitPassPercent(
                              lastBridgeAttempt.correct,
                              lastBridgeAttempt.total,
                              BRIDGE_PASS_TARGET_PCT,
                            )
                            ? `Score meets ${bridgePctLabel}% — bridge complete.`
                            : `Score ${lastBridgeAttempt.correct}/${lastBridgeAttempt.total}. Need at least ${Math.ceil(BRIDGE_PASS_TARGET_PCT * lastBridgeAttempt.total - 1e-9)} of ${lastBridgeAttempt.total} for ${bridgePctLabel}%.`
                          : `Scores at or above ${bridgePctLabel}% pass the bridge checkpoint.`
                      }
                      onPackComplete={onBridgePackComplete}
                    />
                  </DrillPrepGate>
                </div>
                {lastBridgeAttempt &&
                !meetsFoundationExitPassPercent(
                  lastBridgeAttempt.correct,
                  lastBridgeAttempt.total,
                  BRIDGE_PASS_TARGET_PCT,
                ) ? (
                  <p className="mt-2 text-xs text-rust">
                    Last run: {lastBridgeAttempt.correct}/
                    {lastBridgeAttempt.total} — below {bridgePctLabel}%.
                  </p>
                ) : null}
              </>
            )}
          </div>

          {bridgePassed ? (
            <p className="mt-8 text-center text-sm text-ink-muted">
              <Link
                href="/learn/tracks"
                className="font-medium text-sage underline"
              >
                Specialty tracks
              </Link>{" "}
              — Bronze · Silver · Gold badges (news, literature, spoken).
            </p>
          ) : (
            <p className="mt-8 text-center text-xs text-ink-faint">
              After you pass the final checkpoint, specialty badge tracks open
              here.
            </p>
          )}
        </>
      )}
    </div>
  );
}
