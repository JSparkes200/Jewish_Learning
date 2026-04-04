/**
 * JSON export / import for {@link LEARN_PROGRESS_KEY} (backup, device move).
 */

import { COURSE_LEVELS, getSectionsForLevel } from "@/data/course";
import { ALPHABET_LETTER_IDS } from "@/data/alphabet-letters";
import { BRIDGE_UNIT_IDS } from "@/data/bridge-course";
import {
  getFoundationExitStrands,
  mergeAlphabetGatePreferProgress,
  mergeRootDrillMaps,
  mergeVocabLevelMaps,
  normalizeStreak,
  parseAlphabetGate,
  parseAlphabetFinalExamPassed,
  parseAlphabetLettersTraced,
  parseBridgeModulePassed,
  parseBridgeUnitsCompleted,
  parseFoundationExit,
  mergeSpecialtyTierPassedMaps,
  parseLessonAnswerTotalField,
  parseNumbersCarouselLastOpenedAt,
  parseNumbersDrillEngaged,
  parseReadingCarouselRevealed,
  parseReadingPassageLastOpenedAt,
  parseReadingPassageQuizComplete,
  parseRootDrillField,
  parseSpecialtyTierPassed,
  parseStreakFromJson,
  parseStudyGameStats,
  parseVocabLevelsField,
  DASHBOARD_GAME_IDS,
  LESSON_ANSWER_TOTAL_CAP,
  type LearnProgressState,
  type LearnStreak,
} from "@/lib/learn-progress";
import type { YiddishProgressState } from "@/lib/yiddish-progress";
import type { SavedWordEntry } from "@/lib/saved-words";
import { mergeSavedWordLists, sanitizeSavedWordsFromJson } from "@/lib/saved-words";
import { sanitizeYiddishProgress } from "@/lib/yiddish-progress";

/** Legacy single-blob export (Learn only). */
const SCHEMA_VERSION = 1;

/** Current app-wide backup: Hebrew + optional Yiddish + optional saved words (Phase A). */
export const APP_BACKUP_SCHEMA_VERSION = 3;

/** Older exports without {@link AppProgressExportV2.savedWords}. */
export const APP_BACKUP_SCHEMA_VERSION_V2 = 2;

export type LearnProgressExportFile = {
  schemaVersion: number;
  exportedAt: string;
  progress: LearnProgressState;
};

export type AppProgressExportV2 = {
  schemaVersion: typeof APP_BACKUP_SCHEMA_VERSION | typeof APP_BACKUP_SCHEMA_VERSION_V2;
  exportedAt: string;
  progress: LearnProgressState;
  /** Omitted or empty when learner has not started Yiddish. */
  yiddishProgress?: YiddishProgressState;
  /** Migrated legacy bookmarks (`ivrit_saved`); schema 3 only. */
  savedWords?: SavedWordEntry[];
};

function knownSectionIds(): Set<string> {
  const s = new Set<string>();
  for (const L of COURSE_LEVELS) {
    for (const sec of getSectionsForLevel(L.n)) {
      s.add(sec.id);
    }
  }
  return s;
}

const KNOWN = knownSectionIds();

function truthyCompletion(v: unknown): boolean {
  return v === true || v === "true" || v === 1;
}

function nonNegInt(x: unknown): number | undefined {
  if (typeof x !== "number" || !Number.isFinite(x) || x < 0) return undefined;
  return Math.floor(x);
}

/**
 * Strip unknown keys and coerce types. Returns null if unusable.
 */
