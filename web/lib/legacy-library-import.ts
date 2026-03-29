/**
 * One-way import of legacy HTML app Library passages from localStorage `ivrit_lib`.
 * Legacy scopes to `ivrit_lib__<username>` when `ivrit_session_v1` is set (same as learn keys).
 */

import { LEGACY_SESSION_KEY } from "@/lib/legacy-storage-import";
import {
  mergePassagesIntoLibrarySaved,
  type SavedLibraryPassage,
} from "@/lib/library-saved";

export const LEGACY_IVIRT_LIB_KEY = "ivrit_lib";

function readLegacySessionUser(): string {
  if (typeof window === "undefined") return "";
  try {
    return (localStorage.getItem(LEGACY_SESSION_KEY) ?? "").trim();
  } catch {
    return "";
  }
}

function parseStorageArray(raw: string | null): {
  ok: true;
  data: unknown[];
} | {
  ok: false;
  error: string;
} {
  if (raw == null || raw === "")
    return { ok: true, data: [] };
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return { ok: false, error: "Not a JSON array" };
    return { ok: true, data: v };
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
}

/** Prefer scoped key when a legacy session username exists (matches hebrew-v8.2.html). */
export function readLegacyLibrarySource(): {
  storageKey: string | null;
  rawItems: unknown[] | null;
  parseError: string | null;
  /** localStorage had a value for the chosen key (even `[]`) */
  keyExists: boolean;
} {
  if (typeof window === "undefined") {
    return {
      storageKey: null,
      rawItems: null,
      parseError: null,
      keyExists: false,
    };
  }
  const user = readLegacySessionUser();
  if (user) {
    const scopedKey = `${LEGACY_IVIRT_LIB_KEY}__${user}`;
    try {
      const scopedRaw = localStorage.getItem(scopedKey);
      const scoped = parseStorageArray(scopedRaw);
      if (!scoped.ok)
        return {
          storageKey: scopedKey,
          rawItems: null,
          parseError: scoped.error,
          keyExists: scopedRaw != null,
        };
      if (scopedRaw != null) {
        return {
          storageKey: scopedKey,
          rawItems: scoped.data,
          parseError: null,
          keyExists: true,
        };
      }
    } catch {
      /* ignore */
    }
  }
  try {
    const baseRaw = localStorage.getItem(LEGACY_IVIRT_LIB_KEY);
    const base = parseStorageArray(baseRaw);
    if (!base.ok)
      return {
        storageKey: LEGACY_IVIRT_LIB_KEY,
        rawItems: null,
        parseError: base.error,
        keyExists: baseRaw != null,
      };
    return {
      storageKey: LEGACY_IVIRT_LIB_KEY,
      rawItems: base.data,
      parseError: null,
      keyExists: baseRaw != null,
    };
  } catch {
    return {
      storageKey: null,
      rawItems: null,
      parseError: "Could not read localStorage",
      keyExists: false,
    };
  }
}

const LEGACY_NO_TRANSLATION = "(No translation provided)";

/** Map one legacy row (hebrew-v8.2.html save shape) → SavedLibraryPassage. */
export function legacyLibraryRowToPassage(
  row: unknown,
  orderIndex: number,
  baseTime: number,
): SavedLibraryPassage | null {
  if (!row || typeof row !== "object") return null;
  const o = row as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id.trim() : "";
  const title = typeof o.label === "string" ? o.label.trim() : "";
  const he = typeof o.h === "string" ? o.h.trim() : "";
  if (!id || !title || !he) return null;
  let en: string | undefined;
  if (typeof o.e === "string") {
    const t = o.e.trim();
    if (t && t !== LEGACY_NO_TRANSLATION) en = t;
  }
  const createdAt = baseTime + orderIndex;
  return {
    id,
    title,
    he,
    ...(en ? { en } : {}),
    createdAt,
  };
}

export function parseLegacyLibraryPassages(
  rawItems: unknown[],
): SavedLibraryPassage[] {
  const baseTime = Date.now() - rawItems.length * 1000;
  const out: SavedLibraryPassage[] = [];
  rawItems.forEach((row, i) => {
    const p = legacyLibraryRowToPassage(row, i, baseTime);
    if (p) out.push(p);
  });
  return out;
}

export type LegacyLibraryImportPreview = {
  found: boolean;
  storageKey: string | null;
  parseError: string | null;
  legacyCount: number;
  /** Rows that could be mapped to passages */
  mappableCount: number;
  sampleTitles: string[];
};

export function previewLegacyLibraryImport(): LegacyLibraryImportPreview {
  const { storageKey, rawItems, parseError, keyExists } =
    readLegacyLibrarySource();
  if (parseError) {
    return {
      found: true,
      storageKey,
      parseError,
      legacyCount: 0,
      mappableCount: 0,
      sampleTitles: [],
    };
  }
  if (!keyExists) {
    return {
      found: false,
      storageKey: null,
      parseError: null,
      legacyCount: 0,
      mappableCount: 0,
      sampleTitles: [],
    };
  }
  const items = rawItems ?? [];
  if (items.length === 0) {
    return {
      found: true,
      storageKey,
      parseError: null,
      legacyCount: 0,
      mappableCount: 0,
      sampleTitles: [],
    };
  }
  const parsed = parseLegacyLibraryPassages(items);
  const sampleTitles = parsed.slice(0, 5).map((p) => p.title);
  return {
    found: true,
    storageKey,
    parseError: null,
    legacyCount: items.length,
    mappableCount: parsed.length,
    sampleTitles,
  };
}

export function mergeLegacyLibraryIntoWebApp(): {
  ok: boolean;
  message: string;
  added: number;
  skipped: number;
} {
  if (typeof window === "undefined") {
    return { ok: false, message: "Browser only.", added: 0, skipped: 0 };
  }
  const { storageKey, rawItems, parseError, keyExists } =
    readLegacyLibrarySource();
  if (parseError) {
    return {
      ok: false,
      message: `Could not read legacy library: ${parseError}`,
      added: 0,
      skipped: 0,
    };
  }
  if (!keyExists || !rawItems || rawItems.length === 0) {
    return {
      ok: false,
      message: "No legacy library data (ivrit_lib) in this browser.",
      added: 0,
      skipped: 0,
    };
  }
  const passages = parseLegacyLibraryPassages(rawItems);
  if (passages.length === 0) {
    return {
      ok: false,
      message:
        "Legacy key exists but no passages could be parsed (expected id, label, h).",
      added: 0,
      skipped: 0,
    };
  }
  const { added, skipped } = mergePassagesIntoLibrarySaved(passages);
  return {
    ok: true,
    message: `Merged from ${storageKey ?? LEGACY_IVIRT_LIB_KEY}.`,
    added,
    skipped,
  };
}
