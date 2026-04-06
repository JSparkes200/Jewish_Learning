/**
 * Bookmarked Hebrew lemmas (legacy `ivrit_saved` + in-app saves).
 *
 * Security (client-only):
 * - Stored in `localStorage` only; nothing here calls the network.
 * - Strings are length-capped before persist; list length capped to limit parse/DoS in one tab.
 * - Render paths must use React text nodes (no `dangerouslySetInnerHTML`) for these fields.
 */

export const SAVED_WORDS_STORAGE_KEY = "hebrew-web-saved-words-v1";

/** Active Clerk user id (client-only); unset = guest bucket `SAVED_WORDS_STORAGE_KEY`. */
let savedWordsClerkUserId: string | null = null;

const SAVED_WORDS_GUEST_MIGRATED_PREFIX = "hebrew-web-saved-words-guest-migrated:";

export function setSavedWordsClerkUserId(
  userId: string | null | undefined,
): void {
  const next = userId?.trim() ? userId.trim() : null;
  if (next === savedWordsClerkUserId) return;
  savedWordsClerkUserId = next;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SAVED_WORDS_EVENT));
  }
}

/** @internal Tests reset scope between cases. */
export function __resetSavedWordsClerkUserIdForTests(): void {
  savedWordsClerkUserId = null;
}

function savedWordsLocalStorageKey(): string {
  return savedWordsClerkUserId
    ? `${SAVED_WORDS_STORAGE_KEY}:uid:${savedWordsClerkUserId}`
    : SAVED_WORDS_STORAGE_KEY;
}

/**
 * First sign-in: if the user bucket is empty but the guest list has rows, copy guest JSON once.
 */
export function maybeMigrateGuestSavedWordsToClerkUser(
  clerkUserId: string,
): void {
  if (typeof window === "undefined") return;
  const uid = clerkUserId.trim();
  if (!uid) return;
  const flag = SAVED_WORDS_GUEST_MIGRATED_PREFIX + uid;
  if (localStorage.getItem(flag)) return;

  const userKey = `${SAVED_WORDS_STORAGE_KEY}:uid:${uid}`;
  if (localStorage.getItem(userKey)) {
    localStorage.setItem(flag, "1");
    return;
  }

  const guestRaw = localStorage.getItem(SAVED_WORDS_STORAGE_KEY);
  if (!guestRaw || guestRaw === "[]") {
    localStorage.setItem(flag, "1");
    return;
  }

  try {
    localStorage.setItem(userKey, guestRaw);
  } catch {
    /* quota */
  }
  localStorage.setItem(flag, "1");
}

/** Max entries kept (trimmed on load/save). */
export const MAX_SAVED_WORDS = 400;

/** Per-field cap after trim (defense-in-depth vs huge pastes). */
export const MAX_WORD_FIELD_CHARS = 280;

export type SavedWordSource = "legacy-ivrit_saved" | "hebrew-web";

export type SavedWordEntry = {
  he: string;
  translit?: string;
  en?: string;
  colloquial?: string;
  source: SavedWordSource;
  importedAt: number;
};

function nonEmpty(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  return t.length ? t : undefined;
}

export function clampWordField(
  s: string,
  max = MAX_WORD_FIELD_CHARS,
): string {
  const t = s.replace(/\r\n/g, "\n").trim();
  if (t.length <= max) return t;
  return t.slice(0, max);
}

const ALLOWED_SOURCES = new Set<SavedWordSource>([
  "legacy-ivrit_saved",
  "hebrew-web",
]);

function parseSource(raw: unknown): SavedWordSource | null {
  if (raw === "legacy-ivrit_saved" || raw === "hebrew-web") return raw;
  return null;
}

/** One legacy row: `{ h, p, e, col? }` from hebrew-v8.2.html `rSaved`. */
export function legacyIvritSavedRowToEntry(
  row: unknown,
  importedAt: number,
): SavedWordEntry | null {
  if (!row || typeof row !== "object") return null;
  const o = row as Record<string, unknown>;
  const he = nonEmpty(o.h);
  if (!he) return null;
  const translit = nonEmpty(o.p);
  const en = nonEmpty(o.e);
  const colloquial = nonEmpty(o.col);
  return {
    he: clampWordField(he),
    ...(translit ? { translit: clampWordField(translit) } : {}),
    ...(en ? { en: clampWordField(en) } : {}),
    ...(colloquial ? { colloquial: clampWordField(colloquial) } : {}),
    source: "legacy-ivrit_saved",
    importedAt,
  };
}

export function parseLegacyIvritSavedArray(
  raw: unknown,
  importedAt: number,
): SavedWordEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: SavedWordEntry[] = [];
  for (const row of raw) {
    const one = legacyIvritSavedRowToEntry(row, importedAt);
    if (one) out.push(one);
  }
  return out;
}

