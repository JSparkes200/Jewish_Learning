/**
 * Level-wide reading passages (Aleph–Dalet) + short syntax notes for the story screen.
 * MCQ packs that follow each story live in `course-stories.ts`.
 */

export type CurriculumStory = {
  level: 1 | 2 | 3 | 4;
  /** Stable id for exports / analytics */
  id: string;
  title: string;
  /** Plain-language band for teachers / parents */
  gradeBand: string;
  register: "everyday" | "home-liturgy" | "public-register";
  he: string;
  en: string;
  /** Short English syntax bullets — pair with Ask the Rabbi for depth */
  syntaxNotes: string[];
};

const L1: CurriculumStory = {
  level: 1,
  id: "aleph-dani-home",
  title: "Dani at home",
  gradeBand: "Survival Hebrew — first sentences (roughly A1)",
  register: "everyday",
  he: "דָּנִי הוּא יֶלֶד קָטָן. הוּא אוֹמֵר שָׁלוֹם לְכֻלָּם. שָׁלוֹם אִמָּא! שָׁלוֹם אַבָּא! כֻּלָּם אוֹהֲבִים אֶת דָּנִי.",
  en: "Dani is a small boy. He says hello to everyone. Hello mom! Hello dad! Everyone loves Dani.",
  syntaxNotes: [
    "Hebrew often drops the word “is”: הוּא יֶלֶד = “he (is) a boy.”",
    "לְ־ before כֻּלָּם means “to everyone” — the preposition is glued to the next word.",
    "אֶת marks a definite direct object: אוֹהֲבִים אֶת דָּנִי = “they love Dani” (Dani is definite by name).",
  ],
};

const L2: CurriculumStory = {
  level: 2,
  id: "bet-market-day",
  title: "A day at the market",
  gradeBand: "Elementary narrative — past tense hooks (roughly A1–A2)",
  register: "everyday",
  he: "אֶתְמוֹל הָלַכְתִּי לַשּׁוּק. קָנִיתִי לֶחֶם וּמַיִם. פָּגַשְׁתִּי חָבֵר וְדִבַּרְנוּ הַרְבֵּה. הַיּוֹם אֲנִי בַּבַּיִת.",
  en: "Yesterday I went to the market. I bought bread and water. I met a friend and we talked a lot. Today I am at home.",
  syntaxNotes: [
    "Past tense, 1st person: הָלַכְתִּי “I went,” קָנִיתִי “I bought,” פָּגַשְׁתִּי “I met.”",
    "וְ־ “and” attaches to the next word: וּמַיִם, וְדִבַּרְנוּ.",
    "לַ־ on שׁוּק shows motion toward: “to the market.”",
    "הַיּוֹם אֲנִי בַּבַּיִת — no “am” needed before a place phrase.",
  ],
};

const L3: CurriculumStory = {
  level: 3,
  id: "gimel-shabbat-home",
  title: "Shabbat at home",
  gradeBand: "Guided reading — family + ritual vocabulary (roughly A2)",
  register: "home-liturgy",
  he: "בְּכָל שַׁבָּת אֲנַחְנוּ מִתְכַּנְּסִים יַחַד. אָבִי קוֹרֵא תּוֹרָה. אִמִּי מְבָרֶכֶת אֶת הַנֵּרוֹת. יֵשׁ שָׁלוֹם וְאַהֲבָה בַּבַּיִת.",
  en: "Every Shabbat we gather together. My father reads Torah. My mother blesses the candles. There is peace and love in the home.",
  syntaxNotes: [
    "מִתְכַּנְּסִים — Hitpa‘el plural (“we gather ourselves” → we gather).",
    "אָבִי / אִמִּי — possessive suffixes: “my father,” “my mother.”",
    "אֶת הַנֵּרוֹת — definite direct object before the candles.",
    "יֵשׁ + noun: “there is …” without a separate word for “there.”",
  ],
};

const L4: CurriculumStory = {
  level: 4,
  id: "dalet-news-budget",
  title: "News snippet",
  gradeBand: "Longer clause chains — public register (roughly B1)",
  register: "public-register",
  he: "הַמֶּמְשָׁלָה הִצְהִירָה עַל תַּקְצִיב חָדָשׁ לְחִינּוּךְ. הָאוֹפּוֹזִיצְיָה טָעֲנָה שֶׁזֶּה סְתָם לֹא מַסְפִּיק. אֲבָל הַמַּצָּב, בְּעֶרֶךְ, הִשְׁתַּפֵּר.",
  en: "The government announced a new education budget. The opposition claimed it's just not enough. But the situation has more or less improved.",
  syntaxNotes: [
    "הִצְהִירָה עַל — verb + “about/on” for reporting announcements.",
    "שֶׁזֶּה — subordinate clause (“that this …”) inside reported speech.",
    "בְּעֶרֶךְ — adverbial “approximately / more or less” modifying the clause.",
    "הִשְׁתַּפֵּר — Hitpa‘el perfect 3rd masc. (“improved”) agreeing with הַמַּצָּב.",
  ],
};

export const CURRICULUM_STORIES: CurriculumStory[] = [L1, L2, L3, L4];

/** Same pair historically exported from `course.ts` for Aleph read-aloud sections. */
export const LEVEL_1_STORY = {
  he: L1.he,
  en: L1.en,
} as const;

export function getCurriculumStory(
  level: number,
): CurriculumStory | undefined {
  return CURRICULUM_STORIES.find((s) => s.level === level);
}

export function getStorySyntaxNotes(level: number): string[] {
  return getCurriculumStory(level)?.syntaxNotes ?? [];
}
