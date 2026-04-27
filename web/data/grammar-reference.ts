/**
 * Hebrew grammar reference data — used by the /grammar page.
 * All Hebrew text uses Unicode Hebrew block (U+0590–U+05FF).
 * Root used for verb paradigms: כ.ת.ב (write) — regular strong root.
 */

export type GrammarRow = {
  pronoun: string;
  pronounEn: string;
  form: string;
  transliteration: string;
  note?: string;
};

export type GrammarTable = {
  id: string;
  title: string;
  subtitle?: string;
  rows: GrammarRow[];
};

export type GrammarSection = {
  id: string;
  title: string;
  heTitle?: string;
  intro: string;
  tables?: GrammarTable[];
  items?: GrammarListItem[];
};

export type GrammarListItem = {
  hebrew: string;
  transliteration: string;
  english: string;
  note?: string;
};

// ─── VERB TABLES ─────────────────────────────────────────────────────────────

export const QAL_PAST: GrammarTable = {
  id: "qal-past",
  title: "Qal Past (Perfect)",
  subtitle: "כ.ת.ב — to write",
  rows: [
    { pronoun: "אֲנִי", pronounEn: "I", form: "כָּתַבְתִּי", transliteration: "katavti" },
    { pronoun: "אַתָּה", pronounEn: "you (m)", form: "כָּתַבְתָּ", transliteration: "katavta" },
    { pronoun: "אַתְּ", pronounEn: "you (f)", form: "כָּתַבְתְּ", transliteration: "katavt" },
    { pronoun: "הוּא", pronounEn: "he / it (m)", form: "כָּתַב", transliteration: "katav" },
    { pronoun: "הִיא", pronounEn: "she / it (f)", form: "כָּתְבָה", transliteration: "katva" },
    { pronoun: "אֲנַחְנוּ", pronounEn: "we", form: "כָּתַבְנוּ", transliteration: "katavnu" },
    { pronoun: "אַתֶּם", pronounEn: "you (mp)", form: "כְּתַבְתֶּם", transliteration: "ktavtem" },
    { pronoun: "אַתֶּן", pronounEn: "you (fp)", form: "כְּתַבְתֶּן", transliteration: "ktavten" },
    { pronoun: "הֵם / הֵן", pronounEn: "they", form: "כָּתְבוּ", transliteration: "katvu" },
  ],
};

export const QAL_PRESENT: GrammarTable = {
  id: "qal-present",
  title: "Qal Present (Participle)",
  subtitle: "כ.ת.ב — to write",
  rows: [
    { pronoun: "הוּא / אֲנִי (m)", pronounEn: "ms", form: "כּוֹתֵב", transliteration: "kotev" },
    { pronoun: "הִיא / אֲנִי (f)", pronounEn: "fs", form: "כּוֹתֶבֶת", transliteration: "kotevet" },
    { pronoun: "הֵם / אֲנַחְנוּ (m)", pronounEn: "mp", form: "כּוֹתְבִים", transliteration: "kotvim" },
    { pronoun: "הֵן / אֲנַחְנוּ (f)", pronounEn: "fp", form: "כּוֹתְבוֹת", transliteration: "kotvot" },
  ],
};

export const QAL_FUTURE: GrammarTable = {
  id: "qal-future",
  title: "Qal Future (Imperfect)",
  subtitle: "כ.ת.ב — to write",
  rows: [
    { pronoun: "אֲנִי", pronounEn: "I", form: "אֶכְתֹּב", transliteration: "ekhtov" },
    { pronoun: "אַתָּה", pronounEn: "you (m)", form: "תִּכְתֹּב", transliteration: "tikhtov" },
    { pronoun: "אַתְּ", pronounEn: "you (f)", form: "תִּכְתְּבִי", transliteration: "tikhtevi" },
    { pronoun: "הוּא", pronounEn: "he", form: "יִכְתֹּב", transliteration: "yikhtov" },
    { pronoun: "הִיא", pronounEn: "she", form: "תִּכְתֹּב", transliteration: "tikhtov" },
    { pronoun: "אֲנַחְנוּ", pronounEn: "we", form: "נִכְתֹּב", transliteration: "nikhtov" },
    { pronoun: "אַתֶּם", pronounEn: "you (mp)", form: "תִּכְתְּבוּ", transliteration: "tikhtevу" },
    { pronoun: "אַתֶּן", pronounEn: "you (fp)", form: "תִּכְתֹּבְנָה", transliteration: "tikhtovna" },
    { pronoun: "הֵם", pronounEn: "they (m)", form: "יִכְתְּבוּ", transliteration: "yikhtevу" },
    { pronoun: "הֵן", pronounEn: "they (f)", form: "תִּכְתֹּבְנָה", transliteration: "tikhtovna" },
  ],
};

