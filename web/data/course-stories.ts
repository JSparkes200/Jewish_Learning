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
        promptHe: "לֶחֶם",
        correctEn: "Bread",
        distractorsEn: ["Water", "Book", "Chair"],
      },
      {
        id: "st2-4",
        promptHe: "מַיִם",
        correctEn: "Water",
        distractorsEn: ["Bread", "Milk", "Wine"],
      },
      {
        id: "st2-5",
        promptHe: "חָבֵר",
        correctEn: "Friend (m.)",
        distractorsEn: ["Teacher", "Stranger", "Brother"],
      },
      {
        id: "st2-6",
        promptHe: "דִּבַּרְנוּ הַרְבֵּה",
        correctEn: "We talked a lot",
        distractorsEn: ["We slept a lot", "We ran away", "We said nothing"],
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
        promptHe: "שַׁבָּת",
        correctEn: "Sabbath / Shabbat",
        distractorsEn: ["Weekday", "Holiday only Purim", "Fast day"],
      },
      {
        id: "st3-2",
        promptHe: "מִתְכַּנְּסִים",
        correctEn: "We gather (hitpa'el)",
        distractorsEn: ["We scatter", "We sleep", "We argue"],
      },
      {
        id: "st3-3",
        promptHe: "קוֹרֵא תּוֹרָה",
        correctEn: "Reads Torah",
        distractorsEn: ["Writes a letter", "Sells bread", "Runs home"],
      },
      {
        id: "st3-4",
        promptHe: "מְבָרֶכֶת אֶת הַנֵּרוֹת",
        correctEn: "Blesses the candles",
        distractorsEn: ["Blows out candles", "Buys candles", "Breaks candles"],
      },
      {
        id: "st3-5",
        promptHe: "שָׁלוֹם",
        correctEn: "Peace / hello",
        distractorsEn: ["War", "Anger", "Silence only"],
      },
      {
        id: "st3-6",
        promptHe: "אַהֲבָה",
        correctEn: "Love",
        distractorsEn: ["Hatred", "Fear", "Debt"],
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
        promptHe: "מֶמְשָׁלָה",
        correctEn: "Government",
        distractorsEn: ["Newspaper", "School", "Theater"],
      },
      {
        id: "st4-2",
        promptHe: "תַּקְצִיב",
        correctEn: "Budget",
        distractorsEn: ["Headline", "Recipe", "Poem"],
      },
      {
        id: "st4-3",
        promptHe: "חִינּוּךְ",
        correctEn: "Education",
        distractorsEn: ["Transport", "Cooking", "Sports"],
      },
      {
        id: "st4-4",
        promptHe: "אוֹפּוֹזִיצְיָה",
        correctEn: "Opposition (political)",
        distractorsEn: ["Government only", "Audience", "Weather"],
      },
      {
        id: "st4-5",
        promptHe: "בְּעֶרֶךְ",
        correctEn: "Approximately / more or less",
        distractorsEn: ["Exactly", "Never", "Tomorrow"],
      },
      {
        id: "st4-6",
        promptHe: "הִשְׁתַּפֵּר",
        correctEn: "Improved (hitpa'el)",
        distractorsEn: ["Got worse", "Stayed silent", "Was sold"],
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
