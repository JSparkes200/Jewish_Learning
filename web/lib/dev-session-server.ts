/**
 * Server-only: signed dev-session cookie (HMAC-SHA256) bound to a Clerk userId.
 *
 * Required env vars (all must be set for dev auth to function at all):
 * - DEVELOPER_CLERK_USER_IDS : comma-separated Clerk user IDs allowed to obtain
 *   a dev session. Enumerate from the Clerk dashboard; do NOT expose.
 * - DEVELOPER_SESSION_SECRET : ≥ 32 random chars (HMAC secret).
 *
 * The session cookie is bound to {userId, sessionId, exp} so a leaked cookie
 * is useless once the Clerk session is revoked, and cookies cannot be moved
 * between users. Short-lived (24h) with no silent renewal.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const DEV_SESSION_COOKIE = "hebrew-dev-session";

/** 24h — short-lived by design. Re-auth required thereafter. */
const DEV_SESSION_TTL_SECONDS = 60 * 60 * 24;

/** Min length for the HMAC secret. Existing docs said 24; raise to 32 (≥256 bits entropy when random-hex). */
const MIN_SECRET_LEN = 32;

export type DevSessionPayload = {
  /** Clerk userId bound to this session */
  uid: string;
  /** Clerk sessionId at issuance — rejected if user has signed out */
  sid: string;
  /** UNIX seconds */
  exp: number;
};

export function signDevSession(
  userId: string,
  sessionId: string,
  secret: string,
): string {
  const exp = Math.floor(Date.now() / 1000) + DEV_SESSION_TTL_SECONDS;
  const payload: DevSessionPayload = {
    uid: userId,
    sid: sessionId,
    exp,
  };
  const json = JSON.stringify(payload);
  const sig = createHmac("sha256", secret).update(json).digest("base64url");
  const b64 = Buffer.from(json, "utf8").toString("base64url");
  return `${b64}.${sig}`;
}

export function verifyDevSessionToken(
  token: string,
  secret: string,
): DevSessionPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let json: string;
  try {
    json = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = createHmac("sha256", secret).update(json).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  let payload: DevSessionPayload;
  try {
    payload = JSON.parse(json) as DevSessionPayload;
  } catch {
    return null;
  }
  if (
    typeof payload.uid !== "string" ||
    typeof payload.sid !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }
  if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
  return payload;
}

/** Parsed comma-separated Clerk user-id allowlist. Empty array ⇒ dev auth disabled. */
export function getAllowedDeveloperUserIds(): readonly string[] {
  const raw = process.env.DEVELOPER_CLERK_USER_IDS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function devCredentialsConfigured(): boolean {
  const s = process.env.DEVELOPER_SESSION_SECRET?.trim();
  return getAllowedDeveloperUserIds().length > 0 && !!s && s.length >= MIN_SECRET_LEN;
}

export function getDevSessionConfig(): {
  allowedUserIds: readonly string[];
  secret: string;
} | null {
  const secret = process.env.DEVELOPER_SESSION_SECRET?.trim();
  const allowedUserIds = getAllowedDeveloperUserIds();
  if (!secret || secret.length < MIN_SECRET_LEN || allowedUserIds.length === 0) {
    return null;
  }
  return { allowedUserIds, secret };
}

export function isUserIdAllowed(userId: string): boolean {
  const cfg = getDevSessionConfig();
  if (!cfg) return false;
  return cfg.allowedUserIds.includes(userId);
}

/**
 * Payload is valid AND bound to the currently signed-in Clerk session.
 * A stolen cookie used with a different Clerk sessionId (or after Clerk sign-out)
 * will fail.
 */
export function matchesClerkSession(
  payload: DevSessionPayload,
  current: { userId: string | null; sessionId: string | null },
): boolean {
  if (!current.userId || !current.sessionId) return false;
  if (!isUserIdAllowed(current.userId)) return false;
  return payload.uid === current.userId && payload.sid === current.sessionId;
}
