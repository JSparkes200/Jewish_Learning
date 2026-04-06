/**
 * Frozen fixtures for g12–g15 — Vitest compares {@link GRAMMAR_DRILLS} to these objects.
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G12_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G13_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G14_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G15_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};
