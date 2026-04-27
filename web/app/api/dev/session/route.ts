import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  DEV_SESSION_COOKIE,
  getDevSessionConfig,
  matchesClerkSession,
  verifyDevSessionToken,
} from "@/lib/dev-session-server";
import { isOperatorGateEnabled, isOperatorUnlockedForUser, OPERATOR_UNLOCK_COOKIE } from "@/lib/operator-unlock-cookie";

/**
 * GET — reports whether the current Clerk session holds a valid dev-session cookie.
 * Never discloses the allowlist (returns `configured: false` whether the server
 * isn't set up or the calling user isn't allowed).
 */
export async function GET() {
  const cfg = getDevSessionConfig();
  const { userId, sessionId } = await auth();

  // Only callers with a Clerk session can see whether dev auth is configured,
  // and even then only if they're an allowed user. Everyone else sees the
  // same response shape as "not configured" to avoid enumeration.
  const allowedCaller =
    cfg != null &&
    userId != null &&
    cfg.allowedUserIds.includes(userId);

  if (!allowedCaller || !cfg || !sessionId) {
    const res = NextResponse.json({ authenticated: false, configured: false });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const store = await cookies();
  const opRaw = store.get(OPERATOR_UNLOCK_COOKIE)?.value;
  const operatorGate = isOperatorGateEnabled();
  const operatorUnlocked = operatorGate
    ? isOperatorUnlockedForUser(opRaw, userId)
    : true;

  const raw = store.get(DEV_SESSION_COOKIE)?.value;
  if (!raw) {
    const res = NextResponse.json({
      authenticated: false,
      configured: true,
      operatorGate,
      operatorUnlocked,
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const payload = verifyDevSessionToken(raw, cfg.secret);
  const authenticated =
    payload != null && matchesClerkSession(payload, { userId, sessionId });

  const res = NextResponse.json({
    authenticated,
    configured: true,
    operatorGate,
    operatorUnlocked,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
