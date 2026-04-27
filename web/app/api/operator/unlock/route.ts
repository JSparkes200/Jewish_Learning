import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  isOperatorGateEnabled,
  MIN_OPERATOR_CODE_LEN,
  OPERATOR_UNLOCK_COOKIE,
  OPERATOR_UNLOCK_MAX_AGE,
  operatorCodesEqual,
  signOperatorUnlock,
} from "@/lib/operator-unlock-cookie";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";

type Body = { code?: string };

/**
 * POST /api/operator/unlock
 * Body: { code: string } — must match server OPERATOR_APPROVAL_CODE.
 * Sets an HttpOnly cookie for this Clerk user; required when the gate is enabled.
 */
export async function POST(req: Request) {
  const limited = await rateLimitIfExceeded(req, "auth");
  if (limited) return limited;

  if (!isOperatorGateEnabled()) {
    return NextResponse.json(
      { error: "Operator approval is not configured on this server." },
      { status: 404 },
    );
  }

  const expected = process.env.OPERATOR_APPROVAL_CODE?.trim();
  if (!expected || expected.length < MIN_OPERATOR_CODE_LEN) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 503 },
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code : "";
  if (!operatorCodesEqual(code, expected)) {
    return NextResponse.json({ error: "Invalid approval code" }, { status: 403 });
  }

  const token = signOperatorUnlock(userId, expected);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(OPERATOR_UNLOCK_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: OPERATOR_UNLOCK_MAX_AGE,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
