import type { LegacyCorpusEntry } from "@/data/corpus-d";
import type { McqDrillPack } from "@/data/section-drill-types";
import { getCourseSentence } from "@/data/course-sentences";
import {
  LEARN_VOICE,
  buildCorrectSentenceUserPrompt,
} from "@/lib/learn-user-voice";
import { pickCorpusRowsBiased } from "@/lib/study-practice-pool";

export type CorrectSentenceItem = {
  id: string;
  promptEn: string;
  optionsHe: string[];
  /** Full-line English for each shuffled option (same index as `optionsHe`). */
  optionsEn: string[];
  correctIndex: number;
  promptHe?: string;
  translit?: string;
  vibeNote?: string;
  shoresh?: string;
  streetVariant?: string;
};

export type CorrectSentencePack = {
  kind: "correct_sentence";
  title: string;
  intro?: string;
  items: CorrectSentenceItem[];
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function makeItem(
  id: string,
  level: number,
  targetHe: string,
  targetEn: string,
  wrongA: string,
  meta?: {
    translit?: string;
    vibeNote?: string;
    shoresh?: string;
  },
): CorrectSentenceItem | null {
  const courseSentence = getCourseSentence(targetHe);
  
  // If we don't have a hand-authored sentence for this word, we skip it
  // This ensures we only show grammatically correct, pedagogical sentences
  if (!courseSentence) return null;

  const pairs: { he: string; en: string }[] = [
    { he: courseSentence.correct, en: courseSentence.translationEn.correct },
    { he: courseSentence.wrongSemantics, en: courseSentence.translationEn.wrongSemantics },
    { he: courseSentence.wrongGrammar, en: courseSentence.translationEn.wrongGrammar },
    { he: courseSentence.wrongOrder, en: courseSentence.translationEn.wrongOrder },
  ];
  const order = shuffle([0, 1, 2, 3]);
  const optionsHe = order.map((i) => pairs[i]!.he);
  const optionsEn = order.map((i) => pairs[i]!.en);
  const correctIndex = order.indexOf(0);

  return {
    id,
    promptEn: buildCorrectSentenceUserPrompt(targetEn),
    optionsHe,
    optionsEn,
    correctIndex,
    promptHe: targetHe,
    translit: meta?.translit,
    vibeNote: meta?.vibeNote,
    shoresh: meta?.shoresh,
    streetVariant: courseSentence.streetVariant,
  };
}

export function buildCorrectSentencePackFromPool(
  pool: readonly LegacyCorpusEntry[],
  level: number,
  count = 6,
  preferredHebrew?: readonly string[],
): CorrectSentencePack | null {
  if (pool.length < 4) return null;
  const n = Math.min(count, pool.length);
  const shuffled = pickCorpusRowsBiased(pool, n, preferredHebrew);
  const items: CorrectSentenceItem[] = [];
  for (let i = 0; i < shuffled.length; i++) {
    const row = shuffled[i]!;
    const wrong = shuffled[(i + 1) % shuffled.length]!;
    if (!row.h?.trim() || !row.e?.trim()) continue;
    const item = makeItem(`pool-${i}`, level, row.h.trim(), row.e.trim(), wrong.h.trim(), {
      translit: row.p?.trim() || undefined,
      vibeNote: row.col?.trim() || undefined,
      shoresh: row.shoresh?.trim() || undefined,
    });
    if (item) items.push(item);
  }
  if (!items.length) return null;
  return {
    kind: "correct_sentence",
    title: LEARN_VOICE.correctSentenceTitle,
    intro: LEARN_VOICE.correctSentenceIntro,
    items,
  };
}

export function buildCorrectSentencePackFromMcq(
  pack: McqDrillPack,
  level: number,
  count = 6,
): CorrectSentencePack | null {
  if (!pack.items.length) return null;
  const rows = shuffle([...pack.items]).slice(0, Math.min(count, pack.items.length));
  const items: CorrectSentenceItem[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;
    const wrong = rows[(i + 1) % rows.length]!;
    const h = row.promptHe.trim();
    const e = row.correctEn.trim();
    if (!h || !e) continue;
    const item = makeItem(`sec-${row.id}-${i}`, level, h, e, wrong.promptHe.trim(), {
      translit: row.translit?.trim() || undefined,
      vibeNote: row.vibeNote?.trim() || undefined,
      shoresh: row.shoresh?.trim() || undefined,
    });
    if (item) items.push(item);
  }
  if (!items.length) return null;
  return {
    kind: "correct_sentence",
    title: `${pack.title} — ${LEARN_VOICE.correctSentenceTitle}`,
    intro: LEARN_VOICE.correctSentenceIntro,
    items,
  };
}
