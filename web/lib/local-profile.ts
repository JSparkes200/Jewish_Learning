/** Optional display name for solo / local use (no server auth). */
export const LOCAL_PROFILE_KEY = "hebrew-web-local-profile";
export const LOCAL_PROFILE_EVENT = "hebrew-web-local-profile-changed";

export type LocalProfile = {
  displayName?: string;
};

const defaultProfile: LocalProfile = {};

export function loadLocalProfile(): LocalProfile {
  if (typeof window === "undefined") return { ...defaultProfile };
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (!raw) return { ...defaultProfile };
    const p = JSON.parse(raw) as Partial<LocalProfile>;
    return {
      displayName:
        typeof p.displayName === "string" && p.displayName.trim()
          ? p.displayName.trim().slice(0, 48)
          : undefined,
    };
  } catch {
    return { ...defaultProfile };
  }
}

export function saveLocalProfile(profile: LocalProfile): void {
  try {
    const next: LocalProfile = {
      displayName: profile.displayName?.trim().slice(0, 48) || undefined,
    };
    if (next.displayName) {
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(LOCAL_PROFILE_KEY);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(LOCAL_PROFILE_EVENT));
    }
  } catch {
    /* quota */
  }
}
