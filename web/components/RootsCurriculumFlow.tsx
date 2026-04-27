"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppShell } from "@/components/AppShell";
import { ExerciseAskRabbiButton } from "@/components/ExerciseAskRabbiButton";
import { Hebrew } from "@/components/Hebrew";
import { ROOTS_GROUPS } from "@/data/roots-curriculum";
import type { CourseRootFamily, RootWordForm } from "@/data/course-roots";
import { generateContent } from "@/lib/generate-content";
import {
  bumpRootsCurriculumDrillHit,
  markRootsGroupIntroSeen,
  passRootsCheckpoint,
  passRootsGroupTest,
  type GradedPracticeContext,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { LEARN_VOICE } from "@/lib/learn-user-voice";
import {
  deriveRootsCurriculumView,
  familiesForCheckpoint,
  familiesForCurriculumGroup,
  isRootsGroupUnlocked,
  ROOTS_CHECKPOINT_PASS_MIN,
  ROOTS_CHECKPOINT_QUESTION_COUNT,
  ROOTS_DRILL_HITS_TO_TEST,
  ROOTS_TEST_PASS_MIN,
  ROOTS_TEST_QUESTION_COUNT,
} from "@/lib/roots-curriculum-logic";
import {
  buildRootsCurriculumQuestionSet,
  type RootsCurriculumQuestion,
} from "@/lib/roots-curriculum-questions";
import { englishMcqOptionsForRootWord } from "@/lib/root-drill";
import { courseLevelToRabbiLevel } from "@/lib/course-rabbi-level";

type Props = {
  learnProgress: LearnProgressState;
  /** Full graded pipeline (streak, vocab, root drill tallies, game stats). */
  onGradedPick: (correct: boolean, ctx?: GradedPracticeContext) => void;
  /** Apply curriculum-only patches (intro, drill hits, test pass, checkpoint). */
  applyCurriculum: (fn: (s: LearnProgressState) => LearnProgressState) => void;
  /** Deep link: open this group in the rail (roots-g0 … roots-g3). */
  initialGroupId?: string | null;
};

function randomPick<T>(arr: readonly T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function findFamilyForWord(
  families: readonly CourseRootFamily[],
  word: RootWordForm,
): CourseRootFamily | undefined {
  return families.find((f) => f.words.some((w) => w.h === word.h));
}

function gradedCtx(
  q: RootsCurriculumQuestion,
): { promptHe: string; rootKey: string; skills: GradedPracticeContext["skills"] } {
  switch (q.kind) {
    case "gloss":
      return {
        promptHe: q.promptHe,
        rootKey: q.rootKey,
        skills: ["grammar", "definition", "recognition"],
      };
    case "tier":
      return {
        promptHe: q.promptHe,
        rootKey: q.rootKey,
        skills: ["grammar", "recognition"],
      };
    case "pickRoot":
      return {
        promptHe: q.promptHe,
        rootKey: q.rootKey,
        skills: ["grammar", "recognition"],
      };
    case "formForRoot":
      return {
        promptHe: q.promptHe,
        rootKey: q.rootKey,
        skills: ["grammar", "recognition"],
      };
  }
}

export function RootsCurriculumFlow({
  learnProgress,
  onGradedPick,
  applyCurriculum,
  initialGroupId = null,
}: Props) {
  const { setRabbiAskContext } = useAppShell();
  const rc = learnProgress.rootsCurriculum;
  const rabbiLevel = courseLevelToRabbiLevel(learnProgress.activeLevel);

  const derived = useMemo(() => deriveRootsCurriculumView(rc), [rc]);

  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(
    null,
  );
  const [batteryOutcome, setBatteryOutcome] = useState<{
    passed: boolean;
    kind: "test" | "checkpoint";
  } | null>(null);

  const [drillRound, setDrillRound] = useState<{
    word: RootWordForm;
    options: string[];
    correctIndex: number;
    family: CourseRootFamily;
  } | null>(null);
  const [drillPicked, setDrillPicked] = useState<number | null>(null);

  const [battery, setBattery] = useState<{
    questions: RootsCurriculumQuestion[];
    i: number;
    score: number;
    kind: "test" | "checkpoint";
    groupId?: string;
    checkpointIndex?: number;
  } | null>(null);
  const [batteryPicked, setBatteryPicked] = useState<number | null>(null);

  useEffect(() => {
    if (!initialGroupId?.trim()) return;
    const idx = ROOTS_GROUPS.findIndex((g) => g.id === initialGroupId.trim());
    if (idx >= 0) {
      setSelectedGroupIndex(idx);
      setDrillRound(null);
      setBattery(null);
      setBatteryOutcome(null);
    }
  }, [initialGroupId]);

  const followingMain =
    selectedGroupIndex === null ||
    (derived.kind === "group" && selectedGroupIndex === derived.groupIndex);

  const effectiveGroupIndex = useMemo(() => {
    if (selectedGroupIndex != null) return selectedGroupIndex;
    if (derived.kind === "group") return derived.groupIndex;
    return 0;
  }, [selectedGroupIndex, derived]);

  const mainPathGroupIndex =
    derived.kind === "group" ? derived.groupIndex : null;

  const groupMeta = ROOTS_GROUPS[effectiveGroupIndex];
  const groupFamilies = useMemo(
    () => familiesForCurriculumGroup(effectiveGroupIndex),
    [effectiveGroupIndex],
  );
  const groupWords = useMemo(
    () => groupFamilies.flatMap((f) => f.words),
    [groupFamilies],
  );
  const groupId = groupMeta?.id ?? "";

  const groupProg = groupId ? (rc?.groups[groupId] ?? {}) : {};
  const unlocked = isRootsGroupUnlocked(rc, effectiveGroupIndex);
  const testPassed = !!groupProg.testPassed;
  const reviewMode = testPassed && selectedGroupIndex != null;

  const startDrillRound = useCallback(() => {
    const w = randomPick(groupWords);
    if (!w || !groupFamilies.length) return;
    const fam = findFamilyForWord(groupFamilies, w);
    if (!fam) return;
    const { options, correctIndex } = englishMcqOptionsForRootWord(
      w,
      groupWords,
    );
    setDrillRound({ word: w, options, correctIndex, family: fam });
    setDrillPicked(null);
  }, [groupFamilies, groupWords]);

  useEffect(() => {
    if (!drillRound) {
      setRabbiAskContext(null);
      return;
    }
    setRabbiAskContext({
      targetHe: drillRound.word.h,
      learnerLevel: rabbiLevel,
      meaningEn: drillRound.word.e,
    });
    return () => setRabbiAskContext(null);
  }, [drillRound, rabbiLevel, setRabbiAskContext]);

  const batteryQuestion = battery && battery.i < battery.questions.length
    ? battery.questions[battery.i]
    : null;

  useEffect(() => {
    if (!batteryQuestion) {
      if (battery) return;
      setRabbiAskContext(null);
      return;
    }
    const ph =
      batteryQuestion.kind === "formForRoot"
        ? batteryQuestion.promptHe
        : batteryQuestion.promptHe;
    setRabbiAskContext({
      targetHe: ph,
      learnerLevel: rabbiLevel,
    });
    return () => setRabbiAskContext(null);
  }, [battery, batteryQuestion, rabbiLevel, setRabbiAskContext]);

  const rootLearnContent = useMemo(() => {
    if (!drillRound) return null;
    return generateContent({
      promptHe: drillRound.word.h,
      correctEn: drillRound.word.e,
      translit: drillRound.word.p,
      shoresh: drillRound.family.root,
    });
  }, [drillRound]);

  const onDrillPick = (j: number) => {
    if (drillPicked != null || !drillRound || !groupId) return;
    setDrillPicked(j);
    const ok = j === drillRound.correctIndex;
    const ctx: GradedPracticeContext = {
      promptHe: drillRound.word.h,
      rootKey: drillRound.family.root,
      skills: ["grammar", "production", "definition"],
      studyGameId: "roots",
    };
    onGradedPick(ok, ctx);
    if (ok && !reviewMode) {
      applyCurriculum((s) => bumpRootsCurriculumDrillHit(s, groupId, true));
    }
  };

  const onBatteryPick = (j: number) => {
    if (batteryPicked != null || !battery || !batteryQuestion) return;
    setBatteryPicked(j);
    const ok = j === batteryQuestion.correctIndex;
    const { promptHe, rootKey, skills } = gradedCtx(batteryQuestion);
    onGradedPick(ok, {
      promptHe,
      rootKey,
      skills,
      studyGameId: "roots",
    });
    if (ok) {
      setBattery((b) => (b ? { ...b, score: b.score + 1 } : b));
    }
  };

  const beginGroupTest = () => {
    const qs = buildRootsCurriculumQuestionSet(
      groupFamilies,
      ROOTS_TEST_QUESTION_COUNT,
    );
    if (!qs.length) return;
    setBatteryOutcome(null);
    setBattery({
      questions: qs,
      i: 0,
      score: 0,
      kind: "test",
      groupId,
    });
    setBatteryPicked(null);
  };

  const beginCheckpoint = (checkpointIndex: number) => {
    const fams = familiesForCheckpoint(checkpointIndex);
    const qs = buildRootsCurriculumQuestionSet(
      fams,
      ROOTS_CHECKPOINT_QUESTION_COUNT,
    );
    if (!qs.length) return;
    setBatteryOutcome(null);
    setBattery({
      questions: qs,
      i: 0,
      score: 0,
      kind: "checkpoint",
      checkpointIndex,
    });
    setBatteryPicked(null);
  };

  const advanceBattery = () => {
    if (!battery) return;
    setBatteryPicked(null);
    if (battery.i + 1 >= battery.questions.length) {
      const passed =
        battery.kind === "test"
          ? battery.score >= ROOTS_TEST_PASS_MIN
          : battery.score >= ROOTS_CHECKPOINT_PASS_MIN;
      if (passed) {
        if (battery.kind === "test" && battery.groupId) {
          applyCurriculum((s) => passRootsGroupTest(s, battery.groupId!));
        }
        if (battery.kind === "checkpoint" && battery.checkpointIndex != null) {
          applyCurriculum((s) =>
            passRootsCheckpoint(s, battery.checkpointIndex!),
          );
        }
      }
      setBatteryOutcome({ passed, kind: battery.kind });
      setBattery(null);
      return;
    }
    setBattery({ ...battery, i: battery.i + 1 });
  };

  const showMainCheckpoint =
    derived.kind === "checkpoint" &&
    selectedGroupIndex === null &&
    !battery;

  const showComplete =
    derived.kind === "complete" && selectedGroupIndex === null && !battery;

  const phaseForUi: "intro" | "drill" | "test" | "summary" = (() => {
    if (battery) return "test";
    if (!groupMeta) return "intro";
    if (!unlocked) return "intro";
    if (reviewMode) return "intro";
    if (!groupProg.introSeen) return "intro";
    if ((groupProg.drillHits ?? 0) < ROOTS_DRILL_HITS_TO_TEST) return "drill";
    if (!groupProg.testPassed) return "test";
    return "summary";
  })();

  const rail = (
    <div className="space-y-2 rounded-2xl border border-amber/25 bg-parchment-card/60 p-3">
      <p className="font-label text-[9px] uppercase tracking-[0.18em] text-ink-muted">
        Your path
      </p>
      {selectedGroupIndex != null ? (
        <button
          type="button"
          onClick={() => {
            setSelectedGroupIndex(null);
            setDrillRound(null);
            setBattery(null);
            setBatteryOutcome(null);
          }}
          className="w-full rounded-xl border border-sage/30 bg-sage/10 px-3 py-2 text-left text-[11px] font-medium text-sage hover:bg-sage/15"
        >
          Resume main path
        </button>
      ) : null}
      <ul className="space-y-1.5">
        {ROOTS_GROUPS.map((g, idx) => {
          const st = rc?.groups[g.id];
          const done = !!st?.testPassed;
          const isSel = selectedGroupIndex === idx;
          const lock = !isRootsGroupUnlocked(rc, idx);
          const onMain =
            selectedGroupIndex === null &&
            mainPathGroupIndex === idx &&
            derived.kind === "group";
          return (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedGroupIndex(idx);
                  setDrillRound(null);
                  setBattery(null);
                  setBatteryOutcome(null);
                }}
                className={`w-full rounded-xl px-2.5 py-2 text-left text-[11px] transition ${
                  isSel
                    ? "bg-amber/15 ring-1 ring-amber/40"
                    : "hover:bg-parchment-deep/40"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-ink">
                    {g.title.replace(/^Group \d+ — /, "")}
                    {onMain ? (
                      <span className="ml-1 text-[9px] font-normal text-sage">
                        · current
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 tabular-nums text-[10px] text-ink-muted">
                    {lock ? "Locked" : done ? "Done" : "Open"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="border-t border-ink/10 pt-2 text-[10px] text-ink-muted">
        Every four groups, a mixed checkpoint reviews tiers, glosses, and roots
        together. Revisit any group here anytime.
      </p>
    </div>
  );

  const introCard = groupMeta ? (
    <div className="rounded-3xl border-2 border-amber/30 bg-gradient-to-br from-amber/12 via-parchment-card/95 to-parchment-deep/35 p-5 shadow-[0_10px_36px_rgba(200,112,32,0.1)]">
      <p className="font-label text-[10px] uppercase tracking-[0.2em] text-amber/90">
        {groupMeta.title}
      </p>
      <p className="mt-2 text-sm text-ink-muted">{groupMeta.blurb}</p>
      <div className="mt-4 space-y-5">
        {groupFamilies.map((fam) => (
          <div
            key={fam.root}
            className="rounded-2xl border border-ink/10 bg-parchment/80 p-4 shadow-inner"
          >
            <p className="font-label text-[9px] uppercase tracking-wide text-sage">
              Shoresh
            </p>
            <Hebrew as="p" className="text-right text-2xl font-medium text-ink">
              {fam.root}
            </Hebrew>
            <p className="text-xs text-ink-muted">{fam.meaning}</p>
            {fam.sentence ? (
              <p className="mt-2 text-[11px] italic text-ink-muted">
                <Hebrew>{fam.sentence}</Hebrew>
                {fam.trans ? (
                  <span className="mt-1 block not-italic text-ink-faint">
                    {fam.trans}
                  </span>
                ) : null}
              </p>
            ) : null}
            <ul className="mt-3 space-y-1.5 text-[11px]">
              {fam.words.map((w) => (
                <li
                  key={w.h}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-t border-ink/5 pt-1.5 first:border-t-0 first:pt-0"
                >
                  <Hebrew className="text-base text-ink">{w.h}</Hebrew>
                  <span className="text-ink-muted">
                    {w.p} · {w.e}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {!unlocked ? (
        <p className="mt-4 text-sm text-rust">
          Finish the previous group&apos;s test (and any checkpoint before it)
          to unlock this set.
        </p>
      ) : reviewMode ? (
        <button
          type="button"
          onClick={() => startDrillRound()}
          className="mt-5 rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md hover:brightness-110"
        >
          Practice these shapes →
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            applyCurriculum((s) => markRootsGroupIntroSeen(s, groupId));
            startDrillRound();
          }}
          className="mt-5 rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md hover:brightness-110"
        >
          I&apos;ve read this — start drills →
        </button>
      )}
    </div>
  ) : null;

  const showIntroPanel =
    !!introCard &&
    !battery &&
    (reviewMode
      ? !drillRound
      : phaseForUi === "intro" && !drillRound);

  const drillHits = groupProg.drillHits ?? 0;
  const drillCard =
    drillRound && phaseForUi === "drill" ? (
      <div className="rounded-3xl border-2 border-amber/35 bg-gradient-to-br from-amber/15 via-parchment-card/95 to-parchment-deep/40 p-5 shadow-[0_10px_36px_rgba(200,112,32,0.12)]">
        <button
          type="button"
          onClick={() => setDrillRound(null)}
          className="mb-3 font-label text-[10px] uppercase tracking-wide text-sage hover:underline"
        >
          ← Back to intro
        </button>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-amber/90">
          Drills ({drillHits}/{ROOTS_DRILL_HITS_TO_TEST} correct toward the test)
        </p>
        <div className="mt-2 flex justify-end">
          <ExerciseAskRabbiButton compact />
        </div>
        <Hebrew
          as="p"
          className="mt-4 text-right text-3xl font-medium leading-relaxed text-ink"
        >
          {drillRound.word.h}
        </Hebrew>
        <p className="mt-2 text-center text-sm italic text-amber">
          {drillRound.word.p}
        </p>
        {rootLearnContent?.vibeLine ? (
          <div className="mt-4 space-y-2 rounded-2xl border border-sage/20 bg-gradient-to-br from-sage/5 to-parchment-deep/20 px-4 py-3 shadow-inner">
            <p className="font-label text-[9px] uppercase tracking-[0.2em] text-sage/90">
              {LEARN_VOICE.vibeEyebrow}
            </p>
            <p className="whitespace-pre-line text-xs leading-relaxed text-ink-muted">
              {rootLearnContent.vibeLine}
            </p>
          </div>
        ) : null}
        <p className="mt-3 text-xs text-ink-muted">
          Pick the English gloss that matches this Hebrew shape.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {drillRound.options.map((opt, j) => {
            const show = drillPicked != null;
            const isCorrect = j === drillRound.correctIndex;
            const isSel = j === drillPicked;
            let ring =
              "ring-2 ring-ink/10 hover:-translate-y-0.5 hover:bg-parchment-deep/55 hover:shadow-md hover:ring-amber/25";
            if (show) {
              if (isCorrect) ring = "bg-sage/20 ring-2 ring-sage shadow-sm";
              else if (isSel)
                ring = "bg-rust/10 ring-2 ring-rust/35 opacity-90 shadow-sm";
              else ring = "opacity-45 ring-1 ring-ink/8";
            }
            return (
              <button
                key={`${opt}-${j}`}
                type="button"
                disabled={drillPicked != null}
                onClick={() => onDrillPick(j)}
                className={`rounded-2xl px-4 py-3.5 text-left text-sm text-ink transition-all duration-200 ${ring}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {drillPicked != null ? (
          <div className="mt-4 rounded-2xl border-2 border-ink/10 bg-parchment/90 p-4 text-sm shadow-inner">
            {drillPicked === drillRound.correctIndex ? (
              <p className="text-sage">{LEARN_VOICE.mcqCorrect}</p>
            ) : (
              <p className="text-ink-muted">
                {LEARN_VOICE.mcqReveal}:{" "}
                <strong className="text-ink">
                  {drillRound.options[drillRound.correctIndex]}
                </strong>
                .
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                if (
                  !reviewMode &&
                  drillPicked === drillRound.correctIndex &&
                  drillHits + 1 >= ROOTS_DRILL_HITS_TO_TEST
                ) {
                  setDrillRound(null);
                  return;
                }
                startDrillRound();
              }}
              className="mt-4 rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md transition hover:brightness-110 hover:shadow-lg"
            >
              Next →
            </button>
          </div>
        ) : null}
      </div>
    ) : null;

  /** Review-mode drill when not in "phase drill" - same card, triggered from intro */
  const reviewDrillCard =
    drillRound && reviewMode ? (
      <div className="rounded-3xl border-2 border-amber/35 bg-gradient-to-br from-amber/15 via-parchment-card/95 to-parchment-deep/40 p-5 shadow-[0_10px_36px_rgba(200,112,32,0.12)]">
        <button
          type="button"
          onClick={() => setDrillRound(null)}
          className="mb-3 font-label text-[10px] uppercase tracking-wide text-sage hover:underline"
        >
          ← Back to overview
        </button>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-amber/90">
          Review drill
        </p>
        <div className="mt-2 flex justify-end">
          <ExerciseAskRabbiButton compact />
        </div>
        <Hebrew
          as="p"
          className="mt-4 text-right text-3xl font-medium leading-relaxed text-ink"
        >
          {drillRound.word.h}
        </Hebrew>
        <p className="mt-2 text-center text-sm italic text-amber">
          {drillRound.word.p}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {drillRound.options.map((opt, j) => {
            const show = drillPicked != null;
            const isCorrect = j === drillRound.correctIndex;
            const isSel = j === drillPicked;
            let ring =
              "ring-2 ring-ink/10 hover:-translate-y-0.5 hover:bg-parchment-deep/55 hover:shadow-md hover:ring-amber/25";
            if (show) {
              if (isCorrect) ring = "bg-sage/20 ring-2 ring-sage shadow-sm";
              else if (isSel)
                ring = "bg-rust/10 ring-2 ring-rust/35 opacity-90 shadow-sm";
              else ring = "opacity-45 ring-1 ring-ink/8";
            }
            return (
              <button
                key={`${opt}-${j}`}
                type="button"
                disabled={drillPicked != null}
                onClick={() => onDrillPick(j)}
                className={`rounded-2xl px-4 py-3.5 text-left text-sm text-ink transition-all duration-200 ${ring}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {drillPicked != null ? (
          <div className="mt-4 rounded-2xl border-2 border-ink/10 bg-parchment/90 p-4 text-sm shadow-inner">
            <button
              type="button"
              onClick={() => startDrillRound()}
              className="rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md hover:brightness-110"
            >
              Next →
            </button>
          </div>
        ) : null}
      </div>
    ) : null;

  const renderBatteryPrompt = (q: RootsCurriculumQuestion) => {
    switch (q.kind) {
      case "gloss":
        return (
          <>
            <p className="text-xs text-ink-muted">
              What does this Hebrew shape mean in English?
            </p>
            <Hebrew
              as="p"
              className="mt-3 text-right text-3xl font-medium text-ink"
            >
              {q.promptHe}
            </Hebrew>
          </>
        );
      case "tier":
        return (
          <>
            <p className="text-xs text-ink-muted">
              Which tier best describes this form? (Same tiers as on the intro
              cards.)
            </p>
            <Hebrew
              as="p"
              className="mt-3 text-right text-3xl font-medium text-ink"
            >
              {q.promptHe}
            </Hebrew>
          </>
        );
      case "pickRoot":
        return (
          <>
            <p className="text-xs text-ink-muted">{q.promptLine}</p>
            <Hebrew
              as="p"
              className="mt-3 text-right text-3xl font-medium text-ink"
            >
              {q.promptHe}
            </Hebrew>
          </>
        );
      case "formForRoot":
        return (
          <>
            <p className="text-sm text-ink">{q.promptLine}</p>
          </>
        );
      default:
        return null;
    }
  };

  const testGateCard =
    !battery &&
    phaseForUi === "test" &&
    unlocked &&
    !reviewMode &&
    groupProg.introSeen &&
    drillHits >= ROOTS_DRILL_HITS_TO_TEST &&
    !groupProg.testPassed ? (
      <div className="rounded-3xl border-2 border-sage/30 bg-parchment-card/90 p-5">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
          Group check
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          Six mixed questions: English glosses, tier labels, picking the right
          shoresh, and matching a form to its root. You need at least{" "}
          {ROOTS_TEST_PASS_MIN} correct to unlock the next group.
        </p>
        <button
          type="button"
          onClick={beginGroupTest}
          className="mt-4 rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md hover:brightness-110"
        >
          Start group test
        </button>
      </div>
    ) : null;

  const batteryCard = battery && batteryQuestion ? (
    <div className="rounded-3xl border-2 border-sage/35 bg-gradient-to-br from-sage/10 to-parchment-card/95 p-5 shadow-inner">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
          {battery.kind === "checkpoint" ? "Checkpoint" : "Group test"} ·{" "}
          {battery.i + 1}/{battery.questions.length}
        </p>
        <ExerciseAskRabbiButton compact />
      </div>
      <div className="mt-3">{renderBatteryPrompt(batteryQuestion)}</div>
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {batteryQuestion.options.map((opt, j) => {
          const show = batteryPicked != null;
          const isCorrect = j === batteryQuestion.correctIndex;
          const isSel = j === batteryPicked;
          let ring =
            "ring-2 ring-ink/10 hover:-translate-y-0.5 hover:bg-parchment-deep/55 hover:shadow-md hover:ring-sage/25";
          if (show) {
            if (isCorrect) ring = "bg-sage/20 ring-2 ring-sage shadow-sm";
            else if (isSel)
              ring = "bg-rust/10 ring-2 ring-rust/35 opacity-90 shadow-sm";
            else ring = "opacity-45 ring-1 ring-ink/8";
          }
          const hebrewOpt =
            batteryQuestion.kind === "pickRoot" ||
            batteryQuestion.kind === "formForRoot";
          return (
            <button
              key={`${opt}-${j}`}
              type="button"
              disabled={batteryPicked != null}
              onClick={() => onBatteryPick(j)}
              className={`rounded-2xl px-4 py-3.5 text-left text-sm text-ink transition-all duration-200 ${ring}`}
            >
              {hebrewOpt ? (
                <Hebrew className="text-lg">{opt}</Hebrew>
              ) : (
                opt
              )}
            </button>
          );
        })}
      </div>
      {batteryPicked != null ? (
        <div className="mt-4 rounded-2xl border border-ink/10 bg-parchment/90 p-4 text-sm">
          {batteryPicked === batteryQuestion.correctIndex ? (
            <p className="text-sage">{LEARN_VOICE.mcqCorrect}</p>
          ) : (
            <p className="text-ink-muted">
              {LEARN_VOICE.mcqReveal}:{" "}
              {batteryQuestion.kind === "pickRoot" ||
              batteryQuestion.kind === "formForRoot" ? (
                <Hebrew className="font-semibold text-ink">
                  {batteryQuestion.options[batteryQuestion.correctIndex]}
                </Hebrew>
              ) : (
                <strong className="text-ink">
                  {batteryQuestion.options[batteryQuestion.correctIndex]}
                </strong>
              )}
            </p>
          )}
          <button
            type="button"
            onClick={advanceBattery}
            className="mt-3 rounded-2xl bg-sage px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
          >
            {battery.i + 1 >= battery.questions.length ? "Finish" : "Next →"}
          </button>
        </div>
      ) : null}
    </div>
  ) : null;

  const batteryOutcomeBanner = batteryOutcome ? (
    <div
      className={`rounded-2xl border-2 p-4 text-sm ${
        batteryOutcome.passed
          ? "border-sage/40 bg-sage/10 text-ink"
          : "border-rust/30 bg-rust/5 text-ink-muted"
      }`}
    >
      <p className="font-medium text-ink">
        {batteryOutcome.passed
          ? batteryOutcome.kind === "checkpoint"
            ? "Checkpoint passed."
            : "Group test passed — next group is unlocked."
          : batteryOutcome.kind === "checkpoint"
            ? `Need at least ${ROOTS_CHECKPOINT_PASS_MIN} correct to clear the checkpoint. Try again when you're ready.`
            : `Need at least ${ROOTS_TEST_PASS_MIN} correct to unlock the next group. Keep drilling, then retry.`}
      </p>
      <button
        type="button"
        onClick={() => setBatteryOutcome(null)}
        className="mt-3 rounded-xl bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
      >
        OK
      </button>
    </div>
  ) : null;

  const checkpointBanner =
    showMainCheckpoint && !battery ? (
      <div className="rounded-3xl border-2 border-amber/40 bg-gradient-to-br from-amber/20 to-parchment-card/95 p-5">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-amber">
          Mixed checkpoint
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          You&apos;ve finished four root groups. Take a longer mixed quiz (
          {ROOTS_CHECKPOINT_QUESTION_COUNT} questions, need {ROOTS_CHECKPOINT_PASS_MIN}{" "}
          correct) that pulls glosses, tiers, shoresh choices, and form matching
          from everything you&apos;ve studied so far in this track.
        </p>
        <button
          type="button"
          onClick={() => beginCheckpoint(derived.checkpointIndex)}
          className="mt-4 rounded-2xl bg-amber px-5 py-2.5 font-label text-[10px] uppercase tracking-wide text-white shadow-md hover:brightness-110"
        >
          Start checkpoint
        </button>
      </div>
    ) : null;

  const completeBanner = showComplete ? (
    <div className="rounded-3xl border-2 border-sage/35 bg-sage/10 p-5 text-center">
      <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
        Roots track complete
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        You&apos;ve passed every group and the mixed checkpoint. Use the list on
        the left to revisit any family, or open the full explorer below for
        lexicon-style browsing.
      </p>
    </div>
  ) : null;

  const nextUpLabel = (() => {
    if (derived.kind === "group") {
      const g = ROOTS_GROUPS[derived.groupIndex];
      if (!g) return null;
      if (derived.locked) return "Finish the previous group to continue.";
      if (derived.phase === "intro") return `Next: read ${g.title}`;
      if (derived.phase === "drill") return `Next: drills for ${g.title}`;
      return `Next: test for ${g.title}`;
    }
    if (derived.kind === "checkpoint") return "Next: mixed checkpoint";
    return "Track complete";
  })();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,220px)_1fr]">
      <div className="space-y-3 lg:sticky lg:top-4 lg:self-start">
        {rail}
        {followingMain && nextUpLabel ? (
          <p className="rounded-xl border border-ink/10 bg-parchment-deep/30 px-3 py-2 text-[11px] text-ink-muted">
            <span className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
              Main path
            </span>
            <br />
            {nextUpLabel}
          </p>
        ) : null}
      </div>

      <div className="min-w-0 space-y-5">
        {completeBanner}
        {checkpointBanner}
        {batteryOutcomeBanner}

        {!showMainCheckpoint && !showComplete ? (
          <>
            {reviewDrillCard}
            {showIntroPanel ? introCard : null}
            {drillCard}
            {testGateCard}
            {batteryCard}
          </>
        ) : null}

        {showMainCheckpoint || showComplete ? null : (
          <>
            {!reviewMode &&
            selectedGroupIndex === null &&
            derived.kind === "group" &&
            !derived.locked &&
            phaseForUi === "intro" &&
            !groupProg.introSeen &&
            effectiveGroupIndex === derived.groupIndex ? (
              <p className="text-xs text-ink-faint">
                Tip: use the list on the left to jump back to an earlier group
                for review.
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
