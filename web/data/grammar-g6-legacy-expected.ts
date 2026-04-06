/**
 * Expected `g6` grammar topic: legacy `hebrew-v8.2.html` has no `GRAM[5]` entry
 * (GRAM ends at g5). Items align with BASIC VERBS infinitives (e.g. לֶאֱכֹל line ~2543)
 * and ROOTS infinitives for הלך / ראה (~7521, ~7557).
 *
 * Vitest compares {@link GRAMMAR_DRILLS} `g6` to this object so edits do not drift.
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G6_LEGACY_ALIGNED: GrammarDrillTopic = {
  id: "g6",
  topic: "Infinitive — ל + stem",
  prompt:
    "Pick the infinitive that matches the cue (modern conversational Hebrew).",
  items: [
    {
      h: "ל___ (to eat)",
      cue: "infinitive of אכל",
      opts: ["לֶאֱכֹל", "אוֹכֵל", "אָכַל", "נֶאֱכַל"],
      ans: 0,
      note: "ל + אכל → לֶאֱכֹל (same spelling as legacy BASIC VERBS row) — ל־ marks the infinitive",
    },
    {
      h: "ל___ (to go)",
      cue: "infinitive of הלך",
      opts: ["הוֹלֵךְ", "לָלֶכֶת", "הָלַךְ", "נוֹלֵךְ"],
      ans: 1,
      note: "לָלֶכֶת is the everyday infinitive for ‘to go’",
    },
    {
      h: "ל___ (to see)",
      cue: "infinitive of ראה",
      opts: ["רוֹאֶה", "לִרְאוֹת", "רָאָה", "יִרְאֶה"],
      ans: 1,
      note: "לִרְאוֹת — ל + stem with characteristic vowels for this root",
    },
  ],
};
