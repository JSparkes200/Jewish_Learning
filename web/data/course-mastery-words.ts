/**
 * Hebrew lemmas/phrases used to approximate legacy `courseLevelMasteredCount`
 * (words in corpus at level n with vocab lv ≥ 2).
 *
 * Level 1: union of legacy `getCourseSections(1)` word lists (hebrew-v8.2.html)
 * and all MCQ `promptHe` for sections whose id starts with `1-`.
 * Levels 2–4: all `promptHe` from MCQ packs for that level’s section ids.
 */

import { SECTION_IDS_WITH_MCQ, getMcqPackForSection } from "./section-drills";

/** Legacy explicit Aleph subsection words (single source for parity with HTML). */
const LEVEL_1_LEGACY_ANCHOR_WORDS: readonly string[] = [
  "שָׁלוֹם",
  "תּוֹדָה",
  "בְּבַקָּשָׁה",
  "כֵּן",
  "לֹא",
  "תּוֹדָה רַבָּה",
  "סְלִיחָה",
  "אוֹקֵי",
  "בְּסֵדֶר",
  "טוֹב",
  "יַלְּלָה",
  "בֹּקֶר טוֹב",
  "עֶרֶב טוֹב",
  "לַיְלָה טוֹב",
  "בְּהַצְלָחָה",
  "חַג שָׂמֵחַ",
  "אֲנִי",
  "אַתָּה",
  "אַתְּ",
  "הוּא",
  "הִיא",
  "אֲנַחְנוּ",
  "אַתֶּם",
  "אַתֶּן",
  "הֵם",
  "הֵן",
  "זֶה",
  "זֹאת",
  "אֵלֶּה",
  "כֹּל",
  "כֻּלָּם",
  "אֶפֶס",
  "אֶחָד",
  "אַחַת",
  "שְׁנַיִם",
  "שְׁתַּיִם",
  "שְׁלֹשָׁה",
  "שָׁלֹשׁ",
  "אַרְבָּעָה",
  "אַרְבַּע",
  "חֲמִשָּׁה",
  "חָמֵשׁ",
  "שִׁשָּׁה",
  "שֵׁשׁ",
  "שִׁבְעָה",
  "שֶׁבַע",
  "שְׁמוֹנָה",
  "שְׁמוֹנֶה",
  "תִּשְׁעָה",
  "תֵּשַׁע",
  "עֲשָׂרָה",
  "עֶשֶׂר",
  "עֶשְׂרִים",
  "שְׁלֹשִׁים",
  "אַרְבָּעִים",
  "חֲמִשִּׁים",
  "מֵאָה",
  "אֶלֶף",
  "אַבָּא",
  "אִמָּא",
  "בֵּן",
  "בַּת",
  "יֶלֶד",
  "יַלְדָּה",
  "אָח",
  "אָחוֹת",
  "סָבָא",
  "סָבְתָּא",
  "דּוֹד",
  "דּוֹדָה",
  "מִשְׁפָּחָה",
  "גָּדוֹל",
  "גְּדוֹלָה",
  "קָטָן",
  "קְטַנָּה",
  "טוֹבָה",
  "רַע",
  "רָעָה",
  "אָדֹם",
  "אֲדֻמָּה",
  "כָּחוֹל",
  "יָרֹק",
  "לָבָן",
  "שָׁחוֹר",
  "רֹאשׁ",
  "פָּנִים",
  "עַיִן",
  "יָד",
  "פֶּה",
  "בַּיִת",
  "חֶדֶר",
  "מִטְבָּח",
  "דֶּלֶת",
  "חַלּוֹן",
  "מִיטָה",
  "כִּסֵּא",
  "שֻׁלְחָן",
  "מַה",
  "מִי",
  "אֵיפֹה",
  "מָתַי",
  "לָמָּה",
  "עַכְשָׁו",
  "הַיּוֹם",
  "אֶתְמוֹל",
  "מָחָר",
  "יוֹם",
  "לַיְלָה",
  "שָׁבוּעַ",
  "שָׁנָה",
  "לֶחֶם",
  "מַיִם",
  "חָלָב",
  "בָּשָׂר",
  "תַּפּוּחַ",
  "בָּנָנָה",
  "שֶׁמֶשׁ",
  "יָרֵחַ",
  "כּוֹכָב",
  "אָרֶץ",
  "יָם",
  "עֵץ",
  "כֶּלֶב",
  "חָתוּל",
  "לִהְיוֹת",
  "לַעֲשׂוֹת",
  "לָלֶכֶת",
  "לָבוֹא",
  "לֶאֱכֹל",
  "לִשְׁתּוֹת",
  "לִרְאוֹת",
  "לִשְׁמֹעַ",
  "לְדַבֵּר",
  "לוֹמַר",
  "לִכְתֹּב",
  "לִקְרֹא",
  "לֶאֱהֹב",
  "לִרְצוֹת",
  "יֵשׁ",
  "אֵין",
  "אֶפְשָׁר",
  "רֶגַע",
  "מַה נִּשְׁמַע",
  "מְאוֹד",
  "הַרְבֵּה",
  "בֶּאֱמֶת",
  "כְּמוֹבָן",
];

function collectMcqPromptsForLevel(level: number): Set<string> {
  const set = new Set<string>();
  const prefix = `${level}-`;
  for (const sid of SECTION_IDS_WITH_MCQ) {
    if (!sid.startsWith(prefix)) continue;
    const p = getMcqPackForSection(sid);
    if (!p || p.kind !== "mcq") continue;
    for (const it of p.items) {
      const h = it.promptHe?.trim();
      if (h) set.add(h);
    }
  }
  return set;
}

/**
 * Distinct Hebrew strings used for mastery counting at this course level
 * (subset of legacy full corpus `D`).
 */
export function getMasteryWordListForLevel(level: number): readonly string[] {
  const set = new Set<string>();
  if (level === 1) {
    for (const w of LEVEL_1_LEGACY_ANCHOR_WORDS) set.add(w);
  }
  for (const h of collectMcqPromptsForLevel(level)) set.add(h);

  /** Recompute each call so new MCQ prompts in drills always affect gates (no stale cache). */
  return Object.freeze(Array.from(set));
}