/** Identity for dedupe: Hebrew + translit + English gloss (same as legacy merge). */
export function savedWordIdentityKey(
  w: Pick<SavedWordEntry, "he" | "translit" | "en">,
): string {
  return `${w.he}\u0000${w.translit ?? ""}\u0000${w.en ?? ""}`;
}

/** Dedupe by identity; later rows win. */
export function mergeSavedWordLists(
  base: SavedWordEntry[],
  additions: SavedWordEntry[],
): SavedWordEntry[] {
  const map = new Map<string, SavedWordEntry>();
  for (const w of base) {
    map.set(savedWordIdentityKey(w), w);
  }
  for (const w of additions) {
    map.set(savedWordIdentityKey(w), w);
  }
  return [...map.values()].sort((a, b) => b.importedAt - a.importedAt);
}

export const SAVED_WORDS_EVENT = "hebrew-web-saved-words-changed";

function capList(list: SavedWordEntry[]): SavedWordEntry[] {
  if (list.length <= MAX_SAVED_WORDS) return list;
  return [...list]
    .sort((a, b) => b.importedAt - a.importedAt)
    .slice(0, MAX_SAVED_WORDS);
}

export function loadSavedWords(): SavedWordEntry[] {
  if (typeof window === "undefined") return [];
  const storageKey = savedWordsLocalStorageKey();
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    const list = sanitizeSavedWordsFromJson(p) ?? [];
    const capped = capList(list);
    if (capped.length !== list.length) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(capped));
      } catch {
        /* ignore */
      }
    }
    return capped;
  } catch {
    return [];
  }
}

export function saveSavedWords(list: SavedWordEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      savedWordsLocalStorageKey(),
      JSON.stringify(capList(list)),
    );
  } catch {
    /* quota */
  }
  window.dispatchEvent(new CustomEvent(SAVED_WORDS_EVENT));
}

export function sanitizeSavedWordsFromJson(
  raw: unknown,
): SavedWordEntry[] | null {
  if (!Array.isArray(raw)) return null;
  const out: SavedWordEntry[] = [];
  const now = Date.now();
  let n = 0;
  for (const row of raw) {
    if (n >= MAX_SAVED_WORDS * 2) break;
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const src = parseSource(o.source);
    if (!src || !ALLOWED_SOURCES.has(src)) continue;
    const he = nonEmpty(o.he);
    if (!he) continue;
    const importedAt =
      typeof o.importedAt === "number" && o.importedAt > 0
        ? o.importedAt
        : now;
    const translit = nonEmpty(o.translit);
    const en = nonEmpty(o.en);
    const colloquial = nonEmpty(o.colloquial);
    out.push({
      he: clampWordField(he),
      ...(translit ? { translit: clampWordField(translit) } : {}),
      ...(en ? { en: clampWordField(en) } : {}),
      ...(colloquial ? { colloquial: clampWordField(colloquial) } : {}),
      source: src,
      importedAt,
    });
    n++;
  }
  return capList(out);
}

export function isIdentitySaved(
  list: SavedWordEntry[],
  identity: Pick<SavedWordEntry, "he" | "translit" | "en">,
): boolean {
  const key = savedWordIdentityKey(identity);
  return list.some((w) => savedWordIdentityKey(w) === key);
}

/**
 * Toggle bookmark for this Hebrew + optional gloss fields.
 * @returns `true` if the word is saved after the call.
 */
export function toggleSavedWordIdentity(input: {
  he: string;
  translit?: string;
  en?: string;
  colloquial?: string;
}): { saved: boolean; atCapacity?: boolean } {
  const he = clampWordField(input.he);
  if (!he) return { saved: false };

  const translit = input.translit
    ? clampWordField(input.translit)
    : undefined;
  const en = input.en ? clampWordField(input.en) : undefined;
  const colloquial = input.colloquial
    ? clampWordField(input.colloquial)
    : undefined;

  const list = loadSavedWords();
  const key = savedWordIdentityKey({ he, translit, en });
  if (isIdentitySaved(list, { he, translit, en })) {
    saveSavedWords(
      list.filter((w) => savedWordIdentityKey(w) !== key),
    );
    return { saved: false };
  }

  if (list.length >= MAX_SAVED_WORDS) {
    return { saved: false, atCapacity: true };
  }

  const entry: SavedWordEntry = {
    he,
    ...(translit ? { translit } : {}),
    ...(en ? { en } : {}),
    ...(colloquial ? { colloquial } : {}),
    source: "hebrew-web",
    importedAt: Date.now(),
  };
  saveSavedWords(mergeSavedWordLists(list, [entry]));
  return { saved: true };
}

export function removeSavedWordByIdentity(
  identity: Pick<SavedWordEntry, "he" | "translit" | "en">,
): void {
  const key = savedWordIdentityKey(identity);
  saveSavedWords(
    loadSavedWords().filter((w) => savedWordIdentityKey(w) !== key),
  );
}
