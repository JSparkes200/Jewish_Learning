/**
 * Local trial session (e.g. readiness reward: 72h Rabbi + one advanced badge).
 * Server auth/subscription will replace or gate this later.
 *
 * `badgeId` should be a specialty **track** id (`news`, `literature`, `spoken`,
 * `talmudic`, `aramaic`) — see `TRIAL_ADVANCED_BADGE_TRACK_IDS` in
 * `data/specialty-tracks.ts` — not a tier key like `news:gold`.
 */

export const TRIAL_SESSION_STORAGE_KEY = "hebrew_trial_session_v1";
export const TRIAL_SESSION_EVENT = "hebrew-trial-session";

/** Default trial length from product spec (72 hours). */
export const TRIAL_DURATION_MS = 72 * 60 * 60 * 1000;

export type TrialSession = {
  startedAt: number;
  endsAt: number;
  /** Set when the user locks in one advanced badge for this trial. */
  badgeId?: string | null;
};

function dispatchTrialEvent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TRIAL_SESSION_EVENT));
}

export function loadTrialSession(): TrialSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TRIAL_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TrialSession;
    if (
      typeof parsed?.endsAt !== "number" ||
      typeof parsed?.startedAt !== "number"
    ) {
      return null;
    }
    if (parsed.endsAt <= Date.now()) {
      localStorage.removeItem(TRIAL_SESSION_STORAGE_KEY);
      dispatchTrialEvent();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function persist(session: TrialSession | null) {
  if (typeof window === "undefined") return;
  try {
    if (session == null) {
      localStorage.removeItem(TRIAL_SESSION_STORAGE_KEY);
    } else {
      localStorage.setItem(TRIAL_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    /* ignore */
  }
  dispatchTrialEvent();
}

/** Starts (or restarts) a trial from now; optional badge id if already chosen. */
export function startTrialSession(
  durationMs: number = TRIAL_DURATION_MS,
  badgeId?: string | null,
): TrialSession {
  const now = Date.now();
  const session: TrialSession = {
    startedAt: now,
    endsAt: now + durationMs,
    badgeId: badgeId ?? undefined,
  };
  persist(session);
  return session;
}

export function clearTrialSession() {
  persist(null);
}

export function setTrialBadgeId(badgeId: string) {
  const cur = loadTrialSession();
  if (!cur) return;
  persist({ ...cur, badgeId });
}

export function getTrialRemainingMs(session: TrialSession | null): number {
  if (!session) return 0;
  return Math.max(0, session.endsAt - Date.now());
}

export function isTrialActive(session: TrialSession | null): boolean {
  return getTrialRemainingMs(session) > 0;
}

/** Compact countdown for the header bar, e.g. `2d 05:12:08` or `05:12:08`. */
export function formatTrialCountdown(remainingMs: number): string {
  const s = Math.floor(remainingMs / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (d > 0) {
    return `${d}d ${pad(h)}:${pad(m)}:${pad(sec)}`;
  }
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}
