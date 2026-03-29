/**
 * Static שׁוֹרֶשׁ families from legacy `hebrew-v8.2.html` `ROOTS` (no full corpus `D`).
 */

export type RootWordForm = { h: string; p: string; e: string };

export type CourseRootFamily = {
  root: string;
  meaning: string;
  words: RootWordForm[];
  sentence?: string;
  trans?: string;
};

/** Same order as legacy — used for roots tab / graduated drill parity. */
export const STATIC_ROOT_FAMILIES: readonly CourseRootFamily[] = [
  {
    root: "הלך",
    meaning: "movement / going",
    words: [
      { h: "הָלַךְ", p: "halach", e: "walked (past m.)" },
      { h: "הוֹלֵךְ", p: "holech", e: "walking (present m.)" },
      { h: "יֵלֵךְ", p: "yelech", e: "will go (future m.)" },
      { h: "לָלֶכֶת", p: "lalachet", e: "to go (infinitive)" },
      { h: "הֲלִיכָה", p: "halicha", e: "walking (noun)" },
      { h: "מַהֲלָךְ", p: "mahalach", e: "process / course of events" },
    ],
    sentence: "הוּא הוֹלֵךְ לַשּׁוּק כָּל יוֹם",
    trans: "He goes to the market every day",
  },
  {
    root: "כתב",
    meaning: "writing",
    words: [
      { h: "כָּתַב", p: "katav", e: "wrote (past m.)" },
      { h: "כּוֹתֵב", p: "kotev", e: "writing (present m.)" },
      { h: "יִכְתֹּב", p: "yichtov", e: "will write (future m.)" },
      { h: "לִכְתֹּב", p: "lichtov", e: "to write (infinitive)" },
      { h: "כְּתָבָה", p: "ktava", e: "article / report" },
      { h: "כְּתוֹבֶת", p: "ktovet", e: "address" },
      { h: "מִכְתָּב", p: "michtav", e: "letter (correspondence)" },
      { h: "כְּתָב יָד", p: "ktav yad", e: "handwriting" },
    ],
    sentence: "הִיא כּוֹתֶבֶת מִכְתָּב לַחֲבֵרָה שֶׁלָּהּ",
    trans: "She is writing a letter to her friend",
  },
  {
    root: "אמר",
    meaning: "speech / saying",
    words: [
      { h: "אָמַר", p: "amar", e: "said (past m.)" },
      { h: "אוֹמֵר", p: "omer", e: "saying (present m.)" },
      { h: "יֹאמַר", p: "yomar", e: "will say (future m.)" },
      { h: "לוֹמַר", p: "lomar", e: "to say (infinitive)" },
      { h: "אֲמִירָה", p: "amira", e: "saying / utterance" },
      { h: "מַאֲמָר", p: "ma'amar", e: "article / essay" },
    ],
    sentence: "הוּא אוֹמֵר תּוֹדָה לְכֻלָּם",
    trans: "He says thank you to everyone",
  },
  {
    root: "ידע",
    meaning: "knowledge / knowing",
    words: [
      { h: "יָדַע", p: "yada", e: "knew (past m.)" },
      { h: "יוֹדֵעַ", p: "yode'a", e: "knows (present m.)" },
      { h: "יֵדַע", p: "yeda", e: "will know (future m.)" },
      { h: "לָדַעַת", p: "lada'at", e: "to know (infinitive)" },
      { h: "דַּעַת", p: "da'at", e: "knowledge" },
      { h: "יְדִיעָה", p: "yedi'a", e: "news item / knowledge" },
      { h: "הוֹדִיעַ", p: "hodi'a", e: "informed / announced (Hif'il)" },
      { h: "מוֹדִיעִין", p: "modi'in", e: "intelligence (military)" },
    ],
    sentence: "אֲנִי לֹא יוֹדֵעַ מַה לַעֲשׂוֹת",
    trans: "I don't know what to do",
  },
  {
    root: "ראה",
    meaning: "seeing / vision",
    words: [
      { h: "רָאָה", p: "ra'a", e: "saw (past m.)" },
      { h: "רוֹאֶה", p: "ro'e", e: "sees (present m.)" },
      { h: "יִרְאֶה", p: "yir'e", e: "will see (future m.)" },
      { h: "לִרְאוֹת", p: "lirot", e: "to see (infinitive)" },
      { h: "רְאִיָּה", p: "re'iya", e: "vision / sight" },
      { h: "מַרְאֶה", p: "mar'e", e: "appearance / view" },
      { h: "רְאִיּוֹן", p: "re'iyon", e: "interview" },
    ],
    sentence: "אֲנִי רוֹצֶה לִרְאוֹת אוֹתְךָ",
    trans: "I want to see you",
  },
  {
    root: "שמע",
    meaning: "hearing / listening",
    words: [
      { h: "שָׁמַע", p: "shama", e: "heard (past m.)" },
      { h: "שׁוֹמֵעַ", p: "shome'a", e: "hearing (present m.)" },
      { h: "יִשְׁמַע", p: "yishma", e: "will hear (future m.)" },
      { h: "לִשְׁמֹעַ", p: "lishmoa", e: "to hear (infinitive)" },
      { h: "שֵׁמַע", p: "shema", e: "Shema / Listen (prayer)" },
      { h: "שְׁמוּעָה", p: "shmua", e: "rumour / news" },
      { h: "מִשְׁמַעַת", p: "mishma'at", e: "discipline / obedience" },
    ],
    sentence: "שָׁמַעְתָּ אֶת הַחֲדָשׁוֹת?",
    trans: "Did you hear the news?",
  },
  {
    root: "אהב",
    meaning: "love / liking",
    words: [
      { h: "אָהַב", p: "ahav", e: "loved (past m.)" },
      { h: "אוֹהֵב", p: "ohev", e: "loves (present m.)" },
      { h: "יֶאֱהַב", p: "ye'ehav", e: "will love (future m.)" },
      { h: "לֶאֱהֹב", p: "le'ehov", e: "to love (infinitive)" },
      { h: "אַהֲבָה", p: "ahava", e: "love (noun)" },
      { h: "אָהוּב", p: "ahuv", e: "beloved / loved one" },
    ],
    sentence: "אֲנִי אוֹהֵב אוֹתְךָ מְאוֹד",
    trans: "I love you very much",
  },
  {
    root: "בוא",
    meaning: "coming / arrival",
    words: [
      { h: "בָּא", p: "ba", e: "came (past m.)" },
      { h: "בָּאָה", p: "ba'a", e: "came (past f.)" },
      { h: "יָבוֹא", p: "yavo", e: "will come (future m.)" },
      { h: "לָבוֹא", p: "lavo", e: "to come (infinitive)" },
      { h: "בִּיאָה", p: "bi'a", e: "arrival / coming" },
      { h: "מוֹבָא", p: "muva", e: "imported / brought (passive)" },
    ],
    sentence: "מָתַי תָּבוֹא אֵלַי?",
    trans: "When will you come to me?",
  },
  {
    root: "נתן",
    meaning: "giving",
    words: [
      { h: "נָתַן", p: "natan", e: "gave (past m.)" },
      { h: "נוֹתֵן", p: "noten", e: "giving (present m.)" },
      { h: "יִתֵּן", p: "yiten", e: "will give (future m.)" },
      { h: "לָתֵת", p: "latet", e: "to give (infinitive)" },
      { h: "מַתָּנָה", p: "matana", e: "gift" },
      { h: "נְתִינָה", p: "netina", e: "giving (noun)" },
    ],
    sentence: "הִיא נָתְנָה לוֹ מַתָּנָה יָפָה",
    trans: "She gave him a beautiful gift",
  },
  {
    root: "שלם",
    meaning: "wholeness / peace / payment",
    words: [
      { h: "שָׁלוֹם", p: "shalom", e: "peace / hello / goodbye" },
      { h: "שָׁלֵם", p: "shalem", e: "whole / complete" },
      { h: "שִׁלֵּם", p: "shilem", e: "paid" },
      { h: "מַשְׁלִים", p: "mashlim", e: "completes / supplements" },
      { h: "יְרוּשָׁלַיִם", p: "Yerushalayim", e: "Jerusalem (city of peace)" },
      { h: "שְׁלֵמוּת", p: "shlemut", e: "wholeness / perfection" },
    ],
    sentence: "שְׁלֵמוּת הִיא הַמַּטָּרָה",
    trans: "Wholeness is the goal",
  },
];

export const ROOT_TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: "Tier 1 — Core verb forms (past, present, future, infinitive)",
  2: "Tier 2 — Derived nouns and common forms",
  3: "Tier 3 — Advanced derivatives and compounds",
};

export function flattenAllRootWords(
  families: readonly CourseRootFamily[],
): RootWordForm[] {
  return families.flatMap((f) => f.words);
}
