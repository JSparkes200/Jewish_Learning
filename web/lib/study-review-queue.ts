import { getSectionsForLevel } from "@/data/course";
import { getMasteryWordListForLevel } from "@/data/course-mastery-words";
import { getMcqPackForSection, SECTION_IDS_WITH_MCQ } from "@/data/section-drills";

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
  vocabLevels: Record<string, number> | undefined,
  opts?: { belowGateMax?: number; unseenMax?: number },
): {
  belowGate: ReviewQueueEntry[];
  unseen: ReviewQueueEntry[];
} {
  const belowGateMax = opts?.belowGateMax ?? 18;
  const unseenMax = opts?.unseenMax ?? 10;

  const list = getMasteryWordListForLevel(level);
  const vl = vocabLevels ?? {};

  const belowGate: ReviewQueueEntry[] = [];
  for (const lemma of list) {
    const v = vl[lemma];
    if (v !== undefined && v < 2) {
      belowGate.push({ lemma, vocabLevel: v, kind: "below_gate" });
    }
  }
  belowGate.sort((a, b) => a.lemma.localeCompare(b.lemma, "he"));

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
