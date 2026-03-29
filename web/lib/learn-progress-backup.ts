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
  parseRootDrillField,
  parseSpecialtyTierPassed,
  parseStreakFromJson,
  parseVocabLevelsField,
  type LearnProgressState,
  type LearnStreak,
} from "@/lib/learn-progress";
import type { YiddishProgressState } from "@/lib/yiddish-progress";
import { sanitizeYiddishProgress } from "@/lib/yiddish-progress";

/** Legacy single-blob export (Learn only). */
const SCHEMA_VERSION = 1;

/** App-wide backup: Hebrew course + optional Yiddish. */
export const APP_BACKUP_SCHEMA_VERSION = 2;

export type LearnProgressExportFile = {
  schemaVersion: number;
  exportedAt: string;
  progress: LearnProgressState;
};

export type AppProgressExportV2 = {
  schemaVersion: typeof APP_BACKUP_SCHEMA_VERSION;
  exportedAt: string;
  progress: LearnProgressState;
  /** Omitted or empty when learner has not started Yiddish. */
  yiddishProgress?: YiddishProgressState;
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
): AppProgressExportV2 {
  const hasYiddish =
    Object.keys(yiddish.completedSections).length > 0;
  return {
    schemaVersion: APP_BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
    ...(hasYiddish ? { yiddishProgress: yiddish } : {}),
  };
}

export function stringifyAppProgressExport(
  progress: LearnProgressState,
  yiddish: YiddishProgressState,
): string {
  return JSON.stringify(buildAppProgressExport(progress, yiddish), null, 2);
}

export type ParseAppProgressResult =
  | { ok: true; progress: LearnProgressState; yiddish?: YiddishProgressState }
  | { ok: false; error: string };

/**
 * Accepts schema v2 (Hebrew + optional Yiddish) or legacy v1 Learn-only
 * wrappers from {@link parseLearnProgressJson}.
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
  if (root.schemaVersion === APP_BACKUP_SCHEMA_VERSION) {
    const pr = root.progress;
    if (!pr || typeof pr !== "object") {
      return { ok: false, error: "Missing progress (schema v2)." };
    }
    const progress = sanitizeLearnProgress(pr as Record<string, unknown>);
    const yRaw = root.yiddishProgress;
    let yiddish: YiddishProgressState | undefined;
    if (yRaw && typeof yRaw === "object") {
      yiddish = sanitizeYiddishProgress(yRaw as Record<string, unknown>);
    }
    return { ok: true, progress, yiddish };
  }
  const legacy = parseLearnProgressJson(text);
  if (!legacy.ok) return legacy;
  return { ok: true, progress: legacy.progress };
}
