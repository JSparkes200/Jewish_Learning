export type CourseSentence = {
  targetHe: string;
  correct: string;
  wrongSemantics: string;
  wrongGrammar: string;
  wrongOrder: string;
  /** Full-sentence English for each line (shuffled in-app with the Hebrew). */
  translationEn: {
    correct: string;
    wrongSemantics: string;
    wrongGrammar: string;
    wrongOrder: string;
  };
  streetVariant?: string;
};

export const COURSE_SENTENCES: Record<string, CourseSentence> = {
  // Level 1: Aleph (Survival, Present Tense, Simple SVO, No 'to be' verb)
  "שָׁלוֹם": {
    targetHe: "שָׁלוֹם",
    correct: "שָׁלוֹם, אֲנִי דָּנִי.",
    wrongSemantics: "שָׁלוֹם, אֲנִי לֶחֶם.",
    wrongGrammar: "שָׁלוֹם, אֲנִי דָּנִי הֵם.",
    wrongOrder: "אֲנִי שָׁלוֹם דָּנִי.",
    translationEn: {
      correct: "Hello, I'm Dani.",
      wrongSemantics: "Hello, I'm bread. (nonsense — you aren't food)",
      wrongGrammar: "Hello, I Dani they. (extra pronoun, broken sentence)",
      wrongOrder: "I hello Dani. (scrambled — not how Hebrew says it)",
    },
    streetVariant: "אָהֲלָן, אֲנִי דָּנִי.",
  },
  "תּוֹדָה": {
    targetHe: "תּוֹדָה",
    correct: "תּוֹדָה רַבָּה, אִמָּא.",
    wrongSemantics: "תּוֹדָה רַבָּה, כִּסֵּא.",
    wrongGrammar: "תּוֹדָה רַבָּה, אִמָּא הַ.",
    wrongOrder: "אִמָּא רַבָּה תּוֹדָה.",
    translationEn: {
      correct: "Thank you very much, Mom.",
      wrongSemantics: "Thank you very much, chair. (odd — wrong noun)",
      wrongGrammar: "Thank you very much, Mom the… (hanging word)",
      wrongOrder: "Mom very thanks. (sounds like Yoda — wrong order in Hebrew)",
    },
  },
  "בְּבַקָּשָׁה": {
    targetHe: "בְּבַקָּשָׁה",
    correct: "מַיִם, בְּבַקָּשָׁה.",
    wrongSemantics: "סֵפֶר, בְּבַקָּשָׁה.",
    wrongGrammar: "מַיִם, בְּבַקָּשָׁה הֵם.",
    wrongOrder: "בְּבַקָּשָׁה מַיִם אֲנִי.",
    translationEn: {
      correct: "Water, please.",
      wrongSemantics: "A book, please. (wrong object for the request)",
      wrongGrammar: "Water, please they. (agreement / junk at the end)",
      wrongOrder: "Please water I. (unnatural order)",
    },
  },
  "כֵּן": {
    targetHe: "כֵּן",
    correct: "כֵּן, אֲנִי רוֹצֶה קָפֶה.",
    wrongSemantics: "כֵּן, אֲנִי כֶּלֶב.",
    wrongGrammar: "כֵּן, אֲנִי רוֹצִים קָפֶה.",
    wrongOrder: "אֲנִי כֵּן קָפֶה רוֹצֶה.",
    translationEn: {
      correct: "Yes, I want coffee.",
      wrongSemantics: "Yes, I'm a dog. (nonsense meaning)",
      wrongGrammar: "Yes, I want (plural verb with I). (agreement break)",
      wrongOrder: "I yes coffee want. (scrambled word order)",
    },
    streetVariant: "בֶּטַח, אֲנִי רוֹצֶה קָפֶה.",
  },
  "לֹא": {
    targetHe: "לֹא",
    correct: "לֹא, אֲנִי לֹא יוֹדֵעַ.",
    wrongSemantics: "לֹא, אֲנִי שֻׁלְחָן.",
    wrongGrammar: "לֹא, אֲנִי לֹא יוֹדְעִים.",
    wrongOrder: "אֲנִי לֹא יוֹדֵעַ לֹא.",
    translationEn: {
      correct: "No, I don’t know.",
      wrongSemantics: "No, I (am a) table. (nonsense)",
      wrongGrammar: "No, I not know (plural). (wrong verb form with אני)",
      wrongOrder: "I not know no. (awkward and doubled negation feel)",
    },
    streetVariant: "מַמָּשׁ לֹא.",
  },
  "סְלִיחָה": {
    targetHe: "סְלִיחָה",
    correct: "סְלִיחָה, אֵיפֹה הַשֵּׁרוּתִים?",
    wrongSemantics: "סְלִיחָה, אֵיפֹה הַשֶּׁמֶשׁ?",
    wrongGrammar: "סְלִיחָה, אֵיפֹה שֵּׁרוּתִים הַ?",
    wrongOrder: "הַשֵּׁרוּתִים אֵיפֹה סְלִיחָה?",
    translationEn: {
      correct: "Excuse me, where is the restroom?",
      wrongSemantics: "Excuse me, where is the sun? (wrong place)",
      wrongGrammar: "Excuse me, where… restroom the? (broken phrasing with ה)",
      wrongOrder: "The restrooms where excuse me? (question order feels off)",
    },
  },
  "בֹּקֶר טוֹב": {
    targetHe: "בֹּקֶר טוֹב",
    correct: "בֹּקֶר טוֹב, אַבָּא!",
    wrongSemantics: "בֹּקֶר טוֹב, חַלּוֹן!",
    wrongGrammar: "בֹּקֶר טוֹב, אַבָּא הֵם!",
    wrongOrder: "אַבָּא טוֹב בֹּקֶר!",
    translationEn: {
      correct: "Good morning, Dad!",
      wrongSemantics: "Good morning, window! (wrong addressee)",
      wrongGrammar: "Good morning, Dad they! (nonsense agreement)",
      wrongOrder: "Dad good morning! (sounds jumbled, not a greeting flow)",
    },
  },
  "עֶרֶב טוֹב": {
    targetHe: "עֶרֶב טוֹב",
    correct: "עֶרֶב טוֹב, חָבֵר.",
    wrongSemantics: "עֶרֶב טוֹב, עִפָּרוֹן.",
    wrongGrammar: "עֶרֶב טוֹב, חָבֵר הַ.",
    wrongOrder: "חָבֵר טוֹב עֶרֶב.",
    translationEn: {
      correct: "Good evening, friend.",
      wrongSemantics: "Good evening, pencil. (odd noun)",
      wrongGrammar: "Good evening, friend the… (stray word)",
      wrongOrder: "Friend good evening. (odd order, not a natural greeting)",
    },
  },
  "לַיְלָה טוֹב": {
    targetHe: "לַיְלָה טוֹב",
    correct: "לַיְלָה טוֹב, יֶלֶד קָטָן.",
    wrongSemantics: "לַיְלָה טוֹב, סֵפֶר קָטָן.",
    wrongGrammar: "לַיְלָה טוֹב, יֶלֶד קְטַנִּים.",
    wrongOrder: "יֶלֶד קָטָן טוֹב לַיְלָה.",
    translationEn: {
      correct: "Good night, (you) little boy / little one.",
      wrongSemantics: "Good night, small book. (mismatched ideas)",
      wrongGrammar: "Good night, boy small (pl. adjective). (agreement off)",
      wrongOrder: "Child small good night. (jumbled, not a greeting line)",
    },
  },
  "אֲנִי": {
    targetHe: "אֲנִי",
    correct: "אֲנִי לוֹמֵד עִבְרִית.",
    wrongSemantics: "אֲנִי טֵלֵוִיזְיָה.",
    wrongGrammar: "אֲנִי לוֹמְדִים עִבְרִית.",
    wrongOrder: "עִבְרִית לוֹמֵד אֲנִי.",
    translationEn: {
      correct: "I (am) study / I’m learning Hebrew.",
      wrongSemantics: "I (am) television. (nonsense)",
      wrongGrammar: "I learn (plural) Hebrew. (verb doesn’t match אני)",
      wrongOrder: "Hebrew learn I. (OVS — sounds odd here)",
    },
  },
  "אַתָּה": {
    targetHe: "אַתָּה",
    correct: "אַתָּה רוֹצֶה לֶחֶם?",
    wrongSemantics: "אַתָּה מְכוֹנִית?",
    wrongGrammar: "אַתָּה רוֹצִים לֶחֶם?",
    wrongOrder: "לֶחֶם רוֹצֶה אַתָּה?",
    translationEn: {
      correct: "Do you want bread?",
      wrongSemantics: "You (a) car? (wrong content)",
      wrongGrammar: "You want (m.pl. verb) bread? (doesn’t match אתה)",
      wrongOrder: "Bread want you? (unnatural in Hebrew)",
    },
  },
  "אַתְּ": {
    targetHe: "אַתְּ",
    correct: "אַתְּ אוֹהֶבֶת מַיִם?",
    wrongSemantics: "אַתְּ דֶּלֶת?",
    wrongGrammar: "אַתְּ אוֹהֲבִים מַיִם?",
    wrongOrder: "מַיִם אוֹהֶבֶת אַתְּ?",
    translationEn: {
      correct: "Do you love (like) water?",
      wrongSemantics: "You (a) door? (nonsense)",
      wrongGrammar: "You love (m.pl. verb) water? (doesn’t match את)",
      wrongOrder: "Water love you? (VSO odd here)",
    },
  },
  "אֲנַחְנוּ": {
    targetHe: "אֲנַחְנוּ",
    correct: "אֲנַחְנוּ אוֹכְלִים תַּפּוּחַ.",
    wrongSemantics: "אֲנַחְנוּ יְשֵׁנִים עֵץ.",
    wrongGrammar: "אֲנַחְנוּ אוֹכֵל תַּפּוּחַ.",
    wrongOrder: "תַּפּוּחַ אוֹכְלִים אֲנַחְנוּ.",
    translationEn: {
      correct: "We are eating an apple. / we eat an apple.",
      wrongSemantics: "We are sleeping (as) a tree. (nonsense)",
      wrongGrammar: "We eat (3sg verb) an apple. (agreement with אנחנו off)",
      wrongOrder: "Apple eat we. (OVS; odd collocation in plain speech)",
    },
  },
  "זֶה": {
    targetHe: "זֶה",
    correct: "זֶה כֶּלֶב גָּדוֹל.",
    wrongSemantics: "זֶה רַעְיוֹן כָּחֹל.",
    wrongGrammar: "זֶה כְּלָבִים גָּדוֹל.",
    wrongOrder: "כֶּלֶב גָּדוֹל זֶה.",
    translationEn: {
      correct: "This is a big dog.",
      wrongSemantics: "It’s a blue idea. (poetic, but odd as a simple sentence)",
      wrongGrammar: "This (is) dogs big. (number/gender mix)",
      wrongOrder: "Dog big this. (not default word order for identification)",
    },
  },
  "זֹאת": {
    targetHe: "זֹאת",
    correct: "זֹאת יַלְדָּה טוֹבָה.",
    wrongSemantics: "זֹאת מְכוֹנִית שׁוֹתָה.",
    wrongGrammar: "זֹאת יְלָדוֹת טוֹבָה.",
    wrongOrder: "יַלְדָּה טוֹבָה זֹאת.",
    translationEn: {
      correct: "This is a good girl.",
      wrongSemantics: "This is a drinking car. (bizarre collocation)",
      wrongGrammar: "This (is) girls good (f.sg). (plural + agreement conflict)",
      wrongOrder: "Girl good this. (identification, odd order here)",
    },
  },
  "אֵלֶּה": {
    targetHe: "אֵלֶּה",
    correct: "אֵלֶּה יְלָדִים קְטַנִּים.",
    wrongSemantics: "אֵלֶּה סְפָרִים רְעֵבִים.",
    wrongGrammar: "אֵלֶּה יֶלֶד קְטַנִּים.",
    wrongOrder: "יְלָדִים קְטַנִּים אֵלֶּה.",
    translationEn: {
      correct: "These are small children.",
      wrongSemantics: "These (are) hungry books. (odd picture)",
      wrongGrammar: "These (is) a child (pl. adj). (number clash)",
      wrongOrder: "Small children these. (unnatural in neutral speech)",
    },
  },
  "אֶחָד": {
    targetHe: "אֶחָד",
    correct: "יֵשׁ לִי כֶּלֶב אֶחָד.",
    wrongSemantics: "יֵשׁ לִי מַיִם אֶחָד.",
    wrongGrammar: "יֵשׁ לִי כֶּלֶב אַחַת.",
    wrongOrder: "כֶּלֶב אֶחָד לִי יֵשׁ.",
    translationEn: {
      correct: "I have one dog.",
      wrongSemantics: "I have one water. (water isn’t ‘one’ like that)",
      wrongGrammar: "I have a dog one (f.). (mismatch dog / אחת)",
      wrongOrder: "One dog to-me there-is. (odd emphasis order)",
    },
  },
  "אַחַת": {
    targetHe: "אַחַת",
    correct: "יֵשׁ לִי שְׁאֵלָה אַחַת.",
    wrongSemantics: "יֵשׁ לִי שֶׁמֶשׁ אַחַת.",
    wrongGrammar: "יֵשׁ לִי שְׁאֵלָה אֶחָד.",
    wrongOrder: "שְׁאֵלָה אַחַת לִי יֵשׁ.",
    translationEn: {
      correct: "I have one question.",
      wrongSemantics: "I have one sun. (nonsense as a need)",
      wrongGrammar: "I have a question one (m.). (אחד with שאלה)",
      wrongOrder: "Question one to-me there-is. (odd in casual speech)",
    },
  },
  "שְׁנַיִם": {
    targetHe: "שְׁנַיִם",
    correct: "אֲנַחְנוּ שְׁנַיִם כָּאן.",
    wrongSemantics: "אֲנַחְנוּ עֵצִים כָּאן.",
    wrongGrammar: "אֲנַחְנוּ שְׁתַּיִם כָּאן.",
    wrongOrder: "כָּאן שְׁנַיִם אֲנַחְנוּ.",
    translationEn: {
      correct: "We are two here. / the two of us are here.",
      wrongSemantics: "We (are) trees here. (nonsense)",
      wrongGrammar: "We two (f. form) here. (mismatch with we)",
      wrongOrder: "Here two we. (odd stress)",
    },
  },
  "שְׁתַּיִם": {
    targetHe: "שְׁתַּיִם",
    correct: "הַשָּׁעָה עַכְשָׁו שְׁתַּיִם.",
    wrongSemantics: "הַשֶּׁמֶשׁ עַכְשָׁו שְׁתַּיִם.",
    wrongGrammar: "הַשָּׁעָה עַכְשָׁו שְׁנַיִם.",
    wrongOrder: "שְׁתַּיִם עַכְשָׁו הַשָּׁעָה.",
    translationEn: {
      correct: "The time is two o’clock now.",
      wrongSemantics: "The sun is two now. (nonsense)",
      wrongGrammar: "The time is two (m. numeral) now. (gender clash with time)",
      wrongOrder: "Two now the time. (jumbled time expression)",
    },
  },
  "עֶשֶׂר": {
    targetHe: "עֶשֶׂר",
    correct: "יֵשׁ כָּאן עֶשֶׂר יְלָדוֹת.",
    wrongSemantics: "יֵשׁ כָּאן עֶשֶׂר שְׁמָשׁוֹת.",
    wrongGrammar: "יֵשׁ כָּאן עֲשָׂרָה יְלָדוֹת.",
    wrongOrder: "עֶשֶׂר יְלָדוֹת כָּאן יֵשׁ.",
    translationEn: {
      correct: "There are ten girls here.",
      wrongSemantics: "There are ten… (nonsense item).",
      wrongGrammar: "There are here ten (count form) girls. (אשׂרה form clash for this idiom here)",
      wrongOrder: "Ten girls here there-are. (Yoda-ish)",
    },
  },
  "עֶשְׂרִים": {
    targetHe: "עֶשְׂרִים",
    correct: "אֲנִי בֶּן עֶשְׂרִים.",
    wrongSemantics: "אֲנִי שֻׁלְחָן עֶשְׂרִים.",
    wrongGrammar: "אֲנִי בַּת עֶשְׂרִים.", // Technically correct for female, but we use it as a distractor for a male speaker context
    wrongOrder: "עֶשְׂרִים בֶּן אֲנִי.",
    translationEn: {
      correct: "I’m a twenty-year-old (male phrasing) / in my twenties (lit.).",
      wrongSemantics: "I (am) a table twenty. (nonsense)",
      wrongGrammar: "I’m a daughter twenty. (feminine; sounds wrong in the male-speaker line)",
      wrongOrder: "Twenty (years) child I. (jumbled age expression)",
    },
  },
  "מֵאָה": {
    targetHe: "מֵאָה",
    correct: "זֶה עוֹלֶה מֵאָה שְׁקָלִים.",
    wrongSemantics: "זֶה אוֹכֵל מֵאָה שְׁקָלִים.",
    wrongGrammar: "זֶה עוֹלֶה מֵאוֹת שְׁקָלִים.",
    wrongOrder: "מֵאָה שְׁקָלִים זֶה עוֹלֶה.",
    translationEn: {
      correct: "It costs a hundred shekels.",
      wrongSemantics: "It eats a hundred shekels. (nonsense verb)",
      wrongGrammar: "It costs hundreds shekels. (plural adjective on currency — sounds off here)",
      wrongOrder: "Hundred shekels it costs. (stilted word order here)",
    },
  },
  "אֶלֶף": {
    targetHe: "אֶלֶף",
    correct: "זֶה עוֹלֶה אֶלֶף שְׁקָלִים.",
    wrongSemantics: "זֶה יָשֵׁן אֶלֶף שְׁקָלִים.",
    wrongGrammar: "זֶה עוֹלֶה אֲלָפִים שְׁקָלִים.",
    wrongOrder: "אֶלֶף שְׁקָלִים זֶה עוֹלֶה.",
    translationEn: {
      correct: "It costs a thousand shekels.",
      wrongSemantics: "It sleeps a thousand shekels. (wrong verb meaning)",
      wrongGrammar: "It costs thousands shekels. (sounds clunky; wrong phrasing in context)",
      wrongOrder: "Thousand shekels it costs. (reversed, odd emphasis for price)",
    },
  },
};

export function getCourseSentence(targetHe: string): CourseSentence | undefined {
  return COURSE_SENTENCES[targetHe];
}
