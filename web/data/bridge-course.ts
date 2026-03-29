/**
 * Full bridge module: four study units (read + practice) then a final checkpoint exam.
 * Unit completion is stored in {@link LearnProgressState.bridgeUnitsCompleted}.
 */

import type { McqDrillPack } from "./section-drill-types";

export type BridgeUnit = {
  id: string;
  title: string;
  intro: string;
  /** Main passage (nikkud shown; learners can use page toggle where wired). */
  he: string;
  en: string;
  practicePack: McqDrillPack;
};

const pack = (
  unit: string,
  title: string,
  intro: string,
  items: McqDrillPack["items"],
): McqDrillPack => ({
  kind: "mcq",
  title,
  intro,
  items,
});

export const BRIDGE_UNITS: readonly BridgeUnit[] = [
  {
    id: "bridge-u1",
    title: "Register & classroom Hebrew",
    intro:
      "Everyday schoolroom Hebrew mixes formal instruction with friendly address — typical of real classes in Israel.",
    he: "שָׁלוֹם! אֵיךְ אַתֶּם מַרְגִּישִׁים הַיּוֹם בַּכִּתָּה? נַתְחִיל בְּסִפּוּר קָצָר, וְאַחַר כָּךְ נַעֲשֶׂה תַּרְגִּיל קָטָן.",
    en: "Hello! How are you all feeling today in class? We’ll start with a short story, and then we’ll do a small exercise.",
    practicePack: pack(
      "u1",
      "Unit 1 — check",
      "Vocabulary and tone from the passage above.",
      [
        {
          id: "bridge-u1-1",
          promptHe: "בַּכִּתָּה means roughly:",
          correctEn: "in the classroom",
          distractorsEn: ["in the kitchen", "in the office", "at home only"],
        },
        {
          id: "bridge-u1-2",
          promptHe: "אֵיךְ אַתֶּם… is directed at:",
          correctEn: "you (plural / polite group)",
          distractorsEn: [
            "one man only",
            "one woman only",
            "they (not present)",
          ],
        },
        {
          id: "bridge-u1-3",
          promptHe: "נַתְחִיל suggests:",
          correctEn: "we will begin / let’s begin",
          distractorsEn: ["we finished", "we forgot", "we disagree"],
        },
        {
          id: "bridge-u1-4",
          promptHe: "תַּרְגִּיל often means:",
          correctEn: "exercise / drill",
          distractorsEn: ["exam only", "vacation", "textbook title"],
        },
      ],
    ),
  },
  {
    id: "bridge-u2",
    title: "Reading beyond full vowels",
    intro:
      "After Alef–Dalet you still lean on context, word families, and frequent patterns — nikkud becomes a tool, not the only crutch.",
    he: "כְּשֶׁאֵין נִקּוּד, קוֹדֶם כֹּל מְחַפְּשִׂים מִילִים מוּכָּרוֹת. אַחַר כָּךְ קוֹרְאִים אֶת הַמִּשְׁפָּט שׁוּב — עַכְשָׁיו הָרַעַיוֹן בָּרוּר יוֹתֵר.",
    en: "When there are no vowel points, first we look for familiar words. Then we read the sentence again — now the idea is clearer.",
    practicePack: pack(
      "u2",
      "Unit 2 — check",
      "Strategies for unpointed or mixed text.",
      [
        {
          id: "bridge-u2-1",
          promptHe: "קוֹדֶם כֹּל suggests priority:",
          correctEn: "first of all / above all",
          distractorsEn: ["never", "only at the end", "only in poetry"],
        },
        {
          id: "bridge-u2-2",
          promptHe: "מִילִים מוּכָּרוֹת are:",
          correctEn: "familiar / known words",
          distractorsEn: ["only foreign words", "only verbs", "only numbers"],
        },
        {
          id: "bridge-u2-3",
          promptHe: "שׁוּב in reading practice often means:",
          correctEn: "again",
          distractorsEn: ["never", "tomorrow", "silently"],
        },
        {
          id: "bridge-u2-4",
          promptHe: "הָרַעַיוֹן בָּרוּר יוֹתֵר expresses:",
          correctEn: "the idea is clearer",
          distractorsEn: ["the idea disappeared", "the text is shorter", "wrong register"],
        },
      ],
    ),
  },
  {
    id: "bridge-u3",
    title: "Short dialogue — everyday slice",
    intro:
      "Short exchanges train you to follow speakers and infer what is not spelled out.",
    he: "רָחֵל: אֲנִי עֲיֵפָה, אֲבָל הַשִּׁעוּר הָיָה מְעַנְיֵן. דָּנִי: נָכוֹן! גַּם אֲנִי לָמַדְתִּי מִילָה חֲדָשָׁה אַחַת.",
    en: 'Rachel: I’m tired, but the lesson was interesting. Dani: Right! I also learned one new word.',
    practicePack: pack(
      "u3",
      "Unit 3 — check",
      "Who said what and basic vocabulary.",
      [
        {
          id: "bridge-u3-1",
          promptHe: "עֲיֵפָה means:",
          correctEn: "tired (f.)",
          distractorsEn: ["happy (f.)", "angry (f.)", "late (f.)"],
        },
        {
          id: "bridge-u3-2",
          promptHe: "הַשִּׁעוּר הָיָה מְעַנְיֵן — מְעַנְיֵן suggests:",
          correctEn: "interesting",
          distractorsEn: ["boring", "difficult only", "too long"],
        },
        {
          id: "bridge-u3-3",
          promptHe: "נָכוֹן! here is closest to:",
          correctEn: "Right! / That’s true!",
          distractorsEn: ["Wrong!", "Maybe not", "I don’t know"],
        },
        {
          id: "bridge-u3-4",
          promptHe: "מִילָה חֲדָשָׁה אַחַת:",
          correctEn: "one new word",
          distractorsEn: ["one old word", "no new words", "only grammar"],
        },
      ],
    ),
  },
  {
    id: "bridge-u4",
    title: "What comes after the bridge",
    intro:
      "Specialty tracks deepen one domain at a time; the bridge is the shared on-ramp.",
    he: "אַחֲרֵי הַגֶּשֶׁר תּוּכְלוּ לִבְחֹר מַסְלוּל: עִתּוֹנוּת, סִפְרוּת, דִּבּוּר מֻכְוָּן — כָּל אֶחָד עִם יַעַד שׁוֹנֶה. עִבְרִית אֵינָהּ רַק מִילִים; הִיא גַּם רִשׁוּם וְקוֹל.",
    en: "After the bridge you can choose a track: journalism, literature, spoken Hebrew for a goal — each with a different aim. Hebrew is not only words; it is also register and voice.",
    practicePack: pack(
      "u4",
      "Unit 4 — check",
      "Goals and vocabulary of the post-bridge path.",
      [
        {
          id: "bridge-u4-1",
          promptHe: "עִתּוֹנוּת is:",
          correctEn: "journalism / the press",
          distractorsEn: ["music only", "cooking only", "sports only"],
        },
        {
          id: "bridge-u4-2",
          promptHe: "רִשׁוּם (here: style/register) contrasts with:",
          correctEn: "raw word lists without context",
          distractorsEn: ["only grammar rules", "only listening", "only writing"],
        },
        {
          id: "bridge-u4-3",
          promptHe: "קוֹל in “voice” sense is:",
          correctEn: "how you sound as a speaker/writer",
          distractorsEn: ["only volume", "only music", "only grammar"],
        },
        {
          id: "bridge-u4-4",
          promptHe: "יַעַד שׁוֹנֶה implies:",
          correctEn: "different learning goals",
          distractorsEn: ["same goal for everyone", "no goals", "random order"],
        },
      ],
    ),
  },
];

export const BRIDGE_UNIT_IDS: readonly string[] = BRIDGE_UNITS.map((u) => u.id);
