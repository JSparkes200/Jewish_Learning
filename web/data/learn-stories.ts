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
  title: "Morning at home",
  gradeBand: "Survival Hebrew — first sentences (roughly A1)",
  register: "everyday",
  he: "בֹּקֶר טוֹב! אֲנִי יוֹשֵׁב בַּבַּיִת. אִמָּא שׁוֹתָה קָפֶה, וְאַבָּא קוֹרֵא סֵפֶר. הַכֶּלֶב שֶׁלָּנוּ יָשֵׁן. אֲנַחְנוּ אוֹכְלִים לֶחֶם. מַה אַתָּה עוֹשֶׂה הַיּוֹם?",
  en: "Good morning! I am sitting at home. Mom is drinking coffee, and dad is reading a book. Our dog is sleeping. We are eating bread. What are you doing today?",
  syntaxNotes: [
    "Hebrew often drops the word “is” or “am”: אֲנִי יוֹשֵׁב = “I (am) sitting.”",
    "Verbs change based on who is doing the action: יוֹשֵׁב (m. sg.), שׁוֹתָה (f. sg.), אוֹכְלִים (m. pl.).",
    "וְ־ “and” attaches directly to the next word: וְאַבָּא.",
  ],
};

const L2: CurriculumStory = {
  level: 2,
  id: "bet-market-day",
  title: "A day at the market",
  gradeBand: "Elementary narrative — past tense hooks (roughly A1–A2)",
  register: "everyday",
  he: "אֶתְמוֹל בַּבֹּקֶר הָלַכְתִּי לַשּׁוּק עִם חָבֵר. הָיָה חַם מְאוֹד. קָנִינוּ פֵּרוֹת, יְרָקוֹת, וְלֶחֶם טָרִי. פָּגַשְׁנוּ אֲנָשִׁים נֶחְמָדִים וְדִבַּרְנוּ הַרְבֵּה. אַחַר כָּךְ, יָשַׁבְנוּ בְּבֵית קָפֶה וְשָׁתִינוּ מַיִם קָרִים. הָיָה יוֹם מְצֻיָּן.",
  en: "Yesterday morning I went to the market with a friend. It was very hot. We bought fruits, vegetables, and fresh bread. We met nice people and talked a lot. Afterwards, we sat in a cafe and drank cold water. It was an excellent day.",
  syntaxNotes: [
    "Past tense verbs tell you who did the action at the end of the word: הָלַכְתִּי “I went,” קָנִינוּ “we bought.”",
    "Adjectives come after the noun they describe: לֶחֶם טָרִי (fresh bread), מַיִם קָרִים (cold water).",
    "לַ־ on שׁוּק shows motion toward a specific place: “to the market.”",
  ],
};

const L3: CurriculumStory = {
  level: 3,
  id: "gimel-shabbat-home",
  title: "Shabbat at home",
  gradeBand: "Guided reading — family + ritual vocabulary (roughly A2)",
  register: "home-liturgy",
  he: "בְּיוֹם שִׁשִּׁי בָּעֶרֶב, כָּל הַמִּשְׁפָּחָה מִתְכַּנֶּסֶת סָבִיב לַשֻּׁלְחָן. הַבַּיִת נָקִי וּמֵרִיחַ טוֹב. אִמָּא מְבָרֶכֶת עַל הַנֵּרוֹת, וְאַבָּא מְקַדֵּשׁ עַל הַיַּיִן. אֲנַחְנוּ שָׁרִים שִׁירִים, אוֹכְלִים אֲרוּחָה טְעִימָה, וּמְדַבְּרִים עַל מַה שֶּׁקָּרָה הַשָּׁבוּעַ. יֵשׁ תְּחוּשָׁה שֶׁל שָׁלוֹם וְשַׁלְוָה בָּאֲוִיר.",
  en: "On Friday evening, the whole family gathers around the table. The house is clean and smells good. Mom blesses the candles, and dad makes Kiddush over the wine. We sing songs, eat a tasty meal, and talk about what happened this week. There is a feeling of peace and tranquility in the air.",
  syntaxNotes: [
    "מִתְכַּנֶּסֶת — Hitpa‘el verb form, often used for reflexive or reciprocal actions (“gathers itself”).",
    "עַל — literally “on” or “over,” used here for blessing over things (candles, wine).",
    "מַה שֶּׁקָּרָה — “what (that) happened.” The שֶׁ connects clauses together.",
    "יֵשׁ + noun: “there is …” without a separate word for “there.”",
  ],
};

const L4: CurriculumStory = {
  level: 4,
  id: "dalet-news-budget",
  title: "News report",
  gradeBand: "Longer clause chains — public register (roughly B1)",
  register: "public-register",
  he: "הַמֶּמְשָׁלָה הִצְהִירָה הַבֹּקֶר עַל תָּכְנִית חֲדָשָׁה לְשִׁפּוּר הַחִנּוּךְ בַּפֶּרִיפֶרְיָה. שַׂר הָאוֹצָר הִבְטִיחַ לְהַקְצוֹת תַּקְצִיב מְיֻחָד לַמַּטָּרָה זוֹ. לַמְרוֹת זֹאת, הָאוֹפּוֹזִיצְיָה טָעֲנָה שֶׁהַתָּכְנִית לֹא מַסְפֶּקֶת וְשֶׁהִיא רַק הַבְטָחַת בְּחִירוֹת. בֵּינְתַיִם, הַמּוֹרִים מַמְתִּינִים לִרְאוֹת אִם הַמַּצָּב בֶּאֱמֶת יִשְׁתַּפֵּר.",
  en: "The government announced a new plan this morning to improve education in the periphery. The Finance Minister promised to allocate a special budget for this purpose. Despite this, the opposition claimed that the plan is insufficient and that it is just an election promise. Meanwhile, the teachers are waiting to see if the situation will truly improve.",
  syntaxNotes: [
    "לְשִׁפּוּר — “for the improvement of.” Using a verbal noun (gerund) is common in formal Hebrew.",
    "לַמְרוֹת זֹאת — “despite this.” A higher-register connector for contrasting ideas.",
    "שֶׁהַתָּכְנִית... וְשֶׁהִיא — “that the plan... and that it.” The שֶׁ is repeated for each clause.",
    "יִשְׁתַּפֵּר — Hitpa‘el future 3rd masc. (“will improve”).",
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
