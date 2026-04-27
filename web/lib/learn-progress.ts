import { getSectionsForLevel, type SectionMeta } from "@/data/course";
import { getMasteryWordListForLevel } from "@/data/course-mastery-words";
import { ALPHABET_LETTER_IDS } from "@/data/alphabet-letters";
import { BRIDGE_UNIT_IDS } from "@/data/bridge-course";
import {
  SPECIALTY_TIER_IDS,
  SPECIALTY_TRACK_IDS,
  type SpecialtyTierId,
  isValidSpecialtyTierStorageKey,
  specialtyTierStorageKey,
} from "@/data/specialty-tracks";
import { getDeveloperModeBypass } from "@/lib/developer-mode";
import type { AppSession } from "@/lib/app-session.model";
import { parseAppSessionField } from "@/lib/app-session.model";
import type {
  RootsCurriculumProgress,
  RootsGroupProgress,
} from "@/data/roots-curriculum";

export type { AppSession } from "@/lib/app-session.model";

export type { RootsCurriculumProgress, RootsGroupProgress } from "@/data/roots-curriculum";

/** Separate from legacy `ivrit_lr__*` until we unify auth + storage. */
export const LEARN_PROGRESS_KEY = "hebrew-web-course-v1";

/** Next-up FAB panel expanded state (see AppShell). */
export const NEXT_UP_EXPANDED_STORAGE_KEY = "hebrew-web-next-up-expanded";

/** Daily study streak (UTC calendar day), aligned with legacy `updateDailyStreak`. */
export type LearnStreak = {
  current: number;
  longest: number;
  /** ISO date `YYYY-MM-DD` of last streak-affecting activity */
  lastDay: string;
};

/** Pre-Aleph alphabet track (optional nudge; does not block the main path). */
export type AlphabetGateStatus =
  | "unseen"
  | "in_progress"
  | "passed"
  | "skipped";

/** Foundation exit exams — all three must pass to unlock the bridge. */
export type FoundationExitStrands = {
  reading: boolean;
  grammar: boolean;
  lexicon: boolean;
};

/** Foundation line resume anchor (`/learn/{1–4}/{sectionId}`). */
export type LastCoursePosition = {
  level: number;
  sectionId: string;
  /** `Date.now()` when the learner was last in this section or it became “next up”. */
  at: number;
};

export type LearnProgressState = {
  completedSections: Record<string, boolean>;
  /** Highest level user has marked active (1–4). */
  activeLevel: number;
  streak?: LearnStreak;
  /**
   * Lifetime totals: each MCQ or comprehension answer (first click per question).
   * Practice-only; not the same as legacy per-word `vocab` stats.
   */
  mcqAttempts?: number;
  mcqCorrect?: number;
  /**
   * Per-lemma mastery (legacy `learner.vocab[h].lv`). Merged from `ivrit_lr` import;
   * used with course word lists for `unlockMastered` when present.
   */
  vocabLevels?: Record<string, number>;
  /**
   * Graduated root drill hits per form (legacy `learner.rootDrill[rootKey][wordH]`).
   * Counts toward “solid” at ≥3 correct per lemma, same tiers as HTML.
   */
  rootDrill?: Record<string, Record<string, number>>;
  /** Alphabet intro; omitted = legacy user (treated as skipped by resolver). */
  alphabetGate?: AlphabetGateStatus;
  /** Per-letter trace practice completed (see {@link ALPHABET_LETTER_IDS}). */
  alphabetLettersTraced?: Record<string, boolean>;
  /** Alphabet final (trace + sound) completed; pairs with {@link alphabetGate} `passed`. */
  alphabetFinalExamPassed?: boolean;
  /** When all strands true, {@link isBridgeUnlocked} is true. */
  foundationExit?: FoundationExitStrands;
  /**
   * Bridge module end-check passed (separate from {@link isBridgeUnlocked}).
   * Unlocks first when foundation exit strands pass; this marks ~75% checkpoint done.
   */
  bridgeModulePassed?: boolean;
  /** Bridge study units marked complete (see {@link BRIDGE_UNIT_IDS}). */
  bridgeUnitsCompleted?: Record<string, boolean>;
  /**
   * Post-bridge specialty tier checkpoints passed (keys `trackId:tier`, see
   * {@link specialtyTierStorageKey}). Unlocks when foundation exit + bridge
   * pass ({@link isSpecialtyTracksUnlocked}).
   */
  specialtyTierPassed?: Record<string, boolean>;
  /**
   * Internal fluency balance metrics. Each graded drill pick can contribute to
   * one or more dimensions (recognition, production, grammar, etc.).
   */
  skillMetrics?: SkillMetrics;
  /**
   * Per-lemma skill stability, used for smarter review ordering.
   * Keys: Hebrew lemma -> skill -> attempts/correct + timestamp.
   */
  lemmaSkillMetrics?: LemmaSkillMetrics;
  /**
   * Reading hub carousel: passages opened here (`jt-0`, RD ids, library ids).
   * Jewish-text slots chain: `jt-k` unlocks after `jt-(k-1)` was opened.
   */
  readingCarouselRevealed?: Record<string, boolean>;
  /** Reading carousel: last time each passage was opened (recency sort). */
  readingPassageLastOpenedAt?: Record<string, number>;
  /** Reading hub: learner finished the passage quiz flow at least once. */
  readingPassageQuizComplete?: Record<string, boolean>;
  /** Numbers hub carousel: last opened hub tile (recency sort). */
  numbersCarouselLastOpenedAt?: Record<string, number>;
  /** Numbers hub: user has practised this drill at least once (clears “try it” dot). */
  numbersDrillEngaged?: Record<string, boolean>;
  /**
   * Lifetime count of graded drill answers (first click per question), aligned
   * with legacy `learner.total` in `hebrew-v8.2.html`.
   */
  lessonAnswerTotal?: number;
  /**
   * Per-mode correct/wrong tallies for Study-style games (legacy `learner.gt`).
   */
  studyGameStats?: Record<string, { correct: number; wrong: number }>;
  /**
   * Progressive roots hub: grouped intro → drill → test, plus block checkpoints.
   */
  rootsCurriculum?: RootsCurriculumProgress;
  /**
   * Last place in the main Alef–Dalet line for resume; see `touchLastCoursePosition`.
   */
  lastCoursePosition?: LastCoursePosition;
  /**
   * Cross-app navigation log + last resumable page (not auth/home-only); see
   * `lib/app-activity`.
   */
  appSession?: AppSession;
};

/** Foundation course map URL — add this query to skip auto-resume to the last section. */
export const LEARN_HUB_PATH = "/learn?hub=1" as const;

export type SkillMetricKey =
  | "recognition"
  | "production"
  | "grammar"
  | "definition"
  | "listening"
  | "comprehension";

export type SkillMetricStat = {
  attempts: number;
  correct: number;
};

export type SkillMetrics = Partial<Record<SkillMetricKey, SkillMetricStat>>;
export type LemmaSkillStat = SkillMetricStat & { lastSeen: number };
export type LemmaSkillMetrics = Record<
  string,
  Partial<Record<SkillMetricKey, LemmaSkillStat>>
>;

export const SKILL_METRIC_LABELS: Record<SkillMetricKey, string> = {
  recognition: "Recognition",
  production: "Production",
  grammar: "Grammar",
  definition: "Definition",
  listening: "Listening",
  comprehension: "Comprehension",
};

