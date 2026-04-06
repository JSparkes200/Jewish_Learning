/**
 * Expected `g9` — question words anchored to legacy `hebrew-v8.2.html` rows.
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G9_LEGACY_ALIGNED: GrammarDrillTopic = {
  id: "g9",
  topic: "Question words — openers",
  prompt:
    "Choose the question word that fits the sentence (modern conversational Hebrew).",
  items: [
    {
      h: "___ נִּשְׁמַע?",
      cue: "What’s up? / What’s new?",
      opts: ["מַה", "מִי", "אֵיפֹה", "לָמָּה"],
      ans: 0,
      note: "מַה נִּשְׁמַע — fixed colloquial greeting pattern in the legacy corpus",
    },
    {
      h: "___ הַבַּנְק?",
      cue: "Where is the bank?",
      opts: ["מַה", "אֵיךְ", "אֵיפֹה", "מִי"],
      ans: 2,
      note: "Location questions start with אֵיפֹה",
    },
    {
      h: "___ קוֹרְאִים לָךְ?",
      cue: "What are you called? (How is your name said?)",
      opts: ["לָמָּה", "אֵיךְ", "מִי", "מַה"],
      ans: 1,
      note: "אֵיךְ קוֹרְאִים … — how one is called",
    },
    {
      h: "___ לֹא בָּאת אֶתְמוֹל?",
      cue: "Why didn’t you come yesterday?",
      opts: ["אֵיפֹה", "אֵיךְ", "לָמָּה", "מַה"],
      ans: 2,
      note: "לָמָּה — why (legacy corpus spelling with double מ)",
    },
  ],
};
