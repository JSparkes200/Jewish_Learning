import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import {
  DEV_SESSION_COOKIE,
  getDevSessionConfig,
  signDevSession,
} from "@/lib/dev-session-server";
import { requireOperatorUnlocked } from "@/lib/require-operator-unlock";

/**
 * POST /api/dev/auth
 *
 * Requires:
 *   1. A signed-in Clerk session.
 *   2. That Clerk user's id to be in the DEVELOPER_CLERK_USER_IDS allowlist.
 *
 * No username/email/body is accepted — the *only* credential is the Clerk
 * session, which Clerk already verified (MFA, CAPTCHA, breached-password etc).
 * This route simply issues a short-lived (24h) bonus cookie bound to the
 * current Clerk {userId, sessionId} that unlocks developer-only UI/routes.
 *
 * Returns 404 when dev auth is not configured, to avoid advertising the endpoint.
 */
export async function POST(req: Request) {
  const limited = await rateLimitIfExceeded(req, "auth");
  if (limited) return limited;

  const cfg = getDevSessionConfig();
  if (!cfg) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { userId, sessionId } = await auth();
  if (!userId || !sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!cfg.allowedUserIds.includes(userId)) {
    // Uniform error — never leak whether the userId was the issue.
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const operatorBlock = await requireOperatorUnlocked(userId);
  if (operatorBlock) return operatorBlock;

  const token = signDevSession(userId, sessionId, cfg.secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEV_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24h — matches payload TTL; no silent renewal.
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
