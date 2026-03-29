/**
 * Foundation track: Aleph–Dalet (roughly A0→A2). Same four levels as the legacy
 * HTML app, reframed as one continuous beginner path before the post-foundation
 * bridge and specialty badges. Section ids stay stable for progress + drills.
 */

import { getMasteryWordListForLevel } from "./course-mastery-words";

export type CourseLevel = {
  n: number;
  label: string;
  icon: string;
  hex: string;
  desc: string;
};

export const COURSE_LEVELS: CourseLevel[] = [
  {
    n: 1,
    label: "Aleph — Sounds & survival Hebrew",
    icon: "א",
    hex: "#4a6830",
    desc: "Decode voweled text, greetings, pronouns, numbers, home & daily nouns, core infinitives",
  },
  {
    n: 2,
    label: "Bet — Grammar in real life",
    icon: "ב",
    hex: "#c87020",
    desc: "Agreement, present-time verbs, colloquial speech, short blessings & tradition hooks, first comprehension gates",
  },
  {
    n: 3,
    label: "Gimel — Longer reading & patterns",
    icon: "ג",
    hex: "#8B3A1A",
    desc: "Richer passages, Jewish core vocabulary, roots, and guided comprehension",
  },
  {
    n: 4,
    label: "Dalet — Foundation milestone",
    icon: "ד",
    hex: "#6a1828",
    desc: "Press- and essay-style register as synthesis: longer texts, connectors, argument — cap before exit exams & bridge",
  },
];

/**
 * Entries in the main dictionary (`corpus-d`) tagged at this level — lookup scope,
 * not the number of words you must memorize in lessons.
 */
export const CORPUS_COUNTS: Record<number, number> = {
  1: 4342,
  2: 1805,
  3: 611,
  4: 350,
};

/** Lemmas/phrases this level’s drills & mastery gates actually use (dynamic). */
export function courseDrillLemmaCount(level: number): number {
  return getMasteryWordListForLevel(level).length;
}

/** Primary stats line for Learn UI: course focus vs dictionary breadth. */
export function courseLevelProgressLabel(level: number): string {
  const lemmas = courseDrillLemmaCount(level);
  const dict = CORPUS_COUNTS[level];
  if (dict == null) {
    return `${lemmas} lemmas in drills & gates`;
  }
  return `${lemmas} lemmas in drills & gates · ${dict.toLocaleString()} dictionary entries tagged for lookup`;
}

/** Short second line: explains corpus size without sounding like a quota. */
export function courseDictionaryLookupNote(level: number): string {
  const dict = CORPUS_COUNTS[level];
  if (dict == null) return "";
  return `${dict.toLocaleString()} additional dictionary entries share this level tag for reference.`;
}

/** @deprecated Prefer {@link courseLevelProgressLabel} in learner-facing UI. */
export function corpusLabel(n: number): string {
  const c = CORPUS_COUNTS[n];
  if (c == null) return "";
  return `${c.toLocaleString()} tagged entries in the app corpus`;
}

/** Intro copy for the Learn home (foundation track). */
export const FOUNDATION_TRACK_INTRO =
  "Alef–Dalet is the foundation track: voweled reading, core grammar, and daily-life Hebrew. Drills center on a focused lemma set per level; the larger dictionary numbers are lookup scope, not a memorization target. After Dalet you’ll move to foundation exit checks, the bridge, and specialty badges.";

export type SectionMeta = {
  id: string;
  label: string;
  /** read | numbers | roots | comprehension — word drills default */
  type?: "read" | "numbers" | "roots" | "comprehension";
  /** Legacy: all listed section ids must be completed (any level id). */
  unlockIds?: string[];
  /**
   * Legacy: `courseLevelMasteredCount` (words in corpus at level with lv≥2).
   * Next app: max(completed subsections on this level, course target words with
   * `vocabLevels[h]≥2` when `vocabLevels` exists — else subsection proxy only).
   */
  unlockMastered?: number;
  /** Legacy: number of subsections before this index that are completed (alternative to linear prev). */
  unlockAfter?: number;
  /**
   * Hebrew vowel points shown by default for this lesson’s exercises; learner
   * can toggle for the current screen only. Ramp: Aleph–early Bet on, off by Dalet.
   */
  defaultShowNikkud?: boolean;
};

/** Level 1 explicit path (legacy `getCourseSections(1)` ids preserved). */
export const LEVEL_1_SECTIONS: SectionMeta[] = [
  { id: "1-1", label: "Greetings & שָׁלוֹם", defaultShowNikkud: true },
  { id: "1-2", label: "Yes / no & politeness", defaultShowNikkud: true },
  /** Placed after greetings & politeness so learners have a small word set first. */
  { id: "1-read", label: "📖 First story (voweled)", type: "read", defaultShowNikkud: true },
  { id: "1-3", label: "Morning, evening, partings", defaultShowNikkud: true },
  { id: "1-4", label: "Pronouns — אֲנִי, אַתָּה, …", defaultShowNikkud: true },
  { id: "1-5", label: "This / these — זֶה, אֵלֶּה", defaultShowNikkud: true },
  { id: "1-6", label: "Numbers 0–10", defaultShowNikkud: true },
  { id: "1-nums", label: "🔢 Numbers drill", type: "numbers", defaultShowNikkud: true },
  { id: "1-7", label: "Tens, hundred, thousand", defaultShowNikkud: true },
  { id: "1-8", label: "Family", defaultShowNikkud: true },
  { id: "1-9", label: "Size & color", defaultShowNikkud: true },
  { id: "1-10", label: "Body & home", defaultShowNikkud: true },
  { id: "1-11", label: "Questions & time words", defaultShowNikkud: true },
  { id: "1-12", label: "Food & nature", defaultShowNikkud: true },
  { id: "1-13", label: "Core verbs — לִ… infinitives", defaultShowNikkud: true },
  { id: "1-14", label: "Common expressions", defaultShowNikkud: true },
];

