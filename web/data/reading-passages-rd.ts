/**
 * Built-in reading passages from legacy `hebrew-v8.2.html` `RD[]`.
 * Used by `/reading` carousel: tap-to-hear + optional tq/wq quizzes.
 */

export type ReadingPassageTq = {
  w: string;
  c: string;
  o: readonly string[];
};

export type ReadingPassageWq = {
  e: string;
  c: string;
  o: readonly string[];
};

export type ReadingPassageRd = {
  id: string;
  label: string;
  icon: string;
  col: string;
  lv: number;
  src: string;
  h: string;
  e: string;
  vocab: readonly { h: string; p: string; e: string }[];
  tq: readonly ReadingPassageTq[];
  wq: readonly ReadingPassageWq[];
};

export const READING_PASSAGES_RD: readonly ReadingPassageRd[] = [
  {
    id: "child1",
    label: "Dani & Books",
    icon: "📖",
    col: "#4a6830",
    lv: 1,
    src: "Children's Story",
    h: "דָּנִי אוֹהֵב לִקְרוֹא סְפָרִים. הוּא קוֹרֵא כָּל יוֹם. הַסְּפָרִים הֵם חֲבֵרִים שֶׁלּוֹ. יוֹם אֶחָד הוּא קָרָא סֵפֶר עַל כּוֹכָבִים וְשָׁמַיִם.",
    e: "Dani loves to read books. He reads every day. The books are his friends. One day he read a book about stars and sky.",
    vocab: [
      { h: "אוֹהֵב", p: "ohev", e: "loves" },
      { h: "לִקְרוֹא", p: "likro", e: "to read" },
      { h: "סְפָרִים", p: "sfarim", e: "books" },
      { h: "כָּל יוֹם", p: "kol yom", e: "every day" },
      { h: "חֲבֵרִים", p: "chaverim", e: "friends" },
      { h: "כּוֹכָבִים", p: "kochavim", e: "stars" },
    ],
    tq: [
      {
        w: "אוֹהֵב",
        c: "ohev",
        o: ["ohev", "ahav", "ihev", "ehov"],
      },
      {
        w: "סְפָרִים",
        c: "sfarim",
        o: ["sfarim", "sfar", "safrim", "sforim"],
      },
    ],
    wq: [
      {
        e: "loves",
        c: "אוֹהֵב",
        o: ["קוֹרֵא", "אוֹהֵב", "חֲבֵרִים", "סְפָרִים"],
      },
      {
        e: "books",
        c: "סְפָרִים",
        o: ["יוֹם", "חֲבֵרִים", "סְפָרִים", "כּוֹכָבִים"],
      },
    ],
  },
  {
    id: "market",
    label: "At the Market",
    icon: "🛒",
    col: "#c87020",
    lv: 2,
    src: "Everyday Hebrew",
    h: "אֶתְמוֹל הָלַכְתִּי לַשּׁוּק. רָאִיתִי הַרְבֵּה פֵּרוֹת וִירָקוֹת. קָנִיתִי תַּפּוּחִים אֲדֻמִּים וְלֶחֶם טָרִי. הַמּוֹכֵר אָמַר לִי: בְּבַקָּשָׁה, שֶׁקֶל שְׁנַיִם. שִׁלַּמְתִּי וְהָלַכְתִּי הַבַּיְתָה.",
    e: "Yesterday I went to the market. I saw many fruits and vegetables. I bought red apples and fresh bread. The seller told me: Please, two shekels. I paid and went home.",
    vocab: [
      { h: "שׁוּק", p: "shuk", e: "market" },
      { h: "פֵּרוֹת", p: "perot", e: "fruits" },
      { h: "יְרָקוֹת", p: "yerakot", e: "vegetables" },
      { h: "תַּפּוּחִים", p: "tapuchim", e: "apples" },
      { h: "מוֹכֵר", p: "mocher", e: "seller" },
      { h: "שִׁלַּמְתִּי", p: "shilamti", e: "I paid" },
    ],
    tq: [
      {
        w: "שׁוּק",
        c: "shuk",
        o: ["shuk", "shok", "shik", "shek"],
      },
      {
        w: "מוֹכֵר",
        c: "mocher",
        o: ["mocher", "macher", "micher", "mucher"],
      },
    ],
    wq: [
      {
        e: "market",
        c: "שׁוּק",
        o: ["שׁוּק", "חֲנוּת", "מִסְעָדָה", "בַּיִת"],
      },
      {
        e: "fruits",
        c: "פֵּרוֹת",
        o: ["יְרָקוֹת", "פֵּרוֹת", "לֶחֶם", "מַיִם"],
      },
    ],
  },
  {
    id: "midrash",
    label: "Midrash: Angels",
    icon: "✦",
    col: "#a05818",
    lv: 3,
    src: "Midrash Rabbah",
    h: "בשעה שבא הקדוש ברוך הוא לברוא את האדם, נחלקו המלאכים. חסד אמר: יברא, כי יעשה חסד. אמת אמר: אל יברא, כי כולו שקר. מה עשה? נטל את האמת והשליכה לארץ.",
    e: "When the Holy One came to create humanity, the angels divided. Kindness said: Let him be created, for he will do kindness. Truth said: Let him not, for he is full of falsehood. What did He do? He took Truth and cast it to the earth.",
    vocab: [
      { h: "לברוא", p: "livro", e: "to create" },
      { h: "נחלקו", p: "nechkelu", e: "were divided" },
      { h: "חסד", p: "chesed", e: "lovingkindness" },
      { h: "שקר", p: "sheker", e: "falsehood" },
      { h: "נטל", p: "natal", e: "took" },
      { h: "השליכה", p: "hishlichah", e: "cast it" },
    ],
    tq: [
      {
        w: "חסד",
        c: "chesed",
        o: ["chesed", "koded", "chased", "hesed"],
      },
      {
        w: "שקר",
        c: "sheker",
        o: ["sheker", "shakar", "sukkar", "seker"],
      },
    ],
    wq: [
      {
        e: "lovingkindness",
        c: "חסד",
        o: ["שקר", "חסד", "אמת", "ארץ"],
      },
      {
        e: "falsehood",
        c: "שקר",
        o: ["חסד", "נטל", "שקר", "ברוא"],
      },
    ],
  },
  {
    id: "news",
    label: "News Article",
    icon: "◈",
    col: "#8B3A1A",
    lv: 4,
    src: "Modern Hebrew Press",
    h: "הממשלה הישראלית הודיעה על תכנית חדשה לשיפור מערכת החינוך. השר הצהיר כי ישקיעו מיליארדים בבתי הספר. האופוזיציה טענה שזה לא מספיק, אך רוב חברי הכנסת הצביעו בעד.",
    e: "The Israeli government announced a new plan to improve the education system. The minister declared they would invest billions in schools. The opposition claimed it is not enough, but most Knesset members voted in favor.",
    vocab: [
      { h: "ממשלה", p: "memshalah", e: "government" },
      { h: "הודיעה", p: "hodi'ah", e: "announced" },
      { h: "תכנית", p: "tochnit", e: "plan" },
      { h: "חינוך", p: "chinuch", e: "education" },
      { h: "אופוזיציה", p: "opozitzya", e: "opposition" },
      { h: "כנסת", p: "Knesset", e: "parliament" },
    ],
    tq: [
      {
        w: "ממשלה",
        c: "memshalah",
        o: ["memshalah", "mishpachah", "mimshalah", "memselet"],
      },
    ],
    wq: [
      {
        e: "government",
        c: "ממשלה",
        o: ["כנסת", "ממשלה", "אופוזיציה", "תכנית"],
      },
      {
        e: "education",
        c: "חינוך",
        o: ["ממשלה", "חינוך", "בריאות", "תקציב"],
      },
    ],
  },
] as const;

export function readingPassageTitles(): string[] {
  return READING_PASSAGES_RD.map((r) => r.label);
}
