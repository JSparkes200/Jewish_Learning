/**
 * User-saved Hebrew snippets in the Next app (local only).
 * Legacy `ivrit_lib` → `mergePassagesIntoLibrarySaved` via `legacy-library-import`.
 */

export const LIBRARY_SAVED_KEY = "hebrew-web-library-saved-v1";

export const LIBRARY_SAVED_EVENT = "hebrew-web-library-saved";

export type SavedLibraryPassage = {
  id: string;
  title: string;
  /** Hebrew source text */
  he: string;
  /** Optional gloss / translation */
  en?: string;
  /** Learner-only memo (source link, deck name, etc.) — not shown as primary gloss */
  note?: string;
  createdAt: number;
};

function passageFromRecord(o: Record<string, unknown>): SavedLibraryPassage | null {
  const id = typeof o.id === "string" ? o.id : "";
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const he = typeof o.he === "string" ? o.he.trim() : "";
  if (!id || !title || !he) return null;
  const en = typeof o.en === "string" ? o.en.trim() : undefined;
  const note = typeof o.note === "string" ? o.note.trim() : undefined;
  const createdAt =
    typeof o.createdAt === "number" && o.createdAt > 0
      ? o.createdAt
      : Date.now();
  return {
    id,
    title,
    he,
    ...(en ? { en } : {}),
    ...(note ? { note } : {}),
    createdAt,
  };
}

export const LIBRARY_BACKUP_SCHEMA_VERSION = 1;

function randomId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function loadLibrarySaved(): SavedLibraryPassage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIBRARY_SAVED_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    if (!Array.isArray(p)) return [];
    const out: SavedLibraryPassage[] = [];
    for (const row of p) {
      if (!row || typeof row !== "object") continue;
      const one = passageFromRecord(row as Record<string, unknown>);
      if (one) out.push(one);
    }
    return out.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export type LibraryExportFile = {
  schemaVersion: number;
  exportedAt: string;
  passages: SavedLibraryPassage[];
};

export function stringifyLibrarySavedExport(): string {
  const payload: LibraryExportFile = {
    schemaVersion: LIBRARY_BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    passages: loadLibrarySaved(),
  };
  return JSON.stringify(payload, null, 2);
}

export function stringifyLibraryBackupFromPassages(
  passages: SavedLibraryPassage[],
): string {
  const payload: LibraryExportFile = {
    schemaVersion: LIBRARY_BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    passages,
  };
  return JSON.stringify(payload, null, 2);
}

export type ParseLibraryBackupResult =
  | { ok: true; passages: SavedLibraryPassage[] }
  | { ok: false; error: string };

/**
 * Accepts our export wrapper, a bare array, or `{ passages: [...] }`.
 */
export function parseLibrarySavedBackupJson(text: string): ParseLibraryBackupResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }
  let rows: unknown[];
  if (Array.isArray(parsed)) {
    rows = parsed;
  } else if (parsed && typeof parsed === "object") {
    const p = (parsed as Record<string, unknown>).passages;
    if (Array.isArray(p)) rows = p;
    else return { ok: false, error: "Expected an array or { passages: [...] }." };
  } else {
    return { ok: false, error: "JSON root must be an array or object." };
  }
  const out: SavedLibraryPassage[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const one = passageFromRecord(row as Record<string, unknown>);
    if (one) out.push(one);
  }
  return { ok: true, passages: out };
}

export function replaceLibrarySavedList(passages: SavedLibraryPassage[]): void {
  const list = passages.filter((x) => x.id && x.title && x.he);
  list.sort((a, b) => b.createdAt - a.createdAt);
  persist(list);
}

function persist(list: SavedLibraryPassage[]): void {
  try {
    localStorage.setItem(LIBRARY_SAVED_KEY, JSON.stringify(list));
  } catch {
    /* quota */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(LIBRARY_SAVED_EVENT));
  }
}

export function addLibrarySaved(entry: {
  title: string;
  he: string;
  en?: string;
  note?: string;
}): SavedLibraryPassage {
  const list = loadLibrarySaved();
  const item: SavedLibraryPassage = {
    id: randomId(),
    title: entry.title.trim(),
    he: entry.he.trim(),
    ...(entry.en?.trim() ? { en: entry.en.trim() } : {}),
    ...(entry.note?.trim() ? { note: entry.note.trim() } : {}),
    createdAt: Date.now(),
  };
  list.unshift(item);
  persist(list);
  return item;
}

export function patchLibrarySaved(
  id: string,
  patch: { en?: string; note?: string },
): SavedLibraryPassage | null {
  const list = loadLibrarySaved();
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const cur = list[i]!;
  const updated: SavedLibraryPassage = { ...cur };
  if (patch.en !== undefined) {
    const t = patch.en.trim();
    if (t) updated.en = t;
    else delete updated.en;
  }
  if (patch.note !== undefined) {
    const t = patch.note.trim();
    if (t) updated.note = t;
    else delete updated.note;
  }
  const out = [...list];
  out[i] = updated;
  persist(out);
  return updated;
}

export function removeLibrarySaved(id: string): void {
  const list = loadLibrarySaved().filter((x) => x.id !== id);
  persist(list);
}

export function clearLibrarySaved(): void {
  persist([]);
}

/**
 * Add passages by id; skips ids already present (idempotent merge / re-import).
 */
/** Pure merge by passage id (for CLI / server; no `localStorage`). */
export function mergePassageArraysById(
  current: SavedLibraryPassage[],
  newcomers: SavedLibraryPassage[],
): { merged: SavedLibraryPassage[]; added: number; skipped: number } {
  const existingIds = new Set(current.map((x) => x.id));
  let added = 0;
  let skipped = 0;
  const merged = [...current];
  for (const item of newcomers) {
    if (!item.id || !item.title || !item.he) continue;
    if (existingIds.has(item.id)) {
      skipped++;
      continue;
    }
    existingIds.add(item.id);
    merged.push(item);
    added++;
  }
  merged.sort((a, b) => b.createdAt - a.createdAt);
  return { merged, added, skipped };
}

export function mergePassagesIntoLibrarySaved(
  newcomers: SavedLibraryPassage[],
): { added: number; skipped: number } {
  const current = loadLibrarySaved();
  const { merged, added, skipped } = mergePassageArraysById(
    current,
    newcomers,
  );
  persist(merged);
  return { added, skipped };
}
