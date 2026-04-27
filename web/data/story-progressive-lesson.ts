/**
 * Progressive “read” sections: one sentence at a time (words, phrases, grammar),
 * then mini-MCQs, then full passage + story-level MCQs with Hebrew answers.
 *
 * Add a flow per `sectionId`; `LearnSectionClient` picks it up via
 * `getStoryProgressiveFlow`.
 */

import type { McqDrillPack, McqItem } from "@/data/section-drill-types";
import { LEVEL_1_STORY } from "@/data/learn-stories";

export type StoryWordGloss = { he: string; en: string };

export type StoryPhraseNote = { he: string; noteEn: string };

export type StoryProgressiveSentence = {
  id: string;
  he: string;
  en: string;
  words: StoryWordGloss[];
  phrases?: StoryPhraseNote[];
  grammar: string[];
  /** Why the sentence fits together (English). */
  tieTogetherEn: string;
  mcqItems: McqItem[];
};

export type StoryProgressiveFlow = {
  sectionId: string;
  title: string;
  storyHe: string;
  storyEn: string;
  sentences: StoryProgressiveSentence[];
  finalMcqPack: McqDrillPack;
};

function hItem(
  id: string,
  promptEn: string,
  correctHe: string,
  distractorsHe: string[],
): McqItem {
  return {
    id,
    choicesAreHebrew: true,
    promptEn,
    promptHe: "—",
    correctEn: "—",
    distractorsEn: [],
    correctHe,
    distractorsHe,
  };
}

