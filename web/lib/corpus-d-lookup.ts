import type { McqItem } from "@/data/section-drill-types";
import type { CourseRootFamily } from "@/data/course-roots";
import {
  LEGACY_CORPUS_D,
  type LegacyCorpusEntry,
} from "@/data/corpus-d";

export type { LegacyCorpusEntry };

/** Count of lexicon rows (same as `D.length` in legacy HTML). */
export const LEGACY_CORPUS_D_LENGTH = LEGACY_CORPUS_D.length;

let byHebrew: Map<string, LegacyCorpusEntry> | null = null;

function corpusIndexByHebrew(): Map<string, LegacyCorpusEntry> {
  if (!byHebrew) {
    const m = new Map<string, LegacyCorpusEntry>();
    for (const w of LEGACY_CORPUS_D) {
      if (!m.has(w.h)) m.set(w.h, w);
    }
    byHebrew = m;
  }
  return byHebrew;
}

/** First dictionary row for this Hebrew headword (legacy `D.find(d => d.h === h)`). */
export function findCorpusEntryByHebrew(h: string): LegacyCorpusEntry | undefined {
  return corpusIndexByHebrew().get(h);
}

/** All rows with `l <= maxLevel` (legacy `vlv` / pool caps). */
export function corpusEntriesUpToLevel(maxLevel: number): LegacyCorpusEntry[] {
  return LEGACY_CORPUS_D.filter((w) => w.l <= maxLevel);
}

/**
 * Map subsection word ids (Hebrew strings) to full rows, same shape as legacy
 * `getSectionPool`: drops unknown headwords.
 */
export function resolveCorpusPoolFromHeadwords(
  headwords: readonly string[],
): LegacyCorpusEntry[] {
  const idx = corpusIndexByHebrew();
  const out: LegacyCorpusEntry[] = [];
  for (const h of headwords) {
    const w = idx.get(h);
    if (w) out.push(w);
  }
  return out;
}

export type CorpusDynamicRoot = {
  root: string;
  words: { h: string; p: string; e: string; l: number }[];
  lvMin: number;
};

/**
 * Legacy `getRootsForLevel`: roots that appear in `D` at or below `level` with
 * at least two distinct lemmas sharing `shoresh`.
 */
export function getDynamicCorpusRootsForLevel(level: number): CorpusDynamicRoot[] {
  const words = LEGACY_CORPUS_D.filter((w) => w.shoresh && w.l <= level);
  const byRoot = new Map<string, CorpusDynamicRoot>();

  for (const w of words) {
    const r = w.shoresh!;
    let bucket = byRoot.get(r);
    if (!bucket) {
      bucket = { root: r, words: [], lvMin: w.l };
      byRoot.set(r, bucket);
    }
    if (!bucket.words.some((x) => x.h === w.h)) {
      bucket.words.push({ h: w.h, p: w.p, e: w.e, l: w.l });
    }
    if (w.l < bucket.lvMin) bucket.lvMin = w.l;
  }

  return [...byRoot.values()]
    .filter((b) => b.words.length >= 2)
    .sort((a, b) => a.lvMin - b.lvMin);
}

/** Shape `CorpusDynamicRoot` for the same graduated drill UI as static `ROOTS`. */
export function corpusDynamicRootToCourseFamily(
  dyn: CorpusDynamicRoot,
): CourseRootFamily {
  return {
    root: dyn.root,
    meaning: `${dyn.words.length} lemmas · intro ≤ level ${dyn.lvMin}`,
    words: dyn.words.map((w) => ({ h: w.h, p: w.p, e: w.e })),
  };
}

/** Dict-derived root families (legacy `getRootsForLevel`), sorted by earliest lemma level. */
export function getDynamicCourseRootFamiliesForLevel(
  level: number,
): CourseRootFamily[] {
  return getDynamicCorpusRootsForLevel(level).map(corpusDynamicRootToCourseFamily);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Lowercase normalized gloss for de-duping option buttons. */
export function corpusGlossKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function glossSegments(s: string): string[] {
  return corpusGlossKey(s)
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);
}

