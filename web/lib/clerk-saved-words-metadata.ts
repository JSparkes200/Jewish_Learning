/**
 * Clerk privateMetadata mirror for saved lemmas (size-capped; full list stays in localStorage).
 */

import {
  clampWordField,
  type SavedWordEntry,
} from "@/lib/saved-words";

/** Key on Clerk `privateMetadata` (server read/write only). */
export const CLERK_PRIVATE_SAVED_WORDS_KEY = "hebrewWebSavedWordsV1" as const;

export type ClerkSavedWordsMetadataV1 = {
  v: 1;
  updatedAt: number;
  items: SavedWordEntry[];
};

const MAX_ITEMS_IN_METADATA = 55;
/** Clerk private metadata must stay small; leave headroom below ~8KB. */
export const MAX_METADATA_JSON_CHARS = 7200;

export function trimSavedWordsForClerkMetadata(
  list: SavedWordEntry[],
): SavedWordEntry[] {
  const sorted = [...list].sort((a, b) => b.importedAt - a.importedAt);
  const capped = sorted.slice(0, MAX_ITEMS_IN_METADATA).map((w) => ({
    ...w,
    he: clampWordField(w.he),
    translit: w.translit ? clampWordField(w.translit) : undefined,
    en: w.en ? clampWordField(w.en) : undefined,
    colloquial: w.colloquial ? clampWordField(w.colloquial) : undefined,
  }));
  return capped;
}

export function parseClerkSavedWordsMetadata(
  raw: unknown,
): SavedWordEntry[] | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1) return null;
  if (typeof o.updatedAt !== "number") return null;
  if (!Array.isArray(o.items)) return null;
  const out: SavedWordEntry[] = [];
  for (const row of o.items) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const he = typeof r.he === "string" ? clampWordField(r.he) : "";
    if (!he) continue;
    const source =
      r.source === "legacy-ivrit_saved" || r.source === "hebrew-web"
        ? r.source
        : "hebrew-web";
    const importedAt =
      typeof r.importedAt === "number" && r.importedAt > 0
        ? r.importedAt
        : o.updatedAt;
    out.push({
      he,
      ...(typeof r.translit === "string"
        ? { translit: clampWordField(r.translit) }
        : {}),
      ...(typeof r.en === "string" ? { en: clampWordField(r.en) } : {}),
      ...(typeof r.colloquial === "string"
        ? { colloquial: clampWordField(r.colloquial) }
        : {}),
      source,
      importedAt,
    });
  }
  return out;
}

export function buildClerkMetadataPayload(
  list: SavedWordEntry[],
): ClerkSavedWordsMetadataV1 | null {
  const items = trimSavedWordsForClerkMetadata(list);
  const payload: ClerkSavedWordsMetadataV1 = {
    v: 1,
    updatedAt: Date.now(),
    items,
  };
  const json = JSON.stringify(payload);
  if (json.length <= MAX_METADATA_JSON_CHARS) return payload;
  let n = items.length;
  while (n > 5) {
    n -= 1;
    const smaller: ClerkSavedWordsMetadataV1 = {
      v: 1,
      updatedAt: Date.now(),
      items: items.slice(0, n),
    };
    if (JSON.stringify(smaller).length <= MAX_METADATA_JSON_CHARS) return smaller;
  }
  return null;
}
