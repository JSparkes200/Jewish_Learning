/**
 * One-way import from legacy `hebrew-v8.2.html` localStorage into the Next app.
 * Legacy uses `ivrit_lr` (guest) or `ivrit_lr__<username>` when `ivrit_session_v1` is set.
 */

import { COURSE_LEVELS, getSectionsForLevel } from "@/data/course";
import {
  loadLearnProgress,
  mergeRootDrillMaps,
  mergeStreakWithLegacy,
  mergeVocabLevelMaps,
  parseRootDrillField,
  saveLearnProgress,
  type LearnProgressState,
} from "@/lib/learn-progress";

export const LEGACY_LEARNER_STORAGE_KEY = "ivrit_lr";
export const LEGACY_LEVEL_STORAGE_KEY = "ivrit_lv";
export const LEGACY_SESSION_KEY = "ivrit_session_v1";

type LegacyLearnerShape = {
  completedSections?: Record<string, boolean | string | number>;
  streak?: unknown;
  /** Per-lemma stats; mastery level in `.lv` */
  vocab?: unknown;
  /** Graduated root drill counts */
  rootDrill?: unknown;
};

/** Map legacy `learner.vocab` (hebrew → { lv, … }) to flat levels. */
export function parseLegacyVocabFromLearner(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!v || typeof v !== "object") return out;
  for (const [key, val] of Object.entries(v)) {
    const h = key.trim();
    if (!h) continue;
    if (!val || typeof val !== "object") continue;
    const lvRaw = (val as { lv?: unknown }).lv;
    if (typeof lvRaw !== "number" || !Number.isFinite(lvRaw)) continue;
    const lv = Math.min(10, Math.max(0, Math.floor(lvRaw)));
    out[h] = Math.max(out[h] ?? 0, lv);
  }
  return out;
}

function knownSectionIdSet(): Set<string> {
  const s = new Set<string>();
  for (const L of COURSE_LEVELS) {
    for (const sec of getSectionsForLevel(L.n)) {
      s.add(sec.id);
    }
  }
  return s;
}

const KNOWN_IDS = knownSectionIdSet();

function truthyLegacyCompletion(v: unknown): boolean {
  return v === true || v === "true" || v === 1;
}

function readSessionUser(): string {
  if (typeof window === "undefined") return "";
  try {
    return (localStorage.getItem(LEGACY_SESSION_KEY) ?? "").trim();
  } catch {
    return "";
  }
}

function parseLearnerAtKey(storageKey: string): LegacyLearnerShape | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (data && typeof data === "object") return data as LegacyLearnerShape;
  } catch {
    /* ignore */
  }
  return null;
}

/** Prefer scoped learner key when a legacy session exists. */
export function readLegacyLearner(): {
  storageKey: string;
  learner: LegacyLearnerShape;
} | null {
  if (typeof window === "undefined") return null;
  const user = readSessionUser();
  if (user) {
    const scopedKey = `${LEGACY_LEARNER_STORAGE_KEY}__${user}`;
    const scoped = parseLearnerAtKey(scopedKey);
    if (scoped) return { storageKey: scopedKey, learner: scoped };
  }
  const base = parseLearnerAtKey(LEGACY_LEARNER_STORAGE_KEY);
  if (base) return { storageKey: LEGACY_LEARNER_STORAGE_KEY, learner: base };
  return null;
}

function readLegacyLevelValue(): { storageKey: string; level: number } | null {
  if (typeof window === "undefined") return null;
  const user = readSessionUser();
  const tryKey = (key: string): number | null => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return null;
      const v = JSON.parse(raw) as unknown;
      if (typeof v === "number" && v >= 1 && v <= 4) return v;
    } catch {
      /* ignore */
    }
    return null;
  };
  if (user) {
    const sk = `${LEGACY_LEVEL_STORAGE_KEY}__${user}`;
    const lv = tryKey(sk);
    if (lv != null) return { storageKey: sk, level: lv };
  }
  const lv2 = tryKey(LEGACY_LEVEL_STORAGE_KEY);
  if (lv2 != null)
    return { storageKey: LEGACY_LEVEL_STORAGE_KEY, level: lv2 };
  return null;
}

export type LegacyImportPreview = {
  /** Legacy learner blob found */
  found: boolean;
  /** Which localStorage key was read */
  sourceKey: string | null;
  parseError: string | null;
  /** completedSections[id] truthy in legacy */
  legacyMarkedCount: number;
  /** Those ids that exist in the Next course */
  knownOverlapCount: number;
  /** Would become true after merge (legacy true, not yet true in Next) */
  newlyCompletedCount: number;
  /** Sample ids in legacy but not in Next course data */
  unknownSampleIds: string[];
  legacyLevel: number | null;
  legacyLevelKey: string | null;
  /** Entries in legacy `vocab` with a numeric `lv` */
  legacyVocabLemmas: number;
  /** Those with lv ≥ 2 (legacy “mastered” for gates) */
  legacyVocabMastered: number;
  /** Distinct root keys in legacy `rootDrill` */
  legacyRootDrillFamilies: number;
  /** Total word-form slots with a stored count in legacy `rootDrill` */
  legacyRootDrillFormEntries: number;
};

