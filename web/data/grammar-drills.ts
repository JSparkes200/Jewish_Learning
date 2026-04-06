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

export const GRAMMAR_DRILLS = [
  {
    id: "g1",
    topic: "Gender Agreement",
    prompt: "You’re pairing the noun with the adjective a speaker would actually use — trust gender and number.",
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
    prompt: "You’ll pick the plural shape Hebrew speakers expect for this noun.",
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
    prompt: "You’re finishing the past-tense line — match the person and number in the sentence.",
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
    prompt: "You’re deciding when הַ appears, merges with a preposition, or stays quiet for “a” ideas.",
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
    prompt: "You’re building a natural שֶׁל line — whose thing is this?",
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
  {
    id: "g6",
    topic: "Infinitive — ל + stem",
    prompt: "Pick the infinitive that matches the cue (modern conversational Hebrew).",
    items: [
      {
        h: "ל___ (to eat)",
        cue: "infinitive of אכל",
        opts: ["לֶאֱכֹל", "אוֹכֵל", "אָכַל", "נֶאֱכַל"],
        ans: 0,
        note: "ל + אכל → לֶאֱכֹל (same spelling as legacy BASIC VERBS row) — ל־ marks the infinitive",
      },
      {
        h: "ל___ (to go)",
        cue: "infinitive of הלך",
        opts: ["הוֹלֵךְ", "לָלֶכֶת", "הָלַךְ", "נוֹלֵךְ"],
        ans: 1,
        note: "לָלֶכֶת is the everyday infinitive for ‘to go’",
      },
      {
        h: "ל___ (to see)",
        cue: "infinitive of ראה",
        opts: ["רוֹאֶה", "לִרְאוֹת", "רָאָה", "יִרְאֶה"],
        ans: 1,
        note: "לִרְאוֹת — ל + stem with characteristic vowels for this root",
      },
    ],
  },
  {
    id: "g7",
    topic: "Present tense — who’s doing it",
    prompt:
      "Pick the present-tense form that matches the subject (spoken Hebrew).",
    items: [
      {
        h: "הוּא ___ פִּיצָה",
        cue: "He’s eating pizza (present)",
        opts: ["אוֹכֵל", "אָכַל", "יֹאכַל", "אָכוּל"],
        ans: 0,
        note: "Masculine singular present of אכל — אוֹכֵל (see legacy corpus rows for m. pres.)",
      },
      {
        h: "הִיא ___ לַמּוֹכֶלֶת",
        cue: "She’s walking to the salesperson (present)",
        opts: ["הוֹלֵךְ", "הוֹלֶכֶת", "הָלְכָה", "תֵּלֵךְ"],
        ans: 1,
        note: "Feminine singular present of הלך — הוֹלֶכֶת",
      },
      {
        h: "הִיא ___ אֶת הַיְלָדִים",
        cue: "She sees the children (present)",
        opts: ["רוֹאָה", "רוֹאֶה", "רָאְתָה", "תִּרְאֶה"],
        ans: 0,
        note: "Feminine singular present of ראה — רוֹאָה (legacy corpus: f. pres.)",
      },
      {
        h: "אַתָּה ___ עִבְרִית?",
        cue: "You speak Hebrew (m., present)?",
        opts: ["מְדַבֵּר", "דִּבַּרְתָּ", "תְּדַבֵּר", "מְדַבֶּרֶת"],
        ans: 0,
        note: "Masculine singular present of דבר — מְדַבֵּר",
      },
    ],
  },
  {
    id: "g8",
    topic: "Future tense — Pa’al spine",
    prompt:
      "Pick the future form that matches the subject (same roots as legacy L1 future + ROOTS rows).",
    items: [
      {
        h: "הוּא מָחָר ___ לְבֵית הַסֵּפֶר",
        cue: "He will go to school tomorrow",
        opts: ["הוֹלֵךְ", "יֵלֵךְ", "הָלַךְ", "לֵילֵךְ"],
        ans: 1,
        note: "3rd person masculine future of הלך — יֵלֵךְ (י־ prefix)",
      },
      {
        h: "אֲנִי ___ בּוֹקֶר",
        cue: "I will eat in the morning",
        opts: ["אוֹכֵל", "אֹכַל", "אָכַל", "אֶאֱכַל"],
        ans: 1,
        note: "1st person future of אכל — אֹכַל (legacy L1 future list)",
      },
      {
        h: "אֲנַחְנוּ ___ יַחַד לַשּׁוּק",
        cue: "We will go to the market together",
        opts: ["הוֹלְכִים", "נֵלֵךְ", "נֶאֱכַל", "נִרְאֶה"],
        ans: 1,
        note: "1st person plural future of הלך — נֵלֵךְ",
      },
      {
        h: "הֵם ___ אֶת הַסֶּרֶט מָחָר",
        cue: "They will see the film tomorrow",
        opts: ["רוֹאִים", "רָאוּ", "יִרְאוּ", "יִרְאֶה"],
        ans: 2,
        note: "3rd person plural future of ראה — יִרְאוּ",
      },
    ],
  },
  {
    id: "g9",
    topic: "Question words — openers",
    prompt:
      "Choose the question word that fits the sentence (modern conversational Hebrew).",
    items: [
      {
        h: "___ נִּשְׁמַע?",
        cue: "What’s up? / What’s new?",
        opts: ["מַה", "מִי", "אֵיפֹה", "לָמָּה"],
        ans: 0,
        note: "מַה נִּשְׁמַע — fixed colloquial greeting pattern in the legacy corpus",
      },
      {
        h: "___ הַבַּנְק?",
        cue: "Where is the bank?",
        opts: ["מַה", "אֵיךְ", "אֵיפֹה", "מִי"],
        ans: 2,
        note: "Location questions start with אֵיפֹה",
      },
      {
        h: "___ קוֹרְאִים לָךְ?",
        cue: "What are you called? (How is your name said?)",
        opts: ["לָמָּה", "אֵיךְ", "מִי", "מַה"],
        ans: 1,
        note: "אֵיךְ קוֹרְאִים … — how one is called",
      },
      {
        h: "___ לֹא בָּאת אֶתְמוֹל?",
        cue: "Why didn’t you come yesterday?",
        opts: ["אֵיפֹה", "אֵיךְ", "לָמָּה", "מַה"],
        ans: 2,
        note: "לָמָּה — why (legacy corpus spelling with double מ)",
      },
    ],
  },
  {
    id: "g10",
    topic: "Plural adjectives — who they describe",
    prompt:
      "Pick the plural adjective that matches a masculine-plural or feminine-plural subject (legacy L2 agreement rows).",
    items: [
      {
        h: "הַיְלָדִים ___ מְאֹד",
        cue: "The boys are very big (m. pl. subject)",
        opts: ["גְּדוֹלִים", "גְּדוֹלוֹת", "גָּדוֹל", "גְּדוֹלָה"],
        ans: 0,
        note: "יְלָדִים is masculine plural → גְּדוֹלִים (ים- plural for m. adjectives in the corpus)",
      },
      {
        h: "הַחֲבֵרוֹת ___",
        cue: "The friends (f.) are beautiful",
        opts: ["יָפִים", "יָפוֹת", "יָפֶה", "יָפָה"],
        ans: 1,
        note: "חֲבֵרוֹת is feminine plural → יָפוֹת — וֹת- marks feminine plural adjectives",
      },
      {
        h: "הַסְּפָרִים עֲדַיִן ___",
        cue: "The books are still new (m. pl.)",
        opts: ["חֲדָשִׁים", "חֲדָשׁוֹת", "חָדָשׁ", "חֲדָשָׁה"],
        ans: 0,
        note: "סְפָרִים is masculine plural → חֲדָשִׁים",
      },
      {
        h: "הַמִּשְׁפָּחוֹת ___",
        cue: "The families are good (f. pl.)",
        opts: ["טוֹבִים", "טוֹבוֹת", "טוֹב", "טוֹבָה"],
        ans: 1,
        note: "מִשְׁפָּחוֹת is feminine plural → טוֹבוֹת",
      },
    ],
  },
  {
    id: "g11",
    topic: "Construct state — fill the second noun",
    prompt:
      "Complete סְמִיכוּת (noun–noun) phrases. Rule: the definite article הַ goes on the **second** noun when the whole phrase is definite — בֵּית הַסֵּפֶר ‘the school’, never *הַבֵּית סֵפֶר.",
    items: [
      {
        h: "___ — בֵּית סֵפֶר מְסֻיָּם (הַנִיסוּחַ הַנָּכוֹן)",
        cue: "The school — definite smichut: ה only on the second noun",
        opts: ["בֵּית הַסֵּפֶר", "הַבֵּית סֵפֶר", "הַבַּיִת סֵפֶר", "בֵּית סֵפֶר הַ"],
        ans: 0,
        note: "בֵּית הַסֵּפֶר — first noun stays bound without ה; ה attaches to the second noun (not הַבֵּית סֵפֶר).",
      },
      {
        h: "בֵּית ___",
        cue: "school (literally house of a book)",
        opts: ["סֵפֶר", "סְפָרִים", "לִימוּד", "דֶּלֶת"],
        ans: 0,
        note: "בֵּית סֵפֶר — fixed compound in the phrasebook (indefinite / generic)",
      },
      {
        h: "בֵּית ___",
        cue: "café",
        opts: ["קָפֶה", "קְפִיצָה", "קָפֶץ", "כֹּפֶת"],
        ans: 0,
        note: "בֵּית קָפֶה — same pattern as other בֵּית compounds",
      },
      {
        h: "חֲנוּת ___",
        cue: "grocery store",
        opts: ["מִכּוֹלֶת", "מַכּוֹלֶת", "כּוֹל", "כֹּל"],
        ans: 0,
        note: "חֲנוּת מִכּוֹלֶת — construct: shop of provisions",
      },
      {
        h: "תַּחֲנַת ___",
        cue: "police station",
        opts: ["מִשְׁטָרָה", "מִשְׁתָרֶה", "שְׁטָר", "דֶּרֶךְ"],
        ans: 0,
        note: "תַּחֲנַת מִשְׁטָרָה — station of police",
      },
    ],
  },
  {
    id: "g12",
    topic: "Direct object — אֶת with the definite",
    prompt:
      "Use אֶת before a **definite** direct object (הַ… or a proper name). Names are definite even without ה — רָאִיתִי אֶת דָּנִי, like אוֹהֲבִים אֶת דָּנִי in the corpus.",
    items: [
      {
        h: "שָׁמַעְתָּ ___ הַחֲדָשׁוֹת?",
        cue: "Did you hear the news?",
        opts: ["אֶת", "בְּ", "לְ", "שֶׁל"],
        ans: 0,
        note: "Definite object → אֶת (same frame as the legacy practice sentence)",
      },
      {
        h: "הִיא מְבָרֶכֶת ___ הַנֵּרוֹת",
        cue: "She blesses the candles",
        opts: ["אֶת", "עִם", "אֶל", "מִן"],
        ans: 0,
        note: "Transitive verb + definite object → אֶת (Shabbat story row in the corpus)",
      },
      {
        h: "רוֹצֶה לְסַדֵּר ___ הַבַּיִת",
        cue: "wants to tidy the house",
        opts: ["אֶת", "בְּ", "לְ", "מִ"],
        ans: 0,
        note: "לְסַדֵּר אֶת הַבַּיִת — fixed collocation in BASIC / household verbs",
      },
      {
        h: "הוּא עָבַר ___ הַמִּבְחָן",
        cue: "He passed the test",
        opts: ["אֶת", "עִם", "בְּ", "שֶׁל"],
        ans: 0,
        note: "עָבַר אֶת הַמִּבְחָן — verb + אֶת + definite object",
      },
      {
        h: "כֻּלָּם אוֹהֲבִים ___ דָּנִי",
        cue: "Everyone loves Dani (proper name)",
        opts: ["אֶת", "בְּ", "לְ", "עִם"],
        ans: 0,
        note: "שמות פרטיים נחשבים מסומנים — משתמשים בְּאֶת כמו עם הַ… (שורת הסיפור: אוֹהֲבִים אֶת דָּנִי).",
      },
    ],
  },
  {
    id: "g13",
    topic: "Subordinators — כִּי, כְּשֶׁ, לִפְנֵי שֶׁ, אִם",
    prompt:
      "Pick the connector that matches the logic of the sentence (legacy L1–L2 function-word rows).",
    items: [
      {
        h: "אֲנִי שָׂמֵחַ ___ הוּא כָּאן",
        cue: "I'm happy because he's here",
        opts: ["כִּי", "כְּשֶׁ", "אִם", "לִפְנֵי שֶׁ"],
        ans: 0,
        note: "כִּי introduces a reason clause (corpus gloss: because / that)",
      },
      {
        h: "___ נִרְדַּמְתִּי, הַטֵּלֵפוֹן צִלְצֵל",
        cue: "When I fell asleep, the phone rang",
        opts: ["כְּשֶׁ", "כִּי", "אִם", "לָמָּה"],
        ans: 0,
        note: "כְּשֶׁ — when (conj.) in the phrasebook",
      },
      {
        h: "___ נוֹסְעִים, נְמַלֵּא מַיִם לָרֶכֶב",
        cue: "Before we travel, we fill water for the car",
        opts: ["לִפְנֵי שֶׁ", "מֵאַחַר שֶׁ", "כִּי", "אִם"],
        ans: 0,
        note: "לִפְנֵי שֶׁ — before (conj.)",
      },
      {
        h: "___ תָּבוֹא מָחָר, נֵלֵךְ יַחַד",
        cue: "If you come tomorrow, we'll go together",
        opts: ["אִם", "כִּי", "כְּשֶׁ", "לִפְנֵי שֶׁ"],
        ans: 0,
        note: "אִם — conditional if (L1 row)",
      },
    ],
  },
  {
    id: "g14",
    topic: "Hitpa'el infinitives — לְהִת…",
    prompt:
      "Choose the Hitpa'el infinitive. Usual shape: לְהִת + stem. If the first root letter is ס ז ש or צ, the ת metathesizes (לְהִסְתַּדֵּר, not לְהִתְסַדֵּר) — classic ulpan Level 2/3 pattern.",
    items: [
      {
        h: "חָשׁוּב לִי לְ___ בַּעֲבוֹדָה",
        cue: "It's important for me to concentrate at work",
        opts: ["לְהִתְרַכֵּז", "לְהִתְפַּלֵּל", "לְהִתְעוֹרֵר", "לְהִתְנַצֵּל"],
        ans: 0,
        note: "לְהִתְרַכֵּז — to concentrate (Hitpa'el, shoresh רכז)",
      },
      {
        h: "הוּא מַקְדִּים לְ___ כָּל בֹּקֶר",
        cue: "He wakes up early every morning",
        opts: ["לְהִתְעוֹרֵר", "לְהִתְרַכֵּז", "לְהִתְוַכֵּחַ", "לְהִתְכּוֹפֵף"],
        ans: 0,
        note: "לְהִתְעוֹרֵר — to wake up (daily-life L2 block)",
      },
      {
        h: "צָרִיךְ לְ___ אַחַר הַטְעוּת",
        cue: "You need to apologise after the mistake",
        opts: ["לְהִתְנַצֵּל", "לְהִתְוַכֵּחַ", "לְהִתְפַּלֵּל", "לְהִתְרַכֵּז"],
        ans: 0,
        note: "לְהִתְנַצֵּל — to apologise (same lemma as corpus, Hitpa'el)",
      },
      {
        h: "בְּשַׁבָּת הֵם הוֹלְכִים לְ___",
        cue: "On Shabbat they go to pray",
        opts: ["לְהִתְפַּלֵּל", "לְהִתְוַכֵּחַ", "לְהִתְנַצֵּל", "לְהִתְעַטֵּשׁ"],
        ans: 0,
        note: "לְהִתְפַּלֵּל — to pray (L1 shoresh פלל)",
      },
      {
        h: "צָרִיךְ לְ___ עִם הַמַּצָּב",
        cue: "Need to manage / get by with the situation",
        opts: ["לְהִסְתַּדֵּר", "לְהִתְסַדֵּר", "לְהִתְכּוֹנֵן", "לְהִתְעוֹרֵר"],
        ans: 0,
        note: "לְהִסְתַּדֵּר — root ס־ד־ר → metathesis (ת before ס); לְהִתְסַדֵּר is the common misspelling.",
      },
    ],
  },
  {
    id: "g15",
    topic: "Time frame — אֶתְמוֹל, מָחָר, עַכְשָׁו, הַלַּיְלָה",
    prompt:
      "Place the time word that matches the situation (Questions & Time word list in the legacy course).",
    items: [
      {
        h: "___ הָלַכְתִּי לַשּׁוּק",
        cue: "I went to the market (past day)",
        opts: ["אֶתְמוֹל", "מָחָר", "עַכְשָׁו", "הַלַּיְלָה"],
        ans: 0,
        note: "אֶתְמוֹל — yesterday (reading passage opener in the corpus)",
      },
      {
        h: "נִפְגָּשִׁים ___ בַּבֹּקֶר?",
        cue: "Shall we meet tomorrow morning?",
        opts: ["מָחָר", "אֶתְמוֹל", "עַכְשָׁו", "הַיּוֹם"],
        ans: 0,
        note: "מָחָר — tomorrow (paired with בַּבֹּקֶר in corpus rows)",
      },
      {
        h: "___ אֲנִי בְּפִגּוּשׁ, אַל תְּהַפְרֵעַ",
        cue: "I'm in a meeting now — don't interrupt",
        opts: ["עַכְשָׁו", "מָחָר", "אֶתְמוֹל", "מָתַי"],
        ans: 0,
        note: "עַכְשָׁו — now (L1 time adverb)",
      },
      {
        h: "___ אֲנַחְנוּ טָסִים לְתֵל אָבִיב",
        cue: "We're flying to Tel Aviv tonight",
        opts: ["הַלַּיְלָה", "מָחָר", "אֶתְמוֹל", "הַיּוֹם"],
        ans: 0,
        note: "הַלַּיְלָה — tonight (corpus pairs with travel planning)",
      },
    ],
  },
  {
    id: "g16",
    topic: "Pi'el infinitives — לְ…ֵּ… pattern",
    prompt:
      "Pick the Pi'el infinitive (typically לְ + middle dot / doubled stem) that fits the cue — denser everyday verbs beyond basic Pa'al.",
    items: [
      {
        h: "רוֹצֶה לְ___ עִבְרִית יוֹתֵר טוֹב",
        cue: "to speak Hebrew better",
        opts: ["לְדַבֵּר", "לִשְׁתּוֹת", "לֶאֱכֹל", "לָלֶכֶת"],
        ans: 0,
        note: "לְדַבֵּר — Pi'el of דבר (core verb list in the corpus).",
      },
      {
        h: "הִיא מוֹרָה — אוֹהֶבֶת לְ___",
        cue: "She’s a teacher — loves to teach",
        opts: ["לְלַמֵּד", "לִלְמוֹד", "לִקְרֹא", "לִכְתֹּב"],
        ans: 0,
        note: "לְלַמֵּד — Pi'el of למד (L1–L2 rows).",
      },
      {
        h: "רוֹצִים לְ___ אֶת הַקֶּשֶׁר עִם הַקְּהִלָּה",
        cue: "to strengthen the link with the community",
        opts: ["לְחַזֵּק", "לַחֲזוֹק", "לְהִתְחַזֵּק", "לְחוֹזֶק"],
        ans: 0,
        note: "לְחַזֵּק — Pi'el (L4); לְהִתְחַזֵּק is Hitpa'el ‘to strengthen oneself’.",
      },
      {
        h: "קֹדֶם כֹּל צָרִיךְ לְ___ אֶת הַמִּטְבָּח",
        cue: "First of all need to clean the kitchen",
        opts: ["לְנַקּוֹת", "לִנְקוֹת", "לְהִתְנַקּוֹת", "לִשְׁטֹף"],
        ans: 0,
        note: "לְנַקּוֹת — Pi'el of נקה (L2 household verbs).",
      },
    ],
  },
  {
    id: "g17",
    topic: "Hif'il infinitives — לְהַ…",
    prompt:
      "Pick the Hif'il causative / transitivising infinitive (לְהַ + stem). Many appear in opinion and news-style Hebrew in the corpus.",
    items: [
      {
        h: "חָשׁוּב לְ___ לַמּוֹרָה בַּשִּׁעוּר",
        cue: "to listen carefully to the teacher in class",
        opts: ["לְהַקְשִׁיב", "לְהִתְקַשֵּׁב", "לִשְׁמֹעַ", "לְשַׁמֵּעַ"],
        ans: 0,
        note: "לְהַקְשִׁיב — Hif'il ‘to make attentive / listen carefully’ (corpus row).",
      },
      {
        h: "אַל תַּעֲצֹר — צָרִיךְ לְ___",
        cue: "Don’t stop — need to continue",
        opts: ["לְהַמְשִׁיךְ", "לְהִתְמַשֵּׁךְ", "לָלֶכֶת", "לַעֲצֹר"],
        ans: 0,
        note: "לְהַמְשִׁיךְ — Hif'il of root מ־שׁ־ך (greeting + core lists).",
      },
      {
        h: "בַּמַּאֲמָר הֵם מְנַסִּים לְ___ אֶת הַנִּקּוּד",
        cue: "In the essay they try to deepen the nuance",
        opts: ["לְהַעֲמִיק", "לְהִתְעַמֵּק", "לַעֲמוֹק", "לְעוֹמֶק"],
        ans: 0,
        note: "לְהַעֲמִיק — Hif'il (L2–L4 argument vocabulary).",
      },
      {
        h: "אַחַר הַשְּׁאֵלָה צָרִיךְ לְ___ בְּצוּרָה בּוֹרֶרֶת",
        cue: "After the question one should respond clearly",
        opts: ["לְהַגִּיב", "לְהִתְגַּבֵּשׁ", "לָגֶב", "לְגַבּוֹת"],
        ans: 0,
        note: "לְהַגִּיב — Hif'il ‘to respond’ (editorial passage in the corpus).",
      },
    ],
  },
  {
    id: "g18",
    topic: "Nif'al — passive / medio-passive forms",
    prompt:
      "Choose the Nif'al form that fits the sentence. These show up in news, essays, and the bridge readings (passive of כתב, אמר, בנה…).",
    items: [
      {
        h: "עַל זֶה ___ בַּפּוֹרוּם אֶתְמוֹל",
        cue: "It was said on the forum yesterday",
        opts: ["נֶאֱמַר", "אָמְרוּ", "יֹאמַר", "לוֹמַר"],
        ans: 0,
        note: "נֶאֱמַר — Nif'al passive of אמר (L3 grammar note row).",
      },
      {
        h: "הַבִּנְיָן הַחָדָשׁ ___ שְׁנָתַיִם קֹדֶם",
        cue: "The building was built two years ago",
        opts: ["נִבְנָה", "בָּנוּ", "יִבָּנֶה", "לִבְנוֹת"],
        ans: 0,
        note: "נִבְנָה — Nif'al passive of בנה (Zohar / grammar vocabulary row).",
      },
      {
        h: "כָּל מִלָּה ___ בְּכַוָּנָה",
        cue: "Every word was written on purpose",
        opts: ["נִכְתַּבָה", "כָּתְבוּ", "תִכָּתֵב", "לִכְתֹּב"],
        ans: 0,
        note: "Fem. singular passive נִכְתַּבָה — matches מִלָּה (midrash-style passage).",
      },
      {
        h: "מֵרָחוֹק זֶה ___ טוֹב",
        cue: "From far away it sounds good",
        opts: ["נִשְׁמַע", "שָׁמְעוּ", "יִשָּׁמַע", "לִשְׁמֹעַ"],
        ans: 0,
        note: "נִשְׁמַע — Nif'al / stative ‘sounds’ (נִשְׁמַע טוֹב in the corpus).",
      },
    ],
  },
  {
    id: "g19",
    topic: "Purpose and cause — לְמַעַן, מִשּׁוּם שֶׁ, כְּדֵי שֶׁ",
    prompt:
      "Pick the connector that matches purpose vs cause (formal–journalistic Hebrew in L1–L4 lists).",
    items: [
      {
        h: "___ יֵשׁ אִינְפְּלַצְיָה, לֹא כָּל הֶסְכֵּם שָׁוֶה אֶת הַמְּחִיר",
        cue: "Because inflation is rising… (editorial)",
        opts: ["מִשּׁוּם שֶׁ", "לְמַעַן", "כְּדֵי שֶׁ", "אַף עַל פִּי שֶׁ"],
        ans: 0,
        note: "מִשּׁוּם שֶׁ — because (clause) — matches the modern op-ed passage.",
      },
      {
        h: "עוֹבְדִים הַיּוֹם ___ הַדּוֹר הַבָּא",
        cue: "We work today for the sake of the next generation",
        opts: ["לְמַעַן", "מִשּׁוּם שֶׁ", "כְּדֵי שֶׁ", "אִם"],
        ans: 0,
        note: "לְמַעַן + noun phrase — for the sake of (L1 row).",
      },
      {
        h: "אֶסְבִּיר שׁוּב ___ תָּבִין",
        cue: "I’ll explain again so that you understand",
        opts: ["כְּדֵי שֶׁ", "מִשּׁוּם שֶׁ", "לְמַעַן", "כִּי"],
        ans: 0,
        note: "כְּדֵי שֶׁ — so that + clause (paired with כְּדֵי in the corpus).",
      },
      {
        h: "___ הַקּוֹר, נִשְׁאַרְנוּ בַּבַּיִת",
        cue: "Because of the cold we stayed home",
        opts: ["בִּגְלַל", "מִשּׁוּם שֶׁ", "כְּדֵי שֶׁ", "לְמַעַן"],
        ans: 0,
        note: "בִּגְלַל + noun — because of (L1 row); מִשּׁוּם שֶׁ expects a clause.",
      },
    ],
  },
  {
    id: "g20",
    topic: "Concession and discourse — toward advanced argument Hebrew",
    prompt:
      "Choose the connector that fits contrast and meta-argument (Level 4 ‘Nuance / Bridge’ word lists — אַף עַל פִּי שֶׁ, מִשּׁוּם שֶׁרַק, אַף עַל פִּי כֵן).",
    items: [
      {
        h: "___ הַגֶּשֶׁם, יָצָאנוּ לַדֶּרֶךְ",
        cue: "Although it was raining, we set out",
        opts: ["אַף עַל פִּי שֶׁ", "מִשּׁוּם שֶׁ", "כְּדֵי שֶׁ", "לְמַעַן"],
        ans: 0,
        note: "אַף עַל פִּי שֶׁ — although + clause (L1 connector row).",
      },
      {
        h: "הוּא עָיֵף מְאֹד; ___ הוּא מַמְשִׁיךְ",
        cue: "He’s very tired; even so he continues",
        opts: ["אַף עַל פִּי כֵן", "אַף עַל פִּי שֶׁ", "מִשּׁוּם כָּךְ", "כִּי"],
        ans: 0,
        note: "אַף עַל פִּי כֵן — nevertheless / even so (discourse adverb).",
      },
      {
        h: "כְּדַי לְהַעֲמִיק בַּוִּכּוּחַ ___ רַק כָּךְ הַצִּבּוּר מֵבִין",
        cue: "Worth deepening the debate because only then does the public understand",
        opts: ["מִשּׁוּם שֶׁ", "אַף עַל פִּי שֶׁ", "לְמַעַן", "כְּדֵי שֶׁ"],
        ans: 0,
        note: "מִשּׁוּם שֶׁרַק… — mirrors the conference summary sentence in the corpus.",
      },
      {
        h: "___ הַמַּחֲלוֹקֶת הָאֲרוּכָּה, לֹא וִתְּרוּ עַל הָעִקָּר",
        cue: "Despite the long dispute, they didn’t give up the main point",
        opts: ["לְמַרוֹת", "מִשּׁוּם שֶׁ", "כְּדֵי שֶׁ", "אִם"],
        ans: 0,
        note: "לְמַרוֹת — formal ‘despite’ + noun (L2 connector; advanced register).",
      },
    ],
  },
  {
    id: "g21",
    topic: "Israeli press & public voice — roles and formats",
    prompt:
      "Vocabulary and collocations from the Level 4 ‘Press and Public Voice’ band: headlines, reports, editors, and broadcast framing (authentic Israeli media register).",
    items: [
      {
        h: "פִּרְסְמוּ אֶת הַחֲדָשׁוֹת תַּחַת ___ רָאשִׁית",
        cue: "They published the news under a main ___",
        opts: ["כּוֹתֶרֶת", "מַאֲמָר", "שַׁדְרָן", "עֲרִיכָה"],
        ans: 0,
        note: "כּוֹתֶרֶת — headline (L4 + L1 rows); contrasts with כּוֹתֶרֶת מִשְׁנֶה (subtitle).",
      },
      {
        h: "הַכַּתָּב הַמְּקוֹמִי פִּרְסֵם ___ קְצָרָה עַל הָאֵירוּעַ",
        cue: "The local reporter published a short news ___ on the incident",
        opts: ["כְּתָבָה", "מַאֲמָר", "כּוֹתֶרֶת", "עֲרִיכָה"],
        ans: 0,
        note: "כְּתָבָה — news report / article (press band; shorter than מַאֲמָר).",
      },
      {
        h: "בְּמַדוֹר הַדֵּעוֹת הוֹפִיעַ ___ אָרֹךְ עַל הַמִּשְׁפָּט",
        cue: "In the opinion section a long ___ appeared on the trial",
        opts: ["מַאֲמָר", "כְּתָבָה", "כּוֹתֶרֶת", "שַׁדְרָן"],
        ans: 0,
        note: "מַאֲמָר — essay / opinion article (heavier than a short כְּתָבָה).",
      },
      {
        h: "בִּתְחִלַּת הַשִּׁדּוּר הַשַּׁדְרָן קָרָא רַק אֶת ה___",
        cue: "At the start of the show the anchor read only the ___",
        opts: ["כּוֹתֶרֶת", "מַאֲמָר", "כְּתָבָה", "עֲרִיכָה"],
        ans: 0,
        note: "שַׁדְרָן + כּוֹתֶרֶת — broadcast opener; editorial passage warns not to stop at headlines alone.",
      },
    ],
  },
  {
    id: "g22",
    topic: "Procedural & ironic nuance — לְכַתְּחִלָּה, בְּדִיעֲבַד, דַּוְקָא, כִּבְיָכוֹל",
    prompt:
      "Halachic–journalistic adverbs that Ulpan Dalet+ and newspaper Hebrew recycle constantly (ideal vs after-the-fact, emphasis, hedging).",
    items: [
      {
        h: "___ יֵשׁ לְהַקְצוֹת מַשְׁאָבִים; רַק אַחַר כָּךְ לְהַרְחִיב",
        cue: "Ideally / from the outset one should allocate resources…",
        opts: ["לְכַתְּחִלָּה", "בְּדִיעֲבַד", "דַּוְקָא", "כִּבְיָכוֹל"],
        ans: 0,
        note: "לְכַתְּחִלָּה — from the outset (editorial sentence in the corpus).",
      },
      {
        h: "___ הַמְּצַב כְּבָר שׁוֹנֶה — צָרִיךְ פִּתְרוֹן אַחֵר",
        cue: "After the fact the situation is already different…",
        opts: ["בְּדִיעֲבַד", "לְכַתְּחִלָּה", "דַּוְקָא", "כִּבְיָכוֹל"],
        ans: 0,
        note: "בְּדִיעֲבַד — retrospectively / ex post (same op-ed passage).",
      },
      {
        h: "___ בִּזְמַן שֶׁל בָּלַגָן צִבּוּרִי צָרִיךְ לְהַעֲמִיק",
        cue: "Specifically / precisely in times of public disorder one must go deeper",
        opts: ["דַּוְקָא", "לְכַתְּחִלָּה", "בְּדִיעֲבַד", "כִּבְיָכוֹל"],
        ans: 0,
        note: "דַּוְקָא — ‘of all moments’ / ironically precisely (corpus gloss + editorial line).",
      },
      {
        h: "___ אֵין לְנַסֵּחַ הֶסְכֵּם עַל כָּל פֵּרוּשׁ הִיסְטוֹרִי",
        cue: "As it were / so to speak one cannot draft an agreement on every historical reading",
        opts: ["כִּבְיָכוֹל", "דַּוְקָא", "לְכַתְּחִלָּה", "בְּדִיעֲבַד"],
        ans: 0,
        note: "כִּבְיָכוֹל — hedge / ‘as it were’ (academic conference passage).",
      },
    ],
  },
  {
    id: "g23",
    topic: "Talmudic & academic argument — קַל וָחֹמֶר, טְעָנָה, כְּדַי, מַה שָּׁוֶה",
    prompt:
      "Classic argument labels from the Level 4 bridge texts: a fortiori reasoning, claims, and evaluative ‘worth / equivalent’ frames (shared by Talmud class and op-ed Hebrew).",
    items: [
      {
        h: "___ שֶׁאִם יֵשׁ לִתְעֵד אֵירוּעַ קָטָן, צָרִיךְ גַּם תַּהֲלִיךְ רָחָב",
        cue: "A fortiori: if a small event must be documented, so must a broad process",
        opts: ["קַל וָחֹמֶר", "אַף עַל פִּי שֶׁ", "כְּדֵי שֶׁ", "מִשּׁוּם כָּךְ"],
        ans: 0,
        note: "קַל וָחֹמֶר — a fortiori (corpus note + conference passage).",
      },
      {
        h: "מְרַצָּה אַחַת ___ שֶׁקַל וָחֹמֶר…",
        cue: "One lecturer ___ that a fortiori…",
        opts: ["טָעֲנָה", "סִכְּמָה", "הִתְנַצְּלָה", "הִתְעַלְּמָה"],
        ans: 0,
        note: "טָעֲנָה — argued / claimed (verb form in the long academic paragraph).",
      },
      {
        h: "___ לְהַעֲמִיק בַּוִּכּוּחַ מִשּׁוּם שֶׁרַק כָּךְ…",
        cue: "It is worthwhile to deepen the debate because only thus…",
        opts: ["כְּדַי", "דַּוְקָא", "אוּלַי", "רַק"],
        ans: 0,
        note: "כְּדַי — worth / advisable (closing sentence of the conference text).",
      },
      {
        h: "לְהָבִין מַה ___ לְשַׁמֵּר וּמַה צָרִיךְ לְתַקֵּן",
        cue: "To understand what is worth preserving and what must be fixed",
        opts: ["שָׁוֶה", "חָשׁוּב", "נָכוֹן", "פָּשׁוּט"],
        ans: 0,
        note: "מַה שָּׁוֶה לְשַׁמֵּר — fixed collocation in the corpus summary line.",
      },
    ],
  },
  {
    id: "g24",
    topic: "Torah–Talmud study frame — מִשְׁנָה, תַּלְמוּד, הֲלָכָה, בִּנְיָן",
    prompt:
      "Labels for Jewish text study (Torah class and beit midrash passages): canon layers, genres, and tools of interpretation.",
    items: [
      {
        h: "בַּשִּׁעוּר קָרְאוּ מִ-___ קְצָרָה וְאַחַר כָּךְ פֵּרוּשׁ שֶׁל רַשִּׁי",
        cue: "In class they read a short ___ then Rashi’s commentary",
        opts: ["מִשְׁנָה", "כּוֹתֶרֶת", "מַאֲמָר", "שַׁדְרָן"],
        ans: 0,
        note: "מִשְׁנָה — codified oral law layer (Torah-study story in the corpus).",
      },
      {
        h: "קָרְאוּ קָטַע מִן הַ___ בְּבֵית הַמִּדְרָשׁ",
        cue: "They read a passage from the ___ in the beit midrash",
        opts: ["תַּלְמוּד", "עִתּוֹן", "מַאֲמָר", "כְּתָבָה"],
        ans: 0,
        note: "תַּלְמוּד — gemara layer of discussion (midrash room passage).",
      },
      {
        h: "דִּבְּרוּ אֵיךְ ___ וְאַגָּדָה נִפְגָּשׁוֹת בְּאוֹתוֹ מָקוֹם",
        cue: "They discussed how ___ and narrative meet in the same place",
        opts: ["הֲלָכָה", "כּוֹתֶרֶת", "כְּתָבָה", "שַׁדְרָן"],
        ans: 0,
        note: "הֲלָכָה וְאַגָּדָה — legal vs narrative strands (Talmud paragraph).",
      },
      {
        h: "כְּדֵי לְפָרֵשׁ אֶת הַמִּלָּה צָרִיךְ שֹׁרֶשׁ וְגַם ___",
        cue: "To explain the word you need the root and also the ___",
        opts: ["בִּנְיָן", "כּוֹתֶרֶת", "עוֹרֵךְ", "שַׁדְרָן"],
        ans: 0,
        note: "בִּנְיָן — verbal pattern / binyan (same bridge paragraph on roots).",
      },
    ],
  },
  {
    id: "g25",
    topic: "Normative & deontic Hebrew — מֻתָּר, אָסוּר, חַיָּב, מִן הָרָאוּי",
    prompt:
      "Permission, obligation, and appropriateness — common in halacha talk, public signage, and formal instructions (Ulpan Gimmel+ function words).",
    items: [
      {
        h: "כָּאן ___ לְהַדְלִיק נֵרוֹת",
        cue: "Here it is permitted to light candles",
        opts: ["מֻתָּר", "אָסוּר", "חַיָּב", "אִי אֶפְשָׁר"],
        ans: 0,
        note: "מֻתָּר — permitted (L1 halachic-adjacent row).",
      },
      {
        h: "פֹּה ___ לְהַכְנִיס מָזוֹן",
        cue: "It is forbidden to bring in food here",
        opts: ["אָסוּר", "מֻתָּר", "חַיָּב", "רָשׁוּת"],
        ans: 0,
        note: "אָסוּר — forbidden; pairs with מֻתָּר in the phrasebook.",
      },
      {
        h: "אַתָּה ___ לְהַגִּישׁ אֶת הַטּוֹפֶס עַד סוֹף הַשָּׁבוּעַ",
        cue: "You must submit the form by end of week",
        opts: ["חַיָּב", "מֻתָּר", "אָסוּר", "אוּלַי"],
        ans: 0,
        note: "חַיָּב — obligated / must (also ‘guilty’ in legal Hebrew).",
      },
      {
        h: "___ לְהַתְחִיל בִּשְׁאֵלַת שִׁפּוּט",
        cue: "It is appropriate to begin with a clarifying question",
        opts: ["מִן הָרָאוּי", "אָסוּר", "חַיָּב", "דַּוְקָא"],
        ans: 0,
        note: "מִן הָרָאוּי — it is fitting / appropriate (L2 row).",
      },
    ],
  },
  {
    id: "g26",
    topic: "Editorial action verbs — allocate, document, formulate, expand",
    prompt:
      "Dense infinitive chains from modern op-ed Hebrew (Level 4 ‘Bridge — Formulation’ list): policy verbs newspapers use in argument.",
    items: [
      {
        h: "הָעוֹרֵךְ נִסָּה לְ___ עֶמְדָה מְאֻזֶּנֶת",
        cue: "The editor tried to formulate a balanced position",
        opts: ["לְנַסֵּחַ", "לַעֲצֹר", "לִשְׁתּוֹת", "לִישׁוֹן"],
        ans: 0,
        note: "לְנַסֵּחַ — to draft / formulate (same root as נוסח; editorial verb).",
      },
      {
        h: "יֵשׁ לְ___ מַשְׁאָבִים לְחִינּוּךְ",
        cue: "One should allocate resources to education",
        opts: ["לְהַקְצוֹת", "לְהַקְשִׁיב", "לְהַמְשִׁיךְ", "לְהַגִּיב"],
        ans: 0,
        note: "לְהַקְצוֹת — to allocate (policy paragraph).",
      },
      {
        h: "חָשׁוּב לְ___ אֶת תּוֹצְאוֹת הַמְּדִינִיּוּת",
        cue: "Important to document the outcomes of the policy",
        opts: ["לְתַעֵד", "לְנַסֵּחַ", "לְהַקְצוֹת", "לַעֲצֹר"],
        ans: 0,
        note: "לְתַעֵד — to document (journalistic–academic register).",
      },
      {
        h: "וְרַק אַחַר כָּךְ לְ___ אֶת הַתּוֹכְנִית",
        cue: "And only afterward to expand the programme",
        opts: ["לְהַרְחִיב", "לְהַקְצוֹת", "לְתַעֵד", "לְנַסֵּחַ"],
        ans: 0,
        note: "לְהַרְחִיב — to broaden / expand (paired chain in the op-ed).",
      },
    ],
  },
  {
    id: "g27",
    topic: "Academic discourse — researchers, debate, hedging",
    prompt:
      "Metalanguage from the academic-conference Hebrew passage: who speaks, how they hedge, and what they argue about.",
    items: [
      {
        h: "מְרַצֶּה אַחֵר בִּיקֵּשׁ לְ___",
        cue: "Another speaker asked to reserve judgment / hedge",
        opts: ["לְהִסְתַּיֵּג", "לְהַעֲמִיק", "לְהַקְצוֹת", "לְהַגִּיב"],
        ans: 0,
        note: "לְהִסְתַּיֵּג — to qualify / distance oneself rhetorically (L4).",
      },
      {
        h: "___ דִּבְּרוּ עַל הַקֶּשֶׁר בֵּין חֻרְבָּן וּתְחִיָּה",
        cue: "___ spoke on the link between destruction and revival",
        opts: ["חוֹקְרִים", "עוֹרְכִים", "שַׁדְרָנִים", "כַּתָּבִים"],
        ans: 0,
        note: "חוֹקְרִים — researchers (opening of the academic paragraph).",
      },
      {
        h: "כְּדַי לְהַעֲמִיק בַּ___ הַצִּבּוּרִי",
        cue: "Worth deepening the public ___",
        opts: ["וִכּוּחַ", "כּוֹתֶרֶת", "מַאֲמָר", "כְּתָבָה"],
        ans: 0,
        note: "וִכּוּחַ — debate / dispute (same closing sentence).",
      },
      {
        h: "בְּכֻנְסִיָּה ___ דִּבְּרוּ עַל צִיּוֹנוּת",
        cue: "At an ___ conference they spoke about Zionism",
        opts: ["אֲקָדֶמִית", "צִבּוּרִית", "דְּחוּיָה", "זָרָה"],
        ans: 0,
        note: "אֲקָדֶמִית — academic (f.; modifies כֻנְסִיָּה in the corpus).",
      },
    ],
  },
  {
    id: "g28",
    topic: "Text-study fluency — תִקּוּן עוֹלָם, רַשִּׁי, roots in context",
    prompt:
      "Pull-together items from the beit midrash narrative: ethical-theological collocations and interpretive metalanguage (bridge toward fluent textual Hebrew).",
    items: [
      {
        h: "לִמּוּד כָּזֶה יָכוֹל לְהָבִיא לְ___ עוֹלָם קָטָן",
        cue: "Such learning can bring a small repairing of the world",
        opts: ["תִקּוּן", "תִקְוָה", "תִשׁוּבָה", "תַּכְלִית"],
        ans: 0,
        note: "תִקּוּן עוֹלָם — fixed Mishnaic–modern value phrase in the Talmud paragraph.",
      },
      {
        h: "הַפֵּרוּשׁ שֶׁל ___ עוֹזֵר לִרְאוֹת אֵיךְ הֲלָכָה וְאַגָּדָה נִפְגָּשׁוֹת",
        cue: "___’s commentary helps see how halacha and aggadah meet",
        opts: ["רַשִּׁי", "הָעוֹרֵךְ", "הַשַּׁדְרָן", "הַכַּתָּב"],
        ans: 0,
        note: "רַשִּׁי — Rashi; anchor teacher in the Torah-class story.",
      },
      {
        h: "צָרִיךְ לְהָבִין אֶת הַשֹּׁרֶשׁ וְגַם אֶת הַ___",
        cue: "One must understand the root and also the ___",
        opts: ["בִּנְיָן", "כּוֹתֶרֶת", "מַאֲמָר", "שַׁדְרָן"],
        ans: 0,
        note: "שֹׁרֶשׁ + בִּנְיָן — grammar metalanguage inside the Talmud reading.",
      },
      {
        h: "תְּשׁוּבָה אֵינֶנָּה רַק תְּשׁוּבָה לִשְׁאֵלָה, אֶלָּא גַּם ___ לַדֶּרֶךְ",
        cue: "Repentance is not only an answer to a question, but also a return to the path",
        opts: ["חֲזָרָה", "כּוֹתֶרֶת", "מַאֲמָר", "וִכּוּחַ"],
        ans: 0,
        note: "חֲזָרָה לַדֶּרֶךְ — spiritual ‘return’ frame in the Torah-lesson closing.",
      },
    ],
  },
] as const satisfies readonly GrammarDrillTopic[];

export function getGrammarDrillTopicById(
  id: string,
): GrammarDrillTopic | undefined {
  return GRAMMAR_DRILLS.find((t) => t.id === id);
}
