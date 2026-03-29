/**
 * Small drill packs for Learn sections (Next app). Expand or generate from
 * legacy corpus over time.
 */

import type { McqDrillPack, McqItem } from "./section-drill-types";
import { upperLevelDrillExtras } from "./section-drills-upper-extras";
import { upperLevelDrillPacks } from "./section-drills-upper-levels";

export type { McqDrillPack, McqItem } from "./section-drill-types";

function mergeUpperLevelExtras(
  base: Record<string, McqDrillPack>,
  extras: Record<string, readonly McqItem[]>,
): Record<string, McqDrillPack> {
  const out: Record<string, McqDrillPack> = { ...base };
  for (const [id, rows] of Object.entries(extras)) {
    const pack = out[id];
    if (!pack || pack.kind !== "mcq") continue;
    out[id] = { ...pack, items: [...pack.items, ...rows] };
  }
  return out;
}

const upperLevelDrillPacksMerged = mergeUpperLevelExtras(
  upperLevelDrillPacks,
  upperLevelDrillExtras,
);

const level1Packs: Record<string, McqDrillPack> = {
  "1-1": {
    kind: "mcq",
    title: "Greetings — what does it mean?",
    intro: "Pick the best English gloss for each Hebrew phrase.",
    items: [
      {
        id: "g1",
        promptHe: "שָׁלוֹם",
        correctEn: "Hello / peace",
        distractorsEn: ["Good night", "Thank you", "Excuse me"],
      },
      {
        id: "g2",
        promptHe: "בֹּקֶר טוֹב",
        correctEn: "Good morning",
        distractorsEn: ["Good evening", "Good night", "See you soon"],
      },
      {
        id: "g3",
        promptHe: "עֶרֶב טוֹב",
        correctEn: "Good evening",
        distractorsEn: ["Good morning", "Welcome", "How are you?"],
      },
      {
        id: "g4",
        promptHe: "לַיְלָה טוֹב",
        correctEn: "Good night",
        distractorsEn: ["Good morning", "Goodbye", "Please"],
      },
      {
        id: "g5",
        promptHe: "תּוֹדָה",
        correctEn: "Thank you",
        distractorsEn: ["Sorry", "Please", "Maybe"],
      },
      {
        id: "g6",
        promptHe: "תּוֹדָה רַבָּה",
        correctEn: "Thank you very much",
        distractorsEn: ["You're welcome", "Excuse me", "I don't know"],
      },
      {
        id: "g7",
        promptHe: "לְהִתְרָאוֹת",
        correctEn: "Goodbye / until we meet",
        distractorsEn: ["Hello", "Nice to meet you", "Come in"],
      },
      {
        id: "g8",
        promptHe: "סְלִיחָה",
        correctEn: "Sorry / excuse me",
        distractorsEn: ["Thank you", "Please", "Of course"],
      },
    ],
  },
  "1-2": {
    kind: "mcq",
    title: "Yes / no & basics",
    intro: "Common short answers and particles.",
    items: [
      {
        id: "y1",
        promptHe: "כֵּן",
        correctEn: "Yes",
        distractorsEn: ["No", "Maybe", "Please"],
      },
      {
        id: "y2",
        promptHe: "לֹא",
        correctEn: "No",
        distractorsEn: ["Yes", "Thanks", "OK"],
      },
      {
        id: "y3",
        promptHe: "אוּלַי",
        correctEn: "Maybe",
        distractorsEn: ["Always", "Never", "Today"],
      },
      {
        id: "y4",
        promptHe: "בְּבַקָּשָׁה",
        correctEn: "Please / you're welcome",
        distractorsEn: ["Sorry", "Hello", "Why?"],
      },
      {
        id: "y5",
        promptHe: "טוֹב",
        correctEn: "Good / OK",
        distractorsEn: ["Bad", "Big", "Slow"],
      },
      {
        id: "y6",
        promptHe: "יֵשׁ",
        correctEn: "There is / there are (yes, we have it)",
        distractorsEn: ["There isn't", "Where?", "When?"],
      },
    ],
  },
  "1-read": {
    kind: "mcq",
    title: "Read the story — key words",
    intro: "Vocabulary from Dani’s short reading passage.",
    items: [
      {
        id: "rd1",
        promptHe: "יֶלֶד קָטָן",
        correctEn: "A small boy / child",
        distractorsEn: ["A big city", "A teacher", "A book"],
      },
      {
        id: "rd2",
        promptHe: "הוּא אוֹמֵר",
        correctEn: "He says",
        distractorsEn: ["They eat", "We sleep", "I run"],
      },
      {
        id: "rd3",
        promptHe: "שָׁלוֹם אִמָּא",
        correctEn: "Hello mom / peace, Mom",
        distractorsEn: ["Good night Dad", "Thank you teacher", "See you tomorrow"],
      },
      {
        id: "rd4",
        promptHe: "שָׁלוֹם אַבָּא",
        correctEn: "Hello Dad / peace, Dad",
        distractorsEn: ["Good morning Mom", "Excuse me", "I'm sorry"],
      },
      {
        id: "rd5",
        promptHe: "כֻּלָּם",
        correctEn: "Everyone / all of them",
        distractorsEn: ["No one", "Only me", "Two people"],
      },
      {
        id: "rd6",
        promptHe: "אוֹהֲבִים אֶת דָּנִי",
        correctEn: "They love Dani",
        distractorsEn: ["They see Dani", "They teach Dani", "They forget Dani"],
      },
    ],
  },
  "1-3": {
    kind: "mcq",
    title: "Day, meals, sleep",
    intro: "Words about parts of the day and daily rhythm.",
    items: [
      {
        id: "d1",
        promptHe: "אֲרוּחַת בֹּקֶר",
        correctEn: "Breakfast",
        distractorsEn: ["Lunch", "Dinner", "Snack"],
      },
      {
        id: "d2",
        promptHe: "אֲרוּחַת צָהֳרַיִם",
        correctEn: "Lunch (midday meal)",
        distractorsEn: ["Breakfast", "Supper", "Party"],
      },
      {
        id: "d3",
        promptHe: "אֲרוּחַת עֶרֶב",
        correctEn: "Dinner / supper",
        distractorsEn: ["Breakfast", "Brunch", "Dessert only"],
      },
      {
        id: "d4",
        promptHe: "לִישׁוֹן",
        correctEn: "To sleep",
        distractorsEn: ["To eat", "To run", "To read"],
      },
      {
        id: "d5",
        promptHe: "לָקוּם",
        correctEn: "To get up",
        distractorsEn: ["To sit down", "To leave", "To wait"],
      },
      {
        id: "d6",
        promptHe: "הַיּוֹם",
        correctEn: "Today",
        distractorsEn: ["Yesterday", "Tomorrow", "Never"],
      },
      {
        id: "d7",
        promptHe: "מָחָר",
        correctEn: "Tomorrow",
        distractorsEn: ["Today", "Tonight", "Last year"],
      },
      {
        id: "d8",
        promptHe: "אֶתְמוֹל",
        correctEn: "Yesterday",
        distractorsEn: ["Tomorrow", "Soon", "Later"],
      },
    ],
  },
  "1-4": {
    kind: "mcq",
    title: "Basic pronouns",
    intro: "Who is speaking or spoken about?",
    items: [
      {
        id: "p1",
        promptHe: "אֲנִי",
        correctEn: "I",
        distractorsEn: ["You (m.)", "We", "They"],
      },
      {
        id: "p2",
        promptHe: "אַתָּה",
        correctEn: "You (masculine singular)",
        distractorsEn: ["She", "I", "We"],
      },
      {
        id: "p3",
        promptHe: "אַתְּ",
        correctEn: "You (feminine singular)",
        distractorsEn: ["He", "They (m.)", "I"],
      },
      {
        id: "p4",
        promptHe: "הוּא",
        correctEn: "He",
        distractorsEn: ["She", "You (f.)", "It (neuter only)"],
      },
      {
        id: "p5",
        promptHe: "הִיא",
        correctEn: "She",
        distractorsEn: ["He", "We", "You (m.)"],
      },
      {
        id: "p6",
        promptHe: "אֲנַחְנוּ",
        correctEn: "We",
        distractorsEn: ["You all", "They", "I"],
      },
      {
        id: "p7",
        promptHe: "הֵם",
        correctEn: "They (masculine / mixed group)",
        distractorsEn: ["We", "You two", "She"],
      },
      {
        id: "p8",
        promptHe: "הֵן",
        correctEn: "They (feminine)",
        distractorsEn: ["They (m.)", "We", "Those boys"],
      },
    ],
  },
  "1-5": {
    kind: "mcq",
    title: "This & these",
    intro: "Pointing at one thing or several.",
    items: [
      {
        id: "t1",
        promptHe: "זֶה",
        correctEn: "This (masculine singular)",
        distractorsEn: ["These", "That (far)", "That (f.)"],
      },
      {
        id: "t2",
        promptHe: "זֹאת",
        correctEn: "This (feminine singular)",
        distractorsEn: ["This (m.)", "Those", "Here"],
      },
      {
        id: "t3",
        promptHe: "אֵלֶּה",
        correctEn: "These",
        distractorsEn: ["This (m.)", "That one", "Who"],
      },
      {
        id: "t4",
        promptHe: "זֶה סֵפֶר",
        correctEn: "This is a book",
        distractorsEn: ["These are books", "Where is a book?", "Not a book"],
      },
      {
        id: "t5",
        promptHe: "זֹאת יַלְדָּה",
        correctEn: "This is a girl",
        distractorsEn: ["These are girls", "That boy", "A small house"],
      },
    ],
  },
  "1-6": {
    kind: "mcq",
    title: "Numbers 0–10",
    intro: "Hebrew cardinal — match to the digit.",
    items: [
      {
        id: "n0",
        promptHe: "אֶפֶס",
        correctEn: "0",
        distractorsEn: ["1", "2", "10"],
      },
      {
        id: "n1",
        promptHe: "אַחַת",
        correctEn: "1 (feminine form)",
        distractorsEn: ["2", "One (m. אֶחָד)", "0"],
      },
      {
        id: "n2",
        promptHe: "שְׁתַּיִם",
        correctEn: "2 (feminine form)",
        distractorsEn: ["3", "Two (m.)", "7"],
      },
      {
        id: "n3",
        promptHe: "שָׁלוֹשׁ",
        correctEn: "3",
        distractorsEn: ["4", "8", "1"],
      },
      {
        id: "n4",
        promptHe: "אַרְבַּע",
        correctEn: "4",
        distractorsEn: ["5", "6", "9"],
      },
      {
        id: "n5",
        promptHe: "חָמֵשׁ",
        correctEn: "5",
        distractorsEn: ["4", "10", "3"],
      },
      {
        id: "n6",
        promptHe: "שֵׁשׁ",
        correctEn: "6",
        distractorsEn: ["7", "5", "2"],
      },
      {
        id: "n7",
        promptHe: "שֶׁבַע",
        correctEn: "7",
        distractorsEn: ["8", "6", "4"],
      },
      {
        id: "n8",
        promptHe: "שְׁמוֹנֶה",
        correctEn: "8",
        distractorsEn: ["9", "7", "5"],
      },
      {
        id: "n9",
        promptHe: "תֵּשַׁע",
        correctEn: "9",
        distractorsEn: ["10", "8", "6"],
      },
      {
        id: "n10",
        promptHe: "עֶשֶׂר",
        correctEn: "10",
        distractorsEn: ["9", "20", "0"],
      },
    ],
  },
  "1-nums": {
    kind: "mcq",
    title: "Numbers practice",
    intro: "Digits → Hebrew feminine cardinals (common in counting).",
    items: [
      {
        id: "q3",
        promptHe: "How do you say 3?",
        correctEn: "שָׁלוֹשׁ",
        distractorsEn: ["שְׁתַּיִם", "אַרְבַּע", "חָמֵשׁ"],
      },
      {
        id: "q5",
        promptHe: "How do you say 5?",
        correctEn: "חָמֵשׁ",
        distractorsEn: ["שֵׁשׁ", "אַרְבַּע", "שֶׁבַע"],
      },
      {
        id: "q7",
        promptHe: "How do you say 7?",
        correctEn: "שֶׁבַע",
        distractorsEn: ["שְׁמוֹנֶה", "שֵׁשׁ", "תֵּשַׁע"],
      },
      {
        id: "q10",
        promptHe: "How do you say 10?",
        correctEn: "עֶשֶׂר",
        distractorsEn: ["תֵּשַׁע", "עֶשְׂרִים", "מֵאָה"],
      },
      {
        id: "q0",
        promptHe: "How do you say 0?",
        correctEn: "אֶפֶס",
        distractorsEn: ["אַחַת", "לֹא", "כְּלוּם"],
      },
      {
        id: "q1m",
        promptHe: "Masculine “one” (a boy, one boy)",
        correctEn: "אֶחָד",
        distractorsEn: ["אַחַת", "שְׁנַיִם", "שְׁתַּיִם"],
      },
      {
        id: "q2",
        promptHe: "How do you say 2 (feminine counting)?",
        correctEn: "שְׁתַּיִם",
        distractorsEn: ["שְׁנַיִם", "שָׁלוֹשׁ", "אַרְבַּע"],
      },
      {
        id: "q4",
        promptHe: "How do you say 4?",
        correctEn: "אַרְבַּע",
        distractorsEn: ["אַרְבָּעָה", "שָׁלוֹשׁ", "חָמֵשׁ"],
      },
      {
        id: "q6",
        promptHe: "How do you say 6?",
        correctEn: "שֵׁשׁ",
        distractorsEn: ["שִׁשָּׁה", "שֶׁבַע", "שְׁמוֹנֶה"],
      },
      {
        id: "q8",
        promptHe: "How do you say 8?",
        correctEn: "שְׁמוֹנֶה",
        distractorsEn: ["שְׁמֹנָה", "שִׁשָּׁה", "תֵּשַׁע"],
      },
      {
        id: "q11",
        promptHe: "How do you say 11?",
        correctEn: "אַחַת עֶשְׂרֵה",
        distractorsEn: ["עֶשְׂרֵה", "שְׁתֵּים־עֶשְׂרֵה", "אַחַד־עָשָׂר"],
      },
      {
        id: "q12",
        promptHe: "How do you say 12 (feminine)?",
        correctEn: "שְׁתֵּים־עֶשְׂרֵה",
        distractorsEn: ["שְׁנֵים־עָשָׂר", "אַחַת עֶשְׂרֵה", "עֶשְׂרִים"],
      },
    ],
  },
  "1-7": {
    kind: "mcq",
    title: "Tens & hundred",
    intro: "Round numbers for prices, ages, and dates.",
    items: [
      {
        id: "t20",
        promptHe: "עֶשְׂרִים",
        correctEn: "20",
        distractorsEn: ["12", "30", "200"],
      },
      {
        id: "t30",
        promptHe: "שְׁלוֹשִׁים",
        correctEn: "30",
        distractorsEn: ["13", "40", "300"],
      },
      {
        id: "t40",
        promptHe: "אַרְבָּעִים",
        correctEn: "40",
        distractorsEn: ["14", "50", "4"],
      },
      {
        id: "t50",
        promptHe: "חֲמִשִּׁים",
        correctEn: "50",
        distractorsEn: ["15", "60", "5"],
      },
      {
        id: "t60",
        promptHe: "שִׁשִּׁים",
        correctEn: "60",
        distractorsEn: ["16", "70", "6"],
      },
      {
        id: "t70",
        promptHe: "שִׁבְעִים",
        correctEn: "70",
        distractorsEn: ["17", "80", "7"],
      },
      {
        id: "t80",
        promptHe: "שְׁמוֹנִים",
        correctEn: "80",
        distractorsEn: ["18", "90", "8"],
      },
      {
        id: "t90",
        promptHe: "תִּשְׁעִים",
        correctEn: "90",
        distractorsEn: ["19", "100", "9"],
      },
      {
        id: "t100",
        promptHe: "מֵאָה",
        correctEn: "100",
        distractorsEn: ["1000", "10", "90"],
      },
    ],
  },
  "1-8": {
    kind: "mcq",
    title: "Family",
    intro: "Close relatives.",
    items: [
      {
        id: "f1",
        promptHe: "אִמָּא",
        correctEn: "Mom",
        distractorsEn: ["Dad", "Sister", "Uncle"],
      },
      {
        id: "f2",
        promptHe: "אַבָּא",
        correctEn: "Dad",
        distractorsEn: ["Mom", "Grandpa", "Cousin"],
      },
      {
        id: "f3",
        promptHe: "אָח",
        correctEn: "Brother",
        distractorsEn: ["Sister", "Son", "Friend"],
      },
      {
        id: "f4",
        promptHe: "אָחוֹת",
        correctEn: "Sister",
        distractorsEn: ["Brother", "Aunt", "Baby"],
      },
      {
        id: "f5",
        promptHe: "סָבָא",
        correctEn: "Grandfather",
        distractorsEn: ["Grandmother", "Father", "Boy"],
      },
      {
        id: "f6",
        promptHe: "סָבְתָא",
        correctEn: "Grandmother",
        distractorsEn: ["Grandfather", "Mother", "Girl"],
      },
      {
        id: "f7",
        promptHe: "בֵּן",
        correctEn: "Son",
        distractorsEn: ["Daughter", "Child (generic)", "Brother"],
      },
      {
        id: "f8",
        promptHe: "בַּת",
        correctEn: "Daughter",
        distractorsEn: ["Son", "Wife", "Girl (not daughter)"],
      },
    ],
  },
  "1-9": {
    kind: "mcq",
    title: "Size & color",
    intro: "Adjectives you use all the time.",
    items: [
      {
        id: "s1",
        promptHe: "גָּדוֹל",
        correctEn: "Big / large",
        distractorsEn: ["Small", "Fast", "Old (person)"],
      },
      {
        id: "s2",
        promptHe: "קָטָן",
        correctEn: "Small",
        distractorsEn: ["Big", "Young (only)", "Narrow"],
      },
      {
        id: "s3",
        promptHe: "אָדוֹם",
        correctEn: "Red",
        distractorsEn: ["Green", "Black", "Gray"],
      },
      {
        id: "s4",
        promptHe: "כָּחוֹל",
        correctEn: "Blue",
        distractorsEn: ["Yellow", "White", "Brown"],
      },
      {
        id: "s5",
        promptHe: "יָרוֹק",
        correctEn: "Green",
        distractorsEn: ["Orange", "Purple", "Pink"],
      },
      {
        id: "s6",
        promptHe: "צָהוֹב",
        correctEn: "Yellow",
        distractorsEn: ["Gold", "Blue", "Silver"],
      },
      {
        id: "s7",
        promptHe: "שָׁחוֹר",
        correctEn: "Black",
        distractorsEn: ["Dark blue", "Brown", "Gray"],
      },
      {
        id: "s8",
        promptHe: "לָבָן",
        correctEn: "White",
        distractorsEn: ["Pale", "Silver", "Pink"],
      },
    ],
  },
  "1-10": {
    kind: "mcq",
    title: "Body & home",
    intro: "Basic nouns for people and places.",
    items: [
      {
        id: "b1",
        promptHe: "רֹאשׁ",
        correctEn: "Head",
        distractorsEn: ["Hand", "Foot", "Eye"],
      },
      {
        id: "b2",
        promptHe: "יָד",
        correctEn: "Hand",
        distractorsEn: ["Arm", "Finger", "Leg"],
      },
      {
        id: "b3",
        promptHe: "רֶגֶל",
        correctEn: "Leg / foot",
        distractorsEn: ["Knee only", "Head", "Back"],
      },
      {
        id: "b4",
        promptHe: "עַיִן",
        correctEn: "Eye",
        distractorsEn: ["Ear", "Nose", "Mouth"],
      },
      {
        id: "b5",
        promptHe: "בַּיִת",
        correctEn: "House / home",
        distractorsEn: ["Room only", "School", "Street"],
      },
      {
        id: "b6",
        promptHe: "דֶּלֶת",
        correctEn: "Door",
        distractorsEn: ["Window", "Wall", "Roof"],
      },
      {
        id: "b7",
        promptHe: "חַלּוֹן",
        correctEn: "Window",
        distractorsEn: ["Door", "Table", "Chair"],
      },
      {
        id: "b8",
        promptHe: "שֻׁלְחָן",
        correctEn: "Table",
        distractorsEn: ["Chair", "Bed", "Shelf"],
      },
    ],
  },
  "1-11": {
    kind: "mcq",
    title: "Questions & time",
    intro: "Question words and time phrases.",
    items: [
      {
        id: "q1",
        promptHe: "מָה",
        correctEn: "What?",
        distractorsEn: ["Who?", "Where?", "Why?"],
      },
      {
        id: "q2",
        promptHe: "מִי",
        correctEn: "Who?",
        distractorsEn: ["What?", "When?", "How?"],
      },
      {
        id: "q3",
        promptHe: "אֵיפֹה",
        correctEn: "Where?",
        distractorsEn: ["When?", "How?", "Which?"],
      },
      {
        id: "q4",
        promptHe: "מָתַי",
        correctEn: "When?",
        distractorsEn: ["Where?", "Why?", "How much?"],
      },
      {
        id: "q5",
        promptHe: "לָמָה",
        correctEn: "Why?",
        distractorsEn: ["Because", "Maybe", "Although"],
      },
      {
        id: "q6",
        promptHe: "אֵיךְ",
        correctEn: "How?",
        distractorsEn: ["What?", "Who with?", "How many?"],
      },
      {
        id: "q7",
        promptHe: "עַכְשָׁיו",
        correctEn: "Now",
        distractorsEn: ["Later", "Never", "Yesterday"],
      },
      {
        id: "q8",
        promptHe: "אָז",
        correctEn: "Then / at that time",
        distractorsEn: ["Now", "Tomorrow", "Always"],
      },
    ],
  },
  "1-12": {
    kind: "mcq",
    title: "Food & nature",
    intro: "Concrete nouns from daily life.",
    items: [
      {
        id: "fn1",
        promptHe: "מַיִם",
        correctEn: "Water",
        distractorsEn: ["Milk", "Wine", "Juice"],
      },
      {
        id: "fn2",
        promptHe: "לֶחֶם",
        correctEn: "Bread",
        distractorsEn: ["Rice", "Cheese", "Soup"],
      },
      {
        id: "fn3",
        promptHe: "חָלָב",
        correctEn: "Milk",
        distractorsEn: ["Water", "Oil", "Honey"],
      },
      {
        id: "fn4",
        promptHe: "תַּפּוּחַ",
        correctEn: "Apple",
        distractorsEn: ["Orange", "Egg", "Fish"],
      },
      {
        id: "fn5",
        promptHe: "שֶׁמֶשׁ",
        correctEn: "Sun",
        distractorsEn: ["Moon", "Star", "Cloud"],
      },
      {
        id: "fn6",
        promptHe: "יָרֵחַ",
        correctEn: "Moon",
        distractorsEn: ["Sun", "Sky", "Rain"],
      },
      {
        id: "fn7",
        promptHe: "עֵץ",
        correctEn: "Tree",
        distractorsEn: ["Flower", "Grass", "Forest only"],
      },
      {
        id: "fn8",
        promptHe: "יָם",
        correctEn: "Sea / ocean",
        distractorsEn: ["Lake", "River", "Pool"],
      },
    ],
  },
  "1-13": {
    kind: "mcq",
    title: "Core verbs (infinitives)",
    intro: "לְ… = “to …” — very common roots.",
    items: [
      {
        id: "v1",
        promptHe: "לֶאֱכוֹל",
        correctEn: "To eat",
        distractorsEn: ["To drink", "To sleep", "To buy"],
      },
      {
        id: "v2",
        promptHe: "לִשְׁתּוֹת",
        correctEn: "To drink",
        distractorsEn: ["To eat", "To cook", "To wash"],
      },
      {
        id: "v3",
        promptHe: "לָלֶכֶת",
        correctEn: "To go / to walk",
        distractorsEn: ["To run", "To come", "To stand"],
      },
      {
        id: "v4",
        promptHe: "לָבוֹא",
        correctEn: "To come",
        distractorsEn: ["To go", "To leave", "To return"],
      },
      {
        id: "v5",
        promptHe: "לִרְאוֹת",
        correctEn: "To see",
        distractorsEn: ["To hear", "To look for", "To show"],
      },
      {
        id: "v6",
        promptHe: "לִשְׁמוֹעַ",
        correctEn: "To hear",
        distractorsEn: ["To see", "To speak", "To listen (hitpa'el later)"],
      },
      {
        id: "v7",
        promptHe: "לְדַבֵּר",
        correctEn: "To speak",
        distractorsEn: ["To say (something)", "To read", "To write"],
      },
      {
        id: "v8",
        promptHe: "לִכְתּוֹב",
        correctEn: "To write",
        distractorsEn: ["To read", "To draw", "To erase"],
      },
    ],
  },
  "1-14": {
    kind: "mcq",
    title: "Common expressions",
    intro: "Fixed phrases in conversation.",
    items: [
      {
        id: "e1",
        promptHe: "בְּתֵאָבוֹן",
        correctEn: "Bon appétit (lit. with appetite)",
        distractorsEn: ["Cheers", "Get well", "Congratulations"],
      },
      {
        id: "e2",
        promptHe: "לְבַרִיאוּת",
        correctEn: "To your health (when drinking)",
        distractorsEn: ["Good luck", "Sorry", "Welcome"],
      },
      {
        id: "e3",
        promptHe: "מַזָּל טוֹב",
        correctEn: "Congratulations / good luck",
        distractorsEn: ["Good night", "Happy birthday only", "Be careful"],
      },
      {
        id: "e4",
        promptHe: "בְּהַצְלָחָה",
        correctEn: "Good luck (success)",
        distractorsEn: ["Goodbye", "Welcome back", "See you"],
      },
      {
        id: "e5",
        promptHe: "כֵּן, בְּבַקָּשָׁה",
        correctEn: "Yes, please / go ahead",
        distractorsEn: ["No, thanks", "Maybe later", "I don't know"],
      },
      {
        id: "e6",
        promptHe: "אֵין בְּעַד מָה",
        correctEn: "You're welcome (lit. no problem)",
        distractorsEn: ["Excuse me", "Please repeat", "I disagree"],
      },
      {
        id: "e7",
        promptHe: "נָעִים מְאֹד",
        correctEn: "Nice to meet you (very pleasant)",
        distractorsEn: ["See you later", "Have fun", "I'm tired"],
      },
      {
        id: "e8",
        promptHe: "שָׁבוּעַ טוֹב",
        correctEn: "Have a good week",
        distractorsEn: ["Shabbat shalom", "Good year", "Good hour"],
      },
    ],
  },
};

const packs: Record<string, McqDrillPack> = {
  ...level1Packs,
  ...upperLevelDrillPacksMerged,
};

export function getMcqPackForSection(sectionId: string): McqDrillPack | null {
  return packs[sectionId] ?? null;
}

/** Section ids that have an MCQ pack (for docs / dev). */
export const SECTION_IDS_WITH_MCQ = Object.freeze(Object.keys(packs));