export function sanitizeLearnProgress(
  raw: Record<string, unknown>,
): LearnProgressState {
  const completed: Record<string, boolean> = {};
  const cs = raw.completedSections;
  if (cs && typeof cs === "object") {
    for (const [id, v] of Object.entries(cs as Record<string, unknown>)) {
      if (!KNOWN.has(id)) continue;
      if (truthyCompletion(v)) completed[id] = true;
    }
  }

  let activeLevel = 1;
  if (
    typeof raw.activeLevel === "number" &&
    raw.activeLevel >= 1 &&
    raw.activeLevel <= 4
  ) {
    activeLevel = Math.floor(raw.activeLevel);
  }

  const streak = parseStreakFromJson(raw.streak);
  const out: LearnProgressState = {
    completedSections: completed,
    activeLevel,
  };
  if (streak) out.streak = streak;

  const atIn = nonNegInt(raw.mcqAttempts);
  const crIn = nonNegInt(raw.mcqCorrect);
  if (atIn != null || crIn != null) {
    const at = Math.max(atIn ?? 0, crIn ?? 0);
    const cr = Math.min(crIn ?? 0, at);
    if (at > 0) {
      out.mcqAttempts = at;
      out.mcqCorrect = cr;
    }
  }

  const vl = parseVocabLevelsField(raw.vocabLevels);
  if (vl) out.vocabLevels = vl;

  const rd = parseRootDrillField(raw.rootDrill);
  if (rd) out.rootDrill = rd;

  const ag = parseAlphabetGate(raw.alphabetGate);
  if (ag) out.alphabetGate = ag;

  const fe = parseFoundationExit(raw.foundationExit);
  if (fe) out.foundationExit = fe;

  const bmp = parseBridgeModulePassed(raw.bridgeModulePassed);
  if (bmp === true) out.bridgeModulePassed = true;

  const bu = parseBridgeUnitsCompleted(raw.bridgeUnitsCompleted);
  if (bu) out.bridgeUnitsCompleted = bu;

  const alt = parseAlphabetLettersTraced(raw.alphabetLettersTraced);
  if (alt) out.alphabetLettersTraced = alt;
  const afp = parseAlphabetFinalExamPassed(raw.alphabetFinalExamPassed);
  if (afp === true) out.alphabetFinalExamPassed = true;

  const stp = parseSpecialtyTierPassed(raw.specialtyTierPassed);
  if (stp) out.specialtyTierPassed = stp;

  const rc = parseReadingCarouselRevealed(raw.readingCarouselRevealed);
  if (rc) out.readingCarouselRevealed = rc;

  const rlo = parseReadingPassageLastOpenedAt(raw.readingPassageLastOpenedAt);
  if (rlo) out.readingPassageLastOpenedAt = rlo;

  const rqc = parseReadingPassageQuizComplete(raw.readingPassageQuizComplete);
  if (rqc) out.readingPassageQuizComplete = rqc;

  const nlo = parseNumbersCarouselLastOpenedAt(raw.numbersCarouselLastOpenedAt);
  if (nlo) out.numbersCarouselLastOpenedAt = nlo;

  const nde = parseNumbersDrillEngaged(raw.numbersDrillEngaged);
  if (nde) out.numbersDrillEngaged = nde;

  const lat = parseLessonAnswerTotalField(raw.lessonAnswerTotal);
  if (lat != null && lat > 0) out.lessonAnswerTotal = lat;

  const sgs = parseStudyGameStats(raw.studyGameStats);
  if (sgs) out.studyGameStats = sgs;

  return out;
}

export type ParseImportResult =
  | { ok: true; progress: LearnProgressState }
  | { ok: false; error: string };

/**
 * Accepts our export wrapper or a raw `{ completedSections, activeLevel, streak? }`.
 */
export function parseLearnProgressJson(text: string): ParseImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "JSON root must be an object." };
  }
  const root = parsed as Record<string, unknown>;

  const progressRaw =
    root.progress && typeof root.progress === "object"
      ? (root.progress as Record<string, unknown>)
      : root;

  const progress = sanitizeLearnProgress(progressRaw);
  return { ok: true, progress };
}

function mergeStreaks(
  a: LearnProgressState,
  b: LearnProgressState,
): LearnStreak | undefined {
  const sa = normalizeStreak(a.streak);
  const sb = normalizeStreak(b.streak);
  const empty =
    !sa.lastDay &&
    !sb.lastDay &&
    sa.longest === 0 &&
    sb.longest === 0 &&
    sa.current === 0 &&
    sb.current === 0;
  if (empty) return undefined;

  const longest = Math.max(sa.longest, sb.longest);
  let current: number;
  let lastDay: string;
  if (sb.lastDay > sa.lastDay) {
    current = sb.current;
    lastDay = sb.lastDay;
  } else if (sa.lastDay > sb.lastDay) {
    current = sa.current;
    lastDay = sa.lastDay;
  } else {
    lastDay = sa.lastDay || sb.lastDay;
    current = Math.max(sa.current, sb.current);
  }
  return { current, longest, lastDay };
}

