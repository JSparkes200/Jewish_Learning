/**
 * Data shapes for the Hebrew Word Card system (see docs/hebrew-word-card-system.md).
 * Use level-appropriate types in curriculum code; widen at boundaries with
 * HebrewWordCardContent if one API serves all levels.
 */

/** Curriculum band — drives which UI blocks render, not auth. */
export type HebrewWordCardLevel = "beginner" | "intermediate" | "advanced";

/** Lexical unit shape for layout (phrases need multi-line RTL). */
export type HebrewWordCardKind =
  | "lemma"
  | "phrase"
  | "idiom"
  | "collocation";

/** One bilingual example line pair. */
export type HebrewWordCardExample = {
  he: string;
  en: string;
  /** Optional audio URL or TTS key; implementation-specific. */
  audioSrc?: string;
};

// --- Beginner: minimal fields, easy authoring ---

export type HebrewWordCardBeginner = {
  level: "beginner";
  kind?: HebrewWordCardKind;
  /** Headword or phrase in Hebrew (may include nikkud). */
  he: string;
  /** Latin transliteration; optional for advanced native readers later. */
  transliteration?: string;
  /** Primary English gloss or short definition. */
  meaningEn: string;
  /** Short examples only; omit or empty for flash-style. */
  examples?: HebrewWordCardExample[];
  /**
   * Optional 1–3 sentences for “Rabbi” without full structured analysis.
   * Prefer moving to `rabbi` when you outgrow this.
   */
  rabbiShort?: string[];
};

// --- Intermediate: structured Rabbi + light morphology ---

export type HebrewWordCardRootHint = {
  /** e.g. שׁ־ל־ם */
  letters?: string;
  /** Brief gloss of root sense */
  glossEn?: string;
  /** Related binyanim or patterns, plain language */
  patternNote?: string;
};

export type HebrewWordCardRabbiIntermediate = {
  /** Intro paragraph(s); warm tone per docs/ui-tone.txt */
  intro?: string[];
  examples: HebrewWordCardExample[];
  /** Root / word-family note; omit when distracting for this lemma */
  root?: HebrewWordCardRootHint;
  /** Short bullets, e.g. “construct state”, “irregular plural” */
  grammarNotes?: string[];
  /** Register: spoken / formal / biblical / etc. */
  register?: string;
};

export type HebrewWordCardIntermediate = {
  level: "intermediate";
  kind?: HebrewWordCardKind;
  he: string;
  transliteration: string;
  meaningEn: string;
  /** Optional secondary glosses or disambiguation */
  meaningAltEn?: string[];
  rabbi: HebrewWordCardRabbiIntermediate;
};

// --- Advanced: morphology, shoresh, nuance layers ---

export type HebrewWordCardMorphology = {
  /** e.g. noun, verb, participle */
  category?: string;
  /** e.g. gender, number, person, tense */
  features?: string[];
  /** Free-form for patterns not covered above */
  detail?: string;
};

export type HebrewWordCardShoresh = {
  /** Consonantal root as typically taught, e.g. כּ־ת־ב */
  letters: string;
  /** Pealim / dictionary style identifier if you use one */
  pealimId?: string;
  /** Core meaning in English */
  glossEn: string;
  /** Common binyanim for this root in classroom Hebrew */
  binyanimExamples?: string[];
};

export type HebrewWordCardDenotation = {
  label?: string;
  definitionEn: string;
};

export type HebrewWordCardNuance = {
  /** Contrast with near-synonym or wrong English guess */
  contrast?: string;
  explanationEn: string;
};

export type HebrewWordCardRabbiAdvanced = HebrewWordCardRabbiIntermediate & {
  morphology?: HebrewWordCardMorphology;
  shoresh?: HebrewWordCardShoresh;
  denotation?: HebrewWordCardDenotation;
  nuance?: HebrewWordCardNuance;
  /** Other English renderings with short usage notes */
  alternatives?: { en: string; note?: string }[];
  contextualUsage?: string[];
  /** Cross-links to lessons, Ulpan notes, etc. */
  furtherReading?: { label: string; href: string }[];
};

export type HebrewWordCardAdvanced = {
  level: "advanced";
  kind?: HebrewWordCardKind;
  he: string;
  transliteration: string;
  meaningEn: string;
  meaningAltEn?: string[];
  rabbi: HebrewWordCardRabbiAdvanced;
};

/** Union for APIs and generic card components. */
export type HebrewWordCardContent =
  | HebrewWordCardBeginner
  | HebrewWordCardIntermediate
  | HebrewWordCardAdvanced;

/** Optional envelope for decks, SRS, or CMS rows. */
export type HebrewWordCardEntry = {
  id: string;
  /** Stable slug for URLs */
  slug?: string;
  content: HebrewWordCardContent;
  /** ISO date or version for cache busting */
  updatedAt?: string;
  tags?: string[];
};