/** Legacy dashboard game rows (`rDash` / `mkL().gt` in `hebrew-v8.2.html`) + Next-only `sent`. */
export const DASHBOARD_GAME_IDS = [
  "mc",
  "fill",
  "tap",
  "match",
  "trans",
  "img",
  "num",
  "roots",
  "gram",
  "sent",
] as const;

export type DashboardGameId = (typeof DASHBOARD_GAME_IDS)[number];

const DASHBOARD_GAME_ID_SET = new Set<string>(DASHBOARD_GAME_IDS);

export const FLUENCY_TARGET_WORDS = 15_000;

/** Cap for `lessonAnswerTotal` (import merges / sanitization use the same). */
export const LESSON_ANSWER_TOTAL_CAP = 500_000;

export function countWordsMasteredForFluency(
  vocabLevels: Record<string, number> | undefined,
): number {
  return Object.values(vocabLevels ?? {}).filter((lv) => lv >= 3).length;
}

/** 0–100 for the legacy fluency bar (`fluencyPct` in HTML). */
export function fluencyBarPercent(
  vocabLevels: Record<string, number> | undefined,
): number {
  const mastered = countWordsMasteredForFluency(vocabLevels);
  return Math.min(100, (mastered / FLUENCY_TARGET_WORDS) * 100);
}

export function fluencyTierLabel(percent: number): string {
  if (percent < 1) return "Absolute beginner";
  if (percent < 5) return "Beginner";
  if (percent < 15) return "Elementary";
  if (percent < 30) return "Pre-intermediate";
  if (percent < 50) return "Intermediate";
  if (percent < 70) return "Upper-intermediate";
  if (percent < 85) return "Advanced";
  if (percent < 95) return "Proficient";
  return "Fluent";
}

export function dashboardGameShortLabel(id: string): string {
  switch (id) {
    case "mc":
      return "MC";
    case "fill":
      return "Fill";
    case "tap":
      return "Tap";
    case "match":
      return "Match";
    case "trans":
      return "Trans";
    case "img":
      return "Emoji";
    case "num":
      return "Nums";
    case "roots":
      return "Roots";
    case "gram":
      return "Gram";
    case "sent":
      return "Sent";
    default:
      return id;
  }
}

const defaultState: LearnProgressState = {
  completedSections: {},
  activeLevel: 1,
};

/**
 * Matches server-side {@link loadLearnProgress} when `window` is unavailable.
 * Use as `useState` initial value, then `loadLearnProgress()` in `useEffect`, to avoid hydration mismatches.
 */
export function createEmptyLearnProgressState(): LearnProgressState {
  return { completedSections: {}, activeLevel: 1 };
}

const defaultFoundationExit: FoundationExitStrands = {
  reading: false,
  grammar: false,
  lexicon: false,
};

export function parseAlphabetGate(
  raw: unknown,
): AlphabetGateStatus | undefined {
  if (
    raw === "unseen" ||
    raw === "in_progress" ||
    raw === "passed" ||
    raw === "skipped"
  ) {
    return raw;
  }
  return undefined;
}

export function parseFoundationExit(
  raw: unknown,
): FoundationExitStrands | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const out: FoundationExitStrands = { ...defaultFoundationExit };
  if (typeof o.reading === "boolean") out.reading = o.reading;
  if (typeof o.grammar === "boolean") out.grammar = o.grammar;
  if (typeof o.lexicon === "boolean") out.lexicon = o.lexicon;
  return out;
}

export function parseBridgeModulePassed(raw: unknown): boolean | undefined {
  if (raw === true) return true;
  if (raw === false) return false;
  return undefined;
}