// ─── BINYANIM ────────────────────────────────────────────────────────────────

export const BINYANIM: GrammarListItem[] = [
  {
    hebrew: "קַל",
    transliteration: "Qal",
    english: "Simple active",
    note: "לִכְתֹּב — to write",
  },
  {
    hebrew: "נִפְעַל",
    transliteration: "Nif'al",
    english: "Simple passive / reflexive",
    note: "לְהִכָּתֵב — to be written",
  },
  {
    hebrew: "פִּעֵל",
    transliteration: "Pi'el",
    english: "Intensive / declarative active",
    note: "לְכַתֵּב — to address, to write extensively · middle root letter doubles (dagesh)",
  },
  {
    hebrew: "פֻּעַל",
    transliteration: "Pu'al",
    english: "Intensive passive",
    note: "כֻּתַּב — was written extensively · u-vowel under first root letter",
  },
  {
    hebrew: "הִפְעִיל",
    transliteration: "Hif'il",
    english: "Causative active",
    note: "לְהַכְתִּיב — to dictate · הִ- prefix in past; מַ- prefix in present",
  },
  {
    hebrew: "הֻפְעַל",
    transliteration: "Huf'al",
    english: "Causative passive",
    note: "הוּכְתַּב — was dictated · הֻ- prefix",
  },
  {
    hebrew: "הִתְפַּעֵל",
    transliteration: "Hitpa'el",
    english: "Reflexive / reciprocal",
    note: "לְהִתְכַּתֵּב — to correspond · הִתְ- prefix",
  },
];

// ─── NOUNS ───────────────────────────────────────────────────────────────────

export const NOUN_PATTERNS: GrammarListItem[] = [
  {
    hebrew: "סֵפֶר → סְפָרִים",
    transliteration: "sefer → sfarim",
    english: "book → books (masculine regular: add ־ִים)",
  },
  {
    hebrew: "יֶלֶד → יְלָדִים",
    transliteration: "yeled → yeladim",
    english: "boy → boys (masculine: vowel shift + ־ִים)",
  },
  {
    hebrew: "מוֹרָה → מוֹרוֹת",
    transliteration: "mora → morot",
    english: "teacher (f) → teachers (feminine ־ָה: replace with ־וֹת)",
  },
  {
    hebrew: "מִלָּה → מִלִּים",
    transliteration: "mila → milim",
    english: "word → words (feminine ־ָה sometimes takes ־ִים)",
  },
  {
    hebrew: "עִיר → עָרִים",
    transliteration: "'ir → 'arim",
    english: "city → cities (feminine without ־ָה: still takes ־וֹת or ־ִים)",
  },
  {
    hebrew: "אִשָּׁה → נָשִׁים",
    transliteration: "'isha → nashim",
    english: "woman → women (irregular plural — different root)",
  },
  {
    hebrew: "אִישׁ → אֲנָשִׁים",
    transliteration: "'ish → anashim",
    english: "man → men (irregular plural — same root as above)",
  },
];