/** True if any slash-separated gloss segment is shared (legacy MCQ uses full `e` strings). */
export function corpusGlossesShareSegment(a: string, b: string): boolean {
  const sa = glossSegments(a);
  const sb = glossSegments(b);
  for (const x of sa) {
    for (const y of sb) {
      if (x === y) return true;
    }
  }
  return false;
}

/**
 * English distractor glosses from lexicon `D`, mirroring legacy `dist(w, pool, n)`:
 * prefer same `l` as the prompt lemma, then other levels, all capped by `maxLevel`.
 */
export function pickCorpusEnglishDistractors(
  promptHe: string,
  correctEn: string,
  count: number,
  maxLevel: number,
  excludeGlossKeys?: ReadonlySet<string>,
): string[] {
  const entry = findCorpusEntryByHebrew(promptHe);
  const targetL = entry?.l ?? maxLevel;
  const pool = corpusEntriesUpToLevel(maxLevel).filter((x) => x.h !== promptHe);
  const sameLv = pool.filter((x) => x.l === targetL);
  const others = pool.filter((x) => x.l !== targetL);
  const ordered = shuffleArray([...sameLv, ...others]);

  const seen = new Set<string>();
  if (excludeGlossKeys) {
    for (const k of excludeGlossKeys) seen.add(k);
  } else {
    seen.add(corpusGlossKey(correctEn));
  }

  const out: string[] = [];
  for (const x of ordered) {
    const t = x.e.trim();
    if (!t) continue;
    const k = corpusGlossKey(t);
    if (seen.has(k)) continue;
    if (corpusGlossesShareSegment(t, correctEn)) continue;
    seen.add(k);
    out.push(t);
    if (out.length >= count) break;
  }
  return out;
}

/**
 * Four shuffled choices (1 correct + 3 wrong). Uses corpus `D` when
 * `corpusMaxLevel` is set; fills gaps from inline `distractorsEn`, then broader
 * corpus (up to level 4), then pure inline shuffle.
 */
export function buildMcqEnglishChoices(
  item: McqItem,
  corpusMaxLevel: number | undefined,
): string[] {
  const need = 3;
  if (
    item.choicesAreHebrew &&
    item.correctHe?.trim() &&
    (item.distractorsHe?.length ?? 0) >= need
  ) {
    return shuffleArray([
      item.correctHe.trim(),
      ...item.distractorsHe!.slice(0, need),
    ]);
  }
  const inlineOnly = () =>
    shuffleArray([item.correctEn, ...item.distractorsEn.slice(0, need)]);

  if (corpusMaxLevel === undefined) {
    return inlineOnly();
  }

  const used = new Set<string>([corpusGlossKey(item.correctEn)]);
  const wrong: string[] = [];

  const pushWrong = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    const k = corpusGlossKey(t);
    if (used.has(k)) return;
    if (corpusGlossesShareSegment(t, item.correctEn)) return;
    used.add(k);
    wrong.push(t);
  };

  for (const t of pickCorpusEnglishDistractors(
    item.promptHe,
    item.correctEn,
    need,
    corpusMaxLevel,
    used,
  )) {
    pushWrong(t);
  }

  for (const d of shuffleArray([...item.distractorsEn])) {
    if (wrong.length >= need) break;
    pushWrong(d);
  }

  if (wrong.length < need) {
    for (const t of pickCorpusEnglishDistractors(
      item.promptHe,
      item.correctEn,
      need - wrong.length + 2,
      Math.max(corpusMaxLevel, 4),
      used,
    )) {
      pushWrong(t);
      if (wrong.length >= need) break;
    }
  }

  if (wrong.length < need) {
    for (const x of shuffleArray(corpusEntriesUpToLevel(4))) {
      if (wrong.length >= need) break;
      if (x.h === item.promptHe) continue;
      pushWrong(x.e);
    }
  }

  if (wrong.length < need) {
    return inlineOnly();
  }

  return shuffleArray([item.correctEn, ...wrong.slice(0, need)]);
}
