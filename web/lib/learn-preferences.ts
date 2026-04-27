/**
 * Global learner preferences — stored separately from progress so they never
 * get overwritten by a JSON import and don't bloat the progress backup.
 */

export const PREFERENCES_KEY = "hebrew-web-preferences-v1";
export const PREFERENCES_EVENT = "hebrew-web-preferences-changed";

export type LearnPreferences = {
  /** Show vowel points (nikkud) by default in drills. Per-drill toggle still works. Default: true */
  showNikkudDefault: boolean;
  /** Auto-speak the Hebrew prompt when a drill question loads. Default: false */
  audioAutoPlay: boolean;
};

const DEFAULT_PREFS: LearnPreferences = {
  showNikkudDefault: true,
  audioAutoPlay: false,
};

export function loadPreferences(): LearnPreferences {
  if (typeof window === "undefined") return { ...DEFAULT_PREFS };
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const p = JSON.parse(raw) as Partial<LearnPreferences>;
    return {
      showNikkudDefault:
        typeof p.showNikkudDefault === "boolean"
          ? p.showNikkudDefault
          : DEFAULT_PREFS.showNikkudDefault,
      audioAutoPlay:
        typeof p.audioAutoPlay === "boolean"
          ? p.audioAutoPlay
          : DEFAULT_PREFS.audioAutoPlay,
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePreferences(patch: Partial<LearnPreferences>): void {
  try {
    const current = loadPreferences();
    const next: LearnPreferences = { ...current, ...patch };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(PREFERENCES_EVENT));
    }
  } catch {
    /* storage quota */
  }
}