export const ADJECTIVE_AGREEMENT: GrammarListItem[] = [
  {
    hebrew: "טוֹב / טוֹבָה / טוֹבִים / טוֹבוֹת",
    transliteration: "tov / tova / tovim / tovot",
    english: "good (ms / fs / mp / fp)",
    note: "Adjective follows noun and agrees in gender, number, and definiteness",
  },
  {
    hebrew: "הַכֶּלֶב הַטּוֹב",
    transliteration: "ha-kelev ha-tov",
    english: "the good dog (m)",
    note: "Both noun and adjective take the definite article הַ",
  },
  {
    hebrew: "הַמּוֹרָה הַטּוֹבָה",
    transliteration: "ha-mora ha-tova",
    english: "the good teacher (f)",
    note: "Article on both noun and adjective",
  },
];

// ─── DEFINITE ARTICLE ────────────────────────────────────────────────────────

export const DEFINITE_ARTICLE: GrammarListItem[] = [
  {
    hebrew: "הַ",
    transliteration: "ha-",
    english: "Before most consonants (with dagesh)",
    note: "הַסֵּפֶר — the book",
  },
  {
    hebrew: "הָ",
    transliteration: "ha-",
    english: "Before gutturals א, ה, ע and before ר",
    note: "הָאִישׁ — the man; הָאָרֶץ — the land",
  },
  {
    hebrew: "הֶ",
    transliteration: "he-",
    english: "Before ח and some forms of ע with patah",
    note: "הֶחָכָם — the wise one; הֶעָנִי — the poor one",
  },
  {
    hebrew: "בַּ / לַ / כַּ",
    transliteration: "ba- / la- / ka-",
    english: "Prepositions + article combine into one syllable",
    note: "בַּבַּיִת — in the house; לַסֵּפֶר — to the book",
  },
];

// ─── PARTICLES / PREPOSITIONS ────────────────────────────────────────────────

export const PARTICLES: GrammarListItem[] = [
  {
    hebrew: "בְּ / בַּ",
    transliteration: "be- / ba-",
    english: "in, at, with, by means of",
    note: "בְּעִיר — in a city; בַּבַּיִת — in the house",
  },
  {
    hebrew: "לְ / לַ",
    transliteration: "le- / la-",
    english: "to, for, belonging to",
    note: "לִי — for me; לְדָוִד — to/for David",
  },
  {
    hebrew: "כְּ / כַּ",
    transliteration: "ke- / ka-",
    english: "like, as, approximately",
    note: "כְּמַיִם — like water; כַּיּוֹם — like the day",
  },
  {
    hebrew: "מִ / מִן",
    transliteration: "mi- / min",
    english: "from, out of, than",
    note: "מִיְּרוּשָׁלַיִם — from Jerusalem; גָּדוֹל מִמֶּנּוּ — bigger than him",
  },
  {
    hebrew: "וְ / וּ / וַ",
    transliteration: "ve- / u- / va-",
    english: "and (prefix — before the word)",
    note: "וְשָׁלוֹם — and peace; וּבְכֵן — and therefore",
  },
  {
    hebrew: "שֶׁ",
    transliteration: "she-",
    english: "that, which, who (relative clause)",
    note: "הָאִישׁ שֶׁרָאִיתִי — the man that I saw",
  },
  {
    hebrew: "אֶל",
    transliteration: "'el",
    english: "to, toward (motion or direction)",
    note: "הָלַךְ אֶל הַבַּיִת — went to the house",
  },
  {
    hebrew: "עַל",
    transliteration: "'al",
    english: "on, upon, about, concerning",
    note: "עַל הַשֻּׁלְחָן — on the table; דִּבֵּר עַל — spoke about",
  },
  {
    hebrew: "עִם",
    transliteration: "'im",
    english: "with (accompaniment)",
    note: "עִם חֲבֵרִים — with friends",
  },
  {
    hebrew: "לִפְנֵי",
    transliteration: "lifney",
    english: "before, in front of",
    note: "לִפְנֵי הַבַּיִת — in front of the house; לִפְנֵי שָׁנָה — a year ago",
  },
  {
    hebrew: "אַחֲרֵי",
    transliteration: "'akharey",
    english: "after, behind",
    note: "אַחֲרֵי הָאֲרוּחָה — after the meal",
  },
  {
    hebrew: "בֵּין",
    transliteration: "beyn",
    english: "between, among",
    note: "בֵּין הַשְּׁמָשׁוֹת — between the suns (twilight)",
  },
  {
    hebrew: "תַּחַת",
    transliteration: "takhat",
    english: "under, beneath; instead of",
    note: "תַּחַת הָעֵץ — under the tree",
  },
  {
    hebrew: "כִּי",
    transliteration: "ki",
    english: "because, that, when, indeed",
    note: "כִּי טוֹב — because it is good (Genesis); כִּי אָמַר — because he said",
  },
];

