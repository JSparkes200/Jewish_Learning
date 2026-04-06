/**
 * Frozen fixtures for g16–g20 (bridge toward advanced / Level 4 register).
 */

import type { GrammarDrillTopic } from "@/data/grammar-drills";

export const EXPECTED_GRAMMAR_G16_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G17_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G18_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G19_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};

export const EXPECTED_GRAMMAR_G20_LEGACY_ALIGNED: GrammarDrillTopic = {
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
};
