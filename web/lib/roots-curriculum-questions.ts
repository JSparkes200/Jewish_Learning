import type { CourseRootFamily, RootWordForm } from "@/data/course-roots";
import {
  englishMcqOptionsForRootWord,
  getRootTiers,
} from "@/lib/root-drill";

/** Short labels for tier MCQs (full copy lives on cards elsewhere). */
export const ROOT_TIER_MCQ_LABELS: Record<1 | 2 | 3, string> = {
  1: "Tier 1 — core verb forms (past / present / future / infinitive)",
  2: "Tier 2 — nouns and common derivatives",
  3: "Tier 3 — advanced or compound shapes",
};

export type RootsCurriculumQuestion =
  | {
      kind: "gloss";
      promptHe: string;
      options: string[];
      correctIndex: number;
      rootKey: string;
    }
  | {
      kind: "tier";
      promptHe: string;
      options: string[];
      correctIndex: number;
      rootKey: string;
      tier: 1 | 2 | 3;
    }
  | {
      kind: "pickRoot";
      promptHe: string;
      promptLine: string;
      options: string[];
      correctIndex: number;
      rootKey: string;
    }
  | {
      kind: "formForRoot";
      promptLine: string;
      options: string[];
      correctIndex: number;
      rootKey: string;
      promptHe: string;
    };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function flattenWords(families: readonly CourseRootFamily[]): RootWordForm[] {
  return families.flatMap((f) => f.words);
}

export function tierForWordInFamily(
  family: CourseRootFamily,
  word: RootWordForm,
): 1 | 2 | 3 {
  const [t1, t2, t3] = getRootTiers(family.words);
  if (t1.some((w) => w.h === word.h)) return 1;
  if (t2.some((w) => w.h === word.h)) return 2;
  if (t3.some((w) => w.h === word.h)) return 3;
  return 3;
}

function randomPick<T>(arr: readonly T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomPickFamilyWord(
  families: readonly CourseRootFamily[],
): { family: CourseRootFamily; word: RootWordForm } | null {
  const fam = randomPick(families);
  if (!fam?.words.length) return null;
  const word = randomPick(fam.words);
  if (!word) return null;
  return { family: fam, word };
}

function buildGloss(
  families: readonly CourseRootFamily[],
): RootsCurriculumQuestion | null {
  const pool = flattenWords(families);
  const picked = randomPickFamilyWord(families);
  if (!picked) return null;
  const { options, correctIndex } = englishMcqOptionsForRootWord(
    picked.word,
    pool,
  );
  return {
    kind: "gloss",
    promptHe: picked.word.h,
    options,
    correctIndex,
    rootKey: picked.family.root,
  };
}

function buildTier(
  families: readonly CourseRootFamily[],
): RootsCurriculumQuestion | null {
  const picked = randomPickFamilyWord(families);
  if (!picked) return null;
  const tier = tierForWordInFamily(picked.family, picked.word);
  const labels = ([1, 2, 3] as const).map((t) => ROOT_TIER_MCQ_LABELS[t]);
  const options = shuffle([...labels]);
  return {
    kind: "tier",
    promptHe: picked.word.h,
    options,
    correctIndex: options.indexOf(ROOT_TIER_MCQ_LABELS[tier]),
    rootKey: picked.family.root,
    tier,
  };
}

function buildPickRoot(
  families: readonly CourseRootFamily[],
): RootsCurriculumQuestion | null {
  const picked = randomPickFamilyWord(families);
  if (!picked) return null;
  const roots = [...new Set(families.map((f) => f.root))];
  if (roots.length < 2) return null;
  const wrong = shuffle(roots.filter((r) => r !== picked.family.root)).slice(
    0,
    3,
  );
  const opts = shuffle([picked.family.root, ...wrong]);
  return {
    kind: "pickRoot",
    promptHe: picked.word.h,
    promptLine: "Which shoresh (root) does this form belong to?",
    options: opts,
    correctIndex: opts.indexOf(picked.family.root),
    rootKey: picked.family.root,
  };
}

function buildFormForRoot(
  families: readonly CourseRootFamily[],
): RootsCurriculumQuestion | null {
  const picked = randomPickFamilyWord(families);
  if (!picked) return null;
  const pool = shuffle(
    flattenWords(families).filter((w) => w.h !== picked.word.h),
  );
  const options: string[] = [picked.word.h];
  for (const w of pool) {
    if (options.includes(w.h)) continue;
    options.push(w.h);
    if (options.length >= 4) break;
  }
  if (options.length < 4) return null;
  const shuffled = shuffle(options);
  return {
    kind: "formForRoot",
    promptLine: `Pick a form that belongs to the root ${picked.family.root} (${picked.family.meaning}).`,
    options: shuffled,
    correctIndex: shuffled.indexOf(picked.word.h),
    rootKey: picked.family.root,
    promptHe: picked.word.h,
  };
}

const BUILDERS = [
  buildGloss,
  buildTier,
  buildPickRoot,
  buildFormForRoot,
] as const;

function tryBuildMixed(
  families: readonly CourseRootFamily[],
  attempts = 24,
): RootsCurriculumQuestion | null {
  for (let i = 0; i < attempts; i++) {
    const b = randomPick([...BUILDERS]);
    if (!b) continue;
    const q = b(families);
    if (q && q.correctIndex >= 0) return q;
  }
  return buildGloss(families);
}

/**
 * Mixed battery for group test or checkpoint: gloss, tier ID, pick-root, form-for-root.
 */
export function buildRootsCurriculumQuestionSet(
  families: readonly CourseRootFamily[],
  count: number,
): RootsCurriculumQuestion[] {
  const out: RootsCurriculumQuestion[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 20) {
    guard++;
    const q = tryBuildMixed(families);
    if (!q) continue;
    const key =
      q.kind === "formForRoot"
        ? `${q.kind}:${q.promptLine}:${q.correctIndex}`
        : `${q.kind}:${q.promptHe}:${q.correctIndex}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
