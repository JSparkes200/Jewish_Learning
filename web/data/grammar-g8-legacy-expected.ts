/**
 * Expected `g8` — future Pa’al anchors in `hebrew-v8.2.html` L1 future lists + ROOTS.
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G8_LEGACY_ALIGNED: GrammarDrillTopic = {
  id: "g8",
  topic: "Future tense — Pa’al spine",
  prompt:
    "Pick the future form that matches the subject (same roots as legacy L1 future + ROOTS rows).",
  items: [
    {
      h: "הוּא מָחָר ___ לְבֵית הַסֵּפֶר",
      cue: "He will go to school tomorrow",
      opts: ["הוֹלֵךְ", "יֵלֵךְ", "הָלַךְ", "לֵילֵךְ"],
      ans: 1,
      note: "3rd person masculine future of הלך — יֵלֵךְ (י־ prefix)",
    },
    {
      h: "אֲנִי ___ בּוֹקֶר",
      cue: "I will eat in the morning",
      opts: ["אוֹכֵל", "אֹכַל", "אָכַל", "אֶאֱכַל"],
      ans: 1,
      note: "1st person future of אכל — אֹכַל (legacy L1 future list)",
    },
    {
      h: "אֲנַחְנוּ ___ יַחַד לַשּׁוּק",
      cue: "We will go to the market together",
      opts: ["הוֹלְכִים", "נֵלֵךְ", "נֶאֱכַל", "נִרְאֶה"],
      ans: 1,
      note: "1st person plural future of הלך — נֵלֵךְ",
    },
    {
      h: "הֵם ___ אֶת הַסֶּרֶט מָחָר",
      cue: "They will see the film tomorrow",
      opts: ["רוֹאִים", "רָאוּ", "יִרְאוּ", "יִרְאֶה"],
      ans: 2,
      note: "3rd person plural future of ראה — יִרְאוּ",
    },
  ],
};
