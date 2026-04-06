/**
 * Expected `g10` — plural adjectives aligned to legacy L2 agreement rows in
 * `hebrew-v8.2.html` (“GRAMMAR PATTERNS — ADJECTIVE AGREEMENT”).
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G10_LEGACY_ALIGNED: GrammarDrillTopic = {
  id: "g10",
  topic: "Plural adjectives — who they describe",
  prompt:
    "Pick the plural adjective that matches a masculine-plural or feminine-plural subject (legacy L2 agreement rows).",
  items: [
    {
      h: "הַיְלָדִים ___ מְאֹד",
      cue: "The boys are very big (m. pl. subject)",
      opts: ["גְּדוֹלִים", "גְּדוֹלוֹת", "גָּדוֹל", "גְּדוֹלָה"],
      ans: 0,
      note: "יְלָדִים is masculine plural → גְּדוֹלִים (ים- plural for m. adjectives in the corpus)",
    },
    {
      h: "הַחֲבֵרוֹת ___",
      cue: "The friends (f.) are beautiful",
      opts: ["יָפִים", "יָפוֹת", "יָפֶה", "יָפָה"],
      ans: 1,
      note: "חֲבֵרוֹת is feminine plural → יָפוֹת — וֹת- marks feminine plural adjectives",
    },
    {
      h: "הַסְּפָרִים עֲדַיִן ___",
      cue: "The books are still new (m. pl.)",
      opts: ["חֲדָשִׁים", "חֲדָשׁוֹת", "חָדָשׁ", "חֲדָשָׁה"],
      ans: 0,
      note: "סְפָרִים is masculine plural → חֲדָשִׁים",
    },
    {
      h: "הַמִּשְׁפָּחוֹת ___",
      cue: "The families are good (f. pl.)",
      opts: ["טוֹבִים", "טוֹבוֹת", "טוֹב", "טוֹבָה"],
      ans: 1,
      note: "מִשְׁפָּחוֹת is feminine plural → טוֹבוֹת",
    },
  ],
};
