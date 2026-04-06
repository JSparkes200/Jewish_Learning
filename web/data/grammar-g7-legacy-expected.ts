/**
 * Expected `g7` grammar topic: legacy `GRAM` in `hebrew-v8.2.html` ends at g5; g7
 * extends the track using the same present-tense rows the HTML corpus uses for
 * אכל / הלך / ראה / דבר (see Vitest file for exact substring anchors).
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G7_LEGACY_ALIGNED: GrammarDrillTopic = {
  id: "g7",
  topic: "Present tense — who’s doing it",
  prompt:
    "Pick the present-tense form that matches the subject (spoken Hebrew).",
  items: [
    {
      h: "הוּא ___ פִּיצָה",
      cue: "He’s eating pizza (present)",
      opts: ["אוֹכֵל", "אָכַל", "יֹאכַל", "אָכוּל"],
      ans: 0,
      note: "Masculine singular present of אכל — אוֹכֵל (see legacy corpus rows for m. pres.)",
    },
    {
      h: "הִיא ___ לַמּוֹכֶלֶת",
      cue: "She’s walking to the salesperson (present)",
      opts: ["הוֹלֵךְ", "הוֹלֶכֶת", "הָלְכָה", "תֵּלֵךְ"],
      ans: 1,
      note: "Feminine singular present of הלך — הוֹלֶכֶת",
    },
    {
      h: "הִיא ___ אֶת הַיְלָדִים",
      cue: "She sees the children (present)",
      opts: ["רוֹאָה", "רוֹאֶה", "רָאְתָה", "תִּרְאֶה"],
      ans: 0,
      note: "Feminine singular present of ראה — רוֹאָה (legacy corpus: f. pres.)",
    },
    {
      h: "אַתָּה ___ עִבְרִית?",
      cue: "You speak Hebrew (m., present)?",
      opts: ["מְדַבֵּר", "דִּבַּרְתָּ", "תְּדַבֵּר", "מְדַבֶּרֶת"],
      ans: 0,
      note: "Masculine singular present of דבר — מְדַבֵּר",
    },
  ],
};
