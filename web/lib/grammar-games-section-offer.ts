import type { SectionMeta } from "@/data/course";
import { countWordsMasteredForFluency } from "@/lib/learn-progress";

export type GrammarGamesOffer = {
  slotMaxDifficulty: 1 | 2 | 3 | 4;
  /** Omit smikhut step when undefined */
  smikhutMaxDifficulty?: 1 | 2 | 3;
};

const LEVEL1_SMIKHUT_SECTION_IDS = new Set([
  "1-8",
  "1-9",
  "1-10",
  "1-11",
  "1-12",
  "1-13",
  "1-14",
  "1-matres",
]);

/**
 * Optional grammar-game rounds at the end of a lesson. Numbers-only drill skips
 * these; smikhut ramps with level and appears in late Aleph once nouns compound.
 */
export function getGrammarGamesOffer(args: {
  level: number;
  sectionId: string;
  sec: SectionMeta | undefined;
  vocabLevels?: Record<string, number>;
  /** True when the section has the normal drill track (mcq / roots / comp / story). */
  hasLessonTrack: boolean;
}): GrammarGamesOffer | null {
  const { level, sectionId, vocabLevels, hasLessonTrack } = args;
  if (!hasLessonTrack) return null;
  if (sectionId === "1-nums") return null;

  const baseSlot = Math.min(4, Math.max(1, level)) as 1 | 2 | 3 | 4;
  const mastered = countWordsMasteredForFluency(vocabLevels);
  let slotMax = baseSlot;
  if (mastered >= 60 && slotMax < 4) slotMax = (slotMax + 1) as 1 | 2 | 3 | 4;
  if (mastered >= 150 && slotMax < 4) slotMax = (slotMax + 1) as 1 | 2 | 3 | 4;
  slotMax = Math.min(4, slotMax) as 1 | 2 | 3 | 4;

  let smikhutMax: 1 | 2 | 3 | undefined;
  if (sectionId === "3-smikhut") {
    smikhutMax = 3;
  } else if (level >= 3) {
    smikhutMax = 3;
  } else if (level === 2) {
    smikhutMax = 2;
  } else if (level === 1 && LEVEL1_SMIKHUT_SECTION_IDS.has(sectionId)) {
    smikhutMax = 1;
  }

  return { slotMaxDifficulty: slotMax, smikhutMaxDifficulty: smikhutMax };
}
