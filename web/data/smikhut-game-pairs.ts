/**
 * Curated construct-state (סְמִיכוּת) pairs for the falling-pair game.
 */

import { stripNikkud } from "@/lib/hebrew-nikkud";

export type SmikhutPair = {
  id: string;
  base: string;
  modifier: string;
  correct: string;
  distractors: readonly string[];
  difficulty: 1 | 2 | 3;
  glossEn?: string;
};

export const SMIKHUT_GAME_PAIRS: readonly SmikhutPair[] = [
  {
    id: "bayit-sefer",
    base: "בַּיִת",
    modifier: "סֵפֶר",
    correct: "בֵּית־סֵפֶר",
    distractors: ["בַּיִת סֵפֶר", "בֵּית הַסֵּפֶר"],
    difficulty: 1,
    glossEn: "school (house of a book)",
  },
  {
    id: "yom-huledet",
    base: "יוֹם",
    modifier: "הוּלֶדֶת",
    correct: "יוֹם־הוּלֶדֶת",
    distractors: ["יוֹם הוּלֶדֶת", "יְמוֹת הוּלֶדֶת"],
    difficulty: 1,
    glossEn: "birthday",
  },
  {
    id: "mishpacha-simcha",
    base: "מִשְׁפָּחָה",
    modifier: "שִׂמְחָה",
    correct: "מִשְׁפַּחַת־שִׂמְחָה",
    distractors: ["מִשְׁפָּחָה שִׂמְחָה", "מִשְׁפַּחָה־שִׂמְחָה"],
    difficulty: 2,
    glossEn: "a happy family / family joy (construct)",
  },
  {
    id: "eshet-chayil",
    base: "אִשָּׁה",
    modifier: "חַיִל",
    correct: "אֵשֶׁת־חַיִל",
    distractors: ["אִשָּׁה חַיִל", "אִשְׁתּוֹ חַיִל"],
    difficulty: 2,
    glossEn: "woman of valor",
  },
  {
    id: "machaneh-kayitz",
    base: "מַחֲנֶה",
    modifier: "קַיִץ",
    correct: "מַחֲנֵה־קַיִץ",
    distractors: ["מַחֲנֶה קַיִץ", "מַחֲנוֹת קַיִץ"],
    difficulty: 2,
    glossEn: "summer camp",
  },
  {
    id: "sukkat-chag",
    base: "סֻכָּה",
    modifier: "חַג",
    correct: "סֻכַּת־חַג",
    distractors: ["סֻכָּה חַג", "סֻכּוֹת חַג"],
    difficulty: 2,
    glossEn: "holiday booth",
  },
  {
    id: "bitachon-leumi",
    base: "בִּטָּחוֹן",
    modifier: "לְאֹמִי",
    correct: "בִּטְחוֹן־לְאֹמִי",
    distractors: ["בִּטָּחוֹן לְאֹמִי", "בִּטְחוֹן לְאוּמִּי"],
    difficulty: 3,
    glossEn: "national security",
  },
  {
    id: "sefer-chok",
    base: "סֵפֶר",
    modifier: "חֹק",
    correct: "סֵפֶר־חֹק",
    distractors: ["סֵפֶר חֹק", "סִפְרֵי חֹק"],
    difficulty: 3,
    glossEn: "law book / statute book",
  },
];

const MAQAF = "\u05BE";

export function normalizeSmikhutPhrase(s: string): string {
  return s
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/-/g, MAQAF);
}

export function smikhutAnswerMatches(choice: string, correct: string): boolean {
  const a = normalizeSmikhutPhrase(choice);
  const b = normalizeSmikhutPhrase(correct);
  if (a === b) return true;
  return stripNikkud(a) === stripNikkud(b);
}

export function smikhutPairsForMaxDifficulty(
  maxDifficulty: 1 | 2 | 3,
): SmikhutPair[] {
  return SMIKHUT_GAME_PAIRS.filter((p) => p.difficulty <= maxDifficulty);
}

export function pickRandomSmikhutPair(
  maxDifficulty: 1 | 2 | 3,
  rng: () => number = Math.random,
): SmikhutPair | null {
  const pool = smikhutPairsForMaxDifficulty(maxDifficulty);
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)]!;
}
