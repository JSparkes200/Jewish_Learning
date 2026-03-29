/**
 * Foundation exit strand banks (Alef–Dalet capstone).
 * Pass rule: ≥90% correct (see {@link meetsFoundationExitPassPercent}).
 */

import type { McqDrillPack } from "./section-drill-types";

export const FOUNDATION_EXIT_READING_PACK: McqDrillPack = {
  kind: "mcq",
  title: "Reading — vocabulary in context",
  intro:
    "Short phrases and clauses: choose the best English gloss for the Hebrew prompt.",
  items: [
    {
      id: "fe-r-1",
      promptHe: "שָׁלוֹם",
      correctEn: "hello / peace",
      distractorsEn: ["goodbye", "thanks", "please"],
    },
    {
      id: "fe-r-2",
      promptHe: "סְפָרִים",
      correctEn: "books",
      distractorsEn: ["rooms", "windows", "days"],
    },
    {
      id: "fe-r-3",
      promptHe: "הוּא קוֹרֵא",
      correctEn: "he reads",
      distractorsEn: ["she reads", "they read", "we read"],
    },
    {
      id: "fe-r-4",
      promptHe: "בַּבַּיִת",
      correctEn: "in the house",
      distractorsEn: ["to the house", "from the house", "the houses"],
    },
    {
      id: "fe-r-5",
      promptHe: "מָה שְׁלוֹמֵךְ?",
      correctEn: "How are you? (to a woman)",
      distractorsEn: [
        "What is your name?",
        "Where are you?",
        "How old are you?",
      ],
    },
    {
      id: "fe-r-6",
      promptHe: "אֵין לִי זְמַן",
      correctEn: "I don’t have time",
      distractorsEn: ["I have time", "What time is it?", "I need money"],
    },
    {
      id: "fe-r-7",
      promptHe: "הִיא רוֹצָה לֶאֱכֹל",
      correctEn: "She wants to eat",
      distractorsEn: ["She wants to sleep", "She is eating", "She cooked"],
    },
    {
      id: "fe-r-8",
      promptHe: "יוֹם טוֹב",
      correctEn: "good day / holiday greeting (contextual)",
      distractorsEn: ["bad day", "good night", "see you tomorrow"],
    },
    {
      id: "fe-r-9",
      promptHe: "אֵיפֹה הַשֻּׁלְחָן?",
      correctEn: "Where is the table?",
      distractorsEn: ["Where is the door?", "When is the lesson?", "Who is the teacher?"],
    },
    {
      id: "fe-r-10",
      promptHe: "הַיְלָדִים מְשַׂחֲקִים בַּחוּץ",
      correctEn: "The children are playing outside",
      distractorsEn: ["The children sleep inside", "The parents are outside", "The books are outside"],
    },
    {
      id: "fe-r-11",
      promptHe: "לֹא מֵבִין",
      correctEn: "doesn’t understand / I don’t understand (fragment)",
      distractorsEn: ["understands well", "I remember", "I agree"],
    },
    {
      id: "fe-r-12",
      promptHe: "נִרְאֶה מָחָר",
      correctEn: "See you tomorrow / we’ll see tomorrow",
      distractorsEn: ["good morning", "happy birthday", "see you never"],
    },
  ],
};

