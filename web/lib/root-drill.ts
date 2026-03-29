import type { CourseRootFamily, RootWordForm } from "@/data/course-roots";

/** Legacy `_getRootTiers` — split word list into three difficulty bands. */
export function getRootTiers(words: readonly RootWordForm[]): [
  RootWordForm[],
  RootWordForm[],
  RootWordForm[],
] {
  const n = words.length;
  if (!n) return [[], [], []];
  const t1 = Math.max(1, Math.ceil(n / 3));
  const t2 = Math.max(1, Math.ceil((n * 2) / 3));
  return [words.slice(0, t1), words.slice(t1, t2), words.slice(t2)];
}

export function getRootDrillInner(
  rootDrill: Record<string, Record<string, number>> | undefined,
  rootKey: string,
): Record<string, number> {
  return rootDrill?.[rootKey] ?? {};
}

export function isRootFamilyDrillComplete(
  family: CourseRootFamily,
  rootDrill: Record<string, Record<string, number>> | undefined,
): boolean {
  const words = family.words;
  if (!words.length) return true;
  const [t1, t2, t3] = getRootTiers(words);
  const prog = getRootDrillInner(rootDrill, family.root);
  const all = [...t1, ...t2, ...t3];
  return all.every((w) => (prog[w.h] ?? 0) >= 3);
}

export function getNextRootDrillWord(
  family: CourseRootFamily,
  rootDrill: Record<string, Record<string, number>> | undefined,
): { word: RootWordForm; tier: 1 | 2 | 3 } | null {
  const words = family.words;
  if (!words.length) return null;
  const [t1, t2, t3] = getRootTiers(words);
  const prog = getRootDrillInner(rootDrill, family.root);
  const needMore = (tier: RootWordForm[]) =>
    tier.filter((w) => (prog[w.h] ?? 0) < 3);

  const pick = (tier: RootWordForm[], label: 1 | 2 | 3) => {
    const pool = needMore(tier);
    if (!pool.length) return null;
    return {
      word: pool[Math.floor(Math.random() * pool.length)]!,
      tier: label,
    };
  };

  const a = pick(t1, 1);
  if (a) return a;
  const b = pick(t2, 2);
  if (b) return b;
  const c = pick(t3, 3);
  if (c) return c;

  const all = [...t1, ...t2, ...t3];
  const w = all[Math.floor(Math.random() * all.length)]!;
  const tier: 1 | 2 | 3 = t1.includes(w) ? 1 : t2.includes(w) ? 2 : 3;
  return { word: w, tier };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Legacy `openRootDrillGraduated`: three wrong English glosses from other forms
 * (different Hebrew and different English than the target).
 */
export function englishMcqOptionsForRootWord(
  target: RootWordForm,
  pool: readonly RootWordForm[],
  distractorCount = 3,
): { options: string[]; correctIndex: number } {
  const wrong = shuffle(
    pool.filter((x) => x.h !== target.h && x.e !== target.e),
  ).slice(0, distractorCount);
  const fallback = shuffle(
    pool.filter((x) => x.h !== target.h && !wrong.includes(x)),
  );
  while (wrong.length < distractorCount && fallback.length) {
    wrong.push(fallback.pop()!);
  }
  const options = shuffle([target.e, ...wrong.map((x) => x.e)]);
  return { options, correctIndex: options.indexOf(target.e) };
}

export function rootDrillSolidCount(
  family: CourseRootFamily,
  rootDrill: Record<string, Record<string, number>> | undefined,
): { solid: number; total: number } {
  const total = family.words.length;
  if (!total) return { solid: 0, total: 0 };
  const prog = getRootDrillInner(rootDrill, family.root);
  let solid = 0;
  for (const w of family.words) {
    if ((prog[w.h] ?? 0) >= 3) solid++;
  }
  return { solid, total };
}
