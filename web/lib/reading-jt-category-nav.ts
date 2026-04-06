import { READING_PASSAGES_JT } from "@/data/reading-passages-jt";
import { isJtCarouselUnlocked } from "@/lib/reading-carousel";
import type { LearnProgressState } from "@/lib/learn-progress";

/** Category labels for unlocked Jewish-text passages, in corpus order (legacy Texts tab parity). */
export function unlockedJtCategoriesInOrder(
  progress: LearnProgressState,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (let i = 0; i < READING_PASSAGES_JT.length; i++) {
    if (!isJtCarouselUnlocked(i, progress)) continue;
    const cat = READING_PASSAGES_JT[i]!.cat;
    if (seen.has(cat)) continue;
    seen.add(cat);
    out.push(cat);
  }
  return out;
}

/** First carousel item key (`jt-{index}`) for a category, or null if none unlocked. */
export function firstUnlockedJtKeyForCategory(
  progress: LearnProgressState,
  category: string,
): string | null {
  for (let i = 0; i < READING_PASSAGES_JT.length; i++) {
    if (!isJtCarouselUnlocked(i, progress)) continue;
    if (READING_PASSAGES_JT[i]!.cat === category) {
      return `jt-${i}`;
    }
  }
  return null;
}
