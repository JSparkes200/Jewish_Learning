/**
 * External Hebrew NLP / treebank references used as a “cheat sheet” for
 * pedagogy, QA expectations, and optional CI checks.
 *
 * Nothing in this file calls the network at import time.
 */

/** IAHLT Universal Dependencies Hebrew treebank (newspaper + wiki tracks). */
export const IAHLT_UD_HEBREW = {
  name: "IAHLT UD Hebrew",
  repo: "https://github.com/IAHLT/UD_Hebrew",
  wikiTrack: "https://github.com/UniversalDependencies/UD_Hebrew-IAHLTwiki",
  org: "https://github.com/IAHLT",
  /** Typical use: dependency labels (nsubj, obj, obl, mark, case, …) and morph features. */
  role:
    "Gold-standard dependency morphology for verifying that drill sentences are structurally plausible.",
} as const;

export const LANGUAGETOOL_HEBREW = {
  name: "LanguageTool (Hebrew)",
  publicApi: "https://api.languagetool.org/v2/check",
  docs: "https://dev.languagetool.org/public-http-api",
  /** LT builds vary; `he` is the usual language code for Hebrew in HTTP checks. */
  languageCode: "he",
  role:
    "Orthography / grammar hints for undotted or partially dotted text; rate-limited public API.",
} as const;

export const YAP_HEBREW_PARSER = {
  name: "YAP (Yet Another Parser)",
  repos: [
    "https://github.com/OnlpLab/yap",
    "https://github.com/habeanf/yap",
  ],
  npmClient: "https://www.npmjs.com/package/@nnlp-il/yap-js-client",
  role:
    "Joint morphological disambiguation + dependency parsing for Hebrew; expects a running YAP server for API use.",
} as const;

export const NAKDIMON = {
  name: "Nakdimon",
  repo: "https://github.com/elazarg/nakdimon",
  demo: "https://nakdimon.org/",
  role:
    "Neural Hebrew niqqud restoration; useful to compare dotted teaching forms against model output (Python / CLI).",
} as const;

export const SEFARIA_REFERENCE = {
  name: "Sefaria",
  site: "https://www.sefaria.org",
  developers: "https://developers.sefaria.org/",
  role:
    "Parallel Hebrew–English primary texts for register, biblical/rabbinic grammar, and vocabulary inspiration.",
} as const;

/**
 * Pedagogical map aligned with the app’s `g1`… grammar ids (not CEFR official).
 *
 * - **Beginner (roughly Novice High / A1–A2):** core agreement, article, possession, simple tense.
 * - **Intermediate (roughly Intermediate Mid / B1):** richer tense system, compounds, subordination,
 *   plural agreement, direct-object marking, time frame, frequent binyan patterns in the phrasebook.
 * - **Bridge to advanced (`g16`–`g20`):** Pi'el / Hif'il / Nif'al contrasts, formal cause–purpose
 *   connectors, and concession / editorial discourse — aligns with Level 4 “bridge” vocabulary in the
 *   legacy course and prepares for full advanced register.
 * - **Advanced / fluent (`g21`–`g28`):** Israeli press and broadcast collocations; halachic–journalistic
 *   adverbs (לְכַתְּחִלָּה / בְּדִיעֲבַד / דַּוְקָא / כִּבְיָכוֹל); Talmudic–academic argument
 *   metalanguage; Torah–Talmud study labels; deontic modals; editorial policy verbs; academic hedging;
 *   beit midrash fluency — mirrors Dalet+ / university Ulpan “special topics” plus newspaper register
 *   (IAHLT newspaper track) and rabbinic-text classroom Hebrew.
 * - **Beyond the ladder:** speed, long hypotaxis, domain breadth (law, diplomacy, full gemara aramaic
 *   track) — not yet separate drill bands in the app.
 *
 * Completing **~12–18 grammar topic units** plus **~1,500–2,500 active lemmas** in multiple contexts
 * is a common ballpark for a solid **intermediate** foundation in university / ulpan syllabi; advanced
 * work typically adds breadth (domains), speed, and production under constraint rather than only more
 * discrete “topics”.
 */
export const HEBREW_APP_GRAMMAR_CURRICULUM = {
  beginnerGrammarIds: ["g1", "g2", "g3", "g4", "g5"] as const,
  intermediateGrammarIds: [
    "g6",
    "g7",
    "g8",
    "g9",
    "g10",
    "g11",
    "g12",
    "g13",
    "g14",
    "g15",
  ] as const,
  /** Advanced-intermediate bridge (binyan + formal connectors + argument Hebrew). */
  bridgeToAdvancedGrammarIds: [
    "g16",
    "g17",
    "g18",
    "g19",
    "g20",
  ] as const,
  /** Press, halachic–journalistic nuance, text study, deontics, editorial & academic metalanguage. */
  advancedFluentGrammarIds: [
    "g21",
    "g22",
    "g23",
    "g24",
    "g25",
    "g26",
    "g27",
    "g28",
  ] as const,
} as const;

export type HebrewGrammarDrillId =
  | (typeof HEBREW_APP_GRAMMAR_CURRICULUM.beginnerGrammarIds)[number]
  | (typeof HEBREW_APP_GRAMMAR_CURRICULUM.intermediateGrammarIds)[number]
  | (typeof HEBREW_APP_GRAMMAR_CURRICULUM.bridgeToAdvancedGrammarIds)[number]
  | (typeof HEBREW_APP_GRAMMAR_CURRICULUM.advancedFluentGrammarIds)[number];