/** Union completions; active level = max; streak = sensible merge. */
export function mergeLearnProgressStates(
  base: LearnProgressState,
  other: LearnProgressState,
): LearnProgressState {
  const completed = { ...base.completedSections };
  for (const [id, v] of Object.entries(other.completedSections)) {
    if (v) completed[id] = true;
  }
  const activeLevel = Math.min(
    4,
    Math.max(base.activeLevel, other.activeLevel),
  );
  const streak = mergeStreaks(base, other);
  const at = (base.mcqAttempts ?? 0) + (other.mcqAttempts ?? 0);
  const cr = (base.mcqCorrect ?? 0) + (other.mcqCorrect ?? 0);
  const out: LearnProgressState = {
    completedSections: completed,
    activeLevel,
  };
  if (streak) out.streak = streak;
  if (at > 0) {
    out.mcqAttempts = at;
    out.mcqCorrect = Math.min(cr, at);
  }

  const mergedVocab = mergeVocabLevelMaps(base.vocabLevels, other.vocabLevels);
  if (mergedVocab) out.vocabLevels = mergedVocab;

  const mergedRd = mergeRootDrillMaps(base.rootDrill, other.rootDrill);
  if (mergedRd) out.rootDrill = mergedRd;

  const mergedAg = mergeAlphabetGatePreferProgress(
    base.alphabetGate,
    other.alphabetGate,
  );
  if (mergedAg) out.alphabetGate = mergedAg;

  const fe = {
    reading:
      getFoundationExitStrands(base).reading ||
      getFoundationExitStrands(other).reading,
    grammar:
      getFoundationExitStrands(base).grammar ||
      getFoundationExitStrands(other).grammar,
    lexicon:
      getFoundationExitStrands(base).lexicon ||
      getFoundationExitStrands(other).lexicon,
  };
  if (fe.reading || fe.grammar || fe.lexicon) out.foundationExit = fe;

  if (base.bridgeModulePassed || other.bridgeModulePassed) {
    out.bridgeModulePassed = true;
  }

  const mergedBridgeUnits: Record<string, boolean> = {};
  for (const id of BRIDGE_UNIT_IDS) {
    if (base.bridgeUnitsCompleted?.[id] || other.bridgeUnitsCompleted?.[id]) {
      mergedBridgeUnits[id] = true;
    }
  }
  if (Object.keys(mergedBridgeUnits).length > 0) {
    out.bridgeUnitsCompleted = mergedBridgeUnits;
  }

  const mergedAlphabet: Record<string, boolean> = {};
  for (const id of ALPHABET_LETTER_IDS) {
    if (base.alphabetLettersTraced?.[id] || other.alphabetLettersTraced?.[id]) {
      mergedAlphabet[id] = true;
    }
  }
  if (Object.keys(mergedAlphabet).length > 0) {
    out.alphabetLettersTraced = mergedAlphabet;
  }
  if (base.alphabetFinalExamPassed || other.alphabetFinalExamPassed) {
    out.alphabetFinalExamPassed = true;
  }

  const mergedSt = mergeSpecialtyTierPassedMaps(
    base.specialtyTierPassed,
    other.specialtyTierPassed,
  );
  if (mergedSt) out.specialtyTierPassed = mergedSt;

  const mergedRc: Record<string, boolean> = {};
  for (const k of new Set([
    ...Object.keys(base.readingCarouselRevealed ?? {}),
    ...Object.keys(other.readingCarouselRevealed ?? {}),
  ])) {
    if (
      base.readingCarouselRevealed?.[k] === true ||
      other.readingCarouselRevealed?.[k] === true
    ) {
      mergedRc[k] = true;
    }
  }
  if (Object.keys(mergedRc).length > 0) {
    out.readingCarouselRevealed = mergedRc;
  }

  const mergedRlo: Record<string, number> = {};
  for (const k of new Set([
    ...Object.keys(base.readingPassageLastOpenedAt ?? {}),
    ...Object.keys(other.readingPassageLastOpenedAt ?? {}),
  ])) {
    const m = Math.max(
      base.readingPassageLastOpenedAt?.[k] ?? 0,
      other.readingPassageLastOpenedAt?.[k] ?? 0,
    );
    if (m > 0) mergedRlo[k] = m;
  }
  if (Object.keys(mergedRlo).length > 0) {
    out.readingPassageLastOpenedAt = mergedRlo;
  }

  const mergedRqc: Record<string, boolean> = {};
  for (const k of new Set([
    ...Object.keys(base.readingPassageQuizComplete ?? {}),
    ...Object.keys(other.readingPassageQuizComplete ?? {}),
  ])) {
    if (
      base.readingPassageQuizComplete?.[k] === true ||
      other.readingPassageQuizComplete?.[k] === true
    ) {
      mergedRqc[k] = true;
    }
  }
  if (Object.keys(mergedRqc).length > 0) {
    out.readingPassageQuizComplete = mergedRqc;
  }

  const mergedNlo: Record<string, number> = {};
  for (const k of new Set([
    ...Object.keys(base.numbersCarouselLastOpenedAt ?? {}),
    ...Object.keys(other.numbersCarouselLastOpenedAt ?? {}),
  ])) {
    const m = Math.max(
      base.numbersCarouselLastOpenedAt?.[k] ?? 0,
      other.numbersCarouselLastOpenedAt?.[k] ?? 0,
    );
    if (m > 0) mergedNlo[k] = m;
  }
  if (Object.keys(mergedNlo).length > 0) {
    out.numbersCarouselLastOpenedAt = mergedNlo;
  }

  const mergedNde: Record<string, boolean> = {};
  for (const k of new Set([
    ...Object.keys(base.numbersDrillEngaged ?? {}),
    ...Object.keys(other.numbersDrillEngaged ?? {}),
  ])) {
    if (
      base.numbersDrillEngaged?.[k] === true ||
      other.numbersDrillEngaged?.[k] === true
    ) {
      mergedNde[k] = true;
    }
  }
  if (Object.keys(mergedNde).length > 0) {
    out.numbersDrillEngaged = mergedNde;
  }

  const lt = (base.lessonAnswerTotal ?? 0) + (other.lessonAnswerTotal ?? 0);
  if (lt > 0) {
    out.lessonAnswerTotal = Math.min(LESSON_ANSWER_TOTAL_CAP, lt);
  }

  const mergedGames: Record<string, { correct: number; wrong: number }> = {};
  for (const id of DASHBOARD_GAME_IDS) {
    const a = base.studyGameStats?.[id];
    const b = other.studyGameStats?.[id];
    if (!a && !b) continue;
    mergedGames[id] = {
      correct: Math.min(
        1_000_000,
        (a?.correct ?? 0) + (b?.correct ?? 0),
      ),
      wrong: Math.min(1_000_000, (a?.wrong ?? 0) + (b?.wrong ?? 0)),
    };
  }
  if (Object.keys(mergedGames).length > 0) {
    out.studyGameStats = mergedGames;
  }

  return out;
}

