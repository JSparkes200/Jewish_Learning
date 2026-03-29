import type { McqItem } from "@/data/section-drill-types";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Client-safe MCQ options (no corpus): correct + first three inline distractors, shuffled. */
export function buildInlineMcqChoices(item: McqItem): string[] {
  return shuffleArray([item.correctEn, ...item.distractorsEn.slice(0, 3)]);
}
