/**
 * Grammar MCQ sets ported from `hebrew-v8.2.html` (`GRAM` array).
 * Used by Study → Grammar drill (no Rabbi imagery).
 */

export type GrammarDrillItem = {
  /** Hebrew prompt (may include ___ blank). */
  h: string;
  cue: string;
  opts: readonly string[];
  ans: number;
  note: string;
};

export type GrammarDrillTopic = {
  id: string;
  topic: string;
  prompt: string;
  items: readonly GrammarDrillItem[];
};

export const GRAMMAR_DRILLS: readonly GrammarDrillTopic[] = [
  {
    id: "g1",
    topic: "Gender Agreement",
    prompt: "Choose the correct adjective to match the noun",
    items: [
      {
        h: "כֶּלֶב ___",
        cue: "dog (m.) + big",
        opts: ["גָּדוֹל", "גְּדוֹלָה", "גָּדוֹל הוּא", "גָּדוֹלִים"],
        ans: 0,
        note: "כֶּלֶב is masculine → use the masculine adjective גָּדוֹל",
      },
      {
        h: "עִיר ___",
        cue: "city (f.) + big",
        opts: ["גָּדוֹל", "גְּדוֹלָה", "גָּדוֹלוֹת", "גָּדוֹלִים"],
        ans: 1,
        note: "עִיר is feminine → use גְּדוֹלָה — the ה suffix marks feminine adjectives",
      },
      {
        h: "סֵפֶר ___",
        cue: "book (m.) + new",
        opts: ["חֲדָשָׁה", "חָדָשׁ", "חֲדָשִׁים", "חֲדָשׁוֹת"],
        ans: 1,
        note: "סֵפֶר is masculine → חָדָשׁ",
      },
      {
        h: "מְכוֹנִית ___",
        cue: "car (f.) + new",
        opts: ["חָדָשׁ", "חֲדָשִׁים", "חֲדָשָׁה", "חֲדָשׁוֹת"],
        ans: 2,
        note: "מְכוֹנִית is feminine → חֲדָשָׁה",
      },
    ],
  },
  {
    id: "g2",
    topic: "Plural Formation",
    prompt: "Choose the correct plural form",
    items: [
      {
        h: "יֶלֶד → ___",
        cue: "boy → boys",
        opts: ["יְלָדִים", "יְלָדוֹת", "יְלֵדִים", "יַלְדִּים"],
        ans: 0,
        note: "Masculine nouns usually take the ים- suffix in the plural",
      },
      {
        h: "יַלְדָּה → ___",
        cue: "girl → girls",
        opts: ["יַלְדוֹת", "יַלְדִּים", "יְלָדוֹת", "יַלְדִּיוֹת"],
        ans: 2,
        note: "Feminine nouns usually take the וֹת- suffix",
      },
      {
        h: "עִיר → ___",
        cue: "city → cities",
        opts: ["עִירִים", "עָרִים", "עִירוֹת", "עֲרָיִם"],
        ans: 1,
        note: "Some irregular plurals — עִיר → עָרִים (vowel change)",
      },
      {
        h: "סֵפֶר → ___",
        cue: "book → books",
        opts: ["סְפָרִים", "סֵפֶרִים", "סְפָרוֹת", "סֵפְרוֹת"],
        ans: 0,
        note: "סֵפֶר → סְפָרִים — root vowels shift in the plural",
      },
    ],
  },
  {
    id: "g3",
    topic: "Past Tense — Pa'al",
    prompt: "Choose the correct past tense form",
    items: [
      {
        h: "הִיא ___ לַשּׁוּק",
        cue: "She ___ to the market",
        opts: ["הָלְכָה", "הָלַךְ", "הָלְכוּ", "הוֹלֶכֶת"],
        ans: 0,
        note: "Feminine singular past: הָלְכָה — note the ה suffix",
      },
      {
        h: "הֵם ___ הַרְבֵּה",
        cue: "They ___ a lot",
        opts: ["אָכַל", "אָכְלָה", "אָכְלוּ", "אוֹכְלִים"],
        ans: 2,
        note: "Plural past (3rd person): אָכְלוּ — note the וּ suffix",
      },
      {
        h: "אֲנִי ___ אוֹתְךָ",
        cue: "I ___ you",
        opts: ["רָאָה", "רָאִיתִי", "רָאִית", "רָאוּ"],
        ans: 1,
        note: "1st person singular past: רָאִיתִי — the תִי suffix marks 'I'",
      },
      {
        h: "אַתָּה ___ אֶת זֶה",
        cue: "You ___ this",
        opts: ["שָׁמַע", "שָׁמַעְתִּי", "שָׁמַעְתָּ", "שָׁמְעוּ"],
        ans: 2,
        note: "2nd person masculine singular past: תָּ- suffix",
      },
    ],
  },
  {
    id: "g4",
    topic: "Definite Article — הַ",
    prompt: "Choose the correct definite form",
    items: [
      {
        h: "___ כֶּלֶב גָּדוֹל",
        cue: "the big dog",
        opts: ["הַ", "הָ", "הֶ", "בַּ"],
        ans: 0,
        note: "הַ before most consonants — the dog = הַכֶּלֶב",
      },
      {
        h: "___ בַּיִת יָפֶה",
        cue: "the beautiful house",
        opts: ["הַ", "הַבַּ", "הַ + בַּ", "בַּ"],
        ans: 3,
        note: "When preceded by ב preposition + הַ, they merge: בַּבַּיִת = in the house",
      },
      {
        h: "כֶּלֶב ___ גָּדוֹל",
        cue: "a big dog (no article needed?)",
        opts: [
          "Needs הַ",
          "No article — indefinite",
          "Add הַ to גָּדוֹל too",
          "Use שֶׁל",
        ],
        ans: 1,
        note: "Without הַ, the noun is indefinite — no word for 'a' in Hebrew",
      },
    ],
  },
  {
    id: "g5",
    topic: "Possession — שֶׁל",
    prompt: "Choose the correct possessive construction",
    items: [
      {
        h: "___ הַכֶּלֶב שֶׁל דָּנִי",
        cue: "Dani's dog",
        opts: [
          "כֶּלֶב שֶׁל דָּנִי",
          "הַכֶּלֶב שֶׁל דָּנִי",
          "דָּנִי שֶׁל כֶּלֶב",
          "הַ דָּנִי כֶּלֶב",
        ],
        ans: 1,
        note: "Possession: הַ + noun + שֶׁל + possessor. No apostrophe in Hebrew!",
      },
      {
        h: "הַסֵּפֶר ___ אֲנִי",
        cue: "my book",
        opts: ["שֶׁלִּי", "שֶׁל אֲנִי", "שֶׁלִּי הַסֵּפֶר", "אֲנִי שֶׁל"],
        ans: 0,
        note: "שֶׁלִּי = mine/my. The personal pronouns attach to שֶׁל",
      },
      {
        h: "זֶה הַבַּיִת ___?",
        cue: "Is this your house?",
        opts: ["שֶׁלְּךָ", "שֶׁל אַתָּה", "שֶׁלִּי", "שֶׁל הוּא"],
        ans: 0,
        note: "שֶׁלְּךָ = yours (m.) — pronoun suffixes on שֶׁל",
      },
    ],
  },
] as const;
