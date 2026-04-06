/**
 * Expected `g11` — smichut compounds anchored to legacy phrasebook rows in
 * `hebrew-v8.2.html`, plus the definite-article-on-second-noun rule.
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G11_LEGACY_ALIGNED: GrammarDrillTopic = {
  id: "g11",
  topic: "Construct state — fill the second noun",
  prompt:
    "Complete סְמִיכוּת (noun–noun) phrases. Rule: the definite article הַ goes on the **second** noun when the whole phrase is definite — בֵּית הַסֵּפֶר ‘the school’, never *הַבֵּית סֵפֶר.",
  items: [
    {
      h: "___ — בֵּית סֵפֶר מְסֻיָּם (הַנִיסוּחַ הַנָּכוֹן)",
      cue: "The school — definite smichut: ה only on the second noun",
      opts: ["בֵּית הַסֵּפֶר", "הַבֵּית סֵפֶר", "הַבַּיִת סֵפֶר", "בֵּית סֵפֶר הַ"],
      ans: 0,
      note: "בֵּית הַסֵּפֶר — first noun stays bound without ה; ה attaches to the second noun (not הַבֵּית סֵפֶר).",
    },
    {
      h: "בֵּית ___",
      cue: "school (literally house of a book)",
      opts: ["סֵפֶר", "סְפָרִים", "לִימוּד", "דֶּלֶת"],
      ans: 0,
      note: "בֵּית סֵפֶר — fixed compound in the phrasebook (indefinite / generic)",
    },
    {
      h: "בֵּית ___",
      cue: "café",
      opts: ["קָפֶה", "קְפִיצָה", "קָפֶץ", "כֹּפֶת"],
      ans: 0,
      note: "בֵּית קָפֶה — same pattern as other בֵּית compounds",
    },
    {
      h: "חֲנוּת ___",
      cue: "grocery store",
      opts: ["מִכּוֹלֶת", "מַכּוֹלֶת", "כּוֹל", "כֹּל"],
      ans: 0,
      note: "חֲנוּת מִכּוֹלֶת — construct: shop of provisions",
    },
    {
      h: "תַּחֲנַת ___",
      cue: "police station",
      opts: ["מִשְׁטָרָה", "מִשְׁתָרֶה", "שְׁטָר", "דֶּרֶךְ"],
      ans: 0,
      note: "תַּחֲנַת מִשְׁטָרָה — station of police",
    },
  ],
};
