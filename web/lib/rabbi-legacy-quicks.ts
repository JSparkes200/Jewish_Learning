/**
 * Copy and quick-prompt patterns from legacy `hebrew-v8.2.html` Ask the Rabbi modal
 * (`openAskRabbi`, `rabbi-quick-asks`). Encouragement phrases are available for drills.
 */

export const RABBI_STUDY_INVITE_HE = "בּוֹא נִלְמַד זֹאת יַחַד.";
export const RABBI_STUDY_INVITE_EN = "Let us study this together.";

/** Same intent as legacy MEANING / ROOT / GRAMMAR / EXAMPLE buttons → `submitAskRabbi()`. */
export const RABBI_QUICK_FOLLOW_UPS = [
  { label: "Meaning", prompt: "What does this mean?" },
  { label: "Root", prompt: "What is the root?" },
  { label: "Grammar", prompt: "Explain the grammar." },
  { label: "Example", prompt: "Give me an example." },
] as const;

/** Legacy `RABBI_PHRASES_OK` — short praise after a correct drill answer. */
export const RABBI_PHRASES_OK: readonly { h: string; e: string }[] = [
  { h: "כָּל הַכָּבוֹד!", e: "Kol hakavod!" },
  { h: "יָפֶה מְאוֹד!", e: "Yafe me'od!" },
  { h: "מְצוּיָן!", e: "Metzuyan!" },
  { h: "מְעוּלֶה!", e: "Me'ule!" },
  { h: "נָכוֹן!", e: "Nakhon!" },
];

/** Legacy `RABBI_PHRASES_WRONG` — gentle redirect after a wrong answer. */
export const RABBI_PHRASES_WRONG: readonly { h: string; e: string }[] = [
  {
    h: "לֹא בְּדִיּוּק — בּוֹא נְנַסֶּה שׁוּב!",
    e: "Lo b'diyuk — bo n'naseh shuv!",
  },
  {
    h: "כִּמְעַט! אַתָּה בַּדֶּרֶךְ הַנְּכוֹנָה.",
    e: "Kim'at! Ata b'derech han'khonah.",
  },
  {
    h: "כָּל הַכָּבוֹד! בּוֹא נִסְתַּכֵּל יַחַד.",
    e: "Kol hakavod! Bo nistakel yachad.",
  },
  {
    h: "תַּלְמִיד חָכָם לוֹמֵד מִטָּעוּיוֹת.",
    e: "Talmid chacham lomed mi-ta'uyot.",
  },
  {
    h: "אוֹי! זוֹ שְׁאֵלָה קָשָׁה — תֵּן לִי לְהַסְבִּיר.",
    e: "Oy! Zo she'elah kasha — ten li lehasbir.",
  },
  {
    h: "אַל תִּדְאַג — גַּם הַחֲכָמִים טָעוּ לְפָעֲמִים.",
    e: "Al tid'ag — gam hachamim ta'u lif'amim.",
  },
];