export const FOUNDATION_EXIT_GRAMMAR_PACK: McqDrillPack = {
  kind: "mcq",
  title: "Grammar — patterns & agreement",
  intro: "Agreement, present tense, and high-frequency function words.",
  items: [
    {
      id: "fe-g-1",
      promptHe: "Which word is feminine singular?",
      correctEn: "דֶּלֶת (door)",
      distractorsEn: ["סֵפֶר (book, m.)", "בַּיִת (house, m.)", "יוֹם (day, m.)"],
    },
    {
      id: "fe-g-2",
      promptHe: "Present tense: אֲנִי ______ (speak, m.)",
      correctEn: "מְדַבֵּר",
      distractorsEn: ["מְדַבֶּרֶת", "נִדְבָּרִים", "תְּדַבֵּר"],
    },
    {
      id: "fe-g-3",
      promptHe: "“The teachers” (m.) is:",
      correctEn: "הַמּוֹרִים",
      distractorsEn: ["הַמּוֹרוֹת", "מוֹרִים", "לַמּוֹרִים"],
    },
    {
      id: "fe-g-4",
      promptHe: "שֶׁלִּי means:",
      correctEn: "mine / my (after noun)",
      distractorsEn: ["yours", "with me", "to me"],
    },
    {
      id: "fe-g-5",
      promptHe: "אֵין + noun often expresses:",
      correctEn: "there is no / there are no",
      distractorsEn: ["there is", "I have", "we have"],
    },
    {
      id: "fe-g-6",
      promptHe: "אֲנַחְנוּ ______ (eat, plural)",
      correctEn: "אוֹכְלִים",
      distractorsEn: ["אוֹכֶלֶת", "נֹאכַל", "אָכַלְתֶּם"],
    },
    {
      id: "fe-g-7",
      promptHe: "הִיא ______ סֵפֶר (read, f.)",
      correctEn: "קוֹרֵאת",
      distractorsEn: ["קוֹרֵא", "קוֹרְאִים", "קָרָא"],
    },
    {
      id: "fe-g-8",
      promptHe: "Definite “in the” + common noun pattern:",
      correctEn: "בַּ + definite noun (e.g. בַּבַּיִת)",
      distractorsEn: ["לַ + always", "מִן + only", "אֶת + always"],
    },
    {
      id: "fe-g-9",
      promptHe: "אֶת marks:",
      correctEn: "definite direct object (often)",
      distractorsEn: ["subject only", "indirect object only", "only past tense"],
    },
    {
      id: "fe-g-10",
      promptHe: "מָה שְׁלוֹמְךָ? addresses:",
      correctEn: "a man (singular “you”)",
      distractorsEn: ["a woman", "many people", "a child only"],
    },
    {
      id: "fe-g-11",
      promptHe: "יֵשׁ לִי often means:",
      correctEn: "I have / there is to me",
      distractorsEn: ["I want", "I go", "I know"],
    },
    {
      id: "fe-g-12",
      promptHe: "הֵם ______ (write, m. pl.)",
      correctEn: "כּוֹתְבִים",
      distractorsEn: ["כּוֹתֶבֶת", "כָּתַב", "נִכְתָּב"],
    },
  ],
};

export const FOUNDATION_EXIT_LEXICON_PACK: McqDrillPack = {
  kind: "mcq",
  title: "Lexicon — core lemmas",
  intro: "High-frequency lemmas from daily-life foundation Hebrew.",
  items: [
    {
      id: "fe-l-1",
      promptHe: "לָלֶכֶת",
      correctEn: "to go",
      distractorsEn: ["to come", "to see", "to eat"],
    },
    {
      id: "fe-l-2",
      promptHe: "מַיִם",
      correctEn: "water",
      distractorsEn: ["bread", "milk", "salt"],
    },
    {
      id: "fe-l-3",
      promptHe: "הַיּוֹם",
      correctEn: "today",
      distractorsEn: ["yesterday", "tomorrow", "now"],
    },
    {
      id: "fe-l-4",
      promptHe: "מִשְׁפָּחָה",
      correctEn: "family",
      distractorsEn: ["friend", "neighbor", "teacher"],
    },
    {
      id: "fe-l-5",
      promptHe: "מְאוֹד",
      correctEn: "very / much",
      distractorsEn: ["a little", "maybe", "never"],
    },
    {
      id: "fe-l-6",
      promptHe: "לֶאֱכֹל",
      correctEn: "to eat",
      distractorsEn: ["to drink", "to cook", "to buy"],
    },
    {
      id: "fe-l-7",
      promptHe: "עִבְרִית",
      correctEn: "Hebrew (language)",
      distractorsEn: ["English", "Arabic", "history"],
    },
    {
      id: "fe-l-8",
      promptHe: "בַּבַּיִת",
      correctEn: "at home / in the house",
      distractorsEn: ["to the house", "from the house", "the houses"],
    },
    {
      id: "fe-l-9",
      promptHe: "עִם",
      correctEn: "with",
      distractorsEn: ["without", "after", "before"],
    },
    {
      id: "fe-l-10",
      promptHe: "כֹּל",
      correctEn: "all / every (common in set phrases)",
      distractorsEn: ["none", "some", "only"],
    },
    {
      id: "fe-l-11",
      promptHe: "עִכְשָׁיו",
      correctEn: "now",
      distractorsEn: ["then", "later", "never"],
    },
    {
      id: "fe-l-12",
      promptHe: "כֵּן",
      correctEn: "yes / so / right (particle)",
      distractorsEn: ["no", "maybe", "please"],
    },
  ],
};

export const FOUNDATION_EXIT_PACKS = {
  reading: FOUNDATION_EXIT_READING_PACK,
  grammar: FOUNDATION_EXIT_GRAMMAR_PACK,
  lexicon: FOUNDATION_EXIT_LEXICON_PACK,
} as const;
