import { YIDDISH_SECTION_IDS } from "@/data/yiddish-course";
import { getDeveloperModeBypass } from "@/lib/developer-mode";

/** Separate from Hebrew `LEARN_PROGRESS_KEY`. */
export const YIDDISH_PROGRESS_KEY = "hebrew-web-yiddish-v1";

export const YIDDISH_PROGRESS_EVENT = "hebrew-web-yiddish-progress";

/** Section checkpoint: ~72% correct on the pack (same spirit as foundation drills). */
export const YIDDISH_SECTION_PASS_PCT = 0.72;

export type YiddishProgressState = {
  completedSections: Record<string, boolean>;
};

export function createEmptyYiddishProgressState(): YiddishProgressState {
  return { completedSections: {} };
}

export function loadYiddishProgress(): YiddishProgressState {
  if (typeof window === "undefined") return createEmptyYiddishProgressState();
  try {
    const raw = localStorage.getItem(YIDDISH_PROGRESS_KEY);
    if (!raw) return createEmptyYiddishProgressState();
    const p = JSON.parse(raw) as Partial<YiddishProgressState>;
    const cs = p.completedSections;
    if (!cs || typeof cs !== "object") return createEmptyYiddishProgressState();
    const out: Record<string, boolean> = {};
    for (const id of YIDDISH_SECTION_IDS) {
      if ((cs as Record<string, unknown>)[id] === true) out[id] = true;
    }
    return { completedSections: out };
  } catch {
    return createEmptyYiddishProgressState();
  }
}

export function saveYiddishProgress(state: YiddishProgressState) {
  try {
    localStorage.setItem(YIDDISH_PROGRESS_KEY, JSON.stringify(state));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(YIDDISH_PROGRESS_EVENT));
    }
  } catch {
    /* quota */
  }
}

export function yiddishSectionUnlocked(
  state: YiddishProgressState,
  sectionId: string,
): boolean {
  const idx = YIDDISH_SECTION_IDS.indexOf(sectionId);
  if (idx < 0) return false;
  if (getDeveloperModeBypass()) return true;
  if (idx === 0) return true;
  const prev = YIDDISH_SECTION_IDS[idx - 1];
  return state.completedSections[prev] === true;
}

export function setYiddishSectionCompleted(
  state: YiddishProgressState,
  sectionId: string,
  completed: boolean,
): YiddishProgressState {
  if (!YIDDISH_SECTION_IDS.includes(sectionId)) return state;
  const cur = { ...state.completedSections };
  if (completed) cur[sectionId] = true;
  else delete cur[sectionId];
  if (Object.keys(cur).length === 0) {
    return { completedSections: {} };
  }
  return { completedSections: cur };
}

export function yiddishSectionsDoneCount(state: YiddishProgressState): number {
  return YIDDISH_SECTION_IDS.filter((id) => state.completedSections[id]).length;
}

export function resetYiddishProgressLocal(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(YIDDISH_PROGRESS_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(YIDDISH_PROGRESS_EVENT));
}

/** Import / backup: strip unknown keys; only known section ids. */
export function sanitizeYiddishProgress(
  raw: Record<string, unknown>,
): YiddishProgressState {
  const cs = raw.completedSections;
  const completed: Record<string, boolean> = {};
  if (cs && typeof cs === "object") {
    const o = cs as Record<string, unknown>;
    for (const id of YIDDISH_SECTION_IDS) {
      if (o[id] === true) completed[id] = true;
    }
  }
  return { completedSections: completed };
}

export function mergeYiddishProgressStates(
  base: YiddishProgressState,
  other: YiddishProgressState,
): YiddishProgressState {
  const completed = { ...base.completedSections };
  for (const id of YIDDISH_SECTION_IDS) {
    if (other.completedSections[id]) completed[id] = true;
  }
  return { completedSections: completed };
}
