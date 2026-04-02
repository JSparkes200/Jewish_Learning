import type { ComprehensionPassage } from "@/data/course-comprehension";
import type { McqDrillPack } from "@/data/section-drill-types";

export type DrillPrepCard = {
  he?: string;
  en: string;
  note?: string;
};

export function buildPrepCardsFromMcqPack(
  pack: McqDrillPack | null | undefined,
  take = 6,
): DrillPrepCard[] {
  if (!pack) return [];
  return pack.items.slice(0, take).map((it) => ({
    he: it.promptHe,
    en: it.correctEn,
  }));
}

export function buildPrepCardsFromComprehension(
  passage: ComprehensionPassage | null | undefined,
  take = 4,
): DrillPrepCard[] {
  if (!passage) return [];
  const qs = passage.questions.slice(0, take).map((q) => ({
    en: q.q,
    note: q.note,
  }));
  return [
    {
      en: passage.e,
      note: "Read this translation first, then listen/tap Hebrew words.",
    },
    ...qs,
  ];
}

export function sectionGrammarHint(level: number, sectionType?: string): string {
  if (sectionType === "roots") {
    return "Focus on root-pattern families (shoresh + binyan).";
  }
  if (sectionType === "numbers") {
    return "Watch number-gender forms and fixed counting patterns.";
  }
  if (sectionType === "comprehension") {
    return "Track connectors and sentence roles before answering.";
  }
  if (level <= 2) {
    return "Focus on clear word meanings and simple sentence order.";
  }
  if (level === 3) {
    return "Watch register shifts and interpretation vocabulary.";
  }
  return "Track formal connectors, nuance, and argument structure.";
}
