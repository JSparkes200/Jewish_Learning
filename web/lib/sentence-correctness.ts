import type { LegacyCorpusEntry } from "@/data/corpus-d";
import type { McqDrillPack } from "@/data/section-drill-types";
import { pickCorpusRowsBiased } from "@/lib/study-practice-pool";

export type CorrectSentenceItem = {
  id: string;
  promptEn: string;
  optionsHe: string[];
  correctIndex: number;
  promptHe?: string;
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

function sentenceFrame(level: number, targetHe: string): string {
  if (level <= 1) return `אֲנִי רוֹאֶה ${targetHe} הַיּוֹם.`;
  if (level === 2) return `בַּשִּׁעוּר אֲנַחְנוּ מִתְרַגְּלִים אֶת ${targetHe}.`;
  if (level === 3) return `בַּקֶּטַע הַזֶּה, הַמֻּנָּח ${targetHe} חָשׁוּב לַהֲבָנָה.`;
  return `בְּהֶקְשֵׁר פוֹרְמָלִי, הַבִּטּוּי ${targetHe} מְחַיֵּב דִּיּוּק.`;
}

function malformedVariant(targetHe: string): string {
  return `אֲנִי אֲנִי רוֹאֶה ${targetHe} הַיּוֹם.`;
}

function wrongOrderVariant(targetHe: string): string {
  return `${targetHe} אֲנִי הַיּוֹם רוֹאֶה אֶת.`;
}

function makeItem(
  id: string,
  level: number,
  targetHe: string,
  targetEn: string,
  wrongA: string,
): CorrectSentenceItem {
  const correct = sentenceFrame(level, targetHe);
  const wrongSemantics = sentenceFrame(level, wrongA);
  const options = shuffle([
    correct,
    wrongSemantics,
    malformedVariant(targetHe),
    wrongOrderVariant(targetHe),
  ]);
  return {
    id,
    promptEn: `Pick the sentence that correctly uses: "${targetEn}".`,
    optionsHe: options,
    correctIndex: options.indexOf(correct),
    promptHe: targetHe,
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
    items.push(makeItem(`pool-${i}`, level, row.h.trim(), row.e.trim(), wrong.h.trim()));
  }
  if (!items.length) return null;
  return {
    kind: "correct_sentence",
    title: "Correct sentence",
    intro: "One sentence is correct for the English cue; three include word or grammar errors.",
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
    items.push(makeItem(`sec-${row.id}-${i}`, level, h, e, wrong.promptHe.trim()));
  }
  if (!items.length) return null;
  return {
    kind: "correct_sentence",
    title: `${pack.title} — correct sentence`,
    intro: "Use meaning + structure: choose the single well-formed sentence.",
    items,
  };
}
