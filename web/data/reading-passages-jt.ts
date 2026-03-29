/**
 * Jewish Texts carousel entries from legacy `hebrew-v8.2.html` `JT[]`.
 * Shown before `RD` in the reading carousel (same order as `getAllCarouselItems`).
 */

export type ReadingPassageJt = {
  src: string;
  cat: string;
  col: string;
  sefariaLink?: string;
  h: string;
  e: string;
  vocab: readonly { h: string; p: string; e: string }[];
  note: string;
};

export const READING_PASSAGES_JT: readonly ReadingPassageJt[] = [
  {
    src: "Torah — Bereishit 1:1",
    cat: "Torah",
    col: "#8B3A1A",
    sefariaLink: "https://www.sefaria.org/Genesis.1.1",
    h: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃",
    e: "In the beginning God created the heavens and the earth.",
    vocab: [
      { h: "בְּרֵאשִׁית", p: "bereishit", e: "in the beginning" },
      { h: "בָּרָא", p: "bara", e: "created" },
      { h: "שָׁמַיִם", p: "shamayim", e: "heavens" },
      { h: "אָרֶץ", p: "aretz", e: "earth" },
    ],
    note: "בָּרָא — creation from nothing. The word only appears in the Bible with God as subject. The heavens and earth together represent totality.",
  },
  {
    src: "Torah — Shemot 3:14",
    cat: "Torah",
    col: "#8B3A1A",
    sefariaLink: "https://www.sefaria.org/Exodus.3.14",
    h: "וַיֹּאמֶר אֱלֹהִים אֶל-מֹשֶׁה אֶהְיֶה אֲשֶׁר אֶהְיֶה׃",
    e: "And God said to Moses: I am that I am / I will be what I will be.",
    vocab: [
      { h: "וַיֹּאמֶר", p: "vayomer", e: "and he said" },
      { h: "אֶהְיֶה", p: "ehyeh", e: "I am / I will be" },
      { h: "אֲשֶׁר", p: "asher", e: "that / which" },
    ],
    note: "אֶהְיֶה is first-person future of ה.י.ה (to be). The deliberate ambiguity — past, present, or future — defines God as beyond tense.",
  },
  {
    src: "Torah — Vayikra 19:18",
    cat: "Torah",
    col: "#8B3A1A",
    sefariaLink: "https://www.sefaria.org/Leviticus.19.18",
    h: "וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ׃",
    e: "And you shall love your neighbor as yourself.",
    vocab: [
      { h: "וְאָהַבְתָּ", p: "ve'ahavta", e: "and you shall love" },
      { h: "לְרֵעֲךָ", p: "lere'acha", e: "your neighbor" },
      { h: "כָּמוֹךָ", p: "kamocha", e: "as yourself" },
    ],
    note: "Root אהב. The ו prefix (vav) converts past to future/imperative — a key biblical grammar pattern called vav-consecutive.",
  },
  {
    src: "Mishnah — Avot 1:2",
    cat: "Mishnah",
    col: "#c87020",
    sefariaLink: "https://www.sefaria.org/Pirkei_Avot.1.2",
    h: "עַל שְׁלֹשָׁה דְבָרִים הָעוֹלָם עוֹמֵד: עַל הַתּוֹרָה, וְעַל הָעֲבוֹדָה, וְעַל גְּמִילוּת חֲסָדִים׃",
    e: "On three things the world stands: on Torah, on worship, and on acts of loving-kindness.",
    vocab: [
      { h: "עוֹמֵד", p: "omed", e: "stands" },
      { h: "עֲבוֹדָה", p: "avodah", e: "worship/service" },
      { h: "גְּמִילוּת חֲסָדִים", p: "gemilut chasadim", e: "acts of kindness" },
    ],
    note: "עֲבוֹדָה originally meant Temple sacrifice (from root עבד — to serve/work). After the Temple's destruction it shifted to mean prayer — one word, two eras.",
  },
  {
    src: "Talmud Bavli — Shabbat 31a",
    cat: "Talmud",
    col: "#6a1828",
    sefariaLink: "https://www.sefaria.org/Shabbat.31a",
    h: "דְּעַלָךְ סְנֵי לְחַבְרָךְ לָא תַּעֲבֵיד. זוֹ הִיא כָּל הַתּוֹרָה כֻּלָּהּ.",
    e: "What is hateful to you, do not do to your fellow. This is the entire Torah; the rest is commentary — go and study.",
    vocab: [
      { h: "סְנֵי", p: "snei", e: "hateful (Aramaic)" },
      { h: "חַבְרָךְ", p: "chavrach", e: "your fellow (Aramaic)" },
      { h: "פֵּרוּשׁ", p: "perush", e: "commentary" },
    ],
    note: "Hillel's answer while standing on one foot. Much of the Talmud is Aramaic — the vernacular of Babylonian Jews. Notice how Aramaic and Hebrew interweave.",
  },
  {
    src: "Midrash Rabbah — Bereishit 8:1",
    cat: "Midrash",
    col: "#a05818",
    sefariaLink: "https://www.sefaria.org/Bereishit_Rabbah.8.1",
    h: "בשעה שבא הקדוש ברוך הוא לברוא את האדם, נחלקו המלאכים. חסד אמר: יברא. אמת אמר: אל יברא, כי כולו שקר.",
    e: "When the Holy One came to create humanity, the angels divided. Kindness said: Let him be created. Truth said: Let him not — for he is full of falsehood.",
    vocab: [
      { h: "לברוא", p: "livro", e: "to create" },
      { h: "נחלקו", p: "nechkelu", e: "were divided" },
      { h: "חסד", p: "chesed", e: "lovingkindness" },
      { h: "שקר", p: "sheker", e: "falsehood" },
    ],
    note: "Midrash personifies abstract values. The tension between חֶסֶד (kindness) and אֱמֶת (truth) is central to Jewish ethics — both are valid, neither alone is sufficient.",
  },
  {
    src: "Rashi — Bereishit 1:1",
    cat: "Rashi",
    col: "#4a6830",
    sefariaLink: "https://www.sefaria.org/Rashi_on_Genesis.1.1.1",
    h: "אמר רבי יצחק: לא היה צריך להתחיל את התורה אלא מהחודש הזה לכם.",
    e: "Rabbi Yitzhak said: The Torah need not have begun except from 'This month shall be for you' — the first commandment given to Israel.",
    vocab: [
      { h: "התחיל", p: "hitchil", e: "to begin" },
      { h: "מצווה", p: "mitzvah", e: "commandment" },
      { h: "נצטוו", p: "nitztavu", e: "were commanded" },
    ],
    note: "Rashi's style: always questions the text. His opening word is effectively 'Why?' — a model for Jewish learning where no text is taken for granted.",
  },
  {
    src: "Maimonides — Mishneh Torah",
    cat: "Maimonides",
    col: "#8B3A1A",
    sefariaLink: "https://www.sefaria.org/Mishneh_Torah",
    h: "הדרך הישרה היא מידה בינונית שבכל מידה ומידה מן המידות שיש לאדם.",
    e: "The straight path is the middle measure in each of the traits that a person possesses.",
    vocab: [
      { h: "הדרך הישרה", p: "haderech hayesharah", e: "the straight path" },
      { h: "בינונית", p: "beinonit", e: "middle / moderate" },
      { h: "מידה", p: "midah", e: "trait / measure" },
    ],
    note: "מִידָה means both measure and moral trait — one word for both ethics and mathematics. Maimonides' golden mean reflects Aristotelian influence on Jewish thought.",
  },
  {
    src: "Zohar — Bereishit 1a",
    cat: "Kabbalah",
    col: "#6a1828",
    sefariaLink: "https://www.sefaria.org/Zohar",
    h: "בְּרֵאשִׁית — שִׁית בָּנַן, שִׁית קְצָווֹת, שֶׁמֵּהֶן נִבְנָה הָעוֹלָם.",
    e: "Bereishit — six foundations, six directions, from which the world was built.",
    vocab: [
      { h: "קְצָווֹת", p: "ktzavot", e: "extremities / directions" },
      { h: "נִבְנָה", p: "nivnah", e: "was built (Nif'al passive)" },
    ],
    note: "The Zohar reads every letter as a code. Bereishit splits into six foundations — Kabbalah teaches that the physical world mirrors hidden divine structure.",
  },
  {
    src: "Shulchan Aruch — Orach Chaim 1:1",
    cat: "Halacha",
    col: "#c87020",
    sefariaLink: "https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim.1.1",
    h: "יִתְגַּבֵּר כָּאֲרִי לַעֲמֹד בַּבֹּקֶר לַעֲבוֹדַת בּוֹרְאוֹ.",
    e: "One should strengthen himself like a lion to arise in the morning to serve his Creator.",
    vocab: [
      { h: "יִתְגַּבֵּר", p: "yitgaber", e: "shall strengthen himself (Hitpa'el)" },
      { h: "כָּאֲרִי", p: "ka'ari", e: "like a lion" },
    ],
    note: "יִתְגַּבֵּר is Hitpa'el — reflexive, meaning to strengthen oneself. The lion metaphor opens the entire Shulchan Aruch — law begins with an image of courage.",
  },
  {
    src: "Pirke Avot 2:4",
    cat: "Mishnah",
    col: "#c87020",
    sefariaLink: "https://www.sefaria.org/Pirkei_Avot.2.4",
    h: "עֲשֵׂה רְצוֹנוֹ כִּרְצוֹנְךָ, כְּדֵי שֶׁיַּעֲשֶׂה רְצוֹנְךָ כִּרְצוֹנוֹ.",
    e: "Make His will like your will, so that He will make your will like His will.",
    vocab: [
      { h: "רְצוֹן", p: "ratzon", e: "will / desire" },
      { h: "כְּדֵי שֶׁ", p: "kedei she", e: "so that / in order that" },
    ],
    note: "The mirrored syntax is classic Mishnaic style. כְּדֵי שֶׁ introduces a purpose clause — 'in order that' — a key connective to learn for reading rabbinic texts.",
  },
  {
    src: "Amos Oz — A Tale of Love and Darkness",
    cat: "Modern Literature",
    col: "#a05818",
    h: "ירושלים בשנות ילדותי הייתה עיר של אבן ושתיקה. הרחובות היו צרים ועקומים, והאנשים הלכו לאט, כאילו כל אחד נושא משהו כבד.",
    e: "Jerusalem in my childhood years was a city of stone and silence. The streets were narrow and winding, and people walked slowly, as if each one carried something heavy.",
    vocab: [
      { h: "ילדות", p: "yaldut", e: "childhood" },
      { h: "שתיקה", p: "shtika", e: "silence" },
      { h: "צרים", p: "tzarim", e: "narrow (pl.)" },
      { h: "כאילו", p: "ke'ilu", e: "as if" },
    ],
    note: "כְּאִלּוּ introduces a simile or counterfactual — as if. In modern Hebrew prose it's one of the most expressive connectives. Note הָלְכוּ לְאַט — walked slowly, adjective becomes adverb.",
  },
] as const;
