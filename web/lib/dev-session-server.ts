/**
 * Server-only: signed dev-session cookie (HMAC-SHA256).
 * Pair with env DEVELOPER_USERNAME, DEVELOPER_EMAIL, DEVELOPER_SESSION_SECRET.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const DEV_SESSION_COOKIE = "hebrew-dev-session";

export type DevSessionPayload = {
  u: string;
  e: string;
  exp: number;
};

export function signDevSession(
  username: string,
  email: string,
  secret: string,
): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  const payload: DevSessionPayload = {
    u: username.trim().toLowerCase(),
    e: email.trim().toLowerCase(),
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
    typeof payload.u !== "string" ||
    typeof payload.e !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }
  if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function devCredentialsConfigured(): boolean {
  const u = process.env.DEVELOPER_USERNAME?.trim();
  const e = process.env.DEVELOPER_EMAIL?.trim();
  const s = process.env.DEVELOPER_SESSION_SECRET?.trim();
  return !!u && !!e && !!s && s.length >= 24;
}

export function getExpectedDeveloperCredentials(): {
  username: string;
  email: string;
  secret: string;
} | null {
  const username = process.env.DEVELOPER_USERNAME?.trim().toLowerCase();
  const email = process.env.DEVELOPER_EMAIL?.trim().toLowerCase();
  const secret = process.env.DEVELOPER_SESSION_SECRET?.trim();
  if (!username || !email || !secret || secret.length < 24) return null;
  return { username, email, secret };
}

export function matchesDeveloperCredentials(
  payload: DevSessionPayload,
): boolean {
  const c = getExpectedDeveloperCredentials();
  if (!c) return false;
  return payload.u === c.username && payload.e === c.email;
}
