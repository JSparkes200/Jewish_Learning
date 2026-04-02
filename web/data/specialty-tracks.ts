/**
 * Post-bridge specialty tracks: domain “badges” with Bronze → Silver → Gold depth.
 *
 * **Vocab / content reality:** `web/data/corpus-d.ts` has large breadth (lemma `l`
 * tags 1–4+), but **domain-tuned reading lines and MCQ banks are the bottleneck**,
 * not raw dictionary count. These packs ship **small authored drills**; expand by
 * adding items in `specialty-tier-packs*.ts` or wiring passages from `/reading`
 * + comprehension later.
 *
 * **Unlock:** {@link getBridgeModulePassed} must be true (bridge final passed).
 * **Tier order:** bronze → silver → gold per track (sequential).
 * **Lengths:** Bronze 8, Silver 15, Gold 25 MCQs (see `specialty-tier-packs.ts` + `specialty-tier-packs-traditional.ts`).
 *
 * **Trial `badgeId`:** {@link TRIAL_ADVANCED_BADGE_TRACK_IDS} lists stable ids for
 * local trial lock-in (`hebrew_trial_session_v1`); use a track `id`, not `id:tier`.
 */

export const SPECIALTY_TIER_IDS = ["bronze", "silver", "gold"] as const;
export type SpecialtyTierId = (typeof SPECIALTY_TIER_IDS)[number];

/**
 * Pass targets scale with tier length (8 / 15 / 25 items in packs).
 */
export const SPECIALTY_PASS_PCT: Record<SpecialtyTierId, number> = {
  bronze: 6 / 8,
  silver: 13 / 15,
  gold: 23 / 25,
};

/** Modern Israeli Hebrew domains vs rabbinic / JBA text literacy. */
export type SpecialtyTrackGroup = "modern_hebrew" | "traditional_texts";

export type SpecialtyPracticeLink = {
  label: string;
  href: string;
};

export type SpecialtyTrackMeta = {
  id: string;
  title: string;
  /** Short English blurb for the hub card. */
  blurb: string;
  /** Hebrew keyword aligned with bridge unit 4 copy. */
  domainHe: string;
  /** Pedagogical focus for authors. */
  focus: string;
  group: SpecialtyTrackGroup;
  /** What learners can expect to move toward (MCQs + suggested breadth work). */
  outcomes: readonly string[];
  /** Hubs that reinforce the same skills outside the tier packs. */
  practiceLinks: readonly SpecialtyPracticeLink[];
  /** Aligns with pack intros: breadth → register → density. */
  tierGoals: Record<SpecialtyTierId, string>;
};

function tierGoals(
  bronze: string,
  silver: string,
  gold: string,
): Record<SpecialtyTierId, string> {
  return { bronze, silver, gold };
}

