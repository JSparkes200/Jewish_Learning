/**
 * Phase A: merge a **legacy localStorage JSON dump** (from `hebrew-v8.2.html`)
 * into the Next **app backup** format (schema 3) and optional **library** export.
 *
 * Run via `npm run merge:legacy-backup` or import for tests.
 */

import { createEmptyLearnProgressState } from "@/lib/learn-progress";
import {
  mergePassageArraysById,
  parseLibrarySavedBackupJson,
  stringifyLibraryBackupFromPassages,
} from "@/lib/library-saved";
import {
  parseAppProgressJson,
  stringifyAppProgressExport,
} from "@/lib/learn-progress-backup";
import {
  applyLegacyLearnerToProgress,
  type LegacyLearnerShape,
} from "@/lib/legacy-storage-import";
import { parseLegacyLibraryPassages } from "@/lib/legacy-library-import";
import {
  mergeSavedWordLists,
  parseLegacyIvritSavedArray,
  type SavedWordEntry,
} from "@/lib/saved-words";
import { createEmptyYiddishProgressState } from "@/lib/yiddish-progress";

export type SavedWordsPortMode = "port" | "drop";

export type PhaseAMergeInput = {
  /** Parsed root object: keys like `ivrit_lr`, `ivrit_lr__user`, `ivrit_session_v1`, … */
  legacyDump: Record<string, unknown>;
  /** Optional existing Next app backup JSON (v2 or v3). */
  baseAppJsonText?: string | null;
  /** Optional existing library backup JSON (`LibraryExportFile` or bare array). */
  baseLibraryJsonText?: string | null;
  savedWords: SavedWordsPortMode;
};

export type PhaseAMergeStats = {
  legacySessionUser: string;
  legacyLearnerKeyUsed: string | null;
  legacyLevel: number | null;
  /** Net new section completions attributed to legacy overlay (approximate). */
  sectionsNewlyCompleted: number;
  libraryLegacyRows: number;
  libraryMergedTotal: number;
  savedWordsPorted: number;
  /** True if dump contained a non-empty `ivrit_openai_key` (not copied to output). */
  legacyOpenaiKeyPresent: boolean;
};

export type PhaseAMergeOutput =
  | {
      ok: true;
      appJson: string;
      libraryJson: string | null;
      stats: PhaseAMergeStats;
    }
  | { ok: false; error: string };

function unwrapStoredJson(v: unknown): unknown {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v) as unknown;
  } catch {
    return v;
  }
}

function sessionUserFromDump(dump: Record<string, unknown>): string {
  const raw = dump.ivrit_session_v1;
  if (typeof raw !== "string") return "";
  return raw.trim();
}

function pickLegacyValue(
  dump: Record<string, unknown>,
  baseKey: string,
  user: string,
): unknown {
  const keys = user ? [`${baseKey}__${user}`, baseKey] : [baseKey];
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(dump, k)) {
      return unwrapStoredJson(dump[k]);
    }
  }
  return undefined;
}

function legacyKeyUsed(
  dump: Record<string, unknown>,
  baseKey: string,
  user: string,
): string | null {
  const keys = user ? [`${baseKey}__${user}`, baseKey] : [baseKey];
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(dump, k)) return k;
  }
  return null;
}

function isLegacyLearnerShape(v: unknown): v is LegacyLearnerShape {
  return v != null && typeof v === "object";
}

function countCompletedSections(p: { completedSections: Record<string, boolean> }): number {
  return Object.values(p.completedSections).filter(Boolean).length;
}

export function mergePhaseALegacyDump(input: PhaseAMergeInput): PhaseAMergeOutput {
  const user = sessionUserFromDump(input.legacyDump);
  const lrRaw = pickLegacyValue(input.legacyDump, "ivrit_lr", user);
  const lvRaw = pickLegacyValue(input.legacyDump, "ivrit_lv", user);
  const libRaw = pickLegacyValue(input.legacyDump, "ivrit_lib", user);
  const savedRaw = pickLegacyValue(input.legacyDump, "ivrit_saved", user);
  const openaiRaw = pickLegacyValue(input.legacyDump, "ivrit_openai_key", user);

  const legacyOpenaiKeyPresent =
    openaiRaw != null && String(openaiRaw).trim().length > 0;

  const legacyLearnerKeyUsed = lrRaw !== undefined
    ? legacyKeyUsed(input.legacyDump, "ivrit_lr", user)
    : null;

  let legacyLevel: number | null = null;
  if (typeof lvRaw === "number" && lvRaw >= 1 && lvRaw <= 4) {
    legacyLevel = Math.floor(lvRaw);
  } else if (typeof lvRaw === "string") {
    const n = parseInt(lvRaw, 10);
    if (n >= 1 && n <= 4) legacyLevel = n;
  }

  let progress = createEmptyLearnProgressState();
  let yiddish = createEmptyYiddishProgressState();
  let baseSavedWords: SavedWordEntry[] = [];

  if (input.baseAppJsonText?.trim()) {
    const p = parseAppProgressJson(input.baseAppJsonText.trim());
    if (!p.ok) return { ok: false, error: `Base app JSON: ${p.error}` };
    progress = p.progress;
    yiddish = p.yiddish ?? createEmptyYiddishProgressState();
    if (p.savedWords !== undefined) {
      baseSavedWords = p.savedWords;
    }
  }

  let sectionsNewlyCompleted = 0;
  if (isLegacyLearnerShape(lrRaw)) {
    const before = countCompletedSections(progress);
    progress = applyLegacyLearnerToProgress(progress, lrRaw, legacyLevel);
    sectionsNewlyCompleted = Math.max(
      0,
      countCompletedSections(progress) - before,
    );
  }

  const importedAt = Date.now();
  let savedWordsOut: SavedWordEntry[] = [...baseSavedWords];
  let savedWordsPorted = 0;
  if (input.savedWords === "port" && Array.isArray(savedRaw)) {
    const fromLegacy = parseLegacyIvritSavedArray(savedRaw, importedAt);
    savedWordsPorted = fromLegacy.length;
    savedWordsOut = mergeSavedWordLists(savedWordsOut, fromLegacy);
  } else {
    savedWordsOut = [...baseSavedWords];
  }

  let libraryPassages = parseLegacyLibraryPassages(
    Array.isArray(libRaw) ? libRaw : [],
  );
  const libraryLegacyRows = Array.isArray(libRaw) ? libRaw.length : 0;

  if (input.baseLibraryJsonText?.trim()) {
    const lp = parseLibrarySavedBackupJson(input.baseLibraryJsonText.trim());
    if (!lp.ok) return { ok: false, error: `Base library JSON: ${lp.error}` };
    const { merged } = mergePassageArraysById(lp.passages, libraryPassages);
    libraryPassages = merged;
  }

  const libraryMergedTotal = libraryPassages.length;
  const libraryJson =
    libraryLegacyRows > 0 || input.baseLibraryJsonText?.trim()
      ? stringifyLibraryBackupFromPassages(libraryPassages)
      : null;

  const appJson = stringifyAppProgressExport(
    progress,
    yiddish,
    savedWordsOut.length ? savedWordsOut : undefined,
  );

  return {
    ok: true,
    appJson,
    libraryJson,
    stats: {
      legacySessionUser: user,
      legacyLearnerKeyUsed,
      legacyLevel,
      sectionsNewlyCompleted,
      libraryLegacyRows,
      libraryMergedTotal,
      savedWordsPorted,
      legacyOpenaiKeyPresent,
    },
  };
}