// ─── MATRES (KTIV MALE) ──────────────────────────────────────────────────────

export const MATRES_LECTIONIS: GrammarListItem[] = [
  {
    hebrew: "ו (vav)",
    transliteration: "vav",
    english: "Often marks /o/ or /u/ in unpointed text (esp. in ktiv male)",
    note: "שֻׁלְחָן → שולחן; לוֹמְדִים (learners) often spelled with vav in full spelling",
  },
  {
    hebrew: "י (yod)",
    transliteration: "yod",
    english: "Often marks /i/ or part of a diphthong; helps disambiguate without nikkud",
    note: "יום (day) — the yod is part of the word’s “full” face in print",
  },
  {
    hebrew: "אל״ף / ה־ סוֹפִית",
    transliteration: "alef / he",
    english: "Sometimes silent carriers or glides — context + pattern complete the vowel",
    note: "אִם vs עִם disambiguation leans on recognition and nikkud in pointed text; in unvowelled context, collocation matters",
  },
  {
    hebrew: "כתיב מלא vs חסר",
    transliteration: "ktiv male / haser",
    english: "Academy and convention prefer full spelling in most modern print — extra matres = readable without dots",
    note: "The transition: pointed lesson → unpointed app UI — same word, new dress",
  },
];

// ─── PREPOSITION + PRONOUN (FUSED) ───────────────────────────────────────────

export const PREP_WITH_PRONOUN: GrammarListItem[] = [
  { hebrew: "לִי, לְךָ, לָהּ, לוֹ, לָנוּ, לָכֶם, לָהֶם", transliteration: "li, lekha, lah, lo, lanu, lakhem, lahem", english: "to/for me, you, her, him, us, you, them — preposition לְ + suffixed person" },
  { hebrew: "אִתִּי, אִתְּךָ, אִתּוֹ, אִתָּהּ, אִתָּנוּ", transliteration: "iti, itekha, ito, itah, itanu", english: "with me / you / him / her / us — *not* a separate word for 'with' + pronoun" },
  { hebrew: "אֹתִי, אוֹתְךָ, אוֹתוֹ, אוֹתָהּ, אוֹתָנוּ", transliteration: "oti, otekha, oto, otah, otanu", english: "me / you / him / her / us as *direct object* (אֶת + person)" },
  { hebrew: "מִמֶּנִי, מִמֶּנּוּ, מֵהֶם", transliteration: "mimeni, mimenu, mehem", english: "from me / from him / from them (מִן + suffix; נ doubles in the stem in several persons)" },
  { hebrew: "בִּי, בּוֹ, בָּהֶם", transliteration: "bi, bo, bahem", english: "in me / in him / in them — preposition בְּ fused" },
];

// ─── SMIKHUT (CONSTRUCT) ─────────────────────────────────────────────────────