export function buildExportFile(current: LearnProgressState): LearnProgressExportFile {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    progress: current,
  };
}

export function stringifyLearnProgressExport(current: LearnProgressState): string {
  return JSON.stringify(buildExportFile(current), null, 2);
}

export function buildAppProgressExport(
  progress: LearnProgressState,
  yiddish: YiddishProgressState,
  savedWords?: SavedWordEntry[],
): AppProgressExportV2 {
  const hasYiddish =
    Object.keys(yiddish.completedSections).length > 0;
  const sw =
    savedWords && savedWords.length > 0
      ? mergeSavedWordLists([], savedWords)
      : undefined;
  return {
    schemaVersion: APP_BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    ...(hasYiddish ? { yiddishProgress: yiddish } : {}),
    ...(sw && sw.length ? { savedWords: sw } : {}),
  };
}

export function stringifyAppProgressExport(
  progress: LearnProgressState,
  yiddish: YiddishProgressState,
  savedWords?: SavedWordEntry[],
): string {
  return JSON.stringify(
    buildAppProgressExport(progress, yiddish, savedWords),
    null,
    2,
  );
}

export type ParseAppProgressResult =
  | {
      ok: true;
      progress: LearnProgressState;
      yiddish?: YiddishProgressState;
      /** Set only for schema 3 when `savedWords` key exists in JSON. */
      savedWords?: SavedWordEntry[];
    }
  | { ok: false; error: string };

/**
 * Accepts app backup schema v2/v3 (Hebrew + optional Yiddish + optional savedWords on v3)
 * or legacy v1 Learn-only wrappers from {@link parseLearnProgressJson}.
 */
export function parseAppProgressJson(text: string): ParseAppProgressResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "JSON root must be an object." };
  }
  const root = parsed as Record<string, unknown>;
  const sv = root.schemaVersion;
  if (sv === APP_BACKUP_SCHEMA_VERSION || sv === APP_BACKUP_SCHEMA_VERSION_V2) {
    const pr = root.progress;
    if (!pr || typeof pr !== "object") {
      return { ok: false, error: "Missing progress (app backup)." };
    }
    const progress = sanitizeLearnProgress(pr as Record<string, unknown>);
    const yRaw = root.yiddishProgress;
    let yiddish: YiddishProgressState | undefined;
    if (yRaw && typeof yRaw === "object") {
      yiddish = sanitizeYiddishProgress(yRaw as Record<string, unknown>);
    }
    let savedWords: SavedWordEntry[] | undefined;
    if (sv === APP_BACKUP_SCHEMA_VERSION && "savedWords" in root) {
      const parsedWords = sanitizeSavedWordsFromJson(root.savedWords);
      savedWords = parsedWords ?? [];
    }
    return { ok: true, progress, yiddish, savedWords };
  }
  const legacy = parseLearnProgressJson(text);
  if (!legacy.ok) return legacy;
  return { ok: true, progress: legacy.progress };
}
