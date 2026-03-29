/** localStorage key for anonymous cloud sync (Bearer token). Not an account. */
export const CLOUD_SYNC_TOKEN_KEY = "hebrew-web-cloud-sync-v1";

export function getCloudSyncToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(CLOUD_SYNC_TOKEN_KEY);
  } catch {
    return null;
  }
}

/** UUID v4; persisted on first use. */
export function getOrCreateCloudSyncToken(): string {
  if (typeof window === "undefined") return "";
  let t = getCloudSyncToken();
  if (!t || t.length < 16) {
    t = crypto.randomUUID();
    try {
      localStorage.setItem(CLOUD_SYNC_TOKEN_KEY, t);
    } catch {
      return t;
    }
  }
  return t;
}

export function regenerateCloudSyncToken(): string {
  const t = crypto.randomUUID();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CLOUD_SYNC_TOKEN_KEY, t);
    } catch {
      /* ignore */
    }
  }
  return t;
}
