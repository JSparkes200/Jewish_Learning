import { findMcqSectionIdForLemma } from "@/lib/study-review-queue";
import {
  getWeakestSkillMetrics,
  SKILL_METRIC_LABELS,
  type LearnProgressState,
  type LemmaSkillStat,
  type SkillMetricKey,
} from "@/lib/learn-progress";

const MS_DAY = 86_400_000;
const SOON_WINDOW_MS = 3 * MS_DAY;

export type DailyDueBucketKey = "due" | "soon" | "later";

export type LemmaSkillDueEntry = {
  lemma: string;
  skill: SkillMetricKey;
  attempts: number;
  correct: number;
  accuracy: number;
  lastSeen: number;
  intervalMs: number;
  dueAt: number;
  bucket: DailyDueBucketKey;
};

/**
 * Spacing between reviews for one lemma × skill row (accuracy + exposure aware).
 */
export function reviewIntervalMsForLemmaStat(stat: LemmaSkillStat): number {
  const a = stat.attempts;
  const acc = a > 0 ? stat.correct / stat.attempts : 0.42;
  if (a < 2) return Math.round(0.35 * MS_DAY);
  if (acc >= 0.88) return 7 * MS_DAY;
  if (acc >= 0.72) return 3 * MS_DAY;
  if (acc >= 0.55) return 1 * MS_DAY;
  if (acc >= 0.42) return Math.round(0.5 * MS_DAY);
  return Math.round(0.2 * MS_DAY);
}

function bucketForDueAt(dueAt: number, now: number): DailyDueBucketKey {
  if (now >= dueAt) return "due";
  if (dueAt <= now + SOON_WINDOW_MS) return "soon";
  return "later";
}

export function listLemmaSkillDueEntries(
  progress: Pick<LearnProgressState, "lemmaSkillMetrics">,
  now = Date.now(),
): LemmaSkillDueEntry[] {
  const map = progress.lemmaSkillMetrics ?? {};
  const out: LemmaSkillDueEntry[] = [];
  for (const [lemmaRaw, bySkill] of Object.entries(map)) {
    const lemma = lemmaRaw.trim();
    if (!lemma) continue;
    for (const [skillRaw, stat] of Object.entries(bySkill)) {
      if (!stat || stat.attempts <= 0) continue;
      const skill = skillRaw as SkillMetricKey;
      const intervalMs = reviewIntervalMsForLemmaStat(stat);
      const lastSeen = stat.lastSeen > 0 ? stat.lastSeen : now;
      const dueAt = lastSeen + intervalMs;
      const accuracy = stat.correct / stat.attempts;
      out.push({
        lemma,
        skill,
        attempts: stat.attempts,
        correct: stat.correct,
        accuracy,
        lastSeen,
        intervalMs,
        dueAt,
        bucket: bucketForDueAt(dueAt, now),
      });
    }
  }
  return out;
}

export function countDailyDueBuckets(
  entries: readonly LemmaSkillDueEntry[],
): Record<DailyDueBucketKey, number> {
  const due = entries.filter((e) => e.bucket === "due").length;
  const soon = entries.filter((e) => e.bucket === "soon").length;
  const later = entries.filter((e) => e.bucket === "later").length;
  return { due, soon, later };
}

function bucketRank(b: DailyDueBucketKey): number {
  if (b === "due") return 0;
  if (b === "soon") return 1;
  return 2;
}

/**
 * Unique lemmas ordered by review urgency (due first, then soon, then later).
 */
export function uniqueLemmasByUrgency(
  entries: readonly LemmaSkillDueEntry[],
  max = 20,
): string[] {
  const sorted = [...entries].sort((a, b) => {
    const br = bucketRank(a.bucket) - bucketRank(b.bucket);
    if (br !== 0) return br;
    return a.dueAt - b.dueAt;
  });
  const seen = new Set<string>();
  const lemmas: string[] = [];
  for (const e of sorted) {
    if (seen.has(e.lemma)) continue;
    seen.add(e.lemma);
    lemmas.push(e.lemma);
    if (lemmas.length >= max) break;
  }
  return lemmas;
}

/** Lemmas to pass into Study practice pickers (due → soon → later). */
export function preferredHebrewForPracticeBias(
  progress: Pick<LearnProgressState, "lemmaSkillMetrics">,
  max = 24,
  now = Date.now(),
): string[] {
  return uniqueLemmasByUrgency(listLemmaSkillDueEntries(progress, now), max);
}

export type DailySessionLemmaLink = {
  lemma: string;
  href: string | null;
  /** Skills that contributed to urgency (labels for display). */
  skillsDue: string[];
};

export type DailyMixAction = {
  label: string;
  href: string;
  note?: string;
};

function skillsDueForLemma(
  entries: readonly LemmaSkillDueEntry[],
  lemma: string,
): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    if (e.lemma !== lemma || e.bucket !== "due") continue;
    set.add(SKILL_METRIC_LABELS[e.skill]);
  }
  return [...set];
}

/**
 * Study hub: due counts, deep links, and weak-skill CTAs for Rabbi / daily panel.
 */
export function buildDailySessionPlan(
  progress: LearnProgressState,
  activeLevel: number,
  now = Date.now(),
): {
  bucketCounts: Record<DailyDueBucketKey, number>;
  entryCount: number;
  topDueLemmas: DailySessionLemmaLink[];
  mixActions: DailyMixAction[];
} {
  const entries = listLemmaSkillDueEntries(progress, now);
  const bucketCounts = countDailyDueBuckets(entries);
  const urgent = uniqueLemmasByUrgency(
    entries.filter((e) => e.bucket === "due"),
    12,
  );
  const fallbackUrgent =
    urgent.length > 0
      ? urgent
      : uniqueLemmasByUrgency(
          entries.filter((e) => e.bucket === "soon"),
          12,
        );

  const topDueLemmas: DailySessionLemmaLink[] = fallbackUrgent.slice(0, 8).map((lemma) => {
    const sid = findMcqSectionIdForLemma(activeLevel, lemma);
    return {
      lemma,
      href: sid ? `/learn/${activeLevel}/${sid}` : null,
      skillsDue: skillsDueForLemma(entries, lemma),
    };
  });

  const weak = getWeakestSkillMetrics(progress, 3);
  const mixActions: DailyMixAction[] = [
    {
      label: "Focus review queue",
      href: "/study#study-review-queue",
      note: "Course lemmas below gate on your active level.",
    },
    {
      label: "Reading hub",
      href: "/reading",
      note: "Passages and comprehension reps.",
    },
  ];
  if (weak.some((k) => k === "listening")) {
    mixActions.push({
      label: "Numbers — listen",
      href: "/numbers#listen",
      note: "Sharpen listening with number audio.",
    });
  }
  if (weak.some((k) => k === "grammar" || k === "production")) {
    mixActions.push({
      label: "Word roots",
      href: "/roots",
      note: "Pattern and grammar-style recall.",
    });
  }
  if (weak.some((k) => k === "comprehension")) {
    mixActions.push({
      label: `Level ${activeLevel} story`,
      href: `/learn/${activeLevel}/story`,
      note: "Short narrative + quiz.",
    });
  }

  return {
    bucketCounts,
    entryCount: entries.length,
    topDueLemmas,
    mixActions,
  };
}
