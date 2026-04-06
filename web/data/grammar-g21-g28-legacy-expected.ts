/**
 * Frozen fixtures for g21–g28 (advanced / fluent register: press, halachic–journalistic
 * adverbs, argument metalanguage, text-study frame, deontics, editorial verbs, academic
 * discourse, beit midrash fluency).
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G21_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G22_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G23_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G24_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G25_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G26_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G27_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G28_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};