export function parseBridgeUnitsCompleted(
  raw: unknown,
): Record<string, boolean> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const out: Record<string, boolean> = {};
  for (const id of BRIDGE_UNIT_IDS) {
    if (o[id] === true) out[id] = true;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

const MAX_PROGRESS_SIDE_MAP_KEYS = 96;

function parseStringBooleanMap(
  raw: unknown,
  maxKeys = MAX_PROGRESS_SIDE_MAP_KEYS,
): Record<string, boolean> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const out: Record<string, boolean> = {};
  let n = 0;
  for (const [k, v] of Object.entries(o)) {
    if (n >= maxKeys) break;
    if (typeof k !== "string" || k.length > 128) continue;
    if (v === true || v === 1 || v === "true") {
      out[k] = true;
      n++;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function parseStringNumberMap(
  raw: unknown,
  maxKeys = MAX_PROGRESS_SIDE_MAP_KEYS,
): Record<string, number> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const out: Record<string, number> = {};
  let n = 0;
  for (const [k, v] of Object.entries(o)) {
    if (n >= maxKeys) break;
    if (typeof k !== "string" || k.length > 128) continue;
    if (typeof v === "number" && Number.isFinite(v) && v >= 0 && v < 4e12) {
      out[k] = Math.floor(v);
      n++;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function parseReadingCarouselRevealed(
  raw: unknown,
): Record<string, boolean> | undefined {
  return parseStringBooleanMap(raw);
}

export function parseReadingPassageLastOpenedAt(
  raw: unknown,
): Record<string, number> | undefined {
  return parseStringNumberMap(raw);
}

export function parseReadingPassageQuizComplete(
  raw: unknown,
): Record<string, boolean> | undefined {
  return parseStringBooleanMap(raw);
}

export function parseNumbersCarouselLastOpenedAt(
  raw: unknown,
): Record<string, number> | undefined {
  return parseStringNumberMap(raw);
}

export function parseNumbersDrillEngaged(
  raw: unknown,
): Record<string, boolean> | undefined {
  return parseStringBooleanMap(raw);
}

export function parseSpecialtyTierPassed(
  raw: unknown,
): Record<string, boolean> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const out: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(o)) {
    if (v === true && isValidSpecialtyTierStorageKey(k)) out[k] = true;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function parseAlphabetLettersTraced(
  raw: unknown,
): Record<string, boolean> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const out: Record<string, boolean> = {};
  for (const id of ALPHABET_LETTER_IDS) {
    if (o[id] === true) out[id] = true;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function parseAlphabetFinalExamPassed(
  raw: unknown,
): boolean | undefined {
  if (raw === true) return true;
  return undefined;
}

/** Effective alphabet status: legacy installs with progress count as skipped. */
export function resolveAlphabetGateStatus(
  state: LearnProgressState,
): AlphabetGateStatus {
  const g = state.alphabetGate;
  if (
    g === "passed" ||
    g === "skipped" ||
    g === "in_progress" ||
    g === "unseen"
  ) {
    return g;
  }
  if (Object.keys(state.completedSections).length > 0) return "skipped";
  if ((state.mcqAttempts ?? 0) > 0) return "skipped";
  return "unseen";
}

export function getFoundationExitStrands(
  state: LearnProgressState,
): FoundationExitStrands {
  return {
    reading: state.foundationExit?.reading ?? false,
    grammar: state.foundationExit?.grammar ?? false,
    lexicon: state.foundationExit?.lexicon ?? false,
  };
}

/** Bridge module and post-foundation content require all exit strands. */
export function isBridgeUnlocked(state: LearnProgressState): boolean {
  if (getDeveloperModeBypass()) return true;
  const e = getFoundationExitStrands(state);
  return e.reading && e.grammar && e.lexicon;
}

export function getBridgeModulePassed(state: LearnProgressState): boolean {
  return state.bridgeModulePassed === true;
}

export function setBridgeModulePassed(
  state: LearnProgressState,
  passed: boolean,
): LearnProgressState {
  if (!passed) {
    const next = { ...state };
    delete next.bridgeModulePassed;
    delete next.bridgeUnitsCompleted;
    return next;
  }
  return { ...state, bridgeModulePassed: true };
}

/** For saves with `bridgeModulePassed` but no unit keys (older saves): treat units as done in UI. */
export function effectiveBridgeUnitsCompleted(
  state: LearnProgressState,
): Record<string, boolean> {
  const raw = state.bridgeUnitsCompleted ?? {};
  if (
    getBridgeModulePassed(state) &&
    Object.keys(raw).length === 0
  ) {
    return Object.fromEntries(BRIDGE_UNIT_IDS.map((id) => [id, true]));
  }
  return raw;
}

export function areAllBridgeUnitsComplete(state: LearnProgressState): boolean {
  const e = effectiveBridgeUnitsCompleted(state);
  return BRIDGE_UNIT_IDS.every((id) => !!e[id]);
}

/**
 * Specialty MCQ tiers require foundation exit (all three strands) and a passed
 * bridge final — same path as documented “Alef–Dalet → exit → bridge → badges.”
 */
export function isSpecialtyTracksUnlocked(
  state: LearnProgressState,
): boolean {
  if (getDeveloperModeBypass()) return true;
  return isBridgeUnlocked(state) && getBridgeModulePassed(state);
}

export function isSpecialtyTierRecordedPassed(
  state: LearnProgressState,
  trackId: string,
  tier: SpecialtyTierId,
): boolean {
  const key = specialtyTierStorageKey(trackId, tier);
  return state.specialtyTierPassed?.[key] === true;
}

/**
 * Whether the learner may open this tier’s drill (sequential: bronze → silver → gold).
 */
export function specialtyTierUnlockedForAttempt(
  state: LearnProgressState,
  trackId: string,
  tier: SpecialtyTierId,
): boolean {
  if (!SPECIALTY_TRACK_IDS.includes(trackId)) return false;
  if (getDeveloperModeBypass()) return true;
  if (!isSpecialtyTracksUnlocked(state)) return false;
  if (tier === "bronze") return true;
  if (tier === "silver") {
    return isSpecialtyTierRecordedPassed(state, trackId, "bronze");
  }
  return isSpecialtyTierRecordedPassed(state, trackId, "silver");
}

/**
 * First tier on this track that is unlocked and not yet passed (for deep links).
 */
export function getNextSpecialtyTierForTrack(
  state: LearnProgressState,
  trackId: string,
): { tier: SpecialtyTierId; href: string } | null {
  if (!SPECIALTY_TRACK_IDS.includes(trackId)) return null;
  if (!isSpecialtyTracksUnlocked(state)) return null;
  for (const tier of SPECIALTY_TIER_IDS) {
    if (!specialtyTierUnlockedForAttempt(state, trackId, tier)) break;
    if (!isSpecialtyTierRecordedPassed(state, trackId, tier)) {
      return {
        tier,
        href: `/learn/tracks/${encodeURIComponent(trackId)}/${encodeURIComponent(tier)}`,
      };
    }
  }
  return null;
}

export function setSpecialtyTierPassed(
  state: LearnProgressState,
  trackId: string,
  tier: SpecialtyTierId,
  passed: boolean,
): LearnProgressState {
  if (!SPECIALTY_TRACK_IDS.includes(trackId)) return state;
  const key = specialtyTierStorageKey(trackId, tier);
  const cur = { ...(state.specialtyTierPassed ?? {}) };
  if (passed) cur[key] = true;
  else delete cur[key];
  if (Object.keys(cur).length === 0) {
    const next = { ...state };
    delete next.specialtyTierPassed;
    return next;
  }
  return { ...state, specialtyTierPassed: cur };
}

export function mergeSpecialtyTierPassedMaps(
  a: LearnProgressState["specialtyTierPassed"],
  b: LearnProgressState["specialtyTierPassed"],
): Record<string, boolean> | undefined {
  if (!a && !b) return undefined;
  const out: Record<string, boolean> = {};
  for (const k of new Set([
    ...Object.keys(a ?? {}),
    ...Object.keys(b ?? {}),
  ])) {
    if ((a?.[k] || b?.[k]) === true && isValidSpecialtyTierStorageKey(k)) {
      out[k] = true;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Final checkpoint quiz: all units complete, or already passed (review). */
export function isBridgeFinalExamUnlocked(state: LearnProgressState): boolean {
  if (getDeveloperModeBypass()) return true;
  if (getBridgeModulePassed(state)) return true;
  return areAllBridgeUnitsComplete(state);
}

export function setBridgeUnitCompleted(
  state: LearnProgressState,
  unitId: string,
  completed: boolean,
): LearnProgressState {
  if (!BRIDGE_UNIT_IDS.includes(unitId)) return state;
  const cur = { ...(state.bridgeUnitsCompleted ?? {}) };
  if (completed) cur[unitId] = true;
  else delete cur[unitId];
  if (Object.keys(cur).length === 0) {
    const next = { ...state };
    delete next.bridgeUnitsCompleted;
    return next;
  }
  return { ...state, bridgeUnitsCompleted: cur };
}

/** Alef–Dalet: every subsection in levels 1–4 marked complete. */
export function isFoundationCourseComplete(
  state: LearnProgressState,
): boolean {
  if (getDeveloperModeBypass()) return true;
  return isFoundationCourseCompleteSections(state.completedSections);
}

export function isFoundationCourseCompleteSections(
  completedSections: Record<string, boolean>,
): boolean {
  return [1, 2, 3, 4].every((n) => {
    const secs = getSectionsForLevel(n);
    return secs.length > 0 && secs.every((s) => completedSections[s.id]);
  });
}

/** Subsections left before {@link isFoundationCourseComplete} is true. */
export function countIncompleteFoundationSections(
  completedSections: Record<string, boolean>,
): number {
  let left = 0;
  for (let level = 1; level <= 4; level++) {
    for (const s of getSectionsForLevel(level)) {
      if (!completedSections[s.id]) left++;
    }
  }
  return left;
}

export function setAlphabetGate(
  state: LearnProgressState,
  next: AlphabetGateStatus,
): LearnProgressState {
  return { ...state, alphabetGate: next };
}

export function setAlphabetLetterTraced(
  state: LearnProgressState,
  letterId: string,
  done: boolean,
): LearnProgressState {
  if (!ALPHABET_LETTER_IDS.includes(letterId)) return state;
  const cur = { ...(state.alphabetLettersTraced ?? {}) };
  if (done) cur[letterId] = true;
  else delete cur[letterId];
  if (Object.keys(cur).length === 0) {
    const next = { ...state };
    delete next.alphabetLettersTraced;
    return next;
  }
  return { ...state, alphabetLettersTraced: cur };
}

export function areAllAlphabetLettersTraced(state: LearnProgressState): boolean {
  const t = state.alphabetLettersTraced ?? {};
  return ALPHABET_LETTER_IDS.every((id) => !!t[id]);
}

/** Final exam passed: gate `passed`, all lesson letters marked, final flag set. */
export function completeAlphabetTrack(state: LearnProgressState): LearnProgressState {
  const allTraced: Record<string, boolean> = {};
  for (const id of ALPHABET_LETTER_IDS) {
    allTraced[id] = true;
  }
  return {
    ...state,
    alphabetGate: "passed",
    alphabetLettersTraced: allTraced,
    alphabetFinalExamPassed: true,
  };
}

export function setFoundationExitStrand(
  state: LearnProgressState,
  strand: keyof FoundationExitStrands,
  passed: boolean,
): LearnProgressState {
  const cur = getFoundationExitStrands(state);
  return {
    ...state,
    foundationExit: { ...cur, [strand]: passed },
  };
}

function alphabetRank(g: AlphabetGateStatus | undefined): number {
  if (g == null) return 0;
  switch (g) {
    case "unseen":
      return 1;
    case "in_progress":
      return 2;
    case "skipped":
      return 3;
    case "passed":
      return 4;
    default:
      return 0;
  }
}

/** Merge two saves: keep the alphabet gate that implies more progress. */
export function mergeAlphabetGatePreferProgress(
  a: AlphabetGateStatus | undefined,
  b: AlphabetGateStatus | undefined,
): AlphabetGateStatus | undefined {
  const ra = alphabetRank(a);
  const rb = alphabetRank(b);
  if (ra === 0 && rb === 0) return undefined;
  return ra >= rb ? a : b;
}

export function normalizeStreak(s: LearnStreak | undefined): LearnStreak {
  if (!s) return { current: 0, longest: 0, lastDay: "" };
  return {
    current:
      typeof s.current === "number" && s.current >= 0 ? Math.floor(s.current) : 0,
    longest:
      typeof s.longest === "number" && s.longest >= 0 ? Math.floor(s.longest) : 0,
    lastDay: typeof s.lastDay === "string" ? s.lastDay : "",
  };
}

export function parseStreakFromJson(x: unknown): LearnStreak | undefined {
  if (x == null || typeof x !== "object") return undefined;
  const o = x as Record<string, unknown>;
  const n = normalizeStreak({
    current: o.current as number,
    longest: o.longest as number,
    lastDay: o.lastDay as string,
  });
  if (n.longest === 0 && n.current === 0 && n.lastDay === "") return undefined;
  return n;
}

/**
 * Call on study activity (same calendar day is idempotent). Matches
 * `hebrew-v8.2.html` `updateDailyStreak` (UTC).
 */
export function touchDailyStreak(state: LearnProgressState): LearnProgressState {
  const day = new Date().toISOString().slice(0, 10);
  const streak = normalizeStreak(state.streak);
  /** Same UTC day — idempotent; keep prior state reference to avoid redundant saves. */
  if (streak.lastDay === day) return state;

  let current = 1;
  if (streak.lastDay) {
    const d = new Date(`${streak.lastDay}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    const nextDay = d.toISOString().slice(0, 10);
    if (nextDay === day) current = (streak.current || 0) + 1;
  }

  const nextStreak: LearnStreak = {
    current,
    longest: Math.max(current, streak.longest || 0),
    lastDay: day,
  };
  return { ...state, streak: nextStreak };
}

/** When importing legacy `ivrit_lr`, keep web streak if user already studied here. */
export function mergeStreakWithLegacy(
  web: LearnProgressState,
  legacyStreakUnknown: unknown,
): LearnStreak {
  const w = normalizeStreak(web.streak);
  const l = normalizeStreak(parseStreakFromJson(legacyStreakUnknown));
  const hasWeb = !!w.lastDay;
  return {
    longest: Math.max(w.longest, l.longest),
    current: hasWeb ? w.current : l.current,
    lastDay: hasWeb ? w.lastDay : l.lastDay,
  };
}

function parseNonNegInt(x: unknown): number | undefined {
  if (typeof x !== "number" || !Number.isFinite(x) || x < 0) return undefined;
  return Math.floor(x);
}

export function parseLessonAnswerTotalField(
  raw: unknown,
): number | undefined {
  const n = parseNonNegInt(raw);
  if (n == null || n === 0) return undefined;
  return Math.min(n, LESSON_ANSWER_TOTAL_CAP);
}

export function parseStudyGameStats(
  raw: unknown,
): Record<string, { correct: number; wrong: number }> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const out: Record<string, { correct: number; wrong: number }> = {};
  for (const id of DASHBOARD_GAME_IDS) {
    const v = o[id];
    if (!v || typeof v !== "object") continue;
    const rec = v as Record<string, unknown>;
    const c = parseNonNegInt(rec.correct);
    const w = parseNonNegInt(rec.wrong);
    if (c == null && w == null) continue;
    out[id] = {
      correct: Math.min(c ?? 0, 1_000_000),
      wrong: Math.min(w ?? 0, 1_000_000),
    };
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Normalize stored `vocabLevels` from JSON / backup. */
export function parseVocabLevelsField(
  v: unknown,
): Record<string, number> | undefined {
  if (!v || typeof v !== "object") return undefined;
  const m: Record<string, number> = {};
  for (const [k, val] of Object.entries(v)) {
    const key = k.trim();
    if (!key) continue;
    if (typeof val !== "number" || !Number.isFinite(val)) continue;
    m[key] = Math.min(10, Math.max(0, Math.floor(val)));
  }
  return Object.keys(m).length > 0 ? m : undefined;
}

/** Parse `rootDrill` from JSON / backup / import. */
export function parseRootDrillField(
  v: unknown,
): Record<string, Record<string, number>> | undefined {
  if (!v || typeof v !== "object") return undefined;
  const out: Record<string, Record<string, number>> = {};
  for (const [rootKey, inner] of Object.entries(v as Record<string, unknown>)) {
    const rk = rootKey.trim();
    if (!rk || !inner || typeof inner !== "object") continue;
    const innerMap: Record<string, number> = {};
    for (const [hk, cnt] of Object.entries(inner as Record<string, unknown>)) {
      const h = hk.trim();
      if (!h) continue;
      if (typeof cnt !== "number" || !Number.isFinite(cnt) || cnt < 0) continue;
      innerMap[h] = Math.min(99, Math.floor(cnt));
    }
    if (Object.keys(innerMap).length > 0) out[rk] = innerMap;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function parseSkillMetricStat(raw: unknown): SkillMetricStat | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const attemptsRaw = parseNonNegInt(o.attempts);
  const correctRaw = parseNonNegInt(o.correct);
  if (attemptsRaw == null || attemptsRaw <= 0) return null;
  const correct = Math.min(correctRaw ?? 0, attemptsRaw);
  return { attempts: attemptsRaw, correct };
}

function parseLemmaSkillStat(raw: unknown): LemmaSkillStat | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const base = parseSkillMetricStat(raw);
  if (!base) return null;
  const lastSeenRaw = typeof o.lastSeen === "number" ? o.lastSeen : 0;
  return {
    ...base,
    lastSeen: Number.isFinite(lastSeenRaw) && lastSeenRaw > 0 ? lastSeenRaw : 0,
  };
}

export function parseSkillMetricsField(v: unknown): SkillMetrics | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const out: SkillMetrics = {};
  const keys: SkillMetricKey[] = [
    "recognition",
    "production",
    "grammar",
    "definition",
    "listening",
    "comprehension",
  ];
  for (const k of keys) {
    const stat = parseSkillMetricStat(o[k]);
    if (stat) out[k] = stat;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function parseLemmaSkillMetricsField(v: unknown): LemmaSkillMetrics | undefined {
  if (!v || typeof v !== "object") return undefined;
  const out: LemmaSkillMetrics = {};
  const root = v as Record<string, unknown>;
  const keys: SkillMetricKey[] = [
    "recognition",
    "production",
    "grammar",
    "definition",
    "listening",
    "comprehension",
  ];
  for (const [lemmaRaw, bySkillRaw] of Object.entries(root)) {
    const lemma = lemmaRaw.trim();
    if (!lemma || !bySkillRaw || typeof bySkillRaw !== "object") continue;
    const bySkillObj = bySkillRaw as Record<string, unknown>;
    const slot: Partial<Record<SkillMetricKey, LemmaSkillStat>> = {};
    for (const k of keys) {
      const stat = parseLemmaSkillStat(bySkillObj[k]);
      if (stat) slot[k] = stat;
    }
    if (Object.keys(slot).length > 0) out[lemma] = slot;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function mergeRootDrillMaps(
  a: Record<string, Record<string, number>> | undefined,
  b: Record<string, Record<string, number>> | undefined,
): Record<string, Record<string, number>> | undefined {
  if (!a && !b) return undefined;
  const out: Record<string, Record<string, number>> = {};
  const roots = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
  for (const rk of roots) {
    const ma = a?.[rk];
    const mb = b?.[rk];
    if (!ma && !mb) continue;
    const merged: Record<string, number> = { ...ma };
    if (mb) {
      for (const [h, n] of Object.entries(mb)) {
        merged[h] = Math.max(merged[h] ?? 0, n);
      }
    }
    if (Object.keys(merged).length > 0) out[rk] = merged;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * On a correct roots drill pick, bump `rootDrill[rootKey][wordHe]` (capped).
 */
const MAX_ROOTS_CURRICULUM_GROUP_KEYS = 24;

function parseRootsCurriculumField(
  raw: unknown,
): RootsCurriculumProgress | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const groupsRaw = o.groups;
  const groups: Record<string, RootsGroupProgress> = {};
  if (groupsRaw && typeof groupsRaw === "object") {
    let n = 0;
    for (const [k, v] of Object.entries(groupsRaw)) {
      if (n >= MAX_ROOTS_CURRICULUM_GROUP_KEYS) break;
      if (typeof k !== "string" || k.length > 64) continue;
      if (!v || typeof v !== "object") continue;
      const g = v as Record<string, unknown>;
      const entry: RootsGroupProgress = {};
      if (g.introSeen === true) entry.introSeen = true;
      if (
        typeof g.drillHits === "number" &&
        Number.isFinite(g.drillHits) &&
        g.drillHits >= 0 &&
        g.drillHits < 10_000
      ) {
        entry.drillHits = Math.floor(g.drillHits);
      }
      if (g.testPassed === true) entry.testPassed = true;
      if (Object.keys(entry).length > 0) {
        groups[k] = entry;
        n++;
      }
    }
  }
  let checkpointsPassed: number[] | undefined;
  const cpRaw = o.checkpointsPassed;
  if (Array.isArray(cpRaw)) {
    const cp = cpRaw
      .filter((x) => typeof x === "number" && x >= 0 && x < 32)
      .map((x) => Math.floor(x as number));
    const uniq = [...new Set(cp)].sort((a, b) => a - b);
    if (uniq.length) checkpointsPassed = uniq;
  }
  if (Object.keys(groups).length === 0 && !checkpointsPassed?.length) {
    return undefined;
  }
  return { groups, ...(checkpointsPassed ? { checkpointsPassed } : {}) };
}

/** Mark group intro complete (unlocks drill). */
export function markRootsGroupIntroSeen(
  state: LearnProgressState,
  groupId: string,
): LearnProgressState {
  const gid = groupId.trim();
  if (!gid) return state;
  const rc = state.rootsCurriculum ?? { groups: {} };
  const prev = rc.groups[gid] ?? {};
  if (prev.introSeen) return state;
  return {
    ...state,
    rootsCurriculum: {
      ...rc,
      groups: { ...rc.groups, [gid]: { ...prev, introSeen: true } },
    },
  };
}

/** Count a correct curriculum drill pick toward unlocking the group test. */
export function bumpRootsCurriculumDrillHit(
  state: LearnProgressState,
  groupId: string,
  correct: boolean,
): LearnProgressState {
  if (!correct) return state;
  const gid = groupId.trim();
  if (!gid) return state;
  const rc = state.rootsCurriculum ?? { groups: {} };
  const prev = rc.groups[gid] ?? {};
  if (prev.testPassed) return state;
  const nextHits = Math.min(99, (prev.drillHits ?? 0) + 1);
  return {
    ...state,
    rootsCurriculum: {
      ...rc,
      groups: { ...rc.groups, [gid]: { ...prev, drillHits: nextHits } },
    },
  };
}

export function passRootsGroupTest(
  state: LearnProgressState,
  groupId: string,
): LearnProgressState {
  const gid = groupId.trim();
  if (!gid) return state;
  const rc = state.rootsCurriculum ?? { groups: {} };
  const prev = rc.groups[gid] ?? {};
  if (prev.testPassed) return state;
  return {
    ...state,
    rootsCurriculum: {
      ...rc,
      groups: { ...rc.groups, [gid]: { ...prev, testPassed: true } },
    },
  };
}

export function passRootsCheckpoint(
  state: LearnProgressState,
  checkpointIndex: number,
): LearnProgressState {
  if (checkpointIndex < 0 || checkpointIndex > 31 || !Number.isFinite(checkpointIndex)) {
    return state;
  }
  const rc = state.rootsCurriculum ?? { groups: {} };
  const cur = [...(rc.checkpointsPassed ?? [])];
  if (cur.includes(checkpointIndex)) return state;
  cur.push(checkpointIndex);
  cur.sort((a, b) => a - b);
  return {
    ...state,
    rootsCurriculum: { ...rc, checkpointsPassed: cur },
  };
}

export function recordRootDrillCorrect(
  state: LearnProgressState,
  rootKey: string,
  wordHe: string,
): LearnProgressState {
  const rk = rootKey.trim();
  const wh = wordHe.trim();
  if (!rk || !wh) return state;

  const cur = { ...(state.rootDrill ?? {}) };
  const inner = { ...(cur[rk] ?? {}) };
  const prev = inner[wh] ?? 0;
  inner[wh] = Math.min(99, prev + 1);
  cur[rk] = inner;
  return { ...state, rootDrill: cur };
}

export function mergeVocabLevelMaps(
  a: Record<string, number> | undefined,
  b: Record<string, number> | undefined,
): Record<string, number> | undefined {
  if (!a && !b) return undefined;
  const out: Record<string, number> = { ...a };
  if (b) {
    for (const [k, v] of Object.entries(b)) {
      out[k] = Math.max(out[k] ?? 0, v);
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Optional context from drills on the first graded click per question. */
export type GradedPracticeContext = {
  /** MCQ Hebrew prompt; feeds `vocabLevels` for `unlockMastered` gates. */
  promptHe?: string;
  /** Roots graduated drill: increment `rootDrill` on correct (with `promptHe`). */
  rootKey?: string;
  /** Skill dimensions this answer should count toward. */
  skills?: SkillMetricKey[];
  /** Numbers hub drill id (`cards` | `listen` | `ordinal` | …) for carousel engagement. */
  numbersHubEngageId?: string;
  /** Legacy `learner.gt` bucket (dashboard game accuracy row). */
  studyGameId?: DashboardGameId;
};

/**
 * Update `vocabLevels` for one lemma from a graded MCQ answer.
 * Correct: +1 (cap 5). Incorrect: −1 (floor 0). lv ≥ 2 counts in
 * {@link effectiveCourseLevelMasteredCount}.
 */
export function recordVocabPracticeForPrompt(
  state: LearnProgressState,
  promptHe: string | undefined,
  correct: boolean,
): LearnProgressState {
  const h = promptHe?.trim();
  if (!h || !/[\u0590-\u05FF]/.test(h)) return state;

  const cur: Record<string, number> = { ...(state.vocabLevels ?? {}) };
  const prev = cur[h] ?? 0;
  const nextLv = correct
    ? Math.min(5, prev + 1)
    : Math.max(0, prev - 1);

  if (nextLv === prev && prev === 0 && !correct) return state;

  if (nextLv === 0) delete cur[h];
  else cur[h] = nextLv;

  if (Object.keys(cur).length === 0) {
    if (!state.vocabLevels) return state;
    const rest = { ...state };
    delete rest.vocabLevels;
    return rest;
  }
  return { ...state, vocabLevels: cur };
}

/** Bump practice counters after a graded MCQ / comprehension pick. */
export function recordGradedAnswer(
  state: LearnProgressState,
  correct: boolean,
  ctx?: GradedPracticeContext,
): LearnProgressState {
  const attempts = (state.mcqAttempts ?? 0) + 1;
  const right = (state.mcqCorrect ?? 0) + (correct ? 1 : 0);
  const skills: SkillMetricKey[] = ctx?.skills?.length
    ? ctx.skills
    : ["recognition"];
  const skillMetrics: SkillMetrics = { ...(state.skillMetrics ?? {}) };
  const lemmaSkillMetrics: LemmaSkillMetrics = { ...(state.lemmaSkillMetrics ?? {}) };
  const lemma = ctx?.promptHe?.trim();
  const canTrackLemma = !!lemma && /[\u0590-\u05FF]/.test(lemma);
  const now = Date.now();
  for (const skill of skills) {
    const prev = skillMetrics[skill] ?? { attempts: 0, correct: 0 };
    skillMetrics[skill] = {
      attempts: prev.attempts + 1,
      correct: prev.correct + (correct ? 1 : 0),
    };
    if (canTrackLemma) {
      const lemmaMap = { ...(lemmaSkillMetrics[lemma!] ?? {}) };
      const prevLemma = lemmaMap[skill] ?? { attempts: 0, correct: 0, lastSeen: 0 };
      lemmaMap[skill] = {
        attempts: prevLemma.attempts + 1,
        correct: prevLemma.correct + (correct ? 1 : 0),
        lastSeen: now,
      };
      lemmaSkillMetrics[lemma!] = lemmaMap;
    }
  }
  const lessonAnswerTotal = Math.min(
    LESSON_ANSWER_TOTAL_CAP,
    (state.lessonAnswerTotal ?? 0) + 1,
  );
  let studyGameStats = state.studyGameStats;
  const gid = ctx?.studyGameId;
  if (gid && DASHBOARD_GAME_ID_SET.has(gid)) {
    const cur = { ...(studyGameStats ?? {}) };
    const prev = cur[gid] ?? { correct: 0, wrong: 0 };
    cur[gid] = {
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
    };
    studyGameStats = cur;
  }
  return {
    ...state,
    mcqAttempts: attempts,
    mcqCorrect: right,
    lessonAnswerTotal,
    ...(studyGameStats ? { studyGameStats } : {}),
    skillMetrics,
    ...(canTrackLemma ? { lemmaSkillMetrics } : {}),
  };
}

export function lemmaReviewPriority(
  state: Pick<LearnProgressState, "lemmaSkillMetrics">,
  lemma: string,
): number {
  const bySkill = state.lemmaSkillMetrics?.[lemma.trim()];
  if (!bySkill) return 1;
  const stats = Object.values(bySkill);
  if (!stats.length) return 1;
  const meanAcc =
    stats.reduce((acc, s) => acc + (s.attempts > 0 ? s.correct / s.attempts : 0), 0) /
    stats.length;
  const meanAttempts =
    stats.reduce((acc, s) => acc + s.attempts, 0) / stats.length;
  const lastSeen = Math.max(...stats.map((s) => s.lastSeen || 0));
  const ageDays = lastSeen > 0 ? (Date.now() - lastSeen) / (1000 * 60 * 60 * 24) : 3;
  const confidence = Math.min(1, meanAttempts / 8);
  const freshness = Math.min(1, ageDays / 5);
  const weakness = 1 - meanAcc * confidence;
  return weakness * 0.75 + freshness * 0.25;
}

export function getSkillMetricSnapshot(
  state: LearnProgressState,
): Record<SkillMetricKey, SkillMetricStat> {
  const src = state.skillMetrics ?? {};
  const keys: SkillMetricKey[] = [
    "recognition",
    "production",
    "grammar",
    "definition",
    "listening",
    "comprehension",
  ];
  return Object.fromEntries(
    keys.map((k) => [
      k,
      {
        attempts: src[k]?.attempts ?? 0,
        correct: src[k]?.correct ?? 0,
      },
    ]),
  ) as Record<SkillMetricKey, SkillMetricStat>;
}

/**
 * Lowest-confidence dimensions first (used by Rabbi + review recommendations).
 * Low attempts are treated as low confidence even with high temporary accuracy.
 */
export function getWeakestSkillMetrics(
  state: LearnProgressState,
  take = 2,
): SkillMetricKey[] {
  const snap = getSkillMetricSnapshot(state);
  const scored = (
    Object.entries(snap) as [SkillMetricKey, SkillMetricStat][]
  ).map(([k, v]) => {
    if (v.attempts <= 0) return { k, score: 0 };
    const acc = v.correct / v.attempts;
    const confidence = Math.min(1, v.attempts / 8);
    return { k, score: acc * confidence };
  });
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, Math.max(1, take)).map((x) => x.k);
}

/** Mark a reading carousel passage as opened (unlocks next Jewish-text slot). */
export function revealReadingCarouselPassage(
  state: LearnProgressState,
  passageId: string,
): LearnProgressState {
  const cur = state.readingCarouselRevealed ?? {};
  if (cur[passageId]) return state;
  return {
    ...state,
    readingCarouselRevealed: { ...cur, [passageId]: true },
  };
}

/** Reveal (if needed) and bump last-opened time for carousel ordering. */
export function touchReadingCarouselPassage(
  state: LearnProgressState,
  passageId: string,
): LearnProgressState {
  const withReveal = revealReadingCarouselPassage(state, passageId);
  return {
    ...withReveal,
    readingPassageLastOpenedAt: {
      ...(withReveal.readingPassageLastOpenedAt ?? {}),
      [passageId]: Date.now(),
    },
  };
}

export function markReadingPassageQuizComplete(
  state: LearnProgressState,
  passageId: string,
): LearnProgressState {
  const cur = state.readingPassageQuizComplete ?? {};
  if (cur[passageId]) return state;
  return {
    ...state,
    readingPassageQuizComplete: { ...cur, [passageId]: true },
  };
}

export function touchNumbersCarouselHub(
  state: LearnProgressState,
  hubId: string,
): LearnProgressState {
  return {
    ...state,
    numbersCarouselLastOpenedAt: {
      ...(state.numbersCarouselLastOpenedAt ?? {}),
      [hubId]: Date.now(),
    },
  };
}

export function markNumbersDrillEngaged(
  state: LearnProgressState,
  engageId: string,
): LearnProgressState {
  const cur = state.numbersDrillEngaged ?? {};
  if (cur[engageId]) return state;
  return {
    ...state,
    numbersDrillEngaged: { ...cur, [engageId]: true },
  };
}

/**
 * Coerce and validate `lastCoursePosition` from storage or import JSON.
 * Returns `undefined` if missing or invalid.
 */
export function parseLastCoursePosition(raw: unknown): LastCoursePosition | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.level !== "number" ||
    !Number.isInteger(o.level) ||
    o.level < 1 ||
    o.level > 4
  ) {
    return undefined;
  }
  if (typeof o.sectionId !== "string" || !o.sectionId) return undefined;
  const secs = getSectionsForLevel(o.level);
  if (!secs.some((s) => s.id === o.sectionId)) return undefined;
  const at =
    typeof o.at === "number" && Number.isFinite(o.at) && o.at > 0
      ? o.at
      : Date.now();
  return { level: o.level, sectionId: o.sectionId, at };
}

export function touchLastCoursePosition(
  state: LearnProgressState,
  level: number,
  sectionId: string,
): LearnProgressState {
  const lcp = parseLastCoursePosition({ level, sectionId, at: Date.now() });
  if (!lcp) return state;
  return { ...state, lastCoursePosition: lcp };
}

/**
 * After a subsection is marked done, set resume to the next `getNextLearnUp` target
 * when that URL is a foundation section; otherwise clear resume.
 */
export function withResumeFromNextUpHref(
  state: LearnProgressState,
  nextHref: string,
): LearnProgressState {
  const m = nextHref.match(/^\/learn\/([1-4])\/([^/?#]+)/);
  if (m) {
    const level = parseInt(m[1], 10);
    const sectionId = decodeURIComponent(m[2]);
    const lcp = parseLastCoursePosition({
      level,
      sectionId,
      at: Date.now(),
    });
    if (lcp) return { ...state, lastCoursePosition: lcp };
  }
  if (!state.lastCoursePosition) return state;
  const { lastCoursePosition: _removed, ...rest } = state;
  return rest;
}

/**
 * Valid `/learn/L/section` path to open for resume, or `null` if nothing to resume
 * (locked section, bad data, etc.).
 */
export function getFoundationResumePath(progress: LearnProgressState): string | null {
  const pos = progress.lastCoursePosition;
  if (!pos) return null;
  const lcp = parseLastCoursePosition(pos);
  if (!lcp) return null;
  const { level, sectionId } = lcp;
  const secs = getSectionsForLevel(level);
  if (!secs.some((s) => s.id === sectionId)) return null;
  if (
    !getDeveloperModeBypass() &&
    !sectionUnlocked(
      level,
      secs,
      sectionId,
      progress.completedSections,
      progress.vocabLevels,
    )
  ) {
    return null;
  }
  return `/learn/${level}/${encodeURIComponent(sectionId)}`;
}

export function loadLearnProgress(): LearnProgressState {
  if (typeof window === "undefined") return { ...defaultState };
  try {
    const raw = localStorage.getItem(LEARN_PROGRESS_KEY);
    if (!raw) return { ...defaultState };
    const p = JSON.parse(raw) as Partial<LearnProgressState>;
    const streak = parseStreakFromJson(p.streak);
    const atIn = parseNonNegInt(p.mcqAttempts);
    const crIn = parseNonNegInt(p.mcqCorrect);
    const mcqAttempts =
      atIn == null && crIn == null
        ? undefined
        : Math.max(atIn ?? 0, crIn ?? 0);
    const mcqCorrect =
      mcqAttempts == null || mcqAttempts === 0
        ? undefined
        : Math.min(crIn ?? 0, mcqAttempts);

    const vocabLevels = parseVocabLevelsField(p.vocabLevels);
    const rootDrill = parseRootDrillField(p.rootDrill);
    const skillMetrics = parseSkillMetricsField(p.skillMetrics);
    const lemmaSkillMetrics = parseLemmaSkillMetricsField(p.lemmaSkillMetrics);
    const alphabetGate = parseAlphabetGate(p.alphabetGate);
    const foundationExit = parseFoundationExit(p.foundationExit);
    const bridgeModulePassed = parseBridgeModulePassed(p.bridgeModulePassed);
    const bridgeUnitsCompleted = parseBridgeUnitsCompleted(
      p.bridgeUnitsCompleted,
    );
    const alphabetLettersTraced = parseAlphabetLettersTraced(
      p.alphabetLettersTraced,
    );
    const alphabetFinalExamPassed = parseAlphabetFinalExamPassed(
      p.alphabetFinalExamPassed,
    );
    const specialtyTierPassed = parseSpecialtyTierPassed(p.specialtyTierPassed);
    const readingCarouselRevealed = parseReadingCarouselRevealed(
      p.readingCarouselRevealed,
    );
    const readingPassageLastOpenedAt = parseReadingPassageLastOpenedAt(
      p.readingPassageLastOpenedAt,
    );
    const readingPassageQuizComplete = parseReadingPassageQuizComplete(
      p.readingPassageQuizComplete,
    );
    const numbersCarouselLastOpenedAt = parseNumbersCarouselLastOpenedAt(
      p.numbersCarouselLastOpenedAt,
    );
    const numbersDrillEngaged = parseNumbersDrillEngaged(p.numbersDrillEngaged);
    let lessonAnswerTotal = parseLessonAnswerTotalField(p.lessonAnswerTotal);
    if (
      (lessonAnswerTotal == null || lessonAnswerTotal === 0) &&
      mcqAttempts != null &&
      mcqAttempts > 0
    ) {
      lessonAnswerTotal = Math.min(LESSON_ANSWER_TOTAL_CAP, mcqAttempts);
    }
    const studyGameStats = parseStudyGameStats(p.studyGameStats);
    const rootsCurriculum = parseRootsCurriculumField(p.rootsCurriculum);
    const lastCoursePosition = parseLastCoursePosition(p.lastCoursePosition);
    const appSession = parseAppSessionField(p.appSession);

    return {
      completedSections:
        p.completedSections && typeof p.completedSections === "object"
          ? p.completedSections
          : {},
      activeLevel:
        typeof p.activeLevel === "number" && p.activeLevel >= 1 && p.activeLevel <= 4
          ? p.activeLevel
          : 1,
      ...(streak ? { streak } : {}),
      ...(mcqAttempts != null && mcqAttempts > 0 && mcqCorrect != null
        ? { mcqAttempts, mcqCorrect }
        : {}),
      ...(vocabLevels ? { vocabLevels } : {}),
      ...(rootDrill ? { rootDrill } : {}),
      ...(skillMetrics ? { skillMetrics } : {}),
      ...(lemmaSkillMetrics ? { lemmaSkillMetrics } : {}),
      ...(alphabetGate ? { alphabetGate } : {}),
      ...(foundationExit ? { foundationExit } : {}),
      ...(bridgeModulePassed === true ? { bridgeModulePassed: true } : {}),
      ...(bridgeUnitsCompleted ? { bridgeUnitsCompleted } : {}),
      ...(alphabetLettersTraced ? { alphabetLettersTraced } : {}),
      ...(alphabetFinalExamPassed === true
        ? { alphabetFinalExamPassed: true }
        : {}),
      ...(specialtyTierPassed ? { specialtyTierPassed } : {}),
      ...(readingCarouselRevealed ? { readingCarouselRevealed } : {}),
      ...(readingPassageLastOpenedAt
        ? { readingPassageLastOpenedAt }
        : {}),
      ...(readingPassageQuizComplete ? { readingPassageQuizComplete } : {}),
      ...(numbersCarouselLastOpenedAt
        ? { numbersCarouselLastOpenedAt }
        : {}),
      ...(numbersDrillEngaged ? { numbersDrillEngaged } : {}),
      ...(lessonAnswerTotal != null && lessonAnswerTotal > 0
        ? { lessonAnswerTotal }
        : {}),
      ...(studyGameStats ? { studyGameStats } : {}),
      ...(rootsCurriculum ? { rootsCurriculum } : {}),
      ...(lastCoursePosition ? { lastCoursePosition } : {}),
      ...(appSession ? { appSession } : {}),
    };
  } catch {
    return { ...defaultState };
  }
}

/** Fired after `saveLearnProgress` so shell can refresh Next up, etc. */
export const LEARN_PROGRESS_EVENT = "hebrew-web-learn-progress";

/**
 * Fired when optional cloud merge for signed-in users has finished (or skipped),
 * so `/learn` can resume after local storage reflects merged data.
 */
export const LEARN_CLOUD_HYDRATED_EVENT = "hebrew-learn-progress-cloud-hydrated" as const;

/**
 * Notify listeners after the current React update finishes. A synchronous
 * dispatch inside `setState` updaters would update AppShell while a child is
 * still rendering (React 18/19 cross-root warning).
 */
function dispatchLearnProgressEventDeferred(): void {
  if (typeof window === "undefined") return;
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(LEARN_PROGRESS_EVENT));
  });
}

/** Clear Learn progress + Next-up UI preference; notify listeners. */
export function resetWebAppLocalCourseState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LEARN_PROGRESS_KEY);
    localStorage.removeItem(NEXT_UP_EXPANDED_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  dispatchLearnProgressEventDeferred();
}

export function saveLearnProgress(state: LearnProgressState) {
  try {
    localStorage.setItem(LEARN_PROGRESS_KEY, JSON.stringify(state));
    if (typeof window !== "undefined") {
      dispatchLearnProgressEventDeferred();
    }
  } catch {
    /* quota */
  }
}

/** Completed subsections on this level (used as legacy `unlockMastered` proxy). */
export function completedCountInLevel(
  level: number,
  completed: Record<string, boolean>,
): number {
  return getSectionsForLevel(level).filter((s) => completed[s.id]).length;
}

/**
 * Approximates legacy `courseLevelMasteredCount(n)` (words at level with vocab lv≥2).
 * When `vocabLevels` is empty, falls back to {@link completedCountInLevel}.
 * Otherwise uses max(completion proxy, count of course target words with lv≥2).
 */
export function effectiveCourseLevelMasteredCount(
  level: number,
  completed: Record<string, boolean>,
  vocabLevels: Record<string, number> | undefined,
): number {
  const proxy = completedCountInLevel(level, completed);
  const words = getMasteryWordListForLevel(level);
  if (words.length === 0) return proxy;
  if (!vocabLevels || Object.keys(vocabLevels).length === 0) return proxy;
  let v = 0;
  for (const h of words) {
    if ((vocabLevels[h] ?? 0) >= 2) v++;
  }
  return Math.max(proxy, v);
}

/** How many course-target lemmas at this level have vocab lv ≥ 2. */
export function countCourseListMastery(
  level: number,
  vocabLevels: Record<string, number> | undefined,
): { mastered: number; total: number } {
  const words = getMasteryWordListForLevel(level);
  const total = words.length;
  if (!vocabLevels || total === 0) return { mastered: 0, total };
  let mastered = 0;
  for (const h of words) {
    if ((vocabLevels[h] ?? 0) >= 2) mastered++;
  }
  return { mastered, total };
}

export function countAllTrackedLemmas(
  vocabLevels: Record<string, number> | undefined,
): number {
  return vocabLevels ? Object.keys(vocabLevels).length : 0;
}

export function countTrackedLemmasAtLeast(
  vocabLevels: Record<string, number> | undefined,
  minLv: number,
): number {
  if (!vocabLevels) return 0;
  return Object.values(vocabLevels).filter((lv) => lv >= minLv).length;
}

/**
 * Remove only `vocabLevels` (MCQ / import mastery). Keeps completions, streak, etc.
 */
export function clearVocabLevelsOnly(): void {
  if (typeof window === "undefined") return;
  const p = loadLearnProgress();
  if (!p.vocabLevels) return;
  const next = { ...p };
  delete next.vocabLevels;
  saveLearnProgress(next);
}

/**
 * Mirrors legacy `isSectionUnlocked` (`hebrew-v8.2.html`).
 * `unlockMastered` uses {@link effectiveCourseLevelMasteredCount} (subsection proxy
 * and/or imported per-word levels on the course word list).
 */
export function sectionUnlocked(
  level: number,
  sections: SectionMeta[],
  sectionId: string,
  completed: Record<string, boolean>,
  vocabLevels?: Record<string, number>,
): boolean {
  const idx = sections.findIndex((s) => s.id === sectionId);
  if (idx < 0) return false;
  if (getDeveloperModeBypass()) return true;
  if (idx === 0) return true;

  const sec = sections[idx];

  if (sec.unlockIds?.length) {
    if (!sec.unlockIds.every((id) => !!completed[id])) return false;
  }

  if (sec.unlockMastered != null) {
    if (
      effectiveCourseLevelMasteredCount(level, completed, vocabLevels) <
      sec.unlockMastered
    )
      return false;
  }

  if (sec.unlockAfter != null) {
    const completedBefore = sections
      .slice(0, idx)
      .filter((s) => completed[s.id]).length;
    return completedBefore >= sec.unlockAfter;
  }

  const prev = sections[idx - 1];
  return !!completed[prev?.id];
}

/** Human hint when a section is locked (for Learn UI). */
export function sectionLockHint(
  level: number,
  sections: SectionMeta[],
  sectionId: string,
  completed: Record<string, boolean>,
  vocabLevels?: Record<string, number>,
): string | null {
  if (sectionUnlocked(level, sections, sectionId, completed, vocabLevels))
    return null;

  const idx = sections.findIndex((s) => s.id === sectionId);
  if (idx <= 0) return null;
  const sec = sections[idx];

  if (sec.unlockIds?.length) {
    const missing = sec.unlockIds.filter((id) => !completed[id]);
    if (missing.length) {
      return `Finish these subsections first: ${missing.join(", ")}.`;
    }
  }

  if (sec.unlockMastered != null) {
    const c = effectiveCourseLevelMasteredCount(
      level,
      completed,
      vocabLevels,
    );
    if (c < sec.unlockMastered) {
      return `Reach at least ${sec.unlockMastered} toward this level’s mastery gate (${c} now — completed subsections and/or imported word levels ≥2 on the course list).`;
    }
  }

  if (sec.unlockAfter != null) {
    const before = sections.slice(0, idx).filter((s) => completed[s.id]).length;
    if (before < sec.unlockAfter) {
      return `Complete ${sec.unlockAfter - before} more subsection(s) before this one on the list.`;
    }
  }

  const prev = sections[idx - 1];
  if (prev && !completed[prev.id]) {
    return `Complete “${prev.label}” first.`;
  }

  return "This section is locked.";
}

export function completionRatio(
  sections: SectionMeta[],
  completed: Record<string, boolean>,
): { done: number; total: number; pct: number } {
  const total = sections.length;
  const done = sections.filter((s) => completed[s.id]).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}