/** Level 1 “Morning at home” (`learn-stories` L1), split into teachable sentences. */
const L1_READ_MORNING: StoryProgressiveFlow = {
  sectionId: "1-read",
  title: "First story — morning at home",
  storyHe: LEVEL_1_STORY.he,
  storyEn: LEVEL_1_STORY.en,
  sentences: [
    {
      id: "s0",
      he: "בֹּקֶר טוֹב!",
      en: "Good morning!",
      words: [
        { he: "בֹּקֶר", en: "morning" },
        { he: "טוֹב", en: "good" },
      ],
      phrases: [
        { he: "בֹּקֶר טוֹב", noteEn: "Fixed greeting — literally “morning (is) good.”" },
      ],
      grammar: [
        "No verb “is” needed: Hebrew often skips “to be” in short present-tense statements.",
        "טוֹב agrees with בֹּקֶר (masculine singular).",
      ],
      tieTogetherEn:
        "This is a standard morning greeting — a tiny sentence that sets the scene before the rest of the story.",
      mcqItems: [
        {
          id: "s0w1",
          promptHe: "בֹּקֶר",
          correctEn: "morning",
          distractorsEn: ["evening", "house", "bread"],
        },
        {
          id: "s0w2",
          promptHe: "טוֹב",
          correctEn: "good",
          distractorsEn: ["sleeping", "coffee", "today"],
        },
        {
          id: "s0p1",
          promptHe: "בֹּקֶר טוֹב!",
          correctEn: "Good morning!",
          distractorsEn: ["Good night!", "Thank you!", "Excuse me!"],
        },
      ],
    },
    {
      id: "s1",
      he: "אֲנִי יוֹשֵׁב בַּבַּיִת.",
      en: "I am sitting at home.",
      words: [
        { he: "אֲנִי", en: "I" },
        { he: "יוֹשֵׁב", en: "sitting (said by a male speaker)" },
        { he: "בַּבַּיִת", en: "in the house / at home" },
      ],
      phrases: [
        {
          he: "בַּבַּיִת",
          noteEn: "ב + הַבַּיִת — “in the house”; learners often hear this as simply “at home.”",
        },
      ],
      grammar: [
        "Present tense: אֲנִי יוֹשֵׁב already means “I (am) sitting” — no separate word for “am.”",
        "יוֹשֵׁב is the masculine singular form of the verb (here, the narrator is male).",
      ],
      tieTogetherEn:
        "The subject אֲנִי pins the scene on the speaker; יוֹשֵׁב tells what he’s doing, and בַּבַּיִת anchors where it happens.",
      mcqItems: [
        {
          id: "s1w1",
          promptHe: "אֲנִי",
          correctEn: "I",
          distractorsEn: ["we", "you (m.)", "they"],
        },
        {
          id: "s1w2",
          promptHe: "יוֹשֵׁב",
          correctEn: "sitting (m. sg.)",
          distractorsEn: ["drinking (f. sg.)", "reading (m. sg.)", "sleeping (m. sg.)"],
        },
        {
          id: "s1w3",
          promptHe: "בַּבַּיִת",
          correctEn: "in the house / at home",
          distractorsEn: ["to the market", "today", "our dog"],
        },
      ],
    },
    {
      id: "s2",
      he: "אִמָּא שׁוֹתָה קָפֶה, וְאַבָּא קוֹרֵא סֵפֶר.",
      en: "Mom is drinking coffee, and dad is reading a book.",
      words: [
        { he: "אִמָּא", en: "Mom" },
        { he: "שׁוֹתָה", en: "drinks / is drinking (f. sg.)" },
        { he: "קָפֶה", en: "coffee" },
        { he: "וְאַבָּא", en: "and Dad (ו + אַבָּא)" },
        { he: "קוֹרֵא", en: "reads / is reading (m. sg.)" },
        { he: "סֵפֶר", en: "a book" },
      ],
      phrases: [
        {
          he: "וְאַבָּא",
          noteEn: "וְ־ (“and”) is written as one unit with the next word.",
        },
      ],
      grammar: [
        "Parallel clause: two people, two ongoing actions — same “is …ing” pattern, no extra “is.”",
        "שׁוֹתָה shows a feminine singular subject (אִמָּא); קוֹרֵא matches אַבָּא (masculine).",
      ],
      tieTogetherEn:
        "The sentence balances two family members side by side — mom’s action, then dad’s — joined by וְ so it feels like one snapshot of the household.",
      mcqItems: [
        {
          id: "s2w1",
          promptHe: "שׁוֹתָה",
          correctEn: "drinks / is drinking (f. sg.)",
          distractorsEn: ["reads (m. sg.)", "sits (m. sg.)", "sleeps (m. sg.)"],
        },
        {
          id: "s2w2",
          promptHe: "קָפֶה",
          correctEn: "coffee",
          distractorsEn: ["bread", "book", "dog"],
        },
        {
          id: "s2w3",
          promptHe: "קוֹרֵא סֵפֶר",
          correctEn: "reads a book",
          distractorsEn: ["drinks coffee", "eats bread", "sleeps"],
        },
      ],
    },
    {
      id: "s3",
      he: "הַכֶּלֶב שֶׁלָּנוּ יָשֵׁן.",
      en: "Our dog is sleeping.",
      words: [
        { he: "הַכֶּלֶב", en: "the dog" },
        { he: "שֶׁלָּנוּ", en: "our (literally “of-us”)" },
        { he: "יָשֵׁן", en: "sleeps / is sleeping (m. sg.)" },
      ],
      phrases: [
        {
          he: "שֶׁלָּנוּ",
          noteEn: "שֶׁל + נוּ = “of us” → possession: “our dog.”",
        },
      ],
      grammar: [
        "הַ־ on כֶּלֶב makes it “the dog” — the one you already know in the story.",
        "יָשֵׁן agrees with כֶּלֶב (masculine singular).",
      ],
      tieTogetherEn:
        "שֶׁלָּנוּ links the dog to the family; a quiet verb (sleeping) contrasts the busy mom-and-dad clause.",
      mcqItems: [
        {
          id: "s3w1",
          promptHe: "הַכֶּלֶב",
          correctEn: "the dog",
          distractorsEn: ["the book", "Mom", "bread"],
        },
        {
          id: "s3w2",
          promptHe: "שֶׁלָּנוּ",
          correctEn: "our",
          distractorsEn: ["I", "you (m.)", "today"],
        },
        {
          id: "s3w3",
          promptHe: "יָשֵׁן",
          correctEn: "sleeping (m. sg.)",
          distractorsEn: ["reading", "drinking", "sitting"],
        },
      ],
    },
    {
      id: "s4",
      he: "אֲנַחְנוּ אוֹכְלִים לֶחֶם.",
      en: "We are eating bread.",
      words: [
        { he: "אֲנַחְנוּ", en: "we" },
        { he: "אוֹכְלִים", en: "eat / are eating (m. pl. or mixed group)" },
        { he: "לֶחֶם", en: "bread" },
      ],
      grammar: [
        "אוֹכְלִים is plural — matches אֲנַחְנוּ “we” when the group is described with a masculine-plural verb form (very common in narration).",
        "Object comes after the verb: “eat bread,” not “bread eat.”",
      ],
      tieTogetherEn:
        "The family picture now includes the learners as “we” — same meal-time frame as coffee and reading, but a shared action (eating).",
      mcqItems: [
        {
          id: "s4w1",
          promptHe: "אֲנַחְנוּ",
          correctEn: "we",
          distractorsEn: ["I", "you (m.)", "they"],
        },
        {
          id: "s4w2",
          promptHe: "אוֹכְלִים",
          correctEn: "eat / are eating (m. pl.)",
          distractorsEn: ["drink (f. sg.)", "read (m. sg.)", "sit (m. sg.)"],
        },
        {
          id: "s4w3",
          promptHe: "לֶחֶם",
          correctEn: "bread",
          distractorsEn: ["coffee", "book", "morning"],
        },
      ],
    },
    {
      id: "s5",
      he: "מַה אַתָּה עוֹשֶׂה הַיּוֹם?",
      en: "What are you doing today?",
      words: [
        { he: "מַה", en: "what" },
        { he: "אַתָּה", en: "you (masculine singular)" },
        { he: "עוֹשֶׂה", en: "do / are doing (m. sg. “you do” form here)" },
        { he: "הַיּוֹם", en: "today" },
      ],
      grammar: [
        "מַה starts a question; word order is “What you do today?” without English “are.”",
        "אַתָּה + עוֹשֶׂה pairs “you (m.)” with the matching verb form.",
      ],
      tieTogetherEn:
        "After describing the household, the line turns outward to the reader — the same הַיּוֹם time frame ties the question to everything you just read.",
      mcqItems: [
        {
          id: "s5w1",
          promptHe: "מַה",
          correctEn: "what",
          distractorsEn: ["who", "where", "when"],
        },
        {
          id: "s5w2",
          promptHe: "אַתָּה",
          correctEn: "you (m. sg.)",
          distractorsEn: ["I", "she", "we"],
        },
        {
          id: "s5w3",
          promptHe: "הַיּוֹם",
          correctEn: "today",
          distractorsEn: ["at home", "the dog", "morning"],
        },
      ],
    },
  ],
  finalMcqPack: {
    kind: "mcq",
    title: "Whole story — pick the Hebrew",
    intro: "Questions about the passage you just read; every answer is in Hebrew.",
    items: [
      hItem(
        "fs1",
        "Which Hebrew is the usual way to say “Good morning”?",
        "בֹּקֶר טוֹב!",
        ["שָׁלוֹם!", "לַיְלָה טוֹב!", "תּוֹדָה!"],
      ),
      hItem(
        "fs2",
        "Which line matches “I am sitting at home”?",
        "אֲנִי יוֹשֵׁב בַּבַּיִת.",
        [
          "אֲנִי יוֹשֵׁב בַּשּׁוּק.",
          "אֲנַחְנוּ אוֹכְלִים לֶחֶם.",
          "הַכֶּלֶב שֶׁלָּנוּ יָשֵׁן.",
        ],
      ),
      hItem(
        "fs3",
        "Which phrase names “Mom is drinking coffee”?",
        "אִמָּא שׁוֹתָה קָפֶה",
        ["אַבָּא קוֹרֵא סֵפֶר", "אֲנַחְנוּ אוֹכְלִים לֶחֶם", "מַה אַתָּה עוֹשֶׂה?"],
      ),
      hItem(
        "fs4",
        "How do you say “Our dog is sleeping” in the story’s wording?",
        "הַכֶּלֶב שֶׁלָּנוּ יָשֵׁן.",
        [
          "הַכֶּלֶב שׁוֹתֶה קָפֶה.",
          "אִמָּא יָשְׁנָה בַּבַּיִת.",
          "אֲנִי קוֹרֵא סֵפֶר.",
        ],
      ),
      hItem(
        "fs5",
        "Pick the Hebrew for “We are eating bread.”",
        "אֲנַחְנוּ אוֹכְלִים לֶחֶם.",
        [
          "אֲנַחְנוּ שׁוֹתִים קָפֶה.",
          "אַתָּה עוֹשֶׂה לֶחֶם.",
          "הוּא קוֹרֵא סֵפֶר.",
        ],
      ),
      hItem(
        "fs6",
        "Which sentence is “What are you doing today?”",
        "מַה אַתָּה עוֹשֶׂה הַיּוֹם?",
        [
          "מִי אַתָּה הַיּוֹם?",
          "אֵיפֹה אַתָּה גָּר?",
          "לְמָה אַתָּה מְדַבֵּר?",
        ],
      ),
    ],
  },
};

const FLOWS: StoryProgressiveFlow[] = [L1_READ_MORNING];

export function getStoryProgressiveFlow(
  sectionId: string,
): StoryProgressiveFlow | null {
  return FLOWS.find((f) => f.sectionId === sectionId) ?? null;
}

/** Word-level glosses for tap-to-gloss in the full passage (merged with section MCQ glosses). */
export function storyProgressiveFullGloss(
  flow: StoryProgressiveFlow,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of flow.sentences) {
    for (const w of s.words) {
      if (!out[w.he]) out[w.he] = w.en;
    }
    for (const it of s.mcqItems) {
      if (it.promptHe.trim() === "—") continue;
      if (hasHebrew(it.promptHe) && it.correctEn && it.correctEn !== "—") {
        out[it.promptHe] = it.correctEn;
      }
    }
  }
  return out;
}

function hasHebrew(s: string): boolean {
  return /[\u0590-\u05FF]/.test(s);
}