export const SMIKHUT_RULES: GrammarListItem[] = [
  {
    hebrew: "בֵּית־הַסֵּפֶר",
    transliteration: "beit ha-sefer",
    english: "The school (institution) — NOT *ha-bayit sefer* as two independent “the”s",
    note: "Construct binds בית to ספר; the definite article typically sits on the second noun in this idiom (the head of the phrase for definiteness in many patterns)",
  },
  {
    hebrew: "בַּיִת → בֵּית־ (construct stem)",
    transliteration: "bayit → beit-",
    english: "The first noun often shortens or shifts vowel when it is *nismakh* (bound) to the next noun",
  },
  {
    hebrew: "מִשְׁפַּחַת־ + noun",
    transliteration: "mishpachat-",
    english: "Feminine nouns in construct often get a linking tav: מִשְׁפַּחַת אָבִי — my father’s family",
  },
  {
    hebrew: "הַסֵּפֶר שֶׁל …",
    transliteration: "ha-sefer she…",
    english: "Colloquial periphrastic possessive: “Dana’s book” — coexists with construct; not identical register",
  },
];

// ─── PASSIVE BINYANIM (RECOGNITION) ───────────────────────────────────────────

export const PASSIVE_REGISTER: GrammarListItem[] = [
  {
    hebrew: "נִפְתַּח / נִסְגַּר",
    transliteration: "niftach / nisgar",
    english: "was opened / was closed (Nif’al) — very common in news",
  },
  {
    hebrew: "Pu’al / Huf’al",
    transliteration: "“passive inten.” / “passive caus.”",
    english: "Formal reporting: the project *was* launched (agent optional); recognize u-style vowel templates + known roots",
  },
  {
    hebrew: "Active vs passive focus",
    transliteration: "—",
    english: "Passive backgrounds the doer; Israeli conversation may prefer active, short main clauses — but media and law don’t",
  },
];

// ─── IF-CLAUSES (OVERVIEW) ───────────────────────────────────────────────────

export const CONDITIONAL_CLAUSES: GrammarListItem[] = [
  {
    hebrew: "אִם + future (open condition)",
    transliteration: "im",
    english: "If (when the outcome is still open) — the default for “if I can, I will” in Modern Hebrew",
  },
  {
    hebrew: "אִלּוּ / לוּ + past (counterfactual, literary)",
    transliteration: "ilu / lu",
    english: "If only / if it had been — contrary-to-fact; high-register written/literary layer",
  },
  {
    hebrew: "Colloquial workarounds",
    transliteration: "—",
    english: "הָיִיתִי צָרִיך, כדאי היה, אם + past in speech; use high-register irrealis when the text demands it",
  },
];

// ─── PRONOMINAL SUFFIXES ─────────────────────────────────────────────────────

export const PRONOMINAL_SUFFIXES: GrammarListItem[] = [
  { hebrew: "סִפְרִי", transliteration: "sifri", english: "my book (1s suffix ־ִי)" },
  { hebrew: "סִפְרְךָ", transliteration: "sifrecha", english: "your book (2ms suffix ־ְךָ)" },
  { hebrew: "סִפְרֵךְ", transliteration: "sifrech", english: "your book (2fs suffix ־ֵךְ)" },
  { hebrew: "סִפְרוֹ", transliteration: "sifro", english: "his book (3ms suffix ־וֹ)" },
  { hebrew: "סִפְרָהּ", transliteration: "sifrah", english: "her book (3fs suffix ־הּ)" },
  { hebrew: "סִפְרֵנוּ", transliteration: "sifrenu", english: "our book (1p suffix ־ֵנוּ)" },
  { hebrew: "סִפְרְכֶם", transliteration: "sifrechem", english: "your book (2mp suffix ־ְכֶם)" },
  { hebrew: "סִפְרָם", transliteration: "sifram", english: "their book (3mp suffix ־ָם)" },
];

// ─── SECTIONS ────────────────────────────────────────────────────────────────

