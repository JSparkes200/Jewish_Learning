import type { LegacyCorpusEntry } from "@/data/corpus-d";
import { getMasteryWordListForLevel } from "@/data/course-mastery-words";
import type { McqItem } from "@/data/section-drill-types";
import {
  corpusEntriesUpToLevel,
  findCorpusEntryByHebrew,
  pickCorpusEnglishDistractors,
} from "@/lib/corpus-d-lookup";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Prefer corpus rows whose Hebrew appears in `preferredHebrew`, then fill from the rest.
 */
export function pickCorpusRowsBiased(
  pool: readonly LegacyCorpusEntry[],
  count: number,
  preferredHebrew?: readonly string[],
): LegacyCorpusEntry[] {
  if (!pool.length || count <= 0) return [];
  if (!preferredHebrew?.length) {
    return shuffle([...pool]).slice(0, Math.min(count, pool.length));
  }
  const pref = new Set(preferredHebrew.map((p) => p.trim()).filter(Boolean));
  const pri = pool.filter((w) => pref.has(w.h.trim()));
  const rest = pool.filter((w) => !pref.has(w.h.trim()));
  const shPri = shuffle([...pri]);
  const shRest = shuffle([...rest]);
  const seen = new Set<string>();
  const out: LegacyCorpusEntry[] = [];
  for (const w of [...shPri, ...shRest]) {
    const h = w.h.trim();
    if (!h || seen.has(h)) continue;
    seen.add(h);
    out.push(w);
    if (out.length >= count) break;
  }
  return out;
}

/**
 * Mixed pool for Study practice: corpus rows up to `level` plus course MCQ lemmas
 * resolved through `D` (legacy `vlv` + course list idea).
 */
export function buildStudyPracticePool(level: number): LegacyCorpusEntry[] {
  const byH = new Map<string, LegacyCorpusEntry>();
  for (const w of corpusEntriesUpToLevel(level)) {
    if (w.h?.trim()) byH.set(w.h.trim(), w);
  }
  for (const h of getMasteryWordListForLevel(level)) {
    const key = h.trim();
    if (!key || byH.has(key)) continue;
    const row = findCorpusEntryByHebrew(key);
    if (row && row.l <= level) byH.set(key, row);
  }
  return [...byH.values()];
}

export function legacyRowToMcqItem(
  w: LegacyCorpusEntry,
  id: string,
  maxLevel: number,
): McqItem {
  const correctEn = w.e.trim();
  const wrong = pickCorpusEnglishDistractors(w.h, correctEn, 3, maxLevel);
  const out = [...wrong];
  const pool = corpusEntriesUpToLevel(maxLevel).filter((x) => x.h !== w.h);
  let guard = 0;
  while (out.length < 3 && pool.length && guard++ < 120) {
    const x = pool[Math.floor(Math.random() * pool.length)]!;
    const t = x.e.trim();
    if (t && t !== correctEn && !out.includes(t)) out.push(t);
  }
  const glossPool = pool.map((x) => x.e.trim()).filter(Boolean);
  while (out.length < 3 && glossPool.length) {
    const t = glossPool[Math.floor(Math.random() * glossPool.length)]!;
    if (t !== correctEn && !out.includes(t)) out.push(t);
  }
  return {
    id,
    promptHe: w.h,
    correctEn,
    distractorsEn: out.slice(0, 3),
  };
}

export type StudyPoolPickOpts = {
  preferredHebrew?: readonly string[];
};

/** Random subset for a short MCQ pack; optional bias toward due / review lemmas. */
export function pickMcqItemsFromPool(
  pool: readonly LegacyCorpusEntry[],
  count: number,
  maxLevel: number,
  opts?: StudyPoolPickOpts,
): McqItem[] {
  if (!pool.length) return [];
  const rows = pickCorpusRowsBiased(pool, count, opts?.preferredHebrew);
  return rows.map((w, i) => legacyRowToMcqItem(w, `sp-${i}-${w.h}`, maxLevel));
}

export type FillRound = {
  target: LegacyCorpusEntry;
  optionsHe: string[];
  correctIndex: number;
};

export function buildFillRound(
  pool: readonly LegacyCorpusEntry[],
  opts?: StudyPoolPickOpts,
): FillRound | null {
  if (pool.length < 4) return null;
  const pref = opts?.preferredHebrew?.length
    ? new Set(opts.preferredHebrew.map((p) => p.trim()).filter(Boolean))
    : null;
  const candidates = pref?.size
    ? pool.filter((x) => pref!.has(x.h.trim()))
    : null;
  const targetPool =
    candidates && candidates.length > 0 ? candidates : pool;
  const target = targetPool[Math.floor(Math.random() * targetPool.length)]!;
  const others = shuffle(pool.filter((x) => x.h !== target.h))
    .slice(0, 3)
    .map((x) => x.h);
  const optionsHe = shuffle([target.h, ...others]);
  return {
    target,
    optionsHe,
    correctIndex: optionsHe.indexOf(target.h),
  };
}

export type TapRound = {
  target: LegacyCorpusEntry;
  optionsHe: string[];
  correctIndex: number;
};

/**
 * Reverse prompt round for "tap the word":
 * show English gloss, pick matching Hebrew option.
 */
export function buildTapRound(
  pool: readonly LegacyCorpusEntry[],
  opts?: StudyPoolPickOpts,
): TapRound | null {
  if (pool.length < 6) return null;
  const pref = opts?.preferredHebrew?.length
    ? new Set(opts.preferredHebrew.map((p) => p.trim()).filter(Boolean))
    : null;
  const candidates = pref?.size
    ? pool.filter((x) => pref!.has(x.h.trim()))
    : null;
  const targetPool =
    candidates && candidates.length > 0 ? candidates : pool;
  const target = targetPool[Math.floor(Math.random() * targetPool.length)]!;
  const others = shuffle(pool.filter((x) => x.h !== target.h))
    .slice(0, 5)
    .map((x) => x.h);
  const optionsHe = shuffle([target.h, ...others]);
  return {
    target,
    optionsHe,
    correctIndex: optionsHe.indexOf(target.h),
  };
}
