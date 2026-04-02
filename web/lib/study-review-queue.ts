import { getSectionsForLevel } from "@/data/course";
import { getMasteryWordListForLevel } from "@/data/course-mastery-words";
import { getMcqPackForSection, SECTION_IDS_WITH_MCQ } from "@/data/section-drills";
import { lemmaReviewPriority, type LearnProgressState } from "@/lib/learn-progress";

const MCQ_SECTION_IDS = new Set(SECTION_IDS_WITH_MCQ);

/**
 * First Learn subsection (course order) whose MCQ pack contains this prompt.
 */
export function findMcqSectionIdForLemma(
  level: number,
  lemma: string,
): string | null {
  const h = lemma.trim();
  if (!h) return null;
  const sections = getSectionsForLevel(level);
  for (const s of sections) {
    if (!MCQ_SECTION_IDS.has(s.id)) continue;
    const p = getMcqPackForSection(s.id);
    if (!p || p.kind !== "mcq") continue;
    if (p.items.some((it) => it.promptHe.trim() === h)) return s.id;
  }
  return null;
}

export type ReviewQueueEntry = {
  lemma: string;
  /** Current stored level (1 = one correct hit, needs one more for gate ≥2) */
  vocabLevel: number;
  kind: "below_gate" | "unseen";
};

/**
 * Build a small review list for Study: lemmas on the active level course list
 * that are below the mastery gate (lv &lt; 2), plus a short “not yet starred” list.
 *
 * Legacy `learner.rq` was mistake-driven; this approximates “needs more wins”
 * using Next `vocabLevels` (only populated after correct MCQ/comprehension picks).
 */
export function buildStudyReviewQueue(
  level: number,
  progress: Pick<LearnProgressState, "vocabLevels" | "lemmaSkillMetrics">,
  opts?: { belowGateMax?: number; unseenMax?: number },
): {
  belowGate: ReviewQueueEntry[];
  unseen: ReviewQueueEntry[];
} {
  const belowGateMax = opts?.belowGateMax ?? 18;
  const unseenMax = opts?.unseenMax ?? 10;

  const list = getMasteryWordListForLevel(level);
  const vl = progress.vocabLevels ?? {};

  const belowGate: ReviewQueueEntry[] = [];
  for (const lemma of list) {
    const v = vl[lemma];
    if (v !== undefined && v < 2) {
      belowGate.push({ lemma, vocabLevel: v, kind: "below_gate" });
    }
  }
  belowGate.sort((a, b) => {
    if (a.vocabLevel !== b.vocabLevel) return a.vocabLevel - b.vocabLevel;
    const bp = lemmaReviewPriority(progress, b.lemma);
    const ap = lemmaReviewPriority(progress, a.lemma);
    if (bp !== ap) return bp - ap;
    return a.lemma.localeCompare(b.lemma, "he");
  });

  const unseen: ReviewQueueEntry[] = [];
  for (const lemma of list) {
    if (vl[lemma] != null) continue;
    unseen.push({ lemma, vocabLevel: 0, kind: "unseen" });
    if (unseen.length >= unseenMax) break;
  }

  return {
    belowGate: belowGate.slice(0, belowGateMax),
    unseen: unseen.slice(0, unseenMax),
  };
}

export type ReviewQueueFocusSection = {
  sectionId: string;
  label: string;
  belowGate: number;
  unseen: number;
  total: number;
};

/**
 * Rank section drills by how many of their prompts are still below gate/unseen.
 * Helps learners jump to the subsection with highest review value.
 */
export function buildReviewQueueFocusSections(
  level: number,
  progress: Pick<LearnProgressState, "vocabLevels" | "lemmaSkillMetrics">,
  maxSections = 4,
): ReviewQueueFocusSection[] {
  const vl = progress.vocabLevels ?? {};
  const sections = getSectionsForLevel(level);
  const scored: ReviewQueueFocusSection[] = [];
  for (const sec of sections) {
    if (!MCQ_SECTION_IDS.has(sec.id)) continue;
    const pack = getMcqPackForSection(sec.id);
    if (!pack || pack.kind !== "mcq") continue;
    let belowGate = 0;
    let unseen = 0;
    const seen = new Set<string>();
    for (const it of pack.items) {
      const lemma = it.promptHe.trim();
      if (!lemma || seen.has(lemma)) continue;
      seen.add(lemma);
      const v = vl[lemma];
      if (v == null) unseen += 1;
      else if (v < 2) {
        belowGate += 1;
        const p = lemmaReviewPriority(progress, lemma);
        if (p > 1.05) belowGate += 1;
      }
    }
    const total = belowGate + unseen;
    if (total > 0) {
      scored.push({
        sectionId: sec.id,
        label: sec.label,
        belowGate,
        unseen,
        total,
      });
    }
  }
  scored.sort((a, b) => {
    if (a.total !== b.total) return b.total - a.total;
    if (a.belowGate !== b.belowGate) return b.belowGate - a.belowGate;
    return a.sectionId.localeCompare(b.sectionId);
  });
  return scored.slice(0, Math.max(1, maxSections));
}