export const GRAMMAR_SECTIONS: GrammarSection[] = [
  {
    id: "verbs",
    title: "Verbs",
    heTitle: "פְּעָלִים",
    intro:
      "Hebrew verbs are built on a three-letter root (שׁוֹרֶשׁ). The same root in different patterns (בִּנְיָנִים) produces related words with shifting meanings — passive, causative, reflexive, and more. The tables below use the regular strong root כ.ת.ב (to write) as the model.",
    tables: [QAL_PAST, QAL_PRESENT, QAL_FUTURE],
  },
  {
    id: "binyanim",
    title: "The Seven Verb Patterns (Binyanim)",
    heTitle: "בִּנְיָנִים",
    intro:
      "Every Hebrew verb stem belongs to one of seven binyanim. The pattern tells you the verb's relationship to its root: active, passive, causative, or reflexive. Recognising the pattern is often enough to guess the meaning of an unfamiliar verb.",
    items: BINYANIM,
  },
  {
    id: "nouns",
    title: "Nouns & Adjectives",
    heTitle: "שֵׁמוֹת",
    intro:
      "Hebrew nouns are either masculine or feminine. Adjectives follow the noun they describe and must agree in gender, number, and definiteness. Most feminine nouns end in ־ָה (e.g. מוֹרָה), but many do not — gender is partly predictable, partly memorised.",
    items: [...NOUN_PATTERNS, ...ADJECTIVE_AGREEMENT],
  },
  {
    id: "article",
    title: "Definite Article",
    heTitle: "הַיְּדִיעָה",
    intro:
      "Hebrew has no indefinite article (\"a/an\"). The definite article הַ is a prefix that attaches directly to the noun. Its vowel changes when the following consonant is a guttural (א, ה, ח, ע, ר), because gutturals resist doubling.",
    items: DEFINITE_ARTICLE,
  },
  {
    id: "particles",
    title: "Particles & Prepositions",
    heTitle: "מִלִּיוֹת",
    intro:
      "Hebrew prepositions and conjunctions are often single-letter prefixes that attach to the following word. When they combine with the definite article הַ, the ה drops and its vowel shifts onto the prefix.",
    items: PARTICLES,
  },
  {
    id: "suffixes",
    title: "Pronominal Suffixes",
    heTitle: "כִּנּוּיִים",
    intro:
      "Instead of a separate word like \"my\" or \"his\", Hebrew attaches pronoun suffixes directly to nouns, verbs, and prepositions. The model noun here is סֵפֶר (book), which shifts to סִפְר- before most suffixes.",
    items: PRONOMINAL_SUFFIXES,
  },
  {
    id: "matres",
    title: "Matres (full spelling) / reading without nikkud",
    heTitle: "כְּתִיב מָלֵא",
    intro:
      "When vowel points go away, vav, yod, and final letters do part of the vowel’s work. The same lemma you know pointed may look “new” in apps and signage — the curriculum adds a full lesson + drills at the end of Aleph.",
    items: MATRES_LECTIONIS,
  },
  {
    id: "prep-pronoun",
    title: "Prepositions with pronoun suffixes",
    heTitle: "נִטּוּיֵי הַיּוֹחֲסָה",
    intro:
      "“With us” is not *עִם + אֲנַחְנוּ* as a default collocation — the language fuses. Mastering לִי vs אוֹתִי is the antidote to English-thinking; see the Bet capstone section in Learn.",
    items: PREP_WITH_PRONOUN,
  },
  {
    id: "smikhut",
    title: "Smikhut (construct state)",
    heTitle: "סְמִיכוּת",
    intro:
      "Pair two nouns: the first is bound, often with a different vowel shape; definiteness and ה often attach to the second noun (בֵּית־הַסֵּפֶר, not a doubled English-style “the the”).",
    items: SMIKHUT_RULES,
  },
  {
    id: "passive-formal",
    title: "Passive binyanim & formal register",
    heTitle: "נִסְגַּר / הוּכְרַע",
    intro:
      "Nif’al, Pu’al, and Huf’al are everywhere in law and media — the curriculum adds explicit recognition work at the end of Dalet.",
    items: PASSIVE_REGISTER,
  },
  {
    id: "conditionals",
    title: "If — open vs counterfactual",
    heTitle: "אִם · אִלּוּ · לוּ",
    intro:
      "Not every English if is a simple אִם. Open possibilities vs regret / contrary-to-fact (אִלּוּ/לוּ and irrealis past) is the bridge from café Hebrew to story and op-ed; capstone in Learn.",
    items: CONDITIONAL_CLAUSES,
  },
];
