"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DrillPrepGate } from "@/components/DrillPrepGate";
import { HebrewTapText } from "@/components/HebrewTapText";
import { McqDrill } from "@/components/McqDrill";
import { NikkudExerciseToggle } from "@/components/NikkudExerciseToggle";
import { storyPageDefaultShowNikkud } from "@/data/course";
import { getStoryMcqPack } from "@/data/course-stories";
import { getMcqPackForSection } from "@/data/section-drills";
import { stripNikkud } from "@/lib/hebrew-nikkud";
import {
  type GradedPracticeContext,
  loadLearnProgress,
  normalizeStreak,
  recordGradedAnswer,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  touchDailyStreak,
} from "@/lib/learn-progress";
import { useLearnProgressSync } from "@/lib/use-learn-progress-sync";
import {
  buildPrepCardsFromMcqPack,
  sectionGrammarHint,
} from "@/lib/drill-prep";
import { buildCorrectSentencePackFromMcq } from "@/lib/sentence-correctness";
import { CorrectSentenceDrill } from "@/components/CorrectSentenceDrill";

type Props = { level: number; he: string; en: string };

export function LearnStoryClient({ level, he, en }: Props) {
  const [progress] = useLearnProgressSync({ level });
  const streak = normalizeStreak(progress.streak);
  const attempts = progress.mcqAttempts ?? 0;
  const nikkudDefault = storyPageDefaultShowNikkud(level);
  const [storyShowNikkud, setStoryShowNikkud] = useState(nikkudDefault);

  useEffect(() => {
    setStoryShowNikkud(nikkudDefault);
  }, [level, nikkudDefault]);

  const pack = useMemo(() => {
    if (level === 1) return getMcqPackForSection("1-read");
    return getStoryMcqPack(level);
  }, [level]);
  const prepCards = buildPrepCardsFromMcqPack(pack, 6);
  const sentencePack = useMemo(
    () => (pack ? buildCorrectSentencePackFromMcq(pack, level, 4) : null),
    [pack, level],
  );
  const storyGloss = Object.fromEntries(
    (pack?.items ?? []).map((it) => [it.promptHe, it.correctEn]),
  );

  const onPracticeAnswer = useCallback(
    (correct: boolean, ctx?: GradedPracticeContext) => {
      const cur = loadLearnProgress();
      let n = touchDailyStreak(cur);
      n = recordGradedAnswer(n, correct, ctx);
      n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
      saveLearnProgress(n);
    },
    [],
  );

  return (
    <div>
      <nav className="mb-6 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.15em]">
        <Link href="/learn" className="text-sage hover:underline">
          Learn
        </Link>
        <span className="text-ink-faint">/</span>
        <Link href={`/learn/${level}`} className="text-sage hover:underline">
          Level {level}
        </Link>
      </nav>

      <h1 className="mb-4 font-label text-xs uppercase tracking-wide text-ink">
        📖 Level {level} story
      </h1>

      <p className="mb-4 text-xs text-ink-muted">
        {attempts > 0 || streak.current > 0 ? (
          <>
            Streak <strong className="text-ink">{streak.current}</strong> day
            {streak.current === 1 ? "" : "s"} · MCQ lifetime{" "}
            <strong className="text-ink">
              {progress.mcqCorrect ?? 0}/{attempts}
            </strong>{" "}
            correct · updates from this tab, other tabs, or imports.
          </>
        ) : (
          <>
            Practice below updates your streak and word levels in course storage
            (syncs across tabs and this browser session).
          </>
        )}
      </p>

      <DrillPrepGate
        title={`Level ${level} story prep`}
        subtitle={sectionGrammarHint(level, "comprehension")}
        cards={prepCards}
        ctaLabel="Start story quiz"
      >
        <div className="mb-6 rounded-2xl border border-ink/12 bg-parchment-card/80 p-4">
          <div className="mb-3 flex justify-end">
            <NikkudExerciseToggle
              showNikkud={storyShowNikkud}
              onToggle={() => setStoryShowNikkud((v) => !v)}
            />
          </div>
          <HebrewTapText
            text={storyShowNikkud ? he : stripNikkud(he)}
            className="text-lg text-ink"
            glossByWord={storyGloss}
            showSaveWord
          />
          <p className="border-t border-ink/10 pt-4 text-sm italic leading-relaxed text-ink-muted">
            {en}
          </p>
        </div>

        {pack ? (
          <div className="mb-6 space-y-4">
            <McqDrill
              pack={pack}
              corpusMaxLevel={level}
              defaultShowNikkud={nikkudDefault}
              skillTags={["comprehension", "recognition", "definition"]}
              onPracticeAnswer={onPracticeAnswer}
            />
            {sentencePack ? (
              <CorrectSentenceDrill
                pack={sentencePack}
                onPracticeAnswer={onPracticeAnswer}
              />
            ) : null}
          </div>
        ) : null}
      </DrillPrepGate>

      <p className="mb-4 text-xs text-ink-muted">
        This level-wide story matches the legacy <code className="rounded bg-parchment-deep/50 px-1">LVS</code> idea. The mini-quiz counts toward your daily streak and Hebrew MCQ prompts update vocabulary mastery for course gates. It does not mark subsections complete — use the section list for path progress.
      </p>

      <Link
        href={`/learn/${level}`}
        className="inline-block rounded-xl border border-ink/15 px-5 py-3 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/50"
      >
        ← Back to level
      </Link>
    </div>
  );
}
