/**
 * MCQ packs for the Yiddish course (authored; expand over time).
 */

import type { McqDrillPack } from "./section-drill-types";

function mcq(
  title: string,
  intro: string,
  items: McqDrillPack["items"],
): McqDrillPack {
  return { kind: "mcq", title, intro, items };
}

const PACKS: Record<string, McqDrillPack> = {
  "yid-1": mcq(
    "Greetings & cognates",
    "Pick the best English gloss for the Yiddish in Hebrew letters.",
    [
      {
        id: "y1-1",
        promptHe: "אַ גוטן טאָג",
        correctEn: "good day (greeting)",
        distractorsEn: ["good night only", "see you tomorrow", "excuse me"],
      },
      {
        id: "y1-2",
        promptHe: "שלום־עליכם",
        correctEn: "Shalom aleichem (peace upon you — greeting)",
        distractorsEn: ["goodbye only", "thank you", "please"],
      },
      {
        id: "y1-3",
        promptHe: "וואָס הייסטו?",
        correctEn: "What is your name? (informal)",
        distractorsEn: ["Where do you live?", "How old are you?", "Good night"],
      },
      {
        id: "y1-4",
        promptHe: "איך הייס…",
        correctEn: "My name is… (I am called…)",
        distractorsEn: ["I refuse", "I sleep", "I leave"],
      },
      {
        id: "y1-5",
        promptHe: "בָּאַל־הַבַּיִת (in Yiddish speech context)",
        correctEn: "master of the house / host sense (cultural word)",
        distractorsEn: ["post office", "train ticket", "weather map"],
      },
      {
        id: "y1-6",
        promptHe: "מען זאָגט…",
        correctEn: "one says / they say (impersonal)",
        distractorsEn: ["I always shout", "we never speak", "only written"],
      },
    ],
  ),

  "yid-2": mcq(
    "Pronouns & זײַן",
    "איך בין, דו ביסט — present “to be” and pronouns.",
    [
      {
        id: "y2-1",
        promptHe: "איך בין אַ …",
        correctEn: "I am a …",
        distractorsEn: ["you are", "they are", "we will"],
      },
      {
        id: "y2-2",
        promptHe: "דו ביסט",
        correctEn: "you are (singular informal)",
        distractorsEn: ["I am", "we are", "they were"],
      },
      {
        id: "y2-3",
        promptHe: "ער איז",
        correctEn: "he is",
        distractorsEn: ["she is", "it was", "we are"],
      },
      {
        id: "y2-4",
        promptHe: "מיר זענען",
        correctEn: "we are",
        distractorsEn: ["you are (sg.)", "I am", "they were"],
      },
      {
        id: "y2-5",
        promptHe: "זי איז",
        correctEn: "she is",
        distractorsEn: ["he is", "it is (neuter)", "we are"],
      },
      {
        id: "y2-6",
        promptHe: "עס איז",
        correctEn: "it is",
        distractorsEn: ["they are", "I am", "you are"],
      },
    ],
  ),

  "yid-3": mcq(
    "Questions & negation",
    "וואָס / וווּ / נישׁט",
    [
      {
        id: "y3-1",
        promptHe: "וואָס מאַכט איר?",
        correctEn: "What are you doing? (polite plural / formal)",
        distractorsEn: ["Where are you?", "Who is that?", "Good night"],
      },
      {
        id: "y3-2",
        promptHe: "ווּ איז…?",
        correctEn: "Where is…?",
        distractorsEn: ["When is…?", "Why is…?", "How much?"],
      },
      {
        id: "y3-3",
        promptHe: "וואָרום נישׁט?",
        correctEn: "why not?",
        distractorsEn: ["where not?", "never", "thank you"],
      },
      {
        id: "y3-4",
        promptHe: "איך ווייס נישׁט",
        correctEn: "I don’t know",
        distractorsEn: ["I refuse", "I always know", "I sleep"],
      },
      {
        id: "y3-5",
        promptHe: "נישׁט איצט",
        correctEn: "not now",
        distractorsEn: ["now only", "always", "never mind"],
      },
      {
        id: "y3-6",
        promptHe: "פֿאַר וואָס?",
        correctEn: "why? (for what?)",
        distractorsEn: ["where?", "how much?", "who?"],
      },
    ],
  ),

  "yid-4": mcq(
    "Home & food",
    "High-frequency nouns.",
    [
      {
        id: "y4-1",
        promptHe: "ברויט",
        correctEn: "bread",
        distractorsEn: ["meat", "water only", "salt only"],
      },
      {
        id: "y4-2",
        promptHe: "טיי",
        correctEn: "tea",
        distractorsEn: ["coffee only", "milk", "wine"],
      },
      {
        id: "y4-3",
        promptHe: "קיך",
        correctEn: "kitchen",
        distractorsEn: ["street", "school", "train"],
      },
      {
        id: "y4-4",
        promptHe: "טיש",
        correctEn: "table",
        distractorsEn: ["chair", "window", "door key"],
      },
      {
        id: "y4-5",
        promptHe: "פֿאַמיליע",
        correctEn: "family",
        distractorsEn: ["friend only", "enemy", "teacher"],
      },
      {
        id: "y4-6",
        promptHe: "שלאָף־צימער",
        correctEn: "bedroom (sleep-room)",
        distractorsEn: ["kitchen", "bathroom", "street"],
      },
    ],
  ),

  "yid-5": mcq(
    "Review mix",
    "Mixed items from the mini-course.",
    [
      {
        id: "y5-1",
        promptHe: "אַ פֿריילעכן יום־טובֿ",
        correctEn: "a joyful holiday (blessing tone)",
        distractorsEn: ["good night", "see you", "excuse me"],
      },
      {
        id: "y5-2",
        promptHe: "מיר גייען",
        correctEn: "we are going / we go",
        distractorsEn: ["we are", "they went", "I stay"],
      },
      {
        id: "y5-3",
        promptHe: "זי הערט נישׁט",
        correctEn: "she doesn’t hear",
        distractorsEn: ["she sees", "we hear", "I sleep"],
      },
      {
        id: "y5-4",
        promptHe: "ביטע",
        correctEn: "please",
        distractorsEn: ["thank you", "sorry", "goodbye"],
      },
      {
        id: "y5-5",
        promptHe: "אַ דאַנק",
        correctEn: "thanks",
        distractorsEn: ["please", "sorry", "maybe"],
      },
      {
        id: "y5-6",
        promptHe: "איך פֿאַרשטיי",
        correctEn: "I understand",
        distractorsEn: ["I refuse", "I sleep", "I forget"],
      },
    ],
  ),
};

export function getYiddishDrillPack(sectionId: string): McqDrillPack | undefined {
  return PACKS[sectionId];
}
