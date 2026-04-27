/**
 * Optional second factor for sensitive server routes (dev session, OpenAI rabbi).
 * When OPERATOR_APPROVAL_CODE (≥ 32 chars) is set, users must POST /api/operator/unlock
 * after signing in. Sets an HttpOnly cookie bound to the Clerk userId; no client bundle
 * contains the approval code.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const OPERATOR_UNLOCK_COOKIE = "hebrew-op-unlock";

const TTL_SECONDS = 60 * 60 * 8; // 8h — re-enter code after that
const MIN_CODE_LEN = 32;

export type OperatorUnlockPayload = {
  uid: string;
  exp: number;
};

function hasCode(): string | null {
  const c = process.env.OPERATOR_APPROVAL_CODE?.trim();
  if (!c || c.length < MIN_CODE_LEN) return null;
  return c;
}

export function isOperatorGateEnabled(): boolean {
  return hasCode() != null;
}

export function signOperatorUnlock(userId: string, approvalCode: string): string {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload: OperatorUnlockPayload = { uid: userId, exp };
  const json = JSON.stringify(payload);
  const sig = createHmac("sha256", approvalCode)
    .update(json)
    .digest("base64url");
  const b64 = Buffer.from(json, "utf8").toString("base64url");
  return `${b64}.${sig}`;
}

export function verifyOperatorUnlock(
  token: string,
  userId: string,
  approvalCode: string,
): boolean {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let json: string;
  try {
    json = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const expected = createHmac("sha256", approvalCode)
    .update(json)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  let payload: OperatorUnlockPayload;
  try {
    payload = JSON.parse(json) as OperatorUnlockPayload;
  } catch {
    return false;
  }
  if (payload.uid !== userId) return false;
  if (typeof payload.exp !== "number") return false;
  if (payload.exp <= Math.floor(Date.now() / 1000)) return false;
  return true;
}

/**
 * Timings-safe compare for the one-time code entry (unlock request body).
 */
export function operatorCodesEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const OPERATOR_UNLOCK_MAX_AGE = TTL_SECONDS;

export function isOperatorUnlockedForUser(
  token: string | undefined,
  userId: string,
): boolean {
  const code = process.env.OPERATOR_APPROVAL_CODE?.trim();
  if (!code || code.length < MIN_CODE_LEN || !token) return false;
  return verifyOperatorUnlock(token, userId, code);
}

export { MIN_CODE_LEN as MIN_OPERATOR_CODE_LEN };