export const SPECIALTY_TRACKS: readonly SpecialtyTrackMeta[] = [
  {
    id: "news",
    title: "News & journalism",
    blurb: "Headlines, reports, and journalistic register (עִתּוֹנוּת).",
    domainHe: "עִתּוֹנוּת",
    focus: "Scanning, bylines, neutral vs opinion framing.",
    group: "modern_hebrew",
    outcomes: [
      "Recognize how headlines, leads, and jump lines organize a story.",
      "Separate neutral reporting cues from commentary and op-ed register.",
      "Follow bylines, updates, and spokesperson language in real articles.",
      "Notice framing and loaded wording when you read Israeli press (any level).",
    ],
    practiceLinks: [
      { label: "Reading hub", href: "/reading" },
      { label: "Study — daily session", href: "/study#daily-session" },
      { label: "Library — saved clips", href: "/library" },
    ],
    tierGoals: tierGoals(
      "Core newsroom vocabulary: headlines, reports, updates, bylines.",
      "Neutral reporting vs opinion: sources, editorial notes, investigative register.",
      "Press argumentation: framing, bias vocabulary, how claims steer the reader.",
    ),
  },
  {
    id: "literature",
    title: "Literature",
    blurb: "Narrative voice, imagery, and literary Hebrew (סִפְרוּת).",
    domainHe: "סִפְרוּת",
    focus: "Tone, character, figurative language — not press summaries.",
    group: "modern_hebrew",
    outcomes: [
      "Name narrative stance, imagery, and figurative moves in prose and poetry.",
      "Track tone shifts and register (spoken vs literary) within a passage.",
      "Spot intertextuality and unreliable narration where the Hebrew signals it.",
      "Connect tier drills to longer reads on Reading and in Library saves.",
    ],
    practiceLinks: [
      { label: "Reading — stories & passages", href: "/reading" },
      { label: "Library", href: "/library" },
    ],
    tierGoals: tierGoals(
      "Basics of literary lexicon: genre words, metaphor, rhythm, dialogue tags.",
      "Voice and rhetoric: focalization, irony, declamatory and poetic tone.",
      "Advanced craft: unreliable narration, twists, register shifts, intertextuality.",
    ),
  },
  {
    id: "spoken",
    title: "Goal-oriented speech",
    blurb: "Colloquial strategies for real situations (דִּבּוּר מֻכְוָּן).",
    domainHe: "דִּבּוּר מֻכְוָּן",
    focus: "Interviews, planning, hedging, turn-taking — spoken pragmatics.",
    group: "modern_hebrew",
    outcomes: [
      "Handle interviews and follow-ups: pacing, clarification, face-saving.",
      "Use hedges, planners, and turn-taking chunks in realistic dialogue.",
      "Bridge colloquial chunks with listening reps (numbers, stories, audio).",
      "Reinforce production judgment via Study fill-in and correct-sentence modes.",
    ],
    practiceLinks: [
      { label: "Numbers — listen", href: "/numbers#listen" },
      { label: "Study — practice games", href: "/study#study-practice-games" },
      { label: "Reading (audio where available)", href: "/reading" },
    ],
    tierGoals: tierGoals(
      "Everyday speech acts: planning, agreeing, softening, checking understanding.",
      "Thicker dialogue: interviews, hedging, routines, pragmatic politeness.",
      "Formal speech under pressure: follow-ups, disagreement, saving face.",
    ),
  },
  {
    id: "talmudic",
    title: "Talmudic / rabbinic Hebrew",
    blurb:
      "Mishnah–Talmud register: lemmas, argument, and citation habits (לָשׁוֹן הַתַּלְמוּד).",
    domainHe: "לָשׁוֹן הַתַּלְמוּד",
    focus: "תנא/אמורא, stam, proof textures — not spoken street Hebrew.",
    group: "traditional_texts",
    outcomes: [
      "Orient in Mishnah vs Gemara layers and anonymous (stam) voice.",
      "Follow objections, resolutions, and proof questions (מנלן / מניין).",
      "Recognize baraita, dispute labels, and structural vocabulary in sugyot.",
      "Pair drills with real folio reading (e.g. Sefaria) when you are ready.",
    ],
    practiceLinks: [
      { label: "Reading hub", href: "/reading" },
      { label: "Library — text links", href: "/library" },
      { label: "Word roots", href: "/roots" },
    ],
    tierGoals: tierGoals(
      "Corpus and voices: Tanna / Amora, Mishnah, Gemara, sugya, stam.",
      "Proof texture: baraita, מנלן, מניין, tannaitic disputes, resolutions.",
      "Deeper argument machinery: lemmas for derivation, analogy, and debate moves.",
    ),
  },
  {
    id: "aramaic",
    title: "Jewish Babylonian Aramaic",
    blurb: "Core lemmas and frames in the Talmud’s Aramaic stratum (אֲרָמִית).",
    domainHe: "אֲרָמִית בַּבְלִית",
    focus: "High-frequency particles, questions, and connectives in sugya text.",
    group: "traditional_texts",
    outcomes: [
      "Decode high-frequency JBA particles and question frames beside Hebrew drills.",
      "See how Aramaic glue words thread sugya argument (not biblical Aramaic only).",
      "Build tolerance for unvocalized lines alongside bridge-style reading.",
      "Cross-train with Talmudic Hebrew tier so register boundaries stay clear.",
    ],
    practiceLinks: [
      { label: "Specialty tracks hub", href: "/learn/tracks" },
      { label: "Reading", href: "/reading" },
      { label: "Library", href: "/library" },
    ],
    tierGoals: tierGoals(
      "Frames and particles: deictics, connectors, and routine sugya phrases.",
      "Question and proof patterns in Aramaic alongside Hebrew lemmas.",
      "Denser connective and rhetorical bundles at Gold depth.",
    ),
  },
];

/** Valid `TrialSession.badgeId` values (track id, not tier). */
export const TRIAL_ADVANCED_BADGE_TRACK_IDS: readonly string[] =
  SPECIALTY_TRACKS.map((t) => t.id);

export const SPECIALTY_TRACK_IDS: readonly string[] = SPECIALTY_TRACKS.map(
  (t) => t.id,
);

export function getSpecialtyTrackMeta(id: string): SpecialtyTrackMeta | undefined {
  return SPECIALTY_TRACKS.find((t) => t.id === id);
}

/** Stable storage key in {@link LearnProgressState.specialtyTierPassed}. */
export function specialtyTierStorageKey(
  trackId: string,
  tier: SpecialtyTierId,
): string {
  return `${trackId}:${tier}`;
}

export function parseSpecialtyTierKey(
  key: string,
): { trackId: string; tier: SpecialtyTierId } | null {
  const parts = key.split(":");
  if (parts.length !== 2) return null;
  const [trackId, tier] = parts;
  if (!SPECIALTY_TRACK_IDS.includes(trackId)) return null;
  if (!SPECIALTY_TIER_IDS.includes(tier as SpecialtyTierId)) return null;
  return { trackId, tier: tier as SpecialtyTierId };
}

export function isValidSpecialtyTierStorageKey(key: string): boolean {
  return parseSpecialtyTierKey(key) != null;
}

export function getSpecialtyPassMinCorrect(total: number, tier: SpecialtyTierId): number {
  if (total <= 0) return 0;
  return Math.ceil(SPECIALTY_PASS_PCT[tier] * total - 1e-9);
}

/** Pack id convention in {@link getSpecialtyTierMcqPack} — `specialty-tier-packs.ts`. */
export function specialtyTierPackId(
  trackId: string,
  tier: SpecialtyTierId,
): string {
  return `${trackId}-${tier}`;
}