export function previewLegacyLearnImport(
  current: LearnProgressState,
): LegacyImportPreview {
  const empty: LegacyImportPreview = {
    found: false,
    sourceKey: null,
    parseError: null,
    legacyMarkedCount: 0,
    knownOverlapCount: 0,
    newlyCompletedCount: 0,
    unknownSampleIds: [],
    legacyLevel: null,
    legacyLevelKey: null,
    legacyVocabLemmas: 0,
    legacyVocabMastered: 0,
    legacyRootDrillFamilies: 0,
    legacyRootDrillFormEntries: 0,
  };

  if (typeof window === "undefined") return empty;

  const blob = readLegacyLearner();
  const lvInfo = readLegacyLevelValue();

  if (!blob) return empty;

  const cs = blob.learner.completedSections;
  if (!cs || typeof cs !== "object") {
    return {
      ...empty,
      found: true,
      sourceKey: blob.storageKey,
      parseError: "No completedSections object in legacy learner",
    };
  }

  const unknownSampleIds: string[] = [];
  let legacyMarkedCount = 0;
  let knownOverlapCount = 0;
  let newlyCompletedCount = 0;

  for (const [id, val] of Object.entries(cs)) {
    if (!truthyLegacyCompletion(val)) continue;
    legacyMarkedCount++;
    if (KNOWN_IDS.has(id)) {
      knownOverlapCount++;
      if (!current.completedSections[id]) newlyCompletedCount++;
    } else if (unknownSampleIds.length < 16) {
      unknownSampleIds.push(id);
    }
  }

  const legacyVocab = parseLegacyVocabFromLearner(blob.learner.vocab);
  let legacyVocabMastered = 0;
  for (const lv of Object.values(legacyVocab)) {
    if (lv >= 2) legacyVocabMastered++;
  }

  const legacyRd = parseRootDrillField(blob.learner.rootDrill);
  let legacyRootDrillFamilies = 0;
  let legacyRootDrillFormEntries = 0;
  if (legacyRd) {
    legacyRootDrillFamilies = Object.keys(legacyRd).length;
    for (const inner of Object.values(legacyRd)) {
      legacyRootDrillFormEntries += Object.keys(inner).length;
    }
  }

  return {
    found: true,
    sourceKey: blob.storageKey,
    parseError: null,
    legacyMarkedCount,
    knownOverlapCount,
    newlyCompletedCount,
    unknownSampleIds,
    legacyLevel: lvInfo?.level ?? null,
    legacyLevelKey: lvInfo?.storageKey ?? null,
    legacyVocabLemmas: Object.keys(legacyVocab).length,
    legacyVocabMastered,
    legacyRootDrillFamilies,
    legacyRootDrillFormEntries,
  };
}

export type LegacyImportResult = {
  ok: boolean;
  message: string;
  sectionsMerged: number;
  activeLevelBefore: number;
  activeLevelAfter: number;
  /** Lemma keys merged from legacy `vocab` */
  vocabLemmasMerged: number;
};

/**
 * Merge legacy `completedSections` into Next progress (OR: keep existing true flags).
 * `activeLevel` becomes max(current, legacy level) when legacy level is present.
 */
export function mergeLegacyLearnIntoWebApp(): LegacyImportResult {
  if (typeof window === "undefined") {
    return {
      ok: false,
      message: "Not in browser",
      sectionsMerged: 0,
      activeLevelBefore: 1,
      activeLevelAfter: 1,
      vocabLemmasMerged: 0,
    };
  }

  const current = loadLearnProgress();
  const beforeLevel = current.activeLevel;
  const blob = readLegacyLearner();
  if (!blob) {
    return {
      ok: false,
      message: `No legacy learner found at ${LEGACY_LEARNER_STORAGE_KEY} or scoped key.`,
      sectionsMerged: 0,
      activeLevelBefore: beforeLevel,
      activeLevelAfter: beforeLevel,
      vocabLemmasMerged: 0,
    };
  }

  const cs = blob.learner.completedSections;
  if (!cs || typeof cs !== "object") {
    return {
      ok: false,
      message: "Legacy blob has no completedSections",
      sectionsMerged: 0,
      activeLevelBefore: beforeLevel,
      activeLevelAfter: beforeLevel,
      vocabLemmasMerged: 0,
    };
  }

  const nextCompleted = { ...current.completedSections };
  let sectionsMerged = 0;
  for (const [id, val] of Object.entries(cs)) {
    if (!truthyLegacyCompletion(val)) continue;
    if (!KNOWN_IDS.has(id)) continue;
    if (!nextCompleted[id]) sectionsMerged++;
    nextCompleted[id] = true;
  }

  const lvInfo = readLegacyLevelValue();
  let activeLevel = current.activeLevel;
  if (lvInfo != null) {
    activeLevel = Math.min(4, Math.max(current.activeLevel, lvInfo.level));
  }

  const streak = mergeStreakWithLegacy(current, blob.learner.streak);
  const legacyVocab = parseLegacyVocabFromLearner(blob.learner.vocab);
  const mergedVocab = mergeVocabLevelMaps(current.vocabLevels, legacyVocab);
  const legacyRd = parseRootDrillField(blob.learner.rootDrill);
  const mergedRd = mergeRootDrillMaps(current.rootDrill, legacyRd);
  const mergedRootDrill = !!legacyRd && Object.keys(legacyRd).length > 0;

  const next: LearnProgressState = {
    ...current,
    completedSections: nextCompleted,
    activeLevel,
  };
  if (streak.longest > 0 || streak.current > 0 || streak.lastDay !== "") {
    next.streak = streak;
  }
  if (mergedVocab) next.vocabLevels = mergedVocab;
  if (mergedRd) next.rootDrill = mergedRd;

  saveLearnProgress(next);

  return {
    ok: true,
    message: `Merged from ${blob.storageKey}${lvInfo ? `; active level ≥ legacy (${lvInfo.level})` : ""}.${mergedRootDrill ? " Root drill counts merged (max per form)." : ""}`,
    sectionsMerged,
    activeLevelBefore: beforeLevel,
    activeLevelAfter: activeLevel,
    vocabLemmasMerged: Object.keys(legacyVocab).length,
  };
}
