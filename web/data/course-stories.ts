import type { SectionMeta } from "@/data/course";
import { getCurriculumStory } from "@/data/learn-stories";
import type { McqDrillPack } from "@/data/section-drill-types";

/**
 * Complete these subsections before the level story shortcut appears in the level
 * list (Bet–Dalet). Aleph omits this — the canonical first story is section
 * `1-read`, after greetings & politeness in the Aleph list.
 */
export const LEVEL_STORY_SHORTCUT_PREREQUISITE_IDS: Record<number, string[]> = {
  2: ["2-modern-1", "2-modern-2"],
  3: ["3-ethics-1", "3-ethics-2"],
  4: ["4-public-1", "4-public-2"],
};

/** Inline `/learn/[n]/story` row on the level page (not used on Aleph). */
export function shouldShowLevelStoryShortcut(
  level: number,
  completedSections: Record<string, boolean>,
): boolean {
  if (level === 1) return false;
  const ids = LEVEL_STORY_SHORTCUT_PREREQUISITE_IDS[level];
  if (!ids?.length) return false;
  return ids.every((id) => completedSections[id]);
}

/** Index of the last prerequisite section — insert the story row after this item. */
export function getLevelStoryShortcutInsertAfterIndex(
  level: number,
  sections: SectionMeta[],
): number | null {
  const ids = LEVEL_STORY_SHORTCUT_PREREQUISITE_IDS[level];
  if (!ids?.length) return null;
  const lastId = ids[ids.length - 1];
  const idx = sections.findIndex((s) => s.id === lastId);
  return idx >= 0 ? idx : null;
}

/** Mini-quiz after each level story (levels 2–4). Level 1 uses `1-read` in section-drills. */
const STORY_MCQ_PACKS: Record<number, McqDrillPack> = {
  2: {
    kind: "mcq",
    title: "Story check — market Hebrew",
    intro: "Words from the level 2 story passage.",
    items: [
      {
        id: "st2-1",
        promptHe: "אֶתְמוֹל",
        correctEn: "Yesterday",
        distractorsEn: ["Today", "Tomorrow", "Never"],
      },
      {
        id: "st2-2",
        promptHe: "שׁוּק",
        correctEn: "Market",
        distractorsEn: ["School", "Hospital", "Office"],
      },
      {
        id: "st2-3",
        promptHe: "פֵּרוֹת",
        correctEn: "Fruits",
        distractorsEn: ["Vegetables", "Books", "Chairs"],
      },
      {
        id: "st2-4",
        promptHe: "יְרָקוֹת",
        correctEn: "Vegetables",
        distractorsEn: ["Fruits", "Milk", "Wine"],
      },
      {
        id: "st2-5",
        promptHe: "נֶחְמָדִים",
        correctEn: "Nice (m. pl.)",
        distractorsEn: ["Angry", "Strange", "Boring"],
      },
      {
        id: "st2-6",
        promptHe: "בְּבֵית קָפֶה",
        correctEn: "In a cafe",
        distractorsEn: ["In a library", "At the beach", "In a car"],
      },
    ],
  },
  3: {
    kind: "mcq",
    title: "Story check — Shabbat home",
    intro: "Words from the level 3 story passage.",
    items: [
      {
        id: "st3-1",
        promptHe: "מִשְׁפָּחָה",
        correctEn: "Family",
        distractorsEn: ["Friends", "Neighbors", "Strangers"],
      },
      {
        id: "st3-2",
        promptHe: "מִתְכַּנֶּסֶת",
        correctEn: "Gathers (f. sg.)",
        distractorsEn: ["Scatters", "Sleeps", "Argues"],
      },
      {
        id: "st3-3",
        promptHe: "סָבִיב",
        correctEn: "Around",
        distractorsEn: ["Under", "Above", "Inside"],
      },
      {
        id: "st3-4",
        promptHe: "מְקַדֵּשׁ",
        correctEn: "Makes Kiddush / sanctifies",
        distractorsEn: ["Drinks water", "Eats bread", "Sings loudly"],
      },
      {
        id: "st3-5",
        promptHe: "טְעִימָה",
        correctEn: "Tasty (f.)",
        distractorsEn: ["Cold", "Boring", "Expensive"],
      },
      {
        id: "st3-6",
        promptHe: "שַׁלְוָה",
        correctEn: "Tranquility",
        distractorsEn: ["Noise", "Fear", "Debt"],
      },
    ],
  },
  4: {
    kind: "mcq",
    title: "Story check — public Hebrew",
    intro: "Words from the level 4 story passage.",
    items: [
      {
        id: "st4-1",
        promptHe: "הִצְהִירָה",
        correctEn: "Announced / declared (f. sg.)",
        distractorsEn: ["Hid", "Forgot", "Whispered"],
      },
      {
        id: "st4-2",
        promptHe: "תָּכְנִית",
        correctEn: "Plan / program",
        distractorsEn: ["Headline", "Recipe", "Poem"],
      },
      {
        id: "st4-3",
        promptHe: "לְשִׁפּוּר",
        correctEn: "For the improvement of",
        distractorsEn: ["For the destruction of", "For the sale of", "For the hiding of"],
      },
      {
        id: "st4-4",
        promptHe: "לְהַקְצוֹת",
        correctEn: "To allocate",
        distractorsEn: ["To steal", "To ignore", "To paint"],
      },
      {
        id: "st4-5",
        promptHe: "לַמְרוֹת זֹאת",
        correctEn: "Despite this",
        distractorsEn: ["Because of this", "In addition", "Before this"],
      },
      {
        id: "st4-6",
        promptHe: "הַבְטָחַת בְּחִירוֹת",
        correctEn: "Election promise",
        distractorsEn: ["Weather forecast", "Movie ticket", "School test"],
      },
    ],
  },
};

export function getStoryMcqPack(level: number): McqDrillPack | null {
  return STORY_MCQ_PACKS[level] ?? null;
}

export function getStoryForLevel(level: number): { he: string; en: string } | null {
  const s = getCurriculumStory(level);
  return s ? { he: s.he, en: s.en } : null;
}

export { getStorySyntaxNotes } from "@/data/learn-stories";