/** Subsection index for levels 2–4 (ids + unlocks stable; labels = foundation framing). */
export const LEVEL_BLENDED_INDEX: Record<number, SectionMeta[]> = {
  2: [
    { id: "2-modern-1", label: "Colloquial Hebrew — everyday situations (1)", defaultShowNikkud: true },
    { id: "2-modern-2", label: "Colloquial Hebrew — people & character (2)", defaultShowNikkud: true },
    { id: "2-text-1", label: "Short traditional texts — prayer & blessing", defaultShowNikkud: true },
    { id: "2-text-2", label: "Short traditional texts — ethics & memory", defaultShowNikkud: true },
    { id: "2-bridge", label: "Bet checkpoint — grammar, practice & roots intro", defaultShowNikkud: true },
    {
      id: "2-roots",
      label: "שׁ Roots across time",
      type: "roots",
      unlockIds: ["2-bridge"],
      defaultShowNikkud: false,
    },
    {
      id: "2-comp",
      label: "📚 Comprehension — home, practice & blessing",
      type: "comprehension",
      unlockIds: ["2-modern-2", "2-text-2", "2-bridge"],
      unlockMastered: 8,
      defaultShowNikkud: false,
    },
    {
      id: "2-comp-2",
      label: "📚 Comprehension — custom, guidance & home",
      type: "comprehension",
      unlockMastered: 10,
      defaultShowNikkud: false,
    },
  ],
  3: [
    { id: "3-ethics-1", label: "Ideas in text — truth, justice, wisdom", defaultShowNikkud: true },
    { id: "3-ethics-2", label: "Ideas in text — hope, return, redemption", defaultShowNikkud: true },
    { id: "3-text-1", label: "Torah-study language — phrases & register", defaultShowNikkud: true },
    { id: "3-text-2", label: "Ritual & place — vocabulary in context", defaultShowNikkud: true },
    { id: "3-bridge", label: "Gimel checkpoint — grammar, roots & reading", defaultShowNikkud: false },
    {
      id: "3-roots",
      label: "שׁ Roots & word patterns",
      type: "roots",
      unlockIds: ["3-bridge"],
      defaultShowNikkud: false,
    },
    {
      id: "3-comp",
      label: "📚 Comprehension — text, meaning & return",
      type: "comprehension",
      unlockIds: ["3-ethics-2", "3-text-2", "3-bridge"],
      unlockMastered: 10,
      defaultShowNikkud: false,
    },
    {
      id: "3-comp-2",
      label: "📚 Comprehension — halakhah, commentary & repair",
      type: "comprehension",
      unlockMastered: 12,
      defaultShowNikkud: false,
    },
  ],
  4: [
    { id: "4-public-1", label: "Formal & media Hebrew — public voice (1)", defaultShowNikkud: false },
    { id: "4-public-2", label: "Formal & media Hebrew — law & civic language (2)", defaultShowNikkud: false },
    { id: "4-public-3", label: "Formal & media Hebrew — economy & policy (3)", defaultShowNikkud: false },
    { id: "4-text-1", label: "Narrative & revival — history in modern prose", defaultShowNikkud: false },
    { id: "4-bridge", label: "Dalet checkpoint — formulation & depth", defaultShowNikkud: false },
    { id: "4-nuance", label: "Connectors & argument — foundation capstone", defaultShowNikkud: false },
    {
      id: "4-roots",
      label: "שׁ Advanced roots & register",
      type: "roots",
      unlockIds: ["4-bridge"],
      defaultShowNikkud: false,
    },
    {
      id: "4-comp",
      label: "📚 Comprehension — editorial tone & nuance",
      type: "comprehension",
      unlockIds: ["4-public-3", "4-text-1", "4-bridge", "4-nuance"],
      unlockMastered: 12,
      defaultShowNikkud: false,
    },
    {
      id: "4-comp-2",
      label: "📚 Comprehension — law, history & argument",
      type: "comprehension",
      unlockMastered: 14,
      defaultShowNikkud: false,
    },
  ],
};

/** Lesson default for nikkud when toggling Hebrew display; falls back to on. */
export function sectionDefaultShowNikkud(sec: SectionMeta): boolean {
  return sec.defaultShowNikkud !== false;
}

/** Level story page (`/learn/[n]/story`): aligned with early foundation on, later off. */
export function storyPageDefaultShowNikkud(level: number): boolean {
  return level <= 2;
}

export function getSectionsForLevel(level: number): SectionMeta[] {
  if (level === 1) return LEVEL_1_SECTIONS;
  return LEVEL_BLENDED_INDEX[level] ?? [];
}

/** Highest `unlockMastered` on this level (for progress UI hints). */
export function maxUnlockMasteredRequirementForLevel(
  level: number,
): number | undefined {
  const sections = getSectionsForLevel(level);
  let max: number | undefined;
  for (const s of sections) {
    if (s.unlockMastered != null) {
      max =
        max == null ? s.unlockMastered : Math.max(max, s.unlockMastered);
    }
  }
  return max;
}

/** Aleph story (legacy `LVS[0].story`) for read-the-story preview. */
export const LEVEL_1_STORY = {
  he: "דָּנִי הוּא יֶלֶד קָטָן. הוּא אוֹמֵר שָׁלוֹם לְכֻלָּם. שָׁלוֹם אִמָּא! שָׁלוֹם אַבָּא! כֻּלָּם אוֹהֲבִים אֶת דָּנִי.",
  en: "Dani is a small boy. He says hello to everyone. Hello mom! Hello dad! Everyone loves Dani.",
} as const;
