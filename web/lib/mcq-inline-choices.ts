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

/** Hebrew answer choices: correctHe + first three distractorsHe, shuffled. */
export function buildInlineMcqHebrewChoices(item: McqItem): string[] {
  const c = item.correctHe?.trim();
  const d = item.distractorsHe ?? [];
  if (!c || d.length < 3) {
    return buildInlineMcqChoices(item);
  }
  return shuffleArray([c, ...d.slice(0, 3)]);
}
