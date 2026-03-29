/**
 * Build `ivrit_lr` / `ivrit_lv` shaped payloads so users can paste progress
 * from this app into `hebrew-v8.2.html` localStorage (Developer → download).
 */

import {
  LEGACY_LEARNER_STORAGE_KEY,
  readLegacyLearner,
} from "@/lib/legacy-storage-import";
import {
  mergeRootDrillMaps,
  normalizeStreak,
  parseRootDrillField,
  parseStreakFromJson,
  type LearnProgressState,
  type LearnStreak,
} from "@/lib/learn-progress";

/** Mirrors `mkL()` in hebrew-v8.2.html — required keys for a sane legacy learner. */
const GT_KEYS = [
  "mc",
  "fill",
  "tap",
  "match",
  "trans",
  "img",
  "num",
  "roots",
  "gram",
] as const;

function defaultGt(): Record<string, { c: number; w: number }> {
  const o: Record<string, { c: number; w: number }> = {};
  for (const k of GT_KEYS) o[k] = { c: 0, w: 0 };
  return o;
}

function defaultLearner(): Record<string, unknown> {
  return {
    vocab: {},
    gt: defaultGt(),
    cats: {},
    total: 0,
    rq: [],
    lastRev: 0,
    libWords: {},
    rootDrill: {},
    completedSections: {},
    streak: { current: 0, longest: 0, lastDay: "" },
  };
}

function parseGt(raw: unknown): Record<string, { c: number; w: number }> {
  const d = defaultGt();
  if (!raw || typeof raw !== "object") return d;
  for (const k of GT_KEYS) {
    const v = (raw as Record<string, unknown>)[k];
    if (!v || typeof v !== "object") continue;
    const o = v as { c?: unknown; w?: unknown };
    d[k] = {
      c:
        typeof o.c === "number" && Number.isFinite(o.c)
          ? Math.max(0, Math.floor(o.c))
          : 0,
      w:
        typeof o.w === "number" && Number.isFinite(o.w)
          ? Math.max(0, Math.floor(o.w))
          : 0,
    };
  }
  return d;
}

function coerceLearnerFromStorage(raw: unknown): Record<string, unknown> {
  const base = defaultLearner();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Record<string, unknown>;

  return {
    ...base,
    ...r,
    vocab:
      r.vocab && typeof r.vocab === "object"
        ? { ...(r.vocab as Record<string, unknown>) }
        : {},
    gt: parseGt(r.gt),
    cats:
      r.cats && typeof r.cats === "object"
        ? { ...(r.cats as Record<string, unknown>) }
        : {},
    total:
      typeof r.total === "number" && Number.isFinite(r.total)
        ? Math.floor(r.total)
        : 0,
    rq: Array.isArray(r.rq) ? [...r.rq] : [],
    lastRev:
      typeof r.lastRev === "number" && Number.isFinite(r.lastRev)
        ? Math.floor(r.lastRev)
        : 0,
    libWords:
      r.libWords && typeof r.libWords === "object"
        ? { ...(r.libWords as Record<string, unknown>) }
        : {},
    rootDrill:
      r.rootDrill && typeof r.rootDrill === "object"
        ? JSON.parse(JSON.stringify(r.rootDrill))
        : {},
    completedSections:
      r.completedSections && typeof r.completedSections === "object"
        ? { ...(r.completedSections as Record<string, unknown>) }
        : {},
    streak: normalizeStreak(parseStreakFromJson(r.streak)),
  };
}

function streakMergeForExport(
  legacy: LearnStreak,
  web: LearnStreak | undefined,
): LearnStreak {
  const a = normalizeStreak(legacy);
  const b = normalizeStreak(web);
  const longest = Math.max(a.longest, b.longest);
  if (!b.lastDay) return { ...a, longest };
  if (!a.lastDay) return { ...b, longest };
  if (b.lastDay > a.lastDay) return { ...b, longest };
  if (a.lastDay > b.lastDay) return { ...a, longest };
  return {
    current: Math.max(a.current, b.current),
    longest,
    lastDay: a.lastDay,
  };
}

/**
 * Merge {@link LearnProgressState} onto an existing legacy learner (if any in
 * this browser), producing an object suitable for `localStorage.ivrit_lr`.
 */
export function buildIvritLrLearnerValue(
  web: LearnProgressState,
): Record<string, unknown> {
  const blob = readLegacyLearner();
  const learner = coerceLearnerFromStorage(blob?.learner ?? null);

  const vocab = { ...(learner.vocab as Record<string, unknown>) };
  for (const [h, lv] of Object.entries(web.vocabLevels ?? {})) {
    const key = h.trim();
    if (!key) continue;
    const prev = vocab[key] as
      | { lv?: number; c?: number; w?: number }
      | undefined;
    const nextLv = Math.max(prev?.lv ?? 0, lv);
    vocab[key] = {
      lv: nextLv,
      c: typeof prev?.c === "number" ? prev.c : 0,
      w: typeof prev?.w === "number" ? prev.w : 0,
    };
  }
  learner.vocab = vocab;

  const cs = { ...(learner.completedSections as Record<string, unknown>) };
  for (const [id, v] of Object.entries(web.completedSections)) {
    if (v) cs[id] = true;
  }
  learner.completedSections = cs;

  const existingRd = parseRootDrillField(learner.rootDrill);
  const mergedRd = mergeRootDrillMaps(existingRd, web.rootDrill);
  learner.rootDrill = mergedRd ?? {};

  learner.streak = streakMergeForExport(
    normalizeStreak(parseStreakFromJson(learner.streak)),
    web.streak,
  );

  return learner;
}

export type IvritLegacyExportFile = {
  schemaVersion: 1;
  exportedAt: string;
  /**
   * Use this exact localStorage key in the HTML app (e.g. `ivrit_lr` or
   * `ivrit_lr__username` when the legacy session is scoped).
   */
  targetStorageKey: string;
  /** Value for `targetStorageKey` — stringify when pasting into localStorage. */
  ivrit_lr: Record<string, unknown>;
  /** Integer 1–4 for key `ivrit_lv` (and `ivrit_lv__user` when scoped). */
  ivrit_lv: number;
  instructions: string;
};

export function buildIvritLegacyExportFile(
  web: LearnProgressState,
): IvritLegacyExportFile {
  const learner = buildIvritLrLearnerValue(web);
  const lv = Math.min(4, Math.max(1, Math.floor(web.activeLevel || 1)));
  const blob = readLegacyLearner();
  const targetStorageKey =
    blob?.storageKey ?? LEGACY_LEARNER_STORAGE_KEY;

  const levelKeyHint =
    targetStorageKey === LEGACY_LEARNER_STORAGE_KEY
      ? "ivrit_lv"
      : `ivrit_lv__${targetStorageKey.slice((LEGACY_LEARNER_STORAGE_KEY + "__").length)}`;

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    targetStorageKey,
    ivrit_lr: learner,
    ivrit_lv: lv,
    instructions: `Open hebrew-v8.2.html in this browser. DevTools → Application → Local Storage. Set key "${targetStorageKey}" to JSON.stringify(this.ivrit_lr). Set the level key (usually "${levelKeyHint}" for your legacy session) to String(this.ivrit_lv). Reload the HTML app. If you use a scoped legacy account, keys must match the legacy app (see targetStorageKey). Merge keeps legacy-only fields when present; Next completions, vocab, rootDrill, and streak are unioned or maxed.`,
  };
}

export function stringifyIvritLegacyExport(web: LearnProgressState): string {
  return JSON.stringify(buildIvritLegacyExportFile(web), null, 2);
}
